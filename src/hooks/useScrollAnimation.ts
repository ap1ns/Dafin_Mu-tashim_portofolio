import { useEffect, useRef, useState } from 'react';

// Global scroll state
let globalScrollY = 0;
let globalScrollDirection: 'up' | 'down' = 'down';
const scrollListeners = new Set<() => void>();

// Setup global scroll listener
const setupGlobalScrollListener = () => {
  if (typeof window === 'undefined') return;

  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    globalScrollDirection = currentScrollY > globalScrollY ? 'down' : 'up';
    globalScrollY = currentScrollY;

    // Notify all listeners
    scrollListeners.forEach((listener) => listener());
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  return () => window.removeEventListener('scroll', handleScroll);
};

// Setup once
if (typeof window !== 'undefined') {
  setupGlobalScrollListener();
}

/**
 * Hook untuk smooth opacity berdasarkan scroll position
 * Opacity berubah perlahan tergantung posisi scroll
 */
export const useScrollVisibility = () => {
  const [opacity, setOpacity] = useState(1);
  const [isInitialized, setIsInitialized] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    setIsInitialized(true);

    const listener = () => {
      if (!elementRef.current) return;

      const element = elementRef.current;
      const rect = element.getBoundingClientRect();
      const elementTop = rect.top;
      const elementBottom = rect.bottom;
      const windowHeight = window.innerHeight;

      // Calculate how much of the element is visible
      const visibleTop = Math.max(0, -elementTop);
      const visibleBottom = Math.min(windowHeight, elementBottom);
      const visibleHeight = Math.max(0, visibleBottom - visibleTop);
      const elementHeight = rect.height;

      // Calculate visibility ratio (0 to 1)
      const visibilityRatio = visibleHeight / elementHeight;

      // Smooth opacity based on visibility and scroll direction
      let newOpacity = visibilityRatio;

      // Add scroll direction influence for smoother transitions
      if (globalScrollDirection === 'up') {
        // When scrolling up, make it slightly more visible
        newOpacity = Math.min(1, newOpacity + 0.2);
      } else {
        // When scrolling down, make it slightly less visible
        newOpacity = Math.max(0, newOpacity - 0.1);
      }

      // Clamp between 0 and 1
      newOpacity = Math.max(0, Math.min(1, newOpacity));

      setOpacity(newOpacity);
      lastScrollYRef.current = globalScrollY;
    };

    scrollListeners.add(listener);

    // Initial calculation
    listener();

    return () => {
      scrollListeners.delete(listener);
    };
  }, []);

  return {
    ref: elementRef,
    opacity,
    isInitialized,
    style: {
      opacity: opacity,
      transition: 'opacity 0.3s ease-out',
    },
  };
};

// Extend window interface for AOS
declare global {
  interface Window {
    AOS: any;
  }
}
