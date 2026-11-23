import { useState } from 'react';
import { Command, FileText, Moon, Sun } from 'lucide-react';
import { motion } from 'motion/react';
import { DURATION, MOTION_EASE } from '../../lib/motion';

interface PillNavProps {
  brandName: string;
  brandLogo: string;
  monogram: string;
  resumeUrl: string;
  isDark: boolean;
  onToggleTheme: () => void;
  onNavigate: (selector: string) => void;
  onOpenCommand: () => void;
  onMissingResume: () => void;
}

const LINKS = [
  { label: 'Tree', target: '#tree-workflow' },
  { label: 'Projects', target: '#projects' },
  { label: 'Journey', target: '#journey' },
  { label: 'Certs', target: '#certificates' },
  { label: 'Contact', target: '#contact' },
];

export function PillNav({
  brandName,
  brandLogo,
  monogram,
  resumeUrl,
  isDark,
  onToggleTheme,
  onNavigate,
  onOpenCommand,
  onMissingResume,
}: PillNavProps) {
  const [logoBroken, setLogoBroken] = useState(false);

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: DURATION.slow, ease: MOTION_EASE }}
      className="fixed top-4 inset-x-0 mx-auto z-40 w-[94%] max-w-5xl"
    >
      <nav
        aria-label="Primary navigation"
        className="nav-glass rounded-full px-4 sm:px-5 py-2 border border-edge shadow-xl flex items-center justify-between gap-4"
      >
        <button
          type="button"
          onClick={() => onNavigate('#hero')}
          className="flex items-center gap-2.5 font-display text-base sm:text-lg font-bold tracking-tight text-ink hover:text-burgundy dark:hover:text-gold transition-colors"
        >
          {brandLogo && !logoBroken ? (
            <img
              src={brandLogo}
              alt={`${brandName} logo`}
              onError={() => setLogoBroken(true)}
              className="w-8 h-8 rounded-full object-cover ring-1 ring-crimson/70 shadow-sm"
            />
          ) : (
            <span className="w-2.5 h-2.5 rounded-full bg-gold ring-2 ring-crimson/60" />
          )}
          <span className="hidden sm:inline">{brandName}</span>
          <span className="sm:hidden">{monogram}</span>
        </button>

        <div className="hidden md:flex items-center gap-1">
          {LINKS.map((item) => (
            <button
              key={item.target}
              type="button"
              onClick={() => onNavigate(item.target)}
              className="px-3.5 py-1.5 rounded-full text-sm font-medium text-muted hover:text-ink hover:bg-surface-2 transition-colors"
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {resumeUrl ? (
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium bg-surface-2 hover:bg-burgundy hover:text-[#FBF4E9] text-ink border border-edge hover:border-gold transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>CV</span>
            </a>
          ) : (
            <button
              type="button"
              onClick={onMissingResume}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium bg-surface-2 hover:border-gold text-ink border border-edge transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-crimson" />
              <span>CV</span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenCommand}
            aria-label="Open command palette"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono text-muted hover:text-ink bg-surface-2/80 border border-edge transition-colors"
          >
            <Command className="w-3.5 h-3.5 text-crimson" />
            <span>K</span>
          </button>

          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="w-9 h-9 rounded-full bg-surface-2/80 border border-edge hover:border-gold flex items-center justify-center text-burgundy dark:text-gold transition-colors"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </nav>
    </motion.header>
  );
}