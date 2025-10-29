// src/app/admin/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  inventory: number;
};

export default function AdminPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    category: '',
    inventory: '',
  });
  const [message, setMessage] = useState('');

  // Check login status on mount
  useEffect(() => {
    const auth = localStorage.getItem('admin_auth');
    if (auth !== 'true') {
      router.push('/?login=required');
      return;
    }
    setIsLoggedIn(true);
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await fetch('/api/products');
    const data = await res.json();
    setProducts(data);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      price: parseFloat(formData.price),
      inventory: parseInt(formData.inventory, 10),
    };

    const url = editingId ? `/api/products/${editingId}` : '/api/products';
    const method = editingId ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.NEXT_PUBLIC_ADMIN_KEY || 'secret123',
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setMessage(`✅ ${editingId ? 'Updated' : 'Added'} successfully!`);
      setFormData({ name: '', slug: '', description: '', price: '', category: '', inventory: '' });
      setEditingId(null);
      fetchProducts();
    } else {
      const err = await res.json();
      setMessage(`❌ ${err.error || 'Failed'}`);
    }
  };

  const startEdit = (product: Product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      inventory: product.inventory.toString(),
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_auth');
    router.push('/');
  };

  if (!isLoggedIn) return null; // or loading spinner

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {editingId ? 'Edit Product' : 'Add New Product'}
        </h1>
        <button
          onClick={handleLogout}
          className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          Logout
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <input name="name" placeholder="Product Name" value={formData.name} onChange={handleChange} required className="w-full p-2 border rounded" />
        <input name="slug" placeholder="Slug" value={formData.slug} onChange={handleChange} required className="w-full p-2 border rounded" />
        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required className="w-full p-2 border rounded" rows={3} />
        <input name="price" type="number" step="0.01" placeholder="Price" value={formData.price} onChange={handleChange} required className="w-full p-2 border rounded" />
        <input name="category" placeholder="Category" value={formData.category} onChange={handleChange} required className="w-full p-2 border rounded" />
        <input name="inventory" type="number" placeholder="Inventory" value={formData.inventory} onChange={handleChange} required className="w-full p-2 border rounded" />
        <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
          {editingId ? 'Update Product' : 'Add Product'}
        </button>
        {editingId && (
          <button type="button" onClick={() => setEditingId(null)} className="ml-2 text-gray-600">
            Cancel
          </button>
        )}
      </form>

      {message && <p className="mb-4">{message}</p>}

      <h2 className="text-xl font-semibold mb-2">All Products</h2>
      <div className="space-y-2">
        {products.map((p) => (
          <div key={p.id} className="flex justify-between border-b pb-2">
            <span>{p.name} ({p.category})</span>
            <button onClick={() => startEdit(p)} className="text-blue-600 text-sm">
              Edit
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}