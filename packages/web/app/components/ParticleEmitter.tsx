'use client';

import { forwardRef, useEffect, useRef } from 'react';

interface ParticleEmitterProps {
  /** 'underline' emits along a horizontal line, 'border' emits along a rect perimeter */
  shape?: 'underline' | 'border';
  /** Canvas width in CSS px (default: 300) */
  width?: number;
  /** Canvas height in CSS px (default: 20 for underline, 100 for border) */
  height?: number;
  /** Particle count (default: 80 for underline, 200 for border) */
  count?: number;
  /** Max distance particles travel outward in px (default: 12) */
  spread?: number;
  /** Overall opacity multiplier 0-1 (default: 0.5) */
  intensity?: number;
  /** CSS class on the wrapper */
  className?: string;
}

interface Particle {
  /** 0-1 position along the emitter edge */
  pos: number;
  /** signed offset from edge, -1 to 1 */
  offset: number;
  speed: number;
  size: number;
  life: number;
  maxLife: number;
  bright: number;
  kind: number;
}

const ParticleEmitter = forwardRef<HTMLDivElement, ParticleEmitterProps>(function ParticleEmitter(
  {
    shape = 'underline',
    width = 300,
    height,
    count,
    spread = 12,
    intensity = 0.5,
    className,
  },
  ref
) {
  const h = height ?? (shape === 'underline' ? 24 : 100);
  const np = count ?? (shape === 'underline' ? 80 : 200);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;

    c.width = width * dpr;
    c.height = h * dpr;
    c.style.width = width + 'px';
    c.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    function spawn(): Particle {
      return {
        pos: Math.random(),
        offset: 0,
        speed: 0.003 + Math.random() * 0.006,
        size: 0.6 + Math.random() * 2,
        life: 0,
        maxLife: 60 + Math.random() * 120,
        bright: 0.3 + Math.random() * 0.7,
        kind: Math.random(),
      };
    }

    const parts: Particle[] = [];
    for (let i = 0; i < np; i++) {
      const p = spawn();
      p.life = Math.random() * p.maxLife;
      p.offset = (Math.random() - 0.5) * 2;
      parts.push(p);
    }

    let raf: number;

    function getXY(p: Particle): [number, number] {
      if (shape === 'underline') {
        // Emit downward from top edge
        const x = p.pos * width;
        const y = 2 + Math.abs(p.offset) * spread;
        return [x, y];
      }
      // border: emit along rectangle perimeter
      const perim = 2 * (width + h);
      const d = p.pos * perim;
      let bx: number, by: number, nx: number, ny: number;
      if (d < width) {
        // top edge
        bx = d; by = 0; nx = 0; ny = -1;
      } else if (d < width + h) {
        // right edge
        bx = width; by = d - width; nx = 1; ny = 0;
      } else if (d < 2 * width + h) {
        // bottom edge
        bx = width - (d - width - h); by = h; nx = 0; ny = 1;
      } else {
        // left edge
        bx = 0; by = h - (d - 2 * width - h); nx = -1; ny = 0;
      }
      return [bx + nx * p.offset * spread, by + ny * p.offset * spread];
    }

    function draw() {
      ctx!.clearRect(0, 0, width, h);

      for (const p of parts) {
        p.life++;
        // Drift outward
        const dir = p.offset >= 0 ? 1 : -1;
        p.offset += dir * p.speed;

        if (p.life > p.maxLife || Math.abs(p.offset) > 1) {
          Object.assign(p, spawn());
        }

        const [x, y] = getXY(p);
        const distRatio = Math.abs(p.offset);
        const radialAlpha = Math.pow(1 - distRatio, 2);
        const lifeRatio = p.life / p.maxLife;
        const lifeAlpha = lifeRatio < 0.15 ? lifeRatio / 0.15 : lifeRatio > 0.6 ? (1 - lifeRatio) / 0.4 : 1;
        const alpha = radialAlpha * lifeAlpha * p.bright * intensity;
        if (alpha < 0.01) continue;

        const red = 180 + Math.floor(Math.random() * 40);
        ctx!.fillStyle = `rgba(${red},${30 + Math.floor(Math.random() * 20)},${18 + Math.floor(Math.random() * 12)},${alpha})`;

        const s = p.size;
        if (p.kind < 0.5) {
          ctx!.fillRect(x - s / 2, y - s / 2, s, s);
        } else if (p.kind < 0.85) {
          // elongated along the emitter edge
          ctx!.fillRect(x - s, y - s * 0.3, s * 2, s * 0.6);
        } else {
          ctx!.fillRect(x - s * 0.3, y - s, s * 0.6, s * 2);
        }
      }

      raf = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(raf);
  }, [width, h, np, spread, intensity, shape]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        pointerEvents: 'none',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ display: 'block', pointerEvents: 'none' }}
      />
    </div>
  );
});

export default ParticleEmitter;
