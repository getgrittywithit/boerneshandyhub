import { NextResponse } from 'next/server';

// Cibolo Creek at Boerne USGS gauge
const CIBOLO_GAUGE_ID = '08183900';

// Kendall County FIPS code
const KENDALL_COUNTY_FIPS = '48259';

interface USGSReading {
  value: number;
  unit: string;
  dateTime: string;
}

interface CiboloCreekData {
  stageHeight: USGSReading | null;
  discharge: USGSReading | null;
  floodStage: number;
  status: 'normal' | 'elevated' | 'flood' | 'major_flood';
  statusMessage: string;
  gaugeUrl: string;
}

interface DroughtData {
  level: string;
  intensity: number; // 0-4 (None, D0, D1, D2, D3, D4)
  description: string;
  percentArea: number;
  asOfDate: string;
  color: string;
}

interface BurnBanData {
  active: boolean;
  county: string;
  lastUpdated: string;
  source: string;
  sourceUrl: string;
}

// Flood stages for Cibolo Creek at Boerne (in feet)
// Source: NWS Advanced Hydrologic Prediction Service
const CIBOLO_FLOOD_STAGES = {
  action: 8.0,
  flood: 12.0,
  moderate: 16.0,
  major: 20.0,
};

async function fetchCiboloCreekData(): Promise<CiboloCreekData | null> {
  try {
    // USGS Instantaneous Values Web Service
    const url = `https://waterservices.usgs.gov/nwis/iv/?format=json&sites=${CIBOLO_GAUGE_ID}&parameterCd=00065,00060&siteStatus=active`;

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 900 }, // Cache for 15 minutes
    });

    if (!response.ok) {
      console.error('USGS API error:', response.status);
      return null;
    }

    const data = await response.json();

    if (!data.value?.timeSeries || data.value.timeSeries.length === 0) {
      return null;
    }

    let stageHeight: USGSReading | null = null;
    let discharge: USGSReading | null = null;

    for (const series of data.value.timeSeries) {
      const paramCode = series.variable?.variableCode?.[0]?.value;
      const values = series.values?.[0]?.value;

      if (values && values.length > 0) {
        const latestValue = values[values.length - 1];

        if (paramCode === '00065') {
          // Gage height in feet
          stageHeight = {
            value: parseFloat(latestValue.value),
            unit: 'ft',
            dateTime: latestValue.dateTime,
          };
        } else if (paramCode === '00060') {
          // Discharge in cubic feet per second
          discharge = {
            value: parseFloat(latestValue.value),
            unit: 'cfs',
            dateTime: latestValue.dateTime,
          };
        }
      }
    }

    // Determine flood status
    let status: CiboloCreekData['status'] = 'normal';
    let statusMessage = 'Normal conditions';

    if (stageHeight) {
      const stage = stageHeight.value;
      if (stage >= CIBOLO_FLOOD_STAGES.major) {
        status = 'major_flood';
        statusMessage = 'Major flooding - avoid all low-water crossings';
      } else if (stage >= CIBOLO_FLOOD_STAGES.flood) {
        status = 'flood';
        statusMessage = 'Flooding in progress - stay away from creek';
      } else if (stage >= CIBOLO_FLOOD_STAGES.action) {
        status = 'elevated';
        statusMessage = 'Elevated water levels - monitor conditions';
      }
    }

    return {
      stageHeight,
      discharge,
      floodStage: CIBOLO_FLOOD_STAGES.flood,
      status,
      statusMessage,
      gaugeUrl: `https://waterdata.usgs.gov/monitoring-location/${CIBOLO_GAUGE_ID}/`,
    };
  } catch (error) {
    console.error('Error fetching Cibolo Creek data:', error);
    return null;
  }
}

