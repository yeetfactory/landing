import meadowAv1 from '#/assets/scenes/meadow.av1.mp4';
import meadowH264 from '#/assets/scenes/meadow.h264.mp4';
import meadow from '#/assets/scenes/meadow.webp';
import starsAv1 from '#/assets/scenes/stars.av1.mp4';
import starsH264 from '#/assets/scenes/stars.h264.mp4';
import stars from '#/assets/scenes/stars.webp';

import { ForTheme } from './ForTheme';
import { LoopVideo } from './LoopVideo';
import { ProjectCarousel } from './ProjectCarousel';

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

      <ProjectCarousel />
    </section>
  );
}
