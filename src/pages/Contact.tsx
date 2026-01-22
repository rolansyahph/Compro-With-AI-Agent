import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LiveChat from '../components/LiveChat';
import { Mail, Phone, MapPin } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ContactData {
  contact_email: string;
  contact_phone: string;
  address: string;
}

export default function Contact() {
  const [data, setData] = useState<ContactData>({
    contact_email: 'contact@aisolutions.com',
    contact_phone: '+1 (555) 123-4567',
    address: '123 AI Boulevard, Tech City, TC 90210'
  });

  useEffect(() => {
    fetchContactData();
  }, []);

  const fetchContactData = async () => {
    try {
      const { data: settingsData, error } = await supabase
        .from('cms_settings')
        .select('contact_email, contact_phone, address')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching contact data:', error);
        return;
      }

      if (settingsData) {
        setData({
          contact_email: settingsData.contact_email || data.contact_email,
          contact_phone: settingsData.contact_phone || data.contact_phone,
          address: settingsData.address || data.address
        });
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
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
            <p className="text-xl text-gray-600">
              Get in touch with our team to discuss your AI needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Email</h3>
              <p className="text-gray-600">{data.contact_email}</p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Phone</h3>
              <p className="text-gray-600">{data.contact_phone}</p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Office</h3>
              <p className="text-gray-600">{data.address}</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <LiveChat />
    </div>
  );
}