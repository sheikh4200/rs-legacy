// app/api/products/featured/route.ts
import { NextResponse } from 'next/server';
import { productService } from '../../lib/data';

export async function GET() {
  try {
    const featuredProducts = productService.getFeatured();
    return NextResponse.json(featuredProducts);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch featured products' },
      { status: 500 }
    );
  }
}