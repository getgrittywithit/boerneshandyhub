import { NextRequest, NextResponse } from 'next/server';

// Boerne, TX coordinates
const BOERNE_LAT = 29.7947;
const BOERNE_LON = -98.7320;

// NOAA NCEI GHCN-Daily station for Boerne
// Station: USC00410902 "BOERNE 1"
// This is the official NOAA station for Boerne rainfall records
const GHCN_STATION_ID = 'GHCND:USC00410902';

// Historical average monthly rainfall for Boerne, TX (in inches)
// Source: NOAA 1991-2020 Climate Normals for station USC00410902
const MONTHLY_AVERAGES_INCHES: { [key: number]: number } = {
  1: 2.28,   // January
  2: 2.22,   // February
  3: 2.79,   // March
  4: 2.52,   // April
  5: 5.28,   // May (wettest - spring peak)
  6: 3.78,   // June
  7: 2.83,   // July
  8: 2.80,   // August
  9: 3.90,   // September (fall peak)
  10: 3.88,  // October (fall peak)
  11: 2.92,  // November
  12: 2.32,  // December (driest)
};

// Calculate expected YTD rainfall up to a given date
function getExpectedYTD(month: number, day: number): number {
  let total = 0;
  // Add full months
  for (let m = 1; m < month; m++) {
    total += MONTHLY_AVERAGES_INCHES[m];
  }
  // Add partial current month (prorated)
  const daysInMonth = new Date(new Date().getFullYear(), month, 0).getDate();
  total += (MONTHLY_AVERAGES_INCHES[month] * day) / daysInMonth;
  return total;
}

interface NCEIDataRecord {
  date: string;
  datatype: string;
  station: string;
  value: number;
}

interface NCEIResponse {
  results?: NCEIDataRecord[];
  metadata?: {
    resultset: {
      offset: number;
      count: number;
      limit: number;
    };
  };
}

