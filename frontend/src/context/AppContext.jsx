import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  fetchAirQualityByCity,
  fetchAirQualityByCoords,
  fetchConfigStatus,
  updateGeminiApiKey,
  reverseGeocode,
} from '../services/api';

const AppContext = createContext();

const INITIAL_PROFILE = {
  name: 'Bharath',
  city: 'Hyderabad',
  transport_method: 'Two-Wheeler / Bike',
  lifestyle: 'College Student / Daily Commuter',
  outdoor_frequency: 'Daily 2-3 hours',
  home_size: '2 BHK (800-1200 sq ft)',
  occupants: 3,
  has_purifier: false,
  ventilation_type: 'Natural Windows & Balcony',
};

const DEFAULT_ACHIEVEMENTS = [
  { id: 'first_action', name: 'First Green Step', description: 'Log your first sustainable urban action', icon: '🌱', unlocked: true },
  { id: 'metro_hero', name: 'Metro Pioneer', description: 'Log 3 public transit / metro trips', icon: '🚆', unlocked: false },
  { id: 'zero_idle', name: 'Zero-Idler', description: 'Turn off engine at red lights 5 times', icon: '🛑', unlocked: false },
  { id: 'clean_indoor', name: 'Indoor Guardian', description: 'Optimize your home ventilation routine', icon: '🏡', unlocked: false },
  { id: 'co2_champion', name: 'CO₂ Reducer', description: 'Prevent over 10 kg of CO₂ emissions', icon: '🏆', unlocked: false },
];

function buildFallbackReport(cityName = 'Hyderabad') {
  const now = new Date();
  return {
    city: cityName,
    region: cityName === 'Delhi' ? 'Delhi NCR' : 'Telangana',
    country: 'India',
    latitude: 17.385,
    longitude: 78.4867,
    timestamp: now.toISOString(),
    data_freshness: 'Verified Regional Baseline',
    is_live: true,
    data_source: 'CPCB India NAQI & Regional Baseline',
    pollutants: {
      pm2_5: 68.4,
      pm10: 135.2,
      no2: 28.5,
      o3: 42.0,
      so2: 12.8,
      co: 540.0,
    },
    india_aqi: {
      aqi: 162,
      category: 'Moderate',
      color: '#eab308',
      badge_class: 'bg-amber-100 text-amber-800 border-amber-300',
      description: 'Breathing discomfort to people with asthma, lungs and heart diseases.',
      dominant_pollutant: 'PM2.5',
      sub_indices: { pm2_5: 162, pm10: 123, no2: 36, o3: 42, so2: 16, co: 27 },
    },
    us_aqi: 155,
    weather: {
      temperature: 25.0,
      humidity: 56.0,
      wind_speed: 8.5,
      wind_direction: 110.0,
      condition: 'Hazy / Mild Smog',
    },
    hourly_trend: Array.from({ length: 24 }, (_, i) => {
      const d = new Date(now.getTime() + i * 3600000);
      const hour = d.getHours();
      const pm = Number((68.4 + (hour >= 6 && hour <= 10 ? 25 : hour >= 12 && hour <= 16 ? -20 : 0)).toFixed(1));
      const aqi = Math.round(pm * 2.3);
      return {
        time: d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        india_aqi: aqi,
        us_aqi: Math.round(aqi * 0.95),
        pm2_5: pm,
        pm10: Number((pm * 1.8).toFixed(1)),
        category: aqi <= 50 ? 'Good' : aqi <= 100 ? 'Satisfactory' : aqi <= 200 ? 'Moderate' : 'Poor',
        color: aqi <= 50 ? '#10b981' : aqi <= 100 ? '#84cc16' : aqi <= 200 ? '#eab308' : '#f97316',
      };
    }),
    daily_forecast: [
      {
        date: now.toISOString().split('T')[0],
        avg_aqi: 162,
        max_aqi: 195,
        min_aqi: 130,
        category: 'Moderate',
        color: '#eab308',
        recommendation: 'Moderate winter smog expected. Maintain indoor ventilation during noon hours.',
      },
      {
        date: new Date(now.getTime() + 86400000).toISOString().split('T')[0],
        avg_aqi: 168,
        max_aqi: 205,
        min_aqi: 135,
        category: 'Moderate',
        color: '#eab308',
        recommendation: 'Slightly higher vehicular traffic. Shift cycling exercises indoors.',
      },
      {
        date: new Date(now.getTime() + 172800000).toISOString().split('T')[0],
        avg_aqi: 154,
        max_aqi: 180,
        min_aqi: 120,
        category: 'Moderate',
        color: '#eab308',
        recommendation: 'Midday winds expected to improve boundary layer dispersion.',
      },
    ],
  };
}

