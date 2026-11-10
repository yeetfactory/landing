import { useEffect, useRef } from 'react';

import type { Loop } from '#/projects';

interface LoopVideoProps {
  loop: Loop;
  className?: string;
  /** Describe the video when it carries content; leave out for scenery. */
  label?: string;
}

/**
 * A muted loop that loads and plays only while it is on screen, and never for
 * reduced motion. A video hidden by the theme never counts as on screen. Until
 * it plays, and without JavaScript, the poster shows.
 */
export function LoopVideo({ loop, className = '', label }: LoopVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    const still = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (video === null || still.matches) return undefined;

    video.muted = true;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          void video.play().catch(() => undefined);
        } else {
          video.pause();
        }
      },
      { rootMargin: '200px 0px' },
    );

    observer.observe(video);

    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      className={className}
      poster={loop.poster}
      preload="none"
      muted
      loop
      playsInline
      disablePictureInPicture
      aria-hidden={label === undefined ? true : undefined}
      aria-label={label}
    >
      <source src={loop.av1} type='video/mp4; codecs="av01.0.05M.08"' />
      <source src={loop.h264} type="video/mp4" />
    </video>
  );
}
