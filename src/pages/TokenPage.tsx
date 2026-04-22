import { useParams, useNavigate } from "react-router";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, Users, Droplets, Clock, Shield, Copy, CheckCircle, Sparkles, AlertTriangle, Heart, BarChart3 } from "lucide-react";
import { useState, useEffect } from "react";
import { trpc } from "@/providers/trpc";
import { shortenAddress, getScoreColor } from "@/lib/utils";
import TrustScoreGauge from "@/components/TrustScoreGauge";
import type { ScoreBreakdown, RiskFlag } from "@/lib/types";

function ScoreBar({ label, score, delay }: { label: string; score: number; delay: number }) {
  const color = getScoreColor(score);
  return (
    <motion.div className="space-y-1.5" initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay, duration: 0.4 }}>
      <div className="flex items-center justify-between text-xs">
        <span className="text-white/70">{label}</span>
        <span className="font-mono font-semibold" style={{ color }}>{Math.round(score)}</span>
      </div>
      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
        <motion.div className="h-full rounded-full" style={{ backgroundColor: color }} initial={{ width: 0 }} animate={{ width: `${score}%` }} transition={{ delay: delay + 0.1, duration: 0.8, ease: "easeOut" }} />
      </div>
    </motion.div>
  );
}

function SeverityBadge({ severity }: { severity: string }) {
  const colors: Record<string, string> = {
    LOW: "tier-safe",
    MEDIUM: "tier-moderate",
    HIGH: "tier-risky",
    CRITICAL: "tier-danger",
  };
  return <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${colors[severity] || colors.LOW}`}>{severity}</span>;
}

export default function TokenPage() {
  const { address } = useParams<{ address: string }>();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [deepLoading, setDeepLoading] = useState(false);
  const [deepResult, setDeepResult] = useState<{ explanation: string; keyConcerns?: string[]; positiveSignals?: string[]; recommendation: string } | null>(null);

  const { data: detail, isLoading } = trpc.token.getByAddress.useQuery(
    { address: address || "" },
    { enabled: !!address }
  );
  const analyzeMutation = trpc.cerebras.analyzeToken.useMutation();

  const runDeepAnalysis = async () => {
    if (!detail?.trust_score) return;
    setDeepLoading(true);
    try {
      const result = await analyzeMutation.mutateAsync({
        tokenName: detail.token.name,
        tokenSymbol: detail.token.symbol,
        score: detail.trust_score.score,
        tier: detail.trust_score.tier,
        flags: detail.risk_flags.map((f) => ({ type: f.flagType, severity: f.severity, description: f.description })),
        holderCount: detail.holder_count,
        liquidityUsd: detail.liquidity_usd,
        deployerReputation: detail.deployer_wallet?.reputationScore || 50,
        rugCount: detail.deployer_wallet?.rugCount || 0,
      });
      setDeepResult(result);
    } catch (e) { console.warn(e); }
    setDeepLoading(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center"><Shield size={48} className="text-gray-600 mx-auto mb-4 animate-pulse" /><p className="text-gray-500">Loading token...</p></div>
      </div>
    );
  }

  if (!detail) return (
    <div className="min-h-screen pt-24 flex items-center justify-center">
      <div className="text-center"><Shield size={48} className="text-gray-600 mx-auto mb-4" /><h2 className="text-xl font-semibold text-white mb-2">Token Not Found</h2><button onClick={() => navigate("/")} className="text-emerald-400 hover:underline">Back to Leaderboard</button></div>
    </div>
  );

  const { token, trust_score, risk_flags, holder_count, liquidity_usd, market_cap, price_change_24h, top_holders, deployer_wallet } = detail;
  const breakdown = (trust_score?.breakdown || {
    dev_wallet_history: 50, token_structure: 50, behavioral_patterns: 50,
    wallet_graph_analysis: 50, social_signals: 50, anomaly_score: 50,
  }) as ScoreBreakdown;

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.button onClick={() => navigate("/")} className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-6" initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
          <ArrowLeft size={18} /><span className="text-sm">Back</span>
        </motion.button>

        <motion.div className="mb-8" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400/20 to-emerald-400/5 flex items-center justify-center text-lg font-bold text-emerald-400 border border-emerald-400/20">{token.symbol.slice(0, 2)}</div>
              <div>
                <h1 className="text-2xl font-bold text-white">{token.name}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm font-mono text-gray-500">{token.symbol}</span>
                  <span className="text-gray-700">|</span>
                  <button onClick={() => { navigator.clipboard.writeText(token.address); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="flex items-center gap-1 text-xs font-mono text-gray-500 hover:text-emerald-400 transition-colors">
                    {shortenAddress(token.address)} {copied ? <CheckCircle size={12} className="text-emerald-400" /> : <Copy size={12} />}
                  </button>
                  <a href={`https://bscscan.com/token/${token.address}`} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-emerald-400"><ExternalLink size={12} /></a>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: Users, label: "Holders", value: holder_count.toLocaleString() },
              { icon: Droplets, label: "Liquidity", value: `$${(liquidity_usd / 1000).toFixed(1)}K` },
              { icon: BarChart3, label: "Market Cap", value: `$${(market_cap / 1000).toFixed(0)}K` },
              { icon: Clock, label: "24h", value: `${price_change_24h >= 0 ? "+" : ""}${price_change_24h.toFixed(1)}%`, color: price_change_24h >= 0 ? "text-emerald-400" : "text-red-400" },
            ].map((s, i) => (
              <div key={i} className="bg-white/[0.03] backdrop-blur border border-white/[0.06] rounded-xl p-3">
                <div className="flex items-center gap-1.5 text-gray-500 mb-1"><s.icon size={12} /><span className="text-[10px] uppercase tracking-wider">{s.label}</span></div>
                <div className={`text-lg font-semibold ${s.color || "text-white"}`}>{s.value}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          <motion.div className="lg:col-span-1" initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-6 flex flex-col items-center">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-6">Trust Score</h3>
              {trust_score ? <TrustScoreGauge score={trust_score} /> : <div className="text-gray-500 text-sm">No score</div>}
              {trust_score && (
                <div className="mt-6 w-full pt-4 border-t border-white/5 space-y-3">
                  <ScoreBar label="Dev Wallet History (25%)" score={breakdown.dev_wallet_history} delay={0.1} />
                  <ScoreBar label="Token Structure (20%)" score={breakdown.token_structure} delay={0.15} />
                  <ScoreBar label="Behavioral Patterns (20%)" score={breakdown.behavioral_patterns} delay={0.2} />
                  <ScoreBar label="Wallet Graph (15%)" score={breakdown.wallet_graph_analysis} delay={0.25} />
                  <ScoreBar label="Social Signals (10%)" score={breakdown.social_signals} delay={0.3} />
                  <ScoreBar label="Anomaly Detection (10%)" score={breakdown.anomaly_score} delay={0.35} />
                </div>
              )}
              <div className="mt-4 w-full pt-4 border-t border-white/5">
                <div className="text-[10px] text-gray-500 uppercase mb-2">Deployer</div>
                <button onClick={() => navigate(`/wallet/${token.deployer}`)} className="text-sm font-mono text-emerald-400 hover:underline flex items-center gap-1">
                  {shortenAddress(token.deployer)} <ExternalLink size={12} />
                </button>
                {deployer_wallet && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${deployer_wallet.reputationScore >= 75 ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" : deployer_wallet.rugCount > 0 ? "text-red-400 bg-red-400/10 border-red-400/20" : "text-amber-400 bg-amber-400/10 border-amber-400/20"}`}>
                      Rep: {Math.round(deployer_wallet.reputationScore)}/100
                    </span>
                    {deployer_wallet.rugCount > 0 && <span className="text-xs text-red-400">{deployer_wallet.rugCount} rug(s)</span>}
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          <motion.div className="lg:col-span-2 space-y-6" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
            <div className="bg-purple-500/[0.03] border border-purple-500/20 rounded-xl p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center"><Sparkles size={18} className="text-white" /></div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">Cerebras AI Deep Analysis</h3>
                    <p className="text-xs text-gray-500">Powered by Qwen 3 235B via Cerebras</p>
                  </div>
                </div>
                <button onClick={runDeepAnalysis} disabled={deepLoading || !trust_score} className="px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-lg text-purple-400 text-sm font-medium hover:bg-purple-500/20 transition-colors disabled:opacity-50 flex items-center gap-2">
                  <Sparkles size={14} /> {deepLoading ? "Analyzing..." : "Run Analysis"}
                </button>
              </div>

              {deepResult && (
                <motion.div className="mt-4 pt-4 border-t border-purple-500/10 space-y-4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <p className="text-sm text-white/80">{deepResult.explanation}</p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {deepResult.keyConcerns && deepResult.keyConcerns.length > 0 && (
                      <div>
                        <div className="text-[10px] font-semibold text-red-400 uppercase mb-1.5 flex items-center gap-1"><AlertTriangle size={10} /> Key Concerns</div>
                        <ul className="space-y-1">{deepResult.keyConcerns.map((c, i) => <li key={i} className="text-xs text-white/60 flex items-start gap-1.5"><span className="text-red-400">-</span>{c}</li>)}</ul>
                      </div>
                    )}
                    {deepResult.positiveSignals && deepResult.positiveSignals.length > 0 && (
                      <div>
                        <div className="text-[10px] font-semibold text-emerald-400 uppercase mb-1.5">Positive Signals</div>
                        <ul className="space-y-1">{deepResult.positiveSignals.map((s, i) => <li key={i} className="text-xs text-white/60 flex items-start gap-1.5"><span className="text-emerald-400">+</span>{s}</li>)}</ul>
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-amber-400 font-medium">{deepResult.recommendation}</div>
                </motion.div>
              )}
            </div>

            {risk_flags.length > 0 && (
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle size={16} className="text-red-400" />
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Risk Flags ({risk_flags.length})</h3>
                </div>
                <div className="space-y-2 max-h-72 overflow-y-auto scrollbar-thin">
                  {risk_flags.map((flag, i) => (
                    <motion.div key={flag.id} className="bg-white/[0.03] border border-white/[0.06] rounded-lg p-3 flex items-start gap-3" initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 + i * 0.03 }}>
                      <AlertTriangle size={16} className={flag.severity === "CRITICAL" ? "text-red-400 mt-0.5" : flag.severity === "HIGH" ? "text-orange-400 mt-0.5" : "text-amber-400 mt-0.5"} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1"><SeverityBadge severity={flag.severity} /><span className="text-[10px] font-mono text-gray-500">{flag.flagType}</span></div>
                        <p className="text-xs text-white/70">{flag.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {top_holders.length > 0 && (
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-5">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Top Holders</h3>
                <div className="space-y-2">
                  {top_holders.map((h, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-white/[0.03] last:border-0">
                      <div className="flex items-center gap-3"><span className="text-xs text-gray-600 w-5">#{i + 1}</span><button onClick={() => navigate(`/wallet/${h.address}`)} className="text-xs font-mono text-white/80 hover:text-emerald-400 transition-colors">{shortenAddress(h.address)}</button></div>
                      <span className="text-xs text-white/60">{h.percentage.toFixed(1)}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
