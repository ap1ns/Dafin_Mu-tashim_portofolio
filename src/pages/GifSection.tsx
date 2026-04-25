import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const GifSection: React.FC = () => {
  const { isDark } = useTheme();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const sectionOpacity = useTransform(scrollYProgress, [0, 0.12, 0.8, 1], [0, 1, 1, 0.95]);
  const gifY = useTransform(scrollYProgress, [0, 1], [28, 0]);
  const [gifUrl, setGifUrl] = useState<string>('');

  return (
    <motion.section
      ref={sectionRef}
      className="transition-colors duration-300 bg-black"
      style={{ opacity: sectionOpacity, y: gifY }}
    >
      <div className="max-w-6xl mx-auto px-4 py-4">
        {/* GIF Container - Medium */}
        <div className="flex justify-center items-center">
          {gifUrl && (
            <motion.div
              className="w-32 md:w-64 rounded-xl overflow-hidden cursor-pointer"
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: false, margin: '-50px' }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              whileHover={{ scale: 1.08 }}
            >
              <motion.img
                src={gifUrl}
                alt="Animated gif"
                className="w-full h-auto object-contain"
                whileHover={{ rotate: 2 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          )}
        </div>
      </div>
    </motion.section>
  );
};

export default GifSection;
