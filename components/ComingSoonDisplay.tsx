import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

interface ComingSoonDisplayProps {
  activeSkillId: string;
  skillName: string;
}

// Animation type mapping for each skill
const SKILL_ANIMATION_MAP: Record<string, string> = {
  Excel: 'typewriter',
  word: 'glitch',
  Powerpoint: 'wave',
  photoshop: 'brushReveal',
  python: 'codeDecode',
};

// ─── Typewriter Effect ─────────────────────────────────────────
const TypewriterText: React.FC<{ text: string; onComplete?: () => void }> = ({ text, onComplete }) => {
  const [displayed, setDisplayed] = useState('');
  const [cursorVisible, setCursorVisible] = useState(true);

  useEffect(() => {
    setDisplayed('');
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
        onComplete?.();
      }
    }, 70);
    return () => clearInterval(interval);
  }, [text, onComplete]);

  useEffect(() => {
    const blink = setInterval(() => setCursorVisible((v) => !v), 530);
    return () => clearInterval(blink);
  }, []);

  return (
    <span className="coming-soon-typewriter">
      {displayed}
      <span
        className="coming-soon-cursor"
        style={{ opacity: cursorVisible ? 1 : 0 }}
      >
        |
      </span>
    </span>
  );
};

// ─── Glitch Effect ─────────────────────────────────────────────
const GlitchText: React.FC<{ text: string }> = ({ text }) => {
  return (
    <span className="coming-soon-glitch" data-text={text}>
      {text}
    </span>
  );
};

