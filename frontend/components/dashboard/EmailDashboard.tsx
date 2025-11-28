
import React, { useState } from 'react';
import { Mail, MousePointer, DollarSign, UserMinus, AlertTriangle, Send, Zap, Smartphone, Monitor } from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Legend, PieChart, Pie, Cell, LineChart, Line, ComposedChart 
} from 'recharts';
import { deliverabilityData, emailCampaigns, emailFlows, audienceDeviceData } from '../../lib/dashboard-data';

const EmailDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'campaigns' | 'flows'>('campaigns');

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* High Level KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Avg. Open Rate", value: "42.5%", sub: "Click-to-Open: 18%", icon: <Mail />, color: "text-blue-500" },
          { label: "Total Revenue", value: "$48,200", sub: "$1.42 per recipient", icon: <DollarSign />, color: "text-green-500" },
          { label: "Click-Through Rate", value: "6.8%", sub: "+1.2% vs avg", icon: <MousePointer />, color: "text-purple-500" },
          { label: "Unsubscribe Rate", value: "0.4%", sub: "Bounce Rate: 0.8%", icon: <UserMinus />, color: "text-orange-500" },
        ].map((m, i) => (
          <div key={i} className="p-6 rounded-3xl bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-lg dark:shadow-black/20 hover:scale-[1.02] transition-transform">
             <div className="flex justify-between items-start mb-2">
                <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">{m.label}</span>
                <span className={`p-2.5 rounded-xl bg-white/50 dark:bg-white/10 ${m.color} shadow-sm`}>{m.icon}</span>
             </div>
             <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{m.value}</div>
             <span className="text-xs text-gray-500 dark:text-gray-400">{m.sub}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Deliverability Health Chart - Scrollable on mobile */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-lg dark:shadow-black/20">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <AlertTriangle size={20} className="text-yellow-500" /> Deliverability Health
              </h3>
              <p className="text-sm text-gray-500">Inbox placement and reputation monitoring</p>
            </div>
            <span className="px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-xs font-bold border border-green-500/20">
                Reputation: Excellent
            </span>
          </div>
          <div className="w-full overflow-x-auto pb-4">
            <div className="h-[300px] w-full min-w-[500px]">
                <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={deliverabilityData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.1} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                    <YAxis yAxisId="left" domain={[90, 100]} axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 10}} label={{ value: 'Delivered %', angle: -90, position: 'insideLeft', fill: '#9ca3af', style: {fontSize: '10px'} }} />
                    <YAxis yAxisId="right" orientation="right" domain={[0, 5]} axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 10}} label={{ value: 'Bounce/Spam %', angle: 90, position: 'insideRight', fill: '#9ca3af', style: {fontSize: '10px'} }} />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)' }} />
                    <Legend />
                    <Area yAxisId="left" type="monotone" dataKey="rate" name="Deliverability" fill="#4092ef" stroke="#4092ef" fillOpacity={0.1} />
                    <Line yAxisId="right" type="monotone" dataKey="bounce" name="Bounce Rate" stroke="#f97316" strokeWidth={2} />
                    <Line yAxisId="right" type="monotone" dataKey="spam" name="Spam Complaints" stroke="#ef4444" strokeWidth={2} />
                </ComposedChart>
                </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Audience Device Split */}
        <div className="lg:col-span-1 p-6 rounded-3xl bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-lg dark:shadow-black/20 flex flex-col">
            <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Audience Devices</h3>
                <p className="text-sm text-gray-500">Opens by platform</p>
            </div>
            <div className="flex-1 min-h-[200px] relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={audienceDeviceData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                        >
                            {audienceDeviceData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }} />
                        <Legend verticalAlign="bottom" height={36}/>
                    </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center">
                        <Smartphone className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                        <span className="text-xs text-gray-500">Mobile First</span>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Campaigns & Flows Tabs */}
      <div className="p-6 rounded-3xl bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-lg dark:shadow-black/20">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <div className="flex bg-white/50 dark:bg-white/5 p-1.5 rounded-2xl backdrop-blur-md">
                <button 
                    onClick={() => setActiveTab('campaigns')}
                    className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'campaigns' ? 'bg-white dark:bg-icy-main text-black dark:text-white shadow-md' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                >
                    One-Off Campaigns
                </button>
                <button 
                    onClick={() => setActiveTab('flows')}
                    className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'flows' ? 'bg-white dark:bg-icy-main text-black dark:text-white shadow-md' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                >
                    Automated Flows
                </button>
            </div>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-icy-main text-white rounded-xl text-sm font-bold hover:bg-icy-secondary transition-all shadow-lg shadow-icy-main/20 hover:scale-105">
                <Send size={16} /> Create {activeTab === 'campaigns' ? 'Campaign' : 'Flow'}
            </button>
        </div>

        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 dark:bg-white/5">
                    <tr>
                        <th className="px-4 py-3 rounded-l-lg">Name</th>
                        <th className="px-4 py-3">{activeTab === 'campaigns' ? 'Sent' : 'Status'}</th>
                        <th className="px-4 py-3">Open Rate</th>
                        <th className="px-4 py-3">Click Rate</th>
                        <th className="px-4 py-3 rounded-r-lg text-right">Revenue</th>
                    </tr>
                </thead>
                <tbody>
                    {activeTab === 'campaigns' ? (
                        emailCampaigns.map((c, i) => (
                            <tr key={i} className="border-b border-gray-100/50 dark:border-white/5 hover:bg-white/50 dark:hover:bg-white/5 transition-colors">
                                <td className="px-4 py-3 font-medium text-gray-900 dark:text-white flex items-center gap-2">
                                    <Mail size={16} className="text-blue-500" /> {c.name}
                                </td>
                                <td className="px-4 py-3 text-gray-500">{c.sent}</td>
                                <td className="px-4 py-3 font-bold text-gray-900 dark:text-white">{c.open}</td>
                                <td className="px-4 py-3 text-gray-500">{c.click}</td>
                                <td className="px-4 py-3 text-right font-bold text-green-500">{c.rev}</td>
                            </tr>
                        ))
                    ) : (
                        emailFlows.map((f, i) => (
                            <tr key={i} className="border-b border-gray-100/50 dark:border-white/5 hover:bg-white/50 dark:hover:bg-white/5 transition-colors">
                                <td className="px-4 py-3 font-medium text-gray-900 dark:text-white flex items-center gap-2">
                                    <Zap size={16} className="text-orange-500" /> {f.name}
                                </td>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${f.status === 'Active' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                                        {f.status}
                                    </span>
                                </td>
                                <td className="px-4 py-3 font-bold text-gray-900 dark:text-white">{f.open}</td>
                                <td className="px-4 py-3 text-gray-500">{f.click}</td>
                                <td className="px-4 py-3 text-right font-bold text-green-500">{f.rev}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
      </div>

    </div>
  );
};

export default EmailDashboard;
