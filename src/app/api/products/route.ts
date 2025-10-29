// src/app/api/products/route.ts
import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/db';
import Product from '@/models/Product';

export async function GET() {
  await connectDB();
  const products = await Product.find({}).lean();
  const serialized = products.map(p => ({
    id: p._id.toString(),
    name: p.name,
    slug: p.slug,
    description: p.description,
    price: p.price,
    category: p.category,
    inventory: p.inventory,
    lastUpdated: new Date(p.lastUpdated).toISOString(),
  }));
  return Response.json(serialized);
}

export async function POST(req: NextRequest) {
  const apiKey = req.headers.get('x-api-key');
  if (apiKey !== process.env.ADMIN_API_KEY) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    await connectDB();
    const product = await Product.create({
      ...body,
      lastUpdated: new Date(),
    });

    return Response.json(
      {
        id: product._id.toString(),
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        category: product.category,
        inventory: product.inventory,
        lastUpdated: product.lastUpdated.toISOString(),
      },
      { status: 201 }
    );
  } catch (error: any) {
    return Response.json({ error: error.message || 'Invalid data' }, { status: 400 });
  }
}