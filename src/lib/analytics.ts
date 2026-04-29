// Analytics tracking utilities

type EventType =
  | 'profile_view'
  | 'search_impression'
  | 'search_click'
  | 'phone_click'
  | 'website_click'
  | 'quote_request';

interface TrackEventOptions {
  businessId: string;
  eventType: EventType;
  source?: string;
  searchQuery?: string;
  referrer?: string;
}

// Get or create a session ID for anonymous tracking
function getSessionId(): string {
  if (typeof window === 'undefined') return '';

  let sessionId = sessionStorage.getItem('analytics_session_id');
  if (!sessionId) {
    sessionId = Math.random().toString(36).substring(2, 15);
    sessionStorage.setItem('analytics_session_id', sessionId);
  }
  return sessionId;
}

// Track a single event
export async function trackEvent(options: TrackEventOptions): Promise<void> {
  try {
    const sessionId = getSessionId();

    await fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        business_id: options.businessId,
        event_type: options.eventType,
        source: options.source,
        search_query: options.searchQuery,
        referrer: options.referrer || (typeof document !== 'undefined' ? document.referrer : ''),
        session_id: sessionId,
      }),
    });
  } catch (error) {
    // Silently fail - don't break the user experience for analytics
    console.debug('Analytics tracking failed:', error);
  }
}

// Track multiple impressions at once (for search results)
export async function trackImpressions(
  businessIds: string[],
  source: string,
  searchQuery?: string
): Promise<void> {
  if (businessIds.length === 0) return;

  try {
    const sessionId = getSessionId();

    await fetch('/api/analytics/track', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        events: businessIds.map((businessId) => ({
          business_id: businessId,
          event_type: 'search_impression',
          source,
          search_query: searchQuery,
          session_id: sessionId,
        })),
      }),
    });
  } catch (error) {
    console.debug('Analytics batch tracking failed:', error);
  }
}

// Convenience methods
export const trackProfileView = (businessId: string, source?: string) =>
  trackEvent({ businessId, eventType: 'profile_view', source });

export const trackSearchClick = (businessId: string, searchQuery?: string) =>
  trackEvent({ businessId, eventType: 'search_click', source: 'search', searchQuery });

export const trackPhoneClick = (businessId: string) =>
  trackEvent({ businessId, eventType: 'phone_click' });

export const trackWebsiteClick = (businessId: string) =>
  trackEvent({ businessId, eventType: 'website_click' });

export const trackQuoteRequest = (businessId: string) =>
  trackEvent({ businessId, eventType: 'quote_request' });
