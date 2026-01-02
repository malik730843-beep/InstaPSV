-- ========================================
-- INSTAPSV CMS DATABASE SCHEMA
-- Run this in Supabase SQL Editor
-- ========================================

-- ======================
-- POSTS TABLE
-- ======================
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT,
  excerpt TEXT,
  featured_image TEXT,
  author_id UUID,
  status TEXT DEFAULT 'draft',
  scheduled_at TIMESTAMPTZ,
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT,
  og_title TEXT,
  og_description TEXT,
  og_image TEXT,
  twitter_card TEXT DEFAULT 'summary_large_image',
  robots TEXT DEFAULT 'index,follow',
  canonical_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

-- ======================
-- PAGES TABLE
-- ======================
CREATE TABLE IF NOT EXISTS pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT,
  template TEXT DEFAULT 'default',
  page_order INT DEFAULT 0,
  status TEXT DEFAULT 'draft',
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT,
  og_title TEXT,
  og_description TEXT,
  og_image TEXT,
  robots TEXT DEFAULT 'index,follow',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ======================
-- CATEGORIES TABLE
-- ======================
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#6366f1',
  parent_id UUID REFERENCES categories(id),
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ======================
-- POST-CATEGORIES JUNCTION
-- ======================
CREATE TABLE IF NOT EXISTS post_categories (
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, category_id)
);

-- ======================
-- SITE SETTINGS TABLE
-- ======================
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  type TEXT DEFAULT 'text',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Default site settings
INSERT INTO site_settings (key, value, type) VALUES
  ('site_name', 'InstaPSV', 'text'),
  ('tagline', 'Anonymous Instagram Viewer', 'text'),
  ('logo', '', 'image'),
  ('favicon', '', 'image'),
  ('social_image', '', 'image'),
  ('footer_text', '© 2024 InstaPSV. All rights reserved.', 'text'),
  ('contact_email', '', 'email'),
  ('ads_enabled', 'true', 'boolean'),
  ('maintenance_mode', 'false', 'boolean')
ON CONFLICT (key) DO NOTHING;

-- ======================
-- SEO SETTINGS TABLE
-- ======================
CREATE TABLE IF NOT EXISTS seo_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Default SEO settings
INSERT INTO seo_settings (key, value) VALUES
  ('default_title', 'InstaPSV - Anonymous Instagram Story Viewer'),
  ('default_description', 'View Instagram stories, profiles, and highlights anonymously.'),
  ('default_keywords', 'instagram viewer, anonymous, story viewer'),
  ('robots_default', 'index,follow'),
  ('canonical_base', ''),
  ('og_type', 'website'),
  ('twitter_site', '@instapsv')
ON CONFLICT (key) DO NOTHING;

-- ======================
-- ADS TABLE
-- ======================
CREATE TABLE IF NOT EXISTS ads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  code TEXT NOT NULL,
  enabled BOOLEAN DEFAULT true,
  device_target TEXT DEFAULT 'all',
  page_target TEXT DEFAULT 'all',
  category_target TEXT[],
  specific_urls TEXT[],
  exclude_urls TEXT[],
  delay_seconds INT DEFAULT 0,
  scroll_percent INT DEFAULT 0,
  exit_intent BOOLEAN DEFAULT false,
  frequency TEXT DEFAULT 'always',
  overlay_type TEXT,
  show_close_button BOOLEAN DEFAULT true,
  auto_close_seconds INT DEFAULT 0,
  dark_background BOOLEAN DEFAULT true,
  hide_from_admin BOOLEAN DEFAULT true,
  priority INT DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ======================
-- SITEMAP SETTINGS TABLE
-- ======================
CREATE TABLE IF NOT EXISTS sitemap_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  include_homepage BOOLEAN DEFAULT true,
  include_posts BOOLEAN DEFAULT true,
  include_pages BOOLEAN DEFAULT true,
  exclude_noindex BOOLEAN DEFAULT true,
  default_priority DECIMAL DEFAULT 0.8,
  default_changefreq TEXT DEFAULT 'weekly',
  last_generated TIMESTAMPTZ,
  auto_regenerate BOOLEAN DEFAULT true
);

-- Insert default sitemap settings if not exists
INSERT INTO sitemap_settings (id) 
SELECT gen_random_uuid() 
WHERE NOT EXISTS (SELECT 1 FROM sitemap_settings LIMIT 1);

-- ======================
-- SITE VERIFICATION TABLE
-- ======================
CREATE TABLE IF NOT EXISTS site_verification (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service TEXT UNIQUE NOT NULL,
  verification_type TEXT NOT NULL,
  verification_code TEXT NOT NULL,
  is_verified BOOLEAN DEFAULT false,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ======================
-- ACTIVITY LOGS TABLE
-- ======================
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ======================
-- ENABLE ROW LEVEL SECURITY
-- ======================
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE ads ENABLE ROW LEVEL SECURITY;
ALTER TABLE sitemap_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_verification ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- ======================
-- RLS POLICIES (Allow service role full access)
-- ======================
CREATE POLICY "Service role has full access to posts" ON posts FOR ALL USING (true);
CREATE POLICY "Service role has full access to pages" ON pages FOR ALL USING (true);
CREATE POLICY "Service role has full access to categories" ON categories FOR ALL USING (true);
CREATE POLICY "Service role has full access to post_categories" ON post_categories FOR ALL USING (true);
CREATE POLICY "Service role has full access to site_settings" ON site_settings FOR ALL USING (true);
CREATE POLICY "Service role has full access to seo_settings" ON seo_settings FOR ALL USING (true);
CREATE POLICY "Service role has full access to ads" ON ads FOR ALL USING (true);
CREATE POLICY "Service role has full access to sitemap_settings" ON sitemap_settings FOR ALL USING (true);
CREATE POLICY "Service role has full access to site_verification" ON site_verification FOR ALL USING (true);
CREATE POLICY "Service role has full access to activity_logs" ON activity_logs FOR ALL USING (true);

-- ======================
-- DONE!
-- ======================
SELECT 'Database setup complete!' as message;
