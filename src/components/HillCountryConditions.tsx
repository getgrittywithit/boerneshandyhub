'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface CiboloCreekData {
  stageHeight: { value: number; unit: string; dateTime: string } | null;
  discharge: { value: number; unit: string; dateTime: string } | null;
  floodStage: number;
  status: 'normal' | 'elevated' | 'flood' | 'major_flood';
  statusMessage: string;
  gaugeUrl: string;
}

interface DroughtData {
  level: string;
  intensity: number;
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

interface HillCountryData {
  lastUpdated: string;
  ciboloCreek: CiboloCreekData | null;
  drought: DroughtData | null;
  burnBan: BurnBanData | null;
}

interface WeatherContext {
  precipProbability?: number;
  isRaining?: boolean;
  isDrought?: boolean;
  isBurnBan?: boolean;
}

export default function HillCountryConditions() {
  const [data, setData] = useState<HillCountryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/hill-country');
        if (!response.ok) {
          throw new Error('Failed to fetch Hill Country data');
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <p className="text-center text-gray-500">Hill Country conditions temporarily unavailable</p>
      </div>
    );
  }

  const getCreekStatusColor = (status: string) => {
    switch (status) {
      case 'major_flood':
        return 'bg-red-100 border-red-500 text-red-800';
      case 'flood':
        return 'bg-orange-100 border-orange-500 text-orange-800';
      case 'elevated':
        return 'bg-yellow-100 border-yellow-500 text-yellow-800';
      default:
        return 'bg-green-100 border-green-500 text-green-800';
    }
  };

  const getCreekIcon = (status: string) => {
    switch (status) {
      case 'major_flood':
      case 'flood':
        return '🌊';
      case 'elevated':
        return '💧';
      default:
        return '🏞️';
    }
  };

