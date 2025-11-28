
import React from 'react';
import { Link as LinkIcon, Globe, ShieldCheck, AlertTriangle } from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, BarChart, Bar 
} from 'recharts';
import { 
  backlinkOverview, 
  anchorTextData, 
  referringDomains, 
  competitorBacklinks 
} from '../../lib/dashboard-data';

const BacklinksDashboard: React.FC = () => {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Total Backlinks", value: "2,450", change: "+16%", icon: <LinkIcon />, color: "text-blue-500" },
                    { label: "Referring Domains", value: "340", change: "+12", icon: <Globe />, color: "text-purple-500" },
                    { label: "Domain Authority", value: "45", change: "+2", icon: <ShieldCheck />, color: "text-green-500" },
                    { label: "Spam Score", value: "2%", change: "-1%", icon: <AlertTriangle />, color: "text-orange-500" },
                ].map((m, i) => (
                    <div key={i} className="p-6 rounded-3xl bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-lg dark:shadow-black/20 hover:scale-[1.02] transition-transform">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">{m.label}</span>
                            <span className={`p-2.5 rounded-xl bg-white/50 dark:bg-white/10 ${m.color} shadow-sm`}>{m.icon}</span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{m.value}</div>
                        <span className="text-xs text-green-500 font-semibold">{m.change} vs last month</span>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Backlink Growth Chart - Scrollable on mobile */}
                <div className="lg:col-span-2 p-6 rounded-3xl bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-lg dark:shadow-black/20">
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Link Acquisition Profile</h3>
                        <p className="text-sm text-gray-500">New vs Lost links over 6 months</p>
                    </div>
                    <div className="w-full overflow-x-auto pb-4">
                        <div className="h-[300px] w-full min-w-[500px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={backlinkOverview}>
                                    <defs>
                                        <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#4092ef" stopOpacity={0.4}/>
                                            <stop offset="95%" stopColor="#4092ef" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.1} />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 10}} />
                                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)' }} />
                                    <Area type="monotone" dataKey="total" stroke="#4092ef" strokeWidth={2} fillOpacity={1} fill="url(#colorTotal)" />
                                    <Area type="monotone" dataKey="lost" stroke="#ef4444" strokeWidth={2} fill="transparent" strokeDasharray="5 5" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Anchor Text Distribution */}
                <div className="lg:col-span-1 p-6 rounded-3xl bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-lg dark:shadow-black/20 flex flex-col">
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Anchor Text</h3>
                        <p className="text-sm text-gray-500">How sites link to you</p>
                    </div>
                    <div className="flex-1 min-h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={anchorTextData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {anchorTextData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }} />
                                <Legend verticalAlign="bottom" height={36}/>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Referring Domains & Competitor Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="p-6 rounded-3xl bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-lg dark:shadow-black/20">
                    <div className="mb-6 flex justify-between items-center">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Top Referring Domains</h3>
                        <button className="text-xs text-icy-main hover:underline font-medium">View All</button>
                    </div>
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 dark:bg-white/5">
                            <tr>
                                <th className="px-4 py-3 rounded-l-lg">Domain</th>
                                <th className="px-4 py-3">DA</th>
                                <th className="px-4 py-3">Links</th>
                                <th className="px-4 py-3 rounded-r-lg">Spam</th>
                            </tr>
                        </thead>
                        <tbody>
                            {referringDomains.map((d, i) => (
                                <tr key={i} className="border-b border-gray-100/50 dark:border-white/5 hover:bg-white/50 dark:hover:bg-white/5 transition-colors">
                                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{d.domain}</td>
                                    <td className="px-4 py-3">
                                        <div className="w-8 h-8 rounded-full bg-green-100/80 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center font-bold text-xs shadow-sm">
                                            {d.authority}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-gray-500">{d.links}</td>
                                    <td className="px-4 py-3 text-gray-500">{d.spam}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-6 rounded-3xl bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-lg dark:shadow-black/20">
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Competitor Authority</h3>
                        <p className="text-sm text-gray-500">Domain Authority Comparison</p>
                    </div>
                    <div className="w-full overflow-x-auto pb-4">
                        <div className="h-[250px] w-full min-w-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={competitorBacklinks} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#374151" opacity={0.1} />
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} width={100} />
                                    <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }} />
                                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
                                        {competitorBacklinks.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BacklinksDashboard;
