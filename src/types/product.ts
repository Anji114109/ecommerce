// src/types/product.ts
export type ProductType = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  inventory: number;
  lastUpdated: string; // ISO string after serialization
};