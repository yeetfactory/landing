/**
 * The hero's throw: projects leave the bottom-left corner on one parabola and
 * hang there mid-air. Coordinates are in cqw of the art box (1 = 1% of its
 * width), so the drawing scales with the page.
 *
 * Everything is plain CSS generated here at prerender time, so the throw plays
 * before any JavaScript loads and stays still for reduced motion.
 */

interface Point {
  readonly x: number;
  readonly y: number;
}

interface Arc {
  /** Art box height in cqw. The box keeps an aspect ratio of 100 : height. */
  readonly height: number;
  readonly launch: Point;
  readonly apex: Point;
  /** Width of the contrail's bright core. */
  readonly trail: number;
}

export const arcs = {
  wide: {
    height: 40,
    launch: { x: -2, y: 50 },
    apex: { x: 51, y: 13 },
    trail: 0.22,
  },
  narrow: {
    height: 100,
    launch: { x: -8, y: 124 },
    apex: { x: 48, y: 30 },
    trail: 0.6,
  },
} as const satisfies Readonly<Record<string, Arc>>;

export type ArcName = keyof typeof arcs;

export type ThumbKind = 'phone' | 'browser';

/** How wide each kind of thing is drawn on each arc. */
const widths: Readonly<Record<ThumbKind, Readonly<Record<ArcName, number>>>> = {
  phone: { wide: 8.5, narrow: 21 },
  browser: { wide: 19, narrow: 34 },
};

/** A place on the arc where one thrown project hangs. */
interface Slot {
  readonly x: Readonly<Record<ArcName, number>>;
  /** Final angle, and how far it turned on the way, in degrees. */
  readonly angle: number;
  readonly turn: number;
  /** Seconds after the page loads. Further slots are thrown first. */
  readonly delay: number;
}

const slots: readonly Slot[] = [
  { x: { wide: 24, narrow: 16 }, angle: -13, turn: -110, delay: 0.45 },
  { x: { wide: 51, narrow: 46 }, angle: 5, turn: 190, delay: 0.3 },
  { x: { wide: 79, narrow: 76 }, angle: 9, turn: -140, delay: 0.15 },
];

/** How many projects the hero throws. */
export const throwCount = slots.length;

const flightSeconds = 1.6;

/** Fewer than this many keyframes shows the straight segments between them. */
const keyframeCount = 32;

function format(value: number): string {
  return String(Number(value.toFixed(2)));
}

function heightAt(arc: Arc, x: number): number {
  const reach = arc.launch.x - arc.apex.x;
  const drop = arc.launch.y - arc.apex.y;

  return arc.apex.y + (drop * (x - arc.apex.x) ** 2) / reach ** 2;
}

/** Fast out of the door, settling as if the camera slowed to a stop. */
function settle(time: number): number {
  return 1 - (1 - time) ** 3;
}

function pose(arc: Arc, slot: Slot, restX: number, progress: number): string {
  const x = arc.launch.x + (restX - arc.launch.x) * progress;
  const y = heightAt(arc, x);
  const angle = slot.angle - slot.turn * (1 - progress);

  return `translate(${format(x)}cqw, ${format(y)}cqw) translate(-50%, -50%) rotate(${format(angle)}deg)`;
}

function flierCss(index: number, kind: ThumbKind, name: ArcName): string {
  const slot = slots[index];

  if (slot === undefined) return '';

  const arc = arcs[name];
  const restX = slot.x[name];

  const frames = Array.from({ length: keyframeCount + 1 }, (_, step) => {
    const time = step / keyframeCount;

    return `${format(time * 100)}%{transform:${pose(arc, slot, restX, settle(time))}}`;
  });

  return [
    `.flier-${index}{width:${format(widths[kind][name])}cqw;transform:${pose(arc, slot, restX, 1)}}`,
    `@media (prefers-reduced-motion:no-preference){.flier-${index}{animation:fly-${index}-${name} ${flightSeconds}s linear ${slot.delay}s both}}`,
    `@keyframes fly-${index}-${name}{${frames.join('')}}`,
  ].join('');
}

function arcCss(kinds: readonly ThumbKind[], name: ArcName): string {
  return [
    `.throw{aspect-ratio:100/${arcs[name].height}}`,
    ...kinds.map((kind, index) => flierCss(index, kind, name)),
  ].join('');
}

/**
 * Stylesheet for throwing these kinds of thing, in slot order. Wide is the
 * default; narrow applies below Tailwind's md breakpoint.
 */
export function throwCss(kinds: readonly ThumbKind[]): string {
  return `${arcCss(kinds, 'wide')}@media (width < 48rem){${arcCss(kinds, 'narrow')}}`;
}

/** The contrail behind the throws, from the launch to the furthest one. */
interface Contrail {
  /** One quadratic curve, which a parabola is exactly. */
  readonly path: string;
  /** Where the trail starts and ends along x, for its fade. */
  readonly from: number;
  readonly to: number;
  readonly width: number;
  /** Drawn in step with the furthest throw, in seconds. */
  readonly delay: number;
  readonly duration: number;
}

export function contrail(name: ArcName): Contrail | null {
  const arc = arcs[name];
  const lead = slots.at(-1);

  if (lead === undefined) return null;

  const from = arc.launch.x;
  const to = lead.x[name];
  const reach = arc.launch.x - arc.apex.x;
  const drop = arc.launch.y - arc.apex.y;
  const slope = (2 * drop * (from - arc.apex.x)) / reach ** 2;
  const start = heightAt(arc, from);

  const control = {
    x: (from + to) / 2,
    y: start + (slope * (to - from)) / 2,
  };

  return {
    path: `M${format(from)} ${format(start)}Q${format(control.x)} ${format(control.y)} ${format(to)} ${format(heightAt(arc, to))}`,
    from,
    to,
    width: arc.trail,
    delay: lead.delay,
    duration: flightSeconds,
  };
}
