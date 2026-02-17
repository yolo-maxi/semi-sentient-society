'use client';

import { useEffect, useRef } from 'react';

/** Mini version of SealCanvas — logo + particles for the flywheel bottom node. */
export default function FlywheelLogo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;

    const logoImg = new Image();
    logoImg.src = '/logo.png';

    const W = 280;
    const H = 280;
    function resize() {
      c!.width = W * dpr;
      c!.height = H * dpr;
      c!.style.width = W + 'px';
      c!.style.height = H + 'px';
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();

    const NP = 600;
    interface Particle {
      angle: number; dist: number; speed: number; size: number;
      life: number; maxLife: number; bright: number; kind: number;
    }
    const parts: Particle[] = [];
    function spawn(): Particle {
      return {
        angle: Math.random() * Math.PI * 2,
        dist: 0,
        speed: 0.08 + Math.random() * 0.25,
        size: 0.8 + Math.random() * 3,
        life: 0,
        maxLife: 80 + Math.random() * 150,
        bright: 0.3 + Math.random() * 0.7,
        kind: Math.random(),
      };
    }
    for (let i = 0; i < NP; i++) {
      const p = spawn();
      p.life = Math.random() * p.maxLife;
      p.dist = Math.random();
      parts.push(p);
    }

    let t = 0;
    let raf: number;

    function draw() {
      const cx = W / 2, cy = H / 2;
      const logoR = W * 0.32;
      const maxR = W / 2;
      ctx!.clearRect(0, 0, W, H);
      t += 0.016;

      const badgeInnerR = logoR * 0.74;
      const particleOuterR = maxR * 1.3;

      // Pulsing glow
      const pulse = Math.sin(t * 0.5) * 0.5 + 0.5;
      const g = ctx!.createRadialGradient(cx, cy, logoR * 0.5, cx, cy, maxR);
      g.addColorStop(0, `rgba(201,54,44,${0.1 + pulse * 0.05})`);
      g.addColorStop(0.4, `rgba(140,20,15,${0.04 + pulse * 0.02})`);
      g.addColorStop(1, 'transparent');
      ctx!.fillStyle = g;
      ctx!.fillRect(0, 0, W, H);

      // Logo
      if (logoImg.complete && logoImg.naturalWidth > 0) {
        const s = logoR * 2;
        ctx!.drawImage(logoImg, cx - s / 2, cy - s / 2, s, s);
      }

      // Particles (clipped outside badge inner)
      const particleInnerR = badgeInnerR * 0.99;
      ctx!.save();
      ctx!.beginPath();
      ctx!.rect(0, 0, W, H);
      ctx!.arc(cx, cy, particleInnerR, 0, Math.PI * 2, true);
      ctx!.clip('evenodd');

      for (const p of parts) {
        p.life++;
        p.dist += p.speed / maxR;
        if (p.life > p.maxLife || p.dist > 1) Object.assign(p, spawn());

        const d = particleInnerR + p.dist * (particleOuterR - particleInnerR);
        const x = cx + Math.cos(p.angle) * d;
        const y = cy + Math.sin(p.angle) * d;
        const distRatio = (d - particleInnerR) / (particleOuterR - particleInnerR);
        const radialAlpha = Math.max(0, Math.pow(1 - distRatio, 1.5)) * 0.7;
        const lifeRatio = p.life / p.maxLife;
        const lifeAlpha = lifeRatio < 0.1 ? lifeRatio * 10 : lifeRatio > 0.7 ? (1 - lifeRatio) / 0.3 : 1;
        const alpha = radialAlpha * lifeAlpha * p.bright;
        if (alpha < 0.02) continue;

        ctx!.save();
        ctx!.translate(x, y);
        ctx!.rotate(p.angle);
        const r = 180 + Math.floor(Math.random() * 40);
        ctx!.fillStyle = `rgba(${r},${30 + Math.floor(Math.random() * 20)},${20 + Math.floor(Math.random() * 15)},${alpha})`;
        if (p.kind < 0.5) {
          const s = p.size * 0.95;
          ctx!.fillRect(-s / 2, -s / 2, s, s);
        } else if (p.kind < 0.95) {
          ctx!.fillRect(-0.5, -p.size * 1.5, 1.5, p.size * 3);
        } else {
          ctx!.fillRect(-p.size * 0.4, -p.size * 0.3, p.size * 0.95, p.size * 0.6);
        }
        ctx!.restore();
      }
      ctx!.restore();

      raf = requestAnimationFrame(draw);
    }

    if (logoImg.complete) draw();
    else logoImg.onload = () => draw();

    return () => cancelAnimationFrame(raf);
  }, []);

  return <canvas ref={canvasRef} style={{ display: 'block', margin: '0 auto' }} />;
}
