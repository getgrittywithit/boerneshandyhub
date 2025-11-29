'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */

import { Wrapper, Status } from '@googlemaps/react-wrapper';
import { useRef, useEffect, ReactElement } from 'react';

interface LatLngLiteral {
  lat: number;
  lng: number;
}

// Basic type declarations for Google Maps
declare global {
  interface Window {
    google: {
      maps: {
        Map: new (element: HTMLElement, options: any) => any;
        Marker: new (options: any) => any;
        marker: {
          AdvancedMarkerElement: new (options: any) => any;
          PinElement: new (options: any) => any;
        };
        InfoWindow: new () => any;
        LatLngBounds: new () => any;
        Size: new (width: number, height: number) => any;
        MapTypeId: {
          TERRAIN: string;
        };
        MapTypeControlStyle: {
          HORIZONTAL_BAR: string;
        };
        ControlPosition: {
          TOP_CENTER: string;
          RIGHT_CENTER: string;
        };
        event: {
          addListenerOnce: (instance: any, eventName: string, handler: () => void) => void;
        };
      };
    };
  }
}

interface MapProps {
  center: LatLngLiteral;
  zoom: number;
  markers: MapMarker[];
  className?: string;
}

export interface MapMarker {
  id: string;
  position: LatLngLiteral;
  title: string;
  description: string;
  category: string;
  difficulty?: string;
  distance?: string;
  duration?: string;
  features?: string[];
  website?: string;
  phone?: string;
}

function MapComponent({ center, zoom, markers, className = '' }: MapProps) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const infoWindowRef = useRef<any>(null);

  useEffect(() => {
    if (ref.current && !mapRef.current) {
      mapRef.current = new window.google.maps.Map(ref.current, {
        center,
        zoom,
        mapTypeId: window.google.maps.MapTypeId.TERRAIN,
        mapTypeControl: true,
        mapTypeControlOptions: {
          style: window.google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
          position: window.google.maps.ControlPosition.TOP_CENTER,
        },
        zoomControl: true,
        zoomControlOptions: {
          position: window.google.maps.ControlPosition.RIGHT_CENTER,
        },
        streetViewControl: true,
        streetViewControlOptions: {
          position: window.google.maps.ControlPosition.RIGHT_CENTER,
        },
        fullscreenControl: true,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'on' }]
          },
          {
            featureType: 'landscape',
            elementType: 'geometry',
            stylers: [{ color: '#f5f5f5' }]
          }
        ]
      });

      // Create info window
      infoWindowRef.current = new window.google.maps.InfoWindow();
    }
  }, [center, zoom]);

  useEffect(() => {
    if (mapRef.current && markers) {
      // Clear existing markers
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];

      // Add new markers using AdvancedMarkerElement (new) or fallback to Marker (deprecated)
      markers.forEach(markerData => {
        let marker;
        
        // Try to use new AdvancedMarkerElement if available
        if (window.google.maps.marker?.AdvancedMarkerElement) {
          // Create pin element with custom color
          const pinElement = new window.google.maps.marker.PinElement({
            background: getMarkerColor(markerData.category, markerData.difficulty),
            borderColor: '#ffffff',
            glyphColor: '#ffffff',
          });
          
          marker = new window.google.maps.marker.AdvancedMarkerElement({
            position: markerData.position,
            map: mapRef.current,
            title: markerData.title,
            content: pinElement.element,
          });
        } else {
          // Fallback to deprecated Marker for compatibility
          marker = new window.google.maps.Marker({
            position: markerData.position,
            map: mapRef.current,
            title: markerData.title,
            icon: {
              url: getMarkerIcon(markerData.category, markerData.difficulty),
              scaledSize: new window.google.maps.Size(32, 32),
            },
          });
        }

        // Add click listener for info window
        marker.addListener('click', () => {
          if (infoWindowRef.current) {
            const contentString = createInfoWindowContent(markerData);
            infoWindowRef.current.setContent(contentString);
            infoWindowRef.current.open(mapRef.current, marker);
          }
        });

        markersRef.current.push(marker);
      });

      // Fit map bounds to show all markers
      if (markers.length > 1) {
        const bounds = new window.google.maps.LatLngBounds();
        markers.forEach(marker => bounds.extend(marker.position));
        mapRef.current.fitBounds(bounds);
        
        // Ensure minimum zoom level
        window.google.maps.event.addListenerOnce(mapRef.current, 'bounds_changed', () => {
          const currentZoom = mapRef.current?.getZoom();
          if (currentZoom && currentZoom > 13) {
            mapRef.current?.setZoom(13);
          }
        });
      }
    }
  }, [markers]);

  return <div ref={ref} className={`w-full h-full ${className}`} />;
}

