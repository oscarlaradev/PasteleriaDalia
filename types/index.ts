export type CakeSizeOption = '6 personas' | '10 personas' | '15 personas' | '20 personas' | '30 personas';
export type SpongeFlavor = 'Vainilla natural' | 'Chocolate belga' | 'Red velvet';
export type FillingFlavor =
  | 'Chocolate Chantilly'
  | 'Mermelada Fresa - Piña'
  | 'Cajeta artesanal'
  | 'Crema Pastelera'
  | 'Especial Plátano con Canela'
  | 'Especial Zanahoria con Nuez & Piña'
  | 'Compota de fresa'
  | 'Nutella artesanal'
  | 'Crema de vainilla'
  | 'Queso crema'
  | 'Ganache de chocolate';
export type FrostingType = 'Buttercream suizo' | 'Chocolate fudge' | 'Crema montada ligera';
export type CakeDecoration = 'Minimalista' | 'Flores comestibles' | 'Frutas frescas' | 'Cumpleaños festivo' | 'Temática personalizada';

export interface CustomCakeState {
  size: CakeSizeOption;
  spongeFlavor: SpongeFlavor;
  filling: FillingFlavor;
  frosting: FrostingType;
  decoration: CakeDecoration;
  customText: string;
  eventDate: string;
  quantity: number;
  specialNotes: string;
  referencePhotoUrl?: string;
  calculatedPrice: number;
}

export interface ProductItem {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  shortDesc: string;
  price: number;
  imageUrl: string;
  secondaryImg?: string;
  images?: string[];
  tastingNotes?: string;
  available: boolean;
  isSeasonal?: boolean;
  isFeatured?: boolean;
  variants?: {
    name: string;
    priceDelta: number;
  }[];
}

export interface CartItem {
  cartId: string;
  productId?: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  selectedVariant?: string;
  isCustomCake?: boolean;
  customCakeDetails?: CustomCakeState;
}

export interface DeliveryZoneInfo {
  id: string;
  name: string;
  cost: number;
  estimatedTime: string;
  minOrder: number;
}
