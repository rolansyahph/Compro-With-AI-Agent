import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LiveChat from '../components/LiveChat';

export default function About() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">About AI Solutions</h1>
            <p className="text-xl text-gray-600">Coming soon</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-8 text-center">
            <p className="text-gray-700">Use Meku to generate content for this page</p>
          </div>
        </div>
      </main>
      <Footer />
      <LiveChat />
    </div>
  );
}