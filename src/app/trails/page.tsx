export default function Trails() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Hiking Trails in Boerne</h1>
      
      <div className="grid gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Cibolo Creek Trail</h2>
          <div className="flex flex-wrap gap-4 mb-4">
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Easy</span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">1.2 miles</span>
            <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">Paved</span>
          </div>
          
          <p className="text-gray-600 mb-4">
            A peaceful paved trail following Cibolo Creek through downtown Boerne. Perfect for walking, 
            jogging, or cycling with beautiful creek views.
          </p>
          
          <div className="mt-4">
            <h3 className="font-semibold text-gray-800 mb-2">Features:</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Creek views throughout</li>
              <li>Wheelchair accessible</li>
              <li>Dog friendly (on leash)</li>
              <li>Connects to Boerne City Park</li>
              <li>Benches along the route</li>
            </ul>
          </div>
          
          <p className="text-gray-600 mt-4"><strong>Trailhead:</strong> Boerne City Park</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Hill Country Trail</h2>
          <div className="flex flex-wrap gap-4 mb-4">
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">Moderate</span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Varies</span>
            <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">Natural Surface</span>
          </div>
          
          <p className="text-gray-600 mb-4">
            Experience the beautiful Texas Hill Country with various trail options around Boerne. 
            These trails offer more challenging terrain and stunning views.
          </p>
          
          <div className="mt-4">
            <h3 className="font-semibold text-gray-800 mb-2">What to Expect:</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Rolling hills and limestone terrain</li>
              <li>Native Texas vegetation</li>
              <li>Wildlife viewing opportunities</li>
              <li>Multiple difficulty levels</li>
              <li>Scenic overlooks</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
        <p className="text-yellow-800">
          <strong>Trail Safety:</strong> Always bring water, wear appropriate footwear, and let someone 
          know your hiking plans. Check weather conditions before heading out!
        </p>
      </div>
    </div>
  );
}