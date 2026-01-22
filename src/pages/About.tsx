import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LiveChat from '../components/LiveChat';
import { supabase } from '../lib/supabase';

interface AboutData {
  title: string;
  content: string;
  image_url: string;
}

export default function About() {
  const [data, setData] = useState<AboutData>({
    title: '',
    content: '',
    image_url: ''
  });

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      const { data: aboutData, error } = await supabase
        .from('cms_about')
        .select('*')
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching about data:', error);
        return;
      }
      
      if (aboutData) {
        setData(aboutData);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{data.title}</h1>
            <div className="prose prose-lg mx-auto text-gray-600 whitespace-pre-wrap">
               {data.content}
            </div>
          </div>
          {data.image_url && (
            <div className="mt-8 flex justify-center">
              <img 
                src={data.image_url} 
                alt="About Us" 
                className="rounded-xl shadow-lg max-w-full h-auto object-cover"
              />
            </div>
          )}
        </div>
      </main>
      <Footer />
      <LiveChat />
    </div>
  );
}