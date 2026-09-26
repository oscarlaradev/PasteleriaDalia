'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Sparkles } from 'lucide-react';
import { CartItem } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (cartId: string, delta: number) => void;
  onRemoveItem: (cartId: string) => void;
}

export function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
}: CartDrawerProps) {
  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryEstimated = subtotal > 600 ? 0 : 65; // Envío gratis en pedidos mayores a $600
  const total = subtotal + (items.length > 0 ? deliveryEstimated : 0);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Canasta de antojos Dalia"
      className="fixed inset-0 z-50 flex justify-end bg-dalia-chocolate/40 backdrop-blur-sm animate-fade-in"
    >
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-dalia-rose/30">
        {/* Cabecera */}
        <div className="p-6 border-b border-dalia-rose/30 flex items-center justify-between bg-dalia-cream">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-dalia-strawberry" />
            <h2 className="font-serif text-xl font-bold text-dalia-chocolate">
              Tu Canasta Dulce
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-dalia-blush text-dalia-chocolate font-bold">
              {items.length}
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar canasta"
            className="p-2 rounded-full hover:bg-dalia-blush transition-colors text-dalia-chocolate"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lista de Productos */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 rounded-full bg-dalia-blush flex items-center justify-center mx-auto text-dalia-strawberry text-2xl">
                ♡
              </div>
              <p className="font-serif text-xl font-bold text-dalia-chocolate">
                Tu canasta aún está vacía
              </p>
              <p className="text-xs text-dalia-cocoa/70 max-w-xs mx-auto">
                Explora nuestros pasteles, tartas y galletas recién horneadas para llenar de dulzura tu día.
              </p>
              <button
                onClick={onClose}
                className="mt-4 px-6 py-2.5 bg-dalia-strawberry hover:bg-dalia-chocolate text-white text-xs font-semibold rounded-full uppercase tracking-wider transition-colors"
              >
                Ver antojos disponibles
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.cartId}
                className="p-4 rounded-dalia-sm border border-dalia-rose/30 bg-dalia-vanilla/40 flex gap-4 items-center"
              >
                <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-dalia-rose/20">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xs font-bold text-dalia-chocolate truncate">
                      {item.name}
                    </h3>
                    <button
                      onClick={() => onRemoveItem(item.cartId)}
                      aria-label={`Eliminar ${item.name} del carrito`}
                      className="text-dalia-cocoa/40 hover:text-dalia-cherry p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {item.selectedVariant && (
                    <span className="text-[10px] text-dalia-strawberry block">
                      {item.selectedVariant}
                    </span>
                  )}

                  {item.isCustomCake && item.customCakeDetails && (
                    <div className="text-[10px] text-dalia-cocoa/70 space-y-0.5 mt-0.5">
                      <p>Bizcocho: {item.customCakeDetails.spongeFlavor}</p>
                      <p>Relleno: {item.customCakeDetails.filling}</p>
                      {item.customCakeDetails.customText && (
                        <p className="italic font-handwritten text-xs text-dalia-strawberry">
                          &ldquo;{item.customCakeDetails.customText}&rdquo;
                        </p>
                      )}
                    </div>
                  )}

                  <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center gap-2 border border-dalia-rose/40 rounded-full px-2 py-0.5 bg-white">
                      <button
                        onClick={() => onUpdateQuantity(item.cartId, -1)}
                        className="text-dalia-chocolate hover:text-dalia-strawberry p-0.5"
                        aria-label="Disminuir cantidad"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold w-4 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.cartId, 1)}
                        className="text-dalia-chocolate hover:text-dalia-strawberry p-0.5"
                        aria-label="Aumentar cantidad"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="text-xs font-serif font-bold text-dalia-chocolate">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Resumen y Botón de Pago */}
        {items.length > 0 && (
          <div className="p-6 border-t border-dalia-rose/30 bg-dalia-cream space-y-3">
            <div className="flex justify-between text-xs text-dalia-cocoa">
              <span>Subtotal</span>
              <span className="font-semibold text-dalia-chocolate">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-xs text-dalia-cocoa">
              <span>Envío local estimado</span>
              <span className="font-semibold text-dalia-chocolate">
                {deliveryEstimated === 0 ? 'Gratis' : formatCurrency(deliveryEstimated)}
              </span>
            </div>
            <div className="flex justify-between text-sm font-bold border-t border-dalia-rose/20 pt-2 text-dalia-chocolate">
              <span>Total Estimado</span>
              <span className="font-serif text-xl text-dalia-chocolate">{formatCurrency(total)}</span>
            </div>

            <Link
              href="/checkout"
              onClick={onClose}
              className="w-full py-3.5 bg-dalia-chocolate hover:bg-dalia-strawberry text-white rounded-full font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-paper"
            >
              <span>Proceder al Pago</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <p className="text-[10px] text-center text-dalia-cocoa/60">
              Entrega a domicilio y retiro en tienda disponibles en el checkout.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
