import { NextResponse } from 'next/server';

// Boerne, TX coordinates and NWS grid info
const BOERNE_LAT = 29.7947;
const BOERNE_LON = -98.7320;
const NWS_OFFICE = 'EWX';
const NWS_GRID_X = 118;
const NWS_GRID_Y = 71;

// NWS User-Agent requirement
const NWS_USER_AGENT = '(boerneshandyhub.com, contact@boerneshandyhub.com)';

interface NWSAlert {
  id: string;
  areaDesc: string;
  headline: string;
  severity: string;
  urgency: string;
  event: string;
  description: string;
  instruction: string;
  onset: string;
  expires: string;
}

// NWS icon URL to emoji mapping
function getWeatherEmoji(iconUrl: string, isDaytime: boolean): string {
  const url = iconUrl.toLowerCase();

  if (url.includes('tsra') || url.includes('thunder')) return '⛈️';
  if (url.includes('rain') || url.includes('showers')) return isDaytime ? '🌧️' : '🌧️';
  if (url.includes('snow')) return '❄️';
  if (url.includes('sleet') || url.includes('ice')) return '🌨️';
  if (url.includes('fog') || url.includes('haze')) return '🌫️';
  if (url.includes('wind') || url.includes('breezy')) return '💨';
  if (url.includes('cloud') || url.includes('ovc')) return '☁️';
  if (url.includes('sct') || url.includes('few')) return isDaytime ? '⛅' : '☁️';
  if (url.includes('skc') || url.includes('clear')) return isDaytime ? '☀️' : '🌙';
  if (url.includes('hot')) return '🔥';
  if (url.includes('cold')) return '🥶';

  return isDaytime ? '🌤️' : '🌙';
}

async function fetchNWSObservations() {
  try {
    // Get nearest observation station
    const stationsUrl = `https://api.weather.gov/gridpoints/${NWS_OFFICE}/${NWS_GRID_X},${NWS_GRID_Y}/stations`;
    const stationsRes = await fetch(stationsUrl, {
      headers: { 'User-Agent': NWS_USER_AGENT },
      next: { revalidate: 3600 }, // Cache station list for 1 hour
    });

    if (!stationsRes.ok) return null;

    const stationsData = await stationsRes.json();
    const stationId = stationsData.features?.[0]?.properties?.stationIdentifier;

    if (!stationId) return null;

    // Get latest observation from that station
    const obsUrl = `https://api.weather.gov/stations/${stationId}/observations/latest`;
    const obsRes = await fetch(obsUrl, {
      headers: { 'User-Agent': NWS_USER_AGENT },
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!obsRes.ok) return null;

    const obsData = await obsRes.json();
    return obsData.properties;
  } catch (error) {
    console.error('Error fetching NWS observations:', error);
    return null;
  }
}

async function fetchNWSForecast() {
  try {
    const forecastUrl = `https://api.weather.gov/gridpoints/${NWS_OFFICE}/${NWS_GRID_X},${NWS_GRID_Y}/forecast`;
    const response = await fetch(forecastUrl, {
      headers: { 'User-Agent': NWS_USER_AGENT },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) return null;

    const data = await response.json();
    return data.properties?.periods || [];
  } catch (error) {
    console.error('Error fetching NWS forecast:', error);
    return null;
  }
}

async function fetchNWSAlerts(): Promise<NWSAlert[]> {
  try {
    // Fetch alerts for Kendall County, TX (zone TXC259)
    const url = `https://api.weather.gov/alerts/active?zone=TXC259`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': NWS_USER_AGENT,
        'Accept': 'application/geo+json',
      },
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) return [];

    const data = await response.json();

    if (!data.features || !Array.isArray(data.features)) return [];

    return data.features.map((feature: any) => ({
      id: feature.properties.id,
      areaDesc: feature.properties.areaDesc,
      headline: feature.properties.headline,
      severity: feature.properties.severity,
      urgency: feature.properties.urgency,
      event: feature.properties.event,
      description: feature.properties.description,
      instruction: feature.properties.instruction,
      onset: feature.properties.onset,
      expires: feature.properties.expires,
    }));
  } catch (error) {
    console.error('Error fetching NWS alerts:', error);
    return [];
  }
}

