import MarkdownEditor from '@/components/MarkdownEditor';
import '../styles/markdown.css';

export default function Home() {
  return (
    <>
      <header className="text-center py-4 bg-white border-b shadow-sm">
        <h1 className="text-3xl font-bold text-gray-800">Editor de Markdown</h1>
        <p className="text-gray-500">Construido con Next.js, TypeScript y Marked</p>
      </header>

      <main>
        <MarkdownEditor />
      </main>
    </>
  );
}
