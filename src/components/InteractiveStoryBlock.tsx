import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Experience } from '../types';
import { Calendar, Briefcase, ChevronDown, Building2, CheckCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

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
}) => {
  const { t } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);

  // Translate experience fields using translation keys based on experience id
  const translatedTitle = t(`expTitle_${experience.id}` as any) || experience.title;
  const translatedCompany = t(`expCompany_${experience.id}` as any) || experience.company;
  const translatedPeriod = t(`expPeriod_${experience.id}` as any) || experience.period;
  const translatedDescription = t(`expDesc_${experience.id}` as any) || experience.description;
  const translatedHighlights = experience.highlights?.map((_, idx) => 
    t(`expHighlight_${experience.id}_${idx}` as any) || experience.highlights[idx]
  );

  const getThemeColor = (type: string) => {
    const themes = {
      'full-time': { 
        glow: 'shadow-blue-500/30 dark:shadow-blue-500/20', 
        text: 'text-blue-600 dark:text-blue-400', 
        bg: 'bg-blue-500/10 dark:bg-blue-500/20', 
        border: 'border-blue-500/20 dark:border-blue-400/30', 
        gradient: 'from-blue-500/20 via-blue-900/5 to-transparent' 
      },
      freelance: { 
        glow: 'shadow-purple-500/30 dark:shadow-purple-500/20', 
        text: 'text-purple-600 dark:text-purple-400', 
        bg: 'bg-purple-500/10 dark:bg-purple-500/20', 
        border: 'border-purple-500/20 dark:border-purple-400/30', 
        gradient: 'from-purple-500/20 via-purple-900/5 to-transparent' 
      },
      internship: { 
        glow: 'shadow-emerald-500/30 dark:shadow-emerald-500/20', 
        text: 'text-emerald-600 dark:text-emerald-400', 
        bg: 'bg-emerald-500/10 dark:bg-emerald-500/20', 
        border: 'border-emerald-500/20 dark:border-emerald-400/30', 
        gradient: 'from-emerald-500/20 via-emerald-900/5 to-transparent' 
      },
      project: { 
        glow: 'shadow-amber-500/30 dark:shadow-amber-500/20', 
        text: 'text-amber-600 dark:text-amber-400', 
        bg: 'bg-amber-500/10 dark:bg-amber-500/20', 
        border: 'border-amber-500/20 dark:border-amber-400/30', 
        gradient: 'from-amber-500/20 via-amber-900/5 to-transparent' 
      },
    };
    return themes[type as keyof typeof themes] || themes['full-time'];
  };

  const theme = getThemeColor(experience.type);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.1, type: "spring", stiffness: 80 }}
      onClick={onFocus}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative rounded-[2rem] overflow-hidden cursor-pointer backdrop-blur-xl transition-all duration-500 ${
        isActive 
          ? `bg-white/80 dark:bg-black/60 border-white/40 dark:border-white/20 shadow-xl ${theme.glow}`
          : 'bg-white/40 dark:bg-black/40 border-white/20 dark:border-white/10 hover:bg-white/60 dark:hover:bg-black/50 hover:shadow-lg'
      } border`}
    >
      {/* Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} opacity-0 transition-opacity duration-700 ${isActive || isHovered ? 'opacity-100' : ''}`} />

      {/* Glossy Overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/40 dark:from-white/0 dark:via-white/5 dark:to-white/10 pointer-events-none" />

      <div className="relative z-10 p-6 md:p-8">
        {/* Header Row */}
        <div className="flex flex-col md:flex-row md:items-center gap-5 md:gap-6">
          {/* Icon/Avatar */}
          <motion.div 
            layout
            className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 ${theme.bg} ${theme.border} border shadow-inner`}
            whileHover={{ rotate: 10, scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Briefcase className={`w-7 h-7 ${theme.text}`} />
          </motion.div>

          {/* Title & Company */}
          <div className="flex-1">
            <motion.h3 layout className="text-xl md:text-3xl font-bold text-black dark:text-white mb-2 tracking-tight">
              {translatedTitle}
            </motion.h3>
            <motion.div layout className="flex flex-wrap items-center gap-3 md:gap-4 text-sm font-medium text-black/60 dark:text-white/60">
              <span className="flex items-center gap-1.5 text-black/80 dark:text-white/80 font-bold px-3 py-1 rounded-full bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/10 shadow-sm">
                <Building2 size={14} />
                {translatedCompany}
              </span>
              <span className="flex items-center gap-1.5 font-semibold">
                <Calendar size={14} className={theme.text} />
                {translatedPeriod}
              </span>
            </motion.div>
          </div>

          {/* Right Action */}
          <div className={`hidden md:flex items-center justify-center w-12 h-12 rounded-full backdrop-blur-md border transition-all duration-300 shadow-sm ${isActive ? `${theme.bg} ${theme.border} ${theme.text}` : 'bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 text-black/50 dark:text-white/50'}`}>
            <motion.div animate={{ rotate: isActive ? 180 : 0 }} transition={{ type: "spring", stiffness: 200, damping: 15 }}>
              <ChevronDown size={24} />
            </motion.div>
          </div>
        </div>

        {/* Compact description (visible only when NOT active) */}
        <AnimatePresence>
          {!isActive && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 md:pl-[5.5rem]"
            >
              <p className="text-sm md:text-base text-black/70 dark:text-white/70 line-clamp-2 leading-relaxed">
                {translatedDescription}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Expanded Content */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
              className="overflow-hidden"
            >
              <div className="pt-8 mt-6 border-t border-black/10 dark:border-white/10">
                <div className="grid md:grid-cols-[1.5fr,1fr] gap-8 md:gap-12">
                  {/* Left Column: Description & Highlights */}
                  <div className="space-y-8">
                    <div>
                      <h4 className="flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase text-black/50 dark:text-white/50 mb-4">
                        <span className={`w-2 h-2 rounded-full ${theme.bg} border ${theme.border}`} />
                        {t('overview')}
                      </h4>
                      <p className="text-base text-black/80 dark:text-white/90 leading-relaxed font-medium">
                        {translatedDescription}
                      </p>
                    </div>

                    {experience.highlights && experience.highlights.length > 0 && (
                      <div>
                        <h4 className="flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase text-black/50 dark:text-white/50 mb-5">
                          <span className={`w-2 h-2 rounded-full ${theme.bg} border ${theme.border}`} />
                          {t('keyImpact')}
                        </h4>
                        <div className="space-y-4">
                          {translatedHighlights?.map((highlight, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.1 + idx * 0.1, type: "spring", stiffness: 100 }}
                              className="flex items-start gap-4 p-4 rounded-2xl bg-white/50 dark:bg-white/5 border border-black/5 dark:border-white/5 shadow-sm hover:bg-white/80 dark:hover:bg-white/10 transition-colors"
                            >
                              <CheckCircle className={`w-6 h-6 mt-0.5 flex-shrink-0 ${theme.text}`} />
                              <span className="text-sm md:text-base text-black/80 dark:text-white/80 leading-relaxed font-medium">
                                {highlight}
                              </span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Skills */}
                  {experience.skills && experience.skills.length > 0 && (
                    <div>
                      <h4 className="flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase text-black/50 dark:text-white/50 mb-5">
                        <span className={`w-2 h-2 rounded-full ${theme.bg} border ${theme.border}`} />
                        {t('technologiesSkills')}
                      </h4>
                      <div className="flex flex-wrap gap-2 md:gap-3">
                        {experience.skills.map((skill, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.8, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ delay: 0.2 + idx * 0.05, type: "spring" }}
                            className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold bg-white/80 dark:bg-black/50 border border-black/10 dark:border-white/10 text-black/80 dark:text-white/80 shadow-sm backdrop-blur-md hover:scale-105 hover:shadow-md transition-all cursor-default`}
                          >
                            {skill}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default InteractiveStoryBlock;
