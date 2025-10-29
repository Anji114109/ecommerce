// src/app/ProductListClient.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  inventory: number;
  lastUpdated: string;
};

export default function ProductListClient({
  initialProducts,
}: {
  initialProducts: Product[];
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const [secretKey, setSecretKey] = useState('');
  const [error, setError] = useState('');

  const filtered = initialProducts.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

 const handleLogin = (e: React.FormEvent) => {
  e.preventDefault();
  const validKey = process.env.NEXT_PUBLIC_ADMIN_KEY || 'secret123';
  if (secretKey === validKey) {
    localStorage.setItem('admin_auth', 'true');
    window.location.href = '/admin';
  } else {
    setError('Invalid secret key');
  }
};

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Product Catalog</h1>
        <button
          onClick={() => setShowLogin(true)}
          className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
        >
          Admin Login
        </button>
      </div>

      {showLogin && (
        <div className="mb-8 p-6 border rounded max-w-md bg-white shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Admin Access</h2>
          <form onSubmit={handleLogin} className="space-y-3">
            <input
              type="password"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              placeholder="Enter secret key"
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                         placeholder:text-gray-600 text-gray-900"
              required
            />
            {error && <p className="text-red-600 text-sm font-medium">{error}</p>}
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setShowLogin(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="relative mb-8 max-w-2xl">
        <svg className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search products or categories..."
          className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No products found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((product) => (
            <div
              key={product.id}
              className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              {/* NO IMAGE — just padding */}
              <div className="h-32 bg-gray-50 flex items-center justify-center p-4">
                <span className="text-gray-500 text-sm">No Image</span>
              </div>

              <div className="flex flex-1 flex-col p-4">
                <span className="inline-block rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700 mb-2">
                  {product.category}
                </span>
                <h3 className="font-semibold text-gray-900 line-clamp-2 h-12">
                  {product.name}
                </h3>
                <p className="mt-1 text-sm text-gray-600 line-clamp-2 flex-grow">
                  {product.description}
                </p>
                <div className="mt-3">
                  <p className="text-lg font-bold text-gray-900">
                    ${product.price.toFixed(2)}
                  </p>
                  <p
                    className={`mt-1 text-sm ${
                      product.inventory === 0
                        ? 'text-red-600 font-medium'
                        : product.inventory <= 5
                        ? 'text-orange-600'
                        : 'text-green-600'
                    }`}
                  >
                    {product.inventory === 0
                      ? 'Out of stock'
                      : product.inventory <= 5
                      ? `Only ${product.inventory} left!`
                      : 'In stock'}
                  </p>
                </div>
                <Link
                  href={`/products/${product.slug}`}
                  className="mt-4 inline-block w-full rounded-md bg-blue-600 py-2 text-center text-sm font-medium text-white hover:bg-blue-700"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}