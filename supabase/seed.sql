-- Seed data for CMS tables

-- 1. Hero Data
INSERT INTO cms_hero (headline, subheadline, cta_text, cta_link, image_url)
VALUES (
  'Transform Your Business with Artificial Intelligence',
  'Unlock the power of AI to automate processes, gain insights, and drive innovation. Our cutting-edge solutions help businesses scale efficiently and stay ahead of the competition.',
  'Get Started',
  '/contact',
  'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop&crop=center'
);

-- 2. Stats Data
INSERT INTO cms_stats (number, label, display_order)
VALUES 
  ('500+', 'Projects Completed', 1),
  ('98%', 'Client Satisfaction', 2),
  ('50+', 'AI Models Deployed', 3),
  ('24/7', 'Support Available', 4);

-- 3. Services Data (Initial placeholders based on typical AI services)
INSERT INTO cms_services (title, description, icon, display_order)
VALUES 
  ('AI Consulting', 'Strategic guidance to help you leverage AI technologies for your specific business needs.', 'BrainCircuit', 1),
  ('Machine Learning', 'Custom ML models trained on your data to predict trends and automate decision making.', 'Cpu', 2),
  ('Natural Language Processing', 'Chatbots, sentiment analysis, and text automation solutions.', 'MessageSquare', 3);

-- 4. About Data
INSERT INTO cms_about (title, content, image_url)
VALUES (
  'About AI Solutions',
  'We are a team of passionate AI experts dedicated to bringing the power of artificial intelligence to businesses of all sizes. Founded in 2023, our mission is to democratize AI technology and make it accessible, practical, and impactful.',
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80'
);

-- 5. Settings Data
INSERT INTO cms_settings (site_name, contact_email, contact_phone, address)
VALUES (
  'AI Solutions',
  'contact@aisolutions.com',
  '+1 (555) 123-4567',
  '123 Innovation Drive, Tech City, TC 90210'
);
