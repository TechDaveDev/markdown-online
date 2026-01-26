'use client';

import { useEffect, useRef, useState, FC, useCallback } from 'react';

import { marked } from 'marked';
import {
  Check,
  Pencil,
  Bold,
  Italic,
  Code,
  Quote,
  Undo2,
  Redo2
} from 'lucide-react';

interface History<T> {
  state: T;
  setState: (newState: T) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const useHistory = <T,>(initialState: T): History<T> => {
  const [history, setHistory] = useState<T[]>([initialState]);
  const [index, setIndex] = useState(0);

  const state = history[index];

  const setState = useCallback((newState: T) => {
    if (newState === state) return;
    const newHistory = history.slice(0, index + 1);
    newHistory.push(newState);
    setHistory(newHistory);
    setIndex(newHistory.length - 1);
  }, [history, index, state]);

  const undo = useCallback(() => {
    if (index > 0) setIndex(index - 1);
  }, [index]);

  const redo = useCallback(() => {
    if (index < history.length - 1) setIndex(index + 1);
  }, [index, history.length]);

  const canUndo = index > 0;
  const canRedo = index < history.length - 1;

  return { state, setState, undo, redo, canUndo, canRedo };
};

marked.setOptions({ gfm: true, breaks: true });

export const MarkdownEditor = () => {
  const { state: markdown, setState: setMarkdown, undo, redo, canUndo, canRedo } = useHistory<string>('');

  const [status, setStatus] = useState<'saved' | 'editing'>('saved');
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isInitialLoad = useRef(true);

  useEffect(() => {
    const savedMarkdown = localStorage.getItem('markdownContent') || `# ¡Bienvenido a Markdone!
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      return (
        <div className="flex items-center gap-1.5 text-status-success">
          <Check size={14} strokeWidth={2.5} />
          <span>Guardado</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-1.5 text-status-warning">
        <Pencil size={14} strokeWidth={2.5} className="animate-pulse" />
        <span>Cambios sin guardar...</span>
      </div>
    );
  };

  const ToolbarButton: FC<{ onClick: () => void; label: string; children: React.ReactNode; disabled?: boolean }> = ({ onClick, label, children, disabled }) => (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      disabled={disabled}
      className="p-1.5 rounded-md text-text-muted hover:text-text-default hover:bg-muted group transition-all disabled:opacity-30 disabled:pointer-events-none active:scale-95"
    >
      {children}
    </button>
  );

  return (
    <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 h-full min-h-[500px]">

      {/* editor */}
      <div className="flex flex-col bg-surface rounded-lg border border-border-default shadow-sm overflow-hidden transition-all">
        <div className="flex items-center justify-between p-3 border-b border-border-default bg-surface/50 backdrop-blur-sm">
          <h2 className="text-sm font-semibold text-text-default">Editor</h2>
          <div className="text-xs font-medium">
            {renderStatus()}
          </div>
        </div>

        {/* toolbar */}
        <div className="flex items-center gap-0.5 p-1.5 border-b border-border-default bg-muted/20">
          <ToolbarButton onClick={undo} label="Deshacer" disabled={!canUndo}>
            <Undo2 size={18} />
          </ToolbarButton>
          <ToolbarButton onClick={redo} label="Rehacer" disabled={!canRedo}>
            <Redo2 size={18} />
          </ToolbarButton>

          <div className="w-px h-4 bg-border-default mx-1.5" />

          <ToolbarButton onClick={() => applyFormat('bold')} label="Negrita">
            <Bold size={18} />
          </ToolbarButton>
          <ToolbarButton onClick={() => applyFormat('italic')} label="Cursiva">
            <Italic size={18} />
          </ToolbarButton>
          <ToolbarButton onClick={() => applyFormat('code')} label="Código">
            <Code size={18} />
          </ToolbarButton>
          <ToolbarButton onClick={() => applyFormat('quote')} label="Cita">
            <Quote size={18} />
          </ToolbarButton>
        </div>

        <textarea
          ref={textareaRef}
          className="w-full flex-grow p-4 resize-none bg-transparent font-mono text-sm text-text-default placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-focus-ring/20 transition-all"
          onChange={handleInputChange}
          value={markdown}
          aria-label="Editor de Markdown"
          placeholder="Empieza a escribir aquí..."
        />
      </div>

      {/* live preview */}
      <div className="flex flex-col bg-surface rounded-lg border border-border-default shadow-sm overflow-hidden transition-all">
        <div className="p-3 border-b border-border-default bg-surface/50 backdrop-blur-sm">
          <h2 className="text-sm font-semibold text-text-default">Vista Previa</h2>
        </div>
        <div
          className="w-full flex-grow overflow-y-auto p-4 prose prose-slate max-w-none rounded-b-lg scrollbar-thin scrollbar-thumb-border-default"
          dangerouslySetInnerHTML={getMarkdownAsHtml()}
        />
      </div>
    </div>
  );
};