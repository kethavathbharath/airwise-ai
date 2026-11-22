import React from 'react';
import { Wind, Sparkles, ExternalLink, Github } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Footer() {
  const { setActiveTab } = useApp();

  return (
    <footer className="bg-white border-t border-slate-200 mt-16 text-slate-600 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                <Wind className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-base text-slate-900 tracking-tight">AirWise AI</span>
            </div>
            <p className="text-slate-500 leading-relaxed text-[11px]">
              Empowering urban commuters and families across Indian metropolitan regions with live atmospheric intelligence and AI low-emission habits.
            </p>
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-[10px] font-semibold text-slate-700">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              <span>PromptWars Challenge 06</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-slate-900 text-xs mb-3 uppercase tracking-wider">Features</h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <button onClick={() => setActiveTab('dashboard')} className="hover:text-emerald-700 transition-colors">
                  Smart AQI Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('assistant')} className="hover:text-emerald-700 transition-colors">
                  AI Personal Assistant
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('indoor')} className="hover:text-emerald-700 transition-colors">
                  Indoor Air Quality Advisor
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('lifestyle')} className="hover:text-emerald-700 transition-colors">
                  Low-Emission Routine Planner
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('impact')} className="hover:text-emerald-700 transition-colors">
                  Environmental Impact Tracker
                </button>
              </li>
            </ul>
          </div>

          {/* Standards & Scientific Attribution */}
          <div>
            <h4 className="font-bold text-slate-900 text-xs mb-3 uppercase tracking-wider">Scientific Sources</h4>
            <ul className="space-y-1.5 text-[11px] text-slate-500">
              <li>Central Pollution Control Board (CPCB) NAQI</li>
              <li>Open-Meteo European & Global Atmospheric Models</li>
              <li>US EPA Air Quality Criteria Standards</li>
              <li>World Health Organization (WHO) 2021 Guidelines</li>
              <li>CRRI Vehicular Emission Baselines</li>
            </ul>
          </div>

          {/* Disclaimer */}
          <div>
            <h4 className="font-bold text-slate-900 text-xs mb-3 uppercase tracking-wider">Medical Notice</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              AirWise AI provides environmental health guidance and low-emission lifestyle alternatives. It is not intended as formal clinical diagnosis or emergency medical counsel. Always consult healthcare professionals during acute respiratory distress.
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <span>&copy; {new Date().getFullYear()} AirWise AI – GenAI Urban Air Quality Assistant.</span>
            <span className="text-slate-300">•</span>
            <a
              href="https://airwise-ai-nufu.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-700 hover:text-emerald-800 font-semibold inline-flex items-center space-x-1"
            >
              <span>Live App</span>
              <ExternalLink className="w-3 h-3 text-emerald-600" />
            </a>
            <span className="text-slate-300">•</span>
            <a
              href="https://github.com/kethavathbharath/airwise-ai.git"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-700 hover:text-slate-900 font-semibold inline-flex items-center space-x-1"
            >
              <Github className="w-3 h-3 text-slate-600" />
              <span>GitHub Repo</span>
            </a>
          </div>
          <span className="flex items-center space-x-1">
            <span>Engineered with React, Vite, FastAPI & Gemini AI</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
