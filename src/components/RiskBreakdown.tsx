"use client";

import { motion } from "framer-motion";
import { Shield, FileCode, Activity, Network, MessageSquare, AlertTriangle } from "lucide-react";
import { getScoreColor } from "@/lib/utils";
import type { ScoreBreakdown, RiskFlag } from "@/lib/types";

interface Props {
  breakdown: ScoreBreakdown;
  riskFlags: RiskFlag[];
}

const dimensions = [
  { key: "dev_wallet_history" as const, label: "Dev Wallet History", weight: "25%", icon: Shield },
  { key: "token_structure" as const, label: "Token Structure", weight: "20%", icon: FileCode },
  { key: "behavioral_patterns" as const, label: "Behavioral Patterns", weight: "20%", icon: Activity },
  { key: "wallet_graph_analysis" as const, label: "Wallet Graph Analysis", weight: "15%", icon: Network },
  { key: "social_signals" as const, label: "Social Signals", weight: "10%", icon: MessageSquare },
  { key: "anomaly_score" as const, label: "Anomaly Detection", weight: "10%", icon: AlertTriangle },
];

function ScoreBar({ label, score, weight, icon: Icon, delay }: {
  label: string; score: number; weight: string; icon: React.ElementType; delay: number;
}) {
  const color = getScoreColor(score);

  return (
    <motion.div className="space-y-2" initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay, duration: 0.4 }}>
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <Icon size={14} className="text-gray-500" />
          <span className="text-white/80">{label}</span>
          <span className="text-gray-500 text-xs">({weight})</span>
        </div>
        <span className="font-mono font-semibold" style={{ color }}>{Math.round(score)}</span>
      </div>
      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
        <motion.div className="h-full rounded-full" style={{ backgroundColor: color }}
          initial={{ width: 0 }} animate={{ width: `${score}%` }} transition={{ delay: delay + 0.1, duration: 0.8, ease: "easeOut" }} />
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

export default function RiskBreakdown({ breakdown, riskFlags }: Props) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Score Breakdown</h3>
        {dimensions.map((dim, i) => (
          <ScoreBar key={dim.key} label={dim.label} score={breakdown[dim.key]} weight={dim.weight} icon={dim.icon} delay={i * 0.08} />
        ))}
      </div>

      {riskFlags.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-white/5">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Risk Flags ({riskFlags.length})</h3>
          <div className="space-y-2 max-h-60 overflow-y-auto scrollbar-thin">
            {riskFlags.map((flag, i) => (
              <motion.div key={flag.id} className="glass-card p-3 flex items-start gap-3" initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 + i * 0.05 }}>
                <AlertTriangle size={16} className={flag.severity === "CRITICAL" ? "text-red-400 mt-0.5" : flag.severity === "HIGH" ? "text-orange-400 mt-0.5" : "text-amber-400 mt-0.5"} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <SeverityBadge severity={flag.severity} />
                    <span className="text-xs font-mono text-gray-500">{flag.flagType}</span>
                  </div>
                  <p className="text-sm text-white/70">{flag.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
