import { ShieldCheck } from "lucide-react";

type Page = "checker" | "history" | "suggestions" | "admin";

interface NavbarProps {
  activePage: Page;
  onNavigate: (page: Page) => void;
}

const NAV_ITEMS: { id: Page; label: string }[] = [
  { id: "checker", label: "Checker" },
  { id: "history", label: "History" },
  { id: "suggestions", label: "Suggestions" },
];

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
            {NAV_ITEMS.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => onNavigate(id)}
                className="font-display font-medium text-sm px-3 py-2 rounded-lg transition-all duration-150"
                style={{
                  backgroundColor:
                    activePage === id ? "oklch(1 0 0 / 0.15)" : "transparent",
                  color: activePage === id ? "white" : "oklch(0.82 0.04 240)",
                  border:
                    activePage === id
                      ? "1px solid oklch(1 0 0 / 0.2)"
                      : "1px solid transparent",
                }}
              >
                {label}
              </button>
            ))}

            {/* Admin tab — visually separated */}
            <div
              className="w-px h-5 mx-1"
              style={{ backgroundColor: "oklch(1 0 0 / 0.2)" }}
              aria-hidden="true"
            />
            <button
              type="button"
              onClick={() => onNavigate("admin")}
              className="font-display font-medium text-sm px-3 py-2 rounded-lg transition-all duration-150 flex items-center gap-1.5"
              style={{
                backgroundColor:
                  activePage === "admin"
                    ? "oklch(0.62 0.18 145 / 0.25)"
                    : "transparent",
                color:
                  activePage === "admin"
                    ? "oklch(0.88 0.1 145)"
                    : "oklch(0.72 0.1 145)",
                border:
                  activePage === "admin"
                    ? "1px solid oklch(0.62 0.18 145 / 0.4)"
                    : "1px solid transparent",
              }}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Admin</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
