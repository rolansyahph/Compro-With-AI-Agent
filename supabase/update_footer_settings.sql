
-- Add footer_services_links and footer_legal_links columns to cms_settings
ALTER TABLE cms_settings ADD COLUMN IF NOT EXISTS footer_services_links JSONB DEFAULT '[\n  {\"name\": \"Machine Learning\", \"href\": \"#\"},\n  {\"name\": \"Natural Language Processing\", \"href\": \"#\"},\n  {\"name\": \"Computer Vision\", \"href\": \"#\"},\n  {\"name\": \"AI Consulting\", \"href\": \"#\"}\n]'::jsonb;

ALTER TABLE cms_settings ADD COLUMN IF NOT EXISTS footer_legal_links JSONB DEFAULT '[\n  {\"name\": \"Privacy Policy\", \"href\": \"#\"},\n  {\"name\": \"Terms of Service\", \"href\": \"#\"},\n  {\"name\": \"Cookie Policy\", \"href\": \"#\"}\n]'::jsonb;
