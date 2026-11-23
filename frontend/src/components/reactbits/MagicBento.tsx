import { useState, type MouseEvent } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, BookOpen, ExternalLink, Github, Terminal } from 'lucide-react';
import type { DomainFilter, ProjectData } from '../../types/portfolio';
import { DURATION, MOTION_EASE } from '../../lib/motion';

interface MagicBentoProps {
  projects: ProjectData[];
  filters: DomainFilter[];
  onInspect: (project: ProjectData) => void;
  onOpenCaseStudy: (project: ProjectData) => void;
}

export function MagicBento({
  projects,
  filters,
  onInspect,
  onOpenCaseStudy,
}: MagicBentoProps) {
  const [activeDomain, setActiveDomain] = useState<string>('all');

  const filtered =
    activeDomain === 'all'
      ? projects
      : projects.filter((p) => p.domain === activeDomain);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        {filters.map((f) => {
          const active = activeDomain === f.key;
          return (
            <button
              key={f.key}
              type="button"
              onClick={() => setActiveDomain(f.key)}
              className={`px-4 py-1.5 rounded-full text-xs font-mono transition-colors border ${
                active
                  ? 'bg-burgundy text-[#FBF4E9] border-gold shadow-md'
                  : 'bg-surface border-edge text-muted hover:text-ink hover:border-gold/60'
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((project, idx) => {
          const fullRow = filtered.length === 1 || (filtered.length === 3 && idx === 0);
          return (
            <BentoCard
              key={project.id}
              project={project}
              spanClass={fullRow ? 'md:col-span-2' : 'md:col-span-1'}
              onInspect={() => onInspect(project)}
              onOpenCaseStudy={() => onOpenCaseStudy(project)}
            />
          );
        })}
      </div>
    </div>
  );
}

function BentoCard({
  project,
  spanClass,
  onInspect,
  onOpenCaseStudy,
}: {
  project: ProjectData;
  spanClass: string;
  onInspect: () => void;
  onOpenCaseStudy: () => void;
}) {
  const [spot, setSpot] = useState({ x: 50, y: 50, active: false });

  function handleMove(e: MouseEvent<HTMLElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    setSpot({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
      active: true,
    });
  }

  return (
    <motion.article
      layout
      onMouseMove={handleMove}
      onMouseLeave={() => setSpot((s) => ({ ...s, active: false }))}
      transition={{ duration: DURATION.base, ease: MOTION_EASE }}
      className={`${spanClass} group relative rounded-3xl p-6 sm:p-7 bg-surface border border-edge hover:border-gold transition-colors overflow-hidden flex flex-col justify-between gap-5 shadow-sm`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: spot.active ? 1 : 0,
          background: `radial-gradient(380px circle at ${spot.x}% ${spot.y}%, rgba(217,180,74,0.12), transparent 65%)`,
        }}
      />

      <div className="relative z-10 space-y-4">
        {/* Header Row */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md text-xs font-mono border border-gold/50 text-burgundy dark:text-gold bg-surface-2/70">
              {project.domain_label}
            </span>
            {project.has_case_study && (
              <span className="px-2.5 py-1 rounded-md text-xs font-mono bg-crimson/10 text-crimson border border-crimson/30">
                Case Study
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onInspect}
            aria-label={`Inspect ${project.title}`}
            className="inline-flex items-center gap-1 text-xs font-mono text-muted hover:text-crimson transition-colors"
          >
            <span>Inspect</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* Visual Preview: Screenshot if uploaded, otherwise a sharp mini code/architecture preview */}
        {project.cover_image ? (
          <button
            type="button"
            onClick={project.has_case_study ? onOpenCaseStudy : onInspect}
            className="block w-full overflow-hidden rounded-2xl border border-edge"
          >
            <img
              src={project.cover_image}
              alt={`${project.title} preview`}
              width={720}
              height={360}
              loading="lazy"
              className="w-full h-48 object-cover group-hover:scale-[1.02] transition-transform duration-300"
            />
          </button>
        ) : (
          <button
            type="button"
            onClick={project.has_case_study ? onOpenCaseStudy : onInspect}
            className="block w-full text-left rounded-2xl overflow-hidden border border-[#3C222A] bg-[#12080B] hover:border-gold/70 transition-colors"
          >
            <div className="px-3.5 py-2 bg-[#1B0D11] border-b border-[#3C222A] flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#E03150]" />
                <span className="w-2 h-2 rounded-full bg-[#D9B44A]" />
                <span className="text-xs font-mono text-[#C2AAAB] ml-1">
                  {project.code_filename || 'architecture.txt'}
                </span>
              </div>
              <Terminal className="w-3.5 h-3.5 text-[#D9B44A]" />
            </div>
            <pre className="p-3.5 text-xs font-mono text-[#F4E8D8]/90 leading-relaxed overflow-hidden line-clamp-3">
              <code>{project.code_snippet || project.architecture_notes}</code>
            </pre>
          </button>
        )}

        {/* Title & Outcome */}
        <div>
          <button
            type="button"
            onClick={project.has_case_study ? onOpenCaseStudy : onInspect}
            className="text-left"
          >
            <h3 className="font-display text-2xl font-bold text-ink group-hover:text-burgundy dark:group-hover:text-gold transition-colors">
              {project.title}
            </h3>
          </button>
          <p className="text-sm text-muted mt-1.5 leading-relaxed">{project.tagline}</p>

          {project.outcome && (
            <p className="text-[13px] text-ink mt-3 pl-3 border-l-2 border-gold leading-relaxed">
              <span className="font-mono text-xs uppercase tracking-wider text-burgundy dark:text-gold mr-1.5">
                Outcome:
              </span>
              {project.outcome}
            </p>
          )}
        </div>
      </div>

      {/* Footer: Stack + Direct Repo / Live / Case Study Actions */}
      <div className="relative z-10 space-y-4 pt-4 border-t border-edge">
        <div className="flex flex-wrap gap-1.5">
          {project.tech_stack.slice(0, 6).map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 rounded-md text-xs font-mono bg-surface-2/80 text-ink border border-edge"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {project.has_case_study && (
            <button
              type="button"
              onClick={onOpenCaseStudy}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl btn-primary-cta text-xs font-semibold"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Read Case Study</span>
            </button>
          )}
          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-2 hover:border-gold text-ink border border-edge text-xs font-mono transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-crimson" />
              <span>Live Demo</span>
            </a>
          )}
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-2 hover:border-gold text-ink border border-edge text-xs font-mono transition-colors"
            >
              <Github className="w-3.5 h-3.5" />
              <span>Repo</span>
            </a>
          )}
          {!project.has_case_study && (
            <button
              type="button"
              onClick={onInspect}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-2 hover:border-gold text-ink border border-edge text-xs font-mono transition-colors"
            >
              <span>Inspect Code & Architecture</span>
            </button>
          )}
        </div>
      </div>
    </motion.article>
  );
}