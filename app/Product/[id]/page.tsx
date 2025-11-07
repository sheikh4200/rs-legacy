// app/products/[id]/page.tsx
"use client";

import { useState, use } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import ProductGallery from "../../components/Products/ProductGallery";
import ProductInfo from "../../components/Products/ProductInfo";
import ProductTabs from "../../components/Products/ProductTabs";
import RelatedProducts from "../../components/Products/RelatedProducts";
import ReviewsProduct from "../../components/Products/ProductReview";
import Header from "../../components/Header";
import { CartProvider } from "../../lib/cart-context";

// Mock product data
const product = {
  id: "1",
  name: "Classic Cotton T-Shirt",
  description: "Premium quality cotton t-shirt perfect for everyday wear. Features a comfortable fit and durable fabric that maintains its shape wash after wash.",
  price: 25.99,
  originalPrice: 35.99,
  discount: 28,
  rating: 4.5,
  reviewCount: 128,
  inStock: true,
  stockCount: 50,
  images: [
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop",
    "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=500&h=500&fit=crop",
    "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=500&h=500&fit=crop",
  ],
  features: [
    "100% Premium Cotton",
    "Machine Washable",
    "Pre-shrunk Fabric",
    "Regular Fit"
  ],
  specifications: {
    material: "100% Cotton",
    fit: "Regular",
    care: "Machine Washable",
    origin: "Imported",
    weight: "180 GSM"
  },
  colors: ["black", "white", "gray", "navy"],
  sizes: ["S", "M", "L", "XL"]
};

const relatedProducts = [
  {
    id: 2,
    name: "Premium Denim Jacket",
    price: 79.99,
    originalPrice: 99.99,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=500&fit=crop",
    category: "men",
    rating: 4.8,
    reviews: 89,
  },
  {
    id: 3,
    name: "Urban Style Sneakers",
    price: 89.99,
    originalPrice: 119.99,
    image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&h=500&fit=crop",
    category: "footwear",
    rating: 4.7,
    reviews: 256,
  },
  {
    id: 4,
    name: "Elegance Formal Shirt",
    price: 45.99,
    originalPrice: 59.99,
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&h=500&fit=crop",
    category: "men",
    rating: 4.3,
    reviews: 67,
  }
];

// Product content component
function ProductContent({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const router = useRouter();
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes[1]);
  const [activeTab, setActiveTab] = useState("description");

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Products
          </button>

          {/* Main Product Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Product Gallery */}
            <div>
              <ProductGallery images={product.images} />
            </div>

            {/* Product Info */}
            <div>
              <ProductInfo 
                product={product}
                selectedColor={selectedColor}
                selectedSize={selectedSize}
                onColorChange={setSelectedColor}
                onSizeChange={setSelectedSize}
              />
            </div>
          </div>

          {/* Product Tabs */}
          <div className="mb-16">
            <ProductTabs 
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
            
            {/* Tab Content */}
            <div className="mt-8">
              {activeTab === "description" && (
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-gray-700 dark:text-gray-300">{product.description}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    {product.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {activeTab === "reviews" && (
                <ReviewsProduct productId={unwrappedParams.id} />
              )}

              {activeTab === "shipping" && (
                <div className="prose dark:prose-invert max-w-none">
                  <h3 className="text-gray-900 dark:text-white">Shipping Information</h3>
                  <ul className="text-gray-700 dark:text-gray-300">
                    <li>Free shipping on orders over $50</li>
                    <li>Standard delivery: 3-5 business days</li>
                    <li>Express delivery: 1-2 business days</li>
                    <li>International shipping available</li>
                  </ul>
                  
                  <h3 className="text-gray-900 dark:text-white mt-6">Returns Policy</h3>
                  <ul className="text-gray-700 dark:text-gray-300">
                    <li>30-day return policy</li>
                    <li>Items must be in original condition</li>
                    <li>Free returns for defective items</li>
                    <li>Return shipping fee may apply</li>
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Related Products */}
          <div>
            <RelatedProducts products={relatedProducts} />
          </div>
        </div>
      </main>
    </>
  );
}

// Main product page component
export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <CartProvider>
      <ProductContent params={params} />
    </CartProvider>
  );
}