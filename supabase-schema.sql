-- TrustGraph Database Schema for Supabase PostgreSQL
-- Run this in Supabase SQL Editor if you prefer manual setup

-- Create Enums
CREATE TYPE role AS ENUM ('user', 'admin');
CREATE TYPE tier AS ENUM ('SAFE', 'MODERATE', 'RISKY', 'DANGER');
CREATE TYPE severity AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');
CREATE TYPE alert_severity AS ENUM ('info', 'warning', 'critical');
CREATE TYPE node_type AS ENUM ('wallet', 'token', 'mixer', 'cex');

-- Users Table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  union_id VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255),
  email VARCHAR(320),
  avatar TEXT,
  role role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  last_sign_in_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Tokens Table
CREATE TABLE tokens (
  id SERIAL PRIMARY KEY,
  address VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  symbol VARCHAR(50) NOT NULL,
  deployer VARCHAR(255) NOT NULL,
  chain VARCHAR(50) NOT NULL DEFAULT 'bsc',
  metadata JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Wallets Table
CREATE TABLE wallets (
  id SERIAL PRIMARY KEY,
  address VARCHAR(255) NOT NULL UNIQUE,
  first_seen TIMESTAMP,
  total_tokens_deployed INTEGER NOT NULL DEFAULT 0,
  rug_count INTEGER NOT NULL DEFAULT 0,
  reputation_score REAL NOT NULL DEFAULT 50,
  cluster_id VARCHAR(255),
  tags JSONB,
  metadata JSONB,
  display_name VARCHAR(255),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Trust Scores Table
CREATE TABLE trust_scores (
  id SERIAL PRIMARY KEY,
  token_address VARCHAR(255) NOT NULL,
  score REAL NOT NULL,
  tier tier NOT NULL,
  breakdown JSONB,
  ai_explanation TEXT,
  confidence REAL DEFAULT 0.8,
  model_version VARCHAR(100) DEFAULT 'qwen-3-235b',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Risk Flags Table
CREATE TABLE risk_flags (
  id SERIAL PRIMARY KEY,
  token_address VARCHAR(255) NOT NULL,
  flag_type VARCHAR(100) NOT NULL,
  severity severity NOT NULL,
  description TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Alerts Table
CREATE TABLE alerts (
  id SERIAL PRIMARY KEY,
  token_address VARCHAR(255) NOT NULL,
  token_symbol VARCHAR(50),
  type VARCHAR(100) NOT NULL,
  severity alert_severity NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Graph Nodes Table
CREATE TABLE graph_nodes (
  id SERIAL PRIMARY KEY,
  node_id VARCHAR(255) NOT NULL UNIQUE,
  type node_type NOT NULL,
  label VARCHAR(255) NOT NULL,
  score REAL,
  tier VARCHAR(50),
  cluster_id VARCHAR(255),
  tags JSONB,
  metadata JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Graph Edges Table
CREATE TABLE graph_edges (
  id SERIAL PRIMARY KEY,
  source VARCHAR(255) NOT NULL,
  target VARCHAR(255) NOT NULL,
  relationship_type VARCHAR(100) NOT NULL,
  label VARCHAR(255),
  weight REAL DEFAULT 1,
  metadata JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Favorites Table
CREATE TABLE favorites (
  id SERIAL PRIMARY KEY,
  token_address VARCHAR(255) NOT NULL,
  wallet_address VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create Indexes for Performance
CREATE INDEX idx_tokens_address ON tokens(address);
CREATE INDEX idx_tokens_deployer ON tokens(deployer);
CREATE INDEX idx_wallets_address ON wallets(address);
CREATE INDEX idx_trust_scores_token ON trust_scores(token_address);
CREATE INDEX idx_risk_flags_token ON risk_flags(token_address);
CREATE INDEX idx_alerts_token ON alerts(token_address);
CREATE INDEX idx_alerts_read ON alerts(read);
CREATE INDEX idx_graph_nodes_node_id ON graph_nodes(node_id);
CREATE INDEX idx_graph_edges_source ON graph_edges(source);
CREATE INDEX idx_graph_edges_target ON graph_edges(target);

-- Enable Row Level Security (Optional - for multi-tenant apps)
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE tokens ENABLE ROW LEVEL SECURITY;
-- etc.

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tokens_updated_at BEFORE UPDATE ON tokens
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_wallets_updated_at BEFORE UPDATE ON wallets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trust_scores_updated_at BEFORE UPDATE ON trust_scores
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'TrustGraph schema created successfully!';
  RAISE NOTICE 'Next step: Run the seed script with: npm run db:seed';
END $$;
