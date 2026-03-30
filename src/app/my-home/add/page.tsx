'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useHomeownerAuth } from '@/contexts/HomeownerAuthContext';
import { useHomes, useTasks } from '@/hooks/useHomeTracker';
import { systemInfo, type HomeSystemType } from '@/types/homeTracker';

// Systems every home has - we assume these
const STANDARD_SYSTEMS: HomeSystemType[] = [
  'hvac',
  'plumbing',
  'electrical',
  'waterHeater',
  'roof',
  'gutters',
  'appliances',
  'exterior',
  'windows',
];

// Optional systems we ask about
const OPTIONAL_SYSTEMS: { type: HomeSystemType; question: string }[] = [
  { type: 'pool', question: 'Do you have a pool or spa?' },
  { type: 'septic', question: 'Septic system? (vs city sewer)' },
  { type: 'well', question: 'Well water? (vs city water)' },
  { type: 'fireplace', question: 'Fireplace or wood stove?' },
  { type: 'sprinkler', question: 'Sprinkler/irrigation system?' },
  { type: 'garage', question: 'Garage door opener?' },
];

export default function AddHomePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useHomeownerAuth();
  const { addHome, addSystem } = useHomes();
  const { generateTasksForHome } = useTasks();

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: 'Boerne',
    yearBuilt: '',
    squareFeet: '',
  });
  const [optionalSystems, setOptionalSystems] = useState<Record<HomeSystemType, boolean>>({} as Record<HomeSystemType, boolean>);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/my-home/login');
    }
  }, [authLoading, user, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleOptional = (systemType: HomeSystemType) => {
    setOptionalSystems(prev => ({
      ...prev,
      [systemType]: !prev[systemType],
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Combine standard + selected optional systems
      const selectedOptional = OPTIONAL_SYSTEMS
        .filter(s => optionalSystems[s.type])
        .map(s => s.type);
      const allSystems = [...STANDARD_SYSTEMS, ...selectedOptional];

      // Create the home
      const newHome = await addHome({
        name: formData.name || 'My Home',
        address: formData.address,
        city: formData.city,
        yearBuilt: formData.yearBuilt ? parseInt(formData.yearBuilt) : null,
        squareFeet: formData.squareFeet ? parseInt(formData.squareFeet) : null,
        lotSize: null,
        bedrooms: null,
        bathrooms: null,
      });

      if (!newHome) {
        throw new Error('Failed to create home');
      }

      // Add all systems
      for (const systemType of allSystems) {
        await addSystem(newHome.id, {
          type: systemType,
          name: systemInfo[systemType].name,
        });
      }

      // Generate maintenance tasks
      const homeWithSystems = {
        ...newHome,
        systems: allSystems.map(type => ({
          id: `temp-${type}`,
          type,
          name: systemInfo[type].name,
        })),
      };
      await generateTasksForHome(homeWithSystems);

      router.push(`/my-home/${newHome.id}`);
    } catch (error) {
      console.error('Failed to create home:', error);
      setIsSubmitting(false);
    }
  };

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-boerne-navy via-boerne-dark-gray to-boerne-navy">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            Quick setup to get your personalized maintenance schedule
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Basic Info */}
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name this home
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Our House, Lake House"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Year Built <span className="text-gray-400 font-normal">(optional)</span>
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
            </div>
          </div>

          {/* Optional Systems */}
          <div className="mt-8 pt-6 border-t">
            <h3 className="font-semibold text-gray-900 mb-1">Does your home have any of these?</h3>
            <p className="text-sm text-gray-500 mb-4">Check all that apply. We'll include them in your maintenance schedule.</p>

            <div className="grid grid-cols-2 gap-3">
              {OPTIONAL_SYSTEMS.map(({ type, question }) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => toggleOptional(type)}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    optionalSystems[type]
                      ? 'border-boerne-gold bg-boerne-gold/10'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{systemInfo[type].icon}</span>
                    <span className="text-sm text-gray-700">{question}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* What's Included */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>We'll automatically track:</strong> HVAC, plumbing, electrical, water heater, roof, gutters, appliances, windows & exterior — the essentials every home needs.
            </p>
          </div>

          {/* Submit */}
          <div className="mt-8">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full px-6 py-4 bg-boerne-gold text-boerne-navy font-semibold rounded-lg hover:bg-boerne-gold-alt transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg"
            >
              {isSubmitting ? 'Creating...' : 'Create My Maintenance Schedule'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
