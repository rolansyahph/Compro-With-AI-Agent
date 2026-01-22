import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { toast } from 'react-toastify';
import { Save, Loader2, Plus, Trash2 } from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
}

interface SettingsData {
  id?: string;
  site_name: string;
  contact_email: string;
  contact_phone: string;
  address: string;
  facebook_link: string;
  twitter_link: string;
  linkedin_link: string;
  instagram_link: string;
  footer_description: string;
  navigation: NavItem[];
  footer_services_links: NavItem[];
  footer_legal_links: NavItem[];
}

const NavEditor: React.FC<{
  title: string;
  items: NavItem[];
  onChange: (newItems: NavItem[]) => void;
}> = ({ title, items, onChange }) => {
  const handleChange = (index: number, field: keyof NavItem, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    onChange(newItems);
  };

  const add = () => {
    onChange([...items, { name: 'New Link', href: '#' }]);
  };

  const remove = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <div className="mt-6">
      <h4 className="text-md font-medium leading-6 text-gray-900 mb-2">{title}</h4>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex gap-2 items-center">
            <input
              type="text"
              placeholder="Name"
              className="block w-1/3 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
              value={item.name}
              onChange={(e) => handleChange(index, 'name', e.target.value)}
            />
            <input
              type="text"
              placeholder="URL"
              className="block w-1/2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
              value={item.href}
              onChange={(e) => handleChange(index, 'href', e.target.value)}
            />
            <button
              onClick={() => remove(index)}
              className="text-red-600 hover:text-red-800 p-2"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
        <button
          onClick={add}
          className="mt-2 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
        >
          <Plus className="-ml-0.5 mr-2 h-4 w-4" /> Add Item
        </button>
      </div>
    </div>
  );
};

const SettingsCMS: React.FC = () => {
  const [data, setData] = useState<SettingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('cms_settings')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        // Ensure navigation is initialized even if null in DB (backwards compatibility)
        const defaultNav = [
            { name: 'Home', href: '/' },
            { name: 'About', href: '/about' },
            { name: 'Services', href: '/services' },
            { name: 'Contact', href: '/contact' },
            { name: 'Login', href: '/login' }
        ];

        const defaultServices = [
          { name: 'Machine Learning', href: '#' },
          { name: 'Natural Language Processing', href: '#' },
          { name: 'Computer Vision', href: '#' },
          { name: 'AI Consulting', href: '#' }
        ];

        const defaultLegal = [
          { name: 'Privacy Policy', href: '#' },
          { name: 'Terms of Service', href: '#' },
          { name: 'Cookie Policy', href: '#' }
        ];

        setData({
            ...data,
            navigation: data.navigation || defaultNav,
            footer_services_links: data.footer_services_links || defaultServices,
            footer_legal_links: data.footer_legal_links || defaultLegal,
            footer_description: data.footer_description || ''
        });
      } else {
        setData({
          site_name: 'AI Solutions',
          contact_email: '',
          contact_phone: '',
          address: '',
          facebook_link: '',
          twitter_link: '',
          linkedin_link: '',
          instagram_link: '',
          footer_description: '',
          navigation: [
            { name: 'Home', href: '/' },
            { name: 'About', href: '/about' },
            { name: 'Services', href: '/services' },
            { name: 'Contact', href: '/contact' },
            { name: 'Login', href: '/login' }
          ],
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
      }
    } catch (error: any) {
      toast.error('Error fetching settings: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!data) return;
    setSaving(true);

    try {
      if (data.id) {
        const { error } = await supabase
          .from('cms_settings')
          .update(data)
          .eq('id', data.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('cms_settings')
          .insert([data]);
        if (error) throw error;
      }
      toast.success('Settings updated successfully!');
      fetchSettings();
    } catch (error: any) {
      toast.error('Error saving settings: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleNavChange = (items: NavItem[]) => {
    if (!data) return;
    setData({ ...data, navigation: items });
  };

  const handleServicesChange = (items: NavItem[]) => {
    if (!data) return;
    setData({ ...data, footer_services_links: items });
  };

  const handleLegalChange = (items: NavItem[]) => {
    if (!data) return;
    setData({ ...data, footer_legal_links: items });
  };

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;
  if (!data) return <div>No data found</div>;

  return (
    <div className="bg-white shadow sm:rounded-lg p-6">
      <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">General Settings</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Site Name</label>
          <input
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
            value={data.site_name}
            onChange={(e) => setData({ ...data, site_name: e.target.value })}
          />
        </div>
        
        <NavEditor 
          title="Navigation Menu" 
          items={data.navigation} 
          onChange={handleNavChange} 
        />
        
        <NavEditor 
          title="Footer Services Menu" 
          items={data.footer_services_links} 
          onChange={handleServicesChange} 
        />
        
        <NavEditor 
          title="Footer Legal Menu" 
          items={data.footer_legal_links} 
          onChange={handleLegalChange} 
        />

        <div className="border-t pt-6 mt-6"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-medium text-gray-700">Contact Email</label>
                <input
                    type="email"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                    value={data.contact_email}
                    onChange={(e) => setData({ ...data, contact_email: e.target.value })}
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Contact Phone</label>
                <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                    value={data.contact_phone}
                    onChange={(e) => setData({ ...data, contact_phone: e.target.value })}
                />
            </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Address</label>
          <textarea
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
            rows={3}
            value={data.address}
            onChange={(e) => setData({ ...data, address: e.target.value })}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Footer Description</label>
          <textarea
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
            rows={3}
            value={data.footer_description}
            onChange={(e) => setData({ ...data, footer_description: e.target.value })}
            placeholder="Empowering businesses with cutting-edge AI technology..."
          />
        </div>

        <h4 className="text-md font-medium leading-6 text-gray-900 mt-6">Social Links</h4>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-medium text-gray-700">Facebook</label>
                <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                    value={data.facebook_link}
                    onChange={(e) => setData({ ...data, facebook_link: e.target.value })}
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Twitter</label>
                <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                    value={data.twitter_link}
                    onChange={(e) => setData({ ...data, twitter_link: e.target.value })}
                />
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700">LinkedIn</label>
                <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                    value={data.linkedin_link}
                    onChange={(e) => setData({ ...data, linkedin_link: e.target.value })}
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Instagram</label>
                <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                    value={data.instagram_link}
                    onChange={(e) => setData({ ...data, instagram_link: e.target.value })}
                />
            </div>
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {saving ? <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" /> : <Save className="-ml-1 mr-2 h-4 w-4" />}
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsCMS;
