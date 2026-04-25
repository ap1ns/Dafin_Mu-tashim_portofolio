import React from 'react';
import { motion, useInView, Variants } from 'framer-motion';

interface SplitTextProps {
  text: string;
  className?: string;
  /** Animation trigger once or every scroll */
  once?: boolean;
  /** Delay between each word in seconds */
  stagger?: number;
  /** Initial delay before first word */
  delay?: number;
  /** Duration per word */
  duration?: number;
  /** 'word' splits per word, 'char' splits per character */
  splitBy?: 'word' | 'char';
  /** Viewport margin to trigger earlier/later */
  margin?: string;
  as?: keyof React.JSX.IntrinsicElements;
}

const SplitText: React.FC<SplitTextProps> = ({
  text,
  className = '',
  once = false,
  stagger = 0.06,
  delay = 0,
  duration = 0.65,
  splitBy = 'word',
  margin = '-80px',
  as: Tag = 'span',
}) => {
  const ref = React.useRef<HTMLElement>(null);
  const isInView = useInView(ref as React.RefObject<Element>, {
    once,
    margin: margin as any,
  });

  const tokens = splitBy === 'word' ? text.split(' ') : text.split('');

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  const wordVariants: Variants = {
    hidden: {
      y: '110%',
      opacity: 0,
      rotateX: 15,
    },
    visible: {
      y: '0%',
      opacity: 1,
      rotateX: 0,
      transition: {
        duration,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <motion.span
      ref={ref as React.RefObject<HTMLSpanElement>}
      className={`inline-block ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      aria-label={text}
    >
      {tokens.map((token, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden"
          style={{ verticalAlign: 'bottom' }}
          aria-hidden="true"
        >
          <motion.span
            className="inline-block"
            variants={wordVariants}
          >
            {token}
            {splitBy === 'word' && i < tokens.length - 1 ? '\u00a0' : ''}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
};

export default SplitText;
