/**
 * API client for AirWise AI Backend
 */

const API_BASE = '/api/v1';

export async function fetchHealth() {
  try {
    const res = await fetch('/health');
    return await res.json();
  } catch (err) {
    console.warn('Health check failed:', err);
    return { status: 'offline', mode: 'intelligent_demo' };
  }
}

export async function fetchConfigStatus() {
  try {
    const res = await fetch(`${API_BASE}/config/status`);
    return await res.json();
  } catch (err) {
    return { gemini_configured: false, mode: 'Intelligent Demo Mode' };
  }
}

export async function updateGeminiApiKey(key) {
  const res = await fetch(`${API_BASE}/config/set-gemini-key`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key }),
  });
  return await res.json();
}

export async function searchCities(query) {
  try {
    const res = await fetch(`${API_BASE}/cities/search?q=${encodeURIComponent(query || '')}`);
    if (!res.ok) throw new Error('Search failed');
    return await res.json();
  } catch (err) {
    console.error('Error searching cities:', err);
    return [];
  }
}

export async function fetchAirQualityByCity(city) {
  const res = await fetch(`${API_BASE}/air-quality/current?city=${encodeURIComponent(city)}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch air quality for ${city}`);
  }
  return await res.json();
}

export async function fetchAirQualityByCoords(lat, lon, cityName, country, region) {
  const params = new URLSearchParams({
    lat: lat.toString(),
    lon: lon.toString(),
    city: cityName || 'Detected Location',
    country: country || 'India',
  });
  if (region) params.append('region', region);

  const res = await fetch(`${API_BASE}/air-quality/coords?${params.toString()}`);
  if (!res.ok) {
    throw new Error('Failed to fetch air quality for coordinates');
  }
  return await res.json();
}

export async function sendChatMessage(messages, location, currentAqi, pollutants, userProfile) {
  const res = await fetch(`${API_BASE}/ai/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages,
      location,
      current_aqi: currentAqi,
      pollutants,
      user_profile: userProfile,
    }),
  });
  if (!res.ok) {
    throw new Error('AI chat service error');
  }
  return await res.json();
}

export async function fetchDailyPlan(location, aqi, userProfile) {
  const res = await fetch(`${API_BASE}/ai/daily-plan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      location,
      aqi,
      user_profile: userProfile,
    }),
  });
  if (!res.ok) throw new Error('Failed to generate daily plan');
  return await res.json();
}

export async function fetchIndoorAdvice(homeSize, occupants, ventilationType, hasPurifier, outdoorAqi) {
  const res = await fetch(`${API_BASE}/ai/indoor-advice`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      home_size: homeSize,
      occupants: Number(occupants),
      ventilation_type: ventilationType,
      has_purifier: Boolean(hasPurifier),
      outdoor_aqi: Number(outdoorAqi),
    }),
  });
  if (!res.ok) throw new Error('Failed to fetch indoor guidance');
  return await res.json();
}
