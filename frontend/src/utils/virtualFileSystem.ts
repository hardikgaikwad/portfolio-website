/* ═══════════════════════════════════════════════════════════
   Virtual File System — Database-driven Linux-style filesystem
   Single Source of Truth: Django Admin & API
   ═══════════════════════════════════════════════════════════ */

import type { Project, Profile, SocialLink, Education, Certification } from '../types/api';

export interface FSNode {
  name: string;
  type: 'file' | 'dir';
  content?: string;
  children?: Record<string, FSNode>;
  url?: string;
}

/**
 * Build virtual filesystem tree from authoritative API data.
 *
 * Structure:
 * ~/
 * ├── about.txt
 * ├── education.txt
 * ├── certifications.txt
 * ├── socials.txt
 * ├── resume/
 * │   ├── cybersecurity.pdf
 * │   └── software-development.pdf
 * └── projects/
 *     ├── eventregistration.txt
 *     ├── getpyqjec.txt
 *     ├── home-lab.txt
 *     ├── privshare.txt
 *     ├── securemailscope.txt
 *     └── xsscan.txt
 */
export function buildFileSystem(
  profile: Profile | null,
  projects: Project[],
  social: SocialLink[],
  education?: Education[],
  certifications?: Certification[]
): FSNode {
  const root: FSNode = {
    name: '~',
    type: 'dir',
    children: {},
  };

  const name = profile?.name || 'Hardik Gaikwad';
  const title = profile?.title || 'Cybersecurity Engineer & Software Developer';
  const email = profile?.email || 'hardikgaikwad04@gmail.com';
  const location = profile?.location || 'Jabalpur, Madhya Pradesh, India';

  // ── 1. about.txt ──────────────────────────────────────────
  let aboutContent = '';
  if (profile?.about_terminal_content && profile.about_terminal_content.trim()) {
    aboutContent = profile.about_terminal_content.trim();
  } else {
    const lines = [
      `NAME:     ${name}`,
      `ROLE:     ${title}`,
      `LOCATION: ${location}`,
      `EMAIL:    ${email}`,
      '',
      'BIO:',
      profile?.bio || 'Cybersecurity researcher and software engineer specializing in offensive security, penetration testing, and full-stack development.',
    ];
    if (profile?.focus_areas && profile.focus_areas.length > 0) {
      lines.push('', 'CORE FOCUS VECTORS:');
      profile.focus_areas.forEach(f => lines.push(`  • ${f}`));
    }
    if (profile?.currently_doing && profile.currently_doing.length > 0) {
      lines.push('', 'ACTIVE DIRECTIVES:');
      profile.currently_doing.forEach(c => lines.push(`  • ${c}`));
    }
    aboutContent = lines.join('\n');
  }

  root.children!['about.txt'] = {
    name: 'about.txt',
    type: 'file',
    content: aboutContent,
  };

  // ── 2. education.txt ──────────────────────────────────────
  let educationContent = '';
  if (education && education.length > 0) {
    const lines = [
      'ACADEMIC FORMATION & EDUCATION RECORD',
      '══════════════════════════════════════',
      '',
    ];
    education.forEach((edu, idx) => {
      lines.push(`${idx + 1}. ${edu.institution.toUpperCase()}`);
      lines.push(`   DEGREE:   ${edu.degree}`);
      lines.push(`   PERIOD:   ${edu.period}`);
      if (edu.grade) lines.push(`   GRADE:    ${edu.grade}`);
      if (edu.location) lines.push(`   LOCATION: ${edu.location}`);
      lines.push('');
    });
    educationContent = lines.join('\n').trimEnd();
  } else if (profile?.education && profile.education.length > 0) {
    const lines = [
      'ACADEMIC FORMATION & EDUCATION RECORD',
      '══════════════════════════════════════',
      '',
    ];
    profile.education.forEach((edu, idx) => {
      lines.push(`${idx + 1}. ${edu.institution.toUpperCase()}`);
      lines.push(`   DEGREE:   ${edu.degree}`);
      lines.push(`   PERIOD:   ${edu.period}`);
      if (edu.grade) lines.push(`   GRADE:    ${edu.grade}`);
      if (edu.location) lines.push(`   LOCATION: ${edu.location}`);
      lines.push('');
    });
    educationContent = lines.join('\n').trimEnd();
  } else {
    educationContent = 'No education records found in database.';
  }

  root.children!['education.txt'] = {
    name: 'education.txt',
    type: 'file',
    content: educationContent,
  };

  // ── 3. certifications.txt ─────────────────────────────────
  let certsContent = '';
  if (certifications && certifications.length > 0) {
    const lines = [
      'CREDENTIALS & CERTIFICATIONS',
      '════════════════════════════',
      '',
    ];
    certifications.forEach((cert, idx) => {
      lines.push(`${idx + 1}. ${cert.title}`);
      if (cert.issuer) lines.push(`   ISSUER:   ${cert.issuer}`);
      if (cert.status) lines.push(`   STATUS:   ${cert.status}`);
      if (cert.description) lines.push(`   DETAILS:  ${cert.description}`);
      if (cert.url) lines.push(`   URL:      ${cert.url}`);
      lines.push('');
    });
    certsContent = lines.join('\n').trimEnd();
  } else if (profile?.certifications && profile.certifications.length > 0) {
    const lines = [
      'CREDENTIALS & CERTIFICATIONS',
      '════════════════════════════',
      '',
    ];
    profile.certifications.forEach((cert, idx) => {
      lines.push(`${idx + 1}. ${cert.title}`);
      if (cert.issuer) lines.push(`   ISSUER:   ${cert.issuer}`);
      if (cert.type) lines.push(`   STATUS:   ${cert.type}`);
      if (cert.description) lines.push(`   DETAILS:  ${cert.description}`);
      lines.push('');
    });
    certsContent = lines.join('\n').trimEnd();
  } else {
    certsContent = 'No certification records found in database.';
  }

  root.children!['certifications.txt'] = {
    name: 'certifications.txt',
    type: 'file',
    content: certsContent,
  };

  // ── 4. socials.txt ────────────────────────────────────────
  let socialsContent = '';
  if (social && social.length > 0) {
    const lines = [
      'COMMUNICATIONS & SOCIAL CHANNELS',
      '════════════════════════════════',
      '',
    ];
    social.forEach(s => {
      const label = (s.label || s.platform_display || s.platform).padEnd(12);
      lines.push(`  ${label} : ${s.url}`);
    });
    socialsContent = lines.join('\n');
  } else {
    socialsContent = [
      'COMMUNICATIONS & SOCIAL CHANNELS',
      '════════════════════════════════',
      '',
      `  Email        : ${email}`,
      '  GitHub       : https://github.com/hardikgaikwad',
      '  LinkedIn     : https://linkedin.com/in/hardikgaikwad',
    ].join('\n');
  }

  root.children!['socials.txt'] = {
    name: 'socials.txt',
    type: 'file',
    content: socialsContent,
  };

  // ── 5. resume/ directory ──────────────────────────────────
  const resumeDir: FSNode = {
    name: 'resume',
    type: 'dir',
    children: {},
  };

  const secUrl = profile?.resume_security_url || profile?.resume_url || '/resumes/cybersecurity.pdf';
  const softUrl = profile?.resume_software_url || profile?.resume_url || '/resumes/software-development.pdf';

  resumeDir.children!['cybersecurity.pdf'] = {
    name: 'cybersecurity.pdf',
    type: 'file',
    content: [
      'HARDIK GAIKWAD — CYBERSECURITY RESUME',
      '═════════════════════════════════════',
      'Format: PDF Document',
      'Track:  Offensive Security & Penetration Testing',
      '',
      "Run 'download resume --security' or open the link below:",
      secUrl,
    ].join('\n'),
    url: secUrl,
  };

  resumeDir.children!['software-development.pdf'] = {
    name: 'software-development.pdf',
    type: 'file',
    content: [
      'HARDIK GAIKWAD — SOFTWARE DEVELOPMENT RESUME',
      '═══════════════════════════════════════════',
      'Format: PDF Document',
      'Track:  Full-Stack & Systems Development (Python, Django, React)',
      '',
      "Run 'download resume --software' or open the link below:",
      softUrl,
    ].join('\n'),
    url: softUrl,
  };

  root.children!['resume'] = resumeDir;

  // ── 6. projects/ directory ────────────────────────────────
  const projectsDir: FSNode = {
    name: 'projects',
    type: 'dir',
    children: {},
  };

  projects.forEach(proj => {
    // Determine terminal filename (db field, or fallback to {slug}.txt)
    let filename = proj.terminal_filename?.trim();
    if (!filename) {
      filename = `${proj.slug}.txt`;
    }
    // Sanitize: strip any directory paths and leading dots
    filename = filename.replace(/[/\\]/g, '').replace(/^\.+/, '');
    if (!filename.endsWith('.txt')) {
      filename = `${filename}.txt`;
    }

    let content = '';
    if (proj.terminal_content && proj.terminal_content.trim()) {
      content = proj.terminal_content.trim();
    } else {
      const techStr = proj.technologies ? proj.technologies.join(', ') : '';
      const lines = [
        `PROJECT: ${proj.title.toUpperCase()}`,
        '═'.repeat(proj.title.length + 9),
        '',
        `CLASSIFICATION: ${proj.project_type?.toUpperCase() || 'SECURITY / SOFTWARE'}`,
        `DOMAIN:         ${proj.security_category || 'Systems Engineering'}`,
        `STATUS:         ${proj.status.toUpperCase()}`,
        '',
        proj.short_description,
      ];
      if (proj.long_description) {
        lines.push('', 'DETAILED SPECIFICATION:', proj.long_description);
      }
      if (proj.architecture) {
        lines.push('', 'SYSTEM ARCHITECTURE:', proj.architecture);
      }
      if (proj.highlights && proj.highlights.length > 0) {
        lines.push('', 'KEY HIGHLIGHTS:');
        proj.highlights.forEach(h => lines.push(`  • ${h}`));
      }
      lines.push('', `TECHNOLOGIES:   ${techStr}`);
      if (proj.github_url) lines.push(`SOURCE REPO:    ${proj.github_url}`);
      if (proj.live_url)   lines.push(`LIVE DEPLOY:    ${proj.live_url}`);
      content = lines.join('\n');
    }

    projectsDir.children![filename] = {
      name: filename,
      type: 'file',
      content,
      url: proj.live_url || proj.github_url || undefined,
    };
  });

  root.children!['projects'] = projectsDir;

  return root;
}

