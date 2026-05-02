'use client';

import { useState, useCallback } from 'react';
import { submitContribution } from '@/lib/community/client';
import {
  ERAS,
  PHOTO_LIMITS,
  ATTESTATION_TEXT,
  type DisplayPref,
} from '@/lib/community/types';

interface PhotoMeta {
  file: File;
  preview: string;
  caption: string;
}

interface StoryFormProps {
  onSuccess: (message: string, requiresVerification: boolean) => void;
  targetCategory?: string;
}

export default function StoryForm({ onSuccess, targetCategory }: StoryFormProps) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [era, setEra] = useState('');
  const [relatedPlaces, setRelatedPlaces] = useState('');
  const [photos, setPhotos] = useState<PhotoMeta[]>([]);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [displayPref, setDisplayPref] = useState<DisplayPref>('first_name');
  const [ipAttestation, setIpAttestation] = useState(false);
  const [accuracyAttestation, setAccuracyAttestation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Handle file selection
  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return;

    const newPhotos: PhotoMeta[] = [];
    const remaining = PHOTO_LIMITS.MAX_PHOTOS_PER_SUBMISSION - photos.length;

    for (let i = 0; i < Math.min(files.length, remaining); i++) {
      const file = files[i];

      if (!PHOTO_LIMITS.ALLOWED_TYPES.includes(file.type as typeof PHOTO_LIMITS.ALLOWED_TYPES[number])) {
        setError(`${file.name} is not a supported image type`);
        continue;
      }

      if (file.size > PHOTO_LIMITS.MAX_FILE_SIZE_MB * 1024 * 1024) {
        setError(`${file.name} is too large (max ${PHOTO_LIMITS.MAX_FILE_SIZE_MB}MB)`);
        continue;
      }

      newPhotos.push({
        file,
        preview: URL.createObjectURL(file),
        caption: '',
      });
    }

    if (newPhotos.length > 0) {
      setPhotos((prev) => [...prev, ...newPhotos]);
      setError('');
    }
  }, [photos.length]);

  const removePhoto = (index: number) => {
    setPhotos((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const updatePhotoCaption = (index: number, caption: string) => {
    setPhotos((prev) =>
      prev.map((photo, i) => (i === index ? { ...photo, caption } : photo))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!ipAttestation || !accuracyAttestation) {
      setError('Please confirm both attestations to continue');
      return;
    }

    if (body.length < 200) {
      setError('Your story should be at least 200 characters');
      return;
    }

    setIsSubmitting(true);

    try {
      // Parse related places from comma-separated input
      const places = relatedPlaces
        .split(',')
        .map((p) => p.trim())
        .filter((p) => p.length > 0);

      const result = await submitContribution({
        type: 'story',
        email,
        name: name || undefined,
        display_pref: displayPref,
        ip_attestation: ipAttestation,
        accuracy_attestation: accuracyAttestation,
        title,
        body,
        era: era || undefined,
        related_places: places.length > 0 ? places : undefined,
        photos: photos.length > 0
          ? photos.map((p) => ({
              file: p.file,
              caption: p.caption || undefined,
            }))
          : undefined,
      });

      if (result.success) {
        photos.forEach((p) => URL.revokeObjectURL(p.preview));
        onSuccess(
          result.requires_verification
            ? "We've sent you a verification email. Click the link to confirm your submission. We'll review it within 48 hours."
            : "Thanks for sharing your story! We'll review it within 48 hours and email you when it's live.",
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
        <span className="text-3xl">📖</span>
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Share a story</h3>
          <p className="text-sm text-gray-500">
            Memories, history, tales of Boerne past and present
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            minLength={10}
            maxLength={120}
            placeholder="Give your story a title"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-boerne-gold"
          />
          <p className="text-xs text-gray-400 mt-1">{title.length}/120 characters</p>
        </div>

        {/* Body */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Your story <span className="text-red-500">*</span>
          </label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
            minLength={200}
            maxLength={3000}
            rows={10}
            placeholder="Tell us your story... (minimum 200 characters)"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-boerne-gold resize-none"
          />
          <p className="text-xs text-gray-400 mt-1">
            {body.length}/3000 characters
            {body.length < 200 && body.length > 0 && (
              <span className="text-amber-600 ml-2">
                ({200 - body.length} more needed)
              </span>
            )}
          </p>
        </div>

        {/* Era */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Time period
          </label>
          <select
            value={era}
            onChange={(e) => setEra(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-boerne-gold"
          >
            <option value="">Select a time period...</option>
            {ERAS.map((e) => (
              <option key={e.value} value={e.value}>
                {e.label}
              </option>
            ))}
          </select>
        </div>

        {/* Related places */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Related places
          </label>
          <input
            type="text"
            value={relatedPlaces}
            onChange={(e) => setRelatedPlaces(e.target.value)}
            placeholder="Main Street, Cibolo Creek, downtown..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-boerne-gold"
          />
          <p className="text-xs text-gray-400 mt-1">
            Separate multiple places with commas
          </p>
        </div>

        {/* Photos */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Photos <span className="text-gray-400">(optional)</span>
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
            <input
              type="file"
              id="story-photos"
              accept={PHOTO_LIMITS.ALLOWED_TYPES.join(',')}
              multiple
              onChange={(e) => handleFiles(e.target.files)}
              className="hidden"
            />
            <label
              htmlFor="story-photos"
              className="cursor-pointer text-gray-600 hover:text-gray-900"
            >
              <span className="text-2xl block mb-1">📷</span>
              Click to add photos that go with your story
            </label>
          </div>

          {photos.length > 0 && (
            <div className="mt-4 space-y-3">
              {photos.map((photo, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 bg-gray-50 rounded-lg p-3"
                >
                  <img
                    src={photo.preview}
                    alt={`Photo ${index + 1}`}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <input
                    type="text"
                    value={photo.caption}
                    onChange={(e) => updatePhotoCaption(index, e.target.value)}
                    placeholder="Caption (optional)"
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
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

          {/* Attestations */}
          <div className="space-y-3">
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

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={accuracyAttestation}
                  onChange={(e) => setAccuracyAttestation(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-boerne-gold focus:ring-boerne-gold"
                />
                <span className="text-sm text-gray-600">
                  I confirm that the information in this story is accurate to the
                  best of my knowledge. If this story references real people or
                  businesses, the claims made are factual or are clearly framed as
                  personal memory or opinion.
                </span>
              </label>
            </div>
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
          disabled={isSubmitting || !ipAttestation || !accuracyAttestation}
          className="w-full px-6 py-3 bg-boerne-navy text-white font-semibold rounded-lg hover:bg-boerne-navy/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Story'}
        </button>
      </form>
    </div>
  );
}
