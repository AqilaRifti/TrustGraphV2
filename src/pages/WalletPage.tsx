import { useParams, useNavigate } from "react-router";
import { motion } from "framer-motion";
import { ArrowLeft, Shield, AlertTriangle, CheckCircle, Clock, ExternalLink, Copy, Rocket, Activity, BarChart3 } from "lucide-react";
import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { shortenAddress } from "@/lib/utils";

export default function WalletPage() {
  const { address } = useParams<{ address: string }>();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const { data: walletData, isLoading } = trpc.wallet.getByAddress.useQuery(
    { address: address || "" },
    { enabled: !!address }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center"><Shield size={48} className="text-gray-600 mx-auto mb-4 animate-pulse" /><p className="text-gray-500">Loading wallet...</p></div>
      </div>
    );
  }

  if (!walletData) return (
    <div className="min-h-screen pt-24 flex items-center justify-center">
      <div className="text-center"><Shield size={48} className="text-gray-600 mx-auto mb-4" /><h2 className="text-xl font-semibold text-white">Wallet Not Found</h2><button onClick={() => navigate("/")} className="text-emerald-400 hover:underline mt-2">Back</button></div>
    </div>
  );

  const { wallet, deployed_tokens } = walletData;
  const repColor = wallet.reputationScore >= 75 ? "#00FF88" : wallet.reputationScore >= 50 ? "#F5A623" : wallet.reputationScore >= 25 ? "#FF8800" : "#FF4444";
  const repTier = wallet.reputationScore >= 75 ? "Trusted" : wallet.reputationScore >= 50 ? "Neutral" : wallet.reputationScore >= 25 ? "Suspicious" : "Known Scammer";

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <motion.button onClick={() => navigate("/")} className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-6" initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
          <ArrowLeft size={18} /><span className="text-sm">Back</span>
        </motion.button>

        <motion.div className="mb-8" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold border" style={{ backgroundColor: `${repColor}15`, color: repColor, borderColor: `${repColor}30` }}>{Math.round(wallet.reputationScore)}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-xl font-bold text-white font-mono">{shortenAddress(address!)}</h1>
                <button onClick={() => { navigator.clipboard.writeText(address!); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="text-gray-500 hover:text-white">{copied ? <CheckCircle size={14} className="text-emerald-400" /> : <Copy size={14} />}</button>
                <a href={`https://bscscan.com/address/${address}`} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-emerald-400"><ExternalLink size={14} /></a>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded-full text-xs font-bold border" style={{ color: repColor, backgroundColor: `${repColor}15`, borderColor: `${repColor}30` }}>{repTier}</span>
                {(wallet.tags || []).map((tag: string) => <span key={tag} className="px-2 py-0.5 rounded-full text-xs bg-white/5 text-gray-400 border border-white/10">{tag}</span>)}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Rocket, label: "Tokens Deployed", value: wallet.totalTokensDeployed, color: "text-white" },
            { icon: AlertTriangle, label: "Rug Pulls", value: wallet.rugCount, color: "text-red-400" },
            { icon: Activity, label: "In Cluster", value: wallet.clusterId ? "Yes" : "No", color: "text-white" },
            { icon: Clock, label: "Days Active", value: wallet.firstSeen ? Math.floor((Date.now() - new Date(wallet.firstSeen).getTime()) / 86400000) : "?", color: "text-white" },
          ].map((s, i) => (
            <motion.div key={i} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 + i * 0.05 }}>
              <s.icon size={16} className="text-gray-500 mb-2" />
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-gray-500">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {wallet.rugCount > 0 && (
          <motion.div className="mb-8 bg-red-400/5 border border-red-400/20 rounded-xl p-4" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
            <div className="flex items-start gap-3">
              <AlertTriangle size={20} className="text-red-400 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-red-400 mb-1">Warning: Known Rug Puller</h3>
                <p className="text-sm text-white/70">This wallet has {wallet.rugCount} confirmed rug pull{wallet.rugCount > 1 ? "s" : ""}. Check our graph view for connected addresses and recycled identities.</p>
              </div>
            </div>
          </motion.div>
        )}
        {wallet.reputationScore >= 75 && wallet.rugCount === 0 && (
          <motion.div className="mb-8 bg-emerald-400/5 border border-emerald-400/20 rounded-xl p-4" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
            <div className="flex items-start gap-3">
              <CheckCircle size={20} className="text-emerald-400 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-emerald-400 mb-1">Trusted Builder</h3>
                <p className="text-sm text-white/70">Clean track record. Tokens from this deployer have historically performed well. Always DYOR.</p>
              </div>
            </div>
          </motion.div>
        )}

        {deployed_tokens.length > 0 && (
          <motion.div className="mb-8 bg-white/[0.02] border border-white/[0.06] rounded-xl p-5" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Tokens Deployed ({deployed_tokens.length})</h3>
            <div className="space-y-2">
              {deployed_tokens.map((t) => {
                const score = t.score;
                return (
                  <div key={t.token.address} className="flex items-center justify-between py-2 border-b border-white/[0.03] last:border-0 cursor-pointer hover:bg-white/[0.02] rounded-lg px-2 -mx-2" onClick={() => navigate(`/token/${t.token.address}`)}>
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400/20 to-emerald-400/5 flex items-center justify-center text-[9px] font-bold text-emerald-400">{t.token.symbol.slice(0, 2)}</div>
                      <div><span className="text-sm font-medium text-white">{t.token.name}</span><span className="text-[10px] text-gray-500 ml-2">{t.token.symbol}</span></div>
                    </div>
                    <div className="flex items-center gap-2">
                      {score && <span className={`text-xs font-mono font-bold ${score.score >= 75 ? "text-emerald-400" : score.score >= 50 ? "text-amber-400" : "text-red-400"}`}>{Math.round(score.score)}/100</span>}
                      <ExternalLink size={12} className="text-gray-600" />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        <motion.div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6 text-center" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
          <BarChart3 size={24} className="text-emerald-400 mx-auto mb-2" />
          <h3 className="text-lg font-semibold text-white mb-2">View Wallet Connections</h3>
          <p className="text-sm text-gray-500 mb-4">See how this wallet connects to others in the trust graph</p>
          <button onClick={() => navigate("/graph")} className="px-4 py-2 bg-emerald-400/10 text-emerald-400 border border-emerald-400/30 rounded-lg text-sm font-medium hover:bg-emerald-400/20 transition-colors">Open Graph View</button>
        </motion.div>
      </div>
    </div>
  );
}
