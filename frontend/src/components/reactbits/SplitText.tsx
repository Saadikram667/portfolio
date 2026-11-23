import { motion } from 'motion/react';
import { DURATION, MOTION_EASE } from '../../lib/motion';

interface SplitTextProps {
  text: string;
  className?: string;
}

export function SplitText({ text, className = '' }: SplitTextProps) {
  const words = text.split(' ');

  return (
    <h1 className={className} aria-label={text}>
      {words.map((word, idx) => (
        <span key={`${word}-${idx}`} className="inline-block overflow-hidden mr-[0.28em] pb-1">
          <motion.span
            className="inline-block"
            initial={{ y: '105%', opacity: 0 }}
            animate={{ y: '0%', opacity: 1 }}
            transition={{
              duration: DURATION.slow,
              delay: idx * 0.06,
              ease: MOTION_EASE,
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </h1>
  );
}