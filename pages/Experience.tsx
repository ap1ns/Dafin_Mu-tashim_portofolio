import React, { useState, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import InteractiveStoryBlock from '../components/InteractiveStoryBlock';
import { useTheme } from '../context/ThemeContext';
import { useScrollVisibility } from '../hooks/useScrollAnimation';
import { EXPERIENCE_DATA } from '../data';
import PageBackground from '../components/PageBackground';
import { PAGE_BACKGROUNDS } from '../config/pageBackgrounds';

const Experience: React.FC = () => {
  const { t } = useLanguage();
  const { isDark } = useTheme();
  const { opacity } = useScrollVisibility();
  const backgroundUrl = isDark
    ? PAGE_BACKGROUNDS.experience.dark
    : PAGE_BACKGROUNDS.experience.light;
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const sectionOpacity = useTransform(scrollYProgress, [0, 0.1, 0.7, 1], [0, 1, 1, 0.92]);
  const headerY = useTransform(scrollYProgress, [0, 1], [36, 0]);
  const blocksY = useTransform(scrollYProgress, [0, 1], [20, -12]);
  const ctaY = useTransform(scrollYProgress, [0, 1], [18, -10]);

  // Enhanced scroll animations
  const backgroundOrb1Y = useTransform(scrollYProgress, [0, 1], [-25, 45]);
  const backgroundOrb1Rotate = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const backgroundOrb2Y = useTransform(scrollYProgress, [0, 1], [35, -55]);
  const backgroundOrb2Rotate = useTransform(scrollYProgress, [0, 1], [180, 0]);
  const contentScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.01, 0.99]);
  const headerRotate = useTransform(scrollYProgress, [0, 1], [0, -1]);
  const [focusedId, setFocusedId] = useState<string | null>(null);

  return (
    <motion.div
      ref={sectionRef}
      className={`relative bg-gradient-to-b from-black via-black/95 to-black overflow-hidden py-32 px-6 min-h-screen transition-opacity duration-300`}
      style={{ opacity: sectionOpacity, transition: 'opacity 0.3s ease-out' }}
    >
      <PageBackground url={backgroundUrl} hideOnMobile={true} />
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Orbs */}
        <motion.div
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-blue-600/10 blur-3xl"
          animate={{
            y: [0, 60, 0],
            x: [0, 40, 0],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          style={{ y: backgroundOrb1Y, rotate: backgroundOrb1Rotate }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-purple-600/10 blur-3xl"
          animate={{
            y: [0, -60, 0],
            x: [0, -40, 0],
            rotate: [360, 180, 0],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          style={{ y: backgroundOrb2Y, rotate: backgroundOrb2Rotate }}
        />

        {/* Additional Floating Orbs */}
        <motion.div
          className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full bg-cyan-500/15 blur-3xl"
          animate={{
            y: [0, -80, 0],
            x: [0, 50, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/3 w-80 h-80 rounded-full bg-pink-500/10 blur-3xl"
          animate={{
            y: [0, 70, 0],
            x: [0, -60, 0],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
        />

        {/* Floating Particles */}
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1 h-1 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: [
                'rgba(100, 150, 255, 0.6)',
                'rgba(150, 100, 255, 0.5)',
                'rgba(100, 200, 255, 0.4)',
              ][i % 3],
            }}
            animate={{
              y: [-100, 300],
              x: [0, Math.random() * 100 - 50],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: 8 + Math.random() * 6,
              repeat: Infinity,
              delay: i * 0.5,
              ease: 'easeOut',
            }}
          />
        ))}

        {/* Pulsing Center Glow */}
        <motion.div
          className="absolute top-1/2 left-1/2 w-96 h-96 rounded-full bg-blue-500/5 blur-2xl -translate-x-1/2 -translate-y-1/2"
          animate={{
            scale: [0.8, 1.2, 0.8],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Rotating Ring Effect */}
        <motion.div
          className="absolute top-1/3 right-1/4 w-80 h-80 border border-cyan-500/20 rounded-full"
          animate={{
            rotate: [0, 360],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header Section - Minimalist & Modern */}
        <motion.div
          className="mb-24"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          style={{ y: headerY, rotate: headerRotate, scale: contentScale }}
        >
          <div className="mb-6 flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 180, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            >
              <Sparkles size={20} className="text-white" />
            </motion.div>
            <span className="text-xs font-bold tracking-[0.3em] text-white/50 uppercase">
              {t('profJourney')}
            </span>
          </div>

          <h1 className="text-6xl md:text-7xl lg:text-8xl font-grotesk font-bold leading-[0.95] text-white mb-6">
            {t('experienceTitle')}
          </h1>

          <p className="text-lg md:text-xl text-white/70 max-w-2xl leading-relaxed font-light">
            {t('expDesc')}
          </p>
        </motion.div>

        {/* Interactive Story Blocks Grid */}
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, margin: '-100px' }}
          transition={{ duration: 0.5, staggerChildren: 0.1 }}
          style={{ y: blocksY, scale: contentScale }}
        >
          {EXPERIENCE_DATA.map((exp, index) => (
            <InteractiveStoryBlock
              key={exp.id}
              experience={exp}
              isActive={focusedId === exp.id}
              onFocus={() => setFocusedId(focusedId === exp.id ? null : exp.id)}
              index={index}
              totalItems={EXPERIENCE_DATA.length}
            />
          ))}
        </motion.div>

        {/* No Focus State Message */}
        {focusedId === null && (
          <motion.div
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-white/50 text-sm font-light">
              {t('exploreDetails')}
            </p>
          </motion.div>
        )}

        {/* CTA Section */}
        <motion.div
          className="mt-28 pt-20 border-t border-white/10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: '-100px' }}
          transition={{ duration: 0.8, delay: 0.3 }}
          style={{ y: ctaY }}
        >
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-white/5 to-white/10 p-12 md:p-16 border border-white/10">
            {/* Gradient Orbs */}
            <motion.div
              className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-blue-600/10 blur-3xl"
              animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 180] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            />

            <div className="relative z-10 text-center">
              <motion.h2
                className="text-4xl md:text-5xl font-grotesk font-bold text-white mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.6 }}
              >
                {t('letsCreateRemarkable')}
              </motion.h2>

              <motion.p
                className="text-lg text-white/70 mb-10 max-w-xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                {t('expCollabMsg')}
              </motion.p>

              <motion.a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById('contact');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-block px-10 py-4 bg-white text-black rounded-xl font-bold group relative overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="flex items-center gap-3"
                  initial={{ x: 0 }}
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.3 }}
                >
                  <span>{t('getInTouchBtn')}</span>
                  <motion.div
                    animate={{ x: [0, 3, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight size={18} />
                  </motion.div>
                </motion.div>
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Experience;
