import { createFileRoute } from '@tanstack/react-router';

import { SiteFooter, SiteHeader } from '#/components/Chrome';
import { Hero } from '#/components/Hero';
import { ProjectScene } from '#/components/ProjectScene';
import { projects } from '#/projects';

export const Route = createFileRoute('/')({ component: Home });

function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <section
          id="projects"
          aria-label="Projects"
          className="flex flex-col gap-28 pt-20 md:gap-40 md:pt-28"
        >
          {projects.map((project) => (
            <ProjectScene key={project.id} project={project} />
          ))}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
