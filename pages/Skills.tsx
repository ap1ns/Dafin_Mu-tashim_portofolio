import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Terminal } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useScrollVisibility } from '../hooks/useScrollAnimation';
import Projects from '../link-project/Projects';
import PageBackground from '../components/PageBackground';
import StackingCardSwipe from '../components/StackingCardSwipe';
import { PAGE_BACKGROUNDS } from '../config/pageBackgrounds';
import { SKILLS_DATA } from '../data';

const FloatingStars: React.FC = () => {
  const stars = React.useMemo(
    () =>
      Array.from({ length: 20 }, (_, index) => ({
        id: index,
        left: Math.random() * 100,
        size: Math.random() * 3 + 2,
        duration: Math.random() * 4 + 6,
        delay: Math.random() * 3,
        opacity: Math.random() * 0.45 + 0.55,
        hue: Math.random() * 60 + 190,
      })),
    []
  );

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full"
          style={{
            left: `${star.left}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            backgroundColor: `hsla(${star.hue}, 100%, 90%, ${star.opacity})`,
            boxShadow: `0 0 ${star.size * 3}px rgba(255,255,255,${star.opacity})`,
          }}
          initial={{ y: '-5vh', opacity: 1 }}
          animate={{ y: ['-5vh', '110vh'], opacity: [1, 1, 0] }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            ease: 'linear',
            delay: star.delay,
          }}
        />
      ))}
    </div>
  );
};

const Skills: React.FC = () => {
  const { isDark } = useTheme();
  const { opacity } = useScrollVisibility();
  const backgroundUrl = isDark ? PAGE_BACKGROUNDS.skills.dark : PAGE_BACKGROUNDS.skills.light;
  const containerRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement | null>(null);
  const scrollAnimationRef = useRef<number | null>(null);
  const isHoveringTabsRef = useRef(false);

  const [activeSkillId, setActiveSkillId] = useState(SKILLS_DATA[0]?.id || '');

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start center', 'end center'],
  });

  const sectionOpacity = useTransform(scrollYProgress, [0, 0.1, 0.8, 1], [0, 1, 1, 0.95]);
  const headerY = useTransform(scrollYProgress, [0, 1], [28, 0]);

  // Auto-scroll horizontal for skills tabs
  useEffect(() => {
    const el = tabsRef.current;
    if (!el) return;

    const scrollSpeed = 0.4;

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
    <motion.div ref={containerRef} className={`relative overflow-hidden bg-black py-12 md:py-20 px-4 md:px-6 min-h-screen transition-opacity duration-300`} style={{ opacity: sectionOpacity, transition: 'opacity 0.3s ease-out' }}>
      <PageBackground url={backgroundUrl} />
      <FloatingStars />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <motion.div className="mb-10 md:mb-14 grid grid-cols-1 lg:grid-cols-[1.35fr_0.9fr] gap-8 items-start" style={{ y: headerY }}>
          {/* Text Content */}
          <div>
            <div className="flex items-center gap-3 mb-4 md:mb-5 text-zinc-500">
              <Terminal size={14} className="md:size-16" />
              <span className="text-[9px] md:text-[10px] font-black tracking-[0.5em] uppercase">Tech Stack v2.0</span>
            </div>
            <h2 className="text-5xl sm:text-7xl md:text-8xl font-display leading-[0.85] mb-4 md:mb-5 tracking-tighter uppercase text-white">
              CORE COMPETENCIES
            </h2>
            <p className="text-zinc-400 text-base leading-relaxed max-w-2xl">
              This section showcases my technical proficiency in administrative tools and data management. Drawing from my background in Computer and Network Engineering, I apply a systematic approach to organizing information, managing inventory, and ensuring operational efficiency. These projects reflect my commitment to accuracy, workflow optimization, and professional documentation.
            </p>

            {/* Skills Filter Tabs */}
            <motion.div className="mt-8 md:mt-10">
              <div
                ref={tabsRef}
                className="flex gap-2 md:gap-4 overflow-x-auto scrollbar-hide justify-start pl-2 md:pl-4 pr-2 py-2"
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
                    onClick={() => setActiveSkillId(skill.id)}
                    className={`relative flex flex-col items-center justify-center flex-shrink-0 min-w-[4.5rem] md:min-w-[5.5rem] h-20 rounded-xl transition-all duration-300 ${activeSkillId === skill.id
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
                        className="w-8 h-8 md:w-10 md:h-10 object-contain"
                      />
                    ) : skill.icon ? (
                      <span
                        className="text-2xl"
                        dangerouslySetInnerHTML={{ __html: skill.icon }}
                      />
                    ) : null}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="hidden lg:flex justify-center lg:justify-end">
            <StackingCardSwipe />
          </div>
        </motion.div>

        {/* Projects Component */}
        {/* <Projects showHeader={false} activeSkillId={activeSkillId} onSkillChange={setActiveSkillId} /> */}

        {/* Cards for smaller screens - below Projects */}
        <div className="lg:hidden flex justify-center mt-16 md:mt-24">
          <StackingCardSwipe />
        </div>
      </div>
    </motion.div>
  );
};

export default Skills;

