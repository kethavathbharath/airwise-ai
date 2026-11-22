import React, { useState, useEffect, useRef } from 'react';
import {
  Wind,
  Bot,
  Home,
  Compass,
  Award,
  BookOpen,
  Settings,
  Search,
  MapPin,
  Menu,
  X,
  Sparkles,
  ChevronDown,
  Activity,
  Github,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { searchCities } from '../services/api';

export default function Navbar() {
  const {
    activeTab,
    setActiveTab,
    currentCity,
    airQualityData,
    loadAirQuality,
    loadByCoordinates,
    detectUserLocation,
    configStatus,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchRef = useRef(null);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'assistant', label: 'AI Assistant', icon: Bot, badge: 'AI' },
    { id: 'indoor', label: 'Indoor Air', icon: Home },
    { id: 'lifestyle', label: 'Routine Planner', icon: Compass },
    { id: 'impact', label: 'Impact Tracker', icon: Award },
    { id: 'education', label: 'Pollutant Guide', icon: BookOpen },
  ];

  // Live search debounce
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      const results = await searchCities(searchQuery);
      setSearchResults(results);
    }, 280);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside to close search dropdown
  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsSearching(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const aqiInfo = airQualityData?.india_aqi;

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('landing')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <Wind className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-xl tracking-tight text-slate-900">AirWise</span>
                <span className="px-1.5 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-800 rounded-md border border-emerald-300">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-slate-500 hidden sm:block font-medium">Urban Air Quality Assistant</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2" role="tablist" aria-label="Main Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  role="tab"
                  aria-selected={isActive}
                  aria-label={item.label}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} aria-hidden="true" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="px-1 py-0.2 text-[9px] font-bold bg-emerald-500 text-white rounded">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Header Area: Search, City AQI Pill, Settings */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Search Bar */}
            <div className="relative" ref={searchRef}>
              <button
                onClick={() => setIsSearching(!isSearching)}
                className="flex items-center space-x-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200/80 rounded-lg border border-slate-200 transition-colors"
                title="Search city air quality"
              >
                <Search className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline max-w-[90px] truncate">{currentCity}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isSearching && (
                <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-50">
                  <div className="relative mb-2">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search city (e.g. Hyderabad, Delhi, Mumbai)..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (searchResults.length > 0) {
                            const top = searchResults[0];
                            if (top.latitude && top.longitude) {
                              loadByCoordinates(top.latitude, top.longitude, top.name, top.country, top.admin1);
                            } else {
                              loadAirQuality(top.name);
                            }
                          } else if (searchQuery.trim()) {
                            loadAirQuality(searchQuery.trim());
                          }
                          setIsSearching(false);
                          setSearchQuery('');
                          setActiveTab('dashboard');
                        }
                      }}
                      autoFocus
                      className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    />
                  </div>

                  <div className="flex items-center justify-between py-1 px-1 border-b border-slate-100 text-xs text-slate-500 mb-1">
                    <span>Quick Select / GPS</span>
                    <button
                      type="button"
                      onClick={() => {
                        detectUserLocation();
                        setIsSearching(false);
                        setActiveTab('dashboard');
                      }}
                      className="flex items-center space-x-1 text-emerald-600 hover:text-emerald-700 font-semibold text-[11px] cursor-pointer"
                    >
                      <MapPin className="w-3 h-3" />
                      <span>Use My GPS</span>
                    </button>
                  </div>

                  <div className="max-h-56 overflow-y-auto space-y-1">
                    {searchResults.length > 0 ? (
                      searchResults.map((city, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            if (city.latitude && city.longitude) {
                              loadByCoordinates(city.latitude, city.longitude, city.name, city.country, city.admin1);
                            } else {
                              loadAirQuality(city.name);
                            }
                            setIsSearching(false);
                            setSearchQuery('');
                            setActiveTab('dashboard');
                          }}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs hover:bg-emerald-50 hover:text-emerald-800 transition-colors flex items-center justify-between group cursor-pointer"
                        >
                          <div>
                            <span className="font-semibold text-slate-800 group-hover:text-emerald-700">
                              {city.name}
                            </span>
                            {city.admin1 && (
                              <span className="text-slate-400 text-[11px] ml-1.5">({city.admin1}, {city.country})</span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400 group-hover:text-emerald-600">Select →</span>
                        </button>
                      ))
                    ) : (
                      <div className="text-[11px] text-slate-400 py-3 text-center">
                        {searchQuery ? 'No matching cities found.' : 'Popular: Delhi, Hyderabad, Mumbai, Bengaluru, Pune, Kolkata'}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Live AQI Status Pill */}
            {aqiInfo && (
              <div
                onClick={() => setActiveTab('dashboard')}
                className="cursor-pointer flex items-center space-x-2 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-all hover:scale-[1.02] shadow-2xs"
                style={{
                  backgroundColor: `${aqiInfo.color}15`,
                  borderColor: `${aqiInfo.color}40`,
                  color: aqiInfo.color === '#10b981' ? '#065f46' : aqiInfo.color,
                }}
                title="Current Indian AQI"
              >
                <span
                  className="w-2.5 h-2.5 rounded-full animate-ping"
                  style={{ backgroundColor: aqiInfo.color }}
                />
                <span className="font-extrabold">{aqiInfo.aqi}</span>
                <span className="hidden sm:inline font-medium text-[11px]">{aqiInfo.category}</span>
              </div>
            )}

            {/* Live App Vercel Deployment Link */}
            <a
              href="https://airwise-ai-nufu.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100/80 transition-colors shadow-2xs"
              title="Open Live Vercel Deployment"
              aria-label="Live Vercel Web App"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live App</span>
              <ExternalLink className="w-3 h-3 text-emerald-600" />
            </a>

            {/* GitHub Repository Link */}
            <a
              href="https://github.com/kethavathbharath/airwise-ai.git"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg text-slate-600 bg-slate-100 hover:bg-slate-200/70 border border-slate-200 transition-colors hidden sm:flex items-center"
              title="GitHub: kethavathbharath/airwise-ai"
              aria-label="GitHub Repository"
            >
              <Github className="w-4 h-4" />
            </a>

            {/* Settings button */}
            <button
              onClick={() => setActiveTab('settings')}
              className={`p-2 rounded-lg border transition-colors ${
                activeTab === 'settings'
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'text-slate-600 bg-slate-100 hover:bg-slate-200/70 border-slate-200'
              }`}
              title="Preferences & AI API Keys"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white/95 px-4 pt-2 pb-4 space-y-1 shadow-lg">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-800 font-semibold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 px-1">
            <span>AI Status:</span>
            <span className="font-semibold text-emerald-700 flex items-center space-x-1">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              <span>{configStatus.gemini_configured ? 'Gemini 2.0 Active' : 'Intelligent Engine Active'}</span>
            </span>
          </div>
        </div>
      )}
    </header>
  );
}
