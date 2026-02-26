import { useState } from "react";
import { Copy, Check, ChevronUp } from "lucide-react";
import type { FrontendSegment } from "../utils/plagiarismDetector";

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
      className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded border transition-all duration-150"
      style={{
        borderColor: "oklch(0.88 0.015 240)",
        backgroundColor: copied ? "oklch(0.92 0.08 145 / 0.2)" : "oklch(0.96 0.01 240)",
        color: copied ? "oklch(0.42 0.14 145)" : "oklch(0.42 0.04 240)",
      }}
      title="Copy to clipboard"
    >
      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
      <span>{copied ? "Copied!" : "Copy"}</span>
    </button>
  );
}

function SegmentPanel({ segment, onClose }: { segment: FrontendSegment; onClose: () => void }) {
  const pct = Math.round(segment.score * 100);
  const isHigh = segment.score > 0.6;

  return (
    <div
      className="mt-2 mb-3 rounded-lg border p-4 animate-scale-in"
      style={{
        backgroundColor: isHigh ? "oklch(0.97 0.03 15)" : "oklch(0.97 0.04 85)",
        borderColor: isHigh ? "oklch(0.72 0.18 25 / 0.4)" : "oklch(0.72 0.14 72 / 0.4)",
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span
            className="text-xs font-display font-semibold px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: isHigh ? "oklch(0.55 0.22 25)" : "oklch(0.65 0.18 72)",
              color: "white",
            }}
          >
            {pct}% similar
          </span>
          <span className="text-xs font-display text-muted-foreground">
            {isHigh ? "High similarity — consider rewriting" : "Moderate similarity — rephrase recommended"}
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Close panel"
        >
          <ChevronUp className="w-4 h-4" />
        </button>
      </div>

      {segment.alternatives.length > 0 ? (
        <div className="space-y-2">
          <p className="text-xs font-display font-semibold uppercase tracking-wide text-muted-foreground mb-2">
            Suggested Rewrites
          </p>
          {segment.alternatives.map((alt, i) => (
            <div
              key={`alt-${segment.segmentId.toString()}-${i}`}
              className="flex items-start gap-2 p-2.5 rounded-md"
              style={{ backgroundColor: "oklch(1 0 0 / 0.7)" }}
            >
              <span
                className="text-xs font-display font-bold mt-0.5 shrink-0 w-4 h-4 rounded-full inline-flex items-center justify-center"
                style={{
                  backgroundColor: isHigh ? "oklch(0.55 0.22 25)" : "oklch(0.65 0.18 72)",
                  color: "white",
                  fontSize: "9px",
                }}
              >
                {i + 1}
              </span>
              <p className="text-xs font-serif leading-relaxed flex-1 text-foreground">
                {alt}
              </p>
              <CopyButton text={alt} altIndex={`${segment.segmentId}-${i}`} />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground italic">No alternatives available for this segment.</p>
      )}
    </div>
  );
}

export function AnnotatedText({ segments }: AnnotatedTextProps) {
  const [activeSegmentId, setActiveSegmentId] = useState<bigint | null>(null);

  const handleSegmentClick = (segmentId: bigint) => {
    setActiveSegmentId((prev) => (prev === segmentId ? null : segmentId));
  };

  return (
    <div className="font-serif text-base leading-relaxed text-foreground">
      {segments.map((segment) => {
        if (!segment.flagged) {
          return (
            <span key={segment.segmentId.toString()}>
              {segment.text}
            </span>
          );
        }

        const isHigh = segment.score > 0.6;
        const isActive = activeSegmentId === segment.segmentId;

        return (
          <span key={segment.segmentId.toString()} className="inline">
            <button
              type="button"
              className={`${isHigh ? "segment-red" : "segment-amber"} ${isActive ? "active" : ""} text-left`}
              onClick={() => handleSegmentClick(segment.segmentId)}
              title={`Click to see alternatives (${Math.round(segment.score * 100)}% similar)`}
              style={{
                fontFamily: "Lora, ui-serif, Georgia, serif",
                fontSize: "inherit",
                lineHeight: "inherit",
                backgroundColor: isHigh ? "oklch(0.95 0.07 15)" : "oklch(0.95 0.09 85)",
                borderBottom: isHigh ? "2px solid oklch(0.58 0.2 25)" : "2px solid oklch(0.72 0.14 72)",
                color: isHigh ? "oklch(0.35 0.18 25)" : "oklch(0.38 0.1 72)",
                borderRadius: "2px",
                padding: "1px 3px",
                cursor: "pointer",
              }}
            >
              {segment.text}
            </button>
            {isActive && (
              <span className="block">
                <SegmentPanel
                  segment={segment}
                  onClose={() => setActiveSegmentId(null)}
                />
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
}

interface AnnotatedTextProps {
  segments: FrontendSegment[];
}
