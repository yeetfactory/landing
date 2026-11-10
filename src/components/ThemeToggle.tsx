import { type MouseEvent, useId } from 'react';

import { setTheme, useTheme } from '#/lib/theme';

/**
 * Switches between light and dark. The new theme spreads out in a circle from
 * the button where the browser supports view transitions, and swaps instantly
 * for reduced motion.
 */
interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const theme = useTheme();
  const maskId = useId();
  const next = theme === 'light' ? 'dark' : 'light';

  function toggle(event: MouseEvent<HTMLButtonElement>) {
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (still || !('startViewTransition' in document)) {
      setTheme(next);

      return;
    }

    const button = event.currentTarget.getBoundingClientRect();
    const x = button.left + button.width / 2;
    const y = button.top + button.height / 2;

    const radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );

    const transition = document.startViewTransition(() => setTheme(next));

    transition.ready
      .then(() => {
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${radius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: 700,
            easing: 'cubic-bezier(0.65, 0, 0.35, 1)',
            pseudoElement: '::view-transition-new(root)',
          },
        );
      })
      .catch(() => undefined);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === null ? 'Switch theme' : `Switch to ${next} mode`}
      className={`grid size-9 place-items-center rounded-full border border-white/30 bg-black/10 text-white backdrop-blur-md transition-colors hover:border-white/70 ${className}`}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" className="size-[1.125rem]">
        <mask id={maskId}>
          <rect width="24" height="24" fill="white" />
          <circle
            className="theme-icon-bite"
            cx="25"
            cy="3"
            r="6.5"
            fill="black"
          />
        </mask>
        <circle
          cx="12"
          cy="12"
          r="6"
          fill="currentColor"
          mask={`url(#${maskId})`}
        />
        <g
          className="theme-icon-rays"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <path d="M12 1.5v2M12 20.5v2M1.5 12h2M20.5 12h2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M4.6 19.4 6 18M18 6l1.4-1.4" />
        </g>
      </svg>
    </button>
  );
}
