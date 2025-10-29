// src/data/products.ts
export type ProductType = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  inventory: number;
  lastUpdated: string;
  image?: string;  // ISO datetime
};