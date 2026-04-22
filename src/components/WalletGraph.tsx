import { useCallback, useEffect, useState, memo } from "react";
import { ReactFlow, MiniMap, Controls, Background, useNodesState, useEdgesState, Handle, Position, type NodeProps } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { motion } from "framer-motion";
import { Maximize2 } from "lucide-react";
import type { GraphData } from "@/lib/types";
import { shortenAddress } from "@/lib/utils";

interface Props {
  data: GraphData;
  onNodeClick?: (nodeId: string, nodeType: string) => void;
}

function getNodeColor(score?: number, tier?: string | null): string {
  if (tier === "SAFE" || (score && score >= 75)) return "#00FF88";
  if (tier === "MODERATE" || (score && score >= 50)) return "#F5A623";
  if (tier === "RISKY" || (score && score >= 25)) return "#FF8800";
  return "#FF4444";
}

// ── CUSTOM NODE COMPONENTS ──

const WalletNode = memo(({ data, id }: NodeProps) => {
  const color = getNodeColor(data.score as number, data.tier as string);
  return (
    <div className="rounded-xl px-3 py-2 min-w-[130px] text-center cursor-pointer hover:scale-105 transition-transform"
      style={{ background: "rgba(17,17,19,0.95)", border: `1.5px solid ${color}40`, boxShadow: `0 0 16px ${color}15` }}>
      <Handle type="target" position={Position.Top} style={{ background: color, width: 6, height: 6, border: "none" }} />
      <div className="text-[10px] font-bold tracking-wider mb-0.5" style={{ color }}>{data.label as string}</div>
      <div className="text-[9px] text-gray-500 font-mono">{shortenAddress(id)}</div>
      <div className="flex items-center justify-center gap-1 mt-1">
        <div className="w-2 h-2 rounded-full" style={{ background: color }} />
        <span className="text-[9px] font-mono" style={{ color }}>{data.score as number}</span>
      </div>
      <Handle type="source" position={Position.Bottom} style={{ background: color, width: 6, height: 6, border: "none" }} />
    </div>
  );
});
WalletNode.displayName = "WalletNode";

const TokenNode = memo(({ data, id }: NodeProps) => {
  const color = getNodeColor(data.score as number, data.tier as string);
  return (
    <div className="rounded-lg px-3 py-2 min-w-[100px] text-center cursor-pointer hover:scale-105 transition-transform"
      style={{ background: "rgba(17,17,19,0.95)", border: `1.5px solid ${color}60`, boxShadow: `0 0 20px ${color}20` }}>
      <Handle type="target" position={Position.Top} style={{ background: color, width: 6, height: 6, border: "none" }} />
      <div className="text-[11px] font-bold" style={{ color }}>${data.label as string}</div>
      <div className="text-[9px] font-mono text-gray-500">{shortenAddress(id)}</div>
      <div className="text-[9px] mt-0.5" style={{ color }}>{data.score as number}/100</div>
      <Handle type="source" position={Position.Bottom} style={{ background: color, width: 6, height: 6, border: "none" }} />
    </div>
  );
});
TokenNode.displayName = "TokenNode";

const SpecialNode = memo(({ data }: NodeProps) => {
  const isMixer = data.label === "Tornado Mixer";
  const color = isMixer ? "#9B59FF" : "#3388FF";
  return (
    <div className="rounded-xl px-3 py-2 min-w-[120px] text-center"
      style={{ background: "rgba(17,17,19,0.95)", border: `1.5px solid ${color}50`, boxShadow: `0 0 16px ${color}15` }}>
      <Handle type="target" position={Position.Top} style={{ background: color, width: 6, height: 6, border: "none" }} />
      <Handle type="source" position={Position.Bottom} style={{ background: color, width: 6, height: 6, border: "none" }} />
      <Handle type="source" position={Position.Left} style={{ background: color, width: 6, height: 6, border: "none" }} />
      <Handle type="target" position={Position.Right} style={{ background: color, width: 6, height: 6, border: "none" }} />
      <div className="text-[10px] font-bold" style={{ color }}>{data.label as string}</div>
      <div className="text-[8px] text-gray-500 mt-0.5">{isMixer ? "Privacy Pool" : "Exchange"}</div>
    </div>
  );
});
SpecialNode.displayName = "SpecialNode";

const nodeTypes = { wallet: WalletNode, token: TokenNode, mixer: SpecialNode, cex: SpecialNode };

// ── MAIN COMPONENT ──

