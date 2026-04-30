'use client';

import { useEffect, useState } from 'react';

interface CiboloCreekData {
  stageHeight: { value: number; unit: string; dateTime: string } | null;
  discharge: { value: number; unit: string; dateTime: string } | null;
  floodStage: number;
  status: 'normal' | 'elevated' | 'flood' | 'major_flood';
  statusMessage: string;
  gaugeUrl: string;
}

interface HillCountryData {
  ciboloCreek: CiboloCreekData | null;
}

export default function CiboloCreekWidget() {
  const [data, setData] = useState<HillCountryData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/hill-country');
        if (response.ok) {
          const result = await response.json();
          setData(result);
        }
      } catch (err) {
        // Silent fail - widget is supplementary
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Don't show anything if loading or no data
  if (loading || !data?.ciboloCreek?.stageHeight) {
    return null;
  }

  const creek = data.ciboloCreek!;
  const isElevated = creek.status !== 'normal';

  // Only show prominently if conditions are elevated
  if (!isElevated) {
    return null;
  }

  const statusColors = {
    elevated: 'bg-yellow-50 border-yellow-400 text-yellow-800',
    flood: 'bg-orange-50 border-orange-500 text-orange-800',
    major_flood: 'bg-red-50 border-red-600 text-red-900',
    normal: 'bg-blue-50 border-blue-400 text-blue-800',
  };

  const statusIcons = {
    elevated: '⚠️',
    flood: '🌊',
    major_flood: '🚨',
    normal: '🏞️',
  };

  return (
    <div className={`rounded-xl border-2 p-4 mb-6 ${statusColors[creek.status]}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{statusIcons[creek.status]}</span>
          <div>
            <p className="font-bold text-lg">
              Cibolo Creek: {creek.stageHeight!.value.toFixed(1)} ft
            </p>
            <p className="text-sm">{creek.statusMessage}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm opacity-75">Flood stage: {creek.floodStage} ft</p>
          <a
            href={creek.gaugeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs underline hover:no-underline"
          >
            USGS gauge
          </a>
        </div>
      </div>
    </div>
  );
}
