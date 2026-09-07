/* ═══════════════════════════════════════════════════════════
   Command Parser — Terminal command execution engine
   Integrated with database-driven virtual filesystem
   ═══════════════════════════════════════════════════════════ */

import type { Profile, Project, SocialLink, SkillCategory, Education, Certification } from '../types/api';
import type { FSNode } from './virtualFileSystem';
import { resolvePath, listDir } from './virtualFileSystem';

export interface CommandOutput {
  type: 'text' | 'error' | 'info' | 'link' | 'system';
  content: string;
  url?: string;
}

export interface CommandResult {
  outputs: CommandOutput[];
  clear?: boolean;
  newPath?: string[];
}

// All available commands
const COMMANDS = [
  'help', 'ls', 'cd', 'pwd', 'cat', 'whoami', 'projects',
  'open', 'social', 'github', 'linkedin', 'email', 'resume',
  'download', 'certifications', 'education', 'skills', 'clear',
  'history', 'tree', 'echo', 'date', 'uname', 'neofetch',
];

/**
 * Execute a terminal command.
 */
export function executeCommand(
  input: string,
  currentPath: string[],
  fs: FSNode,
  profile: Profile | null,
  projects: Project[],
  social: SocialLink[],
  commandHistory: string[],
  education?: Education[],
  certifications?: Certification[],
  skills?: SkillCategory[],
  navigate?: (path: string) => void
): CommandResult {
  const trimmed = input.trim();
  if (!trimmed) return { outputs: [] };

  const parts = trimmed.split(/\s+/);
  const cmd = parts[0].toLowerCase();
  const args = parts.slice(1);

  switch (cmd) {
    case 'help':
      return cmdHelp();
    case 'ls':
      return cmdLs(args, currentPath, fs);
    case 'cd':
      return cmdCd(args, currentPath, fs);
    case 'pwd':
      return cmdPwd(currentPath);
    case 'cat':
      return cmdCat(args, currentPath, fs);
    case 'whoami':
      return cmdWhoami(profile, fs);
    case 'projects':
      return cmdProjects(projects);
    case 'open':
      return cmdOpen(args, projects, navigate);
    case 'social':
    case 'socials':
      return cmdSocial(social, fs);
    case 'github':
      return cmdOpenUrl('https://github.com/hardikgaikwad', 'Opening GitHub profile (https://github.com/hardikgaikwad)...');
    case 'linkedin':
      return cmdOpenUrl('https://linkedin.com/in/hardikgaikwad', 'Opening LinkedIn profile (https://linkedin.com/in/hardikgaikwad)...');
    case 'email':
      return cmdOpenSocial('email', social, profile);
    case 'certifications':
    case 'certs':
      return cmdCertifications(certifications, fs);
    case 'education':
    case 'edu':
      return cmdEducation(education, fs);
    case 'skills':
      return cmdSkills(skills);
    case 'resume':
      return cmdResume(args, profile);
    case 'download':
      return cmdDownload(args, profile);
    case 'clear':
      return { outputs: [], clear: true };
    case 'history':
      return cmdHistory(commandHistory);
    case 'tree':
      return cmdTree(currentPath, fs);
    case 'echo':
      return { outputs: [{ type: 'text', content: args.join(' ') }] };
    case 'date':
      return { outputs: [{ type: 'text', content: new Date().toUTCString() }] };
    case 'uname':
      return { outputs: [{ type: 'text', content: 'PortfolioOS 2.5.0-hardik-sec x86_64 GNU/Linux' }] };
    case 'neofetch':
      return cmdNeofetch(profile);
    case 'sudo':
      return { outputs: [{ type: 'error', content: 'sudo: operative is not in the sudoers file. This incident will be logged.' }] };
    case 'hack':
    case 'exploit':
      return { outputs: [{ type: 'system', content: '[*] Initiating ethical reconnaissance... Type "projects" to view security research and tools.' }] };
    default:
      return cmdNotFound(cmd);
  }
}

