import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  BookOpen,
  Bot,
  Check,
  ChevronUp,
  Copy,
  FileText,
  Infinity as InfinityIcon,
  Loader2,
  Navigation,
  PrinterIcon,
  RotateCcw,
  Search,
  Upload,
  X,
  Zap,
} from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { useSaveCheck } from "../hooks/useQueries";
import {
  type AIDetectionResult,
  type AISegment,
  detectAI,
} from "../utils/aiDetector";
import { ACCEPTED_FILE_TYPES, extractTextFromFile } from "../utils/fileParser";
import {
  type FrontendCheckResult,
  analyzeText,
} from "../utils/plagiarismDetector";
import { AnnotatedText } from "./AnnotatedText";
import { ReportModal } from "./ReportModal";
import { ScoreGauge } from "./ScoreGauge";

// ─── Types ────────────────────────────────────────────────────────────────────

type DetectionMode = "plagiarism" | "ai" | "both";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function countWords(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

// ─── Heuristic Bar ────────────────────────────────────────────────────────────

interface HeuristicBarProps {
  label: string;
  score: number;
}

function HeuristicBar({ label, score }: HeuristicBarProps) {
  const pct = Math.round(score * 100);
  const color =
    pct >= 65
      ? "oklch(0.55 0.22 300)"
      : pct >= 30
        ? "oklch(0.68 0.16 300)"
        : "oklch(0.55 0.18 145)";

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="font-display text-xs text-muted-foreground">
          {label}
        </span>
        <span className="font-display text-xs font-semibold" style={{ color }}>
          {pct}%
        </span>
      </div>
      <div
        className="w-full rounded-full h-1.5"
        style={{ backgroundColor: "oklch(0.92 0.01 240)" }}
      >
        <div
          className="h-1.5 rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

// ─── Copy Button ──────────────────────────────────────────────────────────────

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded border transition-all duration-150 shrink-0"
      style={{
        borderColor: "oklch(0.88 0.015 240)",
        backgroundColor: copied
          ? "oklch(0.92 0.08 145 / 0.2)"
          : "oklch(0.96 0.01 240)",
        color: copied ? "oklch(0.42 0.14 145)" : "oklch(0.42 0.04 240)",
      }}
      title="Copy to clipboard"
      aria-label={label}
    >
      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
      <span>{copied ? "Copied!" : "Copy"}</span>
    </button>
  );
}

// ─── AI Segment Panel ─────────────────────────────────────────────────────────

interface AISegmentPanelProps {
  segment: AISegment;
  onClose: () => void;
}

