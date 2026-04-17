import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';

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
  // Smooth curve that reaches 100% at the end of duration
  const ratio = Math.min(elapsedTime / duration, 1);
  // Easing function for smooth progress
  const eased = 1 - Math.pow(1 - ratio, 3);
  return Math.min(eased * 100, 100);
};

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  duration = 3500,
  onComplete,
  isLoading = true,
  backgroundUrl = 'https://i.pinimg.com/originals/d0/62/a0/d062a054db706da542a505e96bd851b8.gif', // Default: empty string (use default bg)
  onStart,
  onStartWithoutMusic,
  hasStarted = false
}) => {
  const [isVisible, setIsVisible] = useState(isLoading);
  const [progress, setProgress] = useState(0);
  const [showOptions, setShowOptions] = useState(false);
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading) {
      setIsVisible(false);
      return;
    }

    // Sebelum user klik "Click to start", jangan mulai proses loading / progress
    if (!hasStarted) {
      setIsVisible(true);
      setProgress(0);
      return;
    }

    let minDurationMet = false;
    let windowLoaded = false;
    const startTime = Date.now();

    const completeLoading = () => {
      setProgress(100);
      const finalTimer = setTimeout(() => {
        setIsVisible(false);
        if (onComplete) {
          onComplete();
        }
      }, 500);
      return () => clearTimeout(finalTimer);
    };

    // Ensure minimum duration
    const minDurationTimer = setTimeout(() => {
      minDurationMet = true;
      // If window already loaded, complete immediately
      if (windowLoaded) {
        completeLoading();
      }
    }, duration);

    // Track when window fully loads
    const handleWindowLoad = () => {
      windowLoaded = true;
      // Only complete if minimum duration is already met
      if (minDurationMet) {
        completeLoading();
      }
    };

    // Update progress bar smoothly
    const progressInterval = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      const simulatedProgress = getSimulatedProgress(elapsedTime, duration);
      setProgress(simulatedProgress);
    }, 50);

    // Listen for actual window load event
    if (document.readyState === 'complete') {
      windowLoaded = true;
      // Don't complete yet, wait for minimum duration
    } else {
      window.addEventListener('load', handleWindowLoad);
    }

    return () => {
      clearInterval(progressInterval);
      clearTimeout(minDurationTimer);
      window.removeEventListener('load', handleWindowLoad);
    };
  }, [duration, onComplete, isLoading, hasStarted]);

  const containerVariants: Variants = {
    visible: {
      opacity: 1,
      transition: { duration: 0.4 }
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  const textVariants: Variants = {
    hidden: { opacity: 0, y: 12 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.2 + i * 0.15,
        duration: 0.7,
        ease: "easeOut"
      }
    })
  };

  const lineVariants: Variants = {
    hidden: { scaleX: 0, opacity: 0 },
    visible: {
      scaleX: 1,
      opacity: 1,
      transition: {
        delay: 0.8,
        duration: 0.8,
        ease: "easeOut"
      }
    }
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
                  className="w-full h-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              ) : (
                <img
                  src={backgroundUrl}
                  alt="Loading background"
                  className="w-full h-full object-cover"
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
                  opacity: [0.1, 0.15, 0.1]
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              />
              <motion.div
                className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-purple-200 dark:bg-purple-600 blur-3xl"
                animate={{
                  scale: [1.2, 1, 1.2],
                  opacity: [0.1, 0.15, 0.1]
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: 'easeInOut'
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
                {['Welcome', 'to my', 'portfolio'].map((text, i) => (
                  <motion.div
                    key={i}
                    custom={i}
                    variants={textVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <p className="text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-black dark:text-white uppercase">
                      {text}
                    </p>
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
                className="text-sm md:text-base text-black/50 dark:text-white/50 font-light tracking-wide uppercase"
              >
                Crafting digital experiences with code and creativity
              </motion.p>

              {/* Start Button */}
              {(onStart || onStartWithoutMusic) && !hasStarted && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5, duration: 0.5 }}
                  className="mt-6 flex flex-col gap-3 justify-center items-center"
                >
                  {!showOptions ? (
                    <motion.button
                      type="button"
                      onClick={() => setShowOptions(true)}
                      whileTap={{ scale: 0.92 }}
                      whileHover={{ scale: 1.05 }}
                      className="px-6 py-3 rounded-full bg-black text-white dark:bg-white dark:text-black text-xs md:text-sm font-semibold tracking-wide uppercase shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Open to Start
                    </motion.button>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-col gap-6 justify-center items-center"
                    >
                      {/* Instruction Text */}
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xs md:text-sm text-black/70 dark:text-white/70 font-light tracking-wide uppercase"
                      >
                        Choose your preference:
                      </motion.p>

                      {/* Icons Container */}
                      <div className="flex gap-8 justify-center items-end">
                        {/* With Music Icon */}
                        {onStart && (
                          <motion.div
                            className="flex flex-col items-center gap-2 cursor-pointer"
                            onClick={onStart}
                            onHoverStart={() => setHoveredIcon('withMusic')}
                            onHoverEnd={() => setHoveredIcon(null)}
                            whileHover={{ y: -5 }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                          >
                            <motion.div
                              className="p-3 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-all duration-300"
                              whileHover={{ scale: 1.1 }}
                            >
                              <img
                                src="/img/unmute.svg"
                                alt="With Music"
                                className="w-12 h-12"
                              />
                            </motion.div>
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: hoveredIcon === 'withMusic' ? 1 : 0 }}
                              transition={{ duration: 0.2 }}
                              className="text-xs font-semibold text-black dark:text-white text-center"
                            >
                              With Music
                            </motion.div>
                          </motion.div>
                        )}

                        {/* Without Music Icon */}
                        {onStartWithoutMusic && (
                          <motion.div
                            className="flex flex-col items-center gap-2 cursor-pointer"
                            onClick={onStartWithoutMusic}
                            onHoverStart={() => setHoveredIcon('withoutMusic')}
                            onHoverEnd={() => setHoveredIcon(null)}
                            whileHover={{ y: -5 }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                          >
                            <motion.div
                              className="p-3 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-all duration-300"
                              whileHover={{ scale: 1.1 }}
                            >
                              <img
                                src="/img/mute.svg"
                                alt="Without Music"
                                className="w-12 h-12"
                              />
                            </motion.div>
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: hoveredIcon === 'withoutMusic' ? 1 : 0 }}
                              transition={{ duration: 0.2 }}
                              className="text-xs font-semibold text-black dark:text-white text-center"
                            >
                              Without Music
                            </motion.div>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* Progress Section - hanya muncul setelah user klik "Click to start" */}
              {hasStarted && (
                <motion.div
                  className="mt-16 w-full max-w-xs mx-auto"
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
                        transition: 'width 0.08s cubic-bezier(0.22, 1, 0.36, 1)'
                      }}
                    />
                  </div>

                  {/* Progress Indicator */}
                  <motion.div
                    className="mt-6 text-center"
                    animate={{
                      opacity: progress < 98 ? 1 : 0
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="text-xs font-medium text-black/30 dark:text-white/30 tracking-widest uppercase">
                      {Math.round(progress)} %
                    </p>
                  </motion.div>
                </motion.div>
              )}
            </div>

            {/* Bottom Indicator */}
            {hasStarted && (
              <motion.div
                className="absolute bottom-8 left-1/2 -translate-x-1/2"
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                  y: [0, 8, 0]
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              >
                <div className="flex gap-1 justify-center">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-1 h-1 rounded-full bg-black/40 dark:bg-white/40"
                      animate={{
                        scale: [1, 1.4, 1]
                      }}
                      transition={{
                        duration: 1.8,
                        delay: i * 0.25,
                        repeat: Infinity,
                        ease: 'easeInOut'
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