function cmdHelp(): CommandResult {
  return {
    outputs: [
      { type: 'info', content: 'AVAILABLE TERMINAL COMMANDS' },
      { type: 'info', content: '═══════════════════════════' },
      { type: 'text', content: '' },
      { type: 'system', content: 'FILESYSTEM & NAVIGATION:' },
      { type: 'text', content: '  ls [path]             List directory contents' },
      { type: 'text', content: '  cd <path>             Change directory (e.g. cd projects, cd ..)' },
      { type: 'text', content: '  pwd                   Print working directory' },
      { type: 'text', content: '  cat <file>            Display file contents (e.g. cat about.txt)' },
      { type: 'text', content: '  tree                  Display directory tree' },
      { type: 'text', content: '' },
      { type: 'system', content: 'DOSSIER & PROFILE:' },
      { type: 'text', content: '  whoami                Display operative credentials' },
      { type: 'text', content: '  projects              List all technical projects and case files' },
      { type: 'text', content: '  open <slug>           Inspect dossier (e.g. open privshare)' },
      { type: 'text', content: '  certifications        Display credentials (or cat certifications.txt)' },
      { type: 'text', content: '  education             Display academic background (or cat education.txt)' },
      { type: 'text', content: '  skills                List technical arsenal categories' },
      { type: 'text', content: '' },
      { type: 'system', content: 'RESUME & LINKS:' },
      { type: 'text', content: '  resume                Display resume tracks and options' },
      { type: 'text', content: '  resume --security     Download Cybersecurity Resume' },
      { type: 'text', content: '  resume --software     Download Software Development Resume' },
      { type: 'text', content: '  github                Open https://github.com/hardikgaikwad' },
      { type: 'text', content: '  linkedin              Open https://linkedin.com/in/hardikgaikwad' },
      { type: 'text', content: '  social                List all communication channels (or cat socials.txt)' },
      { type: 'text', content: '' },
      { type: 'system', content: 'SYSTEM & UTILITIES:' },
      { type: 'text', content: '  neofetch              Display system banner & environment stats' },
      { type: 'text', content: '  history               Show recent command history' },
      { type: 'text', content: '  clear                 Clear the terminal screen (or Ctrl+L)' },
    ],
  };
}

function cmdLs(args: string[], currentPath: string[], fs: FSNode): CommandResult {
  const target = args[0] || '';
  const { node } = resolvePath(target, currentPath, fs);
  if (!node) {
    return { outputs: [{ type: 'error', content: `ls: cannot access '${target}': No such file or directory` }] };
  }

  if (node.type === 'file') {
    return { outputs: [{ type: 'text', content: node.name }] };
  }

  const entries = listDir(node);
  if (entries.length === 0) {
    return { outputs: [{ type: 'text', content: '(empty directory)' }] };
  }

  const formatted = entries.map(entry => {
    if (entry.endsWith('/')) {
      return `\x1b[dir]${entry}\x1b[/dir]`;
    }
    return entry;
  });

  return {
    outputs: [{ type: 'text', content: formatted.join('   ') }],
  };
}

function cmdCd(args: string[], currentPath: string[], fs: FSNode): CommandResult {
  if (args.length === 0 || args[0] === '~') {
    return { outputs: [], newPath: [] };
  }

  const target = args[0];
  const { node, resolvedPath } = resolvePath(target, currentPath, fs);

  if (!node) {
    return { outputs: [{ type: 'error', content: `cd: ${target}: No such file or directory` }] };
  }

  if (node.type !== 'dir') {
    return { outputs: [{ type: 'error', content: `cd: ${target}: Not a directory` }] };
  }

  return { outputs: [], newPath: resolvedPath };
}

function cmdPwd(currentPath: string[]): CommandResult {
  const path = currentPath.length > 0 ? `~/${currentPath.join('/')}` : '~';
  return { outputs: [{ type: 'text', content: path }] };
}

function cmdCat(args: string[], currentPath: string[], fs: FSNode): CommandResult {
  if (args.length === 0) {
    return { outputs: [{ type: 'error', content: 'cat: missing file operand' }] };
  }

  const target = args[0];
  const { node } = resolvePath(target, currentPath, fs);

  if (!node) {
    return { outputs: [{ type: 'error', content: `cat: ${target}: No such file or directory` }] };
  }

  if (node.type === 'dir') {
    return { outputs: [{ type: 'error', content: `cat: ${target}: Is a directory` }] };
  }

  const lines = (node.content || '').split('\n');
  const outputs: CommandOutput[] = lines.map(line => ({ type: 'text' as const, content: line }));
  if (node.url) {
    outputs.push({ type: 'link', content: `[Open Document: ${node.url}]`, url: node.url });
  }
  return { outputs };
}

