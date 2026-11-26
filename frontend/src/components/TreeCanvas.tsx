import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  Handle,
  Position,
  type Node,
  type Edge,
  type NodeProps,
  type ReactFlowInstance,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import {
  ChevronRight,
  FolderGit2,
  Layers,
  RotateCcw,
  Terminal,
  User,
} from 'lucide-react';
import type { PortfolioPayload, ProjectData } from '../types/portfolio';

type BranchKey = 'projects' | 'experience' | 'skills';
type NodeKind = 'root' | 'branch' | 'leaf';

interface PortfolioNodeData extends Record<string, unknown> {
  label: string;
  subtitle?: string;
  badge?: string;
  kind: NodeKind;
  active?: boolean;
  icon?: 'about' | 'projects' | 'skills' | 'contact';
  onSelect: () => void;
}

type PortfolioFlowNode = Node<PortfolioNodeData, 'portfolio'>;

function PortfolioNode({ data }: NodeProps<PortfolioFlowNode>) {
  const Icon =
    data.icon === 'about'
      ? User
      : data.icon === 'projects'
        ? FolderGit2
        : data.icon === 'skills'
          ? Layers
          : data.icon === 'contact'
            ? Terminal
            : null;

  return (
    <div
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          data.onSelect();
        }
      }}
      className={`group rounded-2xl px-4 py-3.5 cursor-pointer transition-all border select-none ${
        data.kind === 'root'
          ? 'w-[240px] text-center bg-surface border-gold shadow-md'
          : data.kind === 'leaf'
            ? 'w-[340px] bg-surface border-edge hover:border-gold hover:shadow-md'
            : data.active
              ? 'w-[235px] bg-surface border-crimson shadow-md'
              : 'w-[235px] bg-surface border-edge hover:border-gold'
      }`}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!bg-gold !w-2 !h-2 !border-0 !pointer-events-none"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-crimson !w-2 !h-2 !border-0 !pointer-events-none"
      />

      {data.kind === 'leaf' && data.badge && (
        <div className="mb-1.5">
          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-surface-2 text-burgundy dark:text-gold border border-edge">
            {data.badge}
          </span>
        </div>
      )}

      <div className={`flex items-center gap-2 ${data.kind === 'root' ? 'justify-center' : ''}`}>
        {Icon && <Icon className="w-4 h-4 text-crimson shrink-0" />}
        <span className="font-display font-bold text-sm text-ink leading-snug line-clamp-2">
          {data.label}
        </span>
      </div>

      {data.subtitle && (
        <p className="text-xs text-muted mt-1 leading-snug line-clamp-2">
          {data.subtitle}
        </p>
      )}
    </div>
  );
}

const nodeTypes = { portfolio: PortfolioNode };

interface TreeCanvasProps {
  portfolio: PortfolioPayload;
  onSelectProject: (project: ProjectData) => void;
  onJumpToSection: (sectionId: string) => void;
}

