'use client';

import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

interface MonthlyData {
  month: string;
  monthNum: number;
  average: number;
  actual: number | null;
  isCurrent: boolean;
}

interface RainfallData {
  year: number;
  lastUpdated: string;
  location: {
    name: string;
    lat: number;
    lon: number;
  };
  ytd: {
    actual: number;
    expected: number;
    difference: number;
    percentOfNormal: number;
    status: 'above' | 'below' | 'normal';
  };
  annual: {
    average: number;
    projected: number;
  };
  monthly: MonthlyData[];
}

export default function RainfallTracker() {
  const [data, setData] = useState<RainfallData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRainfallData() {
      try {
        const response = await fetch('/api/rainfall');
        if (!response.ok) {
          throw new Error('Failed to fetch rainfall data');
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchRainfallData();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="text-center text-red-600">
          <p className="text-lg font-semibold">Unable to load rainfall data</p>
          <p className="text-sm mt-2">{error || 'Please try again later'}</p>
        </div>
      </div>
    );
  }

  const statusColors = {
    above: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300' },
    below: { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-300' },
    normal: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300' },
  };

  const statusColor = statusColors[data.ytd.status];

  const getStatusMessage = () => {
    const diff = Math.abs(data.ytd.difference);
    if (data.ytd.status === 'above') {
      return `${diff.toFixed(1)}" above average - watch for drainage issues`;
    } else if (data.ytd.status === 'below') {
      return `${diff.toFixed(1)}" below average - monitor foundation & trees`;
    }
    return 'Right on track with historical averages';
  };

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

  return (
    <div className="space-y-6">
      {/* YTD Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* YTD Actual */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-boerne-navy">
          <p className="text-sm text-gray-500 uppercase tracking-wide">Year-to-Date Rainfall</p>
          <p className="text-4xl font-bold text-boerne-navy mt-2">{data.ytd.actual}"</p>
          <p className="text-sm text-gray-600 mt-1">Since Jan 1, {data.year}</p>
        </div>

        {/* Expected YTD */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-gray-400">
          <p className="text-sm text-gray-500 uppercase tracking-wide">Historical Average YTD</p>
          <p className="text-4xl font-bold text-gray-700 mt-2">{data.ytd.expected}"</p>
          <p className="text-sm text-gray-600 mt-1">Normal for this date</p>
        </div>

        {/* Status */}
        <div className={`rounded-xl shadow-lg p-6 border-l-4 ${statusColor.bg} ${statusColor.border}`}>
          <p className="text-sm text-gray-500 uppercase tracking-wide">Status</p>
          <p className={`text-4xl font-bold mt-2 ${statusColor.text}`}>
            {data.ytd.percentOfNormal.toFixed(0)}%
          </p>
          <p className={`text-sm mt-1 ${statusColor.text}`}>{getStatusMessage()}</p>
        </div>
      </div>

      {/* Monthly Chart */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-boerne-navy mb-4">
          Monthly Rainfall: Actual vs. Average
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data.monthly}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="month"
                tick={{ fill: '#6b7280', fontSize: 12 }}
                tickLine={{ stroke: '#e5e7eb' }}
              />
              <YAxis
                tick={{ fill: '#6b7280', fontSize: 12 }}
                tickLine={{ stroke: '#e5e7eb' }}
                label={{
                  value: 'Inches',
                  angle: -90,
                  position: 'insideLeft',
                  fill: '#6b7280',
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
                formatter={(value, name) => [
                  value !== null && value !== undefined ? `${Number(value).toFixed(2)}"` : 'N/A',
                  name === 'actual' ? 'Actual' : 'Average',
                ]}
              />
              <Legend
                wrapperStyle={{ paddingTop: '10px' }}
                formatter={(value) => (value === 'actual' ? 'Actual' : 'Historical Average')}
              />
              <Bar
                dataKey="average"
                fill="#9CA3AF"
                radius={[4, 4, 0, 0]}
                name="average"
              />
              <Bar
                dataKey="actual"
                fill="#1B365D"
                radius={[4, 4, 0, 0]}
                name="actual"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Annual Projection */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-boerne-navy mb-4">Annual Projection</h3>
        <div className="flex items-center gap-8">
          <div className="flex-1">
            <div className="relative h-8 bg-gray-200 rounded-full overflow-hidden">
              {/* Average marker */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-gray-500 z-10"
                style={{ left: `${(data.annual.average / 40) * 100}%` }}
              />
              {/* Actual/Projected bar */}
              <div
                className="h-full bg-gradient-to-r from-boerne-navy to-boerne-light-blue rounded-full transition-all duration-1000"
                style={{ width: `${Math.min((data.ytd.actual / 40) * 100, 100)}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-sm text-gray-600">
              <span>0"</span>
              <span className="font-medium">Avg: {data.annual.average}"</span>
              <span>40"</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Projected Annual Total</p>
            <p className="text-2xl font-bold text-boerne-navy">{data.annual.projected}"</p>
          </div>
        </div>
      </div>

      {/* Hill Country Tips */}
      <div className="bg-gradient-to-br from-boerne-navy to-boerne-dark-gray rounded-xl shadow-lg p-6 text-white">
        <h3 className="text-xl font-semibold mb-4">Hill Country Weather Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.ytd.status === 'above' ? (
            <>
              <div className="flex items-start gap-3">
                <span className="text-2xl">💧</span>
                <div>
                  <p className="font-medium">Check Gutters & Drainage</p>
                  <p className="text-sm text-gray-300">Above-average rain means extra debris buildup</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">🏠</span>
                <div>
                  <p className="font-medium">Inspect for Water Intrusion</p>
                  <p className="text-sm text-gray-300">Check basement, crawlspace, and window seals</p>
                </div>
              </div>
            </>
          ) : data.ytd.status === 'below' ? (
            <>
              <div className="flex items-start gap-3">
                <span className="text-2xl">🏗️</span>
                <div>
                  <p className="font-medium">Monitor Your Foundation</p>
                  <p className="text-sm text-gray-300">Dry conditions can cause foundation movement</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">🌳</span>
                <div>
                  <p className="font-medium">Deep Water Trees</p>
                  <p className="text-sm text-gray-300">Established trees need deep watering in dry spells</p>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-start gap-3">
                <span className="text-2xl">✅</span>
                <div>
                  <p className="font-medium">Normal Conditions</p>
                  <p className="text-sm text-gray-300">Great time for routine maintenance</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">📋</span>
                <div>
                  <p className="font-medium">Seasonal Checkups</p>
                  <p className="text-sm text-gray-300">Schedule your annual HVAC and roof inspections</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Last Updated - CC-BY 4.0 attribution */}
      <p className="text-center text-sm text-gray-500">
        Rainfall data by{' '}
        <a
          href="https://open-meteo.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-boerne-navy hover:underline"
        >
          Open-Meteo.com
        </a>
        . Last updated: {formatDate(data.lastUpdated)}
      </p>
    </div>
  );
}
