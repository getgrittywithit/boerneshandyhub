import AIChat from "@/components/AIChat";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section with Bernie Chat */}
      <div 
        className="relative bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1564069114553-7215e1ff1890?q=80&w=2832')`,
          minHeight: '600px'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-8">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
              Welcome to Boerne
            </h1>
            <p className="text-2xl text-white/90 mb-2 drop-shadow">
              The Heart of Texas Hill Country
            </p>
            <p className="text-lg text-white/80 drop-shadow">
              Ask Bernie anything about our beautiful town
            </p>
          </div>
          
          {/* Chat Component in Hero */}
          <div className="max-w-3xl mx-auto">
            <AIChat />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-boerne-light-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

          {/* Quick Links Section */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-boerne-navy mb-4">Explore Boerne</h2>
            <p className="text-lg text-boerne-dark-gray">Your gateway to everything our Hill Country town has to offer</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Weddings - Featured */}
            <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-boerne-gold hover:shadow-xl transition-shadow relative">
              <div className="absolute -top-3 right-4 bg-boerne-gold text-boerne-navy text-xs font-bold px-2 py-1 rounded">
                FEATURED
              </div>
              <h3 className="text-lg font-semibold text-boerne-navy mb-2 flex items-center">
                Weddings & Events <span className="ml-2">💍</span>
              </h3>
              <p className="text-boerne-dark-gray mb-4">Plan your perfect Hill Country celebration</p>
              <a href="/weddings" className="text-boerne-gold hover:text-boerne-gold-alt font-medium transition-colors">
                Explore Weddings →
              </a>
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