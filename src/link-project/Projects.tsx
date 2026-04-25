import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { SKILLS_DATA } from '../data';
import SkillProjects from './components/SkillProjects';

interface ProjectsProps {
  showHeader?: boolean;
  activeSkillId?: string;
  onSkillChange?: (skillId: string) => void;
}

const Projects: React.FC<ProjectsProps> = ({
  showHeader = true,
  activeSkillId: propActiveSkillId,
  onSkillChange,
}) => {
  const { isDark } = useTheme();
  const [activeSkillId, setActiveSkillId] = useState(propActiveSkillId || SKILLS_DATA[0]?.id || '');

  // Use prop if provided, otherwise use local state
  const effectiveSkillId = propActiveSkillId !== undefined ? propActiveSkillId : activeSkillId;

  const handleSkillChange = (skillId: string) => {
    setActiveSkillId(skillId);
    onSkillChange?.(skillId);
  };

  const activeSkill = SKILLS_DATA.find((skill) => skill.id === effectiveSkillId);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`${showHeader ? 'min-h-screen pt-32 pb-16' : 'pb-0'} px-4 md:px-8 ${isDark ? 'bg-black' : 'bg-white'}`}
    >
      <div className={`${showHeader ? 'max-w-7xl mx-auto' : ''}`}>
        {/* Header Section - Only shown on dedicated page */}
        {showHeader && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mb-12 md:mb-16"
          >
            <motion.div variants={itemVariants}>
              <h1
                className={`text-4xl md:text-5xl lg:text-6xl font-display font-black mb-4 ${isDark ? 'text-white' : 'text-black'}`}
              >
                My Projects
              </h1>
            </motion.div>

            <motion.p
              variants={itemVariants}
              className={`text-lg md:text-xl ${isDark ? 'text-zinc-400' : 'text-zinc-600'} max-w-2xl`}
            >
              Explore my work organized by skills and expertise. Each project represents my
              dedication to quality, creativity, and professional excellence.
            </motion.p>
          </motion.div>
        )}

        {/* Active Skill Projects */}
        {activeSkill && <SkillProjects skill={activeSkill} />}

        {/* Empty State */}
        {!activeSkill && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`text-center py-12 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}
          >
            <p className="text-lg">Select a skill to view projects</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Projects;
