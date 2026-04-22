import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Shield, AlertTriangle, CheckCircle, Wallet, Loader2 } from "lucide-react";
import { useNavigate } from "react-router";
import { trpc } from "@/providers/trpc";
import { shortenAddress } from "@/lib/utils";

export default function ScanPage() {
  const navigate = useNavigate();
  const [address, setAddress] = useState("");
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<any>(null);

  const scanMutation = trpc.scan.portfolio.useMutation();

  const runScan = async () => {
    if (!address.trim()) return;
    setScanning(true);
    setResult(null);
    try {
      const scan = await scanMutation.mutateAsync({ address: address.trim() });
      setResult(scan);
    } catch (e) {
      console.error("Scan failed:", e);
    }
    setScanning(false);
  };

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div className="text-center mb-10" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <div className="w-14 h-14 rounded-2xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center mx-auto mb-4">
            <Wallet size={24} className="text-emerald-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Portfolio Scanner</h1>
          <p className="text-gray-500">Paste any BNB Chain wallet address to analyze all tokens and their risk levels</p>
        </motion.div>

        <motion.div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 mb-6" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input type="text" placeholder="0x... paste wallet address" value={address} onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-400/50 font-mono"
                onKeyDown={(e) => e.key === "Enter" && runScan()} />
            </div>
            <button onClick={runScan} disabled={scanning || !address.trim()} className="px-6 py-3 bg-emerald-400 text-[#0A0A0B] font-semibold rounded-lg hover:bg-emerald-500 transition-colors disabled:opacity-50 flex items-center gap-2">
              {scanning ? <><Loader2 size={16} className="animate-spin" /> Scanning</> : <><Search size={16} /> Scan</>}
            </button>
          </div>
          <div className="flex gap-2 mt-3">
            {["0xdeadbeef1234567890abcdef1234567890abcdef", "0xtrust007777777777777777777777777777777777", "0xlegit9999999999999999999999999999999999"].map((addr) => (
              <button key={addr} onClick={() => setAddress(addr)} className="px-2 py-1 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-gray-400 hover:text-emerald-400 hover:border-emerald-400/30 transition-colors">
                {shortenAddress(addr)}
              </button>
            ))}
          </div>
        </motion.div>

        <AnimatePresence>
          {result && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className={`rounded-xl p-5 mb-6 border ${result.overall_risk === "critical" ? "bg-red-400/5 border-red-400/20" : result.overall_risk === "high" ? "bg-orange-400/5 border-orange-400/20" : result.overall_risk === "moderate" ? "bg-amber-400/5 border-amber-400/20" : "bg-emerald-400/5 border-emerald-400/20"}`}>
                <div className="flex items-start gap-3">
                  {result.overall_risk === "critical" ? <AlertTriangle size={24} className="text-red-400 mt-0.5" /> : result.overall_risk === "safe" ? <CheckCircle size={24} className="text-emerald-400 mt-0.5" /> : <Shield size={24} className="text-amber-400 mt-0.5" />}
                  <div>
                    <h3 className={`text-lg font-bold ${result.overall_risk === "critical" ? "text-red-400" : result.overall_risk === "safe" ? "text-emerald-400" : "text-amber-400"} mb-1`}>
                      {result.overall_risk === "critical" ? "Critical Risk Detected" : result.overall_risk === "high" ? "High Risk Portfolio" : result.overall_risk === "moderate" ? "Moderate Risk" : "Healthy Portfolio"}
                    </h3>
                    <p className="text-sm text-white/70">{result.summary}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 text-center">
                  <div className="text-xs text-gray-500 uppercase mb-1">Total Value</div>
                  <div className="text-xl font-bold text-white">${result.total_value_usd.toFixed(0)}</div>
                </div>
                <div className="bg-red-400/5 border border-red-400/10 rounded-xl p-4 text-center">
                  <div className="text-xs text-red-400 uppercase mb-1">At Risk</div>
                  <div className="text-xl font-bold text-red-400">${result.at_risk_value.toFixed(0)}</div>
                </div>
                <div className="bg-emerald-400/5 border border-emerald-400/10 rounded-xl p-4 text-center">
                  <div className="text-xs text-emerald-400 uppercase mb-1">Safe</div>
                  <div className="text-xl font-bold text-emerald-400">${result.safe_value.toFixed(0)}</div>
                </div>
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 text-center">
                  <div className="text-xs text-gray-500 uppercase mb-1">Tokens</div>
                  <div className="text-xl font-bold text-white">{result.tokens.length}</div>
                </div>
              </div>

              <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 mb-6">
                <div className="text-xs font-semibold text-gray-500 uppercase mb-3">Risk Distribution</div>
                <div className="flex h-4 rounded-full overflow-hidden">
                  {result.safeCount > 0 && <div className="bg-emerald-400 h-full" style={{ width: `${(result.safeCount / result.tokens.length) * 100}%` }} />}
                  {result.moderateCount > 0 && <div className="bg-amber-400 h-full" style={{ width: `${(result.moderateCount / result.tokens.length) * 100}%` }} />}
                  {result.riskyCount > 0 && <div className="bg-orange-400 h-full" style={{ width: `${(result.riskyCount / result.tokens.length) * 100}%` }} />}
                  {result.dangerCount > 0 && <div className="bg-red-400 h-full" style={{ width: `${(result.dangerCount / result.tokens.length) * 100}%` }} />}
                </div>
                <div className="flex gap-4 mt-2 flex-wrap">
                  {result.safeCount > 0 && <div className="flex items-center gap-1 text-[10px] text-emerald-400"><div className="w-2 h-2 rounded-full bg-emerald-400" />Safe: {result.safeCount}</div>}
                  {result.moderateCount > 0 && <div className="flex items-center gap-1 text-[10px] text-amber-400"><div className="w-2 h-2 rounded-full bg-amber-400" />Moderate: {result.moderateCount}</div>}
                  {result.riskyCount > 0 && <div className="flex items-center gap-1 text-[10px] text-orange-400"><div className="w-2 h-2 rounded-full bg-orange-400" />Risky: {result.riskyCount}</div>}
                  {result.dangerCount > 0 && <div className="flex items-center gap-1 text-[10px] text-red-400"><div className="w-2 h-2 rounded-full bg-red-400" />Danger: {result.dangerCount}</div>}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-semibold text-gray-500 uppercase mb-2">Token Details</div>
                {result.tokens.map((item: any, i: number) => (
                  <motion.div key={item.token.address} className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 cursor-pointer hover:border-emerald-400/20 transition-colors" onClick={() => navigate(`/token/${item.token.address}`)} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400/20 to-emerald-400/5 flex items-center justify-center text-xs font-bold text-emerald-400">{item.token.symbol.slice(0, 2)}</div>
                        <div>
                          <div className="text-sm font-medium text-white">{item.token.name} <span className="text-gray-500">{item.token.symbol}</span></div>
                          <div className="text-xs text-gray-500">{item.quantity.toLocaleString()} tokens</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-white">${item.estimated_value_usd.toFixed(0)}</div>
                        <div className="flex items-center gap-2 mt-1 justify-end">
                          {item.trust_score && <span className={`text-xs font-mono font-bold ${item.trust_score.score >= 75 ? "text-emerald-400" : item.trust_score.score >= 50 ? "text-amber-400" : "text-red-400"}`}>{Math.round(item.trust_score.score)}/100</span>}
                          <span className={`text-[10px] px-1.5 py-0.5 rounded border ${item.risk_level === "safe" ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" : item.risk_level === "moderate" ? "text-amber-400 bg-amber-400/10 border-amber-400/20" : item.risk_level === "risky" ? "text-orange-400 bg-orange-400/10 border-orange-400/20" : "text-red-400 bg-red-400/10 border-red-400/20"}`}>{item.risk_level}</span>
                        </div>
                      </div>
                    </div>
                    {item.risk_flags.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-white/[0.03]">
                        <div className="flex gap-1 flex-wrap">
                          {item.risk_flags.slice(0, 3).map((f: any) => (
                            <span key={f.id} className={`text-[9px] px-1.5 py-0.5 rounded ${f.severity === "CRITICAL" ? "bg-red-400/10 text-red-400" : "bg-amber-400/10 text-amber-400"}`}>{f.flagType}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
