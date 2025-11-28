import React, { useState } from 'react';
import { Eye, Clock, Activity, UserPlus, Bell, Settings, FileText, Globe, CheckCircle, AlertCircle } from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { blogTrafficData, blogSources, topBlogPosts, blogNotifications } from '../../lib/dashboard-data';

const BlogDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'settings'>('overview');

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header with Tabs */}
      <div className="flex justify-between items-center border-b border-gray-200 dark:border-white/10 pb-4">
        <div className="flex gap-4">
            <button 
                onClick={() => setActiveTab('overview')}
                className={`pb-4 -mb-4 px-2 font-medium text-sm transition-colors border-b-2 ${
                    activeTab === 'overview' 
                    ? 'border-icy-main text-icy-main' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
            >
                Overview
            </button>
            <button 
                onClick={() => setActiveTab('settings')}
                className={`pb-4 -mb-4 px-2 font-medium text-sm transition-colors border-b-2 ${
                    activeTab === 'settings' 
                    ? 'border-icy-main text-icy-main' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
            >
                Configuration
            </button>
        </div>
        
        {/* Notifications Widget */}
        <div className="relative group">
            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 relative">
                <Bell size={20} className="text-gray-600 dark:text-gray-400" />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-[#002466]"></span>
            </button>
            {/* Dropdown */}
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#002466] border border-gray-200 dark:border-white/10 rounded-xl shadow-xl p-4 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all z-20">
                <h4 className="font-bold text-sm text-gray-900 dark:text-white mb-3">Recent Activity</h4>
                <div className="space-y-3">
                    {blogNotifications.map((notif, i) => (
                        <div key={i} className="flex gap-3 items-start text-xs border-b border-gray-100 dark:border-white/5 pb-2 last:border-0 last:pb-0">
                            <div className="w-2 h-2 mt-1 rounded-full bg-icy-main shrink-0" />
                            <div>
                                <p className="text-gray-700 dark:text-gray-300">{notif.message}</p>
                                <span className="text-gray-400">{notif.time}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>

      {activeTab === 'overview' ? (
        <>
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                { label: "Page Views", value: "145.2k", change: "+12%", icon: <Eye />, color: "text-blue-500" },
                { label: "Avg. Time on Page", value: "4m 12s", change: "+45s", icon: <Clock />, color: "text-green-500" },
                { label: "Bounce Rate", value: "42%", change: "-2%", icon: <Activity />, color: "text-orange-500" },
                { label: "New Leads", value: "850", change: "+8%", icon: <UserPlus />, color: "text-purple-500" },
                ].map((m, i) => (
                <div key={i} className="p-6 rounded-2xl bg-white dark:bg-[#002466]/40 border border-gray-200 dark:border-white/10 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">{m.label}</span>
                        <span className={`p-2 rounded-lg bg-gray-100 dark:bg-white/5 ${m.color}`}>{m.icon}</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{m.value}</div>
                    <span className="text-xs text-green-500 font-semibold">{m.change} vs last month</span>
                </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Traffic Trend */}
                <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-[#002466]/40 border border-gray-200 dark:border-white/10 shadow-sm">
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Traffic Analysis</h3>
                        <p className="text-sm text-gray-500">Views vs. Unique Visitors over time</p>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={blogTrafficData}>
                            <defs>
                            <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#4092ef" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#4092ef" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.1} />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af'}} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af'}} />
                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
                            <Legend />
                            <Area type="monotone" dataKey="views" name="Page Views" stroke="#4092ef" fillOpacity={1} fill="url(#colorViews)" />
                            <Area type="monotone" dataKey="visitors" name="Unique Visitors" stroke="#10b981" fillOpacity={1} fill="url(#colorVisitors)" />
                        </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Traffic Sources */}
                <div className="lg:col-span-1 p-6 rounded-2xl bg-white dark:bg-[#002466]/40 border border-gray-200 dark:border-white/10 shadow-sm flex flex-col">
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Audience Sources</h3>
                        <p className="text-sm text-gray-500">Where are your readers coming from?</p>
                    </div>
                    <div className="flex-1 min-h-[200px] relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={blogSources}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {blogSources.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
                                <Legend verticalAlign="bottom" height={36}/>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Top Posts */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#002466]/40 border border-gray-200 dark:border-white/10 shadow-sm">
                <div className="mb-6 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Top Performing Content</h3>
                    <button className="px-4 py-2 text-sm bg-icy-main text-white rounded-lg hover:bg-icy-secondary transition-colors">
                        + New Post
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-white/5">
                            <tr>
                                <th className="px-4 py-3 rounded-l-lg">Title</th>
                                <th className="px-4 py-3">Total Views</th>
                                <th className="px-4 py-3">Avg. Time</th>
                                <th className="px-4 py-3 rounded-r-lg">SEO Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topBlogPosts.map((post, i) => (
                                <tr key={i} className="border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white flex items-center gap-2">
                                        <FileText size={16} className="text-gray-400" />
                                        {post.title}
                                    </td>
                                    <td className="px-4 py-3 text-gray-500">{post.views}</td>
                                    <td className="px-4 py-3 text-gray-500">{post.avgTime}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold flex w-fit items-center gap-1
                                            ${post.status === 'Indexed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {post.status === 'Indexed' ? <CheckCircle size={10} /> : <AlertCircle size={10} />}
                                            {post.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* General Settings */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#002466]/40 border border-gray-200 dark:border-white/10 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <Settings size={20} /> General Configuration
                </h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Blog Title</label>
                        <input type="text" className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10" defaultValue="Icycon Insights" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                        <textarea className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10" rows={3} defaultValue="Expert growth strategies for modern SaaS..." />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Theme</label>
                        <select className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10">
                            <option>Modern Dark (Default)</option>
                            <option>Minimal Light</option>
                            <option>Classic</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Integrations */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#002466]/40 border border-gray-200 dark:border-white/10 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <Globe size={20} /> API Integrations
                </h3>
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600 font-bold">GA</div>
                            <div>
                                <div className="font-bold text-sm text-gray-900 dark:text-white">Google Analytics</div>
                                <div className="text-xs text-gray-500">Tracking ID: UA-XXXX-Y</div>
                            </div>
                        </div>
                        <div className="w-10 h-6 bg-green-500 rounded-full relative cursor-pointer">
                            <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-bold">FB</div>
                            <div>
                                <div className="font-bold text-sm text-gray-900 dark:text-white">Facebook Pixel</div>
                                <div className="text-xs text-gray-500">Not connected</div>
                            </div>
                        </div>
                        <div className="w-10 h-6 bg-gray-300 dark:bg-white/10 rounded-full relative cursor-pointer">
                            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center text-yellow-600 font-bold">MC</div>
                            <div>
                                <div className="font-bold text-sm text-gray-900 dark:text-white">Mailchimp</div>
                                <div className="text-xs text-gray-500">Sync subscribers</div>
                            </div>
                        </div>
                        <div className="w-10 h-6 bg-gray-300 dark:bg-white/10 rounded-full relative cursor-pointer">
                            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default BlogDashboard;