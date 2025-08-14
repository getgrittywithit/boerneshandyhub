export default function Services() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Local Services in Boerne</h1>
      
      <div className="grid gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">City Services</h2>
          <p className="text-gray-600 mb-4">
            Essential city services and contact information for Boerne residents.
          </p>
          
          <div className="mt-4">
            <h3 className="font-semibold text-gray-800 mb-2">Key Services:</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>City Hall and administration</li>
              <li>Public utilities (water, electric)</li>
              <li>Waste management and recycling</li>
              <li>Parks and recreation services</li>
              <li>Building permits and inspections</li>
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Healthcare</h2>
          <p className="text-gray-600 mb-4">
            Medical and healthcare services available in the Boerne area.
          </p>
          
          <div className="mt-4">
            <h3 className="font-semibold text-gray-800 mb-2">Available Services:</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Primary care physicians</li>
              <li>Dental offices</li>
              <li>Veterinary services</li>
              <li>Urgent care facilities</li>
              <li>Specialty medical practices</li>
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Shopping & Retail</h2>
          <p className="text-gray-600 mb-4">
            Local shopping options from boutiques to essential services.
          </p>
          
          <div className="mt-4">
            <h3 className="font-semibold text-gray-800 mb-2">Shopping Areas:</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Historic Main Plaza boutiques</li>
              <li>Grocery stores and markets</li>
              <li>Hardware and home improvement</li>
              <li>Antique shops and galleries</li>
              <li>Specialty local businesses</li>
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Professional Services</h2>
          <p className="text-gray-600 mb-4">
            Professional and business services for residents and visitors.
          </p>
          
          <div className="mt-4">
            <h3 className="font-semibold text-gray-800 mb-2">Services Available:</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Banking and financial services</li>
              <li>Real estate agencies</li>
              <li>Legal services</li>
              <li>Automotive repair and services</li>
              <li>Home maintenance and contractors</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="mt-8 p-4 bg-indigo-50 rounded-lg">
        <p className="text-indigo-800">
          <strong>Support Local:</strong> Boerne has a thriving local business community. 
          Consider supporting local shops and services when possible!
        </p>
      </div>
    </div>
  );
}