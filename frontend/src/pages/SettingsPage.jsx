import React, { useState } from 'react';
import {
  Settings,
  Key,
  Shield,
  Bell,
  User,
  Save,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function SettingsPage() {
  const {
    userProfile,
    setUserProfile,
    configStatus,
    handleSetGeminiKey,
  } = useApp();

  const [profileForm, setProfileForm] = useState({ ...userProfile });
  const [profileSaved, setProfileSaved] = useState(false);

  // Gemini API key config state
  const [geminiKeyInput, setGeminiKeyInput] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [keySaving, setKeySaving] = useState(false);
  const [keyMessage, setKeyMessage] = useState(null);

  // Alert preferences
  const [alertThreshold, setAlertThreshold] = useState('150');
  const [browserNotifications, setBrowserNotifications] = useState(false);

  function handleSaveProfile(e) {
    e.preventDefault();
    setUserProfile(profileForm);
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2500);
  }

  async function handleSaveKey(e) {
    e.preventDefault();
    setKeySaving(true);
    setKeyMessage(null);
    try {
      const res = await handleSetGeminiKey(geminiKeyInput);
      setKeyMessage({ type: 'success', text: res.message || 'Key updated successfully.' });
      setGeminiKeyInput('');
    } catch {
      setKeyMessage({ type: 'error', text: 'Failed to update Gemini API key.' });
    } finally {
      setKeySaving(false);
    }
  }

  function handleEnableNotifications() {
    if ('Notification' in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          setBrowserNotifications(true);
          new Notification('AirWise AI Alerts Enabled', {
            body: `You will be alerted when pollution in ${userProfile?.city || 'your city'} crosses AQI ${alertThreshold}.`,
            icon: '/favicon.ico',
          });
        }
      });
    } else {
      alert('Browser notifications not supported.');
    }
  }

  function handleResetAll() {
    if (window.confirm('Reset all saved routines, impact history, and profile data to defaults?')) {
      localStorage.clear();
      sessionStorage.clear();
      window.location.reload();
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Title */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center space-x-2">
          <span className="p-1.5 rounded-lg bg-slate-900 text-white">
            <Settings className="w-5 h-5" />
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Settings & System Preferences
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
          Manage your personal commuter profile, configure Gemini API keys securely, and customize severe smog alerts.
        </p>
      </div>

      {/* Section 1: AI Engine & Gemini API Configuration */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2.5">
            <Key className="w-5 h-5 text-emerald-600" />
            <h2 className="font-extrabold text-slate-900 text-base">
              Google Gemini AI Engine Configuration
            </h2>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold border ${
              configStatus.gemini_configured
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-amber-50 text-amber-800 border-amber-300'
            }`}
          >
            {configStatus.gemini_configured ? '🟢 Gemini 2.0 Live' : '🟡 Intelligent Demo Mode'}
          </span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          AirWise AI uses <strong>Google Gemini API</strong> for real-time generative recommendations. If no key is set or quota is exhausted,
          the system automatically operates in <strong>Intelligent Fallback Mode</strong> using our urban pollution domain model.
        </p>

        {/* Security callout */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-start space-x-2.5 text-xs text-slate-600">
          <Shield className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <p>
            <strong>Security Notice:</strong> Secret API keys are strictly passed to and processed by the FastAPI backend in memory or via environment variables. Secret keys are never exposed in frontend bundles or network query logs.
          </p>
        </div>

        <form onSubmit={handleSaveKey} className="space-y-3 pt-2">
          <label className="block text-xs font-bold text-slate-700">
            Set or Update Gemini API Key (Optional)
          </label>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <input
                type={showKey ? 'text' : 'password'}
                placeholder="AIzaSy..."
                value={geminiKeyInput}
                onChange={(e) => setGeminiKeyInput(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <button
              type="submit"
              disabled={keySaving}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              {keySaving ? 'Updating...' : 'Save Key'}
            </button>
            {configStatus.gemini_configured && (
              <button
                type="button"
                onClick={() => {
                  setGeminiKeyInput('');
                  handleSetGeminiKey('');
                }}
                className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition-colors"
                title="Switch back to simulated engine"
              >
                Clear Key
              </button>
            )}
          </div>

          {keyMessage && (
            <p
              className={`text-xs font-semibold ${
                keyMessage.type === 'success' ? 'text-emerald-700' : 'text-rose-700'
              }`}
            >
              {keyMessage.text}
            </p>
          )}
        </form>
      </div>

      {/* Section 2: Commuter Profile & Household Preferences */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center space-x-2.5 pb-3 border-b border-slate-100">
          <User className="w-5 h-5 text-slate-700" />
          <h2 className="font-extrabold text-slate-900 text-base">
            Commuter Profile & Lifestyle Preferences
          </h2>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Name / Nickname</label>
              <input
                type="text"
                value={profileForm.name || ''}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Primary City</label>
              <input
                type="text"
                value={profileForm.city || ''}
                onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Daily Transit Method</label>
              <select
                value={profileForm.transport_method || 'Two-Wheeler / Bike'}
                onChange={(e) => setProfileForm({ ...profileForm, transport_method: e.target.value })}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-slate-50"
              >
                <option value="Two-Wheeler / Bike">Two-Wheeler / Bike</option>
                <option value="Metro Rail">Metro Rail</option>
                <option value="City Bus">City Bus</option>
                <option value="Car / Cab">Car / Cab</option>
                <option value="Walking / Bicycle">Walking / Bicycle</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Occupation & Routine</label>
              <input
                type="text"
                value={profileForm.lifestyle || ''}
                onChange={(e) => setProfileForm({ ...profileForm, lifestyle: e.target.value })}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Home Size</label>
              <input
                type="text"
                value={profileForm.home_size || ''}
                onChange={(e) => setProfileForm({ ...profileForm, home_size: e.target.value })}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Owns Air Purifier?</label>
              <select
                value={profileForm.has_purifier ? 'true' : 'false'}
                onChange={(e) => setProfileForm({ ...profileForm, has_purifier: e.target.value === 'true' })}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-slate-50"
              >
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              {profileSaved && <span className="text-emerald-600 font-bold">✓ Profile updated!</span>}
            </span>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-xs cursor-pointer flex items-center space-x-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Preferences</span>
            </button>
          </div>
        </form>
      </div>

      {/* Section 3: Severe Smog Alert Notifications */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center space-x-2.5 pb-3 border-b border-slate-100">
          <Bell className="w-5 h-5 text-amber-500" />
          <h2 className="font-extrabold text-slate-900 text-base">
            Severe Smog AQI Alert Triggers
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700">Trigger Threshold</label>
            <p className="text-xs text-slate-500">Notify when live Indian AQI exceeds:</p>
          </div>
          <select
            value={alertThreshold}
            onChange={(e) => setAlertThreshold(e.target.value)}
            className="text-xs font-bold px-3 py-2 border border-slate-300 rounded-lg bg-slate-50"
          >
            <option value="100">AQI &gt; 100 (Moderate Discomfort)</option>
            <option value="150">AQI &gt; 150 (Poor / Sensitive Alert)</option>
            <option value="200">AQI &gt; 200 (Very Poor / High Health Alert)</option>
            <option value="300">AQI &gt; 300 (Severe Emergency)</option>
          </select>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={handleEnableNotifications}
            className="px-4 py-2 text-xs font-bold bg-amber-50 text-amber-800 border border-amber-300 rounded-lg hover:bg-amber-100"
          >
            {browserNotifications ? '✓ Notifications Enabled' : 'Enable Browser Push Alerts'}
          </button>
        </div>
      </div>

      {/* Section 4: Data Reset & Clean Slate */}
      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="font-bold text-slate-900 text-xs sm:text-sm block">
            Reset Stored Local Data
          </span>
          <span className="text-xs text-slate-500 block mt-0.5">
            Clears cached chat conversations, logged eco actions, and custom settings.
          </span>
        </div>
        <button
          type="button"
          onClick={handleResetAll}
          className="px-4 py-2 text-xs font-bold text-rose-700 bg-white border border-rose-300 rounded-lg hover:bg-rose-50 cursor-pointer self-start sm:self-auto"
        >
          Reset All Data
        </button>
      </div>
    </div>
  );
}
