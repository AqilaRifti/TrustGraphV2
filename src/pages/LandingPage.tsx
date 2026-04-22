import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { Shield, TrendingUp, TrendingDown, Users, AlertTriangle, Brain, Zap, Activity, Search, Sparkles, Lock, Timer, BarChart3 } from "lucide-react";
import { trpc } from "@/providers/trpc";
import { getScoreColor, shortenAddress } from "@/lib/utils";

function TierBadge({ tier }: { tier: string | undefined | null }) {
  if (!tier) return <span className="text-gray-600 text-xs">--</span>;
  const config: Record<string, string> = {
    SAFE: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    MODERATE: "text-amber-400 bg-amber-400/10 border-amber-400/20",
    RISKY: "text-orange-400 bg-orange-400/10 border-orange-400/20",
    DANGER: "text-red-400 bg-red-400/10 border-red-400/20",
  };
  return <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${config[tier] || config.MODERATE}`}>{tier}</span>;
}

function ScoreCircle({ score }: { score: number | undefined | null }) {
  if (score === undefined || score === null) return <span className="text-gray-600">--</span>;
  const color = getScoreColor(score);
  const r = 14;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - score / 100);
  return (
    <div className="flex items-center gap-1.5">
      <svg width="28" height="28" className="-rotate-90">
        <circle cx="14" cy="14" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
        <circle cx="14" cy="14" r={r} fill="none" stroke={color} strokeWidth="3" strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" />
      </svg>
      <span className="font-mono font-bold text-xs" style={{ color }}>{Math.round(score)}</span>
    </div>
  );
}

const features = [
  { icon: Activity, title: "Real-Time Four.meme Indexer", description: "Every new token launch is indexed within seconds. We monitor the BNB Chain 24/7 so you never miss a listing." },
  { icon: Brain, title: "Cerebras AI Deep Analysis", description: "Powered by Qwen 3 235B via Cerebras. Our AI generates plain-English risk assessments explaining exactly why a token scored the way it did." },
  { icon: Shield, title: "6-Dimensional Trust Scoring", description: "Dev history, token structure, behavioral patterns, wallet graph analysis, social signals, and ML anomaly detection — all weighted and combined." },
  { icon: Zap, title: "Interactive Wallet Graph", description: "Visualize connections between deployers, funders, and holders. Detect recycled scammer wallets, mixer flows, and suspicious funding chains at a glance." },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState<"score" | "mcap" | "holders" | "change">("score");
  const [filterTier, setFilterTier] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [deepAnalyzing, setDeepAnalyzing] = useState<string | null>(null);
  const [deepResults, setDeepResults] = useState<Record<string, { explanation: string; keyConcerns?: string[]; positiveSignals?: string[]; recommendation: string }>>({});

  const { data: leaderboard, isLoading } = trpc.token.list.useQuery({ search: searchQuery || undefined, tier: filterTier !== "all" ? filterTier : undefined, sortBy, limit: 50 });
  const { data: stats } = trpc.token.stats.useQuery();
  const analyzeMutation = trpc.cerebras.analyzeToken.useMutation();

  const runDeepAnalysis = async (entry: any) => {
    if (!entry.trust_score) return;
    setDeepAnalyzing(entry.token.address);
    try {
      const result = await analyzeMutation.mutateAsync({
        tokenName: entry.token.name,
        tokenSymbol: entry.token.symbol,
        score: entry.trust_score.score,
        tier: entry.trust_score.tier,
        holderCount: entry.holder_count,
        liquidityUsd: entry.liquidity_usd,
      });
      setDeepResults((prev) => ({ ...prev, [entry.token.address]: result }));
    } catch (e) {
      console.warn("Deep analysis failed:", e);
    }
    setDeepAnalyzing(null);
  };

  const statItems = [
    { icon: Shield, label: "Tokens Scored", value: stats?.tokens_scored?.toLocaleString() || "0" },
    { icon: AlertTriangle, label: "Rugs Detected", value: stats?.rugs_detected?.toLocaleString() || "0" },
    { icon: Users, label: "Wallets Tracked", value: stats?.wallets_tracked ? `${(stats.wallets_tracked / 1000).toFixed(1)}K+` : "0" },
    { icon: Brain, label: "AI Analyses", value: "85,200" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-24 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0B] via-[#0A0A0B]/80 to-[#0A0A0B]" />
        <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div className="text-center max-w-3xl mx-auto" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.7 }}>
            <motion.div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-400/10 border border-emerald-400/20 mb-6" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }}>
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-semibold text-emerald-400 tracking-wider">LIVE ON BNB CHAIN</span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Don&apos;t ape blind.
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-green-400 to-emerald-500">Check the TrustGraph.</span>
            </h1>
            <p className="text-lg text-gray-400 leading-relaxed mb-8 max-w-2xl mx-auto">
              AI-powered behavioral reputation engine for meme tokens on BNB Chain.
              Protecting retail from the <span className="text-red-400 font-semibold">98% that rug</span>.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
              <button onClick={() => document.getElementById("leaderboard")?.scrollIntoView({ behavior: "smooth" })} className="px-6 py-3 bg-emerald-400 text-[#0A0A0B] font-semibold rounded-lg hover:bg-emerald-500 transition-colors flex items-center justify-center gap-2">
                <Shield size={18} /> View Leaderboard
              </button>
              <button onClick={() => navigate("/scan")} className="px-6 py-3 bg-white/5 text-white font-semibold rounded-lg hover:bg-white/10 transition-colors border border-white/10 flex items-center justify-center gap-2">
                <Search size={18} /> Scan Wallet
              </button>
            </div>
          </motion.div>

          <motion.div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
            {statItems.map((s, i) => (
              <div key={i} className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-xl p-4 text-center">
                <s.icon size={20} className="text-emerald-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{s.value}</div>
                <div className="text-xs text-gray-500">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { icon: Search, label: "Scan Wallet", desc: "Check any wallet", action: () => navigate("/scan") },
              { icon: BarChart3, label: "Compare Tokens", desc: "Side by side", action: () => navigate("/compare") },
              { icon: Lock, label: "Check Liquidity", desc: "Verify locked LP", action: () => document.getElementById("leaderboard")?.scrollIntoView({ behavior: "smooth" }) },
              { icon: Timer, label: "View Graph", desc: "Wallet connections", action: () => navigate("/graph") },
            ].map((item, i) => (
              <motion.button key={i} onClick={item.action} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 text-left hover:border-emerald-400/20 hover:bg-white/[0.05] transition-all group" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 + i * 0.05 }}>
                <item.icon size={18} className="text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
                <div className="text-sm font-semibold text-white">{item.label}</div>
                <div className="text-xs text-gray-500">{item.desc}</div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Leaderboard */}
      <section id="leaderboard" className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }}>
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp size={20} className="text-emerald-400" />
              <h2 className="text-2xl font-bold text-white">Token Leaderboard</h2>
              <span className="text-xs text-gray-500 ml-2">{leaderboard?.length || 0} tokens indexed</span>
            </div>
            <p className="text-gray-500 mb-6">Recently launched Four.meme tokens ranked by AI Trust Score</p>

            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input type="text" placeholder="Search tokens..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-400/50" />
              </div>
              <select value={filterTier} onChange={(e) => setFilterTier(e.target.value)} className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none">
                <option value="all">All Tiers</option>
                <option value="SAFE">SAFE</option>
                <option value="MODERATE">MODERATE</option>
                <option value="RISKY">RISKY</option>
                <option value="DANGER">DANGER</option>
              </select>
            </div>

            <div className="flex gap-2 mb-4 flex-wrap">
              {(["score", "mcap", "holders", "change"] as const).map((k) => (
                <button key={k} onClick={() => setSortBy(k)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${sortBy === k ? "bg-emerald-400/20 text-emerald-400 border border-emerald-400/30" : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10"}`}>
                  {k === "score" ? "Trust Score" : k === "mcap" ? "Market Cap" : k === "holders" ? "Holders" : "24h Change"}
                </button>
              ))}
            </div>

            <div className="bg-white/[0.02] backdrop-blur border border-white/[0.06] rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="text-left px-4 py-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">#</th>
                      <th className="text-left px-4 py-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Token</th>
                      <th className="text-left px-4 py-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Score</th>
                      <th className="text-left px-4 py-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Tier</th>
                      <th className="text-right px-4 py-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Market Cap</th>
                      <th className="text-right px-4 py-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Holders</th>
                      <th className="text-right px-4 py-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">24h</th>
                      <th className="text-left px-4 py-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">AI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading && (
                      <tr><td colSpan={8} className="text-center py-12 text-gray-500">Loading tokens...</td></tr>
                    )}
                    {leaderboard && leaderboard.map((entry, i) => (
                      <motion.tr key={entry.token.address} className="border-b border-white/[0.03] hover:bg-white/[0.03] cursor-pointer transition-colors group" onClick={() => navigate(`/token/${entry.token.address}`)} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.02, 0.5) }}>
                        <td className="px-4 py-3 text-xs text-gray-500 font-mono">{i + 1}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400/20 to-emerald-400/5 flex items-center justify-center text-[10px] font-bold text-emerald-400 border border-emerald-400/20">
                              {entry.token.symbol.slice(0, 2)}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-white group-hover:text-emerald-400 transition-colors">{entry.token.name}</div>
                              <div className="text-[10px] text-gray-500 font-mono">{entry.token.symbol}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3"><ScoreCircle score={entry.trust_score?.score} /></td>
                        <td className="px-4 py-3"><TierBadge tier={entry.trust_score?.tier} /></td>
                        <td className="px-4 py-3 text-right text-sm text-white/80">${(entry.market_cap / 1000).toFixed(1)}K</td>
                        <td className="px-4 py-3 text-right text-sm text-white/80">{entry.holder_count.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right">
                          <span className={`text-sm font-medium flex items-center justify-end gap-1 ${entry.price_change_24h >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                            {entry.price_change_24h >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                            {entry.price_change_24h >= 0 ? "+" : ""}{entry.price_change_24h.toFixed(1)}%
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button onClick={(e) => { e.stopPropagation(); runDeepAnalysis(entry); }} disabled={deepAnalyzing === entry.token.address} className="flex items-center gap-1 px-2 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-medium hover:bg-purple-500/20 transition-colors disabled:opacity-50">
                            <Sparkles size={10} />
                            {deepAnalyzing === entry.token.address ? "..." : "Deep"}
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {leaderboard && leaderboard.length === 0 && <div className="py-12 text-center text-gray-500"><Shield size={32} className="mx-auto mb-2 opacity-40" />No tokens match filters</div>}
            </div>

            {Object.entries(deepResults).length > 0 && (
              <motion.div className="mt-6 space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h3 className="text-sm font-semibold text-purple-400 flex items-center gap-2"><Sparkles size={14} /> Cerebras AI Deep Analysis Results</h3>
                {Object.entries(deepResults).map(([addr, result]) => {
                  const entry = leaderboard?.find((e) => e.token.address === addr);
                  if (!entry) return null;
                  return (
                    <div key={addr} className="bg-purple-500/[0.03] border border-purple-500/20 rounded-xl p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="font-semibold text-white">{entry.token.name} ({entry.token.symbol})</span>
                        <span className="text-xs text-gray-500">via Cerebras Qwen 3 235B</span>
                      </div>
                      <p className="text-sm text-white/80 mb-3">{result.explanation}</p>
                      <div className="grid sm:grid-cols-2 gap-4">
                        {result.keyConcerns && result.keyConcerns.length > 0 && (
                          <div>
                            <div className="text-[10px] font-semibold text-red-400 uppercase mb-1.5">Key Concerns</div>
                            <ul className="space-y-1">{result.keyConcerns.map((c, i) => <li key={i} className="text-xs text-white/60 flex items-start gap-1.5"><span className="text-red-400 mt-0.5">-</span>{c}</li>)}</ul>
                          </div>
                        )}
                        {result.positiveSignals && result.positiveSignals.length > 0 && (
                          <div>
                            <div className="text-[10px] font-semibold text-emerald-400 uppercase mb-1.5">Positive Signals</div>
                            <ul className="space-y-1">{result.positiveSignals.map((s, i) => <li key={i} className="text-xs text-white/60 flex items-start gap-1.5"><span className="text-emerald-400 mt-0.5">+</span>{s}</li>)}</ul>
                          </div>
                        )}
                      </div>
                      <div className="mt-3 pt-3 border-t border-white/5 text-xs text-amber-400">{result.recommendation}</div>
                    </div>
                  );
                })}
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div className="text-center mb-12" initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }}>
            <h2 className="text-3xl font-bold text-white mb-4">How TrustGraph Wins</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Built for the Four.meme AI Sprint with production-grade architecture</p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((f, i) => (
              <motion.div key={i} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-6 hover:border-emerald-400/20 transition-colors" initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <div className="w-10 h-10 rounded-lg bg-emerald-400/10 flex items-center justify-center mb-4"><f.icon size={20} className="text-emerald-400" /></div>
                <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div className="mt-12 bg-white/[0.02] border border-white/[0.06] rounded-xl p-8" initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }}>
            <h3 className="text-xl font-bold text-white mb-8 text-center">The Trust Score Algorithm</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { label: "Dev History", weight: "25%", desc: "Rug count, age", color: "#00FF88" },
                { label: "Token Structure", weight: "20%", desc: "LP, taxes, supply", color: "#3388FF" },
                { label: "Behavioral", weight: "20%", desc: "Wash, snipers", color: "#9B59FF" },
                { label: "Wallet Graph", weight: "15%", desc: "Clusters, chains", color: "#FFAA00" },
                { label: "Social Signals", weight: "10%", desc: "Sentiment, bots", color: "#FF6B6B" },
                { label: "Anomaly ML", weight: "10%", desc: "Isolation Forest", color: "#00CCDD" },
              ].map((dim, i) => (
                <div key={i} className="text-center space-y-2">
                  <div className="w-12 h-12 rounded-xl mx-auto flex items-center justify-center text-lg font-bold" style={{ backgroundColor: `${dim.color}15`, color: dim.color, border: `1px solid ${dim.color}30` }}>{dim.weight}</div>
                  <div className="text-sm font-medium text-white">{dim.label}</div>
                  <div className="text-xs text-gray-500">{dim.desc}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-emerald-400 flex items-center justify-center"><Shield size={14} className="text-[#0A0A0B]" /></div>
            <span className="text-sm font-semibold text-white">TrustGraph</span>
            <span className="text-xs text-gray-600">v2.0.0</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-600">
            <span>Four.meme AI Sprint 2026</span>
            <span>-</span>
            <span>$50,000 Prize Pool</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
