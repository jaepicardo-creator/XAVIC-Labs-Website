import {
  ArrowUpRight,
  Cpu,
  Layers,
  Code2,
  Orbit,
  Activity,
} from "lucide-react";
import projects from "../data/projects.json";
export type Project = (typeof projects)[number];
const icons = [Cpu, Layers, Code2, Orbit, Activity];
export default function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const Icon = icons[index];
  return (
    <article className={`project-card ${project.color}`}>
      <a
        className="project-card-link"
        href={`./projects/${project.slug}/`}
        aria-label={`View ${project.name} project`}
      >
        <div className="project-visual" aria-hidden="true">
          <span className="project-id">
            XL / {String(index + 1).padStart(2, "0")}
          </span>
          <Icon size={74} strokeWidth={1} />
          <span className="concept-badge">
            {project.priority || "PROJECT PROFILE"}
          </span>
        </div>
        <div className="project-content">
          <div className="eyebrow">{project.category}</div>
          <h3>
            {project.name} <ArrowUpRight size={18} />
          </h3>
          <p>{project.description}</p>
          <span className="project-status">
            <span className="status-dot" />
            {project.status}
          </span>
          <span className="text-link project-detail-link">
            View project <ArrowUpRight size={15} />
          </span>
        </div>
      </a>
    </article>
  );
}
