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

  const viewBoxHeight = isMultiLine ? 240 : 160;

  return (
    <div className={`retro-title ${className}`} aria-label={text}>
      <svg
        className="retro-title__svg"
        viewBox={`0 0 800 ${viewBoxHeight}`}
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-hidden="true"
      >
        <defs>
          {/* Orange-to-golden gradient fill */}
          <linearGradient id="retroGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#D5A62D" />
            <stop offset="40%" stopColor="#D56A25" />
            <stop offset="100%" stopColor="#C05A1E" />
          </linearGradient>

          {/* Horizontal line texture pattern */}
          <pattern id="retroLines" patternUnits="userSpaceOnUse" width="4" height="4">
            <rect width="4" height="4" fill="transparent" />
            <line x1="0" y1="2" x2="4" y2="2" stroke="rgba(0,0,0,0.14)" strokeWidth="1" />
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
            <g transform="translate(0, 15)">
              <text className="retro-title__shadow" x="50%" y="36%" textAnchor="middle" dominantBaseline="central" dx="5" dy="5">
                {line1}
              </text>
              <text className="retro-title__outline" x="50%" y="36%" textAnchor="middle" dominantBaseline="central">
                {line1}
              </text>
              <text className="retro-title__fill" x="50%" y="36%" textAnchor="middle" dominantBaseline="central">
                {line1}
              </text>
              <text className="retro-title__texture" x="50%" y="36%" textAnchor="middle" dominantBaseline="central">
                {line1}
              </text>
            </g>

            {/* Line 2: GAIKWAD */}
            <g transform="translate(0, 15)">
              <text className="retro-title__shadow" x="50%" y="82%" textAnchor="middle" dominantBaseline="central" dx="5" dy="5">
                {line2}
              </text>
              <text className="retro-title__outline" x="50%" y="82%" textAnchor="middle" dominantBaseline="central">
                {line2}
              </text>
              <text className="retro-title__fill" x="50%" y="82%" textAnchor="middle" dominantBaseline="central">
                {line2}
              </text>
              <text className="retro-title__texture" x="50%" y="82%" textAnchor="middle" dominantBaseline="central">
                {line2}
              </text>
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
