import React, { useState, useEffect } from 'react';
import {
  Home,
  Wind,
  Fan,
  Flame,
  Sparkles,
  CheckCircle2,
  Sliders,
  Flower2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { fetchIndoorAdvice } from '../services/api';

export default function IndoorAdvisorPage() {
  const { currentCity, airQualityData, userProfile, setUserProfile } = useApp();

  const [homeSize, setHomeSize] = useState(userProfile?.home_size || '2 BHK (800-1200 sq ft)');
  const [occupants, setOccupants] = useState(userProfile?.occupants || 3);
  const [ventilationType, setVentilationType] = useState(userProfile?.ventilation_type || 'Natural Windows & Balcony');
  const [hasPurifier, setHasPurifier] = useState(userProfile?.has_purifier || false);

  const [advice, setAdvice] = useState(null);
  const [loading, setLoading] = useState(false);

  const outdoorAqi = airQualityData?.india_aqi?.aqi || 165;

  useEffect(() => {
    loadAdvice();
  }, [homeSize, occupants, ventilationType, hasPurifier, outdoorAqi]);

  async function loadAdvice() {
    setLoading(true);
    try {
      const res = await fetchIndoorAdvice(homeSize, occupants, ventilationType, hasPurifier, outdoorAqi);
      setAdvice(res);
    } catch (err) {
      console.error('Error fetching indoor guidance:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Title */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center space-x-2">
          <span className="p-1.5 rounded-lg bg-cyan-100 text-cyan-700">
            <Home className="w-5 h-5" />
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Indoor Air Quality Sanctuary Advisor
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
          During winter inversions, indoor PM2.5 can reach 70% of street levels without active protection.
          Configure your living setup below for calibrated ventilation and filtration protocols.
        </p>
      </div>

      {/* Dynamic Home Configurator */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-xs">
        <div className="flex items-center space-x-2 mb-4 pb-2 border-b border-slate-100">
          <Sliders className="w-4 h-4 text-emerald-600" />
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Your Household Configuration
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Home Size / Layout</label>
            <select
              value={homeSize}
              onChange={(e) => setHomeSize(e.target.value)}
              className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            >
              <option value="1 BHK (<600 sq ft)">1 BHK (&lt;600 sq ft)</option>
              <option value="2 BHK (800-1200 sq ft)">2 BHK (800-1200 sq ft)</option>
              <option value="3 BHK (1400-2000 sq ft)">3 BHK (1400-2000 sq ft)</option>
              <option value="Independent Villa / House">Independent Villa / House</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Number of Residents</label>
            <input
              type="number"
              min="1"
              max="12"
              value={occupants}
              onChange={(e) => setOccupants(Math.max(1, Number(e.target.value)))}
              className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Ventilation Structure</label>
            <select
              value={ventilationType}
              onChange={(e) => setVentilationType(e.target.value)}
              className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            >
              <option value="Natural Windows & Balcony">Natural Windows & Balcony</option>
              <option value="Sealed Central AC with Filters">Sealed Central AC with Filters</option>
              <option value="Single Sided Windows">Single Sided Windows</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Own an Air Purifier?</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setHasPurifier(true)}
                className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                  hasPurifier ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => setHasPurifier(false)}
                className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                  !hasPurifier ? 'bg-slate-800 text-white border-slate-800' : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}
              >
                No
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Guidance Cards Grid */}
      {advice && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card 1: Ventilation Schedule */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
                <Wind className="w-5 h-5 text-cyan-600" />
                <h3 className="font-extrabold text-slate-900 text-base">Outdoor-Correlated Ventilation</h3>
              </div>

              <div className="mt-4 p-4 rounded-xl bg-cyan-50/70 border border-cyan-200/80">
                <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-800 block">
                  Current Status
                </span>
                <span className="font-black text-slate-900 text-lg block mt-0.5">
                  {advice.ventilation_status}
                </span>
                <p className="text-xs text-slate-700 mt-2 leading-relaxed">
                  {advice.ventilation_timing}
                </p>
              </div>

              <div className="mt-4 space-y-2 text-xs text-slate-600">
                <div className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Morning Inversion (6–9:30 AM):</strong> Strictly seal street-facing doors. Outdoor soot settles heavily at ground level.</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Solar Midday Window (1–3 PM):</strong> Warm ground air lifts pollution. Ideal time for a 15-minute cross-breeze flush.</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
              Correlated with {currentCity} outdoor AQI ({outdoorAqi})
            </div>
          </div>

          {/* Card 2: Purifier Sizing & CADR */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <Fan className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-extrabold text-slate-900 text-base">Air Purifier & CADR Sizing</h3>
                </div>
                <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full">
                  {hasPurifier ? 'Optimizing Setup' : 'Purchase Guide'}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                  <span className="text-[11px] text-slate-400 block font-medium">Recommended CADR</span>
                  <span className="text-xl font-extrabold text-slate-900">
                    {advice.purifier_advice.recommended_cadr_m3h} m³/h
                  </span>
                  <span className="text-[10px] text-slate-500 block">Clean Air Delivery Rate</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                  <span className="text-[11px] text-slate-400 block font-medium">Filter Standard</span>
                  <span className="text-xl font-extrabold text-emerald-700">True HEPA H13</span>
                  <span className="text-[10px] text-slate-500 block">99.97% capture &ge;0.3µm</span>
                </div>
              </div>

              <div className="mt-4 space-y-2 text-xs text-slate-600">
                <p><strong>Placement:</strong> {advice.purifier_advice.room_placement}</p>
                <p><strong>Running Mode:</strong> {advice.purifier_advice.operational_mode}</p>
                <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-200 text-amber-900">
                  <span className="font-bold block text-[11px]">Budget DIY Alternative:</span>
                  {advice.purifier_advice.diy_alternative}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
              Sized for {occupants} occupants in a {homeSize}
            </div>
          </div>

          {/* Card 3: Kitchen Safety & Tadka PM Spikes */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs">
            <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
              <Flame className="w-5 h-5 text-rose-500" />
              <h3 className="font-extrabold text-slate-900 text-base">Kitchen Ventilation & Cooking Safety</h3>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Deep frying and mustard/ghee tadka release ultrafine oil droplets, spiking indoor PM2.5 up to 500 µg/m³.
            </p>

            <ul className="mt-4 space-y-2 text-xs text-slate-700">
              {advice.kitchen_safety.map((tip, i) => (
                <li key={i} className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Card 4: Dust Control & Cleaning Techniques */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs">
            <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h3 className="font-extrabold text-slate-900 text-base">Dust Suppression & Wet Mopping</h3>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Traditional broom sweeping re-suspends settled toxic heavy metals and silica into breathing zones.
            </p>

            <ul className="mt-4 space-y-2 text-xs text-slate-700">
              {advice.dust_reduction_tips.map((tip, i) => (
                <li key={i} className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* The Truth About Houseplants Reality Check Section */}
      {advice?.indoor_plants_truth && (
        <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-white rounded-2xl p-6 sm:p-8 border border-emerald-200 shadow-sm">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
              <Flower2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg">
                {advice.indoor_plants_truth.title}
              </h3>
              <span className="text-xs font-semibold text-emerald-800">
                Evidence-Based Science vs Commercial Marketing
              </span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed max-w-3xl">
            {advice.indoor_plants_truth.fact}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-xs font-bold text-slate-600 self-center">Great for aesthetics & humidity:</span>
            {advice.indoor_plants_truth.suitable_plants.map((plant, i) => (
              <span key={i} className="px-3 py-1 bg-white border border-emerald-300 text-emerald-800 font-semibold text-xs rounded-full shadow-2xs">
                🌿 {plant}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Filter Maintenance Timeline */}
      {advice?.filter_maintenance && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs">
          <h3 className="font-extrabold text-slate-900 text-base mb-3">
            HEPA & Pre-Filter Maintenance Protocol
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {advice.filter_maintenance.map((m, i) => (
              <div key={i} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700">
                <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] font-bold flex items-center justify-center mb-2">
                  {i + 1}
                </span>
                <p className="leading-relaxed">{m}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
