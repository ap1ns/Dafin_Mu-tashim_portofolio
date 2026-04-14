import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Mail, MessageSquare, Instagram, Music2, Linkedin, Youtube } from 'lucide-react';
import emailjs from 'emailjs-com';
import { useTheme } from '../context/ThemeContext';
import { useScrollVisibility } from '../hooks/useScrollAnimation';
import PageBackground from '../components/PageBackground';
import { PAGE_BACKGROUNDS } from '../config/pageBackgrounds';

const Contact: React.FC = () => {
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
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error' | 'cooldown'>('idle');
  const [messageCount, setMessageCount] = useState(0);
  const [cooldownTime, setCooldownTime] = useState(0);
  const [lastBatchTime, setLastBatchTime] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isMobile, setIsMobile] = useState(false);


  const MESSAGE_LIMIT = 10;
  const COOLDOWN_DURATION = 120; // 2 minutes in seconds

  // Initialize EmailJS and load from localStorage
  React.useEffect(() => {
    emailjs.init("3w93-p98IxY80r28o");

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

  // Mobile detection
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Save to localStorage whenever messageCount or lastBatchTime changes
  React.useEffect(() => {
    if (messageCount > 0 || lastBatchTime > 0) {
      localStorage.setItem('contactFormRateLimit', JSON.stringify({
        messageCount,
        lastBatchTime
      }));
    }
  }, [messageCount, lastBatchTime]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
          setCooldownTime(prev => {
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
      await emailjs.send(
        "service_ga9oh0t",
        "template_y9jvpd9",
        {
          to_email: "dafinmutashim9@gmail.com",
          from_name: formData.name,
          from_email: formData.email,
          subject: formData.subject,
          message: formData.message
        }
      );

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
      url: "https://www.instagram.com/_apins2/",
      label: "Instagram",
      color: "#a7243c",
      hoverClass: "hover:text-[#E4405F] hover:border-[#E4405F]/20 hover:bg-[#E4405F]/5 dark:hover:text-[#E4405F] dark:hover:border-[#E4405F]/30 dark:hover:bg-[#E4405F]/10"
    },
    {
      icon: <Music2 size={20} />,
      url: "https://www.tiktok.com/@_apins_",
      label: "TikTok",
      color: "#000",
      hoverClass: "hover:text-black dark:hover:text-white hover:border-black/20 dark:hover:border-white/20 hover:bg-black/5 dark:hover:bg-white/5"
    },
    {
      icon: <Linkedin size={20} />,
      url: "https://www.linkedin.com/in/dafin-mu-tashim-277519308/",
      label: "LinkedIn",
      color: "#0077B5",
      hoverClass: "hover:text-[#0077B5] hover:border-[#0077B5]/20 hover:bg-[#0077B5]/5 dark:hover:text-[#0077B5] dark:hover:border-[#0077B5]/30 dark:hover:bg-[#0077B5]/10"
    },
    {
      icon: <Youtube size={20} />,
      url: "https://youtube.com/@tuanveles?si=3QY-ZQdMfi0yMAgE",
      label: "YouTube",
      color: "#FF0000",
      hoverClass: "hover:text-[#FF0000] hover:border-[#FF0000]/20 hover:bg-[#FF0000]/5 dark:hover:text-[#FF0000] dark:hover:border-[#FF0000]/30 dark:hover:bg-[#FF0000]/10"
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const socialVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4 }
    }
  };

  return (
    <motion.div ref={sectionRef} className={`relative bg-white dark:bg-black py-12 md:py-20 px-6 min-h-screen transition-opacity duration-300`} style={{ opacity: sectionOpacity, transition: 'opacity 0.3s ease-out' }}>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-slate-200/10 blur-3xl"
          animate={{
            y: [0, 50, 0],
            x: [0, 40, 0],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          style={{ y: backgroundOrb1Y, rotate: backgroundOrb1Rotate }}
        />
        <motion.div
          className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-slate-400/10 blur-3xl"
          animate={{
            y: [0, -60, 0],
            x: [0, -50, 0],
            rotate: [360, 180, 0]
          }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
          style={{ y: backgroundOrb2Y, rotate: backgroundOrb2Rotate }}
        />
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <motion.div
            className="flex flex-col justify-center"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            style={{ y: isMobile ? 0 : leftY, rotate: isMobile ? 0 : leftRotate, scale: contentScale }}
          >
            <motion.span
              variants={itemVariants}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-xs font-bold tracking-[0.3em] text-zinc-400 dark:text-zinc-500 uppercase mb-4 block"
            >
              Let's Connect
            </motion.span>
            <motion.h1
              variants={itemVariants}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-6xl md:text-8xl font-display mb-8 text-black dark:text-white"
            >
              LET'S CONNECT
            </motion.h1>
            <motion.p
              variants={itemVariants}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-zinc-500 dark:text-zinc-400 text-lg mb-12 leading-relaxed max-w-md"
            >
              f you are looking for a dedicated and detail-oriented professional to support your logistics or administrative operations, feel free to reach out. I am available for interviews and ready to discuss how my skills can contribute to your team. I typically respond within 24 hours
            </motion.p>

            <motion.div
              className="space-y-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.div
                variants={itemVariants}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="flex items-center gap-6 p-6 rounded-3xl bg-zinc-50 dark:bg-zinc-900 group transition-all duration-300 cursor-pointer border border-transparent"
                whileHover={{ scale: 1.05 }}
                onClick={() => window.location.href = 'mailto:dafinmutashim9@gmail.com'}
              >
                <motion.div
                  className="w-14 h-14 rounded-2xl bg-white dark:bg-zinc-800 flex items-center justify-center shadow-sm text-black dark:text-white group-hover:text-gray-400 dark:group-hover:text-gray-400 transition-all duration-300 group-hover:scale-110 flex-shrink-0"
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Mail size={24} />
                </motion.div>
                <div className="min-w-0 max-w-xs">
                  <p className="text-xs font-bold uppercase tracking-widest opacity-50 transition-colors text-black dark:text-white">Email Me</p>
                  <p className="text-xl md:text-xl text-sm font-bold transition-colors text-black dark:text-white truncate">dafinmutashim9@gmail.com</p>
                </div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                transition={{ duration: 0.6, ease: "easeOut" }}
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
                  <p className="text-xs font-bold uppercase tracking-widest opacity-50 mb-3 text-black dark:text-white">Direct Messages</p>
                  <motion.div
                    className="flex gap-3"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
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
            className="relative rounded-2xl sm:rounded-[3rem] w-full max-w-full sm:max-w-[38rem] mx-auto min-h-[600px] sm:min-h-[650px] md:min-h-[650px] lg:min-h-[600px]"
            style={{
              perspective: isMobile ? 'none' : '2000px',
              y: isMobile ? 0 : rightY,
              rotate: isMobile ? 0 : rightRotate,
              scale: contentScale
            }}
          >
            {isMobile ? (
              // Mobile: Show form directly without flip animation
              <motion.div
                className="w-full rounded-2xl sm:rounded-[3rem] overflow-hidden border border-white/10 bg-black shadow-2xl backdrop-blur-xl"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <div className="relative z-10 w-full flex flex-col p-5 md:p-8 min-h-[600px]">
                  {submitStatus === 'success' ? (
                    // Success Message
                    <div className="relative overflow-hidden w-full min-h-[600px] rounded-[2rem] flex items-center justify-center">
                      <img
                        src="https://i.pinimg.com/originals/df/ee/6e/dfee6e7841913e2b6ecbe9384538b9e6.gif"
                        alt="Success background"
                        className="pointer-events-none absolute inset-0 w-full h-full object-cover opacity-30"
                      />
                      <div className="relative z-10 flex flex-col items-center justify-center px-6 text-center">
                        <motion.h3
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2, duration: 0.6 }}
                          className="text-2xl md:text-3xl font-bold text-white mb-4"
                        >
                          Message Sent
                        </motion.h3>
                        <motion.p
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4, duration: 0.6 }}
                          className="text-white/70 mb-8"
                        >
                          Thank you for reaching out! I'll get back to you within 24 hours.
                        </motion.p>
                      </div>
                    </div>
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
                            Contact form
                          </motion.p>
                          <motion.h2
                            className="text-lg sm:text-xl md:text-2xl lg:text-4xl font-semibold text-white leading-tight"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.35, duration: 0.6 }}
                          >
                            Tell me about your project.
                          </motion.h2>
                        </div>
                        <form className="space-y-6 flex flex-col" onSubmit={handleSubmit}>
                          <div className="grid gap-5 md:grid-cols-2">
                            <div>
                              <label className="block text-[13px] font-medium text-white/80 mb-2">
                                Name *
                              </label>
                              <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Your full name"
                                required
                                className="w-full px-4 py-3 bg-black border border-white/20 rounded-2xl backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/70 text-white placeholder-white/50 text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-[13px] font-medium text-white/80 mb-2">
                                Email *
                              </label>
                              <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="your.email@example.com"
                                required
                                className="w-full px-4 py-3 bg-black border border-white/20 rounded-2xl backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/70 text-white placeholder-white/50 text-sm"
                              />
                            </div>
                          </div>
                          <div className="mt-5">
                            <label className="block text-[13px] font-medium text-white/80 mb-2">
                              Subject *
                            </label>
                            <input
                              type="text"
                              name="subject"
                              value={formData.subject}
                              onChange={handleInputChange}
                              placeholder="What do you want to build?"
                              required
                              className="w-full px-4 py-3 bg-black border border-white/20 rounded-2xl backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/70 text-white placeholder-white/50 text-sm"
                            />
                          </div>
                          <div className="mt-5">
                            <label className="block text-[13px] font-medium text-white/80 mb-2">
                              Message *
                            </label>
                            <textarea
                              rows={5}
                              name="message"
                              value={formData.message}
                              onChange={handleInputChange}
                              placeholder="Tell me about your project or just say hello..."
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
                              Failed to send message. Please try again.
                            </div>
                          )}
                          {submitStatus === 'cooldown' && (
                            <div className="p-4 bg-amber-500/10 border border-amber-400/20 rounded-2xl text-amber-100 text-sm">
                              You've sent 10 messages. Please wait {cooldownTime}s before sending more.
                            </div>
                          )}
                          <div className="text-center text-[11px] text-white/40 mb-4">
                            Your message will be sent to my email.
                          </div>
                          <button
                            type="submit"
                            disabled={isLoading || submitStatus === 'cooldown'}
                            className="w-full py-4 bg-black text-white rounded-2xl font-semibold hover:bg-white/90 hover:text-black active:bg-white/95 active:text-black active:scale-95 transition duration-300 ease-out disabled:opacity-50 disabled:cursor-not-allowed text-sm backdrop-blur-sm border border-white/20 shadow-sm hover:shadow-md"
                          >
                            {isLoading ? 'Sending...' : submitStatus === 'cooldown' ? `Wait ${cooldownTime}s` : 'Send Message'}
                          </button>
                        </form>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            ) : (
              // Desktop: 3D Flip Card
              <motion.div
                className="w-full h-full relative preserve-3d"
                animate={{
                  rotateY: isFlipped ? 180 : 0,
                  scale: isFlipped ? 1.02 : 1
                }}
                transition={{
                  duration: 1.2,
                  ease: [0.25, 0.46, 0.45, 0.94],
                  type: "spring",
                  stiffness: 100,
                  damping: 20
                }}
                style={{
                  transformStyle: 'preserve-3d',
                  perspective: '2000px'
                }}
              >
                {/* Flip glow effect */}
                <motion.div
                  className="absolute inset-0 rounded-2xl sm:rounded-[3rem] pointer-events-none"
                  animate={{
                    boxShadow: "0 0 0 rgba(0,0,0,0)",
                    background: "transparent"
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
                      opacity: 0
                    }}
                    transition={{
                      duration: 0.6,
                      ease: 'easeInOut'
                    }}
                  />
                </motion.div>
                {/* Front Side - Beautiful Display Card */}
                <motion.div
                  className="absolute w-full h-full rounded-2xl sm:rounded-[3rem] border border-white/10 overflow-hidden bg-black shadow-2xl"
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateY(0deg)',
                    zIndex: isFlipped ? 0 : 1
                  }}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "0 25px 60px rgba(0,0,0,0.25), 0 0 30px rgba(255,255,255,0.1)",
                    transition: { duration: 0.3 }
                  }}
                >
                  <div className="absolute inset-0 bg-black/80" />
                  <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full blur-xl" />
                  <div className="absolute bottom-0 right-0 w-20 h-20 bg-white/10 rounded-full blur-xl" />
                  <div className="relative z-10 h-full flex flex-col">
                    <div className="relative h-52 md:h-[360px] w-full overflow-hidden">
                      <PageBackground url={backgroundUrl} blur={false} />
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/90" />
                      <div className="absolute left-6 top-6 text-left">
                        <p className="text-xs uppercase tracking-[0.3em] text-white/90">
                          Work fast. Live slow.
                        </p>
                      </div>
                    </div>

                    <div className="relative z-10 flex-1 px-5 pb-10 pt-6 md:px-10 md:pb-10 flex flex-col justify-between">
                      <div className="space-y-6">
                        <motion.h2
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.2, duration: 0.8, type: 'spring', stiffness: 120 }}
                          className="text-xl sm:text-2xl md:text-3xl lg:text-5xl font-semibold text-white leading-tight"
                        >
                          Reliable & Efficient Support
                        </motion.h2>

                        <motion.p
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.35, duration: 0.7 }}
                          className="max-w-xl text-xs sm:text-sm md:text-base text-white leading-relaxed"
                        >
                          From precise data entry to organized warehouse operations. Let's build a more efficient workflow together
                        </motion.p>
                      </div>

                      <div className="mt-8 flex flex-col gap-6">
                        <motion.button
                          onClick={() => {
                            setIsFlipped(true);
                            if (navigator.vibrate) {
                              navigator.vibrate(50);
                            }
                          }}
                          initial={{ opacity: 0, y: 30, scale: 0.95 }}
                          whileInView={{ opacity: 1, y: 0, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.55, duration: 0.6, type: 'spring', stiffness: 120 }}
                          whileHover={{
                            scale: 1.03,
                            boxShadow: "0 18px 45px rgba(255,255,255,0.22)",
                            backgroundColor: 'rgba(255,255,255,0.95)',
                            color: '#000'
                          }}
                          whileTap={{
                            scale: 0.97,
                            boxShadow: "0 12px 32px rgba(255,255,255,0.18)",
                            backgroundColor: 'rgba(255,255,255,0.95)',
                            color: '#000'
                          }}
                          className="relative inline-flex items-center justify-center w-full rounded-3xl border border-white/20 bg-black px-10 py-4 text-white text-base font-semibold shadow-lg backdrop-blur-sm transition duration-300"
                        >
                          Send a message
                        </motion.button>

                        <div className="flex flex-col gap-1 text-sm text-white/60 md:flex-row md:items-center md:justify-between">
                          <span>Apins.id</span>
                          <span>operations + inventory + reporting</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
                <motion.div
                  className="absolute inset-0 rounded-2xl sm:rounded-[3rem] overflow-hidden border border-white/10 bg-black shadow-2xl backdrop-blur-xl"
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                    zIndex: isFlipped ? 1 : 0
                  }}
                >
                  <div className="relative z-10 w-full flex flex-col p-5 md:p-8 h-full">
                    {submitStatus === 'success' ? (
                      // Success Message
                      <div className="relative overflow-hidden w-full h-full rounded-[2rem] flex items-center justify-center">
                        <img
                          src="https://i.pinimg.com/originals/df/ee/6e/dfee6e7841913e2b6ecbe9384538b9e6.gif"
                          alt="Success background"
                          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-30"
                        />
                        <div className="relative z-10 flex flex-col items-center justify-center px-6 text-center">
                          <motion.h3
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                            className="text-2xl md:text-3xl font-bold text-white mb-4"
                          >
                            Message Sent
                          </motion.h3>
                          <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                            className="text-white/70 mb-8"
                          >
                            Thank you for reaching out! I'll get back to you within 24 hours.
                          </motion.p>
                        </div>
                      </div>
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
                              Contact form
                            </motion.p>
                            <motion.h2
                              className="text-lg sm:text-xl md:text-2xl lg:text-4xl font-semibold text-white leading-tight"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.35, duration: 0.6 }}
                            >
                              Tell me about your project.
                            </motion.h2>
                          </div>
                          <form className="space-y-6 flex flex-col" onSubmit={handleSubmit}>
                            <div className="grid gap-5 md:grid-cols-2">
                              <div>
                                <label className="block text-[13px] font-medium text-white/80 mb-2">
                                  Name *
                                </label>
                                <input
                                  type="text"
                                  name="name"
                                  value={formData.name}
                                  onChange={handleInputChange}
                                  placeholder="Your full name"
                                  required
                                  className="w-full px-4 py-3 bg-black border border-white/20 rounded-2xl backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/70 text-white placeholder-white/50 text-sm"
                                />
                              </div>
                              <div>
                                <label className="block text-[13px] font-medium text-white/80 mb-2">
                                  Email *
                                </label>
                                <input
                                  type="email"
                                  name="email"
                                  value={formData.email}
                                  onChange={handleInputChange}
                                  placeholder="your.email@example.com"
                                  required
                                  className="w-full px-4 py-3 bg-black border border-white/20 rounded-2xl backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/70 text-white placeholder-white/50 text-sm"
                                />
                              </div>
                            </div>
                            <div className="mt-5">
                              <label className="block text-[13px] font-medium text-white/80 mb-2">
                                Subject *
                              </label>
                              <input
                                type="text"
                                name="subject"
                                value={formData.subject}
                                onChange={handleInputChange}
                                placeholder="What do you want to build?"
                                required
                                className="w-full px-4 py-3 bg-black border border-white/20 rounded-2xl backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/70 text-white placeholder-white/50 text-sm"
                              />
                            </div>
                            <div className="mt-5">
                              <label className="block text-[13px] font-medium text-white/80 mb-2">
                                Message *
                              </label>
                              <textarea
                                rows={5}
                                name="message"
                                value={formData.message}
                                onChange={handleInputChange}
                                placeholder="Tell me about your project or just say hello..."
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
                                Failed to send message. Please try again.
                              </div>
                            )}
                            {submitStatus === 'cooldown' && (
                              <div className="p-4 bg-amber-500/10 border border-amber-400/20 rounded-2xl text-amber-100 text-sm">
                                You've sent 10 messages. Please wait {cooldownTime}s before sending more.
                              </div>
                            )}
                            <div className="text-center text-[11px] text-white/40 mb-4">
                              Your message will be sent to my email.
                            </div>
                            <button
                              type="submit"
                              disabled={isLoading || submitStatus === 'cooldown'}
                              className="w-full py-4 bg-black text-white rounded-2xl font-semibold hover:bg-white/90 hover:text-black active:bg-white/95 active:text-black active:scale-95 transition duration-300 ease-out disabled:opacity-50 disabled:cursor-not-allowed text-sm backdrop-blur-sm border border-white/20 shadow-sm hover:shadow-md"
                            >
                              {isLoading ? 'Sending...' : submitStatus === 'cooldown' ? `Wait ${cooldownTime}s` : 'Send Message'}
                            </button>
                          </form>
                        </div>
                      </>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Contact;
