import React from 'react';
import { Brain, Eye, MessageSquare, BarChart3, Zap, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const Services = () => {
  const services = [
    {
      icon: Brain,
      title: 'Machine Learning',
      description: 'Advanced algorithms that learn from data to make predictions and automate decision-making processes.',
      features: ['Predictive Analytics', 'Pattern Recognition', 'Automated Decision Making']
    },
    {
      icon: MessageSquare,
      title: 'Natural Language Processing',
      description: 'Enable machines to understand, interpret, and generate human language for better communication.',
      features: ['Text Analysis', 'Sentiment Analysis', 'Chatbots & Virtual Assistants']
    },
    {
      icon: Eye,
      title: 'Computer Vision',
      description: 'Extract meaningful information from visual data to automate image and video analysis.',
      features: ['Image Recognition', 'Object Detection', 'Quality Control']
    },
    {
      icon: BarChart3,
      title: 'Data Analytics',
      description: 'Transform raw data into actionable insights with advanced statistical analysis and visualization.',
      features: ['Business Intelligence', 'Real-time Analytics', 'Custom Dashboards']
    },
    {
      icon: Zap,
      title: 'Process Automation',
      description: 'Streamline workflows and eliminate repetitive tasks with intelligent automation solutions.',
      features: ['Workflow Optimization', 'Task Automation', 'Integration Services']
    },
    {
      icon: Shield,
      title: 'AI Security',
      description: 'Protect your AI systems and data with robust security measures and compliance frameworks.',
      features: ['Data Protection', 'Model Security', 'Compliance Monitoring']
    }
  ];

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
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-6">
                <service.icon className="h-6 w-6 text-blue-600" />
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {service.title}
              </h3>
              
              <p className="text-gray-600 mb-6">
                {service.description}
              </p>
              
              <ul className="space-y-2">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-center text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-3"></div>
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;