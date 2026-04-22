import {
  pgTable,
  pgEnum,
  serial,
  varchar,
  text,
  timestamp,
  integer,
  real,
  boolean,
  jsonb,
  bigint,
} from "drizzle-orm/pg-core";

// Enums
export const roleEnum = pgEnum("role", ["user", "admin"]);
export const tierEnum = pgEnum("tier", ["SAFE", "MODERATE", "RISKY", "DANGER"]);
export const severityEnum = pgEnum("severity", ["LOW", "MEDIUM", "HIGH", "CRITICAL"]);
export const alertSeverityEnum = pgEnum("alert_severity", ["info", "warning", "critical"]);
export const nodeTypeEnum = pgEnum("node_type", ["wallet", "token", "mixer", "cex"]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("union_id", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  role: roleEnum("role").default("user").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  lastSignInAt: timestamp("last_sign_in_at").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ── Tokens Table ──
export const tokens = pgTable("tokens", {
  id: serial("id").primaryKey(),
  address: varchar("address", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  symbol: varchar("symbol", { length: 50 }).notNull(),
  deployer: varchar("deployer", { length: 255 }).notNull(),
  chain: varchar("chain", { length: 50 }).default("bsc").notNull(),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Token = typeof tokens.$inferSelect;
export type InsertToken = typeof tokens.$inferInsert;

// ── Wallets Table ──
export const wallets = pgTable("wallets", {
  id: serial("id").primaryKey(),
  address: varchar("address", { length: 255 }).notNull().unique(),
  firstSeen: timestamp("first_seen"),
  totalTokensDeployed: integer("total_tokens_deployed").default(0).notNull(),
  rugCount: integer("rug_count").default(0).notNull(),
  reputationScore: real("reputation_score").default(50).notNull(),
  clusterId: varchar("cluster_id", { length: 255 }),
  tags: jsonb("tags"),
  metadata: jsonb("metadata"),
  displayName: varchar("display_name", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Wallet = typeof wallets.$inferSelect;
export type InsertWallet = typeof wallets.$inferInsert;

// ── Trust Scores Table ──
export const trustScores = pgTable("trust_scores", {
  id: serial("id").primaryKey(),
  tokenAddress: varchar("token_address", { length: 255 }).notNull(),
  score: real("score").notNull(),
  tier: tierEnum("tier").notNull(),
  breakdown: jsonb("breakdown"),
  aiExplanation: text("ai_explanation"),
  confidence: real("confidence").default(0.8),
  modelVersion: varchar("model_version", { length: 100 }).default("qwen-3-235b"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type TrustScore = typeof trustScores.$inferSelect;
export type InsertTrustScore = typeof trustScores.$inferInsert;

// ── Risk Flags Table ──
export const riskFlags = pgTable("risk_flags", {
  id: serial("id").primaryKey(),
  tokenAddress: varchar("token_address", { length: 255 }).notNull(),
  flagType: varchar("flag_type", { length: 100 }).notNull(),
  severity: severityEnum("severity").notNull(),
  description: text("description").notNull(),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type RiskFlag = typeof riskFlags.$inferSelect;
export type InsertRiskFlag = typeof riskFlags.$inferInsert;

// ── Alerts Table ──
export const alerts = pgTable("alerts", {
  id: serial("id").primaryKey(),
  tokenAddress: varchar("token_address", { length: 255 }).notNull(),
  tokenSymbol: varchar("token_symbol", { length: 50 }),
  type: varchar("type", { length: 100 }).notNull(),
  severity: alertSeverityEnum("severity").notNull(),
  message: text("message").notNull(),
  read: boolean("read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Alert = typeof alerts.$inferSelect;
export type InsertAlert = typeof alerts.$inferInsert;

// ── Graph Nodes Table ──
export const graphNodes = pgTable("graph_nodes", {
  id: serial("id").primaryKey(),
  nodeId: varchar("node_id", { length: 255 }).notNull().unique(),
  type: nodeTypeEnum("type").notNull(),
  label: varchar("label", { length: 255 }).notNull(),
  score: real("score"),
  tier: varchar("tier", { length: 50 }),
  clusterId: varchar("cluster_id", { length: 255 }),
  tags: jsonb("tags"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type GraphNode = typeof graphNodes.$inferSelect;
export type InsertGraphNode = typeof graphNodes.$inferInsert;

// ── Graph Edges Table ──
export const graphEdges = pgTable("graph_edges", {
  id: serial("id").primaryKey(),
  source: varchar("source", { length: 255 }).notNull(),
  target: varchar("target", { length: 255 }).notNull(),
  relationshipType: varchar("relationship_type", { length: 100 }).notNull(),
  label: varchar("label", { length: 255 }),
  weight: real("weight").default(1),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type GraphEdge = typeof graphEdges.$inferSelect;
export type InsertGraphEdge = typeof graphEdges.$inferInsert;

// ── Favorites Table ──
export const favorites = pgTable("favorites", {
  id: serial("id").primaryKey(),
  tokenAddress: varchar("token_address", { length: 255 }).notNull(),
  walletAddress: varchar("wallet_address", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Favorite = typeof favorites.$inferSelect;
