import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { SKILLS_DATA } from '../data';
import SkillProjects from './components/SkillProjects';

interface ProjectsProps {
  showHeader?: boolean;
}

const Projects: React.FC<ProjectsProps> = ({ showHeader = true }) => {
  const { isDark } = useTheme();
  const [activeSkillId, setActiveSkillId] = useState(SKILLS_DATA[0]?.id || '');
  const tabsRef = useRef<HTMLDivElement | null>(null);
  const scrollAnimationRef = useRef<number | null>(null);
  const isHoveringTabsRef = useRef(false);

  const activeSkill = SKILLS_DATA.find(skill => skill.id === activeSkillId);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  // Auto-scroll horizontal for skills tabs (hanya jika konten melebar)
  useEffect(() => {
    const el = tabsRef.current;
    if (!el) return;

    const scrollSpeed = 0.4; // semakin besar semakin cepat

    const animateScroll = () => {
      if (!el) return;

      if (!isHoveringTabsRef.current) {
        el.scrollLeft += scrollSpeed;

        const maxScroll = el.scrollWidth - el.clientWidth;
        if (el.scrollLeft >= maxScroll - 1) {
          el.scrollLeft = 0;
        }
      }

      scrollAnimationRef.current = requestAnimationFrame(animateScroll);
    };

    scrollAnimationRef.current = requestAnimationFrame(animateScroll);

    return () => {
      if (scrollAnimationRef.current) {
        cancelAnimationFrame(scrollAnimationRef.current);
      }
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`${showHeader ? 'min-h-screen pt-32 pb-16' : 'pb-0'} px-4 md:px-8 ${isDark ? 'bg-black' : 'bg-white'}`}
    >
      <div className={`${showHeader ? 'max-w-7xl mx-auto' : ''}`}>
        {/* Header Section - Only shown on dedicated page */}
        {showHeader && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mb-12 md:mb-16"
          >
            <motion.div variants={itemVariants}>
              <h1 className={`text-4xl md:text-5xl lg:text-6xl font-display font-black mb-4 ${isDark ? 'text-white' : 'text-black'}`}>
                My Projects
              </h1>
            </motion.div>

            <motion.p
              variants={itemVariants}
              className={`text-lg md:text-xl ${isDark ? 'text-zinc-400' : 'text-zinc-600'} max-w-2xl`}
            >
              Explore my work organized by skills and expertise. Each project represents my dedication to quality, creativity, and professional excellence.
            </motion.p>
          </motion.div>
        )}

        {/* Skills Filter Tabs */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-12 md:mb-16"
        >
          <div
            ref={tabsRef}
            className="flex gap-2 md:gap-4 overflow-x-auto scrollbar-hide justify-center ml-2 px-2 md:ml-4 md:px-0 py-2"
            style={{
              WebkitOverflowScrolling: 'touch',
              msOverflowStyle: 'none',
              scrollbarWidth: 'none',
            }}
            onMouseEnter={() => {
              isHoveringTabsRef.current = true;
            }}
            onMouseLeave={() => {
              isHoveringTabsRef.current = false;
            }}
            onTouchStart={() => {
              isHoveringTabsRef.current = true;
            }}
            onTouchEnd={() => {
              isHoveringTabsRef.current = false;
            }}
          >
            {SKILLS_DATA.map((skill) => (
              <motion.button
                key={skill.id}
                variants={itemVariants}
                onClick={() => setActiveSkillId(skill.id)}
                className={`relative flex items-center justify-center flex-shrink-0 w-12 h-12 md:w-20 md:h-20 rounded-xl transition-all duration-300 ${activeSkillId === skill.id
                  ? `bg-white/40 text-black shadow-md backdrop-blur-lg border border-white/50`
                  : `${isDark ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'}`
                  }`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                animate={{ rotate: activeSkillId === skill.id ? -10 : 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                {skill.imageUrl && skill.imageUrl.trim() !== '' ? (
                  <img
                    src={skill.imageUrl}
                    alt={skill.name}
                    className="w-6 h-6 md:w-10 md:h-10 object-contain mx-1"
                  />
                ) : (
                  <span
                    className="text-2xl"
                    dangerouslySetInnerHTML={{ __html: skill.icon || '' }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Active Skill Projects */}
        {activeSkill && (
          <SkillProjects skill={activeSkill} />
        )}

        {/* Empty State */}
        {!activeSkill && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`text-center py-12 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}
          >
            <p className="text-lg">Select a skill to view projects</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Projects;