function cmdWhoami(profile: Profile | null, fs: FSNode): CommandResult {
  const aboutNode = fs.children?.['about.txt'];
  if (aboutNode && aboutNode.content) {
    return {
      outputs: [
        { type: 'info', content: `OPERATIVE: ${(profile?.name || 'Hardik Gaikwad').toUpperCase()}` },
        ...aboutNode.content.split('\n').map(l => ({ type: 'text' as const, content: l })),
      ],
    };
  }

  const name = profile?.name || 'Hardik Gaikwad';
  const title = profile?.title || 'Cybersecurity Engineer & Software Developer';
  return {
    outputs: [
      { type: 'info', content: `OPERATIVE: ${name.toUpperCase()}` },
      { type: 'text', content: `ROLE:      ${title}` },
      { type: 'text', content: 'LOCATION:  Jabalpur, Madhya Pradesh, India' },
      { type: 'text', content: `EMAIL:     ${profile?.email || 'hardikgaikwad04@gmail.com'}` },
      { type: 'text', content: '' },
      { type: 'system', content: `MOTTO: "BUILD IT. BREAK IT. SECURE IT."` },
    ],
  };
}

function cmdProjects(projects: Project[]): CommandResult {
  if (projects.length === 0) {
    return { outputs: [{ type: 'text', content: 'No projects found in database.' }] };
  }

  const outputs: CommandOutput[] = [
    { type: 'info', content: 'OPERATIONAL CASE FILES & PROJECTS' },
    { type: 'info', content: '═════════════════════════════════' },
    { type: 'text', content: '' },
  ];

  projects.forEach((p, i) => {
    const num = String(i + 1).padStart(2, '0');
    const featured = p.featured ? ' [★ FEATURED]' : '';
    const track = p.project_type ? ` [${p.project_type.toUpperCase()}]` : '';
    const filename = p.terminal_filename || `${p.slug}.txt`;
    outputs.push({ type: 'text', content: `  ${num}. ${p.title}${track}${featured}` });
    outputs.push({ type: 'system', content: `      ${p.short_description}` });
    outputs.push({ type: 'system', content: `      FILE: projects/${filename}` });
    outputs.push({ type: 'system', content: `      TECH: ${p.technologies ? p.technologies.join(', ') : ''}` });
    if (p.github_url) outputs.push({ type: 'link', content: `      REPO: ${p.github_url}`, url: p.github_url });
    if (p.live_url) outputs.push({ type: 'link', content: `      LIVE: ${p.live_url}`, url: p.live_url });
    outputs.push({ type: 'text', content: '' });
  });

  outputs.push({ type: 'system', content: 'Use "cat projects/<filename>" or "open <slug>" to view full architectural specification.' });

  return { outputs };
}

function cmdOpen(args: string[], projects: Project[], _navigate?: (path: string) => void): CommandResult {
  if (args.length === 0) {
    return { outputs: [{ type: 'error', content: 'open: missing project slug or filename. Usage: open <slug>' }] };
  }

  const target = args[0].toLowerCase().replace(/\.txt$/, '');
  const project = projects.find(p =>
    p.slug.toLowerCase() === target ||
    p.title.toLowerCase() === target ||
    (p.terminal_filename && p.terminal_filename.toLowerCase().replace(/\.txt$/, '') === target)
  );

  if (!project) {
    const available = projects.map(p => p.slug).join(', ');
    return {
      outputs: [
        { type: 'error', content: `open: project not found: ${args[0]}` },
        { type: 'system', content: `Available projects: ${available}` },
      ],
    };
  }

  if (project.live_url) {
    window.open(project.live_url, '_blank');
    return { outputs: [{ type: 'info', content: `Launching live deployment: ${project.title} (${project.live_url})...` }] };
  } else if (project.github_url) {
    window.open(project.github_url, '_blank');
    return { outputs: [{ type: 'info', content: `Opening repository: ${project.title} (${project.github_url})...` }] };
  }

  return {
    outputs: [
      { type: 'info', content: `Dossier selected: ${project.title}` },
      { type: 'text', content: project.short_description },
    ],
  };
}

