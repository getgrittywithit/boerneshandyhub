export default function Restaurants() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Restaurants in Boerne</h1>
      
      <div className="grid gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">The Dodging Duck Brewhaus</h2>
          <p className="text-gray-600 mb-2"><strong>Cuisine:</strong> German-American, Brewery</p>
          <p className="text-gray-600 mb-4">
            Local brewery featuring German-inspired food and craft beers. A favorite gathering spot 
            for locals and visitors alike.
          </p>
          
          <div className="mt-4">
            <h3 className="font-semibold text-gray-800 mb-2">Specialties:</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Craft beer brewed on-site</li>
              <li>Traditional German sausages</li>
              <li>Schnitzel and pretzels</li>
              <li>Live music events</li>
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Peggy&apos;s on the Green</h2>
          <p className="text-gray-600 mb-2"><strong>Cuisine:</strong> Fine Dining, American</p>
          <p className="text-gray-600 mb-4">
            Upscale dining experience located on the historic town square. Known for excellent 
            service and creative seasonal menus.
          </p>
          
          <div className="mt-4">
            <h3 className="font-semibold text-gray-800 mb-2">Highlights:</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Historic town square location</li>
              <li>Seasonal menu featuring local ingredients</li>
              <li>Extensive wine selection</li>
              <li>Elegant atmosphere</li>
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Bear Moon Bakery</h2>
          <p className="text-gray-600 mb-2"><strong>Cuisine:</strong> Bakery, Breakfast, Coffee</p>
          <p className="text-gray-600 mb-4">
            Local favorite for fresh-baked goods, breakfast, and excellent coffee. Perfect for 
            a morning treat or casual lunch.
          </p>
          
          <div className="mt-4">
            <h3 className="font-semibold text-gray-800 mb-2">Must-Try:</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Fresh-baked pastries and breads</li>
              <li>Specialty coffee drinks</li>
              <li>Breakfast tacos</li>
              <li>Homemade soups and sandwiches</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="mt-8 p-4 bg-orange-50 rounded-lg">
        <p className="text-orange-800">
          <strong>Local Tip:</strong> Many Boerne restaurants get busy during weekends and special events. 
          Consider making reservations, especially for dinner at fine dining establishments!
        </p>
      </div>
    </div>
  );
}