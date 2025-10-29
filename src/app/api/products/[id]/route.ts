// src/app/api/products/[id]/route.ts
import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/db';
import Product from '@/models/Product';
import { Types } from 'mongoose';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!Types.ObjectId.isValid(params.id)) {
    return Response.json({ error: 'Invalid product ID' }, { status: 400 });
  }

  await connectDB();
  const product = await Product.findById(params.id).lean();
  if (!product) {
    return Response.json({ error: 'Product not found' }, { status: 404 });
  }

  return Response.json({
    id: product._id.toString(),
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: product.price,
    category: product.category,
    inventory: product.inventory,
    lastUpdated: new Date(product.lastUpdated).toISOString(),
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const apiKey = request.headers.get('x-api-key');
  if (apiKey !== process.env.ADMIN_API_KEY) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!Types.ObjectId.isValid(params.id)) {
    return Response.json({ error: 'Invalid product ID' }, { status: 400 });
  }

  try {
    const body = await request.json();
    await connectDB();

    const product = await Product.findByIdAndUpdate(
      params.id,
      { ...body, lastUpdated: new Date() },
      { new: true, runValidators: true }
    ).lean();

    if (!product) {
      return Response.json({ error: 'Product not found' }, { status: 404 });
    }

    return Response.json({
      id: product._id.toString(),
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      category: product.category,
      inventory: product.inventory,
      lastUpdated: product.lastUpdated.toISOString(),
    });
  } catch (error: any) {
    return Response.json({ error: error.message || 'Update failed' }, { status: 400 });
  }
}