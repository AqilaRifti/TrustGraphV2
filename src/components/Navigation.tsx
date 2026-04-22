import { Link, useLocation } from "react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Search, Menu, X, Bell, Github } from "lucide-react";
import { trpc } from "@/providers/trpc";

const navLinks = [
  { path: "/", label: "Leaderboard" },
  { path: "/graph", label: "Graph" },
  { path: "/scan", label: "Scan" },
  { path: "/compare", label: "Compare" },
];

export default function Navigation() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [alertsOpen, setAlertsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: alertsData } = trpc.token.stats.useQuery();
  const { data: alertsList } = trpc.token.list.useQuery({ limit: 20 });

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0A0A0B]/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
              <Shield size={18} className="text-[#0A0A0B]" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-white tracking-tight">TrustGraph</span>
              <span className="hidden sm:inline text-[10px] font-mono text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded">BETA</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.path) ? "text-white bg-white/10" : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <button onClick={() => setSearchOpen(!searchOpen)} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
              <Search size={18} />
            </button>

            <button onClick={() => setAlertsOpen(!alertsOpen)} className="relative p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
              <Bell size={18} />
              {alertsData && alertsData.active_alerts > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center">{alertsData.active_alerts}</span>
              )}
            </button>

            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hidden sm:flex p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
              <Github size={18} />
            </a>

            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {searchOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="border-t border-white/5 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search token name, symbol, or paste address..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-400/50 font-mono"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && searchQuery) {
                      window.location.href = `/token/${searchQuery}`;
                    }
                  }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {alertsOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="border-t border-white/5 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 max-h-72 overflow-y-auto">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Live Alerts</div>
              {alertsList && alertsList.slice(0, 8).map((entry) => (
                <Link
                  key={entry.token.address}
                  to={`/token/${entry.token.address}`}
                  onClick={() => setAlertsOpen(false)}
                  className={`flex items-start gap-3 py-2 border-b border-white/[0.03] hover:bg-white/[0.02] rounded-lg px-2 transition-colors`}
                >
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                    entry.trust_score && entry.trust_score.tier === "DANGER" ? "bg-red-500" :
                    entry.trust_score && entry.trust_score.tier === "RISKY" ? "bg-amber-500" : "bg-emerald-500"
                  }`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-gray-400">{entry.token.symbol} - {entry.token.name}</div>
                    <div className="text-sm text-white/80">Score: {entry.trust_score?.score || "N/A"}/100</div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="md:hidden border-t border-white/5 overflow-hidden">
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => (
                <Link key={link.path} to={link.path} onClick={() => setMenuOpen(false)} className={`block px-3 py-2 rounded-lg text-sm font-medium ${isActive(link.path) ? "text-white bg-white/10" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
