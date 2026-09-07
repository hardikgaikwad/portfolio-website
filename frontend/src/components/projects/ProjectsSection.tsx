/* ═══════════════════════════════════════════════════════════
   ProjectsSection — Classified Operations & Engineering Works
   ═══════════════════════════════════════════════════════════ */

import { useState, useMemo } from 'react';
import type { Project, ProjectCategory } from '../../types/api';
import ProjectCard from './ProjectCard';
import ProjectDetailModal from './ProjectDetailModal';
import './Projects.css';

interface Props {
  projects: Project[];
  projectFilters?: ProjectCategory[];
}

const DEFAULT_FILTERS: ProjectCategory[] = [
  { id: 1, name: 'Security', slug: 'security', display_order: 1, is_active: true },
  { id: 2, name: 'Software Development', slug: 'software-development', display_order: 2, is_active: true },
];

export default function ProjectsSection({ projects, projectFilters }: Props) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Use dynamic filters from database or fallback to initial defaults
  const activeFiltersList = useMemo(() => {
    if (projectFilters && projectFilters.length > 0) {
      return projectFilters.filter((f) => f.is_active);
    }
    return DEFAULT_FILTERS;
  }, [projectFilters]);

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      // 1. Filter by category / status
      if (activeFilter === 'FEATURED') {
        if (!p.featured) return false;
      } else if (activeFilter !== 'ALL') {
        const targetSlug = activeFilter.toLowerCase();
        const hasSlug = p.category_slugs && p.category_slugs.map((s) => s.toLowerCase()).includes(targetSlug);
        const matchesType = p.project_type?.toLowerCase() === targetSlug;
        const matchesCat = p.security_category?.toLowerCase() === targetSlug;
        const matchesSoftware = targetSlug === 'software-development' && (p.project_type === 'software' || p.project_type === 'fullstack');
        const matchesSec = targetSlug === 'security' && (p.project_type === 'security' || p.project_type === 'lab' || p.project_type === 'research');

        if (!hasSlug && !matchesType && !matchesCat && !matchesSoftware && !matchesSec) {
          return false;
        }
      }

      // 2. Filter by search query
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
            {activeFiltersList.map((filter) => {
              const targetSlug = filter.slug.toLowerCase();
              const count = projects.filter((p) => {
                const hasSlug = p.category_slugs && p.category_slugs.map((s) => s.toLowerCase()).includes(targetSlug);
                const matchesType = p.project_type?.toLowerCase() === targetSlug;
                const matchesCat = p.security_category?.toLowerCase() === targetSlug;
                const matchesSoftware = targetSlug === 'software-development' && (p.project_type === 'software' || p.project_type === 'fullstack');
                const matchesSec = targetSlug === 'security' && (p.project_type === 'security' || p.project_type === 'lab' || p.project_type === 'research');
                return hasSlug || matchesType || matchesCat || matchesSoftware || matchesSec;
              }).length;

              return (
                <button
                  key={filter.id || filter.slug}
                  className={`filter-btn ${activeFilter.toLowerCase() === targetSlug ? 'filter-btn--active' : ''}`}
                  onClick={() => setActiveFilter(filter.slug.toUpperCase())}
                >
                  {filter.name.toUpperCase()} ({count})
                </button>
              );
            })}
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
