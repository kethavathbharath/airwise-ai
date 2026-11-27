import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Bot,
  Smartphone,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Camera,
  Download,
  Info,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import AqiIndicator from '../components/AqiIndicator';
import PollutantCard from '../components/PollutantCard';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const sceneConfig = [
  { id: 1, name: 'The Problem', duration: 7, color: '#f43f5e' },
  { id: 2, name: 'Meet AirWise AI', duration: 7, color: '#10b981' },
  { id: 3, name: 'Live AQI Intelligence', duration: 9, color: '#06b6d4' },
  { id: 4, name: 'AI Assistant', duration: 10, color: '#8b5cf6' },
  { id: 5, name: 'Smarter Lifestyle', duration: 10, color: '#ec4899' },
  { id: 6, name: 'Environmental Impact', duration: 9, color: '#f59e0b' },
  { id: 7, name: 'Brand Reveal', duration: 8, color: '#10b981' },
];

const TOTAL_DURATION = 60;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

const textVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

function Scene1_TheProblem({ progress, isActive }) {
  const smogOpacity = Math.min(1, progress * 2);
  const textProgress = Math.max(0, (progress - 0.3) / 0.4);
  const questionProgress = Math.max(0, (progress - 0.6) / 0.4);

  return (
    <motion.div
      className="relative h-full w-full flex flex-col items-center justify-center overflow-hidden"
      initial="hidden"
      animate={isActive ? "visible" : "hidden"}
      variants={containerVariants}
      style={{ background: '#0f172a' }}
    >
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at center, rgba(15,23,42,${0.3 + smogOpacity * 0.4}) 0%, rgba(15,23,42,1) 70%)`,
          }}
        />
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='${0.15 * smogOpacity}'/%3E%3C/svg%3E")`,
          }}
          animate={{ opacity: smogOpacity }}
          transition={{ duration: 2 }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[300%] h-[200%]"
          style={{
            background: `radial-gradient(ellipse at center, rgba(244,63,94,${0.08 * smogOpacity}) 0%, transparent 60%)`,
            borderRadius: '50%',
            filter: 'blur(120px)',
          }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <motion.div
        className="relative z-10 px-6 text-center"
        variants={itemVariants}
        style={{ opacity: textProgress }}
      >
        <motion.h1
          className="font-black text-3xl sm:text-4xl md:text-5xl text-white leading-tight tracking-tight"
          variants={textVariants}
        >
          THE AIR WE BREATHE
          <br />
          <span className="text-rose-400">IS CHANGING</span>
        </motion.h1>
      </motion.div>

      <motion.div
        className="relative z-10 px-6 text-center mt-6"
        variants={itemVariants}
        style={{ opacity: questionProgress, transition: { delay: 0.3 } }}
      >
        <motion.p
          className="text-lg sm:text-xl text-slate-300 font-medium leading-relaxed max-w-xl mx-auto"
          variants={textVariants}
        >
          Would you know if the air around you was unsafe?
        </motion.p>
      </motion.div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex items-center space-x-2 text-xs text-slate-500"
        animate={{ opacity: isActive ? 1 : 0 }}
      >
        <MapPin className="w-3 h-3 text-rose-400" />
        <span>Hyderabad • Winter Smog</span>
      </motion.div>
    </motion.div>
  );
}

