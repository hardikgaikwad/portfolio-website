/* ═══════════════════════════════════════════════════════════
   HeroSection — Name display + subtitle + dynamic boot sequence
   ═══════════════════════════════════════════════════════════ */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Profile } from '../../types/api';
import RetroTitle from './RetroTitle';
import './HeroSection.css';

interface Props {
  profile: Profile | null;
  loading: boolean;
}

interface BootLine {
  id: string;
  text: string;
  type: 'init' | 'ok' | 'connecting' | 'warning';
}

export default function HeroSection({ profile, loading }: Props) {
  const [bootComplete, setBootComplete] = useState(false);
  const [lines, setLines] = useState<BootLine[]>([]);
  const [isWakingServer, setIsWakingServer] = useState(false);
  const initialSequenceDone = useRef(false);

  // 1. Lock scrolling completely while booting / waiting for backend
  useEffect(() => {
    if (!bootComplete) {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      window.scrollTo(0, 0);

      const preventScrollKeys = (e: KeyboardEvent) => {
        if (['Space', 'ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End'].includes(e.code)) {
          e.preventDefault();
        }
      };
      window.addEventListener('keydown', preventScrollKeys);

      return () => {
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
        window.removeEventListener('keydown', preventScrollKeys);
      };
    } else {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    }
  }, [bootComplete]);

  // 2. Start initial boot lines immediately on mount
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    // Line 1: Immediate on mount
    setLines([
      { id: '1', text: 'INITIALIZING PORTFOLIO PROTOCOL', type: 'init' }
    ]);

    // Line 2: 350ms
    timers.push(
      setTimeout(() => {
        setLines(prev => [
          ...prev,
          { id: '2', text: '[OK] SYSTEM CORE ONLINE', type: 'ok' }
        ]);
      }, 350)
    );

    // Line 3: 700ms - Connecting with animated dots
    timers.push(
      setTimeout(() => {
        setLines(prev => [
          ...prev,
          { id: '3', text: 'CONNECTING TO ARCHIVAL SERVER', type: 'connecting' }
        ]);
        initialSequenceDone.current = true;
      }, 700)
    );

    // If server takes > 3.5s (free hosting cold start), display reassuring status line
    timers.push(
      setTimeout(() => {
        setIsWakingServer(true);
      }, 3500)
    );

    return () => timers.forEach(clearTimeout);
  }, []);

  // 3. When backend finishes responding (loading becomes false)
  useEffect(() => {
    if (loading) return;

    // Small delay so initial lines have finished displaying smoothly
    const delay = initialSequenceDone.current ? 150 : 850;
    const timers: ReturnType<typeof setTimeout>[] = [];

    timers.push(
      setTimeout(() => {
        setLines(prev => {
          const filtered = prev.filter(l => l.id !== '3');
          return [
            ...filtered,
            { id: '3-done', text: '[OK] ARCHIVAL SERVER CONNECTED', type: 'ok' },
            { id: '4', text: '[OK] ENCRYPTED PROFILE & DOSSIER LOADED', type: 'ok' },
            { id: '5', text: '[OK] PROJECT DATABASE READY', type: 'ok' },
          ];
        });
      }, delay)
    );

    // Reveal 3D title & unlock site
    timers.push(
      setTimeout(() => {
        setBootComplete(true);
      }, delay + 600)
    );

    return () => timers.forEach(clearTimeout);
  }, [loading]);

  const name = profile?.name || 'HARDIK GAIKWAD';
  const subtitle = profile?.subtitle || 'CYBERSECURITY . SOFTWARE ENGINEERING . OFFENSIVE SECURITY';

  return (
    <section className="hero" id="hero">
      {/* Boot sequence overlay with animated dots */}
      <AnimatePresence>
        {!bootComplete && (
          <motion.div
            className="hero__boot"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
          >
            <div className="hero__boot-container">
              <div className="hero__boot-header">
                <span className="hero__boot-tag">// BOOT PROTOCOL v2.4.0</span>
                <span className="hero__boot-status">INITIALIZING</span>
              </div>
              <div className="hero__boot-lines">
                {lines.map((line) => (
                  <div key={line.id} className="hero__boot-line">
                    <span className={line.type === 'ok' ? 'boot-ok' : line.type === 'connecting' ? 'boot-connecting' : 'boot-init'}>
                      {line.text}
                      {line.type === 'connecting' && <span className="boot-dots" />}
                    </span>
                  </div>
                ))}
                {isWakingServer && loading && (
                  <div className="hero__boot-line hero__boot-line--waking">
                    <span className="boot-warn">
                      &gt;&gt; WAKING ARCHIVAL SERVER (COLD START IN PROGRESS)<span className="boot-dots" />
                    </span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