async function fetchNCEIData(startDate: string, endDate: string, token: string): Promise<NCEIDataRecord[]> {
  const allResults: NCEIDataRecord[] = [];
  let offset = 1;
  const limit = 1000;

  // NCEI API paginates results, need to fetch all pages
  while (true) {
    const url = new URL('https://www.ncei.noaa.gov/cdo-web/api/v2/data');
    url.searchParams.set('datasetid', 'GHCND');
    url.searchParams.set('stationid', GHCN_STATION_ID);
    url.searchParams.set('datatypeid', 'PRCP');
    url.searchParams.set('startdate', startDate);
    url.searchParams.set('enddate', endDate);
    url.searchParams.set('units', 'standard'); // Returns inches
    url.searchParams.set('limit', limit.toString());
    url.searchParams.set('offset', offset.toString());

    const response = await fetch(url.toString(), {
      headers: {
        'token': token,
        'Accept': 'application/json',
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('NCEI API rate limit exceeded. Please try again later.');
      }
      throw new Error(`NCEI API responded with status: ${response.status}`);
    }

    const data: NCEIResponse = await response.json();

    if (!data.results || data.results.length === 0) {
      break;
    }

    allResults.push(...data.results);

    // Check if we've fetched all results
    if (data.metadata && data.results.length < limit) {
      break;
    }

    offset += limit;

    // Safety limit to prevent infinite loops
    if (offset > 400) break;
  }

  return allResults;
}

export async function GET(request: NextRequest) {
  try {
    const nceiToken = process.env.NCEI_API_TOKEN;

    if (!nceiToken) {
      // Return static data if no API token configured
      // This allows the page to function while token is being provisioned
      console.warn('NCEI_API_TOKEN not configured - returning estimated data');
      return returnEstimatedData();
    }

    const { searchParams } = new URL(request.url);
    const year = searchParams.get('year') || new Date().getFullYear().toString();

    const currentDate = new Date();
    const startDate = `${year}-01-01`;
    const endDate = currentDate.getFullYear().toString() === year
      ? currentDate.toISOString().split('T')[0]
      : `${year}-12-31`;

    // Fetch from NOAA NCEI GHCN-Daily
    const precipData = await fetchNCEIData(startDate, endDate, nceiToken);

    // Process the daily precipitation data
    const monthlyTotals: { [key: number]: number } = {};
    let ytdTotal = 0;

    for (const record of precipData) {
      if (record.datatype === 'PRCP' && record.value !== null) {
        // NCEI returns precipitation in inches when units=standard
        const precipInches = record.value;
        ytdTotal += precipInches;

        const month = new Date(record.date).getMonth() + 1;
        monthlyTotals[month] = (monthlyTotals[month] || 0) + precipInches;
      }
    }

    // Build monthly comparison data
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = currentDate.getMonth() + 1;
    const currentDay = currentDate.getDate();

    const monthlyComparison = monthNames.map((name, index) => {
      const monthNum = index + 1;
      const average = MONTHLY_AVERAGES_INCHES[monthNum];
      const actual = monthlyTotals[monthNum] || 0;

      // For future months, don't show actual data
      const isFuture = parseInt(year) === currentDate.getFullYear() && monthNum > currentMonth;

      return {
        month: name,
        monthNum,
        average: parseFloat(average.toFixed(2)),
        actual: isFuture ? null : parseFloat(actual.toFixed(2)),
        isCurrent: parseInt(year) === currentDate.getFullYear() && monthNum === currentMonth,
      };
    });

    // Calculate YTD expected vs actual
    const expectedYTD = getExpectedYTD(currentMonth, currentDay);
    const ytdDifference = ytdTotal - expectedYTD;
    const ytdPercentage = expectedYTD > 0 ? ((ytdTotal / expectedYTD) * 100) : 100;

    // Annual total
    const annualAverage = Object.values(MONTHLY_AVERAGES_INCHES).reduce((a, b) => a + b, 0);

    const result = {
      year: parseInt(year),
      lastUpdated: currentDate.toISOString(),
      location: {
        name: 'Boerne, TX',
        lat: BOERNE_LAT,
        lon: BOERNE_LON,
      },
      dataSource: {
        station: 'USC00410902 (Boerne 1)',
        provider: 'NOAA NCEI',
        dataset: 'GHCN-Daily',
      },
      ytd: {
        actual: parseFloat(ytdTotal.toFixed(2)),
        expected: parseFloat(expectedYTD.toFixed(2)),
        difference: parseFloat(ytdDifference.toFixed(2)),
        percentOfNormal: parseFloat(ytdPercentage.toFixed(1)),
        status: ytdDifference > 1 ? 'above' : ytdDifference < -1 ? 'below' : 'normal',
      },
      annual: {
        average: parseFloat(annualAverage.toFixed(2)),
        projected: parseFloat((ytdTotal / (currentMonth + (currentDay / 30)) * 12).toFixed(2)),
      },
      monthly: monthlyComparison,
    };

    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
        'CDN-Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
        'Vercel-CDN-Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
      },
    });

  } catch (error) {
    console.error('Rainfall API error:', error);

    // On error, return estimated data so the page still functions
    return returnEstimatedData();
  }
}

// Fallback function that returns estimated data based on historical averages
// Used when NCEI API is unavailable or token not configured
function returnEstimatedData() {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentDay = currentDate.getDate();

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Estimate YTD as average (fallback)
  const expectedYTD = getExpectedYTD(currentMonth, currentDay);
  const annualAverage = Object.values(MONTHLY_AVERAGES_INCHES).reduce((a, b) => a + b, 0);

  const monthlyComparison = monthNames.map((name, index) => {
    const monthNum = index + 1;
    const average = MONTHLY_AVERAGES_INCHES[monthNum];
    const isFuture = monthNum > currentMonth;

    return {
      month: name,
      monthNum,
      average: parseFloat(average.toFixed(2)),
      actual: isFuture ? null : parseFloat(average.toFixed(2)), // Use average as estimate
      isCurrent: monthNum === currentMonth,
    };
  });

  const result = {
    year: currentDate.getFullYear(),
    lastUpdated: currentDate.toISOString(),
    location: {
      name: 'Boerne, TX',
      lat: BOERNE_LAT,
      lon: BOERNE_LON,
    },
    dataSource: {
      station: 'USC00410902 (Boerne 1)',
      provider: 'NOAA NCEI (estimated)',
      dataset: 'GHCN-Daily',
    },
    ytd: {
      actual: parseFloat(expectedYTD.toFixed(2)),
      expected: parseFloat(expectedYTD.toFixed(2)),
      difference: 0,
      percentOfNormal: 100,
      status: 'normal' as const,
    },
    annual: {
      average: parseFloat(annualAverage.toFixed(2)),
      projected: parseFloat(annualAverage.toFixed(2)),
    },
    monthly: monthlyComparison,
    isEstimate: true,
  };

  return NextResponse.json(result, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
      'CDN-Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
      'Vercel-CDN-Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
    },
  });
}
