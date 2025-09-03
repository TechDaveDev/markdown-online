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
    <div className="flex w-full h-[calc(100vh-80px)] border-t">
      <textarea
        className="w-1/2 h-full p-4 resize-none focus:outline-none font-mono text-base bg-gray-50 border-r"
        onChange={handleInputChange}
        value={markdown}
        aria-label="Editor de Markdown"
      />

      <div
        className="w-1/2 h-full overflow-y-auto bg-white markdown-body"
        dangerouslySetInnerHTML={getMarkdownAsHtml()}
      />
    </div>
  );
};

export default MarkdownEditor;
