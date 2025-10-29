// src/app/dashboard/page.tsx
export const dynamic = "force-dynamic";

async function fetchProducts() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`);
  if (!res.ok) return [];
  return await res.json();
}

export default async function DashboardPage() {
  const products = await fetchProducts();
  const total = products.length;
  const lowStock = products.filter((p: any) => p.inventory <= 5).length;
  const outOfStock = products.filter((p: any) => p.inventory === 0).length;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Inventory Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded text-center border border-blue-200">
          <p className="text-2xl font-bold text-blue-800">{total}</p>
          <p className="text-blue-700">Total Products</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded text-center border border-yellow-200">
          <p className="text-2xl font-bold text-yellow-800">{lowStock}</p>
          <p className="text-yellow-700">Low Stock (≤5)</p>
        </div>
        <div className="bg-red-50 p-4 rounded text-center border border-red-200">
          <p className="text-2xl font-bold text-red-800">{outOfStock}</p>
          <p className="text-red-700">Out of Stock</p>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-4">All Products</h2>
      <div className="space-y-2">
        {products.map((p: any) => (
          <div key={p.id} className="flex justify-between items-center border-b pb-2">
            <div>
              <span className="font-medium">{p.name}</span>
              <span className="text-gray-500 ml-2 text-sm">({p.category})</span>
            </div>
            <span className={p.inventory === 0 ? "text-red-600 font-medium" : "text-gray-700"}>
              {p.inventory} units
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}