
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink } from 'lucide-react';
import { Skill } from '../types';

interface ProjectModalProps {
  skill: Skill | null;
  onClose: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ skill, onClose }) => {
  if (!skill) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl p-6 md:p-10"
        >
          <motion.button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full hover:bg-zinc-100 transition-colors"
            whileHover={{ rotate: 90, scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <X size={24} />
          </motion.button>

          <motion.div 
            className="mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <motion.span 
              className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-widest bg-zinc-100 text-zinc-500 uppercase mb-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              Exploring
            </motion.span>
            <motion.h2 
              className="text-4xl md:text-5xl font-display mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {skill.name} Projects
            </motion.h2>
            <motion.div 
              className="w-20 h-1 bg-black rounded-full"
              initial={{ width: 0 }}
              animate={{ width: 80 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            />
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                  delayChildren: 0.4
                }
              }
            }}
            initial="hidden"
            animate="visible"
          >
            {skill.projects.map((project, idx) => (
              <motion.div
                key={project.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                whileHover={{ y: -10, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="group border border-zinc-100 rounded-2xl overflow-hidden bg-zinc-50/50 hover:bg-white hover:shadow-xl transition-all"
              >
                <motion.div 
                  className="aspect-video overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                >
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </motion.div>
                <motion.div 
                  className="p-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 + idx * 0.1 }}
                >
                  <motion.div className="flex items-center gap-4 mb-4">
                    {project.logo && (
                      <motion.span 
                        className="fi-container w-12 h-12 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all text-2xl"
                        dangerouslySetInnerHTML={{__html: project.logo}}
                        whileHover={{ rotate: 10, scale: 1.1 }}
                      >
                      </motion.span>
                    )}
                    <div className="flex-1 flex items-center justify-between">
                      <h3 className="text-xl font-bold flex-1">
                        {project.title}
                      </h3>
                      {project.link && (
                        <motion.a 
                          href={project.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            window.open(project.link, '_blank');
                          }}
                          className="hover:text-black transition-colors cursor-pointer ml-2"
                          whileHover={{ scale: 1.2, rotate: 10 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <ExternalLink size={18} className="text-zinc-400 hover:text-black" />
                        </motion.a>
                      )}
                    </div>
                  </motion.div>
                  <motion.p 
                    className="text-zinc-600 text-sm mb-4 leading-relaxed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 + idx * 0.1 }}
                  >
                    {project.description}
                  </motion.p>
                  <motion.div 
                    className="flex flex-wrap gap-2"
                    variants={{
                      hidden: { opacity: 0 },
                      visible: {
                        opacity: 1,
                        transition: {
                          staggerChildren: 0.05,
                          delayChildren: 0.7 + idx * 0.1
                        }
                      }
                    }}
                    initial="hidden"
                    animate="visible"
                  >
                    {project.tools.map((tool) => (
                      <motion.span
                        key={tool}
                        className="px-2 py-1 bg-white border border-zinc-200 rounded text-[10px] font-bold uppercase tracking-wider text-zinc-500"
                        variants={{
                          hidden: { opacity: 0, scale: 0.8 },
                          visible: { opacity: 1, scale: 1 }
                        }}
                        whileHover={{ scale: 1.1, backgroundColor: "#000", color: "#fff" }}
                      >
                        {tool}
                      </motion.span>
                    ))}
                  </motion.div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ProjectModal;
