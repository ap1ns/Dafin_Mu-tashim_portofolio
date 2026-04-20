import React, { useEffect, useState, useRef, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { AudioTrack } from '../audioTracks';

interface MusicPlayerProps {
  tracks: AudioTrack[];
  currentTrackIndex: number;
  soundEnabled: boolean;
  setSoundEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  isPlayerOpen: boolean;
  isTrackListOpen: boolean;
  setIsPlayerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsTrackListOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentTrackIndex: React.Dispatch<React.SetStateAction<number>>;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  playerBarRef: React.RefObject<HTMLDivElement | null>;
  trackListRef: React.RefObject<HTMLDivElement | null>;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({
  tracks,
  currentTrackIndex,
  soundEnabled,
  setSoundEnabled,
  isPlayerOpen,
  isTrackListOpen,
  setIsPlayerOpen,
  setIsTrackListOpen,
  setCurrentTrackIndex,
  audioRef,
  playerBarRef,
  trackListRef,
}) => {
  const currentTrack = tracks[currentTrackIndex];
  const [volume, setVolume] = useState(0.5);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showBriefly, setShowBriefly] = useState(false);
  const [hasStartedPlaying, setHasStartedPlaying] = useState(false);
  const currentTimeRef = useRef(0);
  const seekInputRef = useRef<HTMLInputElement>(null);
  const timeDisplayRef = useRef<HTMLSpanElement>(null);

  // Format time in MM:SS format
  const formatTime = (time: number): string => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const toggleSound = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (soundEnabled) {
      audio.pause();
      setSoundEnabled(false);
      return;
    }

    setSoundEnabled(true);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.volume = volume;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(false);

    const audio = audioRef.current;
    if (audio) {
      audio.volume = newVolume;
    }
  };

  const updateTimeDOM = useCallback((time: number, dur?: number) => {
    const d = dur || audioRef.current?.duration || 100;
    if (timeDisplayRef.current) {
      timeDisplayRef.current.textContent = formatTime(time);
    }
    if (seekInputRef.current) {
      seekInputRef.current.value = String(time);
      const pct = (time / d) * 100;
      seekInputRef.current.style.background = `linear-gradient(to right, #22c55e 0%, #22c55e ${pct}%, rgba(255,255,255,0.2) ${pct}%, rgba(255,255,255,0.2) 100%)`;
    }
  }, []);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTime = parseFloat(e.target.value);
    currentTimeRef.current = seekTime;

    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = seekTime;
    }
    updateTimeDOM(seekTime);
  };

  const skipToPrevious = () => {
    if (tracks.length <= 1) return;
    setCurrentTrackIndex((prev) => (prev === 0 ? tracks.length - 1 : prev - 1));
  };

  const skipToNext = () => {
    if (tracks.length <= 1) return;
    setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
  };

  // Prevent scroll propagation from playlist
  const handlePlaylistWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const canScrollDown = element.scrollHeight - element.scrollTop - element.clientHeight > 1;
    const canScrollUp = element.scrollTop > 0;

    // Allow scroll propagation only when reaching the end/start
    if ((e.deltaY > 0 && !canScrollDown) || (e.deltaY < 0 && !canScrollUp)) {
      return;
    }
    e.stopPropagation();
  };

  const handlePlaylistTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    element.dataset.touchStartY = e.touches[0].clientY.toString();
    element.dataset.scrollTop = element.scrollTop.toString();
  };

  const handlePlaylistTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const touchStartY = parseFloat(element.dataset.touchStartY || '0');
    const scrollTop = parseFloat(element.dataset.scrollTop || '0');
    const touchCurrentY = e.touches[0].clientY;
    const deltaY = touchStartY - touchCurrentY;

    const canScrollDown = element.scrollHeight - element.scrollTop - element.clientHeight > 1;
    const canScrollUp = element.scrollTop > 0;

    // Allow propagation only at boundaries
    if ((deltaY > 0 && !canScrollDown) || (deltaY < 0 && !canScrollUp)) {
      return;
    }
    e.stopPropagation();
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Load new track only when the URL changes
    if (audio.src !== currentTrack.url) {
      audio.src = currentTrack.url;
      audio.load();
    }

    // Audio event listeners
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      // Auto-play if sound is enabled
      if (soundEnabled) {
        audio.play().catch(() => {
          // Autoplay may be blocked until user interaction
        });
      }
    };

    const handleTimeUpdate = () => {
      currentTimeRef.current = audio.currentTime;
      updateTimeDOM(audio.currentTime, audio.duration);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [currentTrack.url]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Set volume
    audio.volume = isMuted ? 0 : volume;

    // Play/pause based on soundEnabled
    if (!soundEnabled) {
      audio.pause();
    } else {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay may be blocked until user interaction
        });
      }
    }
  }, [soundEnabled, isMuted, volume]);

  useEffect(() => {
    // Briefly show title when track changes
    setShowBriefly(true);

    const timer = setTimeout(() => {
      setShowBriefly(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, [currentTrackIndex]);

  // Handle mobile hardware back button when playlist is open
  useEffect(() => {
    if (!isTrackListOpen) return;

    // Push a fake history entry so back button doesn't leave the page
    window.history.pushState({ playlistOpen: true }, '');

    const handlePopState = () => {
      setIsTrackListOpen(false);
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
    };
  }, [isTrackListOpen]);

  // Track if music has ever been played so mini-player stays visible
  useEffect(() => {
    if (soundEnabled) {
      setHasStartedPlaying(true);
    }
  }, [soundEnabled]);

  // Briefly expand mini-player when playlist closes
  const prevTrackListOpenRef = useRef(isTrackListOpen);
  useEffect(() => {
    if (prevTrackListOpenRef.current === true && isTrackListOpen === false) {
      setShowBriefly(true);
      const timer = setTimeout(() => {
        setShowBriefly(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
    prevTrackListOpenRef.current = isTrackListOpen;
  }, [isTrackListOpen]);

  const isExpanded = (isPlayerOpen || showBriefly) && !isTrackListOpen;

  if (!currentTrack) return null;

  return (
    <>
      <style>{`
                .slider::-webkit-slider-thumb {
                    appearance: none;
                    height: 12px;
                    width: 12px;
                    border-radius: 50%;
                    background: #22c55e;
                    cursor: pointer;
                    border: 2px solid white;
                    box-shadow: 0 0 0 1px rgba(34, 197, 94, 0.3);
                }
                .slider::-moz-range-thumb {
                    height: 12px;
                    width: 12px;
                    border-radius: 50%;
                    background: #22c55e;
                    cursor: pointer;
                    border: 2px solid white;
                    box-shadow: 0 0 0 1px rgba(34, 197, 94, 0.3);
                }
            `}</style>
      <AnimatePresence>
      {hasStartedPlaying && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-4 left-4 z-40 pointer-events-none"
        >
          <motion.div
            ref={playerBarRef}
            onClick={() => setIsPlayerOpen((prev) => !prev)}
            layout
            initial={false}
            animate={{
              backgroundColor: isExpanded
                ? 'rgba(255, 255, 255, 0.1)'
                : 'rgba(255, 255, 255, 0)',
              borderColor: isExpanded
                ? 'rgba(255, 255, 255, 0.2)'
                : 'rgba(255, 255, 255, 0)',
              padding: isExpanded ? 12 : 8,
              boxShadow: isExpanded
                ? '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -4px rgba(0, 0, 0, 0.2)'
                : '0 0 0 0 rgba(0, 0, 0, 0)',
            }}
            transition={{
              layout: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
              backgroundColor: { duration: 0.35 },
              borderColor: { duration: 0.35 },
              padding: { duration: 0.35 },
              boxShadow: { duration: 0.35 },
            }}
            className="flex items-center gap-3 pointer-events-auto backdrop-blur-md rounded-full border cursor-pointer"
          >
            {currentTrack.cover && (
              <motion.img
                layout
                src={currentTrack.cover}
                alt={currentTrack.title}
                className="w-10 h-10 rounded-full object-cover cursor-pointer"
                initial={false}
                transition={{ layout: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] } }}
                style={{ transformOrigin: 'center center' }}
              />
            )}

            <AnimatePresence mode="wait">
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, width: 0, x: -12 }}
                  animate={{ opacity: 1, width: 'auto', x: 0 }}
                  exit={{ opacity: 0, width: 0, x: -12 }}
                  transition={{
                    opacity: { duration: 0.25, ease: 'easeOut' },
                    width: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] },
                    x: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] },
                  }}
                  className="flex flex-col ml-1 md:ml-2 cursor-pointer max-w-xs overflow-hidden"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsTrackListOpen(true);
                  }}
                >
                  <span className="text-[10px] uppercase tracking-[0.18em] text-zinc-400 whitespace-nowrap">
                    Now Playing
                  </span>
                  <span className="text-sm font-semibold text-white leading-tight truncate hover:text-zinc-200 transition-colors max-w-[120px] md:max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">
                    {currentTrack.title}
                    {currentTrack.artist && (
                      <span className="text-[11px] font-normal text-zinc-400 ml-1">
                        · {currentTrack.artist}
                      </span>
                    )}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, width: 0, scale: 0.8 }}
                  animate={{ opacity: 1, width: 'auto', scale: 1 }}
                  exit={{ opacity: 0, width: 0, scale: 0.8 }}
                  transition={{
                    opacity: { duration: 0.2, ease: 'easeOut' },
                    width: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] },
                    scale: { duration: 0.25, ease: [0.25, 0.1, 0.25, 1] },
                  }}
                  className="items-center gap-2 ml-2 flex overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      skipToPrevious();
                    }}
                    className="px-2 py-1 rounded-full bg-white/10 hover:bg-white/20 text-[11px] text-zinc-200 font-medium uppercase tracking-wide transition-colors"
                    title="Previous track"
                  >
                    ⏮
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSound();
                    }}
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center justify-center"
                    title={soundEnabled ? 'Pause' : 'Play'}
                  >
                    {soundEnabled ? (
                      /* Ikon Pause */
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                      </svg>
                    ) : (
                      /* Ikon Play */
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      skipToNext();
                    }}
                    className="px-2 py-1 rounded-full bg-white/10 hover:bg-white/20 text-[11px] text-zinc-200 font-medium uppercase tracking-wide transition-colors"
                    title="Next track"
                  >
                    ⏭
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>

      <AnimatePresence>
        {isTrackListOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsTrackListOpen(false)}
            className="fixed inset-0 z-[100] bg-transparent flex items-center justify-center"
          >
            <motion.div
              ref={trackListRef}
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-[96vw] max-h-[92vh] bg-gradient-to-br from-zinc-950 via-zinc-900 to-black rounded-xl shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Header Section with Album Art */}
              <div className="relative h-72 sm:h-80 md:h-96 bg-gradient-to-b from-zinc-800 to-zinc-900 p-5 sm:p-7 flex flex-row flex-wrap items-center justify-start gap-3 sm:gap-5 md:gap-8">
                {/* Close Button - Now inside header */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsTrackListOpen(false);
                  }}
                  onTouchEnd={(e) => {
                    // Prevent default to avoid ghost clicks on some mobile browsers
                    e.preventDefault();
                    e.stopPropagation();
                    setIsTrackListOpen(false);
                  }}
                  aria-label="Close playlist"
                  className="absolute top-3 right-3 sm:top-5 sm:right-5 z-[50] p-3 rounded-full bg-black/20 hover:bg-black/40 active:bg-black/60 backdrop-blur-md active:scale-90 transition-all duration-200 text-white flex items-center justify-center cursor-pointer min-w-[44px] min-h-[44px]"
                  style={{ touchAction: 'manipulation' }}
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {/* Background Gradient Effect */}
                <div className="absolute inset-0 opacity-30">
                  {currentTrack.cover && (
                    <img
                      src={currentTrack.cover}
                      alt={currentTrack.title}
                      className="w-full h-full object-cover filter blur-3xl"
                    />
                  )}
                </div>

                {/* Album Cover */}
                <div className="relative z-10 flex-shrink-0">
                  {currentTrack.cover && (
                    <motion.img
                      src={currentTrack.cover}
                      alt={currentTrack.title}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.4 }}
                      className="w-32 h-32 sm:w-40 sm:h-40 md:w-52 md:h-52 rounded-xl object-cover shadow-2xl ring-2 ring-white/20"
                    />
                  )}
                </div>

                {/* Track Info */}
                <div className="relative z-10 flex-1 pb-2 text-left md:pl-2">
                  <p className="text-xs sm:text-sm font-semibold text-zinc-300 uppercase tracking-widest mb-1">
                    Now Playing
                  </p>
                  <h1 className="text-xl sm:text-2xl md:text-5xl font-bold text-white mb-2 leading-tight">
                    {currentTrack.title}
                  </h1>
                  {currentTrack.artist && (
                    <p className="text-sm sm:text-base text-zinc-300 mb-2">{currentTrack.artist}</p>
                  )}
                  <p className="text-xs sm:text-sm text-zinc-400">
                    {tracks.length} songs in playlist
                  </p>
                </div>
              </div>

              {/* Playlist Table */}
              <div
                className="flex-1 overflow-y-auto px-8 py-6"
                onWheel={handlePlaylistWheel}
                onTouchStart={handlePlaylistTouchStart}
                onTouchMove={handlePlaylistTouchMove}
              >
                <div className="mb-4">
                  <h2 className="text-lg font-bold text-white mb-4">Playlist</h2>
                </div>

                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 mb-2 px-4 py-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider border-b border-white/10">
                  <div className="col-span-1">#</div>
                  <div className="col-span-6">Title</div>
                  <div className="col-span-5">Artist</div>
                </div>

                {/* Song Rows */}
                <div className="space-y-1">
                  {tracks.map((track, index) => (
                    <motion.button
                      key={index}
                      onClick={() => {
                        setCurrentTrackIndex(index);
                        setSoundEnabled(true); // Auto-play when clicking a track
                      }}
                      whileHover={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
                      animate={{
                        backgroundColor:
                          currentTrackIndex === index
                            ? 'rgba(34, 197, 94, 0.2)' // green-500/20
                            : 'transparent',
                      }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                      className={`w-full relative grid grid-cols-12 gap-4 px-4 py-3 rounded-lg transition-all duration-200 group ${currentTrackIndex === index
                        ? 'hover:bg-green-500/30 shadow-lg shadow-green-500/10'
                        : 'hover:bg-white/5'
                        }`}
                    >
                      <div
                        className={`col-span-1 font-medium ${currentTrackIndex === index ? 'text-green-400' : 'text-zinc-400'}`}
                      >
                        {index + 1}
                      </div>
                      <div
                        className={`col-span-6 text-left font-medium ${currentTrackIndex === index ? 'text-white' : 'text-zinc-100'} group-hover:text-white truncate`}
                      >
                        {track.title}
                      </div>
                      <div
                        className={`col-span-5 text-left flex items-center justify-between ${currentTrackIndex === index ? 'text-green-300' : 'text-zinc-400'}`}
                      >
                        <span className="truncate">{track.artist || 'Unknown Artist'}</span>
                        {currentTrackIndex === index && (
                          <div className="flex gap-1 flex-shrink-0 ml-2">
                            <motion.div
                              className="w-1 h-3 bg-green-400 rounded-full"
                              animate={{ scaleY: [1, 1.3, 1] }}
                              transition={{ duration: 0.4, repeat: Infinity, delay: 0 }}
                            />
                            <motion.div
                              className="w-1 h-3 bg-green-400 rounded-full"
                              animate={{ scaleY: [1, 1.3, 1] }}
                              transition={{ duration: 0.4, repeat: Infinity, delay: 0.1 }}
                            />
                            <motion.div
                              className="w-1 h-3 bg-green-400 rounded-full"
                              animate={{ scaleY: [1, 1.3, 1] }}
                              transition={{ duration: 0.4, repeat: Infinity, delay: 0.2 }}
                            />
                          </div>
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Music Controls */}
              <div className="border-t border-white/10 px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 bg-gradient-to-r from-zinc-900/50 to-zinc-800/50 backdrop-blur-sm">
                {/* Current Track Info + Volume - Mobile only above seek bar */}
                <div className="flex items-center justify-between md:hidden mb-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {currentTrack.cover && (
                      <img
                        src={currentTrack.cover}
                        alt={currentTrack.title}
                        className="w-12 h-12 rounded-lg object-cover flex-shrink-0 shadow-md"
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-white truncate">
                        {currentTrack.title}
                      </p>
                      {currentTrack.artist && (
                        <p className="text-xs text-zinc-400 truncate">{currentTrack.artist}</p>
                      )}
                    </div>
                  </div>
                  {/* Volume Control */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={toggleMute}
                      className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                      title={isMuted ? 'Unmute' : 'Mute'}
                    >
                      {isMuted || volume === 0 ? (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v1.79l2.48 2.25.02-.01zm-6.5 0c0 .83.42 1.58 1.05 2.05L9.43 14.6 16.5 8v.39c1.48.73 2.5 2.25 2.5 4.03 0 1.52-.76 2.86-1.92 3.71l1.5 1.5C19.63 16.05 21 14.2 21 12c0-3.17-2.11-5.85-5-6.71V3.23c4.01.91 7 4.49 7 8.77 0 4.28-2.99 7.86-7 8.77v-2.06c2.89-.86 5-3.54 5-6.71z" />
                        </svg>
                      )}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="w-16 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                      style={{
                        background: `linear-gradient(to right, #22c55e 0%, #22c55e ${((isMuted ? 0 : volume) / 1) * 100}%, rgba(255,255,255,0.2) ${((isMuted ? 0 : volume) / 1) * 100}%, rgba(255,255,255,0.2) 100%)`,
                      }}
                    />
                  </div>
                </div>

                {/* Seek Bar */}
                <div className="mb-3 sm:mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span ref={timeDisplayRef} className="text-xs text-zinc-400">{formatTime(currentTimeRef.current)}</span>
                    <span className="text-xs text-zinc-400">{formatTime(duration)}</span>
                  </div>
                  <input
                    ref={seekInputRef}
                    type="range"
                    min="0"
                    max={duration || 100}
                    defaultValue={currentTimeRef.current}
                    onChange={handleSeek}
                    className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, #22c55e 0%, #22c55e ${(currentTimeRef.current / (duration || 100)) * 100}%, rgba(255,255,255,0.2) ${(currentTimeRef.current / (duration || 100)) * 100}%, rgba(255,255,255,0.2) 100%)`,
                    }}
                  />
                </div>

                {/* Control Buttons - Mobile only below seek bar */}
                <div className="flex items-center justify-center gap-4 sm:gap-6 md:hidden mb-4">
                  <button
                    onClick={skipToPrevious}
                    className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                    title="Previous track"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
                    </svg>
                  </button>

                  <button
                    onClick={toggleSound}
                    className="p-4 rounded-full bg-green-500 hover:bg-green-600 text-white transition-colors shadow-lg"
                    title={soundEnabled ? 'Pause' : 'Play'}
                  >
                    {soundEnabled ? (
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                      </svg>
                    ) : (
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    )}
                  </button>

                  <button
                    onClick={skipToNext}
                    className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                    title="Next track"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
                    </svg>
                  </button>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
                  {/* Current Track Info - Desktop only */}
                  <div className="hidden md:flex items-center gap-3 md:gap-4 flex-1 min-w-0 order-1 md:order-1">
                    {currentTrack.cover && (
                      <img
                        src={currentTrack.cover}
                        alt={currentTrack.title}
                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg object-cover flex-shrink-0 shadow-md"
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-white truncate">
                        {currentTrack.title}
                      </p>
                      {currentTrack.artist && (
                        <p className="text-xs text-zinc-400 truncate">{currentTrack.artist}</p>
                      )}
                    </div>
                  </div>

                  {/* Control Buttons */}
                  <div className="hidden md:flex items-center gap-2 sm:gap-3 md:gap-4 order-2 md:order-2">
                    <button
                      onClick={skipToPrevious}
                      className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                      title="Previous track"
                    >
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
                      </svg>
                    </button>

                    <button
                      onClick={toggleSound}
                      className="p-2 sm:p-3 rounded-full bg-green-500 hover:bg-green-600 text-white transition-colors shadow-lg"
                      title={soundEnabled ? 'Pause' : 'Play'}
                    >
                      {soundEnabled ? (
                        <svg
                          className="w-5 h-5 sm:w-6 sm:h-6"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                        </svg>
                      ) : (
                        <svg
                          className="w-5 h-5 sm:w-6 sm:h-6"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      )}
                    </button>

                    <button
                      onClick={skipToNext}
                      className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                      title="Next track"
                    >
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
                      </svg>
                    </button>
                  </div>

                  {/* Volume Control - Desktop */}
                  <div className="hidden md:flex items-center gap-2 flex-1 justify-end order-3 md:order-3">
                    <button
                      onClick={toggleMute}
                      className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                      title={isMuted ? 'Unmute' : 'Mute'}
                    >
                      {isMuted || volume === 0 ? (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v1.79l2.48 2.25.02-.01zm-6.5 0c0 .83.42 1.58 1.05 2.05L9.43 14.6 16.5 8v.39c1.48.73 2.5 2.25 2.5 4.03 0 1.52-.76 2.86-1.92 3.71l1.5 1.5C19.63 16.05 21 14.2 21 12c0-3.17-2.11-5.85-5-6.71V3.23c4.01.91 7 4.49 7 8.77 0 4.28-2.99 7.86-7 8.77v-2.06c2.89-.86 5-3.54 5-6.71z" />
                        </svg>
                      )}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="w-16 sm:w-20 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                      style={{
                        background: `linear-gradient(to right, #22c55e 0%, #22c55e ${((isMuted ? 0 : volume) / 1) * 100}%, rgba(255,255,255,0.2) ${((isMuted ? 0 : volume) / 1) * 100}%, rgba(255,255,255,0.2) 100%)`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <audio ref={audioRef} src={currentTrack.url} preload="metadata" onEnded={skipToNext} />
    </>
  );
};

export default React.memo(MusicPlayer);
