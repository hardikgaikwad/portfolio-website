/* ═══════════════════════════════════════════════════════════
   App.tsx — Portfolio Root Component & Routing
   ═══════════════════════════════════════════════════════════ */

import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { usePortfolioData } from './hooks/usePortfolioData';
import { useAuth } from './hooks/useAuth';

// Layout & Sections
import Navigation from './components/layout/Navigation';
import ProceduralGridCanvas from './components/layout/ProceduralGridCanvas';
import GraffitiLayer from './components/layout/GraffitiLayer';
import HeroSection from './components/hero/HeroSection';
import Terminal from './components/terminal/Terminal';
import ProjectsSection from './components/projects/ProjectsSection';
import AboutSection from './components/about/AboutSection';
import SkillsSection from './components/about/SkillsSection';
import ContactSection from './components/contact/ContactSection';
import SignatureH4DK from './components/layout/SignatureH4DK';
import Footer from './components/layout/Footer';

// Admin Portal
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';

function MainPortfolio() {
  const { profile, projects, projectFilters, skills, social, education, certifications, loading } = usePortfolioData();

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="portfolio-app">
      <ProceduralGridCanvas />
      <GraffitiLayer />
      <Navigation />

      <main>
        <HeroSection profile={profile} loading={loading} />

        <Terminal
          profile={profile}
          projects={projects}
          skills={skills}
          social={social}
          education={education}
          certifications={certifications}
        />

        <AboutSection profile={profile} />

        <SkillsSection skillCategories={skills} />

        <ProjectsSection projects={projects} projectFilters={projectFilters} />

        <ContactSection profile={profile} socials={social} />

        <SignatureH4DK />
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
