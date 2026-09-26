import { PrismaClient, CakeSize, CakeDecoration, OrderStatus, PaymentStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌸 Iniciando semillero de datos para DALIA REPOSTERÍA...');

  // 1. Zonas de Entrega
  const zonas = [
    { name: 'Zona Condesa - Roma - Juárez', deliveryCost: 65.0, estimatedTime: '30-45 min', minOrderAmount: 250.0 },
    { name: 'Zona Polanco - Anzures', deliveryCost: 85.0, estimatedTime: '45-60 min', minOrderAmount: 300.0 },
    { name: 'Zona Del Valle - Narvarte - Coyoacán', deliveryCost: 75.0, estimatedTime: '45-60 min', minOrderAmount: 250.0 },
    { name: 'Zona Santa Fe - Bosques', deliveryCost: 120.0, estimatedTime: '60-80 min', minOrderAmount: 400.0 },
    { name: 'Recoger en Taller Dalia (Col. Roma Norte)', deliveryCost: 0.0, estimatedTime: 'Listo a tu hora seleccionada', minOrderAmount: 0.0 },
  ];

  for (const z of zonas) {
    await prisma.deliveryZone.upsert({
      where: { name: z.name },
      update: {},
      create: z,
    });
  }

  // 2. Categorías
  const categorias = [
    { name: 'Pasteles', slug: 'pasteles', description: 'Bizcochos esponjosos, rellenos artesanales y coberturas delicadas.', displayOrder: 1 },
    { name: 'Cupcakes', slug: 'cupcakes', description: 'Porciones individuales coronadas con crema suave y flores comestibles.', displayOrder: 2 },
    { name: 'Galletas', slug: 'galletas', description: 'Masa reposada 24 horas, textura crujiente por fuera y tierna al centro.', displayOrder: 3 },
    { name: 'Brownies', slug: 'brownies', description: 'Intenso cacao al 70%, centro fudge y una pizca de sal en escamas.', displayOrder: 4 },
    { name: 'Cheesecakes', slug: 'cheesecakes', description: 'Cremoso estilo vasco y New York horneados a fuego muy suave.', displayOrder: 5 },
    { name: 'Cajas de Regalo', slug: 'cajas', description: 'Selección curada en empaque con lazo de tela y tarjeta personalizada.', displayOrder: 6 },
    { name: 'Personalizados', slug: 'personalizados', description: 'Diseña tu pastel soñado eligiendo cada capa, sabor y detalle.', displayOrder: 7 },
  ];

  for (const c of categorias) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: {},
      create: c,
    });
  }

  // 3. Productos Emblemáticos de DALIA
  const productos = [
    {
      name: 'Pastel Dalia de Fresa Silvestre',
      slug: 'pastel-dalia-fresa-silvestre',
      categorySlug: 'pasteles',
      description: 'Nuestra creación insignia. Tres capas de bizcocho esponjoso aromatizado con vainilla natural de Papantla, compota casera de fresas de Huamantla reducidas a fuego lento y cobertura de crema montada sedosa.',
      shortDesc: 'Compota de fresas naturales, crema sedosa y vainilla de Papantla.',
      price: 680.0,
      imageUrl: '/assets/images/hero_cake.jpg',
      secondaryImg: '/assets/images/cake_cross_section.jpg',
      isFeatured: true,
      tastingNotes: 'Frescura frutal, notas florales de vainilla y ligereza inolvidable.',
      variants: [
        { name: 'Chico (8-10 porciones)', priceDelta: 0.0, stock: 8 },
        { name: 'Mediano (15-18 porciones)', priceDelta: 280.0, stock: 5 },
        { name: 'Grande (25 porciones)', priceDelta: 520.0, stock: 3 },
      ],
    },
    {
      name: 'Tarta Frutos del Bosque y Mascarpone',
      slug: 'tarta-frutos-del-bosque',
      categorySlug: 'pasteles',
      description: 'Base de masa sablé crujiente con almendra tostada, crema diplomática de mascarpone y un jardín abundante de zarzamoras, frambuesas y grosellas frescas cosechadas esta mañana.',
      shortDesc: 'Sablé de almendra, mascarpone suave y corona de frutos rojos frescos.',
      price: 590.0,
      imageUrl: '/assets/images/berries_tart.jpg',
      isFeatured: true,
      tastingNotes: 'Equilibrio perfecto entre la acidez de los frutos y la riqueza del queso.',
      variants: [
        { name: 'Pieza individual grande (4 porciones)', priceDelta: -220.0, stock: 12 },
        { name: 'Tarta completa (10 porciones)', priceDelta: 0.0, stock: 6 },
      ],
    },
    {
      name: 'Cupcakes Bouquet de Flores',
      slug: 'cupcakes-bouquet-de-flores',
      categorySlug: 'cupcakes',
      description: 'Caja con seis cupcakes horneados con cardamomo y limón real, con un copete de buttercream suizo teñido en tonos rosa empolvado y decorado a mano con flores comestibles de huerto orgánico.',
      shortDesc: 'Caja de 6 cupcakes con cardamomo, limón y flores comestibles.',
      price: 390.0,
      imageUrl: '/assets/images/cupcakes_gourmet.jpg',
      isFeatured: true,
      tastingNotes: 'Aromas cítricos, manteca avellanada y dulzura sutil.',
      variants: [
        { name: 'Caja de 6 unidades', priceDelta: 0.0, stock: 15 },
        { name: 'Caja de 12 unidades', priceDelta: 340.0, stock: 8 },
      ],
    },
    {
      name: 'Bento Cake Mensaje con Cariño',
      slug: 'bento-cake-mensaje-con-carino',
      categorySlug: 'pasteles',
      description: 'El clásico pastel miniatura coreano-artesanal presentado en cajita ecológica de caña de azúcar, con lazo de algodón y vela de cera de abejas. Elige tu dedicatoria escrita a mano.',
      shortDesc: 'Pastelito individual para 2-3 personas con dedicatoria personalizada.',
      price: 340.0,
      imageUrl: '/assets/images/bento_cake.jpg',
      isFeatured: true,
      tastingNotes: 'Bizcocho de chocolate amargo con ganache de café de olla.',
      variants: [
        { name: 'Mini (2-3 personas)', priceDelta: 0.0, stock: 20 },
      ],
    },
    {
      name: 'Cookies Melosas de Tres Chocolates',
      slug: 'cookies-melosas-tres-chocolates',
      categorySlug: 'galletas',
      description: 'Horneadas dos veces al día. Masa con mantequilla tostada, trozos irregulares de chocolate blanco, con leche y amargo 72%, terminadas con sal de Colima en grano.',
      shortDesc: 'Crujientes por fuera, corazón tierno con tres chocolates y sal de Colima.',
      price: 280.0,
      imageUrl: '/assets/images/berries_tart.jpg',
      isFeatured: false,
      tastingNotes: 'Toffee, caramelo tostado y explosiones de chocolate derretido.',
      variants: [
        { name: 'Caja de 6 galletas grandes', priceDelta: 0.0, stock: 25 },
        { name: 'Caja de 12 galletas surtidas', priceDelta: 240.0, stock: 15 },
      ],
    },
    {
      name: 'Brownie Fudge con Nuez Pecana',
      slug: 'brownie-fudge-nuez-pecana',
      categorySlug: 'brownies',
      description: 'Sin levadura, denso, híper chocolatoso. Elaborado exclusivamente con cacao criollo mexicano y mantequilla de rancho, cubierto con una corteza brillante y crujiente.',
      shortDesc: 'Textura trufada irresistible, nueces pecanas y cacao criollo.',
      price: 320.0,
      imageUrl: '/assets/images/cake_cross_section.jpg',
      isFeatured: false,
      tastingNotes: 'Chocolate negro profundo, notas de madera y tostado.',
      variants: [
        { name: 'Caja con 6 porciones gruesas', priceDelta: 0.0, stock: 18 },
      ],
    },
    {
      name: 'Cajita Consentida Dalia',
      slug: 'cajita-consentida-dalia',
      categorySlug: 'cajas',
      description: 'El regalo más dulce y memorable. Incluye 2 cupcakes gourmet, 4 mini brownies de chocolate belga, 3 cookies con chispas, mini frasco de compota casera y tarjeta escrita a pluma.',
      shortDesc: 'Muestra representativa de nuestros antojos en packaging de regalo fino.',
      price: 520.0,
      imageUrl: '/assets/images/hero_cake.jpg',
      isFeatured: true,
      tastingNotes: 'El viaje completo por los aromas y texturas del taller Dalia.',
      variants: [
        { name: 'Caja Estándar con Lazo', priceDelta: 0.0, stock: 10 },
        { name: 'Caja Edición Lujo con Ramillete de Flores', priceDelta: 180.0, stock: 5 },
      ],
    },
  ];

  for (const prod of productos) {
    const { variants, ...prodData } = prod;
    const createdProduct = await prisma.product.upsert({
      where: { slug: prodData.slug },
      update: prodData,
      create: prodData,
    });

    for (const v of variants) {
      await prisma.productVariant.create({
        data: {
          productId: createdProduct.id,
          name: v.name,
          priceDelta: v.priceDelta,
          stock: v.stock,
        },
      });
    }
  }

  // 4. Promoción de Bienvenida
  await prisma.promotion.upsert({
    where: { code: 'DULCEDALIA' },
    update: {},
    create: {
      code: 'DULCEDALIA',
      description: '10% de descuento en tu primer pedido dulce hecho con cariño.',
      discountPercentage: 10.0,
      minSpend: 350.0,
      active: true,
    },
  });

  console.log('✨ Semillero de datos de DALIA completado con éxito.');
}

main()
  .catch((e) => {
    console.error('Error durante la ejecución del seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
