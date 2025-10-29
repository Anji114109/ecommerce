// src/app/page.tsx
import ProductListClient from './ProductListClient';

export const dynamic = 'force-static';

async function fetchProducts() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, {
    next: { revalidate: 5 },
  });
  if (!res.ok) return [];
  return await res.json();
}

export default async function HomePage() {
  const products = await fetchProducts();
  return <ProductListClient initialProducts={products} />;
}