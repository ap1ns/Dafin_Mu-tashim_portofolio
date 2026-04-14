import React, { useEffect } from 'react';
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

    const skipToPrevious = () => {
        if (tracks.length <= 1) return;
        setCurrentTrackIndex((prev) => (prev === 0 ? tracks.length - 1 : prev - 1));
    };

    const skipToNext = () => {
        if (tracks.length <= 1) return;
        setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
    };

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        audio.volume = 0.5;
        audio.load();

        if (!soundEnabled) {
            audio.pause();
            return;
        }

        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.catch(() => {
                // Autoplay may be blocked until user interaction
            });
        }
    }, [currentTrack.url, soundEnabled]);

    if (!currentTrack) return null;

    return (
        <>
            <motion.div
                initial={{ y: 80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="fixed bottom-4 left-4 z-40 pointer-events-none"
            >
                <motion.div
                    ref={playerBarRef}
                    onClick={() => setIsPlayerOpen((prev) => !prev)}
                    initial={false}
                    animate={{
                        padding: '8px 12px',
                        backgroundColor: isPlayerOpen ? 'rgba(255,255,255,0.12)' : 'transparent',
                        boxShadow: isPlayerOpen ? '0 18px 45px rgba(0,0,0,0.45)' : 'none',
                        borderRadius: isPlayerOpen ? 999 : 8,
                        borderWidth: isPlayerOpen ? 1 : 0,
                        borderColor: isPlayerOpen ? 'rgba(255,255,255,0.18)' : 'transparent',
                    }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    className="flex items-center gap-3 pointer-events-auto bg-white/10 border border-white/10 backdrop-blur-md rounded-3xl"
                >
                    {currentTrack.cover && (
                        <motion.img
                            src={currentTrack.cover}
                            alt={currentTrack.title}
                            className="w-10 h-10 rounded-full object-cover cursor-pointer"
                            initial={false}
                            style={{ transformOrigin: 'center center' }}
                        />
                    )}

                    <AnimatePresence>
                        {isPlayerOpen && (
                            <motion.div
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -8 }}
                                transition={{ duration: 0.35 }}
                                className="flex flex-col ml-1 md:ml-2 cursor-pointer"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsTrackListOpen(true);
                                }}
                            >
                                <span className="text-[10px] uppercase tracking-[0.18em] text-zinc-400">Now Playing</span>
                                <span className="text-sm font-semibold text-white leading-tight line-clamp-1 hover:text-zinc-200 transition-colors">
                                    {currentTrack.title}
                                    {currentTrack.artist && (
                                        <span className="text-[11px] font-normal text-zinc-400 ml-1">· {currentTrack.artist}</span>
                                    )}
                                </span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <AnimatePresence>
                        {isPlayerOpen && (
                            <motion.div
                                initial={{ opacity: 0, x: 8 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 8 }}
                                transition={{ duration: 0.35 }}
                                className="items-center gap-2 ml-2 flex"
                            >
                                <div className="flex items-center gap-1">
                                    <span className={`w-1.5 h-1.5 rounded-full ${soundEnabled ? 'bg-green-400 animate-pulse' : 'bg-zinc-500'}`} />
                                    <span className={`w-1.5 h-1.5 rounded-full ${soundEnabled ? 'bg-green-500/70 animate-pulse' : 'bg-zinc-600'}`} />
                                </div>
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
                                    className="px-2 py-1 rounded-full bg-white/10 hover:bg-white/20 text-[11px] text-zinc-200 font-medium uppercase tracking-wide transition-colors"
                                >
                                    {soundEnabled ? 'Mute' : 'Play'}
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

            <AnimatePresence>
                {isTrackListOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.3 }}
                        className="fixed bottom-20 left-4 z-50 pointer-events-none"
                    >
                        <motion.div
                            ref={trackListRef}
                            className="pointer-events-auto bg-gradient-to-b from-zinc-800/40 to-zinc-950/50 border border-white/10 rounded-3xl shadow-2xl max-h-[500px] overflow-y-auto w-72 md:w-96 backdrop-blur-2xl"
                            style={{
                                backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                                scrollbarWidth: 'none',
                                msOverflowStyle: 'none',
                            }}
                        >
                            {/* Hide scrollbar for webkit browsers */}
                            <style>{`
                                [data-scrollbar-hide]::-webkit-scrollbar {
                                    display: none;
                                }
                            `}</style>
                            <div
                                data-scrollbar-hide
                                className="sticky top-0 z-10 bg-gradient-to-b from-zinc-900/90 to-zinc-900/60 backdrop-blur-lg border-b border-white/10 px-6 py-5"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <h2 className="text-lg font-bold text-white tracking-tight">Playlist</h2>
                                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300">
                                        {tracks.length} songs
                                    </span>
                                </div>
                                <p className="text-xs text-zinc-400">Select a track to play</p>
                            </div>

                            <div className="divide-y divide-white/5">
                                {tracks.map((track, index) => (
                                    <motion.button
                                        key={index}
                                        onClick={() => {
                                            setCurrentTrackIndex(index);
                                        }}
                                        whileHover={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
                                        className={`w-full text-left px-5 py-4 transition-all duration-200 flex items-center gap-3 group ${currentTrackIndex === index
                                            ? 'bg-gradient-to-r from-blue-500/20 to-transparent border-l-2 border-blue-400'
                                            : 'hover:bg-white/5'
                                            }`}
                                    >
                                        {track.cover && (
                                            <img
                                                src={track.cover}
                                                alt={track.title}
                                                className="w-12 h-12 rounded-lg object-cover flex-shrink-0 shadow-md ring-1 ring-white/10"
                                            />
                                        )}
                                        <div className="min-w-0 flex-1">
                                            <p className={`text-sm font-semibold truncate ${currentTrackIndex === index ? 'text-blue-400' : 'text-white'} group-hover:text-blue-300 transition-colors`}>
                                                {track.title}
                                            </p>
                                            {track.artist && <p className="text-[11px] text-zinc-400 truncate">{track.artist}</p>}
                                        </div>
                                        {currentTrackIndex === index && (
                                            <div className="flex gap-1 flex-shrink-0">
                                                <motion.div
                                                    className="w-1.5 h-4 bg-gradient-to-t from-blue-400 to-blue-300 rounded-full"
                                                    animate={{ scaleY: [1, 1.2, 1] }}
                                                    transition={{ duration: 0.4, repeat: Infinity, delay: 0 }}
                                                />
                                                <motion.div
                                                    className="w-1.5 h-4 bg-gradient-to-t from-blue-400 to-blue-300 rounded-full"
                                                    animate={{ scaleY: [1, 1.2, 1] }}
                                                    transition={{ duration: 0.4, repeat: Infinity, delay: 0.1 }}
                                                />
                                                <motion.div
                                                    className="w-1.5 h-4 bg-gradient-to-t from-blue-400 to-blue-300 rounded-full"
                                                    animate={{ scaleY: [1, 1.2, 1] }}
                                                    transition={{ duration: 0.4, repeat: Infinity, delay: 0.2 }}
                                                />
                                            </div>
                                        )}
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            <audio ref={audioRef} src={currentTrack.url} preload="metadata" onEnded={skipToNext} />
        </>
    );
};

export default MusicPlayer;
