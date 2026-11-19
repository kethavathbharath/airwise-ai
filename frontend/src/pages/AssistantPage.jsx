import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Bot,
  User,
  Trash2,
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  ShieldAlert,
  MapPin,
  HelpCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { sendChatMessage } from '../services/api';

const QUICK_PROMPTS = [
  'What should I do today?',
  'Is it safe to exercise outside?',
  'How can I reduce pollution exposure?',
  'Suggest an eco-friendly travel plan.',
  'How can I improve indoor air quality?',
  'I commute by bike to college in severe pollution, what should I do?',
];

export default function AssistantPage() {
  const { currentCity, airQualityData, userProfile, configStatus } = useApp();

  const [messages, setMessages] = useState(() => {
    const saved = sessionStorage.getItem('airwise_chat');
    if (saved) return JSON.parse(saved);
    return [
      {
        role: 'assistant',
        content: `👋 Hello ${userProfile?.name || 'there'}! I'm **AirWise AI**, your personal urban air quality assistant.\n\nI have live atmospheric context for **${currentCity}** (Current AQI: **${airQualityData?.india_aqi?.aqi || 165}** – *${airQualityData?.india_aqi?.category || 'Moderate'}*).\n\nHow can I help you safely navigate pollution today? You can choose a quick topic below or type any question!`,
        timestamp: new Date().toISOString(),
      },
    ];
  });

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    sessionStorage.setItem('airwise_chat', JSON.stringify(messages));
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleSend(textToSend) {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg = {
      role: 'user',
      content: query.trim(),
      timestamp: new Date().toISOString(),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await sendChatMessage(
        newMessages.map((m) => ({ role: m.role, content: m.content })),
        currentCity,
        airQualityData?.india_aqi?.aqi,
        airQualityData?.pollutants,
        userProfile
      );

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: response.reply,
          modelUsed: response.model_used,
          mode: response.mode,
          timestamp: new Date().toISOString(),
        },
      ]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `⚠️ I encountered a temporary connection issue reaching the AI backend. Please check your network or try again shortly.`,
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleClear() {
    if (window.confirm('Clear conversation history?')) {
      const initial = [
        {
          role: 'assistant',
          content: `Conversation reset. I'm ready to assist with your commute, indoor air, and smog precautions in **${currentCity}**.`,
          timestamp: new Date().toISOString(),
        },
      ];
      setMessages(initial);
      sessionStorage.setItem('airwise_chat', JSON.stringify(initial));
    }
  }

  function copyMessage(text, idx) {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  }

  // Simple Markdown parser for bold, headers, and lists
  function renderFormattedMessage(content) {
    return (
      <div className="space-y-2 text-xs sm:text-sm leading-relaxed">
        {content.split('\n\n').map((paragraph, pIdx) => {
          if (paragraph.startsWith('### ')) {
            return (
              <h4 key={pIdx} className="font-extrabold text-slate-900 text-sm sm:text-base mt-2 mb-1">
                {paragraph.replace('### ', '')}
              </h4>
            );
          }
          if (paragraph.startsWith('#### ')) {
            return (
              <h5 key={pIdx} className="font-bold text-slate-800 text-xs sm:text-sm mt-2 text-emerald-700">
                {paragraph.replace('#### ', '')}
              </h5>
            );
          }
          if (paragraph.startsWith('- ') || paragraph.startsWith('1. ')) {
            return (
              <ul key={pIdx} className="space-y-1 my-1 pl-4 list-disc text-slate-700">
                {paragraph.split('\n').map((line, lIdx) => (
                  <li key={lIdx}>
                    <span dangerouslySetInnerHTML={{ __html: formatInline(line.replace(/^[-*•]\s+|\d+\.\s+/, '')) }} />
                  </li>
                ))}
              </ul>
            );
          }
          return (
            <p key={pIdx} dangerouslySetInnerHTML={{ __html: formatInline(paragraph) }} />
          );
        })}
      </div>
    );
  }

  function formatInline(str) {
    return str
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code class="bg-slate-100 px-1 py-0.5 rounded text-emerald-700 font-mono text-[11px]">$1</code>');
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4 pb-12">
      {/* Header Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-700 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-extrabold text-slate-900 text-base sm:text-lg">
                AirWise Personal Assistant
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                {configStatus.gemini_configured ? 'Gemini 2.0' : 'Intelligent Model'}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-slate-500 mt-0.5">
              <span className="flex items-center space-x-1">
                <MapPin className="w-3 h-3 text-emerald-600" />
                <span>{currentCity}</span>
              </span>
              <span>•</span>
              <span>AQI: {airQualityData?.india_aqi?.aqi || '165'} ({airQualityData?.india_aqi?.category || 'Moderate'})</span>
              <span>•</span>
              <span className="text-slate-400">Transit: {userProfile?.transport_method || 'Bike'}</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleClear}
          className="self-end sm:self-center flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors"
          title="Clear chat history"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Chat</span>
        </button>
      </div>

      {/* Quick Suggestion Chips */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
          Quick Questions
        </span>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {QUICK_PROMPTS.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              className="shrink-0 px-3 py-1.5 rounded-full bg-white border border-slate-200/90 hover:border-emerald-500 hover:bg-emerald-50 text-xs text-slate-700 hover:text-emerald-800 font-medium transition-all shadow-2xs"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs min-h-[460px] max-h-[580px] flex flex-col justify-between overflow-hidden">
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {messages.map((m, idx) => {
            const isUser = m.role === 'user';
            return (
              <div
                key={idx}
                className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                    isUser
                      ? 'bg-slate-900 text-white'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Bubble */}
                <div
                  className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 shadow-2xs relative group ${
                    isUser
                      ? 'bg-slate-900 text-white rounded-tr-none'
                      : 'bg-slate-50 text-slate-800 rounded-tl-none border border-slate-200/80'
                  }`}
                >
                  {renderFormattedMessage(m.content)}

                  {/* Actions / Meta */}
                  <div
                    className={`mt-2 pt-2 border-t flex items-center justify-between text-[10px] ${
                      isUser ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-400'
                    }`}
                  >
                    <span>
                      {m.timestamp ? new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      {m.modelUsed && ` • ${m.modelUsed}`}
                    </span>

                    {!isUser && (
                      <button
                        onClick={() => copyMessage(m.content, idx)}
                        className="hover:text-emerald-600 flex items-center space-x-1"
                        title="Copy text"
                      >
                        {copiedIdx === idx ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="text-emerald-600 font-semibold">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center border border-emerald-300">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl rounded-tl-none p-3.5 flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]" />
                <span className="text-xs text-slate-500 font-medium pl-1">Analyzing live smog context...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input Field */}
        <div className="p-3 sm:p-4 bg-slate-50/80 border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Ask about precautions, indoor air, or transit in ${currentCity}...`}
              disabled={loading}
              className="flex-1 bg-white border border-slate-300 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white rounded-xl font-bold transition-all shadow-md shadow-emerald-500/15 cursor-pointer disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 px-1">
            <span>AirWise AI provides environmental health guidance; not a substitute for clinical medical care.</span>
            <span className="hidden sm:inline">Press Enter to send</span>
          </div>
        </div>
      </div>
    </div>
  );
}
