import sharp from 'sharp';

export interface ImageDerivatives {
  thumb: Buffer;
  medium: Buffer;
  large: Buffer;
  original: Buffer;
}

export interface ProcessedImage {
  derivatives: ImageDerivatives;
  metadata: {
    width: number;
    height: number;
    format: string;
  };
}

const SIZES = {
  thumb: 150,
  medium: 600,
  large: 1200,
} as const;

/**
 * Process an uploaded image into multiple WebP derivatives
 * @param buffer - Original image buffer
 * @returns Processed derivatives and metadata
 */
export async function processImage(buffer: Buffer): Promise<ProcessedImage> {
  // Get original metadata
  const metadata = await sharp(buffer).metadata();

  if (!metadata.width || !metadata.height) {
    throw new Error('Unable to read image dimensions');
  }

  // Keep original but convert to WebP for consistency
  const original = await sharp(buffer)
    .webp({ quality: 90 })
    .toBuffer();

  // Generate derivatives
  const [thumb, medium, large] = await Promise.all([
    sharp(buffer)
      .resize(SIZES.thumb, SIZES.thumb, { fit: 'cover', position: 'center' })
      .webp({ quality: 80 })
      .toBuffer(),
    sharp(buffer)
      .resize(SIZES.medium, undefined, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 85 })
      .toBuffer(),
    sharp(buffer)
      .resize(SIZES.large, undefined, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 90 })
      .toBuffer(),
  ]);

  return {
    derivatives: {
      thumb,
      medium,
      large,
      original,
    },
    metadata: {
      width: metadata.width,
      height: metadata.height,
      format: metadata.format || 'unknown',
    },
  };
}

/**
 * Validate that a file is an acceptable image type
 */
export function validateImageType(mimeType: string): boolean {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  return allowedTypes.includes(mimeType);
}

/**
 * Validate image file size (max 5MB)
 */
export function validateImageSize(size: number): boolean {
  const maxSize = 5 * 1024 * 1024; // 5MB
  return size <= maxSize;
}

/**
 * Get file extension from mime type
 */
export function getExtensionFromMime(mimeType: string): string {
  const mimeMap: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif',
  };
  return mimeMap[mimeType] || 'jpg';
}
