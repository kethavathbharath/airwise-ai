import React from 'react';

const POLLUTANT_CONFIGS = {
  pm2_5: {
    name: 'PM2.5',
    fullName: 'Fine Particulate Matter',
    standard: 60, // CPCB 24-hr standard in ug/m3
    unit: 'µg/m³',
    description: 'Combustion particles, organic compounds, metals. Enters deep lungs & bloodstream.',
  },
  pm10: {
    name: 'PM10',
    fullName: 'Respirable Suspended Particulate',
    standard: 100, // CPCB 24-hr standard
    unit: 'µg/m³',
    description: 'Road dust, construction debris, pollen. Irritates eyes, throat, and nasal passages.',
  },
  no2: {
    name: 'NO₂',
    fullName: 'Nitrogen Dioxide',
    standard: 80, // CPCB standard
    unit: 'µg/m³',
    description: 'Vehicular exhaust & industrial fuel burning. Triggers asthma and lung inflammation.',
  },
  o3: {
    name: 'O₃',
    fullName: 'Ground-Level Ozone',
    standard: 100, // CPCB 8-hr standard
    unit: 'µg/m³',
    description: 'Formed when vehicular NOx reacts with volatile organic compounds under sunlight.',
  },
  so2: {
    name: 'SO₂',
    fullName: 'Sulphur Dioxide',
    standard: 80, // CPCB 24-hr standard
    unit: 'µg/m³',
    description: 'Emitted from thermal power plants and diesel engines. Can cause bronchospasm.',
  },
  co: {
    name: 'CO',
    fullName: 'Carbon Monoxide',
    standard: 2000, // in ug/m3 (2 mg/m3 CPCB 8-hr)
    unit: 'µg/m³',
    description: 'Colorless, odorless gas from incomplete combustion. Reduces blood oxygen carrying capacity.',
  },
};

export default function PollutantCard({ code, value }) {
  const config = POLLUTANT_CONFIGS[code] || {
    name: code.toUpperCase(),
    fullName: code,
    standard: 100,
    unit: 'µg/m³',
    description: 'Ambient air pollutant component.',
  };

  const val = value !== null && value !== undefined ? Number(value) : null;
  const ratio = val !== null ? Math.min(2.5, val / config.standard) : 0;
  const percentage = Math.min(100, Math.round((val / (config.standard * 2)) * 100));

  let statusColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
  let barColor = 'bg-emerald-500';
  let statusText = 'Normal';

  if (ratio > 2.0) {
    statusColor = 'text-rose-800 bg-rose-50 border-rose-200';
    barColor = 'bg-rose-600';
    statusText = 'Hazardous';
  } else if (ratio > 1.0) {
    statusColor = 'text-amber-800 bg-amber-50 border-amber-200';
    barColor = 'bg-amber-500';
    statusText = 'Elevated';
  } else if (ratio > 0.6) {
    statusColor = 'text-lime-800 bg-lime-50 border-lime-200';
    barColor = 'bg-lime-500';
    statusText = 'Moderate';
  }

  return (
    <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <span className="font-extrabold text-base text-slate-900 tracking-tight">{config.name}</span>
          <span className="text-[11px] text-slate-400 block truncate max-w-[140px]">{config.fullName}</span>
        </div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusColor}`}>
          {statusText}
        </span>
      </div>

      <div className="mt-3 flex items-baseline space-x-1.5">
        <span className="text-2xl font-bold text-slate-800">
          {val !== null ? val : '–'}
        </span>
        <span className="text-xs text-slate-500 font-medium">{config.unit}</span>
      </div>

      {/* Threshold comparison bar */}
      <div className="mt-2.5">
        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${barColor}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
          <span>Safe: &le;{config.standard}</span>
          <span>{percentage}% of limit</span>
        </div>
      </div>
    </div>
  );
}
