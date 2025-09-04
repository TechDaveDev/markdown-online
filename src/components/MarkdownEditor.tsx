'use client';

import React, { useState } from 'react';
import { marked } from 'marked';

marked.setOptions({
  gfm: true,
  breaks: true,
});

const MarkdownEditor: React.FC = () => {
  const placeholder = `# ¡Bienvenido a tu Editor!
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

  const [markdown, setMarkdown] = useState<string>(placeholder);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMarkdown(event.target.value);
  };

  const getMarkdownAsHtml = () => {
    const rawMarkup = marked(markdown);
    return { __html: rawMarkup };
  };

  return (
    <div className="flex flex-col flex-grow w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <header className="flex items-center justify-between pb-4 border-b mb-4">
        <div className="flex items-center gap-3">
          <svg
            className="w-8 h-8 text-slate-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Editor Markdown</h1>
        </div>
      </header>

      <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <div className="p-3 border-b border-slate-200 dark:border-slate-700">
            <h2 className="text-sm font-semibold text-slate-600 dark:text-slate-300">Editor</h2>
          </div>
          <textarea
            className="w-full flex-grow p-4 resize-none focus:outline-none font-mono text-sm bg-transparent dark:text-slate-200 focus:ring-2 focus:ring-blue-500 rounded-b-lg"
            onChange={handleInputChange}
            value={markdown}
            aria-label="Editor de Markdown"
          />
        </div>

        <div className="flex flex-col bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <div className="p-3 border-b border-slate-200 dark:border-slate-700">
            <h2 className="text-sm font-semibold text-slate-600 dark:text-slate-300">Vista Previa</h2>
          </div>
          <div
            className="w-full flex-grow overflow-y-auto p-4 prose prose-slate max-w-none dark:prose-invert rounded-b-lg"
            dangerouslySetInnerHTML={getMarkdownAsHtml()}
          />
        </div>
      </div>
    </div>
  );
};

export default MarkdownEditor;
