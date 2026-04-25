import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';
import { GraduationCap, Award, BookOpen } from 'lucide-react';
import SplitText from '../components/SplitText';
import { useTheme } from '../context/ThemeContext';
import { useScrollVisibility } from '../hooks/useScrollAnimation';
import { EDUCATION_DATA } from '../data';
import PageBackground from '../components/PageBackground';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { PAGE_BACKGROUNDS } from '../config/pageBackgrounds';


const About: React.FC = () => {
  const { t } = useLanguage();
  const { isDark } = useTheme();
  const { opacity } = useScrollVisibility();
  const backgroundUrl = isDark ? PAGE_BACKGROUNDS.about.dark : PAGE_BACKGROUNDS.about.light;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const aboutCardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.96 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.65, ease: 'easeOut' as any },
    },
  };

  return (
    <div
      className={`relative bg-black py-32 px-6 min-h-screen transition-opacity duration-300`}
      style={{ opacity, transition: 'opacity 0.3s ease-out' }}
    >
      <PageBackground url={backgroundUrl} />

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-blue-600/10 blur-3xl"
          animate={{
            y: [0, 40, 0],
            x: [0, 30, 0],
            rotate: [0, 120, 240, 360],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-purple-600/8 blur-3xl"
          animate={{
            y: [0, -50, 0],
            x: [0, -40, 0],
            rotate: [360, 240, 120, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-32"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: '-100px' }}
        >
          <motion.div className="flex flex-col justify-center">
            <motion.span
              variants={itemVariants}
              className="text-xs font-bold tracking-[0.3em] text-zinc-400 dark:text-zinc-500 uppercase mb-4 block"
            >
              {t('aboutTitle')}
            </motion.span>
            <motion.h1
              variants={itemVariants}
              className="text-6xl md:text-8xl font-display mb-8 text-white"
            >
              <SplitText
                text={t('aboutTitle2')}
                splitBy="word"
                stagger={0.07}
                delay={0.15}
                duration={0.7}
                margin="-60px"
              />
            </motion.h1>
            <motion.div
              variants={containerVariants}
              className="space-y-6 text-zinc-400 leading-relaxed text-lg"
            >
              <motion.p variants={itemVariants}>
                {t('aboutDesc2')}
              </motion.p>
            </motion.div>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 gap-4 auto-rows-max"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false }}
          >
            <motion.div
              variants={aboutCardVariants}
              className="bg-zinc-800 dark:bg-zinc-800 rounded-[2rem] lg:aspect-square h-32 lg:h-auto overflow-hidden relative group"
              whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
            >
              <img
                src="https://i.pinimg.com/originals/73/63/3f/73633fbb5a6fb64fa41ae315ba897d97.gif"
                alt="gif about"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </motion.div>
            <motion.div
              variants={aboutCardVariants}
              className="bg-black dark:bg-white text-white dark:text-black rounded-[2rem] p-6 md:p-8 lg:aspect-square h-32 lg:h-auto flex flex-col justify-end"
              whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}
            >
              {/* <motion.div className="mb-4 md:mb-5 w-[220px] md:w-50 translate-y-[38px] translate-y-[61px] translate-x-[-60px]">
                <DotLottieReact
                  src="https://lottie.host/adc2f2fe-c868-406b-9851-077333d16cd1/pirKpHVawr.lottie"
                  loop
                  autoplay
                  className="w-full h-full"
                />
              </motion.div> */}

              <h4 className="font-unica text-lg md:text-xl">{t('continuousLearning')}</h4>
              <p className="font-anonymous text-xs md:text-sm text-zinc-400 dark:text-zinc-600">
                {t('dataAnalyst')}
              </p>
            </motion.div>
            <motion.div
              variants={aboutCardVariants}
              className="col-span-2 bg-blue-950 rounded-[2rem] p-10 h-64 overflow-hidden relative group"
              whileHover={{ scale: 1.03 }}
            >
              <img
                src="https://i.pinimg.com/736x/a9/25/8d/a9258d3e53c748c246afc39dac67167f.jpg"
                alt="Workspace"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-40"
              />
              <div className="relative z-10 h-full flex flex-col justify-end">
                <h4 className="text-3xl font-display uppercase text-white">{t('basedInBandung')}</h4>
                <p className="text-zinc-400 font-medium">{t('availableForRemote')}</p>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.section
          className="bg-zinc-900 rounded-[3rem] p-8 md:p-20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: '-100px' }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="flex items-center gap-4 mb-16"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              variants={itemVariants}
              className="w-12 h-12 bg-zinc-800 rounded-2xl flex items-center justify-center shadow-sm text-white"
              whileHover={{ rotate: 10 }}
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <GraduationCap size={24} />
            </motion.div>
            <motion.h2
              variants={itemVariants}
              className="text-4xl md:text-5xl font-display text-white"
            >
              <SplitText
                text={t('academicJourney')}
                splitBy="word"
                stagger={0.09}
                delay={0.1}
                duration={0.65}
                margin="-60px"
              />
            </motion.h2>
          </motion.div>

          <motion.div
            className="space-y-12"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false }}
          >
            {EDUCATION_DATA.map((edu, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="relative pl-10 border-l-2 border-zinc-700"
                whileHover={{ x: 8 }}
              >
                <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-white border-4 border-zinc-900" />
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white">{t(`eduInstitution_${index}` as any)}</h3>
                    <p className="text-zinc-400 font-semibold">{t(`eduDegree_${index}` as any)}</p>
                  </div>
                  <motion.span
                    className="px-4 py-1.5 bg-zinc-800 rounded-full text-xs font-bold tracking-widest text-zinc-500 border border-zinc-700 uppercase"
                    whileHover={{ scale: 1.05 }}
                  >
                    {t(`eduPeriod_${index}` as any)}
                  </motion.span>
                </div>
                <p className="text-zinc-400 leading-relaxed max-w-3xl">{t(`eduDesc_${index}` as any)}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>
      </div>
    </div>
  );
};

export default About;
