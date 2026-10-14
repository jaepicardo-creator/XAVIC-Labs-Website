import { ArrowUpRight } from "lucide-react";
import type { Project } from "./ProjectCard";
export default function ProjectPage({ project }: { project: Project }) {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <main id="main" className="container project-page">
        <a className="text-link" href="../../#projects">
          ← Back to projects
        </a>
        <div className="eyebrow">XAVIC-LABS / {project.category}</div>
        <h1>{project.name}</h1>
        {project.fullName && <h2>{project.fullName}</h2>}
        {project.tagline && (
          <p className="project-tagline">{project.tagline}</p>
        )}
        <p className="about-intro">{project.description}</p>
        <dl className="project-facts">
          <div>
            <dt>Status</dt>
            <dd>{project.status}</dd>
          </div>
          {project.platform && (
            <div>
              <dt>Target platform</dt>
              <dd>{project.platform}</dd>
            </div>
          )}
          {project.priority && (
            <div>
              <dt>Priority</dt>
              <dd>{project.priority}</dd>
            </div>
          )}
        </dl>
        {project.slogan && <blockquote>{project.slogan}</blockquote>}
        <p>
          These descriptions express the project’s direction and design goals.
          Development status does not imply a released product or verified
          functionality. No public release or download is announced here.
        </p>
        <a className="button primary" href="../../#contact">
          Connect with the lab <ArrowUpRight size={18} />
        </a>
      </main>
    </>
  );
}
