import { useSyncExternalStore } from 'react';

export type Theme = 'light' | 'dark';

const storageKey = 'theme';

/**
 * Runs in <head> before the first paint, so the page never flashes the wrong
 * theme. A saved choice wins; otherwise the system setting decides.
 */
export const themeScript = `try{var t=localStorage.getItem('${storageKey}');if(t!=='light'&&t!=='dark')t=matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';document.documentElement.dataset.theme=t}catch(e){}`;

const listeners = new Set<() => void>();

function subscribe(listener: () => void): () => void {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

function currentTheme(): Theme | null {
  const theme = document.documentElement.dataset.theme;

  return theme === 'light' || theme === 'dark' ? theme : null;
}

/** The theme on the page, or null while prerendering. */
export function useTheme(): Theme | null {
  return useSyncExternalStore(subscribe, currentTheme, () => null);
}

export function setTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme;

  try {
    localStorage.setItem(storageKey, theme);
  } catch {
    // Storage can be blocked; the choice then lasts until the page reloads.
  }

  for (const listener of listeners) listener();
}