export function TreeCanvas({
  portfolio,
  onSelectProject,
  onJumpToSection,
}: TreeCanvasProps) {
  const [expanded, setExpanded] = useState<BranchKey>('projects');
  const containerRef = useRef<HTMLDivElement | null>(null);
  const flowRef = useRef<ReactFlowInstance<PortfolioFlowNode, Edge> | null>(null);

  const handleResetView = useCallback((duration = 280) => {
    const el = containerRef.current;
    if (!el || el.clientWidth === 0 || el.clientHeight === 0) return;
    void flowRef.current?.fitView({
      padding: 0.16,
      duration,
      maxZoom: 0.96,
      minZoom: 0.35,
    });
  }, []);

  const leafItems = useMemo(() => {
    if (expanded === 'projects') {
      return portfolio.projects.map((proj) => ({
        id: `leaf-proj-${proj.id}`,
        label: proj.title,
        subtitle: proj.outcome || proj.tagline,
        badge: proj.domain_label,
        onSelect: () => onSelectProject(proj),
      }));
    }
    if (expanded === 'skills') {
      return portfolio.skill_groups.map((grp) => ({
        id: `leaf-skill-${grp.key}`,
        label: grp.label,
        subtitle: grp.skills.map((s) => s.name).slice(0, 4).join(' · '),
        badge: `${grp.skills.length} tools`,
        onSelect: () => onJumpToSection('#skills'),
      }));
    }
    return portfolio.timeline.map((entry) => ({
      id: `leaf-exp-${entry.id}`,
      label: entry.title,
      subtitle: entry.organization,
      badge: entry.date_range,
      onSelect: () => onJumpToSection('#experience'),
    }));
  }, [expanded, portfolio, onSelectProject, onJumpToSection]);

  useEffect(() => {
    const t1 = window.setTimeout(() => handleResetView(240), 50);
    const t2 = window.setTimeout(() => handleResetView(240), 240);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [expanded, leafItems.length, handleResetView]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const obs = new ResizeObserver(() => {
      if (el.clientWidth > 0 && el.clientHeight > 0) {
        window.requestAnimationFrame(() => handleResetView(0));
      }
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, [handleResetView]);

  const { nodes, edges } = useMemo(() => {
    const leafGap = leafItems.length >= 6 ? 116 : 124;
    const totalLeafHeight = Math.max(1, leafItems.length - 1) * leafGap;
    const centerY = Math.max(220, totalLeafHeight / 2);

    const branchY = [
      centerY - 174,
      centerY - 58,
      centerY + 58,
      centerY + 174,
    ];

    const builtNodes: PortfolioFlowNode[] = [
      {
        id: 'root',
        type: 'portfolio',
        position: { x: 0, y: centerY },
        data: {
          label: portfolio.profile.full_name,
          subtitle: portfolio.profile.brand_name,
          kind: 'root',
          onSelect: () => onJumpToSection('#crimson-nova'),
        },
      },
      {
        id: 'branch-experience',
        type: 'portfolio',
        position: { x: 310, y: branchY[0] },
        data: {
          label: 'Experience',
          subtitle: `${portfolio.timeline.length} roles & education`,
          kind: 'branch',
          icon: 'about',
          active: expanded === 'experience',
          onSelect: () => setExpanded('experience'),
        },
      },
      {
        id: 'branch-projects',
        type: 'portfolio',
        position: { x: 310, y: branchY[1] },
        data: {
          label: 'Projects',
          subtitle: `${portfolio.projects.length} shipped builds`,
          kind: 'branch',
          icon: 'projects',
          active: expanded === 'projects',
          onSelect: () => setExpanded('projects'),
        },
      },
      {
        id: 'branch-skills',
        type: 'portfolio',
        position: { x: 310, y: branchY[2] },
        data: {
          label: 'Skills & Stack',
          subtitle: `${portfolio.skill_groups.length} domains`,
          kind: 'branch',
          icon: 'skills',
          active: expanded === 'skills',
          onSelect: () => setExpanded('skills'),
        },
      },
      {
        id: 'branch-contact',
        type: 'portfolio',
        position: { x: 310, y: branchY[3] },
        data: {
          label: 'Contact',
          subtitle: 'Jump to connect.sh',
          kind: 'branch',
          icon: 'contact',
          onSelect: () => onJumpToSection('#contact'),
        },
      },
    ];

    const builtEdges: Edge[] = [
      { id: 'e-root-exp', source: 'root', target: 'branch-experience', animated: expanded === 'experience' },
      { id: 'e-root-proj', source: 'root', target: 'branch-projects', animated: expanded === 'projects' },
      { id: 'e-root-skill', source: 'root', target: 'branch-skills', animated: expanded === 'skills' },
      { id: 'e-root-contact', source: 'root', target: 'branch-contact', animated: false },
    ].map((e) => ({
      ...e,
      type: 'default',
      style: {
        stroke: e.animated ? 'var(--crimson)' : 'var(--border)',
        strokeWidth: e.animated ? 2.5 : 1.75,
      },
    }));

    const sourceId =
      expanded === 'projects'
        ? 'branch-projects'
        : expanded === 'skills'
          ? 'branch-skills'
          : 'branch-experience';

    const startY = centerY - totalLeafHeight / 2;

    leafItems.forEach((item, idx) => {
      builtNodes.push({
        id: item.id,
        type: 'portfolio',
        position: { x: 625, y: startY + idx * leafGap },
        data: {
          label: item.label,
          subtitle: item.subtitle,
          badge: item.badge,
          kind: 'leaf',
          onSelect: item.onSelect,
        },
      });
      builtEdges.push({
        id: `e-${sourceId}-${item.id}`,
        source: sourceId,
        target: item.id,
        animated: true,
        style: { stroke: 'var(--gold)', strokeWidth: 2 },
      });
    });

    return { nodes: builtNodes, edges: builtEdges };
  }, [portfolio, expanded, leafItems, onJumpToSection]);

  const branchTabs: { key: BranchKey; label: string; count: number }[] = [
    { key: 'projects', label: 'Projects', count: portfolio.projects.length },
    { key: 'experience', label: 'Experience', count: portfolio.timeline.length },
    { key: 'skills', label: 'Skills', count: portfolio.skill_groups.length },
  ];

  return (
    <div className="space-y-3">
      {/* Shared Branch Toolbar + Working Reset View Button */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          {branchTabs.map((tab) => {
            const active = expanded === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setExpanded(tab.key)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-mono border transition-colors ${
                  active
                    ? 'bg-burgundy text-[#FBF4E9] border-gold'
                    : 'bg-surface border-edge text-muted hover:text-ink hover:border-gold'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => onJumpToSection('#contact')}
            className="px-3.5 py-1.5 rounded-full text-xs font-mono border bg-surface border-edge text-muted hover:text-ink hover:border-gold transition-colors"
          >
            Contact →
          </button>
        </div>

        <button
          type="button"
          onClick={() => handleResetView(300)}
          className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono bg-surface border border-edge hover:border-gold text-muted hover:text-ink transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5 text-gold" />
          <span>Reset View</span>
        </button>
      </div>

      {/* DESKTOP / LAPTOP: Interactive React Flow Graph */}
      <div
        ref={containerRef}
        className="hidden md:block relative w-full h-[600px] lg:h-[640px] rounded-3xl border border-edge bg-surface/80 overflow-hidden shadow-sm"
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodeClick={(_event, node) => node.data.onSelect()}
          onInit={(instance) => {
            flowRef.current = instance;
            window.requestAnimationFrame(() => handleResetView(0));
          }}
          fitView
          fitViewOptions={{ padding: 0.16, maxZoom: 0.96, minZoom: 0.35 }}
          nodesDraggable={false}
          nodesConnectable={false}
          zoomOnScroll={false}
          preventScrolling={false}
          minZoom={0.35}
          maxZoom={1.35}
        >
          <Background gap={26} size={1} color="var(--border)" />
          <Controls showInteractive={false} />
        </ReactFlow>
      </div>

      {/* PHONE / MOBILE: Native Vertical Interactive Architecture Tree */}
      <div className="md:hidden rounded-3xl border border-edge bg-surface p-4 space-y-4 shadow-sm">
        <div className="rounded-2xl px-4 py-3 bg-surface-2/80 border border-gold text-center">
          <p className="font-display font-bold text-base text-ink">
            {portfolio.profile.full_name}
          </p>
          <p className="text-xs font-mono text-burgundy dark:text-gold mt-0.5">
            {portfolio.profile.brand_name} · Architecture Root
          </p>
        </div>

        <div className="relative pl-5 space-y-3">
          <span
            aria-hidden="true"
            className="absolute left-2 top-0 bottom-3 w-0.5 bg-gradient-to-b from-crimson via-gold to-edge"
          />

          <div className="relative flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-crimson">
            <span aria-hidden="true" className="absolute -left-[17px] w-3 h-0.5 bg-crimson" />
            <span>Branch: {expanded}</span>
          </div>

          {leafItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={item.onSelect}
              className="relative w-full text-left rounded-2xl p-3.5 bg-bg border border-edge hover:border-gold active:scale-[0.99] transition-all flex items-start justify-between gap-3"
            >
              <span aria-hidden="true" className="absolute -left-[13px] top-6 w-3 h-0.5 bg-gold" />
              <div className="min-w-0 space-y-1">
                {item.badge && (
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-surface-2 text-burgundy dark:text-gold border border-edge">
                    {item.badge}
                  </span>
                )}
                <p className="font-display font-bold text-sm text-ink leading-snug">
                  {item.label}
                </p>
                {item.subtitle && (
                  <p className="text-xs text-muted leading-snug line-clamp-2">
                    {item.subtitle}
                  </p>
                )}
              </div>
              <ChevronRight className="w-4 h-4 text-gold shrink-0 mt-1" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}