import { useState } from "react";
import {
  Trash2,
  ClockIcon,
  FileSearch,
  Loader2,
  AlertTriangle,
  ChevronRight,
  ArrowLeft,
  PrinterIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetHistory, useGetCheck, useDeleteCheck } from "../hooks/useQueries";
import { ScoreGauge } from "./ScoreGauge";
import { AnnotatedText } from "./AnnotatedText";
import { ReportModal } from "./ReportModal";
import type { CheckSummary } from "../backend.d";

function formatTimestamp(ts: bigint): string {
  // timestamp in nanoseconds
  const ms = Number(ts / BigInt(1_000_000));
  const date = new Date(ms);
  if (isNaN(date.getTime())) return "Unknown date";
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function ScoreBadge({ score }: { score: number }) {
  const pct = Math.round(score * 100);
  let bg = "oklch(0.55 0.18 145)";
  let label = "Low";
  if (pct > 60) {
    bg = "oklch(0.55 0.22 25)";
    label = "High";
  } else if (pct > 30) {
    bg = "oklch(0.65 0.18 72)";
    label = "Moderate";
  }

  return (
    <div className="flex items-center gap-1.5">
      <span
        className="font-display font-bold text-sm"
        style={{ color: bg }}
      >
        {pct}%
      </span>
      <Badge
        className="font-display text-xs py-0"
        style={{ backgroundColor: bg, color: "white", border: "none" }}
      >
        {label}
      </Badge>
    </div>
  );
}

interface HistoryItemProps {
  item: CheckSummary;
  onView: (id: bigint) => void;
  onDelete: (id: bigint) => void;
  isDeleting: boolean;
}

function HistoryItem({ item, onView, onDelete, isDeleting }: HistoryItemProps) {
  return (
    <div
      className="rounded-xl border p-4 sm:p-5 group transition-all duration-150 hover:shadow-card-hover hover:-translate-y-0.5 animate-fade-slide-up"
      style={{
        backgroundColor: "oklch(1 0 0)",
        borderColor: "oklch(0.88 0.015 240)",
        boxShadow: "0 2px 8px oklch(0.18 0.04 255 / 0.05)",
      }}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
          style={{ backgroundColor: "oklch(0.94 0.02 255)", border: "1px solid oklch(0.88 0.015 240)" }}
        >
          <FileSearch className="w-5 h-5" style={{ color: "oklch(0.35 0.1 255)" }} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <ScoreBadge score={item.overallScore} />
            <div className="flex items-center gap-1 text-xs font-display text-muted-foreground shrink-0">
              <ClockIcon className="w-3 h-3" />
              <span>{formatTimestamp(item.timestamp)}</span>
            </div>
          </div>

          <p className="font-serif text-sm leading-relaxed text-foreground line-clamp-2 mb-3">
            {item.preview || "No preview available."}
          </p>

          <div className="flex items-center justify-between">
            <span className="font-display text-xs text-muted-foreground">
              {item.wordCount.toString()} words
            </span>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onDelete(item.id)}
                disabled={isDeleting}
                className="font-display text-xs gap-1.5 text-muted-foreground hover:text-destructive"
              >
                {isDeleting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5" />
                )}
                Delete
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={() => onView(item.id)}
                className="font-display text-xs gap-1.5"
                style={{
                  backgroundColor: "oklch(0.28 0.08 255)",
                  color: "white",
                }}
              >
                View Result
                <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HistorySkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="rounded-xl border p-5"
          style={{ borderColor: "oklch(0.88 0.015 240)" }}
        >
          <div className="flex items-start gap-4">
            <Skeleton className="w-10 h-10 rounded-lg shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <div className="flex justify-between pt-1">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-28" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function HistoryPage() {
  const [selectedId, setSelectedId] = useState<bigint | null>(null);
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const [showReport, setShowReport] = useState(false);

  const { data: history, isLoading, isError } = useGetHistory();
  const { data: selectedResult, isLoading: isLoadingResult } = useGetCheck(selectedId);
  const { mutate: deleteCheck } = useDeleteCheck();

  const handleDelete = (id: bigint) => {
    const idStr = id.toString();
    setDeletingIds((prev) => new Set([...prev, idStr]));
    deleteCheck(id, {
      onSettled: () => {
        setDeletingIds((prev) => {
          const next = new Set(prev);
          next.delete(idStr);
          return next;
        });
      },
    });
  };

  const handleView = (id: bigint) => {
    setSelectedId(id);
  };

  const handleBack = () => {
    setSelectedId(null);
    setShowReport(false);
  };

  // Detail view
  if (selectedId !== null) {
    return (
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center gap-3 mb-6 animate-fade-in">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleBack}
            className="font-display gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to History
          </Button>
          <span className="font-display text-sm text-muted-foreground">
            Check #{selectedId.toString()}
          </span>
        </div>

        {isLoadingResult && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-3">
              <Loader2 className="w-8 h-8 animate-spin mx-auto" style={{ color: "oklch(0.28 0.08 255)" }} />
              <p className="font-display text-sm text-muted-foreground">Loading result…</p>
            </div>
          </div>
        )}

        {selectedResult && (
          <div className="space-y-6 animate-fade-slide-up">
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
                  <ScoreGauge score={selectedResult.overallScore} size={160} />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h2
                    className="font-display font-bold text-xl mb-2"
                    style={{ color: "oklch(0.2 0.075 255)" }}
                  >
                    Check #{selectedResult.id.toString()}
                  </h2>
                  <p className="font-display text-sm text-muted-foreground mb-4">
                    {selectedResult.segments.filter((s) => s.flagged).length} flagged segments out of{" "}
                    {selectedResult.segments.length} total. Click highlighted passages to view alternatives.
                  </p>
                </div>
                <div className="shrink-0">
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
                    Generate Report
                  </Button>
                </div>
              </div>
            </div>

            {/* Annotated text */}
            <div
              className="rounded-2xl border p-6 sm:p-8"
              style={{
                backgroundColor: "oklch(1 0 0)",
                borderColor: "oklch(0.88 0.015 240)",
                boxShadow: "0 4px 24px oklch(0.18 0.04 255 / 0.06)",
              }}
            >
              <h2
                className="font-display font-semibold text-base mb-4"
                style={{ color: "oklch(0.2 0.075 255)" }}
              >
                Annotated Text
              </h2>
              <AnnotatedText segments={selectedResult.segments} />
            </div>
          </div>
        )}

        {!isLoadingResult && !selectedResult && (
          <div
            className="rounded-2xl border p-10 text-center"
            style={{ borderColor: "oklch(0.88 0.015 240)", backgroundColor: "oklch(1 0 0)" }}
          >
            <AlertTriangle className="w-10 h-10 mx-auto mb-3" style={{ color: "oklch(0.65 0.18 72)" }} />
            <p className="font-display font-semibold text-foreground mb-1">Result Not Found</p>
            <p className="font-display text-sm text-muted-foreground">
              This check result is no longer available.
            </p>
          </div>
        )}

        {showReport && selectedResult && (
          <ReportModal result={selectedResult} onClose={() => setShowReport(false)} />
        )}
      </main>
    );
  }

  // History list view
  return (
    <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8 animate-fade-slide-up">
        <h1
          className="font-display font-bold text-2xl sm:text-3xl mb-1"
          style={{ color: "oklch(0.2 0.075 255)" }}
        >
          Check History
        </h1>
        <p className="font-display text-sm text-muted-foreground">
          Review and revisit your previous plagiarism checks
        </p>
      </div>

      {isLoading && <HistorySkeleton />}

      {isError && (
        <div
          className="rounded-xl border p-8 text-center animate-fade-in"
          style={{ borderColor: "oklch(0.8 0.16 25 / 0.4)", backgroundColor: "oklch(0.97 0.04 25)" }}
        >
          <AlertTriangle className="w-8 h-8 mx-auto mb-3" style={{ color: "oklch(0.55 0.22 25)" }} />
          <p className="font-display font-semibold" style={{ color: "oklch(0.42 0.18 25)" }}>
            Failed to load history
          </p>
          <p className="font-display text-sm text-muted-foreground mt-1">
            Please refresh the page and try again.
          </p>
        </div>
      )}

      {!isLoading && !isError && (!history || history.length === 0) && (
        <div
          className="rounded-2xl border p-12 text-center animate-fade-in"
          style={{ borderColor: "oklch(0.88 0.015 240)", backgroundColor: "oklch(1 0 0)" }}
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: "oklch(0.94 0.02 255)" }}
          >
            <ClockIcon className="w-8 h-8" style={{ color: "oklch(0.5 0.08 255)" }} />
          </div>
          <h2 className="font-display font-semibold text-lg mb-2" style={{ color: "oklch(0.2 0.075 255)" }}>
            No checks yet
          </h2>
          <p className="font-display text-sm text-muted-foreground max-w-sm mx-auto">
            Your plagiarism check history will appear here. Start by checking a document from the Checker tab.
          </p>
        </div>
      )}

      {!isLoading && !isError && history && history.length > 0 && (
        <div className="space-y-4">
          {history.map((item) => (
            <HistoryItem
              key={item.id.toString()}
              item={item}
              onView={handleView}
              onDelete={handleDelete}
              isDeleting={deletingIds.has(item.id.toString())}
            />
          ))}
        </div>
      )}
    </main>
  );
}
