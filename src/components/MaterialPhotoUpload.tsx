'use client';

import { useState, useRef } from 'react';
import { uploadMaterialPhoto, compressImage } from '@/lib/homeTrackerStorage';

interface MaterialPhotoUploadProps {
  userId: string;
  currentPhotoUrl?: string;
  onUploadComplete: (url: string) => void;
  onDelete?: () => void;
}

export default function MaterialPhotoUpload({
  userId,
  currentPhotoUrl,
  onUploadComplete,
  onDelete,
}: MaterialPhotoUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentPhotoUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setIsUploading(true);

    try {
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Compress if needed
      let uploadFile: File | Blob = file;
      if (file.size > 1024 * 1024) {
        // Compress if > 1MB
        uploadFile = await compressImage(file, 1200, 0.8);
      }

      // Upload
      const url = await uploadMaterialPhoto(
        userId,
        uploadFile instanceof Blob
          ? new File([uploadFile], file.name, { type: 'image/jpeg' })
          : uploadFile
      );

      onUploadComplete(url);
      setPreviewUrl(url);
    } catch (err) {
      console.error('Upload failed:', err);
      setError(err instanceof Error ? err.message : 'Upload failed');
      setPreviewUrl(currentPhotoUrl || null);
    } finally {
      setIsUploading(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    if (onDelete) {
      onDelete();
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Photo (optional)
      </label>

      {previewUrl ? (
        <div className="relative inline-block">
          <img
            src={previewUrl}
            alt="Material preview"
            className="w-24 h-24 object-cover rounded-lg border border-gray-200"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 text-sm"
          >
            ×
          </button>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className={`w-24 h-24 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors ${
            isUploading
              ? 'border-gray-300 bg-gray-50'
              : 'border-gray-300 hover:border-boerne-gold hover:bg-boerne-gold/5'
          }`}
        >
          {isUploading ? (
            <span className="text-sm text-gray-500">Uploading...</span>
          ) : (
            <>
              <span className="text-2xl text-gray-400">📷</span>
              <span className="text-xs text-gray-500 mt-1">Add photo</span>
            </>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileSelect}
        className="hidden"
        disabled={isUploading}
      />

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