function getMarkerIcon(category: string, difficulty?: string): string {
  // Color coding based on category and difficulty
  const baseUrl = 'https://maps.google.com/mapfiles/ms/icons/';
  
  switch (category.toLowerCase()) {
    case 'trails':
    case 'nature center':
      return difficulty === 'advanced' ? `${baseUrl}red-dot.png` : 
             difficulty === 'intermediate' ? `${baseUrl}orange-dot.png` : 
             `${baseUrl}green-dot.png`;
    case 'state park':
      return `${baseUrl}purple-dot.png`;
    case 'lake':
      return `${baseUrl}blue-dot.png`;
    default:
      return `${baseUrl}red-dot.png`;
  }
}

function getMarkerColor(category: string, difficulty?: string): string {
  // Color coding for AdvancedMarkerElement pins
  switch (category.toLowerCase()) {
    case 'trails':
    case 'nature center':
      return difficulty === 'advanced' ? '#dc2626' : // red
             difficulty === 'intermediate' ? '#ea580c' : // orange
             '#16a34a'; // green
    case 'state park':
      return '#9333ea'; // purple
    case 'lake':
      return '#2563eb'; // blue
    default:
      return '#dc2626'; // red
  }
}

function createInfoWindowContent(marker: MapMarker): string {
  const difficultyColor = marker.difficulty === 'advanced' ? 'text-red-600' :
                         marker.difficulty === 'intermediate' ? 'text-orange-600' :
                         'text-green-600';
  
  return `
    <div class="max-w-sm p-3">
      <h3 class="text-lg font-semibold text-gray-900 mb-2">${marker.title}</h3>
      <p class="text-sm text-gray-600 mb-3">${marker.description}</p>
      
      <div class="space-y-2 text-sm">
        ${marker.difficulty ? `
          <div class="flex items-center gap-2">
            <span class="font-medium">Difficulty:</span>
            <span class="px-2 py-1 rounded-full text-xs ${difficultyColor} bg-gray-100">${marker.difficulty}</span>
          </div>
        ` : ''}
        
        ${marker.distance ? `
          <div class="flex justify-between">
            <span class="text-gray-500">Distance:</span>
            <span class="font-medium">${marker.distance}</span>
          </div>
        ` : ''}
        
        ${marker.duration ? `
          <div class="flex justify-between">
            <span class="text-gray-500">Duration:</span>
            <span class="font-medium">${marker.duration}</span>
          </div>
        ` : ''}
        
        ${marker.features && marker.features.length > 0 ? `
          <div>
            <span class="text-gray-500">Features:</span>
            <div class="mt-1 flex flex-wrap gap-1">
              ${marker.features.slice(0, 3).map(feature => 
                `<span class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">${feature}</span>`
              ).join('')}
            </div>
          </div>
        ` : ''}
      </div>
      
      <div class="mt-3 pt-3 border-t border-gray-200">
        ${marker.phone ? `
          <div class="text-xs text-gray-500 mb-1">📞 ${marker.phone}</div>
        ` : ''}
        ${marker.website ? `
          <a href="${marker.website}" target="_blank" rel="noopener noreferrer" 
             class="inline-flex items-center text-xs text-blue-600 hover:text-blue-800">
            🌐 Visit Website
          </a>
        ` : ''}
      </div>
    </div>
  `;
}

const render = (status: Status): ReactElement => {
  if (status === Status.LOADING) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  if (status === Status.FAILURE) {
    return (
      <div className="flex items-center justify-center h-96 bg-red-50 border border-red-200 rounded-lg">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <p className="text-red-600 font-semibold">Failed to load map</p>
          <p className="text-red-500 text-sm mt-2">Please check your Google Maps API key configuration</p>
        </div>
      </div>
    );
  }

  return <div className="h-96 bg-gray-200 rounded-lg" />;
};

interface GoogleMapProps extends MapProps {
  apiKey: string;
}

export default function GoogleMap({ apiKey, ...mapProps }: GoogleMapProps) {
  return (
    <Wrapper apiKey={apiKey} render={render} libraries={['places', 'marker']}>
      <MapComponent {...mapProps} />
    </Wrapper>
  );
}