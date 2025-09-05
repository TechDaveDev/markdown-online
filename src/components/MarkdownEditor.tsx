'use client';

import { useEffect, useRef, useState, FC } from 'react';
import { marked } from 'marked';
import { useHistory } from '@/hooks/useHistory';

const CheckIcon: FC = () => (<svg className="w-4 h-4 text-status-success" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>);
const EditIcon: FC = () => (<svg className="w-4 h-4 text-status-warning animate-pulse" fill="currentColor" viewBox="0 0 20 20"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"></path><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd"></path></svg>);
const BoldIcon: FC = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
    <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
  </svg>
);
const ItalicIcon: FC = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10 5h8m-8 14h8M14 5l-4 14"
    />
  </svg>
);
const CodeIcon: FC = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6"></polyline>
    <polyline points="8 6 2 12 8 18"></polyline>
  </svg>
);
const QuoteIcon: FC = () => (<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>);
const UndoIcon: FC = () => (<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l4-4m-4 4l4 4" /></svg>);
const RedoIcon: FC = () => (<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2m18-10l-4-4m4 4l-4 4" /></svg>);

marked.setOptions({ gfm: true, breaks: true });

export const MarkdownEditor = () => {
  const { state: markdown, setState: setMarkdown, undo, redo, canUndo, canRedo } = useHistory<string>('');

  const [status, setStatus] = useState<'saved' | 'editing'>('saved');
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isInitialLoad = useRef(true);

  useEffect(() => {
    const savedMarkdown = localStorage.getItem('markdownContent') || `# ¡Bienvenido a tu Editor!
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

¡Empieza a escribir!`;
    setMarkdown(savedMarkdown);
    isInitialLoad.current = false;
  }, []);

  useEffect(() => {
    if (isInitialLoad.current) return;

    setStatus('editing');
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      localStorage.setItem('markdownContent', markdown);
      setStatus('saved');
    }, 1500);

    return () => { if (debounceTimeout.current) clearTimeout(debounceTimeout.current); };
  }, [markdown]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const isUndo = (isMac ? event.metaKey : event.ctrlKey) && event.key === 'z';
      const isRedo = (isMac ? event.metaKey : event.ctrlKey) && (event.key === 'y' || (event.shiftKey && event.key === 'Z'));

      if (isUndo) {
        event.preventDefault();
        undo();
      }
      if (isRedo) {
        event.preventDefault();
        redo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  const applyFormat = (type: 'bold' | 'italic' | 'code' | 'quote') => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const { selectionStart, selectionEnd, value } = textarea;
    const selectedText = value.substring(selectionStart, selectionEnd);
    let startChars = '';
    let endChars = '';
    switch (type) {
      case 'bold': startChars = '**'; endChars = '**'; break;
      case 'italic': startChars = '*'; endChars = '*'; break;
      case 'code': startChars = '`'; endChars = '`'; break;
      case 'quote': startChars = '> '; break;
    }
    const formattedText = `${startChars}${selectedText}${endChars}`;
    const newText = `${value.substring(0, selectionStart)}${formattedText}${value.substring(selectionEnd)}`;
    setMarkdown(newText);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(selectionStart + startChars.length, selectionEnd + startChars.length);
    }, 0);
  };

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

  const ToolbarButton: FC<{ onClick: () => void; label: string; children: React.ReactNode; disabled?: boolean }> = ({ onClick, label, children, disabled }) => (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      disabled={disabled}
      className="p-1.5 rounded-md text-text-muted hover:text-text-default hover:bg-muted group transition-colors disabled:opacity-50 disabled:pointer-events-none"
    >
      {children}
    </button>
  );

  return (
    <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 h-full">
      <div className="flex flex-col bg-surface rounded-lg border border-border-default shadow-sm transition-all">
        <div className="flex items-center justify-between p-3 border-b border-border-default">
          <h2 className="text-sm font-semibold text-text-default">Editor</h2>
          <div className="flex items-center gap-2 text-xs text-text-muted">{renderStatus()}</div>
        </div>
        <div className="flex items-center gap-1 p-2 border-b border-border-default">
          <ToolbarButton onClick={undo} label="Deshacer" disabled={!canUndo}> <UndoIcon /> </ToolbarButton>
          <ToolbarButton onClick={redo} label="Rehacer" disabled={!canRedo}> <RedoIcon /> </ToolbarButton>
          <div className="w-px h-5 bg-border-default mx-1" /> {/* Separador visual */}
          <ToolbarButton onClick={() => applyFormat('bold')} label="Aplicar negrita"> <BoldIcon /> </ToolbarButton>
          <ToolbarButton onClick={() => applyFormat('italic')} label="Aplicar cursiva"> <ItalicIcon /> </ToolbarButton>
          <ToolbarButton onClick={() => applyFormat('code')} label="Aplicar código en línea"> <CodeIcon /> </ToolbarButton>
          <ToolbarButton onClick={() => applyFormat('quote')} label="Aplicar cita"> <QuoteIcon /> </ToolbarButton>
        </div>
        <textarea
          ref={textareaRef}
          className="w-full flex-grow p-4 resize-none bg-surface font-mono text-sm text-text-default placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-focus-ring rounded-b-lg"
          onChange={handleInputChange}
          value={markdown}
          aria-label="Editor de Markdown"
        />
      </div>
      <div className="flex flex-col bg-surface rounded-lg border border-border-default shadow-sm transition-all">
        <div className="p-3 border-b border-border-default"><h2 className="text-sm font-semibold text-text-default">Vista Previa</h2></div>
        <div className="w-full flex-grow overflow-y-auto p-4 prose prose-slate max-w-none rounded-b-lg" dangerouslySetInnerHTML={getMarkdownAsHtml()} />
      </div>
    </div>
  );
};

