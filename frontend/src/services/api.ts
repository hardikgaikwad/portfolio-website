/* ═══════════════════════════════════════════════════════════
   API Service — Axios instance with JWT interceptors
   ═══════════════════════════════════════════════════════════ */

import axios from 'axios';
import type { Profile, Project, ProjectCategory, SkillCategory, SocialLink, SiteSettings, AuthTokens, Education, Certification } from '../types/api';

const API_BASE = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL: `${API_BASE}/api`,
  headers: { 'Content-Type': 'application/json' },
});

// JWT interceptor — attach token if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — handle 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refresh = localStorage.getItem('refresh_token');
      if (refresh) {
        try {
          const res = await axios.post(`${API_BASE}/api/auth/refresh/`, { refresh });
          const { access } = res.data;
          localStorage.setItem('access_token', access);
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        } catch {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        }
      }
    }
    return Promise.reject(error);
  }
);

/* ── Public API ─────────────────────────────────────────── */

export const fetchProfile = () =>
  api.get<Profile>('/profile/').then(r => r.data);

export const fetchProjects = () =>
  api.get<Project[]>('/projects/').then(r => r.data);

export const fetchProject = (slug: string) =>
  api.get<Project>(`/projects/${slug}/`).then(r => r.data);

export const fetchSkills = () =>
  api.get<SkillCategory[]>('/skills/').then(r => r.data);

export const fetchSocial = () =>
  api.get<SocialLink[]>('/social/').then(r => r.data);

export const fetchEducation = () =>
  api.get<Education[]>('/education/').then(r => r.data);

export const fetchCertifications = () =>
  api.get<Certification[]>('/certifications/').then(r => r.data);

export const fetchProjectFilters = () =>
  api.get<ProjectCategory[]>('/project-filters/').then(r => r.data);

export const fetchSiteSettings = () =>
  api.get<SiteSettings>('/site-settings/').then(r => r.data);

/* ── Auth ───────────────────────────────────────────────── */

export const login = (username: string, password: string) =>
  api.post<AuthTokens>('/auth/login/', { username, password }).then(r => {
    localStorage.setItem('access_token', r.data.access);
    localStorage.setItem('refresh_token', r.data.refresh);
    return r.data;
  });

export const logout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

/* ── Admin API ──────────────────────────────────────────── */

export const adminFetchProjects = () =>
  api.get<Project[]>('/admin/projects/').then(r => r.data);

export const adminCreateProject = (data: FormData) =>
  api.post<Project>('/admin/projects/', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then(r => r.data);

export const adminUpdateProject = (id: number, data: FormData) =>
  api.patch<Project>(`/admin/projects/${id}/`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then(r => r.data);

export const adminDeleteProject = (id: number) =>
  api.delete(`/admin/projects/${id}/`);

export const adminFetchProfile = () =>
  api.get<Profile>('/admin/profile/').then(r => r.data);

export const adminUpdateProfile = (data: FormData | Record<string, unknown>) => {
  const isFormData = data instanceof FormData;
  return api.put<Profile>('/admin/profile/', data, {
    headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
  }).then(r => r.data);
};

export const adminFetchSkills = () =>
  api.get<SkillCategory[]>('/admin/skills/').then(r => r.data);

export const adminCreateSkillCategory = (data: Record<string, unknown>) =>
  api.post<SkillCategory>('/admin/skills/', data).then(r => r.data);

export const adminUpdateSkillCategory = (id: number, data: Record<string, unknown>) =>
  api.put<SkillCategory>(`/admin/skills/${id}/`, data).then(r => r.data);

export const adminDeleteSkillCategory = (id: number) =>
  api.delete(`/admin/skills/${id}/`);

export const adminFetchSocial = () =>
  api.get<SocialLink[]>('/admin/social/').then(r => r.data);

export const adminCreateSocialLink = (data: Record<string, unknown>) =>
  api.post<SocialLink>('/admin/social/', data).then(r => r.data);

export const adminUpdateSocialLink = (id: number, data: Record<string, unknown>) =>
  api.put<SocialLink>(`/admin/social/${id}/`, data).then(r => r.data);

export const adminDeleteSocialLink = (id: number) =>
  api.delete(`/admin/social/${id}/`);

export const adminUploadResume = (file: File, resumeType: 'general' | 'security' | 'software' = 'general') => {
  const formData = new FormData();
  formData.append('resume_file', file);
  formData.append('resume_type', resumeType);
  return api.post('/admin/resume/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then(r => r.data);
};

export const adminSyncGitHub = () =>
  api.post<{ status: string; synced: Array<{ name: string; action: string; status: string }> }>('/admin/github/sync/').then(r => r.data);

export default api;
