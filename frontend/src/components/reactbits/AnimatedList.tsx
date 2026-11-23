import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import { DURATION, MOTION_EASE } from '../../lib/motion';

interface AnimatedListProps<T> {
  items: T[];
  keyExtractor: (item: T) => string | number;
  renderItem: (item: T, index: number) => ReactNode;
  className?: string;
}

export function AnimatedList<T>({
  items,
  keyExtractor,
  renderItem,
  className = 'space-y-4',
}: AnimatedListProps<T>) {
  return (
    <div className={className}>
      {items.map((item, idx) => (
        <motion.div
          key={keyExtractor(item)}
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{
            duration: DURATION.base,
            delay: Math.min(idx * 0.06, 0.24),
            ease: MOTION_EASE,
          }}
        >
          {renderItem(item, idx)}
        </motion.div>
      ))}
    </div>
  );
}