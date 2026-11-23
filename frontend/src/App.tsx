import { lazy, Suspense, useEffect, useState } from 'react';
import { Toaster, toast } from 'sonner';
import {
  Award,
  Check,
  Copy,
  FileText,
  Github,
  Linkedin,
  Mail,
} from 'lucide-react';

import { FALLBACK_PORTFOLIO, fetchPortfolio } from './lib/api';
import type { PortfolioPayload, ProjectData } from './types/portfolio';

import { PillNav } from './components/reactbits/PillNav';
import { ProjectsSection } from './components/ProjectsSection';
import { CaseStudyModal } from './components/CaseStudyModal';
import { CertificatesSection } from './components/CertificatesSection';
import { ContactTerminal } from './components/ContactTerminal';

const TreeCanvas = lazy(() =>
  import('./components/TreeCanvas').then((m) => ({ default: m.TreeCanvas }))
);

const DEFAULT_MARQUEE = [
  'Python',
  'Django',
  'TypeScript',
  'React',
  'TensorFlow',
  'YOLO',
  'Celery & Redis',
  'Supabase',
  'PostgreSQL',
  'ONVIF',
  'Cybersecurity',
  'Arduino',
];

export default function App() {
  const [portfolio, setPortfolio] = useState<PortfolioPayload>(FALLBACK_PORTFOLIO);
  const [isDark, setIsDark] = useState<boolean>(() =>
    document.documentElement.classList.contains('dark')
  );
  const [activeProject, setActiveProject] = useState<ProjectData | null>(null);
  const [avatarBroken, setAvatarBroken] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);

  useEffect(() => {
    let active = true;
    void fetchPortfolio().then(({ data }) => {
      if (active) {
        setPortfolio(data);
        document.title = `${data.profile.full_name} · ${data.profile.brand_name} — ${data.profile.headline}`;
      }
    });
    return () => {
      active = false;
    };
  }, []);

  function toggleTheme() {
    const nextDark = !isDark;
    setIsDark(nextDark);
    document.documentElement.classList.toggle('dark', nextDark);
    localStorage.setItem('portfolio-theme', nextDark ? 'dark' : 'light');
  }

  function jumpToSection(selector: string) {
    const el = document.querySelector(selector);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  async function handleCopyEmail() {
    if (!portfolio.profile.email) {
      jumpToSection('#contact');
      return;
    }
    try {
      await navigator.clipboard.writeText(portfolio.profile.email);
      setEmailCopied(true);
      toast.success(`Copied ${portfolio.profile.email}`);
      window.setTimeout(() => setEmailCopied(false), 1800);
    } catch {
      jumpToSection('#contact');
    }
  }

  function handleMissingResume() {
    toast.info('Upload your PDF CV in Django Unfold Admin (Profile -> Resume file) to enable 1-click download.');
  }

  const marqueeItems =
    portfolio.skill_groups.length > 0
      ? portfolio.skill_groups.flatMap((g) => g.skills.map((s) => s.name))
      : DEFAULT_MARQUEE;

  return (
    <div className="min-h-screen ambient-glow">
      <Toaster position="bottom-right" richColors />

      <PillNav
        brandName={portfolio.profile.brand_name}
        brandLogo={portfolio.profile.brand_logo}
        monogram={portfolio.profile.monogram}
        resumeUrl={portfolio.profile.resume_url}
        isDark={isDark}
        onToggleTheme={toggleTheme}
        onMissingResume={handleMissingResume}
      />

      <main className="max-w-6xl mx-auto px-5 sm:px-8">
        {/* 1. HERO (Clean Split + Portrait & profile.json Card) */}
        <section
          id="hero"
          className="scroll-mt-24 pt-12 sm:pt-16 pb-10 space-y-12"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-10">
            <div className="lg:col-span-7 space-y-5">
              {portfolio.profile.is_available && (
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono bg-surface border border-gold/50 text-burgundy dark:text-gold">
                  <span className="w-2 h-2 rounded-full bg-crimson animate-pulse" />
                  <span>{portfolio.profile.status_text}</span>
                </div>
              )}

              <div>
                <p className="text-xs sm:text-sm font-mono uppercase tracking-[0.2em] text-burgundy dark:text-gold mb-2">
                  {portfolio.profile.full_name} · {portfolio.profile.brand_name}
                </p>
                <h1 className="font-display text-4xl sm:text-5xl xl:text-6xl font-bold tracking-tight text-ink leading-[1.08]">
                  {portfolio.profile.headline}
                </h1>
              </div>

              <p className="text-base sm:text-lg text-muted max-w-xl leading-relaxed">
                {portfolio.profile.subheadline}
              </p>

              {/* Primary CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <a
                  href="#projects"
                  className="px-6 py-3 rounded-full btn-primary-cta text-sm font-semibold"
                >
                  View My Work
                </a>
                {portfolio.profile.resume_url ? (
                  <a
                    href={portfolio.profile.resume_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-surface hover:bg-surface-2 text-ink border border-edge hover:border-gold text-sm font-semibold transition-colors"
                  >
                    <FileText className="w-4 h-4 text-crimson" />
                    <span>Download CV</span>
                  </a>
                ) : (
                  <a
                    href="#contact"
                    className="px-5 py-3 rounded-full bg-surface hover:bg-surface-2 text-ink border border-edge hover:border-gold text-sm font-semibold transition-colors"
                  >
                    Get in Touch
                  </a>
                )}
              </div>

              {/* Direct Social Icons (Clean replacement for Footer Dock) */}
              <div className="flex flex-wrap items-center gap-2.5 pt-2">
                {portfolio.profile.github_url && (
                  <a
                    href={portfolio.profile.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface border border-edge hover:border-gold text-xs font-mono text-muted hover:text-ink transition-colors"
                  >
                    <Github className="w-4 h-4" />
                    <span>GitHub</span>
                  </a>
                )}
                {portfolio.profile.linkedin_url && (
                  <a
                    href={portfolio.profile.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface border border-edge hover:border-gold text-xs font-mono text-muted hover:text-ink transition-colors"
                  >
                    <Linkedin className="w-4 h-4" />
                    <span>LinkedIn</span>
                  </a>
                )}
                {portfolio.profile.credly_url && (
                  <a
                    href={portfolio.profile.credly_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Credly"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface border border-edge hover:border-gold text-xs font-mono text-muted hover:text-ink transition-colors"
                  >
                    <Award className="w-4 h-4 text-gold" />
                    <span>Credly</span>
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => void handleCopyEmail()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface border border-edge hover:border-gold text-xs font-mono text-muted hover:text-ink transition-colors"
                >
                  {emailCopied ? (
                    <Check className="w-4 h-4 text-gold" />
                  ) : (
                    <Mail className="w-4 h-4 text-crimson" />
                  )}
                  <span>{emailCopied ? 'Copied!' : 'Copy Email'}</span>
                </button>
              </div>
            </div>

            {/* Right Column: Portrait + Compact profile.json Card */}
            <div className="lg:col-span-5 space-y-4">
              <div className="rounded-3xl p-5 bg-surface border border-edge shadow-sm flex items-center gap-4">
                {portfolio.profile.avatar_image && !avatarBroken ? (
                  <img
                    src={portfolio.profile.avatar_image}
                    alt={portfolio.profile.full_name}
                    onError={() => setAvatarBroken(true)}
                    className="w-20 h-20 rounded-2xl object-cover object-top ring-2 ring-gold/60 shrink-0"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-surface-2 border border-gold/50 flex items-center justify-center font-display text-2xl font-bold text-burgundy dark:text-gold shrink-0">
                    {portfolio.profile.monogram}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-display text-xl font-bold text-ink truncate">
                    {portfolio.profile.full_name}
                  </p>
                  <p className="text-xs font-mono text-crimson mt-0.5">
                    President · TVCSS (DSU)
                  </p>
                  <p className="text-xs text-muted mt-1 truncate">
                    {portfolio.profile.location}
                  </p>
                </div>
              </div>

              {/* profile.json Terminal Card */}
              <div className="rounded-3xl overflow-hidden bg-[#150A0E] text-[#F4E8D8] terminal-card-frame">
                <div className="px-4 py-2.5 bg-[#201016] border-b border-[#4A2933] flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#E03150]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#D9B44A]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#7A555C]" />
                  <span className="ml-2 text-xs font-mono text-[#C2AAAB]">profile.json</span>
                </div>
                <div className="p-5 font-mono text-[13px] leading-relaxed space-y-1">
                  <div>
                    <span className="text-[#D9B44A]">"brand"</span>:{' '}
                    <span className="text-[#F4E8D8]">"{portfolio.profile.brand_name}"</span>,
                  </div>
                  <div>
                    <span className="text-[#D9B44A]">"degree"</span>:{' '}
                    <span className="text-[#F4E8D8]">"BS CS · 5th Sem (3.86 CGPA)"</span>,
                  </div>
                  <div>
                    <span className="text-[#D9B44A]">"focus"</span>: [
                    <span className="text-[#E03150]">"AI / ML"</span>,{' '}
                    <span className="text-[#E03150]">"Cybersecurity"</span>,{' '}
                    <span className="text-[#E03150]">"Full-Stack"</span>],
                  </div>
                  <div>
                    <span className="text-[#D9B44A]">"experience"</span>:{' '}
                    <span className="text-[#F4E8D8]">"3 yrs coding · 2 hackathons"</span>,
                  </div>
                  <div>
                    <span className="text-[#D9B44A]">"status"</span>:{' '}
                    <span className="text-emerald-400">"open_to_opportunities"</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Scrolling Tech-Stack Marquee */}
          <div className="relative overflow-hidden py-3 border-y border-edge">
            <div className="marquee-track flex items-center gap-6">
              {[...marqueeItems, ...marqueeItems].map((item, idx) => (
                <span
                  key={`${item}-${idx}`}
                  className="inline-flex items-center gap-3 text-xs font-mono text-muted whitespace-nowrap"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-gold/70" />
                  <span>{item}</span>
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* 2. INTERACTIVE ARCHITECTURE TREE */}
        <section id="tree-workflow" className="scroll-mt-24 py-12 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="text-xs font-mono uppercase tracking-widest text-crimson">
                01 / Interactive Map
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-ink mt-1">
                Architecture Tree
              </h2>
            </div>
            <p className="text-sm text-muted max-w-md">
              Expand any branch to explore projects, experience, or stack—click a project leaf to
              inspect its full case study.
            </p>
          </div>

          <Suspense
            fallback={
              <div className="w-full h-[520px] rounded-3xl border border-edge bg-surface flex items-center justify-center font-mono text-xs text-muted">
                Loading architecture tree...
              </div>
            }
          >
            <TreeCanvas
              portfolio={portfolio}
              onSelectProject={(project) => setActiveProject(project)}
              onJumpToSection={jumpToSection}
            />
          </Suspense>
        </section>

        {/* 3. FEATURED PROJECTS (Full-Width Split Cards) */}
        <section id="projects" className="scroll-mt-24 py-14 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <p className="text-xs font-mono uppercase tracking-widest text-crimson">
                02 / Proof of Work
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-ink mt-1">
                Featured Projects
              </h2>
            </div>
            <p className="text-sm text-muted max-w-md">
              AI diagnostics, Django automation, computer vision, MLOps, and embedded hardware.
            </p>
          </div>

          <ProjectsSection
            projects={portfolio.projects}
            filters={portfolio.project_filters}
            onOpenProject={(project) => setActiveProject(project)}
          />
        </section>

        {/* 4. EXPERIENCE & EDUCATION (All Bullets Directly Visible) */}
        <section id="experience" className="scroll-mt-24 py-14 space-y-8">
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-crimson">
              03 / Background
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-ink mt-1">
              Experience, Leadership & Education
            </h2>
          </div>

          <div className="relative pl-6 space-y-5">
            <div
              aria-hidden="true"
              className="absolute left-2 top-2 bottom-2 w-0.5 bg-gradient-to-b from-crimson via-gold to-edge"
            />
            {portfolio.timeline.map((entry) => (
              <article
                key={entry.id}
                className="relative rounded-2xl p-6 bg-surface border border-edge shadow-sm space-y-3"
              >
                <span
                  aria-hidden="true"
                  className="absolute -left-[22px] top-7 w-3 h-3 rounded-full bg-crimson ring-4 ring-bg"
                />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                  <div>
                    <h3 className="font-display text-xl font-bold text-ink">{entry.title}</h3>
                    <p className="text-sm font-medium text-muted">{entry.organization}</p>
                  </div>
                  <span className="self-start sm:self-auto px-2.5 py-1 rounded-md text-xs font-mono bg-surface-2 text-burgundy dark:text-gold border border-edge">
                    {entry.date_range}
                  </span>
                </div>

                <p className="text-sm text-muted leading-relaxed">{entry.summary}</p>

                {entry.highlights.length > 0 && (
                  <ul className="space-y-1.5 pt-1">
                    {entry.highlights.map((bullet) => (
                      <li
                        key={bullet}
                        className="flex items-start gap-2.5 text-sm text-ink leading-relaxed"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-gold mt-2 shrink-0" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            ))}
          </div>
        </section>

        {/* 5. COMPACT TIERED SKILLS (No Nested Boxes, No JSON Toggle) */}
        <section id="skills" className="scroll-mt-24 py-14 space-y-6">
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-crimson">
              04 / Technical Stack
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-ink mt-1">
              Skills & Tools
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {portfolio.skill_groups.map((grp) => (
              <div
                key={grp.key}
                className="rounded-2xl p-6 bg-surface border border-edge shadow-sm space-y-4"
              >
                <h3 className="font-display text-lg font-bold text-ink pb-2 border-b border-edge">
                  {grp.label}
                </h3>
                <ul className="space-y-3">
                  {grp.skills.map((skill) => (
                    <li key={skill.id} className="space-y-0.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-semibold text-ink">{skill.name}</span>
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-mono border ${
                            skill.tier === 'daily'
                              ? 'bg-crimson/10 text-crimson border-crimson/35'
                              : skill.tier === 'comfortable'
                                ? 'bg-gold/15 text-burgundy dark:text-gold border-gold/40'
                                : 'bg-surface-2 text-muted border-edge'
                          }`}
                        >
                          {skill.tier_label}
                        </span>
                      </div>
                      {skill.used_in.length > 0 && (
                        <p className="text-xs font-mono text-muted">
                          Used in: {skill.used_in.join(', ')}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* 6. CERTIFICATIONS & HACKATHONS */}
        <CertificatesSection
          certificates={portfolio.certificates}
          credlyUrl={portfolio.profile.credly_url}
        />

        {/* 7. CONTACT */}
        <section
          id="contact"
          className="scroll-mt-24 py-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
        >
          <div className="lg:col-span-5 space-y-5">
            <div>
              <p className="text-xs font-mono uppercase tracking-widest text-crimson">
                06 / Direct Channel
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-ink mt-1">
                Get in Touch
              </h2>
            </div>

            {portfolio.profile.work_style_note && (
              <div className="rounded-2xl p-5 bg-surface border border-edge space-y-2 shadow-sm">
                <p className="text-xs font-mono uppercase tracking-wider text-burgundy dark:text-gold">
                  How I Work
                </p>
                <p className="text-sm text-ink leading-relaxed">
                  {portfolio.profile.work_style_note}
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={() => void handleCopyEmail()}
              className="inline-flex items-center gap-2 text-sm font-mono text-burgundy dark:text-gold hover:underline"
            >
              {emailCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{portfolio.profile.email}</span>
            </button>
          </div>

          <div className="lg:col-span-7">
            <ContactTerminal email={portfolio.profile.email} />
          </div>
        </section>
      </main>

      {/* Minimal 1-Line Footer */}
      <footer className="mt-8 border-t border-edge py-8 px-5">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-muted">
          <p>
            © {new Date().getFullYear()} {portfolio.profile.full_name} · {portfolio.profile.brand_name}
          </p>
          <div className="flex items-center gap-5">
            {portfolio.profile.github_url && (
              <a
                href={portfolio.profile.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-ink transition-colors"
              >
                GitHub
              </a>
            )}
            {portfolio.profile.linkedin_url && (
              <a
                href={portfolio.profile.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-ink transition-colors"
              >
                LinkedIn
              </a>
            )}
            {portfolio.profile.resume_url && (
              <a
                href={portfolio.profile.resume_url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-ink transition-colors"
              >
                CV
              </a>
            )}
            <a href="#hero" className="hover:text-ink transition-colors">
              Back to top ↑
            </a>
          </div>
        </div>
      </footer>

      <CaseStudyModal project={activeProject} onClose={() => setActiveProject(null)} />
    </div>
  );
}