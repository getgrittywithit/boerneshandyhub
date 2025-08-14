export default function DogParks() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Dog Parks in Boerne</h1>
      
      <div className="grid gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Boerne Dog Park</h2>
          <p className="text-gray-600 mb-2"><strong>Address:</strong> 402 S School St, Boerne, TX 78006</p>
          <p className="text-gray-600 mb-2"><strong>Hours:</strong> Dawn to Dusk</p>
          
          <div className="mt-4">
            <h3 className="font-semibold text-gray-800 mb-2">Features:</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Fenced area for off-leash play</li>
              <li>Separate small dog area</li>
              <li>Water fountains for dogs</li>
              <li>Waste stations throughout</li>
              <li>Shade trees and benches</li>
            </ul>
          </div>
          
          <div className="mt-4">
            <h3 className="font-semibold text-gray-800 mb-2">Rules:</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Dogs must be on leash until inside fenced area</li>
              <li>Pick up after your pet</li>
              <li>Supervise your dog at all times</li>
              <li>Dogs must be current on vaccinations</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <p className="text-blue-800">
          <strong>Tip:</strong> The dog park is located within Boerne City Park, so you can enjoy 
          the playground and walking trails while your furry friend plays!
        </p>
      </div>
    </div>
  );
}