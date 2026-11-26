import { useEffect, useState } from 'react';
import { Download, Menu, Moon, Sun, X } from 'lucide-react';
import { getResumeDownloadUrl, getSafeMediaUrl } from '../../lib/media';

interface PillNavProps {
  brandName: string;
  brandLogo: string;
  monogram: string;
  resumeUrl: string;
  isDark: boolean;
  onToggleTheme: () => void;
}

const LINKS = [
  { label: 'About', href: '#crimson-nova', id: 'crimson-nova' },
  { label: 'Tree', href: '#tree-workflow', id: 'tree-workflow' },
  { label: 'Projects', href: '#projects', id: 'projects' },
  { label: 'Experience', href: '#experience', id: 'experience' },
  { label: 'Skills', href: '#skills', id: 'skills' },
  { label: 'Contact', href: '#contact', id: 'contact' },
];

export function PillNav({
  brandName,
  brandLogo,
  monogram,
  resumeUrl,
  isDark,
  onToggleTheme,
}: PillNavProps) {
  const [logoBroken, setLogoBroken] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>('');
  const [scrolled, setScrolled] = useState(false);

  const safeLogo = getSafeMediaUrl(brandLogo, '/assets/crimson-nova.png');
  const downloadHref = getResumeDownloadUrl(resumeUrl);

  useEffect(() => {
    setLogoBroken(false);
  }, [safeLogo]);

  useEffect(() => {
    let ticking = false;

    const updateScrollState = () => {
      const y = window.scrollY;
      setScrolled(y > 12);

      if (y < 220) {
        setActiveId('');
        return;
      }

      const offset = y + 140;
      let current = '';
      for (const link of LINKS) {
        const el = document.getElementById(link.id);
        if (el && el.offsetTop <= offset) {
          current = link.id;
        }
      }
      setActiveId(current);
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        updateScrollState();
        ticking = false;
      });
    };

    updateScrollState();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mobileOpen]);

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-200 ${
        scrolled
          ? 'nav-glass border-b border-edge shadow-[0_6px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_28px_rgba(0,0,0,0.35)]'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <nav
        aria-label="Primary navigation"
        className="max-w-6xl mx-auto px-4 sm:px-8 h-16 sm:h-[72px] flex items-center justify-between gap-4"
      >
        {/* Brand Lockup */}
        <a href="#hero" className="group flex items-center gap-3 shrink-0">
          {safeLogo && !logoBroken ? (
            <img
              src={safeLogo}
              alt={`${brandName} logo`}
              onError={() => setLogoBroken(true)}
              className="w-9 h-9 rounded-full object-cover border border-edge group-hover:border-gold transition-colors"
            />
          ) : (
            <span className="w-9 h-9 rounded-full bg-surface-2 border border-edge flex items-center justify-center font-display text-xs font-bold text-burgundy dark:text-gold">
              {monogram}
            </span>
          )}
          <div className="leading-tight">
            <span className="block font-display text-base font-bold tracking-tight text-ink group-hover:text-burgundy dark:group-hover:text-gold transition-colors">
              {brandName}
            </span>
            <span className="hidden sm:block text-[10px] font-mono uppercase tracking-[0.18em] text-muted">
              Saad Ikram
            </span>
          </div>
        </a>

        {/* Centered Pill Navigation Rail */}
        <div className="hidden md:flex items-center gap-1 p-1 rounded-full bg-surface/90 border border-edge">
          {LINKS.map((item) => {
            const isActive = activeId === item.id;
            return (
              <a
                key={item.href}
                href={item.href}
                aria-current={isActive ? 'location' : undefined}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-burgundy text-[#FBF4E9] dark:bg-surface-2 dark:text-gold'
                    : 'text-muted hover:text-ink hover:bg-surface-2/80'
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          <a
            href={downloadHref}
            download="Saad_Ikram_CV.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-mono font-medium bg-surface hover:bg-burgundy hover:text-[#FBF4E9] text-ink border border-edge hover:border-burgundy dark:hover:border-gold transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CV</span>
          </a>

          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="w-9 h-9 rounded-full bg-surface border border-edge hover:border-gold flex items-center justify-center text-burgundy dark:text-gold transition-colors"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
            className="md:hidden w-9 h-9 rounded-full bg-surface border border-edge hover:border-gold flex items-center justify-center text-ink transition-colors"
          >
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown */}
      {mobileOpen && (
        <div className="md:hidden border-t border-edge bg-surface px-4 py-3 space-y-1 shadow-lg">
          {LINKS.map((item) => {
            const isActive = activeId === item.id;
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-surface-2 text-burgundy dark:text-gold'
                    : 'text-ink hover:bg-surface-2'
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </div>
      )}
    </header>
  );
}