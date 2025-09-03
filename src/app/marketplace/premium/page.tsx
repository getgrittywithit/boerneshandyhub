'use client';

import Navigation from '@/components/Navigation';
import Link from 'next/link';
import sellers from '@/data/marketplaceSellers.json';
import products from '@/data/marketplaceProducts.json';

export default function PremiumVendorsPage() {
  const premiumVendors = sellers.filter(seller => seller.membershipTier === 'gold');
  
  const getVendorProducts = (sellerId: string) => {
    return products.filter(p => p.sellerId === sellerId);
  };

  const getVendorStats = (sellerId: string) => {
    const vendorProducts = getVendorProducts(sellerId);
    const inStockCount = vendorProducts.filter(p => p.availability === 'in-stock').length;
    return { totalProducts: vendorProducts.length, inStockCount };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-gold/80 to-gold text-gray-900">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <span className="text-2xl mr-2">💎</span>
              <span className="font-medium">Premium Marketplace</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Boerne's Premier Local Vendors
            </h1>
            <p className="text-xl mb-8">
              Our most established and trusted local businesses, verified for quality and reliability
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="text-3xl mb-2">✓</div>
                <h3 className="font-semibold mb-2">Verified Quality</h3>
                <p className="text-sm">All premium vendors are verified for quality and business practices</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="text-3xl mb-2">🏆</div>
                <h3 className="font-semibold mb-2">Established Legacy</h3>
                <p className="text-sm">Long-standing businesses with proven track records in our community</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="text-3xl mb-2">🤝</div>
                <h3 className="font-semibold mb-2">Community Partners</h3>
                <p className="text-sm">Active supporters of local events and community initiatives</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Premium Vendors Grid */}
        <section>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Premium Vendors</h2>
            <div className="flex items-center gap-2 text-gold">
              <span className="text-2xl">💎</span>
              <span className="font-medium">{premiumVendors.length} Gold Members</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {premiumVendors.map((vendor) => {
              const stats = getVendorStats(vendor.id);
              const featuredProducts = getVendorProducts(vendor.id).filter(p => p.featured).slice(0, 3);
              
              return (
                <Link
                  key={vendor.id}
                  href={`/marketplace/seller/${vendor.id}`}
                  className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border-2 border-gold/20 hover:border-gold/40"
                >
                  {/* Vendor Header */}
                  <div className="relative h-48 bg-gradient-to-r from-gold/20 to-gold/10">
                    <div className="absolute top-4 right-4">
                      <div className="bg-gold text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                        <span>💎</span>
                        <span>Gold Member</span>
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-gold transition-colors">
                              {vendor.name}
                            </h3>
                            <p className="text-gray-600 text-sm">by {vendor.owner}</p>
                            <p className="text-gray-500 text-sm">{vendor.location}</p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1">
                              <span className="text-gold">⭐</span>
                              <span className="font-semibold">{vendor.rating}</span>
                            </div>
                            <p className="text-xs text-gray-500">({vendor.reviewCount} reviews)</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Vendor Content */}
                  <div className="p-6">
                    <p className="text-gray-700 mb-4 line-clamp-2">{vendor.description}</p>
                    
                    {/* Vendor Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gold">{stats.totalProducts}</div>
                        <div className="text-xs text-gray-600">Total Products</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{stats.inStockCount}</div>
                        <div className="text-xs text-gray-600">In Stock</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">{vendor.reviewCount}</div>
                        <div className="text-xs text-gray-600">Reviews</div>
                      </div>
                    </div>

                    {/* Specialties */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-600 mb-2">Specializes in:</h4>
                      <div className="flex flex-wrap gap-2">
                        {vendor.specialties.slice(0, 4).map((specialty) => (
                          <span
                            key={specialty}
                            className="bg-gold/10 text-gold-dark px-2 py-1 rounded text-xs font-medium"
                          >
                            {specialty.replace('-', ' ')}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Featured Products Preview */}
                    {featuredProducts.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-600 mb-2">Featured Products:</h4>
                        <div className="space-y-2">
                          {featuredProducts.map((product) => (
                            <div key={product.id} className="flex justify-between items-center text-sm">
                              <span className="text-gray-900">{product.name}</span>
                              <span className="font-semibold text-gold">${product.price.toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Pickup/Delivery Info */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-green-600">📦</span>
                          <span className="text-gray-600">
                            {vendor.deliveryOptions.includes('local-delivery') ? 'Delivers locally' : 'Pickup available'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-gold group-hover:text-gold-dark transition-colors">
                          <span>View Details</span>
                          <span>→</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Benefits Section */}
        <section className="mt-16 bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Why Choose Premium Vendors?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏅</span>
              </div>
              <h3 className="font-semibold mb-2">Quality Guaranteed</h3>
              <p className="text-sm text-gray-600">
                All premium vendors maintain the highest standards of quality and service
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="font-semibold mb-2">Priority Support</h3>
              <p className="text-sm text-gray-600">
                Premium vendors provide faster response times and dedicated customer service
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚚</span>
              </div>
              <h3 className="font-semibold mb-2">Enhanced Delivery</h3>
              <p className="text-sm text-gray-600">
                Many offer convenient delivery options and flexible pickup schedules
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌟</span>
              </div>
              <h3 className="font-semibold mb-2">Exclusive Access</h3>
              <p className="text-sm text-gray-600">
                First access to seasonal products and special offerings from trusted vendors
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="mt-16 text-center">
          <div className="bg-gradient-to-r from-gold/10 to-gold/5 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Interested in becoming a Premium Vendor?
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Join our exclusive network of verified local businesses and reach more customers 
              in the Boerne community with enhanced marketplace features.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/marketplace"
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Browse All Vendors
              </Link>
              <Link
                href="/business/onboard"
                className="px-6 py-3 bg-gold text-white rounded-lg hover:bg-gold-dark transition-colors"
              >
                Apply for Premium Status
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}