/* ═══════════════════════════════════════════════════════════
   RetroTitle — SVG-based display typography
   Recreates the "LECTURE HALL" retro block lettering style
   ═══════════════════════════════════════════════════════════ */

import './RetroTitle.css';

interface Props {
  text: string;
  className?: string;
}

export default function RetroTitle({ text, className = '' }: Props) {
  const words = text.trim().split(/\s+/);
  const isMultiLine = words.length >= 2;
  const line1 = isMultiLine ? words[0].toUpperCase() : text.toUpperCase();
  const line2 = isMultiLine ? words.slice(1).join(' ').toUpperCase() : '';

  const viewBoxHeight = isMultiLine ? 270 : 160;

  return (
    <div className={`retro-title ${className}`} aria-label={text}>
      <svg
        className="retro-title__svg"
        viewBox={`0 0 860 ${viewBoxHeight}`}
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-hidden="true"
      >
        <defs>
          {/* Orange-to-golden gradient fill for Line 1 */}
          <linearGradient id="retroGradient1" x1="0%" y1="25" x2="0%" y2="125" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#F7C948" />
            <stop offset="30%" stopColor="#E58434" />
            <stop offset="75%" stopColor="#D0611E" />
            <stop offset="100%" stopColor="#B84E14" />
          </linearGradient>

          {/* Orange-to-golden gradient fill for Line 2 */}
          <linearGradient id="retroGradient2" x1="0%" y1="145" x2="0%" y2="245" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#F7C948" />
            <stop offset="30%" stopColor="#E58434" />
            <stop offset="75%" stopColor="#D0611E" />
            <stop offset="100%" stopColor="#B84E14" />
          </linearGradient>

          {/* General fallback gradient */}
          <linearGradient id="retroGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F7C948" />
            <stop offset="30%" stopColor="#E58434" />
            <stop offset="75%" stopColor="#D0611E" />
            <stop offset="100%" stopColor="#B84E14" />
          </linearGradient>

          {/* Horizontal line texture pattern */}
          <pattern id="retroLines" patternUnits="userSpaceOnUse" width="4" height="4">
            <rect width="4" height="4" fill="transparent" />
            <line x1="0" y1="2" x2="4" y2="2" stroke="rgba(14, 42, 71, 0.16)" strokeWidth="1" />
          </pattern>

          {/* Distressed noise filter */}
          <filter id="retroNoise">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" result="noise" />
            <feColorMatrix type="saturate" values="0" in="noise" result="grayNoise" />
            <feBlend in="SourceGraphic" in2="grayNoise" mode="multiply" result="blended" />
          </filter>
        </defs>

        {isMultiLine ? (
          <>
            {/* Line 1: HARDIK */}
            <g>
              <text className="retro-title__shadow" x="50%" y="78" dx="4" dy="5">
                {line1}
              </text>
              <text className="retro-title__outline" x="50%" y="78">
                {line1}
              </text>
              <text className="retro-title__fill retro-title__fill--line1" x="50%" y="78">
                {line1}
              </text>
              <text className="retro-title__texture" x="50%" y="78">
                {line1}
              </text>
            </g>

            {/* Line 2: GAIKWAD */}
            <g>
              <text className="retro-title__shadow" x="50%" y="196" dx="4" dy="5">
                {line2}
              </text>
              <text className="retro-title__outline" x="50%" y="196">
                {line2}
              </text>
              <text className="retro-title__fill retro-title__fill--line2" x="50%" y="196">
                {line2}
              </text>
              <text className="retro-title__texture" x="50%" y="196">
                {line2}
              </text>
            </g>

            {/* Broken Pixel Fragments — Asymmetric, subtle digital crumbling */}
            <g className="retro-title__pixels" shapeRendering="crispEdges">
              {/* Top-Left Cluster (above H and A) */}
              <rect x="184" y="16" width="7" height="7" fill="#D56A25" opacity="0.9" />
              <rect x="195" y="12" width="5" height="5" fill="#F7C948" opacity="0.8" />
              <rect x="176" y="26" width="6" height="6" fill="#183F68" opacity="0.85" />
              <rect x="238" y="18" width="6" height="6" fill="#183F68" opacity="0.75" />
              <rect x="248" y="24" width="4" height="4" fill="#8C7D68" opacity="0.7" />

              {/* Top-Center subtle crumbs (above D) */}
              <rect x="420" y="20" width="5" height="5" fill="#F7C948" opacity="0.8" />
              <rect x="428" y="15" width="6" height="6" fill="#D56A25" opacity="0.85" />

              {/* Top-Right Stepped Breakaway (above K) */}
              <rect x="672" y="22" width="8" height="8" fill="#183F68" opacity="0.9" />
              <rect x="684" y="16" width="6" height="6" fill="#D56A25" opacity="0.85" />
              <rect x="694" y="26" width="5" height="5" fill="#F7C948" opacity="0.8" />

              {/* Inter-line Drift (between HARDIK and GAIKWAD) */}
              <rect x="282" y="134" width="6" height="6" fill="#183F68" opacity="0.7" />
              <rect x="292" y="138" width="4" height="4" fill="#D56A25" opacity="0.75" />
              <rect x="638" y="132" width="7" height="7" fill="#F7C948" opacity="0.8" />
              <rect x="648" y="136" width="5" height="5" fill="#183F68" opacity="0.7" />

              {/* Far-Left Crumbs (beside G) */}
              <rect x="96" y="188" width="6" height="6" fill="#183F68" opacity="0.85" />
              <rect x="105" y="182" width="5" height="5" fill="#D56A25" opacity="0.8" />
              <rect x="92" y="200" width="4" height="4" fill="#8C7D68" opacity="0.65" />

              {/* Bottom-Left Falling Pixels (below G and A) */}
              <rect x="132" y="246" width="8" height="8" fill="#183F68" opacity="0.9" />
              <rect x="144" y="252" width="6" height="6" fill="#D56A25" opacity="0.85" />
              <rect x="154" y="248" width="5" height="5" fill="#F7C948" opacity="0.75" />
              <rect x="188" y="250" width="7" height="7" fill="#183F68" opacity="0.8" />
              <rect x="198" y="256" width="4" height="4" fill="#8C7D68" opacity="0.7" />

              {/* Bottom-Center scattered bits (below K and W) */}
              <rect x="435" y="248" width="6" height="6" fill="#D56A25" opacity="0.85" />
              <rect x="444" y="254" width="5" height="5" fill="#F7C948" opacity="0.75" />
              <rect x="520" y="247" width="5" height="5" fill="#183F68" opacity="0.7" />

              {/* Far-Right Detached Pixels (beside D) */}
              <rect x="748" y="186" width="7" height="7" fill="#F7C948" opacity="0.85" />
              <rect x="758" y="192" width="5" height="5" fill="#183F68" opacity="0.8" />
              <rect x="752" y="204" width="6" height="6" fill="#D56A25" opacity="0.75" />
              <rect x="765" y="198" width="4" height="4" fill="#8C7D68" opacity="0.6" />
            </g>
          </>
        ) : (
          <>
            <text className="retro-title__shadow" x="50%" y="55%" textAnchor="middle" dominantBaseline="central" dx="5" dy="5">
              {line1}
            </text>
            <text className="retro-title__outline" x="50%" y="55%" textAnchor="middle" dominantBaseline="central">
              {line1}
            </text>
            <text className="retro-title__fill" x="50%" y="55%" textAnchor="middle" dominantBaseline="central">
              {line1}
            </text>
            <text className="retro-title__texture" x="50%" y="55%" textAnchor="middle" dominantBaseline="central">
              {line1}
            </text>
          </>
        )}
      </svg>
    </div>
  );
}