  const getDroughtColor = (intensity: number) => {
    if (intensity < 0) return 'bg-green-100 text-green-800';
    if (intensity === 0) return 'bg-yellow-100 text-yellow-800';
    if (intensity === 1) return 'bg-amber-100 text-amber-800';
    if (intensity === 2) return 'bg-orange-100 text-orange-800';
    if (intensity >= 3) return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  // Determine weather context for cross-sells
  const weatherContext: WeatherContext = {
    isDrought: data?.drought ? data.drought.intensity >= 1 : false,
    isBurnBan: data?.burnBan?.active ?? false,
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-gray-300"></div>
        <span className="text-gray-500 font-medium">Hill Country Conditions</span>
        <div className="flex-1 h-px bg-gray-300"></div>
      </div>

      {/* Conditions Grid */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Cibolo Creek Gauge */}
        <div className={`rounded-xl border-l-4 p-5 ${data?.ciboloCreek ? getCreekStatusColor(data.ciboloCreek.status) : 'bg-gray-100 border-gray-400'}`}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium opacity-75">Cibolo Creek at Boerne</p>
              {data?.ciboloCreek?.stageHeight ? (
                <>
                  <p className="text-3xl font-bold mt-1">
                    {data.ciboloCreek.stageHeight.value.toFixed(2)} ft
                  </p>
                  <p className="text-sm mt-1">{data.ciboloCreek.statusMessage}</p>
                  {data.ciboloCreek.discharge && (
                    <p className="text-xs opacity-75 mt-1">
                      Flow: {data.ciboloCreek.discharge.value.toFixed(0)} cfs
                    </p>
                  )}
                </>
              ) : (
                <p className="text-lg mt-1">Data unavailable</p>
              )}
            </div>
            <span className="text-3xl">{data?.ciboloCreek ? getCreekIcon(data.ciboloCreek.status) : '🏞️'}</span>
          </div>
          {data?.ciboloCreek && (
            <div className="mt-3">
              <div className="h-2 bg-white/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-current rounded-full transition-all"
                  style={{
                    width: `${Math.min((data.ciboloCreek.stageHeight?.value || 0) / data.ciboloCreek.floodStage * 100, 100)}%`,
                  }}
                />
              </div>
              <p className="text-xs mt-1 opacity-75">
                Flood stage: {data.ciboloCreek.floodStage} ft
              </p>
            </div>
          )}
          <a
            href={data?.ciboloCreek?.gaugeUrl || 'https://waterdata.usgs.gov/monitoring-location/08183900/'}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs underline mt-2 block opacity-75 hover:opacity-100"
          >
            USGS gauge data
          </a>
        </div>

        {/* Drought Status */}
        <div className={`rounded-xl border-l-4 p-5 ${data?.drought ? getDroughtColor(data.drought.intensity) : 'bg-gray-100 border-gray-400'}`}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium opacity-75">Drought Status</p>
              {data?.drought ? (
                <>
                  <p className="text-3xl font-bold mt-1">
                    {data.drought.level === 'None' ? 'None' : data.drought.level}
                  </p>
                  <p className="text-sm mt-1">{data.drought.description}</p>
                  {data.drought.level !== 'Unknown' && data.drought.percentArea > 0 && (
                    <p className="text-xs opacity-75 mt-1">
                      {data.drought.percentArea.toFixed(0)}% of county affected
                    </p>
                  )}
                </>
              ) : (
                <p className="text-lg mt-1">Data unavailable</p>
              )}
            </div>
            <span className="text-3xl">
              {data?.drought?.intensity && data.drought.intensity >= 2 ? '🏜️' :
               data?.drought?.intensity === 1 ? '☀️' :
               data?.drought?.intensity === 0 ? '🌤️' : '🌿'}
            </span>
          </div>
          {data?.drought?.asOfDate && (
            <p className="text-xs opacity-75 mt-3">
              As of {new Date(data.drought.asOfDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </p>
          )}
          <a
            href="https://droughtmonitor.unl.edu/CurrentMap/StateDroughtMonitor.aspx?TX"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs underline mt-1 block opacity-75 hover:opacity-100"
          >
            US Drought Monitor
          </a>
        </div>

        {/* Burn Ban Status */}
        <div className={`rounded-xl border-l-4 p-5 ${data?.burnBan?.active ? 'bg-red-100 border-red-500 text-red-800' : 'bg-green-100 border-green-500 text-green-800'}`}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium opacity-75">Burn Ban Status</p>
              <p className="text-3xl font-bold mt-1">
                {data?.burnBan?.active ? 'ACTIVE' : 'None'}
              </p>
              <p className="text-sm mt-1">
                {data?.burnBan?.active
                  ? 'Outdoor burning prohibited'
                  : 'No burn ban in effect'}
              </p>
              <p className="text-xs opacity-75 mt-1">{data?.burnBan?.county}</p>
            </div>
            <span className="text-3xl">{data?.burnBan?.active ? '🔥' : '✅'}</span>
          </div>
          <a
            href={data?.burnBan?.sourceUrl || 'https://tfsweb.tamu.edu/burnbans/'}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs underline mt-3 block opacity-75 hover:opacity-100"
          >
            Texas A&M Forest Service
          </a>
        </div>
      </div>

      {/* Weather-Contextual Service Cross-Sells */}
      <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-boerne-navy mb-4">
          Based on Current Conditions
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Drought-related */}
          {weatherContext.isDrought && (
            <>
              <Link
                href="/services/home/tree-service"
                className="flex items-center gap-3 p-4 bg-white rounded-lg border border-amber-200 hover:border-amber-400 hover:shadow-md transition-all group"
              >
                <span className="text-2xl">🌳</span>
                <div>
                  <p className="font-medium text-gray-900 group-hover:text-boerne-navy">Tree Health Check</p>
                  <p className="text-xs text-amber-700">Drought conditions active</p>
                </div>
              </Link>
              <Link
                href="/services/home/foundation-repair"
                className="flex items-center gap-3 p-4 bg-white rounded-lg border border-amber-200 hover:border-amber-400 hover:shadow-md transition-all group"
              >
                <span className="text-2xl">🏗️</span>
                <div>
                  <p className="font-medium text-gray-900 group-hover:text-boerne-navy">Foundation Inspection</p>
                  <p className="text-xs text-amber-700">Dry soil causes movement</p>
                </div>
              </Link>
            </>
          )}

          {/* Non-drought related */}
          {!weatherContext.isDrought && (
            <>
              <Link
                href="/services/home/gutters"
                className="flex items-center gap-3 p-4 bg-white rounded-lg border border-blue-200 hover:border-blue-400 hover:shadow-md transition-all group"
              >
                <span className="text-2xl">🪣</span>
                <div>
                  <p className="font-medium text-gray-900 group-hover:text-boerne-navy">Gutter Service</p>
                  <p className="text-xs text-blue-700">Prepare for rain season</p>
                </div>
              </Link>
              <Link
                href="/services/home/drainage"
                className="flex items-center gap-3 p-4 bg-white rounded-lg border border-blue-200 hover:border-blue-400 hover:shadow-md transition-all group"
              >
                <span className="text-2xl">💧</span>
                <div>
                  <p className="font-medium text-gray-900 group-hover:text-boerne-navy">Drainage Systems</p>
                  <p className="text-xs text-blue-700">Prevent flooding</p>
                </div>
              </Link>
            </>
          )}

          {/* Burn ban related */}
          {weatherContext.isBurnBan && (
            <Link
              href="/services/outdoor/brush-clearing"
              className="flex items-center gap-3 p-4 bg-white rounded-lg border border-red-200 hover:border-red-400 hover:shadow-md transition-all group"
            >
              <span className="text-2xl">🌿</span>
              <div>
                <p className="font-medium text-gray-900 group-hover:text-boerne-navy">Brush Clearing</p>
                <p className="text-xs text-red-700">Professional removal (no burning)</p>
              </div>
            </Link>
          )}

          {/* Always show */}
          <Link
            href="/services/home/hvac"
            className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 hover:border-boerne-gold hover:shadow-md transition-all group"
          >
            <span className="text-2xl">❄️</span>
            <div>
              <p className="font-medium text-gray-900 group-hover:text-boerne-navy">HVAC Service</p>
              <p className="text-xs text-gray-500">Stay comfortable year-round</p>
            </div>
          </Link>

          <Link
            href="/services/outdoor/irrigation"
            className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 hover:border-boerne-gold hover:shadow-md transition-all group"
          >
            <span className="text-2xl">💦</span>
            <div>
              <p className="font-medium text-gray-900 group-hover:text-boerne-navy">Irrigation Systems</p>
              <p className="text-xs text-gray-500">Smart watering solutions</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Data Attribution */}
      <p className="text-center text-xs text-gray-400">
        Creek data: USGS Water Services. Drought data: US Drought Monitor. Burn ban data: Texas A&M Forest Service.
      </p>
    </div>
  );
}
