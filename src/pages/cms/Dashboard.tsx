import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { LayoutDashboard, Info, Settings, LogOut, Eye, Home, Menu, X } from 'lucide-react';
import HomeCMS from './sections/HomeCMS';
import AboutCMS from './sections/AboutCMS';
import SettingsCMS from './sections/SettingsCMS';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
        toast.error('Error logging out');
    } else {
        toast.info('Logged out');
        navigate('/login');
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeCMS />;
      case 'about':
        return <AboutCMS />;
      case 'settings':
        return <SettingsCMS />;
      case 'preview':
        return (
           <div className="bg-white shadow sm:rounded-lg overflow-hidden h-[calc(100vh-200px)] border">
            <div className="bg-gray-50 border-b p-2 flex justify-between items-center text-sm text-gray-500">
               <span>Live Website Preview</span>
               <a href="/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 flex items-center gap-1">
                 Open in new tab <Eye size={14} />
               </a>
            </div>
            <iframe 
               src={`/?preview=true&t=${Date.now()}`}
               title="Live Preview"
               className="w-full h-full border-0"
             />
          </div>
        );
      default:
        return <HomeCMS />;
    }
  };

  const tabs = [
    { id: 'home', label: 'Home Page', icon: Home },
    { id: 'about', label: 'About', icon: Info },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'preview', label: 'Live Preview', icon: Eye },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex relative">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`
        fixed md:static inset-y-0 left-0 z-50 w-64 bg-white shadow-md transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
      `}>
        <div className="p-6 border-b flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900 flex items-center">
            <LayoutDashboard className="mr-2 h-6 w-6 text-blue-600" />
            Compro CMS
          </h1>
          <button 
            className="md:hidden text-gray-500 hover:text-gray-700"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={24} />
          </button>
        </div>
        <nav className="mt-6 px-4 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <tab.icon className={`mr-3 h-5 w-5 ${activeTab === tab.id ? 'text-blue-500' : 'text-gray-400'}`} />
              {tab.label}
            </button>
          ))}
        </nav>
        <div className="absolute bottom-0 w-64 p-4 border-t bg-gray-50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white shadow-sm flex items-center justify-between p-4 md:py-4 md:px-6 lg:px-8">
          <div className="flex items-center">
            <button
              className="md:hidden mr-4 text-gray-500 hover:text-gray-700"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 truncate">
              {tabs.find(t => t.id === activeTab)?.label}
            </h1>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
