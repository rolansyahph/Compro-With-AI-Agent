import React, { useEffect, useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';

interface HeroData {
  headline: string;
  subheadline: string;
  cta_text: string;
  cta_link: string;
  image_url: string;
}

const Hero = () => {
  const [data, setData] = useState<HeroData>({
    headline: '',
    subheadline: '',
    cta_text: '',
    cta_link: '',
    image_url: ''
  });

  useEffect(() => {
    fetchHeroData();
  }, []);

  const fetchHeroData = async () => {
    try {
      const { data: heroData, error } = await supabase
        .from('cms_hero')
        .select('*')
        .single();

      if (error) {
        console.error('Error fetching hero data:', error);
        return;
      }

      if (heroData) {
        setData({
          headline: heroData.headline || data.headline,
          subheadline: heroData.subheadline || data.subheadline,
          cta_text: heroData.cta_text || data.cta_text,
          cta_link: heroData.cta_link || data.cta_link,
          image_url: heroData.image_url || data.image_url
        });
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20 overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <div className="flex items-center justify-center lg:justify-start space-x-2 mb-6">
              <Sparkles className="h-6 w-6 text-blue-600" />
              <span className="text-blue-600 font-medium">AI-Powered Solutions</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              {data.headline}
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              {data.subheadline}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                onClick={() => window.location.href = data.cta_link}
              >
                <span>{data.cta_text}</span>
                <ArrowRight className="h-5 w-5" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-semibold hover:border-blue-600 hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
              >
                Learn More
              </motion.button>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative">
              <img
                src={data.image_url}
                alt="AI Technology Visualization"
                className="rounded-2xl shadow-2xl w-full h-auto"
                width="600"
                height="400"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-purple-600/20 rounded-2xl"></div>
            </div>
            
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -top-4 -right-4 bg-white p-4 rounded-xl shadow-lg"
            >
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">AI Active</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;