'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface Step {
  tag: string;
  title: string;
  description: string;
  detail: string;
  badge: string;
}

const pasos: Step[] = [
  {
    tag: '01. EL ORIGEN',
    title: 'HARINA & MANTEQUILLA',
    description: 'Comenzamos tamizando harinas finas de molienda artesanal con mantequilla de rancho madurada. Nada industrial, solo aromas limpios.',
    detail: 'Mantequilla 82% materia grasa + vainas de vainilla de Papantla abiertas a mano.',
    badge: 'Masa reposada 24h',
  },
  {
    tag: '02. LA ALQUIMIA',
    title: 'MEZCLA PACIENTE',
    description: 'Emulsionamos los huevos de libre pastoreo con azúcar de caña hasta alcanzar el punto de listón. Cada batido busca atrapar aire natural.',
    detail: 'Textura sedosa, sin prisa, respetando la temperatura ambiente del obrador.',
    badge: 'Aireado natural',
  },
  {
    tag: '03. EL CALOR',
    title: 'HORNO DORADO',
    description: 'Horneamos a fuego bajo y constante. El olor a caramelo tostado y bizcocho recién subido inunda toda la calle de la Roma Norte.',
    detail: '160°C de calor suave para preservar la humedad del corazón del pastel.',
    badge: 'Horneado cada mañana',
  },
  {
    tag: '04. EL TOQUE MANUAL',
    title: 'DECORACIÓN VIVA',
    description: 'Espatulamos buttercream sedoso con compota de fresas silvestres. Coronamos con flores comestibles cultivadas sin pesticidas.',
    detail: 'Cada trazo de espátula es único; no hay dos piezas exactamente idénticas.',
    badge: 'Flores de huerto orgánico',
  },
  {
    tag: '05. LA PROMESA',
    title: 'DALIA EN TU MESA',
    description: 'Empacado en nuestras cajas de papel ecológico con lazo de algodón y tu dedicatoria escrita con tinta. Listo para hacer sonreír.',
    detail: 'De nuestro horno a tus manos para celebrar los momentos que importan.',
    badge: 'Hecho con cariño ♡',
  },
];

export function RecetaVisual() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    if (!section) return;

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: '+=2500',
      pin: true,
      scrub: 0.6,
      onUpdate: (self) => {
        const index = Math.min(
          pasos.length - 1,
          Math.floor(self.progress * pasos.length)
        );
        setActiveStep(index);
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  const current = pasos[activeStep];

  return (
    <section
      ref={sectionRef}
      id="como-lo-hacemos"
      aria-label="Así hacemos nuestros postres en Dalia Repostería"
      className="relative min-h-screen bg-dalia-cream text-dalia-chocolate flex flex-col justify-center px-6 md:px-16 py-12 border-y border-dalia-rose/30 overflow-hidden"
    >
      {/* Fondo editorial con marca de agua grande */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[14vw] font-serif font-bold text-dalia-rose/10 select-none pointer-events-none tracking-widest uppercase whitespace-nowrap"
      >
        {current.title.split(' ')[0]}
      </div>

      <div className="max-w-6xl mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Columna Izquierda: Encabezado Editorial */}
        <div className="lg:col-span-5 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-dalia-blush rounded-full text-xs font-semibold tracking-wider text-dalia-strawberry uppercase">
            <span>✦</span>
            <span>El Secreto del Obrador</span>
          </div>

          <h2 className="font-serif text-3xl md:text-5xl font-bold text-dalia-chocolate leading-tight">
            Así hacemos nuestros <span className="italic font-normal text-dalia-strawberry">postres</span>
          </h2>

          <p className="text-dalia-cocoa/80 text-base md:text-lg leading-relaxed font-light">
            No seguimos atajos industriales. Cada receta es una coreografía paciente entre ingredientes nobles y manos que disfrutan cuidar cada detalle.
          </p>

          {/* Stepper visual estilizado como regla tipográfica */}
          <div className="pt-4 flex items-center gap-3">
            {pasos.map((p, idx) => (
              <button
                key={p.tag}
                onClick={() => setActiveStep(idx)}
                aria-label={`Ir al paso ${p.tag}`}
                className={`transition-all duration-500 rounded-full h-2.5 ${
                  activeStep === idx
                    ? 'w-10 bg-dalia-strawberry'
                    : 'w-2.5 bg-dalia-rose/40 hover:bg-dalia-strawberry/60'
                }`}
              />
            ))}
          </div>

          <div className="text-xs font-semibold text-dalia-cocoa/60 uppercase tracking-widest">
            Paso 0{activeStep + 1} de 05
          </div>
        </div>

        {/* Columna Derecha: Tarjeta Editorial de la Pieza */}
        <div className="lg:col-span-7">
          <div className="bg-white/80 backdrop-blur-sm p-8 md:p-12 rounded-dalia-lg border border-dalia-rose/40 shadow-paper-lg relative overflow-hidden transition-all duration-500">
            {/* Pequeña cinta adhesiva decorativa artesanal */}
            <div
              aria-hidden="true"
              className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-6 bg-dalia-blush/80 border border-dalia-rose/30 rotate-1 shadow-sm"
            />

            <div className="flex items-center justify-between gap-4 border-b border-dalia-rose/30 pb-4 mb-6">
              <span className="text-xs font-bold tracking-widest text-dalia-strawberry uppercase font-sans">
                {current.tag}
              </span>
              <span className="text-xs px-3 py-1 bg-dalia-vanilla border border-dalia-rose/30 rounded-full text-dalia-chocolate font-medium">
                {current.badge}
              </span>
            </div>

            <h3 className="font-serif text-2xl md:text-4xl font-bold text-dalia-chocolate mb-4 tracking-tight">
              {current.title}
            </h3>

            <p className="text-dalia-cocoa text-base md:text-xl leading-relaxed mb-6 font-normal">
              {current.description}
            </p>

            <div className="bg-dalia-vanilla/60 p-4 rounded-dalia-sm border-l-4 border-dalia-strawberry">
              <p className="font-handwritten text-xl md:text-2xl text-dalia-chocolate">
                &ldquo;{current.detail}&rdquo;
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
