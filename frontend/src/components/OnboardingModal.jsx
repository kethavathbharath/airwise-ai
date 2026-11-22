import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Home, Check } from 'lucide-react';

const CITIES = ['Hyderabad', 'Delhi', 'Mumbai', 'Bengaluru', 'Pune', 'Kolkata', 'Chennai', 'Lucknow', 'Ahmedabad', 'Jaipur'];
const TRANSIT_OPTIONS = ['Two-Wheeler / Bike', 'Metro Rail', 'City Bus', 'Car / Cab', 'Walking / Bicycle'];
const LIFESTYLES = ['College Student / Daily Commuter', 'Corporate / Office Professional', 'Remote / Work From Home', 'Family with Children & Elders', 'Outdoor Worker / Field Executive'];
const HOME_SIZES = ['1 BHK (<600 sq ft)', '2 BHK (800-1200 sq ft)', '3 BHK (1400-2000 sq ft)', 'Independent Villa / House'];

export default function OnboardingModal({ isOpen, onClose }) {
  const { userProfile, completeOnboarding } = useApp();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: userProfile?.name || 'Bharath',
    city: userProfile?.city || 'Hyderabad',
    transport_method: userProfile?.transport_method || 'Two-Wheeler / Bike',
    lifestyle: userProfile?.lifestyle || 'College Student / Daily Commuter',
    outdoor_frequency: userProfile?.outdoor_frequency || 'Daily 2-3 hours',
    home_size: userProfile?.home_size || '2 BHK (800-1200 sq ft)',
    occupants: userProfile?.occupants || 3,
    has_purifier: userProfile?.has_purifier || false,
    ventilation_type: userProfile?.ventilation_type || 'Natural Windows & Balcony',
  });

  if (!isOpen) return null;

  function handleSave() {
    completeOnboarding(formData);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 px-6 py-5 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-emerald-200" />
              <span className="font-extrabold text-lg">Personalize Your AirWise AI</span>
            </div>
            <span className="text-xs bg-white/20 px-2.5 py-0.5 rounded-full font-medium">
              Step {step} of 2
            </span>
          </div>
          <p className="text-xs text-emerald-100 mt-1">
            Tailor real-time smog advisories, transit swaps, and home purification to your daily routine.
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Your Name / Nickname</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Bharath"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Primary City</label>
                <div className="grid grid-cols-2 gap-2">
                  {CITIES.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setFormData({ ...formData, city: c })}
                      className={`text-left px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                        formData.city === c
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-800 font-bold'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Primary Daily Commute</label>
                <div className="space-y-1.5">
                  {TRANSIT_OPTIONS.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setFormData({ ...formData, transport_method: t })}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium border transition-all flex items-center justify-between ${
                        formData.transport_method === t
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-800 font-bold'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span>{t}</span>
                      {formData.transport_method === t && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Occupation & Lifestyle</label>
                <div className="space-y-1.5">
                  {LIFESTYLES.map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => setFormData({ ...formData, lifestyle: l })}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                        formData.lifestyle === l
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-800 font-bold'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Home Size</label>
                <div className="grid grid-cols-2 gap-2">
                  {HOME_SIZES.map((hs) => (
                    <button
                      key={hs}
                      type="button"
                      onClick={() => setFormData({ ...formData, home_size: hs })}
                      className={`text-left px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                        formData.home_size === hs
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-800 font-bold'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {hs}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <div>
                  <span className="text-xs font-bold text-slate-700 block">Do you own an Air Purifier?</span>
                  <span className="text-[11px] text-slate-400">Enables HEPA filter life & CADR advice</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, has_purifier: false })}
                    className={`px-3 py-1 text-xs rounded-lg border font-semibold ${
                      !formData.has_purifier ? 'bg-slate-800 text-white border-slate-800' : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    No
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, has_purifier: true })}
                    className={`px-3 py-1 text-xs rounded-lg border font-semibold ${
                      formData.has_purifier ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    Yes
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer controls */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800"
          >
            Skip for now
          </button>

          <div className="flex items-center space-x-2">
            {step === 2 && (
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100"
              >
                Back
              </button>
            )}

            {step === 1 ? (
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs"
              >
                Continue →
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSave}
                className="px-5 py-2 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-500/20"
              >
                Save & Personalize
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