export default function WalletGraph({ data, onNodeClick }: Props) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [rfi, setRfi] = useState<any>(null);

  useEffect(() => {
    const centerX = 500;
    const centerY = 350;
    const pos: Record<string, { x: number; y: number }> = {};

    const clusterCenters: Record<string, { x: number; y: number }> = {
      scam_cluster_0: { x: centerX - 350, y: centerY - 150 },
      trusted_0: { x: centerX + 300, y: centerY - 100 },
      scam_cluster_1: { x: centerX - 200, y: centerY + 200 },
    };

    const clusters: Record<string, typeof data.nodes> = {};
    const unclustered: typeof data.nodes = [];
    data.nodes.forEach((n) => {
      if (n.cluster_id && clusterCenters[n.cluster_id]) {
        if (!clusters[n.cluster_id]) clusters[n.cluster_id] = [];
        clusters[n.cluster_id].push(n);
      } else {
        unclustered.push(n);
      }
    });

    Object.entries(clusters).forEach(([, clusterNodes]) => {
      const cx = clusterCenters[clusterNodes[0].cluster_id!].x;
      const cy = clusterCenters[clusterNodes[0].cluster_id!].y;
      clusterNodes.forEach((n, i) => {
        const angle = (i / Math.max(clusterNodes.length, 1)) * 2 * Math.PI;
        const r = 90;
        pos[n.id] = { x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r };
      });
    });

    unclustered.forEach((n, i) => {
      if (n.type === "mixer") pos[n.id] = { x: centerX - 450, y: centerY + 50 };
      else if (n.type === "cex") pos[n.id] = { x: centerX + 500, y: centerY - 250 };
      else {
        const angle = (i / Math.max(unclustered.length, 1)) * 2 * Math.PI;
        const r = 200;
        pos[n.id] = { x: centerX + Math.cos(angle) * r, y: centerY + Math.sin(angle) * r };
      }
    });

    setNodes(
      data.nodes.map((n) => ({
        id: n.id,
        type: n.type,
        position: pos[n.id] || { x: centerX, y: centerY },
        data: { label: n.label, score: n.score, tier: n.tier, tags: n.tags },
      }))
    );

    setEdges(
      data.edges.map((e, i) => ({
        id: `e-${i}`,
        source: e.source,
        target: e.target,
        label: e.label || e.relationship_type,
        animated: e.relationship_type === "funded" || e.relationship_type === "mixer_flow",
        style: {
          stroke: e.relationship_type === "mixer_flow" ? "#9B59FF60" : e.relationship_type === "cex_deposit" ? "#3388FF60" : "rgba(255,255,255,0.12)",
          strokeWidth: Math.max(1, Math.min(3, e.weight || 1)),
        },
        labelStyle: { fill: "rgba(255,255,255,0.35)", fontSize: 9 },
        type: "smoothstep",
      }))
    );
  }, [data, setNodes, setEdges]);

  const onNodeClickHandler = useCallback(
    (_: React.MouseEvent, node: any) => {
      const type = node.type === "token" ? "token" : "wallet";
      onNodeClick?.(node.id, type);
    },
    [onNodeClick]
  );

  return (
    <motion.div className="w-full h-full min-h-[500px] rounded-xl overflow-hidden relative border border-white/[0.06] bg-[#0A0A0B]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClickHandler}
        onInit={setRfi}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.15, duration: 800 }}
        proOptions={{ hideAttribution: true }}
        style={{ background: "transparent" }}
        defaultEdgeOptions={{ type: "smoothstep" }}
      >
        <Background color="rgba(255,255,255,0.025)" gap={30} size={1} />
        <Controls className="!bg-[#111113]/90 !border-white/10 !rounded-lg !shadow-none" />
        <MiniMap
          className="!bg-[#111113]/95 !border !border-white/10 !rounded-lg"
          nodeColor={(n) => {
            const s = (n.data?.score as number) || 50;
            return s >= 75 ? "#00FF8860" : s >= 50 ? "#F5A62360" : s >= 25 ? "#FF880060" : "#FF444460";
          }}
          maskColor="rgba(10,10,11,0.75)"
          maskStrokeColor="rgba(255,255,255,0.08)"
          nodeStrokeWidth={0}
          pannable
          zoomable
        />
      </ReactFlow>

      <div className="absolute top-3 left-3 bg-[#111113]/90 backdrop-blur-xl border border-white/[0.08] rounded-xl p-3 space-y-1.5 z-10">
        <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Risk Legend</div>
        {[
          { color: "#00FF88", label: "SAFE (75+)" },
          { color: "#F5A623", label: "MODERATE (50+)" },
          { color: "#FF8800", label: "RISKY (25+)" },
          { color: "#FF4444", label: "DANGER (<25)" },
          { color: "#9B59FF", label: "MIXER" },
          { color: "#3388FF", label: "CEX" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
            <span className="text-[10px] text-gray-400">{item.label}</span>
          </div>
        ))}
      </div>

      <button onClick={() => rfi?.fitView({ padding: 0.15, duration: 800 })} className="absolute bottom-3 right-14 p-2 bg-[#111113]/90 backdrop-blur border border-white/[0.08] rounded-lg text-gray-400 hover:text-white transition-colors z-10">
        <Maximize2 size={14} />
      </button>
    </motion.div>
  );
}
