// Catálogo Canónico y Fuente de Verdad para Precios Oficiales de Dalia Repostería
// Protegido contra manipulación de DOM / DevTools
import { CATALOGO_DALIA_PRODUCTOS } from './catalogoProductos';

export function getCanonicalProductPrice(
  productIdOrSlug: string,
  variantName?: string
): { verified: boolean; price: number; name: string } {
  const product = CATALOGO_DALIA_PRODUCTOS.find(
    (p) => p.id === productIdOrSlug || p.slug === productIdOrSlug
  );

  if (!product) {
    return { verified: false, price: 0, name: 'Producto no identificado' };
  }

  let finalPrice = product.price;

  if (variantName && product.variants) {
    const variant = product.variants.find((v) => v.name === variantName);
    if (variant) {
      finalPrice += variant.priceDelta;
    }
  }

  return { verified: true, price: finalPrice, name: product.name };
}