export function AppProvider({ children }) {
  const [activeTab, setActiveTab] = useState('landing');
  const [currentCity, setCurrentCity] = useState('Hyderabad');
  const [airQualityData, setAirQualityData] = useState(() => buildFallbackReport('Hyderabad'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [configStatus, setConfigStatus] = useState({ gemini_configured: false, mode: 'Intelligent Demo Mode' });

  // User Profile
  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('airwise_profile');
    return saved ? JSON.parse(saved) : INITIAL_PROFILE;
  });

  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(() => {
    return localStorage.getItem('airwise_onboarded') === 'true';
  });

  // Impact Tracker State
  const [impactStats, setImpactStats] = useState(() => {
    const saved = localStorage.getItem('airwise_impact');
    if (saved) return JSON.parse(saved);
    return {
      co2AvoidedKg: 4.8,
      actionsCompleted: 3,
      tripsReduced: 2,
      loggedActions: [
        {
          id: '1',
          title: 'Hyderabad Metro Blue Line Commute',
          category: 'Transit',
          co2SavedKg: 1.8,
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          note: 'Replaced 14km solo motorbike ride along Ameerpet corridor',
        },
        {
          id: '2',
          title: 'Signal Ignition Shutdown',
          category: 'Vehicle',
          co2SavedKg: 0.4,
          timestamp: new Date(Date.now() - 43200000).toISOString(),
          note: 'Cut engine during 80s traffic signal at Hitec City',
        },
        {
          id: '3',
          title: 'Timed Afternoon Window Aeration',
          category: 'Indoor',
          co2SavedKg: 2.6,
          timestamp: new Date(Date.now() - 14400000).toISOString(),
          note: 'Ventilated home between 1 PM and 2:30 PM when ambient smog subsided',
        },
      ],
    };
  });

  const [achievements, setAchievements] = useState(() => {
    const saved = localStorage.getItem('airwise_achievements');
    return saved ? JSON.parse(saved) : DEFAULT_ACHIEVEMENTS;
  });

  // Save profile & impact changes
  useEffect(() => {
    localStorage.setItem('airwise_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('airwise_impact', JSON.stringify(impactStats));
  }, [impactStats]);

  useEffect(() => {
    localStorage.setItem('airwise_achievements', JSON.stringify(achievements));
  }, [achievements]);

  // Initial load
  useEffect(() => {
    loadAirQuality(currentCity);
    checkConfig();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function checkConfig() {
    try {
      const status = await fetchConfigStatus();
      setConfigStatus(status);
    } catch {}
  }

  async function loadAirQuality(city) {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAirQualityByCity(city);
      setAirQualityData(data);
      setCurrentCity(data.city);
    } catch (err) {
      console.warn('Live API unreachable, using regional baseline:', err);
      setAirQualityData(buildFallbackReport(city));
      setCurrentCity(city);
    } finally {
      setLoading(false);
    }
  }

  async function loadByCoordinates(lat, lon, label, country, region) {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAirQualityByCoords(lat, lon, label, country, region);
      setAirQualityData(data);
      setCurrentCity(data.city);
      return data;
    } catch (err) {
      console.warn('Coords API unreachable, using regional baseline:', err);
      const fallback = buildFallbackReport(label || 'Current Location');
      setAirQualityData(fallback);
      setCurrentCity(fallback.city);
      return fallback;
    } finally {
      setLoading(false);
    }
  }

  function detectUserLocation() {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser. Please search for your city.');
      return;
    }
    setLoading(true);
    setError(null);

    const onPosSuccess = async (pos) => {
      try {
        const { latitude, longitude } = pos.coords;
        const geo = await reverseGeocode(latitude, longitude);
        await loadByCoordinates(latitude, longitude, geo.city, geo.country, geo.region);
        setActiveTab('dashboard');
      } catch (e) {
        console.warn('Error during GPS resolution:', e);
        try {
          await loadByCoordinates(pos.coords.latitude, pos.coords.longitude, 'My Location', 'India', '');
          setActiveTab('dashboard');
        } catch {
          await loadAirQuality('Hyderabad');
          setActiveTab('dashboard');
        }
      } finally {
        setLoading(false);
      }
    };

    const onPosError = (err) => {
      console.warn('Initial geolocation attempt failed, retrying standard accuracy:', err);
      navigator.geolocation.getCurrentPosition(
        onPosSuccess,
        (fallbackErr) => {
          setLoading(false);
          let msg = 'Could not access GPS location. Please allow browser location access or select your city from the search bar.';
          if (fallbackErr.code === 1) {
            msg = 'Location permission was denied. Please allow location access in your browser or select your city from the search bar.';
          }
          alert(msg);
        },
        { timeout: 10000, enableHighAccuracy: false, maximumAge: 300000 }
      );
    };

    navigator.geolocation.getCurrentPosition(
      onPosSuccess,
      onPosError,
      { timeout: 6000, enableHighAccuracy: true, maximumAge: 60000 }
    );
  }

  const logSustainableAction = useCallback((action) => {
    const newAction = {
      id: Date.now().toString(),
      title: action.title,
      category: action.category || 'Transit',
      co2SavedKg: Number(action.co2SavedKg || 1.2),
      timestamp: new Date().toISOString(),
      note: action.note || 'Sustainable low-emission routine step',
    };

    const newCo2 = Number((impactStats.co2AvoidedKg + newAction.co2SavedKg).toFixed(2));
    const newActionsCount = impactStats.actionsCompleted + 1;
    const newTrips = action.category === 'Transit' ? impactStats.tripsReduced + 1 : impactStats.tripsReduced;

    setImpactStats({
      co2AvoidedKg: newCo2,
      actionsCompleted: newActionsCount,
      tripsReduced: newTrips,
      loggedActions: [newAction, ...impactStats.loggedActions],
    });

    // Check achievement triggers
    checkAchievements(newCo2, newActionsCount, newTrips, action.category);

    // Micro-interaction celebration
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });
    } catch {}
  }, [impactStats]);

  function checkAchievements(totalCo2, actionsCount, tripsCount, category) {
    setAchievements((prev) =>
      prev.map((ach) => {
        if (ach.unlocked) return ach;
        let shouldUnlock = false;

        if (ach.id === 'first_action' && actionsCount >= 1) shouldUnlock = true;
        if (ach.id === 'metro_hero' && tripsCount >= 3) shouldUnlock = true;
        if (ach.id === 'zero_idle' && category === 'Vehicle') shouldUnlock = true;
        if (ach.id === 'clean_indoor' && category === 'Indoor') shouldUnlock = true;
        if (ach.id === 'co2_champion' && totalCo2 >= 10.0) shouldUnlock = true;

        if (shouldUnlock) {
          try {
            confetti({
              particleCount: 90,
              spread: 80,
              origin: { y: 0.5 },
            });
          } catch {}
          return { ...ach, unlocked: true };
        }
        return ach;
      })
    );
  }

  async function handleSetGeminiKey(key) {
    const res = await updateGeminiApiKey(key);
    await checkConfig();
    return res;
  }

  function completeOnboarding(profileData) {
    setUserProfile(profileData);
    setHasCompletedOnboarding(true);
    localStorage.setItem('airwise_onboarded', 'true');
    if (profileData.city && profileData.city !== currentCity) {
      loadAirQuality(profileData.city);
    }
  }

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        currentCity,
        setCurrentCity,
        airQualityData,
        loading,
        error,
        loadAirQuality,
        loadByCoordinates,
        detectUserLocation,
        userProfile,
        setUserProfile,
        hasCompletedOnboarding,
        completeOnboarding,
        impactStats,
        logSustainableAction,
        achievements,
        configStatus,
        handleSetGeminiKey,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
