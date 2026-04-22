export interface Token {
  id: number;
  address: string;
  name: string;
  symbol: string;
  deployer: string;
  chain: string;
  metadata: Record<string, any> | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Wallet {
  id: number;
  address: string;
  firstSeen: Date | null;
  totalTokensDeployed: number;
  rugCount: number;
  reputationScore: number;
  clusterId: string | null;
  tags: string[] | null;
  metadata: Record<string, any> | null;
  displayName: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface TrustScore {
  id: number;
  tokenAddress: string;
  score: number;
  tier: "SAFE" | "MODERATE" | "RISKY" | "DANGER";
  breakdown: ScoreBreakdown | null;
  aiExplanation: string | null;
  confidence: number | null;
  modelVersion: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ScoreBreakdown {
  dev_wallet_history: number;
  token_structure: number;
  behavioral_patterns: number;
  wallet_graph_analysis: number;
  social_signals: number;
  anomaly_score: number;
}

export interface RiskFlag {
  id: number;
  tokenAddress: string;
  flagType: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  description: string;
  metadata: Record<string, any> | null;
  createdAt: Date;
}

export interface Alert {
  id: number;
  tokenAddress: string;
  tokenSymbol: string | null;
  type: string;
  severity: "info" | "warning" | "critical";
  message: string;
  read: boolean;
  createdAt: Date;
}

export interface GraphNode {
  id: string;
  type: "wallet" | "token" | "mixer" | "cex";
  label: string;
  score: number | null;
  tier: string | null;
  cluster_id: string | null;
  tags: string[];
}

export interface GraphEdge {
  source: string;
  target: string;
  relationship_type: string;
  label: string | null;
  weight: number | null;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface LeaderboardEntry {
  token: Token;
  trust_score: TrustScore | null;
  market_cap: number;
  holder_count: number;
  price_change_24h: number;
  liquidity_usd: number;
  volume_24h: number;
  risk_flag_count: number;
}

export interface TokenDetail {
  token: Token;
  trust_score: TrustScore | null;
  risk_flags: RiskFlag[];
  deployer_wallet: Wallet | null;
  holder_count: number;
  top_holders: Array<{ address: string; percentage: number }>;
  liquidity_usd: number;
  market_cap: number;
  price_change_24h: number;
  volume_24h: number;
}

export interface ScanResult {
  wallet_address: string;
  wallet_info: Wallet | null;
  tokens: Array<{
    token: Token;
    trust_score: TrustScore | null;
    risk_flags: RiskFlag[];
    estimated_value_usd: number;
    quantity: number;
    risk_level: string;
  }>;
  total_value_usd: number;
  at_risk_value: number;
  safe_value: number;
  overall_risk: string;
  summary: string;
  dangerCount: number;
  riskyCount: number;
  moderateCount: number;
  safeCount: number;
}

export interface AIAnalysisResult {
  explanation: string;
  keyConcerns?: string[];
  positiveSignals?: string[];
  recommendation: string;
  raw?: string;
}