function Scene2_MeetAirWise({ progress, isActive }) {
  const logoProgress = Math.min(1, progress * 1.5);
  const taglineProgress = Math.max(0, (progress - 0.3) / 0.4);
  const phoneProgress = Math.max(0, (progress - 0.6) / 0.4);

  return (
    <motion.div
      className="relative h-full w-full flex flex-col items-center justify-center overflow-hidden"
      initial="hidden"
      animate={isActive ? "visible" : "hidden"}
      variants={containerVariants}
      style={{ background: 'linear-gradient(180deg, #0f172a 0%, #064e3b 100%)' }}
    >
      <motion.div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at center, rgba(16,185,129,${0.15 * logoProgress}) 0%, transparent 70%)`,
        }}
        animate={{ opacity: logoProgress }}
      />

      <motion.div
        className="relative z-10 flex flex-col items-center space-y-6"
        variants={itemVariants}
        style={{ opacity: logoProgress }}
      >
        <motion.div
          className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl flex items-center justify-center relative"
          style={{
            background: 'linear-gradient(135deg, #10b981 0%, #0f766e 100%)',
            boxShadow: '0 0 60px rgba(16,185,129,0.4), 0 0 120px rgba(16,185,129,0.2), inset 0 0 60px rgba(255,255,255,0.1)',
          }}
          animate={{
            scale: [1, 1.05, 1],
            rotate: [0, 2, -2, 0],
            boxShadow: [
              '0 0 60px rgba(16,185,129,0.4), 0 0 120px rgba(16,185,129,0.2)',
              '0 0 80px rgba(16,185,129,0.6), 0 0 160px rgba(16,185,129,0.3)',
              '0 0 60px rgba(16,185,129,0.4), 0 0 120px rgba(16,185,129,0.2)',
            ],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <motion.span
            className="font-black text-4xl sm:text-5xl text-white tracking-tight"
            animate={{ textShadow: ['0 0 20px rgba(255,255,255,0.5)', '0 0 40px rgba(255,255,255,0.8)', '0 0 20px rgba(255,255,255,0.5)'] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            AW
          </motion.span>
          <motion.div
            className="absolute -inset-2 rounded-2xl border-2 border-emerald-400/50"
            animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0.2, 0.6] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
          />
        </motion.div>

        <motion.div className="text-center" style={{ opacity: taglineProgress }}>
          <motion.h2
            className="font-extrabold text-2xl sm:text-3xl text-white mb-2"
            variants={textVariants}
          >
            MEET AIRWISE AI
          </motion.h2>
          <motion.p
            className="text-lg sm:text-xl text-emerald-200 font-medium"
            variants={textVariants}
            style={{ transitionDelay: '100ms' }}
          >
            Your Personal Urban Air Quality Assistant
          </motion.p>
        </motion.div>
      </motion.div>

      <motion.div
        className="relative z-10 mt-8"
        variants={itemVariants}
        style={{ opacity: phoneProgress }}
      >
        <motion.div
          className="relative w-72 h-[150px] sm:w-80 sm:h-[170px] rounded-2xl overflow-hidden"
          style={{
            background: '#0f172a',
            border: '8px solid #1e293b',
            borderTopWidth: '24px',
            borderBottomWidth: '16px',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05), inset 0 1px 0 rgba(255,255,255,0.1)',
            borderRadius: '28px',
          }}
          animate={{ y: [0, -10, 0], rotateX: [0, 5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <motion.div
            className="absolute inset-0 p-4"
            style={{ background: 'linear-gradient(180deg, #0f172a 0%, #1e3a2e 100%)' }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-900/50 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="font-bold text-white text-sm">Hyderabad</span>
              </div>
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider">AQI</div>
                <div className="font-black text-2xl text-emerald-400">165</div>
                <div className="text-[10px] text-amber-400">Moderate</div>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider">PM2.5</div>
                <div className="font-black text-2xl text-amber-400">68.4</div>
                <div className="text-[10px] text-slate-500">µg/m³</div>
              </div>
            </div>
            <div className="mt-3 h-16 bg-slate-800/50 rounded-xl border border-slate-700 relative overflow-hidden">
              <motion.div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(180deg, rgba(16,185,129,0.3) 0%, rgba(16,185,129,0) 100%)',
                }}
              />
              <motion.path
                d="M0,80 Q20,60 40,70 T80,50 T120,60 T160,40 T200,50 T240,30 T280,40 T320,20"
                stroke="#10b981"
                strokeWidth="2"
                fill="none"
                className="absolute inset-0"
                animate={{ pathLength: [0, 1] }}
                transition={{ duration: 2, delay: 0.5 }}
              />
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function Scene3_LiveAQI({ progress, airQualityData, isActive }) {
  const dashboardProgress = Math.min(1, progress * 1.2);
  const chartProgress = Math.max(0, (progress - 0.3) / 0.4);
  const forecastProgress = Math.max(0, (progress - 0.6) / 0.4);

  const pollutants = airQualityData?.pollutants;
  const aqiInfo = airQualityData?.india_aqi;
  const hourly = airQualityData?.hourly_trend || [];
  const daily = airQualityData?.daily_forecast || [];

  const chartData = hourly.map((item) => {
    const timeLabel = item.time.includes('T') ? item.time.split('T')[1].slice(0, 5) : item.time;
    return {
      time: timeLabel,
      india_aqi: item.india_aqi,
      pm2_5: item.pm2_5,
      pm10: item.pm10,
      category: item.category,
      color: item.color,
    };
  });

  return (
    <motion.div
      className="relative h-full w-full flex flex-col items-center justify-center overflow-hidden p-4"
      initial="hidden"
      animate={isActive ? "visible" : "hidden"}
      variants={containerVariants}
      style={{ background: '#0f172a' }}
    >
      <motion.div
        className="w-full max-w-4xl h-full flex flex-col gap-4"
        variants={itemVariants}
        style={{ opacity: dashboardProgress }}
      >
        <motion.div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <motion.div
              className="w-10 h-10 rounded-xl bg-emerald-900/50 flex items-center justify-center"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <MapPin className="w-5 h-5 text-emerald-400" />
            </motion.div>
            <motion.h2 className="font-black text-xl sm:text-2xl text-white">Hyderabad</motion.h2>
          </div>
          <motion.div className="flex items-center space-x-2 text-xs text-slate-400">
            <span className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-900/50 text-emerald-400 border border-emerald-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>LIVE</span>
            </span>
          </motion.div>
        </motion.div>

        <motion.div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <motion.div className="lg:col-span-2 bg-slate-800/50 rounded-2xl p-4 border border-slate-700">
            <AqiIndicator aqiInfo={aqiInfo} usAqi={airQualityData?.us_aqi} />
          </motion.div>

          <motion.div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Key Pollutants</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <PollutantCard code="pm2_5" value={pollutants?.pm2_5} />
              <PollutantCard code="pm10" value={pollutants?.pm10} />
              <PollutantCard code="no2" value={pollutants?.no2} />
              <PollutantCard code="o3" value={pollutants?.o3} />
              <PollutantCard code="so2" value={pollutants?.so2} />
              <PollutantCard code="co" value={pollutants?.co} />
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700"
          variants={itemVariants}
          style={{ opacity: chartProgress }}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-bold text-white text-sm">24-Hour Air Quality Progression</h3>
              <p className="text-xs text-slate-400">Hourly trajectory showing diurnal inversion patterns</p>
            </div>
          </div>
          {chartData.length > 0 && (
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="aqiGradientReel" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                  <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#64748b' }} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#64748b' }} tickLine={false} />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-slate-900 text-white p-2 rounded-lg text-xs shadow-xl space-y-1">
                            <p className="font-semibold text-slate-300">Time: {label}</p>
                            <p className="font-bold text-sm text-emerald-400">AQI: {data.india_aqi} ({data.category})</p>
                            <p className="text-[10px] text-slate-300">PM2.5: {data.pm2_5} µg/m³ | PM10: {data.pm10} µg/m³</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="india_aqi"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#aqiGradientReel)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </motion.div>

        <motion.div
          className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700"
          variants={itemVariants}
          style={{ opacity: forecastProgress }}
        >
          <div className="mb-3">
            <h3 className="font-bold text-white text-sm">3-Day Air Quality Outlook</h3>
            <p className="text-xs text-slate-400">Forecasted trends to help you plan outdoor activities</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {daily.slice(0, 3).map((item, idx) => (
              <motion.div
                key={idx}
                className="bg-slate-900/50 rounded-xl p-3 border border-slate-700"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-1">
                    <span className="font-bold text-white text-sm">{idx === 0 ? 'Today' : idx === 1 ? 'Tomorrow' : 'Day 3'}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ backgroundColor: `${item.color}30`, color: item.color }}>
                    {item.category}
                  </span>
                </div>
                <div className="text-center">
                  <div className="font-black text-2xl text-white">{item.avg_aqi}</div>
                  <div className="text-[10px] text-slate-500">{item.min_aqi} – {item.max_aqi}</div>
                </div>
                <p className="text-[10px] text-slate-500 mt-2 leading-relaxed">{item.recommendation}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function Scene4_AIAssistant({ progress, _airQualityData, isActive }) {
  const chatProgress = Math.min(1, progress * 1.2);
  const responseProgress = Math.max(0, (progress - 0.5) / 0.5);

  const messages = [
    { role: 'user', content: "What should I do today to stay safer during high pollution?" },
    { role: 'assistant', content: `Based on Hyderabad's current AQI of 165 (Moderate), here are personalized recommendations:

**Transport:** Take Hyderabad Metro instead of two-wheeler for your 12km commute – saves ~1.8 kg CO₂ and avoids direct exhaust exposure.

**Outdoor Activity:** Shift morning cycling indoors (6-9 AM inversion peak). Evening walk after 7 PM when boundary layer lifts.

**Indoor Air:** Cross-ventilate 1-3 PM (solar midday window). Run purifier on Auto mode. Seal street-facing windows during morning inversion.

**Vehicle:** Turn off engine at signals >60s. Carpool when possible.

**Protection:** Wear N95/FFP2 when outdoors during peak hours. Surgical/cloth masks offer <35% PM2.5 filtration.` },
  ];

  return (
    <motion.div
      className="relative h-full w-full flex flex-col items-center justify-center overflow-hidden"
      initial="hidden"
      animate={isActive ? "visible" : "hidden"}
      variants={containerVariants}
      style={{ background: 'linear-gradient(180deg, #0f172a 0%, #1e1b4b 100%)' }}
    >
      <motion.div
        className="w-full max-w-md h-[85%] bg-slate-900/80 rounded-2xl border border-slate-700 flex flex-col overflow-hidden"
        variants={itemVariants}
        style={{ opacity: chatProgress, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-950/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">AirWise AI</div>
              <div className="text-[10px] text-emerald-400 flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Gemini 2.0 • Hyderabad</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence mode="popLayout">
            {messages.map((m, idx) => (
              <motion.div
                key={idx}
                className={`flex items-start space-x-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: idx === 0 ? 1 : (responseProgress > 0.3 ? 1 : 0), y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: idx * 0.2, duration: 0.4 }}
              >
                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold">
                  {m.role === 'user' ? (
                    <span className="bg-slate-700 text-white">U</span>
                  ) : (
                    <span className="bg-emerald-900/50 text-emerald-400 border border-emerald-800">AI</span>
                  )}
                </div>
                <motion.div
                  className={`max-w-[80%] rounded-2xl p-4 ${m.role === 'user' ? 'bg-slate-700 text-white rounded-tr-none' : 'bg-slate-800/50 text-slate-100 rounded-tl-none border border-slate-700'}`}
                  initial={{ opacity: 0, x: m.role === 'user' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="text-sm leading-relaxed whitespace-pre-wrap">{m.content}</div>
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>

          <motion.div
            className="flex items-center space-x-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: responseProgress > 0.6 ? 1 : 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="w-8 h-8 rounded-full bg-emerald-900/50 flex items-center justify-center border border-emerald-800">
              <Bot className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="flex items-center space-x-1 text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '0.1s' }} />
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '0.2s' }} />
              <span className="text-xs font-medium ml-1">Analyzing live smog context...</span>
            </div>
          </motion.div>
        </div>

        <div className="p-3 border-t border-slate-700 bg-slate-950/50">
          <div className="flex items-center space-x-2">
            <motion.button
              className="px-3 py-1.5 bg-slate-700 text-slate-200 text-xs font-medium rounded-full hover:bg-slate-600 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Is it safe to exercise outside?
            </motion.button>
            <motion.button
              className="px-3 py-1.5 bg-slate-700 text-slate-200 text-xs font-medium rounded-full hover:bg-slate-600 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Improve indoor air quality
            </motion.button>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center"
        animate={{ opacity: isActive ? 1 : 0 }}
      >
        <p className="text-xs text-slate-500">Context: Hyderabad • AQI 165 • Moderate • Transit: Two-Wheeler</p>
      </motion.div>
    </motion.div>
  );
}

