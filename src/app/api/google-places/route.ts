import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { location, radius, categories, maxResults } = await request.json();

    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    if (!apiKey) {
      console.error('Google Places API key missing from environment variables');
      return NextResponse.json(
        { 
          error: 'Google Places API key not configured in server environment',
          debug: {
            message: 'GOOGLE_PLACES_API_KEY environment variable is missing',
            suggestion: 'Add GOOGLE_PLACES_API_KEY to your Vercel environment variables'
          }
        },
        { status: 500 }
      );
    }

    if (!location || !categories || categories.length === 0) {
      return NextResponse.json(
        { error: 'Missing required parameters: location and categories' },
        { status: 400 }
      );
    }

    // Category mapping for Google Places API
    const WEDDING_CATEGORIES = {
      'wedding_venue': ['wedding_venue', 'banquet_hall', 'event_venue'],
      'photographer': ['photographer'],
      'florist': ['florist', 'flower_shop'],
      'restaurant': ['restaurant', 'meal_takeaway', 'catering'],
      'beauty_salon': ['beauty_salon', 'hair_care', 'spa'],
      'jewelry_store': ['jewelry_store'],
      'bridal_shop': ['clothing_store']
    };

    // First get coordinates for the location
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${apiKey}`;
    const geocodeResponse = await fetch(geocodeUrl);
    const geocodeData = await geocodeResponse.json();

    if (geocodeData.status !== 'OK') {
      console.error('Geocoding failed:', {
        status: geocodeData.status,
        error_message: geocodeData.error_message,
        location: location,
        hasApiKey: !!apiKey
      });
      
      return NextResponse.json(
        { 
          error: `Failed to geocode location: ${geocodeData.error_message || geocodeData.status}`,
          debug: {
            status: geocodeData.status,
            location: location,
            hasApiKey: !!apiKey
          }
        },
        { status: 400 }
      );
    }

    const { lat, lng } = geocodeData.results[0].geometry.location;
    const results: Array<{
      name: string;
      address: string;
      phone: string | null;
      website: string | null;
      rating: number;
      place_id: string;
      types: string[];
      category: string;
      coordinates: { lat: number; lng: number };
      price_level: number;
      photos: string[];
    }> = [];

    // Search for each category
    for (const categoryId of categories) {
      const categoryTypes = WEDDING_CATEGORIES[categoryId as keyof typeof WEDDING_CATEGORIES];
      if (!categoryTypes) continue;

      for (const type of categoryTypes) {
        const placesUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${type}&key=${apiKey}`;
        
        try {
          const response = await fetch(placesUrl);
          const data = await response.json();

          if (data.status === 'OK') {
            const businesses = data.results.slice(0, maxResults).map((place: {
              name: string;
              vicinity?: string;
              formatted_address?: string;
              formatted_phone_number?: string;
              rating?: number;
              place_id: string;
              types: string[];
              geometry: { location: { lat: number; lng: number } };
              price_level?: number;
              photos?: Array<{ photo_reference: string }>;
            }) => ({
              name: place.name,
              address: place.vicinity || place.formatted_address || 'No address available',
              phone: place.formatted_phone_number || null,
              website: null, // Would need Place Details API for website
              rating: place.rating || 0,
              place_id: place.place_id,
              types: place.types,
              category: categoryId,
              // Additional data for import
              coordinates: {
                lat: place.geometry.location.lat,
                lng: place.geometry.location.lng
              },
              price_level: place.price_level || 2,
              photos: place.photos?.slice(0, 3).map((photo: { photo_reference: string }) => 
                `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${apiKey}`
              ) || []
            }));

            results.push(...businesses);
          }
        } catch (error) {
          console.error(`Error searching for ${type}:`, error);
        }

        // Rate limiting - wait 100ms between requests
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    // Remove duplicates based on place_id
    const uniqueResults = results.filter((business, index, self) => 
      index === self.findIndex(b => b.place_id === business.place_id)
    );

    return NextResponse.json({
      success: true,
      results: uniqueResults,
      total: uniqueResults.length
    });

  } catch (error) {
    console.error('Google Places API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}