/**
 * Resolve a path string or array to an FSNode.
 * Correctly handles relative navigation (., ..) and absolute paths (~, /).
 */
export function resolvePath(
  pathInput: string | string[],
  currentPath: string[],
  fs: FSNode
): { node: FSNode | null; resolvedPath: string[] } {
  let resolved: string[];

  if (Array.isArray(pathInput)) {
    // Array of segments passed
    resolved = [...currentPath];
    for (const part of pathInput) {
      if (part === '~' || part === '') {
        resolved.length = 0;
      } else if (part === '.') {
        continue;
      } else if (part === '..') {
        resolved.pop();
      } else {
        resolved.push(part);
      }
    }
  } else {
    const raw = (pathInput || '').trim();
    if (!raw || raw === '.') {
      return { node: getNodeAt(currentPath, fs), resolvedPath: [...currentPath] };
    }

    const isAbsolute = raw.startsWith('/') || raw.startsWith('~');
    const segments = raw.replace(/^~?[/\\]*/, '').split(/[/\\]+/).filter(Boolean);

    if (isAbsolute) {
      resolved = [];
      for (const seg of segments) {
        if (seg === '.') continue;
        if (seg === '..') {
          resolved.pop();
        } else {
          resolved.push(seg);
        }
      }
    } else {
      resolved = [...currentPath];
      for (const seg of segments) {
        if (seg === '.') continue;
        if (seg === '..') {
          resolved.pop();
        } else {
          resolved.push(seg);
        }
      }
    }
  }

  return { node: getNodeAt(resolved, fs), resolvedPath: resolved };
}

/**
 * Retrieve node from root at given path segments.
 */
function getNodeAt(path: string[], root: FSNode): FSNode | null {
  let current = root;
  for (const seg of path) {
    if (!current.children || !current.children[seg]) {
      return null;
    }
    current = current.children[seg];
  }
  return current;
}

/**
 * List contents of a directory node.
 */
export function listDir(node: FSNode): string[] {
  if (node.type !== 'dir' || !node.children) return [];
  return Object.entries(node.children).map(([name, child]) =>
    child.type === 'dir' ? `${name}/` : name
  );
}
