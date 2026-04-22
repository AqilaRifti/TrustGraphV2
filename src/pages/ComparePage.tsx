import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GitCompare, CheckCircle, Trophy, AlertTriangle } from "lucide-react";
import { trpc } from "@/providers/trpc";
import { getScoreColor } from "@/lib/utils";
import ScoreComparisonChart from "@/components/charts/ScoreComparisonChart";

function ScoreBar({ label, valA, valB, max = 100 }: { label: string; valA: number; valB: number; max?: number }) {
  const winner = valA > valB ? "a" : valB > valA ? "b" : "tie";
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-white/60">{label}</span>
        <div className="flex items-center gap-2">
          <span className={`font-mono font-bold text-xs ${winner === "a" ? "text-emerald-400" : "text-white/50"}`}>{valA}</span>
          <span className="text-gray-700">vs</span>
          <span className={`font-mono font-bold text-xs ${winner === "b" ? "text-emerald-400" : "text-white/50"}`}>{valB}</span>
        </div>
      </div>
      <div className="flex gap-2 items-center">
        <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(valA / max) * 100}%`, backgroundColor: getScoreColor(valA) }} />
        </div>
        <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(valB / max) * 100}%`, backgroundColor: getScoreColor(valB) }} />
        </div>
      </div>
    </div>
  );
}

