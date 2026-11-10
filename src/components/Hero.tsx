import { useId } from 'react';

import meadowAv1 from '#/assets/scenes/meadow.av1.mp4';
import meadowH264 from '#/assets/scenes/meadow.h264.mp4';
import meadow from '#/assets/scenes/meadow.webp';
import starsAv1 from '#/assets/scenes/stars.av1.mp4';
import starsH264 from '#/assets/scenes/stars.h264.mp4';
import stars from '#/assets/scenes/stars.webp';
import {
  type ArcName,
  arcs,
  contrail,
  throwCount,
  throwCss,
} from '#/lib/throw';
import { type Project, projects } from '#/projects';

import { Phone, WebPage } from './Devices';
import { ForTheme } from './ForTheme';
import { LoopVideo } from './LoopVideo';

const thrown = projects.slice(0, throwCount);
const css = throwCss(thrown.map((project) => project.thumb.kind));

const footageClass =
  'hero-footage absolute inset-0 -z-20 size-full object-cover';

/**
 * The hero sits on footage: a meadow by day, stars by night. Its text stays
 * white in both themes.
 */
export function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="hero relative isolate overflow-hidden pt-24 text-white md:pt-28"
    >
      <ForTheme
        light={
          <LoopVideo
            loop={{ av1: meadowAv1, h264: meadowH264, poster: meadow }}
            className={footageClass}
          />
        }
        dark={
          <LoopVideo
            loop={{ av1: starsAv1, h264: starsH264, poster: stars }}
            className={footageClass}
          />
        }
      />
      <div aria-hidden="true" className="hero-scrim absolute inset-0 -z-10" />

      <div className="mx-auto max-w-5xl px-6 text-center">
        <h1
          id="hero-title"
          className="font-serif text-[clamp(3.25rem,7vw,6.5rem)] leading-[0.92] tracking-[-0.015em] text-balance [text-shadow:0_2px_30px_rgb(0_0_0/0.25)]"
        >
          We build things and yeet them out the door.
        </h1>
        <p className="mx-auto mt-7 max-w-[30rem] text-lg leading-relaxed text-balance text-white/90 [text-shadow:0_1px_16px_rgb(0_0_0/0.35)]">
          Everything here is free, and all the code is on GitHub.
        </p>
      </div>

      <div className="throw relative -mt-2 w-full overflow-hidden md:-mt-6">
        <style>{css}</style>
        <Contrail name="wide" className="max-md:hidden" />
        <Contrail name="narrow" className="md:hidden" />
        {thrown.map((project, index) => (
          <a
            key={project.id}
            href={`#${project.id}`}
            aria-label={project.name}
            className={`flier flier-${index}`}
          >
            {project.thumb.src.light === project.thumb.src.dark ? (
              <Thumb kind={project.thumb.kind} src={project.thumb.src.dark} />
            ) : (
              <ForTheme
                light={
                  <Thumb
                    kind={project.thumb.kind}
                    src={project.thumb.src.light}
                  />
                }
                dark={
                  <Thumb
                    kind={project.thumb.kind}
                    src={project.thumb.src.dark}
                  />
                }
              />
            )}
          </a>
        ))}
      </div>
    </section>
  );
}

interface ThumbProps {
  kind: Project['thumb']['kind'];
  src: string;
}

/** A thrown project: a phone, or a web page for a site. */
function Thumb({ kind, src }: ThumbProps) {
  if (kind === 'phone') return <Phone src={src} alt="" />;

  return (
    <WebPage>
      <img src={src} alt="" width={800} height={450} decoding="async" />
    </WebPage>
  );
}

interface ContrailProps {
  name: ArcName;
  className: string;
}

/** A soft vapour trail, drawn behind the furthest throw as it flies. */
function Contrail({ name, className }: ContrailProps) {
  const id = useId();
  const trail = contrail(name);

  if (trail === null) return null;

  const timing = {
    animationDelay: `${trail.delay}s`,
    animationDuration: `${trail.duration}s`,
  };

  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 100 ${arcs[name].height}`}
      className={`contrail absolute inset-0 size-full ${className}`}
    >
      <defs>
        <linearGradient
          id={`${id}-fade`}
          gradientUnits="userSpaceOnUse"
          x1={trail.from}
          x2={trail.to}
          y1="0"
          y2="0"
        >
          <stop offset="0" stopColor="white" stopOpacity="0" />
          <stop offset="0.55" stopColor="white" stopOpacity="0.45" />
          <stop offset="1" stopColor="white" stopOpacity="0.95" />
        </linearGradient>
        <filter id={`${id}-haze`} x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation={trail.width * 1.6} />
        </filter>
      </defs>
      <path
        d={trail.path}
        pathLength={1}
        stroke={`url(#${id}-fade)`}
        strokeWidth={trail.width * 5}
        filter={`url(#${id}-haze)`}
        opacity="0.55"
        style={timing}
      />
      <path
        d={trail.path}
        pathLength={1}
        stroke={`url(#${id}-fade)`}
        strokeWidth={trail.width}
        style={timing}
      />
    </svg>
  );
}
