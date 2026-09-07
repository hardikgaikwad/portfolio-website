/* ═══════════════════════════════════════════════════════════
   RetroTitle.tsx — Wide Horizontal Wordmark "HARDIK GAIKWAD"
   With organic broken pixel fragments & localized mouse physics
   ═══════════════════════════════════════════════════════════ */

import { useEffect, useRef } from 'react';
import './RetroTitle.css';

interface Props {
  text?: string;
  className?: string;
}

interface PixelConfig {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  baseOpacity: number;
  radius: number;   // personal influence radius in SVG units
  maxShift: number; // max displacement in SVG units
}

const PIXEL_FRAGMENTS: PixelConfig[] = [
  // ── HARDIK / Left Top ──────────────────────────────────────
  { id: 'p1', x: 38, y: 14, w: 14, h: 8, color: '#D56A25', baseOpacity: 0.9, radius: 70, maxShift: 10 },
  { id: 'p2', x: 56, y: 8, w: 4, h: 4, color: '#E5A823', baseOpacity: 0.85, radius: 50, maxShift: 6 },
  { id: 'p3', x: 114, y: 11, w: 7, h: 7, color: '#183F68', baseOpacity: 0.8, radius: 55, maxShift: 7 },
  { id: 'p4', x: 172, y: 15, w: 3, h: 3, color: '#8C7D68', baseOpacity: 0.65, radius: 45, maxShift: 5 },
  { id: 'p5', x: 236, y: 12, w: 6, h: 11, color: '#D56A25', baseOpacity: 0.85, radius: 60, maxShift: 8 },

  // ── HARDIK / Left Bottom Falling ───────────────────────────
  { id: 'p6', x: 32, y: 102, w: 10, h: 10, color: '#183F68', baseOpacity: 0.85, radius: 72, maxShift: 11 },
  { id: 'p7', x: 46, y: 116, w: 4, h: 4, color: '#D56A25', baseOpacity: 0.75, radius: 45, maxShift: 6 },
  { id: 'p8', x: 138, y: 110, w: 8, h: 5, color: '#8C7D68', baseOpacity: 0.7, radius: 50, maxShift: 6 },
  { id: 'p9', x: 212, y: 106, w: 13, h: 7, color: '#E5A823', baseOpacity: 0.8, radius: 65, maxShift: 9 },
  { id: 'p10', x: 230, y: 116, w: 5, h: 5, color: '#183F68', baseOpacity: 0.75, radius: 50, maxShift: 6 },

  // ── CENTER GAP (Between HARDIK and GAIKWAD) ────────────────
  { id: 'p11', x: 472, y: 15, w: 5, h: 5, color: '#E5A823', baseOpacity: 0.85, radius: 50, maxShift: 7 },
  { id: 'p12', x: 484, y: 8, w: 16, h: 9, color: '#D56A25', baseOpacity: 0.9, radius: 75, maxShift: 12 },
  { id: 'p13', x: 466, y: 104, w: 8, h: 8, color: '#183F68', baseOpacity: 0.85, radius: 60, maxShift: 8 },
  { id: 'p14', x: 480, y: 116, w: 4, h: 4, color: '#8C7D68', baseOpacity: 0.65, radius: 45, maxShift: 5 },

  // ── GAIKWAD / Right Top ────────────────────────────────────
  { id: 'p15', x: 708, y: 11, w: 7, h: 7, color: '#183F68', baseOpacity: 0.85, radius: 55, maxShift: 7 },
  { id: 'p16', x: 775, y: 14, w: 3, h: 3, color: '#8C7D68', baseOpacity: 0.6, radius: 40, maxShift: 4 },
  { id: 'p17', x: 820, y: 13, w: 9, h: 5, color: '#D56A25', baseOpacity: 0.85, radius: 60, maxShift: 8 },
  { id: 'p18', x: 834, y: 7, w: 5, h: 5, color: '#E5A823', baseOpacity: 0.8, radius: 50, maxShift: 6 },
  { id: 'p19', x: 955, y: 12, w: 11, h: 11, color: '#183F68', baseOpacity: 0.9, radius: 70, maxShift: 10 },

  // ── GAIKWAD / Right Bottom & Edge ──────────────────────────
  { id: 'p20', x: 665, y: 106, w: 6, h: 10, color: '#D56A25', baseOpacity: 0.8, radius: 55, maxShift: 7 },
  { id: 'p21', x: 678, y: 116, w: 4, h: 4, color: '#183F68', baseOpacity: 0.7, radius: 45, maxShift: 5 },
  { id: 'p22', x: 910, y: 104, w: 14, h: 7, color: '#183F68', baseOpacity: 0.9, radius: 72, maxShift: 11 },
  { id: 'p23', x: 928, y: 114, w: 6, h: 6, color: '#D56A25', baseOpacity: 0.85, radius: 55, maxShift: 7 },
  { id: 'p24', x: 980, y: 58, w: 8, h: 8, color: '#E5A823', baseOpacity: 0.85, radius: 60, maxShift: 8 },
  { id: 'p25', x: 992, y: 68, w: 4, h: 4, color: '#8C7D68', baseOpacity: 0.65, radius: 45, maxShift: 5 },
];

