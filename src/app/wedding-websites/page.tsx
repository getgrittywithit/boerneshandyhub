'use client';

import { useState } from 'react';
import Link from 'next/link';

const templates = [
  {
    id: 'rustic',
    name: 'Rustic Hill Country',
    description: 'Perfect for barn and outdoor weddings',
    image: '/templates/rustic-preview.jpg',
    colors: ['#8B4513', '#F4E4C1', '#6B8E23'],
    features: ['Photo Gallery', 'RSVP Management', 'Registry Links', 'Venue Details'],
    price: '$99'
  },
  {
    id: 'elegant',
    name: 'Elegant Garden',
    description: 'Beautiful for church and garden ceremonies',
    image: '/templates/elegant-preview.jpg',
    colors: ['#DDA0DD', '#F8F8FF', '#98FB98'],
    features: ['Photo Gallery', 'RSVP Management', 'Registry Links', 'Wedding Timeline'],
    price: '$129'
  },
  {
    id: 'modern',
    name: 'Modern Minimalist',
    description: 'Clean design for contemporary venues',
    image: '/templates/modern-preview.jpg',
    colors: ['#2F4F4F', '#FFFFFF', '#DAA520'],
    features: ['Photo Gallery', 'RSVP Management', 'Registry Links', 'Guest Messages'],
    price: '$149'
  }
];

export default function WeddingWebsites() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-pink-600 to-rose-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Your Perfect Wedding Website
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Beautiful, personalized wedding websites that capture your love story. 
            From RSVP management to photo galleries - we handle everything so you can focus on your big day.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="bg-white/20 px-4 py-2 rounded-full">✨ Ready in 5 minutes</div>
            <div className="bg-white/20 px-4 py-2 rounded-full">📱 Mobile-friendly</div>
            <div className="bg-white/20 px-4 py-2 rounded-full">💌 RSVP management</div>
            <div className="bg-white/20 px-4 py-2 rounded-full">📸 Photo galleries</div>
          </div>
        </div>
      </div>

      {/* Template Selection */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Style</h2>
          <p className="text-xl text-gray-600">Select a template that matches your wedding vision</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {templates.map((template) => (
            <div 
              key={template.id}
              className={`group relative bg-white rounded-2xl shadow-xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 ${
                selectedTemplate === template.id ? 'ring-4 ring-pink-500' : ''
              }`}
              onClick={() => setSelectedTemplate(template.id)}
            >
              {/* Template Preview Image */}
              <div className="aspect-[4/3] bg-gray-200 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20"></div>
                <div className="absolute top-4 right-4 bg-white/90 text-pink-600 font-bold text-lg px-3 py-1 rounded-full">
                  {template.price}
                </div>
                {/* Color palette */}
                <div className="absolute bottom-4 left-4 flex space-x-2">
                  {template.colors.map((color, idx) => (
                    <div 
                      key={idx}
                      className="w-6 h-6 rounded-full border-2 border-white shadow-md"
                      style={{ backgroundColor: color }}
                    ></div>
                  ))}
                </div>
              </div>

              {/* Template Info */}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {template.name}
                </h3>
                <p className="text-gray-600 mb-4">
                  {template.description}
                </p>
                
                {/* Features */}
                <div className="space-y-2 mb-6">
                  {template.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center text-sm text-gray-600">
                      <span className="text-green-500 mr-2">✓</span>
                      {feature}
                    </div>
                  ))}
                </div>

                <button 
                  className={`w-full py-3 px-6 rounded-xl font-semibold transition-all ${
                    selectedTemplate === template.id
                      ? 'bg-pink-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-pink-100 hover:text-pink-700'
                  }`}
                >
                  {selectedTemplate === template.id ? 'Selected ✓' : 'Choose This Style'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Get Started Button */}
        {selectedTemplate && (
          <div className="text-center">
            <Link 
              href={`/wedding-websites/create?template=${selectedTemplate}`}
              className="inline-block bg-gradient-to-r from-pink-600 to-rose-600 text-white text-xl font-bold px-12 py-4 rounded-xl hover:from-pink-700 hover:to-rose-700 transition-all transform hover:scale-105 shadow-lg"
            >
              Create My Wedding Website →
            </Link>
          </div>
        )}
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Everything You Need</h2>
            <p className="text-xl text-gray-600">Your wedding website includes all these features</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📸</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Photo Galleries</h3>
              <p className="text-gray-600">Share your engagement and wedding photos with guests</p>
            </div>

            <div className="text-center">
              <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💌</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">RSVP Management</h3>
              <p className="text-gray-600">Collect RSVPs, meal choices, and guest counts automatically</p>
            </div>

            <div className="text-center">
              <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎁</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Registry Links</h3>
              <p className="text-gray-600">Link to all your wedding registries in one place</p>
            </div>

            <div className="text-center">
              <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏨</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Guest Info</h3>
              <p className="text-gray-600">Hotel blocks, directions, and local recommendations</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">Simple, Transparent Pricing</h2>
          
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Wedding Website</h3>
            <div className="text-5xl font-bold text-pink-600 mb-2">
              $99-149
            </div>
            <p className="text-gray-600 mb-6">One-time payment • Active until 30 days after your wedding</p>
            
            <div className="space-y-3 text-left mb-8">
              <div className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                <span className="text-gray-700">Custom subdomain (yournames.boerneweddings.com)</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                <span className="text-gray-700">Unlimited photo uploads</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                <span className="text-gray-700">RSVP management & guest tracking</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                <span className="text-gray-700">Mobile-responsive design</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                <span className="text-gray-700">Registry & hotel information</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                <span className="text-gray-700">Bernie AI integration for guest questions</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}