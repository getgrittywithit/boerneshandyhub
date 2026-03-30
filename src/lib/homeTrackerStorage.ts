import { supabase } from './supabase';

const BUCKET_NAME = 'home-tracker-materials';

/**
 * Upload a photo to Supabase Storage
 * @param userId - The user's ID (used as folder name)
 * @param file - The file to upload
 * @returns The public URL of the uploaded file
 */
export async function uploadMaterialPhoto(
  userId: string,
  file: File
): Promise<string> {
  if (!supabase) {
    throw new Error('Supabase not configured');
  }

  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type. Allowed: JPG, PNG, WebP, GIF');
  }

  // Validate file size (5MB max)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new Error('File too large. Maximum size is 5MB');
  }

  // Generate unique filename
  const ext = file.name.split('.').pop() || 'jpg';
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 8);
  const filename = `${timestamp}-${randomStr}.${ext}`;
  const path = `${userId}/materials/${filename}`;

  // Upload to Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) {
    console.error('Upload error:', uploadError);
    throw new Error('Failed to upload photo');
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(path);

  return urlData.publicUrl;
}

/**
 * Delete a photo from Supabase Storage
 * @param photoUrl - The public URL of the photo to delete
 */
export async function deleteMaterialPhoto(photoUrl: string): Promise<void> {
  if (!supabase) {
    throw new Error('Supabase not configured');
  }

  // Extract path from URL
  // URL format: https://xxx.supabase.co/storage/v1/object/public/home-tracker-materials/{path}
  const urlParts = photoUrl.split(`/storage/v1/object/public/${BUCKET_NAME}/`);
  if (urlParts.length !== 2) {
    console.warn('Invalid photo URL format, skipping delete');
    return;
  }

  const path = urlParts[1];

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([path]);

  if (error) {
    console.error('Delete error:', error);
    throw new Error('Failed to delete photo');
  }
}

/**
 * Compress an image client-side before upload
 * @param file - The original file
 * @param maxWidth - Maximum width in pixels
 * @param quality - JPEG quality (0-1)
 * @returns Compressed file as Blob
 */
export async function compressImage(
  file: File,
  maxWidth: number = 1200,
  quality: number = 0.8
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Scale down if needed
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Could not compress image'));
            }
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = () => reject(new Error('Could not load image'));
    };
    reader.onerror = () => reject(new Error('Could not read file'));
  });
}
