/* ═══════════════════════════════════════════════════════════
   Command Parser — Terminal command execution engine
   ═══════════════════════════════════════════════════════════ */

import type { Profile, Project, SocialLink } from '../types/api';
import type { FSNode } from './virtualFileSystem';
import { resolvePath, listDir } from './virtualFileSystem';

export interface CommandOutput {
  type: 'text' | 'error' | 'info' | 'link' | 'system';
  content: string;
  url?: string;
}

export interface CommandResult {
  outputs: CommandOutput[];
  newPath?: string[];
  clear?: boolean;
}

// All available commands
const COMMANDS = [
  'help', 'ls', 'cd', 'pwd', 'cat', 'whoami', 'projects',
  'open', 'social', 'github', 'linkedin', 'email', 'resume',
  'download', 'clear', 'history', 'theme', 'tree', 'echo',
  'date', 'uname', 'neofetch',
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
      return cmdWhoami(profile);
    case 'projects':
      return cmdProjects(projects);
    case 'open':
      return cmdOpen(args, projects, navigate);
    case 'social':
      return cmdSocial(social);
    case 'github':
      return cmdOpenSocial('github', social);
    case 'linkedin':
      return cmdOpenSocial('linkedin', social);
    case 'email':
      return cmdOpenSocial('email', social);
    case 'resume':
    case 'download':
      return cmdResume(profile);
    case 'clear':
      return { outputs: [], clear: true };
    case 'history':
      return cmdHistory(commandHistory);
    case 'tree':
      return cmdTree(currentPath, fs);
    case 'echo':
      return { outputs: [{ type: 'text', content: args.join(' ') }] };
    case 'date':
      return { outputs: [{ type: 'text', content: new Date().toString() }] };
    case 'uname':
      return { outputs: [{ type: 'text', content: 'PortfolioOS 1.0.0 x86_64 HARDIK-TERMINAL' }] };
    case 'neofetch':
      return cmdNeofetch(profile);
    case 'sudo':
      return { outputs: [{ type: 'error', content: 'Permission denied. Nice try though.' }] };
    case 'rm':
      return { outputs: [{ type: 'error', content: 'Operation not permitted. This is a read-only filesystem.' }] };
    case 'hack':
    case 'exploit':
      return { outputs: [{ type: 'error', content: 'Access denied. Ethical hacking only.' }] };
    default:
      return cmdNotFound(cmd);
  }
}

function cmdHelp(): CommandResult {
  return {
    outputs: [
      { type: 'info', content: 'PORTFOLIO TERMINAL — AVAILABLE COMMANDS' },
      { type: 'info', content: '═══════════════════════════════════════' },
      { type: 'text', content: '' },
      { type: 'text', content: '  help          Show available commands' },
      { type: 'text', content: '  ls [path]     List directory contents' },
      { type: 'text', content: '  cd <path>     Navigate directories' },
      { type: 'text', content: '  pwd           Print working directory' },
      { type: 'text', content: '  cat <file>    Read file contents' },
      { type: 'text', content: '  tree          Show directory tree' },
      { type: 'text', content: '  whoami        Display profile info' },
      { type: 'text', content: '  projects      List all projects' },
      { type: 'text', content: '  open <slug>   View project detail' },
      { type: 'text', content: '  social        Show social links' },
      { type: 'text', content: '  github        Open GitHub profile' },
      { type: 'text', content: '  linkedin      Open LinkedIn profile' },
      { type: 'text', content: '  email         Open email' },
      { type: 'text', content: '  resume        View/download resume' },
      { type: 'text', content: '  clear         Clear terminal' },
      { type: 'text', content: '  history       Show command history' },
      { type: 'text', content: '  neofetch      System information' },
      { type: 'text', content: '' },
      { type: 'system', content: 'Use Tab for autocomplete, Up/Down for history' },
    ],
  };
}

function cmdLs(args: string[], currentPath: string[], fs: FSNode): CommandResult {
  const target = args[0] || '.';
  let node: FSNode;

  if (target === '.' || target === '') {
    const { node: resolved } = resolvePath(fs, currentPath, '.');
    node = resolved || fs;
    // Re-navigate to current path
    let tempNode = fs;
    for (const p of currentPath) {
      if (tempNode.children?.[p]) tempNode = tempNode.children[p];
    }
    node = tempNode;
  } else {
    const { node: resolved } = resolvePath(fs, currentPath, target);
    if (!resolved) {
      return { outputs: [{ type: 'error', content: `ls: cannot access '${target}': No such file or directory` }] };
    }
    node = resolved;
  }

  if (node.type === 'file') {
    return { outputs: [{ type: 'text', content: node.name }] };
  }

  const items = listDir(node);
  if (items.length === 0) {
    return { outputs: [{ type: 'system', content: '(empty directory)' }] };
  }

  const outputs: CommandOutput[] = items.map(item => ({
    type: 'text' as const,
    content: item.endsWith('/') ? `  \x1b[dir]${item}\x1b[/dir]` : `  ${item}`,
  }));

  return { outputs };
}

