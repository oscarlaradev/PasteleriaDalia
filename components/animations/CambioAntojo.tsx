'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Antojo {
  id: string;
  categoryName: string;
  headline: string;
  lead: string;
  image: string;
  priceTag: string;
  tastingNote: string;
  bgTint: string;
  composition: 'left-heavy' | 'centered-tall' | 'right-heavy' | 'split-card';
}

const antojos: Antojo[] = [
  {
    id: 'pasteles',
    categoryName: 'PASTELES DE AUTOR',
    headline: 'Pétalos al óleo & Mariposas',
    lead: 'Capas esponjosas con betún artesanal y mariposas delicadas. (No manejamos Fondant).',
    image: '/assets/productos_reales/mariposas_1.jpg',
    priceTag: 'Desde $650 MXN',
    tastingNote: 'Relleno de mermelada fresa-piña o chocolate chantilly',
    bgTint: 'bg-[#FFFDF9]',
    composition: 'left-heavy',
  },
  {
    id: 'cupcakes',
    categoryName: 'CUPCAKES DE FIESTA',
    headline: 'Copetes esponjosos y Minions',
    lead: 'Cajas de 6 o 12 cupcakes suaves decorados individualmente con personajes y betún.',
    image: '/assets/productos_reales/cupcakes-minions_1.jpg',
    priceTag: 'Caja 6 pzas $360 MXN',
    tastingNote: 'Vainilla y chocolate con chispas de cacao',
    bgTint: 'bg-[#FAF6F0]',
    composition: 'right-heavy',
  },
  {
    id: 'tematicos',
    categoryName: 'PASTELES TEMÁTICOS',
    headline: 'Dragon Ball, Mario Galaxy & Series',
    lead: 'Diseños temáticos con esferas del dragón, estrellas cósmicas y acabado en betún.',
    image: '/assets/productos_reales/dragon-ball_1.jpg',
    priceTag: 'Desde $680 MXN',
    tastingNote: 'Bizcocho húmedo de cacao con esferas ámbar artesanales',
    bgTint: 'bg-[#FDF8F9]',
    composition: 'split-card',
  },
  {
    id: 'cute',
    categoryName: 'CUTE & BENTO CAKES',
    headline: 'Un detalle tierno para celebrar bonito',
    lead: 'Olanes en betún lila, tiernos gatitos y Hello Kitty en presentaciones irresistibles.',
    image: '/assets/productos_reales/gato-morado_1.jpg',
    priceTag: 'Desde $580 MXN',
    tastingNote: 'Vainilla suave con relleno de crema pastelera casera',
    bgTint: 'bg-[#FAF6F0]',
    composition: 'centered-tall',
  },
];

export function CambioAntojo() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const current = antojos[selectedIdx];

  return (
    <section
      id="antojos-del-dia"
      aria-label="Selección de antojos artesanales de Dalia"
      className="py-20 px-6 md:px-16 bg-dalia-cream border-t border-dalia-rose/30"
    >
      <div className="max-w-6xl mx-auto">
        {/* Barra de Navegación Editorial de Antojos */}
        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 mb-12">
          {antojos.map((item, idx) => {
            const isActive = selectedIdx === idx;
            return (
              <button
                key={item.id}
                onClick={() => setSelectedIdx(idx)}
                className={`px-5 py-2.5 rounded-full text-xs md:text-sm font-semibold tracking-wider transition-all duration-300 ${
                  isActive
                    ? 'bg-dalia-chocolate text-white shadow-paper'
                    : 'bg-white text-dalia-chocolate border border-dalia-rose/30 hover:border-dalia-strawberry'
                }`}
              >
                {item.categoryName}
              </button>
            );
          })}
        </div>

        {/* Bloque de Composición Editorial Específica */}
        <div
          key={current.id}
          className={`${current.bgTint} p-8 md:p-14 rounded-dalia-lg border border-dalia-rose/30 shadow-paper-lg grid grid-cols-1 lg:grid-cols-12 gap-8 items-center transition-all duration-500`}
        >
          {/* Columna de Texto Editorial */}
          <div className="lg:col-span-6 space-y-6 order-2 lg:order-1">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold tracking-widest text-dalia-strawberry uppercase">
                {current.categoryName}
              </span>
              <span className="w-8 h-px bg-dalia-rose" />
              <span className="text-xs font-semibold text-dalia-chocolate px-2.5 py-0.5 bg-dalia-blush rounded-full">
                {current.priceTag}
              </span>
            </div>

            <h3 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-dalia-chocolate leading-tight">
              {current.headline}
            </h3>

            <p className="text-dalia-cocoa/90 text-base md:text-lg font-light leading-relaxed">
              {current.lead}
            </p>

            <div className="p-4 bg-white/70 rounded-dalia-sm border border-dalia-rose/20">
              <span className="text-[11px] font-bold text-dalia-strawberry uppercase tracking-wider block mb-1">
                Perfil de Sabor:
              </span>
              <p className="font-handwritten text-xl text-dalia-chocolate">
                {current.tastingNote}
              </p>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                href="/tienda"
                className="px-6 py-3 bg-dalia-strawberry hover:bg-dalia-chocolate text-white rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 shadow-paper"
              >
                Ver en la tienda
              </Link>
              <Link
                href="/pastel-personalizado"
                className="px-6 py-3 bg-white hover:bg-dalia-blush text-dalia-chocolate border border-dalia-rose/40 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300"
              >
                Personalizar a tu gusto
              </Link>
            </div>
          </div>

          {/* Columna de Imagen Gastronómica */}
          <div className="lg:col-span-6 order-1 lg:order-2">
            <div className="relative h-[340px] md:h-[420px] rounded-dalia overflow-hidden border-4 border-white shadow-paper-float">
              <Image
                src={current.image}
                alt={current.headline}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority
              />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3.5 py-1.5 rounded-full text-xs font-serif font-bold text-dalia-chocolate border border-dalia-rose/30 shadow-sm">
                Horneado Hoy ♡
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
