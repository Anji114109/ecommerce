// src/app/recommendations/page.tsx
import { notFound } from 'next/navigation';

async function getRecommendedProducts() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`);
  const products = await res.json();
  return products
    .filter((p: any) => p.inventory > 0)
    .sort((a: any, b: any) => a.price - b.price)
    .slice(0, 3);
}

function AddToWishlist({ name }: { name: string }) {
  return (
    <button className="text-sm text-red-600 ml-2 hover:underline" onClick={() => alert(`❤️ Added "${name}" to wishlist!`)}>
      + Wishlist
    </button>
  );
}

export default async function RecommendationsPage() {
  const products = await getRecommendedProducts();
  if (!products) notFound();

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Recommended Products</h1>
      <p className="mb-4 text-gray-600">Top 3 lowest-priced in-stock items:</p>
      <div className="space-y-3">
        {products.map((p: any) => (
          <div key={p.id} className="border-b pb-3 flex justify-between items-start">
            <div>
              <h2 className="font-semibold">{p.name}</h2>
              <p className="text-gray-700">${p.price.toFixed(2)}</p>
            </div>
            <AddToWishlist name={p.name} />
          </div>
        ))}
      </div>
    </div>
  );
}