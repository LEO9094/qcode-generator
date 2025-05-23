import React from 'react';
import { motion } from 'framer-motion';
import { Trash2, Clock, Download } from 'lucide-react';
import { saveAs } from 'file-saver';
import { toPng } from 'html-to-image';
import { QRCodeCanvas } from 'qrcode.react';

interface HistoryEntry {
  id: number;
  content: string;
  contentType: string;
  settings: any;
  createdAt: string;
}

const History: React.FC = () => {
  const [history, setHistory] = React.useState<HistoryEntry[]>(() => {
    const saved = localStorage.getItem('qrHistory');
    return saved ? JSON.parse(saved) : [];
  });

  const downloadQR = async (entry: HistoryEntry) => {
    const element = document.createElement('div');
    element.style.padding = '20px';
    element.style.background = 'white';
    
    const qrCode = document.createElement('div');
    const qrCanvas = document.createElement('canvas');
    qrCanvas.width = entry.settings.size;
    qrCanvas.height = entry.settings.size;
    
    const qr = new QRCodeCanvas({
      value: entry.content,
      size: entry.settings.size,
      bgColor: entry.settings.bgColor,
      fgColor: entry.settings.fgColor,
      level: entry.settings.level,
      includeMargin: entry.settings.includeMargin,
    });
    
    qrCode.appendChild(qrCanvas);
    element.appendChild(qrCode);
    
    try {
      const dataUrl = await toPng(element);
      saveAs(dataUrl, `qr-code-${new Date().toISOString().slice(0, 10)}.png`);
    } catch (error) {
      console.error('Error downloading QR code:', error);
    }
  };

  const clearHistory = () => {
    localStorage.removeItem('qrHistory');
    setHistory([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">History</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={clearHistory}
          className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Clear History
        </motion.button>
      </div>
      
      {history.length === 0 ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No history yet</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {history.map((entry) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    {new Date(entry.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {entry.contentType}
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => downloadQR(entry)}
                  className="p-2 text-blue-500 hover:text-blue-600"
                >
                  <Download className="w-4 h-4" />
                </motion.button>
              </div>
              
              <div className="flex justify-center mb-4">
                <QRCodeCanvas
                  value={entry.content}
                  size={100}
                  bgColor={entry.settings.bgColor}
                  fgColor={entry.settings.fgColor}
                  level={entry.settings.level}
                  includeMargin={entry.settings.includeMargin}
                />
              </div>
              
              <p className="text-sm text-gray-700 dark:text-gray-300 truncate">
                {entry.content}
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;