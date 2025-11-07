import { NextRequest, NextResponse } from 'next/server';
import { Collection, Product } from '../../../models/Collection';
import dbConnect from '../../../lib/mongodb';
import { CollectionResponse } from '../../../types/collection';

interface RouteParams {
  params: {
    slug: string;
  };
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<CollectionResponse | { error: string }>> {
  try {
    await dbConnect();
    
    const { slug } = params;

    const collection = await Collection.findOne({ 
      slug, 
      isActive: true 
    })
    .populate('products')
    .populate('featuredProducts')
    .lean();

    if (!collection) {
      return NextResponse.json(
        { success: false, error: 'Collection not found' },
        { status: 404 }
      );
    }
      
   return NextResponse.json({
  success: true,
} as CollectionResponse);

  } catch (error) {
    console.error('Error fetching collection:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch collection' },
      { status: 500 }
    );
  }
}