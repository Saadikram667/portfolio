import { useEffect } from 'react';
import { Command } from 'cmdk';
import { FolderGit2, Layers, Moon, Navigation, Search, Sun, Terminal } from 'lucide-react';
import type { InspectorSelection, PortfolioPayload } from '../types/portfolio';

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  portfolio: PortfolioPayload;
  isDark: boolean;
  onToggleTheme: () => void;
  onNavigate: (selector: string) => void;
  onInspect: (selection: InspectorSelection) => void;
}

export function CommandPalette({
  open,
  onOpenChange,
  portfolio,
  isDark,
  onToggleTheme,
  onNavigate,
  onInspect,
}: CommandPaletteProps) {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onOpenChange(!open);
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onOpenChange]);

  return (
    <Command.Dialog
      open={open}
      onOpenChange={onOpenChange}
      label="Quick Command Palette"
      className="fixed inset-0 z-50 flex items-start justify-center pt-[16vh] px-4 bg-black/60 backdrop-blur-xs"
    >
      <div className="w-full max-w-lg rounded-2xl bg-surface border border-edge shadow-2xl overflow-hidden">
        <div className="flex items-center gap-2.5 px-4 border-b border-edge">
          <Search className="w-4 h-4 text-muted shrink-0" />
          <Command.Input
            placeholder="Jump to a section, project, or action..."
            className="w-full py-3.5 bg-transparent text-sm text-ink placeholder:text-muted outline-none"
          />
        </div>

        <Command.List className="max-h-80 overflow-y-auto p-2 space-y-2 custom-scrollbar">
          <Command.Empty className="py-8 text-center text-xs font-mono text-muted">
            No matching nodes found.
          </Command.Empty>

          <Command.Group heading="Navigation" className="text-[11px] font-mono text-muted px-2">
            {[
              { label: 'Hero', target: '#hero' },
              { label: 'Interactive Tree Workflow', target: '#tree-workflow' },
              { label: 'Featured Projects', target: '#projects' },
              { label: 'Journey & Skills', target: '#journey' },
              { label: 'Contact Terminal (connect.sh)', target: '#contact' },
            ].map((item) => (
              <Command.Item
                key={item.target}
                onSelect={() => {
                  onOpenChange(false);
                  onNavigate(item.target);
                }}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-ink aria-selected:bg-surface-2 cursor-pointer"
              >
                <Navigation className="w-3.5 h-3.5 text-crimson" />
                <span>{item.label}</span>
              </Command.Item>
            ))}
          </Command.Group>

          <Command.Group heading="Inspect Projects" className="text-[11px] font-mono text-muted px-2">
            {portfolio.projects.map((p) => (
              <Command.Item
                key={p.id}
                onSelect={() => {
                  onOpenChange(false);
                  onInspect({ kind: 'project', project: p });
                }}
                className="flex items-center justify-between px-3 py-2 rounded-xl text-sm text-ink aria-selected:bg-surface-2 cursor-pointer"
              >
                <span className="flex items-center gap-2.5">
                  <FolderGit2 className="w-3.5 h-3.5 text-gold" />
                  <span>{p.title}</span>
                </span>
                <span className="text-[11px] font-mono text-muted">{p.domain_label}</span>
              </Command.Item>
            ))}
          </Command.Group>

          <Command.Group heading="Quick Actions" className="text-[11px] font-mono text-muted px-2">
            <Command.Item
              onSelect={() => {
                onOpenChange(false);
                onInspect({ kind: 'skills', groups: portfolio.skill_groups });
              }}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-ink aria-selected:bg-surface-2 cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5 text-crimson" />
              <span>Open skills.json Inspector</span>
            </Command.Item>

            <Command.Item
              onSelect={() => {
                onOpenChange(false);
                onInspect({ kind: 'contact', profile: portfolio.profile });
              }}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-ink aria-selected:bg-surface-2 cursor-pointer"
            >
              <Terminal className="w-3.5 h-3.5 text-crimson" />
              <span>Launch connect.sh Drawer</span>
            </Command.Item>

            <Command.Item
              onSelect={() => {
                onToggleTheme();
                onOpenChange(false);
              }}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-ink aria-selected:bg-surface-2 cursor-pointer"
            >
              {isDark ? <Sun className="w-3.5 h-3.5 text-gold" /> : <Moon className="w-3.5 h-3.5 text-crimson" />}
              <span>Switch to {isDark ? 'Light (Warm Beige)' : 'Dark (Obsidian Burgundy)'} Mode</span>
            </Command.Item>
          </Command.Group>
        </Command.List>
      </div>
    </Command.Dialog>
  );
}