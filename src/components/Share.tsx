import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Share2 } from 'lucide-react';
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  EmailShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  WhatsappIcon,
  EmailIcon,
} from 'react-share';
import toast from 'react-hot-toast';

interface ShareProps {
  qrCodeUrl: string;
  content: string;
}

const Share: React.FC<ShareProps> = ({ qrCodeUrl, content }) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = window.location.href;
  const title = 'Check out my QR Code!';

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy to clipboard');
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Share QR Code</h2>
        <p className="text-gray-600 dark:text-gray-300">Share your QR code with others</p>
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        <FacebookShareButton url={shareUrl} quote={title}>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <FacebookIcon size={48} round />
          </motion.div>
        </FacebookShareButton>

        <TwitterShareButton url={shareUrl} title={title}>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <TwitterIcon size={48} round />
          </motion.div>
        </TwitterShareButton>

        <LinkedinShareButton url={shareUrl} title={title}>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <LinkedinIcon size={48} round />
          </motion.div>
        </LinkedinShareButton>

        <WhatsappShareButton url={shareUrl} title={title}>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <WhatsappIcon size={48} round />
          </motion.div>
        </WhatsappShareButton>

        <EmailShareButton url={shareUrl} subject={title}>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <EmailIcon size={48} round />
          </motion.div>
        </EmailShareButton>
      </div>

      <div className="max-w-md mx-auto">
        <div className="flex items-center gap-2 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <input
            type="text"
            value={content}
            readOnly
            className="flex-1 bg-transparent border-none focus:outline-none text-gray-800 dark:text-white"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={copyToClipboard}
            className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
          >
            {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
          </motion.button>
        </div>
      </div>

      {navigator.share && (
        <div className="text-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              navigator.share({
                title: 'QR Code',
                text: title,
                url: shareUrl,
              });
            }}
            className="inline-flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Share2 className="w-5 h-5 mr-2" />
            Share via...
          </motion.button>
        </div>
      )}
    </div>
  );
};

export default Share;