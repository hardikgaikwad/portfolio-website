/* ═══════════════════════════════════════════════════════════
   AdminProjectsManager — CRUD for Projects & Operations
   ═══════════════════════════════════════════════════════════ */

import { useState, useEffect } from 'react';
import type { Project } from '../../types/api';
import {
  adminFetchProjects,
  adminCreateProject,
  adminUpdateProject,
  adminDeleteProject,
  adminSyncGitHub,
} from '../../services/api';

export default function AdminProjectsManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [techInput, setTechInput] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await adminFetchProjects();
      setProjects(data);
    } catch {
      setFeedback('Failed to load projects from server.');
    } finally {
      setLoading(false);
    }
  };

  const handleSyncGitHub = async () => {
    try {
      setLoading(true);
      const res = await adminSyncGitHub();
      setFeedback(`GitHub sync successful: ${res.synced?.length || 0} repositories synchronized with portfolio.`);
      loadProjects();
    } catch {
      setFeedback('Failed to sync with GitHub API.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleStartCreate = () => {
    setEditingProject({
      title: '',
      slug: '',
      short_description: '',
      long_description: '',
      technologies: [],
      github_url: '',
      live_url: '',
      featured: false,
      status: 'active',
      security_category: 'Web Security',
      display_order: projects.length + 1,
    });
    setTechInput('');
  };

  const handleStartEdit = (p: Project) => {
    setEditingProject({ ...p });
    setTechInput(p.technologies ? p.technologies.join(', ') : '');
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Confirm deletion of project record?')) return;
    try {
      await adminDeleteProject(id);
      setFeedback('Project deleted successfully.');
      loadProjects();
    } catch {
      setFeedback('Failed to delete project.');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject || !editingProject.title) return;

    try {
      const formData = new FormData();
      formData.append('title', editingProject.title || '');
      formData.append('slug', editingProject.slug || editingProject.title.toLowerCase().replace(/\s+/g, '-'));
      formData.append('short_description', editingProject.short_description || '');
      formData.append('long_description', editingProject.long_description || '');
      formData.append('github_url', editingProject.github_url || '');
      formData.append('live_url', editingProject.live_url || '');
      formData.append('featured', editingProject.featured ? 'true' : 'false');
      formData.append('status', editingProject.status || 'active');
      formData.append('security_category', editingProject.security_category || '');
      formData.append('display_order', String(editingProject.display_order || 0));

      // Parse technologies from CSV
      const techs = techInput.split(',').map((t) => t.trim()).filter(Boolean);
      formData.append('technologies', JSON.stringify(techs));

      if (editingProject.id) {
        await adminUpdateProject(editingProject.id, formData);
        setFeedback('Project updated successfully.');
      } else {
        await adminCreateProject(formData);
        setFeedback('Project created successfully.');
      }

      setEditingProject(null);
      loadProjects();
    } catch {
      setFeedback('Failed to save project. Ensure all required fields are filled.');
    }
  };

  const handleToggleFeatured = async (p: Project) => {
    try {
      const formData = new FormData();
      formData.append('featured', (!p.featured).toString());
      await adminUpdateProject(p.id, formData);
      loadProjects();
    } catch {
      setFeedback('Failed to update featured flag.');
    }
  };

  return (
    <div className="admin-manager">
      <div className="admin-manager__header">
        <div>
          <h3 className="admin-manager__title">PROJECTS & CASE FILES</h3>
          <p className="admin-manager__subtitle">Manage project records, visibility, and technical dossiers.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={handleSyncGitHub} className="admin-btn" title="Fetch repositories from github.com/hardikgaikwad">
            🔄 SYNC GITHUB
          </button>
          <button onClick={handleStartCreate} className="admin-btn admin-btn--primary">
            + NEW DOSSIER
          </button>
        </div>
      </div>

      {feedback && (
        <div className="admin-feedback" onClick={() => setFeedback(null)}>
          {feedback} (click to dismiss)
        </div>
      )}

      {editingProject && (
        <div className="admin-edit-card">
          <div className="admin-edit-card__header">
            <h4>{editingProject.id ? `EDIT DOSSIER: #${editingProject.id}` : 'NEW DOSSIER ENTRY'}</h4>
            <button onClick={() => setEditingProject(null)} className="admin-btn-text">
              ✕ CANCEL
            </button>
          </div>

          <form onSubmit={handleSave} className="admin-form">
            <div className="admin-form-row">
              <div className="admin-form-field">
                <label>PROJECT TITLE *</label>
                <input
                  type="text"
                  required
                  value={editingProject.title || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                />
              </div>
              <div className="admin-form-field">
                <label>SLUG</label>
                <input
                  type="text"
                  value={editingProject.slug || ''}
                  placeholder="auto-generated-from-title"
                  onChange={(e) => setEditingProject({ ...editingProject, slug: e.target.value })}
                />
              </div>
            </div>

            <div className="admin-form-field">
              <label>SHORT DESCRIPTION *</label>
              <input
                type="text"
                required
                value={editingProject.short_description || ''}
                onChange={(e) => setEditingProject({ ...editingProject, short_description: e.target.value })}
              />
            </div>

            <div className="admin-form-field">
              <label>LONG DESCRIPTION</label>
              <textarea
                rows={3}
                value={editingProject.long_description || ''}
                onChange={(e) => setEditingProject({ ...editingProject, long_description: e.target.value })}
              />
            </div>

            <div className="admin-form-row">
              <div className="admin-form-field">
                <label>SECURITY CATEGORY</label>
                <input
                  type="text"
                  value={editingProject.security_category || ''}
                  placeholder="e.g. Offensive Security / Web Security"
                  onChange={(e) => setEditingProject({ ...editingProject, security_category: e.target.value })}
                />
              </div>
              <div className="admin-form-field">
                <label>STATUS</label>
                <select
                  value={editingProject.status || 'active'}
                  onChange={(e) => setEditingProject({ ...editingProject, status: e.target.value as any })}
                >
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="in_progress">In Progress</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              <div className="admin-form-field">
                <label>ORDER</label>
                <input
                  type="number"
                  value={editingProject.display_order ?? 0}
                  onChange={(e) => setEditingProject({ ...editingProject, display_order: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="admin-form-row">
              <div className="admin-form-field">
                <label>GITHUB REPOSITORY URL</label>
                <input
                  type="url"
                  value={editingProject.github_url || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, github_url: e.target.value })}
                />
              </div>
              <div className="admin-form-field">
                <label>LIVE PRODUCTION URL</label>
                <input
                  type="url"
                  value={editingProject.live_url || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, live_url: e.target.value })}
                />
              </div>
            </div>

            <div className="admin-form-field">
              <label>TECHNOLOGIES (COMMA SEPARATED)</label>
              <input
                type="text"
                placeholder="Python, Django, React, Docker, Nmap"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
              />
            </div>

            <div className="admin-form-field admin-form-checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={!!editingProject.featured}
                  onChange={(e) => setEditingProject({ ...editingProject, featured: e.target.checked })}
                />
                FEATURED IN PRIMARY HIGHLIGHT REEL
              </label>
            </div>

            <div className="admin-form-actions">
              <button type="submit" className="admin-btn admin-btn--primary">
                SAVE DOSSIER RECORD
              </button>
              <button type="button" onClick={() => setEditingProject(null)} className="admin-btn">
                CANCEL
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="admin-loading">RETRIEVING ENCRYPTED PROJECT DATABASE...</div>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>TITLE</th>
                <th>DOMAIN</th>
                <th>STATUS</th>
                <th>FEATURED</th>
                <th>ORDER</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id}>
                  <td>#{p.id}</td>
                  <td className="admin-table-title">{p.title}</td>
                  <td>{p.security_category || '—'}</td>
                  <td>
                    <span className="admin-table-badge">{p.status.toUpperCase()}</span>
                  </td>
                  <td>
                    <button
                      onClick={() => handleToggleFeatured(p)}
                      className={`admin-star-btn ${p.featured ? 'admin-star-btn--active' : ''}`}
                      title="Toggle featured status"
                    >
                      {p.featured ? '★ YES' : '☆ NO'}
                    </button>
                  </td>
                  <td>{p.display_order}</td>
                  <td>
                    <div className="admin-actions-cell">
                      <button onClick={() => handleStartEdit(p)} className="admin-btn-sm">
                        EDIT
                      </button>
                      <button onClick={() => handleDelete(p.id)} className="admin-btn-sm admin-btn-sm--danger">
                        DEL
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
