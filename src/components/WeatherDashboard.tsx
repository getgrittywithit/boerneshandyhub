'use client';

import { useEffect, useState } from 'react';

interface WeatherAlert {
  id: string;
  headline: string;
  severity: string;
  urgency: string;
  event: string;
  description: string;
  instruction: string;
  onset: string;
  expires: string;
  severityColor: string;
}

interface CurrentWeather {
  temperature: number;
  feelsLike: number;
  humidity: number;
  precipitation: number;
  weatherCode: number;
  description: string;
  icon: string;
  uvIndex: number;
  isDay: boolean;
  wind: {
    speed: number;
    gusts: number;
    direction: string;
    degrees: number;
  };
  time: string;
}

interface ForecastDay {
  date: string;
  dayName: string;
  dayFull: string;
  high: number;
  low: number;
  precipitation: number;
  precipProbability: number;
  windMax: number;
  uvIndexMax: number;
  weatherCode: number;
  description: string;
  icon: string;
  sunrise: string;
  sunset: string;
}

interface WeatherData {
  lastUpdated: string;
  location: {
    name: string;
    lat: number;
    lon: number;
  };
  alerts: WeatherAlert[];
  current: CurrentWeather;
  forecast: ForecastDay[];
}

export default function WeatherDashboard() {
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedAlert, setExpandedAlert] = useState<string | null>(null);

  useEffect(() => {
    async function fetchWeather() {
      try {
        const response = await fetch('/api/weather');
        if (!response.ok) {
          throw new Error('Failed to fetch weather data');
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchWeather();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-lg p-8 animate-pulse">
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-8 animate-pulse">
          <div className="h-48 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="text-center text-red-600">
          <p className="text-lg font-semibold">Unable to load weather data</p>
          <p className="text-sm mt-2">{error || 'Please try again later'}</p>
        </div>
      </div>
    );
  }

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZone: 'America/Chicago',
    });
  };

  const getUVLabel = (uv: number): { label: string; color: string } => {
    if (uv <= 2) return { label: 'Low', color: 'text-green-600' };
    if (uv <= 5) return { label: 'Moderate', color: 'text-yellow-600' };
    if (uv <= 7) return { label: 'High', color: 'text-orange-600' };
    if (uv <= 10) return { label: 'Very High', color: 'text-red-600' };
    return { label: 'Extreme', color: 'text-purple-600' };
  };

  const getAlertColors = (severity: string) => {
    switch (severity) {
      case 'Extreme':
        return 'bg-red-100 border-red-500 text-red-800';
      case 'Severe':
        return 'bg-orange-100 border-orange-500 text-orange-800';
      case 'Moderate':
        return 'bg-yellow-100 border-yellow-500 text-yellow-800';
      default:
        return 'bg-blue-100 border-blue-500 text-blue-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Weather Alerts */}
      {data.alerts && data.alerts.length > 0 && (
        <div className="space-y-3">
          {data.alerts.map((alert) => (
            <div
              key={alert.id}
              className={`rounded-xl border-l-4 p-4 ${getAlertColors(alert.severity)}`}
            >
              <div
                className="flex items-start justify-between cursor-pointer"
                onClick={() => setExpandedAlert(expandedAlert === alert.id ? null : alert.id)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">
                    {alert.severity === 'Extreme' || alert.severity === 'Severe' ? '⚠️' : 'ℹ️'}
                  </span>
                  <div>
                    <p className="font-semibold">{alert.event}</p>
                    <p className="text-sm">{alert.headline}</p>
                  </div>
                </div>
                <svg
                  className={`w-5 h-5 transition-transform ${expandedAlert === alert.id ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              {expandedAlert === alert.id && (
                <div className="mt-4 pt-4 border-t border-current/20">
                  <p className="text-sm whitespace-pre-wrap">{alert.description}</p>
                  {alert.instruction && (
                    <div className="mt-3">
                      <p className="font-semibold text-sm">What to do:</p>
                      <p className="text-sm">{alert.instruction}</p>
                    </div>
                  )}
                  <p className="text-xs mt-3 opacity-75">
                    Expires: {formatDate(alert.expires)}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Current Conditions */}
      {data.current && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-boerne-navy to-boerne-light-blue p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-75">Current Conditions</p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-6xl">{data.current.icon}</span>
                  <div>
                    <p className="text-5xl font-bold">{data.current.temperature}°F</p>
                    <p className="text-lg opacity-90">{data.current.description}</p>
                  </div>
                </div>
              </div>
              <div className="text-right space-y-2">
                <div>
                  <p className="text-sm opacity-75">Feels Like</p>
                  <p className="text-2xl font-semibold">{data.current.feelsLike}°F</p>
                </div>
                <div>
                  <p className="text-sm opacity-75">Humidity</p>
                  <p className="text-lg">{data.current.humidity}%</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-sm">Wind</p>
              <p className="text-xl font-semibold text-boerne-navy">
                {data.current.wind.speed} mph
              </p>
              <p className="text-sm text-gray-600">
                {data.current.wind.direction}
                {data.current.wind.gusts > data.current.wind.speed && (
                  <span className="block text-xs">Gusts {data.current.wind.gusts} mph</span>
                )}
              </p>
            </div>

            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-sm">UV Index</p>
              <p className={`text-xl font-semibold ${getUVLabel(data.current.uvIndex).color}`}>
                {data.current.uvIndex.toFixed(1)}
              </p>
              <p className="text-sm text-gray-600">{getUVLabel(data.current.uvIndex).label}</p>
            </div>

            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-sm">Sunrise</p>
              <p className="text-xl font-semibold text-boerne-navy">
                {data.forecast?.[0]?.sunrise || '--'}
              </p>
              <p className="text-sm text-gray-600">Today</p>
            </div>

            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-sm">Sunset</p>
              <p className="text-xl font-semibold text-boerne-navy">
                {data.forecast?.[0]?.sunset || '--'}
              </p>
              <p className="text-sm text-gray-600">Today</p>
            </div>
          </div>
        </div>
      )}

      {/* 7-Day Forecast */}
      {data.forecast && data.forecast.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-boerne-navy mb-4">7-Day Forecast</h3>
          <div className="space-y-2">
            {data.forecast.map((day, index) => (
              <div
                key={day.date}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  index === 0 ? 'bg-boerne-gold/10 border border-boerne-gold/30' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3 w-32">
                  <span className="text-2xl">{day.icon}</span>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {index === 0 ? 'Today' : day.dayName}
                    </p>
                    {index !== 0 && (
                      <p className="text-xs text-gray-500">{day.dayFull.split(',')[0]}</p>
                    )}
                  </div>
                </div>

                <div className="hidden sm:block text-center flex-1">
                  <p className="text-sm text-gray-600">{day.description}</p>
                </div>

                <div className="flex items-center gap-6">
                  {day.precipProbability > 0 && (
                    <div className="text-center w-16">
                      <p className="text-sm text-blue-600">
                        💧 {day.precipProbability}%
                      </p>
                    </div>
                  )}

                  <div className="flex items-center gap-2 w-24 justify-end">
                    {day.high !== null && <span className="font-bold text-gray-900">{day.high}°</span>}
                    {day.high !== null && day.low !== null && <span className="text-gray-400">/</span>}
                    {day.low !== null && <span className="text-gray-500">{day.low}°</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Data Source Attribution */}
      <div className="text-center text-sm text-gray-500">
        <p>
          Weather data from{' '}
          <a
            href="https://www.weather.gov/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-boerne-navy hover:underline"
          >
            National Weather Service
          </a>
          {' '}(NWS Austin/San Antonio).
        </p>
        <p className="mt-1">Last updated: {formatDate(data.lastUpdated)}</p>
      </div>
    </div>
  );
}
