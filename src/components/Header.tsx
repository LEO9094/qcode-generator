import React, { useContext } from 'react';
import { QrCode, Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import { ThemeContext } from '../context/ThemeContext';

const Header: React.FC = () => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);

  return (
    <header className="flex justify-between items-center">
      <div className="flex items-center">
        <motion.div
          initial={{ rotate: -10, scale: 0.9 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-blue-500 text-white p-3 rounded-2xl mr-4"
        >
          <QrCode size={28} />
        </motion.div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white transition-colors duration-300">QR Code Generator</h1>
          <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">Create custom QR codes in seconds</p>
        </div>
      </div>
      
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleTheme}
        className="p-3 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 transition-colors duration-300"
        aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
      >
        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
      </motion.button>
    </header>
  );
};

export default Header;