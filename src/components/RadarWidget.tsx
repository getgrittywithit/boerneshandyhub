'use client';

import { useEffect, useState, useRef } from 'react';

interface RadarFrame {
  time: number;
  path: string;
}

interface RadarData {
  radar: {
    past: RadarFrame[];
    nowcast: RadarFrame[];
  };
  host: string;
}

// Boerne, TX center coordinates
const BOERNE_LAT = 29.7947;
const BOERNE_LON = -98.7320;
const ZOOM = 7; // Regional view covering Hill Country

export default function RadarWidget() {
  const [radarData, setRadarData] = useState<RadarData | null>(null);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    async function fetchRadarData() {
      try {
        const response = await fetch(
          'https://api.rainviewer.com/public/weather-maps.json'
        );
        if (!response.ok) {
          throw new Error('Failed to fetch radar data');
        }
        const data = await response.json();
        setRadarData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchRadarData();
    // Refresh radar data every 10 minutes
    const refreshInterval = setInterval(fetchRadarData, 10 * 60 * 1000);
    return () => clearInterval(refreshInterval);
  }, []);

  const allFrames = radarData
    ? [...radarData.radar.past, ...radarData.radar.nowcast]
    : [];

  useEffect(() => {
    if (!isPlaying || allFrames.length === 0) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % allFrames.length);
    }, 500);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, allFrames.length]);

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      timeZone: 'America/Chicago',
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !radarData || allFrames.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-boerne-navy mb-4">
          Weather Radar
        </h3>
        <div className="text-center text-gray-500 py-8">
          <p>Radar temporarily unavailable</p>
          <p className="text-sm mt-2">Please check back shortly</p>
        </div>
      </div>
    );
  }

  // Ensure currentFrame is within bounds
  const safeCurrentFrame = Math.min(currentFrame, allFrames.length - 1);
  const currentFrameData = allFrames[safeCurrentFrame];

  // Extra safety check
  if (!currentFrameData) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-boerne-navy mb-4">
          Weather Radar
        </h3>
        <div className="text-center text-gray-500 py-8">
          <p>Loading radar data...</p>
        </div>
      </div>
    );
  }

  const isPast = safeCurrentFrame < radarData.radar.past.length;

  // Generate static map URL using OpenStreetMap tiles with radar overlay
  // We'll use a simple approach: show the radar tile directly
  const osmTileUrl = `https://tile.openstreetmap.org/${ZOOM}/${Math.floor((BOERNE_LON + 180) / 360 * Math.pow(2, ZOOM))}/${Math.floor((1 - Math.log(Math.tan(BOERNE_LAT * Math.PI / 180) + 1 / Math.cos(BOERNE_LAT * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, ZOOM))}.png`;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-boerne-navy">
          Weather Radar
        </h3>
        <div className="flex items-center gap-2">
          <span
            className={`text-sm px-2 py-1 rounded ${
              isPast
                ? 'bg-gray-100 text-gray-600'
                : 'bg-blue-100 text-blue-600'
            }`}
          >
            {isPast ? 'Past' : 'Forecast'}
          </span>
          <span className="text-sm text-gray-600">
            {formatTime(currentFrameData.time)}
          </span>
        </div>
      </div>

      {/* Radar Map Container */}
      <div className="relative rounded-lg overflow-hidden bg-gray-100" style={{ height: '320px' }}>
        {/* Base Map - OpenStreetMap */}
        <iframe
          src={`https://www.rainviewer.com/map.html?loc=${BOERNE_LAT},${BOERNE_LON},${ZOOM}&oFa=0&oC=0&oU=0&oCS=1&oF=0&oAP=1&c=3&o=83&lm=1&layer=radar&sm=1&sn=1`}
          width="100%"
          height="100%"
          frameBorder="0"
          style={{ border: 0 }}
          allowFullScreen
          title="Weather Radar - Boerne, TX"
        />
      </div>

      {/* Controls */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-3 py-1 bg-boerne-navy text-white rounded-lg text-sm hover:bg-boerne-dark-gray transition-colors"
          >
            {isPlaying ? '⏸ Pause' : '▶ Play'}
          </button>
          <button
            onClick={() => setCurrentFrame((prev) => (prev - 1 + allFrames.length) % allFrames.length)}
            className="px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
            disabled={isPlaying}
          >
            ◀
          </button>
          <button
            onClick={() => setCurrentFrame((prev) => (prev + 1) % allFrames.length)}
            className="px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
            disabled={isPlaying}
          >
            ▶
          </button>
        </div>

        {/* Timeline */}
        <div className="flex-1 mx-4">
          <input
            type="range"
            min={0}
            max={allFrames.length - 1}
            value={safeCurrentFrame}
            onChange={(e) => {
              setIsPlaying(false);
              setCurrentFrame(parseInt(e.target.value));
            }}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-boerne-navy"
          />
        </div>

        <span className="text-xs text-gray-500">
          {safeCurrentFrame + 1}/{allFrames.length}
        </span>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center gap-1 text-xs">
        <span className="text-gray-500">Light</span>
        <div className="flex">
          <div className="w-4 h-3 bg-green-300"></div>
          <div className="w-4 h-3 bg-green-500"></div>
          <div className="w-4 h-3 bg-yellow-400"></div>
          <div className="w-4 h-3 bg-orange-500"></div>
          <div className="w-4 h-3 bg-red-500"></div>
          <div className="w-4 h-3 bg-purple-600"></div>
        </div>
        <span className="text-gray-500">Heavy</span>
      </div>

      {/* Attribution */}
      <p className="text-center text-xs text-gray-400 mt-3">
        Radar data from{' '}
        <a
          href="https://www.rainviewer.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-boerne-navy hover:underline"
        >
          RainViewer
        </a>
      </p>
    </div>
  );
}
