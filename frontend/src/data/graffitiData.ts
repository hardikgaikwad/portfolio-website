/* ═══════════════════════════════════════════════════════════
   graffitiData.ts — Hand-Sprayed Graffiti & Doodles Catalog
   Multi-Style Collection: Stencil, Bubbly, Incomplete, Doodles
   ═══════════════════════════════════════════════════════════ */

export interface OversprayDot {
  dx: number;
  dy: number;
  r: number;
  opacity: number;
}

export type DoodleType =
  | 'eye'
  | 'crossed-eye'
  | 'explosion'
  | 'explosion-small'
  | 'lightning'
  | 'crosshair'
  | 'lock'
  | 'bug'
  | 'arrow-up-right'
  | 'arrow-down-left'
  | 'bubbly-arrow'
  | 'terminal-prompt'
  | 'network-nodes'
  | 'wifi'
  | 'broken-chain'
  | 'skull-doodle'
  | 'brackets'
  | 'target'
  | 'sparkle'
  | 'bubbly-pwn'
  | 'bubbly-cloud'
  | 'quirky-smiley'
  | 'dead-smiley'
  | 'question-mark'
  | 'exclamation-mark'
  | 'rough-heart'
  | 'mini-star'
  | 'wavy-loop';

export interface GraffitiItem {
  id: string;
  kind: 'word' | 'doodle' | 'combo';
  text?: string;
  subtext?: string;
  doodle?: DoodleType;
  styleVariant?: 'stencil' | 'bubbly' | 'handwritten' | 'faded' | 'incomplete';
  side: 'left' | 'right';
  topPercent: number; // Vertical position as % of document height
  marginOffsetPx: number; // Distance from edge
  rotationDeg: number; // Varied: straight 0 to steep -12/+14
  scale: number; // Tiny (0.55) to Extra-Large (1.45)
  color: 'navy' | 'orange' | 'golden' | 'charcoal';
  opacity: number; // 0.32 (faded) to 0.92 (heavy)
  sprayEffect: boolean;
  oversprayDots?: OversprayDot[];
  hideOnMobile?: boolean;
}

