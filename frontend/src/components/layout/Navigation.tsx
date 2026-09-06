/* ═══════════════════════════════════════════════════════════
   Navigation — Icon-based top navigation
   ═══════════════════════════════════════════════════════════ */

import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
