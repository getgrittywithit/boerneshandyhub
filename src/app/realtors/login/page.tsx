'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRealtorAuth } from '@/contexts/RealtorAuthContext';

export default function RealtorLoginPage() {
  const router = useRouter();
  const { signIn, signUp, loading: authLoading } = useRealtorAuth();

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        if (password.length < 8) {
          setError('Password must be at least 8 characters');
          setLoading(false);
          return;
        }
        const { error } = await signUp(email, password, name, company);
        if (error) {
          setError(error);
        } else {
          router.push('/realtors/dashboard');
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          setError(error);
        } else {
          router.push('/realtors/dashboard');
        }
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-boerne-navy py-4">
        <div className="max-w-7xl mx-auto px-4">
          <Link href="/" className="text-boerne-gold font-semibold text-lg">
            Boerne's Handy Hub
          </Link>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              {isSignUp ? 'Join the Partner Program' : 'Realtor Partner Login'}
            </h1>
            <p className="mt-2 text-gray-600">
              {isSignUp
                ? 'Create your free realtor account'
                : 'Sign in to manage your clients and welcome packets'
              }
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            {/* Toggle */}
            <div className="flex rounded-lg bg-gray-100 p-1 mb-6">
              <button
                onClick={() => setIsSignUp(false)}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                  !isSignUp ? 'bg-white shadow text-gray-900' : 'text-gray-600'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setIsSignUp(true)}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                  isSignUp ? 'bg-white shadow text-gray-900' : 'text-gray-600'
                }`}
              >
                Create Account
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="Jane Smith"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Brokerage / Company
                    </label>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      required
                      placeholder="Hill Country Realty"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="jane@hillcountryrealty.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent"
                />
                {isSignUp && (
                  <p className="text-xs text-gray-500 mt-1">Minimum 8 characters</p>
                )}
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-boerne-gold text-boerne-navy font-semibold rounded-lg hover:bg-boerne-gold-alt transition-colors disabled:opacity-50"
              >
                {loading ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Sign In')}
              </button>
            </form>

            {!isSignUp && (
              <p className="mt-4 text-center text-sm text-gray-500">
                <Link href="/realtors/forgot-password" className="text-boerne-gold hover:text-boerne-gold-alt">
                  Forgot your password?
                </Link>
              </p>
            )}
          </div>

          <p className="mt-6 text-center text-sm text-gray-500">
            <Link href="/realtors" className="text-boerne-gold hover:text-boerne-gold-alt">
              ← Back to Partner Program Info
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
