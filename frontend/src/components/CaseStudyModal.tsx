import { useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ExternalLink, Github, Layers, X } from 'lucide-react';
import type { ProjectData } from '../types/portfolio';
import { DURATION, MOTION_EASE } from '../lib/motion';
import { CodeBlock } from './CodeBlock';

interface CaseStudyModalProps {
  project: ProjectData | null;
  onClose: () => void;
}

export function CaseStudyModal({ project, onClose }: CaseStudyModalProps) {
  useEffect(() => {
    if (!project) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: DURATION.fast }}
          onClick={onClose}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
        >
          <motion.article
            role="dialog"
            aria-modal="true"
            aria-label={`${project.title} Case Study`}
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: DURATION.base, ease: MOTION_EASE }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-3xl max-h-[88vh] overflow-y-auto custom-scrollbar rounded-3xl bg-surface border border-edge shadow-2xl"
          >
            {/* Sticky Top Bar */}
            <div className="sticky top-0 z-10 px-6 sm:px-8 py-4 nav-glass border-b border-edge flex items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-0.5 rounded-md text-xs font-mono border border-gold/50 text-burgundy dark:text-gold bg-surface-2">
                  Case Study
                </span>
                <span className="text-xs font-mono text-muted">{project.domain_label}</span>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono text-muted hover:text-ink bg-surface-2 border border-edge transition-colors"
              >
                <span>ESC</span>
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-6 sm:p-8 space-y-8">
              {/* Header & Outcome */}
              <div className="space-y-3">
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-ink">
                  {project.title}
                </h2>
                <p className="text-base text-muted leading-relaxed">{project.tagline}</p>

                {project.outcome && (
                  <div className="p-4 rounded-2xl bg-surface-2/75 border border-gold/40 text-sm text-ink leading-relaxed">
                    <span className="font-mono text-xs uppercase tracking-wider text-burgundy dark:text-gold block mb-1">
                      Outcome
                    </span>
                    {project.outcome}
                  </div>
                )}
              </div>

              {project.cover_image && (
                <img
                  src={project.cover_image}
                  alt={project.title}
                  className="w-full max-h-80 object-cover rounded-2xl border border-edge"
                />
              )}

              {/* Problem & Solution */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="p-5 rounded-2xl bg-surface-2/55 border border-edge space-y-2">
                  <h3 className="font-display text-lg font-bold text-ink">The Problem</h3>
                  <p className="text-sm text-muted leading-relaxed">
                    {project.case_study_problem || project.overview}
                  </p>
                </div>
                <div className="p-5 rounded-2xl bg-surface-2/55 border border-edge space-y-2">
                  <h3 className="font-display text-lg font-bold text-ink">The Solution</h3>
                  <p className="text-sm text-muted leading-relaxed">
                    {project.case_study_solution || project.overview}
                  </p>
                </div>
              </div>

              {/* Architecture Flow */}
              {project.architecture_notes && (
                <div className="space-y-2.5">
                  <h3 className="font-display text-lg font-bold text-ink flex items-center gap-2">
                    <Layers className="w-4 h-4 text-crimson" />
                    System Flow
                  </h3>
                  <div className="p-4 rounded-2xl bg-surface-2/70 border border-edge font-mono text-[13px] text-ink leading-relaxed">
                    {project.architecture_notes}
                  </div>
                </div>
              )}

              {/* Key Engineering Trade-offs */}
              {project.case_study_tradeoffs.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-display text-lg font-bold text-ink">
                    Key Engineering Decisions
                  </h3>
                  <ul className="space-y-2.5">
                    {project.case_study_tradeoffs.map((point) => (
                      <li key={point} className="flex items-start gap-3 text-sm text-ink leading-relaxed">
                        <span className="w-2 h-2 rounded-full bg-gold mt-2 shrink-0" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Code Excerpt */}
              {project.code_snippet && (
                <div className="space-y-2.5">
                  <h3 className="font-display text-lg font-bold text-ink">Core Implementation</h3>
                  <CodeBlock
                    code={project.code_snippet}
                    language={project.code_language}
                    filename={project.code_filename}
                  />
                </div>
              )}

              {/* Footer Stack & Links */}
              <div className="pt-4 border-t border-edge flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-wrap gap-2">
                  {project.tech_stack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 rounded-lg text-xs font-mono bg-surface-2 text-ink border border-edge"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  {project.live_url && (
                    <a
                      href={project.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl btn-primary-cta text-xs font-semibold"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Live Demo</span>
                    </a>
                  )}
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-surface-2 hover:border-gold text-ink border border-edge text-xs font-mono transition-colors"
                    >
                      <Github className="w-3.5 h-3.5" />
                      <span>View Repo</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.article>
        </motion.div>
      )}
    </AnimatePresence>
  );
}