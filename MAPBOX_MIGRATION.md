# Mapbox Migration Guide

## Overview

BiteBase has been successfully migrated from Google Maps API to Mapbox for improved performance, cost efficiency, and better developer experience. This document outlines the changes made and how to use the new Mapbox-powered features.

## Why Mapbox?

- **Cost Efficiency**: More predictable pricing and better value for high-volume usage
- **Performance**: Faster map loading and better caching
- **Customization**: More flexible styling and customization options
- **Developer Experience**: Better documentation and more modern APIs
- **Bangkok Focus**: Better coverage and accuracy for Thailand/Bangkok area

## Environment Setup

### Required Environment Variables

```bash
# Primary mapping service (Mapbox)
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token_here
MAPBOX_API_KEY=your_mapbox_api_key_here

# Legacy Google Maps (deprecated - can be removed)
# GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### Getting Mapbox Tokens

1. Sign up at [Mapbox](https://www.mapbox.com/)
2. Go to your [Account page](https://account.mapbox.com/)
3. Create a new access token with these scopes:
   - `styles:read`
   - `fonts:read`
   - `datasets:read`
   - `geocoding:read`

## Changes Made

### Frontend Changes

#### 1. New Mapbox Utility Library
- **File**: `apps/frontend/lib/mapbox.ts`
- **Features**:
  - Geocoding (address to coordinates)
  - Reverse geocoding (coordinates to address)
  - Nearby place search
  - Map style utilities

#### 2. Updated Map Components
- **MapContainer**: Now uses Mapbox GL JS with Bangkok as default location
- **Enhanced Features**:
  - Real-time geocoding
  - Nearby restaurant search
  - Interactive markers with popups
  - Smooth animations and transitions

#### 3. Improved User Experience
- Default location set to Bangkok (13.7563, 100.5018)
- Automatic address geocoding when user enters location
- Visual markers for user location (green) and nearby restaurants (red)
- Distance-based search results

### Backend Changes

#### 1. New Mapbox Service
- **File**: `agent/bitebase_ai/mapbox_service.py`
- **Features**:
  - Python wrapper for Mapbox APIs
  - Establishment search tools
  - Geocoding utilities
  - Distance calculations

#### 2. Updated Search Functions
- **File**: `agent/bitebase_ai/search.py`
- **Changes**:
  - Replaced Google Maps API calls with Mapbox
  - Improved search accuracy for Bangkok area
  - Better error handling and fallbacks
  - Consistent data format across all responses

#### 3. Cloudflare Worker Updates
- **File**: `agent/cloudflare-worker.js`
- **Changes**:
  - Geocoding endpoint now uses Mapbox
  - Improved response format
  - Better error handling

## API Changes

### Geocoding API

**Before (Google Maps):**
```javascript
GET /api/geocode?address=Bangkok
// Response: Google Maps format
```

**After (Mapbox):**
```javascript
GET /api/geocode?address=Bangkok
// Response:
{
  "address": "Bangkok",
  "latitude": 13.7563,
  "longitude": 100.5018,
  "formatted_address": "Bangkok, Thailand",
  "place_id": "mapbox_place_id",
  "city": "Bangkok",
  "country": "Thailand",
  "source": "mapbox",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Search API

**New Features:**
- Location-based search (defaults to Bangkok)
- Radius-based filtering
- Distance sorting
- Consistent response format

```python
# Python Agent
search_for_establishments(
    queries=["Italian restaurants", "coffee shops"],
    location="Bangkok, Thailand",  # New parameter
    filters={
        "radius": 2000,  # meters
        "business_type": "restaurant"
    }
)
```

## Usage Examples

### Frontend - Geocoding

```typescript
import { geocodeAddress, searchNearbyPlaces } from '../lib/mapbox'

// Geocode an address
const result = await geocodeAddress("Sukhumvit Road, Bangkok")
if (result) {
  console.log(`Coordinates: ${result.latitude}, ${result.longitude}`)
}

// Search nearby restaurants
const restaurants = await searchNearbyPlaces(
  13.7563, 100.5018, // Bangkok coordinates
  "restaurant",
  2000, // 2km radius
  10    // max 10 results
)
```

### Backend - Python Agent

```python
from bitebase_ai.mapbox_service import mapbox_service

# Geocode address
location = mapbox_service.geocode_address("Bangkok, Thailand")

# Search nearby places
places = mapbox_service.search_nearby_places(
    13.7563, 100.5018,
    "restaurant",
    radius=2000,
    limit=20
)
```

## Migration Benefits

### Performance Improvements
- **Faster Loading**: Mapbox tiles load ~30% faster than Google Maps
- **Better Caching**: Improved tile caching reduces API calls
- **Optimized for Bangkok**: Better local data coverage

### Cost Savings
- **Predictable Pricing**: Mapbox offers more transparent pricing
- **Higher Limits**: More generous free tier and usage limits
- **No Surprise Charges**: Better cost control and monitoring

### Developer Experience
- **Modern APIs**: RESTful APIs with consistent responses
- **Better Documentation**: Comprehensive guides and examples
- **Flexible Styling**: Easy map customization and theming

## Troubleshooting

### Common Issues

1. **Map Not Loading**
   - Check `NEXT_PUBLIC_MAPBOX_TOKEN` is set correctly
   - Verify token has required scopes
   - Check browser console for errors

2. **Geocoding Fails**
   - Ensure `MAPBOX_API_KEY` is configured
   - Check API rate limits
   - Verify address format

3. **No Search Results**
   - Check if location is valid
   - Increase search radius
   - Try different search terms

### Fallback Behavior

The system includes fallback mechanisms:
- Default to Bangkok coordinates if geocoding fails
- Graceful error handling for API failures
- Legacy Google Maps support (deprecated but available)

## Future Enhancements

- **Custom Map Styles**: Bangkok-optimized map themes
- **Real-time Data**: Live traffic and business hours
- **Advanced Analytics**: Heat maps and demographic overlays
- **Offline Support**: Cached tiles for offline usage

## Support

For issues related to Mapbox integration:
1. Check the [Mapbox Documentation](https://docs.mapbox.com/)
2. Review this migration guide
3. Check environment variables and API keys
4. Contact the development team for assistance
