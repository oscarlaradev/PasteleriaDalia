'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ProductCard } from '@/components/products/ProductCard';
import { useCartContext } from '@/components/layout/ClientLayout';
import { CATALOGO_DALIA_PRODUCTOS } from '@/lib/catalogoProductos';
import { Sparkles, Search, SlidersHorizontal, Camera, Cake, PhoneCall } from 'lucide-react';

const categorias = ['Todos', 'Pasteles', 'Personalizados', 'Cupcakes'];

export default function TiendaPage() {
  const [products, setProducts] = useState(CATALOGO_DALIA_PRODUCTOS);
  const [selectedCat, setSelectedCat] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const { addProduct } = useCartContext();

  React.useEffect(() => {
    fetch('/api/admin/products')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data);
        }
      })
      .catch(() => {});
  }, []);

  const filtered = products.filter((p) => {
    const matchesCat = selectedCat === 'Todos' || p.category === selectedCat;
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.tastingNotes && p.tastingNotes.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="py-10 md:py-16 px-4 md:px-12 max-w-7xl mx-auto">
      {/* Banner de Marca Dalia Repostería con Banner Real Mejorado */}
      <div className="relative rounded-3xl overflow-hidden mb-12 shadow-paper-lg border border-dalia-rose/30 bg-dalia-cream">
        <div className="relative w-full h-48 md:h-64">
          <Image
            src="/assets/logos/banner_logo.jpg"
            alt="Dalia Repostería - Pasteles y Cupcakes"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-dalia-chocolate/85 via-dalia-chocolate/50 to-transparent flex items-center p-6 md:p-12">
            <div className="max-w-xl text-white space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[11px] font-semibold tracking-widest uppercase">
                <Sparkles className="w-3.5 h-3.5 text-dalia-rose" />
                <span>Colección de la Casa</span>
              </div>
              <h1 className="font-serif text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight">
                Nuestros <span className="italic font-normal text-dalia-rose">pasteles</span> y antojos
              </h1>
              <p className="text-white/90 text-xs md:text-sm font-light leading-relaxed">
                Cada creación es horneada y decorada con betún artesanal en nuestra pastelería en Tampico. Explora los detalles y distintas vistas de cada diseño deslizando las imágenes.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Barra de Filtros, Categorías & Buscador */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-dalia-rose/30">
        {/* Categorías */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {categorias.map((cat) => {
            const isActive = selectedCat === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                  isActive
                    ? 'bg-dalia-chocolate text-white shadow-paper'
                    : 'bg-white text-dalia-chocolate border border-dalia-rose/30 hover:border-dalia-strawberry'
                }`}
              >
                {cat}
                {cat === 'Todos' && ` (${products.length})`}
              </button>
            );
          })}

          <Link
            href="/pastel-personalizado"
            className="px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-dalia-blush text-dalia-strawberry hover:bg-dalia-strawberry hover:text-white transition-colors border border-dalia-rose/30 flex items-center gap-1.5 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Crear a Medida</span>
          </Link>
        </div>

        {/* Buscador */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-dalia-cocoa/50" />
          <input
            type="text"
            placeholder="Buscar temática, sabor o antojo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white rounded-full border border-dalia-rose/30 text-xs text-dalia-chocolate placeholder:text-dalia-cocoa/50 focus:border-dalia-strawberry focus:outline-none shadow-sm"
          />
        </div>
      </div>

      {/* Grid de Productos con Carruseles Multi-Toma */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 space-y-4 bg-white rounded-3xl p-8 border border-dalia-rose/20">
          <Cake className="w-12 h-12 text-dalia-rose mx-auto" />
          <p className="font-serif text-2xl font-bold text-dalia-chocolate">
            No encontramos creaciones con esa búsqueda
          </p>
          <p className="text-xs text-dalia-cocoa/70 max-w-md mx-auto">
            ¿Buscas una temática en particular que no ves aquí? Podemos crear cualquier diseño en betún artesanal.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setSelectedCat('Todos');
                setSearchTerm('');
              }}
              className="px-5 py-2.5 bg-dalia-strawberry text-white text-xs font-semibold rounded-full uppercase shadow-sm"
            >
              Ver todos los productos
            </button>
            <a
              href="https://wa.me/528333186010?text=Hola%20Dalia%20Reposter%C3%ADa!%20Busco%20un%20dise%C3%B1o%20especial"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-full uppercase flex items-center gap-1.5 shadow-sm"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Cotizar por WhatsApp</span>
            </a>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              onAddToCart={(product, variant) => addProduct(product, variant)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
