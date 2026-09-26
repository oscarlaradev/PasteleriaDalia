'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDown, Sparkles } from 'lucide-react';
import { DEFAULT_SITE_CONTENT, SiteContent } from '@/lib/siteContentDefaults';

export function HeroEditorial() {
  const [content, setContent] = useState<SiteContent>(DEFAULT_SITE_CONTENT);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const bigDaliaRef = useRef<HTMLHeadingElement | null>(null);
  const cakePhotoRef = useRef<HTMLDivElement | null>(null);
  const badge1Ref = useRef<HTMLDivElement | null>(null);
  const badge2Ref = useRef<HTMLDivElement | null>(null);
  const badge3Ref = useRef<HTMLDivElement | null>(null);
  const subtitleRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetch('/api/admin/site-content')
      .then((res) => res.json())
      .then((data) => {
        if (data.content) setContent(data.content);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      // Timeline sincronizada con el scroll, fluida y con anticipatePin para evitar jalones
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: '+=450',
          scrub: 0.6,
          pin: true,
          anticipatePin: 1,
        },
      });

      // 1. Fondo DALIA con movimiento suave
      if (bigDaliaRef.current) {
        tl.to(bigDaliaRef.current, {
          y: -35,
          scale: 1.05,
          opacity: 0.18,
          ease: 'power1.out',
        }, 0);
      }

      // 2. Fotografía central con sutil elevación
      if (cakePhotoRef.current) {
        tl.to(cakePhotoRef.current, {
          scale: 1.04,
          y: -12,
          ease: 'power1.out',
        }, 0);
      }

      // 3. Subtítulo y botón: se revelan con máxima suavidad
      if (subtitleRef.current) {
        tl.to(subtitleRef.current, {
          opacity: 1,
          y: 0,
          ease: 'power2.out',
          onUpdate: function () {
            if (subtitleRef.current) {
              if (this.progress() > 0.12) {
                subtitleRef.current.style.pointerEvents = 'auto';
              } else {
                subtitleRef.current.style.pointerEvents = 'none';
              }
            }
          },
        }, 0.05);
      }
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      aria-label="Escena editorial de presentación Dalia Repostería"
      className="relative min-h-screen w-full bg-dalia-vanilla overflow-hidden flex flex-col justify-center items-center px-6 pt-6 pb-12"
    >
      {/* Palabra DALIA enorme detrás de la composición */}
      <h1
        ref={bigDaliaRef}
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[26vw] md:text-[22vw] font-serif font-bold text-dalia-rose/25 select-none pointer-events-none tracking-widest z-0 leading-none"
      >
        DALIA
      </h1>

      {/* Escena Central de Repostería */}
      <div className="relative z-10 max-w-4xl w-full flex flex-col items-center">
        {/* Detalle Editorial Superior Izquierdo */}
        <div
          ref={badge1Ref}
          className="absolute -top-8 left-4 md:left-12 z-20 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full border border-dalia-rose/40 shadow-paper -rotate-3"
        >
          <p className="font-handwritten text-xl md:text-2xl text-dalia-strawberry">
            {content.hero.badge1 || 'hecho con cariño ♡'}
          </p>
        </div>

        {/* Detalle Editorial Superior Derecho */}
        <div
          ref={badge2Ref}
          className="absolute -top-4 right-4 md:right-12 z-20 bg-dalia-blush/90 backdrop-blur-sm px-4 py-1.5 rounded-full border border-dalia-rose/40 shadow-paper rotate-3"
        >
          <p className="text-xs font-serif font-bold tracking-wider text-dalia-chocolate uppercase">
            {content.hero.badge2 || 'horneado hoy'}
          </p>
        </div>

        {/* Detalle Editorial Flotante Lateral */}
        <div
          ref={badge3Ref}
          className="hidden md:block absolute -bottom-6 left-6 z-20 bg-white/90 backdrop-blur-sm px-5 py-2 rounded-full border border-dalia-rose/40 shadow-paper rotate-2"
        >
          <p className="text-xs font-semibold text-dalia-cocoa">
            {content.hero.badge3 || 'para celebrar bonito ✦'}
          </p>
        </div>

        {/* Fotografía Central del Pastel Insignia */}
        <div
          ref={cakePhotoRef}
          className="relative w-72 sm:w-88 md:w-[480px] h-88 sm:h-96 md:h-[500px] rounded-dalia-lg overflow-hidden border-4 border-white shadow-paper-lg transition-transform"
        >
          <Image
            src={content.hero.heroImage || '/assets/productos_reales/mariposas_1.jpg'}
            alt="Pastel insignia Dalia con mariposas delicadas, perlas de azúcar y pétalos artesanales"
            fill
            sizes="(max-width: 768px) 90vw, 500px"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dalia-chocolate/20 via-transparent to-transparent" />
        </div>

        {/* Mensaje de Transición Revelado en Scroll (oculto de inicio en CSS para evitar flash) */}
        <div
          ref={subtitleRef}
          className="mt-8 text-center space-y-4 max-w-md mx-auto opacity-0 translate-y-6 pointer-events-none will-change-transform"
        >
          <p className="font-serif text-2xl md:text-4xl font-bold text-dalia-chocolate tracking-tight">
            {content.hero.title || 'Un pedacito de felicidad.'}
          </p>
          <p className="text-sm md:text-base text-dalia-cocoa/80 font-light">
            {content.hero.subtitle || 'Recetas que honran el tiempo, la vainilla verdadera y la alegría de compartir.'}
          </p>
          <div className="pt-2">
            <a
              href="#antojos-del-dia"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-dalia-chocolate hover:bg-dalia-strawberry text-white text-xs font-semibold tracking-widest uppercase transition-colors shadow-paper"
            >
              <span>{content.hero.ctaText || 'Elige tu antojo'}</span>
              <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
