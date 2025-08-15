-- Extensions (safe if already enabled)
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- users
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  service_name VARCHAR(255) NOT NULL,
  category VARCHAR(255) NOT NULL,
  cost NUMERIC(10,2) NOT NULL CHECK (cost >= 0),
  billing_cycle TEXT NOT NULL CHECK (billing_cycle IN ('Monthly','Quarterly','Yearly')),
  auto_renews BOOLEAN NOT NULL DEFAULT TRUE,
  start_date DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  annualized_cost NUMERIC(10,2) NOT NULL
);

-- indexes
CREATE INDEX IF NOT EXISTS idx_subs_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subs_billing_cycle ON subscriptions(billing_cycle);
CREATE INDEX IF NOT EXISTS idx_subs_created_at ON subscriptions(created_at);
-- for search on service_name
CREATE INDEX IF NOT EXISTS idx_subs_service_name_trgm ON subscriptions USING GIN (service_name gin_trgm_ops);
