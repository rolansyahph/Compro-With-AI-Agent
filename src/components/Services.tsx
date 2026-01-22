import React, { useEffect, useState } from 'react';
import { Brain, Eye, MessageSquare, BarChart3, Zap, Shield, FileText, Settings, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';

const iconMap: Record<string, React.ElementType> = {
  Brain,
  Eye,
  MessageSquare,
  BarChart3,
  Zap,
  Shield,
  FileText,
  Settings,
  Globe
};

interface ServiceItem {
  title: string;
  description: string;
  icon: string;
  features?: string[];
}

const Services = () => {
  const [services, setServices] = useState<ServiceItem[]>([]);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('cms_services')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error fetching services:', error);
        return;
      }

      if (data && data.length > 0) {
        setServices(data.map((item: any) => ({
          ...item,
          features: item.features || []
        })));
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const getIcon = (iconName: string) => {
    return iconMap[iconName] || Zap;
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our AI Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive AI solutions designed to transform your business operations and drive growth
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const IconComponent = getIcon(service.icon);
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-6">
                  <IconComponent className="h-6 w-6 text-blue-600" />
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {service.title}
                </h3>
                
                <p className="text-gray-600 mb-6">
                  {service.description}
                </p>
                
                {service.features && service.features.length > 0 && (
                  <ul className="space-y-2">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-3"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;