/* ═══════════════════════════════════════════════════════════
   AboutSection — Operative Dossier & Technical Profile
   ═══════════════════════════════════════════════════════════ */

import type { Profile } from '../../types/api';
import './AboutSkills.css';

interface Props {
  profile: Profile | null;
}

export default function AboutSection({ profile }: Props) {
  if (!profile) return null;

  return (
    <section className="about-section" id="about">
      <div className="section-container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-header__tag">INDEX REF: SEC-01 // OPERATIVE DOSSIER</div>
          <h2 className="section-title">FIELD INTEL & PROFILE</h2>
          <p className="section-subtitle">
            Background dispatch, engineering philosophies, offensive security research, and technical specializations.
          </p>
        </div>

        <div className="about-grid">
          {/* Left Column: Dossier Card */}
          <div className="dossier-card">
            <div className="dossier-card__header">
              <span className="dossier-card__badge">CLASSIFIED // RECORD #001</span>
              <span className="dossier-card__loc">LOC: {profile.location.toUpperCase()}</span>
            </div>

            <div className="dossier-card__body">
              <div className="dossier-id-block">
                <div className="dossier-id-photo-placeholder">
                  <div className="dossier-id-scanline"></div>
                  <span className="dossier-id-code">ID: {profile.name.replace(/\s+/g, '-').toUpperCase()}</span>
                  <div className="dossier-fingerprint">
                    <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="50" cy="50" r="15" strokeDasharray="3 3"/>
                      <circle cx="50" cy="50" r="28" strokeDasharray="6 4"/>
                      <circle cx="50" cy="50" r="40" strokeDasharray="8 6"/>
                    </svg>
                  </div>
                </div>

                <div className="dossier-id-details">
                  <h3 className="dossier-name">{profile.name}</h3>
                  <div className="dossier-role">{profile.title}</div>
                  <div className="dossier-subrole">{profile.subtitle}</div>
                  <div className="dossier-email">
                    <span className="dossier-label">COMM:</span> {profile.email}
                  </div>
                </div>
              </div>

              {/* Bio summary */}
              <div className="dossier-bio">
                <h4 className="dossier-heading">BACKGROUND DISPATCH</h4>
                <p className="dossier-bio-text">{profile.bio}</p>
              </div>

              {/* Resume button */}
              {profile.resume_url && (
                <div className="dossier-action">
                  <a
                    href={profile.resume_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="dossier-resume-btn"
                  >
                    DOWNLOAD DOSSIER / CV 🡭
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Directives & Specializations */}
          <div className="intel-panels">
            {/* Directives */}
            {profile.currently_doing && profile.currently_doing.length > 0 && (
              <div className="intel-panel">
                <div className="intel-panel__header">
                  <h3 className="intel-panel__title">CURRENT DIRECTIVES & MISSIONS</h3>
                  <span className="intel-panel__status">ACTIVE</span>
                </div>
                <ul className="intel-list">
                  {profile.currently_doing.map((item, idx) => (
                    <li key={idx} className="intel-list-item">
                      <span className="intel-item-index">0{idx + 1}</span>
                      <span className="intel-item-content">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Core Focus Areas */}
            {profile.focus_areas && profile.focus_areas.length > 0 && (
              <div className="intel-panel">
                <div className="intel-panel__header">
                  <h3 className="intel-panel__title">CORE SECURITY & DEV VECTORS</h3>
                  <span className="intel-panel__status">PRIORITY</span>
                </div>
                <div className="intel-badges">
                  {profile.focus_areas.map((area, idx) => (
                    <div key={idx} className="intel-badge">
                      <span className="intel-badge__dot"></span>
                      {area}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
