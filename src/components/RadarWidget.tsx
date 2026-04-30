'use client';

import { useEffect, useState } from 'react';

// Boerne, TX center coordinates
const BOERNE_LAT = 29.7947;
const BOERNE_LON = -98.7320;
const ZOOM = 7;

export default function RadarWidget() {
  const [isVisible, setIsVisible] = useState(false);

  // Lazy load - don't load iframe until component is in view
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-boerne-navy">
          Weather Radar
        </h3>
        <span className="text-sm text-gray-500">Live</span>
      </div>

      {/* Radar Map Container */}
      <div className="relative rounded-lg overflow-hidden bg-gray-100" style={{ height: '320px' }}>
        {isVisible ? (
          <iframe
            src={`https://www.rainviewer.com/map.html?loc=${BOERNE_LAT},${BOERNE_LON},${ZOOM}&oFa=0&oC=0&oU=0&oCS=1&oF=0&oAP=1&c=3&o=83&lm=1&layer=radar&sm=1&sn=1`}
            width="100%"
            height="100%"
            frameBorder="0"
            style={{ border: 0 }}
            loading="lazy"
            title="Weather Radar - Boerne, TX"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="animate-pulse text-gray-400">Loading radar...</div>
          </div>
        )}
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
        Radar from{' '}
        <a
          href="https://www.rainviewer.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-boerne-navy hover:underline"
        >
          RainViewer
        </a>
        {' · '}
        <a
          href={`https://radar.weather.gov/?settings=v1_eyJhZ2VuZGEiOnsiaWQiOiJsb2NhbCIsImNlbnRlciI6Wy05OC43MywyOS44XSwiem9vbSI6OH19`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-boerne-navy hover:underline"
        >
          NWS Radar
        </a>
      </p>
    </div>
  );
}
