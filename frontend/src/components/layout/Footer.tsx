/* ═══════════════════════════════════════════════════════════
   Footer — Editorial Vintage/Cyber Terminal Footer
   ═══════════════════════════════════════════════════════════ */

import type { SocialLink } from '../../types/api';
import './Footer.css';

interface Props {
  socials: SocialLink[];
  name?: string;
}

export default function Footer({ socials, name = 'HARDIK' }: Props) {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="footer__container">
        {/* Top bar with vintage editorial rule */}
        <div className="footer__header-rule">
          <span className="footer__tag">[SEC_SYSTEM_STATUS: NOMINAL]</span>
          <span className="footer__tag">TERMINAL PROTOCOL v2.4.0</span>
          <span className="footer__tag">ENCRYPTED DISPATCH</span>
        </div>

        <div className="footer__grid">
          <div className="footer__col footer__brand">
            <h3 className="footer__logo">{name}</h3>
            <p className="footer__motto">
              Full-Stack Engineering × Offensive & Defensive Cybersecurity Architecture.
            </p>
            <div className="footer__badge">
              <span className="footer__badge-indicator"></span>
              ALL CHANNELS ACTIVE
            </div>
          </div>

          <div className="footer__col">
            <h4 className="footer__col-title">COMMUNICATION</h4>
            <ul className="footer__links">
              {socials.map((s) => (
                <li key={s.id}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="footer__link">
                    → {s.platform.toUpperCase()}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer__col">
            <h4 className="footer__col-title">NAVIGATION</h4>
            <ul className="footer__links">
              <li><a href="#about" className="footer__link">01. DOSSIER (ABOUT)</a></li>
              <li><a href="#skills" className="footer__link">02. CAPABILITIES (SKILLS)</a></li>
              <li><a href="#projects" className="footer__link">03. OPERATIONS (PROJECTS)</a></li>
              <li><a href="#terminal" className="footer__link">04. TERMINAL SHELL</a></li>
              <li><a href="#contact" className="footer__link">05. TRANSMISSION (CONTACT)</a></li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <div className="footer__copyright">
            © {currentYear} {name}. ALL RIGHTS RESERVED. PRINTED ON GRAPH REPRO-PAPER.
          </div>
          <button onClick={scrollToTop} className="footer__top-btn" title="Back to Top">
            ↑ RETURN TO TOP
          </button>
        </div>
      </div>
    </footer>
  );
}
