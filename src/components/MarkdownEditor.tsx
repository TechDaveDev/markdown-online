'use client';

import { useEffect, useRef, useState } from 'react';
import { marked } from 'marked';

const CheckIcon = () => (
  <svg className="w-4 h-4 text-status-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const EditIcon = () => (
  <svg className="w-4 h-4 text-status-warning animate-pulse" fill="currentColor" viewBox="0 0 20 20">
    <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"></path>
    <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd"></path>
  </svg>
);

marked.setOptions({
  gfm: true,
  breaks: true,
});

export const MarkdownEditor = () => {
  const [markdown, setMarkdown] = useState<string>('');
  const [status, setStatus] = useState<'saved' | 'editing'>('saved');
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const savedMarkdown = localStorage.getItem('markdownContent');
    if (savedMarkdown) {
      setMarkdown(savedMarkdown);
    } else {
      setMarkdown(`# ¡Bienvenido a tu Editor!
## Escribe Markdown a la izquierda
### Y ve el resultado a la derecha

---

**Ejemplos de sintaxis:**

- Texto en **negrita**
- Texto en *cursiva*
- \`código en línea\`

\`\`\`javascript
// Bloque de código
function hello() {
  console.log("¡Hola, Mundo!");
}
\`\`\`

> ¡Esto es una cita!

¡Empieza a escribir!`);
    }
  }, []);

  useEffect(() => {
    if (markdown === '') return;
    setStatus('editing');
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      localStorage.setItem('markdownContent', markdown);
      setStatus('saved');
    }, 1500);
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [markdown]);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMarkdown(event.target.value);
  };

  const getMarkdownAsHtml = () => ({ __html: marked.parse(markdown) as string });

  const renderStatus = () => {
    if (status === 'saved') {
      return <><CheckIcon /><span>Guardado</span></>;
    }
    return <><EditIcon /><span>Cambios sin guardar...</span></>;
  };

  return (
    <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 h-full">
      <div className="flex flex-col bg-surface rounded-lg border border-border-default shadow-sm transition-all">
        <div className="flex items-center justify-between p-3 border-b border-border-default">
          <h2 className="text-sm font-semibold text-text-default">Editor</h2>
          <div className="flex items-center gap-2 text-xs text-text-muted">
            {renderStatus()}
          </div>
        </div>
        <textarea
          className="w-full flex-grow p-4 resize-none bg-surface font-mono text-sm text-text-default placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-focus-ring rounded-b-lg"
          onChange={handleInputChange}
          value={markdown}
          aria-label="Editor de Markdown"
        />
      </div>

      <div className="flex flex-col bg-surface rounded-lg border border-border-default shadow-sm transition-all">
        <div className="p-3 border-b border-border-default">
          <h2 className="text-sm font-semibold text-text-default">Vista Previa</h2>
        </div>
        <div
          className="w-full flex-grow overflow-y-auto p-4 prose prose-slate max-w-none rounded-b-lg"
          dangerouslySetInnerHTML={getMarkdownAsHtml()}
        />
      </div>
    </div>
  );
};
