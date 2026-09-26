'use client';

import React, { createContext, useContext } from 'react';
import { SmoothScrollProvider } from '@/components/animations/SmoothScrollProvider';
import { Migajitas } from '@/components/animations/Migajitas';
import { Navbar } from '@/components/navbar/Navbar';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { FooterDalia } from '@/components/footer/FooterDalia';
import { useCart } from '@/hooks/useCart';
import { CartItem, ProductItem, CustomCakeState } from '@/types';
import { MessageCircle } from 'lucide-react';

interface CartContextType {
  items: CartItem[];
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  addProduct: (product: ProductItem, selectedVariant?: string) => void;
  addCustomCake: (cake: CustomCakeState) => void;
  updateQuantity: (cartId: string, delta: number) => void;
  removeItem: (cartId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function useCartContext() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCartContext debe usarse dentro de ClientLayout');
  return ctx;
}

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const cart = useCart();
  const totalQuantity = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={cart}>
      <SmoothScrollProvider>
        {/* Animación 03: Migajitas orgánicas flotantes */}
        <Migajitas />

        <Navbar
          cartCount={totalQuantity}
          onOpenCart={() => cart.setIsDrawerOpen(true)}
        />

        <main id="contenido-principal">{children}</main>

        {/* Botón Flotante Permanente de WhatsApp para Atención Directa */}
        <aside aria-label="Contacto directo por WhatsApp" className="fixed bottom-6 right-6 z-50">
          <a
            href="https://wa.me/528333186010?text=¡Hola%20Dalia%20Reposter%C3%ADa!%20🌸%20Quiero%20hacer%20un%20pedido%20o%20cotizaci%C3%B3n%20para%20un%20evento."
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Escribir por WhatsApp a Dalia Repostería"
            className="group flex items-center gap-2.5 px-4 py-3 bg-[#25D366] hover:bg-[#1EBE5D] text-white rounded-full shadow-2xl hover:shadow-green-500/30 transition-all duration-300 hover:scale-105 active:scale-95 border-2 border-white/40"
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
            </span>
            <MessageCircle className="w-5 h-5 fill-white text-[#25D366]" />
            <span className="text-xs font-bold tracking-wider uppercase hidden sm:inline">
              Pedir por WhatsApp
            </span>
          </a>
        </aside>

        <FooterDalia />
      </SmoothScrollProvider>
    </CartContext.Provider>
  );
}
