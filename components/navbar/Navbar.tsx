'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, ShoppingBag, Sparkles, MessageCircle } from 'lucide-react';
import { MenuRecetario } from './MenuRecetario';

interface NavbarProps {
  cartCount?: number;
  onOpenCart?: () => void;
}

export function Navbar({ cartCount = 0, onOpenCart }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-dalia-cream/90 backdrop-blur-md border-b border-dalia-rose/30 transition-colors">
        <div className="max-w-7xl mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
          {/* Botón Menú Recetario */}
          <button
            onClick={() => setIsMenuOpen(true)}
            aria-label="Abrir menú recetario"
            className="flex items-center gap-2.5 px-4 py-2 rounded-full border border-dalia-rose/40 hover:bg-dalia-blush/60 text-dalia-chocolate transition-colors text-xs font-semibold tracking-wider uppercase"
          >
            <Menu className="w-4 h-4 text-dalia-strawberry" />
            <span className="hidden sm:inline">Recetario</span>
          </button>

          {/* Logotipo Central Emblemático DALIA con Escudo Oficial Recreado */}
          <Link
            href="/"
            className="flex items-center gap-3 group text-center"
            aria-label="Dalia Repostería Inicio"
          >
            <div className="relative w-11 h-11 rounded-full overflow-hidden border border-dalia-gold/50 shadow-sm flex-shrink-0">
              <img
                src="/assets/logos/logo_dalia.jpg"
                alt="Emblema Dalia Pastelería"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            </div>
            <div className="flex flex-col items-start text-left">
              <span className="font-serif text-xl md:text-2xl font-bold tracking-[0.2em] text-dalia-chocolate group-hover:text-dalia-strawberry transition-colors">
                DALIA
              </span>
              <span className="text-[8px] uppercase tracking-[0.25em] text-dalia-strawberry font-semibold -mt-1">
                Pastelería Artesanal · 833 318 60 10
              </span>
            </div>
          </Link>

          {/* Acciones de Cabecera: Personalizar & Pedido WhatsApp */}
          <div className="flex items-center gap-3">
            <Link
              href="/pastel-personalizado"
              className="hidden lg:flex items-center gap-1.5 px-4 py-2 bg-dalia-blush/80 hover:bg-dalia-strawberry hover:text-white text-dalia-chocolate rounded-full text-xs font-semibold tracking-wider uppercase transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-dalia-strawberry group-hover:text-white" />
              <span>Arma tu Pastel</span>
            </Link>

            <a
              href="https://wa.me/528333186010?text=Hola%20Dalia%20Reposter%C3%ADa!%20Quiero%20hacer%20un%20pedido%20o%20cotizaci%C3%B3n"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Pedir por WhatsApp a Dalia Repostería"
              className="px-4 py-2 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold tracking-wider uppercase shadow-sm transition-all flex items-center gap-2 hover:scale-105 active:scale-95"
            >
              <MessageCircle className="w-4 h-4 fill-white text-[#25D366]" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>
          </div>
        </div>
      </header>

      {/* Menú Desplegable Recetario */}
      <MenuRecetario
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        cartCount={cartCount}
        onOpenCart={onOpenCart}
      />
    </>
  );
}
