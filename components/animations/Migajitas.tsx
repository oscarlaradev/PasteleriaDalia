'use client';

import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  baseY: number;
  size: number;
  speed: number;
  type: 'crumb' | 'sugar' | 'petal' | 'cherry-dot';
  opacity: number;
  rotation: number;
  rotSpeed: number;
}

export function Migajitas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Si el usuario prefiere sin movimiento, no mostramos el canvas
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Creamos una cantidad muy pequeña y delicada (18 partículas máximo)
    const particleCount = 16;
    const particles: Particle[] = [];
    const types: ('crumb' | 'sugar' | 'petal' | 'cherry-dot')[] = ['crumb', 'sugar', 'petal', 'crumb'];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        baseY: Math.random() * height,
        size: Math.random() * 3.5 + 1.5,
        speed: Math.random() * 0.4 + 0.15,
        type: types[i % types.length],
        opacity: Math.random() * 0.35 + 0.15,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.015,
      });
    }

    let lastScrollY = window.scrollY;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const currentScrollY = window.scrollY;
      const scrollDiff = (currentScrollY - lastScrollY) * 0.12;
      lastScrollY = currentScrollY;

      particles.forEach((p) => {
        p.y += p.speed - scrollDiff;
        p.rotation += p.rotSpeed;

        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        } else if (p.y < -20) {
          p.y = height + 20;
          p.x = Math.random() * width;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.opacity;

        if (p.type === 'crumb') {
          // Migajita de galleta o bizcocho dorado
          ctx.fillStyle = '#C59B27';
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size, p.size * 0.7, 0.4, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === 'petal') {
          // Pétalo diminuto de dalia rosa
          ctx.fillStyle = '#E8B6BF';
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size * 1.4, p.size * 0.8, 0.2, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === 'cherry-dot') {
          // Diminuto punto color cereza
          ctx.fillStyle = '#B51B32';
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.7, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Destello de azúcar glass blanca
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.6, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-20 opacity-70"
    />
  );
}
