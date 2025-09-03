'use client';

import { useState } from 'react';
import { notFound } from 'next/navigation';
import Navigation from '@/components/Navigation';
import Link from 'next/link';
import products from '@/data/marketplaceProducts.json';
import sellers from '@/data/marketplaceSellers.json';

type PageProps = {
  params: { id: string };
};

export default function ProductDetailPage({ params }: PageProps) {
  const [showContactForm, setShowContactForm] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');
  const [contactInfo, setContactInfo] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const product = products.find(p => p.id === params.id);
  const seller = product ? sellers.find(s => s.id === product.sellerId) : null;

  if (!product || !seller) {
    notFound();
  }

  const relatedProducts = products
    .filter(p => p.sellerId === seller.id && p.id !== product.id)
    .slice(0, 3);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Contact form submitted! The seller will be notified.');
    setShowContactForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm mb-6">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/marketplace" className="text-green-600 hover:text-green-700">
                Marketplace
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link href={`/marketplace/seller/${seller.id}`} className="text-green-600 hover:text-green-700">
                {seller.name}
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-600">{product.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div>
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              {product.featured && (
                <div className="absolute top-4 left-4 bg-gold text-white px-3 py-1 rounded-full text-sm font-medium">
                  Featured
                </div>
              )}
            </div>
            <div className="grid grid-cols-4 gap-4 mt-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-square bg-gray-100 rounded-lg" />
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl font-bold text-green-600">
                ${product.price.toFixed(2)}
              </span>
              <span className="text-lg text-gray-500">per {product.unit}</span>
            </div>

            <div className="mb-6">
              {product.availability === 'in-stock' ? (
                <div className="flex items-center gap-2 text-green-600">
                  <span className="text-xl">✓</span>
                  <span className="font-medium">In Stock</span>
                  <span className="text-gray-600">({product.quantity} available)</span>
                </div>
              ) : (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800 font-medium">Available for Pre-order</p>
                  <p className="text-blue-600 text-sm mt-1">{product.preorderNotes}</p>
                </div>
              )}
            </div>

            <div className="prose prose-gray mb-6">
              <p>{product.description}</p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Season Info */}
            {product.seasonStart && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-medium text-gray-900 mb-2">Season Information</h3>
                <p className="text-gray-600">
                  Available from {product.seasonStart} to {product.seasonEnd}
                </p>
              </div>
            )}

            {/* Contact Seller */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Interested in this product?</h3>
              
              {!showContactForm ? (
                <button
                  onClick={() => setShowContactForm(true)}
                  className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Contact {seller.name}
                </button>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quantity Interested In
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                        className="w-20 text-center border border-gray-300 rounded-lg px-2 py-2"
                      />
                      <button
                        type="button"
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        +
                      </button>
                      <span className="text-gray-600">{product.unit}(s)</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={contactInfo.name}
                      onChange={(e) => setContactInfo({ ...contactInfo, name: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={contactInfo.email}
                      onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone (optional)
                    </label>
                    <input
                      type="tel"
                      value={contactInfo.phone}
                      onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Message (optional)
                    </label>
                    <textarea
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Any questions or special requests?"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Send Message
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowContactForm(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Seller Info */}
        <div className="mt-12 bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">About the Seller</h2>
              <Link
                href={`/marketplace/seller/${seller.id}`}
                className="text-lg font-medium text-green-600 hover:text-green-700"
              >
                {seller.name}
              </Link>
              <p className="text-gray-600 mt-2">{seller.description}</p>
              <div className="flex items-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <span className="text-gold">⭐</span>
                  <span className="font-medium">{seller.rating}</span>
                  <span className="text-gray-500">({seller.reviewCount} reviews)</span>
                </div>
                {seller.verified && (
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    ✓ Verified Seller
                  </span>
                )}
              </div>
            </div>
            <Link
              href={`/marketplace/seller/${seller.id}`}
              className="px-4 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors"
            >
              View Profile
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 pt-6 border-t">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Location</h3>
              <p className="text-gray-600">{seller.location}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Pickup Options</h3>
              <p className="text-gray-600">{seller.pickupDays?.join(', ')}</p>
              <p className="text-sm text-gray-500">{seller.pickupHours}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Growing Methods</h3>
              <div className="flex flex-wrap gap-2">
                {seller.growingMethods.slice(0, 3).map((method) => (
                  <span
                    key={method}
                    className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm"
                  >
                    {method}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              More from {seller.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  href={`/marketplace/product/${relatedProduct.id}`}
                  className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow group"
                >
                  <div className="aspect-square bg-gray-100" />
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                      {relatedProduct.name}
                    </h3>
                    <div className="flex justify-between items-end mt-2">
                      <span className="text-lg font-bold text-green-600">
                        ${relatedProduct.price.toFixed(2)}
                      </span>
                      <span className="text-sm text-gray-500">/{relatedProduct.unit}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}