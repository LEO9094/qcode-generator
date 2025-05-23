import React from 'react';
import { motion } from 'framer-motion';
import { Download, Image } from 'lucide-react';
import { saveAs } from 'file-saver';
import { toPng, toJpeg } from 'html-to-image';

interface DownloadProps {
  qrCodeRef: React.RefObject<HTMLDivElement>;
}

const Download: React.FC<DownloadProps> = ({ qrCodeRef }) => {
  const downloadQRCode = async (format: 'png' | 'jpeg') => {
    if (!qrCodeRef.current) return;
    
    try {
      let dataUrl;
      const quality = format === 'jpeg' ? 0.95 : 1.0;
      
      switch (format) {
        case 'png':
          dataUrl = await toPng(qrCodeRef.current, { quality });
          break;
        case 'jpeg':
          dataUrl = await toJpeg(qrCodeRef.current, { quality });
          break;
      }
      
      const filename = `qr-code-${new Date().toISOString().slice(0, 10)}.${format}`;
      saveAs(dataUrl, filename);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const downloadOptions = [
    { format: 'png', label: 'PNG', color: 'bg-blue-500 hover:bg-blue-600' },
    { format: 'jpeg', label: 'JPEG', color: 'bg-purple-500 hover:bg-purple-600' },
  ] as const;

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Download QR Code</h2>
        <p className="text-gray-600 dark:text-gray-300">Choose your preferred format</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 max-w-2xl mx-auto">
        {downloadOptions.map(({ format, label, color }) => (
          <motion.button
            key={format}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => downloadQRCode(format)}
            className={`flex items-center justify-center p-6 ${color} text-white rounded-lg transition-colors`}
          >
            <div className="text-center">
              <Image className="w-12 h-12 mx-auto mb-4" />
              <span className="text-lg font-medium">{label}</span>
              <p className="text-sm opacity-90 mt-2">Download as {label}</p>
            </div>
          </motion.button>
        ))}
      </div>

      <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg max-w-2xl mx-auto">
        <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Tips for Best Quality</h3>
        <ul className="space-y-2 text-gray-600 dark:text-gray-300">
          <li>• PNG format offers better quality for most uses</li>
          <li>• JPEG is smaller in file size but may have slight quality loss</li>
          <li>• For printing, use PNG format at the largest size available</li>
          <li>• Test the QR code after downloading to ensure it scans correctly</li>
        </ul>
      </div>
    </div>
  );
};

export default Download;