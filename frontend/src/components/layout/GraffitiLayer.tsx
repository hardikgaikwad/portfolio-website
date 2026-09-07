/* ═══════════════════════════════════════════════════════════
   GraffitiLayer.tsx — Physical Hand-Sprayed Graffiti & Doodles
   Rendered in the continuous document space down the graph paper
   Supports Multi-Style Catalog: Stencil, Bubbly, Incomplete, Doodles
   ═══════════════════════════════════════════════════════════ */

import React from 'react';
import { GRAFFITI_ITEMS, type DoodleType, type GraffitiItem } from '../../data/graffitiData';
import './GraffitiLayer.css';

function renderDoodleSVG(type: DoodleType) {
  switch (type) {
    case 'eye':
      return (
        <svg className="graffiti-doodle-svg" width="60" height="50" viewBox="0 0 60 50">
          <path
            d="M 6 25 Q 30 7 54 25 Q 30 43 6 25 Z"
            fill="none"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="30" cy="25" r="7.5" />
          <circle cx="28" cy="23" r="2.2" fill="#FAF7F0" />
          <line x1="20" y1="8" x2="17" y2="4" strokeWidth="2" strokeLinecap="round" />
          <line x1="30" y1="6" x2="30" y2="2" strokeWidth="2" strokeLinecap="round" />
          <line x1="40" y1="8" x2="43" y2="4" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'crossed-eye':
      return (
        <svg className="graffiti-doodle-svg" width="58" height="48" viewBox="0 0 58 48">
          <path
            d="M 5 24 Q 29 6 53 24 Q 29 42 5 24 Z"
            fill="none"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* X eye pupil */}
          <line x1="23" y1="18" x2="35" y2="30" strokeWidth="3" strokeLinecap="round" />
          <line x1="35" y1="18" x2="23" y2="30" strokeWidth="3" strokeLinecap="round" />
          <line x1="18" y1="8" x2="15" y2="3" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="29" y1="6" x2="29" y2="2" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="40" y1="8" x2="43" y2="3" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      );

    case 'explosion':
      return (
        <svg className="graffiti-doodle-svg" width="56" height="54" viewBox="0 0 52 50">
          <path
            d="M 26 4 L 32 17 L 46 13 L 37 25 L 48 35 L 34 37 L 32 49 L 23 39 L 11 47 L 14 33 L 4 25 L 16 18 Z"
            strokeWidth="2.8"
            strokeLinejoin="round"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="26" cy="25" r="3" />
        </svg>
      );

    case 'explosion-small':
      return (
        <svg className="graffiti-doodle-svg" width="40" height="40" viewBox="0 0 40 40">
          <path
            d="M 20 3 L 24 13 L 35 9 L 28 19 L 37 27 L 25 27 L 23 37 L 17 29 L 5 33 L 11 22 L 3 16 L 14 14 Z"
            strokeWidth="2.4"
            strokeLinejoin="round"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="20" cy="20" r="2.5" />
        </svg>
      );

    case 'lightning':
      return (
        <svg className="graffiti-doodle-svg" width="40" height="52" viewBox="0 0 40 52">
          <path
            d="M 23 3 L 9 27 L 19 27 L 13 49 L 33 21 L 22 21 Z"
            strokeWidth="2.8"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'crosshair':
      return (
        <svg className="graffiti-doodle-svg" width="50" height="50" viewBox="0 0 50 50">
          <circle cx="25" cy="25" r="16" fill="none" strokeWidth="2.8" />
          <line x1="25" y1="4" x2="25" y2="46" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="4" y1="25" x2="46" y2="25" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="25" cy="25" r="3" />
        </svg>
      );

    case 'lock':
      return (
        <svg className="graffiti-doodle-svg" width="50" height="50" viewBox="0 0 50 50">
          <path
            d="M 17 21 V 13 A 8 8 0 0 1 33 13 V 21"
            fill="none"
            strokeWidth="3.6"
            strokeLinecap="round"
          />
          <rect x="12" y="21" width="26" height="22" rx="3" strokeWidth="2.8" />
          <circle cx="25" cy="29" r="3.2" fill="#FAF7F0" />
          <rect x="23.5" y="30" width="3" height="6" fill="#FAF7F0" />
        </svg>
      );

    case 'bug':
      return (
        <svg className="graffiti-doodle-svg" width="50" height="50" viewBox="0 0 50 50">
          <ellipse cx="25" cy="27" rx="9" ry="12" strokeWidth="2.6" fill="none" />
          <circle cx="25" cy="11" r="5" strokeWidth="2.5" />
          <path d="M 23 7 Q 17 2 11 4" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M 27 7 Q 33 2 39 4" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M 16 21 L 6 16 M 16 27 L 5 27 M 16 33 L 7 38" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M 34 21 L 44 16 M 34 27 L 45 27 M 34 33 L 43 38" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      );

    case 'arrow-up-right':
      return (
        <svg className="graffiti-doodle-svg" width="45" height="45" viewBox="0 0 45 45">
          <path
            d="M 8 37 L 36 9 M 18 9 L 36 9 L 36 27"
            strokeWidth="3.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      );

    case 'arrow-down-left':
      return (
        <svg className="graffiti-doodle-svg" width="45" height="45" viewBox="0 0 45 45">
          <path
            d="M 37 8 L 9 36 M 27 36 L 9 36 L 9 18"
            strokeWidth="3.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      );

    case 'bubbly-arrow':
      return (
        <svg className="graffiti-doodle-svg" width="52" height="46" viewBox="0 0 52 46">
          <path
            d="M 9 38 C 10 22 24 16 38 15"
            strokeWidth="4.2"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M 28 7 C 35 11 42 13 47 15 C 42 18 36 22 29 26"
            strokeWidth="4.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          {/* Little energy halo */}
          <circle cx="10" cy="10" r="2.2" opacity="0.8" />
        </svg>
      );

    case 'terminal-prompt':
      return (
        <svg className="graffiti-doodle-svg" width="50" height="45" viewBox="0 0 50 45">
          <path
            d="M 8 10 L 22 22 L 8 34"
            strokeWidth="3.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <rect x="26" y="27" width="16" height="5" />
        </svg>
      );

    case 'network-nodes':
      return (
        <svg className="graffiti-doodle-svg" width="54" height="48" viewBox="0 0 54 48">
          <circle cx="12" cy="36" r="4.5" />
          <circle cx="42" cy="36" r="4.5" />
          <circle cx="27" cy="11" r="5" />
          <line x1="12" y1="36" x2="27" y2="11" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="42" y1="36" x2="27" y2="11" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="12" y1="36" x2="42" y2="36" strokeWidth="2" strokeDasharray="3 3" />
        </svg>
      );

    case 'wifi':
      return (
        <svg className="graffiti-doodle-svg" width="48" height="44" viewBox="0 0 48 44">
          <path d="M 6 12 A 25 25 0 0 1 42 12" fill="none" strokeWidth="3.2" strokeLinecap="round" />
          <path d="M 13 19 A 17 17 0 0 1 35 19" fill="none" strokeWidth="3.2" strokeLinecap="round" />
          <path d="M 19 26 A 9 9 0 0 1 29 26" fill="none" strokeWidth="3.2" strokeLinecap="round" />
          <circle cx="24" cy="35" r="3.5" />
        </svg>
      );

    case 'broken-chain':
      return (
        <svg className="graffiti-doodle-svg" width="54" height="44" viewBox="0 0 54 44">
          <rect
            x="4"
            y="10"
            width="16"
            height="24"
            rx="8"
            fill="none"
            strokeWidth="3.4"
            transform="rotate(-25 12 22)"
          />
          <rect
            x="32"
            y="12"
            width="16"
            height="24"
            rx="8"
            fill="none"
            strokeWidth="3.4"
            transform="rotate(25 40 24)"
            strokeDasharray="26 8"
          />
        </svg>
      );

    case 'skull-doodle':
      return (
        <svg className="graffiti-doodle-svg" width="50" height="50" viewBox="0 0 50 50">
          <path
            d="M 13 22 C 13 10 37 10 37 22 C 37 28 32 30 32 37 H 18 C 18 30 13 28 13 22 Z"
            fill="none"
            strokeWidth="2.8"
            strokeLinejoin="round"
          />
          <rect x="18" y="19" width="4" height="4" />
          <rect x="28" y="19" width="4" height="4" />
          <line x1="25" y1="26" x2="25" y2="29" strokeWidth="2" strokeLinecap="round" />
          <line x1="21" y1="34" x2="21" y2="37" strokeWidth="2" strokeLinecap="round" />
          <line x1="25" y1="34" x2="25" y2="37" strokeWidth="2" strokeLinecap="round" />
          <line x1="29" y1="34" x2="29" y2="37" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'brackets':
      return (
        <svg className="graffiti-doodle-svg" width="50" height="46" viewBox="0 0 50 46">
          <path
            d="M 15 5 C 9 5 9 17 3 23 C 9 29 9 41 15 41"
            fill="none"
            strokeWidth="3.4"
            strokeLinecap="round"
          />
          <path
            d="M 35 5 C 41 5 41 17 47 23 C 41 29 41 41 35 41"
            fill="none"
            strokeWidth="3.4"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'target':
      return (
        <svg className="graffiti-doodle-svg" width="50" height="50" viewBox="0 0 50 50">
          <circle cx="25" cy="25" r="20" fill="none" strokeWidth="2.2" />
          <circle cx="25" cy="25" r="11" fill="none" strokeWidth="2.6" />
          <circle cx="25" cy="25" r="3.5" />
        </svg>
      );

    case 'sparkle':
      return (
        <svg className="graffiti-doodle-svg" width="48" height="48" viewBox="0 0 48 48">
          <path
            d="M 24 4 Q 24 24 4 24 Q 24 24 24 44 Q 24 24 44 24 Q 24 24 24 4 Z"
            strokeWidth="2.4"
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'bubbly-pwn':
      return (
        <svg className="graffiti-doodle-svg" width="80" height="38" viewBox="0 0 80 38">
          <g strokeWidth="4.2" strokeLinecap="round" strokeLinejoin="round" fill="none">
            {/* P */}
            <path d="M 8 9 L 8 30 M 8 9 C 23 7 23 20 8 20" />
            {/* W */}
            <path d="M 27 10 L 31 29 L 37 15 L 43 29 L 47 10" />
            {/* N */}
            <path d="M 56 30 L 56 9 L 71 30 L 71 9" />
          </g>
          <circle cx="13" cy="13" r="1.5" />
          <circle cx="60" cy="13" r="1.5" />
        </svg>
      );

    case 'bubbly-cloud':
      return (
        <svg className="graffiti-doodle-svg" width="56" height="42" viewBox="0 0 56 42">
          <path
            d="M 12 28 C 6 28 4 20 10 16 C 8 8 18 5 25 9 C 30 3 42 5 44 13 C 51 13 53 23 47 28 C 43 30 14 30 12 28 Z"
            strokeWidth="3.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          {/* Cloud drip drops */}
          <path d="M 21 33 L 21 38" strokeWidth="2.8" strokeLinecap="round" />
          <path d="M 35 32 L 35 37" strokeWidth="2.8" strokeLinecap="round" />
          <circle cx="16" cy="16" r="1.8" />
        </svg>
      );

    case 'quirky-smiley':
      return (
        <svg className="graffiti-doodle-svg" width="46" height="46" viewBox="0 0 46 46">
          <circle cx="23" cy="23" r="18" strokeWidth="3" strokeLinecap="round" fill="none" />
          {/* Left round eye */}
          <circle cx="16" cy="18" r="2.8" />
          {/* Right angled eye */}
          <line x1="26" y1="16" x2="32" y2="20" strokeWidth="2.8" strokeLinecap="round" />
          {/* Smirk */}
          <path d="M 14 28 Q 23 37 32 26" strokeWidth="2.8" strokeLinecap="round" fill="none" />
        </svg>
      );

    case 'dead-smiley':
      return (
        <svg className="graffiti-doodle-svg" width="46" height="46" viewBox="0 0 46 46">
          <circle cx="23" cy="23" r="18" strokeWidth="3" strokeLinecap="round" fill="none" />
          {/* Left X eye */}
          <line x1="13" y1="15" x2="19" y2="21" strokeWidth="2.6" strokeLinecap="round" />
          <line x1="19" y1="15" x2="13" y2="21" strokeWidth="2.6" strokeLinecap="round" />
          {/* Right X eye */}
          <line x1="27" y1="15" x2="33" y2="21" strokeWidth="2.6" strokeLinecap="round" />
          <line x1="33" y1="15" x2="27" y2="21" strokeWidth="2.6" strokeLinecap="round" />
          {/* Stitched mouth */}
          <path d="M 14 30 Q 23 27 32 30" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <line x1="19" y1="28" x2="19" y2="32" strokeWidth="2" strokeLinecap="round" />
          <line x1="27" y1="28" x2="27" y2="32" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'question-mark':
      return (
        <svg className="graffiti-doodle-svg" width="34" height="46" viewBox="0 0 34 46">
          <path
            d="M 8 13 C 8 4 26 4 26 14 C 26 21 17 21 17 28"
            strokeWidth="3.6"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="17" cy="37" r="3.2" />
        </svg>
      );

    case 'exclamation-mark':
      return (
        <svg className="graffiti-doodle-svg" width="28" height="46" viewBox="0 0 28 46">
          <path d="M 14 6 L 14 27" strokeWidth="4.2" strokeLinecap="round" />
          <circle cx="14" cy="37" r="3.4" />
        </svg>
      );

    case 'rough-heart':
      return (
        <svg className="graffiti-doodle-svg" width="44" height="42" viewBox="0 0 44 42">
          <path
            d="M 22 36 C 6 24 2 12 12 6 C 18 2 21 8 22 12 C 23 8 26 2 32 6 C 42 12 38 24 22 36 Z"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      );

    case 'mini-star':
      return (
        <svg className="graffiti-doodle-svg" width="38" height="38" viewBox="0 0 38 38">
          <path
            d="M 19 4 L 23 14 L 34 14 L 25 21 L 28 32 L 19 25 L 10 32 L 13 21 L 4 14 L 15 14 Z"
            strokeWidth="2.4"
            strokeLinejoin="round"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      );

    case 'wavy-loop':
      return (
        <svg className="graffiti-doodle-svg" width="52" height="34" viewBox="0 0 52 34">
          <path
            d="M 5 24 C 12 28 16 9 26 12 C 34 14 36 28 47 20"
            strokeWidth="3.6"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      );

    default:
      return null;
  }
}

export default function GraffitiLayer() {
  return (
    <div className="graffiti-layer" aria-hidden="true">
      {/* Global SVG Spray Distortion Filter */}
      <svg width="0" height="0" style={{ position: 'absolute', pointerEvents: 'none' }}>
        <defs>
          <filter id="sprayDistort" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves="2" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.2" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      {GRAFFITI_ITEMS.map((item: GraffitiItem) => {
        const sideClass = item.side === 'left' ? 'graffiti-item--left' : 'graffiti-item--right';
        const colorClass = `graffiti--${item.color}`;
        const sprayClass = item.sprayEffect ? 'graffiti--spray' : '';
        const mobileClass = item.hideOnMobile ? 'graffiti-item--mobile-hide' : '';
        const variantClass = item.styleVariant ? `graffiti-item--${item.styleVariant}` : '';

        const style: React.CSSProperties = {
          top: `${item.topPercent}%`,
          opacity: item.opacity,
          transform: `rotate(${item.rotationDeg}deg) scale(${item.scale})`,
          [item.side === 'left' ? 'left' : 'right']: `${item.marginOffsetPx}px`,
        };

        return (
          <div
            key={item.id}
            className={`graffiti-item ${sideClass} ${colorClass} ${sprayClass} ${variantClass} ${mobileClass}`}
            style={style}
          >
            {/* Combo or Doodle */}
            {item.doodle && renderDoodleSVG(item.doodle)}

            {/* Word Content with Variant Stencil / Bubbly / Incomplete */}
            {item.text && (
              <span className={`graffiti-word ${item.styleVariant ? `graffiti-word--${item.styleVariant}` : ''}`}>
                {item.text}
              </span>
            )}

            {/* Subtext Stencil */}
            {item.subtext && (
              <span className="graffiti-subtext">
                {item.subtext}
              </span>
            )}

            {/* Overspray Splatter Particles */}
            {item.oversprayDots && item.oversprayDots.length > 0 && (
              <svg
                width="140"
                height="100"
                viewBox="-70 -50 140 100"
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  pointerEvents: 'none',
                  overflow: 'visible',
                }}
              >
                {item.oversprayDots.map((dot, index) => (
                  <circle
                    key={index}
                    cx={dot.dx}
                    cy={dot.dy}
                    r={dot.r}
                    opacity={dot.opacity}
                    className="graffiti-overspray-particle"
                  />
                ))}
              </svg>
            )}
          </div>
        );
      })}
    </div>
  );
}
