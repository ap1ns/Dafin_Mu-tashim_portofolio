import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useEasterEgg } from '../context/EasterEggContext';

const EasterEgg: React.FC = () => {
  const { isVisible, closeEasterEgg } = useEasterEgg();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] bg-black flex items-center justify-center p-4"
        >
          {/* Close Button */}
          <motion.button
            onClick={closeEasterEgg}
            className="absolute top-6 right-6 z-[10000] p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            title="Close easter egg"
          >
            <X size={24} className="text-white" />
          </motion.button>

          {/* Full-screen GIF */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="w-full h-full flex items-center justify-center"
          >
            <img src="" alt="Easter egg" className="w-full h-full object-contain" />
          </motion.div>

          {/* Bottom hint text */}
          <motion.div
            className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white text-sm font-semibold text-center"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          ></motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EasterEgg;
