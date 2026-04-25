import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { translations, TranslationKey } from '../translations';
import {
  DEFAULT_LOADING_DURATION,
  LOADING_COMPLETE_DELAY,
  PROGRESS_UPDATE_INTERVAL,
  START_BUTTON_DELAY,
  ANIMATION,
  SCALE,
  PROGRESS,
  EASING,
  HOVER,
  IMAGE_OFFSETS,
  OPACITY,
  ANIMATION_SPEED,
} from '../constants/loadingScreenConstants';
import { useLanguage } from '../context/LanguageContext';

interface LoadingScreenProps {
  duration?: number;
  onComplete?: () => void;
  isLoading?: boolean;
  backgroundUrl?: string; // Optional: GIF or video URL for background
  onStart?: () => void;
  onStartWithoutMusic?: () => void;
  hasStarted?: boolean;
}

// Simulate smooth loading progress that reaches 100%
const getSimulatedProgress = (elapsedTime: number, duration: number): number => {
  const ratio = Math.min(elapsedTime / duration, 1);
  const eased = 1 - Math.pow(1 - ratio, 3);
  return Math.min(eased * 100, 100);
};

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  duration = DEFAULT_LOADING_DURATION,
  onComplete,
  isLoading = true,
  backgroundUrl = 'https://i.pinimg.com/originals/84/f3/35/84f335961cb42e259a4acf945f57879a.gif',
  onStart,
  onStartWithoutMusic,
  hasStarted = false,
}) => {
  const [isVisible, setIsVisible] = useState(isLoading);
  const [progress, setProgress] = useState(0);
  const [showOptions, setShowOptions] = useState(false);
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);
  const [screenLang, setScreenLang] = useState<'en' | 'id'>('en'); // Always start English
  const { setLanguage } = useLanguage();

  // Local translation function that uses screenLang (not global language)
  const lt = (key: TranslationKey): string => {
    return translations[screenLang][key] || translations['en'][key] || key;
  };

  useEffect(() => {
    if (!isLoading) {
      setIsVisible(false);
      return;
    }

    // Before user clicks "Click to start", don't start loading/progress
    if (!hasStarted) {
      setIsVisible(true);
      setProgress(0);
      return;
    }

    const startTime = Date.now();

    const completeLoading = () => {
      setProgress(100);
      const finalTimer = setTimeout(() => {
        setIsVisible(false);
        if (onComplete) {
          onComplete();
        }
      }, LOADING_COMPLETE_DELAY);
      return () => clearTimeout(finalTimer);
    };

    // Ensure minimum duration
    const minDurationTimer = setTimeout(() => {
      completeLoading();
    }, duration);

    // Update progress bar smoothly
    const progressInterval = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      const simulatedProgress = getSimulatedProgress(elapsedTime, duration);
      setProgress(prevProgress => Math.max(prevProgress, simulatedProgress));
    }, PROGRESS_UPDATE_INTERVAL);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(minDurationTimer);
    };
  }, [duration, onComplete, isLoading, hasStarted]);

  const containerVariants: Variants = {
    visible: {
      opacity: 1,
      transition: { duration: ANIMATION.CONTAINER_FADE },
    },
    exit: {
      opacity: 0,
      transition: { duration: ANIMATION.CONTAINER_EXIT, ease: 'easeOut' },
    },
  };

  const textVariants: Variants = {
    hidden: { opacity: 0, y: 12 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: ANIMATION.TEXT_INITIAL_DELAY + i * ANIMATION.TEXT_DELAY_INCREMENT,
        duration: ANIMATION.TEXT_FADE_IN,
        ease: 'easeOut',
      },
    }),
  };

  const lineVariants: Variants = {
    hidden: { scaleX: 0, opacity: 0 },
    visible: {
      scaleX: 1,
      opacity: 1,
      transition: {
        delay: ANIMATION.LINE_DELAY,
        duration: ANIMATION.LINE_DURATION,
        ease: 'easeOut',
      },
    },
  };

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          variants={containerVariants}
          initial="visible"
          exit="exit"
          className="fixed inset-0 z-[9999] bg-white dark:bg-black overflow-hidden pointer-events-auto"
        >
          {/* Background - Media or Animated Orbs */}
          {backgroundUrl ? (
            // Background Media (GIF or Video)
            <div className="absolute inset-0 overflow-hidden">
              {backgroundUrl.toLowerCase().endsWith('.mp4') ||
                backgroundUrl.toLowerCase().endsWith('.webm') ? (
                <video
                  src={backgroundUrl}
                  className="w-full h-full object-cover scale-[1.5] md:scale-100"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              ) : (
                <img
                  src={backgroundUrl}
                  alt="Loading background"
                  className="w-full h-full object-cover scale-[1.5] md:scale-100"
                />
              )}
              {/* Overlay to dim the media */}
              <div className="absolute inset-0 bg-white/40 dark:bg-black/40" />
            </div>
          ) : (
            // Default Animated Background Orbs
            <div className="absolute inset-0 opacity-40 dark:opacity-20">
              <motion.div
                className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-blue-200 dark:bg-blue-600 blur-3xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [OPACITY.ORB_LIGHT, OPACITY.ORB_LIGHT_ANIMATED, OPACITY.ORB_LIGHT],
                }}
                transition={{
                  duration: ANIMATION_SPEED.ORB_BLUE_DURATION,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
              <motion.div
                className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-purple-200 dark:bg-purple-600 blur-3xl"
                animate={{
                  scale: [1.2, 1, 1.2],
                  opacity: [OPACITY.ORB_DARK, OPACITY.ORB_DARK_ANIMATED, OPACITY.ORB_DARK],
                }}
                transition={{
                  duration: ANIMATION_SPEED.ORB_PURPLE_DURATION,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </div>
          )}

          {/* Content */}
          <div className="relative z-10 h-full w-full flex flex-col items-center justify-center px-6 py-20">
            {/* Main Text Section */}
            <div className="text-center space-y-12 max-w-2xl">
              {/* Primary Text */}
              <div className="space-y-6">
                {(['loadingWelcome1', 'loadingWelcome2', 'loadingWelcome3'] as const).map((key, i) => (
                  <motion.div
                    key={i}
                    custom={i}
                    variants={textVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <AnimatePresence mode="wait">
                      <motion.p
                        key={`${key}-${screenLang}`}
                        initial={{ opacity: 0, y: 6, filter: 'blur(4px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, y: -6, filter: 'blur(4px)' }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className="text-4xl md:text-6xl lg:text-7xl font-Oswald tracking-tight text-black dark:text-white uppercase tracking-[0.1em]"
                      >
                        {lt(key)}
                      </motion.p>
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>

              {/* Subtle Divider Line */}
              <motion.div
                variants={lineVariants}
                initial="hidden"
                animate="visible"
                className="w-16 h-px bg-gradient-to-r from-transparent via-black dark:via-white to-transparent mx-auto"
              />

              {/* Secondary Text */}
              <motion.p
                custom={3}
                variants={textVariants}
                initial="hidden"
                animate="visible"
                className="text-sm md:text-base text-black/50 dark:text-white/50 font-light tracking-wide uppercase overflow-hidden"
              >
                <AnimatePresence mode="wait">
                  <motion.span
                    key={`subtitle-${screenLang}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="block"
                  >
                    {lt('loadingSubtitle')}
                  </motion.span>
                </AnimatePresence>
              </motion.p>

              {/* Start Button - always rendered to preserve layout, hidden via opacity when started */}
              {(onStart || onStartWithoutMusic) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: hasStarted ? 0 : 1, y: 0 }}
                  transition={{ delay: hasStarted ? 0 : START_BUTTON_DELAY, duration: 0.5 }}
                  className="mt-6 flex flex-col gap-3 justify-center items-center min-h-[130px]"
                  style={{ pointerEvents: hasStarted ? 'none' : 'auto' }}
                >
                  <AnimatePresence mode="wait">
                    {!showOptions ? (
                      <motion.div
                        key="start-button"
                        className="relative group cursor-pointer"
                        onClick={() => setShowOptions(true)}
                        initial={{ opacity: 0, scale: 0.9, filter: 'blur(8px)' }}
                        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                        exit={{
                          opacity: 0,
                          scale: 0.6,
                          filter: 'blur(12px)',
                          y: -10,
                          transition: {
                            duration: 0.4,
                            ease: [0.4, 0, 0.2, 1],
                          },
                        }}
                      >
                        {/* Button Container */}
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="relative px-8 py-3.5 bg-black dark:bg-white text-white dark:text-black rounded-full text-xs md:text-sm font-bold tracking-[0.2em] uppercase overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.3)] dark:shadow-[0_0_40px_rgba(255,255,255,0.3)] border border-white/10 dark:border-black/10 transition-all duration-300 group-hover:shadow-[0_0_60px_rgba(0,0,0,0.5)] dark:group-hover:shadow-[0_0_60px_rgba(255,255,255,0.5)]"
                        >
                          {/* Shimmer line */}
                          <motion.div
                            className="absolute top-0 left-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/30 dark:via-black/30 to-transparent -skew-x-12"
                            animate={{
                              x: ['-150%', '150%'],
                            }}
                            transition={{
                              duration: 2.5,
                              repeat: Infinity,
                              ease: "easeInOut",
                              repeatDelay: 0.5,
                            }}
                          />
                          <span className="relative z-10 flex items-center">
                            {lt('loadingStart')}
                            <motion.div
                              animate={{ x: [0, 5, 0] }}
                              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                            >
                            </motion.div>
                          </span>
                        </motion.button>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="language-selector"
                        initial={{ opacity: 0, scale: 0.5, filter: 'blur(16px)', y: 15 }}
                        animate={{
                          opacity: 1,
                          scale: 1,
                          filter: 'blur(0px)',
                          y: 0,
                          transition: {
                            duration: 0.5,
                            ease: [0.16, 1, 0.3, 1],
                            staggerChildren: 0.1,
                            delayChildren: 0.15,
                          },
                        }}
                        className="flex flex-col gap-6 justify-center items-center"
                      >
                        {/* Instruction Text */}
                        <motion.p
                          initial={{ opacity: 0, y: -12, filter: 'blur(6px)' }}
                          animate={{
                            opacity: 1,
                            y: 0,
                            filter: 'blur(0px)',
                            transition: { duration: 0.45, delay: 0.1, ease: [0.16, 1, 0.3, 1] },
                          }}
                          className="text-xs md:text-sm text-black/70 dark:text-white/70 font-light tracking-wide uppercase"
                        >
                          {lt('loadingSelectLang')}
                        </motion.p>

                        {/* Language Selection Container */}
                        <motion.div
                          className="flex gap-8 justify-center items-center mt-4"
                          initial={{ opacity: 0 }}
                          animate={{
                            opacity: 1,
                            transition: { duration: 0.3, delay: 0.2 },
                          }}
                        >
                          {/* English Option */}
                          <motion.button
                            type="button"
                            onClick={() => {
                              setLanguage('en');
                              if (onStartWithoutMusic) onStartWithoutMusic();
                            }}
                            whileHover={{ scale: 1.08, y: -3 }}
                            whileTap={{ scale: 0.92 }}
                            initial={{ opacity: 0, x: -30, scale: 0.5, filter: 'blur(10px)' }}
                            animate={{
                              opacity: 1,
                              x: 0,
                              scale: 1,
                              filter: 'blur(0px)',
                              transition: {
                                type: 'spring',
                                stiffness: 300,
                                damping: 24,
                                delay: 0.25,
                              },
                            }}
                            className="lang-btn lang-btn-en"
                          >
                            {/* Soft glow halo */}
                            <div className="lang-btn-glow" />

                            {/* SVG dashed spinning ring */}
                            <svg className="lang-btn-ring-svg" viewBox="0 0 70 70">
                              <circle cx="35" cy="35" r="30" />
                            </svg>

                            {/* Breathe border */}
                            <div className="lang-btn-breathe" />

                            {/* Glass inner circle */}
                            <div className="lang-btn-glass" />

                            {/* Text */}
                            <span className="lang-btn-text">EN</span>

                            {/* Label */}
                            <span className="lang-btn-label">English</span>
                          </motion.button>

                          {/* Vertical Divider */}
                          <motion.div
                            initial={{ opacity: 0, scaleY: 0 }}
                            animate={{
                              opacity: 1,
                              scaleY: 1,
                              transition: {
                                type: 'spring',
                                stiffness: 400,
                                damping: 20,
                                delay: 0.35,
                              },
                            }}
                            className="lang-divider"
                          />

                          {/* Indonesian Option */}
                          <motion.button
                            type="button"
                            onClick={() => {
                              setScreenLang('id');
                              setLanguage('id');
                              // Delay start so user sees the text transition to Indonesian
                              setTimeout(() => {
                                if (onStartWithoutMusic) onStartWithoutMusic();
                              }, 800);
                            }}
                            whileHover={{ scale: 1.08, y: -3 }}
                            whileTap={{ scale: 0.92 }}
                            initial={{ opacity: 0, x: 30, scale: 0.5, filter: 'blur(10px)' }}
                            animate={{
                              opacity: 1,
                              x: 0,
                              scale: 1,
                              filter: 'blur(0px)',
                              transition: {
                                type: 'spring',
                                stiffness: 300,
                                damping: 24,
                                delay: 0.35,
                              },
                            }}
                            className="lang-btn lang-btn-id"
                          >
                            {/* Soft glow halo */}
                            <div className="lang-btn-glow" />

                            {/* SVG dashed spinning ring */}
                            <svg className="lang-btn-ring-svg" viewBox="0 0 70 70">
                              <circle cx="35" cy="35" r="30" />
                            </svg>

                            {/* Breathe border */}
                            <div className="lang-btn-breathe" />

                            {/* Glass inner circle */}
                            <div className="lang-btn-glass" />

                            {/* Text */}
                            <span className="lang-btn-text">ID</span>

                            {/* Label */}
                            <span className="lang-btn-label">Indonesia</span>
                          </motion.button>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

            </div>

            {/* Progress Section - absolutely positioned so it doesn't shift text above */}
            {hasStarted && (
              <motion.div
                className="absolute left-1/2 -translate-x-1/2 w-full max-w-xs px-6"
                style={{ top: '75%' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                {/* Thin Progress Bar */}
                <div className="relative h-0.5 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="absolute top-0 left-0 h-full bg-black dark:bg-white"
                    style={{
                      width: `${progress}%`,
                      transition: `width ${ANIMATION.PROGRESS_BAR_TRANSITION}s cubic-bezier(${EASING.SMOOTH_PROGRESS.join(', ')})`,
                    }}
                  />
                </div>

                {/* Progress Indicator */}
                <motion.div
                  className="mt-6 text-center"
                  animate={{
                    opacity: progress < PROGRESS.SHOW_PERCENTAGE_THRESHOLD ? 1 : 0,
                  }}
                  transition={{ duration: ANIMATION.PROGRESS_OPACITY_TRANSITION }}
                >
                  <p className="text-xs font-medium text-black/30 dark:text-white/30 tracking-widest uppercase">
                    {Math.round(progress)} %
                  </p>
                </motion.div>
              </motion.div>
            )}

            {/* Bottom Indicator */}
            {hasStarted && (
              <motion.div
                className="absolute bottom-8 left-1/2 -translate-x-1/2"
                animate={{
                  opacity: [
                    OPACITY.BOTTOM_INDICATOR_MIN,
                    OPACITY.BOTTOM_INDICATOR_MAX,
                    OPACITY.BOTTOM_INDICATOR_MIN,
                  ],
                  y: [0, 8, 0],
                }}
                transition={{
                  duration: ANIMATION.BOTTOM_INDICATOR_DURATION,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <div className="flex gap-1 justify-center">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-1 h-1 rounded-full bg-black/40 dark:bg-white/40"
                      animate={{
                        scale: [SCALE.DOT_MIN, SCALE.DOT_MAX, SCALE.DOT_MIN],
                      }}
                      transition={{
                        duration: ANIMATION.DOT_ANIMATION_DURATION,
                        delay: i * ANIMATION.DOT_DELAY_INCREMENT,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
