import React, { useState } from 'react';
import { QRCodeSettings } from '../types';
import ColorPicker from './ColorPicker';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface QROptionsProps {
  settings: QRCodeSettings;
  onSettingChange: (key: keyof QRCodeSettings, value: any) => void;
}

const QROptions: React.FC<QROptionsProps> = ({ settings, onSettingChange }) => {
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    style: false,
    gradient: false,
    frame: false,
    logo: false
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const Section: React.FC<{ title: string, id: keyof typeof expandedSections, children: React.ReactNode }> = ({ title, id, children }) => (
    <div className="border-b border-gray-200 dark:border-gray-700 last:border-0">
      <button
        onClick={() => toggleSection(id)}
        className="flex items-center justify-between w-full py-4 text-left"
      >
        <span className="text-lg font-medium text-gray-800 dark:text-white">{title}</span>
        {expandedSections[id] ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>
      {expandedSections[id] && (
        <div className="pb-4 space-y-4">
          {children}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
      <Section title="Basic Settings" id="basic">
        <div>
          <label htmlFor="level" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Error Correction Level
          </label>
          <select
            id="level"
            value={settings.level}
            onChange={(e) => onSettingChange('level', e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white transition-colors duration-200"
          >
            <option value="L">Low (7%)</option>
            <option value="M">Medium (15%)</option>
            <option value="Q">Quartile (25%)</option>
            <option value="H">High (30%)</option>
          </select>
        </div>

        <div className="flex items-center">
          <input
            id="includeMargin"
            type="checkbox"
            checked={settings.includeMargin}
            onChange={(e) => onSettingChange('includeMargin', e.target.checked)}
            className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="includeMargin" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            Include Margin (Quiet Zone)
          </label>
        </div>
      </Section>

      <Section title="Style Options" id="style">
        <div>
          <label htmlFor="cornerType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Corner Type
          </label>
          <select
            id="cornerType"
            value={settings.cornerType}
            onChange={(e) => onSettingChange('cornerType', e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white transition-colors duration-200"
          >
            <option value="square">Square</option>
            <option value="rounded">Rounded</option>
            <option value="dots">Dots</option>
            <option value="extraRounded">Extra Rounded</option>
          </select>
        </div>

        <div>
          <label htmlFor="pattern" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Pattern Style
          </label>
          <select
            id="pattern"
            value={settings.pattern.type}
            onChange={(e) => onSettingChange('pattern', { ...settings.pattern, type: e.target.value })}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white transition-colors duration-200"
          >
            <option value="squares">Squares (Default)</option>
            <option value="dots">Dots</option>
            <option value="rounded">Rounded</option>
            <option value="classy">Classy</option>
            <option value="classyRounded">Classy Rounded</option>
          </select>
        </div>
      </Section>

      <Section title="Gradient" id="gradient">
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              id="enableGradient"
              type="checkbox"
              checked={settings.gradient.enabled}
              onChange={(e) => onSettingChange('gradient', { ...settings.gradient, enabled: e.target.checked })}
              className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="enableGradient" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Enable Gradient
            </label>
          </div>

          {settings.gradient.enabled && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Gradient Type
                </label>
                <select
                  value={settings.gradient.type}
                  onChange={(e) => onSettingChange('gradient', { ...settings.gradient, type: e.target.value })}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                >
                  <option value="linear">Linear</option>
                  <option value="radial">Radial</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Start Color
                </label>
                <ColorPicker
                  color={settings.gradient.colors[0]}
                  onChange={(color) => {
                    const newColors = [...settings.gradient.colors];
                    newColors[0] = color;
                    onSettingChange('gradient', { ...settings.gradient, colors: newColors });
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  End Color
                </label>
                <ColorPicker
                  color={settings.gradient.colors[1]}
                  onChange={(color) => {
                    const newColors = [...settings.gradient.colors];
                    newColors[1] = color;
                    onSettingChange('gradient', { ...settings.gradient, colors: newColors });
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Rotation: {settings.gradient.rotation}°
                </label>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={settings.gradient.rotation}
                  onChange={(e) => onSettingChange('gradient', { ...settings.gradient, rotation: parseInt(e.target.value) })}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>
            </>
          )}
        </div>
      </Section>

      <Section title="Frame" id="frame">
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              id="enableFrame"
              type="checkbox"
              checked={settings.frame.enabled}
              onChange={(e) => onSettingChange('frame', { ...settings.frame, enabled: e.target.checked })}
              className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="enableFrame" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Add Frame
            </label>
          </div>

          {settings.frame.enabled && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Frame Style
                </label>
                <select
                  value={settings.frame.style}
                  onChange={(e) => onSettingChange('frame', { ...settings.frame, style: e.target.value })}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                >
                  <option value="simple">Simple</option>
                  <option value="rounded">Rounded</option>
                  <option value="fancy">Fancy</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Frame Text
                </label>
                <input
                  type="text"
                  value={settings.frame.text}
                  onChange={(e) => onSettingChange('frame', { ...settings.frame, text: e.target.value })}
                  placeholder="Scan me!"
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Text Color
                </label>
                <ColorPicker
                  color={settings.frame.textColor}
                  onChange={(color) => onSettingChange('frame', { ...settings.frame, textColor: color })}
                />
              </div>
            </>
          )}
        </div>
      </Section>

      <Section title="Logo" id="logo">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Upload Logo
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    onSettingChange('imageSettings', {
                      ...settings.imageSettings,
                      src: event.target?.result,
                      height: 50,
                      width: 50,
                      excavate: true,
                      borderRadius: 0,
                      margin: 5
                    });
                  };
                  reader.readAsDataURL(file);
                }
              }}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          {settings.imageSettings?.src && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Logo Size: {settings.imageSettings.width}px
                </label>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={settings.imageSettings.width}
                  onChange={(e) => {
                    const size = parseInt(e.target.value);
                    onSettingChange('imageSettings', {
                      ...settings.imageSettings,
                      width: size,
                      height: size
                    });
                  }}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Border Radius: {settings.imageSettings.borderRadius}px
                </label>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={settings.imageSettings.borderRadius}
                  onChange={(e) => onSettingChange('imageSettings', {
                    ...settings.imageSettings,
                    borderRadius: parseInt(e.target.value)
                  })}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Margin: {settings.imageSettings.margin}px
                </label>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={settings.imageSettings.margin}
                  onChange={(e) => onSettingChange('imageSettings', {
                    ...settings.imageSettings,
                    margin: parseInt(e.target.value)
                  })}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>
            </>
          )}
        </div>
      </Section>
    </div>
  );
};

export default QROptions;