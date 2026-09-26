'use client';

import React from 'react';
import { CustomCakeBuilder } from '@/components/custom-cake/CustomCakeBuilder';
import { useCartContext } from '@/components/layout/ClientLayout';
import { Clock, ShieldCheck, Heart } from 'lucide-react';

export default function PastelPersonalizadoPage() {
  const { addCustomCake } = useCartContext();

  return (
    <div className="py-8 md:py-14">
      {/* Cabecera Informativa de Políticas Artesanales */}
      <div className="max-w-4xl mx-auto px-6 mb-8 text-center space-y-3">
        <div className="flex flex-wrap items-center justify-center gap-6 py-4 px-6 bg-white/70 rounded-dalia border border-dalia-rose/30 text-xs text-dalia-cocoa shadow-paper">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-dalia-strawberry" />
            <span>Mínimo 48 horas de anticipación</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-dalia-strawberry" />
            <span>Ingredientes selectos y frescos</span>
          </div>
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-dalia-strawberry" />
            <span>Decorado artesanalmente a mano</span>
          </div>
        </div>
      </div>

      <CustomCakeBuilder onAddToCart={addCustomCake} />
    </div>
  );
}
