import AIChat from "@/components/AIChat";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section - Hill Country Theme */}
      <div className="relative bg-gradient-to-br from-emerald-800 via-green-700 to-boerne-green overflow-hidden">
        {/* Hill Country Pattern Overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="h-full w-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3Ccircle cx='0' cy='0' r='2'/%3E%3Ccircle cx='0' cy='60' r='2'/%3E%3Ccircle cx='60' cy='0' r='2'/%3E%3Ccircle cx='60' cy='60' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        
        {/* Floating Hills Background */}
        <div className="absolute inset-0">
          <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-emerald-800/30 to-transparent"></div>
          <div className="absolute bottom-10 left-10 w-32 h-16 bg-emerald-400/20 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 right-20 w-40 h-20 bg-green-400/20 rounded-full blur-xl"></div>
          <div className="absolute top-20 left-1/4 w-24 h-12 bg-boerne-gold/30 rounded-full blur-lg"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            {/* Boerne Handy Hub Brand */}
            <div className="flex justify-center items-center mb-8">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-boerne-gold to-yellow-400 rounded-full flex items-center justify-center text-3xl shadow-2xl border-4 border-white/30">
                  🤠
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-boerne-green rounded-full flex items-center justify-center text-white text-xs font-bold animate-pulse">
                  AI
                </div>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
              <span className="block text-boerne-gold">Boerne</span>
              <span className="block text-white font-light">Handy Hub</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-4 font-light">
              Your Complete Guide to the Heart of Texas Hill Country
            </p>
            <p className="text-lg text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed">
              Meet Bernie, your AI-powered local expert who knows everything about Boerne - 
              from planning your perfect Hill Country wedding to finding the best BBQ in town
            </p>
            
            {/* Key Features */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                <div className="text-2xl mb-2">🌲</div>
                <div className="text-white text-sm font-medium">Hill Country Adventures</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                <div className="text-2xl mb-2">💍</div>
                <div className="text-white text-sm font-medium">Wedding Planning</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                <div className="text-2xl mb-2">🍖</div>
                <div className="text-white text-sm font-medium">Local Dining</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                <div className="text-2xl mb-2">🏨</div>
                <div className="text-white text-sm font-medium">Stay & Play</div>
              </div>
            </div>
          </div>
          
          {/* Bernie Chat Interface */}
          <div className="max-w-5xl mx-auto">
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-white/30 shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-boerne-navy to-emerald-700 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-boerne-gold rounded-full flex items-center justify-center text-xl">
                      🤠
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg">Ask Bernie Anything!</h3>
                      <p className="text-white/80 text-sm">Your friendly AI guide to Boerne, Texas</p>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <div className="w-3 h-3 bg-white/60 rounded-full"></div>
                    <div className="w-3 h-3 bg-white/60 rounded-full"></div>
                    <div className="w-3 h-3 bg-white/60 rounded-full"></div>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <AIChat />
              </div>
            </div>
            
            {/* Suggested Questions */}
            <div className="mt-8">
              <p className="text-center text-white/80 text-sm mb-4">Try asking Bernie:</p>
              <div className="flex flex-wrap justify-center gap-3">
                <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm transition-all duration-300 transform hover:scale-105 border border-white/20">
                  "What's happening this weekend?"
                </button>
                <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm transition-all duration-300 transform hover:scale-105 border border-white/20">
                  "Best hiking trails near Boerne?"
                </button>
                <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm transition-all duration-300 transform hover:scale-105 border border-white/20">
                  "Wedding venues in Hill Country?"
                </button>
                <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm transition-all duration-300 transform hover:scale-105 border border-white/20">
                  "Where's the best BBQ?"
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-gradient-to-b from-boerne-light-gray to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          
          {/* What's Happening Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-boerne-navy mb-4">What's Happening in Boerne</h2>
              <p className="text-xl text-boerne-dark-gray max-w-2xl mx-auto">
                Your weekend guide to the best events, activities, and local happenings
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* This Weekend */}
              <div className="bg-gradient-to-br from-boerne-gold to-yellow-400 rounded-2xl p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                <div className="relative">
                  <div className="text-3xl mb-4">🌟</div>
                  <h3 className="text-xl font-bold mb-3">This Weekend</h3>
                  <p className="text-white/90 text-sm mb-4">Dickens Christmas, Farmers Market, and more!</p>
                  <Link href="/events" className="inline-flex items-center text-white font-semibold hover:underline">
                    See All Events →
                  </Link>
                </div>
              </div>

              {/* Local Favorites */}
              <div className="bg-gradient-to-br from-boerne-green to-emerald-500 rounded-2xl p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                <div className="relative">
                  <div className="text-3xl mb-4">🌲</div>
                  <h3 className="text-xl font-bold mb-3">Hill Country Adventures</h3>
                  <p className="text-white/90 text-sm mb-4">12 amazing outdoor locations with interactive maps</p>
                  <Link href="/outdoor" className="inline-flex items-center text-white font-semibold hover:underline">
                    Explore Nature →
                  </Link>
                </div>
              </div>

              {/* Wedding Planning */}
              <div className="bg-gradient-to-br from-rose-600 to-pink-600 rounded-2xl p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                <div className="relative">
                  <div className="text-3xl mb-4">💍</div>
                  <h3 className="text-xl font-bold mb-3">Wedding Planning</h3>
                  <p className="text-white/90 text-sm mb-4">Your dream Hill Country celebration starts here</p>
                  <Link href="/weddings" className="inline-flex items-center text-white font-semibold hover:underline">
                    Plan Wedding →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Explore Boerne Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-boerne-navy mb-4">Explore Boerne</h2>
              <p className="text-xl text-boerne-dark-gray max-w-3xl mx-auto">
                From authentic German heritage to modern Hill Country lifestyle, discover everything that makes our town special
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Dining */}
              <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100">
                <div className="p-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center text-2xl text-white mb-6 group-hover:scale-110 transition-transform">
                    🍖
                  </div>
                  <h3 className="text-xl font-bold text-boerne-navy mb-3 group-hover:text-orange-600 transition-colors">
                    Authentic Local Dining
                  </h3>
                  <p className="text-boerne-dark-gray mb-6 leading-relaxed">
                    From traditional German fare to Texas BBQ, savor the flavors that define our Hill Country heritage
                  </p>
                  <Link href="/dining" className="inline-flex items-center text-orange-600 hover:text-orange-700 font-semibold group-hover:underline transition-all">
                    Find Restaurants
                    <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>

              {/* Stay & Play */}
              <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100">
                <div className="p-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center text-2xl text-white mb-6 group-hover:scale-110 transition-transform">
                    🏨
                  </div>
                  <h3 className="text-xl font-bold text-boerne-navy mb-3 group-hover:text-amber-600 transition-colors">
                    Stay & Play
                  </h3>
                  <p className="text-boerne-dark-gray mb-6 leading-relaxed">
                    Charming accommodations and endless activities in the heart of Texas Hill Country
                  </p>
                  <Link href="/stay-play" className="inline-flex items-center text-amber-600 hover:text-amber-700 font-semibold group-hover:underline transition-all">
                    Plan Your Visit
                    <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>

              {/* Local Marketplace */}
              <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100">
                <div className="p-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center text-2xl text-white mb-6 group-hover:scale-110 transition-transform">
                    🛍️
                  </div>
                  <h3 className="text-xl font-bold text-boerne-navy mb-3 group-hover:text-purple-600 transition-colors">
                    Local Marketplace
                    <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">NEW</span>
                  </h3>
                  <p className="text-boerne-dark-gray mb-6 leading-relaxed">
                    Support local artisans, farmers, and small businesses with our community marketplace
                  </p>
                  <Link href="/marketplace" className="inline-flex items-center text-purple-600 hover:text-purple-700 font-semibold group-hover:underline transition-all">
                    Shop Local
                    <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* About Boerne Section */}
          <div className="bg-gradient-to-br from-boerne-navy to-stone-700 rounded-3xl p-12 md:p-16 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>
            <div className="relative">
              <div className="text-center mb-12">
                <div className="text-4xl mb-6">🤠</div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6">Welcome to Boerne, Y'all!</h2>
                <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
                  Pronounced "BURN-ee" (like Bernie Sanders!), our charming Hill Country town has been welcoming visitors 
                  since 1849. From German heritage to modern amenities, discover why Boerne is the perfect blend of 
                  small-town charm and big-city convenience.
                </p>
              </div>

              {/* Key Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                  <div className="text-3xl font-bold text-boerne-gold mb-2">24,234</div>
                  <div className="text-white/80 text-sm">Population</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                  <div className="text-3xl font-bold text-boerne-gold mb-2">1849</div>
                  <div className="text-white/80 text-sm">Founded</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                  <div className="text-3xl font-bold text-boerne-gold mb-2">30</div>
                  <div className="text-white/80 text-sm">Miles to San Antonio</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                  <div className="text-3xl font-bold text-boerne-gold mb-2">100+</div>
                  <div className="text-white/80 text-sm">Local Businesses</div>
                </div>
              </div>

              <div className="text-center mt-8">
                <Link href="/about" className="inline-flex items-center bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 border border-white/20">
                  Learn About Our History →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}