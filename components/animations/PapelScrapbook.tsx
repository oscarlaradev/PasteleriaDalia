'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface ScrapCard {
  title: string;
  note: string;
  price: string;
  image: string;
  tag: string;
  rotation: string;
  washiColor: string;
}

const scraps: ScrapCard[] = [
  {
    title: 'Pastel Baby Shower It is a Girl',
    note: 'Masa suave de vainilla con tonos rosa pastel, ositos y nubes de crema.',
    price: '$670 MXN',
    image: '/assets/productos_reales/its-a-girl_1.jpg',
    tag: 'Bienvenida mágica',
    rotation: '-rotate-1',
    washiColor: 'bg-dalia-blush',
  },
  {
    title: 'Pastel Corona Imperial & Rosetones',
    note: 'Tiara brillante, betún rosa empolvado y corazón dorado para celebrar bonito.',
    price: '$720 MXN',
    image: '/assets/productos_reales/carmen-corona_1.jpg',
    tag: 'El favorito de fiesta',
    rotation: 'rotate-1',
    washiColor: 'bg-dalia-rose/60',
  },
  {
    title: 'Pastel Comic 2D Cartoon Cake',
    note: 'Efecto dibujo animado trazado a mano con betún artesanal y suaves relieves en chocolate.',
    price: '$680 MXN',
    image: '/assets/productos_reales/cartoon-rosa_1.jpg',
    tag: 'Tendencia en taller',
    rotation: '-rotate-2',
    washiColor: 'bg-dalia-vanilla',
  },
];

export function PapelScrapbook() {
  return (
    <section
      aria-label="Notas y tarjetas del taller repostero"
      className="py-20 px-6 md:px-16 bg-dalia-vanilla/60 relative overflow-hidden"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-14 space-y-3">
          <span className="font-handwritten text-2xl text-dalia-strawberry">
            del recetario a la mesa
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-dalia-chocolate">
            Piezas de papel & <span className="italic font-normal text-dalia-strawberry">notas de cata</span>
          </h2>
          <p className="text-dalia-cocoa/80 text-sm md:text-base font-light">
            Como hojas sueltas sobre la mesa de trabajo de nuestra repostera.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {scraps.map((s, idx) => (
            <div
              key={s.title}
              className={`bg-white p-6 rounded-dalia-sm border border-dalia-rose/30 shadow-paper-lg transition-transform duration-500 hover:-translate-y-2 hover:rotate-0 relative ${s.rotation}`}
            >
              {/* Cinta adhesiva washi tape */}
              <div
                aria-hidden="true"
                className={`absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-5 ${s.washiColor} border border-dalia-rose/30 rotate-1 shadow-sm`}
              />

              <div className="relative h-56 rounded-lg overflow-hidden mb-4 border border-dalia-rose/20">
                <Image
                  src={s.image}
                  alt={s.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
                <span className="absolute bottom-2 left-2 px-2.5 py-0.5 bg-white/90 text-dalia-chocolate text-[10px] font-bold uppercase rounded-full tracking-wider">
                  {s.tag}
                </span>
              </div>

              <h3 className="font-serif text-xl font-bold text-dalia-chocolate mb-2">
                {s.title}
              </h3>

              <p className="font-handwritten text-lg text-dalia-cocoa/90 mb-4 leading-snug">
                &ldquo;{s.note}&rdquo;
              </p>

              <div className="pt-3 border-t border-dalia-rose/20 flex items-center justify-between">
                <span className="font-serif text-lg font-bold text-dalia-strawberry">
                  {s.price}
                </span>
                <Link
                  href="/tienda"
                  className="px-4 py-1.5 bg-dalia-blush hover:bg-dalia-strawberry hover:text-white text-dalia-chocolate text-xs font-semibold rounded-full transition-colors duration-200"
                >
                  Pedir antojo
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
