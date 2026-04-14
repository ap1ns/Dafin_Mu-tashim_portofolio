import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Experience } from '../types';
import { Calendar, Briefcase, Zap } from 'lucide-react';

interface InteractiveStoryBlockProps {
  experience: Experience;
  isActive: boolean;
  onFocus: () => void;
  index: number;
  totalItems: number;
}

const InteractiveStoryBlock: React.FC<InteractiveStoryBlockProps> = ({
  experience,
  isActive,
  onFocus,
  index,
  totalItems
}) => {
  const [hasClicked, setHasClicked] = useState(false);

  const getTypeColor = (type: string) => {
    const colors: Record<string, { bg: string; text: string; accent: string }> = {
      'full-time': {
        bg: 'from-blue-600/10 to-blue-400/5',
        text: 'text-blue-600 dark:text-blue-400',
        accent: 'bg-blue-600/20'
      },
      'freelance': {
        bg: 'from-purple-600/10 to-purple-400/5',
        text: 'text-purple-600 dark:text-purple-400',
        accent: 'bg-purple-600/20'
      },
      'internship': {
        bg: 'from-emerald-600/10 to-emerald-400/5',
        text: 'text-emerald-600 dark:text-emerald-400',
        accent: 'bg-emerald-600/20'
      },
      'project': {
        bg: 'from-amber-600/10 to-amber-400/5',
        text: 'text-amber-600 dark:text-amber-400',
        accent: 'bg-amber-600/20'
      }
    };
    return colors[type] || colors['full-time'];
  };

  const getTypeLabel = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ');
  };

  const colors = getTypeColor(experience.type);

  const containerVariants = {
    initial: {
      opacity: 0,
      y: 20,
      scale: 0.95
    },
    inactive: {
      opacity: 0.4,
      y: 0,
      scale: isActive ? 0.92 : 1,
      filter: isActive ? 'blur(2px)' : 'blur(0px)'
    },
    active: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)'
    }
  };

  const contentVariants = {
    hidden: {
      opacity: 0,
      height: 0,
      transition: { duration: 0.3 }
    },
    visible: {
      opacity: 1,
      height: 'auto',
      transition: {
        duration: 0.4,
        staggerChildren: 0.08,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  const skillVariants = {
    hidden: { opacity: 0, scale: 0.85 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } }
  };

  return (
    <motion.div
      layout
      variants={containerVariants}
      initial="initial"
      animate={isActive ? 'active' : 'inactive'}
      transition={{
        opacity: { duration: 0.4 },
        y: { duration: 0.4, ease: [0.23, 1, 0.32, 1] },
        scale: { duration: 0.4, ease: [0.23, 1, 0.32, 1] },
        filter: { duration: 0.4 }
      }}
      onClick={() => {
        onFocus();
        setHasClicked(true);
      }}
      className="cursor-pointer group"
    >
      {/* Compact State (Always Visible) */}
      <div
        className={`
          relative overflow-hidden rounded-2xl p-5 md:p-7
          bg-gradient-to-br ${colors.bg}
          border border-white/10 dark:border-white/5
          transition-all duration-300
          ${isActive ? 'ring-2 ring-black/20 dark:ring-white/20 shadow-2xl shadow-black/10 dark:shadow-white/5' : 'hover:border-white/20 dark:hover:border-white/10'}
        `}
      >
        {/* Animated Background Accent */}
        {isActive && (
          <motion.div
            className={`absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-20`}
            style={{
              background: colors.accent
            }}
            animate={{
              rotate: [0, 360],
              scale: [1, 1.2, 1]
            }}
            transition={{
              rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
              scale: { duration: 8, repeat: Infinity, ease: 'easeInOut' }
            }}
          />
        )}

        {/* Compact Content */}
        <div className="relative z-10">
          {/* Header Row */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <motion.h3
                className="text-lg md:text-xl font-grotesk font-bold text-black dark:text-white line-clamp-2 break-words"
                animate={{
                  fontSize: isActive ? '1.375rem' : '1.125rem'
                }}
                transition={{ duration: 0.3 }}
              >
                {experience.title}
              </motion.h3>
            </div>

            {/* Type Badge */}
            <motion.div
              animate={{
                scale: isActive ? 1.05 : 1,
                opacity: isActive ? 1 : 0.7
              }}
              transition={{ duration: 0.3 }}
              className={`
                inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                text-xs font-bold whitespace-nowrap flex-shrink-0
                ${colors.text} ${colors.accent}
              `}
            >
              <Briefcase size={12} />
              <span>{getTypeLabel(experience.type)}</span>
            </motion.div>
          </div>

          {/* Company & Period Row */}
          <div className="mb-3 space-y-1">
            <p className="text-sm font-semibold text-black/70 dark:text-white/70">
              {experience.company}
            </p>
            <div className="flex items-center gap-2 text-xs text-black/60 dark:text-white/60">
              <Calendar size={13} />
              <span>{experience.period}</span>
            </div>
          </div>

          {/* Description Preview */}
          <p className="text-sm text-black/80 dark:text-white line-clamp-2 leading-relaxed">
            {experience.description}
          </p>

          {/* Interactive Indicator */}
          {!isActive && (
            <motion.div
              className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-black/60 dark:text-white/60"
              animate={{ x: [0, 2, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Zap size={12} />
              <span>Click to explore</span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Expanded Content (Appears Below When Active) */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="overflow-hidden"
          >
            <motion.div
              className="mt-4 space-y-5"
              variants={contentVariants}
            >
              {/* Full Description */}
              <motion.div
                variants={itemVariants}
                className="bg-white/50 dark:bg-white/15 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-white/30 dark:border-white/20"
              >
                <h4 className="text-xs font-bold tracking-widest uppercase text-black/70 dark:text-white/80 mb-3">
                  Overview
                </h4>
                <p className="text-sm md:text-base text-black/85 dark:text-white leading-relaxed">
                  {experience.description}
                </p>
              </motion.div>

              {/* Key Highlights */}
              {experience.highlights.length > 0 && (
                <motion.div
                  variants={itemVariants}
                  className="bg-white/50 dark:bg-white/15 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-white/30 dark:border-white/20"
                >
                  <h4 className="text-xs font-bold tracking-widest uppercase text-black/70 dark:text-white/80 mb-4">
                    Key Achievements
                  </h4>
                  <ul className="space-y-2">
                    {experience.highlights.map((highlight, idx) => (
                      <motion.li
                        key={idx}
                        variants={itemVariants}
                        className="flex gap-3 items-start text-sm text-black/80 dark:text-white"
                      >
                        <motion.span
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ delay: idx * 0.05, duration: 0.3 }}
                          className="flex-shrink-0 w-5 h-5 rounded-full bg-black/10 dark:bg-white/10 flex items-center justify-center mt-0.5 font-bold text-xs"
                        >
                          ✓
                        </motion.span>
                        <span>{highlight}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Skills */}
              {experience.skills.length > 0 && (
                <motion.div
                  variants={itemVariants}
                  className="bg-white/50 dark:bg-white/15 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-white/30 dark:border-white/20"
                >
                  <h4 className="text-xs font-bold tracking-widest uppercase text-black/70 dark:text-white/80 mb-4">
                    Skills & Tools
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {experience.skills.map((skill, idx) => (
                      <motion.span
                        key={idx}
                        variants={skillVariants}
                        custom={idx}
                        className="px-3 py-1.5 rounded-lg bg-black/10 dark:bg-white/20 text-black/80 dark:text-white text-xs font-semibold border border-black/20 dark:border-white/30 hover:bg-black/15 dark:hover:bg-white/30 transition-colors"
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default InteractiveStoryBlock;
