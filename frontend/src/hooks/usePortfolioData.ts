/* ═══════════════════════════════════════════════════════════
   usePortfolioData — Fetches and caches all portfolio data
   ═══════════════════════════════════════════════════════════ */

import { useState, useEffect, useCallback } from 'react';
import type { Profile, Project, ProjectCategory, SkillCategory, SocialLink, SiteSettings, Education, Certification } from '../types/api';
import {
  fetchProfile, fetchProjects, fetchSkills, fetchSocial, fetchSiteSettings,
  fetchEducation, fetchCertifications, fetchProjectFilters
} from '../services/api';

export interface PortfolioData {
  profile: Profile | null;
  projects: Project[];
  projectFilters: ProjectCategory[];
  skills: SkillCategory[];
  social: SocialLink[];
  education: Education[];
  certifications: Certification[];
  settings: SiteSettings | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function usePortfolioData(): PortfolioData {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectFilters, setProjectFilters] = useState<ProjectCategory[]>([]);
  const [skills, setSkills] = useState<SkillCategory[]>([]);
  const [social, setSocial] = useState<SocialLink[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [profileData, projectsData, filtersData, skillsData, socialData, educationData, certsData, settingsData] =
        await Promise.allSettled([
          fetchProfile(),
          fetchProjects(),
          fetchProjectFilters(),
          fetchSkills(),
          fetchSocial(),
          fetchEducation(),
          fetchCertifications(),
          fetchSiteSettings(),
        ]);

      if (profileData.status === 'fulfilled') setProfile(profileData.value);
      if (projectsData.status === 'fulfilled') setProjects(projectsData.value);
      if (filtersData.status === 'fulfilled') setProjectFilters(filtersData.value);
      if (skillsData.status === 'fulfilled') setSkills(skillsData.value);
      if (socialData.status === 'fulfilled') setSocial(socialData.value);
      if (educationData.status === 'fulfilled') setEducation(educationData.value);
      if (certsData.status === 'fulfilled') setCertifications(certsData.value);
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

  return { profile, projects, projectFilters, skills, social, education, certifications, settings, loading, error, refetch: loadData };
}
