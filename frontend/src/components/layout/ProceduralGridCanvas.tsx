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

    // Off-screen noise texture pattern to give tactile paper grain
    let noisePattern: CanvasPattern | null = null;
    const createNoisePattern = () => {
      const noiseCanvas = document.createElement('canvas');
      const size = 256;
      noiseCanvas.width = size;
      noiseCanvas.height = size;
      const nCtx = noiseCanvas.getContext('2d');
      if (!nCtx) return null;

      const imgData = nCtx.createImageData(size, size);
      const data = imgData.data;

      // Seed subtle paper fiber / grain noise
      for (let i = 0; i < data.length; i += 4) {
        // Subtle warm luminance fluctuations (+/- 6)
        const grain = (Math.random() - 0.5) * 12;
        // Warm paper base tint ~ #EFE9D7: R=239, G=233, B=215
        data[i] = Math.min(255, Math.max(0, 239 + grain));
        data[i + 1] = Math.min(255, Math.max(0, 233 + grain));
        data[i + 2] = Math.min(255, Math.max(0, 215 + grain * 0.8));
        data[i + 3] = 255;
      }
      nCtx.putImageData(imgData, 0, 0);
      return ctx.createPattern(noiseCanvas, 'repeat');
    };

    noisePattern = createNoisePattern();

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

    // Render loop
    const render = () => {
      if (needsRender) {
        needsRender = false;

        const width = window.innerWidth;
        const height = window.innerHeight;

        // 1. Draw base warm paper background with grain texture
        if (noisePattern) {
          ctx.fillStyle = noisePattern;
          ctx.fillRect(0, 0, width, height);
        } else {
          ctx.fillStyle = '#EFE9D7';
          ctx.fillRect(0, 0, width, height);
        }

        // 2. Calculate subtle scroll parallax offset
        // Parallax factor (0.95 means paper moves almost exactly with content, with a 5% physical drift)
        const parallaxFactor = 0.95;
        const totalOffsetY = (lastScrollY * parallaxFactor);
        const startY = - (totalOffsetY % cellSize);
        const startX = 0;

        // Determine the absolute vertical cell index for major 5-cell grid lines
        const firstRowIndex = Math.floor(totalOffsetY / cellSize);

        // 3. Draw grid lines
        ctx.save();
        ctx.lineWidth = 1;

        // Vertical lines
        for (let x = startX; x <= width; x += cellSize) {
          const colIndex = Math.round(x / cellSize);
          const isMajor = colIndex % 5 === 0;

          ctx.beginPath();
          ctx.strokeStyle = isMajor ? 'rgba(165, 155, 135, 0.65)' : 'rgba(185, 178, 160, 0.42)';
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
            ctx.strokeStyle = isMajor ? 'rgba(165, 155, 135, 0.65)' : 'rgba(185, 178, 160, 0.42)';
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
