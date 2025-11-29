import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat') || '29.7946';  // Boerne, TX coordinates
    const lon = searchParams.get('lon') || '-98.7319';

    // Using OpenWeatherMap API (free tier available)
    const apiKey = process.env.OPENWEATHER_API_KEY;
    if (!apiKey) {
      console.error('OpenWeatherMap API key missing from environment variables');
      return NextResponse.json(
        { 
          error: 'Weather API key not configured',
          debug: {
            message: 'OPENWEATHER_API_KEY environment variable is missing',
            suggestion: 'Add OPENWEATHER_API_KEY to your environment variables. Get a free key at https://openweathermap.org/api'
          }
        },
        { status: 500 }
      );
    }

    // Fetch current weather
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
    const weatherResponse = await fetch(weatherUrl);
    
    if (!weatherResponse.ok) {
      throw new Error(`Weather API responded with status: ${weatherResponse.status}`);
    }
    
    const weatherData = await weatherResponse.json();

    // Fetch sunrise/sunset times (already included in weather response)
    const sunriseTime = new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: 'America/Chicago'
    });
    
    const sunsetTime = new Date(weatherData.sys.sunset * 1000).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: 'America/Chicago'
    });

    // Format response
    const formattedWeather = {
      temperature: Math.round(weatherData.main.temp),
      condition: weatherData.weather[0].main,
      description: weatherData.weather[0].description,
      humidity: weatherData.main.humidity,
      windSpeed: Math.round(weatherData.wind.speed),
      visibility: Math.round(weatherData.visibility / 1609.34), // Convert meters to miles
      sunrise: sunriseTime,
      sunset: sunsetTime,
      icon: weatherData.weather[0].icon,
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(formattedWeather);

  } catch (error) {
    console.error('Weather API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch weather data',
        debug: {
          message: error instanceof Error ? error.message : 'Unknown error occurred',
          suggestion: 'Check your internet connection and API key validity'
        }
      },
      { status: 500 }
    );
  }
}