import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import OnboardingModal from './components/OnboardingModal';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import AssistantPage from './pages/AssistantPage';
import IndoorAdvisorPage from './pages/IndoorAdvisorPage';
import LifestylePlannerPage from './pages/LifestylePlannerPage';
import ImpactTrackerPage from './pages/ImpactTrackerPage';
import EducationPage from './pages/EducationPage';
import SettingsPage from './pages/SettingsPage';
import { AlertTriangle, ArrowRight, X } from 'lucide-react';

function MainLayout() {
  const { activeTab, setActiveTab, airQualityData, hasCompletedOnboarding } = useApp();
  const [showOnboarding, setShowOnboarding] = useState(!hasCompletedOnboarding);
  const [dismissAlert, setDismissAlert] = useState(false);

  const aqiVal = airQualityData?.india_aqi?.aqi || 0;
  const isHighPollution = aqiVal > 150 && !dismissAlert;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-emerald-500 selection:text-white font-sans">
      <Navbar />

      {/* Severe Smog Dynamic Alert Banner */}
      {isHighPollution && (
        <div className="bg-gradient-to-r from-rose-600 via-red-600 to-orange-600 text-white px-4 py-2.5 text-xs shadow-md">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-white shrink-0 animate-bounce" />
              <span className="font-extrabold uppercase tracking-wide">
                Air Quality Alert ({airQualityData?.city}):
              </span>
              <span className="font-medium hidden sm:inline">
                AQI is {aqiVal} ({airQualityData?.india_aqi?.category}). Limit prolonged outdoor workouts & wear an N95 mask.
              </span>
            </div>

            <div className="flex items-center space-x-3 shrink-0">
              <button
                onClick={() => setActiveTab('assistant')}
                className="bg-white text-rose-700 px-3 py-1 rounded-md font-bold text-[11px] hover:bg-rose-50 transition-colors"
              >
                Get Safety Advice →
              </button>
              <button
                onClick={() => setDismissAlert(true)}
                className="text-white/80 hover:text-white p-0.5"
                title="Dismiss banner"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Tab Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'landing' && <LandingPage />}
        {activeTab === 'dashboard' && <DashboardPage />}
        {activeTab === 'assistant' && <AssistantPage />}
        {activeTab === 'indoor' && <IndoorAdvisorPage />}
        {activeTab === 'lifestyle' && <LifestylePlannerPage />}
        {activeTab === 'impact' && <ImpactTrackerPage />}
        {activeTab === 'education' && <EducationPage />}
        {activeTab === 'settings' && <SettingsPage />}
      </main>

      <Footer />

      {/* Onboarding Dialog */}
      <OnboardingModal
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
