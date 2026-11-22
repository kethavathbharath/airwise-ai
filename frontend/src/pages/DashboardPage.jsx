import React, { useState } from 'react';
import {
  MapPin,
  RefreshCw,
  Navigation,
  Thermometer,
  Droplets,
  Wind,
  Compass,
  Calendar,
  Clock,
  AlertCircle,
  Bot,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { useApp } from '../context/AppContext';
import AqiIndicator from '../components/AqiIndicator';
import PollutantCard from '../components/PollutantCard';

export default function DashboardPage() {
  const {
    currentCity,
    airQualityData,
    loading,
    error,
    loadAirQuality,
    detectUserLocation,
    setActiveTab,
  } = useApp();

  const [activePollutantChart, setActivePollutantChart] = useState('india_aqi');

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold text-slate-600 animate-pulse">
          Fetching real-time atmospheric data for {currentCity}...
        </p>
      </div>
    );
  }

  if (error && !airQualityData) {
    return (
      <div className="max-w-xl mx-auto my-12 bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center space-y-4">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
        <h3 className="font-bold text-slate-900 text-lg">Unable to Load Air Quality</h3>
        <p className="text-xs text-rose-700">{error}</p>
        <button
          onClick={() => loadAirQuality('Hyderabad')}
          className="px-4 py-2 bg-rose-600 text-white rounded-lg text-xs font-semibold hover:bg-rose-700"
        >
          Load Hyderabad Baseline
        </button>
      </div>
    );
  }

  const pollutants = airQualityData?.pollutants;
  const aqiInfo = airQualityData?.india_aqi;
  const weather = airQualityData?.weather;
  const hourly = airQualityData?.hourly_trend || [];
  const daily = airQualityData?.daily_forecast || [];

  // Format hourly chart data
  const chartData = hourly.map((item) => {
    const timeLabel = item.time.includes('T') ? item.time.split('T')[1].slice(0, 5) : item.time;
    return {
      time: timeLabel,
      india_aqi: item.india_aqi,
      pm2_5: item.pm2_5,
      pm10: item.pm10,
      category: item.category,
      color: item.color,
    };
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Top Header & Location Meta */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
              <MapPin className="w-4 h-4" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {airQualityData?.city || currentCity}
            </h1>
            {airQualityData?.region && (
              <span className="text-xs sm:text-sm font-semibold text-slate-500">
                • {airQualityData.region}, {airQualityData.country || 'India'}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500">
            <span className="flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Updated: {airQualityData?.timestamp ? new Date(airQualityData.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Live'}</span>
            </span>
            <span className="text-slate-300">•</span>
            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>{airQualityData?.data_freshness || 'Verified Live Feed'}</span>
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-[11px] text-slate-400">{airQualityData?.data_source}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => detectUserLocation()}
            className="flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-2xs transition-colors"
          >
            <Navigation className="w-3.5 h-3.5 text-emerald-600" />
            <span>Use My Location</span>
          </button>

          <button
            onClick={() => loadAirQuality(currentCity)}
            className="p-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-2xs transition-colors"
            title="Refresh air data"
          >
            <RefreshCw className="w-4 h-4 text-slate-500" />
          </button>
        </div>
      </div>

      {/* Main AQI Indicator & Weather Summary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AqiIndicator aqiInfo={aqiInfo} usAqi={airQualityData?.us_aqi} />
        </div>

        {/* Weather & Atmospheric Conditions Card */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-slate-200/90 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Weather & Boundary Layer
              </span>
              <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-md">
                {weather?.condition || 'Smoggy'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Thermometer className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">Temperature</span>
                  <span className="font-extrabold text-slate-800 text-base">
                    {weather?.temperature !== null ? `${weather.temperature}°C` : '–'}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
                  <Droplets className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">Humidity</span>
                  <span className="font-extrabold text-slate-800 text-base">
                    {weather?.humidity !== null ? `${weather.humidity}%` : '–'}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                  <Wind className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">Wind Speed</span>
                  <span className="font-extrabold text-slate-800 text-base">
                    {weather?.wind_speed !== null ? `${weather.wind_speed} km/h` : '–'}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">Wind Direction</span>
                  <span className="font-extrabold text-slate-800 text-base">
                    {weather?.wind_direction !== null ? `${weather.wind_direction}°` : '–'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick AI Trigger Banner */}
          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bot className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-semibold text-slate-700">Need personal precautions?</span>
            </div>
            <button
              onClick={() => setActiveTab('assistant')}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center space-x-1"
            >
              <span>Ask AI →</span>
            </button>
          </div>
        </div>
      </div>

      {/* 6 Key Pollutants Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Key Pollutants Breakdown</h2>
            <p className="text-xs text-slate-500">
              Concentrations measured against Central Pollution Control Board (CPCB) ambient safety thresholds
            </p>
          </div>
          <button
            onClick={() => setActiveTab('education')}
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
          >
            Pollutant Guide →
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          <PollutantCard code="pm2_5" value={pollutants?.pm2_5} />
          <PollutantCard code="pm10" value={pollutants?.pm10} />
          <PollutantCard code="no2" value={pollutants?.no2} />
          <PollutantCard code="o3" value={pollutants?.o3} />
          <PollutantCard code="so2" value={pollutants?.so2} />
          <PollutantCard code="co" value={pollutants?.co} />
        </div>
      </div>

      {/* 24-Hour Hourly Trend Chart */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-slate-200/90">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <h3 className="text-base font-bold text-slate-900">24-Hour Air Quality Progression</h3>
            <p className="text-xs text-slate-500">
              Hourly trajectory showing diurnal inversion patterns (peaks during morning rush, lowest at noon)
            </p>
          </div>

          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setActivePollutantChart('india_aqi')}
              className={`px-3 py-1 rounded-md transition-all ${
                activePollutantChart === 'india_aqi' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Indian AQI
            </button>
            <button
              onClick={() => setActivePollutantChart('pm2_5')}
              className={`px-3 py-1 rounded-md transition-all ${
                activePollutantChart === 'pm2_5' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              PM2.5
            </button>
            <button
              onClick={() => setActivePollutantChart('pm10')}
              className={`px-3 py-1 rounded-md transition-all ${
                activePollutantChart === 'pm10' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              PM10
            </button>
          </div>
        </div>

        {chartData.length > 0 ? (
          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="aqiGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="pmGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white p-2.5 rounded-lg text-xs shadow-xl space-y-1">
                          <p className="font-semibold text-slate-300">Time: {label}</p>
                          <p className="font-bold text-sm text-emerald-400">
                            AQI: {data.india_aqi} ({data.category})
                          </p>
                          <p className="text-[11px] text-slate-300">
                            PM2.5: {data.pm2_5} µg/m³ | PM10: {data.pm10} µg/m³
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey={activePollutantChart}
                  stroke={activePollutantChart === 'india_aqi' ? '#10b981' : '#f59e0b'}
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill={`url(#${activePollutantChart === 'india_aqi' ? 'aqiGradient' : 'pmGradient'})`}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-48 flex items-center justify-center text-xs text-slate-400">
            Hourly timeline data loading...
          </div>
        )}
      </div>

      {/* 3-Day Daily Forecast Cards */}
      <div>
        <div className="mb-4">
          <h2 className="text-lg font-bold text-slate-900">3-Day Air Quality Outlook</h2>
          <p className="text-xs text-slate-500">
            Forecasted trends to help you plan outdoor sports, grocery runs, and child activities
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {daily.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                  <div className="flex items-center space-x-1.5">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span className="font-bold text-sm text-slate-800">
                      {idx === 0 ? 'Today' : idx === 1 ? 'Tomorrow' : new Date(item.date).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <span
                    className="px-2 py-0.5 rounded-full text-xs font-bold"
                    style={{
                      backgroundColor: `${item.color}20`,
                      color: item.color === '#10b981' ? '#065f46' : item.color,
                    }}
                  >
                    {item.category}
                  </span>
                </div>

                <div className="my-3 flex items-baseline justify-between">
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Avg AQI</span>
                    <span className="text-2xl font-black text-slate-900">{item.avg_aqi}</span>
                  </div>
                  <div className="text-right text-xs text-slate-500">
                    <span>Range: </span>
                    <strong className="text-slate-800">{item.min_aqi} – {item.max_aqi}</strong>
                  </div>
                </div>

                <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 leading-relaxed">
                  {item.recommendation}
                </p>
              </div>

              <button
                onClick={() => setActiveTab('lifestyle')}
                className="mt-4 text-xs font-bold text-emerald-600 hover:text-emerald-700 text-left"
              >
                Plan routine for this day →
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
