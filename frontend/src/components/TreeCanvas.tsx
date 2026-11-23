import { useEffect, useMemo, useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  Handle,
  Position,
  useReactFlow,
  type Node,
  type Edge,
  type NodeProps,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { FolderGit2, Layers, Terminal, User } from 'lucide-react';
import type { PortfolioPayload, ProjectData } from '../types/portfolio';

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

function AutoFitView({ trigger }: { trigger: string }) {
  const { fitView } = useReactFlow();
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      void fitView({ padding: 0.14, duration: 360 });
    });
    return () => cancelAnimationFrame(id);
  }, [trigger, fitView]);
  return null;
}

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
      title={data.subtitle ? `${data.label} — ${data.subtitle}` : data.label}
      onClick={data.onSelect}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          data.onSelect();
        }
      }}
      className={`group rounded-2xl px-5 py-4 cursor-pointer transition-all border ${
        data.kind === 'root'
          ? 'w-72 text-center bg-surface border-gold shadow-lg'
          : data.kind === 'leaf'
            ? 'w-80 bg-surface border-edge hover:border-gold hover:shadow-md'
            : data.active
              ? 'w-64 bg-surface border-crimson shadow-md'
              : 'w-64 bg-surface border-edge hover:border-gold'
      }`}
    >
      <Handle type="target" position={Position.Left} className="!bg-gold !w-2.5 !h-2.5 !border-0" />
      <Handle type="source" position={Position.Right} className="!bg-crimson !w-2.5 !h-2.5 !border-0" />

      <div className="flex items-start justify-between gap-2.5">
        <div className={`flex items-center gap-2 ${data.kind === 'root' ? 'mx-auto' : ''}`}>
          {Icon && <Icon className="w-4 h-4 text-crimson shrink-0" />}
          <span className="font-display font-bold text-base text-ink leading-snug">
            {data.label}
          </span>
        </div>
        {data.badge && (
          <span className="shrink-0 px-2.5 py-0.5 rounded text-xs font-mono bg-surface-2 text-burgundy dark:text-gold border border-gold/40">
            {data.badge}
          </span>
        )}
      </div>

      {data.subtitle && (
        <p className="text-[13px] text-muted mt-1.5 leading-snug line-clamp-2 group-hover:line-clamp-none">
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
  const [expanded, setExpanded] = useState<'projects' | 'skills' | 'experience'>('projects');

  const { nodes, edges } = useMemo(() => {
    const builtNodes: PortfolioFlowNode[] = [
      {
        id: 'root',
        type: 'portfolio',
        position: { x: 0, y: 195 },
        data: {
          label: portfolio.profile.full_name,
          subtitle: portfolio.profile.headline,
          kind: 'root',
          onSelect: () => onJumpToSection('#projects'),
        },
      },
      {
        id: 'branch-experience',
        type: 'portfolio',
        position: { x: 350, y: 20 },
        data: {
          label: 'Experience & Education',
          subtitle: `${portfolio.timeline.length} roles & credentials`,
          kind: 'branch',
          icon: 'about',
          active: expanded === 'experience',
          onSelect: () => setExpanded('experience'),
        },
      },
      {
        id: 'branch-projects',
        type: 'portfolio',
        position: { x: 350, y: 145 },
        data: {
          label: 'Projects',
          subtitle: `${portfolio.projects.length} shipped systems`,
          kind: 'branch',
          icon: 'projects',
          active: expanded === 'projects',
          onSelect: () => setExpanded('projects'),
        },
      },
      {
        id: 'branch-skills',
        type: 'portfolio',
        position: { x: 350, y: 270 },
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
        position: { x: 350, y: 395 },
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

    if (expanded === 'projects') {
      portfolio.projects.slice(0, 5).forEach((proj, idx) => {
        const nid = `leaf-${proj.id}`;
        builtNodes.push({
          id: nid,
          type: 'portfolio',
          position: { x: 690, y: idx * 116 },
          data: {
            label: proj.title,
            subtitle: proj.outcome || proj.tagline,
            badge: proj.domain_label,
            kind: 'leaf',
            onSelect: () => onSelectProject(proj),
          },
        });
        builtEdges.push({
          id: `e-proj-${proj.id}`,
          source: 'branch-projects',
          target: nid,
          animated: true,
          style: { stroke: 'var(--gold)', strokeWidth: 2 },
        });
      });
    } else if (expanded === 'skills') {
      portfolio.skill_groups.forEach((grp, idx) => {
        const nid = `leaf-skill-${grp.key}`;
        builtNodes.push({
          id: nid,
          type: 'portfolio',
          position: { x: 690, y: 15 + idx * 118 },
          data: {
            label: grp.label,
            subtitle: grp.skills.map((s) => s.name).slice(0, 3).join(' · '),
            badge: `${grp.skills.length} tools`,
            kind: 'leaf',
            onSelect: () => onJumpToSection('#skills'),
          },
        });
        builtEdges.push({
          id: `e-skill-${grp.key}`,
          source: 'branch-skills',
          target: nid,
          animated: true,
          style: { stroke: 'var(--gold)', strokeWidth: 2 },
        });
      });
    } else if (expanded === 'experience') {
      portfolio.timeline.slice(0, 4).forEach((entry, idx) => {
        const nid = `leaf-${entry.id}`;
        builtNodes.push({
          id: nid,
          type: 'portfolio',
          position: { x: 690, y: 10 + idx * 122 },
          data: {
            label: entry.title,
            subtitle: entry.organization,
            badge: entry.date_range,
            kind: 'leaf',
            onSelect: () => onJumpToSection('#experience'),
          },
        });
        builtEdges.push({
          id: `e-exp-${entry.id}`,
          source: 'branch-experience',
          target: nid,
          animated: true,
          style: { stroke: 'var(--gold)', strokeWidth: 2 },
        });
      });
    }

    return { nodes: builtNodes, edges: builtEdges };
  }, [portfolio, expanded, onSelectProject, onJumpToSection]);

  return (
    <div className="relative w-full h-[520px] md:h-[580px] rounded-3xl border border-edge bg-surface/80 overflow-hidden shadow-sm">
      <div className="pointer-events-none absolute top-4 right-5 z-10 hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono bg-surface border border-edge text-muted">
        <span className="w-2 h-2 rounded-full bg-gold" />
        <span>Click branches to expand · Click leaves to view</span>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.14 }}
        zoomOnScroll={false}
        preventScrolling={false}
        minZoom={0.55}
        maxZoom={1.5}
      >
        <AutoFitView trigger={expanded} />
        <Background gap={26} size={1} color="var(--border)" />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
}