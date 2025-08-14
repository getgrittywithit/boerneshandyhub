export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Boerne Handy Hub
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Your local guide to everything Boerne, Texas
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Dog Parks</h3>
          <p className="text-gray-600 mb-4">Find the best dog-friendly spaces in Boerne</p>
          <a href="/dog-parks" className="text-blue-600 hover:text-blue-800 font-medium">
            Explore Dog Parks →
          </a>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Nature Parks</h3>
          <p className="text-gray-600 mb-4">Discover beautiful natural areas and city parks</p>
          <a href="/nature-parks" className="text-blue-600 hover:text-blue-800 font-medium">
            Explore Nature Parks →
          </a>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Hiking Trails</h3>
          <p className="text-gray-600 mb-4">Find trails for every skill level</p>
          <a href="/trails" className="text-blue-600 hover:text-blue-800 font-medium">
            Explore Trails →
          </a>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Restaurants</h3>
          <p className="text-gray-600 mb-4">Local dining favorites and hidden gems</p>
          <a href="/restaurants" className="text-blue-600 hover:text-blue-800 font-medium">
            Explore Restaurants →
          </a>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Events</h3>
          <p className="text-gray-600 mb-4">Stay updated on community events</p>
          <a href="/events" className="text-blue-600 hover:text-blue-800 font-medium">
            View Events →
          </a>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Services</h3>
          <p className="text-gray-600 mb-4">Local business directory</p>
          <a href="/services" className="text-blue-600 hover:text-blue-800 font-medium">
            Browse Services →
          </a>
        </div>
      </div>

      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">About Boerne</h2>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Located in the beautiful Texas Hill Country, Boerne is a charming town just 30 miles 
          northwest of San Antonio. Known for its German heritage, outdoor recreation, and 
          tight-knit community, Boerne offers something for everyone.
        </p>
      </div>
    </div>
  );
}