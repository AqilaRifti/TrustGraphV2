"use client";

import { motion } from "framer-motion";
import { Sparkles, AlertTriangle, CheckCircle } from "lucide-react";
import type { TrustScore } from "@/lib/types";

interface Props {
  trustScore: TrustScore | null;
  loading?: boolean;
}

export default function AIExplanation({ trustScore, loading = false }: Props) {
  if (loading) {
    return (
      <div className="glass-card p-6 text-center">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mx-auto mb-3 animate-pulse">
          <Sparkles size={16} className="text-white" />
        </div>
        <p className="text-sm text-gray-500 animate-pulse">Analyzing with Cerebras Qwen 3 235B...</p>
      </div>
    );
  }

  if (!trustScore?.aiExplanation) {
    return (
      <div className="glass-card p-6 text-center">
        <Sparkles size={24} className="text-gray-500 mx-auto mb-2" />
        <p className="text-sm text-gray-500">AI analysis not yet available</p>
        <p className="text-xs text-gray-600 mt-1">Click &quot;Run Analysis&quot; to generate</p>
      </div>
    );
  }

  // Parse key concerns and positive signals from the explanation
  const concerns: string[] = [];
  const positives: string[] = [];

  const text = trustScore.aiExplanation;
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);

  sentences.forEach(s => {
    const lower = s.toLowerCase();
    if (lower.includes("risk") || lower.includes("danger") || lower.includes("avoid") ||
        lower.includes("concern") || lower.includes("warning") || lower.includes("critical") ||
        lower.includes("suspicious") || lower.includes("high") && lower.includes("tax")) {
      concerns.push(s.trim());
    } else if (lower.includes("strong") || lower.includes("excellent") || lower.includes("positive") ||
               lower.includes("safe") || lower.includes("organic") || lower.includes("healthy") ||
               lower.includes("good") || lower.includes("trusted") || lower.includes("locked")) {
      positives.push(s.trim());
    }
  });

  return (
    <motion.div className="glass-card p-6 space-y-4" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
          <Sparkles size={16} className="text-white" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">AI Risk Assessment</h3>
          <p className="text-xs text-gray-500">Powered by Cerebras Qwen 3 235B</p>
        </div>
      </div>

      <p className="text-sm text-white/80 leading-relaxed">{trustScore.aiExplanation}</p>

      {concerns.length > 0 && (
        <div className="pt-3 border-t border-white/5">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={14} className="text-orange-400" />
            <span className="text-xs font-semibold text-orange-400 uppercase tracking-wider">Key Concerns</span>
          </div>
          <ul className="space-y-1.5">
            {concerns.slice(0, 4).map((c, i) => (
              <li key={i} className="text-xs text-white/60 flex items-start gap-2">
                <span className="text-orange-400 mt-0.5">•</span>{c}
              </li>
            ))}
          </ul>
        </div>
      )}

      {positives.length > 0 && (
        <div className="pt-3 border-t border-white/5">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle size={14} className="text-emerald-400" />
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Positive Signals</span>
          </div>
          <ul className="space-y-1.5">
            {positives.slice(0, 3).map((p, i) => (
              <li key={i} className="text-xs text-white/60 flex items-start gap-2">
                <span className="text-emerald-400 mt-0.5">+</span>{p}
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
}
