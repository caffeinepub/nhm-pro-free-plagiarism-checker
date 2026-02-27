import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertTriangle,
  ArrowLeft,
  Bot,
  ChevronRight,
  ClockIcon,
  FileSearch,
  Loader2,
  PrinterIcon,
  Search,
  Trash2,
  Zap,
} from "lucide-react";
import { useState } from "react";
import type { CheckRecord } from "../backend.d";
import { useDeleteCheck, useListChecks } from "../hooks/useQueries";

function formatTimestamp(ts: bigint): string {
  // timestamp in nanoseconds
  const ms = Number(ts / BigInt(1_000_000));
  const date = new Date(ms);
  if (Number.isNaN(date.getTime())) return "Unknown date";
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function ScoreBadge({ score, label }: { score: number; label?: string }) {
  const pct = Math.round(score * 100);
  let color = "oklch(0.55 0.18 145)";
  let riskLabel = "Low";
  if (pct > 60) {
    color = "oklch(0.55 0.22 25)";
    riskLabel = "High";
  } else if (pct > 30) {
    color = "oklch(0.65 0.18 72)";
    riskLabel = "Moderate";
  }

  return (
    <div className="flex items-center gap-1.5">
      <span className="font-display font-bold text-sm" style={{ color }}>
        {pct}%
      </span>
      <Badge
        className="font-display text-xs py-0"
        style={{ backgroundColor: color, color: "white", border: "none" }}
      >
        {label ?? riskLabel}
      </Badge>
    </div>
  );
}

function ModeIcon({ mode }: { mode: string }) {
  if (mode === "ai")
    return <Bot className="w-5 h-5" style={{ color: "oklch(0.45 0.2 300)" }} />;
  if (mode === "both")
    return (
      <Zap className="w-5 h-5" style={{ color: "oklch(0.38 0.12 255)" }} />
    );
  return (
    <Search className="w-5 h-5" style={{ color: "oklch(0.35 0.1 255)" }} />
  );
}

interface HistoryItemProps {
  item: CheckRecord;
  onDelete: (id: bigint) => void;
  isDeleting: boolean;
}

function HistoryItem({ item, onDelete, isDeleting }: HistoryItemProps) {
  const preview =
    item.text.length > 160 ? `${item.text.slice(0, 157)}…` : item.text;
  const modeLabel =
    item.mode === "ai"
      ? "AI Detection"
      : item.mode === "both"
        ? "Both Checks"
        : "Plagiarism";

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
          style={{
            backgroundColor: "oklch(0.94 0.02 255)",
            border: "1px solid oklch(0.88 0.015 240)",
          }}
        >
          <ModeIcon mode={item.mode} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-2 flex-wrap">
              {(item.mode === "plagiarism" || item.mode === "both") && (
                <ScoreBadge score={item.plagiarismScore} label="Plagiarism" />
              )}
              {(item.mode === "ai" || item.mode === "both") && (
                <div className="flex items-center gap-1.5">
                  <span
                    className="font-display font-bold text-sm"
                    style={{ color: "oklch(0.45 0.2 300)" }}
                  >
                    {Math.round(item.aiScore * 100)}%
                  </span>
                  <Badge
                    className="font-display text-xs py-0"
                    style={{
                      backgroundColor: "oklch(0.45 0.2 300)",
                      color: "white",
                      border: "none",
                    }}
                  >
                    AI
                  </Badge>
                </div>
              )}
              <Badge
                className="font-display text-xs py-0"
                style={{
                  backgroundColor: "oklch(0.94 0.01 240)",
                  color: "oklch(0.35 0.07 255)",
                  border: "1px solid oklch(0.88 0.015 240)",
                }}
              >
                {modeLabel}
              </Badge>
            </div>
            <div className="flex items-center gap-1 text-xs font-display text-muted-foreground shrink-0">
              <ClockIcon className="w-3 h-3" />
              <span>{formatTimestamp(item.timestamp)}</span>
            </div>
          </div>

          <p className="font-serif text-sm leading-relaxed text-foreground line-clamp-2 mb-3">
            {preview}
          </p>

          <div className="flex items-center justify-between">
            <span className="font-display text-xs text-muted-foreground">
              {item.wordCount.toString()} words
            </span>
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
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());

  const { data: history, isLoading, isError } = useListChecks();
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
          Review and manage your previous plagiarism and AI detection checks
        </p>
      </div>

      {isLoading && <HistorySkeleton />}

      {isError && (
        <div
          className="rounded-xl border p-8 text-center animate-fade-in"
          style={{
            borderColor: "oklch(0.8 0.16 25 / 0.4)",
            backgroundColor: "oklch(0.97 0.04 25)",
          }}
        >
          <AlertTriangle
            className="w-8 h-8 mx-auto mb-3"
            style={{ color: "oklch(0.55 0.22 25)" }}
          />
          <p
            className="font-display font-semibold"
            style={{ color: "oklch(0.42 0.18 25)" }}
          >
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
          style={{
            borderColor: "oklch(0.88 0.015 240)",
            backgroundColor: "oklch(1 0 0)",
          }}
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: "oklch(0.94 0.02 255)" }}
          >
            <ClockIcon
              className="w-8 h-8"
              style={{ color: "oklch(0.5 0.08 255)" }}
            />
          </div>
          <h2
            className="font-display font-semibold text-lg mb-2"
            style={{ color: "oklch(0.2 0.075 255)" }}
          >
            No checks yet
          </h2>
          <p className="font-display text-sm text-muted-foreground max-w-sm mx-auto">
            Your plagiarism and AI detection check history will appear here.
            Start by checking a document from the Checker tab.
          </p>
        </div>
      )}

      {!isLoading && !isError && history && history.length > 0 && (
        <div className="space-y-4">
          {history
            .slice()
            .sort((a, b) => Number(b.timestamp - a.timestamp))
            .map((item) => (
              <HistoryItem
                key={item.id.toString()}
                item={item}
                onDelete={handleDelete}
                isDeleting={deletingIds.has(item.id.toString())}
              />
            ))}
        </div>
      )}
    </main>
  );
}
