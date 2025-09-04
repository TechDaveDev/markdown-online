import { ThemeSwitcher } from '../ThemeSwitcher';

const GitHubIcon = () => (
  <a
    href="https://github.com/TechDaveDev"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Ver el código fuente en GitHub"
    className="text-text-muted transition-colors hover:text-text-default"
  >
    <svg
      className="w-6 h-6"
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.168 6.839 9.492.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.031-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.378.203 2.398.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.848-2.338 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.001 10.001 0 0022 12c0-5.523-4.477-10-10-10z"
        clipRule="evenodd"
      />
    </svg>
  </a>
);

const MarkdoneIcon = () => (
  <div className="w-8 h-8 flex items-center justify-center bg-accent-primary rounded-lg">
    <svg className="w-5 h-5 text-accent-primary-text" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="9" x2="20" y2="9"></line>
      <line x1="4" y1="15" x2="20" y2="15"></line>
      <line x1="10" y1="3" x2="8" y2="21"></line>
      <line x1="16" y1="3" x2="14" y2="21"></line>
    </svg>
  </div>
);

export const Header = () => {
  return (
    <header className="w-full sticky top-0 z-20 bg-surface/80 backdrop-blur-md border-b border-border-default">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          <div className="flex items-center gap-3">
            <MarkdoneIcon />
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold text-text-heading">Markdone</h1>
              <span className="px-1.5 py-0.5 text-xs font-mono tracking-tighter bg-muted text-text-muted rounded-full">
                BETA
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <GitHubIcon />
            <ThemeSwitcher />
          </div>

        </div>
      </div>
    </header>
  );
};