import { MarkdownEditor } from "@/components/MarkdownEditor";


export default function Home() {
  return (
    <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col h-full">
        <MarkdownEditor />
      </div>
    </main>
  );
}
