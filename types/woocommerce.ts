export interface WCImage {
  id: number;
  src: string;
  alt: string;
}

export interface WCCategory {
  id: number;
  name: string;
  slug: string;
}

export interface WCAttribute {
  id: number;
  name: string;
  options: string[];
  variation: boolean;
  visible: boolean;
}

export interface WCProduct {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  type: string;
  status: string;
  description: string;
  short_description: string;
  sku: string;
  price: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  purchasable: boolean;
  total_sales: number;
  stock_status: 'instock' | 'outofstock' | 'onbackorder';
  categories: WCCategory[];
  images: WCImage[];
  attributes: WCAttribute[];
  variations: number[];
  meta_data: { key: string; value: string }[];
}

export interface WCProductCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: WCImage | null;
  count: number;
  parent: number;
}

export interface WCVariation {
  id: number;
  price: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  stock_status: 'instock' | 'outofstock' | 'onbackorder';
  attributes: { id: number; name: string; option: string }[];
  image: WCImage;
}

export interface WCCartItem {
  product: WCProduct;
  qty: number;
  variationId?: number;
  selectedOptions?: Record<string, string>;
}
