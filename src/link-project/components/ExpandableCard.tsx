import React, { useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Project } from '../../types';
import { useScrollVisibility } from '../../hooks/useScrollAnimation';
import ProjectDetailModal from './ProjectDetailModal';

interface ExpandableCardProps {
  project: Project;
  skillColor: string;
  isDark: boolean;
  skillName?: string;
  isExpanded?: boolean;
  onExpand?: (projectId: string) => void;
  onCollapse?: () => void;
}

const ExpandableCard: React.FC<ExpandableCardProps> = ({
  project,
  skillColor,
  isDark,
  skillName = '',
  isExpanded: controlledExpanded = false,
  onExpand,
  onCollapse,
}) => {
  const [internalExpanded, setInternalExpanded] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const { ref, opacity } = useScrollVisibility();

  // Use controlled or internal state (still not used for full-screen detailed view)
  const isExpanded = onExpand ? controlledExpanded : internalExpanded;

  const openDetail = () => {
    console.log('View Details clicked!');
    setIsDetailOpen(true);
  };

  const closeDetail = () => {
    setIsDetailOpen(false);
  };

  const isVideo = !!project.videoUrl;

  // Extract YouTube video ID from various YouTube URL formats
  const getYouTubeVideoId = (url: string): string | null => {
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

  // Check if URL is a local/direct video file
  const isLocalVideoUrl = (url: string): boolean => {
    if (!url) return false;
    return (
      /\.(mp4|webm|ogg|mov|avi|mkv)$/i.test(url) ||
      url.includes('pixabay') ||
      url.includes('/video')
    );
  };

  // Extract TikTok video ID from various TikTok URL formats
  const getTikTokVideoId = (url: string): string | null => {
    if (!url) return null;
    const regexPatterns = [
      /(?:tiktok\.com\/@[\w.-]+\/video\/|vm\.tiktok\.com\/)(\d+)/,
      /(?:vt\.tiktok\.com\/)([a-zA-Z0-9]+)/,
      /tiktok\.com\/@[\w.-]+\/video\/(\d+)/,
    ];

    for (const pattern of regexPatterns) {
      const match = url.match(pattern);
      if (match && match[1]) return match[1];
    }
    return null;
  };

  // Extract Instagram post ID from Instagram URL formats
  const getInstagramPostId = (url: string): string | null => {
    if (!url) return null;
    const regexPatterns = [
      /(?:instagram\.com\/p\/|instagr\.am\/p\/)([a-zA-Z0-9_-]+)/,
      /instagram\.com\/reel\/([a-zA-Z0-9_-]+)/,
      /instagram\.com\/p\/([a-zA-Z0-9_-]+)/,
    ];

    for (const pattern of regexPatterns) {
      const match = url.match(pattern);
      if (match && match[1]) return match[1];
    }
    return null;
  };

  // Get aspect ratio values from string (e.g., "16:9" -> 16/9)
  const getAspectRatioValues = (aspectRatio: string): number => {
    const [width, height] = aspectRatio.split(':').map(Number);
    return width / height;
  };

  // Force all cards to a single, consistent 16:9 ratio
  const cardAspectRatio = '16:9';
  const cardAspectRatioValue = getAspectRatioValues(cardAspectRatio);
  const cardPaddingTop = `${100 / cardAspectRatioValue}%`;

  // Responsive card dimensions
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const compactWidth = isMobile ? 240 : 300;
  const expandedWidth = isMobile ? Math.min(window.innerWidth - 24, 360) : 600;

  const handleExpand = () => {
    openDetail();
  };

  const handleCollapse = () => {
    closeDetail();
  };

  return (
    <motion.div
      ref={ref}
      layout
      initial={false}
      animate={{ width: isExpanded ? expandedWidth : compactWidth }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`relative rounded-2xl overflow-hidden ${
        isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'
      } border shadow-lg hover:shadow-2xl transition-all duration-300`}
      style={{ opacity, transition: 'opacity 0.3s ease-out' }}
    >
      {/* Media Container - Always maintains aspect ratio, never zooms */}
      <motion.div
        layout
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full overflow-hidden bg-gradient-to-br from-zinc-800 to-black relative"
        style={{ paddingTop: cardPaddingTop, height: 0 }}
      >
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          {/* Image Media */}
          {!isVideo && (
            <img
              src={project.imageUrl}
              alt={project.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}

          {/* Video Media */}
          {isVideo && (
            <div className="absolute inset-0 w-full h-full relative">
              {getYouTubeVideoId(project.videoUrl!) && (
                <iframe
                  src={`https://www.youtube.com/embed/${getYouTubeVideoId(project.videoUrl!)}?rel=0&modestbranding=1&autoplay=1&mute=1&controls=0`}
                  className="w-full h-full pointer-events-none"
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={project.title}
                />
              )}
              {getTikTokVideoId(project.videoUrl!) && (
                <iframe
                  src={`https://www.tiktok.com/embed/v2/${getTikTokVideoId(project.videoUrl!)}`}
                  className="w-full h-full pointer-events-none"
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={project.title}
                />
              )}
              {getInstagramPostId(project.videoUrl!) && (
                <iframe
                  src={`https://www.instagram.com/p/${getInstagramPostId(project.videoUrl!)}/embed`}
                  className="w-full h-full pointer-events-none"
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={project.title}
                />
              )}
              {isLocalVideoUrl(project.videoUrl!) &&
                !getYouTubeVideoId(project.videoUrl!) &&
                !getTikTokVideoId(project.videoUrl!) &&
                !getInstagramPostId(project.videoUrl!) && (
                  <video
                    src={project.videoUrl}
                    className="w-full h-full object-cover pointer-events-none"
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                )}
            </div>
          )}

          {/* Expand Button - Only visible on hover on desktop, always visible on mobile */}
          <AnimatePresence>
            {!isExpanded && (
              <motion.div
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 0.5 }}
                whileHover={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 flex items-center justify-center cursor-pointer group pointer-events-none"
              >
                <div
                  className={`absolute inset-0 pointer-events-none ${isDark ? 'bg-black/20' : 'bg-black/10'}`}
                />
                <motion.button
                  onClick={handleExpand}
                  whileHover={{ scale: 1.08, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="relative z-10 px-6 py-3 rounded-xl font-bold text-base text-white bg-black/90 border border-white/20 shadow-xl transition-all duration-300 pointer-events-auto hover:bg-black"
                >
                  View Details
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Overlay for expanded state */}
          {isExpanded && (
            <div
              className={`absolute inset-0 ${
                isDark ? 'bg-black/30' : 'bg-black/20'
              } transition-colors duration-300`}
            />
          )}
        </div>
      </motion.div>

      {/* Full-screen detail overlay */}
      <ProjectDetailModal
        project={project}
        skillName={skillName}
        skillId={skillName.toLowerCase().replace(/\s+/g, '')}
        isOpen={isDetailOpen}
        onClose={handleCollapse}
      />
    </motion.div>
  );
};

export default ExpandableCard;
