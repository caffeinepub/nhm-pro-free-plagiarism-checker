import { useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "./components/Navbar";
import { CheckerPage } from "./components/CheckerPage";
import { HistoryPage } from "./components/HistoryPage";
import { Footer } from "./components/Footer";

type Page = "checker" | "history";

export default function App() {
  const [activePage, setActivePage] = useState<Page>("checker");

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "oklch(0.98 0.003 240)" }}
    >
      <Navbar activePage={activePage} onNavigate={setActivePage} />

      {activePage === "checker" && <CheckerPage />}
      {activePage === "history" && <HistoryPage />}

      <Footer />
      <Toaster richColors />
    </div>
  );
}
