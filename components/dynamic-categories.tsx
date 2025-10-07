'use client';

import { useRouter } from 'next/navigation';

interface Category {
  category: string;
  subcategory?: string;
  label: string;
  sublabel?: string;
}

interface DynamicCategoriesProps {
  categories: Category[];
}

export function DynamicCategories({ categories }: DynamicCategoriesProps) {
  const router = useRouter();

  const handleCategoryClick = (cat: Category) => {
    // Navigate to dashboard with category filter
    // For subcategories, search by the actual subcategory value, not the label
    const searchQuery = cat.subcategory
      ? cat.subcategory
      : cat.category;
    router.push(`/dashboard?search=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="mb-8">
      <h2 className="text-lg sm:text-2xl  font-bold text-stone-900 mb-6">Bläddra efter kategori</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {categories.map((cat, index) => (
          <div
            key={`${cat.category}-${cat.subcategory || 'main'}-${index}`}
            className="bg-stone-50 hover:bg-stone-100 rounded-lg p-4 text-center cursor-pointer transition-colors"
            onClick={() => handleCategoryClick(cat)}
          >
            <h3 className="font-medium text-stone-900">{cat.label}</h3>
            {cat.sublabel && (
              <p className="text-sm text-stone-600 mt-1">{cat.sublabel}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
