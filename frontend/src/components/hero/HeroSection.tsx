/* ═══════════════════════════════════════════════════════════
   HeroSection — Name display + subtitle + boot sequence
   ═══════════════════════════════════════════════════════════ */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { Profile } from '../../types/api';
import RetroTitle from './RetroTitle';
import './HeroSection.css';

interface Props {
  profile: Profile | null;
  loading: boolean;
}

const BOOT_LINES = [
  { text: 'INITIALIZING PORTFOLIO...', delay: 0 },
  { text: '[OK] SYSTEM ONLINE', delay: 400 },
  { text: '[OK] PROFILE LOADED', delay: 700 },
  { text: '[OK] PROJECT DATABASE CONNECTED', delay: 1000 },
  { text: '[OK] TERMINAL READY', delay: 1300 },
];

export default function HeroSection({ profile, loading }: Props) {
  const [bootComplete, setBootComplete] = useState(false);
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    if (loading) return;

    const timers: ReturnType<typeof setTimeout>[] = [];
    BOOT_LINES.forEach((line, i) => {
      timers.push(
        setTimeout(() => setVisibleLines(i + 1), line.delay)
      );
    });

    timers.push(
      setTimeout(() => setBootComplete(true), 1800)
    );

    return () => timers.forEach(clearTimeout);
  }, [loading]);

  const name = profile?.name || 'HARDIK GAIKWAD';
  const subtitle = profile?.subtitle || 'CYBERSECURITY . SOFTWARE ENGINEERING . OFFENSIVE SECURITY';

  return (
    <section className="hero" id="hero">
      {/* Boot sequence overlay */}
      {!bootComplete && (
        <motion.div
          className="hero__boot"
          initial={{ opacity: 1 }}
          animate={bootComplete ? { opacity: 0 } : { opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="hero__boot-lines">
            {BOOT_LINES.slice(0, visibleLines).map((line, i) => (
              <div key={i} className="hero__boot-line">
                <span className={line.text.startsWith('[OK]') ? 'boot-ok' : 'boot-init'}>
                  {line.text}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Main hero content */}
      <motion.div
        className="hero__content"
        initial={{ opacity: 0, y: 30 }}
        animate={bootComplete ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <div className="hero__label">
          <span className="hero__label-text">// PORTFOLIO TERMINAL v1.0</span>
        </div>

        <RetroTitle text={name} />

        <motion.div
          className="hero__subtitle"
          initial={{ opacity: 0 }}
          animate={bootComplete ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <span className="hero__subtitle-text">{subtitle}</span>
        </motion.div>

        <motion.div
          className="hero__meta"
          initial={{ opacity: 0 }}
          animate={bootComplete ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <span className="hero__meta-item">SESSION: visitor</span>
          <span className="hero__meta-sep">|</span>
          <span className="hero__meta-item">STATUS: ONLINE</span>
          <span className="hero__meta-sep">|</span>
          <span className="hero__meta-item">ACCESS: READ-ONLY</span>
        </motion.div>
      </motion.div>
    </section>
  );
}
