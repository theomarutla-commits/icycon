
import React from 'react';
import { Users, Search, Eye, MousePointer } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Bar, Line } from 'recharts';
import { historicalData, trafficData, keywords, queries } from '../../lib/dashboard-data';

const SEODashboard: React.FC = () => {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Top Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Total Organic Traffic", value: "124.5k", icon: <Users />, color: "text-blue-500", desc: "+15% vs last mo" },
                    { label: "Avg. Position", value: "12.4", icon: <Search />, color: "text-purple-500", desc: "+2.1 improvement" },
                    { label: "Total Impressions", value: "1.2M", icon: <Eye />, color: "text-green-500", desc: "+8% vs last mo" },
                    { label: "Avg. CTR", value: "2.8%", icon: <MousePointer />, color: "text-orange-500", desc: "-0.1% vs last mo" },
                ].map((m, i) => (
                    <div key={i} className="p-6 rounded-3xl bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-lg dark:shadow-black/20 hover:scale-[1.02] transition-transform">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">{m.label}</span>
                            <span className={`p-2.5 rounded-xl bg-white/50 dark:bg-white/10 ${m.color} shadow-sm`}>{m.icon}</span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{m.value}</div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{m.desc}</span>
                    </div>
                ))}
            </div>

            {/* Historical Trends Chart (Clicks, Impressions, Rank) */}
            <div className="p-6 rounded-3xl bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-lg dark:shadow-black/20">
                <div className="mb-6 flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Historical Performance Trends</h3>
                        <p className="text-sm text-gray-500">Rank, Impressions, and Clicks over time</p>
                    </div>
                    <div className="flex gap-2">
                        <div className="flex items-center gap-1 text-xs text-gray-500"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Clicks</div>
                        <div className="flex items-center gap-1 text-xs text-gray-500"><div className="w-2 h-2 rounded-full bg-purple-500"></div> Impressions</div>
                        <div className="flex items-center gap-1 text-xs text-gray-500"><div className="w-2 h-2 rounded-full bg-orange-500"></div> Rank</div>
                    </div>
                </div>
                
                {/* Mobile Scrollable Container */}
                <div className="w-full overflow-x-auto pb-4">
                    <div className="h-[350px] w-full min-w-[600px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={historicalData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.1} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 10}} label={{ value: 'Traffic', angle: -90, position: 'insideLeft', fill: '#9ca3af', fontSize: 10 }} />
                                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 10}} reversed label={{ value: 'Rank', angle: 90, position: 'insideRight', fill: '#9ca3af', fontSize: 10 }} />
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)' }} />
                                <Area yAxisId="left" type="monotone" dataKey="impressions" fill="#8b5cf6" stroke="#8b5cf6" fillOpacity={0.1} />
                                <Bar yAxisId="left" dataKey="clicks" barSize={20} fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                <Line yAxisId="right" type="monotone" dataKey="rank" stroke="#f97316" strokeWidth={3} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Organic Traffic Chart */}
            <div className="p-6 rounded-3xl bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-lg dark:shadow-black/20">
                <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Organic Traffic Velocity</h3>
                    <p className="text-sm text-gray-500">Daily organic sessions breakdown</p>
                </div>
                
                {/* Mobile Scrollable Container */}
                <div className="w-full overflow-x-auto pb-4">
                    <div className="h-[250px] w-full min-w-[600px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trafficData}>
                                <defs>
                                    <linearGradient id="colorOrgTraffic" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.1} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 10}} />
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)' }} />
                                <Area type="monotone" dataKey="traffic" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorOrgTraffic)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Deep Dive Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="p-6 rounded-3xl bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-lg dark:shadow-black/20 overflow-hidden">
                    <div className="mb-6 flex justify-between items-center">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Keyword Position Rankings</h3>
                        <button className="text-xs text-icy-main hover:underline">View All</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 dark:bg-white/5">
                                <tr>
                                    <th className="px-4 py-3 rounded-l-lg">Keyword</th>
                                    <th className="px-4 py-3">Vol</th>
                                    <th className="px-4 py-3 rounded-r-lg">Pos</th>
                                </tr>
                            </thead>
                            <tbody>
                                {keywords.map((k, i) => (
                                    <tr key={i} className="border-b border-gray-100/50 dark:border-white/5 hover:bg-white/50 dark:hover:bg-white/5">
                                        <td className="px-4 py-3 font-medium text-gray-900 dark:text-white min-w-[120px]">{k.term}</td>
                                        <td className="px-4 py-3 text-gray-500">{k.vol}</td>
                                        <td className="px-4 py-3 font-bold text-gray-900 dark:text-white">#{k.rank} <span className="text-green-500 text-xs font-normal ml-1">{k.change}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="p-6 rounded-3xl bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-lg dark:shadow-black/20 overflow-hidden">
                    <div className="mb-6 flex justify-between items-center">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Top Search Queries</h3>
                        <button className="text-xs text-icy-main hover:underline">View All</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 dark:bg-white/5">
                                <tr>
                                    <th className="px-4 py-3 rounded-l-lg">Query</th>
                                    <th className="px-4 py-3">Clicks</th>
                                    <th className="px-4 py-3 rounded-r-lg">CTR</th>
                                </tr>
                            </thead>
                            <tbody>
                                {queries.map((q, i) => (
                                    <tr key={i} className="border-b border-gray-100/50 dark:border-white/5 hover:bg-white/50 dark:hover:bg-white/5">
                                        <td className="px-4 py-3 font-medium text-gray-900 dark:text-white min-w-[150px]">{q.query}</td>
                                        <td className="px-4 py-3 text-gray-500">{q.clicks}</td>
                                        <td className="px-4 py-3 text-gray-500">{(q.clicks / q.impressions * 100).toFixed(1)}%</td>
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

export default SEODashboard;
