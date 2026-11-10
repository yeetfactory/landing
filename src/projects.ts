import crumplePoster from '#/assets/projects/crumple-poster.webp';
import crumpleYeet from '#/assets/projects/crumple-yeet.webp';
import crumpleAv1 from '#/assets/projects/crumple.av1.mp4';
import crumpleH264 from '#/assets/projects/crumple.h264.mp4';
import dejaActivityDark from '#/assets/projects/deja-activity-dark.webp';
import dejaActivityLight from '#/assets/projects/deja-activity-light.webp';
import dejaAlertDark from '#/assets/projects/deja-alert-dark.webp';
import dejaAlertLight from '#/assets/projects/deja-alert-light.webp';
import dejaNearbyDark from '#/assets/projects/deja-nearby-dark.webp';
import dejaNearbyLight from '#/assets/projects/deja-nearby-light.webp';
import recurHomeDark from '#/assets/projects/recur-home-dark.webp';
import recurHomeLight from '#/assets/projects/recur-home-light.webp';
import recurSettingsDark from '#/assets/projects/recur-settings-dark.webp';
import recurSettingsLight from '#/assets/projects/recur-settings-light.webp';
import auroraAv1 from '#/assets/scenes/aurora.av1.mp4';
import auroraH264 from '#/assets/scenes/aurora.h264.mp4';
import aurora from '#/assets/scenes/aurora.webp';
import cloudsAv1 from '#/assets/scenes/clouds.av1.mp4';
import cloudsH264 from '#/assets/scenes/clouds.h264.mp4';
import clouds from '#/assets/scenes/clouds.webp';
import coastAv1 from '#/assets/scenes/coast.av1.mp4';
import coastH264 from '#/assets/scenes/coast.h264.mp4';
import coast from '#/assets/scenes/coast.webp';
import forestAv1 from '#/assets/scenes/forest.av1.mp4';
import forestH264 from '#/assets/scenes/forest.h264.mp4';
import forest from '#/assets/scenes/forest.webp';
import lakeAv1 from '#/assets/scenes/lake.av1.mp4';
import lakeH264 from '#/assets/scenes/lake.h264.mp4';
import lake from '#/assets/scenes/lake.webp';
import sunsetAv1 from '#/assets/scenes/sunset.av1.mp4';
import sunsetH264 from '#/assets/scenes/sunset.h264.mp4';
import sunset from '#/assets/scenes/sunset.webp';
import { github } from '#/site';

/** One thing in two versions: day for the light theme, night for the dark. */
interface Themed<T> {
  light: T;
  dark: T;
}

/** A muted loop. The poster stands in until it plays, and for reduced motion. */
export interface Loop {
  av1: string;
  h264: string;
  poster: string;
}

export interface Screen {
  src: string;
  alt: string;
}

type Media =
  | { kind: 'phones'; screens: Themed<readonly Screen[]> }
  | { kind: 'browser'; loop: Loop; alt: string };

interface Action {
  label: string;
  href: string;
}

export interface Project {
  id: string;
  name: string;
  /** One line under the name: what it does for you. */
  promise: string;
  description: string;
  /** The first action is the main one. */
  actions: readonly Action[];
  /** The landscape behind the project's screens, by day and by night. */
  scene: Themed<Loop>;
  media: Media;
  /** What gets thrown across the hero. */
  thumb: { kind: 'phone' | 'browser'; src: Themed<string> };
}

/** Newest worth showing first. The hero throws the first three. */
export const projects: readonly Project[] = [
  {
    id: 'deja',
    name: 'Déjà',
    promise: 'Know when something comes back.',
    description:
      'An Android app that remembers the Bluetooth and Wi‑Fi devices around you. It tells you when one turns up again, or seems to be following you from place to place. It has no internet permission, so nothing leaves your phone.',
    actions: [
      { label: 'Download for Android', href: `${github}/deja/releases/latest` },
      { label: 'View the code', href: `${github}/deja` },
    ],
    scene: {
      light: { av1: forestAv1, h264: forestH264, poster: forest },
      dark: { av1: auroraAv1, h264: auroraH264, poster: aurora },
    },
    media: {
      kind: 'phones',
      screens: {
        light: [
          {
            src: dejaNearbyLight,
            alt: 'Déjà’s Nearby screen: devices in range',
          },
          {
            src: dejaAlertLight,
            alt: 'A following alert, with the places and times as evidence',
          },
          {
            src: dejaActivityLight,
            alt: 'Activity: returns and alerts by day',
          },
        ],
        dark: [
          {
            src: dejaNearbyDark,
            alt: 'Déjà’s Nearby screen: devices in range',
          },
          {
            src: dejaAlertDark,
            alt: 'A following alert, with the places and times as evidence',
          },
          { src: dejaActivityDark, alt: 'Activity: returns and alerts by day' },
        ],
      },
    },
    thumb: {
      kind: 'phone',
      src: { light: dejaNearbyLight, dark: dejaNearbyDark },
    },
  },
  {
    id: 'recur',
    name: 'Recur',
    promise: 'Every subscription, and what they add up to.',
    description:
      'Add what you pay for, monthly or yearly, and sort it into lists like Work or Entertainment. Recur shows the total either way. Your list is saved on your phone, and there’s no account to make.',
    actions: [
      {
        label: 'Download for Android',
        href: `${github}/recur/releases/latest`,
      },
      { label: 'View the code', href: `${github}/recur` },
    ],
    scene: {
      light: { av1: coastAv1, h264: coastH264, poster: coast },
      dark: { av1: sunsetAv1, h264: sunsetH264, poster: sunset },
    },
    media: {
      kind: 'phones',
      screens: {
        light: [
          {
            src: recurHomeLight,
            alt: 'Recur’s home screen: the monthly total and a list of subscriptions',
          },
          {
            src: recurSettingsLight,
            alt: 'Recur’s settings: theme, lists, privacy and version',
          },
        ],
        dark: [
          {
            src: recurHomeDark,
            alt: 'Recur’s home screen: the monthly total and a list of subscriptions',
          },
          {
            src: recurSettingsDark,
            alt: 'Recur’s settings: theme, lists, privacy and version',
          },
        ],
      },
    },
    thumb: {
      kind: 'phone',
      src: { light: recurHomeLight, dark: recurHomeDark },
    },
  },
  {
    id: 'crumple',
    name: 'Crumple',
    promise: 'A page that crumples itself up and throws itself at you.',
    description:
      'Press YEET and the sheet comes to life. Letters drop in, a lever gets pulled, crates roll down a conveyor belt, and at the end the whole page crumples into a ball and gets thrown at you.',
    actions: [
      { label: 'Open Crumple', href: 'https://crumple.yeetfactory.top' },
      { label: 'View the code', href: `${github}/crumple-landing` },
    ],
    scene: {
      light: { av1: cloudsAv1, h264: cloudsH264, poster: clouds },
      dark: { av1: lakeAv1, h264: lakeH264, poster: lake },
    },
    media: {
      kind: 'browser',
      loop: { av1: crumpleAv1, h264: crumpleH264, poster: crumplePoster },
      alt: 'Crumple in motion: YEET drops onto blueprint paper, then crates roll down a conveyor belt',
    },
    thumb: {
      kind: 'browser',
      src: { light: crumpleYeet, dark: crumpleYeet },
    },
  },
];
