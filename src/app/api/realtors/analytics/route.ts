import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

interface PacketAnalyticsSummary {
  packetId: string;
  clientName: string;
  address: string;
  viewCount: number;
  firstViewedAt: string | null;
  lastViewedAt: string | null;
  totalClicks: number;
  topClickedProviders: { name: string; category: string; clicks: number }[];
  guideClicks: number;
  homeTrackerClicks: number;
}

interface OverallStats {
  totalPacketsSent: number;
  totalViews: number;
  totalProviderClicks: number;
  totalGuideClicks: number;
  totalHomeTrackerClicks: number;
  avgViewsPerPacket: number;
  packetsViewed: number;
  viewRate: number; // percentage of sent packets that were viewed
}

// Get analytics for a realtor's packets
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];

    if (!supabaseServiceKey) {
      // Return demo data in development
      return NextResponse.json({
        overall: {
          totalPacketsSent: 3,
          totalViews: 12,
          totalProviderClicks: 8,
          totalGuideClicks: 5,
          totalHomeTrackerClicks: 2,
          avgViewsPerPacket: 4,
          packetsViewed: 2,
          viewRate: 67,
        },
        packets: [
          {
            packetId: 'demo-1',
            clientName: 'John & Jane Smith',
            address: '123 Oak Valley Drive',
            viewCount: 8,
            firstViewedAt: '2024-03-17T10:30:00Z',
            lastViewedAt: '2024-03-20T14:15:00Z',
            totalClicks: 5,
            topClickedProviders: [
              { name: 'Hill Country HVAC', category: 'HVAC', clicks: 2 },
              { name: 'Boerne Plumbing Co', category: 'Plumbing', clicks: 2 },
              { name: 'Texas Star Electric', category: 'Electrical', clicks: 1 },
            ],
            guideClicks: 3,
            homeTrackerClicks: 1,
          },
          {
            packetId: 'demo-2',
            clientName: 'Michael Johnson',
            address: '456 Hill Country Lane',
            viewCount: 4,
            firstViewedAt: '2024-03-23T09:00:00Z',
            lastViewedAt: '2024-03-25T11:30:00Z',
            totalClicks: 3,
            topClickedProviders: [
              { name: 'Fair Oaks Landscaping', category: 'Landscaping', clicks: 2 },
              { name: 'Boerne Pest Control', category: 'Pest Control', clicks: 1 },
            ],
            guideClicks: 2,
            homeTrackerClicks: 1,
          },
        ],
      });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify the token and get user
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Get all packets for this realtor with client info
    const { data: packets, error: packetsError } = await supabase
      .from('welcome_packets')
      .select(`
        packet_id,
        view_count,
        first_viewed_at,
        last_viewed_at,
        status,
        sent_at,
        realtor_clients (
          name,
          address,
          city
        )
      `)
      .eq('realtor_id', user.id)
      .order('created_at', { ascending: false });

    if (packetsError) {
      console.error('Error fetching packets:', packetsError);
      return NextResponse.json({ error: 'Failed to fetch packets' }, { status: 500 });
    }

    if (!packets || packets.length === 0) {
      return NextResponse.json({
        overall: {
          totalPacketsSent: 0,
          totalViews: 0,
          totalProviderClicks: 0,
          totalGuideClicks: 0,
          totalHomeTrackerClicks: 0,
          avgViewsPerPacket: 0,
          packetsViewed: 0,
          viewRate: 0,
        },
        packets: [],
      });
    }

    const packetIds = packets.map(p => p.packet_id);

    // Get all analytics for these packets
    const { data: analytics, error: analyticsError } = await supabase
      .from('packet_analytics')
      .select('*')
      .in('packet_id', packetIds);

    if (analyticsError) {
      console.error('Error fetching analytics:', analyticsError);
    }

    const analyticsData = analytics || [];

    // Process analytics by packet
    const packetAnalytics: PacketAnalyticsSummary[] = packets.map(packet => {
      const packetEvents = analyticsData.filter(a => a.packet_id === packet.packet_id);
      const providerClicks = packetEvents.filter(e => e.event_type === 'provider_click');
      const guideClicks = packetEvents.filter(e => e.event_type === 'guide_click');
      const homeTrackerClicks = packetEvents.filter(e => e.event_type === 'home_tracker_click');

      // Count provider clicks by provider
      const providerClickCounts: Record<string, { name: string; category: string; clicks: number }> = {};
      providerClicks.forEach(click => {
        const key = click.target_id || click.target_name;
        if (key) {
          if (!providerClickCounts[key]) {
            providerClickCounts[key] = {
              name: click.target_name || key,
              category: click.target_category || 'Unknown',
              clicks: 0,
            };
          }
          providerClickCounts[key].clicks++;
        }
      });

      const topClickedProviders = Object.values(providerClickCounts)
        .sort((a, b) => b.clicks - a.clicks)
        .slice(0, 5);

      // realtor_clients comes as an object from the join (single client per packet)
      const clientData = packet.realtor_clients as unknown;
      const client = clientData as { name: string; address: string; city: string } | null;

      return {
        packetId: packet.packet_id,
        clientName: client?.name || 'Unknown',
        address: client ? `${client.address}, ${client.city}` : 'Unknown',
        viewCount: packet.view_count || 0,
        firstViewedAt: packet.first_viewed_at,
        lastViewedAt: packet.last_viewed_at,
        totalClicks: providerClicks.length + guideClicks.length + homeTrackerClicks.length,
        topClickedProviders,
        guideClicks: guideClicks.length,
        homeTrackerClicks: homeTrackerClicks.length,
      };
    });

    // Calculate overall stats
    const sentPackets = packets.filter(p => p.status === 'sent' || p.status === 'viewed');
    const viewedPackets = packets.filter(p => p.status === 'viewed' || (p.view_count && p.view_count > 0));
    const totalViews = packets.reduce((sum, p) => sum + (p.view_count || 0), 0);
    const totalProviderClicks = analyticsData.filter(e => e.event_type === 'provider_click').length;
    const totalGuideClicks = analyticsData.filter(e => e.event_type === 'guide_click').length;
    const totalHomeTrackerClicks = analyticsData.filter(e => e.event_type === 'home_tracker_click').length;

    const overall: OverallStats = {
      totalPacketsSent: sentPackets.length,
      totalViews,
      totalProviderClicks,
      totalGuideClicks,
      totalHomeTrackerClicks,
      avgViewsPerPacket: sentPackets.length > 0 ? Math.round(totalViews / sentPackets.length * 10) / 10 : 0,
      packetsViewed: viewedPackets.length,
      viewRate: sentPackets.length > 0 ? Math.round((viewedPackets.length / sentPackets.length) * 100) : 0,
    };

    return NextResponse.json({
      overall,
      packets: packetAnalytics,
    });
  } catch (error) {
    console.error('Error in analytics endpoint:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
