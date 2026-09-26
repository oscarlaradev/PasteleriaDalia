'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, MessageCircle, Sparkles, Heart } from 'lucide-react';

interface MenuRecetarioProps {
  isOpen: boolean;
  onClose: () => void;
  cartCount?: number;
  onOpenCart?: () => void;
}

const secciones = [
  { name: 'Nuestros Antojos (Tienda)', href: '/tienda', note: 'Pasteles, galletas y bocados' },
  { name: 'Tu Pastel, a tu manera', href: '/pastel-personalizado', note: 'Elige bizcocho, relleno y diseño' },
  { name: 'Así lo Hacemos', href: '/#como-lo-hacemos', note: 'El secreto artesanal de nuestro obrador' },
  { name: 'Cajas & Regalos', href: '/tienda?categoria=cajas', note: 'Con lazo de tela y tarjeta escrita' },
  { name: 'Ven a Visitarnos', href: '/#ubicacion', note: 'Calle 0 #205 A, Col. Enrique Cárdenas, Tampico' },
];

export function MenuRecetario({ isOpen, onClose, cartCount, onOpenCart }: MenuRecetarioProps) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Menú estilo recetario Dalia"
      className="fixed inset-0 z-50 flex justify-end bg-dalia-chocolate/40 backdrop-blur-sm animate-fade-in"
    >
      <div
        className="w-full max-w-md bg-[#FFFDF9] h-full shadow-2xl p-8 md:p-10 flex flex-col justify-between border-l-2 border-dalia-rose/40 relative overflow-y-auto"
        style={{
          backgroundImage: 'radial-gradient(#E8B6BF 0.5px, transparent 0.5px)',
          backgroundSize: '20px 20px',
        }}
      >
        {/* Cabecera del Recetario */}
        <div>
          <div className="flex items-center justify-between pb-6 border-b border-dalia-rose/30 mb-8">
            <div className="flex items-center gap-2">
              <span className="font-serif text-2xl font-bold tracking-widest text-dalia-chocolate">
                DALIA
              </span>
              <span className="text-xs px-2 py-0.5 bg-dalia-blush text-dalia-strawberry rounded-full font-semibold">
                Índice
              </span>
            </div>
            <button
              onClick={onClose}
              aria-label="Cerrar menú"
              className="p-2 rounded-full hover:bg-dalia-blush transition-colors text-dalia-chocolate"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <p className="text-xs uppercase tracking-widest text-dalia-cocoa/60 font-semibold mb-6">
            Páginas del taller:
          </p>

          {/* Enlaces Escalonados Estilo Recetario */}
          <nav className="space-y-5">
            {secciones.map((sec, idx) => (
              <Link
                key={sec.href}
                href={sec.href}
                onClick={onClose}
                className="group block p-3.5 rounded-dalia-sm transition-all duration-300 hover:bg-dalia-blush/60 border border-transparent hover:border-dalia-rose/30"
              >
                <div className="flex items-center justify-between">
                  <span className="font-serif text-lg md:text-xl font-bold text-dalia-chocolate group-hover:text-dalia-strawberry transition-colors">
                    0{idx + 1}. {sec.name}
                  </span>
                  <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity text-dalia-strawberry font-bold">
                    →
                  </span>
                </div>
                <span className="text-xs text-dalia-cocoa/70 font-light block mt-0.5">
                  {sec.note}
                </span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Pie de Recetario con Botón Directo a WhatsApp */}
        <div className="pt-8 border-t border-dalia-rose/30 space-y-4">
          <a
            href="https://wa.me/528333186010?text=Hola%20Dalia%20Reposter%C3%ADa!%20Quiero%20hacer%20un%20pedido%20o%20cotizar%20un%20pastel"
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="w-full py-3.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white rounded-full font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all shadow-paper active:scale-95"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>Pedir por WhatsApp (833 318 60 10)</span>
          </a>

          <p className="font-handwritten text-center text-xl text-dalia-cocoa">
            &ldquo;Hecho a mano cada mañana con mucho cariño ♡&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
}
