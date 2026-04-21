import React, { useState, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Mail, MessageSquare, Instagram, Music2, Linkedin, Youtube } from 'lucide-react';
import emailjs from 'emailjs-com';
import { useTheme } from '../context/ThemeContext';
import { useScrollVisibility } from '../hooks/useScrollAnimation';
import PageBackground from '../components/PageBackground';
import { PAGE_BACKGROUNDS } from '../config/pageBackgrounds';

const Contact: React.FC = () => {
  const { t } = useLanguage();
  const { isDark } = useTheme();
  const { opacity } = useScrollVisibility();
  const backgroundUrl = isDark ? PAGE_BACKGROUNDS.contact.dark : PAGE_BACKGROUNDS.contact.light;
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const sectionOpacity = useTransform(scrollYProgress, [0, 0.15, 0.7, 1], [0, 1, 1, 0.92]);
  const leftY = useTransform(scrollYProgress, [0, 1], [40, -20]);
  const rightY = useTransform(scrollYProgress, [0, 1], [60, -30]);

  // Enhanced scroll animations
  const backgroundOrb1Y = useTransform(scrollYProgress, [0, 1], [-40, 80]);
  const backgroundOrb1Rotate = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const backgroundOrb2Y = useTransform(scrollYProgress, [0, 1], [50, -90]);
  const backgroundOrb2Rotate = useTransform(scrollYProgress, [0, 1], [120, -120]);
  const contentScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.02, 0.98]);
  const leftRotate = useTransform(scrollYProgress, [0, 1], [0, -2]);
  const rightRotate = useTransform(scrollYProgress, [0, 1], [0, 2]);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [honeypot, setHoneypot] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error' | 'cooldown'>(
    'idle'
  );
  const [messageCount, setMessageCount] = useState(0);
  const [cooldownTime, setCooldownTime] = useState(0);
  const [lastBatchTime, setLastBatchTime] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const MESSAGE_LIMIT = 10;
  const COOLDOWN_DURATION = 120; // 2 minutes in seconds

  // Initialize EmailJS and load from localStorage
  React.useEffect(() => {
    emailjs.init('3w93-p98IxY80r28o');

    // Load rate limit data from localStorage
    const savedData = localStorage.getItem('contactFormRateLimit');
    if (savedData) {
      const data = JSON.parse(savedData);
      const now = Date.now();
      const timeSinceLastBatch = (now - data.lastBatchTime) / 1000;

      // Reset if cooldown period has passed
      if (timeSinceLastBatch >= COOLDOWN_DURATION) {
        setMessageCount(0);
        setLastBatchTime(0);
        localStorage.removeItem('contactFormRateLimit');
      } else {
        // Restore from localStorage
        setMessageCount(data.messageCount);
        setLastBatchTime(data.lastBatchTime);
      }
    }
  }, []);

  // Load rate limit data from localStorage
  React.useEffect(() => {
    if (messageCount > 0 || lastBatchTime > 0) {
      localStorage.setItem(
        'contactFormRateLimit',
        JSON.stringify({
          messageCount,
          lastBatchTime,
        })
      );
    }
  }, [messageCount, lastBatchTime]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Honeypot check for spam prevention
    if (honeypot) {
      console.log('Spam detected via honeypot');
      return;
    }

    // Check if rate limit reached
    const now = Date.now();
    const newCount = messageCount + 1;

    if (newCount > MESSAGE_LIMIT) {
      const timeSinceLastBatch = (now - lastBatchTime) / 1000;

      if (timeSinceLastBatch < COOLDOWN_DURATION) {
        const remainingTime = Math.ceil(COOLDOWN_DURATION - timeSinceLastBatch);
        setCooldownTime(remainingTime);
        setSubmitStatus('cooldown');

        // Timer countdown
        const interval = setInterval(() => {
          setCooldownTime((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              setSubmitStatus('idle');
              setMessageCount(0);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        return;
      } else {
        // Reset after cooldown
        setMessageCount(1);
        setLastBatchTime(now);
      }
    } else if (newCount === MESSAGE_LIMIT) {
      // Set cooldown timer when limit reached
      setLastBatchTime(now);
    }

    setIsLoading(true);
    setSubmitStatus('idle');

    try {
      // Send email using EmailJS
      await emailjs.send('service_ga9oh0t', 'template_y9jvpd9', {
        to_email: 'dafinmutashim9@gmail.com',
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject,
        message: formData.message,
      });

      setSubmitStatus('success');
      setMessageCount(newCount);

      // Keep success message visible for about 3 seconds
      setTimeout(() => {
        setIsFlipped(false);
        setFormData({ name: '', email: '', subject: '', message: '' });
        setSubmitStatus('idle');
      }, 3000);
    } catch (error) {
      console.error('Failed to send email:', error);
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const socialLinks = [
    {
      icon: <Instagram size={20} />,
      url: 'https://www.instagram.com/_apins2/',
      label: 'Instagram',
      color: '#a7243c',
      hoverClass:
        'hover:text-[#E4405F] hover:border-[#E4405F]/20 hover:bg-[#E4405F]/5 dark:hover:text-[#E4405F] dark:hover:border-[#E4405F]/30 dark:hover:bg-[#E4405F]/10',
    },
    {
      icon: <Music2 size={20} />,
      url: 'https://www.tiktok.com/@_apins_',
      label: 'TikTok',
      color: '#000',
      hoverClass:
        'hover:text-black dark:hover:text-white hover:border-black/20 dark:hover:border-white/20 hover:bg-black/5 dark:hover:bg-white/5',
    },
    {
      icon: <Linkedin size={20} />,
      url: 'https://www.linkedin.com/in/dafin-mu-tashim-277519308/',
      label: 'LinkedIn',
      color: '#0077B5',
      hoverClass:
        'hover:text-[#0077B5] hover:border-[#0077B5]/20 hover:bg-[#0077B5]/5 dark:hover:text-[#0077B5] dark:hover:border-[#0077B5]/30 dark:hover:bg-[#0077B5]/10',
    },
    {
      icon: <Youtube size={20} />,
      url: 'https://youtube.com/@tuanveles?si=3QY-ZQdMfi0yMAgE',
      label: 'YouTube',
      color: '#FF0000',
      hoverClass:
        'hover:text-[#FF0000] hover:border-[#FF0000]/20 hover:bg-[#FF0000]/5 dark:hover:text-[#FF0000] dark:hover:border-[#FF0000]/30 dark:hover:bg-[#FF0000]/10',
    },
  ];

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

  const socialVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4 },
    },
  };

  return (
    <motion.div
      ref={sectionRef}
      className={`relative bg-white dark:bg-black py-12 md:py-20 px-6 min-h-screen transition-opacity duration-300`}
      style={{ opacity: sectionOpacity, transition: 'opacity 0.3s ease-out' }}
    >


      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <motion.div
            className="flex flex-col justify-center"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, margin: '-100px' }}
            style={{
              scale: contentScale,
            }}
          >
            <motion.span
              variants={itemVariants}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="text-xs font-bold tracking-[0.3em] text-zinc-400 dark:text-zinc-500 uppercase mb-4 block"
            >
              {t('letsConnect')}
            </motion.span>
            <motion.h1
              variants={itemVariants}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="text-6xl md:text-8xl font-display mb-8 text-black dark:text-white"
            >
              {t('letsConnect')}
            </motion.h1>
            <motion.p
              variants={itemVariants}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="text-zinc-500 dark:text-zinc-400 text-lg mb-12 leading-relaxed max-w-md"
            >
              {t('contactDescription')}
            </motion.p>

            <motion.div
              className="space-y-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false }}
            >
              <motion.div
                variants={itemVariants}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="flex items-center gap-6 p-6 rounded-3xl bg-zinc-50 dark:bg-zinc-900 group transition-all duration-300 cursor-pointer border border-transparent"
                whileHover={{ scale: 1.05 }}
                onClick={() => (window.location.href = 'mailto:dafinmutashim9@gmail.com')}
              >
                <motion.div
                  className="w-14 h-14 rounded-2xl bg-white dark:bg-zinc-800 flex items-center justify-center shadow-sm text-black dark:text-white group-hover:text-gray-400 dark:group-hover:text-gray-400 transition-all duration-300 group-hover:scale-110 flex-shrink-0"
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Mail size={24} />
                </motion.div>
                <div className="min-w-0 max-w-xs">
                  <p className="text-xs font-bold uppercase tracking-widest opacity-50 transition-colors text-black dark:text-white">
                    {t('emailMe')}
                  </p>
                  <p className="text-xl md:text-xl text-sm font-bold transition-colors text-black dark:text-white truncate">
                    dafinmutashim9@gmail.com
                  </p>
                </div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="flex items-center gap-6 p-6 rounded-3xl bg-zinc-50 dark:bg-zinc-900 border border-transparent dark:border-zinc-800"
                whileHover={{ scale: 1.05 }}
              >
                <motion.div
                  className="w-14 h-14 rounded-2xl bg-white dark:bg-white/20 flex items-center justify-center shadow-sm text-black dark:text-white backdrop-blur-md"
                  whileHover={{ rotate: -10, scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <MessageSquare size={24} />
                </motion.div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest opacity-50 mb-3 text-black dark:text-white">
                    {t('directMessages')}
                  </p>
                  <motion.div
                    className="flex gap-3"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false }}
                  >
                    {socialLinks.map((social, i) => (
                      <motion.a
                        key={i}
                        href={social.url}
                        variants={socialVariants}
                        whileHover={{ y: -5, scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className={`p-3 bg-white dark:bg-white/20 border border-zinc-100 dark:border-white/20 rounded-xl text-zinc-400 dark:text-zinc-300 transition-all duration-300 backdrop-blur-md ${social.hoverClass}`}
                        target="_blank"
                        rel="noreferrer"
                        title={social.label}
                      >
                        {social.icon}
                      </motion.a>
                    ))}
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div
            className="relative rounded-2xl sm:rounded-[3rem] w-full max-w-full sm:max-w-[38rem] mx-auto"
            style={{
              perspective: '2000px',
              scale: contentScale,
            }}
          >
              {/* 3D Flip Card */}
              <motion.div
                className="w-full relative preserve-3d grid"
                animate={{
                  rotateY: isFlipped ? 180 : 0,
                  scale: isFlipped ? 1.02 : 1,
                }}
                transition={{
                  duration: 1.2,
                  ease: [0.25, 0.46, 0.45, 0.94],
                  type: 'spring',
                  stiffness: 100,
                  damping: 20,
                }}
                style={{
                  transformStyle: 'preserve-3d',
                  perspective: '2000px',
                }}
              >
                {/* Flip glow effect */}
                <motion.div
                  className="absolute inset-0 rounded-2xl sm:rounded-[3rem] pointer-events-none"
                  animate={{
                    boxShadow: '0 0 0 rgba(0,0,0,0)',
                    background: 'transparent',
                  }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  style={{ zIndex: -1 }}
                />
                {/* Shimmer effect during flip */}
                <motion.div
                  className="absolute inset-0 rounded-2xl sm:rounded-[3rem] pointer-events-none overflow-hidden"
                  style={{ zIndex: -1 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-transparent"
                    animate={{
                      opacity: 0,
                    }}
                    transition={{
                      duration: 0.6,
                      ease: 'easeInOut',
                    }}
                  />
                </motion.div>
                {/* Front Side - Beautiful Display Card */}
                <motion.div
                  className="[grid-area:1/1] w-full h-full rounded-2xl sm:rounded-[3rem] border border-white overflow-hidden bg-black/80 shadow-[0_0_50px_rgba(255,255,255,0.05)] backdrop-blur-3xl"
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateY(0deg)',
                    zIndex: isFlipped ? 0 : 1,
                  }}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false, margin: '-100px' }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  whileHover={{
                    scale: 1.02,
                    boxShadow: '0 25px 60px rgba(0,0,0,0.25), 0 0 30px rgba(255,255,255,0.1)',
                    transition: { duration: 0.3 },
                  }}
                >
                  <div className="absolute inset-0 bg-black/80" />
                  <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full blur-xl" />
                  <div className="absolute bottom-0 right-0 w-20 h-20 bg-white/10 rounded-full blur-xl" />
                  <div className="relative z-10 h-full flex flex-col">
                    <div className="relative h-[55vw] sm:h-[45vw] md:h-[360px] w-full overflow-hidden">
                      {backgroundUrl && (
                        backgroundUrl.toLowerCase().endsWith('.mp4') || backgroundUrl.toLowerCase().endsWith('.webm') ? (
                          <video
                            src={backgroundUrl}
                            className="absolute inset-0 w-full h-full object-cover"
                            autoPlay
                            muted
                            loop
                            playsInline
                          />
                        ) : (
                          <img
                            src={backgroundUrl}
                            alt="Card background"
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        )
                      )}
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/90" />
                      <div className="absolute left-6 top-6 text-left">
                        <p className="text-xs uppercase tracking-[0.3em] text-white/90">
                          {t('contactCardText1')}
                        </p>
                      </div>
                    </div>

                    <div className="relative z-10 flex-1 px-5 pb-10 pt-6 md:px-10 md:pb-10 flex flex-col justify-between">
                      <div className="space-y-6">
                        <motion.h2
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: false }}
                          transition={{ delay: 0.2, duration: 0.8, type: 'spring', stiffness: 120 }}
                          className="text-3xl md:text-3xl lg:text-5xl font-semibold text-white leading-tight"
                        >
                          {t('contactCardText2')}
                        </motion.h2>

                        <motion.p
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: false }}
                          transition={{ delay: 0.35, duration: 0.7 }}
                          className="max-w-xl text-base md:text-base text-white leading-relaxed"
                        >
                          {t('contactCardText3')}
                        </motion.p>
                      </div>

                      <div className="mt-8 flex flex-col gap-6">
                        <motion.button
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsFlipped(true);
                          }}
                          initial={{ opacity: 0, y: 30, scale: 0.95 }}
                          whileInView={{ opacity: 1, y: 0, scale: 1 }}
                          viewport={{ once: false }}
                          transition={{
                            delay: 0.55,
                            duration: 0.6,
                            type: 'spring',
                            stiffness: 120,
                          }}
                          whileHover={{
                            scale: 1.02,
                            backgroundColor: 'rgba(255,255,255,1)',
                            color: '#000',
                            boxShadow: '0 8px 30px rgba(255,255,255,0.3)',
                          }}
                          whileTap={{
                            scale: 0.97,
                          }}
                          className="relative inline-flex items-center justify-center w-full rounded-[2rem] border border-white/30 bg-white/10 px-10 py-4 text-white text-sm tracking-wider uppercase font-bold shadow-[0_4px_14px_0_rgba(255,255,255,0.1)] backdrop-blur-md transition-colors duration-300"
                        >
                            {t('sendMessageBtn')}
                          </motion.button>

                        <div className="flex flex-col gap-1 text-sm text-white/60 md:flex-row md:items-center md:justify-between">
                          <span>Apins.id</span>
                          <span>{t('operationsReporting')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
                <motion.div
                  className="[grid-area:1/1] w-full h-full rounded-2xl sm:rounded-[3rem] overflow-hidden border border-white bg-black shadow-[0_0_50px_rgba(255,255,255,0.05)]"
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                    zIndex: isFlipped ? 1 : 0,
                  }}
                >
                  <div className="relative z-10 w-full flex flex-col p-5 md:p-8 h-full">
                    {submitStatus === 'success' ? (
                      // Success Message
                      <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        className="relative overflow-hidden w-full h-full rounded-[2rem] flex flex-col items-center justify-center bg-black/40"
                      >
                        {/* Dynamic background glow */}
                        <motion.div
                          animate={{ 
                            scale: [1, 1.2, 1],
                            opacity: [0.2, 0.4, 0.2]
                          }}
                          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/10 rounded-full blur-[60px] pointer-events-none"
                        />
                        
                        {/* Animated rings */}
                        <motion.div 
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: [0.8, 2.5], opacity: [0, 0.3, 0] }}
                          transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" }}
                          className="absolute w-32 h-32 rounded-full border border-white/20 pointer-events-none"
                        />
                        <motion.div 
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: [0.8, 2.5], opacity: [0, 0.3, 0] }}
                          transition={{ duration: 2.5, delay: 0.8, repeat: Infinity, ease: "easeOut" }}
                          className="absolute w-32 h-32 rounded-full border border-white/20 pointer-events-none"
                        />
                        <motion.div 
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: [0.8, 2.5], opacity: [0, 0.3, 0] }}
                          transition={{ duration: 2.5, delay: 1.6, repeat: Infinity, ease: "easeOut" }}
                          className="absolute w-32 h-32 rounded-full border border-white/20 pointer-events-none"
                        />
                        
                        <div className="relative z-10 flex flex-col items-center justify-center px-6 text-center w-full">
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
                            className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md mb-8 border border-white/20 shadow-[0_0_30px_rgba(255,255,255,0.1)] relative overflow-hidden"
                          >
                            <motion.div
                              className="absolute inset-0 bg-white/20"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ duration: 0.4, delay: 0.4 }}
                            />
                            <svg className="w-10 h-10 text-white relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <motion.path
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </motion.div>
                          
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.5 }}
                            className="inline-block px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/80 text-[10px] uppercase tracking-[0.2em] mb-4"
                          >
                            {t('successLabel')}
                          </motion.div>
                          
                          <motion.h3
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7, duration: 0.6 }}
                            className="text-3xl md:text-4xl font-semibold text-white mb-4 tracking-tight"
                          >
                            {t('messageSent')}
                          </motion.h3>
                          
                          <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8, duration: 0.6 }}
                            className="text-white/60 max-w-[280px] mx-auto text-sm leading-relaxed"
                          >
                            {t('thankYouMessage')}
                          </motion.p>
                        </div>
                      </motion.div>
                    ) : (
                      <>
                        <div className="w-full flex flex-col flex-1">
                          <div className="mb-10 px-1 md:px-0">
                            <motion.p
                              className="text-xs sm:text-sm md:text-base uppercase tracking-[0.3em] text-white/60 mb-5"
                              initial={{ opacity: 0, y: 15 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.2, duration: 0.6 }}
                            >
                              {t('contactFormLabel')}
                            </motion.p>
                            <motion.h2
                              className="text-lg sm:text-xl md:text-2xl lg:text-4xl font-semibold text-white leading-tight"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.35, duration: 0.6 }}
                            >
                              {t('tellMeProject')}
                            </motion.h2>
                          </div>
                          <form className="space-y-6 flex flex-col" onSubmit={handleSubmit}>
                            <div className="grid gap-5 md:grid-cols-2">
                              <div>
                                <label className="block text-[13px] font-medium text-white/80 mb-2">
                                  {t('nameLabel')}
                                </label>
                                <input
                                  type="text"
                                  name="name"
                                  value={formData.name}
                                  onChange={handleInputChange}
                                  placeholder={t('namePlaceholder')}
                                  required
                                  className="w-full px-4 py-3 bg-black border border-white/20 rounded-2xl backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/70 text-white placeholder-white/50 text-sm"
                                />
                              </div>
                              <div>
                                <label className="block text-[13px] font-medium text-white/80 mb-2">
                                  {t('emailLabel')}
                                </label>
                                <input
                                  type="email"
                                  name="email"
                                  value={formData.email}
                                  onChange={handleInputChange}
                                  placeholder={t('emailPlaceholder')}
                                  required
                                  className="w-full px-4 py-3 bg-black border border-white/20 rounded-2xl backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/70 text-white placeholder-white/50 text-sm"
                                />
                              </div>
                            </div>
                            <div className="mt-5">
                                <label className="block text-[13px] font-medium text-white/80 mb-2">
                                  {t('subjectLabel')}
                                </label>
                              <input
                                type="text"
                                name="subject"
                                value={formData.subject}
                                onChange={handleInputChange}
                                placeholder={t('subjectPlaceholder')}
                                required
                                className="w-full px-4 py-3 bg-black border border-white/20 rounded-2xl backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/70 text-white placeholder-white/50 text-sm"
                              />
                            </div>
                            <div className="mt-5">
                                <label className="block text-[13px] font-medium text-white/80 mb-2">
                                  {t('messageLabel')}
                                </label>
                              <textarea
                                rows={5}
                                name="message"
                                value={formData.message}
                                onChange={handleInputChange}
                                placeholder={t('messagePlaceholder')}
                                required
                                className="w-full px-4 py-3 bg-black border-2 border-white/20 rounded-2xl backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/70 text-white placeholder-white/50 resize-none text-sm shadow-lg"
                              />
                            </div>
                            <input
                              type="text"
                              name="website"
                              value={honeypot}
                              onChange={(e) => setHoneypot(e.target.value)}
                              style={{ display: 'none' }}
                              autoComplete="off"
                            />
                            {submitStatus === 'error' && (
                              <div className="p-4 bg-red-500/10 border border-red-400/20 rounded-2xl text-red-200 text-sm">
                                {t('failedToSend')}
                              </div>
                            )}
                            {submitStatus === 'cooldown' && (
                              <div className="p-4 bg-amber-500/10 border border-amber-400/20 rounded-2xl text-amber-100 text-sm">
                                {t('rateLimitMessage')} {cooldownTime}{t('rateLimitSuffix')}
                              </div>
                            )}
                            <div className="text-center text-[11px] text-white/40 mb-4">
                              {t('emailDisclaimer')}
                            </div>
                            <button
                              type="submit"
                              disabled={isLoading || submitStatus === 'cooldown'}
                              className="w-full py-4 bg-white/10 text-white rounded-[2rem] font-bold tracking-wider uppercase hover:bg-white hover:text-black active:scale-95 transition-all duration-300 ease-out disabled:opacity-50 disabled:cursor-not-allowed text-sm backdrop-blur-md border border-white/30 shadow-[0_4px_14px_0_rgba(255,255,255,0.1)] hover:shadow-[0_6px_20px_rgba(255,255,255,0.23)]"
                            >
                              {isLoading
                                ? t('sending')
                                : submitStatus === 'cooldown'
                                  ? `${t('wait')} ${cooldownTime}s`
                                  : t('sendMessage')}
                            </button>
                          </form>
                        </div>
                      </>
                    )}
                  </div>
                </motion.div>
              </motion.div>
          </motion.div>
        </div>

        {/* Quote Section */}
        <motion.div
          className="w-full flex flex-col items-center justify-center text-center mt-32 mb-10 py-16 md:py-24 px-4 relative overflow-hidden border-t border-zinc-200 dark:border-zinc-800"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: '-50px' }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >

          <motion.span
            className="text-xs font-black tracking-[0.4em] text-zinc-500 uppercase mb-8"
            initial={{ opacity: 0, letterSpacing: '0em' }}
            whileInView={{ opacity: 1, letterSpacing: '0.4em' }}
            viewport={{ once: false }}
            transition={{ duration: 1.2, delay: 0.2 }}
          >
            {t('closingThoughts')}
          </motion.span>
          <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-inter text-black dark:text-white max-w-4xl leading-[1.2] tracking-tight relative z-10 font-medium" dangerouslySetInnerHTML={{ __html: t('quoteText') }} />

          {/* Penambahan Nama Author */}
            <motion.p 
              className="mt-8 text-sm md:text-base text-zinc-500 dark:text-zinc-400 font-light tracking-widest relative z-10"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
            >
              — Dafin Mutashim    
            </motion.p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Contact;
