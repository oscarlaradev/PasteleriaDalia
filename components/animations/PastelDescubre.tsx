'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface Layer {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  image: string;
  clipStyle: string;
  badge: string;
}

const capas: Layer[] = [
  {
    id: 'textura',
    name: '1. Textura & Miga',
    subtitle: 'El corazón esponjoso',
    description: 'Bizcocho húmedo infusionado con vaina de vainilla entera de Papantla. Miga elástica que sostiene el jarabe sin perder ligereza.',
    image: '/assets/images/cake_cross_section.jpg',
    clipStyle: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)',
    badge: 'Humedad exacta',
  },
  {
    id: 'relleno',
    name: '2. Relleno Artesanal',
    subtitle: 'Compota de fresa silvestre',
    description: 'Fruta fresca reducida a fuego lento durante 4 horas con un toque de limón fresco, sin gelatinas ni espesantes artificiales.',
    image: '/assets/images/berries_tart.jpg',
    clipStyle: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)',
    badge: 'Fruta Natural',
  },
  {
    id: 'decoracion',
    name: '3. Decoración Manual',
    subtitle: 'Buttercream sedoso y pétalos',
    description: 'Cobertura emulsionada a mano con mantequilla dulce, decorada con espátula japonesa y pétalos de dalias frescas cosechadas el mismo día.',
    image: '/assets/images/hero_cake.jpg',
    clipStyle: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)',
    badge: 'Arte efímero',
  },
];

export function PastelDescubre() {
  const [selectedLayer, setSelectedLayer] = useState(0);

  return (
    <section
      id="descubre-el-pastel"
      aria-label="Descubre las capas de nuestro pastel artesanal"
      className="py-20 md:py-28 px-6 md:px-16 bg-dalia-vanilla text-dalia-chocolate relative overflow-hidden"
    >
      <div className="max-w-6xl mx-auto">
        {/* Encabezado */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-dalia-blush rounded-full text-xs font-semibold text-dalia-strawberry uppercase tracking-wider">
            <span>♡</span>
            <span>Experiencia Sensorial</span>
          </div>
          <h2 className="font-serif text-3xl md:text-5xl font-bold tracking-tight">
            El pastel que se <span className="italic font-normal text-dalia-strawberry">descubre</span>
          </h2>
          <p className="text-dalia-cocoa/80 text-base md:text-lg font-light leading-relaxed">
            Un buen pastel no se juzga solo por fuera. Explora cada estrato y descubre por qué cada bocado sabe a tiempo y cariño.
          </p>
        </div>

        {/* Contenedor Interactivo */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center bg-white/70 p-6 md:p-12 rounded-dalia-lg border border-dalia-rose/30 shadow-paper-lg">
          {/* Selector de Capas */}
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs uppercase font-bold tracking-widest text-dalia-cocoa/60">
              Toca para revelar el interior:
            </span>
            <div className="space-y-3">
              {capas.map((capa, idx) => {
                const isActive = selectedLayer === idx;
                return (
                  <button
                    key={capa.id}
                    onClick={() => setSelectedLayer(idx)}
                    className={`w-full text-left p-5 rounded-dalia-sm transition-all duration-300 border ${
                      isActive
                        ? 'bg-dalia-blush/60 border-dalia-strawberry shadow-paper translate-x-2'
                        : 'bg-white/60 border-dalia-rose/30 hover:bg-white hover:border-dalia-rose/60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-serif text-lg font-bold text-dalia-chocolate">
                        {capa.name}
                      </h3>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-dalia-vanilla border border-dalia-rose/30 text-dalia-strawberry font-medium">
                        {capa.badge}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-dalia-strawberry mb-2">
                      {capa.subtitle}
                    </p>
                    <p className="text-xs text-dalia-cocoa/80 leading-relaxed">
                      {capa.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Visualizador de la Capa con Transición Física */}
          <div className="lg:col-span-7 relative h-[360px] md:h-[460px] rounded-dalia overflow-hidden border-2 border-white shadow-paper-float">
            {capas.map((capa, idx) => (
              <div
                key={capa.id}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  selectedLayer === idx ? 'opacity-100 z-10 scale-100' : 'opacity-0 z-0 scale-95'
                }`}
              >
                <Image
                  src={capa.image}
                  alt={capa.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  priority={idx === 0}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dalia-chocolate/60 via-transparent to-black/10" />

                <div className="absolute bottom-6 left-6 right-6 text-white p-4 bg-dalia-chocolate/40 backdrop-blur-md rounded-dalia-sm border border-white/20">
                  <p className="text-xs tracking-wider uppercase text-dalia-rose font-semibold">
                    Capa en visualización:
                  </p>
                  <p className="font-serif text-xl font-bold">{capa.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
