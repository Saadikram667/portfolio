import { useState } from 'react';
import { BookOpen, ExternalLink, Github } from 'lucide-react';
import type { DomainFilter, ProjectData } from '../types/portfolio';
import { CodeBlock } from './CodeBlock';

interface ProjectsSectionProps {
  projects: ProjectData[];
  filters: DomainFilter[];
  onOpenProject: (project: ProjectData) => void;
}

export function ProjectsSection({
  projects,
  filters,
  onOpenProject,
}: ProjectsSectionProps) {
  const [activeDomain, setActiveDomain] = useState<string>('all');

  const filtered =
    activeDomain === 'all'
      ? projects
      : projects.filter((p) => p.domain === activeDomain);

  return (
    <div className="space-y-6">
      {/* Domain Filter Pills */}
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
                  ? 'bg-burgundy text-[#FBF4E9] border-gold'
                  : 'bg-surface border-edge text-muted hover:text-ink hover:border-gold/60'
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Full-Width Split Project Cards */}
      <div className="space-y-6">
        {filtered.map((project, idx) => (
          <article
            key={project.id}
            className="rounded-3xl p-6 sm:p-8 bg-surface border border-edge hover:border-gold/80 transition-colors shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-7 items-center"
          >
            {/* Left Column: Summary, Outcome, Metrics, Stack & Links */}
            <div className="lg:col-span-6 space-y-4">
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-mono font-bold text-muted">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <span className="px-2.5 py-0.5 rounded-md text-xs font-mono border border-gold/50 text-burgundy dark:text-gold bg-surface-2">
                  {project.domain_label}
                </span>
                {project.has_case_study && (
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-mono bg-crimson/10 text-crimson border border-crimson/30">
                    Case Study
                  </span>
                )}
              </div>

              <div>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-ink">
                  {project.title}
                </h3>
                <p className="text-sm sm:text-[15px] text-muted mt-2 leading-relaxed">
                  {project.tagline}
                </p>
              </div>

              {project.outcome && (
                <p className="text-[13px] text-ink pl-3 border-l-2 border-gold leading-relaxed">
                  <span className="font-mono text-xs uppercase tracking-wider text-burgundy dark:text-gold mr-1.5">
                    Outcome:
                  </span>
                  {project.outcome}
                </p>
              )}

              {project.metrics.length > 0 && (
                <div className="flex flex-wrap gap-3 pt-1">
                  {project.metrics.map((m) => (
                    <div
                      key={m.label}
                      className="px-3.5 py-2 rounded-xl bg-surface-2/80 border border-edge"
                    >
                      <span className="font-display font-bold text-base text-gold-numeral mr-2">
                        {m.value}
                      </span>
                      <span className="text-xs font-mono text-muted">{m.label}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap gap-1.5 pt-1">
                {project.tech_stack.map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 rounded-md text-xs font-mono bg-surface-2 text-ink border border-edge"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => onOpenProject(project)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl btn-primary-cta text-xs font-semibold"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{project.has_case_study ? 'Read Case Study' : 'Architecture & Details'}</span>
                </button>
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
                    <span>GitHub</span>
                  </a>
                )}
              </div>
            </div>

            {/* Right Column: Uploaded Screenshot OR Live Syntax-Highlighted Code Window */}
            <div className="lg:col-span-6">
              {project.cover_image ? (
                <button
                  type="button"
                  onClick={() => onOpenProject(project)}
                  className="block w-full overflow-hidden rounded-2xl border border-edge hover:border-gold transition-colors"
                >
                  <img
                    src={project.cover_image}
                    alt={`${project.title} preview`}
                    loading="lazy"
                    className="w-full h-64 sm:h-72 object-cover"
                  />
                </button>
              ) : (
                <CodeBlock
                  code={project.code_snippet || project.architecture_notes}
                  language={project.code_language || 'python'}
                  filename={project.code_filename || 'overview.py'}
                />
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}