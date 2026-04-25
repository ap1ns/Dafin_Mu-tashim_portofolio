import React, { createContext, useContext, useRef } from 'react';

interface AudioContextType {
  audioRef: React.RefObject<HTMLAudioElement | null>;
  pauseMusic: () => void;
  resumeMusic: () => void;
  isSoundEnabled: boolean;
  openPlaylist?: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

interface AudioProviderProps {
  children: React.ReactNode;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  isSoundEnabled: boolean;
  openPlaylist?: () => void;
}

export const AudioProvider: React.FC<AudioProviderProps> = ({
  children,
  audioRef,
  isSoundEnabled,
  openPlaylist,
}) => {
  const previousVolumeRef = useRef<number>(0);

  const pauseMusic = () => {
    if (audioRef.current && isSoundEnabled) {
      previousVolumeRef.current = audioRef.current.volume;
      audioRef.current.pause();
    }
  };

  const resumeMusic = () => {
    if (audioRef.current && isSoundEnabled) {
      audioRef.current.volume = previousVolumeRef.current;
      audioRef.current.play().catch(() => {
        // Ignore autoplay errors
      });
    }
  };

  return (
    <AudioContext.Provider
      value={{ audioRef, pauseMusic, resumeMusic, isSoundEnabled, openPlaylist }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
