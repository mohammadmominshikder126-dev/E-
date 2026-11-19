export interface ProductVariant {
  id: string;
  label: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  shortDesc: string;
  image: string;
  price: number;
  originalPrice?: number;
  pricePrefix?: string; // e.g., "থেকে" for "৳240 থেকে"
  inStock: boolean;
  isBestSeller: boolean;
  isOnOffer: boolean;
  category: 'audio' | 'lighting' | 'cooling';
  variants?: ProductVariant[];
  highlights: string[];
}

export interface CartItem {
  key: string; // productId + variantId
  product: Product;
  variant?: ProductVariant;
  unitPrice: number;
  quantity: number;
}

export interface OrderRecord {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  deliveryZone: 'inside_dhaka' | 'outside_dhaka';
  deliveryFee: number;
  note?: string;
  items: {
    name: string;
    variantLabel?: string;
    quantity: number;
    unitPrice: number;
  }[];
  subtotal: number;
  total: number;
  status: 'অর্ডার কনফার্ম হয়েছে' | 'প্যাকেজিং চলছে' | 'কুরিয়ারে হস্তান্তর করা হয়েছে';
  createdAt: string;
}

export type CatalogFilter = 'all' | 'offer' | 'bestseller' | 'instock';
