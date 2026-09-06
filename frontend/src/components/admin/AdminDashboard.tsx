/* ═══════════════════════════════════════════════════════════
   AdminDashboard — Main Administration Operations Portal
   ═══════════════════════════════════════════════════════════ */

import { useState } from 'react';
import AdminProjectsManager from './AdminProjectsManager';
import AdminSkillsManager from './AdminSkillsManager';
import AdminProfileManager from './AdminProfileManager';
import './Admin.css';

interface Props {
  onLogout: () => void;
}

export default function AdminDashboard({ onLogout }: Props) {
  const [activeTab, setActiveTab] = useState<'projects' | 'skills' | 'profile'>('projects');

  return (
    <div className="admin-dashboard">
      {/* Top Bar */}
      <header className="admin-header">
        <div className="admin-header__brand">
          <span className="admin-header__badge">ROOT CONSOLE</span>
          <h2 className="admin-header__title">PORTFOLIO CMS</h2>
        </div>

        <nav className="admin-nav">
          <button
            className={`admin-nav-btn ${activeTab === 'projects' ? 'admin-nav-btn--active' : ''}`}
            onClick={() => setActiveTab('projects')}
          >
            01. PROJECTS
          </button>
          <button
            className={`admin-nav-btn ${activeTab === 'skills' ? 'admin-nav-btn--active' : ''}`}
            onClick={() => setActiveTab('skills')}
          >
            02. SKILLS
          </button>
          <button
            className={`admin-nav-btn ${activeTab === 'profile' ? 'admin-nav-btn--active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            03. PROFILE & CV
          </button>
        </nav>

        <div className="admin-header__actions">
          <a href="/" className="admin-btn-outline">
            VIEW SITE ↗
          </a>
          <button onClick={onLogout} className="admin-btn-logout">
            LOGOUT [EXIT]
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="admin-main">
        {activeTab === 'projects' && <AdminProjectsManager />}
        {activeTab === 'skills' && <AdminSkillsManager />}
        {activeTab === 'profile' && <AdminProfileManager />}
      </main>
    </div>
  );
}
