import { ArrowUpLeft, Check, ChevronUp, Copy } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import type { FrontendSegment } from "../utils/plagiarismDetector";

// ─── Copy Button ──────────────────────────────────────────────────────────────

function CopyButton({ text, altIndex }: { text: string; altIndex: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
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
      aria-label={`Copy alternative ${altIndex}`}
    >
      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
      <span>{copied ? "Copied!" : "Copy"}</span>
    </button>
  );
}

// ─── Segment Detail Panel ─────────────────────────────────────────────────────

interface SegmentPanelProps {
  segment: FrontendSegment;
  onClose: () => void;
  onJumpToOriginal: () => void;
}

function SegmentPanel({
  segment,
  onClose,
  onJumpToOriginal,
}: SegmentPanelProps) {
  const pct = Math.round(segment.score * 100);
  const isHigh = segment.score > 0.6;

  return (
    <div
      className="mt-3 mb-4 rounded-xl border p-4 animate-scale-in"
      style={{
        backgroundColor: isHigh ? "oklch(0.97 0.03 15)" : "oklch(0.97 0.04 85)",
        borderColor: isHigh
          ? "oklch(0.72 0.18 25 / 0.4)"
          : "oklch(0.72 0.14 72 / 0.4)",
      }}
    >
      {/* Panel header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className="text-xs font-display font-bold px-2.5 py-1 rounded-full"
            style={{
              backgroundColor: isHigh
                ? "oklch(0.55 0.22 25)"
                : "oklch(0.65 0.18 72)",
              color: "white",
            }}
          >
            {pct}% similar
          </span>
          <span className="text-xs font-display text-muted-foreground">
            {isHigh ? "High similarity" : "Moderate similarity"}
          </span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={onJumpToOriginal}
            className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg border font-display font-medium transition-all duration-150 hover:shadow-sm"
            style={{
              borderColor: isHigh
                ? "oklch(0.58 0.2 25 / 0.5)"
                : "oklch(0.65 0.18 72 / 0.5)",
              backgroundColor: isHigh
                ? "oklch(0.55 0.22 25 / 0.08)"
                : "oklch(0.65 0.18 72 / 0.08)",
              color: isHigh ? "oklch(0.42 0.18 25)" : "oklch(0.42 0.1 72)",
            }}
            title="Scroll to this sentence in the original text to edit it"
          >
            <ArrowUpLeft className="w-3 h-3" />
            Edit in original
          </button>
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

      {/* Original flagged sentence */}
      <div
        className="mb-4 p-3 rounded-lg border"
        style={{
          backgroundColor: "oklch(1 0 0 / 0.6)",
          borderColor: isHigh
            ? "oklch(0.72 0.18 25 / 0.25)"
            : "oklch(0.72 0.14 72 / 0.25)",
        }}
      >
        <p className="text-xs font-display font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
          Flagged sentence
        </p>
        <p className="text-sm font-serif leading-relaxed text-foreground">
          {segment.text}
        </p>
      </div>

      {/* Alternatives */}
      {segment.alternatives.length > 0 ? (
        <div className="space-y-2.5">
          <p className="text-xs font-display font-semibold uppercase tracking-wide text-muted-foreground">
            Ready-to-use replacements — copy and paste directly into your text
          </p>
          {segment.alternatives.map((alt, i) => (
            <div
              key={`alt-${segment.segmentId.toString()}-${i}`}
              className="flex items-start gap-3 p-3 rounded-lg border transition-all duration-150"
              style={{
                backgroundColor: "oklch(1 0 0 / 0.75)",
                borderColor: "oklch(0.9 0.01 240)",
              }}
            >
              <span
                className="text-xs font-display font-bold shrink-0 w-5 h-5 rounded-full inline-flex items-center justify-center mt-0.5"
                style={{
                  backgroundColor: isHigh
                    ? "oklch(0.55 0.22 25)"
                    : "oklch(0.65 0.18 72)",
                  color: "white",
                  fontSize: "9px",
                }}
              >
                {i + 1}
              </span>
              <p className="text-sm font-serif leading-relaxed flex-1 text-foreground">
                {alt}
              </p>
              <CopyButton text={alt} altIndex={`${segment.segmentId}-${i}`} />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground italic">
          No alternatives available for this segment.
        </p>
      )}
    </div>
  );
}

// ─── Main AnnotatedText Component ─────────────────────────────────────────────

interface AnnotatedTextProps {
  segments: FrontendSegment[];
  textareaRef?: React.RefObject<HTMLTextAreaElement | null>;
}

export function AnnotatedText({ segments, textareaRef }: AnnotatedTextProps) {
  const [activeSegmentId, setActiveSegmentId] = useState<bigint | null>(null);
  const glowTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scrollTextareaToSegment = useCallback(
    (segment: FrontendSegment) => {
      const ta = textareaRef?.current;
      if (!ta) return;

      // charOffset may be undefined for history results from backend
      const start = segment.charOffset ?? ta.value.indexOf(segment.text);
      if (start < 0) return;
      const end = start + segment.text.length;

      // Select the range — browser scrolls textarea to the selection
      ta.focus();
      ta.setSelectionRange(start, end);

      // Scroll textarea into viewport first
      ta.scrollIntoView({ behavior: "smooth", block: "nearest" });

      // Add glow animation
      if (glowTimerRef.current) clearTimeout(glowTimerRef.current);
      ta.classList.add("textarea-glow");
      glowTimerRef.current = setTimeout(() => {
        ta.classList.remove("textarea-glow");
      }, 1800);
    },
    [textareaRef],
  );

  const handleSegmentClick = useCallback(
    (segment: FrontendSegment) => {
      const isAlreadyActive = activeSegmentId === segment.segmentId;
      setActiveSegmentId(isAlreadyActive ? null : segment.segmentId);
      if (!isAlreadyActive) {
        scrollTextareaToSegment(segment);
      }
    },
    [activeSegmentId, scrollTextareaToSegment],
  );

  const handleJumpToOriginal = useCallback(
    (segment: FrontendSegment) => {
      scrollTextareaToSegment(segment);
    },
    [scrollTextareaToSegment],
  );

  return (
    <div className="font-serif text-base leading-relaxed text-foreground">
      {segments.map((segment) => {
        if (!segment.flagged) {
          return (
            <span key={segment.segmentId.toString()}>{segment.text} </span>
          );
        }

        const isHigh = segment.score > 0.6;
        const isActive = activeSegmentId === segment.segmentId;

        return (
          <span key={segment.segmentId.toString()} className="inline">
            <button
              type="button"
              className={`${isHigh ? "segment-red" : "segment-amber"} ${isActive ? "active" : ""} text-left`}
              onClick={() => handleSegmentClick(segment)}
              title={`Click to see alternatives (${Math.round(segment.score * 100)}% similar) — also scrolls to this sentence in your original text`}
              style={{
                fontFamily: "Lora, ui-serif, Georgia, serif",
                fontSize: "inherit",
                lineHeight: "inherit",
                backgroundColor: isHigh
                  ? "oklch(0.95 0.07 15)"
                  : "oklch(0.95 0.09 85)",
                borderBottom: isHigh
                  ? "2px solid oklch(0.58 0.2 25)"
                  : "2px solid oklch(0.72 0.14 72)",
                color: isHigh ? "oklch(0.35 0.18 25)" : "oklch(0.38 0.1 72)",
                borderRadius: "2px",
                padding: "1px 3px",
                cursor: "pointer",
              }}
            >
              {segment.text}
            </button>{" "}
            {isActive && (
              <span className="block">
                <SegmentPanel
                  segment={segment}
                  onClose={() => setActiveSegmentId(null)}
                  onJumpToOriginal={() => handleJumpToOriginal(segment)}
                />
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
}
