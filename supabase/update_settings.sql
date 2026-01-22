-- Add footer_description column
ALTER TABLE cms_settings ADD COLUMN IF NOT EXISTS footer_description TEXT;

-- Add navigation column with default value
ALTER TABLE cms_settings ADD COLUMN IF NOT EXISTS navigation JSONB DEFAULT '[
  {"name": "Home", "href": "/"},
  {"name": "About", "href": "/about"},
  {"name": "Services", "href": "/services"},
  {"name": "Contact", "href": "/contact"},
  {"name": "Login", "href": "/login"}
]'::jsonb;
