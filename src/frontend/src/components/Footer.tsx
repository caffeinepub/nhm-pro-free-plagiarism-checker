import { Heart, ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer
      className="no-print mt-auto border-t py-6"
      style={{
        borderColor: "oklch(0.88 0.015 240)",
        backgroundColor: "oklch(0.98 0.005 240)",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded flex items-center justify-center"
              style={{ backgroundColor: "oklch(0.28 0.08 255)" }}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-white" />
            </div>
            <span
              className="font-display font-semibold text-sm"
              style={{ color: "oklch(0.28 0.08 255)" }}
            >
              NHM Pro Free Plagiarism Checker
            </span>
          </div>

          <div className="flex items-center gap-1 font-display text-xs text-muted-foreground">
            <span>© 2026. Built with</span>
            <Heart
              className="w-3 h-3 fill-current"
              style={{ color: "oklch(0.55 0.22 25)" }}
            />
            <span>using</span>
            <a
              href="https://caffeine.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold transition-colors hover:underline"
              style={{ color: "oklch(0.35 0.1 255)" }}
            >
              caffeine.ai
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
