import React, { useState, useRef, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { motion } from 'framer-motion';
import { Download, Share2, Heart, Settings2, Trash2, Copy } from 'lucide-react';
import { saveAs } from 'file-saver';
import { toPng, toJpeg } from 'html-to-image';
import ColorPicker from './ColorPicker';
import QROptions from './QROptions';
import { QRCodeSettings, ContentType } from '../types';

const QRCodeGenerator: React.FC = () => {
  const [content, setContent] = useState('https://example.com');
  const [contentType, setContentType] = useState<ContentType>('url');
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
  
  const [showOptions, setShowOptions] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const qrCodeRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const saveToHistory = () => {
      if (!content) return;
      
      const history = JSON.parse(localStorage.getItem('qrHistory') || '[]');
      const newEntry = {
        id: Date.now(),
        content,
        contentType,
        settings,
        createdAt: new Date().toISOString(),
      };
      
      const updatedHistory = [
        newEntry,
        ...history.filter((entry: any) => entry.content !== content).slice(0, 19),
      ];
      
      localStorage.setItem('qrHistory', JSON.stringify(updatedHistory));
    };
    
    const timeoutId = setTimeout(saveToHistory, 1000);
    return () => clearTimeout(timeoutId);
  }, [content, contentType, settings]);
  
  const handleSettingChange = (key: keyof QRCodeSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };
  
  const downloadQRCode = async (format: 'png' | 'jpeg') => {
    if (!qrCodeRef.current) return;
    
    try {
      let dataUrl;
      switch (format) {
        case 'png':
          dataUrl = await toPng(qrCodeRef.current, { quality: 1.0 });
          break;
        case 'jpeg':
          dataUrl = await toJpeg(qrCodeRef.current, { quality: 0.95 });
          break;
      }
      
      const filename = `qrcode-${new Date().toISOString().split('T')[0]}.${format}`;
      saveAs(dataUrl, filename);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const copyToClipboard = async () => {
    if (!qrCodeRef.current) return;
    
    try {
      const dataUrl = await toPng(qrCodeRef.current);
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
    } catch (error) {
      console.error('Error copying QR code:', error);
    }
  };
  
  const getPlaceholderForType = () => {
    switch (contentType) {
      case 'url': return 'https://example.com';
      case 'text': return 'Enter your text here';
      case 'email': return 'email@example.com';
      case 'phone': return '+1234567890';
      case 'sms': return '+1234567890: Your message here';
      case 'wifi': return 'SSID:Password:WPA';
      case 'vcard': return 'BEGIN:VCARD\nVERSION:3.0\nFN:John Doe\nTEL:+1234567890\nEMAIL:john@example.com\nEND:VCARD';
      case 'calendar': return 'BEGIN:VEVENT\nSUMMARY:Event Title\nDTSTART:20240401T090000Z\nDTEND:20240401T100000Z\nEND:VEVENT';
      case 'location': return '40.7128,-74.0060';
      case 'crypto': return 'bitcoin:1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa?amount=0.001';
      default: return 'Enter content here';
    }
  };
  
  const formatContentForType = (value: string): string => {
    switch (contentType) {
      case 'email':
        return value.includes('mailto:') ? value : `mailto:${value}`;
      case 'phone':
        return value.includes('tel:') ? value : `tel:${value}`;
      case 'sms':
        if (value.includes('sms:')) return value;
        const [number, message] = value.split(':');
        return `sms:${number}${message ? `?body=${encodeURIComponent(message)}` : ''}`;
      case 'wifi':
        if (value.includes('WIFI:')) return value;
        const [ssid, password, security = 'WPA'] = value.split(':');
        return `WIFI:S:${ssid};T:${security};P:${password};;`;
      case 'location':
        if (value.includes('geo:')) return value;
        const [lat, lon] = value.split(',');
        return `geo:${lat},${lon}`;
      default:
        return value;
    }
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div>
          <label htmlFor="contentType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Content Type
          </label>
          <select
            id="contentType"
            value={contentType}
            onChange={(e) => setContentType(e.target.value as ContentType)}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="url">URL</option>
            <option value="text">Text</option>
            <option value="email">Email</option>
            <option value="phone">Phone Number</option>
            <option value="sms">SMS</option>
            <option value="wifi">WiFi Network</option>
            <option value="vcard">Contact Card (vCard)</option>
            <option value="calendar">Calendar Event</option>
            <option value="location">Location</option>
            <option value="crypto">Cryptocurrency</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={getPlaceholderForType()}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-24 resize-y"
          />
        </div>
        
        <div className="flex items-center space-x-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Foreground Color
            </label>
            <ColorPicker 
              color={settings.fgColor} 
              onChange={(color) => handleSettingChange('fgColor', color)} 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Background Color
            </label>
            <ColorPicker 
              color={settings.bgColor} 
              onChange={(color) => handleSettingChange('bgColor', color)} 
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="size" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Size: {settings.size}px
          </label>
          <input
            id="size"
            type="range"
            min="100"
            max="400"
            step="10"
            value={settings.size}
            onChange={(e) => handleSettingChange('size', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowOptions(!showOptions)}
          className="flex items-center justify-center w-full p-3 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg transition-colors duration-200 hover:bg-gray-200 dark:hover:bg-gray-600"
        >
          <Settings2 className="w-5 h-5 mr-2" />
          {showOptions ? 'Hide Advanced Options' : 'Show Advanced Options'}
        </motion.button>
        
        {showOptions && (
          <QROptions settings={settings} onSettingChange={handleSettingChange} />
        )}
      </div>
      
      <div className="flex flex-col items-center">
        <div 
          ref={qrCodeRef}
          className="bg-white dark:bg-gray-200 p-6 rounded-xl shadow-lg mb-6 transition-all duration-300 hover:shadow-xl"
          style={{ 
            width: Math.max(settings.size + 48, 200),
            height: Math.max(settings.size + 48, 200),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <QRCodeCanvas
            value={formatContentForType(content)}
            size={settings.size}
            bgColor={settings.bgColor}
            fgColor={settings.fgColor}
            level={settings.level as 'L' | 'M' | 'Q' | 'H'}
            includeMargin={settings.includeMargin}
            imageSettings={settings.imageSettings}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4 w-full mb-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => downloadQRCode('png')}
            className="flex items-center justify-center p-3 bg-blue-500 text-white rounded-lg transition-colors duration-200 hover:bg-blue-600"
          >
            <Download className="w-5 h-5 mr-2" />
            PNG
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => downloadQRCode('jpeg')}
            className="flex items-center justify-center p-3 bg-purple-500 text-white rounded-lg transition-colors duration-200 hover:bg-purple-600"
          >
            <Download className="w-5 h-5 mr-2" />
            JPEG
          </motion.button>
        </div>
        
        <div className="flex space-x-4 w-full">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={copyToClipboard}
            className="flex-1 flex items-center justify-center p-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg transition-colors duration-200 hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            <Copy className="w-5 h-5 mr-2" />
            Copy
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsFavorite(!isFavorite)}
            className={`flex-1 flex items-center justify-center p-3 rounded-lg transition-colors duration-200 ${
              isFavorite 
                ? 'bg-red-500 text-white hover:bg-red-600' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            <Heart className={`w-5 h-5 mr-2 ${isFavorite ? 'fill-current' : ''}`} />
            {isFavorite ?  'Favorited' : 'Favorite'}
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setContent('');
              setSettings({
                ...settings,
                fgColor: '#000000',
                bgColor: '#FFFFFF',
                size: 200,
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
            }}
            className="flex-1 flex items-center justify-center p-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg transition-colors duration-200 hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            <Trash2 className="w-5 h-5 mr-2" />
            Reset
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default QRCodeGenerator;