export const Footer = () => {
  return (
    <footer className="w-full bg-muted border-t border-border-default">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <p className="text-xs text-text-muted">
            © {new Date().getFullYear()} Markdone. Creado con ❤️ y Next.js.
          </p>
          <p className="text-xs text-text-muted">
            Creado por{' '}
            <a
              href="https://davidaliaga.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium hover:text-text-default transition-colors"
            >
              David Aliaga
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};