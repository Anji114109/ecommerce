// src/app/api/products/[id]/route.ts
import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/db';
import Product, { ProductDocument } from '@/models/Product';
import { Types } from 'mongoose';
import type { ProductType } from '@/types/product';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!Types.ObjectId.isValid(id)) {
    return Response.json({ error: 'Invalid product ID' }, { status: 400 });
  }

  await connectDB();
  const product = await Product.findById(id).lean() as ProductDocument | null;

  if (!product) {
    return Response.json({ error: 'Product not found' }, { status: 404 });
  }

  const serialized: ProductType = {
    id: product._id.toString(),
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: product.price,
    category: product.category,
    inventory: product.inventory,
    lastUpdated: new Date(product.lastUpdated).toISOString(),
  };

  return Response.json(serialized);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const apiKey = request.headers.get('x-api-key');
  if (apiKey !== process.env.ADMIN_API_KEY) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!Types.ObjectId.isValid(id)) {
    return Response.json({ error: 'Invalid product ID' }, { status: 400 });
  }

  try {
    const body = await request.json();
    await connectDB();

    const product = await Product.findByIdAndUpdate(
      id,
      { ...body, lastUpdated: new Date() },
      { new: true, runValidators: true }
    ).lean() as ProductDocument | null;

    if (!product) {
      return Response.json({ error: 'Product not found' }, { status: 404 });
    }

    const serialized: ProductType = {
      id: product._id.toString(),
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      category: product.category,
      inventory: product.inventory,
      lastUpdated: product.lastUpdated.toISOString(),
    };

    return Response.json(serialized);
  } catch (error: any) {
    return Response.json({ error: error.message || 'Update failed' }, { status: 400 });
  }
}