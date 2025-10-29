// src/app/api/admin/login/route.ts
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const { key } = await req.json();
  if (key === process.env.ADMIN_API_KEY) {
    return Response.json({ success: true });
  }
  return Response.json({ error: 'Invalid key' }, { status: 401 });
}