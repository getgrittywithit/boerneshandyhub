import { NextRequest, NextResponse } from 'next/server';

// Boerne, TX coordinates
const BOERNE_LAT = 29.7947;
const BOERNE_LON = -98.7320;

// Historical average monthly rainfall for Boerne, TX (in inches)
// Source: NOAA 1991-2020 Climate Normals for Kendall County
// Reference: US Climate Data / NCEI
const MONTHLY_AVERAGES_INCHES = {
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
    total += MONTHLY_AVERAGES_INCHES[m as keyof typeof MONTHLY_AVERAGES_INCHES];
  }
  // Add partial current month (prorated)
  const daysInMonth = new Date(new Date().getFullYear(), month, 0).getDate();
  total += (MONTHLY_AVERAGES_INCHES[month as keyof typeof MONTHLY_AVERAGES_INCHES] * day) / daysInMonth;
  return total;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const year = searchParams.get('year') || new Date().getFullYear().toString();

    const currentDate = new Date();
    const startDate = `${year}-01-01`;
    const endDate = currentDate.getFullYear().toString() === year
      ? currentDate.toISOString().split('T')[0]
      : `${year}-12-31`;

    // Fetch from Open-Meteo Historical API (free, no key required)
    const apiUrl = `https://archive-api.open-meteo.com/v1/archive?latitude=${BOERNE_LAT}&longitude=${BOERNE_LON}&start_date=${startDate}&end_date=${endDate}&daily=precipitation_sum&timezone=America/Chicago`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    let response: Response;
    try {
      response = await fetch(apiUrl, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
        }
      });
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        return NextResponse.json(
          { error: 'Open-Meteo API request timed out' },
          { status: 504 }
        );
      }
      throw error;
    }
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Open-Meteo API responded with status: ${response.status}`);
    }

    const data = await response.json();

    // Process the daily precipitation data
    const dailyData = data.daily;
    const dates = dailyData.time as string[];
    const precipMM = dailyData.precipitation_sum as (number | null)[];

    // Convert mm to inches and calculate monthly totals
    const monthlyTotals: { [key: number]: number } = {};
    let ytdTotal = 0;

    for (let i = 0; i < dates.length; i++) {
      const precip = precipMM[i];
      if (precip !== null && precip !== undefined) {
        const precipInches = precip / 25.4; // Convert mm to inches
        ytdTotal += precipInches;

        const month = new Date(dates[i]).getMonth() + 1;
        monthlyTotals[month] = (monthlyTotals[month] || 0) + precipInches;
      }
    }

    // Build monthly comparison data
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = currentDate.getMonth() + 1;
    const currentDay = currentDate.getDate();

    const monthlyComparison = monthNames.map((name, index) => {
      const monthNum = index + 1;
      const average = MONTHLY_AVERAGES_INCHES[monthNum as keyof typeof MONTHLY_AVERAGES_INCHES];
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
    const ytdPercentage = ((ytdTotal / expectedYTD) * 100);

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
      },
    });

  } catch (error) {
    console.error('Rainfall API error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch rainfall data',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}
