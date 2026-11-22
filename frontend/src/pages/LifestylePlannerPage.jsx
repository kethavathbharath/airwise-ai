import React, { useState, useEffect } from 'react';
import {
  Compass,
  Sun,
  Sunset,
  Moon,
  CheckCircle2,
  Leaf,
  Clock,
  Bus,
  Train,
  Bike,
  Car,
  Zap,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { fetchDailyPlan } from '../services/api';

export default function LifestylePlannerPage() {
  const {
    currentCity,
    airQualityData,
    userProfile,
    logSustainableAction,
    setActiveTab,
  } = useApp();

  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [completedSteps, setCompletedSteps] = useState({});

  // Transit Calculator State
  const [commuteDistanceKm, setCommuteDistanceKm] = useState(12);
  const [currentMode, setCurrentMode] = useState('bike');

  const outdoorAqi = airQualityData?.india_aqi?.aqi || 165;

  useEffect(() => {
    loadPlan();
  }, [currentCity, outdoorAqi, userProfile]);

  async function loadPlan() {
    setLoading(true);
    try {
      const res = await fetchDailyPlan(currentCity, outdoorAqi, userProfile);
      setPlan(res);
    } catch (err) {
      console.error('Error fetching plan:', err);
    } finally {
      setLoading(false);
    }
  }

  function handleCompleteAction(slotTitle, action) {
    if (completedSteps[action.title]) return;

    setCompletedSteps((prev) => ({ ...prev, [action.title]: true }));

    // Extract CO2 savings or default to 1.2 kg
    logSustainableAction({
      title: action.title,
      category: action.category || 'Transit',
      co2SavedKg: 1.2,
      note: action.action,
    });
  }

  // Emission comparison metrics per km (average Indian urban traffic values)
  // Petrol Bike: ~45g CO2/km; Petrol Car: ~140g CO2/km; Electric Metro: ~15g CO2/km; City Bus: ~25g CO2/km
  const bikeCo2 = (commuteDistanceKm * 0.045).toFixed(2);
  const carCo2 = (commuteDistanceKm * 0.14).toFixed(2);
  const metroCo2 = (commuteDistanceKm * 0.015).toFixed(2);
  const busCo2 = (commuteDistanceKm * 0.025).toFixed(2);

  const savedByMetro = (
    (currentMode === 'bike' ? bikeCo2 - metroCo2 : carCo2 - metroCo2)
  ).toFixed(2);

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner */}
      <div className="border-b border-slate-200 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-amber-100 text-amber-700">
              <Compass className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Smart Low-Emission Routine Planner
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            A synchronized morning, afternoon, and evening routine engineered to minimize your family’s smog exposure
            while slashing personal urban emissions.
          </p>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 px-4 py-2.5 rounded-xl flex items-center space-x-3">
          <Leaf className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
              Estimated Daily Reduction
            </span>
            <span className="font-extrabold text-slate-900 text-sm">
              ~{plan?.estimated_daily_co2_reduction_kg || 2.5} kg CO₂ / day
            </span>
          </div>
        </div>
      </div>

      {/* Routine Sections */}
      {plan && (
        <div className="space-y-6">
          {/* Morning Block */}
          <RoutineSection
            title="Morning Window: Inversion Defense & Commute"
            icon={Sun}
            color="amber"
            actions={plan.morning}
            completedSteps={completedSteps}
            onComplete={handleCompleteAction}
          />

          {/* Afternoon Block */}
          <RoutineSection
            title="Afternoon Window: Optimal Ventilation & Efficiency"
            icon={Sunset}
            color="teal"
            actions={plan.afternoon}
            completedSteps={completedSteps}
            onComplete={handleCompleteAction}
          />

          {/* Evening Block */}
          <RoutineSection
            title="Evening Window: Trip Chaining & Indoor Sanctuary"
            icon={Moon}
            color="indigo"
            actions={plan.evening}
            completedSteps={completedSteps}
            onComplete={handleCompleteAction}
          />
        </div>
      )}

      {/* Eco-Transit Modal Swap Calculator */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
        <div className="flex items-center space-x-2.5 mb-2">
          <Zap className="w-5 h-5 text-emerald-600" />
          <h2 className="text-lg font-bold text-slate-900">
            Commute Modal Shift Calculator
          </h2>
        </div>
        <p className="text-xs text-slate-500 mb-6">
          Calculate how much CO₂ and tailpipe particulate pollution you avoid by switching to metro or bus
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Controls */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>Daily Roundtrip Distance:</span>
                <span className="text-emerald-700">{commuteDistanceKm} km</span>
              </div>
              <input
                type="range"
                min="2"
                max="60"
                step="2"
                value={commuteDistanceKm}
                onChange={(e) => setCommuteDistanceKm(Number(e.target.value))}
                className="w-full accent-emerald-600"
              />
            </div>

            <div>
              <span className="block text-xs font-bold text-slate-700 mb-1.5">
                Current Solo Vehicle
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentMode('bike')}
                  className={`flex items-center justify-center space-x-1.5 py-2 px-3 text-xs rounded-lg font-semibold border ${
                    currentMode === 'bike' ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-600'
                  }`}
                >
                  <Bike className="w-4 h-4" />
                  <span>Two-Wheeler</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentMode('car')}
                  className={`flex items-center justify-center space-x-1.5 py-2 px-3 text-xs rounded-lg font-semibold border ${
                    currentMode === 'car' ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-600'
                  }`}
                >
                  <Car className="w-4 h-4" />
                  <span>Solo Car</span>
                </button>
              </div>
            </div>
          </div>

          {/* Mode Comparison Grid */}
          <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
              <Car className="w-5 h-5 text-slate-500 mx-auto mb-1" />
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Solo Car</span>
              <span className="text-lg font-black text-slate-800">{carCo2} kg</span>
              <span className="text-[10px] text-slate-400 block">CO₂ emitted</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
              <Bike className="w-5 h-5 text-slate-500 mx-auto mb-1" />
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Two-Wheeler</span>
              <span className="text-lg font-black text-slate-800">{bikeCo2} kg</span>
              <span className="text-[10px] text-slate-400 block">CO₂ emitted</span>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-300 text-center">
              <Train className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
              <span className="text-[10px] text-emerald-800 font-bold uppercase block">Metro Rail</span>
              <span className="text-lg font-black text-emerald-700">{metroCo2} kg</span>
              <span className="text-[10px] text-emerald-600 block">75% cleaner</span>
            </div>

            <div className="p-3 bg-teal-50 rounded-xl border border-teal-300 text-center">
              <Bus className="w-5 h-5 text-teal-600 mx-auto mb-1" />
              <span className="text-[10px] text-teal-800 font-bold uppercase block">City Bus</span>
              <span className="text-lg font-black text-teal-700">{busCo2} kg</span>
              <span className="text-[10px] text-teal-600 block">Shared footprint</span>
            </div>
          </div>
        </div>

        {/* Action result banner */}
        <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs text-emerald-200 font-bold block">Annual Environmental Impact of Switching:</span>
            <p className="font-extrabold text-sm sm:text-base">
              Switching your {commuteDistanceKm}km commute to Metro saves{' '}
              <span className="underline decoration-white font-black">{(savedByMetro * 250).toFixed(0)} kg of CO₂</span> / year!
            </p>
          </div>
          <button
            onClick={() => {
              logSustainableAction({
                title: `${commuteDistanceKm}km Metro Transit Commute`,
                category: 'Transit',
                co2SavedKg: Number(savedByMetro) || 1.2,
                note: `Replaced solo ${currentMode} travel`,
              });
              setActiveTab('impact');
            }}
            className="px-4 py-2 bg-white text-emerald-800 rounded-lg text-xs font-extrabold hover:bg-emerald-50 transition-all shrink-0 cursor-pointer"
          >
            Log This Commute Action →
          </button>
        </div>
      </div>
    </div>
  );
}

