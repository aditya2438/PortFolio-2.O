import React, { useEffect, useRef } from 'react';

interface WaterRipple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  speed: number;
  color: string;
}

type MoodKey = 'aurora' | 'solar' | 'emerald' | 'amethyst';

interface MoodPalette {
  crest: string;
  crestSecondary: string;
  waterStops: [string, string, string];
  deepCaustic: string;
  spotlight: string;
}

const MOOD_PALETTES: Record<MoodKey, MoodPalette> = {
  aurora: {
    crest: 'rgba(125, 211, 252, 0.36)',
    crestSecondary: 'rgba(56, 189, 248, 0.22)',
    waterStops: ['rgba(14, 165, 233, 0.16)', 'rgba(56, 189, 248, 0.10)', 'rgba(99, 102, 241, 0.08)'],
    deepCaustic: 'rgba(34, 211, 238, 0.09)',
    spotlight: 'rgba(125, 211, 252, 0.13)',
  },
  solar: {
    crest: 'rgba(253, 186, 116, 0.36)',
    crestSecondary: 'rgba(251, 146, 60, 0.22)',
    waterStops: ['rgba(245, 158, 11, 0.16)', 'rgba(251, 113, 133, 0.10)', 'rgba(217, 119, 6, 0.08)'],
    deepCaustic: 'rgba(251, 191, 36, 0.09)',
    spotlight: 'rgba(253, 186, 116, 0.13)',
  },
  emerald: {
    crest: 'rgba(110, 231, 183, 0.36)',
    crestSecondary: 'rgba(45, 212, 191, 0.22)',
    waterStops: ['rgba(16, 185, 129, 0.16)', 'rgba(20, 184, 166, 0.11)', 'rgba(6, 182, 212, 0.08)'],
    deepCaustic: 'rgba(52, 211, 153, 0.09)',
    spotlight: 'rgba(110, 231, 183, 0.13)',
  },
  amethyst: {
    crest: 'rgba(216, 180, 254, 0.36)',
    crestSecondary: 'rgba(192, 132, 252, 0.22)',
    waterStops: ['rgba(168, 85, 247, 0.16)', 'rgba(236, 72, 153, 0.10)', 'rgba(99, 102, 241, 0.08)'],
    deepCaustic: 'rgba(192, 132, 252, 0.09)',
    spotlight: 'rgba(216, 180, 254, 0.13)',
  },
};

