/* ═══════════════════════════════════════════════════════════
   RetroTitle.tsx — Wide Horizontal Wordmark "HARDIK GAIKWAD"
   One single continuous line in Thugolatz display typography
   ═══════════════════════════════════════════════════════════ */

import './RetroTitle.css';

interface Props {
  text?: string;
  className?: string;
}

export default function RetroTitle({ text = 'HARDIK GAIKWAD', className = '' }: Props) {
  const displayText = text.toUpperCase();

  return (
    <div className={`retro-title ${className}`} aria-label={displayText}>
      <svg
        className="retro-title__svg"
        viewBox="0 0 1040 130"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-hidden="true"
      >
        <defs>
          {/* Reference Palette Gradient: Burnt Orange to Golden Yellow */}
          <linearGradient id="retroOneLineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#C44E18" />
            <stop offset="28%" stopColor="#D56A25" />
            <stop offset="62%" stopColor="#DB8324" />
            <stop offset="100%" stopColor="#E5A823" />
          </linearGradient>

          {/* Fine horizontal print stripes texture */}
          <pattern id="retroPrintStripes" patternUnits="userSpaceOnUse" width="10" height="4">
            <rect width="10" height="1.6" fill="rgba(24, 63, 104, 0.22)" />
            <rect y="1.6" width="10" height="2.4" fill="transparent" />
          </pattern>

          {/* Subtle noise/distress filter */}
          <filter id="retroDistressFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" result="noise" />
            <feColorMatrix type="saturate" values="0" in="noise" result="grayNoise" />
            <feBlend in="SourceGraphic" in2="grayNoise" mode="multiply" result="blended" />
          </filter>
        </defs>

        {/* ── 1. Layered 3D Navy Shadow & Extrusion ──────────────── */}
        <text className="retro-title__shadow-deep" x="50%" y="67" dx="5" dy="6">
          {displayText}
        </text>
        <text className="retro-title__shadow" x="50%" y="67" dx="3" dy="4">
          {displayText}
        </text>

        {/* ── 2. Dark Navy Letter Contour ────────────────────────── */}
        <text className="retro-title__outline" x="50%" y="67">
          {displayText}
        </text>

        {/* ── 3. Burnt Orange to Golden Fill ─────────────────────── */}
        <text className="retro-title__fill" x="50%" y="67">
          {displayText}
        </text>

        {/* ── 4. Horizontal Print Texture Overlay ────────────────── */}
        <text className="retro-title__texture" x="50%" y="67">
          {displayText}
        </text>

        {/* ── 5. Broken Pixel Fragments (Asymmetric & Sparse) ───── */}
        <g className="retro-title__pixels" shapeRendering="crispEdges">
          {/* Left / HARDIK top breakaways */}
          <rect x="42" y="14" width="7" height="7" fill="#D56A25" opacity="0.9" />
          <rect x="54" y="9" width="5" height="5" fill="#E5A823" opacity="0.85" />
          <rect x="115" y="12" width="6" height="6" fill="#183F68" opacity="0.8" />
          <rect x="175" y="15" width="5" height="5" fill="#8C7D68" opacity="0.65" />

          {/* Left / HARDIK falling bottom crumbs */}
          <rect x="36" y="105" width="7" height="7" fill="#183F68" opacity="0.85" />
          <rect x="48" y="114" width="5" height="5" fill="#D56A25" opacity="0.8" />
          <rect x="210" y="108" width="6" height="6" fill="#E5A823" opacity="0.75" />
          <rect x="222" y="115" width="4" height="4" fill="#183F68" opacity="0.7" />

          {/* Center gap fragments (between HARDIK and GAIKWAD) */}
          <rect x="478" y="16" width="5" height="5" fill="#E5A823" opacity="0.8" />
          <rect x="488" y="10" width="6" height="6" fill="#D56A25" opacity="0.85" />
          <rect x="470" y="106" width="7" height="7" fill="#183F68" opacity="0.8" />
          <rect x="482" y="114" width="5" height="5" fill="#8C7D68" opacity="0.7" />

          {/* Right / GAIKWAD top breakaway */}
          <rect x="710" y="12" width="6" height="6" fill="#183F68" opacity="0.85" />
          <rect x="825" y="15" width="6" height="6" fill="#D56A25" opacity="0.8" />
          <rect x="837" y="9" width="5" height="5" fill="#E5A823" opacity="0.85" />
          <rect x="965" y="14" width="6" height="6" fill="#183F68" opacity="0.8" />

          {/* Right / GAIKWAD bottom falling pixels */}
          <rect x="670" y="108" width="6" height="6" fill="#D56A25" opacity="0.8" />
          <rect x="682" y="115" width="5" height="5" fill="#183F68" opacity="0.75" />
          <rect x="915" y="106" width="8" height="8" fill="#183F68" opacity="0.9" />
          <rect x="928" y="114" width="5" height="5" fill="#D56A25" opacity="0.8" />
          <rect x="975" y="62" width="6" height="6" fill="#E5A823" opacity="0.8" />
          <rect x="986" y="70" width="4" height="4" fill="#8C7D68" opacity="0.6" />
        </g>
      </svg>
    </div>
  );
}
