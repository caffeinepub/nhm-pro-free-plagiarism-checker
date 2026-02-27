import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  Clock,
  Inbox,
  Loader2,
  RefreshCw,
  Trash2,
  User,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useDeleteSuggestion, useListSuggestions } from "../hooks/useQueries";

function formatTimestamp(ts: bigint): string {
  // Motoko timestamps are nanoseconds since epoch
  const ms = Number(ts / BigInt(1_000_000));
  const date = new Date(ms);
  if (Number.isNaN(date.getTime())) return "Unknown date";
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function AdminInboxPage() {
  const {
    data: suggestions = [],
    isLoading,
    isError,
    refetch,
  } = useListSuggestions();
  const { mutate: deleteSuggestion, isPending: isDeleting } =
    useDeleteSuggestion();
  const [deletingId, setDeletingId] = useState<bigint | null>(null);

  const handleDelete = (id: bigint) => {
    setDeletingId(id);
    deleteSuggestion(id, {
      onSuccess: () => {
        toast.success("Suggestion deleted.");
        setDeletingId(null);
      },
      onError: () => {
        toast.error("Could not delete. Please try again.");
        setDeletingId(null);
      },
    });
  };

  return (
    <main className="flex-1">
      {/* Header */}
      <section
        className="relative overflow-hidden py-10 sm:py-14"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.15 0.055 260) 0%, oklch(0.2 0.075 255) 100%)",
        }}
      >
        {/* Decorative blobs */}
        <div
          className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-10 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, oklch(0.7 0.14 255) 0%, transparent 70%)",
            transform: "translate(30%, -30%)",
          }}
          aria-hidden="true"
        />
        <div
          className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-10 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, oklch(0.65 0.18 200) 0%, transparent 70%)",
            transform: "translate(-30%, 30%)",
          }}
          aria-hidden="true"
        />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: "oklch(1 0 0 / 0.12)",
                    border: "1px solid oklch(1 0 0 / 0.18)",
                  }}
                >
                  <Inbox className="w-5 h-5 text-white" />
                </div>
                <h1 className="font-display font-bold text-2xl sm:text-3xl text-white leading-tight">
                  Suggestions Inbox
                </h1>
              </div>
              <p
                className="font-display text-sm"
                style={{ color: "oklch(0.78 0.05 245)" }}
              >
                All suggestions submitted by users of NHM Pro.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {!isLoading && suggestions.length > 0 && (
                <Badge
                  className="font-display font-semibold px-3 py-1 text-sm rounded-full"
                  style={{
                    backgroundColor: "oklch(1 0 0 / 0.14)",
                    color: "oklch(0.92 0.04 240)",
                    border: "1px solid oklch(1 0 0 / 0.2)",
                  }}
                >
                  {suggestions.length}{" "}
                  {suggestions.length === 1 ? "message" : "messages"}
                </Badge>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                disabled={isLoading}
                className="font-display font-medium gap-2"
                style={{
                  backgroundColor: "oklch(1 0 0 / 0.1)",
                  borderColor: "oklch(1 0 0 / 0.22)",
                  color: "white",
                }}
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2
              className="w-8 h-8 animate-spin"
              style={{ color: "oklch(0.45 0.12 255)" }}
            />
            <p
              className="font-display text-sm"
              style={{ color: "oklch(0.45 0.04 240)" }}
            >
              Loading suggestions…
            </p>
          </div>
        )}

        {isError && (
          <div
            className="rounded-xl p-5 flex items-start gap-3"
            style={{
              backgroundColor: "oklch(0.97 0.04 25)",
              border: "1px solid oklch(0.82 0.14 25 / 0.35)",
            }}
          >
            <AlertTriangle
              className="w-5 h-5 shrink-0 mt-0.5"
              style={{ color: "oklch(0.55 0.22 25)" }}
            />
            <div>
              <p
                className="font-display font-semibold text-sm"
                style={{ color: "oklch(0.38 0.2 25)" }}
              >
                Failed to load suggestions
              </p>
              <p
                className="font-display text-xs mt-1"
                style={{ color: "oklch(0.5 0.15 25)" }}
              >
                The backend may be unavailable. Try refreshing.
              </p>
            </div>
          </div>
        )}

        {!isLoading && !isError && suggestions.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{
                backgroundColor: "oklch(0.96 0.012 255)",
                border: "1.5px dashed oklch(0.78 0.055 255)",
              }}
            >
              <Inbox
                className="w-7 h-7"
                style={{ color: "oklch(0.58 0.1 255)" }}
              />
            </div>
            <p
              className="font-display font-semibold text-base"
              style={{ color: "oklch(0.3 0.06 255)" }}
            >
              No suggestions yet
            </p>
            <p
              className="font-display text-sm max-w-xs"
              style={{ color: "oklch(0.52 0.04 240)" }}
            >
              When users submit feedback from the Suggestions tab, it will
              appear here.
            </p>
          </div>
        )}

        {!isLoading && !isError && suggestions.length > 0 && (
          <div className="space-y-4">
            {[...suggestions]
              .sort((a, b) => (a.timestamp > b.timestamp ? -1 : 1))
              .map((s) => {
                const isDeletingThis = deletingId === s.id;
                return (
                  <article
                    key={s.id.toString()}
                    className="rounded-2xl border overflow-hidden transition-all duration-200"
                    style={{
                      backgroundColor: "oklch(1 0 0)",
                      borderColor: "oklch(0.9 0.012 240)",
                      boxShadow: "0 2px 12px oklch(0.18 0.04 255 / 0.05)",
                      opacity: isDeletingThis ? 0.5 : 1,
                    }}
                  >
                    {/* Meta bar */}
                    <div
                      className="flex items-center justify-between gap-4 px-5 py-3 border-b"
                      style={{
                        backgroundColor: "oklch(0.985 0.006 250)",
                        borderColor: "oklch(0.9 0.012 240)",
                      }}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Avatar */}
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-display font-bold"
                          style={{
                            backgroundColor: "oklch(0.88 0.065 255)",
                            color: "oklch(0.28 0.08 255)",
                          }}
                        >
                          {s.name ? (
                            s.name.charAt(0).toUpperCase()
                          ) : (
                            <User className="w-4 h-4" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p
                            className="font-display font-semibold text-sm truncate"
                            style={{ color: "oklch(0.22 0.07 255)" }}
                          >
                            {s.name ?? "Anonymous"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div
                          className="flex items-center gap-1.5 text-xs font-display"
                          style={{ color: "oklch(0.52 0.04 240)" }}
                        >
                          <Clock className="w-3.5 h-3.5" />
                          <span>{formatTimestamp(s.timestamp)}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(s.id)}
                          disabled={isDeleting || isDeletingThis}
                          aria-label="Delete suggestion"
                          className="w-8 h-8 rounded-lg transition-colors"
                          style={{ color: "oklch(0.58 0.18 25)" }}
                        >
                          {isDeletingThis ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Message body */}
                    <div className="px-5 py-4">
                      <p
                        className="font-display text-sm leading-relaxed whitespace-pre-wrap"
                        style={{ color: "oklch(0.22 0.04 255)" }}
                      >
                        {s.message}
                      </p>
                    </div>
                  </article>
                );
              })}
          </div>
        )}
      </section>
    </main>
  );
}
