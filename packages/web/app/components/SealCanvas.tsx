'use client';

import { useEffect, useRef } from 'react';

export default function SealCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;

    // Load logo PNG
    const logoImg = new Image();
    logoImg.src = '/logo.png';

    const SIZE_W = 1000;
    const SIZE_H = 620; // Cropped height so logo fills frame (no empty bottom)
    function resize() {
      c!.width = SIZE_W * dpr;
      c!.height = SIZE_H * dpr;
      c!.style.width = SIZE_W + 'px';
      c!.style.height = SIZE_H + 'px';
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);

    // Particles
    const NP = 1500;
    interface Particle {
      angle: number;
      dist: number;
      speed: number;
      size: number;
      life: number;
      maxLife: number;
      bright: number;
      kind: number;
    }
    const parts: Particle[] = [];
    function spawnParticle(): Particle {
      return {
        angle: Math.random() * Math.PI * 2,
        dist: 0,
        speed: 0.1 + Math.random() * 0.35,
        size: 1 + Math.random() * 4,
        life: 0,
        maxLife: 80 + Math.random() * 150,
        bright: 0.3 + Math.random() * 0.7,
        kind: Math.random(),
      };
    }
    for (let i = 0; i < NP; i++) {
      const p = spawnParticle();
      p.life = Math.random() * p.maxLife;
      p.dist = Math.random();
      parts.push(p);
    }

    let t = 0;
    let logoMask: HTMLCanvasElement | null = null;
    let raf: number;

    function draw() {
      const w = SIZE_W, h = SIZE_H;
      const cx = w / 2;
      const logoR = w * 0.32;
      const logoCenterY = 300; // Fixed so logo is centered in cropped canvas
      const maxR = w / 2;
      ctx!.clearRect(0, 0, w, h);
      t += 0.016;

      const logoFadeThreshold = 0.95;
      const badgeInnerR = logoR * 0.74;
      const badgeOuterR = logoR * 0.90;
      const particleOuterR = maxR * 1.35;

      // 1. PULSING GLOW
      const pulsePhase = Math.sin(t * 0.5) * 0.5 + 0.5;
      const glowInner = logoR * 0.7;
      const g = ctx!.createRadialGradient(cx, logoCenterY, glowInner, cx, logoCenterY, maxR);
      g.addColorStop(0, `rgba(201,54,44,${0.08 + pulsePhase * 0.04})`);
      g.addColorStop(0.3, `rgba(140,20,15,${0.04 + pulsePhase * 0.02})`);
      g.addColorStop(0.7, 'rgba(80,10,8,0.01)');
      g.addColorStop(1, 'transparent');
      ctx!.fillStyle = g;
      ctx!.fillRect(0, 0, w, h);

      // 2. LOGO PNG
      if (logoImg.complete && logoImg.naturalWidth > 0) {
        const logoSize = logoR * 2;
        ctx!.save();
        if (!logoMask) {
          logoMask = document.createElement('canvas');
          logoMask.width = c!.width;
          logoMask.height = c!.height;
        }
        const mc = logoMask;
        if (mc.width !== c!.width || mc.height !== c!.height) {
          mc.width = c!.width;
          mc.height = c!.height;
        }
        const mctx = mc.getContext('2d')!;
        mctx.clearRect(0, 0, mc.width, mc.height);
        mctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        mctx.drawImage(logoImg, cx - logoSize / 2, logoCenterY + h * 0.01 - logoSize / 2, logoSize, logoSize);
        mctx.globalCompositeOperation = 'source-over';
        ctx!.drawImage(mc, 0, 0, mc.width, mc.height, 0, 0, w, h);
        ctx!.restore();
      }

      // 3. NOISE PARTICLES
      const particleInnerR = badgeInnerR * 0.99;
      ctx!.save();
      ctx!.beginPath();
      ctx!.rect(0, 0, w, h);
      ctx!.arc(cx, logoCenterY, badgeInnerR * 0.99, 0, Math.PI * 2, true);
      ctx!.clip('evenodd');
      for (const p of parts) {
        p.life++;
        p.dist += p.speed / maxR;
        if (p.life > p.maxLife || p.dist > 1) {
          Object.assign(p, spawnParticle());
        }
        const d = particleInnerR + p.dist * (particleOuterR - particleInnerR);
        const x = cx + Math.cos(p.angle) * d;
        const y = logoCenterY + Math.sin(p.angle) * d;
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
          const s = p.size * logoFadeThreshold;
          ctx!.fillRect(-s / 2, -s / 2, s, s);
        } else if (p.kind < logoFadeThreshold) {
          ctx!.fillRect(-0.5, -p.size * 1.5, 1.5, p.size * 3);
        } else {
          ctx!.fillRect(-p.size * 0.4, -p.size * 0.3, p.size * logoFadeThreshold, p.size * 0.6);
        }
        ctx!.restore();
      }
      ctx!.restore();

      raf = requestAnimationFrame(draw);
    }

    // Hide fallback img once canvas takes over
    const fallback = document.querySelector('.hero-logo-fallback') as HTMLElement | null;
    function start() {
      if (fallback) fallback.style.opacity = '0';
      draw();
    }
    if (logoImg.complete) start();
    else logoImg.onload = start;

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <canvas ref={canvasRef} id="organism" />;
}
