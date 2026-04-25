import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Project } from '../../types';
import { useScrollVisibility } from '../../hooks/useScrollAnimation';

interface ProjectCardProps {
  project: Project;
  skillColor: string;
  isDark: boolean;
  onViewDetails?: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  skillColor,
  isDark,
  onViewDetails,
}) => {
  const [isCardHovered, setIsCardHovered] = useState(false);
  const { ref, opacity } = useScrollVisibility();

  return (
    <motion.div
      ref={ref}
      onMouseEnter={() => setIsCardHovered(true)}
      onMouseLeave={() => setIsCardHovered(false)}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative rounded-xl md:rounded-2xl overflow-hidden ${isDark ? 'bg-zinc-900' : 'bg-zinc-50'} border ${isDark ? 'border-zinc-800' : 'border-zinc-200'} transition-all duration-300 hover:border-zinc-500`}
      style={{ opacity, transition: 'opacity 0.3s ease-out' }}
    >
      {/* Image Container */}
      <div
        className="group relative overflow-hidden bg-gradient-to-br from-zinc-800 to-black"
        style={{ paddingTop: '56.25%', height: 0 }}
      >
        <img
          src={project.imageUrl}
          alt={project.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Overlay */}
        <div className={`absolute inset-0 ${isDark ? 'bg-black/20' : 'bg-black/10'}`} />

        {/* Skill Badge */}
        <div
          className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold text-black ${skillColor}`}
        >
          Featured
        </div>

        {/* Click to View Indicator */}
        <motion.button
          onClick={onViewDetails}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isCardHovered ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 flex items-center justify-center cursor-pointer"
          style={{ pointerEvents: isCardHovered ? 'auto' : 'none' }}
        >
          <div
            className={`px-4 py-2 rounded-lg font-bold text-sm shadow-lg ${isDark ? 'bg-white text-black' : 'bg-black text-white'}`}
          >
            View Details
          </div>
        </motion.button>
      </div>

      {/* Content */}
      <div className="p-5 md:p-6">
        <h3
          className={`text-lg md:text-xl font-bold mb-2 line-clamp-2 ${isDark ? 'text-white' : 'text-black'}`}
        >
          {project.title}
        </h3>

        <p
          className={`text-sm md:text-base mb-4 line-clamp-2 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}
        >
          {project.description}
        </p>

        {/* Tools Tags */}
        <div className="flex flex-wrap gap-2">
          {project.tools.slice(0, 2).map((tool, index) => (
            <span
              key={index}
              className={`inline-block px-2.5 py-1 rounded-md text-xs font-semibold ${isDark ? 'bg-zinc-800 text-zinc-300' : 'bg-zinc-200 text-zinc-700'}`}
            >
              {tool}
            </span>
          ))}
          {project.tools.length > 2 && (
            <span
              className={`inline-block px-2.5 py-1 rounded-md text-xs font-semibold ${isDark ? 'bg-zinc-800 text-zinc-300' : 'bg-zinc-200 text-zinc-700'}`}
            >
              +{project.tools.length - 2}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
