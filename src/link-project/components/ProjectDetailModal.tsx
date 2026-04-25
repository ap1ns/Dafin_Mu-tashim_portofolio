import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Maximize2, Minimize2, Volume2, VolumeX, Play, Pause } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useModal } from '../../context/ModalContext';
import { useAudio } from '../../context/AudioContext';
import { Project } from '../../types';

interface ProjectDetailModalProps {
  project: Project;
  skillName: string;
  skillId: string;
  isOpen: boolean;
  onClose: () => void;
}

const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  skillName,
  skillId,
  isOpen,
  onClose,
}) => {
  const { isDark } = useTheme();
  const { setIsModalOpen } = useModal();
  const { pauseMusic, resumeMusic } = useAudio();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoCurrentTime, setVideoCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaWrapperRef = useRef<HTMLDivElement | null>(null);
  const wasMusicPausedRef = useRef(false);

  const hasVideo = !!project.videoUrl;

  const getYouTubeVideoId = (url: string | undefined): string | null => {
    if (!url) return null;
    const regexPatterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/watch\?v=([^&\n?#]+)/,
      /youtu\.be\/([^&\n?#]+)/,
    ];

    for (const pattern of regexPatterns) {
      const match = url.match(pattern);
      if (match && match[1]) return match[1];
    }
    return null;
  };

  const youtubeVideoId = getYouTubeVideoId(project.videoUrl);
  const isYouTube = Boolean(youtubeVideoId);
  const isLocalVideo = hasVideo && !isYouTube;

  const handleClose = async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    }
    onClose();
  };

  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => {
      document.removeEventListener('fullscreenchange', onFsChange);
    };
  }, []);

  useEffect(() => {
    setIsModalOpen(isOpen);
  }, [isOpen, setIsModalOpen]);

  // Audio management - only pause/resume on state transitions, not on every render
  useEffect(() => {
    if (isOpen && hasVideo && !wasMusicPausedRef.current) {
      console.log('📺 Modal OPENED + hasVideo, pausing music');
      pauseMusic();
      wasMusicPausedRef.current = true;
    } else if (!isOpen && hasVideo && wasMusicPausedRef.current) {
      console.log('📺 Modal CLOSED + hasVideo, resuming music');
      resumeMusic();
      wasMusicPausedRef.current = false;
    }
  }, [isOpen, hasVideo, pauseMusic, resumeMusic]);

  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = 'hidden';

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!videoRef.current) return;
    const video = videoRef.current;

    const handleLoaded = () => {
      setVideoDuration(video.duration || 0);
      setVideoCurrentTime(video.currentTime || 0);
    };

    const handleTimeUpdate = () => setVideoCurrentTime(video.currentTime || 0);
    const handlePlay = () => setIsVideoPlaying(true);
    const handlePause = () => setIsVideoPlaying(false);

    video.addEventListener('loadedmetadata', handleLoaded);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoaded);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, [isOpen, project.videoUrl]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused || videoRef.current.ended) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
  };

  const toggleVideoFullscreen = async () => {
    const target = mediaWrapperRef.current || videoRef.current;
    if (!target) return;

    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else {
      await (target as HTMLElement).requestFullscreen?.();
    }
  };

  useEffect(() => {
    const expandOnEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && document.fullscreenElement) {
        document.exitFullscreen();
      }
    };

    window.addEventListener('keydown', expandOnEsc);
    return () => window.removeEventListener('keydown', expandOnEsc);
  }, []);

  const handleSeek = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!videoRef.current || !videoDuration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    videoRef.current.currentTime = ratio * videoDuration;
  };

  const formatDuration = (value: number) => {
    const minutes = Math.floor(value / 60);
    const seconds = Math.floor(value % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const [isMobileLandscapeMode, setIsMobileLandscapeMode] = useState(false);

  useEffect(() => {
    const setLandscapeStyle = () => {
      // mobile in portrait: force landscape-esque container in detail view
      const isMobile = window.innerWidth <= 768;
      setIsMobileLandscapeMode(isMobile);
    };

    setLandscapeStyle();
    window.addEventListener('resize', setLandscapeStyle);
    return () => window.removeEventListener('resize', setLandscapeStyle);
  }, []);

  const modalWidth = isMobileLandscapeMode ? '95vw' : '90vw';
  const modalHeight = isMobileLandscapeMode ? '54vw' : '80vh';
  const modalStyle: React.CSSProperties = {
    width: modalWidth,
    height: modalHeight,
    maxWidth: '1400px',
    maxHeight: isMobileLandscapeMode ? '70vh' : '95vh',
    borderRadius: '1rem',
  };

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[110] bg-black/40 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed inset-0 z-[120] flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            onClick={handleClose}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className={`relative overflow-hidden border shadow-2xl ${isDark ? 'border-zinc-800' : 'border-zinc-200'}`}
              style={modalStyle}
            >
              <div ref={mediaWrapperRef} className="absolute inset-0 h-full w-full">
                {hasVideo ? (
                  isYouTube && youtubeVideoId ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=0&loop=1&playlist=${youtubeVideoId}`}
                      title={project.title}
                      className="h-full w-full object-cover"
                      frameBorder="0"
                      allow="autoplay; encrypted-media; fullscreen"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      ref={videoRef}
                      src={project.videoUrl}
                      className="h-full w-full object-cover"
                      autoPlay
                      loop
                      muted={isMuted}
                      playsInline
                    />
                  )
                ) : (
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {isFullscreen && (
                <button
                  onClick={toggleVideoFullscreen}
                  title="Exit Fullscreen"
                  className="absolute top-4 right-4 z-30 p-2 rounded-full bg-black/50 text-white hover:bg-black/80"
                >
                  <Minimize2 size={18} />
                </button>
              )}

              <div
                className={`absolute inset-0 z-20 flex flex-col justify-between p-4 md:p-6 text-white transition-opacity duration-200 ${isFullscreen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
              >
                <div className="bg-black/60 rounded-lg p-4 backdrop-blur-sm">
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-white/20 text-xs font-semibold">
                    {skillName}
                  </span>
                  <h2 className="text-xl md:text-3xl font-black mt-2">{project.title}</h2>
                  <p className="max-w-3xl text-sm md:text-base leading-relaxed mt-2">
                    {project.description}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {project.tools.map((tool, index) => (
                      <span
                        key={index}
                        className="px-2.5 py-1 rounded-full bg-white/20 text-xs font-semibold"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>

                  {isLocalVideo && (
                    <div
                      onClick={handleSeek}
                      className="h-2 cursor-pointer rounded-full bg-white/20"
                    >
                      <div
                        className="h-full rounded-full bg-cyan-500"
                        style={{
                          width: videoDuration
                            ? `${(videoCurrentTime / videoDuration) * 100}%`
                            : '0%',
                        }}
                      />
                    </div>
                  )}

                  {isLocalVideo && (
                    <div className="text-[11px] text-slate-200">
                      {formatDuration(videoCurrentTime)} / {formatDuration(videoDuration)}
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {isLocalVideo && (
                        <button
                          onClick={togglePlay}
                          className="p-2 rounded-full bg-white/20 hover:bg-white/30"
                        >
                          {isVideoPlaying ? <Pause size={14} /> : <Play size={14} />}
                        </button>
                      )}
                      {isLocalVideo && (
                        <button
                          onClick={() => setIsMuted((prev) => !prev)}
                          className="p-2 rounded-full bg-white/20 hover:bg-white/30"
                        >
                          {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                        </button>
                      )}
                      <button
                        onClick={toggleVideoFullscreen}
                        className="p-2 rounded-full bg-white/20 hover:bg-white/30"
                        title="Toggle Full Screen"
                      >
                        {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      {project.downloadUrl ? (
                        <a
                          href={project.downloadUrl}
                          download={project.downloadName || undefined}
                          className="px-3 py-2 rounded-lg bg-white/20 text-xs font-semibold hover:bg-white/30 flex items-center gap-1"
                        >
                          <ExternalLink size={14} />
                          Open
                        </a>
                      ) : project.link ? (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-2 rounded-lg bg-white/20 text-xs font-semibold hover:bg-white/30 flex items-center gap-1"
                        >
                          <ExternalLink size={14} />
                          Open
                        </a>
                      ) : null}
                      <button
                        onClick={handleClose}
                        className="p-2 rounded-full bg-white/20 hover:bg-white/30"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
};

export default ProjectDetailModal;
