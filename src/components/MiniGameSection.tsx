import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Gamepad2, Play, RotateCcw, Trophy } from 'lucide-react';
import { triggerConfettiBurst } from '../utils/confetti';
import { SpotlightCard } from './SpotlightCard';

interface Brick {
  x: number;
  y: number;
  w: number;
  h: number;
  alive: boolean;
  color: string;
  label: string;
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
}

const BUG_LABELS = [
  'N+1', 'LOCK', 'RACE', 'OOM', '502', 'CORS',
  'LAG', 'NULL', 'DEAD', 'MISS', 'DRIFT', 'LEAK',
];
const BRICK_COLORS = ['#ff9f1c', '#2ec4b6', '#ff5d8f'];

export const MiniGameSection: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawFrameRef = useRef<() => void>(() => {});
  const startLoopRef = useRef<() => void>(() => {});
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [phase, setPhase] = useState<'ready' | 'playing' | 'won' | 'over'>('ready');

  const gameRef = useRef({
    paddleX: 0.5,
    ballX: 280,
    ballY: 185,
    vx: 3.1,
    vy: -3.2,
    bricks: [] as Brick[],
    sparks: [] as Spark[],
    trail: [] as { x: number; y: number }[],
    keys: { left: false, right: false },
    running: false,
    score: 0,
    lastCssW: 0,
  });

  useEffect(() => {
    try {
      const saved = Number(window.localStorage.getItem('aditya_arcade_best') || '0');
      if (Number.isFinite(saved) && saved > 0) setBest(saved);
    } catch {
      // Ignore storage access restrictions
    }
  }, []);

  const buildBricks = (w: number): Brick[] => {
    const cols = 6;
    const rows = 2;
    const pad = w < 420 ? 5 : 10;
    const marginX = w < 420 ? 10 : 20;
    const bw = (w - marginX * 2 - pad * (cols - 1)) / cols;
    const bh = 22;
    const list: Brick[] = [];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const idx = r * cols + c;
        list.push({
          x: marginX + c * (bw + pad),
          y: 20 + r * (bh + 8),
          w: bw,
          h: bh,
          alive: true,
          color: BRICK_COLORS[(c + r) % BRICK_COLORS.length],
          label: BUG_LABELS[idx % BUG_LABELS.length],
        });
      }
    }
    return list;
  };

  const resetBoard = useCallback((autoStart = false) => {
    const canvas = canvasRef.current;
    const w = canvas ? canvas.clientWidth || 560 : 560;
    const h = 230;
    const g = gameRef.current;

    g.paddleX = 0.5;
    g.ballX = w * 0.5;
    g.ballY = h - 42;
    g.vx = (Math.random() > 0.5 ? 1 : -1) * 3.1;
    g.vy = -3.3;
    g.bricks = buildBricks(w);
    g.sparks = [];
    g.trail = [];
    g.score = 0;
    g.running = autoStart;
    setScore(0);
    setPhase(autoStart ? 'playing' : 'ready');

    if (autoStart) {
      startLoopRef.current();
    } else {
      drawFrameRef.current();
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId = 0;
    const H = 230;

    const syncSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const cssW = Math.max(260, canvas.clientWidth || 560);
      const g = gameRef.current;
      if (
        canvas.width !== Math.round(cssW * dpr) ||
        canvas.height !== Math.round(H * dpr) ||
        Math.abs(g.lastCssW - cssW) > 1
      ) {
        const prevW = g.lastCssW || cssW;
        g.lastCssW = cssW;
        canvas.width = Math.round(cssW * dpr);
        canvas.height = Math.round(H * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const nextLayout = buildBricks(cssW);
        if (g.bricks.length === nextLayout.length) {
          g.bricks = nextLayout.map((b, idx) => ({
            ...b,
            alive: g.bricks[idx].alive,
          }));
        } else {
          g.bricks = nextLayout;
        }
        if (prevW > 0 && prevW !== cssW) {
          g.ballX = Math.min(cssW - 8, Math.max(8, (g.ballX / prevW) * cssW));
        }
      }
      return cssW;
    };

    const drawFrame = () => {
      const W = syncSize();
      const g = gameRef.current;
      ctx.clearRect(0, 0, W, H);

      // Subtle arena background grid
      ctx.strokeStyle = 'rgba(255,255,255,0.035)';
      ctx.lineWidth = 1;
      for (let gx = 40; gx < W; gx += 40) {
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, H);
        ctx.stroke();
      }

      const paddleW = Math.min(96, W * 0.22);
      const paddleH = 10;
      const paddleY = H - 22;

      if (g.running) {
        if (g.keys.left) g.paddleX = Math.max(0.08, g.paddleX - 0.025);
        if (g.keys.right) g.paddleX = Math.min(0.92, g.paddleX + 0.025);

        g.ballX += g.vx;
        g.ballY += g.vy;
        g.trail.push({ x: g.ballX, y: g.ballY });
        if (g.trail.length > 9) g.trail.shift();

        if (g.ballX <= 7) {
          g.ballX = 7;
          g.vx = Math.abs(g.vx);
        } else if (g.ballX >= W - 7) {
          g.ballX = W - 7;
          g.vx = -Math.abs(g.vx);
        }
        if (g.ballY <= 7) {
          g.ballY = 7;
          g.vy = Math.abs(g.vy);
        }

        const px = Math.min(Math.max(g.paddleX * W, paddleW / 2 + 8), W - paddleW / 2 - 8);
        if (
          g.vy > 0 &&
          g.ballY + 7 >= paddleY &&
          g.ballY - 7 <= paddleY + paddleH &&
          g.ballX >= px - paddleW / 2 - 4 &&
          g.ballX <= px + paddleW / 2 + 4
        ) {
          const hitRatio = (g.ballX - px) / (paddleW / 2);
          g.vx = hitRatio * 4.4;
          g.vy = -Math.min(5.2, Math.abs(g.vy) * 1.03);
          g.ballY = paddleY - 8;
        }

        for (const b of g.bricks) {
          if (!b.alive) continue;
          if (
            g.ballX + 6 >= b.x &&
            g.ballX - 6 <= b.x + b.w &&
            g.ballY + 6 >= b.y &&
            g.ballY - 6 <= b.y + b.h
          ) {
            b.alive = false;
            g.vy = -g.vy;
            g.score += 10;
            setScore(g.score);

            for (let s = 0; s < 6; s++) {
              const ang = Math.random() * Math.PI * 2;
              g.sparks.push({
                x: b.x + b.w / 2,
                y: b.y + b.h / 2,
                vx: Math.cos(ang) * (1.5 + Math.random() * 2.5),
                vy: Math.sin(ang) * (1.5 + Math.random() * 2.5),
                alpha: 1,
                color: b.color,
              });
            }

            if (g.bricks.every((item) => !item.alive)) {
              g.running = false;
              setPhase('won');
              setBest((prevBest) => {
                const nextBest = Math.max(prevBest, g.score);
                try {
                  window.localStorage.setItem('aditya_arcade_best', String(nextBest));
                } catch {
                  // Ignore storage restrictions
                }
                return nextBest;
              });
              triggerConfettiBurst(0.65, 0.72);
            }
            break;
          }
        }

        if (g.ballY > H + 10) {
          g.running = false;
          setPhase('over');
          setBest((prevBest) => {
            const nextBest = Math.max(prevBest, g.score);
            try {
              window.localStorage.setItem('aditya_arcade_best', String(nextBest));
            } catch {
              // Ignore storage restrictions
            }
            return nextBest;
          });
        }
      }

      // Draw bricks
      ctx.font = W < 420 ? '700 8.5px monospace' : '700 10px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.lineWidth = 1.3;
      for (const b of g.bricks) {
        if (!b.alive) continue;
        ctx.fillStyle = `${b.color}24`;
        ctx.strokeStyle = b.color;
        ctx.beginPath();
        ctx.roundRect(b.x, b.y, b.w, b.h, 6);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#faf7f2';
        ctx.fillText(b.label, b.x + b.w / 2, b.y + b.h / 2 + 0.5);
      }

      // Draw brick sparks
      for (let i = g.sparks.length - 1; i >= 0; i--) {
        const sp = g.sparks[i];
        sp.x += sp.vx;
        sp.y += sp.vy;
        sp.alpha -= 0.05;
        if (sp.alpha <= 0) {
          g.sparks.splice(i, 1);
          continue;
        }
        ctx.globalAlpha = sp.alpha;
        ctx.fillStyle = sp.color;
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, 2.3, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Draw ball comet trail
      for (let idx = 0; idx < g.trail.length; idx++) {
        const pt = g.trail[idx];
        ctx.globalAlpha = ((idx + 1) / g.trail.length) * 0.35;
        ctx.fillStyle = '#ff9f1c';
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 4.5 * ((idx + 1) / g.trail.length), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Draw paddle
      const clampedPx = Math.min(Math.max(g.paddleX * W, paddleW / 2 + 8), W - paddleW / 2 - 8);
      const grad = ctx.createLinearGradient(clampedPx - paddleW / 2, 0, clampedPx + paddleW / 2, 0);
      grad.addColorStop(0, '#ff9f1c');
      grad.addColorStop(0.5, '#2ec4b6');
      grad.addColorStop(1, '#ff5d8f');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(clampedPx - paddleW / 2, paddleY, paddleW, paddleH, 5);
      ctx.fill();

      // Lightweight energy halo + crisp orb (zero expensive shadowBlur)
      ctx.globalAlpha = 0.25;
      ctx.fillStyle = '#ff9f1c';
      ctx.beginPath();
      ctx.arc(g.ballX, g.ballY, 11, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;

      ctx.fillStyle = '#faf7f2';
      ctx.beginPath();
      ctx.arc(g.ballX, g.ballY, 6, 0, Math.PI * 2);
      ctx.fill();
    };

    const tick = () => {
      rafId = 0;
      drawFrame();
      if (gameRef.current.running || gameRef.current.sparks.length > 0) {
        if (!document.hidden) {
          rafId = requestAnimationFrame(tick);
        }
      }
    };

    const startLoop = () => {
      if (!rafId && !document.hidden) {
        rafId = requestAnimationFrame(tick);
      }
    };

    drawFrameRef.current = drawFrame;
    startLoopRef.current = startLoop;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') {
        gameRef.current.keys.left = true;
        if (!gameRef.current.running) {
          gameRef.current.paddleX = Math.max(0.08, gameRef.current.paddleX - 0.04);
          drawFrame();
        }
      }
      if (e.key === 'ArrowRight' || e.key === 'd') {
        gameRef.current.keys.right = true;
        if (!gameRef.current.running) {
          gameRef.current.paddleX = Math.min(0.92, gameRef.current.paddleX + 0.04);
          drawFrame();
        }
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') gameRef.current.keys.left = false;
      if (e.key === 'ArrowRight' || e.key === 'd') gameRef.current.keys.right = false;
    };
    const onResize = () => drawFrame();
    const onVisibility = () => {
      if (!document.hidden && gameRef.current.running) startLoop();
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('resize', onResize, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);

    // Draw initial static board cleanly once without spinning CPU while idle
    resetBoard(false);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [resetBoard]);

  const updatePaddleFromClientX = (clientX: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ratio = (clientX - rect.left) / Math.max(1, rect.width);
    gameRef.current.paddleX = Math.min(0.92, Math.max(0.08, ratio));
    if (!gameRef.current.running) {
      drawFrameRef.current();
    }
  };

  return (
    <section id="play" aria-label="Interactive Bug Smasher Mini-Game" className="scroll-mt-24 py-6 sm:py-8">
      <div className="mx-auto max-w-[1380px] 2xl:max-w-[1520px] px-4 sm:px-6 lg:px-8">
        <SpotlightCard className="p-5 sm:p-6">
          <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12">
            {/* Compact Arcade Info & Controls */}
            <div className="lg:col-span-4">
              <div className="flex items-center gap-2 font-mono text-xs font-semibold text-[#22d3ee]">
                <Gamepad2 className="h-4 w-4" />
                <span>Quick Break Arcade</span>
              </div>
              <h3 className="mt-1.5 font-display text-xl font-bold text-[#f8fafc] sm:text-2xl">
                Bug Smasher Paddle
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-300 sm:text-sm">
                Move your mouse, drag on touch, or use arrow keys to bounce the orb and clear production bugs!
              </p>

              <div className="mt-4 grid grid-cols-2 gap-2.5">
                <div className="rounded-xl border border-white/10 bg-[#060919]/65 px-3.5 py-2.5">
                  <span className="block font-mono text-[10px] text-slate-400">Score</span>
                  <span className="font-display text-xl font-bold text-[#22d3ee] tabular-nums">
                    {score}
                  </span>
                </div>
                <div className="rounded-xl border border-white/10 bg-[#060919]/65 px-3.5 py-2.5">
                  <span className="flex items-center gap-1 font-mono text-[10px] text-slate-400">
                    <Trophy className="h-3 w-3 text-[#ff9f1c]" /> Best
                  </span>
                  <span className="font-display text-xl font-bold text-[#ff9f1c] tabular-nums">
                    {best}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2.5">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => resetBoard(true)}
                  className="inline-flex min-h-[40px] items-center gap-2 rounded-xl bg-gradient-to-r from-[#22d3ee] to-[#38bdf8] px-4 py-2 text-xs font-bold text-[#060919] transition-all hover:brightness-110 cursor-pointer"
                >
                  {phase === 'playing' ? <RotateCcw className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                  <span>
                    {phase === 'won'
                      ? 'Play Again'
                      : phase === 'over'
                        ? 'Retry Round'
                        : phase === 'playing'
                          ? 'Restart'
                          : 'Launch Orb'}
                  </span>
                </motion.button>

                {phase === 'won' && (
                  <span className="font-mono text-xs font-semibold text-[#22d3ee]">
                    Zero Bugs Left!
                  </span>
                )}
                {phase === 'over' && (
                  <span className="font-mono text-xs font-semibold text-[#fb7185]">
                    Missed — try again!
                  </span>
                )}
              </div>
            </div>

            {/* Interactive High-FPS Canvas Arena */}
            <div className="relative overflow-hidden rounded-xl border border-white/12 bg-[#060919]/90 lg:col-span-8">
              <canvas
                ref={canvasRef}
                onMouseMove={(e) => updatePaddleFromClientX(e.clientX)}
                onTouchMove={(e) => {
                  if (e.touches[0]) updatePaddleFromClientX(e.touches[0].clientX);
                }}
                onClick={() => {
                  if (phase !== 'playing') resetBoard(true);
                }}
                className="block h-[230px] w-full touch-none cursor-crosshair"
              />

              {phase === 'ready' && (
                <div className="pointer-events-none absolute inset-0 flex items-end justify-center pb-14">
                  <span className="rounded-lg border border-white/12 bg-black/75 px-3 py-1.5 font-mono text-[11px] text-[#ff9f1c] backdrop-blur-sm">
                    Tap arena or click Launch Orb to play
                  </span>
                </div>
              )}
            </div>
          </div>
        </SpotlightCard>
      </div>
    </section>
  );
};