export default function RetroTitle({ text = 'HARDIK GAIKWAD', className = '' }: Props) {
  const displayText = text.toUpperCase();
  const svgRef = useRef<SVGSVGElement | null>(null);
  const rectRefs = useRef<(SVGRectElement | null)[]>([]);

  // Real-time mouse coordinate inside SVG coordinate space
  const mousePos = useRef<{ x: number; y: number } | null>(null);
  const currentDisplacements = useRef<{ dx: number; dy: number }[]>(
    PIXEL_FRAGMENTS.map(() => ({ dx: 0, dy: 0 }))
  );

  useEffect(() => {
    let animId: number;

    const tick = () => {
      const svg = svgRef.current;
      const mp = mousePos.current;

      PIXEL_FRAGMENTS.forEach((p, i) => {
        let targetDx = 0;
        let targetDy = 0;

        if (mp && svg) {
          const centerX = p.x + p.w / 2;
          const centerY = p.y + p.h / 2;
          const diffX = centerX - mp.x;
          const diffY = centerY - mp.y;
          const dist = Math.sqrt(diffX * diffX + diffY * diffY);

          // Localized influence radius check
          if (dist < p.radius && dist > 0.1) {
            // Smooth quadratic falloff: strong near cursor, zero at edge of radius
            const normDist = dist / p.radius;
            const influence = Math.pow(1 - normDist, 2);
            const shift = p.maxShift * influence;

            targetDx = (diffX / dist) * shift;
            targetDy = (diffY / dist) * shift;
          }
        }

        // Smooth spring lerp back to home
        const cur = currentDisplacements.current[i];
        cur.dx += (targetDx - cur.dx) * 0.18;
        cur.dy += (targetDy - cur.dy) * 0.18;

        // Apply transform directly to rect element for max performance
        const rectEl = rectRefs.current[i];
        if (rectEl) {
          if (Math.abs(cur.dx) > 0.05 || Math.abs(cur.dy) > 0.05) {
            rectEl.setAttribute('transform', `translate(${cur.dx.toFixed(2)}, ${cur.dy.toFixed(2)})`);
          } else {
            rectEl.removeAttribute('transform');
          }
        }
      });

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;

    // Convert screen coordinates to SVG viewBox coordinates (1040 x 130)
    const svgX = ((e.clientX - rect.left) / rect.width) * 1040;
    const svgY = ((e.clientY - rect.top) / rect.height) * 130;
    mousePos.current = { x: svgX, y: svgY };
  };

  const handleMouseLeave = () => {
    mousePos.current = null;
  };

  return (
    <div className={`retro-title ${className}`} aria-label={displayText}>
      <svg
        ref={svgRef}
        className="retro-title__svg"
        viewBox="0 0 1040 130"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-hidden="true"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
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

        {/* ── 5. Broken Pixel Fragments (Organic & Localized Physics) */}
        <g className="retro-title__pixels" shapeRendering="crispEdges">
          {PIXEL_FRAGMENTS.map((p, index) => (
            <rect
              key={p.id}
              ref={(el) => {
                rectRefs.current[index] = el;
              }}
              x={p.x}
              y={p.y}
              width={p.w}
              height={p.h}
              fill={p.color}
              opacity={p.baseOpacity}
              className="retro-title__pixel-frag"
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
