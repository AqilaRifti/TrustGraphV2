import { z } from "zod";
import { createRouter, publicQuery } from "./middleware.js";
import { getDb } from "./queries/connection.js";
import { graphNodes, graphEdges } from "@db/schema";
import { MOCK_GRAPH_NODES, MOCK_GRAPH_EDGES } from "./mock-data.js";

export const graphRouter = createRouter({
  getData: publicQuery.query(async () => {
    try {
      const db = getDb();
      const nodes = await db.select().from(graphNodes).limit(100);
      const edges = await db.select().from(graphEdges).limit(200);

      if (nodes.length === 0) {
        return {
          nodes: MOCK_GRAPH_NODES,
          edges: MOCK_GRAPH_EDGES,
        };
      }

      return {
        nodes: nodes.map((n) => ({
          id: n.nodeId,
          type: n.type,
          label: n.label,
          score: n.score,
          tier: n.tier,
          cluster_id: n.clusterId,
          tags: (n.tags || []) as string[],
        })),
        edges: edges.map((e) => ({
          source: e.source,
          target: e.target,
          relationship_type: e.relationshipType,
          label: e.label,
          weight: e.weight,
        })),
      };
    } catch (e) {
      return {
        nodes: MOCK_GRAPH_NODES,
        edges: MOCK_GRAPH_EDGES,
      };
    }
  }),

  getFiltered: publicQuery
    .input(
      z.object({
        filter: z.enum(["all", "scammers", "trusted", "tokens"]).optional().default("all"),
      }).optional()
    )
    .query(async ({ input }) => {
      try {
        const db = getDb();
        const filter = input?.filter || "all";

        let nodes = await db.select().from(graphNodes).limit(100);
        if (nodes.length === 0) {
          return {
            nodes: MOCK_GRAPH_NODES.filter(n => {
              if (filter === "scammers") return (n.score || 50) < 30 && (n.type === "wallet" || n.type === "mixer");
              if (filter === "trusted") return (n.score || 50) >= 70 && (n.type === "wallet" || n.type === "cex");
              if (filter === "tokens") return n.type === "token";
              return true;
            }),
            edges: MOCK_GRAPH_EDGES,
          };
        }

        if (filter === "scammers") {
          nodes = nodes.filter((n) => (n.score || 50) < 30 && (n.type === "wallet" || n.type === "mixer"));
        } else if (filter === "trusted") {
          nodes = nodes.filter((n) => (n.score || 50) >= 70 && (n.type === "wallet" || n.type === "cex"));
        } else if (filter === "tokens") {
          nodes = nodes.filter((n) => n.type === "token");
        }

        const nodeIds = nodes.map((n) => n.nodeId);
        const allEdges = await db.select().from(graphEdges).limit(200);
        const edges = allEdges.filter((e) => nodeIds.includes(e.source) && nodeIds.includes(e.target));

        return {
          nodes: nodes.map((n) => ({
            id: n.nodeId,
            type: n.type,
            label: n.label,
            score: n.score,
            tier: n.tier,
            cluster_id: n.clusterId,
            tags: (n.tags || []) as string[],
          })),
          edges: edges.map((e) => ({
            source: e.source,
            target: e.target,
            relationship_type: e.relationshipType,
            label: e.label,
            weight: e.weight,
          })),
        };
      } catch (e) {
        const filter = input?.filter || "all";
        return {
          nodes: MOCK_GRAPH_NODES.filter(n => {
            if (filter === "scammers") return (n.score || 50) < 30 && (n.type === "wallet" || n.type === "mixer");
            if (filter === "trusted") return (n.score || 50) >= 70 && (n.type === "wallet" || n.type === "cex");
            if (filter === "tokens") return n.type === "token";
            return true;
          }),
          edges: MOCK_GRAPH_EDGES,
        };
      }
    }),
});
