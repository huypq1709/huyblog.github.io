import { useState, useEffect } from 'react';
export function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  useEffect(() => {
    // Check local storage on mount
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;

    // Default to light theme if no saved preference
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);
  useEffect(() => {
    // Update DOM and local storage when theme changes
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };
  return {
    theme,
    toggleTheme
  };
}