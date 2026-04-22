"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface Props {
  scores: Array<{ tier: string; count: number }>;
}

const COLORS: Record<string, string> = {
  SAFE: "#00FF88",
  MODERATE: "#F5A623",
  RISKY: "#FF8800",
  DANGER: "#FF4444",
  Unknown: "#6b7280",
};

const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({
  cx, cy, midAngle, innerRadius, outerRadius, percent,
}: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  if (percent < 0.05) return null;

  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={10} fontWeight={600}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function TrustScoreDistribution({ scores }: Props) {
  const data = scores.map((s) => ({
    name: s.tier,
    value: s.count,
    color: COLORS[s.tier] || COLORS.Unknown,
  }));

  return (
    <div className="w-full h-[250px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={90}
            innerRadius={50}
            fill="#8884d8"
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#111113",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "8px",
              fontSize: "12px",
            }}
            itemStyle={{ color: "#fff" }}
          />
          <Legend
            formatter={(value: string) => <span className="text-xs text-gray-400">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
