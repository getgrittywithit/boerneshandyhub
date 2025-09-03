'use client';

import { notFound, useParams } from 'next/navigation';
import Navigation from '@/components/Navigation';
import Link from 'next/link';
import sellers from '@/data/marketplaceSellers.json';
import products from '@/data/marketplaceProducts.json';

export default function SellerProfilePage() {
  const params = useParams();
  const id = params.id as string;
  const seller = sellers.find(s => s.id === id);
  const sellerProducts = products.filter(p => p.sellerId === id);

  if (!seller) {
    notFound();
  }

  const availableProducts = sellerProducts.filter(p => p.availability === 'in-stock');
  const preorderProducts = sellerProducts.filter(p => p.availability === 'preorder');

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Hero Banner */}
      <section className="relative h-64 bg-gradient-to-r from-green-600 to-green-800">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative container mx-auto px-4 h-full flex items-end pb-8">
          <div className="bg-white rounded-lg p-6 shadow-lg max-w-4xl w-full">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">{seller.name}</h1>
                    <p className="text-gray-600 mb-2">Owned by {seller.owner}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <span className="text-gold">⭐</span>
                        <span className="font-semibold">{seller.rating}</span>
                        <span className="text-gray-500">({seller.reviewCount} reviews)</span>
                      </span>
                      {seller.verified && (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                          ✓ Verified Seller
                        </span>
                      )}
                      {seller.membershipTier === 'gold' && (
                        <span className="bg-gold/20 text-gold-dark px-2 py-1 rounded-full text-xs font-medium">
                          Gold Member
                        </span>
                      )}
                    </div>
                  </div>
                  <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
                    Contact Seller
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="font-semibold text-gray-900 mb-4">About</h2>
              <p className="text-gray-700 mb-6">{seller.description}</p>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-1">Location</h3>
                  <p className="text-gray-900">{seller.location}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-1">Growing Methods</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {seller.growingMethods.map((method) => (
                      <span
                        key={method}
                        className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                      >
                        {method}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-1">Specialties</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {seller.specialties.map((specialty) => (
                      <span
                        key={specialty}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Pickup & Delivery</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-1">Available Options</h3>
                  <div className="space-y-2 mt-2">
                    {seller.deliveryOptions.map((option) => (
                      <div key={option} className="flex items-center gap-2">
                        <span className="text-green-600">✓</span>
                        <span className="capitalize">{option.replace('-', ' ')}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {seller.pickupDays && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-600 mb-1">Pickup Schedule</h3>
                    <p className="text-gray-900">{seller.pickupDays.join(', ')}</p>
                    <p className="text-gray-600 text-sm">{seller.pickupHours}</p>
                  </div>
                )}

                {seller.minimumOrder && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-600 mb-1">Delivery Info</h3>
                    <p className="text-gray-900">
                      Minimum order: ${seller.minimumOrder}
                      {seller.deliveryFee && ` • Delivery fee: $${seller.deliveryFee}`}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="lg:col-span-2">
            {/* Available Products */}
            {availableProducts.length > 0 && (
              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Available Now ({availableProducts.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availableProducts.map((product) => (
                    <Link
                      key={product.id}
                      href={`/marketplace/product/${product.id}`}
                      className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow group"
                    >
                      <div className="flex gap-4 p-4">
                        <div className="w-24 h-24 bg-gray-100 rounded-lg flex-shrink-0" />
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                            {product.name}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {product.description}
                          </p>
                          <div className="mt-2 flex items-end justify-between">
                            <span className="text-lg font-bold text-green-600">
                              ${product.price.toFixed(2)}
                            </span>
                            <span className="text-sm text-gray-500">/{product.unit}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Pre-order Products */}
            {preorderProducts.length > 0 && (
              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Available for Pre-order ({preorderProducts.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {preorderProducts.map((product) => (
                    <Link
                      key={product.id}
                      href={`/marketplace/product/${product.id}`}
                      className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow group border-2 border-blue-100"
                    >
                      <div className="flex gap-4 p-4">
                        <div className="w-24 h-24 bg-gray-100 rounded-lg flex-shrink-0" />
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <h3 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                              {product.name}
                            </h3>
                            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                              Pre-order
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {product.description}
                          </p>
                          <p className="text-xs text-blue-600 mt-2">
                            {product.preorderNotes}
                          </p>
                          <div className="mt-2 flex items-end justify-between">
                            <span className="text-lg font-bold text-green-600">
                              ${product.price.toFixed(2)}
                            </span>
                            <span className="text-sm text-gray-500">/{product.unit}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Reviews Section */}
            <section className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Customer Reviews ({seller.reviewCount})
              </h2>
              
              <div className="flex items-center gap-6 mb-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-900">{seller.rating}</div>
                  <div className="flex items-center gap-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < Math.floor(seller.rating) ? 'text-gold' : 'text-gray-300'}>
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((stars) => (
                      <div key={stars} className="flex items-center gap-2">
                        <span className="text-sm">{stars}</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gold h-2 rounded-full"
                            style={{
                              width: `${stars === 5 ? 80 : stars === 4 ? 15 : 5}%`
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="text-center py-8 text-gray-500">
                <p>Review functionality coming soon!</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}