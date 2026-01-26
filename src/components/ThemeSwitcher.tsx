'use client';

import { useState, useEffect } from 'react';

import { Sun, Moon } from 'lucide-react';

export const ThemeSwitcher = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const isDark =
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);

    setIsDarkMode(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const toggleTheme = () => {
    const newIsDarkMode = !isDarkMode;
    setIsDarkMode(newIsDarkMode);

    if (newIsDarkMode) {
      localStorage.theme = 'dark';
      document.documentElement.classList.add('dark');
    } else {
      localStorage.theme = 'light';
      document.documentElement.classList.remove('dark');
    }
  };

  if (!isMounted) return <div className="p-2 w-9 h-9" />;

  return (
    <button
      onClick={toggleTheme}
      className="group p-2 rounded-lg bg-muted hover:bg-border-default text-text-muted hover:text-text-default transition-all active:scale-90"
      aria-label="Alternar tema oscuro"
    >
      {isDarkMode ? (
        <Moon
          size={20}
          className="transition-transform duration-300 rotate-[-15deg] group-hover:rotate-0 fill-current"
        />
      ) : (
        <Sun
          size={20}
          className="transition-transform duration-500 hover:rotate-90"
        />
      )}
    </button>
  );
};