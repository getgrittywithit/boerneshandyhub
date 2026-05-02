'use client';

import { useState, useCallback } from 'react';
import { submitContribution } from '@/lib/community/client';
import {
  PHOTO_LIMITS,
  PHOTO_YEARS,
  NEIGHBORHOODS,
  ATTESTATION_TEXT,
  type DisplayPref,
} from '@/lib/community/types';

interface PhotoMeta {
  file: File;
  preview: string;
  caption: string;
  year: number | null;
  location: string;
  neighborhood: string;
  related_category: string;
  related_business: string;
}

interface PhotoFormProps {
  onSuccess: (message: string, requiresVerification: boolean) => void;
  targetCategory?: string;
}

export default function PhotoForm({ onSuccess, targetCategory }: PhotoFormProps) {
  const [step, setStep] = useState<'upload' | 'details'>('upload');
  const [photos, setPhotos] = useState<PhotoMeta[]>([]);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [displayPref, setDisplayPref] = useState<DisplayPref>('first_name');
  const [ipAttestation, setIpAttestation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);

  // Handle file selection
  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return;

    const newPhotos: PhotoMeta[] = [];
    const remaining = PHOTO_LIMITS.MAX_PHOTOS_PER_SUBMISSION - photos.length;

    for (let i = 0; i < Math.min(files.length, remaining); i++) {
      const file = files[i];

      // Validate file type
      if (!PHOTO_LIMITS.ALLOWED_TYPES.includes(file.type as typeof PHOTO_LIMITS.ALLOWED_TYPES[number])) {
        setError(`${file.name} is not a supported image type`);
        continue;
      }

      // Validate file size
      if (file.size > PHOTO_LIMITS.MAX_FILE_SIZE_MB * 1024 * 1024) {
        setError(`${file.name} is too large (max ${PHOTO_LIMITS.MAX_FILE_SIZE_MB}MB)`);
        continue;
      }

      newPhotos.push({
        file,
        preview: URL.createObjectURL(file),
        caption: '',
        year: null,
        location: '',
        neighborhood: '',
        related_category: targetCategory || '',
        related_business: '',
      });
    }

    if (newPhotos.length > 0) {
      setPhotos((prev) => [...prev, ...newPhotos]);
      setError('');
    }
  }, [photos.length, targetCategory]);

  // Drag and drop handlers
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  // Remove a photo
  const removePhoto = (index: number) => {
    setPhotos((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  // Update photo metadata
  const updatePhotoMeta = (index: number, updates: Partial<PhotoMeta>) => {
    setPhotos((prev) =>
      prev.map((photo, i) => (i === index ? { ...photo, ...updates } : photo))
    );
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!ipAttestation) {
      setError('Please confirm the attestation to continue');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await submitContribution({
        type: 'photo',
        email,
        name: name || undefined,
        display_pref: displayPref,
        ip_attestation: ipAttestation,
        photos: photos.map((p) => ({
          file: p.file,
          caption: p.caption || undefined,
          year: p.year,
          location: p.location || undefined,
          neighborhood: p.neighborhood || undefined,
          related_category: p.related_category || undefined,
          related_business: p.related_business || undefined,
        })),
      });

      if (result.success) {
        // Clean up previews
        photos.forEach((p) => URL.revokeObjectURL(p.preview));
        onSuccess(
          result.requires_verification
            ? "We've sent you a verification email. Click the link to confirm your submission. We'll review it within 48 hours."
            : "Thanks for sharing! We'll review your photo(s) within 48 hours and email you when they're live.",
          result.requires_verification || false
        );
      } else {
        setError(result.message || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setError('Failed to submit. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">📷</span>
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Share a photo</h3>
          <p className="text-sm text-gray-500">
            Historic photos, current shots of Boerne — all welcome
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Upload */}
        {step === 'upload' && (
          <>
            {/* Drop zone */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                dragActive
                  ? 'border-boerne-gold bg-boerne-gold/5'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <input
                type="file"
                id="photos"
                accept={PHOTO_LIMITS.ALLOWED_TYPES.join(',')}
                multiple
                onChange={(e) => handleFiles(e.target.files)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="text-4xl mb-3">📸</div>
              <p className="text-gray-700 font-medium mb-1">
                Drag photos here or click to browse
              </p>
              <p className="text-sm text-gray-500">
                Up to {PHOTO_LIMITS.MAX_PHOTOS_PER_SUBMISSION} photos, {PHOTO_LIMITS.MAX_FILE_SIZE_MB}MB each
              </p>
              <p className="text-xs text-gray-400 mt-2">
                JPEG, PNG, HEIC, or WebP
              </p>
            </div>

            {/* Photo previews */}
            {photos.length > 0 && (
              <div className="grid grid-cols-2 gap-4">
                {photos.map((photo, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={photo.preview}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {photos.length > 0 && (
              <button
                type="button"
                onClick={() => setStep('details')}
                className="w-full px-6 py-3 bg-boerne-gold text-boerne-navy font-semibold rounded-lg hover:bg-boerne-gold-alt transition-colors"
              >
                Next: Add details →
              </button>
            )}
          </>
        )}

        {/* Step 2: Details */}
        {step === 'details' && (
          <>
            <button
              type="button"
              onClick={() => setStep('upload')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              ← Back to photos
            </button>

            {/* Per-photo details */}
            <div className="space-y-6">
              {photos.map((photo, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex gap-4 mb-4">
                    <img
                      src={photo.preview}
                      alt={`Photo ${index + 1}`}
                      className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Caption
                        </label>
                        <input
                          type="text"
                          value={photo.caption}
                          onChange={(e) =>
                            updatePhotoMeta(index, { caption: e.target.value })
                          }
                          placeholder="What's in this photo?"
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-boerne-gold"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Year
                          </label>
                          <select
                            value={photo.year ?? ''}
                            onChange={(e) =>
                              updatePhotoMeta(index, {
                                year: e.target.value ? Number(e.target.value) : null,
                              })
                            }
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-boerne-gold"
                          >
                            {PHOTO_YEARS.slice(0, 50).map((y) => (
                              <option key={y.value ?? 'current'} value={y.value ?? ''}>
                                {y.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Neighborhood
                          </label>
                          <select
                            value={photo.neighborhood}
                            onChange={(e) =>
                              updatePhotoMeta(index, { neighborhood: e.target.value })
                            }
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-boerne-gold"
                          >
                            <option value="">Select...</option>
                            {NEIGHBORHOODS.map((n) => (
                              <option key={n} value={n}>
                                {n}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Contributor info */}
            <div className="border-t border-gray-200 pt-6 space-y-4">
              <h4 className="font-medium text-gray-900">Your information</h4>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-boerne-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-boerne-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  How should we display your name?
                </label>
                <select
                  value={displayPref}
                  onChange={(e) => setDisplayPref(e.target.value as DisplayPref)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-boerne-gold"
                >
                  <option value="full_name">Full name</option>
                  <option value="first_name">First name only</option>
                  <option value="initials">Initials</option>
                  <option value="anonymous">Anonymous</option>
                </select>
              </div>

              {/* Attestation */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={ipAttestation}
                    onChange={(e) => setIpAttestation(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-boerne-gold focus:ring-boerne-gold"
                  />
                  <span className="text-sm text-gray-600">{ATTESTATION_TEXT}</span>
                </label>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting || !ipAttestation}
              className="w-full px-6 py-3 bg-boerne-navy text-white font-semibold rounded-lg hover:bg-boerne-navy/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Uploading...' : 'Submit Photo(s)'}
            </button>
          </>
        )}
      </form>
    </div>
  );
}