function Scene5_SmarterLifestyle({ progress, isActive }) {
  const montageProgress = Math.min(1, progress * 1.2);
  const textProgress = Math.max(0, (progress - 0.7) / 0.3);

  const scenes = [
    { icon: '🚇', label: 'Metro Commute', color: '#10b981' },
    { icon: '🚴', label: 'Cycling (Good AQI)', color: '#06b6d4' },
    { icon: '🏠', label: 'Indoor Air Quality', color: '#8b5cf6' },
    { icon: '♻️', label: 'Sustainable Habits', color: '#f59e0b' },
    { icon: '🌳', label: 'Green Urban Spaces', color: '#22c55e' },
  ];

  return (
    <motion.div
      className="relative h-full w-full flex flex-col items-center justify-center overflow-hidden"
      initial="hidden"
      animate={isActive ? "visible" : "hidden"}
      variants={containerVariants}
      style={{ background: 'linear-gradient(180deg, #0f172a 0%, #14532d 100%)' }}
    >
      <motion.div
        className="relative z-10 grid grid-cols-2 md:grid-cols-5 gap-3 w-full max-w-5xl px-4"
        variants={itemVariants}
        style={{ opacity: montageProgress }}
      >
        {scenes.map((scene, idx) => (
          <motion.div
            key={idx}
            className="aspect-square rounded-2xl overflow-hidden relative group cursor-pointer"
            style={{
              background: `linear-gradient(135deg, ${scene.color}20 0%, ${scene.color}40 100%)`,
              border: `1px solid ${scene.color}40`,
            }}
            initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ delay: idx * 0.08, duration: 0.5 }}
            whileHover={{ scale: 1.03, zIndex: 10, boxShadow: `0 20px 40px -10px ${scene.color}40` }}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
              <motion.span
                className="text-5xl sm:text-6xl mb-2"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: idx * 0.2 }}
              >
                {scene.icon}
              </motion.span>
              <span className="font-bold text-white text-sm sm:text-base">{scene.label}</span>
            </div>
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100"
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className="relative z-10 mt-8 px-6 text-center"
        variants={itemVariants}
        style={{ opacity: textProgress }}
      >
        <motion.h2
          className="font-black text-2xl sm:text-3xl md:text-4xl text-white leading-tight tracking-tight"
          variants={textVariants}
        >
          SMALL ACTIONS.
          <br />
          <span className="text-emerald-400">SMARTER CHOICES.</span>
          <br />
          CLEANER FUTURE.
        </motion.h2>
      </motion.div>
    </motion.div>
  );
}