export default function ComparePage() {
  const [addrA, setAddrA] = useState("");
  const [addrB, setAddrB] = useState("");
  const [compared, setCompared] = useState<any>(null);

  const { data: tokenList } = trpc.token.list.useQuery({ limit: 6 });

  const { data: tokenA } = trpc.token.getByAddress.useQuery(
    { address: addrA },
    { enabled: addrA.length > 0 }
  );
  const { data: tokenB } = trpc.token.getByAddress.useQuery(
    { address: addrB },
    { enabled: addrB.length > 0 }
  );

  const doCompare = () => {
    if (!tokenA || !tokenB) return;
    setCompared({ a: tokenA, b: tokenB });
  };

  const selectQuick = (which: "a" | "b", addr: string) => {
    if (which === "a") setAddrA(addr); else setAddrB(addr);
  };

  const winner = compared && compared.a.trust_score && compared.b.trust_score
    ? (compared.a.trust_score.score || 0) > (compared.b.trust_score.score || 0) ? "a" : (compared.b.trust_score.score || 0) > (compared.a.trust_score.score || 0) ? "b" : "tie"
    : null;

  const chartData = compared && compared.a.trust_score && compared.b.trust_score
    ? [
        { dimension: "Dev History", tokenA: compared.a.trust_score.breakdown?.dev_wallet_history || 0, tokenB: compared.b.trust_score.breakdown?.dev_wallet_history || 0 },
        { dimension: "Token Structure", tokenA: compared.a.trust_score.breakdown?.token_structure || 0, tokenB: compared.b.trust_score.breakdown?.token_structure || 0 },
        { dimension: "Behavioral", tokenA: compared.a.trust_score.breakdown?.behavioral_patterns || 0, tokenB: compared.b.trust_score.breakdown?.behavioral_patterns || 0 },
        { dimension: "Wallet Graph", tokenA: compared.a.trust_score.breakdown?.wallet_graph_analysis || 0, tokenB: compared.b.trust_score.breakdown?.wallet_graph_analysis || 0 },
        { dimension: "Social", tokenA: compared.a.trust_score.breakdown?.social_signals || 0, tokenB: compared.b.trust_score.breakdown?.social_signals || 0 },
        { dimension: "Anomaly", tokenA: compared.a.trust_score.breakdown?.anomaly_score || 0, tokenB: compared.b.trust_score.breakdown?.anomaly_score || 0 },
      ]
    : [];

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <motion.div className="text-center mb-10" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <div className="w-14 h-14 rounded-2xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center mx-auto mb-4">
            <GitCompare size={24} className="text-emerald-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Token Comparison</h1>
          <p className="text-gray-500">Compare two tokens side-by-side across all trust dimensions</p>
        </motion.div>

        <motion.div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 mb-8" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs text-gray-500 uppercase mb-1.5 block">Token A</label>
              <input type="text" placeholder="Paste address..." value={addrA} onChange={(e) => setAddrA(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-400/50 font-mono" />
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase mb-1.5 block">Token B</label>
              <input type="text" placeholder="Paste address..." value={addrB} onChange={(e) => setAddrB(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-400/50 font-mono" />
            </div>
          </div>
          <div className="mb-4">
            <span className="text-[10px] text-gray-500 uppercase">Quick Select:</span>
            <div className="flex gap-2 mt-1 flex-wrap">
              {(tokenList || []).map((t) => (
                <div key={t.token.address} className="flex gap-1">
                  <button onClick={() => selectQuick("a", t.token.address)} className={`px-2 py-1 rounded text-[10px] font-mono border transition-colors ${addrA === t.token.address ? "bg-emerald-400/20 border-emerald-400/40 text-emerald-400" : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"}`}>A:{t.token.symbol}</button>
                  <button onClick={() => selectQuick("b", t.token.address)} className={`px-2 py-1 rounded text-[10px] font-mono border transition-colors ${addrB === t.token.address ? "bg-purple-500/20 border-purple-500/40 text-purple-400" : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"}`}>B:{t.token.symbol}</button>
                </div>
              ))}
            </div>
          </div>
          <button onClick={doCompare} disabled={!addrA || !addrB} className="w-full py-3 bg-emerald-400 text-[#0A0A0B] font-semibold rounded-lg hover:bg-emerald-500 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
            <GitCompare size={18} /> Compare Tokens
          </button>
        </motion.div>

        <AnimatePresence>
          {compared && compared.a.trust_score && compared.b.trust_score && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {winner !== "tie" && (
                <div className={`rounded-xl p-4 mb-6 border ${winner === "a" ? "bg-emerald-400/5 border-emerald-400/20" : "bg-purple-500/5 border-purple-500/20"}`}>
                  <div className="flex items-center gap-3">
                    <Trophy size={20} className={winner === "a" ? "text-emerald-400" : "text-purple-400"} />
                    <div>
                      <span className="text-sm font-bold text-white">{winner === "a" ? compared.a.token.name : compared.b.token.name} wins </span>
                      <span className="text-sm text-gray-400">with a trust score of {winner === "a" ? Math.round(compared.a.trust_score.score) : Math.round(compared.b.trust_score.score)}/100 vs {winner === "a" ? Math.round(compared.b.trust_score.score) : Math.round(compared.a.trust_score.score)}/100</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <div className={`bg-white/[0.03] border rounded-xl p-5 ${winner === "a" ? "border-emerald-400/30" : "border-white/[0.06]"}`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400/20 to-emerald-400/5 flex items-center justify-center text-sm font-bold text-emerald-400">{compared.a.token.symbol[0]}</div>
                    <div>
                      <div className="text-lg font-bold text-white">{compared.a.token.name}</div>
                      <div className="text-xs text-gray-500 font-mono">{compared.a.token.symbol}</div>
                    </div>
                    {winner === "a" && <CheckCircle size={18} className="text-emerald-400 ml-auto" />}
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <svg width="40" height="40" className="-rotate-90">
                      <circle cx="20" cy="20" r="16" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
                      <circle cx="20" cy="20" r="16" fill="none" stroke={getScoreColor(compared.a.trust_score.score)} strokeWidth="4" strokeDasharray={2 * Math.PI * 16} strokeDashoffset={2 * Math.PI * 16 * (1 - compared.a.trust_score.score / 100)} strokeLinecap="round" />
                    </svg>
                    <div>
                      <div className="text-2xl font-bold" style={{ color: getScoreColor(compared.a.trust_score.score) }}>{Math.round(compared.a.trust_score.score)}</div>
                      <div className="text-xs text-gray-500">{compared.a.trust_score.tier}</div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs"><span className="text-gray-500">Holders</span><span className="text-white">{compared.a.holder_count?.toLocaleString() || "?"}</span></div>
                    <div className="flex items-center justify-between text-xs"><span className="text-gray-500">Market Cap</span><span className="text-white">${(compared.a.market_cap || 0) / 1000}K</span></div>
                  </div>
                </div>

                <div className={`bg-white/[0.03] border rounded-xl p-5 ${winner === "b" ? "border-emerald-400/30" : "border-white/[0.06]"}`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/20 to-purple-500/5 flex items-center justify-center text-sm font-bold text-purple-400">{compared.b.token.symbol[0]}</div>
                    <div>
                      <div className="text-lg font-bold text-white">{compared.b.token.name}</div>
                      <div className="text-xs text-gray-500 font-mono">{compared.b.token.symbol}</div>
                    </div>
                    {winner === "b" && <CheckCircle size={18} className="text-emerald-400 ml-auto" />}
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <svg width="40" height="40" className="-rotate-90">
                      <circle cx="20" cy="20" r="16" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
                      <circle cx="20" cy="20" r="16" fill="none" stroke={getScoreColor(compared.b.trust_score.score)} strokeWidth="4" strokeDasharray={2 * Math.PI * 16} strokeDashoffset={2 * Math.PI * 16 * (1 - compared.b.trust_score.score / 100)} strokeLinecap="round" />
                    </svg>
                    <div>
                      <div className="text-2xl font-bold" style={{ color: getScoreColor(compared.b.trust_score.score) }}>{Math.round(compared.b.trust_score.score)}</div>
                      <div className="text-xs text-gray-500">{compared.b.trust_score.tier}</div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs"><span className="text-gray-500">Holders</span><span className="text-white">{compared.b.holder_count?.toLocaleString() || "?"}</span></div>
                    <div className="flex items-center justify-between text-xs"><span className="text-gray-500">Market Cap</span><span className="text-white">${(compared.b.market_cap || 0) / 1000}K</span></div>
                  </div>
                </div>
              </div>

              {chartData.length > 0 && (
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-5 mb-6">
                  <h3 className="text-sm font-semibold text-white mb-4">Dimension Comparison</h3>
                  <ScoreComparisonChart data={chartData} />
                </div>
              )}

              <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-5 mb-6">
                <h3 className="text-sm font-semibold text-white mb-4">Score Breakdown</h3>
                <div className="space-y-4">
                  <ScoreBar label="Dev Wallet History" valA={compared.a.trust_score.breakdown?.dev_wallet_history || 0} valB={compared.b.trust_score.breakdown?.dev_wallet_history || 0} />
                  <ScoreBar label="Token Structure" valA={compared.a.trust_score.breakdown?.token_structure || 0} valB={compared.b.trust_score.breakdown?.token_structure || 0} />
                  <ScoreBar label="Behavioral Patterns" valA={compared.a.trust_score.breakdown?.behavioral_patterns || 0} valB={compared.b.trust_score.breakdown?.behavioral_patterns || 0} />
                  <ScoreBar label="Wallet Graph" valA={compared.a.trust_score.breakdown?.wallet_graph_analysis || 0} valB={compared.b.trust_score.breakdown?.wallet_graph_analysis || 0} />
                  <ScoreBar label="Social Signals" valA={compared.a.trust_score.breakdown?.social_signals || 0} valB={compared.b.trust_score.breakdown?.social_signals || 0} />
                  <ScoreBar label="Anomaly Detection" valA={compared.a.trust_score.breakdown?.anomaly_score || 0} valB={compared.b.trust_score.breakdown?.anomaly_score || 0} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
