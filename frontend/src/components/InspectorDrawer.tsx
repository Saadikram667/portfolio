import { useEffect, useState } from 'react';
import { Drawer } from 'vaul';
import { BookOpen, ExternalLink, FileText, Github, X } from 'lucide-react';
import type { InspectorSelection, ProjectData } from '../types/portfolio';
import { CodeBlock } from './CodeBlock';
import { ContactTerminal } from './ContactTerminal';

interface InspectorDrawerProps {
  selection: InspectorSelection | null;
  onClose: () => void;
  onOpenCaseStudy: (project: ProjectData) => void;
}

export function InspectorDrawer({
  selection,
  onClose,
  onOpenCaseStudy,
}: InspectorDrawerProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [cachedSelection, setCachedSelection] = useState<InspectorSelection | null>(selection);
  const [projectTab, setProjectTab] = useState<'overview' | 'code' | 'arch'>('code');
  const [skillsJsonView, setSkillsJsonView] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    if (selection) {
      setCachedSelection(selection);
      setProjectTab('code');
      setSkillsJsonView(false);
    }
  }, [selection]);

  const active = selection ?? cachedSelection;

  const title =
    active?.kind === 'project'
      ? active.project.title
      : active?.kind === 'about'
        ? active.profile.full_name
        : active?.kind === 'skills'
          ? 'Technical Stack'
          : active?.kind === 'timeline'
            ? active.entry.title
            : active?.kind === 'contact'
              ? 'connect.sh'
              : 'Inspector';

  return (
    <Drawer.Root
      open={Boolean(selection)}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      direction={isMobile ? 'bottom' : 'right'}
    >
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/55 backdrop-blur-xs z-50" />
        <Drawer.Content
          className={`fixed z-50 drawer-glass border-edge flex flex-col outline-none shadow-2xl ${
            isMobile
              ? 'inset-x-0 bottom-0 max-h-[88vh] rounded-t-3xl border-t'
              : 'top-0 right-0 bottom-0 w-full max-w-[540px] border-l'
          }`}
        >
          {isMobile && <div className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-edge" />}

          {/* Header */}
          <div className="px-6 py-5 border-b border-edge flex items-center justify-between gap-4">
            <div>
              <Drawer.Title className="font-display text-xl font-bold text-ink">
                {title}
              </Drawer.Title>
              <Drawer.Description className="text-xs font-mono text-muted mt-0.5">
                Node Inspector
              </Drawer.Description>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close drawer"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-mono text-muted hover:text-ink bg-surface-2 border border-edge transition-colors"
            >
              <span>ESC</span>
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 custom-scrollbar">
            {active?.kind === 'project' && (
              <>
                <div className="space-y-2.5">
                  <span className="inline-block px-2.5 py-0.5 rounded-md text-xs font-mono border border-gold/50 text-burgundy dark:text-gold bg-surface-2/70">
                    {active.project.domain_label}
                  </span>
                  <p className="text-sm text-muted leading-relaxed">{active.project.tagline}</p>
                  {active.project.outcome && (
                    <p className="text-[13px] text-ink pl-3 border-l-2 border-gold leading-relaxed">
                      {active.project.outcome}
                    </p>
                  )}
                </div>

                {active.project.metrics.length > 0 && (
                  <div className="grid grid-cols-2 gap-3">
                    {active.project.metrics.map((m) => (
                      <div
                        key={m.label}
                        className="rounded-2xl p-4 bg-surface-2/65 border border-gold/35 text-center"
                      >
                        <div className="font-display text-xl font-bold text-gold-numeral">
                          {m.value}
                        </div>
                        <div className="text-xs font-mono text-muted mt-1">{m.label}</div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-1 p-1 rounded-xl bg-surface-2/80 border border-edge">
                  {(['overview', 'code', 'arch'] as const).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setProjectTab(tab)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        projectTab === tab
                          ? 'bg-burgundy text-[#FBF4E9]'
                          : 'text-muted hover:text-ink'
                      }`}
                    >
                      {tab === 'overview'
                        ? 'Overview'
                        : tab === 'code'
                          ? 'Code Snippet'
                          : 'Architecture'}
                    </button>
                  ))}
                </div>

                {projectTab === 'overview' && (
                  <p className="text-sm text-ink leading-relaxed">{active.project.overview}</p>
                )}

                {projectTab === 'code' && (
                  <CodeBlock
                    code={active.project.code_snippet}
                    language={active.project.code_language}
                    filename={active.project.code_filename}
                  />
                )}

                {projectTab === 'arch' && (
                  <div className="p-4 rounded-2xl bg-surface-2/65 border border-edge text-[13px] font-mono text-ink leading-relaxed">
                    {active.project.architecture_notes ||
                      'Add architecture notes in Django Unfold Admin.'}
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  {active.project.tech_stack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 rounded-lg text-xs font-mono bg-surface-2 text-ink border border-edge"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  {active.project.has_case_study && (
                    <button
                      type="button"
                      onClick={() => {
                        const target = active.project;
                        onClose();
                        onOpenCaseStudy(target);
                      }}
                      className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl btn-primary-cta text-sm font-semibold"
                    >
                      <BookOpen className="w-4 h-4" />
                      Read Full Case Study
                    </button>
                  )}
                  {active.project.live_url && (
                    <a
                      href={active.project.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-surface-2 hover:border-gold text-ink border border-edge text-sm font-semibold transition-colors"
                    >
                      <ExternalLink className="w-4 h-4 text-crimson" />
                      Live Demo
                    </a>
                  )}
                  {active.project.github_url && (
                    <a
                      href={active.project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-surface-2 hover:border-gold text-ink border border-edge text-sm font-semibold transition-colors"
                    >
                      <Github className="w-4 h-4" />
                      View GitHub
                    </a>
                  )}
                </div>
              </>
            )}

            {active?.kind === 'about' && (
              <div className="space-y-5">
                <p className="text-sm font-mono text-crimson">{active.profile.headline}</p>
                <p className="text-sm text-ink leading-relaxed">
                  {active.profile.bio || active.profile.subheadline}
                </p>
                {active.profile.work_style_note && (
                  <div className="p-4 rounded-2xl bg-surface-2/65 border border-edge space-y-1.5">
                    <p className="text-xs font-mono uppercase tracking-wider text-burgundy dark:text-gold">
                      How I Work
                    </p>
                    <p className="text-sm text-ink leading-relaxed">
                      {active.profile.work_style_note}
                    </p>
                  </div>
                )}
                {active.profile.resume_url && (
                  <a
                    href={active.profile.resume_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl btn-primary-cta text-sm font-semibold"
                  >
                    <FileText className="w-4 h-4" />
                    Download CV (PDF)
                  </a>
                )}
              </div>
            )}

            {active?.kind === 'timeline' && (
              <div className="space-y-4">
                <div className="text-xs font-mono text-crimson">
                  {active.entry.date_range} · {active.entry.category_label}
                </div>
                <p className="text-sm font-semibold text-muted">{active.entry.organization}</p>
                <p className="text-sm text-ink leading-relaxed">{active.entry.summary}</p>
                <ul className="space-y-2.5 pt-1">
                  {active.entry.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-2.5 text-sm text-ink">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold mt-2 shrink-0" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {active?.kind === 'skills' && (
              <div className="space-y-5">
                <div className="flex items-center gap-1 p-1 rounded-xl bg-surface-2/80 border border-edge">
                  <button
                    type="button"
                    onClick={() => setSkillsJsonView(false)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold ${
                      !skillsJsonView ? 'bg-burgundy text-[#FBF4E9]' : 'text-muted'
                    }`}
                  >
                    Tiers & Usage
                  </button>
                  <button
                    type="button"
                    onClick={() => setSkillsJsonView(true)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold ${
                      skillsJsonView ? 'bg-burgundy text-[#FBF4E9]' : 'text-muted'
                    }`}
                  >
                    skills.json
                  </button>
                </div>

                {skillsJsonView ? (
                  <CodeBlock
                    code={JSON.stringify(active.groups, null, 2)}
                    language="json"
                    filename="skills.json"
                  />
                ) : (
                  <div className="space-y-5">
                    {active.groups.map((grp) => (
                      <div key={grp.key} className="space-y-3">
                        <h4 className="font-display font-bold text-ink">{grp.label}</h4>
                        <div className="space-y-2.5">
                          {grp.skills.map((s) => (
                            <div
                              key={s.id}
                              className="p-3.5 rounded-xl bg-surface-2/60 border border-edge space-y-1.5"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-sm font-semibold text-ink">{s.name}</span>
                                <span
                                  className={`px-2 py-0.5 rounded text-xs font-mono border ${
                                    s.tier === 'daily'
                                      ? 'bg-crimson/15 text-crimson border-crimson/35'
                                      : s.tier === 'comfortable'
                                        ? 'bg-gold/15 text-burgundy dark:text-gold border-gold/40'
                                        : 'bg-surface text-muted border-edge'
                                  }`}
                                >
                                  {s.tier_label}
                                </span>
                              </div>
                              {s.used_in.length > 0 && (
                                <p className="text-xs font-mono text-muted">
                                  Used in: {s.used_in.join(', ')}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {active?.kind === 'contact' && (
              <ContactTerminal email={active.profile.email} compact />
            )}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}