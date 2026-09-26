'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { MessageCircle, ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';
import { ProductItem } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { getCanonicalProductPrice } from '@/lib/canonicalPricing';

interface ProductCardProps {
  product: ProductItem;
  onAddToCart?: (product: ProductItem, selectedVariant?: string) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<string | undefined>(
    product.variants && product.variants.length > 0 ? product.variants[0].name : undefined
  );
  const [isAdded, setIsAdded] = useState(false);

  // Lista de imágenes (soporta múltiples tomas del mismo pastel)
  const imageList = product.images && product.images.length > 0 
    ? product.images 
    : [product.imageUrl];
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);

  const activeVariantObj = product.variants?.find((v) => v.name === selectedVariant);
  const currentPrice = product.price + (activeVariantObj?.priceDelta || 0);

  const handleWhatsAppOrder = () => {
    // Blindaje canónico: verificamos contra el catálogo oficial inmutable
    const canonical = getCanonicalProductPrice(product.id, selectedVariant);
    const officialPrice = canonical.verified ? canonical.price : currentPrice;

    const text = encodeURIComponent(
      `¡Hola Dalia Repostería! 🌸\n` +
      `Me gustaría hacer un pedido de este pastel visto en su página:\n\n` +
      `🎂 *${product.name}*\n` +
      `🏷️ Categoría: ${product.category}\n` +
      `📏 Tamaño / Porción: ${selectedVariant || 'Estándar'}\n` +
      `💰 Precio: ${formatCurrency(officialPrice)}\n` +
      (product.tastingNotes ? `✨ Detalle: ${product.tastingNotes}\n` : '') +
      `\n¿Tienen disponibilidad en agenda para entrega o retiro en su obrador de Tampico? ¡Muchas gracias!`
    );
    window.open(`https://wa.me/528333186010?text=${text}`, '_blank');
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentImageIndex((prev) => (prev === 0 ? imageList.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentImageIndex((prev) => (prev === imageList.length - 1 ? 0 : prev + 1));
  };

  const currentSrc = imageList[currentImageIndex] || product.imageUrl;

  return (
    <>
      <article
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group bg-white rounded-dalia p-5 border border-dalia-rose/30 shadow-paper hover:shadow-paper-lg transition-all duration-500 flex flex-col justify-between relative"
      >
        {/* Contenedor Fotográfico con Carrusel Multi-Toma */}
        <div className="relative h-64 w-full rounded-dalia-sm overflow-hidden mb-4 bg-dalia-vanilla border border-dalia-rose/20 select-none group/img">
          <Image
            src={currentSrc}
            alt={`${product.name} - toma ${currentImageIndex + 1}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            priority={product.isFeatured}
          />

          {/* Badge Sutil de Horneo / Favorito */}
          <div className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-bold tracking-wider uppercase text-dalia-chocolate border border-dalia-rose/30 shadow-sm pointer-events-none z-10">
            {product.isFeatured ? 'Favorito Dalia ♡' : 'Artesanal'}
          </div>

          {/* Contador de Fotos si tiene más de una imagen */}
          {imageList.length > 1 && (
            <div className="absolute top-3 right-3 px-2.5 py-0.5 bg-dalia-chocolate/80 backdrop-blur-md rounded-full text-[10px] font-semibold text-white tracking-wider flex items-center gap-1 z-10 border border-white/20">
              <span>{currentImageIndex + 1}/{imageList.length} fotos</span>
            </div>
          )}

          {/* Botón para ver foto en grande */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowLightbox(true);
            }}
            title="Ver foto en alta resolución"
            className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white/90 hover:bg-dalia-chocolate hover:text-white text-dalia-chocolate shadow-sm flex items-center justify-center transition-all z-10 opacity-0 group-hover/img:opacity-100 focus:opacity-100"
            aria-label={`Ver foto en grande de ${product.name}`}
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>

          {/* Flechas de navegación de carrusel (si hay más de 1 toma) */}
          {imageList.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrevImage}
                aria-label="Toma anterior"
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-dalia-chocolate shadow-md flex items-center justify-center transition-all duration-200 opacity-90 hover:scale-110 z-10"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNextImage}
                aria-label="Siguiente toma"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-dalia-chocolate shadow-md flex items-center justify-center transition-all duration-200 opacity-90 hover:scale-110 z-10"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Puntos / Dots del carrusel */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-2 py-1 bg-dalia-chocolate/60 backdrop-blur-sm rounded-full z-10">
                {imageList.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex(idx);
                    }}
                    aria-label={`Ver toma ${idx + 1}`}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      currentImageIndex === idx
                        ? 'w-5 bg-dalia-rose'
                        : 'w-2 bg-white/60 hover:bg-white'
                    }`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Frase Secreta de Cata revelada suavemente en Hover cuando no hay carrusel activo */}
          {imageList.length === 1 && (
            <div
              className={`absolute inset-x-3 bottom-3 p-2.5 bg-dalia-chocolate/85 backdrop-blur-md rounded-lg text-white text-xs transition-opacity duration-300 ${
                isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              <p className="font-handwritten text-base leading-none text-dalia-rose">
                &ldquo;{product.tastingNotes || 'Elaborado con amor e ingredientes de rancho'}&rdquo;
              </p>
            </div>
          )}
        </div>

        {/* Información del Producto */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-widest text-dalia-strawberry">
                {product.category}
              </span>
              <span className="font-serif text-lg font-bold text-dalia-chocolate">
                {formatCurrency(currentPrice)}
              </span>
            </div>

            <h3 className="font-serif text-xl font-bold text-dalia-chocolate mb-2 group-hover:text-dalia-strawberry transition-colors">
              {product.name}
            </h3>

            <p className="text-xs text-dalia-cocoa/80 leading-relaxed line-clamp-2 mb-4 font-light">
              {product.shortDesc || product.description}
            </p>
          </div>

          {/* Variantes si existen */}
          {product.variants && product.variants.length > 1 && (
            <div className="mb-4">
              <span className="text-[10px] uppercase font-bold tracking-wider text-dalia-cocoa/60 block mb-1.5">
                Tamaño / Porciones:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {product.variants.map((v) => (
                  <button
                    key={v.name}
                    type="button"
                    onClick={() => setSelectedVariant(v.name)}
                    className={`text-[11px] px-2.5 py-1 rounded-full border transition-all ${
                      selectedVariant === v.name
                        ? 'bg-dalia-chocolate text-white border-dalia-chocolate'
                        : 'bg-dalia-vanilla/60 text-dalia-chocolate border-dalia-rose/30 hover:border-dalia-strawberry'
                    }`}
                  >
                    {v.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Botón de Pedir por WhatsApp */}
          <button
            type="button"
            onClick={handleWhatsAppOrder}
            className="w-full py-3 rounded-full text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 transition-all duration-300 shadow-sm bg-[#25D366] hover:bg-[#1EBE5D] text-white hover:shadow-paper-lg active:scale-95"
          >
            <MessageCircle className="w-4 h-4 fill-white text-[#25D366]" />
            <span>Pedir por WhatsApp</span>
          </button>
        </div>
      </article>

      {/* Modal Lightbox para ver la foto real en alta resolución */}
      {showLightbox && (
        <div 
          className="fixed inset-0 z-50 bg-dalia-chocolate/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setShowLightbox(false)}
        >
          <div 
            className="relative max-w-3xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl p-4 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-dalia-rose/30">
              <div>
                <h4 className="font-serif text-lg font-bold text-dalia-chocolate">{product.name}</h4>
                <p className="text-xs text-dalia-cocoa">
                  Foto {currentImageIndex + 1} de {imageList.length} • Detalle artesanal
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowLightbox(false)}
                className="w-8 h-8 rounded-full bg-dalia-vanilla text-dalia-chocolate flex items-center justify-center hover:bg-dalia-rose/40"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative h-[65vh] w-full my-3 rounded-xl overflow-hidden bg-dalia-vanilla">
              <Image
                src={currentSrc}
                alt={product.name}
                fill
                className="object-contain"
              />

              {imageList.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-dalia-chocolate shadow-lg flex items-center justify-center text-lg"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-dalia-chocolate shadow-lg flex items-center justify-center text-lg"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            {imageList.length > 1 && (
              <div className="flex items-center justify-center gap-2 pt-2 border-t border-dalia-rose/20">
                {imageList.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`relative w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                      currentImageIndex === idx ? 'border-dalia-strawberry scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Pie del Lightbox con Botón de WhatsApp */}
            <div className="pt-3 border-t border-dalia-rose/30 flex flex-col sm:flex-row items-center justify-between gap-3 mt-2">
              <div>
                <span className="text-[10px] uppercase font-bold text-dalia-cocoa/60 tracking-wider">Inversión:</span>
                <span className="font-serif text-xl font-bold text-dalia-chocolate">{formatCurrency(currentPrice)}</span>
              </div>
              <button
                type="button"
                onClick={handleWhatsAppOrder}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#25D366] hover:bg-[#1EBE5D] text-white flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95"
              >
                <MessageCircle className="w-4 h-4 fill-white text-[#25D366]" />
                <span>Pedir este pastel por WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