function Scene6_EnvironmentalImpact({ progress, impactStats, isActive }) {
  const counterProgress = Math.min(1, progress * 1.2);
  const chartProgress = Math.max(0, (progress - 0.3) / 0.4);
  const networkProgress = Math.max(0, (progress - 0.6) / 0.4);

  const weeklyChartData = [
    { day: 'Mon', co2: 0.8 },
    { day: 'Tue', co2: 1.4 },
    { day: 'Wed', co2: 1.8 },
    { day: 'Thu', co2: 0.9 },
    { day: 'Fri', co2: 2.1 },
    { day: 'Sat', co2: 1.2 },
    { day: 'Today', co2: Number(impactStats.co2AvoidedKg.toFixed(1)) },
  ];

  const categoryCounts = {};
  impactStats.loggedActions.forEach((act) => {
    const cat = act.category || 'Transit';
    categoryCounts[cat] = (categoryCounts[cat] || 0) + (act.co2SavedKg || 1);
  });

  const pieData = Object.keys(categoryCounts).map((cat) => ({
    name: cat,
    value: Number(categoryCounts[cat].toFixed(1)),
    color: { Transit: '#10b981', Vehicle: '#0ea5e9', Indoor: '#f59e0b', Energy: '#8b5cf6', Lifestyle: '#ec4899' }[cat] || '#64748b',
  }));

  return (
    <motion.div
      className="relative h-full w-full flex flex-col items-center justify-center overflow-hidden p-4"
      initial="hidden"
      animate={isActive ? "visible" : "hidden"}
      variants={containerVariants}
      style={{ background: 'linear-gradient(180deg, #0f172a 0%, #422006 100%)' }}
    >
      <motion.div
        className="w-full max-w-4xl h-full flex flex-col gap-4"
        variants={itemVariants}
        style={{ opacity: counterProgress }}
      >
        <motion.div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <ImpactCounter label="CO₂ Avoided" value={impactStats.co2AvoidedKg.toFixed(1)} unit="kg" icon="🌱" color="#10b981" delay={0} />
          <ImpactCounter label="Actions" value={impactStats.actionsCompleted} unit="habits" icon="⚡" iconColor="#0ea5e9" color="#0ea5e9" delay={0.1} />
          <ImpactCounter label="Trips Saved" value={impactStats.tripsReduced} unit="trips" icon="🚆" iconColor="#8b5cf6" color="#8b5cf6" delay={0.2} />
          <ImpactCounter label="Community" value="12.8K+" unit="members" icon="👥" iconColor="#f59e0b" color="#f59e0b" delay={0.3} />
        </motion.div>

        <motion.div className="grid grid-cols-1 lg:grid-cols-3 gap-4" style={{ opacity: chartProgress }}>
          <motion.div className="lg:col-span-2 bg-slate-800/50 rounded-2xl p-4 border border-slate-700">
            <h3 className="font-bold text-white text-sm mb-4">7-Day CO₂ Avoidance Trajectory</h3>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#64748b' }} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#64748b' }} tickLine={false} />
                  <Tooltip
                    formatter={(val) => [`${val} kg CO₂ avoided`, 'Avoided']}
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '12px' }}
                  />
                  <Bar dataKey="co2" fill="#10b981" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-white text-sm mb-4">Impact by Category</h3>
              <div className="h-48 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData.length ? pieData : [{ name: 'Transit', value: 1, color: '#10b981' }]}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={40}
                      outerRadius={60}
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
            <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-700">
              {pieData.map((d, i) => (
                <span key={i} className="flex items-center space-x-1 font-semibold text-slate-300 text-xs">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                  <span>{d.name}</span>
                </span>
              ))}
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700"
          style={{ opacity: networkProgress }}
        >
          <h3 className="font-bold text-white text-sm mb-4">Community Network Effect</h3>
          <div className="h-32 relative">
            <CommunityNetwork />
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function ImpactCounter({ label, value, unit, icon, iconColor, color, delay }) {
  const [displayValue, setDisplayValue] = useState(0);
  const targetValue = parseFloat(value);

  useEffect(() => {
    const duration = 1500;
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(targetValue * eased);
      if (progress < 1) requestAnimationFrame(animate);
    };
    const timer = setTimeout(animate, delay * 1000);
    return () => clearTimeout(timer);
  }, [targetValue, delay]);

  return (
    <motion.div
      className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
    >
      <span className="text-3xl mb-1 block" style={{ color: iconColor }}>{icon}</span>
      <div className="font-black text-2xl sm:text-3xl text-white" style={{ color }}>
        {displayValue.toFixed(targetValue % 1 === 0 ? 0 : 1)}
      </div>
      <div className="text-[10px] text-slate-400 uppercase tracking-wider">{label}</div>
      <div className="text-[10px] text-slate-500">{unit}</div>
    </motion.div>
  );
}

