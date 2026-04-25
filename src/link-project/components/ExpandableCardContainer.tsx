import React, { useState, useRef, useEffect } from 'react';
import { motion, Variants } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useScrollVisibility } from '../../hooks/useScrollAnimation';
import { Skill } from '../../types';
import ExpandableCard from './ExpandableCard';

interface ExpandableCardContainerProps {
  skill: Skill;
}

const ExpandableCardContainer: React.FC<ExpandableCardContainerProps> = ({ skill }) => {
  const { isDark } = useTheme();
  const { opacity } = useScrollVisibility();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef({ x: 0, scrollLeft: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null);
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const animationRefRef = useRef<number | null>(null);
  const lastScrollLeftRef = useRef(0);

  const hasMultipleProjects = skill.projects.length > 1;

  const handlePause = () => {
    isScrollingRef.current = true;
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = setTimeout(() => {
      isScrollingRef.current = false;
    }, 2000);
  };

  // Mouse drag for horizontal scroll
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    handlePause();
    dragStartRef.current = {
      x: e.clientX,
      scrollLeft: scrollContainerRef.current.scrollLeft,
    };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !scrollContainerRef.current) return;
    const walk = (e.clientX - dragStartRef.current.x) * 1;
    scrollContainerRef.current.scrollLeft = dragStartRef.current.scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    handlePause();
  };

  // Smooth auto-scroll for multiple projects
  useEffect(() => {
    if (!hasMultipleProjects || !scrollContainerRef.current || expandedProjectId) return;

    const el = scrollContainerRef.current;
    const scrollSpeed = 0.5;

    const handleScroll = () => {
      const currentScroll = el.scrollLeft;
      const expectedScroll = lastScrollLeftRef.current + scrollSpeed;

      if (Math.abs(currentScroll - expectedScroll) > 1) {
        isScrollingRef.current = true;
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
        scrollTimeoutRef.current = setTimeout(() => {
          isScrollingRef.current = false;
        }, 2000);
      }
    };

    const performScroll = () => {
      if (el && !isScrollingRef.current && !expandedProjectId) {
        el.scrollLeft += scrollSpeed;
        lastScrollLeftRef.current = el.scrollLeft;

        const maxScroll = el.scrollWidth - el.clientWidth;
        if (el.scrollLeft >= maxScroll) {
          el.scrollLeft = 0;
          lastScrollLeftRef.current = 0;
        }
      }
      animationRefRef.current = requestAnimationFrame(performScroll);
    };

    el.addEventListener('scroll', handleScroll);
    animationRefRef.current = requestAnimationFrame(performScroll);

    return () => {
      if (animationRefRef.current) {
        cancelAnimationFrame(animationRefRef.current);
      }
      el.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [skill.id, hasMultipleProjects, expandedProjectId]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  return (
    <motion.div
      key={skill.id}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`mb-16 transition-opacity duration-300`}
      style={{ opacity, transition: 'opacity 0.3s ease-out' }}
    >
      {/* Section Title */}
      <motion.h2
        variants={itemVariants}
        className={`text-2xl md:text-3xl lg:text-4xl font-bold mb-6 md:mb-8 px-2 md:px-0 ${
          isDark ? 'text-white' : 'text-black'
        }`}
      >
        {skill.name} Projects
      </motion.h2>

      {/* Multiple Projects - Horizontal Scroll Gallery */}
      {hasMultipleProjects && (
        <div
          ref={scrollContainerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={isDragging ? handleMouseUp : undefined}
          className="overflow-x-auto flex gap-4 md:gap-8 pb-4 px-2 md:px-0 cursor-grab active:cursor-grabbing select-none scrollbar-hide scroll-gallery -mx-2 md:mx-0"
          style={{
            scrollBehavior: 'smooth',
            WebkitOverflowScrolling: 'touch',
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
          }}
        >
          {skill.projects.map((project) => (
            <motion.div
              key={project.id}
              variants={itemVariants}
              className="flex-shrink-0"
              draggable={false}
            >
              <ExpandableCard
                project={project}
                skillColor={skill.color}
                isDark={isDark}
                skillName={skill.name}
                isExpanded={expandedProjectId === project.id}
                onExpand={() => setExpandedProjectId(project.id)}
                onCollapse={() => setExpandedProjectId(null)}
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* Single Project - Centered Grid Layout */}
      {!hasMultipleProjects && (
        <div className="flex justify-center px-2 md:px-0">
          {skill.projects.map((project) => (
            <motion.div key={project.id} variants={itemVariants}>
              <ExpandableCard
                project={project}
                skillColor={skill.color}
                isDark={isDark}
                skillName={skill.name}
                isExpanded={expandedProjectId === project.id}
                onExpand={() => setExpandedProjectId(project.id)}
                onCollapse={() => setExpandedProjectId(null)}
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* Scroll Indicator for Multiple Projects */}
      {hasMultipleProjects && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className={`mt-4 md:mt-6 px-2 md:px-0 text-center text-xs font-semibold uppercase tracking-widest ${
            isDark ? 'text-zinc-500' : 'text-zinc-400'
          }`}
        >
          Drag to explore or scroll
        </motion.div>
      )}
    </motion.div>
  );
};

export default ExpandableCardContainer;
