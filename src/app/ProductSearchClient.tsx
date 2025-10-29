// src/app/ProductSearchClient.tsx
'use client';

import { useState, useEffect } from 'react';

export default function ProductSearchClient({ products }: { products: any[] }) {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    document.querySelectorAll('[data-product]').forEach((el) => {
      const name = el.getAttribute('data-name')?.toLowerCase() || '';
      el.classList.toggle('hidden', !name.includes(term));
    });
  }, [searchTerm]);

  return (
    <input
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search products..."
      className="mb-6 p-2 border rounded w-full md:w-96"
    />
  );
}