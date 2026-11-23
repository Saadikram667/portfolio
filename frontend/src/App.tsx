import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Toaster, toast } from 'sonner';
import {
  ArrowDown,
  Award,
  Clock,
  Code2,
  Command,
  FileText,
  Github,
  Linkedin,
  Mail,
  MapPin,
} from 'lucide-react';

import { FALLBACK_PORTFOLIO, fetchPortfolio } from './lib/api';
import {
  initLenisGsap,
  prefersReducedMotion,
  scrollToSection,
  setScrollLocked,
} from './lib/lenisGsap';
import { GSAP_EASE } from './lib/motion';
import type { InspectorSelection, PortfolioPayload, ProjectData } from './types/portfolio';

import { CSBackground } from './components/CSBackground';
import { InspectorDrawer } from './components/InspectorDrawer';
import { CaseStudyModal } from './components/CaseStudyModal';
import { CertificatesSection } from './components/CertificatesSection';
import { ContactTerminal } from './components/ContactTerminal';
import { CommandPalette } from './components/CommandPalette';
import { CodeBlock } from './components/CodeBlock';
import { PillNav } from './components/reactbits/PillNav';
import { SplitText } from './components/reactbits/SplitText';
import { MagicBento } from './components/reactbits/MagicBento';
import { AnimatedList } from './components/reactbits/AnimatedList';
import { Dock } from './components/reactbits/Dock';

const TreeCanvas = lazy(() =>
  import('./components/TreeCanvas').then((m) => ({ default: m.TreeCanvas }))
);

gsap.registerPlugin(ScrollTrigger);

function formatLocalTime(): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(new Date());
}