function cmdCd(args: string[], currentPath: string[], fs: FSNode): CommandResult {
  if (args.length === 0 || args[0] === '~') {
    return { outputs: [], newPath: [] };
  }

  const target = args[0];
  const { node, newPath } = resolvePath(fs, currentPath, target);

  if (!node) {
    return { outputs: [{ type: 'error', content: `cd: no such directory: ${target}` }] };
  }

  if (node.type !== 'dir') {
    return { outputs: [{ type: 'error', content: `cd: not a directory: ${target}` }] };
  }

  return { outputs: [], newPath };
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
  // Try with and without extension
  const { node } = resolvePath(fs, currentPath, target);
  
  if (!node) {
    // Try adding .txt extension
    const { node: nodeWithExt } = resolvePath(fs, currentPath, target + '.txt');
    if (nodeWithExt && nodeWithExt.type === 'file') {
      const lines = (nodeWithExt.content || '').split('\n');
      return { outputs: lines.map(line => ({ type: 'text' as const, content: line })) };
    }
    return { outputs: [{ type: 'error', content: `cat: ${target}: No such file or directory` }] };
  }

  if (node.type === 'dir') {
    return { outputs: [{ type: 'error', content: `cat: ${target}: Is a directory` }] };
  }

  const lines = (node.content || '').split('\n');
  return { outputs: lines.map(line => ({ type: 'text' as const, content: line })) };
}

function cmdWhoami(profile: Profile | null): CommandResult {
  if (!profile) {
    return { outputs: [{ type: 'text', content: 'visitor@portfolio' }] };
  }
  return {
    outputs: [
      { type: 'info', content: profile.name },
      { type: 'text', content: profile.title },
      { type: 'text', content: '' },
      { type: 'text', content: profile.bio },
      { type: 'text', content: '' },
      { type: 'system', content: `SESSION: visitor | HOST: ${profile.name.toLowerCase()}-terminal` },
    ],
  };
}

function cmdProjects(projects: Project[]): CommandResult {
  if (projects.length === 0) {
    return { outputs: [{ type: 'text', content: 'No projects found.' }] };
  }

  const outputs: CommandOutput[] = [
    { type: 'info', content: 'PROJECTS' },
    { type: 'info', content: '════════' },
    { type: 'text', content: '' },
  ];

  projects.forEach((p, i) => {
    const num = String(i + 1).padStart(2, '0');
    const featured = p.featured ? ' [FEATURED]' : '';
    outputs.push({ type: 'text', content: `  ${num}. ${p.title}${featured}` });
    outputs.push({ type: 'system', content: `      ${p.short_description}` });
    outputs.push({ type: 'system', content: `      TECH: ${p.technologies.join(', ')}` });
    outputs.push({ type: 'text', content: '' });
  });

  outputs.push({ type: 'system', content: 'Use "open <slug>" to view project details, or "cd projects && ls"' });

  return { outputs };
}

function cmdOpen(args: string[], projects: Project[], navigate?: (path: string) => void): CommandResult {
  if (args.length === 0) {
    return { outputs: [{ type: 'error', content: 'open: missing project slug. Usage: open <project-slug>' }] };
  }

  const slug = args[0].toLowerCase();
  const project = projects.find(p => p.slug === slug);

  if (!project) {
    const available = projects.map(p => p.slug).join(', ');
    return {
      outputs: [
        { type: 'error', content: `open: project not found: ${slug}` },
        { type: 'system', content: `Available: ${available}` },
      ],
    };
  }

  if (navigate) {
    navigate(`/project/${project.slug}`);
  }

  return {
    outputs: [
      { type: 'info', content: `Opening project: ${project.title}...` },
    ],
  };
}

