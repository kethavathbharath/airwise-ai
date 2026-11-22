import React from 'react';
import {
  Wind,
  Bot,
  Home,
  Compass,
  Award,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  MapPin,
  ChevronRight,
  ExternalLink,
  Github,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function LandingPage() {
  const { setActiveTab, currentCity, airQualityData, loadAirQuality } = useApp();
  const aqiInfo = airQualityData?.india_aqi;

  const topCities = ['Hyderabad', 'Delhi', 'Mumbai', 'Bengaluru', 'Pune', 'Kolkata'];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 sm:pt-16 pb-12">
        {/* Decorative ambient background blur */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-emerald-200/40 via-teal-200/30 to-cyan-200/30 blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-4xl mx-auto text-center px-4 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-300/80 text-emerald-800 text-xs font-bold mb-6 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-spin" />
            <span>PromptWars Challenge 06: GenAI Urban Air Assistant</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
            Breathe Smarter. <br />
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
              Navigate Winter Smog
            </span>{' '}
            with GenAI.
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Your personalized urban copilot for severe seasonal pollution. Get verified location-based AQI,
            AI-crafted low-emission commute routines, and science-backed indoor purification guidance.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="px-6 py-3.5 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-all flex items-center space-x-2 shadow-lg shadow-slate-900/15 cursor-pointer hover:scale-[1.02]"
            >
              <span>Explore Live Dashboard</span>
              <ArrowRight className="w-4 h-4 text-emerald-400" />
            </button>

            <button
              onClick={() => setActiveTab('assistant')}
              className="px-6 py-3.5 rounded-xl bg-white text-slate-800 font-bold text-sm border border-slate-200 hover:bg-slate-50 transition-all flex items-center space-x-2 shadow-xs cursor-pointer hover:scale-[1.02]"
            >
              <Bot className="w-4 h-4 text-emerald-600" />
              <span>Ask AirWise AI</span>
            </button>

            <a
              href="https://airwise-ai-nufu.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3.5 rounded-xl bg-emerald-50 text-emerald-800 font-bold text-sm border border-emerald-300 hover:bg-emerald-100 transition-all flex items-center space-x-2 shadow-xs hover:scale-[1.02]"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live Vercel App</span>
              <ExternalLink className="w-4 h-4 text-emerald-600" />
            </a>

            <a
              href="https://github.com/kethavathbharath/airwise-ai.git"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-3.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-sm border border-slate-300 hover:bg-slate-200 transition-all flex items-center space-x-2 shadow-xs hover:scale-[1.02]"
            >
              <Github className="w-4 h-4" />
              <span>GitHub Code</span>
            </a>
          </div>

          {/* Quick city pill selector */}
          <div className="mt-8 pt-4 border-t border-slate-200/60 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">Quick City Check:</span>
            {topCities.map((c) => (
              <button
                key={c}
                onClick={() => {
                  loadAirQuality(c);
                  setActiveTab('dashboard');
                }}
                className={`px-2.5 py-1 rounded-md transition-all font-semibold cursor-pointer ${
                  currentCity === c
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-emerald-400'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Live Preview Card */}
        {airQualityData && aqiInfo && (
          <div className="max-w-3xl mx-auto mt-10 px-4">
            <div
              onClick={() => setActiveTab('dashboard')}
              className="group cursor-pointer bg-white rounded-2xl p-5 border border-slate-200/90 shadow-md hover:shadow-xl transition-all relative overflow-hidden"
            >
              <div
                className="absolute top-0 left-0 bottom-0 w-2.5"
                style={{ backgroundColor: aqiInfo.color }}
              />
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pl-2">
                <div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    <span className="font-extrabold text-lg text-slate-900">{airQualityData.city}</span>
                    <span className="text-xs text-slate-400 font-medium">
                      ({airQualityData.country || 'India'})
                    </span>
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold border border-emerald-200">
                      LIVE
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 max-w-md">
                    {aqiInfo.description}
                  </p>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="flex items-baseline space-x-1.5 justify-end">
                      <span className="text-3xl font-black text-slate-900">{aqiInfo.aqi}</span>
                      <span className="text-xs font-semibold text-slate-400">AQI</span>
                    </div>
                    <span
                      className="text-xs font-extrabold px-2.5 py-0.5 rounded-full inline-block"
                      style={{
                        backgroundColor: `${aqiInfo.color}20`,
                        color: aqiInfo.color === '#10b981' ? '#065f46' : aqiInfo.color,
                      }}
                    >
                      {aqiInfo.category}
                    </span>
                  </div>

                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Main Core Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
            Built For Real-World Action
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1.5">
            More Than Just Numbers on a Gauge
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            AirWise AI translates complex atmospheric chemistry into actionable daily habits that safeguard your health
            while curbing urban emissions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div
            onClick={() => setActiveTab('dashboard')}
            className="cursor-pointer bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs hover:shadow-md transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Wind className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg mb-2">Smart AQI Monitoring</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Official Indian CPCB National AQI metrics for PM2.5, PM10, NO₂, and O₃. 24-hour hourly trendlines and 3-day predictive forecasts.
            </p>
            <span className="inline-flex items-center text-xs font-bold text-emerald-600 mt-4 group-hover:translate-x-1 transition-transform">
              View live dashboard →
            </span>
          </div>

          {/* Feature 2 */}
          <div
            onClick={() => setActiveTab('assistant')}
            className="cursor-pointer bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs hover:shadow-md transition-all group relative overflow-hidden"
          >
            <div className="absolute top-3 right-3 text-[10px] font-extrabold bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-2 py-0.5 rounded-full">
              GENAI
            </div>
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4 group-hover:bg-teal-600 group-hover:text-white transition-colors">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg mb-2">AI Personal Assistant</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Google Gemini-powered conversational assistant contextualized to your commute, city, and lifestyle. Solves real-world smog questions.
            </p>
            <span className="inline-flex items-center text-xs font-bold text-teal-600 mt-4 group-hover:translate-x-1 transition-transform">
              Chat with AI assistant →
            </span>
          </div>

          {/* Feature 3 */}
          <div
            onClick={() => setActiveTab('indoor')}
            className="cursor-pointer bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs hover:shadow-md transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center mb-4 group-hover:bg-cyan-600 group-hover:text-white transition-colors">
              <Home className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg mb-2">Indoor Air Advisor</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Optimal window ventilation hours, HEPA purifier sizing, kitchen exhaust guidelines, and science reality checks on houseplants.
            </p>
            <span className="inline-flex items-center text-xs font-bold text-cyan-600 mt-4 group-hover:translate-x-1 transition-transform">
              Protect your home →
            </span>
          </div>

          {/* Feature 4 */}
          <div
            onClick={() => setActiveTab('lifestyle')}
            className="cursor-pointer bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs hover:shadow-md transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg mb-2">Low-Emission Routine</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Morning, afternoon, and evening schedules with practical public transit swaps, signal idling cuts, and trip chaining.
            </p>
            <span className="inline-flex items-center text-xs font-bold text-amber-600 mt-4 group-hover:translate-x-1 transition-transform">
              Generate daily plan →
            </span>
          </div>

          {/* Feature 5 */}
          <div
            onClick={() => setActiveTab('impact')}
            className="cursor-pointer bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs hover:shadow-md transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4 group-hover:bg-rose-600 group-hover:text-white transition-colors">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg mb-2">Environmental Impact Tracker</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Log public transit trips and energy-saving actions. Track estimated CO₂ emissions avoided and unlock gamified sustainability badges.
            </p>
            <span className="inline-flex items-center text-xs font-bold text-rose-600 mt-4 group-hover:translate-x-1 transition-transform">
              Track your impact →
            </span>
          </div>

          {/* Feature 6 */}
          <div
            onClick={() => setActiveTab('education')}
            className="cursor-pointer bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs hover:shadow-md transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg mb-2">Science & Pollutant Guide</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Learn why winter thermal inversion traps smog, what PM2.5 does to blood vessels, and how to verify certified N95 masks.
            </p>
            <span className="inline-flex items-center text-xs font-bold text-indigo-600 mt-4 group-hover:translate-x-1 transition-transform">
              Explore knowledge base →
            </span>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-slate-100/70 border-y border-slate-200 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Simple 3-Step Flow</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              How AirWise AI Works For You
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 border border-slate-200 relative">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-extrabold text-xs flex items-center justify-center mb-4 shadow-sm">
                1
              </div>
              <h4 className="font-bold text-slate-900 text-base mb-1">Detect or Select Location</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Connect seamlessly to real-time Open-Meteo atmospheric models mapped against the Indian Central Pollution Control Board standard.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-slate-200 relative">
              <div className="w-8 h-8 rounded-full bg-teal-600 text-white font-extrabold text-xs flex items-center justify-center mb-4 shadow-sm">
                2
              </div>
              <h4 className="font-bold text-slate-900 text-base mb-1">Receive Tailored AI Guidance</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Our Gemini AI engine analyzes your transit method (bike, bus, metro) and lifestyle to create an exposure-reducing daily schedule.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-slate-200 relative">
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-extrabold text-xs flex items-center justify-center mb-4 shadow-sm">
                3
              </div>
              <h4 className="font-bold text-slate-900 text-base mb-1">Act & Track CO₂ Reductions</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Check off completed sustainable routines, avoid personal vehicle emissions, earn badges, and build collective community resilience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Hackathon Call To Action Banner */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl border border-slate-800">
          <div className="relative z-10 max-w-2xl">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-2">
              Ready For Clean Air Action?
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Protect Your Loved Ones From Severe Smog Today.
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed">
              Join thousands of commuters across Indian cities adopting smart, low-emission daily routines with AirWise AI.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() => setActiveTab('dashboard')}
                className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs sm:text-sm transition-all shadow-md cursor-pointer"
              >
                Go to Live Dashboard
              </button>
              <button
                onClick={() => setActiveTab('assistant')}
                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 transition-all cursor-pointer"
              >
                Start AI Consultation
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
