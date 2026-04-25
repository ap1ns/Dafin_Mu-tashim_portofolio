import React, { useMemo, useRef, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Terminal } from 'lucide-react';
import SplitText from '../components/SplitText';
import { useTheme } from '../context/ThemeContext';
import PageBackground from '../components/PageBackground';
import StackingCardSwipe from '../components/StackingCardSwipe';
import ComingSoonDisplay from '../components/ComingSoonDisplay';
import { PAGE_BACKGROUNDS } from '../config/pageBackgrounds';
import { SKILLS_DATA } from '../data';
import '../styles/coming-soon.css';



const Skills: React.FC = () => {
  const { t } = useLanguage();
  const { isDark } = useTheme();
  const backgroundUrl = isDark ? PAGE_BACKGROUNDS.skills.dark : PAGE_BACKGROUNDS.skills.light;
  const containerRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement | null>(null);
  const [isHoveringTabs, setIsHoveringTabs] = useState(false);

  const [activeSkillId, setActiveSkillId] = useState(SKILLS_DATA[0]?.id || '');
  const hasAutoScroll = SKILLS_DATA.length > 5;
  const scrollDuration = Math.max(24, SKILLS_DATA.length * 4);

  const renderedSkills = useMemo(
    () => (hasAutoScroll ? [...SKILLS_DATA, ...SKILLS_DATA] : SKILLS_DATA),
    [hasAutoScroll]
  );

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start center', 'end center'],
  });

  const sectionOpacity = useTransform(scrollYProgress, [0, 0.1, 0.8, 1], [0, 1, 1, 0.95]);
  const headerY = useTransform(scrollYProgress, [0, 1], [28, 0]);


  return (
    <motion.div ref={containerRef} className={`relative overflow-hidden bg-black py-12 md:py-20 px-4 md:px-6 min-h-screen transition-opacity duration-300`} style={{ opacity: sectionOpacity, transition: 'opacity 0.3s ease-out' }}>
      <PageBackground url={backgroundUrl} />
      {/* Background only, particles removed */}

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <motion.div
          className="mb-10 md:mb-14 grid grid-cols-1 lg:grid-cols-[1.35fr_0.9fr] gap-8 items-start"
          style={{ y: headerY }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: '-50px' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {/* Text Content */}
          <div>
            <div className="flex items-center gap-3 mb-4 md:mb-5 text-zinc-500">
              <Terminal size={14} className="md:size-16" />
              <span className="text-[9px] md:text-[10px] font-black tracking-[0.5em] uppercase">{t('techStackV2')}</span>
            </div>
            <h2 className="text-5xl sm:text-7xl md:text-8xl font-display leading-[0.85] mb-4 md:mb-5 tracking-tighter uppercase text-white">
              <SplitText
                text={t('coreCompetencies')}
                splitBy="word"
                stagger={0.08}
                delay={0.1}
                duration={0.7}
                margin="-60px"
              />
            </h2>
            <p className="text-zinc-400 text-base leading-relaxed max-w-2xl">
              {t('skillsCoreDesc')}
            </p>

            {/* Skills Filter Tabs */}
            <motion.div className="mt-8 md:mt-10">
              <div
                ref={tabsRef}
                className="relative overflow-hidden rounded-3xl"
                onMouseEnter={() => setIsHoveringTabs(true)}
                onMouseLeave={() => setIsHoveringTabs(false)}
                onTouchStart={() => setIsHoveringTabs(true)}
                onTouchEnd={() => setIsHoveringTabs(false)}
              >
                <div
                  className={`flex gap-2 md:gap-4 items-center py-2 pl-2 md:pl-4 pr-2 ${hasAutoScroll ? 'min-w-max' : 'overflow-x-auto scrollbar-hide'}`}
                  style={
                    hasAutoScroll
                      ? {
                          animation: `skillsScroll ${scrollDuration}s linear infinite`,
                          animationPlayState: isHoveringTabs ? 'paused' : 'running',
                          WebkitTransform: 'translate3d(0,0,0)',
                        }
                      : {
                          WebkitOverflowScrolling: 'touch',
                          msOverflowStyle: 'none',
                          scrollbarWidth: 'none',
                        }
                  }
                >
                  {renderedSkills.map((skill, index) => (
                    <motion.button
                      key={`${skill.id}-${index}`}
                      onClick={() => setActiveSkillId(skill.id)}
                      className={`relative flex flex-col items-center justify-center flex-shrink-0 min-w-[4rem] sm:min-w-[4.5rem] md:min-w-[5.5rem] h-16 sm:h-20 rounded-xl transition-all duration-300 ${activeSkillId === skill.id
                          ? `bg-white/40 text-black shadow-md backdrop-blur-lg border border-white/50`
                          : `bg-zinc-800 text-zinc-300 hover:bg-zinc-700`
                        }`}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      animate={{ rotate: activeSkillId === skill.id ? -10 : 0 }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                    >
                      {skill.imageUrl ? (
                        <img
                          src={skill.imageUrl}
                          alt={skill.name}
                          className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 object-contain"
                        />
                      ) : skill.icon ? (
                        <span
                          className="text-xl sm:text-2xl md:text-3xl"
                          dangerouslySetInnerHTML={{ __html: skill.icon }}
                        />
                      ) : null}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          <div className="hidden lg:flex justify-center lg:justify-end">
            <StackingCardSwipe />
          </div>
        </motion.div>

        {/* Coming Soon Display — appears when a skill icon is clicked */}
        {activeSkillId && (
          <ComingSoonDisplay
            activeSkillId={activeSkillId}
            skillName={SKILLS_DATA.find((s) => s.id === activeSkillId)?.name || ''}
          />
        )}

        {/* Cards for smaller screens - below Projects */}
        <motion.div
          className="lg:hidden flex justify-center mt-16 md:mt-24"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: '-50px' }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
        >
          <StackingCardSwipe />
        </motion.div>
      </div>

      <style>{`
        @keyframes skillsScroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </motion.div>
  );
};

export default Skills;

