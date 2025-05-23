import React from 'react';
import { motion } from 'framer-motion';
import { Save, RotateCcw } from 'lucide-react';
import { QRCodeSettings } from '../types';
import QROptions from './QROptions';

interface SettingsProps {
  settings: QRCodeSettings;
  onSettingChange: (key: keyof QRCodeSettings, value: any) => void;
  onReset: () => void;
}

const Settings: React.FC<SettingsProps> = ({ settings, onSettingChange, onReset }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">QR Code Settings</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onReset}
          className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset All
        </motion.button>
      </div>
      
      <QROptions settings={settings} onSettingChange={onSettingChange} />
      
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          localStorage.setItem('defaultQRSettings', JSON.stringify(settings));
        }}
        className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        <Save className="w-4 h-4 mr-2" />
        Save as Default
      </motion.button>
    </div>
  );
};

export default Settings;