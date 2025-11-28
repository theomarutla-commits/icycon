
import React from 'react';
import { Megaphone, Facebook, Instagram, Linkedin, Twitter, Eye, ThumbsUp, MousePointer, Users, Calendar } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { socialGrowthData, scheduledPosts, mentions } from '../../lib/dashboard-data';

const SocialMediaDashboard: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Social Command Center</h2>
          <p className="text-sm text-gray-500">Manage, schedule, and analyze across all platforms.</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-icy-main text-white rounded-xl font-bold text-sm shadow-lg shadow-icy-main/30 hover:bg-icy-secondary hover:scale-105 transition-all">
          <Megaphone size={18} /> Create Campaign
        </button>
      </div>

      {/* Connected Accounts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { name: "Facebook", icon: <Facebook />, status: "Connected", followers: "12.4k" },
          { name: "Instagram", icon: <Instagram />, status: "Connected", followers: "45.2k" },
          { name: "LinkedIn", icon: <Linkedin />, status: "Connected", followers: "8.9k" },
          { name: "Twitter / X", icon: <Twitter />, status: "Connected", followers: "18.1k" },
        ].map((acc, i) => (
          <div key={i} className="p-4 rounded-3xl bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/40 dark:border-white/10 flex items-center justify-between group hover:bg-white/80 dark:hover:bg-white/10 hover:shadow-lg transition-all cursor-pointer">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2.5 rounded-xl bg-white dark:bg-white/10 text-gray-600 dark:text-white group-hover:text-icy-main transition-colors shrink-0 shadow-sm">
                {acc.icon}
              </div>
              <div className="min-w-0">
                <div className="font-bold text-sm text-gray-900 dark:text-white truncate">{acc.name}</div>
                <div className="text-[10px] text-green-500 flex items-center gap-1 font-semibold uppercase tracking-wider"><div className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0 shadow-[0_0_5px_rgba(34,197,94,0.6)]" /> {acc.status}</div>
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-[10px] uppercase font-bold text-gray-400">Followers</div>
              <div className="font-bold text-gray-900 dark:text-white">{acc.followers}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Performance KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total Reach", value: "892k", change: "+24%", icon: <Eye />, color: "text-blue-500" },
          { label: "Engagement Rate", value: "5.2%", change: "+0.8%", icon: <ThumbsUp />, color: "text-pink-500" },
          { label: "Link Clicks", value: "14.2k", change: "+12%", icon: <MousePointer />, color: "text-purple-500" },
          { label: "New Followers", value: "3,420", change: "+15%", icon: <Users />, color: "text-green-500" },
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
        {/* Campaign Performance Chart - Scrollable on mobile */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-lg dark:shadow-black/20">
          <div className="mb-6 flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Audience Growth</h3>
            <div className="flex gap-3">
              <span className="text-xs flex items-center gap-1.5 text-gray-500 font-medium"><div className="w-2 h-2 rounded-full bg-icy-main" /> Organic</span>
              <span className="text-xs flex items-center gap-1.5 text-gray-500 font-medium"><div className="w-2 h-2 rounded-full bg-purple-500" /> Paid</span>
            </div>
          </div>
          <div className="w-full overflow-x-auto pb-4">
            <div className="h-[300px] w-full min-w-[500px]">
                <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={socialGrowthData}>
                    <defs>
                    <linearGradient id="colorOrganic" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4092ef" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#4092ef" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorPaid" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                    </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.1} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 10}} />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)' }} />
                    <Area type="monotone" dataKey="organic" stroke="#4092ef" strokeWidth={2} fillOpacity={1} fill="url(#colorOrganic)" />
                    <Area type="monotone" dataKey="paid" stroke="#a855f7" strokeWidth={2} fillOpacity={1} fill="url(#colorPaid)" />
                </AreaChart>
                </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Upcoming Content Calendar */}
        <div className="lg:col-span-1 p-6 rounded-3xl bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-lg dark:shadow-black/20">
          <div className="mb-6 flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Calendar size={20} className="text-orange-500" /> Content Calendar
            </h3>
            <button className="text-xs text-icy-main hover:underline font-medium">View Full</button>
          </div>
          <div className="space-y-4">
            {scheduledPosts.map((post, i) => (
              <div key={i} className="p-4 rounded-2xl bg-white/50 dark:bg-white/5 border border-white/20 dark:border-white/5 relative overflow-hidden hover:bg-white/80 dark:hover:bg-white/10 transition-colors cursor-pointer group">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{post.platform}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${post.status === 'Scheduled' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-yellow-100 text-yellow-700 border-yellow-200'}`}>
                    {post.status}
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-icy-main transition-colors">"{post.content}"</p>
                <div className="text-xs text-gray-500 flex items-center gap-1.5">
                  <Calendar size={12} /> {post.time}
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-2.5 border border-dashed border-gray-300 dark:border-white/20 rounded-xl text-sm text-gray-500 hover:bg-white/50 dark:hover:bg-white/5 hover:text-icy-main hover:border-icy-main/50 transition-all font-medium">
            + Schedule New Post
          </button>
        </div>
      </div>

      {/* Brand Monitoring */}
      <div className="p-6 rounded-3xl bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-lg dark:shadow-black/20">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Brand Mentions</h3>
          <p className="text-sm text-gray-500">Real-time listening across the web</p>
        </div>
        <div className="space-y-3">
          {mentions.map((mention, i) => (
            <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-white/50 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10 border border-transparent hover:border-white/40 dark:hover:border-white/10 transition-all">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-white/20 dark:to-white/5 flex items-center justify-center font-bold text-gray-600 dark:text-white shadow-inner">
                {mention.user.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <div className="font-bold text-gray-900 dark:text-white text-sm">{mention.user} <span className="text-gray-500 font-normal text-xs">• {mention.platform}</span></div>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${mention.sentiment === 'Positive' ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-600'}`}>
                    {mention.sentiment}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">{mention.text}</p>
                <div className="flex gap-4 mt-2 text-xs text-gray-500 font-medium">
                  <button className="hover:text-icy-main transition-colors">Reply</button>
                  <button className="hover:text-icy-main transition-colors">Like</button>
                  <button className="hover:text-red-500 transition-colors">Hide</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SocialMediaDashboard;
