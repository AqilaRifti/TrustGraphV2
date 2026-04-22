import { Routes, Route } from "react-router";
import Navigation from "@/components/Navigation";
import LandingPage from "@/pages/LandingPage";
import TokenPage from "@/pages/TokenPage";
import WalletPage from "@/pages/WalletPage";
import GraphPage from "@/pages/GraphPage";
import ScanPage from "@/pages/ScanPage";
import ComparePage from "@/pages/ComparePage";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white">
      <Navigation />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/token/:address" element={<TokenPage />} />
        <Route path="/wallet/:address" element={<WalletPage />} />
        <Route path="/graph" element={<GraphPage />} />
        <Route path="/scan" element={<ScanPage />} />
        <Route path="/compare" element={<ComparePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