function RoutineSection({ title, icon: Icon, color, actions, completedSteps, onComplete }) {
  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-xs">
      <div className="flex items-center space-x-2.5 pb-3 border-b border-slate-100">
        <Icon className={`w-5 h-5 text-${color}-600`} />
        <h3 className="font-extrabold text-slate-900 text-base">{title}</h3>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {actions.map((act, i) => {
          const isDone = completedSteps[act.title];
          return (
            <div
              key={i}
              className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                isDone
                  ? 'bg-emerald-50/60 border-emerald-300'
                  : 'bg-slate-50/70 border-slate-200/80 hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-[11px] mb-1.5">
                  <span className="font-bold text-slate-500 flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{act.time_slot}</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-white border border-slate-200 text-slate-600">
                    {act.difficulty}
                  </span>
                </div>

                <h4 className="font-extrabold text-slate-900 text-sm mb-1.5">
                  {act.title}
                </h4>

                <p className="text-xs text-slate-700 leading-relaxed mb-3">
                  {act.action}
                </p>

                <div className="space-y-1 text-[11px] text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200/70">
                  <p>
                    <strong className="text-slate-800">Why it matters:</strong> {act.why_it_matters}
                  </p>
                  <p className="text-emerald-700 font-medium">
                    <strong>Environmental benefit:</strong> {act.environmental_benefit}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  {act.category}
                </span>

                <button
                  type="button"
                  onClick={() => onComplete(title, act)}
                  disabled={isDone}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                    isDone
                      ? 'bg-emerald-600 text-white cursor-default'
                      : 'bg-white border border-slate-300 text-slate-700 hover:border-emerald-500 hover:text-emerald-700'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isDone ? 'Completed & Logged' : 'Mark as Done'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
