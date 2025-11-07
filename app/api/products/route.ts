import { NextRequest, NextResponse } from 'next/server';
import { Product } from '../../models/Collection';
import dbConnect from '../../lib/mongodb';
import { ProductsResponse, Product as ProductType } from '../../types/collection';

export async function GET(request: NextRequest): Promise<NextResponse<ProductsResponse | { error: string }>> {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const limit = parseInt(searchParams.get('limit') || '12');
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;

    let query: any = { isActive: true };
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (featured === 'true') {
      query.isFeatured = true;
    }

    const products = await Product.find(query)
      .sort({ isFeatured: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Transform products to match ProductType (convert dates to strings)
    const typedProducts: ProductType[] = products.map(product => ({
      ...product,
      _id: product._id.toString(),
      createdAt: product.createdAt,
      updatedAt: product.updatedAt, 
      // Ensure all required fields are present
      images: product.images || [],
      tags: product.tags || [],
      features: product.features || [],
      category: product.category || '',
      rating: product.rating || 0,
      reviewCount: product.reviewCount || 0,
      inStock: product.inStock !== undefined ? product.inStock : true,
      stockQuantity: product.stockQuantity || 0,
      isFeatured: product.isFeatured || false,
      isActive: product.isActive !== undefined ? product.isActive : true,
    }));

    const total = await Product.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: typedProducts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}