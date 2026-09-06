/* ═══════════════════════════════════════════════════════════
   Virtual File System — Navigable filesystem for terminal
   ═══════════════════════════════════════════════════════════ */

import type { Project, Profile, SkillCategory, SocialLink } from '../types/api';

export interface FSNode {
  name: string;
  type: 'file' | 'dir';
  content?: string;
  children?: Record<string, FSNode>;
  url?: string;
}

/**
 * Build a virtual filesystem tree from API data.
 */
export function buildFileSystem(
  profile: Profile | null,
  projects: Project[],
  skills: SkillCategory[],
  social: SocialLink[]
): FSNode {
  const root: FSNode = {
    name: '~',
    type: 'dir',
    children: {},
  };

  // about.txt
  root.children!['about.txt'] = {
    name: 'about.txt',
    type: 'file',
    content: profile
      ? [
          `NAME: ${profile.name}`,
          `TITLE: ${profile.title}`,
          '',
          profile.bio,
          '',
          'FOCUS AREAS:',
          ...profile.focus_areas.map(f => `  > ${f}`),
          '',
          'CURRENTLY:',
          ...profile.currently_doing.map(c => `  > ${c}`),
          '',
          `LOCATION: ${profile.location}`,
          `EMAIL: ${profile.email}`,
        ].join('\n')
      : 'Profile not configured.',
  };

  // README.md
  root.children!['README.md'] = {
    name: 'README.md',
    type: 'file',
    content: [
      `# ${profile?.name || 'PORTFOLIO'} // TERMINAL`,
      '',
      `> ${profile?.subtitle || 'Cybersecurity Engineer / Developer'}`,
      '',
      'Welcome to the portfolio terminal.',
      'Type "help" for available commands.',
      '',
      'DIRECTORIES:',
      '  projects/   - Portfolio projects',
      '  social/     - Social links',
      '',
      'FILES:',
      '  about.txt   - About me',
      '  skills.txt  - Technical skills',
      '  contact.txt - Contact information',
      '  resume.pdf  - Resume download',
    ].join('\n'),
  };

  // skills.txt
  const skillLines = skills.flatMap(cat => [
    `[${cat.name.toUpperCase()}]`,
    ...cat.skills.map(s => `  ${s.name}`),
    '',
  ]);
  root.children!['skills.txt'] = {
    name: 'skills.txt',
    type: 'file',
    content: skillLines.join('\n') || 'No skills configured.',
  };

  // contact.txt
  root.children!['contact.txt'] = {
    name: 'contact.txt',
    type: 'file',
    content: [
      'CONTACT INFORMATION',
      '═══════════════════',
      '',
      `EMAIL: ${profile?.email || 'Not configured'}`,
      '',
      'SOCIAL LINKS:',
      ...social.map(s => `  ${s.platform_display || s.platform}: ${s.url}`),
    ].join('\n'),
  };

  // resume.pdf (virtual)
  root.children!['resume.pdf'] = {
    name: 'resume.pdf',
    type: 'file',
    content: profile?.resume_url
      ? `Resume available for download.\nURL: ${profile.resume_url}\n\nUse "download resume" to open.`
      : 'Resume not uploaded yet. Configure via admin portal.',
    url: profile?.resume_url || undefined,
  };

  // projects/ directory
  const projectsDir: FSNode = {
    name: 'projects',
    type: 'dir',
    children: {},
  };
  projects.forEach(proj => {
    const techStr = proj.technologies.join(', ');
    const lines = [
      proj.title.toUpperCase(),
      '═'.repeat(proj.title.length),
      '',
      proj.short_description,
      '',
    ];
    if (proj.long_description) {
      lines.push(proj.long_description, '');
    }
    lines.push(`TECH: ${techStr}`);
    if (proj.status) lines.push(`STATUS: ${proj.status}`);
    if (proj.role) lines.push(`ROLE: ${proj.role}`);
    if (proj.security_category) lines.push(`CATEGORY: ${proj.security_category}`);
    lines.push('');
    if (proj.github_url) lines.push(`GITHUB: ${proj.github_url}`);
    if (proj.live_url) lines.push(`LIVE: ${proj.live_url}`);
    if (proj.documentation_url) lines.push(`DOCS: ${proj.documentation_url}`);

    projectsDir.children![proj.slug] = {
      name: proj.slug,
      type: 'file',
      content: lines.join('\n'),
    };
  });
  root.children!['projects'] = projectsDir;

  // social/ directory
  const socialDir: FSNode = {
    name: 'social',
    type: 'dir',
    children: {},
  };
  social.forEach(link => {
    socialDir.children![link.platform] = {
      name: link.platform,
      type: 'file',
      content: `${link.platform_display || link.platform}\n${link.url}`,
      url: link.platform === 'email' ? `mailto:${link.url}` : link.url,
    };
  });
  root.children!['social'] = socialDir;

  return root;
}

/**
 * Resolve a path in the virtual filesystem.
 */
export function resolvePath(root: FSNode, currentPath: string[], target: string): {
  node: FSNode | null;
  newPath: string[];
} {
  const parts = target.split('/').filter(Boolean);
  let path = [...currentPath];
  let node: FSNode = root;

  // Navigate to current path first
  for (const p of path) {
    if (node.children?.[p]) {
      node = node.children[p];
    } else {
      return { node: null, newPath: path };
    }
  }

  // Navigate to target
  for (const part of parts) {
    if (part === '..') {
      path = path.slice(0, -1);
      // Re-navigate from root
      node = root;
      for (const p of path) {
        if (node.children?.[p]) {
          node = node.children[p];
        }
      }
    } else if (part === '.' || part === '~') {
      path = [];
      node = root;
    } else if (node.children?.[part]) {
      node = node.children[part];
      if (node.type === 'dir') {
        path = [...path, part];
      }
    } else {
      return { node: null, newPath: path };
    }
  }

  return { node, newPath: path };
}

/**
 * List contents of a directory node.
 */
export function listDir(node: FSNode): string[] {
  if (node.type !== 'dir' || !node.children) return [];
  return Object.keys(node.children).map(key => {
    const child = node.children![key];
    return child.type === 'dir' ? `${key}/` : key;
  });
}
