import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { Toaster, toast } from 'sonner';
import {
  Award,
  Check,
  Copy,
  Cpu,
  Download,
  Github,
  Layers,
  Linkedin,
  Mail,
  ShieldCheck,
} from 'lucide-react';

import { FALLBACK_PORTFOLIO, fetchPortfolio } from './lib/api';
import {
  getAvatarCandidates,
  getResumeDownloadUrl,
  getSafeMediaUrl,
} from './lib/media';
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
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState<boolean>(() =>
    document.documentElement.classList.contains('dark')
  );
  const [activeProject, setActiveProject] = useState<ProjectData | null>(null);
  const [avatarIdx, setAvatarIdx] = useState(0);
  const [logoBroken, setLogoBroken] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);

  const avatarCandidates = useMemo(
    () => getAvatarCandidates(portfolio.profile.avatar_image),
    [portfolio.profile.avatar_image]
  );
  const currentAvatar = avatarCandidates[avatarIdx];
  const safeLogo = getSafeMediaUrl(portfolio.profile.brand_logo, '/assets/crimson-nova.png');
  const resumeHref = getResumeDownloadUrl(portfolio.profile.resume_url);

  useEffect(() => {
    setAvatarIdx(0);
  }, [portfolio.profile.avatar_image]);

  useEffect(() => {
    setLogoBroken(false);
  }, [safeLogo]);

  useEffect(() => {
    let active = true;
    void fetchPortfolio()
      .then(({ data }) => {
        if (active) {
          setPortfolio(data);
          document.title = `${data.profile.full_name} · ${data.profile.brand_name} — ${data.profile.headline}`;
        }
      })
      .finally(() => {
        if (active) setLoading(false);
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

  return (
    <div className="min-h-screen ambient-glow overflow-x-clip">
      <Toaster position="bottom-right" richColors />

      <PillNav
        brandName={portfolio.profile.brand_name}
        brandLogo={safeLogo}
        monogram={portfolio.profile.monogram}
        resumeUrl={portfolio.profile.resume_url}
        isDark={isDark}
        onToggleTheme={toggleTheme}
      />

      <main className="max-w-6xl mx-auto px-4 sm:px-8">
        {/* 1. HERO */}
        <section id="hero" className="scroll-mt-24 pt-10 sm:pt-14 pb-10 space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-8 lg:gap-12">
            {/* Left: Editorial Copy & Actions */}
            <div className="lg:col-span-7 space-y-5">
              <div>
                <p className="text-xs sm:text-sm font-mono uppercase tracking-[0.2em] text-burgundy dark:text-gold mb-2">
                  {portfolio.profile.full_name} · {portfolio.profile.brand_name}
                </p>
                <h1 className="font-display text-3xl sm:text-5xl xl:text-6xl font-bold tracking-tight text-ink leading-[1.08]">
                  {portfolio.profile.headline}
                </h1>
              </div>

              <p className="text-base sm:text-lg text-muted max-w-xl leading-relaxed">
                {portfolio.profile.subheadline}
              </p>

              {/* Primary CTAs — clean flat buttons with hover highlight, no glow */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <a
                  href="#projects"
                  className="px-6 py-3 rounded-full bg-burgundy text-[#FBF4E9] border border-burgundy hover:bg-crimson hover:border-crimson text-sm font-semibold transition-colors"
                >
                  View My Work
                </a>
                <a
                  href={resumeHref}
                  download="Saad_Ikram_CV.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-surface hover:bg-surface-2 text-ink border border-edge hover:border-gold text-sm font-semibold transition-colors"
                >
                  <Download className="w-4 h-4 text-crimson" />
                  <span>Download CV</span>
                </a>
              </div>

              {/* Direct Social Links */}
              <div className="flex flex-wrap items-center gap-2.5 pt-2">
                {portfolio.profile.github_url && (
                  <a
                    href={portfolio.profile.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
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

            {/* Right: Unified Portrait Card */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl p-5 sm:p-6 bg-surface border border-edge shadow-sm space-y-5">
                <div className="flex items-center gap-5">
                  {currentAvatar ? (
                    <img
                      src={currentAvatar}
                      alt={portfolio.profile.full_name}
                      fetchPriority="high"
                      onError={() => setAvatarIdx((i) => i + 1)}
                      className="w-28 h-32 sm:w-36 sm:h-40 rounded-2xl object-cover object-top border border-edge shrink-0"
                    />
                  ) : (
                    <div className="w-28 h-32 sm:w-36 sm:h-40 rounded-2xl bg-surface-2 border border-edge flex items-center justify-center font-display text-3xl font-bold text-burgundy dark:text-gold shrink-0">
                      {portfolio.profile.monogram}
                    </div>
                  )}
                  <div className="min-w-0 space-y-1.5">
                    <p className="font-display text-2xl font-bold text-ink leading-tight">
                      {portfolio.profile.full_name}
                    </p>
                    <p className="text-xs font-mono text-crimson">
                      BS CS · DHA Suffa University
                    </p>
                    <p className="text-xs text-muted leading-snug">
                      {portfolio.profile.location}
                    </p>
                  </div>
                </div>

                {/* Clean 2x2 Quick Specs */}
                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-edge text-xs">
                  <div className="rounded-xl p-3 bg-bg border border-edge">
                    <span className="block font-mono text-[10px] uppercase tracking-wider text-muted">
                      Focus
                    </span>
                    <span className="block font-semibold text-ink mt-0.5">
                      AI / ML &amp; Security
                    </span>
                  </div>
                  <div className="rounded-xl p-3 bg-bg border border-edge">
                    <span className="block font-mono text-[10px] uppercase tracking-wider text-muted">
                      Stack
                    </span>
                    <span className="block font-semibold text-ink mt-0.5">
                      Python · Django · React
                    </span>
                  </div>
                  <div className="rounded-xl p-3 bg-bg border border-edge">
                    <span className="block font-mono text-[10px] uppercase tracking-wider text-muted">
                      Studio
                    </span>
                    <span className="block font-semibold text-ink mt-0.5">
                      Crimson Nova (CN)
                    </span>
                  </div>
                  <div className="rounded-xl p-3 bg-bg border border-edge">
                    <span className="block font-mono text-[10px] uppercase tracking-wider text-muted">
                      Availability
                    </span>
                    <span className="block font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">
                      Open to Roles
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Crisp Tech-Stack Marquee with Soft Edge Fade */}
          <div className="marquee-mask relative overflow-hidden py-3 border-y border-edge">
            <div className="marquee-track flex items-center gap-6">
              {[...DEFAULT_MARQUEE, ...DEFAULT_MARQUEE].map((item, idx) => (
                <span
                  key={`${item}-${idx}`}
                  className="inline-flex items-center gap-3 text-xs font-mono text-muted whitespace-nowrap"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                  <span>{item}</span>
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* 2. ABOUT CRIMSON NOVA (CN) */}
        <section id="crimson-nova" className="scroll-mt-24 py-10">
          <div className="rounded-3xl p-6 sm:p-8 bg-surface border border-edge shadow-sm space-y-6">
            <div className="flex items-center gap-3.5 border-b border-edge pb-5">
              {safeLogo && !logoBroken && (
                <img
                  src={safeLogo}
                  alt="Crimson Nova emblem"
                  onError={() => setLogoBroken(true)}
                  className="w-11 h-11 rounded-2xl object-cover border border-edge shrink-0"
                />
              )}
              <div>
                <p className="text-xs font-mono uppercase tracking-widest text-crimson">
                  Engineering Identity
                </p>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink">
                  What is Crimson Nova (CN)?
                </h2>
              </div>
            </div>

            <p className="text-sm sm:text-base text-muted leading-relaxed max-w-3xl">
              <strong className="text-ink">Crimson Nova (CN)</strong> is my personal software
              engineering brand and independent build studio. It serves as the umbrella under which
              I design, ship, and deploy open-source developer tools, AI/ML pipelines, full-stack
              web platforms, and competitive hackathon products.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-2xl p-4 bg-bg border border-edge space-y-1.5">
                <div className="flex items-center gap-2 text-crimson font-mono text-xs uppercase tracking-wider">
                  <Cpu className="w-4 h-4" />
                  <span>AI &amp; Data Suite</span>
                </div>
                <p className="text-sm font-semibold text-ink">MLOps &amp; Automation Tools</p>
                <p className="text-xs text-muted leading-relaxed">
                  Home to projects like the CrimsonNova Data Suite (DataForge CLI &amp; DataRefine),
                  ERP meeting automation pipelines, and computer-vision prototypes.
                </p>
              </div>

              <div className="rounded-2xl p-4 bg-bg border border-edge space-y-1.5">
                <div className="flex items-center gap-2 text-burgundy dark:text-gold font-mono text-xs uppercase tracking-wider">
                  <Layers className="w-4 h-4" />
                  <span>Full-Stack Deployments</span>
                </div>
                <p className="text-sm font-semibold text-ink">Client &amp; Production Web Apps</p>
                <p className="text-xs text-muted leading-relaxed">
                  Used as my Vercel deployment workspace and freelance engineering identity for
                  shipping Django, React, and PostgreSQL applications.
                </p>
              </div>

              <div className="rounded-2xl p-4 bg-bg border border-edge space-y-1.5">
                <div className="flex items-center gap-2 text-crimson font-mono text-xs uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Hackathons &amp; R&amp;D</span>
                </div>
                <p className="text-sm font-semibold text-ink">Rapid Prototyping Team</p>
                <p className="text-xs text-muted leading-relaxed">
                  My team banner for national hackathons and security-minded experiments—turning
                  ideas into working live demos under tight deadlines.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. INTERACTIVE ARCHITECTURE TREE */}
        <section id="tree-workflow" className="scroll-mt-24 py-10 space-y-5">
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-crimson">
              01 / Interactive Map
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-ink mt-1">
              Architecture Tree
            </h2>
          </div>

          <Suspense
            fallback={
              <div className="w-full h-[420px] rounded-3xl border border-edge bg-surface flex items-center justify-center font-mono text-xs text-muted">
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

        {/* 4. FEATURED PROJECTS */}
        <section id="projects" className="scroll-mt-24 py-12 space-y-6">
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-crimson">
              02 / Proof of Work
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-ink mt-1">
              Featured Projects
            </h2>
          </div>

          {loading && portfolio.projects.length === 0 ? (
            <div className="rounded-3xl p-8 bg-surface border border-edge font-mono text-xs text-muted animate-pulse">
              Loading projects...
            </div>
          ) : (
            <ProjectsSection
              projects={portfolio.projects}
              filters={portfolio.project_filters}
              onOpenProject={(project) => setActiveProject(project)}
            />
          )}
        </section>

        {/* 5. EXPERIENCE & EDUCATION */}
        <section id="experience" className="scroll-mt-24 py-12 space-y-8">
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-crimson">
              03 / Background
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-ink mt-1">
              Experience, Leadership &amp; Education
            </h2>
          </div>

          {loading && portfolio.timeline.length === 0 ? (
            <div className="rounded-2xl p-6 bg-surface border border-edge font-mono text-xs text-muted animate-pulse">
              Loading timeline...
            </div>
          ) : (
            <div className="relative pl-6 space-y-5">
              <div
                aria-hidden="true"
                className="absolute left-2 top-2 bottom-2 w-0.5 bg-gradient-to-b from-crimson via-gold to-edge"
              />
              {portfolio.timeline.map((entry) => (
                <article
                  key={entry.id}
                  className="relative rounded-2xl p-5 sm:p-6 bg-surface border border-edge shadow-sm space-y-3"
                >
                  <span
                    aria-hidden="true"
                    className="absolute -left-[22px] top-7 w-3 h-3 rounded-full bg-crimson ring-4 ring-bg"
                  />

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                    <div>
                      <h3 className="font-display text-lg sm:text-xl font-bold text-ink">
                        {entry.title}
                      </h3>
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
          )}
        </section>

        {/* 6. SKILLS */}
        <section id="skills" className="scroll-mt-24 py-12 space-y-6">
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-crimson">
              04 / Technical Stack
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-ink mt-1">
              Skills &amp; Tools
            </h2>
          </div>

          {loading && portfolio.skill_groups.length === 0 ? (
            <div className="rounded-2xl p-6 bg-surface border border-edge font-mono text-xs text-muted animate-pulse">
              Loading skills...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {portfolio.skill_groups.map((grp) => (
                <div
                  key={grp.key}
                  className="rounded-2xl p-5 sm:p-6 bg-surface border border-edge shadow-sm space-y-4"
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
                            className={`px-2 py-0.5 rounded text-xs font-mono border shrink-0 ${
                              skill.tier === 'daily'
                                ? 'tier-daily'
                                : skill.tier === 'comfortable'
                                  ? 'tier-comfortable'
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
          )}
        </section>

        {/* 7. CERTIFICATIONS */}
        <CertificatesSection
          certificates={portfolio.certificates}
          credlyUrl={portfolio.profile.credly_url}
        />

        {/* 8. CONTACT */}
        <section
          id="contact"
          className="scroll-mt-24 py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
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
              className="inline-flex items-center gap-2 text-sm font-mono text-burgundy dark:text-gold hover:underline break-all"
            >
              {emailCopied ? (
                <Check className="w-4 h-4 shrink-0" />
              ) : (
                <Copy className="w-4 h-4 shrink-0" />
              )}
              <span>{portfolio.profile.email}</span>
            </button>
          </div>

          <div className="lg:col-span-7 min-w-0">
            <ContactTerminal email={portfolio.profile.email} />
          </div>
        </section>
      </main>

      {/* Structured Footer */}
      <footer className="mt-14 border-t border-edge bg-surface">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Brand Column */}
            <div className="md:col-span-5 space-y-3">
              <a href="#hero" className="inline-flex items-center gap-3">
                {safeLogo && !logoBroken && (
                  <img
                    src={safeLogo}
                    alt={`${portfolio.profile.brand_name} emblem`}
                    onError={() => setLogoBroken(true)}
                    className="w-9 h-9 rounded-full object-cover border border-edge"
                  />
                )}
                <div className="leading-tight">
                  <span className="block font-display text-lg font-bold text-ink">
                    {portfolio.profile.brand_name}
                  </span>
                  <span className="block text-[11px] font-mono text-muted">
                    {portfolio.profile.full_name}
                  </span>
                </div>
              </a>
              <p className="text-sm text-muted max-w-sm leading-relaxed">
                AI, cybersecurity, and full-stack software engineering from Karachi, Pakistan —
                shipping practical pipelines, ML tools, and web systems.
              </p>
            </div>

            {/* Navigation Column */}
            <div className="md:col-span-3 space-y-3">
              <p className="text-xs font-mono uppercase tracking-widest text-burgundy dark:text-gold">
                Navigate
              </p>
              <ul className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm text-muted">
                <li>
                  <a href="#crimson-nova" className="hover:text-ink transition-colors">
                    About CN
                  </a>
                </li>
                <li>
                  <a href="#tree-workflow" className="hover:text-ink transition-colors">
                    Tree
                  </a>
                </li>
                <li>
                  <a href="#projects" className="hover:text-ink transition-colors">
                    Projects
                  </a>
                </li>
                <li>
                  <a href="#experience" className="hover:text-ink transition-colors">
                    Experience
                  </a>
                </li>
                <li>
                  <a href="#skills" className="hover:text-ink transition-colors">
                    Skills
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-ink transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Connect & Resources Column */}
            <div className="md:col-span-4 space-y-3">
              <p className="text-xs font-mono uppercase tracking-widest text-burgundy dark:text-gold">
                Connect
              </p>
              <div className="flex flex-wrap gap-2">
                {portfolio.profile.github_url && (
                  <a
                    href={portfolio.profile.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-bg border border-edge hover:border-gold text-xs font-mono text-muted hover:text-ink transition-colors"
                  >
                    <Github className="w-3.5 h-3.5" />
                    <span>GitHub</span>
                  </a>
                )}
                {portfolio.profile.linkedin_url && (
                  <a
                    href={portfolio.profile.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-bg border border-edge hover:border-gold text-xs font-mono text-muted hover:text-ink transition-colors"
                  >
                    <Linkedin className="w-3.5 h-3.5" />
                    <span>LinkedIn</span>
                  </a>
                )}
                {portfolio.profile.credly_url && (
                  <a
                    href={portfolio.profile.credly_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-bg border border-edge hover:border-gold text-xs font-mono text-muted hover:text-ink transition-colors"
                  >
                    <Award className="w-3.5 h-3.5 text-gold" />
                    <span>Credly</span>
                  </a>
                )}
                <a
                  href={resumeHref}
                  download="Saad_Ikram_CV.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-bg border border-edge hover:border-gold text-xs font-mono text-muted hover:text-ink transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-crimson" />
                  <span>CV</span>
                </a>
              </div>

              {portfolio.profile.email && (
                <button
                  type="button"
                  onClick={() => void handleCopyEmail()}
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-muted hover:text-ink transition-colors break-all"
                >
                  {emailCopied ? (
                    <Check className="w-3.5 h-3.5 text-gold" />
                  ) : (
                    <Mail className="w-3.5 h-3.5 text-crimson" />
                  )}
                  <span>{portfolio.profile.email}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </footer>

      <CaseStudyModal project={activeProject} onClose={() => setActiveProject(null)} />
    </div>
  );
}