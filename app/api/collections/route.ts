import { NextRequest, NextResponse } from 'next/server';
import { Collection, Product } from '../../models/Collection';
import dbConnect from '../../lib/mongodb';
import { Collection as CollectionType, CollectionsResponse } from '../../types/collection';

export async function GET(request: NextRequest): Promise<NextResponse<CollectionsResponse | { error: string }>> {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;

    let query: any = { isActive: true };
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (featured === 'true') {
      query.isFeatured = true;
    }

    const collectionDocs = await Collection.find(query)
  .populate('products')
  .populate('featuredProducts')
  .sort({ displayOrder: 1, createdAt: -1 })
  .skip(skip)
  .limit(limit)
  .lean();

const collections = collectionDocs as unknown as CollectionType[];
     
    const total = await Collection.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: collections,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching collections:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch collections' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    await dbConnect();
    
    const body = await request.json();
    
    const collection = new Collection(body);
    await collection.save();
    
    return NextResponse.json({
      success: true,
      data: collection
    });

  } catch (error) {
    console.error('Error creating collection:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create collection' },
      { status: 500 }
    );
  }
}