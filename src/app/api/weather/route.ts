import { NextResponse } from 'next/server';

// Boerne, TX coordinates
const BOERNE_LAT = 29.7947;
const BOERNE_LON = -98.7320;

// Weather code to description mapping (WMO standard used by Open-Meteo)
const weatherCodeMap: Record<number, { description: string; icon: string }> = {
  0: { description: 'Clear sky', icon: '☀️' },
  1: { description: 'Mainly clear', icon: '🌤️' },
  2: { description: 'Partly cloudy', icon: '⛅' },
  3: { description: 'Overcast', icon: '☁️' },
  45: { description: 'Foggy', icon: '🌫️' },
  48: { description: 'Depositing rime fog', icon: '🌫️' },
  51: { description: 'Light drizzle', icon: '🌦️' },
  53: { description: 'Moderate drizzle', icon: '🌧️' },
  55: { description: 'Dense drizzle', icon: '🌧️' },
  56: { description: 'Light freezing drizzle', icon: '🌨️' },
  57: { description: 'Dense freezing drizzle', icon: '🌨️' },
  61: { description: 'Slight rain', icon: '🌦️' },
  63: { description: 'Moderate rain', icon: '🌧️' },
  65: { description: 'Heavy rain', icon: '🌧️' },
  66: { description: 'Light freezing rain', icon: '🌨️' },
  67: { description: 'Heavy freezing rain', icon: '🌨️' },
  71: { description: 'Slight snow', icon: '🌨️' },
  73: { description: 'Moderate snow', icon: '❄️' },
  75: { description: 'Heavy snow', icon: '❄️' },
  77: { description: 'Snow grains', icon: '🌨️' },
  80: { description: 'Slight rain showers', icon: '🌦️' },
  81: { description: 'Moderate rain showers', icon: '🌧️' },
  82: { description: 'Violent rain showers', icon: '⛈️' },
  85: { description: 'Slight snow showers', icon: '🌨️' },
  86: { description: 'Heavy snow showers', icon: '❄️' },
  95: { description: 'Thunderstorm', icon: '⛈️' },
  96: { description: 'Thunderstorm with slight hail', icon: '⛈️' },
  99: { description: 'Thunderstorm with heavy hail', icon: '⛈️' },
};

function getWeatherInfo(code: number): { description: string; icon: string } {
  return weatherCodeMap[code] || { description: 'Unknown', icon: '❓' };
}

function getWindDirection(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}

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

async function fetchOpenMeteoData() {
  try {
    // Fetch current conditions and 10-day forecast in one call
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${BOERNE_LAT}&longitude=${BOERNE_LON}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m,uv_index,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,sunrise,sunset,uv_index_max&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch&timezone=America/Chicago&forecast_days=10`;

    const response = await fetch(url, {
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
      throw new Error(`Open-Meteo API responded with status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching Open-Meteo data:', error);
    return null;
  }
}

async function fetchNWSAlerts(): Promise<NWSAlert[]> {
  try {
    // Fetch alerts for Kendall County, TX (zone TXC259)
    const url = `https://api.weather.gov/alerts/active?zone=TXC259`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': '(boerneshandyhub.com, contact@boerneshandyhub.com)',
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

export async function GET() {
  try {
    // Fetch all data in parallel
    const [openMeteoData, alerts] = await Promise.all([
      fetchOpenMeteoData(),
      fetchNWSAlerts(),
    ]);

    if (!openMeteoData) {
      return NextResponse.json(
        { error: 'Failed to fetch weather data from Open-Meteo' },
        { status: 500 }
      );
    }

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

    // Process current conditions
    if (openMeteoData.current) {
      const current = openMeteoData.current;
      const weatherInfo = getWeatherInfo(current.weather_code);

      result.current = {
        temperature: Math.round(current.temperature_2m),
        feelsLike: Math.round(current.apparent_temperature),
        humidity: current.relative_humidity_2m,
        precipitation: current.precipitation,
        weatherCode: current.weather_code,
        description: weatherInfo.description,
        icon: weatherInfo.icon,
        uvIndex: current.uv_index,
        isDay: current.is_day === 1,
        wind: {
          speed: Math.round(current.wind_speed_10m),
          gusts: Math.round(current.wind_gusts_10m),
          direction: getWindDirection(current.wind_direction_10m),
          degrees: current.wind_direction_10m,
        },
        time: current.time,
      };
    }

    // Process 10-day forecast
    if (openMeteoData.daily) {
      const daily = openMeteoData.daily;
      result.forecast = daily.time.map((date: string, index: number) => {
        const weatherInfo = getWeatherInfo(daily.weather_code[index]);
        const dateObj = new Date(date + 'T12:00:00');

        return {
          date,
          dayName: dateObj.toLocaleDateString('en-US', {
            weekday: 'short',
            timeZone: 'America/Chicago'
          }),
          dayFull: dateObj.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'short',
            day: 'numeric',
            timeZone: 'America/Chicago'
          }),
          high: Math.round(daily.temperature_2m_max[index]),
          low: Math.round(daily.temperature_2m_min[index]),
          precipitation: daily.precipitation_sum[index],
          precipProbability: daily.precipitation_probability_max[index],
          windMax: Math.round(daily.wind_speed_10m_max[index]),
          uvIndexMax: daily.uv_index_max[index],
          weatherCode: daily.weather_code[index],
          description: weatherInfo.description,
          icon: weatherInfo.icon,
          sunrise: new Date(daily.sunrise[index]).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
            timeZone: 'America/Chicago'
          }),
          sunset: new Date(daily.sunset[index]).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
            timeZone: 'America/Chicago'
          }),
        };
      });
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
