/* ═══════════════════════════════════════════════════════════
   AboutSection — Operative Dossier & Technical Profile
   ═══════════════════════════════════════════════════════════ */

import { useState } from 'react';
import type { Profile } from '../../types/api';
import './AboutSkills.css';

interface Props {
  profile: Profile | null;
}

export default function AboutSection({ profile }: Props) {
  const [isPhotoFlipped, setIsPhotoFlipped] = useState(false);

  if (!profile) return null;

  const secResumeUrl = profile.resume_security_url || '/resumes/cybersecurity.pdf';
  const softResumeUrl = profile.resume_software_url || '/resumes/software-development.pdf';

  return (
    <section className="about-section" id="about">
      <div className="section-container">
        {/* Section Header with editorial poster aesthetics */}
        <div className="section-header">
          <div className="section-header__tag">INDEX REF: SEC-01 // OPERATIVE DOSSIER</div>
          <h2 className="section-title">FIELD INTEL & PROFILE</h2>
          <p className="section-subtitle">
            Background dispatch, offensive security research, defensive architectures, and dual-track software engineering.
          </p>
        </div>

        <div className="about-grid">
          {/* Left Column: Dossier Column */}
          <div className="dossier-column">
            <div className="dossier-card">
              <div className="dossier-card__header">
                <span className="dossier-card__badge">CLASSIFIED // RECORD #001</span>
                <span className="dossier-card__loc">LOC: {profile.location.toUpperCase()}</span>
              </div>

              <div className="dossier-card__body">
                {/* Identity Card: Stationary Info with Flipping HARDIK-G Photo Box */}
                <div className="dossier-id-block">
                  <div
                    className={`dossier-photo-flip-container ${isPhotoFlipped ? 'is-flipped' : ''}`}
                    onClick={() => setIsPhotoFlipped((prev) => !prev)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setIsPhotoFlipped((prev) => !prev);
                      }
                    }}
                    tabIndex={0}
                    role="button"
                    aria-label="Operative Biometric Photo (Click to flip)"
                    title="Operative Biometric Photo (Click to flip)"
                  >
                    <div className="dossier-photo-flipper">
                      {/* Front Side: HARDIK-G Box */}
                      <div className="dossier-photo-front dossier-id-photo-placeholder">
                        <div className="dossier-id-scanline"></div>
                        <span className="dossier-id-code">ID: HARDIK-G</span>
                        <div className="dossier-fingerprint">
                          <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="50" cy="50" r="15" strokeDasharray="3 3" />
                            <circle cx="50" cy="50" r="28" strokeDasharray="6 4" />
                            <circle cx="50" cy="50" r="40" strokeDasharray="8 6" />
                          </svg>
                        </div>
                      </div>

                      {/* Back Side: Pixel-Art Avatar */}
                      <div className="dossier-photo-back">
                        <img
                          src="/images/hardik_avatar_pixel.png"
                          alt="Hardik Gaikwad Biometric Pixel Avatar"
                          className="dossier-avatar-pixel-img"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Stationary Details */}
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

                {/* Academic & Secondary Education Block */}
                <div className="dossier-edu-block">
                  <h4 className="dossier-heading">ACADEMIC FORMATION</h4>
                  <div className="dossier-edu-item">
                    <div className="dossier-edu-title">Jabalpur Engineering College (JEC)</div>
                    <div className="dossier-edu-meta">B.Tech in Information Technology • 2023 – 2027</div>
                    <div className="dossier-edu-score">CGPA: <strong>7.69</strong> (up to 6th Semester) — Jabalpur, India</div>
                  </div>
                  <div className="dossier-edu-item">
                    <div className="dossier-edu-title">Bal Bhavan School — CBSE</div>
                    <div className="dossier-edu-meta">Secondary & Higher Secondary Education</div>
                    <div className="dossier-edu-score">Class XII: <strong>90.8%</strong> | Class X: <strong>90.2%</strong></div>
                  </div>
                </div>

                {/* Dual Resume Download Actions */}
                <div className="dossier-action-group">
                  <a
                    href={secResumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="dossier-resume-btn dossier-resume-btn--primary"
                  >
                    CYBERSECURITY RESUME 🡭
                  </a>
                  <a
                    href={softResumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="dossier-resume-btn dossier-resume-btn--secondary"
                  >
                    SOFTWARE DEVELOPMENT RESUME 🡭
                  </a>
                </div>
              </div>
            </div>

            {/* Community & Leadership — In Left Dossier Column directly below Classified Record #001 */}
            <div className="intel-panel community-standalone-block">
              <div className="intel-panel__header">
                <h3 className="intel-panel__title">COMMUNITY & LEADERSHIP</h3>
                <span className="intel-panel__status">VOLUNTEER</span>
              </div>
              <div className="intel-volunteering">
                <div className="intel-vol-title">VulnCon — Security Conference</div>
                <div className="intel-vol-role">Core Team Member & Media Team Lead</div>
                <p className="intel-vol-desc">
                  Contributed to video editing and media content creation, coordinated event coverage across photographers and videographers, and served as a key point of contact between the Media and Social Media teams.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Intel Panels (Certs, Directives, Vectors) */}
          <div className="intel-panels">
            {/* Certifications Panel */}
            <div className="intel-panel">
              <div className="intel-panel__header">
                <h3 className="intel-panel__title">CERTIFICATIONS & RECOGNITION</h3>
                <span className="intel-panel__status intel-panel__status--gold">VERIFIED</span>
              </div>
              <div className="intel-certs">
                <div className="intel-cert-item">
                  <div className="intel-cert-badge">eJPT</div>
                  <div className="intel-cert-info">
                    <div className="intel-cert-name">eLearnSecurity Junior Penetration Tester</div>
                    <p className="intel-cert-desc">
                      Full kill-chain network pentesting, reconnaissance, vulnerability identification, exploitation, credential attacks, and lateral movement via pivoting.
                    </p>
                  </div>
                </div>

                <div className="intel-cert-item">
                  <div className="intel-cert-badge">THM</div>
                  <div className="intel-cert-info">
                    <div className="intel-cert-name">TryHackMe — Global Top 4%</div>
                    <p className="intel-cert-desc">
                      Completed Pre Security, Cyber Security 101, and Jr Penetration Tester paths covering networking fundamentals, exploitation techniques, and web app attacks.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Directives */}
            {profile.currently_doing && profile.currently_doing.length > 0 && (
              <div className="intel-panel">
                <div className="intel-panel__header">
                  <h3 className="intel-panel__title">ACTIVE DIRECTIVES & MISSIONS</h3>
                  <span className="intel-panel__status">ENGAGED</span>
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

            {/* Core Focus Vectors */}
            {profile.focus_areas && profile.focus_areas.length > 0 && (
              <div className="intel-panel">
                <div className="intel-panel__header">
                  <h3 className="intel-panel__title">SECURITY & DEVELOPMENT VECTORS</h3>
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
