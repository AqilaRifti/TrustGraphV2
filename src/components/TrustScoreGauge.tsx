"use client";

import { motion } from "framer-motion";
import { getTierColor, getTierBg } from "@/lib/utils";
import type { TrustScore } from "@/lib/types";

interface Props {
  score: TrustScore | null;
  size?: number;
  animated?: boolean;
}

export default function TrustScoreGauge({ score, size = 200, animated = true }: Props) {
  if (!score) {
    return (
      <div className="flex items-center justify-center" style={{ width: size, height: size }}>
        <div className="text-gray-500 text-sm">No score</div>
      </div>
    );
  }

  const color = getTierColor(score.tier);
  const bgColor = getTierBg(score.tier);
  const circumference = 2 * Math.PI * 80;
  const offset = circumference - (score.score / 100) * circumference;
  const strokeWidth = 12;
  const radius = 80;
  const center = size / 2;

  return (
    <div className="relative flex flex-col items-center">
      <motion.div
        initial={animated ? { scale: 0.8, opacity: 0 } : false}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative"
        style={{ width: size, height: size }}
      >
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={strokeWidth}
          />
          <motion.circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={animated ? { strokeDashoffset: circumference } : { strokeDashoffset: offset }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
            style={{ filter: `drop-shadow(0 0 8px ${color}40)` }}
          />
          <circle
            cx={center}
            cy={center}
            r={radius - 6}
            fill="none"
            stroke={color}
            strokeWidth={2}
            opacity={0.15}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-5xl font-bold tabular-nums"
            style={{ color }}
            initial={animated ? { opacity: 0 } : false}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            {Math.round(score.score)}
          </motion.span>
          <span className="text-xs text-gray-500 mt-1 font-medium tracking-wider">/ 100</span>
        </div>
      </motion.div>

      <motion.div
        className="mt-4 px-4 py-1.5 rounded-full text-sm font-bold tracking-wider border"
        style={{ color, backgroundColor: bgColor, borderColor: `${color}30` }}
        initial={animated ? { y: 10, opacity: 0 } : false}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.4 }}
      >
        {score.tier}
      </motion.div>
    </div>
  );
}
