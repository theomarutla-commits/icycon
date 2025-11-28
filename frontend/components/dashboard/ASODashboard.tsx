
import React from 'react';
import { Download, Activity, Star, RotateCcw, Split, Trophy } from 'lucide-react';
import { asoKeywords, competitors } from '../../lib/dashboard-data';

const AppStoreOptimizationDashboard: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Downloads", value: "8,240", change: "+12%", icon: <Download />, color: "text-blue-500" },
          { label: "Conversion Rate", value: "4.8%", change: "+0.5%", icon: <Activity />, color: "text-green-500" },
          { label: "Star Rating", value: "4.7", change: "0.0", icon: <Star />, color: "text-yellow-500" },
          { label: "Retention D30", value: "24%", change: "-1%", icon: <RotateCcw />, color: "text-purple-500" },
        ].map((m, i) => (
          <div key={i} className="p-6 rounded-3xl bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-lg dark:shadow-black/20 hover:scale-[1.02] transition-transform">
             <div className="flex justify-between items-start mb-2">
                <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">{m.label}</span>
                <span className={`p-2.5 rounded-xl bg-white/50 dark:bg-white/10 ${m.color} shadow-sm`}>{m.icon}</span>
             </div>
             <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{m.value}</div>
             <span className={`text-xs font-semibold ${m.change.includes('+') ? 'text-green-500' : m.change.includes('-') ? 'text-red-500' : 'text-gray-500'}`}>
                {m.change} vs last period
             </span>
          </div>
        ))}
      </div>

      {/* A/B Testing & Keyword Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* A/B Testing */}
        <div className="lg:col-span-1 p-6 rounded-3xl bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-lg dark:shadow-black/20">
           <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Split size={20} /> A/B Testing
              </h3>
              <span className="text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-500 font-bold border border-green-500/20">Live</span>
           </div>
           <p className="text-sm text-gray-500 mb-4">Experiment: New Screenshots</p>
           
           <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white/50 dark:bg-white/5 border border-green-500/50 relative overflow-hidden">
                 <div className="flex justify-between mb-2">
                    <span className="font-bold text-gray-900 dark:text-white">Variant A</span>
                    <span className="text-green-500 font-bold">5.2% CVR</span>
                 </div>
                 <div className="w-full h-2 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 w-[70%]" />
                 </div>
                 <div className="mt-2 text-xs text-gray-500">1,204 Samples • Winner (95% Conf.)</div>
              </div>
              
              <div className="p-4 rounded-2xl bg-white/50 dark:bg-white/5 border border-white/20 dark:border-white/5">
                 <div className="flex justify-between mb-2">
                    <span className="font-bold text-gray-900 dark:text-white">Variant B</span>
                    <span className="text-gray-500 font-bold">4.1% CVR</span>
                 </div>
                 <div className="w-full h-2 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gray-400 w-[50%]" />
                 </div>
                 <div className="mt-2 text-xs text-gray-500">1,180 Samples</div>
              </div>
           </div>
           <button className="w-full mt-6 py-2.5 rounded-xl bg-icy-main text-white font-bold text-sm shadow-lg shadow-icy-main/30 hover:brightness-110 transition-all">
              Apply Winner
           </button>
        </div>

        {/* Keyword Performance */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-lg dark:shadow-black/20 overflow-hidden">
           <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Keyword Performance</h3>
              <p className="text-sm text-gray-500">Tracking for App Store Search</p>
           </div>
           <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 dark:bg-white/5">
                <tr>
                  <th className="px-4 py-3 rounded-l-lg">Keyword</th>
                  <th className="px-4 py-3">Rank</th>
                  <th className="px-4 py-3">Traffic</th>
                  <th className="px-4 py-3 rounded-r-lg">Opportunity</th>
                </tr>
              </thead>
              <tbody>
                {asoKeywords.map((k, i) => (
                  <tr key={i} className="border-b border-gray-100/50 dark:border-white/5 hover:bg-white/50 dark:hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white min-w-[120px]">{k.term}</td>
                    <td className="px-4 py-3 font-bold text-gray-900 dark:text-white">#{k.rank}</td>
                    <td className="px-4 py-3 text-gray-500">{k.traffic}</td>
                    <td className="px-4 py-3 min-w-[100px]">
                        <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-icy-main" style={{ width: `${k.opportunity}%` }} />
                            </div>
                            <span className="text-xs text-gray-500">{k.opportunity}</span>
                        </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Competitor Analysis */}
      <div className="p-6 rounded-3xl bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-lg dark:shadow-black/20 overflow-hidden">
         <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Trophy size={20} className="text-yellow-500" /> Competitor Analysis
            </h3>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 dark:bg-white/5">
                <tr>
                  <th className="px-4 py-3 rounded-l-lg">Competitor</th>
                  <th className="px-4 py-3">Category Rank</th>
                  <th className="px-4 py-3">Est. Downloads</th>
                  <th className="px-4 py-3 rounded-r-lg">Rating</th>
                </tr>
              </thead>
              <tbody>
                {competitors.map((c, i) => (
                  <tr key={i} className="border-b border-gray-100/50 dark:border-white/5 hover:bg-white/50 dark:hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 font-bold text-gray-900 dark:text-white min-w-[120px]">{c.name}</td>
                    <td className="px-4 py-3 text-gray-500">#{c.rank}</td>
                    <td className="px-4 py-3 text-gray-500">{c.downloads}</td>
                    <td className="px-4 py-3 flex items-center gap-1 text-gray-900 dark:text-white">
                        <Star size={14} className="fill-yellow-500 text-yellow-500" /> {c.rating}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};

export default AppStoreOptimizationDashboard;