function cmdSocial(social: SocialLink[]): CommandResult {
  if (social.length === 0) {
    return { outputs: [{ type: 'text', content: 'No social links configured.' }] };
  }

  const outputs: CommandOutput[] = [
    { type: 'info', content: 'SOCIAL LINKS' },
    { type: 'info', content: '════════════' },
    { type: 'text', content: '' },
  ];

  social.forEach(link => {
    outputs.push({
      type: 'link',
      content: `  ${(link.platform_display || link.platform).padEnd(12)} ${link.url}`,
      url: link.platform === 'email' ? `mailto:${link.url}` : link.url,
    });
  });

  return { outputs };
}

function cmdOpenSocial(platform: string, social: SocialLink[]): CommandResult {
  const link = social.find(s => s.platform === platform);
  if (!link) {
    return { outputs: [{ type: 'error', content: `${platform}: not configured` }] };
  }

  const url = platform === 'email' ? `mailto:${link.url}` : link.url;
  window.open(url, '_blank');

  return {
    outputs: [{ type: 'info', content: `Opening ${link.platform_display || platform}...` }],
  };
}

function cmdResume(profile: Profile | null): CommandResult {
  if (!profile?.resume_url) {
    return { outputs: [{ type: 'system', content: 'Resume not uploaded. Configure via admin portal.' }] };
  }

  window.open(profile.resume_url, '_blank');
  return {
    outputs: [{ type: 'info', content: 'Opening resume for download...' }],
  };
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
  let node = fs;
  for (const p of currentPath) {
    if (node.children?.[p]) node = node.children[p];
  }

  const lines: string[] = [];
  const prefix = currentPath.length > 0 ? `~/${currentPath.join('/')}` : '~';
  lines.push(prefix);

  function walk(n: FSNode, indent: string) {
    if (!n.children) return;
    const keys = Object.keys(n.children);
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
  const name = profile?.name || 'PORTFOLIO';
  return {
    outputs: [
      { type: 'info', content: '  ┌─────────────────────┐' },
      { type: 'info', content: '  │   ╔═══╗  ╔═══╗      │' },
      { type: 'info', content: '  │   ║   ║  ║   ║      │' },
      { type: 'info', content: '  │   ╚═══╝  ╚═══╝      │' },
      { type: 'info', content: '  │      ╔═══╗          │' },
      { type: 'info', content: '  │      ║   ║          │' },
      { type: 'info', content: '  │      ╚═══╝          │' },
      { type: 'info', content: '  └─────────────────────┘' },
      { type: 'text', content: '' },
      { type: 'text', content: `  USER:    visitor` },
      { type: 'text', content: `  HOST:    ${name.toLowerCase()}-terminal` },
      { type: 'text', content: `  OS:      PortfolioOS 1.0.0` },
      { type: 'text', content: `  KERNEL:  React 19.x` },
      { type: 'text', content: `  SHELL:   portfolio-sh` },
      { type: 'text', content: `  UPTIME:  ${Math.floor(performance.now() / 1000)}s` },
      { type: 'text', content: `  BACKEND: Django REST Framework` },
      { type: 'text', content: '' },
      { type: 'system', content: `  ████████████████ SYSTEM ONLINE` },
    ],
  };
}

function cmdNotFound(cmd: string): CommandResult {
  // Suggest closest command
  const suggestions = COMMANDS.filter(c =>
    c.startsWith(cmd[0]) || c.includes(cmd.slice(0, 3))
  ).slice(0, 3);

  const outputs: CommandOutput[] = [
    { type: 'error', content: `Command not found: ${cmd}` },
  ];

  if (suggestions.length > 0) {
    outputs.push({ type: 'system', content: `Did you mean: ${suggestions.join(', ')}?` });
  }

  outputs.push({ type: 'system', content: "Type 'help' to see available commands." });

  return { outputs };
}

/**
 * Get autocomplete suggestions for a partial command.
 */
export function getCompletions(partial: string, currentPath: string[], fs: FSNode): string[] {
  const parts = partial.split(/\s+/);

  if (parts.length <= 1) {
    // Complete command names
    return COMMANDS.filter(c => c.startsWith(parts[0].toLowerCase()));
  }

  // Complete file/directory names
  const cmd = parts[0].toLowerCase();
  const target = parts[parts.length - 1];

  if (['cd', 'ls', 'cat', 'open'].includes(cmd)) {
    let node = fs;
    for (const p of currentPath) {
      if (node.children?.[p]) node = node.children[p];
    }

    if (node.children) {
      return Object.keys(node.children)
        .filter(name => name.startsWith(target))
        .map(name => {
          const prefix = parts.slice(0, -1).join(' ');
          const child = node.children![name];
          const suffix = child.type === 'dir' ? '/' : '';
          return `${prefix} ${name}${suffix}`;
        });
    }
  }

  return [];
}
