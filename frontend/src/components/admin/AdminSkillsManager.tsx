/* ═══════════════════════════════════════════════════════════
   AdminSkillsManager — CRUD for Skill Categories & Technical Matrix
   ═══════════════════════════════════════════════════════════ */

import { useState, useEffect } from 'react';
import type { SkillCategory } from '../../types/api';
import {
  adminFetchSkills,
  adminCreateSkillCategory,
  adminUpdateSkillCategory,
  adminDeleteSkillCategory,
} from '../../services/api';

export default function AdminSkillsManager() {
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<{ id?: number; name: string; display_order: number; skills_str: string } | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const loadSkills = async () => {
    try {
      setLoading(true);
      const data = await adminFetchSkills();
      setCategories(data);
    } catch {
      setFeedback('Failed to load skills.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSkills();
  }, []);

  const handleStartCreate = () => {
    setEditingCategory({
      name: '',
      display_order: categories.length + 1,
      skills_str: '',
    });
  };

  const handleStartEdit = (cat: SkillCategory) => {
    setEditingCategory({
      id: cat.id,
      name: cat.name,
      display_order: cat.display_order,
      skills_str: cat.skills.map((s) => s.name).join(', '),
    });
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this entire skill category?')) return;
    try {
      await adminDeleteSkillCategory(id);
      setFeedback('Category deleted.');
      loadSkills();
    } catch {
      setFeedback('Failed to delete category.');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !editingCategory.name) return;

    try {
      const skillsArray = editingCategory.skills_str
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .map((name, idx) => ({ name, display_order: idx }));

      const payload = {
        name: editingCategory.name,
        display_order: editingCategory.display_order,
        skills: skillsArray,
      };

      if (editingCategory.id) {
        await adminUpdateSkillCategory(editingCategory.id, payload);
        setFeedback('Skill category updated.');
      } else {
        await adminCreateSkillCategory(payload);
        setFeedback('Skill category created.');
      }

      setEditingCategory(null);
      loadSkills();
    } catch {
      setFeedback('Failed to save skill category.');
    }
  };

  return (
    <div className="admin-manager">
      <div className="admin-manager__header">
        <div>
          <h3 className="admin-manager__title">TECHNICAL ARSENAL & SKILLS MATRIX</h3>
          <p className="admin-manager__subtitle">Manage cybersecurity proficiencies and development categories.</p>
        </div>
        <button onClick={handleStartCreate} className="admin-btn admin-btn--primary">
          + NEW CATEGORY
        </button>
      </div>

      {feedback && (
        <div className="admin-feedback" onClick={() => setFeedback(null)}>
          {feedback} (click to dismiss)
        </div>
      )}

      {editingCategory && (
        <div className="admin-edit-card">
          <div className="admin-edit-card__header">
            <h4>{editingCategory.id ? `EDIT CATEGORY: #${editingCategory.id}` : 'NEW CATEGORY ENTRY'}</h4>
            <button onClick={() => setEditingCategory(null)} className="admin-btn-text">
              ✕ CANCEL
            </button>
          </div>

          <form onSubmit={handleSave} className="admin-form">
            <div className="admin-form-row">
              <div className="admin-form-field">
                <label>CATEGORY NAME *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Offensive Security / Penetration Testing"
                  value={editingCategory.name}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                />
              </div>
              <div className="admin-form-field">
                <label>ORDER</label>
                <input
                  type="number"
                  value={editingCategory.display_order}
                  onChange={(e) => setEditingCategory({ ...editingCategory, display_order: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="admin-form-field">
              <label>SKILLS & TOOLS (COMMA SEPARATED)</label>
              <textarea
                rows={3}
                placeholder="Metasploit, Burp Suite, Wireshark, Nmap, Ghidra"
                value={editingCategory.skills_str}
                onChange={(e) => setEditingCategory({ ...editingCategory, skills_str: e.target.value })}
              />
            </div>

            <div className="admin-form-actions">
              <button type="submit" className="admin-btn admin-btn--primary">
                SAVE CATEGORY
              </button>
              <button type="button" onClick={() => setEditingCategory(null)} className="admin-btn">
                CANCEL
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="admin-loading">RETRIEVING ARSENAL MATRIX...</div>
      ) : (
        <div className="admin-skills-cards">
          {categories.map((cat) => (
            <div key={cat.id} className="admin-skill-item">
              <div className="admin-skill-item__header">
                <div>
                  <span className="admin-skill-item__order">ORDER: {cat.display_order}</span>
                  <h4 className="admin-skill-item__title">{cat.name}</h4>
                </div>
                <div className="admin-actions-cell">
                  <button onClick={() => handleStartEdit(cat)} className="admin-btn-sm">
                    EDIT
                  </button>
                  <button onClick={() => handleDelete(cat.id)} className="admin-btn-sm admin-btn-sm--danger">
                    DEL
                  </button>
                </div>
              </div>
              <div className="admin-skill-item__tags">
                {cat.skills.map((s) => (
                  <span key={s.id} className="admin-skill-pill">
                    {s.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
