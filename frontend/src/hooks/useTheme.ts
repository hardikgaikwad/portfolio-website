/* ═══════════════════════════════════════════════════════════
   useTheme.ts — Centralized Theme Hook (Light / Dark Mode)
   ═══════════════════════════════════════════════════════════ */

import { useState, useEffect, useCallback } from 'react';

export type Theme = 'light' | 'dark';

const THEME_STORAGE_KEY = 'portfolio-theme';

export function getInitialTheme(): Theme {
  // Check if theme was already set on <html> by the anti-FOUC script
  if (typeof document !== 'undefined') {
    const currentAttr = document.documentElement.getAttribute('data-theme') as Theme | null;
    if (currentAttr === 'light' || currentAttr === 'dark') {
      return currentAttr;
    }
  }

  // Check localStorage - only use saved if explicit
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
    if (saved === 'dark') {
      return 'dark';
    }
  } catch {
    // Ignore storage access errors
  }

  // Starts on light mode by default
  return 'light';
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  const applyTheme = useCallback((newTheme: Theme, persist = true) => {
    setThemeState(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    if (persist) {
      try {
        localStorage.setItem(THEME_STORAGE_KEY, newTheme);
      } catch {
        // Ignore storage access errors
      }
    }
  }, []);

  const toggleTheme = useCallback(() => {
    applyTheme(theme === 'dark' ? 'light' : 'dark', true);
  }, [theme, applyTheme]);

  const setTheme = useCallback((newTheme: Theme) => {
    applyTheme(newTheme, true);
  }, [applyTheme]);

  // Sync with storage events across tabs & system preferences
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === THEME_STORAGE_KEY && (e.newValue === 'light' || e.newValue === 'dark')) {
        applyTheme(e.newValue as Theme, false);
      }
    };

    window.addEventListener('storage', handleStorage);

    // If user has not explicitly chosen a preference in localStorage, respond to system changes
    let mql: MediaQueryList | null = null;
    const handleMediaChange = (e: MediaQueryListEvent) => {
      try {
        const saved = localStorage.getItem(THEME_STORAGE_KEY);
        if (!saved) {
          applyTheme(e.matches ? 'dark' : 'light', false);
        }
      } catch {
        // Ignore
      }
    };

    if (window.matchMedia) {
      mql = window.matchMedia('(prefers-color-scheme: dark)');
      mql.addEventListener('change', handleMediaChange);
    }

    return () => {
      window.removeEventListener('storage', handleStorage);
      if (mql) {
        mql.removeEventListener('change', handleMediaChange);
      }
    };
  }, [applyTheme]);

  return {
    theme,
    isDark: theme === 'dark',
    toggleTheme,
    setTheme,
  };
}
