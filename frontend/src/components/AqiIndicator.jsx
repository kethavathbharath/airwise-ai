import React from 'react';
import { AlertTriangle, ShieldCheck, ShieldAlert, Info } from 'lucide-react';

const SCALE_SEGMENTS = [
  { label: 'Good', range: '0-50', color: '#10b981', min: 0, max: 50 },
  { label: 'Satisfactory', range: '51-100', color: '#84cc16', min: 51, max: 100 },
  { label: 'Moderate', range: '101-200', color: '#eab308', min: 101, max: 200 },
  { label: 'Poor', range: '201-300', color: '#f97316', min: 201, max: 300 },
  { label: 'Very Poor', range: '301-400', color: '#ef4444', min: 301, max: 400 },
  { label: 'Severe', range: '401-500+', color: '#881337', min: 401, max: 500 },
];

export default function AqiIndicator({ aqiInfo, usAqi }) {
  if (!aqiInfo) return null;

  const aqiVal = aqiInfo.aqi || 0;
  // Calculate percentage along 0-500 scale for marker position
  const percentage = Math.min(100, Math.max(0, (aqiVal / 500) * 100));

  const isSevere = aqiVal > 200;
  const isModerate = aqiVal > 100 && aqiVal <= 200;

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-slate-200/90 relative overflow-hidden">
      {/* Background soft glow based on category color */}
      <div
        className="absolute -right-16 -top-16 w-56 h-56 rounded-full blur-3xl opacity-15 pointer-events-none"
        style={{ backgroundColor: aqiInfo.color }}
      />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              National Air Quality Index (NAQI)
            </span>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              India CPCB Standard
            </span>
          </div>

          <div className="flex items-baseline space-x-3 mt-1.5">
            <span className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900">
              {aqiVal}
            </span>
            <div>
              <span
                className="inline-flex items-center px-3 py-1 rounded-full text-xs sm:text-sm font-bold border"
                style={{
                  backgroundColor: `${aqiInfo.color}18`,
                  color: aqiInfo.color === '#10b981' ? '#065f46' : aqiInfo.color,
                  borderColor: `${aqiInfo.color}50`,
                }}
              >
                {aqiInfo.category}
              </span>
              {usAqi && (
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  US EPA AQI: <strong className="text-slate-600">{usAqi}</strong>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Dominant Pollutant & Status Pill */}
        <div className="flex md:flex-col items-start md:items-end justify-between border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
          <div className="text-left md:text-right">
            <span className="text-[11px] text-slate-400 block font-medium">Dominant Pollutant</span>
            <span className="font-extrabold text-slate-800 text-sm bg-slate-100 px-2.5 py-0.5 rounded-md inline-block mt-0.5">
              {aqiInfo.dominant_pollutant || 'PM2.5'}
            </span>
          </div>
          <div className="text-left md:text-right mt-1">
            <span className="text-[11px] text-slate-500 max-w-[240px] block leading-tight">
              {aqiInfo.description}
            </span>
          </div>
        </div>
      </div>

      {/* 6-Tier Indian Scale Spectrum Bar */}
      <div className="space-y-1.5 mt-2">
        <div className="relative h-3 w-full rounded-full overflow-visible bg-slate-100 flex">
          {SCALE_SEGMENTS.map((seg, i) => (
            <div
              key={i}
              className="h-full flex-1 first:rounded-l-full last:rounded-r-full transition-opacity"
              style={{ backgroundColor: seg.color }}
              title={`${seg.label} (${seg.range})`}
            />
          ))}

          {/* Current Marker Needle */}
          <div
            className="absolute -top-1 -bottom-1 w-2.5 bg-slate-900 border-2 border-white rounded-full shadow-md transition-all duration-700"
            style={{ left: `calc(${percentage}% - 5px)` }}
          />
        </div>

        {/* Labels below bar */}
        <div className="grid grid-cols-6 text-[10px] font-semibold text-slate-500 pt-1 text-center">
          {SCALE_SEGMENTS.map((seg, i) => (
            <span key={i} className="truncate">
              {seg.label}
            </span>
          ))}
        </div>
      </div>

      {/* Safety alert message */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-start space-x-2.5 text-xs">
        {isSevere ? (
          <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
        ) : isModerate ? (
          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
        ) : (
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        )}
        <p className="text-slate-600 leading-relaxed">
          {isSevere ? (
            <span className="text-rose-700 font-semibold">
              High particulate alert: Avoid strenuous outdoor exertion. Mask with an N95 if commuting, and keep indoor purifiers active.
            </span>
          ) : isModerate ? (
            <span className="text-amber-800 font-medium">
              Sensitive individuals may experience airway tightness. Schedule outdoor exercise around midday (12-3 PM).
            </span>
          ) : (
            <span className="text-emerald-800 font-medium">
              Clean ambient air: Safe for open window ventilation and all outdoor sports activities.
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
