import React, { useEffect, useState } from 'react';
import { Bot, Twitter, Linkedin, Github, Facebook, Instagram } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface NavItem {
  name: string;
  href: string;
}

interface FooterData {
  site_name: string;
  twitter_link?: string;
  linkedin_link?: string;
  facebook_link?: string;
  instagram_link?: string;
  footer_description?: string;
  footer_services_links: NavItem[];
  footer_legal_links: NavItem[];
}

const Footer = () => {
  const [data, setData] = useState<FooterData>({
    site_name: 'AI Solutions',
    twitter_link: '#',
    linkedin_link: '#',
    facebook_link: '#',
    instagram_link: '#',
    footer_description: 'Empowering businesses with cutting-edge AI technology and intelligent automation solutions.',
    footer_services_links: [
      { name: 'Machine Learning', href: '#' },
      { name: 'Natural Language Processing', href: '#' },
      { name: 'Computer Vision', href: '#' },
      { name: 'AI Consulting', href: '#' }
    ],
    footer_legal_links: [
      { name: 'Privacy Policy', href: '#' },
      { name: 'Terms of Service', href: '#' },
      { name: 'Cookie Policy', href: '#' }
    ]
  });

  useEffect(() => {
    fetchSettings();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('footer_settings')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'cms_settings'
        },
        (payload) => {
          const newData = payload.new as any;
          if (newData) {
             let footerServices = undefined;
             let footerLegal = undefined;
             
             if (newData.navigation && !Array.isArray(newData.navigation)) {
                 footerServices = newData.navigation.footer_services;
                 footerLegal = newData.navigation.footer_legal;
             }

             setData(prev => ({
                ...prev,
                ...newData,
                footer_description: newData.footer_description ?? prev.footer_description,
                footer_services_links: footerServices ?? prev.footer_services_links,
                footer_legal_links: footerLegal ?? prev.footer_legal_links
             }));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchSettings = async () => {
    try {
      const { data: settingsData, error } = await supabase
        .from('cms_settings')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching settings:', error);
        return;
      }

      if (settingsData) {
        let footerServices = undefined;
        let footerLegal = undefined;

        if (settingsData.navigation && !Array.isArray(settingsData.navigation)) {
             footerServices = settingsData.navigation.footer_services;
             footerLegal = settingsData.navigation.footer_legal;
        }

        setData({
          ...settingsData,
          footer_description: settingsData.footer_description || 'Empowering businesses with cutting-edge AI technology and intelligent automation solutions.',
          footer_services_links: footerServices || [
             { name: 'Machine Learning', href: '#' },
             { name: 'Natural Language Processing', href: '#' },
             { name: 'Computer Vision', href: '#' },
             { name: 'AI Consulting', href: '#' }
          ],
          footer_legal_links: footerLegal || [
             { name: 'Privacy Policy', href: '#' },
             { name: 'Terms of Service', href: '#' },
             { name: 'Cookie Policy', href: '#' }
          ]
        });
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Bot className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold">{data.site_name}</span>
            </div>
            <p className="text-gray-400 mb-4">
              {data.footer_description}
            </p>
            <div className="flex space-x-4">
              {data.twitter_link && (
                <a href={data.twitter_link} className="text-gray-400 hover:text-blue-400 transition-colors" aria-label="Twitter">
                  <Twitter className="h-5 w-5" />
                </a>
              )}
              {data.linkedin_link && (
                <a href={data.linkedin_link} className="text-gray-400 hover:text-blue-400 transition-colors" aria-label="LinkedIn">
                  <Linkedin className="h-5 w-5" />
                </a>
              )}
              {data.facebook_link && (
                <a href={data.facebook_link} className="text-gray-400 hover:text-blue-400 transition-colors" aria-label="Facebook">
                  <Facebook className="h-5 w-5" />
                </a>
              )}
              {data.instagram_link && (
                <a href={data.instagram_link} className="text-gray-400 hover:text-blue-400 transition-colors" aria-label="Instagram">
                  <Instagram className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-gray-400">
              {data.footer_services_links.map((item, index) => (
                <li key={index}>
                  <a href={item.href} className="hover:text-white transition-colors">
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-gray-400">
              {data.footer_legal_links.map((item, index) => (
                <li key={index}>
                  <a href={item.href} className="hover:text-white transition-colors">
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} {data.site_name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;