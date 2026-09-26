'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ProductCard } from '@/components/products/ProductCard';
import { useCartContext } from '@/components/layout/ClientLayout';
import { CATALOGO_DALIA_PRODUCTOS } from '@/lib/catalogoProductos';
import { Camera, Sparkles, ArrowRight } from 'lucide-react';

const CATEGORIAS_SHOWCASE = ['Destacados', 'Pasteles', 'Personalizados', 'Cupcakes'];

import { useEffect } from 'react';
import { ProductItem } from '@/types';

export function GaleriaProductosReales() {
  const [products, setProducts] = useState<ProductItem[]>(CATALOGO_DALIA_PRODUCTOS);
  const [activeTab, setActiveTab] = useState('Destacados');
  const { addProduct } = useCartContext();

  useEffect(() => {
    fetch('/api/admin/products')
      .then((res) => res.json())
      .then((data) => {
        if (data.products && Array.isArray(data.products)) {
          setProducts(data.products);
        }
      })
      .catch(() => {});
  }, []);

  const filteredProducts = products.filter((product) => {
    if (activeTab === 'Destacados') return product.isFeatured;
    if (activeTab === 'Pasteles') return product.category === 'Pasteles';
    if (activeTab === 'Personalizados') return product.category === 'Personalizados';
    if (activeTab === 'Cupcakes') return product.category === 'Cupcakes';
    return true;
  });

  return (
    <section 
      id="antojos-del-dia"
      aria-label="Galería de creaciones de Dalia Repostería"
      className="py-20 px-4 md:px-12 max-w-7xl mx-auto"
    >
      {/* Encabezado Editorial */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-6 border-b border-dalia-rose/30">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-dalia-blush rounded-full text-xs font-semibold text-dalia-strawberry uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Nuestra Vitrina Artesanal</span>
          </div>
          <h2 className="font-serif text-3xl md:text-5xl font-bold tracking-tight text-dalia-chocolate">
            Nuestras <span className="italic font-normal text-dalia-strawberry">creaciones</span> favoritas
          </h2>
          <p className="text-xs md:text-sm text-dalia-cocoa/80 font-light leading-relaxed">
            Cada pastel es una pieza artesanal única elaborada con betún suave, ingredientes nobles y acabados hechos a mano. Usa las flechas y puntos en cada tarjeta para apreciar los detalles desde distintos ángulos.
          </p>
        </div>

        {/* Pestañas de Filtrado Rápido */}
        <div className="flex flex-wrap items-center gap-2">
          {CATEGORIAS_SHOWCASE.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                  isActive
                    ? 'bg-dalia-chocolate text-white shadow-paper'
                    : 'bg-white text-dalia-chocolate border border-dalia-rose/30 hover:border-dalia-strawberry'
                }`}
              >
                {tab}
              </button>
            );
          })}

          <Link
            href="/tienda"
            className="px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider bg-dalia-blush text-dalia-strawberry hover:bg-dalia-strawberry hover:text-white transition-colors border border-dalia-rose/30 flex items-center gap-1.5"
          >
            <span>Ver Catálogo Completo ({CATALOGO_DALIA_PRODUCTOS.length})</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Grid de Productos con Carruseles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProducts.slice(0, 9).map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={(prod, variant) => addProduct(prod, variant)}
          />
        ))}
      </div>

      {/* Botón de Enlace al Menú Completo */}
      <div className="mt-14 text-center">
        <Link
          href="/tienda"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-dalia-chocolate hover:bg-dalia-strawberry text-white rounded-full text-xs font-semibold tracking-widest uppercase transition-all shadow-paper hover:shadow-paper-lg group"
        >
          <span>Explorar la Colección Completa en la Tienda</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  );
}
