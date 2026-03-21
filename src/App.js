import { useState } from "react";
import "./index.css";
import Navbar from "./components/Navbar";
import VoiceAssistant from "./components/VoiceAssistant";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import CropJournal from "./pages/CropJournal";
import MandiIntel from "./pages/MandiIntel";
import QRTrace from "./pages/QRTrace";
import NewsPage from "./pages/NewsPage";
import PoliciesPage from "./pages/PoliciesPage";
import CropIntel from "./pages/CropIntel";

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [history, setHistory] = useState(["home"]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const navigateTo = (page) => {
    if (page === currentPage) return;
    const newHistory = [...history.slice(0, historyIndex + 1), page];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setCurrentPage(page);
  };

  const goBack = () => {
    if (historyIndex <= 0) return;
    const newIndex = historyIndex - 1;
    setHistoryIndex(newIndex);
    setCurrentPage(history[newIndex]);
  };

  const goForward = () => {
    if (historyIndex >= history.length - 1) return;
    const newIndex = historyIndex + 1;
    setHistoryIndex(newIndex);
    setCurrentPage(history[newIndex]);
  };

  const renderPage = () => {
    if (currentPage === "home") return <LandingPage setCurrentPage={navigateTo} />;
    if (currentPage === "dashboard") return <Dashboard setCurrentPage={navigateTo} />;
    if (currentPage === "journal") return <CropJournal />;
    if (currentPage === "mandi") return <MandiIntel />;
    if (currentPage === "qr") return <QRTrace />;
    if (currentPage === "news") return <NewsPage />;
    if (currentPage === "policies") return <PoliciesPage />;
    if (currentPage === "cropwar") return <CropIntel />;
    return <LandingPage setCurrentPage={navigateTo} />;
  };

  return (
    <div>
      <Navbar
        currentPage={currentPage}
        setCurrentPage={navigateTo}
        canGoBack={historyIndex > 0}
        canGoForward={historyIndex < history.length - 1}
        goBack={goBack}
        goForward={goForward}
      />
      <VoiceAssistant setCurrentPage={navigateTo} />
      {renderPage()}
    </div>
  );
}

export default App;