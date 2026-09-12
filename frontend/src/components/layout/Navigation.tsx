/* ═══════════════════════════════════════════════════════════
   Navigation — Icon-based top navigation
   ═══════════════════════════════════════════════════════════ */

import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../hooks/useTheme';
import './Navigation.css';

interface NavItem {
  id: string;
  label: string;
  icon: string;
  action: 'scroll' | 'navigate';
  target: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'about', label: 'About', icon: '⌘', action: 'scroll', target: 'about' },
  { id: 'projects', label: 'Projects', icon: '◆', action: 'scroll', target: 'projects' },
  { id: 'skills', label: 'Skills', icon: '▣', action: 'scroll', target: 'skills' },
  { id: 'contact', label: 'Contact', icon: '◈', action: 'scroll', target: 'contact' },
];

export default function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const handleHomeClick = () => {
    if (location.pathname !== '/') {
      navigate('/');
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNavClick = (item: NavItem) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById(item.target);
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    } else {
      const el = document.getElementById(item.target);
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="nav" role="navigation" aria-label="Main navigation">
      {/* Home icon — top left */}
      <button
        className="nav__home"
        onClick={handleHomeClick}
        aria-label="Home"
        onMouseEnter={() => setActiveTooltip('home')}
        onMouseLeave={() => setActiveTooltip(null)}
      >
        <span className="nav__icon">&gt;_</span>
        {activeTooltip === 'home' && <span className="nav__tooltip">HOME</span>}
      </button>

      {/* Section icons — top right */}
      <div className="nav__items">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            className="nav__item"
            onClick={() => handleNavClick(item)}
            aria-label={item.label}
            onMouseEnter={() => setActiveTooltip(item.id)}
            onMouseLeave={() => setActiveTooltip(null)}
          >
            <span className="nav__icon">{item.icon}</span>
            {activeTooltip === item.id && (
              <span className="nav__tooltip">{item.label.toUpperCase()}</span>
            )}
          </button>
        ))}

        {/* Light / Dark Mode Toggle with Motion Animation */}
        <button
          className="nav__item nav__item--theme"
          onClick={toggleTheme}
          aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-pressed={isDark}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          onMouseEnter={() => setActiveTooltip('theme')}
          onMouseLeave={() => setActiveTooltip(null)}
        >
          <span className="nav__icon nav__icon--theme" aria-hidden="true">
            <AnimatePresence mode="wait" initial={false}>
              {isDark ? (
                <motion.span
                  key="moon"
                  className="theme-icon-motion"
                  initial={{ rotate: -120, scale: 0.3, opacity: 0 }}
                  animate={{ rotate: 0, scale: 1, opacity: 1 }}
                  exit={{ rotate: 120, scale: 0.3, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
                >
                  <svg className="theme-toggle-svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                </motion.span>
              ) : (
                <motion.span
                  key="sun"
                  className="theme-icon-motion"
                  initial={{ rotate: 120, scale: 0.3, opacity: 0 }}
                  animate={{ rotate: 0, scale: 1, opacity: 1 }}
                  exit={{ rotate: -120, scale: 0.3, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
                >
                  <svg className="theme-toggle-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="5" />
                    <line x1="12" y1="1" x2="12" y2="3" />
                    <line x1="12" y1="21" x2="12" y2="23" />
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                    <line x1="1" y1="12" x2="3" y2="12" />
                    <line x1="21" y1="12" x2="23" y2="12" />
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                  </svg>
                </motion.span>
              )}
            </AnimatePresence>
          </span>
          {activeTooltip === 'theme' && (
            <span className="nav__tooltip">{isDark ? 'DARK MODE (☾)' : 'LIGHT MODE (☀)'}</span>
          )}
        </button>

        {/* Admin link */}
        <button
          className="nav__item nav__item--admin"
          onClick={() => navigate('/admin')}
          aria-label="Admin Portal"
          onMouseEnter={() => setActiveTooltip('admin')}
          onMouseLeave={() => setActiveTooltip(null)}
        >
          <span className="nav__icon">⚙</span>
          {activeTooltip === 'admin' && (
            <span className="nav__tooltip">ADMIN</span>
          )}
        </button>
      </div>
    </nav>
  );
}
