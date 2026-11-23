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
import type { InspectorSelection, PortfolioPayload } from '../types/portfolio';

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
      void fitView({ padding: 0.12, duration: 380 });
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
      className={`group rounded-2xl px-5 py-4 cursor-pointer transition-all border backdrop-blur-md ${
        data.kind === 'root'
          ? 'w-72 text-center bg-surface border-gold shadow-[0_0_28px_rgba(224,49,80,0.22)]'
          : data.kind === 'leaf'
            ? 'w-80 bg-surface/95 border-edge hover:border-gold hover:shadow-lg'
            : data.active
              ? 'w-64 bg-surface border-crimson shadow-[0_0_24px_rgba(224,49,80,0.28)]'
              : 'w-64 bg-surface/95 border-edge hover:border-gold'
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
        <p className="text-[13px] text-muted mt-1.5 leading-snug line-clamp-2 group-hover:line-clamp-none transition-all">
          {data.subtitle}
        </p>
      )}
    </div>
  );
}

const nodeTypes = { portfolio: PortfolioNode };

interface TreeCanvasProps {
  portfolio: PortfolioPayload;
  onInspect: (selection: InspectorSelection) => void;
}

export function TreeCanvas({ portfolio, onInspect }: TreeCanvasProps) {
  const [expanded, setExpanded] = useState<'projects' | 'skills' | 'about'>('projects');

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
          onSelect: () =>
            onInspect({
              kind: 'about',
              profile: portfolio.profile,
              timeline: portfolio.timeline,
            }),
        },
      },
      {
        id: 'branch-about',
        type: 'portfolio',
        position: { x: 355, y: 20 },
        data: {
          label: 'About & Journey',
          subtitle: `${portfolio.timeline.length} career & education nodes`,
          kind: 'branch',
          icon: 'about',
          active: expanded === 'about',
          onSelect: () => setExpanded('about'),
        },
      },
      {
        id: 'branch-projects',
        type: 'portfolio',
        position: { x: 355, y: 145 },
        data: {
          label: 'Projects',
          subtitle: `${portfolio.projects.length} shipped systems & studies`,
          kind: 'branch',
          icon: 'projects',
          active: expanded === 'projects',
          onSelect: () => setExpanded('projects'),
        },
      },
      {
        id: 'branch-skills',
        type: 'portfolio',
        position: { x: 355, y: 270 },
        data: {
          label: 'Skills & Stack',
          subtitle: `${portfolio.skill_groups.length} domains · tiered by usage`,
          kind: 'branch',
          icon: 'skills',
          active: expanded === 'skills',
          onSelect: () => setExpanded('skills'),
        },
      },
      {
        id: 'branch-contact',
        type: 'portfolio',
        position: { x: 355, y: 395 },
        data: {
          label: 'Contact',
          subtitle: 'Open connect.sh terminal',
          kind: 'branch',
          icon: 'contact',
          onSelect: () => onInspect({ kind: 'contact', profile: portfolio.profile }),
        },
      },
    ];

    const builtEdges: Edge[] = [
      { id: 'e-root-about', source: 'root', target: 'branch-about', animated: expanded === 'about' },
      { id: 'e-root-projects', source: 'root', target: 'branch-projects', animated: expanded === 'projects' },
      { id: 'e-root-skills', source: 'root', target: 'branch-skills', animated: expanded === 'skills' },
      { id: 'e-root-contact', source: 'root', target: 'branch-contact', animated: false },
    ].map((e) => ({
      ...e,
      type: 'default',
      style: {
        stroke: e.animated ? 'var(--crimson)' : 'var(--border)',
        strokeWidth: e.animated ? 2.6 : 1.8,
      },
    }));

    if (expanded === 'projects') {
      portfolio.projects.slice(0, 5).forEach((proj, idx) => {
        const nid = `leaf-${proj.id}`;
        builtNodes.push({
          id: nid,
          type: 'portfolio',
          position: { x: 695, y: idx * 116 },
          data: {
            label: proj.title,
            subtitle: proj.outcome || proj.tagline,
            badge: proj.domain_label,
            kind: 'leaf',
            onSelect: () => onInspect({ kind: 'project', project: proj }),
          },
        });
        builtEdges.push({
          id: `e-proj-${proj.id}`,
          source: 'branch-projects',
          target: nid,
          animated: true,
          style: { stroke: 'var(--gold)', strokeWidth: 2.2 },
        });
      });
    } else if (expanded === 'skills') {
      portfolio.skill_groups.forEach((grp, idx) => {
        const nid = `leaf-skill-${grp.key}`;
        builtNodes.push({
          id: nid,
          type: 'portfolio',
          position: { x: 695, y: 15 + idx * 120 },
          data: {
            label: grp.label,
            subtitle: grp.skills.map((s) => s.name).slice(0, 3).join(' · '),
            badge: `${grp.skills.length} tools`,
            kind: 'leaf',
            onSelect: () =>
              onInspect({ kind: 'skills', groups: portfolio.skill_groups, activeKey: grp.key }),
          },
        });
        builtEdges.push({
          id: `e-skill-${grp.key}`,
          source: 'branch-skills',
          target: nid,
          animated: true,
          style: { stroke: 'var(--gold)', strokeWidth: 2.2 },
        });
      });
    } else if (expanded === 'about') {
      const aboutItems = [
        {
          id: 'leaf-profile-bio',
          label: 'Profile & Working Style',
          subtitle: portfolio.profile.location || 'Overview & CV',
          badge: 'Bio',
          onSelect: () =>
            onInspect({
              kind: 'about',
              profile: portfolio.profile,
              timeline: portfolio.timeline,
            }),
        },
        ...portfolio.timeline.slice(0, 3).map((entry) => ({
          id: `leaf-${entry.id}`,
          label: entry.title,
          subtitle: entry.organization,
          badge: entry.date_range,
          onSelect: () => onInspect({ kind: 'timeline', entry }),
        })),
      ];

      aboutItems.forEach((item, idx) => {
        builtNodes.push({
          id: item.id,
          type: 'portfolio',
          position: { x: 695, y: 10 + idx * 124 },
          data: {
            label: item.label,
            subtitle: item.subtitle,
            badge: item.badge,
            kind: 'leaf',
            onSelect: item.onSelect,
          },
        });
        builtEdges.push({
          id: `e-about-${item.id}`,
          source: 'branch-about',
          target: item.id,
          animated: true,
          style: { stroke: 'var(--gold)', strokeWidth: 2.2 },
        });
      });
    }

    return { nodes: builtNodes, edges: builtEdges };
  }, [portfolio, expanded, onInspect]);

  return (
    <div className="relative w-full h-[540px] md:h-[600px] rounded-3xl border border-edge bg-surface/75 backdrop-blur-md overflow-hidden shadow-xl">
      <div className="pointer-events-none absolute top-4 right-5 z-10 hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono bg-surface/95 border border-edge text-muted">
        <span className="w-2 h-2 rounded-full bg-gold" />
        <span>Click any leaf node to inspect</span>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.12 }}
        zoomOnScroll={false}
        preventScrolling={false}
        minZoom={0.55}
        maxZoom={1.6}
      >
        <AutoFitView trigger={expanded} />
        <Background gap={26} size={1} color="var(--border)" />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
}