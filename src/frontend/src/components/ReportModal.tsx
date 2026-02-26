import { useRef } from "react";
import { X, Printer, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { FrontendCheckResult } from "../utils/plagiarismDetector";

interface ReportModalProps {
  result: FrontendCheckResult;
  onClose: () => void;
}

function getScoreColor(score: number): string {
  if (score <= 0.3) return "oklch(0.55 0.18 145)";
  if (score <= 0.6) return "oklch(0.65 0.18 72)";
  return "oklch(0.55 0.22 25)";
}

function getScoreLabel(score: number): string {
  const pct = score * 100;
  if (pct <= 30) return "Low";
  if (pct <= 60) return "Moderate";
  return "High";
}

export function ReportModal({ result, onClose }: ReportModalProps) {
  const printRef = useRef<HTMLDivElement>(null);
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const timeStr = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const flaggedSegments = result.segments.filter((s) => s.flagged);
  const pct = Math.round(result.overallScore * 100);
  const scoreColor = getScoreColor(result.overallScore);
  const scoreLabel = getScoreLabel(result.overallScore);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto"
      style={{ backgroundColor: "oklch(0.1 0.02 255 / 0.7)" }}
    >
      <div
        className="relative w-full max-w-4xl mx-4 my-8 rounded-xl shadow-2xl animate-scale-in"
        style={{ backgroundColor: "oklch(1 0 0)" }}
      >
        {/* Controls - hidden on print */}
        <div
          className="no-print sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b rounded-t-xl"
          style={{
            backgroundColor: "oklch(1 0 0 / 0.95)",
            borderColor: "oklch(0.88 0.015 240)",
            backdropFilter: "blur(8px)",
          }}
        >
          <span className="font-display font-semibold text-foreground">Report Preview</span>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              onClick={handlePrint}
              className="gap-2"
              style={{
                backgroundColor: "oklch(0.28 0.08 255)",
                color: "white",
              }}
            >
              <Printer className="w-4 h-4" />
              Print / Save as PDF
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={onClose}
              aria-label="Close report"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Printable content */}
        <div ref={printRef} className="print-container p-8 space-y-8">
          {/* Report Header */}
          <div
            className="rounded-xl p-6 text-white"
            style={{
              background: "linear-gradient(135deg, oklch(0.2 0.075 255) 0%, oklch(0.28 0.08 255) 60%, oklch(0.26 0.1 248) 100%)",
            }}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <ShieldCheck className="w-5 h-5 opacity-80" />
                  <span className="text-sm font-display font-medium opacity-80 uppercase tracking-widest">
                    Plagiarism Analysis Report
                  </span>
                </div>
                <h1 className="font-display text-2xl font-bold">NHM Pro Free Plagiarism Checker</h1>
                <p className="text-sm opacity-70 mt-1 font-display">
                  {dateStr} &bull; {timeStr}
                </p>
              </div>
              <div className="text-right">
                <div
                  className="text-4xl font-display font-bold"
                  style={{ color: pct <= 30 ? "#86efac" : pct <= 60 ? "#fbbf24" : "#fca5a5" }}
                >
                  {pct}%
                </div>
                <div className="text-sm font-display opacity-80">{scoreLabel} Risk</div>
              </div>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Overall Score", value: `${pct}%`, sub: scoreLabel },
              { label: "Flagged Segments", value: flaggedSegments.length.toString(), sub: "passages" },
              { label: "Report ID", value: `#${result.id.toString()}`, sub: "unique" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-lg p-4 border text-center"
                style={{ borderColor: "oklch(0.88 0.015 240)" }}
              >
                <div className="font-display font-bold text-2xl" style={{ color: scoreColor }}>
                  {stat.value}
                </div>
                <div className="font-display text-sm font-medium text-foreground mt-0.5">{stat.label}</div>
                <div className="font-display text-xs text-muted-foreground">{stat.sub}</div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-6">
            <span className="font-display text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Legend:
            </span>
            <div className="flex items-center gap-2">
              <span className="segment-amber text-xs">Moderate (30–60%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="segment-red text-xs">High (&gt;60%)</span>
            </div>
          </div>

          {/* Annotated text */}
          <div>
            <h2
              className="font-display text-base font-semibold mb-3 pb-2 border-b"
              style={{ borderColor: "oklch(0.88 0.015 240)", color: "oklch(0.28 0.08 255)" }}
            >
              Full Text Analysis
            </h2>
            <div className="font-serif text-sm leading-relaxed">
              {result.segments.map((segment) => {
                if (!segment.flagged) {
                  return <span key={segment.segmentId.toString()}>{segment.text}</span>;
                }
                const isHigh = segment.score > 0.6;
                return (
                  <span
                    key={segment.segmentId.toString()}
                    className={isHigh ? "segment-red" : "segment-amber"}
                    title={`${Math.round(segment.score * 100)}% similarity`}
                  >
                    {segment.text}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Flagged segments table */}
          {flaggedSegments.length > 0 && (
            <div>
              <h2
                className="font-display text-base font-semibold mb-3 pb-2 border-b"
                style={{ borderColor: "oklch(0.88 0.015 240)", color: "oklch(0.28 0.08 255)" }}
              >
                Flagged Segments & Alternatives
              </h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-display text-xs w-8">#</TableHead>
                    <TableHead className="font-display text-xs">Original Text</TableHead>
                    <TableHead className="font-display text-xs w-20">Score</TableHead>
                    <TableHead className="font-display text-xs">Suggested Alternatives</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {flaggedSegments.map((seg, i) => {
                    const isHigh = seg.score > 0.6;
                    return (
                      <TableRow key={seg.segmentId.toString()}>
                        <TableCell className="font-display text-xs text-muted-foreground">
                          {i + 1}
                        </TableCell>
                        <TableCell>
                          <span className={`font-serif text-xs ${isHigh ? "segment-red" : "segment-amber"}`}>
                            {seg.text.length > 120 ? seg.text.slice(0, 120) + "…" : seg.text}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className="font-display text-xs"
                            style={{
                              backgroundColor: isHigh ? "oklch(0.55 0.22 25)" : "oklch(0.65 0.18 72)",
                              color: "white",
                              border: "none",
                            }}
                          >
                            {Math.round(seg.score * 100)}%
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {seg.alternatives.length > 0 ? (
                            <ol className="list-decimal list-inside space-y-1">
                              {seg.alternatives.map((alt, j) => (
                                <li
                                  key={`report-alt-${seg.segmentId.toString()}-${j}`}
                                  className="font-serif text-xs text-foreground"
                                >
                                  {alt}
                                </li>
                              ))}
                            </ol>
                          ) : (
                            <span className="text-xs text-muted-foreground italic">None</span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Footer */}
          <div
            className="border-t pt-4 flex items-center justify-between"
            style={{ borderColor: "oklch(0.88 0.015 240)" }}
          >
            <p className="font-display text-xs text-muted-foreground">
              Generated by{" "}
              <span className="font-semibold" style={{ color: "oklch(0.28 0.08 255)" }}>
                NHM Pro Free Plagiarism Checker
              </span>
              {" "}— All checks are confidential
            </p>
            <p className="font-display text-xs text-muted-foreground">
              caffeine.ai platform
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