export default function App() {
  const [portfolio, setPortfolio] = useState<PortfolioPayload>(FALLBACK_PORTFOLIO);
  const [isDark, setIsDark] = useState<boolean>(() =>
    document.documentElement.classList.contains('dark')
  );
  const [selection, setSelection] = useState<InspectorSelection | null>(null);
  const [caseStudy, setCaseStudy] = useState<ProjectData | null>(null);
  const [commandOpen, setCommandOpen] = useState(false);
  const [skillsMode, setSkillsMode] = useState<'tiers' | 'json'>('tiers');
  const [localTime, setLocalTime] = useState<string>(() => formatLocalTime());
  const [avatarBroken, setAvatarBroken] = useState(false);

  const treeSectionRef = useRef<HTMLElement | null>(null);
  const timelineLineRef = useRef<HTMLDivElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const timer = window.setInterval(() => setLocalTime(formatLocalTime()), 15000);
    return () => window.clearInterval(timer);
  }, []);

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

  useEffect(() => {
    const cleanupLenis = initLenisGsap();
    if (prefersReducedMotion()) return cleanupLenis;

    const ctx = gsap.context(() => {
      if (progressBarRef.current) {
        gsap.fromTo(
          progressBarRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: document.documentElement,
              start: 'top top',
              end: 'bottom bottom',
              scrub: 0.15,
            },
          }
        );
      }

      if (timelineLineRef.current) {
        gsap.fromTo(
          timelineLineRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: '#journey',
              start: 'top 75%',
              end: 'bottom 80%',
              scrub: 0.5,
            },
          }
        );
      }

      if (treeSectionRef.current) {
        gsap.fromTo(
          '.tree-reveal-target',
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: GSAP_EASE,
            scrollTrigger: {
              trigger: treeSectionRef.current,
              start: 'top 82%',
              once: true,
            },
          }
        );
      }
    });

    return () => {
      ctx.revert();
      cleanupLenis();
    };
  }, []);

  useEffect(() => {
    setScrollLocked(Boolean(selection) || Boolean(caseStudy) || commandOpen);
  }, [selection, caseStudy, commandOpen]);

  function toggleTheme() {
    const nextDark = !isDark;
    setIsDark(nextDark);
    document.documentElement.classList.toggle('dark', nextDark);
    localStorage.setItem('portfolio-theme', nextDark ? 'dark' : 'light');
  }

  async function handleCopyEmail() {
    if (!portfolio.profile.email) {
      scrollToSection('#contact');
      return;
    }
    try {
      await navigator.clipboard.writeText(portfolio.profile.email);
      toast.success(`Copied ${portfolio.profile.email}`);
    } catch {
      scrollToSection('#contact');
    }
  }

  function handleMissingResume() {
    toast.info('Upload Saad_Ikram_Resume.pdf in Django Unfold Admin (Profile -> Resume file) to enable 1-click CV download.');
  }

  const heroStats =
    portfolio.profile.hero_stats.length > 0
      ? portfolio.profile.hero_stats
      : [
          { value: '3.86', label: 'CS CGPA · 5th Sem' },
          { value: '3 yrs', label: 'Coding Experience' },
          { value: '2', label: 'Hackathon Builds' },
        ];

  const dockItems = [
    ...(portfolio.profile.github_url
      ? [{ label: 'GitHub', href: portfolio.profile.github_url, icon: <Github className="w-4 h-4" /> }]
      : []),
    ...(portfolio.profile.linkedin_url
      ? [
          {
            label: 'LinkedIn',
            href: portfolio.profile.linkedin_url,
            icon: <Linkedin className="w-4 h-4" />,
          },
        ]
      : []),
    ...(portfolio.profile.credly_url
      ? [
          {
            label: 'Credly',
            href: portfolio.profile.credly_url,
            icon: <Award className="w-4 h-4" />,
          },
        ]
      : []),
    {
      label: 'Copy Email',
      onClick: () => void handleCopyEmail(),
      icon: <Mail className="w-4 h-4" />,
    },
    ...(portfolio.profile.resume_url
      ? [
          {
            label: 'Download CV',
            href: portfolio.profile.resume_url,
            icon: <FileText className="w-4 h-4" />,
          },
        ]
      : []),
  ];

  return (
    <div className="relative min-h-screen ambient-glow">
      <div
        ref={progressBarRef}
        aria-hidden="true"
        className="fixed top-0 left-0 right-0 h-[2px] origin-left crimson-gold-gradient z-50 pointer-events-none"
      />

      <CSBackground />
      <div className="grain-overlay" aria-hidden="true" />
      <Toaster position="bottom-right" richColors />

      <PillNav
        brandName={portfolio.profile.brand_name}
        brandLogo={portfolio.profile.brand_logo}
        monogram={portfolio.profile.monogram}
        resumeUrl={portfolio.profile.resume_url}
        isDark={isDark}
        onToggleTheme={toggleTheme}
        onNavigate={scrollToSection}
        onOpenCommand={() => setCommandOpen(true)}
        onMissingResume={handleMissingResume}
      />

      <main className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8">
        {/* 1. HERO SECTION */}
        <section
          id="hero"
          className="min-h-[82vh] grid grid-cols-1 lg:grid-cols-12 items-center gap-10 pt-28 pb-12"
        >
          <div className="lg:col-span-7 flex flex-col items-start">
            {portfolio.profile.is_available && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono bg-surface border border-gold/50 text-burgundy dark:text-gold mb-5 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-crimson animate-pulse" />
                <span>{portfolio.profile.status_text}</span>
              </div>
            )}

            <p className="text-xs sm:text-sm font-mono uppercase tracking-[0.2em] text-burgundy dark:text-gold mb-2.5">
              {portfolio.profile.full_name} · {portfolio.profile.brand_name}
            </p>

            <SplitText
              text={portfolio.profile.headline}
              className="font-display text-4xl sm:text-5xl xl:text-6xl font-bold tracking-tight text-ink leading-[1.08]"
            />

            <p className="text-base sm:text-lg text-muted max-w-xl mt-5 leading-relaxed">
              {portfolio.profile.subheadline}
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-8">
              <button
                type="button"
                onClick={() => scrollToSection('#projects')}
                className="px-6 py-3 rounded-full btn-primary-cta text-sm font-semibold"
              >
                View Shipped Work
              </button>
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
                <button
                  type="button"
                  onClick={() => scrollToSection('#contact')}
                  className="px-5 py-3 rounded-full bg-surface hover:bg-surface-2 text-ink border border-edge hover:border-gold text-sm font-semibold transition-colors"
                >
                  Open connect.sh
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => scrollToSection('#tree-workflow')}
              className="mt-10 inline-flex items-center gap-2 text-xs font-mono text-muted hover:text-crimson transition-colors"
            >
              <ArrowDown className="w-4 h-4" />
              <span>Explore interactive architecture tree</span>
            </button>
          </div>

          {/* Right Column: Portrait + Crimson Nova Identity Snapshot Card */}
          <div className="lg:col-span-5">
            <div className="surface-glass rounded-3xl p-6 sm:p-7 border border-edge shadow-xl space-y-5 relative overflow-hidden">
              <div className="flex items-center justify-between pb-4 border-b border-edge">
                <div className="flex items-center gap-3">
                  {portfolio.profile.avatar_image && !avatarBroken ? (
                    <img
                      src={portfolio.profile.avatar_image}
                      alt={portfolio.profile.full_name}
                      onError={() => setAvatarBroken(true)}
                      className="w-12 h-12 rounded-2xl object-cover object-top ring-2 ring-gold/60"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-2xl bg-surface-2 border border-gold/50 flex items-center justify-center font-display font-bold text-burgundy dark:text-gold">
                      {portfolio.profile.monogram}
                    </div>
                  )}
                  <div>
                    <p className="font-display font-bold text-ink text-base leading-tight">
                      {portfolio.profile.full_name}
                    </p>
                    <p className="text-xs font-mono text-crimson">
                      President · TVCSS (DSU)
                    </p>
                  </div>
                </div>
                <div className="inline-flex items-center gap-1.5 text-xs font-mono text-muted">
                  <Clock className="w-3.5 h-3.5 text-gold" />
                  <span>{localTime}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {heroStats.slice(0, 3).map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl p-3.5 bg-surface-2/70 border border-edge text-center"
                  >
                    <div className="font-display text-xl sm:text-2xl font-bold text-gold-numeral">
                      {stat.value}
                    </div>
                    <div className="text-xs font-mono text-muted mt-1 leading-tight">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2.5 text-[13px] font-mono">
                {portfolio.profile.location && (
                  <div className="flex items-center justify-between gap-2 text-muted">
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-crimson" />
                      <span>Base</span>
                    </span>
                    <span className="text-ink truncate">{portfolio.profile.location}</span>
                  </div>
                )}
                <div className="flex items-center justify-between gap-2 text-muted">
                  <span>Track</span>
                  <span className="text-ink">AI · Cybersecurity · Vibe Coding</span>
                </div>
              </div>

              <div className="pt-4 border-t border-edge flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setSelection({
                      kind: 'about',
                      profile: portfolio.profile,
                      timeline: portfolio.timeline,
                    })
                  }
                  className="text-xs font-mono text-burgundy dark:text-gold hover:underline"
                >
                  Read Bio & Working Style →
                </button>
                <button
                  type="button"
                  onClick={() => setCommandOpen(true)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono bg-surface-2 border border-edge text-muted hover:text-ink transition-colors"
                >
                  <Command className="w-3.5 h-3.5 text-crimson" />
                  <span>K</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 2. INTERACTIVE TREE WORKFLOW */}
        <section ref={treeSectionRef} id="tree-workflow" className="py-12 lg:py-16 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="text-xs font-mono uppercase tracking-widest text-crimson">
                01 / Interactive Node Graph
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-ink mt-1">
                Architecture Tree Workflow
              </h2>
            </div>
            <p className="text-sm text-muted max-w-md">
              Expand any parent branch to explore connected nodes, hover for full outcomes, or click
              a leaf node to inspect code and architecture.
            </p>
          </div>

          <div className="tree-reveal-target">
            <Suspense
              fallback={
                <div className="w-full h-[540px] rounded-3xl border border-edge bg-surface/70 flex items-center justify-center font-mono text-xs text-muted">
                  Initializing interactive node canvas...
                </div>
              }
            >
              <TreeCanvas portfolio={portfolio} onInspect={setSelection} />
            </Suspense>
          </div>
        </section>

        {/* 3. FEATURED PROJECTS */}
        <section id="projects" className="py-14 lg:py-16 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <p className="text-xs font-mono uppercase tracking-widest text-crimson">
                02 / Proof of Work
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-ink mt-1">
                Shipped Projects & Case Studies
              </h2>
            </div>
            <p className="text-sm text-muted max-w-md">
              Five end-to-end builds spanning AI diagnostics, MLOps, Django automation, computer
              vision, and embedded hardware.
            </p>
          </div>

          <MagicBento
            projects={portfolio.projects}
            filters={portfolio.project_filters}
            onInspect={(project) => setSelection({ kind: 'project', project })}
            onOpenCaseStudy={(project) => setCaseStudy(project)}
          />
        </section>

        {/* 4. JOURNEY & TIERED SKILLS */}
        <section id="journey" className="py-14 lg:py-16 grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7 space-y-6">
            <div>
              <p className="text-xs font-mono uppercase tracking-widest text-crimson">
                03 / Career & Education
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-ink mt-1">
                Internships, Leadership & Education
              </h2>
            </div>

            <div className="relative pl-7">
              <div
                aria-hidden="true"
                className="absolute left-2 top-2 bottom-2 w-0.5 bg-edge/70"
              />
              <div
                ref={timelineLineRef}
                aria-hidden="true"
                className="absolute left-2 top-2 bottom-2 w-0.5 origin-top bg-gradient-to-b from-crimson to-gold"
              />

              <AnimatedList
                items={portfolio.timeline}
                keyExtractor={(item) => item.id}
                renderItem={(entry) => (
                  <button
                    type="button"
                    onClick={() => setSelection({ kind: 'timeline', entry })}
                    className="relative w-full text-left rounded-2xl p-5 sm:p-6 bg-surface border border-edge hover:border-gold transition-colors shadow-sm"
                  >
                    <span
                      aria-hidden="true"
                      className="absolute -left-[25px] top-7 w-3 h-3 rounded-full bg-crimson ring-4 ring-bg"
                    />
                    <span className="text-xs font-mono text-burgundy dark:text-gold">
                      {entry.date_range} · {entry.category_label}
                    </span>
                    <h3 className="font-display text-xl font-bold text-ink mt-1">
                      {entry.title}
                    </h3>
                    <p className="text-sm font-medium text-muted">{entry.organization}</p>
                    <p className="text-sm text-muted mt-2 leading-relaxed">{entry.summary}</p>
                  </button>
                )}
              />
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-mono uppercase tracking-widest text-crimson">
                  04 / Stack
                </p>
                <h2 className="font-display text-3xl font-bold text-ink mt-1">Skills</h2>
              </div>

              <div className="inline-flex p-1 rounded-xl bg-surface border border-edge text-xs font-mono">
                <button
                  type="button"
                  onClick={() => setSkillsMode('tiers')}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    skillsMode === 'tiers' ? 'bg-burgundy text-[#FBF4E9]' : 'text-muted'
                  }`}
                >
                  Tiers
                </button>
                <button
                  type="button"
                  onClick={() => setSkillsMode('json')}
                  className={`px-3 py-1 rounded-lg inline-flex items-center gap-1 transition-colors ${
                    skillsMode === 'json' ? 'bg-burgundy text-[#FBF4E9]' : 'text-muted'
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5" />
                  JSON
                </button>
              </div>
            </div>

            {skillsMode === 'json' ? (
              <div className="max-h-[520px] overflow-y-auto rounded-2xl custom-scrollbar">
                <CodeBlock
                  code={JSON.stringify(portfolio.skill_groups, null, 2)}
                  language="json"
                  filename="skills.json"
                />
              </div>
            ) : (
              <AnimatedList
                items={portfolio.skill_groups}
                keyExtractor={(g) => g.key}
                renderItem={(grp) => (
                  <div className="rounded-2xl p-5 bg-surface border border-edge space-y-3">
                    <h3 className="font-display font-bold text-ink">{grp.label}</h3>
                    <div className="space-y-2.5">
                      {grp.skills.map((skill) => (
                        <div
                          key={skill.id}
                          className="p-3 rounded-xl bg-surface-2/60 border border-edge/80 space-y-1"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-sm font-semibold text-ink">{skill.name}</span>
                            <span
                              className={`px-2 py-0.5 rounded text-xs font-mono border ${
                                skill.tier === 'daily'
                                  ? 'bg-crimson/15 text-crimson border-crimson/35'
                                  : skill.tier === 'comfortable'
                                    ? 'bg-gold/15 text-burgundy dark:text-gold border-gold/40'
                                    : 'bg-surface text-muted border-edge'
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
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              />
            )}
          </div>
        </section>

        {/* 5. CERTIFICATIONS & HACKATHONS GALLERY */}
        <CertificatesSection
          certificates={portfolio.certificates}
          credlyUrl={portfolio.profile.credly_url}
        />

        {/* 6. WORKING STYLE + CONTACT TERMINAL */}
        <section id="contact" className="py-14 lg:py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 space-y-5">
            <div>
              <p className="text-xs font-mono uppercase tracking-widest text-crimson">
                06 / Direct Channel
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-ink mt-1">
                Start a Conversation
              </h2>
            </div>

            {portfolio.profile.work_style_note && (
              <div className="rounded-2xl p-5 bg-surface border border-edge space-y-2 shadow-sm">
                <p className="text-xs font-mono uppercase tracking-wider text-burgundy dark:text-gold">
                  What I’m Like to Work With
                </p>
                <p className="text-sm text-ink leading-relaxed">
                  {portfolio.profile.work_style_note}
                </p>
              </div>
            )}

            <p className="text-sm text-muted leading-relaxed">
              Messages sent through <span className="font-mono text-ink">connect.sh</span> are
              validated, rate-limited, and delivered directly to my private studio inbox.
            </p>
          </div>

          <div className="lg:col-span-7">
            <ContactTerminal email={portfolio.profile.email} />
          </div>
        </section>
      </main>

      <footer className="relative z-10 pb-10 pt-4 flex flex-col items-center gap-4 px-4">
        <Dock items={dockItems} />
        <p className="text-xs font-mono text-muted">
          © {new Date().getFullYear()} {portfolio.profile.full_name} · {portfolio.profile.brand_name}
        </p>
      </footer>

      <InspectorDrawer
        selection={selection}
        onClose={() => setSelection(null)}
        onOpenCaseStudy={(project) => setCaseStudy(project)}
      />

      <CaseStudyModal project={caseStudy} onClose={() => setCaseStudy(null)} />

      <CommandPalette
        open={commandOpen}
        onOpenChange={setCommandOpen}
        portfolio={portfolio}
        isDark={isDark}
        onToggleTheme={toggleTheme}
        onNavigate={scrollToSection}
        onInspect={setSelection}
      />
    </div>
  );
}