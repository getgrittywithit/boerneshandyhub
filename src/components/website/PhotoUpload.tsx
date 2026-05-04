'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { Upload, X, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

export type PhotoType = 'logo' | 'hero' | 'gallery';

interface UploadedPhoto {
  id: string;
  storage_path: string;
  derivatives: {
    thumb: string;
    medium: string;
    large: string;
  };
}

interface PhotoUploadProps {
  photoType: PhotoType;
  businessId: string;
  websiteId: string;
  currentPhoto?: UploadedPhoto | null;
  currentPhotos?: UploadedPhoto[]; // For gallery
  maxPhotos?: number; // For gallery
  photoLimit: number; // From tier
  currentPhotoCount: number; // Current total photos
  onUpload: (photo: UploadedPhoto) => void;
  onDelete: (photoId: string) => void;
}

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const typeLabels: Record<PhotoType, { title: string; description: string; icon: string }> = {
  logo: {
    title: 'Business Logo',
    description: 'Square image works best (e.g., 500x500)',
    icon: '🏢',
  },
  hero: {
    title: 'Hero Image',
    description: 'Wide image for your header (e.g., 1600x600)',
    icon: '🖼️',
  },
  gallery: {
    title: 'Work Photos',
    description: 'Show off your completed projects',
    icon: '📸',
  },
};

export default function PhotoUpload({
  photoType,
  businessId,
  websiteId,
  currentPhoto,
  currentPhotos = [],
  maxPhotos = 10,
  photoLimit,
  currentPhotoCount,
  onUpload,
  onDelete,
}: PhotoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const remainingPhotos = photoLimit - currentPhotoCount;
  const typeConfig = typeLabels[photoType];

  const getPhotoUrl = (photo: UploadedPhoto, size: 'thumb' | 'medium' | 'large' = 'medium') => {
    const bucket = 'website-photos';
    const path = photo.derivatives?.[size] || photo.storage_path;
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`;
  };

  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    setError(null);

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Invalid file type. Please use JPG, PNG, WebP, or GIF');
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setError('File too large. Maximum size is 5MB');
      return;
    }

    // Check photo limit
    if (remainingPhotos <= 0) {
      setError(`Photo limit reached (${photoLimit} photos for your tier)`);
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('business_id', businessId);
      formData.append('website_id', websiteId);
      formData.append('photo_type', photoType);

      const res = await fetch('/api/websites/photos/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();

      if (!result.success) {
        setError(result.error || 'Upload failed');
        return;
      }

      onUpload(result.photo);
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload. Please try again.');
    } finally {
      setUploading(false);
    }
  }, [businessId, websiteId, photoType, remainingPhotos, photoLimit, onUpload]);

  const handleDelete = async (photoId: string) => {
    if (deleting) return;

    setDeleting(photoId);
    setError(null);

    try {
      const res = await fetch(`/api/websites/photos/${photoId}?business_id=${businessId}`, {
        method: 'DELETE',
      });

      const result = await res.json();

      if (!result.success) {
        setError(result.error || 'Delete failed');
        return;
      }

      onDelete(photoId);
    } catch (err) {
      console.error('Delete error:', err);
      setError('Failed to delete. Please try again.');
    } finally {
      setDeleting(null);
    }
  };

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

  // For logo and hero, show single upload zone or current photo
  if (photoType === 'logo' || photoType === 'hero') {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">{typeConfig.icon}</span>
            <div>
              <h4 className="font-medium text-gray-900">{typeConfig.title}</h4>
              <p className="text-xs text-gray-500">{typeConfig.description}</p>
            </div>
          </div>
        </div>

        {currentPhoto ? (
          <div className="relative group">
            <div className={`relative overflow-hidden rounded-lg border border-gray-200 ${
              photoType === 'logo' ? 'w-32 h-32' : 'w-full h-40'
            }`}>
              <Image
                src={getPhotoUrl(currentPhoto, photoType === 'logo' ? 'thumb' : 'medium')}
                alt={typeConfig.title}
                fill
                className="object-cover"
              />
            </div>
            <button
              onClick={() => handleDelete(currentPhoto.id)}
              disabled={deleting === currentPhoto.id}
              className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
            >
              {deleting === currentPhoto.id ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <X size={14} />
              )}
            </button>
          </div>
        ) : (
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              dragActive
                ? 'border-boerne-navy bg-boerne-navy/5'
                : 'border-gray-300 hover:border-gray-400'
            } ${photoType === 'logo' ? 'w-32 h-32 p-2' : ''}`}
          >
            <input
              type="file"
              accept={ALLOWED_TYPES.join(',')}
              onChange={(e) => handleFiles(e.target.files)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={uploading || remainingPhotos <= 0}
            />
            {uploading ? (
              <div className="flex flex-col items-center justify-center h-full">
                <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
                <span className="text-xs text-gray-500 mt-1">Uploading...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <Upload className="w-6 h-6 text-gray-400" />
                <span className="text-xs text-gray-500 mt-1">
                  {photoType === 'logo' ? 'Add logo' : 'Add hero image'}
                </span>
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 text-sm text-red-600">
            <AlertCircle size={14} />
            <span>{error}</span>
          </div>
        )}
      </div>
    );
  }

  // For gallery, show grid with multiple photos
  const galleryRemaining = Math.min(maxPhotos - currentPhotos.length, remainingPhotos);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">{typeConfig.icon}</span>
          <div>
            <h4 className="font-medium text-gray-900">{typeConfig.title}</h4>
            <p className="text-xs text-gray-500">{typeConfig.description}</p>
          </div>
        </div>
        <span className="text-sm text-gray-500">
          {currentPhotos.length}/{Math.min(maxPhotos, photoLimit)} photos
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {/* Existing photos */}
        {currentPhotos.map((photo) => (
          <div key={photo.id} className="relative group aspect-square">
            <Image
              src={getPhotoUrl(photo, 'thumb')}
              alt="Gallery photo"
              fill
              className="object-cover rounded-lg border border-gray-200"
            />
            <button
              onClick={() => handleDelete(photo.id)}
              disabled={deleting === photo.id}
              className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
            >
              {deleting === photo.id ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <X size={12} />
              )}
            </button>
          </div>
        ))}

        {/* Upload zone */}
        {galleryRemaining > 0 && (
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`relative aspect-square border-2 border-dashed rounded-lg transition-colors ${
              dragActive
                ? 'border-boerne-navy bg-boerne-navy/5'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <input
              type="file"
              accept={ALLOWED_TYPES.join(',')}
              onChange={(e) => handleFiles(e.target.files)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={uploading}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {uploading ? (
                <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
              ) : (
                <>
                  <Upload className="w-6 h-6 text-gray-400" />
                  <span className="text-xs text-gray-500 mt-1">Add photo</span>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600">
          <AlertCircle size={14} />
          <span>{error}</span>
        </div>
      )}

      {remainingPhotos <= 0 && currentPhotos.length < maxPhotos && (
        <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 p-2 rounded-lg">
          <AlertCircle size={14} />
          <span>
            Upgrade your tier to add more photos ({photoLimit} max for your current tier)
          </span>
        </div>
      )}

      {currentPhotos.length > 0 && (
        <div className="flex items-center gap-1 text-xs text-green-600">
          <CheckCircle2 size={12} />
          <span>Photos are automatically saved</span>
        </div>
      )}
    </div>
  );
}