export const GRAFFITI_ITEMS: GraffitiItem[] = [
  // ── HERO ZONE (0% - 15%) ────────────────────────────────────
  {
    id: 'hero-recon',
    kind: 'word',
    text: 'RECON',
    subtext: '// 01',
    styleVariant: 'stencil',
    side: 'left',
    topPercent: 3.2,
    marginOffsetPx: 28,
    rotationDeg: -5,
    scale: 1.15,
    color: 'navy',
    opacity: 0.88,
    sprayEffect: true,
    oversprayDots: [
      { dx: -35, dy: -12, r: 1.5, opacity: 0.4 },
      { dx: -28, dy: 18, r: 2.0, opacity: 0.35 },
      { dx: 45, dy: -14, r: 1.2, opacity: 0.5 },
      { dx: 52, dy: 10, r: 1.8, opacity: 0.45 },
    ],
  },
  {
    id: 'hero-crossed-eye',
    kind: 'doodle',
    doodle: 'crossed-eye',
    side: 'left',
    topPercent: 6.6,
    marginOffsetPx: 42,
    rotationDeg: 8,
    scale: 0.9,
    color: 'orange',
    opacity: 0.78,
    sprayEffect: true,
    oversprayDots: [
      { dx: 22, dy: -18, r: 1.5, opacity: 0.4 },
      { dx: -20, dy: 15, r: 1.8, opacity: 0.5 },
    ],
  },
  {
    id: 'hero-mini-star',
    kind: 'doodle',
    doodle: 'mini-star',
    side: 'left',
    topPercent: 9.8,
    marginOffsetPx: 55,
    rotationDeg: 0, // perfectly straight
    scale: 0.65, // Tiny
    color: 'golden',
    opacity: 0.7,
    sprayEffect: false,
    hideOnMobile: true,
  },
  {
    id: 'hero-reco-incomplete',
    kind: 'word',
    text: 'RECO_',
    styleVariant: 'incomplete',
    side: 'left',
    topPercent: 12.4,
    marginOffsetPx: 24,
    rotationDeg: 0, // straight
    scale: 0.8,
    color: 'charcoal',
    opacity: 0.42, // Faded / rushed
    sprayEffect: false,
    hideOnMobile: true,
  },
  {
    id: 'hero-explosion',
    kind: 'doodle',
    doodle: 'explosion',
    side: 'right',
    topPercent: 2.8,
    marginOffsetPx: 36,
    rotationDeg: 11, // strong tilt
    scale: 1.35, // Extra-Large
    color: 'golden',
    opacity: 0.9,
    sprayEffect: true,
    oversprayDots: [
      { dx: -28, dy: -22, r: 2.2, opacity: 0.5 },
      { dx: 32, dy: 16, r: 1.5, opacity: 0.4 },
      { dx: -18, dy: 26, r: 1.3, opacity: 0.45 },
    ],
  },

  // ── TERMINAL ZONE (15% - 30%) ───────────────────────────────
  {
    id: 'term-prompt-doodle',
    kind: 'combo',
    text: '>_',
    subtext: 'ROOT_SHELL',
    doodle: 'terminal-prompt',
    styleVariant: 'stencil',
    side: 'left',
    topPercent: 16.2,
    marginOffsetPx: 32,
    rotationDeg: -4,
    scale: 1.05,
    color: 'orange',
    opacity: 0.85,
    sprayEffect: true,
    oversprayDots: [
      { dx: -25, dy: 12, r: 1.8, opacity: 0.4 },
      { dx: 30, dy: -8, r: 1.2, opacity: 0.5 },
    ],
  },
  {
    id: 'term-lightning',
    kind: 'doodle',
    doodle: 'lightning',
    side: 'left',
    topPercent: 21.8,
    marginOffsetPx: 52,
    rotationDeg: 14, // steep tilt
    scale: 1.25, // Large
    color: 'golden',
    opacity: 0.92,
    sprayEffect: true,
  },
  {
    id: 'term-tcp',
    kind: 'word',
    text: 'TCP/IP:443',
    styleVariant: 'handwritten',
    side: 'left',
    topPercent: 26.8,
    marginOffsetPx: 25,
    rotationDeg: 0, // straight
    scale: 0.75, // Small
    color: 'charcoal',
    opacity: 0.58,
    sprayEffect: false,
    hideOnMobile: true,
  },
  {
    id: 'term-bubbly-cloud',
    kind: 'doodle',
    doodle: 'bubbly-cloud', // Bubbly cloud doodle
    side: 'left',
    topPercent: 29.5,
    marginOffsetPx: 46,
    rotationDeg: -6,
    scale: 1.05,
    color: 'navy',
    opacity: 0.72,
    sprayEffect: true,
    hideOnMobile: true,
  },
  {
    id: 'term-0day-incomplete',
    kind: 'word',
    text: '0D--',
    subtext: 'EXPLOIT',
    styleVariant: 'incomplete', // Incomplete tag
    side: 'right',
    topPercent: 15.6,
    marginOffsetPx: 36,
    rotationDeg: 5,
    scale: 1.0,
    color: 'orange',
    opacity: 0.78,
    sprayEffect: true,
    oversprayDots: [
      { dx: 28, dy: -14, r: 1.6, opacity: 0.45 },
      { dx: -30, dy: 16, r: 2.0, opacity: 0.4 },
    ],
  },
  {
    id: 'term-dead-smiley',
    kind: 'doodle',
    doodle: 'dead-smiley', // x_x dead cyber smiley
    side: 'right',
    topPercent: 20.8,
    marginOffsetPx: 48,
    rotationDeg: -3,
    scale: 0.85,
    color: 'navy',
    opacity: 0.8,
    sprayEffect: true,
  },
  {
    id: 'term-exclamation',
    kind: 'doodle',
    doodle: 'exclamation-mark',
    side: 'right',
    topPercent: 24.5,
    marginOffsetPx: 58,
    rotationDeg: 7,
    scale: 0.7, // Tiny
    color: 'golden',
    opacity: 0.85,
    sprayEffect: false,
  },
  {
    id: 'term-nodes',
    kind: 'doodle',
    doodle: 'network-nodes',
    side: 'right',
    topPercent: 28.2,
    marginOffsetPx: 30,
    rotationDeg: 0, // straight
    scale: 0.95,
    color: 'navy',
    opacity: 0.75,
    sprayEffect: false,
    hideOnMobile: true,
  },

  // ── ABOUT & DOSSIER ZONE (30% - 50%) ────────────────────────
  {
    id: 'about-build-it',
    kind: 'word',
    text: 'BUILD IT',
    subtext: '// BACKEND',
    styleVariant: 'stencil',
    side: 'left',
    topPercent: 33.2,
    marginOffsetPx: 28,
    rotationDeg: -3,
    scale: 1.45, // Extra-Large!
    color: 'navy',
    opacity: 0.92,
    sprayEffect: true,
    oversprayDots: [
      { dx: -42, dy: -12, r: 2.0, opacity: 0.5 },
      { dx: 48, dy: 20, r: 2.4, opacity: 0.45 },
      { dx: -22, dy: 24, r: 1.5, opacity: 0.5 },
      { dx: 30, dy: -18, r: 1.6, opacity: 0.4 },
    ],
  },
  {
    id: 'about-brackets',
    kind: 'doodle',
    doodle: 'brackets',
    side: 'left',
    topPercent: 43.0,
    marginOffsetPx: 50,
    rotationDeg: -7,
    scale: 0.9,
    color: 'navy',
    opacity: 0.75,
    sprayEffect: true,
  },
  {
    id: 'about-wavy-loop',
    kind: 'doodle',
    doodle: 'wavy-loop',
    side: 'left',
    topPercent: 47.5,
    marginOffsetPx: 38,
    rotationDeg: -12, // steep
    scale: 0.65, // Tiny
    color: 'charcoal',
    opacity: 0.55,
    sprayEffect: false,
    hideOnMobile: true,
  },
  {
    id: 'about-break-it',
    kind: 'word',
    text: 'BREAK IT',
    subtext: '// OFFSEC',
    styleVariant: 'stencil',
    side: 'right',
    topPercent: 33.8,
    marginOffsetPx: 32,
    rotationDeg: 8,
    scale: 1.4, // Extra-Large!
    color: 'orange',
    opacity: 0.9,
    sprayEffect: true,
    oversprayDots: [
      { dx: 40, dy: -18, r: 2.2, opacity: 0.5 },
      { dx: -38, dy: 16, r: 1.8, opacity: 0.45 },
    ],
  },
  {
    id: 'about-question',
    kind: 'doodle',
    doodle: 'question-mark',
    side: 'right',
    topPercent: 44.5,
    marginOffsetPx: 52,
    rotationDeg: 12, // steep
    scale: 0.85,
    color: 'orange',
    opacity: 0.78,
    sprayEffect: true,
  },
  {
    id: 'about-secur-faded',
    kind: 'word',
    text: 'SECUR...',
    styleVariant: 'faded', // Incomplete & faded
    side: 'right',
    topPercent: 48.2,
    marginOffsetPx: 26,
    rotationDeg: 0, // straight
    scale: 0.78,
    color: 'charcoal',
    opacity: 0.38, // very faded!
    sprayEffect: false,
    hideOnMobile: true,
  },

  // ── SKILLS / PROFICIENCIES ZONE (50% - 68%) ─────────────────
  {
    id: 'skills-root',
    kind: 'word',
    text: 'ROOT',
    subtext: '#UID=0',
    styleVariant: 'stencil',
    side: 'left',
    topPercent: 51.5,
    marginOffsetPx: 32,
    rotationDeg: -6,
    scale: 1.15,
    color: 'orange',
    opacity: 0.88,
    sprayEffect: true,
    oversprayDots: [
      { dx: -30, dy: -14, r: 1.6, opacity: 0.4 },
      { dx: 32, dy: 16, r: 2.0, opacity: 0.45 },
    ],
  },
  {
    id: 'skills-quirky-smiley',
    kind: 'doodle',
    doodle: 'quirky-smiley', // round sketchy grin
    side: 'left',
    topPercent: 56.8,
    marginOffsetPx: 48,
    rotationDeg: -4,
    scale: 0.95,
    color: 'golden',
    opacity: 0.82,
    sprayEffect: true,
  },
  {
    id: 'skills-bubbly-arrow',
    kind: 'doodle',
    doodle: 'bubbly-arrow', // curvy rounded street arrow
    side: 'left',
    topPercent: 61.2,
    marginOffsetPx: 36,
    rotationDeg: 7,
    scale: 0.85,
    color: 'navy',
    opacity: 0.8,
    sprayEffect: true,
  },
  {
    id: 'skills-wifi',
    kind: 'doodle',
    doodle: 'wifi',
    side: 'left',
    topPercent: 65.4,
    marginOffsetPx: 42,
    rotationDeg: 0, // straight
    scale: 0.85,
    color: 'charcoal',
    opacity: 0.65,
    sprayEffect: false,
    hideOnMobile: true,
  },
  {
    id: 'skills-bubbly-pwn',
    kind: 'doodle',
    doodle: 'bubbly-pwn', // Puffy bubble PWN!
    side: 'right',
    topPercent: 52.8,
    marginOffsetPx: 38,
    rotationDeg: 7,
    scale: 1.25, // Large bubbly
    color: 'navy',
    opacity: 0.88,
    sprayEffect: true,
    oversprayDots: [
      { dx: 28, dy: -14, r: 1.8, opacity: 0.4 },
      { dx: -24, dy: 18, r: 1.5, opacity: 0.5 },
    ],
  },
  {
    id: 'skills-rough-heart',
    kind: 'doodle',
    doodle: 'rough-heart', // hand-sprayed heart
    side: 'right',
    topPercent: 58.0,
    marginOffsetPx: 50,
    rotationDeg: -9,
    scale: 0.9,
    color: 'orange',
    opacity: 0.82,
    sprayEffect: true,
  },
  {
    id: 'skills-bug',
    kind: 'doodle',
    doodle: 'bug',
    side: 'right',
    topPercent: 62.6,
    marginOffsetPx: 44,
    rotationDeg: -11,
    scale: 1.05,
    color: 'navy',
    opacity: 0.8,
    sprayEffect: true,
  },
  {
    id: 'skills-auth-tiny',
    kind: 'word',
    text: 'AUTH:200',
    styleVariant: 'handwritten',
    side: 'right',
    topPercent: 66.5,
    marginOffsetPx: 25,
    rotationDeg: 0, // straight
    scale: 0.65, // Tiny!
    color: 'charcoal',
    opacity: 0.45, // light/faded
    sprayEffect: false,
    hideOnMobile: true,
  },

  // ── PROJECTS ZONE (68% - 88%) ───────────────────────────────
  // Near XSScan
  {
    id: 'proj-xss',
    kind: 'combo',
    text: 'XSS',
    doodle: 'arrow-up-right',
    styleVariant: 'stencil',
    side: 'left',
    topPercent: 70.8,
    marginOffsetPx: 32,
    rotationDeg: -7,
    scale: 1.25, // Large
    color: 'orange',
    opacity: 0.92,
    sprayEffect: true,
    oversprayDots: [
      { dx: -28, dy: -14, r: 2.0, opacity: 0.5 },
      { dx: 36, dy: 12, r: 1.6, opacity: 0.45 },
      { dx: 18, dy: 24, r: 1.2, opacity: 0.4 },
    ],
  },
  // Near PrivShare
  {
    id: 'proj-secure-lock',
    kind: 'combo',
    text: 'SECURE',
    doodle: 'lock',
    styleVariant: 'stencil',
    side: 'right',
    topPercent: 71.5,
    marginOffsetPx: 34,
    rotationDeg: 4,
    scale: 1.2,
    color: 'navy',
    opacity: 0.9,
    sprayEffect: true,
    oversprayDots: [
      { dx: 30, dy: -15, r: 1.8, opacity: 0.4 },
      { dx: -26, dy: 16, r: 2.2, opacity: 0.45 },
    ],
  },
  // Near Home Cyber Lab
  {
    id: 'proj-lab-chain',
    kind: 'combo',
    text: 'LAB_SIM',
    doodle: 'broken-chain',
    side: 'left',
    topPercent: 78.4,
    marginOffsetPx: 40,
    rotationDeg: 3,
    scale: 1.05,
    color: 'golden',
    opacity: 0.85,
    sprayEffect: true,
  },
  {
    id: 'proj-ship',
    kind: 'word',
    text: 'SHIP IT',
    subtext: '// PROD',
    styleVariant: 'stencil',
    side: 'right',
    topPercent: 79.2,
    marginOffsetPx: 42,
    rotationDeg: -5,
    scale: 1.1,
    color: 'orange',
    opacity: 0.85,
    sprayEffect: true,
    oversprayDots: [
      { dx: 24, dy: -10, r: 1.5, opacity: 0.4 },
      { dx: -20, dy: 14, r: 1.8, opacity: 0.45 },
    ],
  },
  {
    id: 'proj-explosion-small',
    kind: 'doodle',
    doodle: 'explosion-small',
    side: 'right',
    topPercent: 83.5,
    marginOffsetPx: 52,
    rotationDeg: 12,
    scale: 0.6, // Tiny
    color: 'golden',
    opacity: 0.72,
    sprayEffect: true,
  },
  {
    id: 'proj-scan',
    kind: 'word',
    text: 'SCAN // RECON',
    styleVariant: 'faded',
    side: 'left',
    topPercent: 84.8,
    marginOffsetPx: 26,
    rotationDeg: 0, // straight
    scale: 0.75, // Small
    color: 'charcoal',
    opacity: 0.48, // Faded
    sprayEffect: false,
    hideOnMobile: true,
  },

  // ── CONTACT & FOOTER ZONE (88% - 100%) ──────────────────────
  {
    id: 'contact-connect',
    kind: 'word',
    text: 'COMM_LINK',
    subtext: '// ACTIVE',
    styleVariant: 'stencil',
    side: 'left',
    topPercent: 91.2,
    marginOffsetPx: 35,
    rotationDeg: -4,
    scale: 1.1,
    color: 'navy',
    opacity: 0.85,
    sprayEffect: true,
  },
  {
    id: 'contact-target',
    kind: 'doodle',
    doodle: 'target',
    side: 'left',
    topPercent: 95.8,
    marginOffsetPx: 48,
    rotationDeg: 0, // straight
    scale: 0.95,
    color: 'orange',
    opacity: 0.8,
    sprayEffect: true,
  },
  {
    id: 'contact-eof',
    kind: 'word',
    text: ':(){ :|:& };:',
    subtext: '// FORK BOMB [DECORATIVE]',
    styleVariant: 'handwritten',
    side: 'right',
    topPercent: 94.2,
    marginOffsetPx: 30,
    rotationDeg: 2,
    scale: 0.78,
    color: 'charcoal',
    opacity: 0.58,
    sprayEffect: false,
    hideOnMobile: true,
  },
];
