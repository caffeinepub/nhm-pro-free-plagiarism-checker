import { useState, useRef, useCallback } from "react";
import {
  Search,
  Loader2,
  FileText,
  RotateCcw,
  AlertTriangle,
  BookOpen,
  Zap,
  Infinity as InfinityIcon,
  PrinterIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScoreGauge } from "./ScoreGauge";
import { AnnotatedText } from "./AnnotatedText";
import { ReportModal } from "./ReportModal";
import { useSubmitCheck } from "../hooks/useQueries";
import { analyzeText, type FrontendCheckResult } from "../utils/plagiarismDetector";

function countWords(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

export function CheckerPage() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<FrontendCheckResult | null>(null);
  const [showReport, setShowReport] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const { mutate: submitCheck } = useSubmitCheck();

  const wordCount = countWords(text);
  const charCount = text.length;

  const handleCheck = useCallback(() => {
    if (!text.trim()) return;
    setError(null);
    setIsAnalyzing(true);

    // Run frontend detection synchronously (fast)
    const frontendResult = analyzeText(text);
    setResult(frontendResult);
    setIsAnalyzing(false);

    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);

    // Fire-and-forget: save to backend history
    submitCheck(text);
  }, [text, submitCheck]);

  const handleClear = () => {
    setText("");
    setResult(null);
    setError(null);
    textareaRef.current?.focus();
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    // Auto-grow
    const ta = e.target;
    ta.style.height = "auto";
    ta.style.height = `${Math.max(200, ta.scrollHeight)}px`;
  };

  return (
    <main className="flex-1">
      {/* Hero section */}
      <section
        className="relative overflow-hidden py-16 sm:py-20"
        style={{
          background: "linear-gradient(180deg, oklch(0.97 0.015 255) 0%, oklch(0.99 0.005 240) 100%)",
        }}
      >
        {/* Decorative background elements */}
        <div
          className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-20 pointer-events-none"
          style={{
            background: "radial-gradient(circle, oklch(0.6 0.12 248) 0%, transparent 70%)",
            transform: "translate(30%, -30%)",
          }}
          aria-hidden="true"
        />
        <div
          className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-10 pointer-events-none"
          style={{
            background: "radial-gradient(circle, oklch(0.55 0.18 145) 0%, transparent 70%)",
            transform: "translate(-30%, 30%)",
          }}
          aria-hidden="true"
        />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
          {/* Heading */}
          <div className="text-center mb-10 animate-fade-slide-up">
            <h1
              className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl leading-tight mb-3"
              style={{ color: "oklch(0.2 0.075 255)" }}
            >
              NHM Pro Free{" "}
              <span
                style={{
                  background: "linear-gradient(90deg, oklch(0.45 0.16 255) 0%, oklch(0.55 0.18 248) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Plagiarism Checker
              </span>
            </h1>
            <p className="font-display text-base sm:text-lg" style={{ color: "oklch(0.45 0.04 240)" }}>
              Fast, Free & Unlimited Plagiarism Detection for All Fields of Study
            </p>
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap justify-center gap-2 mb-8 animate-fade-slide-up stagger-2">
            {[
              { icon: Zap, text: "Instant Results" },
              { icon: InfinityIcon, text: "Unlimited Characters" },
              { icon: BookOpen, text: "All Study Fields" },
              { icon: FileText, text: "Free Reports" },
            ].map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="inline-flex items-center gap-1.5 text-xs font-display font-medium px-3 py-1.5 rounded-full"
                style={{
                  backgroundColor: "oklch(1 0 0)",
                  border: "1.5px solid oklch(0.88 0.015 240)",
                  color: "oklch(0.3 0.07 255)",
                  boxShadow: "0 1px 4px oklch(0.18 0.04 255 / 0.06)",
                }}
              >
                <Icon className="w-3 h-3" />
                {text}
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
            {/* Textarea */}
            <div className="p-4 sm:p-6">
              <textarea
                ref={textareaRef}
                value={text}
                onChange={handleTextareaChange}
                placeholder="Paste or type your text here — essays, research papers, dissertations, articles, and more. No character limit."
                className="w-full resize-none outline-none font-serif text-sm sm:text-base leading-relaxed placeholder:font-sans placeholder:text-muted-foreground bg-transparent"
                style={{
                  minHeight: "200px",
                  color: "oklch(0.18 0.04 255)",
                }}
                disabled={isAnalyzing}
              />
            </div>

            {/* Bottom bar */}
            <div
              className="px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 border-t"
              style={{ borderColor: "oklch(0.92 0.01 240)", backgroundColor: "oklch(0.98 0.005 240)" }}
            >
              <div className="flex items-center gap-4">
                <span className="font-display text-xs text-muted-foreground">
                  <span className="font-semibold" style={{ color: "oklch(0.35 0.07 255)" }}>
                    {charCount.toLocaleString()}
                  </span>{" "}
                  characters
                </span>
                <span className="font-display text-xs text-muted-foreground">
                  <span className="font-semibold" style={{ color: "oklch(0.35 0.07 255)" }}>
                    {wordCount.toLocaleString()}
                  </span>{" "}
                  words
                </span>
              </div>

              <div className="flex items-center gap-2">
                {result && (
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
                    backgroundColor: !text.trim() || isAnalyzing ? undefined : "oklch(0.28 0.08 255)",
                    color: !text.trim() || isAnalyzing ? undefined : "white",
                    boxShadow: !text.trim() || isAnalyzing ? undefined : "0 2px 12px oklch(0.28 0.08 255 / 0.4)",
                  }}
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Analyzing…
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      Check Plagiarism
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
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "oklch(0.55 0.22 25)" }} />
              <p className="font-display text-sm" style={{ color: "oklch(0.42 0.18 25)" }}>
                {error}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Results section */}
      {result && (
        <section
          ref={resultsRef}
          className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8 animate-fade-slide-up"
        >
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
              {/* Gauge */}
              <div className="shrink-0">
                <ScoreGauge score={result.overallScore} size={180} />
              </div>

              {/* Summary info */}
              <div className="flex-1 text-center sm:text-left">
                <h2
                  className="font-display font-bold text-xl mb-2"
                  style={{ color: "oklch(0.2 0.075 255)" }}
                >
                  Analysis Complete
                </h2>
                <p className="font-display text-sm text-muted-foreground mb-4">
                  Your text has been analyzed. Highlighted segments indicate potentially plagiarized content.
                  Click any highlighted passage to see rewrite suggestions.
                </p>

                <div className="flex flex-wrap justify-center sm:justify-start gap-4 mb-4">
                  <div className="text-center">
                    <div
                      className="font-display font-bold text-2xl"
                      style={{ color: "oklch(0.28 0.08 255)" }}
                    >
                      {result.segments.filter((s) => s.flagged).length}
                    </div>
                    <div className="font-display text-xs text-muted-foreground">Flagged Segments</div>
                  </div>
                  <div className="w-px bg-border hidden sm:block" />
                  <div className="text-center">
                    <div
                      className="font-display font-bold text-2xl"
                      style={{ color: "oklch(0.28 0.08 255)" }}
                    >
                      {result.segments.length}
                    </div>
                    <div className="font-display text-xs text-muted-foreground">Total Segments</div>
                  </div>
                </div>

                {/* Legend */}
                <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-xs font-display">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-3 h-3 rounded-sm shrink-0"
                      style={{ backgroundColor: "oklch(0.95 0.07 15)", border: "1.5px solid oklch(0.58 0.2 25)" }}
                    />
                    <span className="text-muted-foreground">High (&gt;60%)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-3 h-3 rounded-sm shrink-0"
                      style={{ backgroundColor: "oklch(0.95 0.09 85)", border: "1.5px solid oklch(0.72 0.14 72)" }}
                    />
                    <span className="text-muted-foreground">Moderate (30–60%)</span>
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

          {/* Annotated text */}
          <div
            className="rounded-2xl border p-6 sm:p-8"
            style={{
              backgroundColor: "oklch(1 0 0)",
              borderColor: "oklch(0.88 0.015 240)",
              boxShadow: "0 4px 24px oklch(0.18 0.04 255 / 0.06)",
            }}
          >
            <div className="flex items-center justify-between mb-5">
              <h2
                className="font-display font-semibold text-base"
                style={{ color: "oklch(0.2 0.075 255)" }}
              >
                Annotated Text
              </h2>
              <span className="font-display text-xs text-muted-foreground">
                Click highlighted segments to see alternatives
              </span>
            </div>
            <AnnotatedText segments={result.segments} />
          </div>
        </section>
      )}

      {/* Report modal */}
      {showReport && result && (
        <ReportModal result={result} onClose={() => setShowReport(false)} />
      )}
    </main>
  );
}
