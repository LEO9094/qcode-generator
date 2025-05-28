import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { QrCode, Settings2, History, Download, Share2, Moon, Sun } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import QRCodeGenerator from './components/QRCodeGenerator';
import Settings from './components/Settings';
import HistoryComponent from './components/History';
import DownloadComponent from './components/Download';
import Share from './components/Share';
import Header from './components/Header';
import { ThemeProvider } from './context/ThemeContext';
import { QRCodeSettings } from './types';

function App() {
  const [activeTab, setActiveTab] = useState('generate');
  const [content, setContent] = useState('');
  const [settings, setSettings] = useState<QRCodeSettings>({
    size: 200,
    fgColor: '#000000',
    bgColor: '#FFFFFF',
    level: 'M',
    includeMargin: true,
    cornerType: 'square',
    style: 'squares',
    gradient: {
      enabled: false,
      type: 'linear',
      colors: ['#000000', '#000000'],
      rotation: 0
    },
    pattern: {
      enabled: false,
      type: 'dots',
      color: '#000000'
    },
    frame: {
      enabled: false,
      style: 'simple',
      text: 'Scan me!',
      textColor: '#000000'
    }
  });

  const qrCodeRef = useRef<HTMLDivElement>(null);

  const handleSettingChange = (key: keyof QRCodeSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const resetSettings = () => {
    setSettings({
      size: 200,
      fgColor: '#000000',
      bgColor: '#FFFFFF',
      level: 'M',
      includeMargin: true,
      cornerType: 'square',
      style: 'squares',
      gradient: {
        enabled: false,
        type: 'linear',
        colors: ['#000000', '#000000'],
        rotation: 0
      },
      pattern: {
        enabled: false,
        type: 'dots',
        color: '#000000'
      },
      frame: {
        enabled: false,
        style: 'simple',
        text: 'Scan me!',
        textColor: '#000000'
      }
    });
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
        <Toaster position="top-right" />
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <Header />
          
          <main className="mt-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transition-colors duration-300">
              <div className="flex flex-col md:flex-row">
                <nav className="flex md:flex-col p-2 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                  <TabButton 
                    isActive={activeTab === 'generate'} 
                    onClick={() => setActiveTab('generate')}
                    icon={<QrCode className="w-5 h-5" />}
                    label="Generate"
                  />
                  <TabButton 
                    isActive={activeTab === 'settings'} 
                    onClick={() => setActiveTab('settings')}
                    icon={<Settings2 className="w-5 h-5" />}
                    label="Settings"
                  />
                  <TabButton 
                    isActive={activeTab === 'history'} 
                    onClick={() => setActiveTab('history')}
                    icon={<History className="w-5 h-5" />}
                    label="History"
                  />
                  <TabButton 
                    isActive={activeTab === 'download'} 
                    onClick={() => setActiveTab('download')}
                    icon={<Download className="w-5 h-5" />}
                    label="Download"
                  />
                  <TabButton 
                    isActive={activeTab === 'share'} 
                    onClick={() => setActiveTab('share')}
                    icon={<Share2 className="w-5 h-5" />}
                    label="Share"
                  />
                </nav>
                
                <div className="flex-1 p-6">
                  {activeTab === 'generate' && (
                    <QRCodeGenerator
                      ref={qrCodeRef}
                      content={content}
                      setContent={setContent}
                      settings={settings}
                      onSettingChange={handleSettingChange}
                    />
                  )}
                  {activeTab === 'settings' && (
                    <Settings
                      settings={settings}
                      onSettingChange={handleSettingChange}
                      onReset={resetSettings}
                    />
                  )}
                  {activeTab === 'history' && <HistoryComponent />}
                  {activeTab === 'download' && <DownloadComponent qrCodeRef={qrCodeRef} />}
                  {activeTab === 'share' && (
                    <Share
                      qrCodeUrl={qrCodeRef.current?.querySelector('canvas')?.toDataURL() || ''}
                      content={content}
                    />
                  )}
                </div>
              </div>
            </div>
          </main>
          
          <footer className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
            <p>© {new Date().getFullYear()} © 2024 LEO OFFICIAL. All rights reserved. </p>
          </footer>
        </div>
      </div>
    </ThemeProvider>
  );
}

interface TabButtonProps {
  isActive: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const TabButton: React.FC<TabButtonProps> = ({ isActive, onClick, icon, label }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`flex items-center justify-center md:justify-start p-3 md:px-6 md:py-4 rounded-lg md:w-48 md:mt-2 md:mb-2 transition-colors duration-200 ${
        isActive 
          ? 'bg-blue-500 text-white' 
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
      }`}
    >
      {icon}
      <span className="hidden md:inline ml-3">{label}</span>
    </motion.button>
  );
};

export default App;
