-- Enable Row Level Security (RLS) on all tables
-- This is a best practice for Supabase

-- 1. Hero Section
CREATE TABLE IF NOT EXISTS cms_hero (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  headline TEXT NOT NULL,
  subheadline TEXT NOT NULL,
  cta_text TEXT NOT NULL,
  cta_link TEXT NOT NULL,
  image_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE cms_hero ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on cms_hero"
  ON cms_hero FOR SELECT
  USING (true);

CREATE POLICY "Allow authenticated update access on cms_hero"
  ON cms_hero FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated insert access on cms_hero"
  ON cms_hero FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');


-- 2. Stats Section
CREATE TABLE IF NOT EXISTS cms_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  number TEXT NOT NULL,
  label TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE cms_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on cms_stats"
  ON cms_stats FOR SELECT
  USING (true);

CREATE POLICY "Allow authenticated all access on cms_stats"
  ON cms_stats FOR ALL
  USING (auth.role() = 'authenticated');


-- 3. Services Section
CREATE TABLE IF NOT EXISTS cms_services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE cms_services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on cms_services"
  ON cms_services FOR SELECT
  USING (true);

CREATE POLICY "Allow authenticated all access on cms_services"
  ON cms_services FOR ALL
  USING (auth.role() = 'authenticated');


-- 4. About Section
CREATE TABLE IF NOT EXISTS cms_about (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE cms_about ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on cms_about"
  ON cms_about FOR SELECT
  USING (true);

CREATE POLICY "Allow authenticated all access on cms_about"
  ON cms_about FOR ALL
  USING (auth.role() = 'authenticated');

-- 5. General Settings (Footer/Contact)
CREATE TABLE IF NOT EXISTS cms_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  site_name TEXT NOT NULL DEFAULT 'AI Solutions',
  contact_email TEXT,
  contact_phone TEXT,
  address TEXT,
  facebook_link TEXT,
  twitter_link TEXT,
  linkedin_link TEXT,
  instagram_link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE cms_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on cms_settings"
  ON cms_settings FOR SELECT
  USING (true);

CREATE POLICY "Allow authenticated all access on cms_settings"
  ON cms_settings FOR ALL
  USING (auth.role() = 'authenticated');