// ─── Wave Effect (letter by letter wave) ───────────────────────
const WaveText: React.FC<{ text: string }> = ({ text }) => {
  const letters = text.split('');
  return (
    <span className="coming-soon-wave-container">
      {letters.map((letter, i) => (
        <motion.span
          key={`${letter}-${i}`}
          className="coming-soon-wave-letter"
          initial={{ opacity: 0, y: 40, rotateX: -90 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{
            delay: i * 0.04,
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{ display: 'inline-block' }}
        >
          {letter === ' ' ? '\u00A0' : letter}
        </motion.span>
      ))}
    </span>
  );
};

// ─── Brush Reveal Effect ───────────────────────────────────────
const BrushRevealText: React.FC<{ text: string }> = ({ text }) => {
  return (
    <span className="coming-soon-brush-wrapper">
      <motion.span
        className="coming-soon-brush-text"
        initial={{ clipPath: 'inset(0 100% 0 0)' }}
        animate={{ clipPath: 'inset(0 0% 0 0)' }}
        transition={{ duration: 1.2, ease: [0.77, 0, 0.175, 1] }}
      >
        {text}
      </motion.span>
      <motion.span
        className="coming-soon-brush-bar"
        initial={{ left: '0%', width: '0%' }}
        animate={{
          left: ['0%', '0%', '100%'],
          width: ['0%', '100%', '0%'],
        }}
        transition={{ duration: 1.2, ease: [0.77, 0, 0.175, 1] }}
      />
    </span>
  );
};

// ─── Code Decode / Scramble Effect ─────────────────────────────
const CodeDecodeText: React.FC<{ text: string }> = ({ text }) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*!?<>';
  const [displayed, setDisplayed] = useState(text.replace(/[^ ]/g, () => chars[Math.floor(Math.random() * chars.length)]));

  useEffect(() => {
    const iterations = 12;
    let frame = 0;
    const interval = setInterval(() => {
      frame++;
      setDisplayed(
        text
          .split('')
          .map((char, idx) => {
            if (char === ' ') return ' ';
            if (idx < Math.floor((frame / iterations) * text.length)) {
              return char;
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('')
      );
      if (frame >= iterations) clearInterval(interval);
    }, 80);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <span className="coming-soon-decode">
      {displayed}
    </span>
  );
};

// ─── Main Component ────────────────────────────────────────────
const ComingSoonDisplay: React.FC<ComingSoonDisplayProps> = ({ activeSkillId, skillName }) => {
  const { t } = useLanguage();
  const animationType = SKILL_ANIMATION_MAP[activeSkillId] || 'typewriter';
  const comingSoonText = t('projectComingSoon' as any) || 'Project is coming soon';

  const renderText = useCallback(() => {
    switch (animationType) {
      case 'typewriter':
        return <TypewriterText key={activeSkillId} text={comingSoonText} />;
      case 'glitch':
        return <GlitchText key={activeSkillId} text={comingSoonText} />;
      case 'wave':
        return <WaveText key={activeSkillId} text={comingSoonText} />;
      case 'brushReveal':
        return <BrushRevealText key={activeSkillId} text={comingSoonText} />;
      case 'codeDecode':
        return <CodeDecodeText key={activeSkillId} text={comingSoonText} />;
      default:
        return <TypewriterText key={activeSkillId} text={comingSoonText} />;
    }
  }, [animationType, activeSkillId, comingSoonText]);

  // Container animation variants per skill
  const containerVariants = useMemo(() => {
    const base = {
      initial: { opacity: 0, y: 30 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
    };
    switch (animationType) {
      case 'typewriter':
        return {
          ...base,
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
        };
      case 'glitch':
        return {
          ...base,
          initial: { opacity: 0, scale: 0.95 },
          animate: { opacity: 1, scale: 1 },
        };
      case 'wave':
        return {
          ...base,
          initial: { opacity: 0, y: 50 },
          animate: { opacity: 1, y: 0 },
        };
      case 'brushReveal':
        return {
          ...base,
          initial: { opacity: 0, x: -40 },
          animate: { opacity: 1, x: 0 },
        };
      case 'codeDecode':
        return {
          ...base,
          initial: { opacity: 0, scale: 1.05 },
          animate: { opacity: 1, scale: 1 },
        };
      default:
        return base;
    }
  }, [animationType]);

  // Subtle decorative accent per animation type
  const accentColor = useMemo(() => {
    switch (animationType) {
      case 'typewriter': return 'rgba(34,197,94,0.15)';   // green
      case 'glitch': return 'rgba(59,130,246,0.15)';      // blue
      case 'wave': return 'rgba(249,115,22,0.15)';        // orange
      case 'brushReveal': return 'rgba(168,85,247,0.15)'; // purple
      case 'codeDecode': return 'rgba(234,179,8,0.15)';   // yellow
      default: return 'rgba(255,255,255,0.08)';
    }
  }, [animationType]);

  const accentBorder = useMemo(() => {
    switch (animationType) {
      case 'typewriter': return 'rgba(34,197,94,0.25)';
      case 'glitch': return 'rgba(59,130,246,0.25)';
      case 'wave': return 'rgba(249,115,22,0.25)';
      case 'brushReveal': return 'rgba(168,85,247,0.25)';
      case 'codeDecode': return 'rgba(234,179,8,0.25)';
      default: return 'rgba(255,255,255,0.1)';
    }
  }, [animationType]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeSkillId}
        className="coming-soon-container"
        initial={containerVariants.initial}
        animate={containerVariants.animate}
        exit={containerVariants.exit}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div
          className="coming-soon-inner"
          style={{
            background: `radial-gradient(ellipse at center, ${accentColor} 0%, transparent 70%)`,
          }}
        >
          {/* Skill name label */}
          <motion.span
            className="coming-soon-skill-label"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            style={{ borderColor: accentBorder }}
          >
            {skillName}
          </motion.span>

          {/* Main coming soon text */}
          <h2 className="coming-soon-heading">
            {renderText()}
          </h2>

          {/* Subtitle */}
          <motion.p
            className="coming-soon-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            {t('comingSoonSubtitle' as any) || "We're crafting something special. Stay tuned!"}
          </motion.p>

          {/* Decorative line */}
          <motion.div
            className="coming-soon-line"
            initial={{ width: 0 }}
            animate={{ width: '80px' }}
            transition={{ delay: 1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{ backgroundColor: accentBorder }}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ComingSoonDisplay;
