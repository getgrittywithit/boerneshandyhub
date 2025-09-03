import AIChat from "@/components/AIChat";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Modern AI-Focused Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-950 via-purple-900 to-indigo-900 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-blue-400/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-32 right-20 w-48 h-48 bg-purple-400/20 rounded-full blur-xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-indigo-400/20 rounded-full blur-xl animate-pulse delay-500"></div>
          <div className="absolute bottom-32 right-1/3 w-24 h-24 bg-pink-400/20 rounded-full blur-xl animate-pulse delay-700"></div>
        </div>
        
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 opacity-20">
          <div className="h-full w-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M0 0h40v40H0V0zm20 20h20v20H20V20z'/%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 min-h-[80vh] flex flex-col justify-center">
          {/* Hero Content */}
          <div className="text-center mb-12">
            {/* Bernie Mascot Placeholder */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-4xl shadow-2xl border-4 border-white/20">
                  🐻
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-400 rounded-full flex items-center justify-center text-white text-sm font-bold animate-bounce">
                  AI
                </div>
              </div>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-6 animate-pulse">
              Meet Bernie
            </h1>
            <p className="text-2xl md:text-3xl text-white/90 mb-4 font-light">
              Your AI Guide to Boerne
            </p>
            <p className="text-lg text-white/70 mb-8 max-w-2xl mx-auto">
              Discover weddings, dining, adventures & more in the Heart of Texas Hill Country
            </p>
          </div>
          
          {/* Modern Chat Interface */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-8">
              <div className="flex items-center justify-center mb-6">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
                <div className="ml-4 text-white/60 text-sm font-medium">Bernie AI Assistant</div>
              </div>
              <AIChat />
            </div>
            
            {/* Quick Action Bubbles */}
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105">
                💍 Plan My Wedding
              </button>
              <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105">
                🍽️ Find Dining
              </button>
              <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105">
                🏞️ Explore Nature
              </button>
              <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105">
                🛍️ Shop Local
              </button>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-8 h-12 border-2 border-white/40 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

          {/* Quick Links Section */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Explore Everything Boerne</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">From dreamy weddings to hidden gems, Bernie knows it all. Dive into our local favorites or ask Bernie for personalized recommendations.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Weddings - Featured */}
            <div className="group bg-white rounded-2xl shadow-xl p-8 border border-gray-200 hover:shadow-2xl hover:scale-105 transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-gradient-to-br from-pink-500 to-rose-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                ✨ FEATURED
              </div>
              <div className="text-5xl mb-6 text-center group-hover:scale-110 transition-transform duration-300">
                💍
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-pink-600 transition-colors">
                Weddings & Events
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">Plan your perfect Hill Country celebration with our curated vendors</p>
              <Link href="/weddings" className="inline-flex items-center text-pink-600 hover:text-pink-700 font-semibold group-hover:underline transition-all">
                Explore Weddings
                <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Dining */}
            <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-boerne-green hover:shadow-xl transition-shadow">
              <h3 className="text-lg font-semibold text-boerne-navy mb-2 flex items-center">
                Dining <span className="ml-2">🍽️</span>
              </h3>
              <p className="text-boerne-dark-gray mb-4">From German cuisine to Texas BBQ</p>
              <a href="/dining" className="text-boerne-green hover:text-boerne-gold font-medium transition-colors">
                Find Restaurants →
              </a>
            </div>

            {/* Stay & Play */}
            <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-boerne-light-blue hover:shadow-xl transition-shadow">
              <h3 className="text-lg font-semibold text-boerne-navy mb-2 flex items-center">
                Stay & Play <span className="ml-2">🏨</span>
              </h3>
              <p className="text-boerne-dark-gray mb-4">Accommodations and activities</p>
              <a href="/stay-play" className="text-boerne-light-blue hover:text-boerne-gold font-medium transition-colors">
                Plan Your Visit →
              </a>
            </div>

            {/* Shopping */}
            <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-boerne-gold hover:shadow-xl transition-shadow">
              <h3 className="text-lg font-semibold text-boerne-navy mb-2 flex items-center">
                Shopping <span className="ml-2">🛍️</span>
              </h3>
              <p className="text-boerne-dark-gray mb-4">Hill Country Mile and local shops</p>
              <a href="/shopping" className="text-boerne-gold hover:text-boerne-gold-alt font-medium transition-colors">
                Shop Local →
              </a>
            </div>

            {/* Outdoor */}
            <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-boerne-green hover:shadow-xl transition-shadow">
              <h3 className="text-lg font-semibold text-boerne-navy mb-2 flex items-center">
                Outdoor Adventures <span className="ml-2">🥾</span>
              </h3>
              <p className="text-boerne-dark-gray mb-4">Parks, trails, and nature</p>
              <a href="/outdoor" className="text-boerne-green hover:text-boerne-gold font-medium transition-colors">
                Get Outside →
              </a>
            </div>

            {/* Professional Services */}
            <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-boerne-light-blue hover:shadow-xl transition-shadow">
              <h3 className="text-lg font-semibold text-boerne-navy mb-2 flex items-center">
                Professional Services <span className="ml-2">💼</span>
              </h3>
              <p className="text-boerne-dark-gray mb-4">Local business directory</p>
              <a href="/services" className="text-boerne-light-blue hover:text-boerne-gold font-medium transition-colors">
                Find Services →
              </a>
            </div>

            {/* About Boerne */}
            <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-boerne-navy hover:shadow-xl transition-shadow">
              <h3 className="text-lg font-semibold text-boerne-navy mb-2 flex items-center">
                About Boerne <span className="ml-2">ℹ️</span>
              </h3>
              <p className="text-boerne-dark-gray mb-4">History, culture, and community</p>
              <a href="/about" className="text-boerne-navy hover:text-boerne-gold font-medium transition-colors">
                Learn More →
              </a>
            </div>

            {/* Business Directory */}
            <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-boerne-gold hover:shadow-xl transition-shadow">
              <h3 className="text-lg font-semibold text-boerne-navy mb-2 flex items-center">
                List Your Business <span className="ml-2">📍</span>
              </h3>
              <p className="text-boerne-dark-gray mb-4">Join Boerne's directory</p>
              <a href="/business/onboard" className="text-boerne-gold hover:text-boerne-gold-alt font-medium transition-colors">
                Get Listed →
              </a>
            </div>
          </div>

          {/* About Section */}
          <div className="mt-16 text-center">
            <h2 className="text-3xl font-bold text-boerne-navy mb-4">The Heart of Texas Hill Country</h2>
            <p className="text-boerne-dark-gray max-w-3xl mx-auto text-lg leading-relaxed">
              Located just 30 miles northwest of San Antonio, Boerne is a charming town known for its 
              German heritage, outdoor recreation, and tight-knit community. With a rich history dating 
              back to 1849, modern amenities, and stunning natural beauty, Boerne truly offers something 
              for everyone.
            </p>
          </div>

          {/* Key Stats */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="bg-white rounded-lg p-6 shadow">
              <div className="text-3xl font-bold text-boerne-gold mb-2">24,234</div>
              <div className="text-boerne-dark-gray">Population (2025)</div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow">
              <div className="text-3xl font-bold text-boerne-green mb-2">1849</div>
              <div className="text-boerne-dark-gray">Founded</div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow">
              <div className="text-3xl font-bold text-boerne-light-blue mb-2">30 mi</div>
              <div className="text-boerne-dark-gray">From San Antonio</div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow">
              <div className="text-3xl font-bold text-boerne-navy mb-2">78006</div>
              <div className="text-boerne-dark-gray">ZIP Code</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}