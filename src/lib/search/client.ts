import type { SearchRequest, SearchResponse, VendorLead, SearchClick } from './types';

const SEARCH_ENDPOINT = '/api/search';
const DEBOUNCE_MS = 300;

// Debounce helper
function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => Promise<Awaited<ReturnType<T>>> {
  let timeoutId: NodeJS.Timeout;
  let pendingPromise: {
    resolve: (value: Awaited<ReturnType<T>>) => void;
    reject: (error: Error) => void;
  } | null = null;

  return (...args: Parameters<T>) => {
    return new Promise<Awaited<ReturnType<T>>>((resolve, reject) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      pendingPromise = { resolve, reject };

      timeoutId = setTimeout(async () => {
        try {
          const result = await fn(...args);
          pendingPromise?.resolve(result as Awaited<ReturnType<T>>);
        } catch (error) {
          pendingPromise?.reject(error instanceof Error ? error : new Error(String(error)));
        }
      }, delay);
    });
  };
}

/**
 * Execute a search request
 */
async function executeSearch(request: SearchRequest): Promise<SearchResponse> {
  const params = new URLSearchParams({
    q: request.query,
    ...(request.limit && { limit: String(request.limit) }),
    ...(request.scope?.category_slug && { category: request.scope.category_slug }),
    ...(request.scope?.subcategory_slug && { subcategory: request.scope.subcategory_slug }),
  });

  const response = await fetch(`${SEARCH_ENDPOINT}?${params}`);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Search failed' }));
    throw new Error(error.error || 'Search failed');
  }

  return response.json();
}

/**
 * Debounced search function for use in UI
 */
export const search = debounce(executeSearch, DEBOUNCE_MS);

/**
 * Immediate search (no debounce) for programmatic use
 */
export const searchImmediate = executeSearch;

/**
 * Submit a vendor lead (suggest-a-business)
 */
export async function submitVendorLead(lead: VendorLead): Promise<{ success: boolean; message: string }> {
  const response = await fetch(`${SEARCH_ENDPOINT}/suggest`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(lead),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to submit' }));
    throw new Error(error.error || 'Failed to submit suggestion');
  }

  return response.json();
}

/**
 * Track a search result click
 */
export async function trackClick(click: SearchClick): Promise<void> {
  try {
    await fetch(`${SEARCH_ENDPOINT}/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(click),
    });
  } catch {
    // Silently fail click tracking - non-critical
    console.warn('Failed to track search click');
  }
}

/**
 * Get or create a session ID for analytics
 */
export function getSearchSessionId(): string {
  if (typeof window === 'undefined') return '';

  let sessionId = sessionStorage.getItem('search_session_id');
  if (!sessionId) {
    sessionId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    sessionStorage.setItem('search_session_id', sessionId);
  }
  return sessionId;
}
