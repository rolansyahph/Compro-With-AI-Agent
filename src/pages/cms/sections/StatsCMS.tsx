import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { toast } from 'react-toastify';
import { Plus, Trash2, Loader2, Save } from 'lucide-react';

interface Stat {
  id?: string;
  number: string;
  label: string;
  display_order: number;
}

const StatsCMS: React.FC = () => {
  const [stats, setStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase
        .from('cms_stats')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setStats(data || []);
    } catch (error: any) {
      toast.error('Error fetching stats: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStat = () => {
    setStats([...stats, { number: '', label: '', display_order: stats.length + 1 }]);
  };

  const handleUpdateStat = (index: number, field: keyof Stat, value: string | number) => {
    const newStats = [...stats];
    newStats[index] = { ...newStats[index], [field]: value };
    setStats(newStats);
  };

  const handleDeleteStat = async (index: number) => {
    const statToDelete = stats[index];
    if (statToDelete.id) {
      const confirm = window.confirm('Are you sure you want to delete this stat?');
      if (!confirm) return;

      try {
        const { error } = await supabase
          .from('cms_stats')
          .delete()
          .eq('id', statToDelete.id);
        
        if (error) throw error;
        toast.success('Stat deleted');
      } catch (error: any) {
        toast.error('Error deleting stat: ' + error.message);
        return;
      }
    }
    const newStats = stats.filter((_, i) => i !== index);
    setStats(newStats);
  };

  const handleSaveAll = async () => {
    setLoading(true);
    try {
      for (const stat of stats) {
        if (stat.id) {
          const { error } = await supabase
            .from('cms_stats')
            .update(stat)
            .eq('id', stat.id);
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('cms_stats')
            .insert([stat]);
          if (error) throw error;
        }
      }
      toast.success('Stats updated successfully!');
      fetchStats();
    } catch (error: any) {
      toast.error('Error saving stats: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && stats.length === 0) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="bg-white shadow sm:rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Stats Configuration</h3>
        <button
          onClick={handleAddStat}
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-1" /> Add Stat
        </button>
      </div>
      
      <div className="space-y-4">
        {stats.map((stat, index) => (
          <div key={index} className="flex gap-4 items-end border p-4 rounded bg-gray-50">
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-700">Number</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                value={stat.number}
                onChange={(e) => handleUpdateStat(index, 'number', e.target.value)}
                placeholder="e.g. 500+"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-700">Label</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                value={stat.label}
                onChange={(e) => handleUpdateStat(index, 'label', e.target.value)}
                placeholder="e.g. Projects Completed"
              />
            </div>
            <div className="w-20">
              <label className="block text-xs font-medium text-gray-700">Order</label>
              <input
                type="number"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                value={stat.display_order}
                onChange={(e) => handleUpdateStat(index, 'display_order', parseInt(e.target.value))}
              />
            </div>
            <button
              onClick={() => handleDeleteStat(index)}
              className="p-2 text-red-600 hover:bg-red-50 rounded"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSaveAll}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          <Save className="-ml-1 mr-2 h-4 w-4" />
          Save All Stats
        </button>
      </div>
    </div>
  );
};

export default StatsCMS;
