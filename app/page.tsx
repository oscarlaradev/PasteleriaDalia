'use client';

import React from 'react';
import { HeroEditorial } from '@/components/hero/HeroEditorial';
import { RecetaVisual } from '@/components/animations/RecetaVisual';
import { PastelDescubre } from '@/components/animations/PastelDescubre';
import { CambioAntojo } from '@/components/animations/CambioAntojo';
import { GaleriaProductosReales } from '@/components/home/GaleriaProductosReales';
import { PapelScrapbook } from '@/components/animations/PapelScrapbook';
import { CustomCakeBuilder } from '@/components/custom-cake/CustomCakeBuilder';
import { UbicacionSeccion } from '@/components/home/UbicacionSeccion';
import { useCartContext } from '@/components/layout/ClientLayout';

export default function HomePage() {
  const { addCustomCake } = useCartContext();

  return (
    <div className="w-full">
      {/* 1. Hero Editorial: Escena de repostería con DALIA en gran escala */}
      <HeroEditorial />

      {/* 2. Animación 04: Cambio de antojo dinámico (Pastel -> Cupcakes -> Tartas -> Bento) */}
      <CambioAntojo />

      {/* 3. Galería de Creaciones Reales del Obrador con Carruseles Multi-Toma */}
      <GaleriaProductosReales />

      {/* 3. Animación 01: Receta visual (Harina -> Mezcla -> Horno -> Decoración -> Dalia) */}
      <RecetaVisual />

      {/* 4. Animación 02: Pastel que se descubre capa por capa */}
      <PastelDescubre />

      {/* 5. Experiencia "Tu pastel, a tu manera": Configurador dinámico de pastel */}
      <CustomCakeBuilder onAddToCart={addCustomCake} />

      {/* 6. Animación 05: Piezas de papel y scrapbook artesanal */}
      <PapelScrapbook />

      {/* 7. Sección de Ubicación & Contacto con Google Maps */}
      <UbicacionSeccion />
    </div>
  );
}
