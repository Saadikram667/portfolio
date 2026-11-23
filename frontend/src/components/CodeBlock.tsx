import { useEffect, useState } from 'react';
import { codeToHtml } from 'shiki';
import { Check, Copy } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
}

export function CodeBlock({ code, language = 'python', filename = 'snippet.py' }: CodeBlockProps) {
  const [html, setHtml] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let active = true;
    async function highlight() {
      try {
        const rendered = await codeToHtml(code || '# No snippet provided yet', {
          lang: language || 'python',
          theme: 'vitesse-dark',
        });
        if (active) setHtml(rendered);
      } catch {
        const fallback = await codeToHtml(code || '# No snippet provided yet', {
          lang: 'text',
          theme: 'vitesse-dark',
        });
        if (active) setHtml(fallback);
      }
    }
    void highlight();
    return () => {
      active = false;
    };
  }, [code, language]);

  async function handleCopy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="rounded-2xl overflow-hidden border border-edge bg-[#121212] shadow-md">
      <div className="px-4 py-2.5 bg-[#1B1013] border-b border-[#3A2128] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#E03150]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#D9B44A]" />
          <span className="text-xs font-mono text-[#B79FA0] ml-1">{filename}</span>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1 text-[11px] font-mono text-[#B79FA0] hover:text-[#D9B44A] transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>

      {html ? (
        <div
          className="p-4 text-xs font-mono overflow-x-auto [&>pre]:!bg-transparent [&>pre]:!m-0"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <pre className="p-4 text-xs font-mono text-[#F3E6D3] overflow-x-auto">
          <code>{code}</code>
        </pre>
      )}
    </div>
  );
}