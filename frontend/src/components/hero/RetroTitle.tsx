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
