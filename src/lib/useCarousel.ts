import { useEffect, useEffectEvent, useRef } from 'react';

const pixelsPerSecond = 48;
const resumeDelay = 1500;

/** Native touch/wheel scrolling, with mouse dragging and a slow automatic drift. */
export function useCarousel(paused: boolean) {
  const ref = useRef<HTMLDivElement>(null);
  const isPaused = useEffectEvent(() => paused);

  useEffect(() => {
    const scroller = ref.current;
    const set = scroller?.querySelector<HTMLElement>('[data-carousel-set]');

    if (scroller == null || set == null) return undefined;

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let cycle = 0;
    let viewportWidth = scroller.clientWidth;
    let position = 0;
    let lastTime = 0;
    let frame = 0;
    let visible = false;
    let hovered = false;
    let heldUntil = 0;
    let pointer: number | null = null;
    let mouseX = 0;
    let dragged = false;

    const measure = () => {
      const nextCycle = set.getBoundingClientRect().width;

      if (cycle === 0) {
        const featured = scroller.querySelector<HTMLElement>(
          '[data-carousel-main] [data-featured]',
        );

        if (featured !== null) {
          position =
            featured.getBoundingClientRect().left -
            scroller.getBoundingClientRect().left +
            scroller.scrollLeft +
            (featured.offsetWidth - scroller.clientWidth) / 2;
        }
      } else {
        position =
          ((scroller.scrollLeft + viewportWidth / 2) / cycle) * nextCycle -
          scroller.clientWidth / 2;
      }

      cycle = nextCycle;
      viewportWidth = scroller.clientWidth;
      scroller.scrollLeft = position;
    };

    const hold = () => {
      heldUntil = performance.now() + resumeDelay;
    };

    const keydown = (event: KeyboardEvent) => {
      hold();

      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        scroller.scrollLeft += (event.key === 'ArrowRight' ? 1 : -1) * 200;
      }
    };

    const scroll = () => {
      const left = scroller.scrollLeft;

      if (scroller.querySelector(':focus-visible') !== null) {
        position = left;

        return;
      }

      if (left < cycle || left >= cycle * 2) {
        // The same pixels exist one set away; keep the wrap imperceptible.
        position = cycle + (((left % cycle) + cycle) % cycle);
        scroller.scrollLeft = position;
      } else if (pointer !== null || performance.now() < heldUntil) {
        position = left;
      }
    };

    const enter = (event: PointerEvent) => {
      if (event.pointerType === 'mouse') hovered = true;
    };

    const leave = () => {
      hovered = false;
    };

    const down = (event: PointerEvent) => {
      if (!event.isPrimary || event.button !== 0) return;

      pointer = event.pointerId;
      mouseX = event.clientX;
      dragged = false;
      hold();
    };

    const move = (event: PointerEvent) => {
      if (event.pointerId !== pointer || event.pointerType !== 'mouse') return;

      const distance = event.clientX - mouseX;

      if (!dragged && Math.abs(distance) < 6) return;

      dragged = true;
      scroller.setPointerCapture(event.pointerId);
      scroller.dataset.dragging = '';
      scroller.scrollLeft -= distance;
      mouseX = event.clientX;
      position = scroller.scrollLeft;
    };

    const up = (event: PointerEvent) => {
      if (event.pointerId !== pointer) return;

      pointer = null;
      delete scroller.dataset.dragging;
      hold();

      if (scroller.hasPointerCapture(event.pointerId)) {
        scroller.releasePointerCapture(event.pointerId);
      }
    };

    const click = (event: MouseEvent) => {
      if (dragged) {
        event.preventDefault();
        dragged = false;
      }
    };

    const preventDrag = (event: DragEvent) => event.preventDefault();

    const focus = (event: FocusEvent) => {
      const target = event.target;

      if (
        target instanceof HTMLAnchorElement &&
        target.matches(':focus-visible')
      ) {
        scroller.scrollLeft +=
          target.getBoundingClientRect().left -
          scroller.getBoundingClientRect().left +
          (target.offsetWidth - scroller.clientWidth) / 2;
        position = scroller.scrollLeft;
      }
    };

    const tick = (time: number) => {
      const elapsed = Math.min(time - lastTime, 64);

      lastTime = time;

      if (
        visible &&
        !document.hidden &&
        !motion.matches &&
        !isPaused() &&
        !hovered &&
        pointer === null &&
        time >= heldUntil &&
        scroller.querySelector(':focus-visible') === null
      ) {
        // Keep the fractional position: scrollLeft can round to whole pixels.
        position += (elapsed * pixelsPerSecond) / 1000;

        if (position < cycle || position >= cycle * 2) {
          position = cycle + (((position % cycle) + cycle) % cycle);
        }

        scroller.scrollLeft = position;
      } else {
        position = scroller.scrollLeft;
      }

      frame = requestAnimationFrame(tick);
    };

    const resize = new ResizeObserver(measure);

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting === true;
    });

    measure();
    resize.observe(scroller);
    observer.observe(scroller);
    scroller.addEventListener('scroll', scroll, { passive: true });
    scroller.addEventListener('wheel', hold, { passive: true });
    scroller.addEventListener('keydown', keydown);
    scroller.addEventListener('pointerenter', enter);
    scroller.addEventListener('pointerleave', leave);
    scroller.addEventListener('pointerdown', down);
    scroller.addEventListener('pointermove', move);
    scroller.addEventListener('click', click, true);
    scroller.addEventListener('dragstart', preventDrag);
    scroller.addEventListener('focusin', focus);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      observer.disconnect();
      scroller.removeEventListener('scroll', scroll);
      scroller.removeEventListener('wheel', hold);
      scroller.removeEventListener('keydown', keydown);
      scroller.removeEventListener('pointerenter', enter);
      scroller.removeEventListener('pointerleave', leave);
      scroller.removeEventListener('pointerdown', down);
      scroller.removeEventListener('pointermove', move);
      scroller.removeEventListener('click', click, true);
      scroller.removeEventListener('dragstart', preventDrag);
      scroller.removeEventListener('focusin', focus);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
    };
  }, []);

  return ref;
}
