import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, easeOut, easeInOut } from 'framer-motion';
import { ArrowRight, Activity, Zap, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useScrollVisibility } from '../hooks/useScrollAnimation';
import PageBackground from '../components/PageBackground';
import { PAGE_BACKGROUNDS } from '../config/pageBackgrounds';
import '../styles/home-animations.css';

const Home: React.FC = () => {
  const { isDark } = useTheme();
  const { opacity } = useScrollVisibility();
  const backgroundUrl = isDark ? PAGE_BACKGROUNDS.home.dark : PAGE_BACKGROUNDS.home.light;
  const [particles, setParticles] = useState<
    Array<{ id: number; x: number; y: number; size: number; delay: number }>
  >([]);
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const heroCopyY = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const heroImageY = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.1, 0.7, 1], [0, 1, 1, 0.9]);
  const ctaY = useTransform(scrollYProgress, [0, 1], [0, -18]);

  // Enhanced scroll animations for more dynamic effects
  const floatingOrb1Y = useTransform(scrollYProgress, [0, 1], [-20, 40]);
  const floatingOrb1Rotate = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const floatingOrb2Y = useTransform(scrollYProgress, [0, 1], [30, -50]);
  const floatingOrb2Rotate = useTransform(scrollYProgress, [0, 1], [90, -90]);
  const floatingOrb3Y = useTransform(scrollYProgress, [0, 1], [-15, 35]);
  const floatingOrb3X = useTransform(scrollYProgress, [0, 1], [0, 25]);
  const particlesY = useTransform(scrollYProgress, [0, 1], [0, -30]);
  const badgeScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.05, 0.98]);
  const titleRotate = useTransform(scrollYProgress, [0, 1], [0, -2]);

  useEffect(() => {
    // Generate floating particles
    const newParticles = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      delay: Math.random() * 5,
    }));
    setParticles(newParticles);
  }, []);
  const loopTextVariants = {
    animate: (i: number) => ({
      opacity: [1, 1, 0.5, 1],
      transition: {
        delay: i * 0.08,
        duration: 3,
        repeat: Infinity,
      },
    }),
  };

  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.18,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariant = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut } },
  };

  return (
    <div
      className={`relative min-h-screen transition-opacity duration-300`}
      style={{ opacity, transition: 'opacity 0.3s ease-out' }}
    >
      <PageBackground url={backgroundUrl} fixed={true} />
      <motion.section
        ref={sectionRef}
        className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden pt-28 pb-16 md:pt-20"
        style={{ opacity: heroOpacity }}
      >
        {/* Animated Background Orbs */}
        <div className="absolute top-0 left-0 w-full h-full -z-10 pointer-events-none overflow-hidden">
          {/* Floating Orbs */}
          <motion.div
            className="absolute w-64 h-64 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-400/10 blur-3xl"
            animate={{
              y: [0, -50, 0],
              x: [0, 30, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: easeInOut,
            }}
            style={{
              top: '10%',
              left: '10%',
              y: floatingOrb1Y,
              rotate: floatingOrb1Rotate,
            }}
          />
          <motion.div
            className="absolute w-56 h-56 rounded-full bg-gradient-to-br from-cyan-400/15 to-blue-400/10 blur-3xl"
            animate={{
              y: [0, 60, 0],
              x: [0, -40, 0],
              rotate: [360, 180, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: easeInOut,
            }}
            style={{
              bottom: '15%',
              right: '5%',
              y: floatingOrb2Y,
              rotate: floatingOrb2Rotate,
            }}
          />
          <motion.div
            className="absolute w-72 h-72 rounded-full bg-gradient-to-br from-pink-300/15 to-purple-400/10 blur-3xl"
            animate={{
              y: [0, -40, 0],
              x: [0, 50, 0],
            }}
            transition={{
              duration: 22,
              repeat: Infinity,
              ease: easeInOut,
            }}
            style={{
              top: '50%',
              right: '10%',
              y: floatingOrb3Y,
              x: floatingOrb3X,
            }}
          />

          {/* Base Background Gradients */}
          <div className="absolute top-0 left-0 w-full h-full -z-10 pointer-events-none">
            <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-zinc-100 dark:bg-zinc-800 rounded-full blur-[120px]" />
            <div className="absolute bottom-[10%] right-[-5%] w-[40%] h-[40%] bg-zinc-50 dark:bg-zinc-900 rounded-full blur-[120px]" />
          </div>

          {/* Floating Particles */}
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute rounded-full pointer-events-none"
              style={{
                width: particle.size,
                height: particle.size,
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                background: isDark
                  ? `rgba(${100 + particle.id * 10}, ${150 + particle.id * 5}, 255, 0.6)`
                  : `rgba(${200 + particle.id * 5}, ${200 + particle.id * 5}, 220, 0.4)`,
                boxShadow: isDark
                  ? `0 0 ${particle.size * 3}px rgba(${100 + particle.id * 10}, ${150 + particle.id * 5}, 255, 0.8)`
                  : `0 0 ${particle.size * 2}px rgba(${150 + particle.id * 5}, ${150 + particle.id * 5}, 200, 0.5)`,
                y: particlesY,
              }}
              animate={{
                y: [0, -200, -400],
                x: [Math.random() * 100 - 50, Math.random() * 100 - 50],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 8 + Math.random() * 4,
                repeat: Infinity,
                delay: particle.delay,
                ease: easeOut,
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-12 items-center w-full">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="text-center lg:text-left order-2 lg:order-1"
            style={{ y: heroCopyY }}
          >
            <motion.div
              variants={itemVariant}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-800 border border-zinc-700 mb-6 md:mb-10"
              style={{ scale: badgeScale }}
            >
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Zap size={10} className="fill-white" />
              </motion.div>
              <span className="text-[9px] font-black tracking-[0.4em] uppercase text-zinc-400">
                LOGISTICS & OPERATIONS ENTHUSIAST
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariant}
              className="font-Caesar_Dressing text-[18vw] sm:text-[15vw] lg:text-[9rem] font-display leading-[0.75] md:leading-[0.7] mb-8 md:mb-12 select-none tracking-tighter uppercase text-black dark:text-white"
              style={{ rotate: titleRotate }}
            >
              <span>
                {'Dafin'.split('').map((char, i) => (
                  <motion.span
                    key={i}
                    className="inline-block"
                    animate={{ y: [0, -10, 0] }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: i * 0.1,
                      ease: easeInOut,
                    }}
                  >
                    {char}
                  </motion.span>
                ))}
              </span>{' '}
              <br />
              <span className="text-zinc-200 dark:text-zinc-500">
                {"Mu'tashim".split('').map((char, i) => (
                  <motion.span
                    key={i}
                    className="inline-block"
                    animate={{ y: [0, -8, 0] }}
                    transition={{
                      duration: 3.5,
                      repeat: Infinity,
                      delay: i * 0.12,
                      ease: easeInOut,
                    }}
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </motion.span>
                ))}
              </span>
            </motion.h1>

            <motion.div className="flex flex-col md:flex-row items-center lg:items-center justify-center lg:justify-start gap-8 md:gap-10 mb-10 md:mb-12">
              <motion.p
                variants={itemVariant}
                className="text-base md:text-lg text-zinc-400 leading-relaxed max-w-xs font-medium lg:border-l-2 lg:border-zinc-700 lg:pl-6 text-center lg:text-left"
                animate={{
                  color: [
                    'rgba(161, 161, 170, 1)',
                    'rgba(200, 200, 200, 1)',
                    'rgba(161, 161, 170, 1)',
                  ],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: easeInOut,
                }}
              >
                Supporting seamless distribution through precise data administration and efficient
                warehouse operations
              </motion.p>
              <motion.div variants={itemVariant} className="flex items-center gap-4">
                <motion.div
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-zinc-200 dark:border-zinc-700 flex items-center justify-center animate-spin-slow"
                  animate={{
                    boxShadow: [
                      '0 0 10px rgba(255, 255, 255, 0)',
                      '0 0 20px rgba(255, 255, 255, 0.2)',
                      '0 0 10px rgba(255, 255, 255, 0)',
                    ],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: easeInOut,
                  }}
                >
                  <motion.div
                    className="w-1.5 h-1.5 md:w-2 md:h-2 bg-black dark:bg-white rounded-full"
                    animate={{
                      scale: [1, 1.5, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: easeInOut,
                    }}
                  />
                </motion.div>
                <motion.span
                  className="text-[9px] md:text-[10px] font-black tracking-[0.2em] text-zinc-400 dark:text-zinc-500 uppercase max-w-[80px] text-left"
                  animate={{
                    opacity: [0.6, 1, 0.6],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: easeInOut,
                  }}
                >
                  Scroll to explore my work
                </motion.span>
              </motion.div>
            </motion.div>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6">
              <motion.a
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5, ease: easeOut }}
                href="FILE/DafinMutashim.pdf"
                download="CV Dafin Mu'tashim.pdf"
                style={{ y: ctaY }}
                className="group relative px-8 md:px-12 py-5 md:py-6 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-black text-[9px] md:text-[10px] tracking-[0.3em] overflow-hidden transition-all hover:shadow-[0_20px_40px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_20px_40px_rgba(255,255,255,0.15)] active:scale-95"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10 flex items-center gap-4">
                  DOWNLOAD CV{' '}
                  <ArrowRight
                    size={14}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </span>
                <div className="absolute inset-0 bg-zinc-800 dark:bg-zinc-300 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" />
              </motion.a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: easeOut }}
            className="relative order-1 lg:order-2 flex justify-center lg:block"
            style={{ y: heroImageY }}
          >
            <div className="relative aspect-[3.5/5] w-full max-w-[280px] sm:max-w-sm lg:max-w-md mx-auto lg:ml-auto">
              {/* Animated Floating Particles Around Image */}
              <motion.div
                className="absolute -inset-16 pointer-events-none"
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
              >
                {[0, 1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 rounded-full"
                    style={{
                      background: isDark
                        ? `hsl(${Math.random() * 360}, 100%, 60%)`
                        : `hsl(${Math.random() * 360}, 80%, 50%)`,
                      top: '50%',
                      left: '50%',
                      marginTop: '-4px',
                      marginLeft: '-4px',
                    }}
                    animate={{
                      x: [
                        Math.cos((i * Math.PI * 2) / 4) * 120,
                        Math.cos((i * Math.PI * 2) / 4) * 140,
                        Math.cos((i * Math.PI * 2) / 4) * 120,
                      ],
                      y: [
                        Math.sin((i * Math.PI * 2) / 4) * 120,
                        Math.sin((i * Math.PI * 2) / 4) * 140,
                        Math.sin((i * Math.PI * 2) / 4) * 120,
                      ],
                      opacity: [0.3, 0.8, 0.3],
                    }}
                    transition={{
                      duration: 5 + i,
                      repeat: Infinity,
                      ease: easeInOut,
                    }}
                  />
                ))}
              </motion.div>

              {/* Outer Decorative Frame */}
              <motion.div
                className="absolute inset-0 border-[16px] md:border-[24px] border-zinc-900 rounded-[3rem] md:rounded-[4rem] translate-x-2 md:translate-x-2 translate-y-2 md:translate-y-3 -z-10"
                animate={{
                  borderColor: [
                    'rgba(24, 24, 27, 1)',
                    'rgba(39, 39, 42, 1)',
                    'rgba(24, 24, 27, 1)',
                  ],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: easeInOut,
                }}
              />

              <motion.div
                className="h-full w-full rounded-[3rem] md:rounded-[4rem] overflow-hidden bg-gradient-to-br from-zinc-700 via-zinc-800 to-zinc-900 shadow-[0_50px_100px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.15)] relative group border-2 border-white/20"
                animate={{
                  boxShadow: [
                    '0 50px 100px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.15)',
                    '0 50px 150px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.25)',
                    '0 50px 100px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.15)',
                  ],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: easeInOut,
                }}
              >
                <img
                  src="img/3.jpeg"
                  alt="dafin Portrait"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
                />
                {/* Gloss effect overlay - disabled */}
                {/* Top light reflection - disabled */}
              </motion.div>

              {/* POSITIONED PILL: Moved outside overflow-hidden to appear in front and overlap */}
              <motion.div
                initial={{ x: -30, opacity: 0 }}
                animate={{
                  x: 0,
                  opacity: 1,
                  y: [0, -8, 0],
                  boxShadow: [
                    '0 30px 60px rgba(31,38,135,0.37)',
                    '0 40px 80px rgba(31,38,135,0.5)',
                    '0 30px 60px rgba(31,38,135,0.37)',
                  ],
                }}
                transition={{
                  x: { delay: 1, duration: 0.8 },
                  opacity: { delay: 1, duration: 0.8 },
                  y: { duration: 4, repeat: Infinity, ease: easeInOut },
                  boxShadow: { duration: 4, repeat: Infinity, ease: easeInOut },
                }}
                className="absolute bottom-8 sm:bottom-12 left-[-1rem] sm:left-[-2.5rem] z-20 bg-white/10 backdrop-blur-3xl px-6 sm:px-8 py-3.5 sm:py-5 rounded-[2rem] sm:rounded-[2.5rem] shadow-[0_30px_60px_rgba(31,38,135,0.37)] border border-white/20 flex items-center gap-4 sm:gap-5 group/pill"
              >
                <div className="relative">
                  <motion.div
                    className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-white text-black shadow-xl shadow-white/20 transition-transform group-hover/pill:rotate-12 flex items-center justify-center"
                    animate={{
                      boxShadow: [
                        '0 10px 20px rgba(255,255,255,0.2)',
                        '0 20px 40px rgba(255,255,255,0.4)',
                        '0 10px 20px rgba(255,255,255,0.2)',
                      ],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: easeInOut,
                    }}
                  >
                    <Activity size={18} className="sm:size-7" />
                  </motion.div>
                  <motion.div
                    className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 rounded-full border-[2px] sm:border-[3px] border-zinc-900 animate-pulse"
                    animate={{
                      scale: [1, 1.3, 1],
                      boxShadow: [
                        '0 0 10px rgba(59, 130, 246, 0.5)',
                        '0 0 20px rgba(59, 130, 246, 0.8)',
                        '0 0 10px rgba(59, 130, 246, 0.5)',
                      ],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: easeInOut,
                    }}
                  />
                </div>
                <div>
                  <motion.p
                    className="text-[8px] sm:text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] leading-none mb-1 sm:mb-1.5"
                    animate={{
                      color: [
                        'rgba(161, 161, 170, 1)',
                        'rgba(200, 200, 200, 1)',
                        'rgba(161, 161, 170, 1)',
                      ],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  >
                    PROFESSIONAL FOCUS
                  </motion.p>
                  <p className="text-sm sm:text-lg font-bold tracking-tight text-white">
                    DATA & MEDIA
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default Home;
