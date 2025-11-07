import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  tags: string[];
  features: string[];
  inStock: boolean;
  stockQuantity: number;
  sku?: string;
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICollection extends Document {
  name: string;
  description: string;
  slug: string;
  bannerImage: string;
  coverImage: string;
  products: mongoose.Types.ObjectId[];
  featuredProducts: mongoose.Types.ObjectId[];
  category: string;
  tags: string[];
  isActive: boolean;
  displayOrder: number;
  metadata?: {
    season?: string;
    year?: number;
    theme?: string;
  };
}

const productSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: {
    type: Number,
    min: 0
  },
  images: [{
    type: String,
    required: true
  }],
  category: {
    type: String,
    required: true
  },
  tags: [String],
  features: [String],
  inStock: {
    type: Boolean,
    default: true
  },
  stockQuantity: {
    type: Number,
    default: 0
  },
  sku: {
    type: String,
    unique: true,
    sparse: true
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const collectionSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  bannerImage: {
    type: String,
    required: true
  },
  coverImage: {
    type: String,
    required: true
  },
  products: [{
    type: Schema.Types.ObjectId,
    ref: 'Product'
  }],
  featuredProducts: [{
    type: Schema.Types.ObjectId,
    ref: 'Product'
  }],
  category: {
    type: String,
    required: true
  },
  tags: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  displayOrder: {
    type: Number,
    default: 0
  },
  metadata: {
    season: String,
    year: Number,
    theme: String
  }
}, {
  timestamps: true
});

export const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>('Product', productSchema);
export const Collection: Model<ICollection> = mongoose.models.Collection || mongoose.model<ICollection>('Collection', collectionSchema);