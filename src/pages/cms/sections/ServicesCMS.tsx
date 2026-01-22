import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { toast } from 'react-toastify';
import { Plus, Trash2, Loader2, Save } from 'lucide-react';

interface Service {
  id?: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
  display_order: number;
}

const ServicesCMS: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('cms_services')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      
      // Ensure features is initialized as array if null
      const servicesData = (data || []).map(service => ({
        ...service,
        features: service.features || []
      }));
      
      setServices(servicesData);
    } catch (error: any) {
      toast.error('Error fetching services: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddService = () => {
    setServices([...services, { 
      title: '', 
      description: '', 
      icon: 'Zap', 
      features: ['Feature 1', 'Feature 2'], 
      display_order: services.length + 1 
    }]);
  };

  const handleUpdateService = (index: number, field: keyof Service, value: any) => {
    const newServices = [...services];
    newServices[index] = { ...newServices[index], [field]: value };
    setServices(newServices);
  };

  const handleFeatureChange = (serviceIndex: number, featureIndex: number, value: string) => {
    const newServices = [...services];
    const newFeatures = [...newServices[serviceIndex].features];
    newFeatures[featureIndex] = value;
    newServices[serviceIndex] = { ...newServices[serviceIndex], features: newFeatures };
    setServices(newServices);
  };

  const handleAddFeature = (serviceIndex: number) => {
    const newServices = [...services];
    const newFeatures = [...newServices[serviceIndex].features, 'New Feature'];
    newServices[serviceIndex] = { ...newServices[serviceIndex], features: newFeatures };
    setServices(newServices);
  };

  const handleRemoveFeature = (serviceIndex: number, featureIndex: number) => {
    const newServices = [...services];
    const newFeatures = newServices[serviceIndex].features.filter((_, i) => i !== featureIndex);
    newServices[serviceIndex] = { ...newServices[serviceIndex], features: newFeatures };
    setServices(newServices);
  };

  const handleDeleteService = async (index: number) => {
    const serviceToDelete = services[index];
    if (serviceToDelete.id) {
      const confirm = window.confirm('Are you sure you want to delete this service?');
      if (!confirm) return;

      try {
        const { error } = await supabase
          .from('cms_services')
          .delete()
          .eq('id', serviceToDelete.id);
        
        if (error) throw error;
        toast.success('Service deleted');
      } catch (error: any) {
        toast.error('Error deleting service: ' + error.message);
        return;
      }
    }
    const newServices = services.filter((_, i) => i !== index);
    setServices(newServices);
  };

  const handleSaveAll = async () => {
    setLoading(true);
    try {
      for (const service of services) {
        if (service.id) {
          const { error } = await supabase
            .from('cms_services')
            .update(service)
            .eq('id', service.id);
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('cms_services')
            .insert([service]);
          if (error) throw error;
        }
      }
      toast.success('Services updated successfully!');
      fetchServices();
    } catch (error: any) {
      toast.error('Error saving services: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && services.length === 0) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="bg-white shadow sm:rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Services Configuration</h3>
        <button
          onClick={handleAddService}
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-1" /> Add Service
        </button>
      </div>
      
      <div className="space-y-6">
        {services.map((service, index) => (
          <div key={index} className="border p-4 rounded bg-gray-50 relative">
             <button
              onClick={() => handleDeleteService(index)}
              className="absolute top-4 right-4 text-red-600 hover:text-red-800"
            >
              <Trash2 className="h-5 w-5" />
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-medium text-gray-700">Title</label>
                    <input
                        type="text"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                        value={service.title}
                        onChange={(e) => handleUpdateService(index, 'title', e.target.value)}
                    />
                </div>
                 <div>
                    <label className="block text-xs font-medium text-gray-700">Icon (Lucide React Name)</label>
                    <input
                        type="text"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                        value={service.icon}
                        onChange={(e) => handleUpdateService(index, 'icon', e.target.value)}
                        placeholder="e.g. Brain, Cpu, MessageSquare"
                    />
                </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                  rows={2}
                  value={service.description}
                  onChange={(e) => handleUpdateService(index, 'description', e.target.value)}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Features (One per line)</label>
                <textarea
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                  rows={4}
                  placeholder="Predictive Analytics&#10;Pattern Recognition&#10;Automated Decision Making"
                  value={service.features ? service.features.join('\n') : ''}
                  onChange={(e) => {
                    const features = e.target.value.split('\n');
                    handleUpdateService(index, 'features', features);
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Display Order</label>
                    <input
                        type="number"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                        value={service.display_order}
                        onChange={(e) => handleUpdateService(index, 'display_order', parseInt(e.target.value))}
                    />
                </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSaveAll}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          <Save className="-ml-1 mr-2 h-4 w-4" />
          Save All Services
        </button>
      </div>
    </div>
  );
};

export default ServicesCMS;
