"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from "recharts";
import { getScoreColor } from "@/lib/utils";

interface ScoreData {
  dimension: string;
  tokenA: number;
  tokenB: number;
}

interface Props {
  data: ScoreData[];
}

export default function ScoreComparisonChart({ data }: Props) {
  return (
    <div className="w-full h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }} barCategoryGap="20%">
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis
            dataKey="dimension"
            tick={{ fill: "#6b7280", fontSize: 10 }}
            tickLine={false}
            axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fill: "#6b7280", fontSize: 10 }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#111113",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "8px",
              fontSize: "12px",
            }}
            itemStyle={{ color: "#fff" }}
            formatter={(value: number, name: string) => [`${Math.round(value)}`, name === "tokenA" ? "Token A" : "Token B"]}
          />
          <Legend
            formatter={(value: string) => (
              <span className="text-xs text-gray-400">{value === "tokenA" ? "Token A" : "Token B"}</span>
            )}
          />
          <Bar dataKey="tokenA" fill="#00FF88" radius={[4, 4, 0, 0]} />
          <Bar dataKey="tokenB" fill="#9B59FF" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
