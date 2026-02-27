import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  CheckCircle2,
  Lightbulb,
  Loader2,
  Send,
} from "lucide-react";
import { useState } from "react";
import { useSubmitSuggestion } from "../hooks/useQueries";

export function SuggestionsPage() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const {
    mutate: submitSuggestion,
    isPending,
    isError,
    error,
  } = useSubmitSuggestion();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!message.trim()) {
      setValidationError("Please describe your suggestion before sending.");
      return;
    }

    submitSuggestion(
      { name: name.trim() || null, message: message.trim() },
      {
        onSuccess: () => {
          setSubmitted(true);
        },
      },
    );
  };

  const handleReset = () => {
    setName("");
    setMessage("");
    setSubmitted(false);
    setValidationError(null);
  };

  return (
    <main className="flex-1">
      {/* Header section */}
      <section
        className="relative overflow-hidden py-12 sm:py-16"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.97 0.015 255) 0%, oklch(0.99 0.005 240) 100%)",
        }}
      >
        {/* Decorative blobs */}
        <div
          className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-20 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, oklch(0.6 0.12 248) 0%, transparent 70%)",
            transform: "translate(30%, -30%)",
          }}
          aria-hidden="true"
        />
        <div
          className="absolute bottom-0 left-0 w-56 h-56 rounded-full opacity-10 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, oklch(0.55 0.18 145) 0%, transparent 70%)",
            transform: "translate(-30%, 30%)",
          }}
          aria-hidden="true"
        />

        <div className="max-w-2xl mx-auto px-4 sm:px-6 relative">
          {/* Heading */}
          <div className="text-center mb-10">
            <div
              className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.2 0.075 255) 0%, oklch(0.28 0.08 255) 100%)",
                boxShadow: "0 4px 16px oklch(0.28 0.08 255 / 0.25)",
              }}
            >
              <Lightbulb className="w-7 h-7 text-white" />
            </div>
            <h1
              className="font-display font-extrabold text-3xl sm:text-4xl leading-tight mb-3"
              style={{ color: "oklch(0.2 0.075 255)" }}
            >
              Share Your{" "}
              <span
                style={{
                  background:
                    "linear-gradient(90deg, oklch(0.45 0.16 255) 0%, oklch(0.55 0.18 248) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Ideas
              </span>
            </h1>
            <p
              className="font-display text-base sm:text-lg"
              style={{ color: "oklch(0.45 0.04 240)" }}
            >
              Help us improve NHM Pro. Your feedback shapes what gets built
              next.
            </p>
          </div>

          {/* Card */}
          <div
            className="rounded-2xl border shadow-card overflow-hidden"
            style={{
              backgroundColor: "oklch(1 0 0)",
              borderColor: "oklch(0.88 0.015 240)",
              boxShadow: "0 4px 24px oklch(0.18 0.04 255 / 0.06)",
            }}
          >
            {submitted ? (
              /* ── Success state ── */
              <div className="p-8 sm:p-10 flex flex-col items-center text-center gap-5">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: "oklch(0.92 0.08 145 / 0.25)",
                    border: "2px solid oklch(0.72 0.12 145 / 0.4)",
                  }}
                >
                  <CheckCircle2
                    className="w-8 h-8"
                    style={{ color: "oklch(0.48 0.16 145)" }}
                  />
                </div>
                <div>
                  <h2
                    className="font-display font-bold text-xl mb-2"
                    style={{ color: "oklch(0.2 0.075 255)" }}
                  >
                    Thank you!
                  </h2>
                  <p
                    className="font-display text-sm leading-relaxed max-w-sm"
                    style={{ color: "oklch(0.45 0.04 240)" }}
                  >
                    Your suggestion has been received. We genuinely read every
                    message and use them to make the app better.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  className="font-display font-medium mt-2"
                  style={{
                    borderColor: "oklch(0.82 0.04 255)",
                    color: "oklch(0.35 0.08 255)",
                  }}
                >
                  Send another suggestion
                </Button>
              </div>
            ) : (
              /* ── Form ── */
              <form onSubmit={handleSubmit} noValidate>
                <div className="p-6 sm:p-8 space-y-5">
                  {/* Name field */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="suggestion-name"
                      className="font-display text-sm font-medium"
                      style={{ color: "oklch(0.28 0.07 255)" }}
                    >
                      Your name{" "}
                      <span
                        className="font-normal text-xs"
                        style={{ color: "oklch(0.55 0.03 240)" }}
                      >
                        (optional)
                      </span>
                    </label>
                    <input
                      id="suggestion-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name (optional)"
                      autoComplete="name"
                      disabled={isPending}
                      className="w-full rounded-lg px-4 py-2.5 font-display text-sm outline-none transition-all duration-200 disabled:opacity-50"
                      style={{
                        border: "1.5px solid oklch(0.88 0.015 240)",
                        backgroundColor: "oklch(0.99 0.003 240)",
                        color: "oklch(0.18 0.04 255)",
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor =
                          "oklch(0.55 0.12 255)";
                        e.currentTarget.style.boxShadow =
                          "0 0 0 3px oklch(0.55 0.12 255 / 0.12)";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor =
                          "oklch(0.88 0.015 240)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    />
                  </div>

                  {/* Message field */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="suggestion-message"
                      className="font-display text-sm font-medium"
                      style={{ color: "oklch(0.28 0.07 255)" }}
                    >
                      Your suggestion{" "}
                      <span
                        className="font-normal text-xs"
                        style={{ color: "oklch(0.55 0.22 25)" }}
                      >
                        (required)
                      </span>
                    </label>
                    <textarea
                      id="suggestion-message"
                      value={message}
                      onChange={(e) => {
                        setMessage(e.target.value);
                        if (validationError) setValidationError(null);
                      }}
                      placeholder="Describe your suggestion for improving the app..."
                      rows={5}
                      disabled={isPending}
                      className="w-full rounded-lg px-4 py-3 font-display text-sm outline-none resize-none transition-all duration-200 disabled:opacity-50"
                      style={{
                        border: `1.5px solid ${
                          validationError
                            ? "oklch(0.72 0.18 25)"
                            : "oklch(0.88 0.015 240)"
                        }`,
                        backgroundColor: validationError
                          ? "oklch(0.99 0.01 25)"
                          : "oklch(0.99 0.003 240)",
                        color: "oklch(0.18 0.04 255)",
                      }}
                      onFocus={(e) => {
                        if (!validationError) {
                          e.currentTarget.style.borderColor =
                            "oklch(0.55 0.12 255)";
                          e.currentTarget.style.boxShadow =
                            "0 0 0 3px oklch(0.55 0.12 255 / 0.12)";
                        }
                      }}
                      onBlur={(e) => {
                        if (!validationError) {
                          e.currentTarget.style.borderColor =
                            "oklch(0.88 0.015 240)";
                          e.currentTarget.style.boxShadow = "none";
                        }
                      }}
                    />

                    {/* Validation error */}
                    {validationError && (
                      <p
                        className="flex items-center gap-1.5 font-display text-xs"
                        style={{ color: "oklch(0.5 0.2 25)" }}
                        role="alert"
                      >
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                        {validationError}
                      </p>
                    )}
                  </div>

                  {/* Backend error */}
                  {isError && (
                    <div
                      className="rounded-lg p-3 flex items-start gap-2.5"
                      style={{
                        backgroundColor: "oklch(0.97 0.04 25)",
                        border: "1px solid oklch(0.8 0.16 25 / 0.4)",
                      }}
                      role="alert"
                    >
                      <AlertTriangle
                        className="w-4 h-4 shrink-0 mt-0.5"
                        style={{ color: "oklch(0.55 0.22 25)" }}
                      />
                      <p
                        className="font-display text-sm"
                        style={{ color: "oklch(0.42 0.18 25)" }}
                      >
                        {error?.message ??
                          "Something went wrong. Please try again."}
                      </p>
                    </div>
                  )}
                </div>

                {/* Footer bar */}
                <div
                  className="px-6 sm:px-8 py-4 flex items-center justify-between gap-4 border-t"
                  style={{
                    borderColor: "oklch(0.92 0.01 240)",
                    backgroundColor: "oklch(0.98 0.005 240)",
                  }}
                >
                  <p
                    className="font-display text-xs"
                    style={{ color: "oklch(0.55 0.03 240)" }}
                  >
                    All suggestions are read personally by the developer.
                  </p>
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="font-display font-semibold gap-2 shrink-0"
                    style={
                      isPending
                        ? undefined
                        : {
                            backgroundColor: "oklch(0.28 0.08 255)",
                            color: "white",
                            boxShadow: "0 2px 12px oklch(0.28 0.08 255 / 0.4)",
                          }
                    }
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Sending…
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Suggestion
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </div>

          {/* Info strip */}
          {!submitted && (
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              {[
                "Feature requests welcome",
                "Bug reports appreciated",
                "UX feedback valued",
              ].map((text) => (
                <div
                  key={text}
                  className="flex items-center gap-2 text-xs font-display px-3 py-1.5 rounded-full"
                  style={{
                    backgroundColor: "oklch(1 0 0)",
                    border: "1.5px solid oklch(0.88 0.015 240)",
                    color: "oklch(0.38 0.07 255)",
                    boxShadow: "0 1px 4px oklch(0.18 0.04 255 / 0.05)",
                  }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: "oklch(0.55 0.14 255)" }}
                    aria-hidden="true"
                  />
                  {text}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
