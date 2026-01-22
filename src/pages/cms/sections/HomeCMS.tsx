import React from 'react';
import HeroCMS from './HeroCMS';
import StatsCMS from './StatsCMS';
import ServicesCMS from './ServicesCMS';

const HomeCMS: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-6">
        <h2 className="text-xl font-semibold text-blue-900">Home Page Content</h2>
        <p className="text-blue-700">
          This section allows you to edit all the content that appears on the Home page.
        </p>
      </div>

      <section id="hero-section">
        <h3 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">Hero Section (Top Banner)</h3>
        <HeroCMS />
      </section>

      <section id="stats-section">
        <h3 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">Statistics Section</h3>
        <StatsCMS />
      </section>

      <section id="services-section">
        <h3 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">Services Section</h3>
        <ServicesCMS />
      </section>
    </div>
  );
};

export default HomeCMS;