const INITIAL_NETWORK_NODES = Array.from({ length: 12 }, (_, i) => {
  const angle = (i / 12) * Math.PI * 2;
  const radius = 60 + ((i * 17) % 40);
  return {
    id: i,
    x: 160 + Math.cos(angle) * radius,
    y: 80 + Math.sin(angle) * radius,
    angle,
    radius,
    speed: 0.0005 + ((i * 7) % 10) * 0.0001,
    color: ['#10b981', '#06b6d4', '#8b5cf6', '#f59e0b', '#ec4899'][i % 5],
  };
});

function CommunityNetwork() {
  const [networkNodes, setNetworkNodes] = useState(INITIAL_NETWORK_NODES);

  useEffect(() => {
    const interval = setInterval(() => {
      setNetworkNodes((prev) =>
        prev.map((n) => {
          const nextAngle = n.angle + n.speed;
          return {
            ...n,
            angle: nextAngle,
            x: 160 + Math.cos(nextAngle) * n.radius,
            y: 80 + Math.sin(nextAngle) * n.radius,
          };
        })
      );
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <svg className="w-full h-full" viewBox="0 0 320 160">
      <defs>
        <radialGradient id="pulseGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
        </radialGradient>
      </defs>
      {networkNodes.map((p, i) => (
        <g key={i}>
          {networkNodes.map((n, j) => {
            if (j <= i) return null;
            const p2 = networkNodes[j];
            if (!p2) return null;
            const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
            if (dist > 100) return null;
            return (
              <line
                key={`${i}-${j}`}
                x1={p.x} y1={p.y}
                x2={p2.x} y2={p2.y}
                stroke="#10b981"
                strokeWidth="0.5"
                strokeOpacity={0.3 * (1 - dist / 100)}
              />
            );
          })}
        </g>
      ))}
      {networkNodes.map((p, i) => (
        <g key={i}>
          <circle
            cx={p.x} cy={p.y} r={20}
            fill="url(#pulseGrad)"
            animate={{ r: [4, 20, 4], opacity: [0.3, 0.1, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, delay: i * 0.2 }}
          />
          <circle
            cx={p.x} cy={p.y} r={6}
            fill={p.color}
            filter="drop-shadow(0 0 4px currentColor)"
          />
        </g>
      ))}
    </svg>
  );
}

function Scene7_BrandReveal({ progress, isActive }) {
  const cityProgress = Math.min(1, progress * 1.2);
  const logoProgress = Math.max(0, (progress - 0.3) / 0.4);
  const ctaProgress = Math.max(0, (progress - 0.6) / 0.4);

  return (
    <motion.div
      className="relative h-full w-full flex flex-col items-center justify-center overflow-hidden"
      initial="hidden"
      animate={isActive ? "visible" : "hidden"}
      variants={containerVariants}
      style={{ background: 'linear-gradient(180deg, #0f172a 0%, #064e3b 50%, #0f172a 100%)' }}
    >
      <motion.div
        className="absolute inset-0"
        animate={{ opacity: cityProgress }}
      >
        <div className="absolute bottom-0 left-0 right-0 h-1/2" style={{ background: 'linear-gradient(to top, #064e3b 0%, transparent 100%)' }} />
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-emerald-900/30" />
      </motion.div>

      <motion.div
        className="relative z-10 flex flex-col items-center space-y-6"
        variants={itemVariants}
        style={{ opacity: logoProgress }}
      >
        <motion.div
          className="w-32 h-32 rounded-2xl flex items-center justify-center relative"
          style={{
            background: 'linear-gradient(135deg, #10b981 0%, #0f766e 100%)',
            boxShadow: '0 0 80px rgba(16,185,129,0.5), 0 0 160px rgba(16,185,129,0.25), inset 0 0 80px rgba(255,255,255,0.1)',
          }}
          animate={{
            scale: [1, 1.03, 1],
            rotate: [0, 1, -1, 0],
            boxShadow: [
              '0 0 80px rgba(16,185,129,0.5), 0 0 160px rgba(16,185,129,0.25)',
              '0 0 100px rgba(16,185,129,0.7), 0 0 200px rgba(16,185,129,0.35)',
              '0 0 80px rgba(16,185,129,0.5), 0 0 160px rgba(16,185,129,0.25)',
            ],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span className="font-black text-5xl text-white tracking-tight">AW</span>
          <motion.div
            className="absolute -inset-3 rounded-2xl border-2 border-emerald-400/50"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
          />
        </motion.div>

        <motion.div className="text-center space-y-2">
          <motion.p className="font-medium text-emerald-300 text-sm">Powered by AI</motion.p>
          <motion.p className="font-medium text-emerald-300 text-sm">Inspired by a Cleaner Future</motion.p>
        </motion.div>
      </motion.div>

      <motion.div
        className="relative z-10 text-center space-y-4"
        variants={itemVariants}
        style={{ opacity: ctaProgress }}
      >
        <motion.h2
          className="font-black text-2xl sm:text-3xl text-white leading-tight"
          variants={textVariants}
        >
          BREATHING BETTER STARTS WITH
          <br />
          <span className="text-emerald-400">SMARTER CHOICES</span>
        </motion.h2>

        <motion.div className="flex items-center justify-center space-x-4" variants={textVariants} style={{ transitionDelay: '200ms' }}>
          <motion.button
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition-colors flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Smartphone className="w-4 h-4" />
            <span>TRY AIRWISE AI TODAY</span>
          </motion.button>
          <motion.button
            className="px-6 py-3 bg-slate-800/50 hover:bg-slate-700/50 text-white font-bold text-sm rounded-xl transition-colors border border-slate-600 flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Download className="w-4 h-4" />
            <span>DOWNLOAD</span>
          </motion.button>
        </motion.div>

        <motion.div
          className="text-xs text-slate-500 border-t border-slate-700/50 pt-4 mt-4"
          variants={textVariants}
          style={{ transitionDelay: '400ms' }}
        >
          PROMPTWARS CHALLENGE 06
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

const SceneComponents = [
  Scene1_TheProblem,
  Scene2_MeetAirWise,
  Scene3_LiveAQI,
  Scene4_AIAssistant,
  Scene5_SmarterLifestyle,
  Scene6_EnvironmentalImpact,
  Scene7_BrandReveal,
];

export default function ReelModePage() {
  const { airQualityData, impactStats } = useApp();
  const [currentScene, setCurrentScene] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [volume, setVolume] = useState(1);
  const startTimeRef = useRef(null);
  const animationRef = useRef(null);
  const containerRef = useRef(null);
  const progressRef = useRef(progress);

  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  const animate = useCallback(function tick() {
    if (!isPlaying) return;
    const elapsed = (Date.now() - startTimeRef.current) / 1000;
    const newProgress = Math.min((elapsed / TOTAL_DURATION) * 100, 100);
    setProgress(newProgress);

    const sceneIndex = Math.min(Math.floor((newProgress / 100) * sceneConfig.length), sceneConfig.length - 1);
    setCurrentScene(sceneIndex);

    if (newProgress >= 100) {
      setIsPlaying(false);
      setProgress(0);
      setCurrentScene(0);
    } else {
      animationRef.current = requestAnimationFrame(tick);
    }
  }, [isPlaying]);

  useEffect(() => {
    if (isPlaying) {
      startTimeRef.current = Date.now() - (progressRef.current / 100) * TOTAL_DURATION * 1000;
      animationRef.current = requestAnimationFrame(animate);
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying, animate]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      startTimeRef.current = Date.now() - (progress / 100) * TOTAL_DURATION * 1000;
    }
  };

  const seek = (newProgress) => {
    setProgress(newProgress);
    if (!isPlaying) {
      startTimeRef.current = Date.now() - (newProgress / 100) * TOTAL_DURATION * 1000;
    }
  };

  const goToScene = (sceneIndex) => {
    const sceneStartProgress = (sceneIndex / sceneConfig.length) * 100;
    seek(sceneStartProgress);
    setCurrentScene(sceneIndex);
  };

  const toggleFullscreen = async () => {
    if (!isFullscreen && containerRef.current) {
      try {
        await containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } catch (e) {
        console.warn('Fullscreen failed:', e);
      }
    } else if (isFullscreen) {
      try {
        await document.exitFullscreen();
        setIsFullscreen(false);
      } catch (e) {
        console.warn('Exit fullscreen failed:', e);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.code === 'Space') {
      e.preventDefault();
      togglePlay();
    } else if (e.code === 'ArrowLeft') {
      seek(Math.max(0, progress - 5));
    } else if (e.code === 'ArrowRight') {
      seek(Math.min(100, progress + 5));
    } else if (e.code === 'KeyF') {
      toggleFullscreen();
    } else if (e.code === 'KeyM') {
      setVolume(volume > 0 ? 0 : 1);
    } else if (e.code === 'KeyH') {
      setShowControls(!showControls);
    } else if (e.code >= 'Digit1' && e.code <= 'Digit7') {
      const sceneNum = parseInt(e.code.replace('Digit', '')) - 1;
      if (sceneNum < sceneConfig.length) goToScene(sceneNum);
    }
  };

  const handleKeyDownRef = useRef(handleKeyDown);
  useEffect(() => {
    handleKeyDownRef.current = handleKeyDown;
  });

  useEffect(() => {
    const onKey = (e) => handleKeyDownRef.current(e);
    window.addEventListener('keydown', onKey);
    const onFsChange = () => {
      if (!document.fullscreenElement) setIsFullscreen(false);
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('fullscreenchange', onFsChange);
    };
  }, []);

  const CurrentSceneComponent = SceneComponents[currentScene];
  const sceneProps = [1, 2, 3, 4].includes(currentScene + 1)
    ? { airQualityData, impactStats }
    : currentScene + 1 === 6
    ? { impactStats }
    : {};

  return (
    <motion.div
      ref={containerRef}
      className="relative min-h-screen w-full bg-slate-950 text-white font-sans overflow-hidden"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <CurrentSceneComponent
            key={currentScene}
            progress={progress / 100}
            isActive={true}
            {...sceneProps}
          />
        </AnimatePresence>
      </div>

      {showControls && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 z-50 p-4 pb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          style={{
            background: 'linear-gradient(to top, rgba(15,23,42,0.95) 0%, transparent 100%)',
          }}
        >
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <motion.button
                  onClick={togglePlay}
                  className="p-3 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                </motion.button>
                <div className="flex items-center space-x-1">
                  <motion.button onClick={() => seek(0)} className="p-2 rounded-lg bg-white/10 hover:bg-white/20" whileTap={{ scale: 0.9 }}><SkipBack className="w-5 h-5" /></motion.button>
                  <motion.button onClick={() => seek(Math.max(0, progress - 10))} className="p-2 rounded-lg bg-white/10 hover:bg-white/20" whileTap={{ scale: 0.9 }}><SkipBack className="w-5 h-5" /></motion.button>
                  <motion.button onClick={() => seek(Math.min(100, progress + 10))} className="p-2 rounded-lg bg-white/10 hover:bg-white/20" whileTap={{ scale: 0.9 }}><SkipForward className="w-5 h-5" /></motion.button>
                  <motion.button onClick={() => seek(100)} className="p-2 rounded-lg bg-white/10 hover:bg-white/20" whileTap={{ scale: 0.9 }}><SkipForward className="w-5 h-5" /></motion.button>
                </div>
                <div className="w-48 h-2 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${progress}%` }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.1 }}
                  />
                </div>
                <span className="text-xs text-slate-400 font-mono w-14 text-right">
                  {Math.floor(progress / 100 * TOTAL_DURATION).toString().padStart(2, '0')}s / {TOTAL_DURATION}s
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <motion.button onClick={() => setVolume(volume > 0 ? 0 : 1)} className="p-2 rounded-lg bg-white/10 hover:bg-white/20" whileTap={{ scale: 0.9 }}>
                  {volume > 0 ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                </motion.button>
                <motion.button onClick={toggleFullscreen} className="p-2 rounded-lg bg-white/10 hover:bg-white/20" whileTap={{ scale: 0.9 }}>
                  {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                </motion.button>
                <motion.button className="p-2 rounded-lg bg-white/10 hover:bg-white/20" whileTap={{ scale: 0.9 }}><Camera className="w-5 h-5" /></motion.button>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-1 overflow-x-auto pb-2 no-scrollbar">
              {sceneConfig.map((scene, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => goToScene(idx)}
                  className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    idx === currentScene
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                      : 'bg-white/10 text-slate-300 hover:bg-white/20'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ borderColor: scene.color }}
                >
                  {scene.name}
                </motion.button>
              ))}
            </div>

            <div className="flex items-center justify-center space-x-6 text-[10px] text-slate-500">
              <kbd className="px-2 py-0.5 bg-white/10 rounded">Space</kbd> Play/Pause
              <kbd className="px-2 py-0.5 bg-white/10 rounded">←/→</kbd> Seek ±10%
              <kbd className="px-2 py-0.5 bg-white/10 rounded">1-7</kbd> Jump Scene
              <kbd className="px-2 py-0.5 bg-white/10 rounded">F</kbd> Fullscreen
              <kbd className="px-2 py-0.5 bg-white/10 rounded">H</kbd> Hide Controls
              <kbd className="px-2 py-0.5 bg-white/10 rounded">M</kbd> Mute
            </div>
          </div>
        </motion.div>
      )}

      <motion.div
        className="absolute top-4 right-4 z-40 flex items-center space-x-2"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: showControls ? 1 : 0, x: 0 }}
      >
        <motion.button
          onClick={() => setShowControls(!showControls)}
          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur"
          whileTap={{ scale: 0.9 }}
        >
          {showControls ? <X className="w-5 h-5" /> : <Info className="w-5 h-5" />}
        </motion.button>
        {!showControls && (
          <motion.div className="bg-white/10 backdrop-blur rounded-lg px-3 py-2 text-xs text-slate-300">
            Press <kbd className="px-1.5 py-0.5 bg-white/20 rounded">H</kbd> for controls
          </motion.div>
        )}
      </motion.div>

      <motion.div
        className="absolute top-4 left-4 z-40 flex items-center space-x-2"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: showControls ? 1 : 0, x: 0 }}
      >
        <div className="bg-white/10 backdrop-blur rounded-lg px-3 py-2 text-xs text-slate-300 font-mono">
          Scene {currentScene + 1} / {sceneConfig.length}
        </div>
      </motion.div>
    </motion.div>
  );
}