/* ═══════════════════════════════════════════════════════════
   ProjectCard — Vintage Dossier / Spec Sheet Project Card
   ═══════════════════════════════════════════════════════════ */

import type { Project } from '../../types/api';

interface Props {
  project: Project;
  onSelect: (project: Project) => void;
}

export default function ProjectCard({ project, onSelect }: Props) {
  const statusColorMap: Record<string, string> = {
    active: 'status--green',
    completed: 'status--blue',
    in_progress: 'status--amber',
    archived: 'status--gray',
  };

  const typeColorMap: Record<string, string> = {
    security: 'type--security',
    software: 'type--software',
    lab: 'type--lab',
    fullstack: 'type--fullstack',
  };

  return (
    <article className="project-card">
      <div className="project-card__top">
        <div className="project-card__meta">
          <span className={`project-card__status ${statusColorMap[project.status] || ''}`}>
            ● {project.status.toUpperCase()}
          </span>
          {project.project_type && (
            <span className={`project-card__type-tag ${typeColorMap[project.project_type] || ''}`}>
              [{project.project_type.toUpperCase()}]
            </span>
          )}
          {project.security_category && (
            <span className="project-card__category">{project.security_category}</span>
          )}
        </div>
        <div className="project-card__badges">
          {project.github_stars !== undefined && project.github_stars > 0 && (
            <span className="project-card__stars">★ {project.github_stars}</span>
          )}
          {project.featured && (
            <span className="project-card__stamp">★ FEATURED</span>
          )}
        </div>
      </div>

      <div className="project-card__content">
        <h3 className="project-card__title" onClick={() => onSelect(project)}>
          {project.title}
        </h3>
        <p className="project-card__desc">{project.short_description}</p>

        {project.technologies && project.technologies.length > 0 && (
          <div className="project-card__tags">
            {project.technologies.slice(0, 5).map((tech, idx) => (
              <span key={idx} className="project-card__tag">
                {tech}
              </span>
            ))}
            {project.technologies.length > 5 && (
              <span className="project-card__tag project-card__tag--more">
                +{project.technologies.length - 5}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="project-card__footer">
        <button
          className="project-card__action-btn project-card__action-btn--primary"
          onClick={() => onSelect(project)}
        >
          INSPECT DOSSIER 🡭
        </button>

        <div className="project-card__links">
          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="project-card__icon-link project-card__icon-link--live"
              title="Launch Live Production / Streamlit Demo"
            >
              <span className="project-card__live-indicator"></span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            </a>
          )}
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="project-card__icon-link"
              title="GitHub Source Repository"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
