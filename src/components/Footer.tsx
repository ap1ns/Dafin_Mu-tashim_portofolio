import React from 'react';
import { motion } from 'framer-motion';
import { useEasterEgg } from '../context/EasterEggContext';
import { useLanguage } from '../context/LanguageContext';

const Footer: React.FC = () => {
  const { triggerEasterEgg } = useEasterEgg();
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

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
    visible: { opacity: 1, y: 0 },
  };

  const linkVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4 },
    },
  };

  const loopTextVariants = {
    animate: (i: number) => ({
      opacity: [1, 1, 0.5, 1],
      transition: {
        delay: i * 0.08,
        duration: 3,
        repeat: Infinity,
      },
    }),
  };

  return (
    <footer className="py-20 px-6 bg-black relative">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: '-100px' }}
        >
          <motion.div
            className="col-span-2"
            variants={itemVariants}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <motion.h2
              className="text-4xl font-display mb-6 uppercase text-black dark:text-white"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ delay: 0.1 }}
            >
              PORTOFOLIO.
            </motion.h2>
            <motion.p
              className="text-zinc-500 dark:text-zinc-400 max-w-sm leading-relaxed"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: false }}
              transition={{ delay: 0.2 }}
            >
              <span dangerouslySetInnerHTML={{ __html: t('footerDescription').replace('Apin', `<span class="cursor-default">${'Apin'}</span>`) }} onClick={triggerEasterEgg} />
            </motion.p>
          </motion.div>
          <motion.div variants={itemVariants} transition={{ duration: 0.6, ease: 'easeOut' }}>
            <motion.h4
              className="font-bold text-sm tracking-widest uppercase mb-6 text-black dark:text-white"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false }}
              transition={{ delay: 0.1 }}
            >
              {t('quickLinks')}
            </motion.h4>
            <motion.ul
              className="space-y-4 text-zinc-500 dark:text-zinc-400 text-sm font-medium"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false }}
            >
              {[
                { href: '#home', label: t('home') },
                { href: '#about', label: t('about') },
                { href: '#experience', label: t('experience') },
                { href: '#skills', label: t('skills') },
                { href: '#contact', label: t('contact') },
              ].map((link) => (
                <motion.li key={link.href} variants={linkVariants}>
                  <motion.a
                    href={link.href}
                    className="hover:text-black dark:hover:text-white transition-colors flex items-center gap-2"
                    whileHover={{ x: 5 }}
                  >
                    {link.label}
                  </motion.a>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
          <motion.div variants={itemVariants} transition={{ duration: 0.6, ease: 'easeOut' }}>
            <motion.h4
              className="font-bold text-sm tracking-widest uppercase mb-6 text-black dark:text-white"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false }}
              transition={{ delay: 0.1 }}
            >
              {t('followMe')}
            </motion.h4>
            <motion.ul
              className="space-y-4 text-zinc-500 dark:text-zinc-400 text-sm font-medium"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false }}
            >
              {[
                { href: 'https://www.linkedin.com/in/dafin-mu-tashim-277519308/', label: 'LinkedIn' },
                { href: 'https://github.com/ap1ns', label: 'github' },
                { href: 'https://www.instagram.com/_apins/', label: 'Instagram' },
                { href: 'https://youtube.com/@tuanveles?si=3QY-ZQdMfi0yMAgE', label: 'YouTube' },
                { href: 'https://tiktok.com/@_apins_/', label: 'TikTok' },

              ].map((social) => (
                <motion.li key={social.label} variants={linkVariants}>
                  <motion.a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-black dark:hover:text-white transition-colors flex items-center gap-2"
                    whileHover={{ x: 5 }}
                  >
                    {social.label}
                  </motion.a>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        </motion.div>

        <motion.div
          className="flex flex-col md:flex-row items-center justify-between gap-6 pt-10 border-t border-zinc-800 text-[10px] font-bold tracking-[0.2em] text-zinc-500 uppercase"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false }}
        >
          <motion.p variants={itemVariants} transition={{ duration: 0.6, ease: 'easeOut' }}>
            © {currentYear}{' '}
            <span>
              {"Dafin Mu'tashim".split('').map((char, i) => (
                <motion.span
                  key={i}
                  custom={i}
                  variants={loopTextVariants}
                  animate="animate"
                  className="inline-block"
                >
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>
              ))}
            </span>
            . {t('allRightsReserved').toUpperCase()}
          </motion.p>
          <motion.div
            className="flex gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false }}
          >
            <motion.a
              href="#"
              className="hover:text-black dark:hover:text-white transition-colors"
              variants={linkVariants}
              whileHover={{ scale: 1.05 }}
            >
              {t('privacyPolicy')}
            </motion.a>
            <motion.a
              href="#"
              className="hover:text-black dark:hover:text-white transition-colors"
              variants={linkVariants}
              whileHover={{ scale: 1.05 }}
            >
              {t('termsOfService')}
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
