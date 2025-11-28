
import React from 'react';
import { CheckCircle, XCircle, Trophy } from 'lucide-react';
import { aeoAiPresence, aeoStrategyMetrics } from '../../lib/dashboard-data';

const AEODashboard: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Top Section: Score & Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Radial Score Card */}
        <div className="p-6 rounded-3xl bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-lg dark:shadow-black/20 flex flex-col items-center justify-center relative overflow-hidden hover:scale-[1.02] transition-transform">
            <div className="relative w-40 h-40 flex items-center justify-center">
                {/* SVG Radial Progress with proper viewBox for responsive scaling */}
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
                    <circle
                        cx="80"
                        cy="80"
                        r="70"
                        stroke="currentColor"
                        strokeWidth="10"
                        fill="transparent"
                        className="text-gray-200 dark:text-white/5"
                    />
                    <circle
                        cx="80"
                        cy="80"
                        r="70"
                        stroke="currentColor"
                        strokeWidth="10"
                        fill="transparent"
                        strokeDasharray={440}
                        strokeDashoffset={440 - (440 * 72) / 100}
                        className="text-icy-main transition-all duration-1000 ease-out"
                        strokeLinecap="round"
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">72</span>
                    <span className="text-xs text-gray-500">/ 100</span>
                </div>
            </div>
            <div className="mt-4 text-center">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">AEO Score</h3>
                <p className="text-xs text-gray-500">Good Visibility</p>
            </div>
        </div>

        {/* Summary Text */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-lg dark:shadow-black/20 flex flex-col justify-center">
            <div className="mb-2">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Your Brand</h3>
                <div className="text-xs text-gray-500 flex gap-4 mt-1">
                    <span>Last updated: Today</span>
                    <span className="text-icy-main">https://example.com</span>
                </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mt-4">
                Exceptional! Your Company's AEO report indicates strong performance in Perplexity and ChatGPT. 
                However, Gemini visibility is low. Focusing on schema markup and direct answer formatting 
                will help capture the remaining market share.
            </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* AI Presence Grid */}
        <div className="p-6 rounded-3xl bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-lg dark:shadow-black/20">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">AI Presence</h3>
                <span className="text-xs font-bold px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full">68 Avg</span>
            </div>
            <div className="space-y-4">
                {aeoAiPresence.map((ai, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-white/50 dark:bg-white/5 border border-white/40 dark:border-white/5">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-xl bg-white dark:bg-white/10 ${ai.color} shadow-sm`}>
                                <ai.icon size={18} />
                            </div>
                            <span className="font-medium text-sm text-gray-900 dark:text-white">{ai.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            {ai.score > 50 ? (
                                <CheckCircle size={16} className="text-green-500" />
                            ) : (
                                <XCircle size={16} className="text-red-500" />
                            )}
                            <span className={`text-sm font-bold ${ai.score > 70 ? 'text-green-500' : ai.score > 40 ? 'text-yellow-500' : 'text-red-500'}`}>
                                {ai.score}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Competitor Landscape */}
        <div className="p-6 rounded-3xl bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-lg dark:shadow-black/20">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Competitor Landscape</h3>
                <span className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold text-xs shadow-sm">94</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
                Your company or product <span className="text-green-500 font-bold">was mentioned</span> in 
                industry/product related searches alongside these top competitors.
            </p>
            
            <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">Competitors Mentioned</h4>
            <div className="flex flex-wrap gap-2">
                {['Competitor A', 'Competitor B', 'Competitor C', 'StartUp X', 'Legacy Corp'].map((comp, i) => (
                    <span key={i} className="px-3 py-1.5 bg-white/50 dark:bg-white/10 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-medium flex items-center gap-2 border border-white/20 dark:border-white/5">
                        <span className="w-4 h-4 bg-gray-200 dark:bg-white/20 rounded flex items-center justify-center text-[8px] font-bold">{i+1}</span>
                        {comp}
                    </span>
                ))}
            </div>
        </div>

        {/* Strategy Review */}
        <div className="p-6 rounded-3xl bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-lg dark:shadow-black/20">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Strategy Review</h3>
                <div className="relative w-8 h-8">
                     <svg className="w-full h-full transform -rotate-90" viewBox="0 0 32 32">
                        <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="3" fill="transparent" className="text-gray-200 dark:text-white/10" />
                        <circle cx="16" cy="16" r="14" stroke="#f97316" strokeWidth="3" fill="transparent" strokeDasharray={88} strokeDashoffset={88 - (88 * 55) / 100} strokeLinecap="round" />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold">55</span>
                </div>
            </div>
            
            <div className="space-y-5">
                {aeoStrategyMetrics.map((metric, i) => (
                    <div key={i}>
                        <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-600 dark:text-gray-300 font-medium">{metric.label}</span>
                            <span className="font-bold text-gray-900 dark:text-white">{metric.value}</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-gradient-to-r from-gray-500 to-gray-700 dark:from-gray-400 dark:to-gray-200 rounded-full" 
                                style={{ width: `${metric.value}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default AEODashboard;
