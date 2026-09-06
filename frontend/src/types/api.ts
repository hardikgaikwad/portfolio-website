/* ═══════════════════════════════════════════════════════════
   API Types — Portfolio Data Models
   ═══════════════════════════════════════════════════════════ */

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
  resume_url: string | null;
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
  security_category?: string;
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
