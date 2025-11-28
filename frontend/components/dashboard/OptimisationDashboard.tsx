
import React from 'react';
import { Activity, Search, MousePointer, ArrowUp, ArrowDown } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { trafficData, historicalData, keywords, queries } from '../../lib/dashboard-data';

const OptimisationDashboard: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-lg dark:shadow-black/20 hover:scale-[1.02] transition-transform">
          <div className="flex justify-between items-start mb-2">
            <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">Organic Traffic</span>
            <span className="p-2.5 bg-green-500/10 text-green-500 rounded-xl"><Activity size={18} /></span>
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">24.5k</div>
          <span className="text-xs text-green-500 flex items-center gap-1 font-semibold"><ArrowUp size={12} /> +12.5% vs last month</span>
        </div>
        <div className="p-6 rounded-3xl bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-lg dark:shadow-black/20 hover:scale-[1.02] transition-transform">
          <div className="flex justify-between items-start mb-2">
            <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">Avg. Position</span>
            <span className="p-2.5 bg-blue-500/10 text-blue-500 rounded-xl"><Search size={18} /></span>
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">4.2</div>
          <span className="text-xs text-green-500 flex items-center gap-1 font-semibold"><ArrowUp size={12} /> +0.8 improvement</span>
        </div>
        <div className="p-6 rounded-3xl bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-lg dark:shadow-black/20 hover:scale-[1.02] transition-transform">
          <div className="flex justify-between items-start mb-2">
            <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">Click-Through Rate</span>
            <span className="p-2.5 bg-purple-500/10 text-purple-500 rounded-xl"><MousePointer size={18} /></span>
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">3.8%</div>
          <span className="text-xs text-red-500 flex items-center gap-1 font-semibold"><ArrowDown size={12} /> -0.2% vs last month</span>
        </div>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Organic Traffic vs Impressions */}
        <div className="p-6 rounded-3xl bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-lg dark:shadow-black/20">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Traffic & Impressions</h3>
            <p className="text-sm text-gray-500">Weekly performance overview</p>
          </div>
          {/* Scrollable container for mobile */}
          <div className="w-full overflow-x-auto pb-4">
            <div className="h-[300px] w-full min-w-[500px]">
                <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trafficData}>
                    <defs>
                    <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4092ef" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#4092ef" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorImp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                    </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} opacity={0.2} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                    <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)' }}
                    />
                    <Area type="monotone" dataKey="traffic" stroke="#4092ef" strokeWidth={2} fillOpacity={1} fill="url(#colorTraffic)" />
                    <Area type="monotone" dataKey="impressions" stroke="#82ca9d" strokeWidth={2} fillOpacity={1} fill="url(#colorImp)" />
                </AreaChart>
                </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Historical Rank Trend */}
        <div className="p-6 rounded-3xl bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-lg dark:shadow-black/20">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Historical Ranking & Clicks</h3>
            <p className="text-sm text-gray-500">6-month trend analysis</p>
          </div>
          {/* Scrollable container for mobile */}
          <div className="w-full overflow-x-auto pb-4">
            <div className="h-[300px] w-full min-w-[500px]">
                <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historicalData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} opacity={0.2} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                    <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                    <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} reversed />
                    <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)' }}
                    />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="clicks" stroke="#8884d8" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    <Line yAxisId="right" type="monotone" dataKey="rank" stroke="#ff7300" strokeWidth={2} strokeDasharray="5 5" />
                </LineChart>
                </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Keywords */}
        <div className="p-6 rounded-3xl bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-lg dark:shadow-black/20 overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Keyword Rankings</h3>
            <button className="text-xs font-semibold text-icy-main hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 dark:bg-white/5">
                <tr>
                  <th className="px-4 py-3 rounded-l-lg">Keyword</th>
                  <th className="px-4 py-3">Volume</th>
                  <th className="px-4 py-3">Rank</th>
                  <th className="px-4 py-3 rounded-r-lg">Change</th>
                </tr>
              </thead>
              <tbody>
                {keywords.map((k, i) => (
                  <tr key={i} className="border-b border-gray-100/50 dark:border-white/5 hover:bg-white/50 dark:hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white min-w-[120px]">{k.term}</td>
                    <td className="px-4 py-3 text-gray-500">{k.vol}</td>
                    <td className="px-4 py-3 font-bold text-gray-900 dark:text-white">#{k.rank}</td>
                    <td className={`px-4 py-3 ${k.change.includes('+') ? 'text-green-500' : k.change.includes('-') ? 'text-red-500' : 'text-gray-500'}`}>
                      {k.change}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Queries */}
        <div className="p-6 rounded-3xl bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-lg dark:shadow-black/20 overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Top Search Queries</h3>
            <button className="text-xs font-semibold text-icy-main hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto">
             <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 dark:bg-white/5">
                <tr>
                  <th className="px-4 py-3 rounded-l-lg">Query</th>
                  <th className="px-4 py-3">Clicks</th>
                  <th className="px-4 py-3 rounded-r-lg">Impressions</th>
                </tr>
              </thead>
              <tbody>
                {queries.map((q, i) => (
                  <tr key={i} className="border-b border-gray-100/50 dark:border-white/5 hover:bg-white/50 dark:hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white min-w-[150px]">{q.query}</td>
                    <td className="px-4 py-3 text-gray-500">{q.clicks}</td>
                    <td className="px-4 py-3 text-gray-500">{q.impressions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OptimisationDashboard;
