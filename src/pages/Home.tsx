import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Services from '../components/Services';
import Stats from '../components/Stats';
import Footer from '../components/Footer';
import LiveChat from '../components/LiveChat';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <Services />
        <Stats />
      </main>
      <Footer />
      <LiveChat />
    </div>
  );
}