// Convert Celsius to Fahrenheit
function cToF(celsius: number | null): number | null {
  if (celsius === null) return null;
  return Math.round((celsius * 9/5) + 32);
}

// Convert m/s to mph
function msToMph(ms: number | null): number | null {
  if (ms === null) return null;
  return Math.round(ms * 2.237);
}

// Get wind direction from degrees
function getWindDirection(degrees: number | null): string {
  if (degrees === null) return 'N/A';
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}

export async function GET() {
  try {
    // Fetch all data in parallel
    const [observations, forecastPeriods, alerts] = await Promise.all([
      fetchNWSObservations(),
      fetchNWSForecast(),
      fetchNWSAlerts(),
    ]);

    const result: any = {
      lastUpdated: new Date().toISOString(),
      location: {
        name: 'Boerne, TX',
        lat: BOERNE_LAT,
        lon: BOERNE_LON,
      },
      alerts: alerts.map(alert => ({
        ...alert,
        severityColor: alert.severity === 'Extreme' ? 'red' :
                       alert.severity === 'Severe' ? 'orange' :
                       alert.severity === 'Moderate' ? 'yellow' : 'blue',
      })),
    };

    // Process current conditions from NWS observations
    if (observations) {
      const temp = cToF(observations.temperature?.value);
      const windChill = cToF(observations.windChill?.value);
      const heatIndex = cToF(observations.heatIndex?.value);
      const feelsLike = heatIndex || windChill || temp;

      result.current = {
        temperature: temp,
        feelsLike: feelsLike,
        humidity: observations.relativeHumidity?.value ? Math.round(observations.relativeHumidity.value) : null,
        description: observations.textDescription || 'Current conditions',
        icon: getWeatherEmoji(observations.icon || '', true),
        wind: {
          speed: msToMph(observations.windSpeed?.value),
          gusts: msToMph(observations.windGust?.value),
          direction: getWindDirection(observations.windDirection?.value),
          degrees: observations.windDirection?.value,
        },
        visibility: observations.visibility?.value ? Math.round(observations.visibility.value / 1609.34) : null, // meters to miles
        pressure: observations.barometricPressure?.value ? (observations.barometricPressure.value / 100).toFixed(1) : null, // Pa to mb
        time: observations.timestamp,
      };
    }

    // Process 7-day forecast from NWS
    if (forecastPeriods && forecastPeriods.length > 0) {
      // NWS returns periods (day/night), we need to pair them into days
      const forecast: any[] = [];

      for (let i = 0; i < forecastPeriods.length && forecast.length < 7; i++) {
        const period = forecastPeriods[i];

        if (period.isDaytime) {
          // Find the corresponding night period
          const nightPeriod = forecastPeriods[i + 1];

          forecast.push({
            date: period.startTime.split('T')[0],
            dayName: period.name.includes('Today') ? 'Today' :
                     period.name.includes('Tonight') ? 'Tonight' :
                     period.name.split(' ')[0], // "Monday", "Tuesday", etc.
            dayFull: period.name,
            high: period.temperature,
            low: nightPeriod?.temperature || null,
            description: period.shortForecast,
            detailedForecast: period.detailedForecast,
            icon: getWeatherEmoji(period.icon || '', period.isDaytime),
            precipProbability: period.probabilityOfPrecipitation?.value || 0,
            windSpeed: period.windSpeed,
            windDirection: period.windDirection,
          });

          i++; // Skip the night period we just used
        } else if (i === 0) {
          // First period is night (after sunset), show as "Tonight"
          forecast.push({
            date: period.startTime.split('T')[0],
            dayName: 'Tonight',
            dayFull: period.name,
            high: null,
            low: period.temperature,
            description: period.shortForecast,
            detailedForecast: period.detailedForecast,
            icon: getWeatherEmoji(period.icon || '', false),
            precipProbability: period.probabilityOfPrecipitation?.value || 0,
            windSpeed: period.windSpeed,
            windDirection: period.windDirection,
          });
        }
      }

      result.forecast = forecast;
    }

    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('Weather API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weather data' },
      { status: 500 }
    );
  }
}
