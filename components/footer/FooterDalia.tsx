'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, Instagram, MessageCircle, MapPin, Sparkles } from 'lucide-react';

export function FooterDalia() {
  return (
    <footer className="bg-dalia-chocolate text-dalia-cream pt-16 pb-12 px-6 md:px-16 border-t-4 border-dalia-strawberry relative overflow-hidden">
      {/* Detalle de luz tenue floral de fondo */}
      <div
        aria-hidden="true"
        className="absolute top-0 right-0 w-96 h-96 bg-dalia-strawberry/10 rounded-full blur-3xl pointer-events-none"
      />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          {/* Marca DALIA e Ideario */}
          <div className="md:col-span-5 space-y-4">
            <span className="font-serif text-3xl md:text-4xl font-bold tracking-[0.25em] text-white block">
              DALIA
            </span>
            <p className="font-handwritten text-2xl md:text-3xl text-dalia-rose">
              &ldquo;hecho para celebrar los momentos bonitos.&rdquo;
            </p>
            <p className="text-xs text-dalia-cream/70 font-light max-w-sm leading-relaxed">
              Pastelería y repostería artesanal en Tampico, Tamaulipas. Bizcochos aireados, compotas caseras de fruta de temporada y pasteles con alma.
            </p>
          </div>

          {/* Enlaces y Navegación Rápida */}
          <div className="md:col-span-3 space-y-3">
            <span className="text-xs uppercase font-bold tracking-widest text-dalia-rose block">
              Menú & Navegación
            </span>
            <ul className="space-y-2 text-xs font-light text-dalia-cream/80">
              <li>
                <Link href="/tienda" className="hover:text-dalia-strawberry transition-colors">
                  Nuestros Antojos (Tienda)
                </Link>
              </li>
              <li>
                <Link href="/pastel-personalizado" className="hover:text-dalia-strawberry transition-colors">
                  Tu pastel, a tu manera
                </Link>
              </li>
              <li>
                <a href="/#como-lo-hacemos" className="hover:text-dalia-strawberry transition-colors">
                  Así hacemos nuestros postres
                </a>
              </li>
              <li>
                <a href="/#ubicacion" className="hover:text-dalia-strawberry transition-colors">
                  Horarios y Cómo Llegar
                </a>
              </li>
            </ul>
          </div>

          {/* Redes y Contacto Cercano */}
          <div className="md:col-span-4 space-y-4">
            <span className="text-xs uppercase font-bold tracking-widest text-dalia-rose block">
              Platiquemos Bonito
            </span>
            <div className="flex items-center gap-3">
              <a
                href="https://wa.me/528333186010?text=Hola%20Dalia%20Reposter%C3%ADa!%20Quiero%20informaci%C3%B3n"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp de Dalia Repostería"
                className="p-3 rounded-full bg-white/5 hover:bg-[#25D366] text-white transition-colors border border-white/10 flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="text-xs">833 318 60 10</span>
              </a>

              <a
                href="https://www.facebook.com/daliapasteleriatampico"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook Oficial de Pastelería Dalia Tampico"
                className="p-3 rounded-full bg-white/5 hover:bg-[#1877F2] text-white transition-colors border border-white/10 flex items-center gap-2"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span className="text-xs">Facebook</span>
              </a>
            </div>
            <p className="text-xs text-dalia-cream/70 leading-relaxed">
              <strong>Ubicación:</strong>{' '}
              <a
                href="https://maps.app.goo.gl/CYCMEUSUKLMjEZDN8"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-dalia-rose transition-colors underline decoration-dalia-rose/40 underline-offset-2"
              >
                Calle 0 #205 A, Col. Enrique Cárdenas González, 89309 Tampico, Tamps., México.
              </a><br />
              Atención directa y pedidos especiales para Tampico, Madero y Altamira.
            </p>
          </div>
        </div>

        {/* Cierre y Microanimación Final */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-dalia-cream/60 gap-4">
          <p>© {new Date().getFullYear()} Dalia Repostería. Todos los derechos reservados.</p>
          <div className="flex items-center gap-2 group cursor-default">
            <span className="text-[11px] text-dalia-rose">Horneado con</span>
            <Heart className="w-3.5 h-3.5 text-dalia-strawberry fill-dalia-strawberry animate-pulse" />
            <span className="text-[11px] text-dalia-rose">en Tampico, Tamps.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
