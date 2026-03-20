-- ========================================
-- INSTAPSV SUBSCRIPTION & CREDITS SYSTEM
-- Run this in Supabase SQL Editor
-- ========================================

-- ======================
-- USER SUBSCRIPTIONS TABLE
-- ======================
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'weekly', 'monthly')),
  credits_remaining INT NOT NULL DEFAULT 5,
  credits_total INT NOT NULL DEFAULT 5,
  plan_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for quick email lookups
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_email ON user_subscriptions(email);

-- ======================
-- SEARCH LOGS TABLE (for analytics)
-- ======================
CREATE TABLE IF NOT EXISTS search_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email TEXT,
  username_searched TEXT NOT NULL,
  credits_used INT NOT NULL DEFAULT 2,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ======================
-- ENABLE ROW LEVEL SECURITY
-- ======================
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_logs ENABLE ROW LEVEL SECURITY;

-- ======================
-- RLS POLICIES
-- ======================
CREATE POLICY "Service role has full access to user_subscriptions" ON user_subscriptions FOR ALL USING (true);
CREATE POLICY "Service role has full access to search_logs" ON search_logs FOR ALL USING (true);

-- ======================
-- DONE!
-- ======================
SELECT 'Subscription system tables created!' as message;
