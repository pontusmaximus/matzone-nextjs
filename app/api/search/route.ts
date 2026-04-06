import { NextRequest, NextResponse } from 'next/server';
import { getProducts } from '@/lib/woocommerce';

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q');
  if (!q?.trim()) {
    return NextResponse.json({ products: [] });
  }

  try {
    const products = await getProducts({
      search: q,
      per_page: 8,
      status: 'publish',
    });
    return NextResponse.json({ products });
  } catch (err) {
    return NextResponse.json({ products: [], error: 'Search failed' }, { status: 500 });
  }
}
