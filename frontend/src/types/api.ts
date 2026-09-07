/* ═══════════════════════════════════════════════════════════
   API Types — Portfolio Data Models
   ═══════════════════════════════════════════════════════════ */

export interface EducationItem {
  institution: string;
  degree: string;
  period: string;
  grade: string;
  location: string;
}

export interface CertificationItem {
  title: string;
  issuer: string;
  type: string;
  description: string;
}

export interface VolunteeringItem {
  organization: string;
  role: string;
  description: string;
}

export interface Profile {
  id: number;
  name: string;
  title: string;
  subtitle: string;
  bio: string;
  email: string;
  location: string;
  focus_areas: string[];
  currently_doing: string[];
  education?: EducationItem[];
  certifications?: CertificationItem[];
  volunteering?: VolunteeringItem[];
  resume_url: string | null;
  resume_security_url?: string | null;
  resume_software_url?: string | null;
  updated_at: string;
}

export interface Project {
  id: number;
  title: string;
  slug: string;
  short_description: string;
  long_description?: string;
  image: string | null;
  technologies: string[];
  github_url: string;
  live_url: string;
  documentation_url?: string;
  featured: boolean;
  display_order: number;
  status: 'active' | 'completed' | 'in_progress' | 'archived';
  project_type?: 'security' | 'software' | 'fullstack' | 'research' | 'lab' | 'other';
  security_category?: string;
  repo_name?: string;
  github_stars?: number;
  is_github_synced?: boolean;
  role?: string;
  highlights?: string[];
  challenges?: string;
  architecture?: string;
  created_at: string;
  updated_at?: string;
}

export interface Skill {
  id: number;
  name: string;
  display_order: number;
}

export interface SkillCategory {
  id: number;
  name: string;
  display_order: number;
  skills: Skill[];
}

export interface SocialLink {
  id: number;
  platform: string;
  platform_display: string;
  label: string;
  url: string;
  icon: string;
  display_order: number;
}

export interface SiteSettings {
  id: number;
  site_title: string;
  terminal_welcome: string;
  meta_description: string;
  footer_text: string;
  updated_at: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}
