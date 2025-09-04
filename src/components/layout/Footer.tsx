export const Footer = () => {
  return (
    <footer className="w-full bg-slate-100 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          © {new Date().getFullYear()} MarkDown Pro. Creado con ❤️ y Next.js.
        </p>
      </div>
    </footer>
  )
}
