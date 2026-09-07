/* ═══════════════════════════════════════════════════════════
   ProjectsSection — Classified Operations & Engineering Works
   ═══════════════════════════════════════════════════════════ */

import { useState, useMemo } from 'react';
import type { Project } from '../../types/api';
import ProjectCard from './ProjectCard';
import ProjectDetailModal from './ProjectDetailModal';
import './Projects.css';

interface Props {
  projects: Project[];
}

export default function ProjectsSection({ projects }: Props) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'FEATURED' | 'SECURITY' | 'SOFTWARE' | 'LAB' | string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Extract distinct categories or security domains
  const categories = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => {
      if (p.security_category) set.add(p.security_category);
    });
    return Array.from(set);
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      // Filter by tag/category/track
      if (activeFilter === 'FEATURED' && !p.featured) return false;
      if (activeFilter === 'SECURITY' && p.project_type !== 'security') return false;
      if (activeFilter === 'SOFTWARE' && p.project_type !== 'software') return false;
      if (activeFilter === 'LAB' && p.project_type !== 'lab') return false;
      if (
        !['ALL', 'FEATURED', 'SECURITY', 'SOFTWARE', 'LAB'].includes(activeFilter) &&
        p.security_category !== activeFilter
      ) {
        return false;
      }

      // Filter by search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(q);
        const matchesDesc = p.short_description.toLowerCase().includes(q);
        const matchesTech = p.technologies ? p.technologies.some((t) => t.toLowerCase().includes(q)) : false;
        const matchesCategory = p.security_category ? p.security_category.toLowerCase().includes(q) : false;
        return matchesTitle || matchesDesc || matchesTech || matchesCategory;
      }
      return true;
    });
  }, [projects, activeFilter, searchQuery]);

  return (
    <section className="projects-section" id="projects">
      <div className="section-container">
        {/* Section Header with editorial poster aesthetics */}
        <div className="section-header">
          <div className="section-header__tag">INDEX REF: SEC-03 // ENGINEERING PORTFOLIO</div>
          <h2 className="section-title">PROJECT DOSSIER</h2>
          <p className="section-subtitle">
            Curated systems, offensive/defensive cybersecurity tools, web applications, and research environments. Synchronized from GitHub and internal case archives.
          </p>
        </div>

        {/* Filter controls */}
        <div className="projects-controls">
          <div className="projects-filters">
            <button
              className={`filter-btn ${activeFilter === 'ALL' ? 'filter-btn--active' : ''}`}
              onClick={() => setActiveFilter('ALL')}
            >
              ALL OPERATIONS ({projects.length})
            </button>
            <button
              className={`filter-btn ${activeFilter === 'FEATURED' ? 'filter-btn--active' : ''}`}
              onClick={() => setActiveFilter('FEATURED')}
            >
              ★ FEATURED ({projects.filter((p) => p.featured).length})
            </button>
            <button
              className={`filter-btn ${activeFilter === 'SECURITY' ? 'filter-btn--active' : ''}`}
              onClick={() => setActiveFilter('SECURITY')}
            >
              [OFFSEC & SEC]
            </button>
            <button
              className={`filter-btn ${activeFilter === 'SOFTWARE' ? 'filter-btn--active' : ''}`}
              onClick={() => setActiveFilter('SOFTWARE')}
            >
              [SOFTWARE DEV]
            </button>
            {projects.some(p => p.project_type === 'lab') && (
              <button
                className={`filter-btn ${activeFilter === 'LAB' ? 'filter-btn--active' : ''}`}
                onClick={() => setActiveFilter('LAB')}
              >
                [LAB / NETWORK]
              </button>
            )}
            {categories.slice(0, 3).map((cat) => (
              <button
                key={cat}
                className={`filter-btn ${activeFilter === cat ? 'filter-btn--active' : ''}`}
                onClick={() => setActiveFilter(cat)}
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="projects-search">
            <input
              type="text"
              placeholder="SEARCH PROJECT OR TECH..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="projects-search-input"
            />
          </div>
        </div>

        {/* Project grid */}
        {filteredProjects.length > 0 ? (
          <div className="projects-grid">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onSelect={(p) => setSelectedProject(p)}
              />
            ))}
          </div>
        ) : (
          <div className="projects-empty">
            <p className="projects-empty__text">NO MATCHING DOSSIERS LOCATED IN FILE ARCHIVE.</p>
            <button
              className="filter-btn filter-btn--active"
              onClick={() => {
                setActiveFilter('ALL');
                setSearchQuery('');
              }}
            >
              RESET FILTERS
            </button>
          </div>
        )}
      </div>

      {/* Project Detail Modal */}
      <ProjectDetailModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
}
