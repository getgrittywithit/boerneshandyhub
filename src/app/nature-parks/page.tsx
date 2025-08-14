export default function NatureParks() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Nature Parks in Boerne</h1>
      
      <div className="grid gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Boerne City Park</h2>
          <p className="text-gray-600 mb-2"><strong>Address:</strong> 402 S School St, Boerne, TX 78006</p>
          <p className="text-gray-600 mb-4">The heart of Boerne&apos;s outdoor recreation, featuring beautiful Cibolo Creek access.</p>
          
          <div className="mt-4">
            <h3 className="font-semibold text-gray-800 mb-2">Amenities:</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Playground equipment</li>
              <li>Pavilions for events</li>
              <li>Cibolo Creek access</li>
              <li>Walking trails</li>
              <li>Dog park</li>
              <li>Picnic areas</li>
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Cibolo Nature Center</h2>
          <p className="text-gray-600 mb-2"><strong>Address:</strong> 140 City Park Rd, Boerne, TX 78006</p>
          <p className="text-gray-600 mb-4">A 100+ acre nature preserve dedicated to education and conservation.</p>
          
          <div className="mt-4">
            <h3 className="font-semibold text-gray-800 mb-2">Features:</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Nature trails through diverse habitats</li>
              <li>Educational exhibits</li>
              <li>Native plant gardens</li>
              <li>Bird watching opportunities</li>
              <li>Hands-on learning programs</li>
              <li>Historic farm buildings</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="mt-8 p-4 bg-green-50 rounded-lg">
        <p className="text-green-800">
          <strong>Did you know?</strong> The Cibolo Nature Center offers guided tours and educational 
          programs throughout the year. Check their website for current schedules!
        </p>
      </div>
    </div>
  );
}