'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useHomes, useTasks } from '@/hooks/useHomeTracker';
import { systemInfo, type HomeSystemType } from '@/types/homeTracker';

export default function AddHomePage() {
  const router = useRouter();
  const { addHome, addSystem } = useHomes();
  const { generateTasksForHome } = useTasks();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: 'Boerne',
    yearBuilt: '',
    squareFeet: '',
    bedrooms: '',
    bathrooms: '',
  });
  const [selectedSystems, setSelectedSystems] = useState<HomeSystemType[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const systemTypes = Object.entries(systemInfo) as [HomeSystemType, typeof systemInfo[HomeSystemType]][];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleSystem = (systemType: HomeSystemType) => {
    setSelectedSystems(prev =>
      prev.includes(systemType)
        ? prev.filter(s => s !== systemType)
        : [...prev, systemType]
    );
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    // Create the home
    const newHome = addHome({
      name: formData.name || 'My Home',
      address: formData.address,
      city: formData.city,
      yearBuilt: formData.yearBuilt ? parseInt(formData.yearBuilt) : null,
      squareFeet: formData.squareFeet ? parseInt(formData.squareFeet) : null,
      lotSize: null,
      bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
      bathrooms: formData.bathrooms ? parseFloat(formData.bathrooms) : null,
    });

    // Add selected systems
    for (const systemType of selectedSystems) {
      addSystem(newHome.id, {
        type: systemType,
        name: systemInfo[systemType].name,
      });
    }

    // Generate maintenance tasks - need to get the updated home with systems
    // Small delay to ensure state updates
    setTimeout(() => {
      const homeWithSystems = {
        ...newHome,
        systems: selectedSystems.map(type => ({
          id: `temp-${type}`,
          type,
          name: systemInfo[type].name,
        })),
      };
      generateTasksForHome(homeWithSystems);
      router.push(`/my-home/${newHome.id}`);
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-boerne-navy via-boerne-dark-gray to-boerne-navy">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="mb-4">
            <ol className="flex items-center gap-2 text-sm text-white/60">
              <li>
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
              </li>
              <li>/</li>
              <li>
                <Link href="/my-home" className="hover:text-white transition-colors">My Home Tracker</Link>
              </li>
              <li>/</li>
              <li className="text-white font-medium">Add Home</li>
            </ol>
          </nav>
          <h1 className="text-3xl font-bold text-white">Add Your Home</h1>
          <p className="mt-2 text-white/70">
            Set up your home profile to get a personalized maintenance schedule
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-4">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold ${
              step >= 1 ? 'bg-boerne-gold text-boerne-navy' : 'bg-gray-200 text-gray-500'
            }`}>
              1
            </div>
            <div className={`w-16 h-1 ${step >= 2 ? 'bg-boerne-gold' : 'bg-gray-200'}`} />
            <div className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold ${
              step >= 2 ? 'bg-boerne-gold text-boerne-navy' : 'bg-gray-200 text-gray-500'
            }`}>
              2
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          {step === 1 && (
            <>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Home Details</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Home Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Main House, Lake House, Rental"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="123 Main Street"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent"
                  >
                    <option value="Boerne">Boerne</option>
                    <option value="Fair Oaks Ranch">Fair Oaks Ranch</option>
                    <option value="Comfort">Comfort</option>
                    <option value="Kendalia">Kendalia</option>
                    <option value="Bergheim">Bergheim</option>
                    <option value="Leon Springs">Leon Springs</option>
                    <option value="Helotes">Helotes</option>
                    <option value="Other Hill Country">Other Hill Country</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Year Built
                    </label>
                    <input
                      type="number"
                      name="yearBuilt"
                      value={formData.yearBuilt}
                      onChange={handleInputChange}
                      placeholder="2005"
                      min="1900"
                      max={new Date().getFullYear()}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Square Feet
                    </label>
                    <input
                      type="number"
                      name="squareFeet"
                      value={formData.squareFeet}
                      onChange={handleInputChange}
                      placeholder="2500"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bedrooms
                    </label>
                    <select
                      name="bedrooms"
                      value={formData.bedrooms}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent"
                    >
                      <option value="">Select</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5+</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bathrooms
                    </label>
                    <select
                      name="bathrooms"
                      value={formData.bathrooms}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent"
                    >
                      <option value="">Select</option>
                      <option value="1">1</option>
                      <option value="1.5">1.5</option>
                      <option value="2">2</option>
                      <option value="2.5">2.5</option>
                      <option value="3">3</option>
                      <option value="3.5">3.5</option>
                      <option value="4">4+</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-8">
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-3 bg-boerne-gold text-boerne-navy font-semibold rounded-lg hover:bg-boerne-gold-alt transition-colors"
                >
                  Next: Select Systems
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">What's in Your Home?</h2>
              <p className="text-gray-600 mb-6">
                Select the systems and features in your home. We'll create a maintenance schedule based on your selections.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {systemTypes.map(([type, info]) => (
                  <button
                    key={type}
                    onClick={() => toggleSystem(type)}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      selectedSystems.includes(type)
                        ? 'border-boerne-gold bg-boerne-gold/10'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{info.icon}</span>
                      <span className="font-medium text-gray-900 text-sm">{info.name}</span>
                    </div>
                    {selectedSystems.includes(type) && (
                      <div className="mt-2 text-boerne-gold text-sm font-medium">
                        ✓ Selected
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Common presets */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-3">Quick Select:</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedSystems(['hvac', 'plumbing', 'electrical', 'waterHeater', 'roof', 'gutters', 'appliances', 'exterior'])}
                    className="px-3 py-1 bg-white border border-gray-300 rounded-full text-sm hover:bg-gray-50"
                  >
                    Typical Home
                  </button>
                  <button
                    onClick={() => setSelectedSystems(['hvac', 'plumbing', 'electrical', 'waterHeater', 'roof', 'gutters', 'appliances', 'exterior', 'pool', 'sprinkler', 'foundation'])}
                    className="px-3 py-1 bg-white border border-gray-300 rounded-full text-sm hover:bg-gray-50"
                  >
                    Full Property
                  </button>
                  <button
                    onClick={() => setSelectedSystems(['hvac', 'plumbing', 'electrical', 'waterHeater', 'roof', 'septic', 'well', 'foundation'])}
                    className="px-3 py-1 bg-white border border-gray-300 rounded-full text-sm hover:bg-gray-50"
                  >
                    Rural/Ranch
                  </button>
                  <button
                    onClick={() => setSelectedSystems([])}
                    className="px-3 py-1 bg-white border border-gray-300 rounded-full text-sm hover:bg-gray-50"
                  >
                    Clear All
                  </button>
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-3 text-gray-700 font-semibold hover:text-gray-900 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || selectedSystems.length === 0}
                  className="px-6 py-3 bg-boerne-gold text-boerne-navy font-semibold rounded-lg hover:bg-boerne-gold-alt transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Creating...' : `Create Home (${selectedSystems.length} systems)`}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
