import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '../lib/lenisGsap';

const CODE_TOKENS = [
  'def',
  'async',
  '0xFF',
  'O(log n)',
  'λ',
  '=>',
  '{}',
  'SELECT',
  'JOIN',
  '10110',
  'API',
  'class',
  'return',
  'JSON',
  'git',
];

export function CSBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = prefersReducedMotion();
    let width = 0;
    let height = 0;
    let animId: number | null = null;
    let lastFrameTime = 0;

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      kind: 'gold' | 'crimson' | 'muted';
    }

    interface CodeToken {
      text: string;
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      isGold: boolean;
    }

    interface Pulse {
      ax: number;
      ay: number;
      bx: number;
      by: number;
      t: number;
      speed: number;
      kind: 'gold' | 'crimson';
    }

    let particles: Particle[] = [];
    let tokens: CodeToken[] = [];
    let pulses: Pulse[] = [];

    const isDark = () => document.documentElement.classList.contains('dark');

    function resize() {
      if (!canvas || !ctx) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const mobile = width < 768;
      particles = Array.from({ length: mobile ? 18 : 38 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.3 + 0.9,
        kind: Math.random() < 0.3 ? 'gold' : Math.random() < 0.65 ? 'crimson' : 'muted',
      }));

      tokens = Array.from({ length: mobile ? 12 : 26 }, () => ({
        text: CODE_TOKENS[Math.floor(Math.random() * CODE_TOKENS.length)],
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.06,
        vy: -(Math.random() * 0.2 + 0.06),
        size: Math.random() * 2.5 + 10,
        alpha: Math.random() * 0.1 + 0.04,
        isGold: Math.random() < 0.3,
      }));
      pulses = [];
      if (reduced) draw(0);
    }

    function draw(now: number) {
      if (!ctx) return;
      const mobile = width < 768;
      // Throttle mobile framerate to ~30fps for smooth battery-friendly performance
      if (!reduced && mobile && now - lastFrameTime < 33) {
        animId = requestAnimationFrame(draw);
        return;
      }
      lastFrameTime = now;

      ctx.clearRect(0, 0, width, height);
      const dark = isDark();
      const maxDist = mobile ? 115 : 155;

      // 1. Drifting CS tokens
      ctx.textBaseline = 'middle';
      for (const tk of tokens) {
        if (!reduced) {
          tk.y += tk.vy;
          tk.x += tk.vx;
          if (tk.y < -20) {
            tk.y = height + 20;
            tk.x = Math.random() * width;
          }
        }
        ctx.font = `500 ${tk.size}px "JetBrains Mono Variable", monospace`;
        ctx.fillStyle = dark
          ? tk.isGold
            ? `rgba(217, 180, 74, ${tk.alpha})`
            : `rgba(183, 159, 160, ${tk.alpha})`
          : tk.isGold
            ? `rgba(184, 144, 42, ${tk.alpha * 1.25})`
            : `rgba(107, 29, 46, ${tk.alpha * 0.9})`;
        ctx.fillText(tk.text, tk.x, tk.y);
      }

      // 2. Circuit constellation
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        if (!reduced) {
          a.x += a.vx;
          a.y += a.vy;
          if (a.x < 0 || a.x > width) a.vx *= -1;
          if (a.y < 0 || a.y > height) a.vy *= -1;
        }

        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < maxDist) {
            const strength = 1 - dist / maxDist;
            const warm = a.kind === 'gold' || b.kind === 'gold';
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = dark
              ? warm
                ? `rgba(217, 180, 74, ${strength * 0.13})`
                : `rgba(224, 49, 80, ${strength * 0.14})`
              : warm
                ? `rgba(184, 144, 42, ${strength * 0.18})`
                : `rgba(107, 29, 46, ${strength * 0.12})`;
            ctx.lineWidth = 0.85;
            ctx.stroke();

            if (!reduced && pulses.length < 10 && Math.random() < 0.0005) {
              pulses.push({
                ax: a.x,
                ay: a.y,
                bx: b.x,
                by: b.y,
                t: 0,
                speed: Math.random() * 0.015 + 0.01,
                kind: Math.random() < 0.5 ? 'gold' : 'crimson',
              });
            }
          }
        }

        ctx.beginPath();
        ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
        ctx.fillStyle =
          a.kind === 'gold'
            ? dark
              ? 'rgba(217, 180, 74, 0.4)'
              : 'rgba(184, 144, 42, 0.42)'
            : a.kind === 'crimson'
              ? dark
                ? 'rgba(224, 49, 80, 0.35)'
                : 'rgba(179, 18, 45, 0.32)'
              : 'rgba(107, 74, 79, 0.25)';
        ctx.fill();
      }

      // 3. Data pulses
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        p.t += p.speed;
        if (p.t >= 1) {
          pulses.splice(i, 1);
          continue;
        }
        const px = p.ax + (p.bx - p.ax) * p.t;
        const py = p.ay + (p.by - p.ay) * p.t;
        const color =
          p.kind === 'gold'
            ? dark
              ? '#D9B44A'
              : '#B8902A'
            : dark
              ? '#E03150'
              : '#B3122D';
        ctx.beginPath();
        ctx.arc(px, py, 2.1, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      }

      if (!reduced) {
        animId = requestAnimationFrame(draw);
      }
    }

    function start() {
      if (!animId && !reduced) animId = requestAnimationFrame(draw);
    }

    function stop() {
      if (animId) {
        cancelAnimationFrame(animId);
        animId = null;
      }
    }

    function handleVisibility() {
      if (document.hidden) stop();
      else start();
    }

    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', handleVisibility);
    resize();
    start();

    return () => {
      stop();
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}