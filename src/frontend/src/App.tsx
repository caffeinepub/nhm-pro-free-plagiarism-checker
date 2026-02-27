import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import { AdminInboxPage } from "./components/AdminInboxPage";
import { CheckerPage } from "./components/CheckerPage";
import { Footer } from "./components/Footer";
import { HistoryPage } from "./components/HistoryPage";
import { Navbar } from "./components/Navbar";
import { SuggestionsPage } from "./components/SuggestionsPage";

type Page = "checker" | "history" | "suggestions" | "admin";

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
      {activePage === "suggestions" && <SuggestionsPage />}
      {activePage === "admin" && <AdminInboxPage />}

      <Footer />
      <Toaster richColors />
    </div>
  );
}
