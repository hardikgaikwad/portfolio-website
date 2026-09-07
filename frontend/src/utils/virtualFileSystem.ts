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
 * Build a virtual filesystem tree from authoritative API data.
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

  const name = profile?.name || 'Hardik Gaikwad';
  const title = profile?.title || 'Cybersecurity Engineer & Software Developer';
  const email = profile?.email || 'hardikgaikwad04@gmail.com';
  const location = profile?.location || 'Jabalpur, India';

  // 1. about/ directory & about.txt
  const aboutDir: FSNode = {
    name: 'about',
    type: 'dir',
    children: {},
  };
  aboutDir.children!['bio.txt'] = {
    name: 'bio.txt',
    type: 'file',
    content: profile?.bio || 'Cybersecurity researcher and software engineer.',
  };
  aboutDir.children!['profile.txt'] = {
    name: 'profile.txt',
    type: 'file',
    content: [
      `NAME: ${name}`,
      `TITLE: ${title}`,
      `LOCATION: ${location}`,
      `EMAIL: ${email}`,
      `GITHUB: https://github.com/hardikgaikwad`,
      `LINKEDIN: https://linkedin.com/in/hardikgaikwad`,
      '',
      'CORE FOCUS VECTORS:',
      ...(profile?.focus_areas || []).map(f => `  • ${f}`),
      '',
      'ACTIVE DIRECTIVES:',
      ...(profile?.currently_doing || []).map(c => `  • ${c}`),
    ].join('\n'),
  };
  root.children!['about'] = aboutDir;

  root.children!['about.txt'] = {
    name: 'about.txt',
    type: 'file',
    content: [
      `NAME: ${name}`,
      `TITLE: ${title}`,
      `LOCATION: ${location}`,
      `EMAIL: ${email}`,
      '',
      profile?.bio || '',
      '',
      'CORE FOCUS VECTORS:',
      ...(profile?.focus_areas || []).map(f => `  • ${f}`),
      '',
      'ACTIVE DIRECTIVES:',
      ...(profile?.currently_doing || []).map(c => `  • ${c}`),
    ].join('\n'),
  };

  // 2. resume/ directory
  const resumeDir: FSNode = {
    name: 'resume',
    type: 'dir',
    children: {},
  };
  const secUrl = profile?.resume_security_url || profile?.resume_url || '/media/resume/hardik_gaikwad_cybersecurity.pdf';
  const softUrl = profile?.resume_software_url || profile?.resume_url || '/media/resume/hardik_gaikwad_software.pdf';

  resumeDir.children!['cybersecurity.pdf'] = {
    name: 'cybersecurity.pdf',
    type: 'file',
    content: `Hardik Gaikwad — Cybersecurity & Penetration Testing Resume (eJPT, TryHackMe Top 4%)\nDownload command: download resume --security\nURL: ${secUrl}`,
    url: secUrl,
  };
  resumeDir.children!['software-development.pdf'] = {
    name: 'software-development.pdf',
    type: 'file',
    content: `Hardik Gaikwad — Software Engineering & Full-Stack Development Resume (Python, Django, React, AWS S3)\nDownload command: download resume --software\nURL: ${softUrl}`,
    url: softUrl,
  };
  root.children!['resume'] = resumeDir;

  // 3. certifications/ directory & certifications.txt
  const certsDir: FSNode = {
    name: 'certifications',
    type: 'dir',
    children: {},
  };
  certsDir.children!['ejpt.txt'] = {
    name: 'ejpt.txt',
    type: 'file',
    content: [
      'CERTIFICATION: eJPT (eLearnSecurity Junior Penetration Tester)',
      'ISSUER: eLearnSecurity / INE Security',
      'STATUS: Active / Certified',
      '',
      'KNOWLEDGE DOMAINS:',
      '  • Reconnaissance, Enumeration & Vulnerability Assessment',
      '  • Kill-Chain Execution across multi-subnet segmented networks',
      '  • Credential Attacks & Password Hashes Exploitation',
      '  • Privilege Escalation (Linux & Windows) and Subnet Pivoting',
    ].join('\n'),
  };
  certsDir.children!['tryhackme.txt'] = {
    name: 'tryhackme.txt',
    type: 'file',
    content: [
      'PLATFORM: TryHackMe',
      'RANKING: Global Top 4%',
      'PROFILE: https://tryhackme.com',
      '',
      'COMPLETED LEARNING PATHS:',
      '  • Pre Security (Networking, Linux, Web Fundamentals)',
      '  • Cyber Security 101 (Defensive & Offensive Core Concepts)',
      '  • Jr Penetration Tester (Web Exploitation, Network Attacks, Methodology)',
    ].join('\n'),
  };
  root.children!['certifications'] = certsDir;

  root.children!['certifications.txt'] = {
    name: 'certifications.txt',
    type: 'file',
    content: [
      'CERTIFICATIONS & RECOGNITIONS:',
      '══════════════════════════════',
      '1. eJPT (eLearnSecurity Junior Penetration Tester) — Certificate',
      '   Full kill-chain network pentesting, reconnaissance, privilege escalation, lateral pivoting.',
      '',
      '2. TryHackMe Security Learning Paths — Global Top 4%',
      '   Pre Security, Cyber Security 101, Jr Penetration Tester paths completed.',
    ].join('\n'),
  };

  // 4. education/ directory & education.txt
  const eduDir: FSNode = {
    name: 'education',
    type: 'dir',
    children: {},
  };
  eduDir.children!['jabalpur-engineering-college.txt'] = {
    name: 'jabalpur-engineering-college.txt',
    type: 'file',
    content: [
      'INSTITUTION: Jabalpur Engineering College (JEC)',
      'DEGREE: B.Tech in Information Technology',
      'PERIOD: 2023 – 2027',
      'PERFORMANCE: CGPA 7.69 (up to 6th Semester)',
      'LOCATION: Jabalpur, Madhya Pradesh, India',
    ].join('\n'),
  };
  eduDir.children!['bal-bhavan-school.txt'] = {
    name: 'bal-bhavan-school.txt',
    type: 'file',
    content: [
      'INSTITUTION: Bal Bhavan School — CBSE',
      'SECONDARY EDUCATION:',
      '  • Class XII: 90.8%',
      '  • Class X:   90.2%',
      'LOCATION: Bhopal, India',
    ].join('\n'),
  };
  root.children!['education'] = eduDir;

  root.children!['education.txt'] = {
    name: 'education.txt',
    type: 'file',
    content: [
      'ACADEMIC RECORD:',
      '════════════════',
      '1. Jabalpur Engineering College — B.Tech in Information Technology (2023–2027)',
      '   CGPA: 7.69 (up to 6th Semester) | Jabalpur, India',
      '',
      '2. Bal Bhavan School — CBSE',
      '   Class XII: 90.8% | Class X: 90.2% | Bhopal, India',
    ].join('\n'),
  };

  // 5. volunteering.txt
  root.children!['volunteering.txt'] = {
    name: 'volunteering.txt',
    type: 'file',
    content: [
      'VOLUNTEERING & COMMUNITY:',
      '═════════════════════════',
      'ORGANIZATION: VulnCon - Security Conference',
      'ROLE: Core Team Member & Media Lead',
      'CONTRIBUTIONS:',
      '  • Contributed to video editing and media content creation.',
      '  • Served as point of contact between Media and Social Media teams.',
      '  • Guided photographers and videographers for on-site event coverage.',
      '  • Supported on-site event coordination and speaker sessions.',
    ].join('\n'),
  };

  // 6. skills/ directory & skills.txt
  const skillsDir: FSNode = {
    name: 'skills',
    type: 'dir',
    children: {},
  };
  skills.forEach(cat => {
    const slug = cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    skillsDir.children![`${slug}.txt`] = {
      name: `${slug}.txt`,
      type: 'file',
      content: [
        `CATEGORY: ${cat.name.toUpperCase()}`,
        '─'.repeat(cat.name.length + 10),
        ...cat.skills.map(s => `  › ${s.name}`),
      ].join('\n'),
    };
  });
  root.children!['skills'] = skillsDir;

  const allSkillsFormatted = skills.flatMap(cat => [
    `[${cat.name.toUpperCase()}]`,
    ...cat.skills.map(s => `  › ${s.name}`),
    '',
  ]);
  root.children!['skills.txt'] = {
    name: 'skills.txt',
    type: 'file',
    content: allSkillsFormatted.join('\n') || 'Skills matrix loaded from API.',
  };

  // 7. projects/ directory
  const projectsDir: FSNode = {
    name: 'projects',
    type: 'dir',
    children: {},
  };
  projects.forEach(proj => {
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
      '',
    ];
    if (proj.long_description) {
      lines.push('DETAILED SPECIFICATION:', proj.long_description, '');
    }
    if (proj.architecture) {
      lines.push('SYSTEM ARCHITECTURE:', proj.architecture, '');
    }
    if (proj.highlights && proj.highlights.length > 0) {
      lines.push('KEY HIGHLIGHTS:');
      proj.highlights.forEach(h => lines.push(`  • ${h}`));
      lines.push('');
    }
    lines.push(`TECHNOLOGIES:   ${techStr}`);
    if (proj.github_url) lines.push(`SOURCE REPO:    ${proj.github_url}`);
    if (proj.live_url)   lines.push(`LIVE DEPLOY:    ${proj.live_url}`);

    projectsDir.children![proj.slug] = {
      name: proj.slug,
      type: 'file',
      content: lines.join('\n'),
      url: proj.live_url || proj.github_url || undefined,
    };
  });
  root.children!['projects'] = projectsDir;

  // 8. social/ directory & contact.txt
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

  root.children!['contact.txt'] = {
    name: 'contact.txt',
    type: 'file',
    content: [
      'COMMUNICATIONS CHANNELS:',
      '════════════════════════',
      `PRIMARY EMAIL: ${email}`,
      'GITHUB:        https://github.com/hardikgaikwad',
      'LINKEDIN:      https://linkedin.com/in/hardikgaikwad',
      `LOCATION:      ${location}`,
      'PGP ID:        7F92 B3A1 89C4 D5E2 1109',
    ].join('\n'),
  };

  // README.md
  root.children!['README.md'] = {
    name: 'README.md',
    type: 'file',
    content: [
      `# ${name.toUpperCase()} // PORTFOLIO TERMINAL`,
      '',
      `> ${title}`,
      `> "BUILD IT. BREAK IT. SECURE IT."`,
      '',
      'AVAILABLE SECTIONS (DIRECTORIES):',
      '  about/          - Operative bio and technical profile',
      '  projects/       - Offensive security and engineering case files',
      '  skills/         - Categorized tools, languages, and security matrices',
      '  certifications/ - eJPT, TryHackMe learning credentials',
      '  education/      - Academic records (JEC B.Tech IT, Bal Bhavan)',
      '  resume/         - Dual-track PDF resumes (cybersecurity & software)',
      '  social/         - GitHub, LinkedIn, and encrypted email links',
      '',
      'QUICK COMMANDS:',
      '  whoami          - Display profile summary',
      '  projects        - List case files with details',
      '  resume          - Choose & download cybersecurity or software resume',
      '  github          - Open https://github.com/hardikgaikwad',
      '  linkedin        - Open https://linkedin.com/in/hardikgaikwad',
      '  help            - Full command reference index',
    ].join('\n'),
  };

  return root;
}

/**
 * Resolve a path string to an FSNode.
 */
export function resolvePath(
  pathParts: string[],
  currentPath: string[],
  fs: FSNode
): { node: FSNode | null; resolvedPath: string[] } {
  let targetPath: string[];

  if (pathParts.length === 0 || (pathParts.length === 1 && pathParts[0] === '')) {
    targetPath = [...currentPath];
  } else if (pathParts[0] === '~' || pathParts[0] === '') {
    targetPath = pathParts.filter(p => p !== '' && p !== '~');
  } else {
    targetPath = [...currentPath];
    for (const part of pathParts) {
      if (part === '.') continue;
      if (part === '..') {
        targetPath.pop();
      } else {
        targetPath.push(part);
      }
    }
  }

  let current = fs;
  for (const segment of targetPath) {
    if (!current.children || !current.children[segment]) {
      return { node: null, resolvedPath: targetPath };
    }
    current = current.children[segment];
  }

  return { node: current, resolvedPath: targetPath };
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
