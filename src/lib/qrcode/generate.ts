import QRCode from 'qrcode';

export interface QRCodeOptions {
  url: string;
  size?: number;
  primaryColor?: string;
  backgroundColor?: string;
  margin?: number;
}

export interface QRCodeResult {
  dataUrl: string;
  buffer: Buffer;
}

// HandyHub brand colors
const DEFAULT_COLORS = {
  dark: '#1e3a5f', // Navy (primary)
  light: '#ffffff', // White background
};

/**
 * Generate a QR code for a website URL
 * @param options - QR code generation options
 * @returns QR code as data URL and buffer
 */
export async function generateQRCode(options: QRCodeOptions): Promise<QRCodeResult> {
  const {
    url,
    size = 300,
    primaryColor = DEFAULT_COLORS.dark,
    backgroundColor = DEFAULT_COLORS.light,
    margin = 2,
  } = options;

  const qrOptions: QRCode.QRCodeToDataURLOptions = {
    type: 'image/png',
    width: size,
    margin,
    color: {
      dark: primaryColor,
      light: backgroundColor,
    },
    errorCorrectionLevel: 'M', // Medium error correction
  };

  // Generate as data URL
  const dataUrl = await QRCode.toDataURL(url, qrOptions);

  // Generate as buffer for file downloads
  const buffer = await QRCode.toBuffer(url, {
    ...qrOptions,
    type: 'png',
  });

  return {
    dataUrl,
    buffer,
  };
}

/**
 * Generate a QR code with HandyHub branding
 * @param slug - Website slug
 * @param options - Optional customization
 * @returns QR code result
 */
export async function generateWebsiteQRCode(
  slug: string,
  options?: Partial<QRCodeOptions>
): Promise<QRCodeResult> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://boerneshandyhub.com';
  const websiteUrl = `${baseUrl}/site/${slug}`;

  return generateQRCode({
    url: websiteUrl,
    size: options?.size || 400,
    primaryColor: options?.primaryColor || DEFAULT_COLORS.dark,
    backgroundColor: options?.backgroundColor || DEFAULT_COLORS.light,
    margin: options?.margin || 2,
  });
}

/**
 * Generate QR code for printing (higher resolution)
 * @param slug - Website slug
 * @param primaryColor - Business primary color for branding
 * @returns High-res QR code buffer
 */
export async function generatePrintableQRCode(
  slug: string,
  primaryColor?: string
): Promise<Buffer> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://boerneshandyhub.com';
  const websiteUrl = `${baseUrl}/site/${slug}`;

  const buffer = await QRCode.toBuffer(websiteUrl, {
    type: 'png',
    width: 1200, // High resolution for print
    margin: 3,
    color: {
      dark: primaryColor || DEFAULT_COLORS.dark,
      light: DEFAULT_COLORS.light,
    },
    errorCorrectionLevel: 'H', // High error correction for print
  });

  return buffer;
}
