import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import { DURATION, MOTION_EASE } from '../../lib/motion';

export interface DockItem {
  label: string;
  href?: string;
  onClick?: () => void;
  icon: ReactNode;
}

export function Dock({ items }: { items: DockItem[] }) {
  return (
    <div
      aria-label="Quick channels dock"
      className="surface-glass inline-flex items-center gap-2 px-3 py-2 rounded-2xl border border-edge shadow-xl"
    >
      {items.map((item) => {
        const content = (
          <motion.span
            whileHover={{ y: -4, scale: 1.08 }}
            whileTap={{ scale: 0.96 }}
            transition={{ duration: DURATION.fast, ease: MOTION_EASE }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface-2/80 hover:bg-burgundy hover:text-[#FBF4E9] text-ink border border-edge hover:border-gold transition-colors text-xs font-mono"
          >
            {item.icon}
            <span className="hidden sm:inline">{item.label}</span>
          </motion.span>
        );

        if (item.href) {
          return (
            <a
              key={item.label}
              href={item.href}
              target={item.href.startsWith('http') ? '_blank' : undefined}
              rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              aria-label={item.label}
            >
              {content}
            </a>
          );
        }

        return (
          <button
            key={item.label}
            type="button"
            onClick={item.onClick}
            aria-label={item.label}
          >
            {content}
          </button>
        );
      })}
    </div>
  );
}