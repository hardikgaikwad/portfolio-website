/* ═══════════════════════════════════════════════════════════
   AdminProfileManager — Edit Operative Dossier & Resume Upload
   ═══════════════════════════════════════════════════════════ */

import { useState, useEffect } from 'react';
import type { Profile } from '../../types/api';
import {
  adminFetchProfile,
  adminUpdateProfile,
  adminUploadResume,
} from '../../services/api';

export default function AdminProfileManager() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [focusInput, setFocusInput] = useState('');
  const [doingInput, setDoingInput] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeTrack, setResumeTrack] = useState<'general' | 'security' | 'software'>('security');
  const [feedback, setFeedback] = useState<string | null>(null);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await adminFetchProfile();
      setProfile(data);
      setFocusInput(data.focus_areas ? data.focus_areas.join(', ') : '');
      setDoingInput(data.currently_doing ? data.currently_doing.join(', ') : '');
    } catch {
      setFeedback('Failed to load profile.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    try {
      const focusAreas = focusInput.split(',').map((s) => s.trim()).filter(Boolean);
      const currentlyDoing = doingInput.split(',').map((s) => s.trim()).filter(Boolean);

      const payload = {
        name: profile.name,
        title: profile.title,
        subtitle: profile.subtitle,
        bio: profile.bio,
        email: profile.email,
        location: profile.location,
        focus_areas: focusAreas,
        currently_doing: currentlyDoing,
        about_terminal_content: profile.about_terminal_content || '',
        resume_security_url: profile.resume_security_url || '',
        resume_software_url: profile.resume_software_url || '',
      };

      const updated = await adminUpdateProfile(payload);
      setProfile(updated);
      setFeedback('Profile dossier updated successfully.');
    } catch {
      setFeedback('Failed to update profile.');
    }
  };

  const handleUploadResume = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeFile) return;

    try {
      await adminUploadResume(resumeFile, resumeTrack);
      setFeedback(`${resumeTrack.toUpperCase()} resume document uploaded and linked.`);
      loadProfile();
      setResumeFile(null);
    } catch {
      setFeedback('Failed to upload resume document.');
    }
  };

  if (loading) {
    return <div className="admin-loading">RETRIEVING OPERATIVE DOSSIER...</div>;
  }

  if (!profile) {
    return <div className="admin-loading">NO PROFILE RECORD FOUND.</div>;
  }

  return (
    <div className="admin-manager">
      <div className="admin-manager__header">
        <div>
          <h3 className="admin-manager__title">OPERATIVE DOSSIER & IDENTITY</h3>
          <p className="admin-manager__subtitle">Configure bio, titles, coordinates, and upload latest CV document.</p>
        </div>
      </div>

      {feedback && (
        <div className="admin-feedback" onClick={() => setFeedback(null)}>
          {feedback} (click to dismiss)
        </div>
      )}

      <div className="admin-profile-grid">
        {/* Profile Info Form */}
        <form onSubmit={handleSave} className="admin-form admin-profile-form">
          <div className="admin-form-row">
            <div className="admin-form-field">
              <label>FULL NAME *</label>
              <input
                type="text"
                required
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              />
            </div>
            <div className="admin-form-field">
              <label>PRIMARY TITLE *</label>
              <input
                type="text"
                required
                value={profile.title}
                onChange={(e) => setProfile({ ...profile, title: e.target.value })}
              />
            </div>
          </div>

          <div className="admin-form-field">
            <label>SUBTITLE / TICKER BANNER</label>
            <input
              type="text"
              value={profile.subtitle}
              placeholder="e.g. CYBERSECURITY • FULL-STACK • OFFENSIVE SECURITY"
              onChange={(e) => setProfile({ ...profile, subtitle: e.target.value })}
            />
          </div>

          <div className="admin-form-row">
            <div className="admin-form-field">
              <label>CONTACT EMAIL *</label>
              <input
                type="email"
                required
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              />
            </div>
            <div className="admin-form-field">
              <label>FIELD LOCATION</label>
              <input
                type="text"
                value={profile.location}
                placeholder="e.g. Global / Remote"
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
              />
            </div>
          </div>

          <div className="admin-form-field">
            <label>BIOGRAPHICAL DISPATCH *</label>
            <textarea
              rows={4}
              required
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            />
          </div>

          <div className="admin-form-field">
            <label>CORE FOCUS VECTORS (COMMA SEPARATED)</label>
            <input
              type="text"
              value={focusInput}
              placeholder="Offensive Security, Web Dev, Cloud Architecture"
              onChange={(e) => setFocusInput(e.target.value)}
            />
          </div>

          <div className="admin-form-field">
            <label>CURRENT DIRECTIVES (COMMA SEPARATED)</label>
            <input
              type="text"
              value={doingInput}
              placeholder="eJPT certification, Building secure web systems"
              onChange={(e) => setDoingInput(e.target.value)}
            />
          </div>

          <div className="admin-form-field">
            <label>TERMINAL "about.txt" CONTENT (OPTIONAL OVERRIDE)</label>
            <textarea
              rows={4}
              placeholder="Custom text output for 'cat about.txt' in the terminal. Leave blank to auto-generate from profile fields."
              value={profile.about_terminal_content || ''}
              onChange={(e) => setProfile({ ...profile, about_terminal_content: e.target.value })}
            />
          </div>

          <button type="submit" className="admin-btn admin-btn--primary">
            UPDATE DOSSIER DATA
          </button>
        </form>

        {/* Resume Box */}
        <div className="admin-resume-box">
          <h4 className="admin-resume-box__title">DUAL-TRACK CV DOCUMENTS</h4>
          <div className="admin-resume-status" style={{ marginBottom: '16px', fontSize: '0.85rem' }}>
            <div style={{ marginBottom: '6px' }}>
              <strong>1. Cybersecurity CV:</strong>{' '}
              {profile.resume_security_url ? (
                <a href={profile.resume_security_url} target="_blank" rel="noopener noreferrer">View CV ↗</a>
              ) : (
                <span style={{ color: '#888' }}>Not uploaded</span>
              )}
            </div>
            <div>
              <strong>2. Software Dev CV:</strong>{' '}
              {profile.resume_software_url ? (
                <a href={profile.resume_software_url} target="_blank" rel="noopener noreferrer">View CV ↗</a>
              ) : (
                <span style={{ color: '#888' }}>Not uploaded</span>
              )}
            </div>
          </div>

          <div className="admin-form-field" style={{ marginBottom: '12px' }}>
            <label>CYBERSECURITY CV DIRECT / HOSTED URL</label>
            <input
              type="text"
              placeholder="/resumes/cybersecurity.pdf or https://..."
              value={profile.resume_security_url || ''}
              onChange={(e) => setProfile({ ...profile, resume_security_url: e.target.value })}
            />
          </div>
          <div className="admin-form-field" style={{ marginBottom: '16px' }}>
            <label>SOFTWARE DEV CV DIRECT / HOSTED URL</label>
            <input
              type="text"
              placeholder="/resumes/software-development.pdf or https://..."
              value={profile.resume_software_url || ''}
              onChange={(e) => setProfile({ ...profile, resume_software_url: e.target.value })}
            />
          </div>

          <form onSubmit={handleUploadResume} className="admin-upload-form">
            <div className="admin-form-field">
              <label>OR UPLOAD CV DOCUMENT FILE</label>
              <select
                value={resumeTrack}
                onChange={(e) => setResumeTrack(e.target.value as any)}
                style={{ padding: '8px', marginBottom: '8px' }}
              >
                <option value="security">Cybersecurity Resume</option>
                <option value="software">Software Engineering Resume</option>
                <option value="general">General Portfolio Resume</option>
              </select>
            </div>

            <div className="admin-form-field">
              <label>SELECT CV FILE (PDF, DOC, DOCX)</label>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
              />
            </div>

            <button
              type="submit"
              disabled={!resumeFile}
              className="admin-btn admin-btn--secondary"
            >
              UPLOAD SELECTED CV 🡭
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
