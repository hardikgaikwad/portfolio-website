/* ═══════════════════════════════════════════════════════════
   usePortfolioData — Fetches and caches all portfolio data
   ═══════════════════════════════════════════════════════════ */

import { useState, useEffect, useCallback } from 'react';
import type { Profile, Project, SkillCategory, SocialLink, SiteSettings } from '../types/api';
import { fetchProfile, fetchProjects, fetchSkills, fetchSocial, fetchSiteSettings } from '../services/api';

export interface PortfolioData {
  profile: Profile | null;
  projects: Project[];
  skills: SkillCategory[];
  social: SocialLink[];
  settings: SiteSettings | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function usePortfolioData(): PortfolioData {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<SkillCategory[]>([]);
  const [social, setSocial] = useState<SocialLink[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [profileData, projectsData, skillsData, socialData, settingsData] =
        await Promise.allSettled([
          fetchProfile(),
          fetchProjects(),
          fetchSkills(),
          fetchSocial(),
          fetchSiteSettings(),
        ]);

      if (profileData.status === 'fulfilled') setProfile(profileData.value);
      if (projectsData.status === 'fulfilled') setProjects(projectsData.value);
      if (skillsData.status === 'fulfilled') setSkills(skillsData.value);
      if (socialData.status === 'fulfilled') setSocial(socialData.value);
      if (settingsData.status === 'fulfilled') setSettings(settingsData.value);
    } catch (err) {
      setError('Failed to load portfolio data. Is the backend running?');
      console.error('Portfolio data fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return { profile, projects, skills, social, settings, loading, error, refetch: loadData };
}
