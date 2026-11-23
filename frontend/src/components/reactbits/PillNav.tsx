import { useState } from 'react';
import { FileText, Moon, Sun } from 'lucide-react';

interface PillNavProps {
  brandName: string;
  brandLogo: string;
  monogram: string;
  resumeUrl: string;
  isDark: boolean;
  onToggleTheme: () => void;
  onMissingResume: () => void;
}

const LINKS = [
  { label: 'Tree', href: '#tree-workflow' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
];

export function PillNav({
  brandName,
  brandLogo,
  monogram,
  resumeUrl,
  isDark,
  onToggleTheme,
  onMissingResume,
}: PillNavProps) {
  const [logoBroken, setLogoBroken] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full nav-glass border-b border-edge">
      <nav
        aria-label="Primary navigation"
        className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-4"
      >
        <a
          href="#hero"
          className="flex items-center gap-2.5 font-display text-base sm:text-lg font-bold tracking-tight text-ink hover:text-burgundy dark:hover:text-gold transition-colors"
        >
          {brandLogo && !logoBroken ? (
            <img
              src={brandLogo}
              alt={`${brandName} logo`}
              onError={() => setLogoBroken(true)}
              className="w-8 h-8 rounded-full object-cover ring-1 ring-crimson/70"
            />
          ) : (
            <span className="w-2.5 h-2.5 rounded-full bg-gold ring-2 ring-crimson/60" />
          )}
          <span className="hidden sm:inline">{brandName}</span>
          <span className="sm:hidden">{monogram}</span>
        </a>

        <div className="hidden md:flex items-center gap-1">
          {LINKS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="px-3.5 py-1.5 rounded-full text-sm font-medium text-muted hover:text-ink hover:bg-surface-2 transition-colors"
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {resumeUrl ? (
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium bg-surface-2 hover:bg-burgundy hover:text-[#FBF4E9] text-ink border border-edge hover:border-gold transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>CV</span>
            </a>
          ) : (
            <button
              type="button"
              onClick={onMissingResume}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium bg-surface-2 hover:border-gold text-ink border border-edge transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-crimson" />
              <span>CV</span>
            </button>
          )}

          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="w-9 h-9 rounded-full bg-surface-2 border border-edge hover:border-gold flex items-center justify-center text-burgundy dark:text-gold transition-colors"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </nav>
    </header>
  );
}