function AISegmentPanel({ segment, onClose }: AISegmentPanelProps) {
  const pct = Math.round(segment.score * 100);

  return (
    <div
      className="mt-3 mb-4 rounded-xl border p-4 animate-scale-in"
      style={{
        backgroundColor: "oklch(0.97 0.03 300)",
        borderColor: "oklch(0.72 0.14 300 / 0.4)",
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className="text-xs font-display font-bold px-2.5 py-1 rounded-full"
            style={{ backgroundColor: "oklch(0.55 0.22 300)", color: "white" }}
          >
            {pct}% AI probability
          </span>
          <span className="text-xs font-display text-muted-foreground">
            AI-like patterns detected
          </span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors p-0.5 rounded"
            aria-label="Close panel"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Flagged sentence */}
      <div
        className="mb-4 p-3 rounded-lg border"
        style={{
          backgroundColor: "oklch(1 0 0 / 0.6)",
          borderColor: "oklch(0.72 0.14 300 / 0.25)",
        }}
      >
        <p className="text-xs font-display font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
          Flagged sentence
        </p>
        <p className="text-sm font-serif leading-relaxed text-foreground">
          {segment.text}
        </p>
      </div>

      {/* Triggered patterns */}
      {segment.triggeredPatterns.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-display font-semibold uppercase tracking-wide text-muted-foreground mb-2">
            Why it was flagged
          </p>
          <ul className="space-y-1">
            {segment.triggeredPatterns.map((p) => (
              <li
                key={p}
                className="text-xs font-display flex items-start gap-1.5"
                style={{ color: "oklch(0.4 0.18 300)" }}
              >
                <span className="mt-0.5 shrink-0">›</span>
                {p}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Note */}
      <div
        className="p-3 rounded-lg text-xs font-display"
        style={{
          backgroundColor: "oklch(0.93 0.06 300 / 0.4)",
          color: "oklch(0.38 0.16 300)",
          borderLeft: "3px solid oklch(0.55 0.22 300 / 0.5)",
        }}
      >
        <strong>Note:</strong> This sentence shows patterns common in
        AI-generated text. Consider rewriting it in your own voice to make it
        sound more natural.
      </div>

      {/* Copy original for reference */}
      <div className="mt-3 flex justify-end">
        <CopyButton text={segment.text} label="Copy flagged sentence" />
      </div>
    </div>
  );
}

// ─── AI Annotated Text ────────────────────────────────────────────────────────

interface AIAnnotatedTextProps {
  segments: AISegment[];
  activeIdx?: number | null;
  onSegmentClick?: (idx: number | null) => void;
  segmentBtnRefs?: React.MutableRefObject<Map<number, HTMLButtonElement>>;
}

function AIAnnotatedText({
  segments,
  activeIdx: externalActiveIdx,
  onSegmentClick,
  segmentBtnRefs,
}: AIAnnotatedTextProps) {
  const [internalActiveIdx, setInternalActiveIdx] = useState<number | null>(
    null,
  );
  const activeIdx =
    externalActiveIdx !== undefined ? externalActiveIdx : internalActiveIdx;
  const setActiveIdx = onSegmentClick ?? setInternalActiveIdx;

  return (
    <div className="font-serif text-base leading-relaxed text-foreground">
      {segments.map((segment, idx) => {
        const segKey = `ai-seg-${segment.charOffset ?? idx}-${segment.text.slice(0, 12)}`;
        if (!segment.flagged) {
          return <span key={segKey}>{segment.text} </span>;
        }
        const isActive = activeIdx === idx;
        return (
          <span key={segKey} className="inline">
            <button
              type="button"
              ref={(el) => {
                if (segmentBtnRefs) {
                  if (el) {
                    segmentBtnRefs.current.set(idx, el);
                  } else {
                    segmentBtnRefs.current.delete(idx);
                  }
                }
              }}
              data-seg-idx={idx}
              className={`segment-ai ${isActive ? "active" : ""} text-left`}
              onClick={() => {
                const nowActive = activeIdx === idx;
                setActiveIdx(nowActive ? null : idx);
              }}
              title={`AI probability: ${Math.round(segment.score * 100)}% — click for details`}
              style={{
                fontFamily: "Lora, ui-serif, Georgia, serif",
                fontSize: "inherit",
                lineHeight: "inherit",
              }}
            >
              {segment.text}
            </button>{" "}
            {isActive && (
              <span className="block">
                <AISegmentPanel
                  segment={segment}
                  onClose={() => setActiveIdx(null)}
                />
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
}

// ─── AI Flagged Segments Navigation List ─────────────────────────────────────

interface AIFlaggedSegmentsListProps {
  segments: AISegment[];
  onJumpToSegment: (idx: number) => void;
}

function AIFlaggedSegmentsList({
  segments,
  onJumpToSegment,
}: AIFlaggedSegmentsListProps) {
  const flagged = segments
    .map((seg, idx) => ({ seg, idx }))
    .filter(({ seg }) => seg.flagged);

  if (flagged.length === 0) return null;

  return (
    <div
      className="rounded-xl border p-4 animate-fade-slide-up"
      style={{
        backgroundColor: "oklch(0.97 0.03 300)",
        borderColor: "oklch(0.72 0.14 300 / 0.4)",
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <Navigation
          className="w-4 h-4 shrink-0"
          style={{ color: "oklch(0.45 0.2 300)" }}
        />
        <h3
          className="font-display font-semibold text-sm"
          style={{ color: "oklch(0.3 0.18 300)" }}
        >
          AI-Detected Sentences ({flagged.length} found)
        </h3>
        <span
          className="ml-auto text-xs font-display"
          style={{ color: "oklch(0.5 0.14 300)" }}
        >
          Click Jump to locate each one ↓
        </span>
      </div>

      {/* List */}
      <ol className="space-y-2">
        {flagged.map(({ seg, idx }, listIdx) => {
          const pct = Math.round(seg.score * 100);
          const preview =
            seg.text.length > 80 ? `${seg.text.slice(0, 77)}…` : seg.text;
          return (
            <li
              key={`flaglist-${idx}`}
              className="flex items-start gap-3 rounded-lg px-3 py-2.5"
              style={{
                backgroundColor: "oklch(1 0 0 / 0.6)",
                border: "1px solid oklch(0.72 0.14 300 / 0.2)",
              }}
            >
              {/* Number badge */}
              <span
                className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-display font-bold mt-0.5"
                style={{
                  backgroundColor: "oklch(0.55 0.22 300)",
                  color: "white",
                }}
              >
                {listIdx + 1}
              </span>

              {/* Text preview + score */}
              <div className="flex-1 min-w-0">
                <p
                  className="font-serif text-sm leading-snug text-foreground truncate"
                  title={seg.text}
                >
                  {preview}
                </p>
                <p
                  className="font-display text-xs mt-0.5"
                  style={{ color: "oklch(0.5 0.14 300)" }}
                >
                  {pct}% AI probability
                  {seg.triggeredPatterns.length > 0 && (
                    <>
                      {" "}
                      ·{" "}
                      {seg.triggeredPatterns[0]
                        .replace(/^AI phrase: /, "")
                        .replace(/"/g, "")}
                    </>
                  )}
                </p>
              </div>

              {/* Jump button */}
              <button
                type="button"
                onClick={() => onJumpToSegment(idx)}
                className="shrink-0 inline-flex items-center gap-1 text-xs font-display font-semibold px-3 py-1.5 rounded-lg transition-all duration-150 hover:shadow-sm"
                style={{
                  backgroundColor: "oklch(0.55 0.22 300)",
                  color: "white",
                  boxShadow: "0 1px 6px oklch(0.55 0.22 300 / 0.3)",
                }}
                title="Scroll to this segment in the annotated view"
              >
                Jump ↓
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

// ─── AI Results Panel ─────────────────────────────────────────────────────────

interface AIResultsPanelProps {
  aiResult: AIDetectionResult;
}

function AIResultsPanel({ aiResult }: AIResultsPanelProps) {
  const pct = Math.round(aiResult.overallScore * 100);
  const scoreColor =
    aiResult.label === "Likely Human"
      ? "oklch(0.55 0.18 145)"
      : aiResult.label === "Mixed/Uncertain"
        ? "oklch(0.72 0.14 72)"
        : "oklch(0.55 0.22 300)";
  const flaggedCount = aiResult.segments.filter((s) => s.flagged).length;

  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const segmentBtnRefs = useRef<Map<number, HTMLButtonElement>>(new Map());
  const annotatedContainerRef = useRef<HTMLDivElement | null>(null);

  const handleJumpToSegment = useCallback((segIdx: number) => {
    setActiveIdx(segIdx);

    const btn = segmentBtnRefs.current.get(segIdx);
    if (btn) {
      btn.scrollIntoView({ behavior: "smooth", block: "center" });
      btn.classList.add("segment-ai-pulse");
      setTimeout(() => btn.classList.remove("segment-ai-pulse"), 1400);
    }
  }, []);

  return (
    <div className="space-y-6 animate-fade-slide-up">
      {/* Score summary card */}
      <div
        className="rounded-2xl border p-6 sm:p-8"
        style={{
          backgroundColor: "oklch(1 0 0)",
          borderColor: "oklch(0.88 0.015 240)",
          boxShadow: "0 4px 24px oklch(0.18 0.04 255 / 0.06)",
        }}
      >
        <div className="flex items-center gap-2 mb-5">
          <Bot className="w-5 h-5" style={{ color: "oklch(0.55 0.22 300)" }} />
          <h2
            className="font-display font-bold text-base"
            style={{ color: "oklch(0.2 0.075 255)" }}
          >
            AI Detection Results
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-8">
          {/* Big score circle */}
          <div className="shrink-0 flex flex-col items-center">
            <div
              className="w-32 h-32 rounded-full border-4 flex flex-col items-center justify-center"
              style={{
                borderColor: scoreColor,
                boxShadow: `0 0 0 8px ${
                  aiResult.label === "Likely Human"
                    ? "oklch(0.55 0.18 145 / 0.1)"
                    : aiResult.label === "Mixed/Uncertain"
                      ? "oklch(0.72 0.14 72 / 0.1)"
                      : "oklch(0.55 0.22 300 / 0.1)"
                }`,
              }}
            >
              <span
                className="font-display font-extrabold text-3xl leading-none"
                style={{ color: scoreColor }}
              >
                {pct}%
              </span>
              <span className="font-display text-xs text-muted-foreground mt-0.5">
                AI Score
              </span>
            </div>
          </div>

          {/* Label + stats */}
          <div className="flex-1 text-center sm:text-left">
            <div
              className="inline-block font-display font-bold text-lg px-4 py-1.5 rounded-full mb-3"
              style={{
                backgroundColor:
                  aiResult.label === "Likely Human"
                    ? "oklch(0.92 0.08 145 / 0.2)"
                    : aiResult.label === "Mixed/Uncertain"
                      ? "oklch(0.92 0.09 72 / 0.2)"
                      : "oklch(0.93 0.06 300 / 0.3)",
                color: scoreColor,
                border: `1.5px solid ${scoreColor}`,
              }}
            >
              {aiResult.label}
            </div>
            <p className="font-display text-sm text-muted-foreground mb-4">
              {aiResult.label === "Likely Human"
                ? "The text shows predominantly human writing patterns."
                : aiResult.label === "Mixed/Uncertain"
                  ? "Some AI-like patterns detected. Review highlighted segments below."
                  : "Strong AI writing indicators detected across multiple heuristics."}
            </p>

            <div className="flex flex-wrap justify-center sm:justify-start gap-4">
              <div className="text-center">
                <div
                  className="font-display font-bold text-2xl"
                  style={{ color: "oklch(0.55 0.22 300)" }}
                >
                  {flaggedCount}
                </div>
                <div className="font-display text-xs text-muted-foreground">
                  Flagged Segments
                </div>
              </div>
              <div className="w-px bg-border hidden sm:block" />
              <div className="text-center">
                <div
                  className="font-display font-bold text-2xl"
                  style={{ color: "oklch(0.28 0.08 255)" }}
                >
                  {aiResult.segments.length}
                </div>
                <div className="font-display text-xs text-muted-foreground">
                  Total Segments
                </div>
              </div>
            </div>
          </div>

          {/* Heuristic breakdown */}
          <div className="w-full sm:w-52 space-y-3 shrink-0">
            <p className="font-display text-xs font-semibold uppercase tracking-wide text-muted-foreground text-center sm:text-left">
              Heuristic Breakdown
            </p>
            <HeuristicBar
              label="Phrase Patterns"
              score={aiResult.heuristicBreakdown.phraseScore}
            />
            <HeuristicBar
              label="Burstiness"
              score={aiResult.heuristicBreakdown.burstiessScore}
            />
            <HeuristicBar
              label="Transitions"
              score={aiResult.heuristicBreakdown.transitionScore}
            />
            <HeuristicBar
              label="Lexical Complexity"
              score={aiResult.heuristicBreakdown.lexicalScore}
            />
            <HeuristicBar
              label="Hedging Language"
              score={aiResult.heuristicBreakdown.hedgingScore}
            />
          </div>
        </div>
      </div>

      {/* Flagged segments navigation list */}
      {flaggedCount > 0 && (
        <AIFlaggedSegmentsList
          segments={aiResult.segments}
          onJumpToSegment={handleJumpToSegment}
        />
      )}

      {/* AI annotated text — always show when there are segments */}
      {aiResult.segments.length > 0 && (
        <div
          ref={annotatedContainerRef}
          className="rounded-2xl border flex flex-col"
          style={{
            backgroundColor: "oklch(1 0 0)",
            borderColor: "oklch(0.88 0.015 240)",
            boxShadow: "0 4px 24px oklch(0.18 0.04 255 / 0.06)",
          }}
        >
          <div
            className="px-6 py-4 border-b flex items-center justify-between"
            style={{ borderColor: "oklch(0.92 0.01 240)" }}
          >
            <div>
              <h3
                className="font-display font-semibold text-base"
                style={{ color: "oklch(0.2 0.075 255)" }}
              >
                AI-Flagged Segments — Annotated View
              </h3>
              <p className="font-display text-xs text-muted-foreground mt-0.5">
                Click a{" "}
                <span
                  className="font-semibold"
                  style={{ color: "oklch(0.55 0.22 300)" }}
                >
                  violet highlight
                </span>{" "}
                to see why it was flagged &amp; jump to the original text
              </p>
            </div>
            {flaggedCount > 0 && (
              <div
                className="text-xs font-display px-2 py-1 rounded-md"
                style={{
                  backgroundColor: "oklch(0.93 0.06 300 / 0.25)",
                  color: "oklch(0.4 0.2 300)",
                }}
              >
                {flaggedCount} flagged
              </div>
            )}
          </div>
          <div className="p-6">
            <AIAnnotatedText
              segments={aiResult.segments}
              activeIdx={activeIdx}
              onSegmentClick={setActiveIdx}
              segmentBtnRefs={segmentBtnRefs}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Mode Selector ────────────────────────────────────────────────────────────

interface ModeSelectorProps {
  mode: DetectionMode;
  onChange: (m: DetectionMode) => void;
}

function ModeSelector({ mode, onChange }: ModeSelectorProps) {
  const modes: {
    value: DetectionMode;
    label: string;
    icon: React.ReactNode;
  }[] = [
    {
      value: "plagiarism",
      label: "Plagiarism Check",
      icon: <Search className="w-3.5 h-3.5" />,
    },
    {
      value: "ai",
      label: "AI Detection",
      icon: <Bot className="w-3.5 h-3.5" />,
    },
    {
      value: "both",
      label: "Check Both",
      icon: <Zap className="w-3.5 h-3.5" />,
    },
  ];

  return (
    <div
      className="flex rounded-xl p-1 gap-1 mb-5"
      style={{
        backgroundColor: "oklch(0.94 0.01 240)",
        border: "1.5px solid oklch(0.88 0.015 240)",
      }}
      role="tablist"
      aria-label="Detection mode"
    >
      {modes.map(({ value, label, icon }) => {
        const isActive = mode === value;
        return (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(value)}
            className="flex-1 flex items-center justify-center gap-1.5 text-xs sm:text-sm font-display font-medium px-3 py-2 rounded-lg transition-all duration-200"
            style={
              isActive
                ? {
                    backgroundColor: "oklch(1 0 0)",
                    color:
                      value === "plagiarism"
                        ? "oklch(0.28 0.08 255)"
                        : value === "ai"
                          ? "oklch(0.45 0.2 300)"
                          : "oklch(0.38 0.12 255)",
                    boxShadow: "0 1px 4px oklch(0.18 0.04 255 / 0.1)",
                  }
                : {
                    backgroundColor: "transparent",
                    color: "oklch(0.52 0.03 240)",
                  }
            }
          >
            {icon}
            <span className="hidden sm:inline">{label}</span>
            <span className="sm:hidden">
              {value === "plagiarism"
                ? "Plagiarism"
                : value === "ai"
                  ? "AI"
                  : "Both"}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ─── File Upload Button ───────────────────────────────────────────────────────

interface FileUploadButtonProps {
  onTextExtracted: (text: string, filename: string) => void;
  disabled?: boolean;
}

function FileUploadButton({
  onTextExtracted,
  disabled,
}: FileUploadButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setUploadError(null);

    try {
      const text = await extractTextFromFile(file);
      if (!text.trim()) {
        setUploadError(
          "No text could be extracted from this file. Try a different format.",
        );
        setIsLoading(false);
        return;
      }
      setUploadedFile(file.name);
      onTextExtracted(text, file.name);
    } catch (err) {
      console.error("File parse error:", err);
      setUploadError(
        err instanceof Error
          ? err.message
          : "Failed to read file. Please try a different format.",
      );
    } finally {
      setIsLoading(false);
      // Reset input so the same file can be re-uploaded
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleClearFile = () => {
    setUploadedFile(null);
    setUploadError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_FILE_TYPES}
          onChange={handleFileChange}
          className="sr-only"
          id="file-upload"
          disabled={disabled || isLoading}
        />
        <label
          htmlFor="file-upload"
          className={`inline-flex items-center gap-1.5 text-xs font-display font-medium px-3 py-1.5 rounded-lg border cursor-pointer transition-all duration-150 ${
            disabled || isLoading
              ? "opacity-50 cursor-not-allowed"
              : "hover:shadow-sm"
          }`}
          style={{
            borderColor: "oklch(0.88 0.015 240)",
            backgroundColor: "oklch(0.96 0.01 240)",
            color: "oklch(0.35 0.07 255)",
          }}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Reading file…</span>
            </>
          ) : (
            <>
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Document</span>
            </>
          )}
        </label>

        {uploadedFile && (
          <div
            className="flex items-center gap-1.5 text-xs font-display px-2 py-1 rounded-lg max-w-xs truncate"
            style={{
              backgroundColor: "oklch(0.94 0.06 145 / 0.25)",
              color: "oklch(0.35 0.14 145)",
              border: "1px solid oklch(0.72 0.1 145 / 0.3)",
            }}
          >
            <FileText className="w-3 h-3 shrink-0" />
            <span className="truncate">{uploadedFile}</span>
            <button
              type="button"
              onClick={handleClearFile}
              className="shrink-0 hover:opacity-70 transition-opacity"
              aria-label="Clear uploaded file"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {uploadError && (
        <p
          className="text-xs font-display"
          style={{ color: "oklch(0.55 0.22 25)" }}
        >
          ⚠ {uploadError}
        </p>
      )}

      <p className="text-xs font-display text-muted-foreground">
        Supports .txt, .pdf, .doc, .docx, .odt, .rtf — any size
      </p>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function CheckerPage() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<FrontendCheckResult | null>(null);
  const [aiResult, setAiResult] = useState<AIDetectionResult | null>(null);
  const [detectionMode, setDetectionMode] =
    useState<DetectionMode>("plagiarism");
  const [showReport, setShowReport] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const { mutate: saveCheck } = useSaveCheck();

  const wordCount = countWords(text);
  const charCount = text.length;

  const handleCheck = useCallback(() => {
    if (!text.trim()) return;
    setError(null);
    setIsAnalyzing(true);

    let frontendResult: FrontendCheckResult | null = null;
    let aiDetectionResult: AIDetectionResult | null = null;

    if (detectionMode === "plagiarism" || detectionMode === "both") {
      frontendResult = analyzeText(text);
      setResult(frontendResult);
    } else {
      setResult(null);
    }

    if (detectionMode === "ai" || detectionMode === "both") {
      aiDetectionResult = detectAI(text);
      setAiResult(aiDetectionResult);
    } else {
      setAiResult(null);
    }

    setIsAnalyzing(false);

    setTimeout(() => {
      resultsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);

    // Fire-and-forget: save to backend history
    const wc = BigInt(wordCount);
    const plagScore = frontendResult ? frontendResult.overallScore : 0;
    const aiScore = aiDetectionResult ? aiDetectionResult.overallScore : 0;
    saveCheck({
      text: text.slice(0, 2000), // truncate for storage
      plagiarismScore: plagScore,
      aiScore,
      mode: detectionMode,
      wordCount: wc,
    });
  }, [text, detectionMode, wordCount, saveCheck]);

  const handleClear = () => {
    setText("");
    setResult(null);
    setAiResult(null);
    setError(null);
    textareaRef.current?.focus();
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    const ta = e.target;
    ta.style.height = "auto";
    ta.style.height = `${Math.max(240, ta.scrollHeight)}px`;
  };

  const handleFileTextExtracted = (extractedText: string) => {
    setText(extractedText);
    // Auto-resize textarea
    setTimeout(() => {
      const ta = textareaRef.current;
      if (ta) {
        ta.style.height = "auto";
        ta.style.height = `${Math.max(240, ta.scrollHeight)}px`;
      }
    }, 50);
  };

  const hasResults = result !== null || aiResult !== null;

  const buttonLabel =
    detectionMode === "plagiarism"
      ? "Check Plagiarism"
      : detectionMode === "ai"
        ? "Detect AI Content"
        : "Check Both";

  return (
    <main className="flex-1">
      {/* Hero / input section */}
      <section
        className="relative overflow-hidden py-12 sm:py-16"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.97 0.015 255) 0%, oklch(0.99 0.005 240) 100%)",
        }}
      >
        {/* Decorative blobs */}
        <div
          className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-20 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, oklch(0.6 0.12 248) 0%, transparent 70%)",
            transform: "translate(30%, -30%)",
          }}
          aria-hidden="true"
        />
        <div
          className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-10 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, oklch(0.55 0.18 145) 0%, transparent 70%)",
            transform: "translate(-30%, 30%)",
          }}
          aria-hidden="true"
        />
        <div
          className="absolute top-1/2 right-1/4 w-48 h-48 rounded-full opacity-10 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, oklch(0.55 0.22 300) 0%, transparent 70%)",
            transform: "translate(50%, -50%)",
          }}
          aria-hidden="true"
        />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
          {/* Heading */}
          <div className="text-center mb-8 animate-fade-slide-up">
            <h1
              className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl leading-tight mb-3"
              style={{ color: "oklch(0.2 0.075 255)" }}
            >
              NHM Pro Free{" "}
              <span
                style={{
                  background:
                    "linear-gradient(90deg, oklch(0.45 0.16 255) 0%, oklch(0.55 0.18 248) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Plagiarism Checker
              </span>
            </h1>
            <p
              className="font-display text-base sm:text-lg"
              style={{ color: "oklch(0.45 0.04 240)" }}
            >
              Fast, Free &amp; Unlimited Plagiarism &amp; AI Detection for All
              Fields of Study
            </p>
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap justify-center gap-2 mb-6 animate-fade-slide-up stagger-2">
            {[
              { icon: Zap, text: "Instant Results" },
              { icon: InfinityIcon, text: "Unlimited Characters" },
              { icon: BookOpen, text: "All Study Fields" },
              { icon: FileText, text: "Free Reports" },
              { icon: Bot, text: "AI Detection" },
              { icon: Upload, text: "Document Upload" },
            ].map(({ icon: Icon, text: label }) => (
              <div
                key={label}
                className="inline-flex items-center gap-1.5 text-xs font-display font-medium px-3 py-1.5 rounded-full"
                style={{
                  backgroundColor: "oklch(1 0 0)",
                  border: "1.5px solid oklch(0.88 0.015 240)",
                  color:
                    label === "AI Detection"
                      ? "oklch(0.4 0.2 300)"
                      : label === "Document Upload"
                        ? "oklch(0.35 0.14 145)"
                        : "oklch(0.3 0.07 255)",
                  boxShadow: "0 1px 4px oklch(0.18 0.04 255 / 0.06)",
                }}
              >
                <Icon className="w-3 h-3" />
                {label}
              </div>
            ))}
          </div>

          {/* Input card */}
          <div
            className="rounded-2xl border shadow-card overflow-hidden animate-fade-slide-up stagger-3"
            style={{
              backgroundColor: "oklch(1 0 0)",
              borderColor: "oklch(0.88 0.015 240)",
            }}
          >
            <div className="p-4 sm:p-6">
              {/* Mode selector */}
              <ModeSelector mode={detectionMode} onChange={setDetectionMode} />

              {/* Textarea */}
              <textarea
                id="original-input"
                ref={textareaRef}
                value={text}
                onChange={handleTextareaChange}
                placeholder={
                  detectionMode === "plagiarism"
                    ? "Paste or type your text here — essays, research papers, dissertations, articles, and more. No character limit."
                    : detectionMode === "ai"
                      ? "Paste text to check for AI-generated content. Works on essays, reports, articles, and any written content."
                      : "Paste your text to run both plagiarism and AI detection simultaneously. No character limit."
                }
                className="w-full resize-none outline-none font-serif text-sm sm:text-base leading-relaxed placeholder:font-sans placeholder:text-muted-foreground bg-transparent rounded-lg transition-all duration-200"
                style={{
                  minHeight: "240px",
                  color: "oklch(0.18 0.04 255)",
                }}
                disabled={isAnalyzing}
              />
            </div>

            {/* Bottom bar */}
            <div
              className="px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 border-t"
              style={{
                borderColor: "oklch(0.92 0.01 240)",
                backgroundColor: "oklch(0.98 0.005 240)",
              }}
            >
              {/* Left: counter + file upload */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-4">
                  <span className="font-display text-xs text-muted-foreground">
                    <span
                      className="font-semibold"
                      style={{ color: "oklch(0.35 0.07 255)" }}
                    >
                      {charCount.toLocaleString()}
                    </span>{" "}
                    characters
                  </span>
                  <span className="font-display text-xs text-muted-foreground">
                    <span
                      className="font-semibold"
                      style={{ color: "oklch(0.35 0.07 255)" }}
                    >
                      {wordCount.toLocaleString()}
                    </span>{" "}
                    words
                  </span>
                </div>
                <FileUploadButton
                  onTextExtracted={handleFileTextExtracted}
                  disabled={isAnalyzing}
                />
              </div>

              {/* Right: action buttons */}
              <div className="flex items-center gap-2">
                {hasResults && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleClear}
                    className="font-display text-xs gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Clear
                  </Button>
                )}
                <Button
                  type="button"
                  size="sm"
                  onClick={handleCheck}
                  disabled={!text.trim() || isAnalyzing}
                  className="font-display font-semibold gap-2 px-5"
                  style={{
                    backgroundColor:
                      !text.trim() || isAnalyzing
                        ? undefined
                        : detectionMode === "ai"
                          ? "oklch(0.45 0.2 300)"
                          : "oklch(0.28 0.08 255)",
                    color: !text.trim() || isAnalyzing ? undefined : "white",
                    boxShadow:
                      !text.trim() || isAnalyzing
                        ? undefined
                        : detectionMode === "ai"
                          ? "0 2px 12px oklch(0.45 0.2 300 / 0.4)"
                          : "0 2px 12px oklch(0.28 0.08 255 / 0.4)",
                  }}
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Analyzing…
                    </>
                  ) : (
                    <>
                      {detectionMode === "ai" ? (
                        <Bot className="w-4 h-4" />
                      ) : (
                        <Search className="w-4 h-4" />
                      )}
                      {buttonLabel}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Error state */}
          {error && (
            <div
              className="mt-4 rounded-lg p-4 flex items-start gap-3 animate-fade-in"
              style={{
                backgroundColor: "oklch(0.97 0.04 25)",
                border: "1px solid oklch(0.8 0.16 25 / 0.4)",
              }}
            >
              <AlertTriangle
                className="w-4 h-4 shrink-0 mt-0.5"
                style={{ color: "oklch(0.55 0.22 25)" }}
              />
              <p
                className="font-display text-sm"
                style={{ color: "oklch(0.42 0.18 25)" }}
              >
                {error}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Results section */}
      {hasResults && (
        <section
          ref={resultsRef}
          className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-10 animate-fade-slide-up"
        >
          {/* ── Combined Analysis Summary (shown only in "both" mode) ── */}
          {detectionMode === "both" && result && aiResult && (
            <div
              className="rounded-2xl border p-6 sm:p-8 animate-fade-slide-up"
              style={{
                backgroundColor: "oklch(1 0 0)",
                borderColor: "oklch(0.88 0.015 240)",
                boxShadow: "0 4px 24px oklch(0.18 0.04 255 / 0.06)",
              }}
            >
              {/* Card heading */}
              <div className="flex items-center gap-2 mb-6">
                <Zap
                  className="w-5 h-5"
                  style={{ color: "oklch(0.38 0.12 255)" }}
                />
                <h2
                  className="font-display font-bold text-lg"
                  style={{ color: "oklch(0.2 0.075 255)" }}
                >
                  Analysis Complete
                </h2>
                <span
                  className="ml-auto text-xs font-display font-medium px-2.5 py-1 rounded-full"
                  style={{
                    backgroundColor: "oklch(0.94 0.02 255)",
                    color: "oklch(0.38 0.12 255)",
                    border: "1.5px solid oklch(0.82 0.04 255)",
                  }}
                >
                  Both checks complete
                </span>
              </div>

              {/* Two score boxes */}
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                {/* ── Plagiarism box ── */}
                {(() => {
                  const plagPct = Math.round(result.overallScore * 100);
                  const plagRisk =
                    plagPct < 15
                      ? "Low Risk"
                      : plagPct <= 60
                        ? "Moderate Risk"
                        : "High Risk";
                  const plagColor =
                    plagPct < 15
                      ? "oklch(0.28 0.08 255)"
                      : plagPct <= 60
                        ? "oklch(0.62 0.14 72)"
                        : "oklch(0.58 0.2 25)";
                  const plagBg =
                    plagPct < 15
                      ? "oklch(0.95 0.02 255)"
                      : plagPct <= 60
                        ? "oklch(0.97 0.04 72)"
                        : "oklch(0.97 0.03 25)";
                  const plagBorder =
                    plagPct < 15
                      ? "oklch(0.78 0.06 255 / 0.5)"
                      : plagPct <= 60
                        ? "oklch(0.80 0.10 72 / 0.5)"
                        : "oklch(0.78 0.14 25 / 0.5)";

                  return (
                    <div
                      className="flex-1 rounded-xl border p-5 flex flex-col items-center text-center gap-3"
                      style={{
                        backgroundColor: plagBg,
                        borderColor: plagBorder,
                      }}
                    >
                      <div
                        className="flex items-center justify-center w-10 h-10 rounded-full"
                        style={{
                          backgroundColor: `${plagColor.replace(")", " / 0.12)")}`,
                          color: plagColor,
                        }}
                      >
                        <Search className="w-5 h-5" />
                      </div>
                      <div>
                        <div
                          className="font-display font-extrabold text-5xl leading-none mb-1"
                          style={{ color: plagColor }}
                        >
                          {plagPct}%
                        </div>
                        <div
                          className="font-display font-semibold text-sm mb-2"
                          style={{ color: "oklch(0.22 0.06 255)" }}
                        >
                          Plagiarism Detected
                        </div>
                        <span
                          className="inline-block text-xs font-display font-bold px-3 py-1 rounded-full"
                          style={{
                            backgroundColor: plagColor.replace(")", " / 0.12)"),
                            color: plagColor,
                            border: `1.5px solid ${plagColor.replace(")", " / 0.3)")}`,
                          }}
                        >
                          {plagRisk}
                        </span>
                      </div>
                    </div>
                  );
                })()}

                {/* Vertical divider */}
                <div
                  className="hidden sm:block w-px self-stretch"
                  style={{ backgroundColor: "oklch(0.88 0.015 240)" }}
                />

                {/* ── AI Detection box ── */}
                {(() => {
                  const aiPct = Math.round(aiResult.overallScore * 100);
                  const aiColor =
                    aiResult.label === "Likely Human"
                      ? "oklch(0.55 0.18 145)"
                      : aiResult.label === "Mixed/Uncertain"
                        ? "oklch(0.62 0.14 72)"
                        : "oklch(0.55 0.22 300)";
                  const aiBg =
                    aiResult.label === "Likely Human"
                      ? "oklch(0.96 0.04 145)"
                      : aiResult.label === "Mixed/Uncertain"
                        ? "oklch(0.97 0.04 72)"
                        : "oklch(0.97 0.03 300)";
                  const aiBorder =
                    aiResult.label === "Likely Human"
                      ? "oklch(0.78 0.10 145 / 0.5)"
                      : aiResult.label === "Mixed/Uncertain"
                        ? "oklch(0.80 0.10 72 / 0.5)"
                        : "oklch(0.72 0.14 300 / 0.5)";

                  return (
                    <div
                      className="flex-1 rounded-xl border p-5 flex flex-col items-center text-center gap-3"
                      style={{ backgroundColor: aiBg, borderColor: aiBorder }}
                    >
                      <div
                        className="flex items-center justify-center w-10 h-10 rounded-full"
                        style={{
                          backgroundColor: `${aiColor.replace(")", " / 0.12)")}`,
                          color: aiColor,
                        }}
                      >
                        <Bot className="w-5 h-5" />
                      </div>
                      <div>
                        <div
                          className="font-display font-extrabold text-5xl leading-none mb-1"
                          style={{ color: aiColor }}
                        >
                          {aiPct}%
                        </div>
                        <div
                          className="font-display font-semibold text-sm mb-2"
                          style={{ color: "oklch(0.22 0.06 255)" }}
                        >
                          AI Content Detected
                        </div>
                        <span
                          className="inline-block text-xs font-display font-bold px-3 py-1 rounded-full"
                          style={{
                            backgroundColor: aiColor.replace(")", " / 0.12)"),
                            color: aiColor,
                            border: `1.5px solid ${aiColor.replace(")", " / 0.3)")}`,
                          }}
                        >
                          {aiResult.label}
                        </span>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Footer note */}
              <p
                className="mt-5 text-center font-display text-xs"
                style={{ color: "oklch(0.52 0.04 240)" }}
              >
                Scroll down to see detailed highlights and rewrite suggestions
                for each.
              </p>
            </div>
          )}

          {/* ── Plagiarism Results ── */}
          {result && (
            <div className="space-y-6">
              {detectionMode === "both" && (
                <div className="flex items-center gap-3">
                  <div
                    className="h-px flex-1"
                    style={{ backgroundColor: "oklch(0.88 0.015 240)" }}
                  />
                  <span
                    className="font-display font-semibold text-sm px-3 py-1 rounded-full"
                    style={{
                      backgroundColor: "oklch(0.94 0.02 255)",
                      color: "oklch(0.28 0.08 255)",
                      border: "1.5px solid oklch(0.82 0.04 255)",
                    }}
                  >
                    Plagiarism Results
                  </span>
                  <div
                    className="h-px flex-1"
                    style={{ backgroundColor: "oklch(0.88 0.015 240)" }}
                  />
                </div>
              )}

              {/* Score summary */}
              <div
                className="rounded-2xl border p-6 sm:p-8"
                style={{
                  backgroundColor: "oklch(1 0 0)",
                  borderColor: "oklch(0.88 0.015 240)",
                  boxShadow: "0 4px 24px oklch(0.18 0.04 255 / 0.06)",
                }}
              >
                <div className="flex flex-col sm:flex-row items-center gap-8">
                  <div className="shrink-0">
                    <ScoreGauge score={result.overallScore} size={180} />
                  </div>

                  <div className="flex-1 text-center sm:text-left">
                    <h2
                      className="font-display font-bold text-xl mb-2"
                      style={{ color: "oklch(0.2 0.075 255)" }}
                    >
                      Analysis Complete
                    </h2>
                    <p className="font-display text-sm text-muted-foreground mb-4">
                      Highlighted passages below indicate potentially similar
                      content. <strong>Click any highlight</strong> to see
                      humanized rewrites and jump to that sentence in your
                      original text.
                    </p>

                    <div className="flex flex-wrap justify-center sm:justify-start gap-4 mb-4">
                      <div className="text-center">
                        <div
                          className="font-display font-bold text-2xl"
                          style={{ color: "oklch(0.28 0.08 255)" }}
                        >
                          {result.segments.filter((s) => s.flagged).length}
                        </div>
                        <div className="font-display text-xs text-muted-foreground">
                          Flagged Segments
                        </div>
                      </div>
                      <div className="w-px bg-border hidden sm:block" />
                      <div className="text-center">
                        <div
                          className="font-display font-bold text-2xl"
                          style={{ color: "oklch(0.28 0.08 255)" }}
                        >
                          {result.segments.length}
                        </div>
                        <div className="font-display text-xs text-muted-foreground">
                          Total Segments
                        </div>
                      </div>
                    </div>

                    {/* Legend */}
                    <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-xs font-display">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-3 h-3 rounded-sm shrink-0"
                          style={{
                            backgroundColor: "oklch(0.95 0.07 15)",
                            border: "1.5px solid oklch(0.58 0.2 25)",
                          }}
                        />
                        <span className="text-muted-foreground">
                          High (&gt;60%)
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-3 h-3 rounded-sm shrink-0"
                          style={{
                            backgroundColor: "oklch(0.95 0.09 85)",
                            border: "1.5px solid oklch(0.72 0.14 72)",
                          }}
                        />
                        <span className="text-muted-foreground">
                          Moderate (15–60%)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-col gap-2 shrink-0">
                    <Button
                      type="button"
                      onClick={() => setShowReport(true)}
                      className="font-display font-semibold gap-2 whitespace-nowrap"
                      style={{
                        backgroundColor: "oklch(0.28 0.08 255)",
                        color: "white",
                        boxShadow: "0 2px 12px oklch(0.28 0.08 255 / 0.4)",
                      }}
                    >
                      <PrinterIcon className="w-4 h-4" />
                      Generate Report
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleClear}
                      className="font-display gap-2 whitespace-nowrap"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Check New Text
                    </Button>
                  </div>
                </div>
              </div>

              {/* Two-column: original input (left) + annotated text (right) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left: editable original text */}
                <div
                  className="rounded-2xl border flex flex-col"
                  style={{
                    backgroundColor: "oklch(1 0 0)",
                    borderColor: "oklch(0.88 0.015 240)",
                    boxShadow: "0 4px 24px oklch(0.18 0.04 255 / 0.06)",
                  }}
                >
                  <div
                    className="px-6 py-4 border-b flex items-center justify-between"
                    style={{ borderColor: "oklch(0.92 0.01 240)" }}
                  >
                    <div>
                      <h2
                        className="font-display font-semibold text-base"
                        style={{ color: "oklch(0.2 0.075 255)" }}
                      >
                        Original Text
                      </h2>
                      <p className="font-display text-xs text-muted-foreground mt-0.5">
                        Click a highlight in the annotated view to jump here
                      </p>
                    </div>
                    <div
                      className="text-xs font-display px-2 py-1 rounded-md"
                      style={{
                        backgroundColor: "oklch(0.94 0.02 255)",
                        color: "oklch(0.35 0.08 255)",
                      }}
                    >
                      Editable
                    </div>
                  </div>
                  <div className="flex-1 p-6">
                    <textarea
                      ref={textareaRef}
                      value={text}
                      onChange={handleTextareaChange}
                      className="w-full h-full resize-none outline-none font-serif text-sm leading-relaxed bg-transparent rounded-lg transition-all duration-200"
                      style={{
                        minHeight: "320px",
                        color: "oklch(0.18 0.04 255)",
                      }}
                    />
                  </div>
                </div>

                {/* Right: annotated view */}
                <div
                  className="rounded-2xl border flex flex-col"
                  style={{
                    backgroundColor: "oklch(1 0 0)",
                    borderColor: "oklch(0.88 0.015 240)",
                    boxShadow: "0 4px 24px oklch(0.18 0.04 255 / 0.06)",
                  }}
                >
                  <div
                    className="px-6 py-4 border-b flex items-center justify-between"
                    style={{ borderColor: "oklch(0.92 0.01 240)" }}
                  >
                    <div>
                      <h2
                        className="font-display font-semibold text-base"
                        style={{ color: "oklch(0.2 0.075 255)" }}
                      >
                        Annotated Text
                      </h2>
                      <p className="font-display text-xs text-muted-foreground mt-0.5">
                        Click a highlight to see rewrites &amp; jump to original
                      </p>
                    </div>
                    <div
                      className="text-xs font-display px-2 py-1 rounded-md"
                      style={{
                        backgroundColor: "oklch(0.94 0.09 85 / 0.4)",
                        color: "oklch(0.42 0.1 72)",
                      }}
                    >
                      Read-only
                    </div>
                  </div>
                  <div className="flex-1 p-6 overflow-y-auto">
                    <AnnotatedText
                      segments={result.segments}
                      textareaRef={textareaRef}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── AI Detection Results ── */}
          {aiResult && (
            <div className="space-y-6">
              {detectionMode === "both" && (
                <div className="flex items-center gap-3">
                  <div
                    className="h-px flex-1"
                    style={{ backgroundColor: "oklch(0.88 0.015 240)" }}
                  />
                  <span
                    className="font-display font-semibold text-sm px-3 py-1 rounded-full"
                    style={{
                      backgroundColor: "oklch(0.93 0.06 300 / 0.2)",
                      color: "oklch(0.4 0.2 300)",
                      border: "1.5px solid oklch(0.72 0.14 300 / 0.5)",
                    }}
                  >
                    AI Detection Results
                  </span>
                  <div
                    className="h-px flex-1"
                    style={{ backgroundColor: "oklch(0.88 0.015 240)" }}
                  />
                </div>
              )}

              {/* AI mode: show original text editor too */}
              {(detectionMode === "ai" || detectionMode === "both") && (
                <div
                  className="rounded-2xl border flex flex-col"
                  style={{
                    backgroundColor: "oklch(1 0 0)",
                    borderColor: "oklch(0.88 0.015 240)",
                    boxShadow: "0 4px 24px oklch(0.18 0.04 255 / 0.06)",
                  }}
                >
                  <div
                    className="px-6 py-4 border-b flex items-center justify-between"
                    style={{ borderColor: "oklch(0.92 0.01 240)" }}
                  >
                    <div>
                      <h2
                        className="font-display font-semibold text-base"
                        style={{ color: "oklch(0.2 0.075 255)" }}
                      >
                        Original Text
                      </h2>
                      <p className="font-display text-xs text-muted-foreground mt-0.5">
                        Click a highlight in the AI view to jump here and edit
                      </p>
                    </div>
                    <div
                      className="text-xs font-display px-2 py-1 rounded-md"
                      style={{
                        backgroundColor: "oklch(0.94 0.02 255)",
                        color: "oklch(0.35 0.08 255)",
                      }}
                    >
                      Editable
                    </div>
                  </div>
                  <div className="p-6">
                    <textarea
                      ref={detectionMode === "ai" ? textareaRef : undefined}
                      value={text}
                      onChange={handleTextareaChange}
                      className="w-full resize-none outline-none font-serif text-sm leading-relaxed bg-transparent rounded-lg transition-all duration-200"
                      style={{
                        minHeight: "200px",
                        color: "oklch(0.18 0.04 255)",
                      }}
                    />
                  </div>
                </div>
              )}

              <AIResultsPanel aiResult={aiResult} />

              {/* Action buttons for AI-only mode */}
              {detectionMode === "ai" && (
                <div className="flex gap-2 justify-end">
                  <Button
                    type="button"
                    onClick={() => setShowReport(true)}
                    className="font-display font-semibold gap-2"
                    style={{
                      backgroundColor: "oklch(0.45 0.2 300)",
                      color: "white",
                      boxShadow: "0 2px 12px oklch(0.45 0.2 300 / 0.4)",
                    }}
                  >
                    <PrinterIcon className="w-4 h-4" />
                    Generate Report
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClear}
                    className="font-display gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Check New Text
                  </Button>
                </div>
              )}

              {/* Both mode: generate report at the end */}
              {detectionMode === "both" && (
                <div className="flex gap-2 justify-end">
                  <Button
                    type="button"
                    onClick={() => setShowReport(true)}
                    className="font-display font-semibold gap-2"
                    style={{
                      backgroundColor: "oklch(0.28 0.08 255)",
                      color: "white",
                      boxShadow: "0 2px 12px oklch(0.28 0.08 255 / 0.4)",
                    }}
                  >
                    <PrinterIcon className="w-4 h-4" />
                    Generate Full Report
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClear}
                    className="font-display gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Check New Text
                  </Button>
                </div>
              )}
            </div>
          )}
        </section>
      )}

      {/* Report modal */}
      {showReport && (result || aiResult) && (
        <ReportModal
          result={result ?? undefined}
          aiResult={aiResult}
          onClose={() => setShowReport(false)}
        />
      )}
    </main>
  );
}
