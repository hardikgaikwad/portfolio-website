/* ═══════════════════════════════════════════════════════════
   ProceduralGridCanvas — Continuous Procedural Graph Paper
   ═══════════════════════════════════════════════════════════ */

import { useEffect, useRef } from 'react';

interface Props {
  cellSize?: number; // Size of each square cell in CSS pixels (default 24)
}

export default function ProceduralGridCanvas({ cellSize = 24 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animFrameId: number;
    let needsRender = true;
    let lastScrollY = window.scrollY;

    let isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    let currentProgress = isDark ? 1 : 0;
    let targetProgress = isDark ? 1 : 0;

    // Pre-generate both light and dark noise patterns for zero-latency crossfade
    const createNoisePattern = (forDark: boolean) => {
      const noiseCanvas = document.createElement('canvas');
      const size = 256;
      noiseCanvas.width = size;
      noiseCanvas.height = size;
      const nCtx = noiseCanvas.getContext('2d');
      if (!nCtx) return null;

      const imgData = nCtx.createImageData(size, size);
      const data = imgData.data;

      // Seed paper grain noise
      for (let i = 0; i < data.length; i += 4) {
        if (forDark) {
          // Dark charcoal base tint ~ #111417: R=17, G=20, B=23 with subtle grain
          const grain = (Math.random() - 0.5) * 8;
          data[i] = Math.min(255, Math.max(0, 17 + grain));
          data[i + 1] = Math.min(255, Math.max(0, 20 + grain));
          data[i + 2] = Math.min(255, Math.max(0, 23 + grain * 1.1));
          data[i + 3] = 255;
        } else {
          // Warm paper base tint ~ #EFE9D7: R=239, G=233, B=215
          const grain = (Math.random() - 0.5) * 12;
          data[i] = Math.min(255, Math.max(0, 239 + grain));
          data[i + 1] = Math.min(255, Math.max(0, 233 + grain));
          data[i + 2] = Math.min(255, Math.max(0, 215 + grain * 0.8));
          data[i + 3] = 255;
        }
      }
      nCtx.putImageData(imgData, 0, 0);
      return ctx.createPattern(noiseCanvas, 'repeat');
    };

    const lightNoisePattern = createNoisePattern(false);
    const darkNoisePattern = createNoisePattern(true);

    // Observe theme attribute changes on <html>
    const themeObserver = new MutationObserver(() => {
      const newIsDark = document.documentElement.getAttribute('data-theme') === 'dark';
      if (newIsDark !== isDark) {
        isDark = newIsDark;
        targetProgress = isDark ? 1 : 0;
        needsRender = true;
      }
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    // Resize handling with High-DPI support
    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      needsRender = true;
    };

    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });

    // Scroll listener using passive flag & RAF
    const handleScroll = () => {
      lastScrollY = window.scrollY;
      needsRender = true;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Render loop with smooth theme interpolation
    const render = () => {
      // Smoothly interpolate theme progress (approx. 400ms transition)
      if (Math.abs(currentProgress - targetProgress) > 0.005) {
        const step = (targetProgress - currentProgress) * 0.12;
        currentProgress += Math.abs(step) < 0.002 ? (targetProgress > currentProgress ? 0.002 : -0.002) : step;
        needsRender = true;
      } else if (currentProgress !== targetProgress) {
        currentProgress = targetProgress;
        needsRender = true;
      }

      if (needsRender) {
        needsRender = false;

        const width = window.innerWidth;
        const height = window.innerHeight;

        // 1. Draw smoothly interpolated base paper background color
        const r = Math.round(239 + (17 - 239) * currentProgress);
        const g = Math.round(233 + (20 - 233) * currentProgress);
        const b = Math.round(215 + (23 - 215) * currentProgress);
        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        ctx.fillRect(0, 0, width, height);

        // 2. Crossfade noise patterns
        if (lightNoisePattern && currentProgress < 0.99) {
          ctx.save();
          ctx.globalAlpha = 1 - currentProgress;
          ctx.fillStyle = lightNoisePattern;
          ctx.fillRect(0, 0, width, height);
          ctx.restore();
        }

        if (darkNoisePattern && currentProgress > 0.01) {
          ctx.save();
          ctx.globalAlpha = currentProgress;
          ctx.fillStyle = darkNoisePattern;
          ctx.fillRect(0, 0, width, height);
          ctx.restore();
        }

        // 3. Calculate subtle scroll parallax offset
        const parallaxFactor = 0.95;
        const totalOffsetY = (lastScrollY * parallaxFactor);
        const startY = - (totalOffsetY % cellSize);
        const startX = 0;

        // Determine the absolute vertical cell index for major 5-cell grid lines
        const firstRowIndex = Math.floor(totalOffsetY / cellSize);

        // 4. Smoothly interpolated grid line colors
        const majR = Math.round(165 + (65 - 165) * currentProgress);
        const majG = Math.round(155 + (95 - 155) * currentProgress);
        const majB = Math.round(135 + (130 - 135) * currentProgress);
        const majA = (0.65 + (0.45 - 0.65) * currentProgress).toFixed(2);
        const majorLineColor = `rgba(${majR}, ${majG}, ${majB}, ${majA})`;

        const minR = Math.round(185 + (42 - 185) * currentProgress);
        const minG = Math.round(178 + (62 - 178) * currentProgress);
        const minB = Math.round(160 + (85 - 160) * currentProgress);
        const minA = (0.42 + (0.28 - 0.42) * currentProgress).toFixed(2);
        const minorLineColor = `rgba(${minR}, ${minG}, ${minB}, ${minA})`;

        ctx.save();
        ctx.lineWidth = 1;

        // Vertical lines
        for (let x = startX; x <= width; x += cellSize) {
          const colIndex = Math.round(x / cellSize);
          const isMajor = colIndex % 5 === 0;

          ctx.beginPath();
          ctx.strokeStyle = isMajor ? majorLineColor : minorLineColor;
          ctx.moveTo(x + 0.5, 0);
          ctx.lineTo(x + 0.5, height);
          ctx.stroke();
        }

        // Horizontal lines
        let currentY = startY;
        let rowIndex = firstRowIndex;

        while (currentY <= height + cellSize) {
          if (currentY >= 0) {
            const isMajor = rowIndex % 5 === 0;

            ctx.beginPath();
            ctx.strokeStyle = isMajor ? majorLineColor : minorLineColor;
            ctx.moveTo(0, currentY + 0.5);
            ctx.lineTo(width, currentY + 0.5);
            ctx.stroke();
          }
          currentY += cellSize;
          rowIndex++;
        }

        ctx.restore();
      }

      animFrameId = requestAnimationFrame(render);
    };

    animFrameId = requestAnimationFrame(render);

    // ResizeObserver to detect document height changes (e.g. expanding projects or terminal)
    const resizeObserver = new ResizeObserver(() => {
      needsRender = true;
    });
    resizeObserver.observe(document.body);

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      themeObserver.disconnect();
      resizeObserver.disconnect();
    };
  }, [cellSize]);

  return (
    <canvas
      ref={canvasRef}
      className="procedural-grid-canvas"
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        pointerEvents: 'none',
      }}
    />
  );
}
