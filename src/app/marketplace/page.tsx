'use client';

import { useState, useMemo } from 'react';
import Navigation from '@/components/Navigation';
// import Image from 'next/image';
import Link from 'next/link';
import sellers from '@/data/marketplaceSellers.json';
import products from '@/data/marketplaceProducts.json';

// type Product = typeof products[0];
// type Seller = typeof sellers[0];

const categories = [
  { id: 'all', name: 'All Products', icon: '🌾' },
  { id: 'vegetables', name: 'Vegetables', icon: '🥬' },
  { id: 'plants', name: 'Plants & Starts', icon: '🌱' },
  { id: 'eggs-dairy', name: 'Eggs & Dairy', icon: '🥚' },
  { id: 'honey-preserves', name: 'Honey & Preserves', icon: '🍯' },
  { id: 'meat', name: 'Meat & Protein', icon: '🥩' },
];

const growingMethods = [
  { id: 'organic', name: 'Organic' },
  { id: 'no-pesticides', name: 'No Pesticides' },
  { id: 'grass-fed', name: 'Grass Fed' },
  { id: 'free-range', name: 'Free Range' },
  { id: 'hydroponic', name: 'Hydroponic' },
  { id: 'native', name: 'Native Plants' },
];

export default function MarketplacePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMethods, setSelectedMethods] = useState<string[]>([]);
  const [showInStockOnly, setShowInStockOnly] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const seller = sellers.find(s => s.id === product.sellerId);
      
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = 
          product.name.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower) ||
          seller?.name.toLowerCase().includes(searchLower) ||
          product.tags.some(tag => tag.toLowerCase().includes(searchLower));
        
        if (!matchesSearch) return false;
      }

      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false;
      }

      if (showInStockOnly && product.availability !== 'in-stock') {
        return false;
      }

      if (selectedMethods.length > 0) {
        const productMethods = [...product.tags, ...(seller?.growingMethods || [])];
        const hasSelectedMethod = selectedMethods.some(method => 
          productMethods.includes(method)
        );
        if (!hasSelectedMethod) return false;
      }

      return true;
    });
  }, [searchTerm, selectedCategory, selectedMethods, showInStockOnly]);

  // const featuredProducts = products.filter(p => p.featured);
  const featuredSellers = sellers.filter(s => s.verified);

  const toggleMethod = (methodId: string) => {
    setSelectedMethods(prev =>
      prev.includes(methodId)
        ? prev.filter(m => m !== methodId)
        : [...prev, methodId]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-600 to-green-800 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Boerne's Local Marketplace
            </h1>
            <p className="text-xl mb-8 text-green-50">
              Fresh produce, plants, and local goods directly from your neighbors
            </p>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8">
              <p className="text-green-50 mb-3">
                🌱 Connect with local growers year-round
              </p>
              <p className="text-green-50 mb-3">
                🚜 Support small farms and gardens
              </p>
              <p className="text-green-50">
                📦 Arrange pickup or delivery directly
              </p>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 right-0 w-1/3 h-full opacity-10">
          <div className="relative w-full h-full">
            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-green-800" />
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search for products, sellers, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {viewMode === 'grid' ? '📋 List' : '⊞ Grid'}
              </button>
              <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showInStockOnly}
                  onChange={(e) => setShowInStockOnly(e.target.checked)}
                  className="text-green-600"
                />
                <span>In Stock Only</span>
              </label>
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="mr-1">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>

          {/* Growing Methods */}
          <div className="flex gap-2 mt-2 flex-wrap">
            {growingMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => toggleMethod(method.id)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  selectedMethods.includes(method.id)
                    ? 'bg-green-100 text-green-800 border border-green-300'
                    : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                {method.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Premium Vendors Banner */}
        {!searchTerm && selectedCategory === 'all' && (
          <section className="mb-8">
            <div className="bg-gradient-to-r from-gold/10 to-gold/5 rounded-2xl p-6 mb-8">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">💎</span>
                    <h2 className="text-xl font-bold text-gray-900">Premium Vendors</h2>
                  </div>
                  <p className="text-gray-700">
                    Discover our most trusted and established local businesses with verified quality
                  </p>
                </div>
                <Link
                  href="/marketplace/premium"
                  className="mt-4 md:mt-0 px-6 py-3 bg-gold text-white rounded-lg hover:bg-gold-dark transition-colors font-medium"
                >
                  View Premium Vendors
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Featured Sellers Banner */}
        {!searchTerm && selectedCategory === 'all' && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Local Sellers</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredSellers.slice(0, 3).map((seller) => (
                <Link
                  key={seller.id}
                  href={`/marketplace/seller/${seller.id}`}
                  className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="h-32 bg-gradient-to-r from-green-100 to-blue-100" />
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{seller.name}</h3>
                      {seller.verified && (
                        <span className="text-green-600 text-sm">✓ Verified</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {seller.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>⭐ {seller.rating} ({seller.reviewCount})</span>
                      <span>{seller.specialties.slice(0, 2).join(', ')}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Products Grid/List */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {selectedCategory === 'all' ? 'All Products' : categories.find(c => c.id === selectedCategory)?.name}
            </h2>
            <p className="text-gray-600">
              {filteredProducts.length} products found
            </p>
          </div>

          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => {
                const seller = sellers.find(s => s.id === product.sellerId);
                return (
                  <Link
                    key={product.id}
                    href={`/marketplace/product/${product.id}`}
                    className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow group"
                  >
                    <div className="aspect-square bg-gray-100 relative">
                      {product.availability === 'preorder' && (
                        <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
                          Pre-order
                        </div>
                      )}
                      {product.featured && (
                        <div className="absolute top-2 right-2 bg-gold text-white px-2 py-1 rounded text-xs font-medium">
                          Featured
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-green-600 transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">{seller?.name}</p>
                      <div className="flex justify-between items-end">
                        <span className="text-lg font-bold text-green-600">
                          ${product.price.toFixed(2)}
                        </span>
                        <span className="text-sm text-gray-500">/{product.unit}</span>
                      </div>
                      {product.availability === 'in-stock' ? (
                        <p className="text-xs text-green-600 mt-2">✓ In Stock</p>
                      ) : (
                        <p className="text-xs text-blue-600 mt-2">{product.preorderNotes}</p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProducts.map((product) => {
                const seller = sellers.find(s => s.id === product.sellerId);
                return (
                  <Link
                    key={product.id}
                    href={`/marketplace/product/${product.id}`}
                    className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow flex gap-6 group"
                  >
                    <div className="w-24 h-24 bg-gray-100 rounded-lg flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                            {product.name}
                          </h3>
                          <p className="text-sm text-gray-600">{seller?.name} • {seller?.location}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-xl font-bold text-green-600">
                            ${product.price.toFixed(2)}
                          </span>
                          <span className="text-sm text-gray-500">/{product.unit}</span>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-3">{product.description}</p>
                      <div className="flex items-center gap-4">
                        {product.availability === 'in-stock' ? (
                          <span className="text-sm text-green-600 font-medium">✓ In Stock</span>
                        ) : (
                          <span className="text-sm text-blue-600">{product.preorderNotes}</span>
                        )}
                        <div className="flex gap-2">
                          {product.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* How It Works */}
        <section className="mt-16 bg-green-50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                🔍
              </div>
              <h3 className="font-semibold mb-2">Browse & Discover</h3>
              <p className="text-sm text-gray-600">
                Find fresh produce, plants, and local goods from verified sellers
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                💬
              </div>
              <h3 className="font-semibold mb-2">Connect</h3>
              <p className="text-sm text-gray-600">
                Message sellers directly to ask questions or arrange purchases
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                📦
              </div>
              <h3 className="font-semibold mb-2">Arrange Pickup</h3>
              <p className="text-sm text-gray-600">
                Schedule convenient pickup times or local delivery
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                🌟
              </div>
              <h3 className="font-semibold mb-2">Share Feedback</h3>
              <p className="text-sm text-gray-600">
                Leave reviews to help build our trusted community
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}