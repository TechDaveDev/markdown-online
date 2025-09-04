'use client';

import { useState } from 'react';
import { marked } from 'marked';

marked.setOptions({
  gfm: true,
  breaks: true,
});

export const MarkdownEditor = () => {
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
    <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
      <div className="flex flex-col bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="p-3 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-sm font-semibold text-slate-600 dark:text-slate-300">Editor</h2>
        </div>
        <textarea
          className="w-full flex-grow p-4 resize-none focus:outline-none font-mono text-sm bg-transparent dark:text-slate-200 rounded-b-lg"
          onChange={handleInputChange}
          value={markdown}
          aria-label="Editor de Markdown"
        />
      </div>

      <div className="flex flex-col bg-white dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="p-3 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-sm font-semibold text-slate-600 dark:text-slate-300">Vista Previa</h2>
        </div>
        <div
          className="w-full flex-grow overflow-y-auto p-4 prose prose-slate max-w-none dark:prose-invert rounded-b-lg"
          dangerouslySetInnerHTML={getMarkdownAsHtml()}
        />
      </div>
    </div>
  );
};
