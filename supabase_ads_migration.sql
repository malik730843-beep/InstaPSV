-- =============================================
-- ADS TABLE MIGRATION
-- Run this in your Supabase SQL Editor
-- =============================================

-- Create ads table if it doesn't exist
CREATE TABLE IF NOT EXISTS ads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'header',
    code TEXT NOT NULL,
    enabled BOOLEAN DEFAULT true,
    device_target VARCHAR(20) DEFAULT 'all',
    page_target VARCHAR(50) DEFAULT 'all',
    delay_seconds INTEGER DEFAULT 0,
    start_date DATE,
    end_date DATE,
    impressions INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add missing columns if they don't exist (for existing tables)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='ads' AND column_name='start_date') THEN
        ALTER TABLE ads ADD COLUMN start_date DATE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='ads' AND column_name='end_date') THEN
        ALTER TABLE ads ADD COLUMN end_date DATE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='ads' AND column_name='delay_seconds') THEN
        ALTER TABLE ads ADD COLUMN delay_seconds INTEGER DEFAULT 0;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='ads' AND column_name='impressions') THEN
        ALTER TABLE ads ADD COLUMN impressions INTEGER DEFAULT 0;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='ads' AND column_name='clicks') THEN
        ALTER TABLE ads ADD COLUMN clicks INTEGER DEFAULT 0;
    END IF;
END $$;

-- Create seo_settings table if needed
CREATE TABLE IF NOT EXISTS seo_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create site_settings table if needed
CREATE TABLE IF NOT EXISTS site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create site_verification table if needed
CREATE TABLE IF NOT EXISTS site_verification (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service VARCHAR(50) NOT NULL,
    verification_type VARCHAR(50) NOT NULL,
    verification_code TEXT NOT NULL,
    is_verified BOOLEAN DEFAULT false,
    enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- INSERT DUMMY TEST AD
-- =============================================

INSERT INTO ads (name, type, code, enabled, device_target, page_target)
VALUES (
    'Test Header Banner',
    'header',
    '<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 20px; text-align: center; border-radius: 8px; font-family: system-ui, sans-serif;">
        <strong>🎉 Special Offer!</strong> Get 50% off on Premium Features. 
        <a href="#" style="color: #fff; text-decoration: underline; margin-left: 10px;">Learn More →</a>
    </div>',
    true,
    'all',
    'all'
) ON CONFLICT DO NOTHING;

-- Insert a sticky footer ad
INSERT INTO ads (name, type, code, enabled, device_target, page_target)
VALUES (
    'Sticky Footer Promo',
    'sticky_bottom',
    '<div style="background: #1a1a2e; color: white; padding: 12px 20px; display: flex; align-items: center; justify-content: center; gap: 15px; font-family: system-ui, sans-serif;">
        <span>📢 Try InstaPSV Premium - View unlimited stories anonymously!</span>
        <a href="#" style="background: #e94560; color: white; padding: 8px 16px; border-radius: 20px; text-decoration: none; font-weight: 600;">Upgrade Now</a>
    </div>',
    true,
    'all',
    'all'
) ON CONFLICT DO NOTHING;

-- Insert a sidebar ad
INSERT INTO ads (name, type, code, enabled, device_target, page_target, delay_seconds)
VALUES (
    'Sidebar Newsletter',
    'sidebar',
    '<div style="background: #f8f9fa; border: 1px solid #e9ecef; padding: 20px; border-radius: 12px; text-align: center; font-family: system-ui, sans-serif;">
        <h4 style="margin: 0 0 10px; color: #333;">📧 Subscribe</h4>
        <p style="color: #666; font-size: 14px; margin: 0 0 15px;">Get weekly Instagram tips!</p>
        <input type="email" placeholder="your@email.com" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; margin-bottom: 10px;" />
        <button style="width: 100%; background: #6366f1; color: white; border: none; padding: 10px; border-radius: 6px; cursor: pointer; font-weight: 600;">Subscribe</button>
    </div>',
    true,
    'desktop',
    'posts',
    0
) ON CONFLICT DO NOTHING;

-- =============================================
-- OVERLAY AD (Google Vignette Style - Shows on page navigation)
-- =============================================
INSERT INTO ads (name, type, code, enabled, device_target, page_target, delay_seconds)
VALUES (
    'Vignette Overlay Ad',
    'overlay',
    '<div style="font-family: system-ui, -apple-system, sans-serif;">
        <h2 style="margin: 0 0 12px; color: #202124; font-size: 22px; font-weight: 400; line-height: 1.3;">
            Make the switch to Premium
        </h2>
        <p style="margin: 0; color: #5f6368; font-size: 15px; line-height: 1.5;">
            View unlimited stories, download in HD quality & enjoy ad-free browsing experience.
        </p>
    </div>',
    true,
    'all',
    'all',
    2
) ON CONFLICT DO NOTHING;

-- =============================================
-- POPUP/INTERSTITIAL AD (Triggers on profile search)
-- =============================================
INSERT INTO ads (name, type, code, enabled, device_target, page_target, delay_seconds)
VALUES (
    'Search Interstitial Ad',
    'popup',
    '<div style="text-align: center; padding: 20px; font-family: system-ui, sans-serif;">
        <p style="color: #999; font-size: 12px; margin: 0 0 15px;">ADVERTISEMENT</p>
        <div style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); padding: 25px; border-radius: 12px; color: white; margin-bottom: 15px;">
            <p style="margin: 0 0 8px; font-size: 22px; font-weight: 700;">⚡ Fast & Anonymous</p>
            <p style="margin: 0; font-size: 14px; opacity: 0.9;">View unlimited stories with Premium</p>
        </div>
        <p style="color: #666; font-size: 13px; margin: 0;">Your search will continue automatically...</p>
    </div>',
    true,
    'all',
    'all',
    0
) ON CONFLICT DO NOTHING;
