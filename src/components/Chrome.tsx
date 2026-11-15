import { useEffect, useRef, useState } from 'react';

import { github } from '#/site';

import { PillLink } from './PillLink';
import { ThemeToggle } from './ThemeToggle';

function Wordmark() {
  return (
    <a href="/" className="font-serif text-[1.625rem] leading-none italic">
      yeetfactory
    </a>
  );
}

/** Classes for the header's pills once it has turned into a bar. */
const onBar =
  'group-data-scrolled:border-fg/20 group-data-scrolled:bg-transparent group-data-scrolled:text-fg group-data-scrolled:hover:border-fg/60';

/**
 * Stays at the top while the page scrolls. Over the hero it is see-through and
 * white; once the page moves, it becomes a frosted bar in the theme's colours.
 */
export function SiteHeader() {
  const marker = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const top = marker.current;

    if (top === null) return undefined;

    const observer = new IntersectionObserver(([entry]) => {
      setScrolled(entry?.isIntersecting === false);
    });

    observer.observe(top);

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div
        ref={marker}
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-4"
      />
      <header
        data-scrolled={scrolled ? '' : undefined}
        className="group fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4"
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-full border border-transparent py-2 pr-2 pl-3 text-white transition-[background-color,border-color,color,box-shadow] duration-300 group-data-scrolled:border-fg/10 group-data-scrolled:bg-bg/70 group-data-scrolled:text-fg group-data-scrolled:shadow-[0_10px_40px_-16px_rgb(0_0_0/0.4)] group-data-scrolled:backdrop-blur-xl sm:pl-4">
          <Wordmark />
          <nav
            aria-label="Site"
            className="flex shrink-0 items-center gap-3 sm:gap-4"
          >
            <ThemeToggle className={`min-h-11 min-w-11 ${onBar}`} />
            <a
              href={github}
              aria-label="YeetFactory on GitHub"
              className={`grid size-11 place-items-center rounded-full border border-white/30 bg-black/10 text-white backdrop-blur-md transition-colors hover:border-white/70 ${onBar}`}
            >
              <svg
                viewBox="0 0 16 16"
                aria-hidden="true"
                className="size-5"
                fill="currentColor"
              >
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.65 7.65 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8" />
              </svg>
            </a>
          </nav>
        </div>
      </header>
    </>
  );
}

export function SiteFooter() {
  return (
    <footer className="px-6 pt-28 pb-10 md:pt-40">
      <div className="mx-auto max-w-3xl text-center">
        <p className="font-serif text-[clamp(2.75rem,6vw,4.75rem)] leading-[0.98] text-balance">
          The next one is still in the factory.
        </p>
        <div className="mt-10">
          <PillLink look="primary" href={github}>
            Follow us on GitHub
          </PillLink>
        </div>
      </div>
      <div className="mx-auto mt-28 flex max-w-6xl items-center justify-between border-t border-fg/10 pt-8 text-sm text-mute md:mt-40">
        <Wordmark />
        <span>© 2026</span>
      </div>
    </footer>
  );
}
