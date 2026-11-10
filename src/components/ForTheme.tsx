import type { ReactNode } from 'react';

interface ForThemeProps {
  light: ReactNode;
  dark: ReactNode;
}

/**
 * Renders both versions and lets CSS show the one for the current theme, so the
 * prerendered page is right before any script runs. A hidden video never plays
 * (LoopVideo only plays what is on screen) and a hidden lazy image never loads.
 */
export function ForTheme({ light, dark }: ForThemeProps) {
  return (
    <>
      <div className="when-dark">{dark}</div>
      <div className="when-light">{light}</div>
    </>
  );
}
