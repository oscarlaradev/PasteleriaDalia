export interface SiteContent {
  hero: {
    title: string;
    subtitle: string;
    ctaText: string;
    badge1: string;
    badge2: string;
    badge3: string;
    heroImage: string;
  };
  contact: {
    address: string;
    phone: string;
    whatsapp: string;
    hours: string;
    instagram: string;
    facebook: string;
  };
  announcement?: {
    enabled: boolean;
    text: string;
    linkText?: string;
    linkUrl?: string;
  };
}

export const DEFAULT_SITE_CONTENT: SiteContent = {
  hero: {
    title: 'Un pedacito de felicidad.',
    subtitle: 'Recetas que honran el tiempo, la vainilla verdadera y la alegría de compartir.',
    ctaText: 'Elige tu antojo',
    badge1: 'hecho con cariño ♡',
    badge2: 'horneado hoy',
    badge3: 'para celebrar bonito ✦',
    heroImage: '/assets/productos_reales/mariposas_1.jpg',
  },
  contact: {
    address: 'Calle 0 #205 A, Col. Enrique Cárdenas González, 89309 Tampico, Tamps., México',
    phone: '833 318 60 10',
    whatsapp: '528333186010',
    hours: 'Lunes a Sábado: 9:00 AM - 7:30 PM | Domingos: 10:00 AM - 3:00 PM',
    instagram: 'https://instagram.com',
    facebook: 'https://www.facebook.com/daliapasteleriatampico',
  },
  announcement: {
    enabled: false,
    text: 'Agenda abierta para pasteles de fin de semana en Tampico.',
  },
};