function cmdCertifications(certifications?: Certification[], fs?: FSNode): CommandResult {
  const certsNode = fs?.children?.['certifications.txt'];
  if (certsNode && certsNode.content) {
    return {
      outputs: certsNode.content.split('\n').map(l => ({ type: 'text' as const, content: l })),
    };
  }

  if (certifications && certifications.length > 0) {
    const lines: CommandOutput[] = [
      { type: 'info', content: 'CREDENTIALS & CERTIFICATIONS' },
      { type: 'info', content: '════════════════════════════' },
      { type: 'text', content: '' },
    ];
    certifications.forEach((c, idx) => {
      lines.push({ type: 'text', content: `${idx + 1}. ${c.title} — ${c.issuer || 'INE / Security'}` });
      if (c.status) lines.push({ type: 'system', content: `   STATUS:  ${c.status}` });
      if (c.description) lines.push({ type: 'system', content: `   DETAILS: ${c.description}` });
      if (c.url) lines.push({ type: 'link', content: `   LINK:    ${c.url}`, url: c.url });
      lines.push({ type: 'text', content: '' });
    });
    return { outputs: lines };
  }

  return { outputs: [{ type: 'text', content: 'No certification records found in database.' }] };
}

function cmdEducation(education?: Education[], fs?: FSNode): CommandResult {
  const eduNode = fs?.children?.['education.txt'];
  if (eduNode && eduNode.content) {
    return {
      outputs: eduNode.content.split('\n').map(l => ({ type: 'text' as const, content: l })),
    };
  }

  if (education && education.length > 0) {
    const lines: CommandOutput[] = [
      { type: 'info', content: 'ACADEMIC FORMATION' },
      { type: 'info', content: '══════════════════' },
      { type: 'text', content: '' },
    ];
    education.forEach((e, idx) => {
      lines.push({ type: 'text', content: `${idx + 1}. ${e.institution} — ${e.degree}` });
      lines.push({ type: 'system', content: `   Period: ${e.period}` });
      if (e.grade) lines.push({ type: 'system', content: `   Grade:  ${e.grade}` });
      if (e.location) lines.push({ type: 'system', content: `   Locale: ${e.location}` });
      lines.push({ type: 'text', content: '' });
    });
    return { outputs: lines };
  }

  return { outputs: [{ type: 'text', content: 'No education records found in database.' }] };
}

function cmdSkills(skills?: SkillCategory[]): CommandResult {
  if (skills && skills.length > 0) {
    const outputs: CommandOutput[] = [
      { type: 'info', content: 'TECHNICAL ARSENAL MATRIX' },
      { type: 'info', content: '════════════════════════' },
      { type: 'text', content: '' },
    ];
    skills.forEach(cat => {
      outputs.push({ type: 'system', content: `[${cat.name.toUpperCase()}]` });
      outputs.push({ type: 'text', content: `  › ${cat.skills.map(s => s.name).join(', ')}` });
      outputs.push({ type: 'text', content: '' });
    });
    return { outputs };
  }
  return { outputs: [{ type: 'text', content: 'Skills matrix loaded from API.' }] };
}

function cmdResume(args: string[], profile: Profile | null): CommandResult {
  const flag = args[0]?.toLowerCase();

  const secUrl = profile?.resume_security_url || profile?.resume_url || '/resumes/cybersecurity.pdf';
  const softUrl = profile?.resume_software_url || profile?.resume_url || '/resumes/software-development.pdf';

  if (flag === '--security' || flag === '-s') {
    window.open(secUrl, '_blank');
    return {
      outputs: [
        { type: 'info', content: 'Downloading cybersecurity resume...' },
        { type: 'link', content: `LINK: ${secUrl}`, url: secUrl },
      ],
    };
  }

  if (flag === '--software' || flag === '-d') {
    window.open(softUrl, '_blank');
    return {
      outputs: [
        { type: 'info', content: 'Downloading software development resume...' },
        { type: 'link', content: `LINK: ${softUrl}`, url: softUrl },
      ],
    };
  }

  return {
    outputs: [
      { type: 'info', content: 'HARDIK GAIKWAD — DUAL-TRACK RESUME REPOSITORY' },
      { type: 'info', content: '═══════════════════════════════════════════' },
      { type: 'text', content: '' },
      { type: 'text', content: 'Select which resume version to download:' },
      { type: 'text', content: '' },
      { type: 'system', content: '  1. CYBERSECURITY TRACK (TryHackMe Top 4%, Pentesting, AppSec)' },
      { type: 'link', content: '     Command: download resume --security', url: secUrl },
      { type: 'text', content: '' },
      { type: 'system', content: '  2. SOFTWARE ENGINEERING TRACK (Django, React, AWS S3, E2EE, Python)' },
      { type: 'link', content: '     Command: download resume --software', url: softUrl },
      { type: 'text', content: '' },
      { type: 'system', content: 'Usage example: resume --security  OR  download resume --software' },
    ],
  };
}

