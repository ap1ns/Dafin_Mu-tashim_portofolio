
import React, { useState, useEffect, Suspense, lazy, useRef } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext';
import { EasterEggProvider } from './context/EasterEggContext';
import { AudioProvider } from './context/AudioContext';
import { ModalProvider } from './context/ModalContext';
import ViewportSection from './components/ViewportSection';
import MusicPlayer from './components/MusicPlayer';
import { AUDIO_TRACKS } from './audioTracks';
import './styles/expandable-cards.css';
import './styles/loading-screen.css';
import './styles/scroll-animations.css';
import initScrollReveal from './utils/scrollReveal';

// Pages - Lazy loaded for better performance
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Experience = lazy(() => import('./pages/Experience'));
const Skills = lazy(() => import('./pages/Skills'));
const GifSection = lazy(() => import('./pages/GifSection'));
const Contact = lazy(() => import('./pages/Contact'));

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';
import EasterEgg from './components/EasterEgg';

const PageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
);

// Fallback loading component for lazy-loaded pages
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      className="w-8 h-8 border-3 border-gray-200 dark:border-gray-700 border-t-blue-500 rounded-full"
    />
  </div>
);

const GlobalFallingStars: React.FC = () => {
  const stars = React.useMemo(
    () =>
      Array.from({ length: 16 }, (_, index) => ({
        id: index,
        left: Math.random() * 100,
        size: Math.random() * 2 + 2,
        duration: Math.random() * 5 + 6,
        delay: Math.random() * 4,
        opacity: Math.random() * 0.35 + 0.55,
      })),
    []
  );

  return (
    <div className="fixed inset-0 pointer-events-none -z-20 overflow-hidden">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full"
          style={{
            left: `${star.left}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            background: `rgba(255,255,255,${star.opacity})`,
            boxShadow: `0 0 ${star.size * 3}px rgba(255,255,255,${star.opacity})`,
            mixBlendMode: 'screen',
          }}
          initial={{ y: '-20vh', opacity: 0 }}
          animate={{ y: ['-20vh', '110vh'], opacity: [0.8, 0.9, 0] }}
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

const MainLayout = () => (
  <PageWrapper>
    <ViewportSection id="home" className="scroll-mt-20 reveal" rootMargin="800px" minHeight="100vh">
      <Suspense fallback={<PageLoader />}>
        <Home />
      </Suspense>
    </ViewportSection>
    <ViewportSection id="about" className="scroll-mt-20 reveal" rootMargin="800px" minHeight="100vh">
      <Suspense fallback={<PageLoader />}>
        <About />
      </Suspense>
    </ViewportSection>
    <ViewportSection id="experience" className="scroll-mt-20 reveal" rootMargin="800px" minHeight="100vh">
      <Suspense fallback={<PageLoader />}>
        <Experience />
      </Suspense>
    </ViewportSection>
    <ViewportSection id="skills" className="scroll-mt-20 reveal" rootMargin="800px" minHeight={0}>
      <Suspense fallback={<PageLoader />}>
        <Skills />
      </Suspense>
    </ViewportSection>
    <ViewportSection id="gif" className="scroll-mt-20 reveal" rootMargin="800px" minHeight={0}>
      <Suspense fallback={<PageLoader />}>
        <GifSection />
      </Suspense>
    </ViewportSection>
    <ViewportSection id="contact" className="scroll-mt-20 reveal" rootMargin="800px" minHeight={0}>
      <Suspense fallback={<PageLoader />}>
        <Contact />
      </Suspense>
    </ViewportSection>
  </PageWrapper>
);

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [isTrackListOpen, setIsTrackListOpen] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(() => {
    if (AUDIO_TRACKS.length === 0) return 0;
    return Math.floor(Math.random() * AUDIO_TRACKS.length);
  });
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playerBarRef = useRef<HTMLDivElement | null>(null);
  const trackListRef = useRef<HTMLDivElement | null>(null);
  const handleLoadingComplete = () => {
    setIsLoading(false);
    // Small delay to allow loading screen exit animation
    setTimeout(() => {
      setLoadingComplete(true);
    }, 800);
  };

  // Saat pertama kali masuk setelah loading selesai,
  // tunjukkan teks + tombol player sebentar dengan animasi lalu auto-hide
  useEffect(() => {
    if (!loadingComplete) return;

    // Tampilkan player detail sebentar saat awal di semua ukuran layar
    setIsPlayerOpen(true);
    const timer = setTimeout(() => {
      setIsPlayerOpen(false);
    }, 3500);

    return () => clearTimeout(timer);
  }, [loadingComplete]);

  useEffect(() => {
    if (!loadingComplete) return;

    const cleanup = initScrollReveal();
    return () => {
      if (typeof cleanup === 'function') cleanup();
    };
  }, [loadingComplete]);

  // Tutup detail player ketika user klik/tap di luar area player (semua layar)
  useEffect(() => {
    if (!isPlayerOpen) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node | null;
      if (!target) return;
      if (playerBarRef.current && !playerBarRef.current.contains(target)) {
        setIsPlayerOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isPlayerOpen]);

  // Sembunyikan player dan playlist ketika user melakukan scroll pada halaman (bukan dalam playlist)
  useEffect(() => {
    if (!isPlayerOpen && !isTrackListOpen) return;

    const hideOnScroll = (event: Event) => {
      // Jika scroll berasal dari dalam playlist (trackListRef), jangan tutup playlist
      if (isTrackListOpen && trackListRef.current && trackListRef.current.contains(event.target as Node)) {
        return;
      }

      // Jika scroll dari halaman web, tutup player dan playlist
      setIsPlayerOpen(false);
      setIsTrackListOpen(false);
    };

    window.addEventListener('scroll', hideOnScroll, { passive: true });
    window.addEventListener('wheel', hideOnScroll, { passive: true });
    window.addEventListener('touchmove', hideOnScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', hideOnScroll);
      window.removeEventListener('wheel', hideOnScroll);
      window.removeEventListener('touchmove', hideOnScroll);
    };
  }, [isPlayerOpen, isTrackListOpen]);

  // Tutup track list ketika user klik/tap di luar area track list
  useEffect(() => {
    if (!isTrackListOpen) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node | null;
      if (!target) return;
      if (trackListRef.current && !trackListRef.current.contains(target)) {
        setIsTrackListOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isTrackListOpen]);

  return (
    <ThemeProvider>
      <ModalProvider>
        <EasterEggProvider>
          <BrowserRouter>
            <AudioProvider audioRef={audioRef} isSoundEnabled={soundEnabled}>
              <div className="min-h-screen flex flex-col bg-black overflow-x-hidden selection:bg-white selection:text-black transition-colors duration-300 relative">
                {/* Loading Screen */}
                <LoadingScreen
                  duration={5000}
                  isLoading={isLoading}
                  onComplete={handleLoadingComplete}
                  onStart={() => {
                    setHasStarted(true);
                    setSoundEnabled(true);
                  }}
                  onStartWithoutMusic={() => {
                    setHasStarted(true);
                    setSoundEnabled(false);
                  }}
                  hasStarted={hasStarted}
                />

                {/* Creative Background Elements */}
                <GlobalFallingStars />
                <div className="fixed inset-0 -z-20 pointer-events-none overflow-hidden">
                  {/* Dark mode background only */}
                  <div className="absolute inset-0 bg-gradient-to-br from-black via-blue-950 to-purple-950" />

                  {/* Animated gradient orbs - Dark mode only */}
                  <div className="absolute -top-32 left-[5%] w-[500px] h-[500px] bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full blur-[80px] opacity-30 animate-pulse" />
                  <div className="absolute top-1/4 right-[2%] w-[450px] h-[450px] bg-gradient-to-r from-purple-600 to-pink-500 rounded-full blur-[90px] opacity-30 animate-pulse animation-delay-2000" />
                  <div className="absolute -bottom-32 left-1/3 w-[550px] h-[550px] bg-gradient-to-r from-cyan-600 to-blue-500 rounded-full blur-[100px] opacity-30 animate-pulse animation-delay-4000" />
                  <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] bg-gradient-to-r from-pink-600 to-rose-500 rounded-full blur-[80px] opacity-25 animate-pulse animation-delay-3000" />

                  {/* Grid pattern overlay */}
                  <div className="absolute inset-0 bg-grid-pattern dark:bg-grid-pattern-dark opacity-20" />

                  {/* Radial gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20" />

                  {/* Noise texture */}
                  <div className="absolute inset-0 opacity-[0.12] bg-noise" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' seed='2' /%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                  }} />
                </div>

                {/* Navbar with delayed entrance */}
                {loadingComplete && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Navbar />
                  </motion.div>
                )}

                {/* Main Content */}
                {loadingComplete && (
                  <motion.main
                    className="flex-grow relative z-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Routes>
                      <Route path="/" element={<MainLayout />} />
                    </Routes>
                  </motion.main>
                )}

                {/* Footer with delayed entrance */}
                {loadingComplete && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                  >
                    <Footer />
                  </motion.div>
                )}

                {/* Easter Egg Component */}
                <EasterEgg />

                <MusicPlayer
                  tracks={AUDIO_TRACKS}
                  currentTrackIndex={currentTrackIndex}
                  soundEnabled={soundEnabled}
                  isPlayerOpen={isPlayerOpen}
                  isTrackListOpen={isTrackListOpen}
                  setIsPlayerOpen={setIsPlayerOpen}
                  setIsTrackListOpen={setIsTrackListOpen}
                  setCurrentTrackIndex={setCurrentTrackIndex}
                  setSoundEnabled={setSoundEnabled}
                  audioRef={audioRef}
                  playerBarRef={playerBarRef}
                  trackListRef={trackListRef}
                />
              </div>
            </AudioProvider>
          </BrowserRouter>
        </EasterEggProvider>
      </ModalProvider>
    </ThemeProvider>
  );
};

export default App;
