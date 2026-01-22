import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { toast } from 'react-toastify';
import { Save, Loader2 } from 'lucide-react';

interface HeroData {
  id?: string;
  headline: string;
  subheadline: string;
  cta_text: string;
  cta_link: string;
  image_url: string;
}

const HeroCMS: React.FC = () => {
  const [data, setData] = useState<HeroData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }

    const file = event.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `hero/${fileName}`;

    setUploading(true);

    try {
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      setData(prev => prev ? { ...prev, image_url: publicUrl } : null);
      toast.success('Image uploaded successfully');
    } catch (error: any) {
      toast.error('Error uploading image: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    fetchHeroData();
  }, []);

  const fetchHeroData = async () => {
    try {
      const { data, error } = await supabase
        .from('cms_hero')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setData(data);
      } else {
        // Default data if table is empty
        setData({
          headline: '',
          subheadline: '',
          cta_text: '',
          cta_link: '',
          image_url: ''
        });
      }
    } catch (error: any) {
      toast.error('Error fetching Hero data: ' + error.message);
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
          .from('cms_hero')
          .update(data)
          .eq('id', data.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('cms_hero')
          .insert([data]);
        if (error) throw error;
      }
      toast.success('Hero section updated successfully!');
      fetchHeroData(); // Refresh to get ID if inserted
    } catch (error: any) {
      toast.error('Error saving Hero data: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;
  if (!data) return <div>No data found</div>;

  return (
    <div className="bg-white shadow sm:rounded-lg p-6">
      <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Hero Section Configuration</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Headline</label>
          <input
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
            value={data.headline}
            onChange={(e) => setData({ ...data, headline: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Subheadline</label>
          <textarea
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
            rows={3}
            value={data.subheadline}
            onChange={(e) => setData({ ...data, subheadline: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">CTA Text</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
              value={data.cta_text}
              onChange={(e) => setData({ ...data, cta_text: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">CTA Link</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
              value={data.cta_link}
              onChange={(e) => setData({ ...data, cta_link: e.target.value })}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Hero Image</label>
          <div className="mt-1 flex flex-col sm:flex-row items-start sm:items-center gap-4 space-x-0 sm:space-x-4">
            {data.image_url && (
              <img 
                src={data.image_url} 
                alt="Hero Preview" 
                className="h-32 w-full sm:w-48 object-cover rounded-md border"
              />
            )}
            <div className="flex flex-col w-full sm:w-auto">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
              {uploading && <span className="text-sm text-gray-500 mt-1">Uploading...</span>}
            </div>
          </div>
          <input
            type="text"
            className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2 text-gray-400"
            value={data.image_url}
            readOnly
            placeholder="Image URL will appear here"
          />
        </div>
        <div className="flex justify-end">
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

export default HeroCMS;
