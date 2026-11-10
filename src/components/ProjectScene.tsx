import type { Project, Screen } from '#/projects';

import { Phone, WebPage } from './Devices';
import { ForTheme } from './ForTheme';
import { LoopVideo } from './LoopVideo';
import { PillLink } from './PillLink';

interface ProjectSceneProps {
  project: Project;
}

const sceneClass = 'absolute inset-0 -z-20 size-full object-cover';

/**
 * One project: its screens set in a landscape, then what it is and where to
 * get it. The landscape and the screens follow the theme: day and the app's
 * light mode, or night and its dark mode. Every project uses this, so adding
 * one is a new entry in projects.ts.
 */
export function ProjectScene({ project }: ProjectSceneProps) {
  const titleId = `${project.id}-title`;

  return (
    <article
      id={project.id}
      aria-labelledby={titleId}
      className="mx-auto max-w-6xl px-4 sm:px-6"
    >
      <div className="scene relative isolate aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-fg/5 sm:aspect-[16/10] lg:aspect-video">
        <ForTheme
          light={
            <LoopVideo loop={project.scene.light} className={sceneClass} />
          }
          dark={<LoopVideo loop={project.scene.dark} className={sceneClass} />}
        />
        <div
          aria-hidden="true"
          className="scene-shade absolute inset-0 -z-10"
        />
        <SceneMedia media={project.media} />
      </div>

      <div className="mt-10 grid gap-6 px-2 md:mt-14 md:grid-cols-2 md:gap-12">
        <div>
          <h2
            id={titleId}
            className="font-serif text-[clamp(3.75rem,8vw,6.5rem)] leading-[0.88] tracking-[-0.02em]"
          >
            {project.name}
          </h2>
          <p className="mt-4 max-w-md font-serif text-[clamp(1.625rem,2.6vw,2.125rem)] leading-tight text-balance">
            {project.promise}
          </p>
        </div>
        <div className="md:pt-3">
          <p className="max-w-md text-lg leading-relaxed text-pretty text-mute">
            {project.description}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {project.actions.map((action, index) => (
              <PillLink
                key={action.href}
                href={action.href}
                look={index === 0 ? 'primary' : 'secondary'}
              >
                {action.label}
              </PillLink>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

interface SceneMediaProps {
  media: Project['media'];
}

function SceneMedia({ media }: SceneMediaProps) {
  if (media.kind === 'browser') {
    return (
      <div className="absolute inset-0 grid place-items-center p-[4cqw]">
        <WebPage className="w-[88cqw] sm:w-[70cqw]">
          <LoopVideo
            loop={media.loop}
            label={media.alt}
            className="block aspect-video w-full"
          />
        </WebPage>
      </div>
    );
  }

  return (
    <ForTheme
      light={<Phones screens={media.screens.light} />}
      dark={<Phones screens={media.screens.dark} />}
    />
  );
}

interface PhonesProps {
  screens: readonly Screen[];
}

/** A row of phones, every other one raised a little. */
function Phones({ screens }: PhonesProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center gap-[3cqw]">
      {screens.map((screen, index) => (
        <Phone
          key={screen.src}
          src={screen.src}
          alt={screen.alt}
          className={`scene-phone ${index % 2 === 1 ? 'scene-phone-raised' : ''}`}
        />
      ))}
    </div>
  );
}
