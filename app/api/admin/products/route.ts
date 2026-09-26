import { NextRequest, NextResponse } from 'next/server';
import { getProductsData, getProductsDataAsync, saveProductsData } from '@/lib/cmsData';
import { ProductItem } from '@/types';

// 1. Obtener listado de productos
export async function GET() {
  const products = await getProductsDataAsync();
  return NextResponse.json({ success: true, count: products.length, products });
}

// 2. Crear nuevo producto
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.name || !body.price) {
      return NextResponse.json({ error: 'Nombre y precio son obligatorios.' }, { status: 400 });
    }

    const products = getProductsData();
    const cleanSlug = (body.slug || body.name)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const newId = body.id || cleanSlug || `prod-${Date.now()}`;

    // Validar duplicados de ID o slug
    const exists = products.some((p) => p.id === newId || p.slug === cleanSlug);
    const finalSlug = exists ? `${cleanSlug}-${Date.now().toString().slice(-4)}` : cleanSlug;
    const finalId = exists ? `${newId}-${Date.now().toString().slice(-4)}` : newId;

    const newProduct: ProductItem = {
      id: finalId,
      slug: finalSlug,
      name: body.name.trim(),
      category: body.category || 'Pasteles',
      price: Number(body.price),
      shortDesc: body.shortDesc || '',
      description: body.description || body.shortDesc || '',
      tastingNotes: body.tastingNotes || '',
      imageUrl: body.imageUrl || '/assets/productos_reales/mariposas_1.jpg',
      secondaryImg: body.secondaryImg || (body.images && body.images[1]) || undefined,
      images: body.images && Array.isArray(body.images) && body.images.length > 0 
        ? body.images 
        : [body.imageUrl || '/assets/productos_reales/mariposas_1.jpg'],
      variants: body.variants || [
        { name: 'Piso Sencillo (15 personas)', priceDelta: 0 },
        { name: 'Doble Piso (25-30 personas)', priceDelta: 450 },
      ],
      available: body.available !== undefined ? Boolean(body.available) : true,
      isFeatured: Boolean(body.isFeatured),
    };

    // Insertar al inicio para que el nuevo producto aparezca primero
    products.unshift(newProduct);
    const ok = saveProductsData(products);

    if (!ok) {
      return NextResponse.json({ error: 'No se pudo guardar el producto en el catálogo.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, product: newProduct, message: 'Producto creado exitosamente.' });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Error al crear el producto.' }, { status: 500 });
  }
}

// 3. Modificar producto existente
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.id) {
      return NextResponse.json({ error: 'El ID del producto es obligatorio para actualizar.' }, { status: 400 });
    }

    const products = getProductsData();
    const index = products.findIndex((p) => p.id === body.id || p.slug === body.id);

    if (index === -1) {
      return NextResponse.json({ error: 'Producto no encontrado.' }, { status: 404 });
    }

    const existing = products[index];

    // Actualizar campos
    products[index] = {
      ...existing,
      ...body,
      price: body.price !== undefined ? Number(body.price) : existing.price,
      images: body.images && Array.isArray(body.images) && body.images.length > 0 
        ? body.images 
        : (body.imageUrl ? [body.imageUrl] : existing.images),
    };

    const ok = saveProductsData(products);
    if (!ok) {
      return NextResponse.json({ error: 'Error al actualizar el producto.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, product: products[index], message: 'Producto actualizado con éxito.' });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Error al actualizar el producto.' }, { status: 500 });
  }
}

// 4. Eliminar producto
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    let id = searchParams.get('id');

    if (!id) {
      const body = await req.json().catch(() => ({}));
      id = body.id;
    }

    if (!id) {
      return NextResponse.json({ error: 'Se requiere el ID del producto a eliminar.' }, { status: 400 });
    }

    const products = getProductsData();
    const filtered = products.filter((p) => p.id !== id && p.slug !== id);

    if (filtered.length === products.length) {
      return NextResponse.json({ error: 'Producto no encontrado.' }, { status: 404 });
    }

    const ok = saveProductsData(filtered);
    if (!ok) {
      return NextResponse.json({ error: 'Error al eliminar el producto.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Producto eliminado del catálogo.' });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Error al eliminar el producto.' }, { status: 500 });
  }
}
