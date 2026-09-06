/* ═══════════════════════════════════════════════════════════
   ProjectDetailModal — Detailed Project Dossier View
   ═══════════════════════════════════════════════════════════ */

import { useEffect } from 'react';
import type { Project } from '../../types/api';

interface Props {
  project: Project | null;
  onClose: () => void;
}

export default function ProjectDetailModal({ project, onClose }: Props) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!project) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal header styled as classified dossier */}
        <div className="modal-header">
          <div className="modal-header__info">
            <span className="modal-header__badge">CASE FILE: #{project.id.toString().padStart(4, '0')}</span>
            <span className="modal-header__status">STATUS: {project.status.toUpperCase()}</span>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            ✕ CLOSE [ESC]
          </button>
        </div>

        <div className="modal-body">
          <h2 className="modal-title">{project.title}</h2>
          {project.security_category && (
            <p className="modal-subtitle">SECURITY DOMAIN: <strong>{project.security_category}</strong></p>
          )}

          <div className="modal-section">
            <h4 className="modal-section__heading">OVERVIEW</h4>
            <p className="modal-text">{project.short_description}</p>
            {project.long_description && (
              <p className="modal-text modal-text--secondary">{project.long_description}</p>
            )}
          </div>

          {project.architecture && (
            <div className="modal-section">
              <h4 className="modal-section__heading">ARCHITECTURE & DESIGN</h4>
              <p className="modal-text modal-text--mono">{project.architecture}</p>
            </div>
          )}

          {project.highlights && project.highlights.length > 0 && (
            <div className="modal-section">
              <h4 className="modal-section__heading">OPERATIONAL HIGHLIGHTS</h4>
              <ul className="modal-list">
                {project.highlights.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            </div>
          )}

          {project.challenges && (
            <div className="modal-section">
              <h4 className="modal-section__heading">CHALLENGES & MITIGATIONS</h4>
              <p className="modal-text">{project.challenges}</p>
            </div>
          )}

          <div className="modal-section">
            <h4 className="modal-section__heading">TECH STACK</h4>
            <div className="modal-tags">
              {project.technologies.map((tech, idx) => (
                <span key={idx} className="modal-tag">{tech}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <div className="modal-links">
            {project.live_url && (
              <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="modal-btn modal-btn--primary">
                LAUNCH LIVE SYSTEM ↗
              </a>
            )}
            {project.github_url && (
              <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="modal-btn modal-btn--secondary">
                VIEW SOURCE REPO ↗
              </a>
            )}
            {project.documentation_url && (
              <a href={project.documentation_url} target="_blank" rel="noopener noreferrer" className="modal-btn modal-btn--tertiary">
                DOCS / SPEC ↗
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
