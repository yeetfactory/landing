import { useEffect, useRef } from 'react';

import { prefersStills } from '#/lib/stills';
import type { Loop } from '#/projects';

interface LoopVideoProps {
  loop: Loop;
  className?: string;
  /** Describe the video when it carries content; leave out for scenery. */
  label?: string;
}

/**
 * A muted loop over a still of its first frame. The still is all you see until
 * the video can play to the end without stopping; then the video fades in. A
 * stall fades back to the still until it has buffered again, so a slow
 * connection never shows a stutter.
 *
 * The video loads and plays only while on screen (a video hidden by the theme
 * never is), and never for reduced motion, Data Saver or a slow connection.
 * Without JavaScript, or when autoplay is blocked, the still stays.
 */
export function LoopVideo({ loop, className = '', label }: LoopVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;

    if (video === null || prefersStills()) return undefined;

    video.muted = true;

    const show = () => {
      video.dataset.ready = '';
    };

    const hide = () => {
      delete video.dataset.ready;
    };

    video.addEventListener('canplaythrough', show);
    video.addEventListener('waiting', hide);

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

    return () => {
      observer.disconnect();
      video.removeEventListener('canplaythrough', show);
      video.removeEventListener('waiting', hide);
    };
  }, []);

  return (
    <div
      className={`loop ${className}`}
      role={label === undefined ? undefined : 'img'}
      aria-label={label}
      aria-hidden={label === undefined ? true : undefined}
    >
      <img
        className="loop-still"
        src={loop.poster}
        alt=""
        width={1600}
        height={900}
        loading="lazy"
        decoding="async"
      />
      <video
        ref={ref}
        className="loop-motion"
        preload="none"
        muted
        loop
        playsInline
        disablePictureInPicture
        aria-hidden="true"
      >
        <source src={loop.av1} type='video/mp4; codecs="av01.0.05M.08"' />
        <source src={loop.h264} type="video/mp4" />
      </video>
    </div>
  );
}
