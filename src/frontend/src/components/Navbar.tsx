interface NavbarProps {
  activePage: "checker" | "history" | "suggestions";
  onNavigate: (page: "checker" | "history" | "suggestions") => void;
}

export function Navbar({ activePage, onNavigate }: NavbarProps) {
  return (
    <header
      className="sticky top-0 z-40 no-print"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.2 0.075 255) 0%, oklch(0.28 0.08 255) 60%, oklch(0.26 0.1 248) 100%)",
        boxShadow: "0 2px 20px oklch(0.18 0.06 255 / 0.4)",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo + name */}
          <button
            type="button"
            className="flex items-center gap-3 group"
            onClick={() => onNavigate("checker")}
          >
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 overflow-hidden"
              style={{
                backgroundColor: "oklch(1 0 0 / 0.15)",
                border: "1px solid oklch(1 0 0 / 0.2)",
              }}
            >
              <img
                src="/assets/generated/nhm-logo-transparent.dim_128x128.png"
                alt="NHM Pro logo"
                className="w-7 h-7 object-contain"
              />
            </div>
            <div className="hidden sm:block">
              <div className="font-display font-bold text-white text-sm leading-tight">
                NHM Pro
              </div>
              <div
                className="font-display text-xs leading-tight"
                style={{ color: "oklch(0.85 0.04 240)" }}
              >
                Free Plagiarism Checker
              </div>
            </div>
            <div className="block sm:hidden">
              <div className="font-display font-bold text-white text-sm">
                NHM Pro
              </div>
            </div>
          </button>

          {/* Nav tabs */}
          <nav className="flex items-center gap-1">
            {(["checker", "history", "suggestions"] as const).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => onNavigate(page)}
                className="font-display font-medium text-sm px-4 py-2 rounded-lg transition-all duration-150 capitalize"
                style={{
                  backgroundColor:
                    activePage === page ? "oklch(1 0 0 / 0.15)" : "transparent",
                  color: activePage === page ? "white" : "oklch(0.82 0.04 240)",
                  border:
                    activePage === page
                      ? "1px solid oklch(1 0 0 / 0.2)"
                      : "1px solid transparent",
                }}
              >
                {page === "checker"
                  ? "Checker"
                  : page === "history"
                    ? "History"
                    : "Suggestions"}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
