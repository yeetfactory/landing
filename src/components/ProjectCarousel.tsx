import { useState } from 'react';

import { useCarousel } from '#/lib/useCarousel';
import { type Project, projects } from '#/projects';

import { Phone, WebPage } from './Devices';
import { ForTheme } from './ForTheme';

const previewOrder = ['deja', 'rexi', 'recur', 'crumple'];

const previews = previewOrder.flatMap((id) =>
  projects.filter((project) => project.id === id),
);

/** Three identical sets let native scrolling wrap in either direction. */
export function ProjectCarousel() {
  const [paused, setPaused] = useState(false);
  const ref = useCarousel(paused);

  return (
    <section
      aria-label="Project previews"
      aria-roledescription="carousel"
      className="preview-carousel relative mt-10 pb-6 md:mt-12 md:pb-10"
    >
      <div ref={ref} className="preview-scroller">
        <div className="preview-track">
          {[0, 1, 2].map((copy) => (
            <div
              key={copy}
              data-carousel-set=""
              data-carousel-main={copy === 1 ? '' : undefined}
              aria-hidden={copy !== 1 ? true : undefined}
              className="preview-set"
            >
              {previews.map((project) => (
                <a
                  key={project.id}
                  href={`#${project.id}`}
                  aria-label={`Explore ${project.name}`}
                  tabIndex={copy === 1 ? 0 : -1}
                  data-featured={project.id === 'rexi' ? '' : undefined}
                  className={`preview-item preview-${project.thumb.kind}`}
                >
                  <Preview project={project} />
                </a>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="mx-auto flex max-w-6xl justify-end px-6 md:absolute md:right-6 md:bottom-6 md:p-0">
        <button
          type="button"
          onClick={() => setPaused(!paused)}
          aria-label={
            paused ? 'Resume automatic scrolling' : 'Pause automatic scrolling'
          }
          aria-pressed={paused}
          className="grid size-11 place-items-center rounded-full border border-white/30 bg-black/25 text-white transition-colors hover:bg-black/45 motion-reduce:hidden"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4">
            {paused ? (
              <path d="m8 5 11 7-11 7Z" fill="currentColor" />
            ) : (
              <path d="M9 5v14M15 5v14" stroke="currentColor" strokeWidth="3" />
            )}
          </svg>
        </button>
      </div>
    </section>
  );
}

function Preview({ project }: { project: Project }) {
  const { thumb } = project;

  if (thumb.src.light === thumb.src.dark) {
    return <Thumbnail kind={thumb.kind} src={thumb.src.light} />;
  }

  return (
    <ForTheme
      light={<Thumbnail kind={thumb.kind} src={thumb.src.light} />}
      dark={<Thumbnail kind={thumb.kind} src={thumb.src.dark} />}
    />
  );
}

interface ThumbnailProps {
  kind: Project['thumb']['kind'];
  src: string;
}

function Thumbnail({ kind, src }: ThumbnailProps) {
  if (kind === 'phone') return <Phone src={src} alt="" />;

  return (
    <WebPage>
      <img
        src={src}
        alt=""
        width={800}
        height={450}
        decoding="async"
        draggable={false}
      />
    </WebPage>
  );
}
