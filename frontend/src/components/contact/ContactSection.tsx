/* ═══════════════════════════════════════════════════════════
   ContactSection — Encrypted Transmission & Communication Link
   ═══════════════════════════════════════════════════════════ */

import { useState } from 'react';
import type { Profile, SocialLink } from '../../types/api';
import './Contact.css';

interface Props {
  profile: Profile | null;
  socials: SocialLink[];
}

export default function ContactSection({ profile, socials }: Props) {
  const [formData, setFormData] = useState({
    sender: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [copied, setCopied] = useState(false);

  const email = profile?.email || 'hardikgaikwad04@gmail.com';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    // Simulate transmission handshake then trigger mailto
    setTimeout(() => {
      setStatus('sent');
      const subject = encodeURIComponent(formData.subject || 'Portfolio Transmission');
      const body = encodeURIComponent(
        `Sender: ${formData.sender} (${formData.email})\n\n${formData.message}`
      );
      window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    }, 1200);
  };

  return (
    <section className="contact-section" id="contact">
      <div className="section-container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-header__tag">INDEX REF: SEC-04 // SECURE TRANSMISSIONS</div>
          <h2 className="section-title">COMMUNICATIONS CHANNEL</h2>
          <p className="section-subtitle">
            Initiate secure handshake for technical collaborations, security advisories, project inquiries, or employment opportunities.
          </p>
        </div>

        <div className="contact-grid">
          {/* Dispatch Info Box */}
          <div className="contact-info-panel">
            <div className="contact-info-panel__header">
              <span className="contact-info-panel__tag">FREQUENCY: SECURE</span>
              <span className="contact-info-panel__status">ONLINE</span>
            </div>

            <div className="contact-info-panel__body">
              <h3 className="contact-info-title">DIRECT DISPATCH</h3>
              <p className="contact-info-text">
                For urgent security vulnerability disclosures, engineering projects, or high-priority inquiries, initiate direct transmission or copy the public communication vector below.
              </p>

              <div className="contact-email-box">
                <div className="contact-email-label">PRIMARY INBOX:</div>
                <div className="contact-email-display">
                  <code>{email}</code>
                  <button
                    onClick={handleCopyEmail}
                    className="contact-copy-btn"
                    title="Copy to clipboard"
                  >
                    {copied ? 'COPIED ✓' : 'COPY'}
                  </button>
                </div>
              </div>

              {/* Security Metrics / PGP Key Info */}
              <div className="contact-security-box">
                <div className="contact-sec-row">
                  <span className="contact-sec-label">LOCATION:</span>
                  <span className="contact-sec-val">{profile?.location || 'GLOBAL // REMOTE'}</span>
                </div>
                <div className="contact-sec-row">
                  <span className="contact-sec-label">CLEARANCE:</span>
                  <span className="contact-sec-val">DEV / OFFSEC LVL 4</span>
                </div>
                <div className="contact-sec-row">
                  <span className="contact-sec-label">PGP FINGERPRINT:</span>
                  <span className="contact-sec-val contact-sec-val--mono">
                    7F92 B3A1 89C4 D5E2 1109
                  </span>
                </div>
              </div>

              {/* Channels */}
              <div className="contact-channels">
                <div className="contact-channels-heading">LINKED CHANNELS:</div>
                <div className="contact-channels-list">
                  {socials.map((s) => (
                    <a
                      key={s.id}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="contact-channel-link"
                    >
                      <span className="contact-channel-icon">◈</span>
                      <span className="contact-channel-name">{s.platform_display || s.platform}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Form Box */}
          <div className="contact-form-panel">
            <div className="contact-form-panel__header">
              <span>OUTGOING DISPATCH FORM</span>
              <span>[ENCRYPTED RFC-2822]</span>
            </div>

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="contact-form-group">
                <label htmlFor="sender" className="contact-label">
                  OPERATIVE / SENDER NAME *
                </label>
                <input
                  id="sender"
                  type="text"
                  required
                  placeholder="e.g. Agent John Doe"
                  className="contact-input"
                  value={formData.sender}
                  onChange={(e) => setFormData({ ...formData, sender: e.target.value })}
                />
              </div>

              <div className="contact-form-group">
                <label htmlFor="email" className="contact-label">
                  RETURN FREQUENCY (EMAIL) *
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="name@domain.com"
                  className="contact-input"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="contact-form-group">
                <label htmlFor="subject" className="contact-label">
                  DISPATCH SUBJECT
                </label>
                <input
                  id="subject"
                  type="text"
                  placeholder="Project Consultation / Security Audit"
                  className="contact-input"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                />
              </div>

              <div className="contact-form-group">
                <label htmlFor="message" className="contact-label">
                  TRANSMISSION PAYLOAD (MESSAGE) *
                </label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  placeholder="Enter message text..."
                  className="contact-textarea"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={status === 'sending'}
                className={`contact-submit-btn ${status === 'sending' ? 'contact-submit-btn--sending' : ''}`}
              >
                {status === 'sending' ? 'TRANSMITTING PACKETS...' : status === 'sent' ? 'TRANSMISSION DISPATCHED ✓' : 'TRANSMIT MESSAGE 🡭'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
