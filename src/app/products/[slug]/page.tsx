// src/app/products/[slug]/page.tsx
import { notFound } from 'next/navigation';

async function fetchProductBySlug(slug: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`);
  const products = await res.json();
  return products.find((p: any) => p.slug === slug) || null;
}

export async function generateStaticParams() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`);
  const products = await res.json();
  return products.map((p: any) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await fetchProductBySlug(slug);
  if (!product) return { title: 'Product Not Found' };
  return { title: `${product.name} | E-Commerce Demo` };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await fetchProductBySlug(slug);
  if (!product) notFound();

  const stockClass =
    product.inventory === 0
      ? 'text-red-600 bg-red-50'
      : product.inventory <= 5
      ? 'text-orange-600 bg-orange-50'
      : 'text-green-600 bg-green-50';

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      <a href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 group">
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Catalog
      </a>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="h-32 bg-gray-50 flex items-center justify-center p-4">
          <span className="text-gray-500">No Image</span>
        </div>
        <div className="p-6 sm:p-8">
          <span className="inline-block px-3 py-1 text-xs font-semibold text-blue-700 bg-blue-100 rounded-full mb-4">
            {product.category}
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">{product.name}</h1>
          <p className="text-gray-600 mb-6">{product.description}</p>
          <div className="mb-5">
            <span className="text-3xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
          </div>
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${stockClass} mb-6`}>
            {product.inventory === 0 ? 'Out of Stock' : product.inventory <= 5 ? `Only ${product.inventory} left!` : 'In Stock'}
          </div>
          <div className="text-sm text-gray-500 border-t pt-4 mt-6">
            Last updated: {new Date(product.lastUpdated).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export const revalidate = 60;