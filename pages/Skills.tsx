import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Terminal } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useScrollVisibility } from '../hooks/useScrollAnimation';
import Projects from '../link-project/Projects';
import PageBackground from '../components/PageBackground';
import { PAGE_BACKGROUNDS } from '../config/pageBackgrounds';

const ANI1_IMAGE = new URL('../.img/ANI1.gif', import.meta.url).href;
const ANI2_IMAGE = new URL('../.img/ANI2.gif', import.meta.url).href;
const ANI3_IMAGE = new URL('../.img/ANI3.gif', import.meta.url).href;

const ScrollControlledImage: React.FC<{
  src: string;
  alt: string;
  className?: string;
}> = ({ src, alt, className = '' }) => (
  <img src={src} alt={alt} className={`w-full h-full object-cover ${className}`} />
);

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

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start center', 'end center'],
  });

  const sectionOpacity = useTransform(scrollYProgress, [0, 0.1, 0.8, 1], [0, 1, 1, 0.95]);
  const headerY = useTransform(scrollYProgress, [0, 1], [28, 0]);

  // Transform scroll: scroll down = maju (+y), scroll up = mundur (-y)
  const yOffset1 = useTransform(scrollYProgress, [0, 1], [-60, 60]);
  const yOffset2 = useTransform(scrollYProgress, [0, 1], [-75, 75]);
  const yOffset3 = useTransform(scrollYProgress, [0, 1], [-70, 70]);
  const rotateGif1 = useTransform(scrollYProgress, [0, 1], [-12, 12]);
  const rotateGif2 = useTransform(scrollYProgress, [0, 1], [12, -12]);
  const rotateGif3 = useTransform(scrollYProgress, [0, 1], [-10, 10]);

  const imageVariants = {
    hidden: { opacity: 0, y: 24, scale: 0.92 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: 0.25 + custom * 0.15,
        duration: 0.55,
        ease: 'easeOut' as any,
      },
    }),
  };

  return (
    <motion.div ref={containerRef} className={`relative overflow-hidden bg-black py-12 md:py-20 px-4 md:px-6 min-h-screen transition-opacity duration-300`} style={{ opacity: sectionOpacity, transition: 'opacity 0.3s ease-out' }}>
      <PageBackground url={backgroundUrl} />
      <FloatingStars />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section with GIF */}
        <motion.div className="mb-16 md:mb-24 flex flex-row gap-4 md:gap-8 items-center" style={{ y: headerY }}>
          {/* Text Content */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4 md:mb-6 text-zinc-500">
              <Terminal size={14} className="md:size-16" />
              <span className="text-[9px] md:text-[10px] font-black tracking-[0.5em] uppercase">Tech Stack v2.0</span>
            </div>
            <h2 className="text-5xl sm:text-7xl md:text-8xl font-display leading-[0.85] mb-6 md:mb-8 tracking-tighter uppercase text-white">
              CORE COMPETENCIES <br />
              {/* <span className="text-zinc-500">Expertise & Capabilities</span> */}
            </h2>
            {/* Mobile Version */}
            <p className="md:hidden text-zinc-400 text-sm leading-relaxed max-w-2xl">
              This section showcases my technical proficiency in administrative tools and data management. Drawing from my background in Computer and Network Engineering, I apply a systematic approach to organizing information, managing inventory, and ensuring operational efficiency. These projects reflect my commitment to accuracy, workflow optimization, and professional documentation.
            </p>
            {/* Desktop Version */}
            <p className="hidden md:block text-zinc-400 text-base leading-relaxed max-w-2xl">
              This section showcases my technical proficiency in administrative tools and data management. Drawing from my background in Computer and Network Engineering, I apply a systematic approach to organizing information, managing inventory, and ensuring operational efficiency. These projects reflect my commitment to accuracy, workflow optimization, and professional documentation.
            </p>
          </div>

          {/* Image Section - Right Side */}
          <motion.div
            className="flex-shrink-0 flex justify-center md:justify-end md:h-full"
            initial={{ opacity: 0, scale: 0.8, x: 30 }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay: 0.2 }}
          >
            <div className="flex flex-row gap-4 md:gap-6">
              {/* First cylindrical image */}
              <motion.div
                className="w-12 md:w-24 h-32 md:h-64 rounded-xl overflow-hidden shadow-lg"
                variants={imageVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                custom={0}
                whileHover={{ scale: 1.05, rotate: 2 }}
                transition={{ duration: 0.3 }}
                style={{ y: yOffset1, rotate: rotateGif1 }}
              >
                <ScrollControlledImage
                  src={ANI1_IMAGE}
                  alt="Focus area 1"
                />
              </motion.div>

              {/* Second cylindrical image - Hidden on mobile */}
              <motion.div
                className="hidden md:block w-16 md:w-24 h-48 md:h-64 rounded-xl overflow-hidden shadow-lg"
                variants={imageVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                custom={1}
                whileHover={{ scale: 1.05, rotate: -2 }}
                transition={{ duration: 0.3 }}
                style={{ y: yOffset2, rotate: rotateGif2 }}
              >
                <ScrollControlledImage
                  src={ANI2_IMAGE}
                  alt="Focus area 2"
                />
              </motion.div>

              {/* Third cylindrical image - Hidden on mobile */}
              <motion.div
                className="hidden md:block w-16 md:w-24 h-48 md:h-64 rounded-xl overflow-hidden shadow-lg"
                variants={imageVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                custom={2}
                whileHover={{ scale: 1.05, rotate: 1 }}
                transition={{ duration: 0.3 }}
                style={{ y: yOffset3, rotate: rotateGif3 }}
              >
                <ScrollControlledImage
                  src={ANI3_IMAGE}
                  alt="Focus area 3"
                />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Projects Component */}
        <Projects showHeader={false} />
      </div>
    </motion.div>
  );
};

export default Skills;

