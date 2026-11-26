import { useState } from 'react';
import { BookOpen, ExternalLink, Github } from 'lucide-react';
import type { DomainFilter, ProjectData } from '../types/portfolio';
import { getSafeMediaUrl } from '../lib/media';
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
  const [brokenCovers, setBrokenCovers] = useState<Record<string, boolean>>({});

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
                  : 'bg-surface border-edge text-muted hover:text-ink hover:border-gold'
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Full-Width Split Project Cards */}
      {filtered.length === 0 ? (
        <div className="rounded-3xl p-8 bg-surface border border-edge text-center font-mono text-xs text-muted">
          No projects in this category yet.
        </div>
      ) : (
        <div className="space-y-6">
          {filtered.map((project, idx) => {
            const safeCover = getSafeMediaUrl(project.cover_image);
            const showCover = Boolean(safeCover) && !brokenCovers[project.id];

            return (
              <article
                key={project.id}
                className="rounded-3xl p-6 sm:p-8 bg-surface border border-edge hover:border-gold transition-colors shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-7 items-center"
              >
                {/* Left Column */}
                <div className="lg:col-span-6 space-y-4">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="text-xs font-mono font-bold text-muted">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md text-xs font-mono border border-edge text-burgundy dark:text-gold bg-surface-2">
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
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-surface-2 text-ink border border-edge hover:bg-burgundy hover:text-[#FBF4E9] hover:border-burgundy dark:hover:bg-crimson/20 dark:hover:text-gold dark:hover:border-gold text-xs font-medium transition-colors"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>
                        {project.has_case_study ? 'Read Case Study' : 'Architecture & Details'}
                      </span>
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

                {/* Right Column: Cover Screenshot OR Syntax-Highlighted Code */}
                <div className="lg:col-span-6 min-w-0">
                  {showCover ? (
                    <button
                      type="button"
                      onClick={() => onOpenProject(project)}
                      className="block w-full overflow-hidden rounded-2xl border border-edge hover:border-gold transition-colors"
                    >
                      <img
                        src={safeCover}
                        alt={`${project.title} preview`}
                        loading="lazy"
                        onError={() =>
                          setBrokenCovers((prev) => ({ ...prev, [project.id]: true }))
                        }
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
            );
          })}
        </div>
      )}
    </div>
  );
}