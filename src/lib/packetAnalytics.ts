// Packet analytics tracking utilities

type PacketEventType =
  | 'view'
  | 'provider_click'
  | 'guide_click'
  | 'phone_click'
  | 'website_click'
  | 'email_click'
  | 'home_tracker_click'
  | 'resource_click';

interface TrackPacketEventOptions {
  packetId: string;
  eventType: PacketEventType;
  targetId?: string;
  targetName?: string;
  targetCategory?: string;
}

// Get or create a session ID for anonymous tracking
function getSessionId(): string {
  if (typeof window === 'undefined') return '';

  let sessionId = sessionStorage.getItem('packet_session_id');
  if (!sessionId) {
    sessionId = Math.random().toString(36).substring(2, 15);
    sessionStorage.setItem('packet_session_id', sessionId);
  }
  return sessionId;
}

// Track a packet event
export async function trackPacketEvent(options: TrackPacketEventOptions): Promise<void> {
  try {
    const sessionId = getSessionId();

    await fetch('/api/packets/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        packet_id: options.packetId,
        event_type: options.eventType,
        target_id: options.targetId,
        target_name: options.targetName,
        target_category: options.targetCategory,
        session_id: sessionId,
      }),
    });
  } catch (error) {
    // Silently fail - don't break the user experience
    console.debug('Packet tracking failed:', error);
  }
}

// Convenience methods
export const trackPacketView = (packetId: string) =>
  trackPacketEvent({ packetId, eventType: 'view' });

export const trackProviderClick = (
  packetId: string,
  providerId: string,
  providerName: string,
  category?: string
) =>
  trackPacketEvent({
    packetId,
    eventType: 'provider_click',
    targetId: providerId,
    targetName: providerName,
    targetCategory: category,
  });

export const trackGuideClick = (packetId: string, guideSlug: string, guideName: string) =>
  trackPacketEvent({
    packetId,
    eventType: 'guide_click',
    targetId: guideSlug,
    targetName: guideName,
  });

export const trackPhoneClick = (packetId: string, providerId: string, providerName: string) =>
  trackPacketEvent({
    packetId,
    eventType: 'phone_click',
    targetId: providerId,
    targetName: providerName,
  });

export const trackWebsiteClick = (packetId: string, providerId: string, providerName: string) =>
  trackPacketEvent({
    packetId,
    eventType: 'website_click',
    targetId: providerId,
    targetName: providerName,
  });

export const trackEmailClick = (packetId: string, providerId: string, providerName: string) =>
  trackPacketEvent({
    packetId,
    eventType: 'email_click',
    targetId: providerId,
    targetName: providerName,
  });

export const trackHomeTrackerClick = (packetId: string) =>
  trackPacketEvent({
    packetId,
    eventType: 'home_tracker_click',
  });

export const trackResourceClick = (packetId: string, resourceName: string) =>
  trackPacketEvent({
    packetId,
    eventType: 'resource_click',
    targetName: resourceName,
  });
