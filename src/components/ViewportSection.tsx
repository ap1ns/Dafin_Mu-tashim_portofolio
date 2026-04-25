import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ViewportSectionProps {
  children: React.ReactNode;
  rootMargin?: string;
  once?: boolean;
  minHeight?: string | number;
  className?: string;
  id?: string;
}

const ViewportSection: React.FC<ViewportSectionProps> = ({
  children,
  rootMargin = '0px 0px -40% 0px',
  once = false,
  minHeight = '100vh',
  className = '',
  id,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.85, 1], [1, 1, 1, 0.9]);

  useEffect(() => {
    const node = containerRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const currentlyVisible = entry.isIntersecting || entry.intersectionRatio > 0;
        setIsVisible(currentlyVisible);
        if (currentlyVisible && once) {
          observer.disconnect();
        }
      },
      {
        rootMargin,
        threshold: 0.15,
      }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [once, rootMargin]);

  return (
    <motion.div
      ref={containerRef}
      id={id}
      className={className}
      style={{ minHeight, position: 'relative' }}
    >
      <motion.div
        className={isVisible ? 'viewport-visible' : 'viewport-hidden'}
        style={{ minHeight: '100%', width: '100%', y, opacity, scale: 0.995 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

export default ViewportSection;
