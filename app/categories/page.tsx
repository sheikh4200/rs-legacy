// app/categories/page.tsx
import { Metadata } from 'next';
import { Category } from '../types/category';
import CategoriesGrid from '../components/categories/CategoriesGrid';
import { HeroSection } from '../components/categories/HeroSection';
import { FloatingHearts } from '../components/ui/FloatingHearts';
import { WarmWelcome } from '../components/categories/WarmWelcome';

// Modern mock data with loving descriptions
const modernCategories: Category[] = [
  {
    id: '1',
    name: 'Smart Electronics',
    slug: 'smart-electronics',
    description: 'Embrace the future with technology that connects and cares for your lifestyle',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200&h=400&fit=crop',
    icon: '📱',
    color: '#3B82F6',
    gradient: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
    productCount: 234,
    isFeatured: true,
    isActive: true,
    tags: ['Innovative', 'Connected', 'Smart Living'],
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
    subcategories: [
      {
        id: '1-1',
        name: 'Smartphones',
        slug: 'smartphones',
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop',
        productCount: 89,
        isFeatured: false,
        isActive: true,
        tags: ['Communication', '5G'],
        createdAt: '2024-01-15',
        updatedAt: '2024-01-15',
      }
    ]
  },
  {
    id: '2',
    name: 'Sustainable Fashion',
    slug: 'sustainable-fashion',
    description: 'Wear your values with eco-conscious fashion that loves our planet',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=300&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&h=400&fit=crop',
    icon: '👗',
    color: '#10B981',
    gradient: 'linear-gradient(135deg, #10B981, #059669)',
    productCount: 156,
    isFeatured: true,
    isActive: true,
    tags: ['Eco-Friendly', 'Ethical', 'Conscious'],
    createdAt: '2024-01-10',
    updatedAt: '2024-01-10',
  },
  {
    id: '3',
    name: 'Home & Living',
    slug: 'home-living',
    description: 'Create your sanctuary with pieces that whisper comfort and warmth',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&h=400&fit=crop',
    icon: '🏠',
    color: '#F59E0B',
    gradient: 'linear-gradient(135deg, #F59E0B, #D97706)',
    productCount: 312,
    isFeatured: false,
    isActive: true,
    tags: ['Comfort', 'Sanctuary', 'Essentials'],
    createdAt: '2024-01-08',
    updatedAt: '2024-01-08',
  },
  {
    id: '4',
    name: 'Fitness & Wellness',
    slug: 'fitness-wellness',
    description: 'Nurture your wellbeing with tools for a balanced and joyful life',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&h=400&fit=crop',
    icon: '💪',
    color: '#EF4444',
    gradient: 'linear-gradient(135deg, #EF4444, #DC2626)',
    productCount: 98,
    isFeatured: true,
    isActive: true,
    tags: ['Wellbeing', 'Balance', 'Self-Care'],
    createdAt: '2024-01-12',
    updatedAt: '2024-01-12',
  },
  {
    id: '5',
    name: 'Beauty & Self-Care',
    slug: 'beauty-selfcare',
    description: 'Pamper yourself with products that celebrate your natural beauty',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1200&h=400&fit=crop',
    icon: '✨',
    color: '#EC4899',
    gradient: 'linear-gradient(135deg, #EC4899, #BE185D)',
    productCount: 187,
    isFeatured: true,
    isActive: true,
    tags: ['Pampering', 'Natural', 'Radiant'],
    createdAt: '2024-01-18',
    updatedAt: '2024-01-18',
  },
  {
    id: '6',
    name: 'Books & Inspiration',
    slug: 'books-inspiration',
    description: 'Journey through stories and knowledge that feed your soul',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=300&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1200&h=400&fit=crop',
    icon: '📚',
    color: '#8B5CF6',
    gradient: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
    productCount: 423,
    isFeatured: false,
    isActive: true,
    tags: ['Knowledge', 'Inspiration', 'Stories'],
    createdAt: '2024-01-05',
    updatedAt: '2024-01-05',
  },
];

async function getCategories(): Promise<Category[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  return modernCategories;
}

export const metadata: Metadata = {
  title: 'Categories | Discover Our Collections with Love',
  description: 'Explore our heartfully curated categories designed to bring joy and meaning to your life.',
};

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50/30 to-amber-50/20 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-200/10 via-purple-200/5 to-orange-200/10" />
      <FloatingHearts />
      
      {/* Hero Section */}
      <HeroSection />
      
      {/* Warm Welcome Message */}
      <WarmWelcome />
      
      {/* Main Content */}
      <section className="relative container mx-auto px-4 pb-20 -mt-8">
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/80 shadow-2xl shadow-pink-100/30 p-8 lg:p-12">
          {/* Categories Grid */}
          <CategoriesGrid
            categories={categories}
            title="Our Beloved Collections"
            description="Each category is thoughtfully curated with love, bringing you products that matter"
          />
        </div>
      </section>

      {/* Loving Footer Note */}
      <div className="relative container mx-auto px-4 pb-12">
        <div className="text-center">
          <p className="text-lg text-rose-600/80 font-light">
            Made with 💝 for beautiful moments
          </p>
        </div>
      </div>
    </div>
  );
}

// Client component for filters (simplified)


function FiltersWrapper({ categories }: { categories: Category[] }) {
  return (
    <div className="mb-12 text-center">
      <p className="text-lg text-gray-600 font-light italic">
        Discover what speaks to your heart...
      </p>
    </div>
  );
}