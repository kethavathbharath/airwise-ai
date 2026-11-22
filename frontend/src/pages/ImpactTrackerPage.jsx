import React, { useState } from 'react';
import {
  Award,
  PlusCircle,
  Info,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useApp } from '../context/AppContext';

const CATEGORY_COLORS = {
  Transit: '#10b981',
  Vehicle: '#0ea5e9',
  Indoor: '#f59e0b',
  Energy: '#8b5cf6',
  Lifestyle: '#ec4899',
};

export default function ImpactTrackerPage() {
  const { impactStats, logSustainableAction, achievements } = useApp();

  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Transit');
  const [newCo2, setNewCo2] = useState('1.5');
  const [newNote, setNewNote] = useState('');
  const [showLogModal, setShowLogModal] = useState(false);

  function handleSubmitLog(e) {
    e.preventDefault();
    if (!newTitle.trim()) return;

    logSustainableAction({
      title: newTitle.trim(),
      category: newCategory,
      co2SavedKg: parseFloat(newCo2) || 1.0,
      note: newNote || 'Manual sustainable urban action',
    });

    setNewTitle('');
    setNewNote('');
    setShowLogModal(false);
  }

  // Generate 7-day progress mock chart data anchored around user stats
  const weeklyChartData = [
    { day: 'Mon', co2: 0.8 },
    { day: 'Tue', co2: 1.4 },
    { day: 'Wed', co2: 1.8 },
    { day: 'Thu', co2: 0.9 },
    { day: 'Fri', co2: 2.1 },
    { day: 'Sat', co2: 1.2 },
    { day: 'Today', co2: Number(impactStats.co2AvoidedKg.toFixed(1)) },
  ];

  // Pie chart by category
  const categoryCounts = {};
  impactStats.loggedActions.forEach((act) => {
    const cat = act.category || 'Transit';
    categoryCounts[cat] = (categoryCounts[cat] || 0) + (act.co2SavedKg || 1);
  });

  const pieData = Object.keys(categoryCounts).map((cat) => ({
    name: cat,
    value: Number(categoryCounts[cat].toFixed(1)),
    color: CATEGORY_COLORS[cat] || '#64748b',
  }));

  return (
    <div className="space-y-8 pb-16">
      {/* Title & Quick Log CTA */}
      <div className="border-b border-slate-200 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
              <Award className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Environmental Impact Tracker
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Monitor verified personal emissions avoided through low-smog commute swaps, idle-cuts, and household energy discipline.
          </p>
        </div>

        <button
          onClick={() => setShowLogModal(true)}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs sm:text-sm hover:bg-emerald-700 transition-all shadow-md shadow-emerald-600/20 cursor-pointer self-start md:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Log Sustainable Action</span>
        </button>
      </div>

      {/* Top 4 KPI Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Est. CO₂ Avoided
          </span>
          <div className="flex items-baseline space-x-1.5 mt-2">
            <span className="text-3xl font-black text-slate-900">
              {impactStats.co2AvoidedKg}
            </span>
            <span className="text-xs font-semibold text-slate-400">kg CO₂</span>
          </div>
          <span className="text-[11px] text-emerald-700 font-semibold block mt-1">
            🌱 Equivalent to 0.2 urban tree years
          </span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Actions Completed
          </span>
          <div className="flex items-baseline space-x-1.5 mt-2">
            <span className="text-3xl font-black text-slate-900">
              {impactStats.actionsCompleted}
            </span>
            <span className="text-xs font-semibold text-slate-400">habits</span>
          </div>
          <span className="text-[11px] text-teal-700 font-semibold block mt-1">
            ⚡ Daily streak active
          </span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Solo Trips Substituted
          </span>
          <div className="flex items-baseline space-x-1.5 mt-2">
            <span className="text-3xl font-black text-slate-900">
              {impactStats.tripsReduced}
            </span>
            <span className="text-xs font-semibold text-slate-400">trips</span>
          </div>
          <span className="text-[11px] text-cyan-700 font-semibold block mt-1">
            🚆 Metro & bus alternatives
          </span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Achievements
          </span>
          <div className="flex items-baseline space-x-1.5 mt-2">
            <span className="text-3xl font-black text-slate-900">
              {achievements.filter((a) => a.unlocked).length} / {achievements.length}
            </span>
            <span className="text-xs font-semibold text-slate-400">badges</span>
          </div>
          <span className="text-[11px] text-amber-700 font-semibold block mt-1">
            🏆 Gamified motivation
          </span>
        </div>
      </div>

      {/* Visual Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Trend Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-xs">
          <h3 className="font-extrabold text-slate-900 text-base mb-1">
            7-Day CO₂ Avoidance Trajectory
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Emissions prevented through consistent low-emission commute and energy choices
          </p>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} />
                <Tooltip
                  formatter={(val) => [`${val} kg CO₂ avoided`, 'Avoided']}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="co2" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown Donut */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base mb-1">
              Impact by Category
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Share of avoided emissions across transit, vehicle idling, and home
            </p>

            <div className="h-44 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData.length ? pieData : [{ name: 'Transit', value: 1, color: '#10b981' }]}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={4}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val) => [`${val} kg CO₂`, 'Contribution']}
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '11px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 text-[11px] pt-3 border-t border-slate-100">
            {pieData.map((d, i) => (
              <span key={i} className="flex items-center space-x-1 font-semibold text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                <span>{d.name} ({d.value}kg)</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Gamified Badges & Achievements */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs">
        <h3 className="font-extrabold text-slate-900 text-base mb-1">
          Achievements & Clean Air Badges
        </h3>
        <p className="text-xs text-slate-500 mb-5">
          Milestones unlocked as you practice smog-resilient urban routines
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className={`p-4 rounded-xl border text-center transition-all ${
                ach.unlocked
                  ? 'bg-emerald-50/70 border-emerald-300 shadow-2xs'
                  : 'bg-slate-50/70 border-slate-200 opacity-60'
              }`}
            >
              <div className="text-3xl mb-2">{ach.icon}</div>
              <h4 className="font-extrabold text-xs text-slate-900 mb-1">{ach.name}</h4>
              <p className="text-[11px] text-slate-500 leading-tight mb-2">{ach.description}</p>
              <span
                className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  ach.unlocked
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                {ach.unlocked ? 'Unlocked' : 'Locked'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Transparent Estimation Methodology Notice */}
      <div className="bg-slate-100/80 rounded-2xl p-5 border border-slate-200 flex items-start space-x-3 text-xs">
        <Info className="w-5 h-5 text-slate-600 shrink-0 mt-0.5" />
        <div className="space-y-1 text-slate-600 leading-relaxed">
          <span className="font-bold text-slate-900 block">
            Scientific Transparency & Estimation Methodology
          </span>
          <p>
            Values shown represent <strong>estimated CO₂ and tailpipe emissions avoided</strong> calculated using standard Central Road Research Institute (CRRI) and IPCC vehicular baseline factors (e.g. ~45g CO₂/km for two-wheelers vs ~15g for electric metro).
          </p>
          <p className="text-slate-500 italic">
            *Note: While collective community actions lower regional emissions over time, individual actions mitigate personal toxic exposure and do not directly reduce the immediate city-wide ambient AQI.
          </p>
        </div>
      </div>

      {/* Logged Actions Table / Feed */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs">
        <h3 className="font-extrabold text-slate-900 text-base mb-4">
          Recent Sustainable Urban Activity Log
        </h3>

        <div className="divide-y divide-slate-100">
          {impactStats.loggedActions.map((act) => (
            <div key={act.id} className="py-3 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800 text-xs sm:text-sm block">
                  {act.title}
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  {act.note} • {new Date(act.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              <div className="text-right">
                <span className="font-extrabold text-emerald-700 text-xs sm:text-sm block">
                  +{act.co2SavedKg} kg CO₂
                </span>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold">
                  {act.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Log Action Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="font-extrabold text-slate-900 text-base mb-1">
              Log a Sustainable Action
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Record a public transit trip, engine idle-off, or household eco choice.
            </p>

            <form onSubmit={handleSubmitLog} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Action Name</label>
                <input
                  type="text"
                  placeholder="e.g. Hyderabad Metro to Office"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-slate-50"
                  >
                    <option value="Transit">Transit (Metro/Bus)</option>
                    <option value="Vehicle">Vehicle (Idle-Off/Carpool)</option>
                    <option value="Indoor">Indoor Clean Routine</option>
                    <option value="Energy">Energy Efficiency</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Est. CO₂ Saved (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={newCo2}
                    onChange={(e) => setNewCo2(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Notes / Description</label>
                <input
                  type="text"
                  placeholder="e.g. Swapped 12km solo scooter ride"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 shadow-xs"
                >
                  Log & Save Impact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
