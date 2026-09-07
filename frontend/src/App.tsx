/* ═══════════════════════════════════════════════════════════
   App.tsx — Portfolio Root Component & Routing
   ═══════════════════════════════════════════════════════════ */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { usePortfolioData } from './hooks/usePortfolioData';
import { useAuth } from './hooks/useAuth';

// Layout & Sections
import Navigation from './components/layout/Navigation';
import ProceduralGridCanvas from './components/layout/ProceduralGridCanvas';
import HeroSection from './components/hero/HeroSection';
import Terminal from './components/terminal/Terminal';
import ProjectsSection from './components/projects/ProjectsSection';
import AboutSection from './components/about/AboutSection';
import SkillsSection from './components/about/SkillsSection';
import ContactSection from './components/contact/ContactSection';
import Footer from './components/layout/Footer';

// Admin Portal
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';

function MainPortfolio() {
  const { profile, projects, skills, social, loading } = usePortfolioData();

  return (
    <div className="portfolio-app">
      <ProceduralGridCanvas />
      <Navigation />

      <main>
        <HeroSection profile={profile} loading={loading} />

        <Terminal
          profile={profile}
          projects={projects}
          skills={skills}
          social={social}
        />

        <AboutSection profile={profile} />

        <SkillsSection skillCategories={skills} />

        <ProjectsSection projects={projects} />

        <ContactSection profile={profile} socials={social} />
      </main>

      <Footer socials={social} name={profile?.name} />
    </div>
  );
}

function AdminRoute() {
  const { isAuthenticated, loading, error, login, logout } = useAuth();

  return (
    <>
      <ProceduralGridCanvas />
      {isAuthenticated ? (
        <AdminDashboard onLogout={logout} />
      ) : (
        <AdminLogin onLogin={login} loading={loading} error={error} />
      )}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPortfolio />} />
        <Route path="/admin" element={<AdminRoute />} />
        <Route path="/terminal-admin" element={<AdminRoute />} />
        {/* Wildcard redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