function cmdDownload(args: string[], profile: Profile | null): CommandResult {
  if (args.length === 0 || args[0].toLowerCase() === 'resume') {
    const subArgs = args[0]?.toLowerCase() === 'resume' ? args.slice(1) : args;
    return cmdResume(subArgs, profile);
  }

  const target = args[0].toLowerCase();
  if (target === 'cybersecurity.pdf' || target === '--security') {
    return cmdResume(['--security'], profile);
  }
  if (target === 'software-development.pdf' || target === '--software') {
    return cmdResume(['--software'], profile);
  }

  return cmdResume(args, profile);
}

function cmdSocial(social: SocialLink[], fs: FSNode): CommandResult {
  const socialsNode = fs.children?.['socials.txt'];
  if (socialsNode && socialsNode.content) {
    return {
      outputs: socialsNode.content.split('\n').map(l => ({ type: 'text' as const, content: l })),
    };
  }

  const outputs: CommandOutput[] = [
    { type: 'info', content: 'COMMUNICATIONS CHANNELS' },
    { type: 'info', content: '═══════════════════════' },
    { type: 'text', content: '' },
  ];

  social.forEach(s => {
    outputs.push({
      type: 'link',
      content: `  ${s.platform_display || s.platform}: ${s.url}`,
      url: s.url,
    });
  });

  return { outputs };
}

function cmdOpenUrl(url: string, message: string): CommandResult {
  window.open(url, '_blank');
  return {
    outputs: [
      { type: 'info', content: message },
      { type: 'link', content: `Opened: ${url}`, url },
    ],
  };
}

function cmdOpenSocial(platform: string, social: SocialLink[], profile: Profile | null): CommandResult {
  const link = social.find(s => s.platform === platform);
  if (link) {
    const url = platform === 'email' ? `mailto:${link.url}` : link.url;
    window.open(url, '_blank');
    return {
      outputs: [{ type: 'info', content: `Opening ${link.platform_display || platform} (${link.url})...` }],
    };
  }

  if (platform === 'email') {
    const mailto = `mailto:${profile?.email || 'hardikgaikwad04@gmail.com'}`;
    window.open(mailto, '_blank');
    return { outputs: [{ type: 'info', content: `Opening ${mailto}...` }] };
  }

  return { outputs: [{ type: 'error', content: `${platform}: channel not found` }] };
}

function cmdHistory(history: string[]): CommandResult {
  if (history.length === 0) {
    return { outputs: [{ type: 'text', content: 'No command history.' }] };
  }

  return {
    outputs: history.map((cmd, i) => ({
      type: 'text' as const,
      content: `  ${String(i + 1).padStart(4)}  ${cmd}`,
    })),
  };
}

function cmdTree(currentPath: string[], fs: FSNode): CommandResult {
  const { node } = resolvePath('', currentPath, fs);
  if (!node) {
    return { outputs: [{ type: 'error', content: 'tree: unable to read directory' }] };
  }

  const lines: string[] = [];
  const prefix = currentPath.length > 0 ? `~/${currentPath.join('/')}` : '~';
  lines.push(prefix);

  function walk(n: FSNode, indent: string) {
    if (!n.children) return;
    const keys = Object.keys(n.children).sort();
    keys.forEach((key, i) => {
      const child = n.children![key];
      const last = i === keys.length - 1;
      const connector = last ? '└── ' : '├── ';
      const display = child.type === 'dir' ? `${key}/` : key;
      lines.push(`${indent}${connector}${display}`);
      if (child.type === 'dir') {
        walk(child, indent + (last ? '    ' : '│   '));
      }
    });
  }

  walk(node, '');

  return {
    outputs: lines.map(line => ({ type: 'text' as const, content: line })),
  };
}