export const AmbientCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarsePointer = window.matchMedia('(pointer: coarse)').matches;

    const pointer = {
      x: -9999,
      y: -9999,
      smoothX: -9999,
      smoothY: -9999,
      lastRippleX: -9999,
      lastRippleY: -9999,
    };

    const ripples: WaterRipple[] = [];
    let rafId = 0;
    let lastTs = 0;
    let t = 0;

    const getMood = (): MoodKey => {
      const m = document.documentElement.dataset.mood as MoodKey | undefined;
      return m && m in MOOD_PALETTES ? m : 'aurora';
    };

    let palette = MOOD_PALETTES[getMood()];

    // Soft refractive light lens under cursor
    const lensRadius = 240;
    const lensCanvas = document.createElement('canvas');
    lensCanvas.width = lensRadius * 2;
    lensCanvas.height = lensRadius * 2;
    const lensCtx = lensCanvas.getContext('2d');

    const rebuildLens = () => {
      if (!lensCtx) return;
      lensCtx.clearRect(0, 0, lensCanvas.width, lensCanvas.height);
      const grad = lensCtx.createRadialGradient(
        lensRadius,
        lensRadius,
        0,
        lensRadius,
        lensRadius,
        lensRadius,
      );
      grad.addColorStop(0, palette.spotlight);
      grad.addColorStop(0.45, palette.deepCaustic);
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      lensCtx.fillStyle = grad;
      lensCtx.fillRect(0, 0, lensCanvas.width, lensCanvas.height);
    };

    let waveGradients: CanvasGradient[] = [];
    let causticGlow: CanvasGradient | null = null;

    const rebuildWaterGradients = (w: number, h: number) => {
      const defs = [
        [h * 0.28, h * 0.92, palette.waterStops[0]],
        [h * 0.42, h * 1.0, palette.waterStops[1]],
        [h * 0.56, h * 1.04, palette.waterStops[2]],
        [h * 0.70, h * 1.06, palette.waterStops[0]],
      ] as const;

      waveGradients = defs.map(([yStart, yEnd, color]) => {
        const g = ctx.createLinearGradient(0, yStart, 0, yEnd);
        g.addColorStop(0, color);
        g.addColorStop(0.55, palette.deepCaustic);
        g.addColorStop(1, 'rgba(4, 7, 17, 0)');
        return g;
      });

      const rg = ctx.createRadialGradient(w * 0.52, h * 0.18, 20, w * 0.52, h * 0.28, Math.max(w, h) * 0.65);
      rg.addColorStop(0, palette.waterStops[0]);
      rg.addColorStop(0.5, palette.deepCaustic);
      rg.addColorStop(1, 'rgba(0, 0, 0, 0)');
      causticGlow = rg;
    };

    rebuildLens();

    const moodObserver = new MutationObserver(() => {
      palette = MOOD_PALETTES[getMood()];
      rebuildLens();
      rebuildWaterGradients(canvas.width, canvas.height);
    });
    moodObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-mood'],
    });

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      rebuildWaterGradients(canvas.width, canvas.height);
    };

    const spawnRipple = (x: number, y: number, strong = false) => {
      if (reduced || coarsePointer) return;
      if (ripples.length > 10) ripples.shift();
      ripples.push({
        x,
        y,
        radius: strong ? 10 : 6,
        maxRadius: strong ? 150 : 88,
        alpha: strong ? 0.42 : 0.22,
        speed: strong ? 2.4 : 1.5,
        color: palette.crest,
      });
    };

    const drawFluidWave = (
      w: number,
      h: number,
      baseY: number,
      amp: number,
      freq: number,
      speed: number,
      phaseShift: number,
      fillGrad: CanvasGradient,
      crestStroke: string,
      drawHighlight: boolean,
    ) => {
      const cols = 22;
      const stepX = w / cols;
      const pts: { x: number; y: number }[] = [];

      for (let i = 0; i <= cols; i++) {
        const x = i * stepX;
        let y =
          baseY +
          Math.sin(x * freq + t * speed + phaseShift) * amp +
          Math.sin(x * freq * 0.48 - t * speed * 0.65 + phaseShift * 1.4) * (amp * 0.52);

        // Gentle interactive water surface deflection near pointer
        if (pointer.smoothX > 0 && !coarsePointer) {
          const dx = x - pointer.smoothX;
          const dy = y - pointer.smoothY;
          const dist = Math.hypot(dx, dy);
          if (dist < 220) {
            const influence = (1 - dist / 220) * (1 - dist / 220);
            y += Math.sin(dist * 0.045 - t * 2.4) * 14 * influence;
          }
        }
        pts.push({ x, y });
      }

      // Smooth quadratic spline curve
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length - 1; i++) {
        const midX = (pts[i].x + pts[i + 1].x) * 0.5;
        const midY = (pts[i].y + pts[i + 1].y) * 0.5;
        ctx.quadraticCurveTo(pts[i].x, pts[i].y, midX, midY);
      }
      const last = pts[pts.length - 1];
      ctx.lineTo(last.x, last.y);

      if (drawHighlight) {
        ctx.strokeStyle = crestStroke;
        ctx.lineWidth = 1.25;
        ctx.stroke();
      }

      // Fill translucent water sheet downward
      ctx.lineTo(w + 20, h + 20);
      ctx.lineTo(-20, h + 20);
      ctx.closePath();
      ctx.fillStyle = fillGrad;
      ctx.fill();
    };

    const render = (now: number) => {
      rafId = 0;
      const minInterval = ripples.length > 0 ? 16 : 24;
      if (now - lastTs >= minInterval || lastTs === 0) {
        lastTs = now;
        if (!reduced) {
          t += 0.015;
        }

        if (pointer.x > 0) {
          if (pointer.smoothX < 0) {
            pointer.smoothX = pointer.x;
            pointer.smoothY = pointer.y;
          } else {
            pointer.smoothX += (pointer.x - pointer.smoothX) * 0.14;
            pointer.smoothY += (pointer.y - pointer.smoothY) * 0.14;
          }
        }

        const w = canvas.width;
        const h = canvas.height;
        ctx.clearRect(0, 0, w, h);

        // Overhead refractive liquid caustic wash
        if (causticGlow) {
          ctx.fillStyle = causticGlow;
          ctx.fillRect(0, 0, w, h);
        }

        // Soft pointer water light refraction lens
        if (pointer.smoothX > 0 && !coarsePointer) {
          ctx.drawImage(lensCanvas, pointer.smoothX - lensRadius, pointer.smoothY - lensRadius);
        }

        // 4 Layered Silky Liquid Water Currents (back to front)
        if (waveGradients.length === 4) {
          drawFluidWave(w, h, h * 0.30, 34, 0.0022, 0.85, 0.0, waveGradients[0], palette.crestSecondary, true);
          drawFluidWave(w, h, h * 0.45, 40, 0.0027, -0.72, 1.7, waveGradients[1], palette.crest, true);
          drawFluidWave(w, h, h * 0.62, 30, 0.0033, 1.05, 3.2, waveGradients[2], palette.crestSecondary, true);
          drawFluidWave(w, h, h * 0.78, 24, 0.0025, -0.60, 4.9, waveGradients[3], palette.crest, true);
        }

        // Clean Concentric Water Surface Ripples
        for (let i = ripples.length - 1; i >= 0; i--) {
          const r = ripples[i];
          r.radius += r.speed;
          const progress = r.radius / r.maxRadius;
          const fade = Math.max(0, (1 - progress) * r.alpha);

          if (progress >= 1 || fade <= 0.008) {
            ripples.splice(i, 1);
            continue;
          }

          ctx.globalAlpha = fade;
          ctx.strokeStyle = r.color;
          ctx.lineWidth = 1.25 * (1 - progress) + 0.35;
          ctx.beginPath();
          ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
          ctx.stroke();

          // Inner harmonic echo ring
          if (r.radius > 18) {
            ctx.globalAlpha = fade * 0.45;
            ctx.beginPath();
            ctx.arc(r.x, r.y, r.radius * 0.62, 0, Math.PI * 2);
            ctx.stroke();
          }
        }
        ctx.globalAlpha = 1;
      }

      if (!reduced && !document.hidden) {
        rafId = requestAnimationFrame(render);
      }
    };

    resize();
    rafId = requestAnimationFrame(render);

    const onMove = (e: MouseEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      const dist = Math.hypot(e.clientX - pointer.lastRippleX, e.clientY - pointer.lastRippleY);
      if (dist > 95 || pointer.lastRippleX < 0) {
        spawnRipple(e.clientX, e.clientY, false);
        pointer.lastRippleX = e.clientX;
        pointer.lastRippleY = e.clientY;
      }
    };

    const onClick = (e: MouseEvent) => {
      spawnRipple(e.clientX, e.clientY, true);
    };

    const onLeave = () => {
      pointer.x = -9999;
      pointer.y = -9999;
      pointer.smoothX = -9999;
      pointer.smoothY = -9999;
      pointer.lastRippleX = -9999;
      pointer.lastRippleY = -9999;
    };

    const onVisibility = () => {
      if (!document.hidden && !reduced && !rafId) {
        lastTs = 0;
        rafId = requestAnimationFrame(render);
      }
    };

    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('click', onClick, { passive: true });
    window.addEventListener('mouseleave', onLeave);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelAnimationFrame(rafId);
      moodObserver.disconnect();
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('click', onClick);
      window.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
    />
  );
};
