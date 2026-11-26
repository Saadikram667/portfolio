import { useEffect, useState } from 'react';

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
}

const highlightCache = new Map<string, string>();

export function CodeBlock({
  code,
  language = 'python',
  filename = 'snippet.py',
}: CodeBlockProps) {
  const source = code || '# No snippet provided yet';
  const cacheKey = `${language}:${source}`;
  const [html, setHtml] = useState<string>(() => highlightCache.get(cacheKey) || '');

  useEffect(() => {
    const cached = highlightCache.get(cacheKey);
    if (cached) {
      setHtml(cached);
      return;
    }

    let active = true;
    async function highlight() {
      try {
        const { codeToHtml } = await import('shiki');
        let rendered: string;
        try {
          rendered = await codeToHtml(source, {
            lang: language || 'python',
            theme: 'vitesse-dark',
          });
        } catch {
          rendered = await codeToHtml(source, {
            lang: 'text',
            theme: 'vitesse-dark',
          });
        }
        highlightCache.set(cacheKey, rendered);
        if (active) setHtml(rendered);
      } catch {
        // Fallback plain <pre> stays visible if highlighter fails to load
      }
    }

    void highlight();
    return () => {
      active = false;
    };
  }, [cacheKey, source, language]);

  return (
    <div className="rounded-2xl overflow-hidden border border-edge bg-[#121212] shadow-md">
      <div className="px-4 py-2.5 bg-[#201016] border-b border-[#4A2933] flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-[#E03150] shrink-0" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#D9B44A] shrink-0" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#7A555C] shrink-0" />
        <span className="ml-2 text-xs font-mono text-[#C2AAAB] truncate">{filename}</span>
      </div>

      {html ? (
        <div
          className="p-4 text-xs font-mono overflow-x-auto [&>pre]:!bg-transparent [&>pre]:!m-0"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <pre className="p-4 text-xs font-mono text-[#F3E6D3] overflow-x-auto">
          <code>{source}</code>
        </pre>
      )}
    </div>
  );
}