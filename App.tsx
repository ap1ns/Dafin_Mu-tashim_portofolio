import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
  Suspense,
  lazy,
  useRef,
} from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext';
import { EasterEggProvider } from './context/EasterEggContext';
import { AudioProvider } from './context/AudioContext';
import { ModalProvider } from './context/ModalContext';
import { LanguageProvider } from './context/LanguageContext';
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



const MainLayout = () => (
  <PageWrapper>
    <ViewportSection id="home" className="scroll-mt-20 reveal" rootMargin="800px" minHeight="100vh">
      <Suspense fallback={<PageLoader />}>
        <Home />
      </Suspense>
    </ViewportSection>
    <ViewportSection
      id="about"
      className="scroll-mt-20 reveal"
      rootMargin="800px"
      minHeight="100vh"
    >
      <Suspense fallback={<PageLoader />}>
        <About />
      </Suspense>
    </ViewportSection>
    <ViewportSection
      id="experience"
      className="scroll-mt-20 reveal"
      rootMargin="800px"
      minHeight="100vh"
    >
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

interface AppContentProps {
  loadingComplete: boolean;
  openPlaylist: () => void;
}

const AppContent: React.FC<AppContentProps> = React.memo(({ loadingComplete, openPlaylist }) => {
  return (
    <>
      {loadingComplete && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <Navbar onOpenPlaylist={openPlaylist} />
        </motion.div>
      )}
      {loadingComplete && (
        <motion.main
          className="flex-grow relative z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <MainLayout />
        </motion.main>
      )}
      {loadingComplete && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        >
          <Footer />
        </motion.div>
      )}
    </>
  );
});

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [isTrackListOpen, setIsTrackListOpen] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playerBarRef = useRef<HTMLDivElement | null>(null);
  const trackListRef = useRef<HTMLDivElement | null>(null);
  const loadingCompleteTimeoutRef = useRef<number | null>(null);
  const openPlaylistTimeoutRef = useRef<number | null>(null);

  const handleLoadingComplete = () => {
    setIsLoading(false);

    if (loadingCompleteTimeoutRef.current) {
      window.clearTimeout(loadingCompleteTimeoutRef.current);
    }

    loadingCompleteTimeoutRef.current = window.setTimeout(() => {
      setLoadingComplete(true);
    }, 800);
  };

  useEffect(() => {
    if (!loadingComplete) return;

    const cleanup = initScrollReveal();
    return () => {
      if (typeof cleanup === 'function') cleanup();
    };
  }, [loadingComplete]);

  useEffect(() => {
    if (!isPlayerOpen && !isTrackListOpen) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node | null;
      if (!target) return;

      const clickedPlayerBar = playerBarRef.current?.contains(target);
      const clickedTrackList = trackListRef.current?.contains(target);

      if (!clickedPlayerBar && !clickedTrackList) {
        setIsPlayerOpen(false);
        setIsTrackListOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isPlayerOpen, isTrackListOpen]);

  // Prevent body scroll when playlist is open
  useEffect(() => {
    if (isTrackListOpen) {
      // Prevent scrolling
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = '0px'; // Prevent layout shift
    } else {
      // Restore scrolling
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [isTrackListOpen]);

  const openPlaylist = useCallback(() => {
    setIsPlayerOpen(false); // Make sure mini player is collapsed when playlist is open
    setIsTrackListOpen(true);

    if (openPlaylistTimeoutRef.current) {
      window.clearTimeout(openPlaylistTimeoutRef.current);
    }

    openPlaylistTimeoutRef.current = window.setTimeout(() => {
      trackListRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 50);
  }, []);

  // Listen untuk custom event dari Navbar untuk membuka playlist
  useLayoutEffect(() => {
    const anyWindow = window as any;
    anyWindow.openPlaylist = openPlaylist;

    window.addEventListener('openPlaylist', openPlaylist as EventListener);
    window.addEventListener('openMusicPlayer', openPlaylist as EventListener);
    return () => {
      delete anyWindow.openPlaylist;
      window.removeEventListener('openPlaylist', openPlaylist as EventListener);
      window.removeEventListener('openMusicPlayer', openPlaylist as EventListener);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (loadingCompleteTimeoutRef.current) {
        window.clearTimeout(loadingCompleteTimeoutRef.current);
      }
      if (openPlaylistTimeoutRef.current) {
        window.clearTimeout(openPlaylistTimeoutRef.current);
      }
    };
  }, []);



  return (
    <ThemeProvider>
      <ModalProvider>
        <LanguageProvider>
          <EasterEggProvider>
            <BrowserRouter>
            <AudioProvider
              audioRef={audioRef}
              isSoundEnabled={soundEnabled}
              openPlaylist={openPlaylist}
            >
              <div className="min-h-screen flex flex-col bg-black overflow-x-hidden selection:bg-white selection:text-black transition-colors duration-300 relative">
                {/* Loading Screen */}
                <LoadingScreen
                  duration={5000}
                  isLoading={isLoading}
                  onComplete={handleLoadingComplete}
                  onStart={() => {
                    setHasStarted(true);
                    setSoundEnabled(true);
                    if (AUDIO_TRACKS.length > 0) {
                      setCurrentTrackIndex(Math.floor(Math.random() * AUDIO_TRACKS.length));
                    }
                  }}
                  onStartWithoutMusic={() => {
                    setHasStarted(true);
                    setSoundEnabled(false);
                  }}
                  hasStarted={hasStarted}
                />



                <AppContent loadingComplete={loadingComplete} openPlaylist={openPlaylist} />

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
        </LanguageProvider>
      </ModalProvider>
    </ThemeProvider>
  );
};

export default App;
