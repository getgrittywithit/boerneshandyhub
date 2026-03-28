// Metadata utilities for SEO-optimized titles and descriptions
// Ensures titles are <= 60 chars and descriptions are <= 155 chars

const MAX_TITLE_LENGTH = 60;
const MAX_DESCRIPTION_LENGTH = 155;

/**
 * Truncate a string to max length, breaking at word boundaries
 */
function truncateAtWord(text: string, maxLength: number, suffix = '...'): string {
  if (text.length <= maxLength) return text;

  const truncateAt = maxLength - suffix.length;
  const truncated = text.substring(0, truncateAt);
  const lastSpace = truncated.lastIndexOf(' ');

  if (lastSpace > truncateAt * 0.5) {
    return truncated.substring(0, lastSpace) + suffix;
  }

  return truncated + suffix;
}

/**
 * Truncate title to SEO-friendly length (max 60 chars)
 */
export function truncateTitle(title: string): string {
  return truncateAtWord(title, MAX_TITLE_LENGTH);
}

/**
 * Truncate description to SEO-friendly length (max 155 chars)
 */
export function truncateDescription(description: string): string {
  return truncateAtWord(description, MAX_DESCRIPTION_LENGTH);
}

/**
 * Generate an SEO-optimized provider page title
 * Tries multiple formats to fit within 60 chars
 */
export function generateProviderTitle(
  providerName: string,
  categoryName: string,
  location = 'Boerne, TX'
): string {
  // Try full format: "Provider Name | Category in Boerne, TX"
  const fullTitle = `${providerName} | ${categoryName} in ${location}`;
  if (fullTitle.length <= MAX_TITLE_LENGTH) {
    return fullTitle;
  }

  // Try shorter location: "Provider Name | Category Boerne"
  const shortLocation = location.split(',')[0];
  const shortTitle = `${providerName} | ${categoryName} ${shortLocation}`;
  if (shortTitle.length <= MAX_TITLE_LENGTH) {
    return shortTitle;
  }

  // Try without location: "Provider Name | Category"
  const noLocationTitle = `${providerName} | ${categoryName}`;
  if (noLocationTitle.length <= MAX_TITLE_LENGTH) {
    return noLocationTitle;
  }

  // Truncate provider name to fit
  const maxNameLength = MAX_TITLE_LENGTH - categoryName.length - 4; // " | " + buffer
  const truncatedName = truncateAtWord(providerName, maxNameLength, '');
  return `${truncatedName} | ${categoryName}`;
}

/**
 * Generate an SEO-optimized provider page description
 * Includes rating if available, truncates to 155 chars
 */
export function generateProviderDescription(
  providerName: string,
  description: string,
  rating?: number,
  reviewCount?: number
): string {
  // Build rating suffix if we have reviews
  let ratingSuffix = '';
  if (rating && reviewCount && reviewCount > 0) {
    ratingSuffix = ` Rated ${rating.toFixed(1)}/5 (${reviewCount} reviews).`;
  }

  // Calculate max description length
  const maxDescLength = MAX_DESCRIPTION_LENGTH - ratingSuffix.length - providerName.length - 3;

  if (maxDescLength < 50) {
    // Not enough room for description + rating, just truncate description
    return truncateDescription(`${providerName} - ${description}`);
  }

  // Truncate description to fit
  const shortDesc = truncateAtWord(description, maxDescLength, '...');
  return `${providerName} - ${shortDesc}${ratingSuffix}`;
}

/**
 * Generate an SEO-optimized category page title
 */
export function generateCategoryTitle(
  categoryName: string,
  subcategoryNames?: string[],
  location = 'Boerne, TX'
): string {
  // Try: "Category Services in Boerne, TX | Subcats"
  if (subcategoryNames && subcategoryNames.length > 0) {
    const subcatList = subcategoryNames.slice(0, 2).join(', ');
    const fullTitle = `${categoryName} Services ${location} | ${subcatList}`;
    if (fullTitle.length <= MAX_TITLE_LENGTH) {
      return fullTitle;
    }
  }

  // Simpler format: "Category Services in Boerne, TX"
  const simpleTitle = `${categoryName} Services in ${location}`;
  if (simpleTitle.length <= MAX_TITLE_LENGTH) {
    return simpleTitle;
  }

  // Shortest format: "Category Services Boerne TX"
  const shortLocation = location.replace(',', '');
  return truncateTitle(`${categoryName} Services ${shortLocation}`);
}

/**
 * Generate an SEO-optimized category page description
 */
export function generateCategoryDescription(
  categoryName: string,
  categoryDescription: string,
  providerCount?: number,
  location = 'Boerne'
): string {
  const countText = providerCount ? `${providerCount} ` : '';
  const intro = `Find ${countText}trusted ${categoryName.toLowerCase()} providers in ${location}, TX. `;

  const remainingLength = MAX_DESCRIPTION_LENGTH - intro.length;
  const shortDesc = truncateAtWord(categoryDescription, remainingLength, '');

  return `${intro}${shortDesc}`;
}

/**
 * Generate an SEO-optimized subcategory page title
 */
export function generateSubcategoryTitle(
  subcategoryName: string,
  topCategoryName: string,
  location = 'Boerne, TX'
): string {
  // Try: "Subcategory | Top Category in Boerne, TX"
  const fullTitle = `${subcategoryName} | ${topCategoryName} in ${location}`;
  if (fullTitle.length <= MAX_TITLE_LENGTH) {
    return fullTitle;
  }

  // Shorter: "Subcategory Services in Boerne, TX"
  const simpleTitle = `${subcategoryName} Services in ${location}`;
  if (simpleTitle.length <= MAX_TITLE_LENGTH) {
    return simpleTitle;
  }

  // Shortest: "Subcategory Boerne TX"
  return truncateTitle(`${subcategoryName} ${location.replace(',', '')}`);
}

/**
 * Generate an SEO-optimized subcategory page description
 */
export function generateSubcategoryDescription(
  subcategoryName: string,
  subcategoryDescription: string,
  providerCount?: number,
  location = 'Boerne'
): string {
  const countText = providerCount ? `${providerCount} ` : '';
  const intro = `Find ${countText}trusted ${subcategoryName.toLowerCase()} providers in ${location}, TX. `;

  const remainingLength = MAX_DESCRIPTION_LENGTH - intro.length;
  const shortDesc = truncateAtWord(subcategoryDescription, remainingLength, '');

  return `${intro}${shortDesc}`;
}

/**
 * Generate keywords array for a provider
 */
export function generateProviderKeywords(
  providerName: string,
  categoryName: string,
  services: string[],
  serviceArea: string[]
): string[] {
  const baseKeywords = [
    providerName.toLowerCase(),
    categoryName.toLowerCase(),
    `${categoryName.toLowerCase()} boerne`,
    `${categoryName.toLowerCase()} boerne tx`,
  ];

  // Add service-based keywords (limit to 5)
  const serviceKeywords = services.slice(0, 5).map(s => s.toLowerCase());

  // Add location-based keywords (limit to 3)
  const locationKeywords = serviceArea.slice(0, 3).map(area =>
    `${categoryName.toLowerCase()} ${area.toLowerCase()}`
  );

  return [...baseKeywords, ...serviceKeywords, ...locationKeywords];
}
