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
          <nav aria-label="Site" className="flex items-center gap-3 sm:gap-4">
            <a
              href="#projects"
              className="mr-1 text-[0.9375rem] opacity-80 transition-opacity hover:opacity-100 sm:mr-2"
            >
              Projects
            </a>
            <ThemeToggle className={onBar} />
            <PillLink
              look="glass"
              href={github}
              className={`h-9 px-4 text-sm ${onBar}`}
            >
              GitHub
            </PillLink>
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
