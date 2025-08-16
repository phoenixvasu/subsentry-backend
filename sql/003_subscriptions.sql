-- sql/003_subscriptions.sql

CREATE TABLE IF NOT EXISTS subscriptions (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    service_name TEXT NOT NULL,
    category TEXT NOT NULL,
    cost NUMERIC(10, 2) NOT NULL,
    billing_cycle TEXT NOT NULL,
    auto_renews BOOLEAN NOT NULL,
    start_date DATE NOT NULL,
    annualized_cost NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add an index for user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);

-- Add an index for service_name for search functionality
CREATE INDEX IF NOT EXISTS idx_subscriptions_service_name ON subscriptions(service_name);

-- Add an index for category for filtering
CREATE INDEX IF NOT EXISTS idx_subscriptions_category ON subscriptions(category);

-- Add an index for billing_cycle for filtering
CREATE INDEX IF NOT EXISTS idx_subscriptions_billing_cycle ON subscriptions(billing_cycle);

-- Add an index for start_date for sorting
CREATE INDEX IF NOT EXISTS idx_subscriptions_start_date ON subscriptions(start_date);

