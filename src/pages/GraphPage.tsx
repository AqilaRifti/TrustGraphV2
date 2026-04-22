import { useState, useCallback } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { Network, Filter, AlertTriangle, Info, Users, Shield } from "lucide-react";
import WalletGraph from "@/components/WalletGraph";
import { trpc } from "@/providers/trpc";

export default function GraphPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<"all" | "scammers" | "trusted" | "tokens">("all");
  const [showInfo, setShowInfo] = useState(true);
  
  const { data: graphData, isLoading } = trpc.graph.getData.useQuery();

  const filteredData = {
    nodes: (graphData?.nodes || []).filter((n) => {
      if (filter === "scammers") return (n.score || 50) < 30 && (n.type === "wallet" || n.type === "mixer");
      if (filter === "trusted") return (n.score || 50) >= 70 && (n.type === "wallet" || n.type === "cex");
      if (filter === "tokens") return n.type === "token";
      return true;
    }),
    edges: (graphData?.edges || []).filter((e) => {
      if (filter === "scammers" || filter === "trusted" || filter === "tokens") {
        const nodeIds = (graphData?.nodes || []).filter((n) => {
          if (filter === "scammers") return (n.score || 50) < 30 && (n.type === "wallet" || n.type === "mixer");
          if (filter === "trusted") return (n.score || 50) >= 70 && (n.type === "wallet" || n.type === "cex");
          if (filter === "tokens") return n.type === "token";
          return true;
        }).map((n) => n.id);
        return nodeIds.includes(e.source) && nodeIds.includes(e.target);
      }
      return true;
    }),
  };

  const scammerWallets = (graphData?.nodes || []).filter((n) => (n.score || 50) < 30 && (n.type === "wallet" || n.type === "mixer"));
  const trustedWallets = (graphData?.nodes || []).filter((n) => (n.score || 50) >= 70 && (n.type === "wallet" || n.type === "cex"));
  const totalEdges = graphData?.edges?.length || 0;

  const onNodeClick = useCallback((nodeId: string, nodeType: string) => {
    if (nodeType === "token") navigate(`/token/${nodeId}`);
    else if (nodeType === "wallet") navigate(`/wallet/${nodeId}`);
  }, [navigate]);

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div className="mb-6" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <div className="flex items-center gap-3 mb-2"><Network size={24} className="text-emerald-400" /><h1 className="text-2xl font-bold text-white">Wallet Relationship Graph</h1></div>
          <p className="text-gray-500 text-sm">Interactive visualization of wallet connections, funding chains, and scammer clusters</p>
        </motion.div>

        <motion.div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
          {[
            { icon: Users, label: "Wallets", value: (graphData?.nodes || []).filter((n) => n.type === "wallet").length },
            { icon: Network, label: "Connections", value: totalEdges },
            { icon: AlertTriangle, label: "Flagged", value: scammerWallets.length, color: "text-red-400" },
            { icon: Shield, label: "Trusted", value: trustedWallets.length, color: "text-emerald-400" },
          ].map((s, i) => (
            <div key={i} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3">
              <div className="text-[10px] text-gray-500 uppercase mb-1">{s.label}</div>
              <div className={`text-xl font-bold ${s.color || "text-white"}`}>{s.value}</div>
            </div>
          ))}
        </motion.div>

        <motion.div className="flex flex-wrap gap-2 mb-4" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }}>
          <Filter size={14} className="text-gray-500 mr-1" />
          {(["all", "scammers", "trusted", "tokens"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${filter === f ? "bg-white/10 text-white border-white/20" : "bg-white/5 text-gray-400 border-white/10 hover:bg-white/10"}`}>
              {f === "all" ? "All" : f === "scammers" ? "Scammers Only" : f === "trusted" ? "Trusted Only" : "Tokens Only"}
            </button>
          ))}
        </motion.div>

        {showInfo && (
          <motion.div className="mb-4 bg-emerald-400/[0.03] border border-emerald-400/20 rounded-xl p-4" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
            <div className="flex items-start gap-3">
              <Info size={16} className="text-emerald-400 mt-0.5" />
              <div className="flex-1 text-sm text-white/70">
                <strong className="text-white">How to read:</strong> Each node is a wallet or token. Green = trusted, red = scammer, amber = moderate.
                Animated edges show funding. <strong>Click any node</strong> to explore its details. Purple nodes are mixers, blue are CEX hot wallets.
              </div>
              <button onClick={() => setShowInfo(false)} className="text-gray-500 hover:text-white">x</button>
            </div>
          </motion.div>
        )}

        {isLoading ? (
          <div className="h-[600px] flex items-center justify-center border border-white/[0.06] rounded-xl">
            <p className="text-gray-500">Loading graph...</p>
          </div>
        ) : (
          <motion.div className="h-[600px] lg:h-[700px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <WalletGraph data={filteredData} onNodeClick={onNodeClick} />
          </motion.div>
        )}

        <motion.div className="mt-8 grid md:grid-cols-2 gap-6" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
          <div className="bg-white/[0.02] border border-red-400/20 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4"><AlertTriangle size={18} className="text-red-400" /><h3 className="text-xs font-semibold text-red-400 uppercase tracking-wider">Scammer Cluster Detected</h3></div>
            <p className="text-sm text-white/70 mb-4">{scammerWallets.length} connected wallets sharing funding sources and coordinated deployment patterns. Tagged as serial scammers.</p>
            <div className="space-y-2">{scammerWallets.slice(0, 4).map((w) => (
              <div key={w.id} className="flex items-center justify-between py-2 border-b border-white/[0.03]">
                <button onClick={() => navigate(`/wallet/${w.id}`)} className="text-xs font-mono text-white/60 hover:text-red-400 transition-colors">{w.label}</button>
                <div className="flex gap-1">{(w.tags || []).slice(0, 2).map((t) => <span key={t} className="px-1.5 py-0.5 rounded text-[10px] bg-red-400/10 text-red-400">{t}</span>)}</div>
              </div>
            ))}</div>
          </div>
          <div className="bg-white/[0.02] border border-emerald-400/20 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4"><Shield size={18} className="text-emerald-400" /><h3 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Trusted Builder Cluster</h3></div>
            <p className="text-sm text-white/70 mb-4">{trustedWallets.length} verified wallets with clean histories and no rug pull records. Consistent track records.</p>
            <div className="space-y-2">{trustedWallets.slice(0, 4).map((w) => (
              <div key={w.id} className="flex items-center justify-between py-2 border-b border-white/[0.03]">
                <button onClick={() => navigate(`/wallet/${w.id}`)} className="text-xs font-mono text-white/60 hover:text-emerald-400 transition-colors">{w.label}</button>
                <div className="flex gap-1">{(w.tags || []).slice(0, 2).map((t) => <span key={t} className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-400/10 text-emerald-400">{t}</span>)}</div>
              </div>
            ))}</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