function cmdNeofetch(profile: Profile | null): CommandResult {
  const name = profile?.name || 'Hardik Gaikwad';

  return {
    outputs: [
      { type: 'info', content: '  ┌─────────────────────┐' },
      { type: 'info', content: '  │      ████████       │' },
      { type: 'info', content: '  │    ████    ████     │' },
      { type: 'info', content: '  │   ██   ████   ██    │' },
      { type: 'info', content: '  │   ██   ████   ██    │' },
      { type: 'info', content: '  │    ████    ████     │' },
      { type: 'info', content: '  │      ████████       │' },
      { type: 'info', content: '  └─────────────────────┘' },
      { type: 'text', content: '' },
      { type: 'text', content: `  OPERATIVE:  ${name}` },
      { type: 'text', content: `  HOST:       hardik-security-workstation` },
      { type: 'text', content: `  OS:         PortfolioOS 2.5.0 (Debian / Linux)` },
      { type: 'text', content: `  KERNEL:     Linux 6.8.0-kali x86_64` },
      { type: 'text', content: `  SHELL:      portfolio-sh (v2.5)` },
      { type: 'text', content: `  EDUCATION:  B.Tech IT (Jabalpur Engineering College)` },
      { type: 'text', content: `  CERTS:      eJPT | TryHackMe Global Top 4%` },
      { type: 'text', content: `  THEME:      Retro College-Poster x Cyber Terminal` },
      { type: 'text', content: `  MOTTO:      BUILD IT. BREAK IT. SECURE IT.` },
      { type: 'text', content: '' },
      { type: 'system', content: `  [✓] ALL DEFENSIVE & OFFENSIVE MONITORS NOMINAL` },
    ],
  };
}

function cmdNotFound(cmd: string): CommandResult {
  const suggestions = COMMANDS.filter(c =>
    c.startsWith(cmd[0]) || c.includes(cmd.slice(0, 3))
  ).slice(0, 3);

  const outputs: CommandOutput[] = [
    { type: 'error', content: `Command not found: ${cmd}` },
  ];

  if (suggestions.length > 0) {
    outputs.push({ type: 'system', content: `Did you mean: ${suggestions.join(', ')}?` });
  }

  outputs.push({ type: 'system', content: "Type 'help' to see all available commands." });

  return { outputs };
}

/**
 * Get autocomplete suggestions for a partial command or path.
 */
export function getCompletions(input: string, currentPath: string[], fs: FSNode): string[] {
  const trimmed = input.trimStart();
  const parts = trimmed.split(/\s+/);

  if (parts.length <= 1) {
    return COMMANDS.filter(c => c.startsWith(parts[0].toLowerCase()));
  }

  const cmd = parts[0].toLowerCase();
  const target = parts[parts.length - 1];

  if (['cd', 'ls', 'cat', 'open'].includes(cmd)) {
    const lastSlash = target.lastIndexOf('/');
    let searchDir = currentPath;
    let prefix = '';
    let searchTerm = target;

    if (lastSlash !== -1) {
      const dirPart = target.slice(0, lastSlash);
      searchTerm = target.slice(lastSlash + 1);
      const { node, resolvedPath } = resolvePath(dirPart, currentPath, fs);
      if (node && node.type === 'dir') {
        searchDir = resolvedPath;
        prefix = target.slice(0, lastSlash + 1);
      }
    }

    const { node } = resolvePath('', searchDir, fs);
    if (node && node.children) {
      return Object.keys(node.children)
        .filter(name => name.toLowerCase().startsWith(searchTerm.toLowerCase()))
        .map(name => {
          const cmdPrefix = parts.slice(0, -1).join(' ');
          const child = node.children![name];
          const suffix = child.type === 'dir' ? '/' : '';
          return `${cmdPrefix} ${prefix}${name}${suffix}`;
        });
    }
  }

  return [];
}
