import { AgroWeatherReport, UserProfile } from '../types';

export interface LocationDetectionResult {
  latitude: number;
  longitude: number;
  villageLocation: string;
  district: string;
  stateRegion: string;
  country: string;
  source: 'gps_precise' | 'ip_network' | 'default_fallback';
}

/**
 * Detect user's farm location using browser GPS (Geolocation API) with automatic server IP fallback
 */
export async function detectFarmLocation(): Promise<LocationDetectionResult> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      // Fallback to server IP detection
      fetchServerLocation().then(resolve);
      return;
    }

    let hasResolved = false;

    // Set a safety timeout of 5 seconds for GPS
    const timeoutTimer = setTimeout(() => {
      if (!hasResolved) {
        hasResolved = true;
        fetchServerLocation().then(resolve);
      }
    }, 5000);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        if (hasResolved) return;
        hasResolved = true;
        clearTimeout(timeoutTimer);

        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch('/api/detect-location', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ latitude, longitude }),
          });
          if (res.ok) {
            const data = await res.json();
            resolve({
              latitude,
              longitude,
              villageLocation: data.villageLocation || `${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°`,
              district: data.district || '',
              stateRegion: data.stateRegion || 'India',
              country: data.country || 'India',
              source: 'gps_precise',
            });
            return;
          }
        } catch {
          // Fallback to server location
        }

        resolve({
          latitude,
          longitude,
          villageLocation: `Farm GPS (${latitude.toFixed(2)}°N, ${longitude.toFixed(2)}°E)`,
          district: 'Local District',
          stateRegion: 'India',
          country: 'India',
          source: 'gps_precise',
        });
      },
      (_err) => {
        if (hasResolved) return;
        hasResolved = true;
        clearTimeout(timeoutTimer);
        fetchServerLocation().then(resolve);
      },
      {
        enableHighAccuracy: true,
        timeout: 4500,
        maximumAge: 60000,
      }
    );
  });
}

async function fetchServerLocation(): Promise<LocationDetectionResult> {
  try {
    const res = await fetch('/api/detect-location', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    if (res.ok) {
      const data = await res.json();
      return {
        latitude: data.latitude || 30.211,
        longitude: data.longitude || 74.9455,
        villageLocation: data.villageLocation || 'Rampur Kalan, District Bathinda',
        district: data.district || 'Bathinda',
        stateRegion: data.stateRegion || 'Punjab, India',
        country: data.country || 'India',
        source: data.source || 'default_fallback',
      };
    }
  } catch {
    //
  }

  return {
    latitude: 30.211,
    longitude: 74.9455,
    villageLocation: 'Rampur Kalan, District Bathinda',
    district: 'Bathinda',
    stateRegion: 'Punjab, India',
    country: 'India',
    source: 'default_fallback',
  };
}

/**
 * Fetch live Agro-Weather Report for specific coordinates or location
 */
export async function fetchLiveAgroWeather(
  latitude: number,
  longitude: number,
  locationName: string,
  stateRegion: string,
  language: string = 'en',
  crops: string[] = ['Wheat', 'Rice', 'Cotton', 'Tomato']
): Promise<AgroWeatherReport | null> {
  try {
    const res = await fetch('/api/weather', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        latitude,
        longitude,
        locationName,
        stateRegion,
        language,
        crops,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.report) {
        return data.report;
      }
    }
  } catch (err) {
    console.warn('Weather report fetch error:', err);
  }
  return null;
}
