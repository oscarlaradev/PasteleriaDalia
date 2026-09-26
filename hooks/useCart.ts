'use client';

import { useState, useEffect } from 'react';
import { CartItem, ProductItem, CustomCakeState } from '@/types';

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Cargar estado inicial desde localStorage si existe
  useEffect(() => {
    try {
      const stored = localStorage.getItem('dalia_cart');
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('No se pudo acceder al almacenamiento local del carrito', e);
    }
  }, []);

  // Guardar cambios en localStorage
  useEffect(() => {
    try {
      localStorage.setItem('dalia_cart', JSON.stringify(items));
    } catch (e) {
      console.warn('Error al guardar carrito en localStorage', e);
    }
  }, [items]);

  const addProduct = (product: ProductItem, selectedVariant?: string) => {
    const variantObj = product.variants?.find((v) => v.name === selectedVariant);
    const unitPrice = product.price + (variantObj?.priceDelta || 0);
    const cartId = `${product.id}-${selectedVariant || 'default'}`;

    setItems((prev) => {
      const existingIdx = prev.findIndex((i) => i.cartId === cartId);
      if (existingIdx > -1) {
        const next = [...prev];
        next[existingIdx].quantity += 1;
        return next;
      }
      return [
        ...prev,
        {
          cartId,
          productId: product.id,
          name: product.name,
          price: unitPrice,
          quantity: 1,
          imageUrl: product.imageUrl,
          selectedVariant,
        },
      ];
    });

    setIsDrawerOpen(true);
  };

  const addCustomCake = (cake: CustomCakeState) => {
    const cartId = `custom-cake-${Date.now()}`;
    setItems((prev) => [
      ...prev,
      {
        cartId,
        name: `Pastel Personalizado (${cake.size})`,
        price: cake.calculatedPrice,
        quantity: cake.quantity || 1,
        imageUrl: '/assets/images/cake_cross_section.jpg',
        isCustomCake: true,
        customCakeDetails: cake,
      },
    ]);

    setIsDrawerOpen(true);
  };

  const updateQuantity = (cartId: string, delta: number) => {
    setItems((prev) => {
      return prev
        .map((item) => {
          if (item.cartId === cartId) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const removeItem = (cartId: string) => {
    setItems((prev) => prev.filter((i) => i.cartId !== cartId));
  };

  const clearCart = () => {
    setItems([]);
  };

  return {
    items,
    isDrawerOpen,
    setIsDrawerOpen,
    addProduct,
    addCustomCake,
    updateQuantity,
    removeItem,
    clearCart,
  };
}
