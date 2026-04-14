import React from 'react';

interface PageBackgroundProps {
  url?: string;
  fixed?: boolean;
  hideOnMobile?: boolean;
  blur?: boolean;
}

const PageBackground: React.FC<PageBackgroundProps> = ({ url, fixed = false, hideOnMobile = false, blur = false }) => {
  if (!url) return null;

  const isVideo = url.toLowerCase().endsWith('.mp4') ||
    url.toLowerCase().endsWith('.webm');

  return (
    <div className={`${hideOnMobile ? 'hidden md:block' : ''} ${fixed ? 'fixed' : 'absolute'} inset-0 -z-10 overflow-hidden pointer-events-none will-change-transform`} style={{ transform: 'translateZ(0)', contain: 'layout style paint' }}>
      {isVideo ? (
        <video
          src={url}
          className={`w-full h-full object-cover ${blur ? 'blur-xl' : ''}`}
          autoPlay
          muted
          loop
          playsInline
          style={{ backfaceVisibility: 'hidden', transform: 'translateZ(0)' }}
        />
      ) : (
        <img
          src={url}
          alt="Page background"
          className={`w-full h-full object-cover ${blur ? 'blur-xl' : ''}`}
          style={{ backfaceVisibility: 'hidden', transform: 'translateZ(0)' }}
          loading="lazy"
          decoding="async"
        />
      )}
      {/* Multi-layer overlay for better content readability and aesthetics */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-white/10 dark:from-transparent dark:via-black/40 dark:to-black/40" style={{ opacity: 0.4 }} />
      <div className="absolute inset-0 bg-white/5 dark:bg-black/40" style={{ opacity: 0.4 }} />
    </div>
  );
};

export default PageBackground;
