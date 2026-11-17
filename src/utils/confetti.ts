const CONFETTI_COLORS = ['#ff9f1c', '#2ec4b6', '#ff5d8f', '#faf7f2', '#fbbf24'];

export function triggerConfettiBurst(originX = 0.5, originY = 0.5): void {
  if (typeof window === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.inset = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '9999';
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    canvas.remove();
    return;
  }

  const startX = canvas.width * originX;
  const startY = canvas.height * originY;

  const particles = Array.from({ length: 42 }, () => {
    const angle = Math.random() * Math.PI * 2;
    const speed = 3 + Math.random() * 8;
    return {
      x: startX,
      y: startY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 3.2,
      size: 4 + Math.random() * 4,
      rotation: Math.random() * 360,
      vr: (Math.random() - 0.5) * 14,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      alpha: 1,
    };
  });

  const render = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.24;
      p.vx *= 0.985;
      p.rotation += p.vr;
      p.alpha -= 0.019;

      if (p.alpha > 0.02) {
        alive = true;
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.65);
        ctx.restore();
      }
    }

    if (alive) {
      requestAnimationFrame(render);
    } else {
      canvas.remove();
    }
  };

  requestAnimationFrame(render);
}
