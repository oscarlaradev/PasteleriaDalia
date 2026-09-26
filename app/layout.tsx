import type { Metadata } from 'next';
import './globals.css';
import { ClientLayout } from '@/components/layout/ClientLayout';

export const metadata: Metadata = {
  title: 'Dalia Repostería · Alta Repostería Artesanal & Pasteles Personalizados',
  description: 'Pastelería y repostería artesanal en Tampico, Tamaulipas (Calle 0 #205 A, Col. Enrique Cárdenas González, 89309 Tampico, Tamps.). Pasteles personalizados, cupcakes, brownies y mesas dulces horneadas con cariño.',
  keywords: [
    'pastelería en tampico',
    'pasteles personalizados tampico',
    'repostería artesanal tampico',
    'cupcakes tampico',
    'dalia repostería',
    'pasteles madero tamaulipas',
  ],
  authors: [{ name: 'Dalia Repostería' }],
  openGraph: {
    title: 'Dalia Repostería · Un pedacito de felicidad',
    description: 'Alta repostería artesanal hecha con ingredientes nobles y mucho cariño en Tampico, Tamaulipas.',
    url: 'https://daliareposteria.mx',
    siteName: 'Dalia Repostería',
    locale: 'es_MX',
    type: 'website',
  },
  icons: {
    icon: '/assets/icons/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const schemaJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Bakery',
    name: 'Dalia Repostería',
    image: 'https://daliareposteria.mx/assets/images/hero_cake.jpg',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Calle 0 #205 A',
      addressLocality: 'Col. Enrique Cárdenas González, Tampico',
      addressRegion: 'Tamaulipas',
      postalCode: '89309',
      addressCountry: 'MX',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 22.3089022,
      longitude: -97.8576454,
    },
    priceRange: '$$',
    telephone: '+528333186010',
    servesCuisine: 'Repostería fina artesanal, Pastelería mexicana contemporánea',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '09:00',
        closes: '19:30',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Sunday'],
        opens: '10:00',
        closes: '17:00',
      },
    ],
  };

  return (
    <html lang="es">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }}
        />
      </head>
      <body className="bg-dalia-vanilla text-dalia-chocolate min-h-screen">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