async function fetchDroughtData(): Promise<DroughtData | null> {
  try {
    // US Drought Monitor - County-level statistics
    // This endpoint returns drought data for a specific county
    const url = `https://usdmdataservices.unl.edu/api/CountyStatistics/GetDroughtSeverityStatisticsByAreaPercent?aession=county&fips=${KENDALL_COUNTY_FIPS}&startdate=${getLastThursday()}&enddate=${getLastThursday()}&statistictype=1`;

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 86400 }, // Cache for 24 hours (data updates weekly)
    });

    if (!response.ok) {
      // Fall back to a simpler approach - check the comprehensive stats
      return await fetchDroughtDataFallback();
    }

    const data = await response.json();

    if (!data || data.length === 0) {
      return await fetchDroughtDataFallback();
    }

    // Parse drought levels - find the highest intensity
    const entry = data[0];
    let maxIntensity = -1;
    let maxDescription = 'None';

    const levels = [
      { key: 'None', intensity: -1, desc: 'No Drought' },
      { key: 'D0', intensity: 0, desc: 'Abnormally Dry' },
      { key: 'D1', intensity: 1, desc: 'Moderate Drought' },
      { key: 'D2', intensity: 2, desc: 'Severe Drought' },
      { key: 'D3', intensity: 3, desc: 'Extreme Drought' },
      { key: 'D4', intensity: 4, desc: 'Exceptional Drought' },
    ];

    for (const level of levels) {
      if (entry[level.key] && parseFloat(entry[level.key]) > 0) {
        if (level.intensity > maxIntensity) {
          maxIntensity = level.intensity;
          maxDescription = level.desc;
        }
      }
    }

    const colors: Record<number, string> = {
      [-1]: '#ffffff',
      0: '#ffff00', // D0 - Yellow
      1: '#fcd37f', // D1 - Tan
      2: '#ffaa00', // D2 - Orange
      3: '#e60000', // D3 - Red
      4: '#730000', // D4 - Dark Red
    };

    return {
      level: maxIntensity === -1 ? 'None' : `D${maxIntensity}`,
      intensity: maxIntensity,
      description: maxDescription,
      percentArea: maxIntensity >= 0 ? parseFloat(entry[`D${maxIntensity}`] || '0') : 0,
      asOfDate: entry.MapDate || getLastThursday(),
      color: colors[maxIntensity] || '#ffffff',
    };
  } catch (error) {
    console.error('Error fetching drought data:', error);
    return await fetchDroughtDataFallback();
  }
}

async function fetchDroughtDataFallback(): Promise<DroughtData | null> {
  // Simplified fallback - just return that we need to check manually
  // In production, you'd want a more robust data source
  return {
    level: 'Unknown',
    intensity: -1,
    description: 'Check droughtmonitor.unl.edu for current conditions',
    percentArea: 0,
    asOfDate: new Date().toISOString().split('T')[0],
    color: '#cccccc',
  };
}

function getLastThursday(): string {
  // US Drought Monitor updates every Thursday
  const today = new Date();
  const dayOfWeek = today.getDay();
  const daysToLastThursday = dayOfWeek >= 4 ? dayOfWeek - 4 : dayOfWeek + 3;
  const lastThursday = new Date(today);
  lastThursday.setDate(today.getDate() - daysToLastThursday);
  return lastThursday.toISOString().split('T')[0];
}

async function fetchBurnBanData(): Promise<BurnBanData> {
  try {
    // Texas A&M Forest Service Burn Ban Data
    // They provide a JSON endpoint for county burn ban status
    const url = 'https://texasforestservice.tamu.edu/api/v1/burnban';

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      // Fallback - try alternate endpoint or return unknown
      return await fetchBurnBanFallback();
    }

    const data = await response.json();

    // Find Kendall County in the response
    const kendallBan = data.find((county: any) =>
      county.county?.toLowerCase() === 'kendall' ||
      county.name?.toLowerCase() === 'kendall'
    );

    if (kendallBan) {
      return {
        active: kendallBan.burnban === true || kendallBan.status === 'active',
        county: 'Kendall County',
        lastUpdated: new Date().toISOString(),
        source: 'Texas A&M Forest Service',
        sourceUrl: 'https://tfsweb.tamu.edu/burnbans/',
      };
    }

    return await fetchBurnBanFallback();
  } catch (error) {
    console.error('Error fetching burn ban data:', error);
    return await fetchBurnBanFallback();
  }
}

async function fetchBurnBanFallback(): Promise<BurnBanData> {
  // When the API isn't available, we provide a link to check manually
  // This is safer than showing potentially stale data
  return {
    active: false,
    county: 'Kendall County',
    lastUpdated: new Date().toISOString(),
    source: 'Check Texas A&M Forest Service for current status',
    sourceUrl: 'https://tfsweb.tamu.edu/burnbans/',
  };
}

export async function GET() {
  try {
    // Fetch all data in parallel
    const [ciboloCreek, drought, burnBan] = await Promise.all([
      fetchCiboloCreekData(),
      fetchDroughtData(),
      fetchBurnBanData(),
    ]);

    const result = {
      lastUpdated: new Date().toISOString(),
      ciboloCreek,
      drought,
      burnBan,
    };

    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=1800',
      },
    });
  } catch (error) {
    console.error('Hill Country API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Hill Country data' },
      { status: 500 }
    );
  }
}
