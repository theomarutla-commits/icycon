
import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, BarChart, Bar 
} from 'recharts';
import { CheckCircle, AlertTriangle, AlertCircle, ArrowUpRight } from 'lucide-react';
import { overviewTrafficTrends, overviewRevenueMix, systemHealthData } from '../../lib/dashboard-data';
import FeatureDataPanel from './FeatureDataPanel';

const OverviewDashboard: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Top Row: System Health & Revenue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* System Health Status */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-lg dark:shadow-black/20">
          <div className="mb-6 flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">System Health</h3>
            <span className="text-xs text-green-500 font-bold bg-green-500/10 dark:bg-green-500/20 px-3 py-1.5 rounded-full border border-green-500/20">All Systems Operational</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {systemHealthData.map((sys, i) => (
              <div key={i} className="p-4 rounded-2xl bg-white/50 dark:bg-white/5 border border-white/40 dark:border-white/5 flex flex-col justify-between h-full hover:bg-white/80 dark:hover:bg-white/10 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <div className="p-2.5 rounded-xl bg-white dark:bg-white/10 text-gray-600 dark:text-gray-300 shadow-sm">
                    <sys.icon size={18} />
                  </div>
                  {sys.status === 'Healthy' ? (
                    <CheckCircle size={18} className="text-green-500" />
                  ) : sys.status === 'Warning' ? (
                    <AlertTriangle size={18} className="text-yellow-500" />
                  ) : (
                    <AlertCircle size={18} className="text-red-500" />
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-900 dark:text-white mb-1">{sys.service}</h4>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Uptime: {sys.uptime}</span>
                    {sys.issues > 0 && (
                      <span className="text-xs text-red-500 font-bold">{sys.issues} Issue{sys.issues > 1 ? 's' : ''}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Mix Chart */}
        <div className="lg:col-span-1 p-6 rounded-3xl bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-lg dark:shadow-black/20 flex flex-col">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Revenue Attribution</h3>
            <p className="text-sm text-gray-500">Income by channel</p>
          </div>
          <div className="flex-1 min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={overviewRevenueMix}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {overviewRevenueMix.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Traffic Ecosystem Chart */}
      <div className="p-6 rounded-3xl bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-lg dark:shadow-black/20">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Traffic Ecosystem</h3>
            <p className="text-sm text-gray-500">Combined traffic growth across all channels</p>
          </div>
          <button className="text-sm text-icy-main hover:text-icy-secondary font-medium flex items-center gap-1 transition-colors">
            View Full Report <ArrowUpRight size={14} />
          </button>
        </div>
        
        {/* Mobile Scrollable Container */}
        <div className="w-full overflow-x-auto pb-4">
          <div className="h-[350px] w-full min-w-[600px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={overviewTrafficTrends}>
                <defs>
                  <linearGradient id="colorSeo" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4092ef" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#4092ef" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorSocial" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPaid" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34d399" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.1} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 10}} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)' }} />
                <Legend verticalAlign="top" height={36} iconType="circle" />
                <Area type="monotone" dataKey="seo" name="SEO / Organic" stackId="1" stroke="#4092ef" strokeWidth={2} fill="url(#colorSeo)" />
                <Area type="monotone" dataKey="social" name="Social Media" stackId="1" stroke="#a855f7" strokeWidth={2} fill="url(#colorSocial)" />
                <Area type="monotone" dataKey="paid" name="Paid Ads" stackId="1" stroke="#34d399" strokeWidth={2} fill="url(#colorPaid)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <FeatureDataPanel />
    </div>
  );
};

export default OverviewDashboard;
