export default function Events() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Events in Boerne</h1>
      
      <div className="grid gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Berges Fest</h2>
          <p className="text-gray-600 mb-2"><strong>When:</strong> Annual (Usually June)</p>
          <p className="text-gray-600 mb-4">
            Boerne&apos;s premier festival celebrating the town&apos;s German heritage with traditional music, 
            food, dancing, and family-friendly activities.
          </p>
          
          <div className="mt-4">
            <h3 className="font-semibold text-gray-800 mb-2">Festival Highlights:</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Traditional German music and dancing</li>
              <li>Authentic German food and beer</li>
              <li>Arts and crafts vendors</li>
              <li>Children&apos;s activities and games</li>
              <li>Live entertainment throughout the day</li>
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Boerne Farmers Market</h2>
          <p className="text-gray-600 mb-2"><strong>When:</strong> Saturday mornings on the square</p>
          <p className="text-gray-600 mb-4">
            Weekly farmers market featuring local produce, artisan goods, and community vendors 
            in the heart of downtown Boerne.
          </p>
          
          <div className="mt-4">
            <h3 className="font-semibold text-gray-800 mb-2">What You&apos;ll Find:</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Fresh local produce</li>
              <li>Handmade crafts and art</li>
              <li>Local honey and baked goods</li>
              <li>Live music performances</li>
              <li>Community gathering space</li>
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Kendall County Fair</h2>
          <p className="text-gray-600 mb-2"><strong>When:</strong> Annual summer event</p>
          <p className="text-gray-600 mb-4">
            Traditional county fair featuring livestock shows, carnival rides, local food vendors, 
            and community competitions.
          </p>
          
          <div className="mt-4">
            <h3 className="font-semibold text-gray-800 mb-2">Fair Activities:</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Livestock shows and competitions</li>
              <li>Carnival rides and games</li>
              <li>Local food vendors</li>
              <li>Arts and crafts exhibitions</li>
              <li>Live entertainment and concerts</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="mt-8 p-4 bg-purple-50 rounded-lg">
        <p className="text-purple-800">
          <strong>Stay Updated:</strong> Follow the City of Boerne and local Facebook groups to stay 
          informed about upcoming events and community activities!
        </p>
      </div>
    </div>
  );
}