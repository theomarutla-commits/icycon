
import React from 'react';
import { ShoppingBag, RefreshCw, MessageCircle, Package, AlertCircle, TrendingUp, DollarSign, Truck, CheckCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { marketplaceSales, marketplaceOrders, marketplaceMessages } from '../../lib/dashboard-data';

const MarketplaceDashboard: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Executive Overview KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total GMV (30d)", value: "$124,500", change: "+18%", icon: <DollarSign />, color: "text-green-500" },
          { label: "Total Orders", value: "1,240", change: "+5%", icon: <ShoppingBag />, color: "text-blue-500" },
          { label: "Return Rate", value: "2.4%", change: "-0.2%", icon: <RefreshCw />, color: "text-purple-500" },
          { label: "Avg. Order Value", value: "$85.00", change: "+$4.50", icon: <TrendingUp />, color: "text-orange-500" },
        ].map((m, i) => (
          <div key={i} className="p-6 rounded-3xl bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-lg dark:shadow-black/20 hover:scale-[1.02] transition-transform">
             <div className="flex justify-between items-start mb-2">
                <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">{m.label}</span>
                <span className={`p-2.5 rounded-xl bg-white/50 dark:bg-white/10 ${m.color} shadow-sm`}>{m.icon}</span>
             </div>
             <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{m.value}</div>
             <span className={`text-xs font-semibold ${m.change.includes('+') ? 'text-green-500' : m.change.includes('-') ? 'text-green-500' : 'text-red-500'}`}>
                {m.change} vs last month
             </span>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sales Chart - Scrollable on mobile */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-lg dark:shadow-black/20">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Sales by Platform</h3>
              <p className="text-sm text-gray-500">Consolidated revenue performance</p>
            </div>
            <select className="bg-white/50 dark:bg-white/10 border border-white/20 dark:border-white/10 rounded-lg px-3 py-1.5 text-sm text-gray-600 dark:text-gray-300 focus:outline-none backdrop-blur-sm cursor-pointer hover:bg-white/80 dark:hover:bg-white/20">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="w-full overflow-x-auto pb-4">
            <div className="h-[300px] w-full min-w-[500px]">
                <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={marketplaceSales}>
                    <defs>
                    <linearGradient id="colorAmazon" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ff9900" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#ff9900" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorShopify" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#95bf47" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#95bf47" stopOpacity={0}/>
                    </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.1} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 10}} />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)' }} />
                    <Legend />
                    <Area type="monotone" dataKey="amazon" name="Amazon" stroke="#ff9900" fillOpacity={1} fill="url(#colorAmazon)" />
                    <Area type="monotone" dataKey="shopify" name="Shopify" stroke="#95bf47" fillOpacity={1} fill="url(#colorShopify)" />
                    <Area type="monotone" dataKey="walmart" name="Walmart" stroke="#0071dc" fillOpacity={0.1} fill="#0071dc" />
                </AreaChart>
                </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Customer Messages Widget */}
        <div className="lg:col-span-1 p-6 rounded-3xl bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-lg dark:shadow-black/20">
          <div className="mb-6 flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <MessageCircle size={20} className="text-blue-500" /> Inquiries
            </h3>
            <span className="px-2 py-1 bg-red-500/10 text-red-500 rounded text-xs font-bold border border-red-500/20">3 Pending</span>
          </div>
          <div className="space-y-3">
            {marketplaceMessages.map((msg, i) => (
              <div key={i} className="p-4 rounded-2xl bg-white/50 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10 transition-colors cursor-pointer border border-transparent hover:border-white/40 dark:hover:border-white/10">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-bold text-sm text-gray-900 dark:text-white">{msg.user}</span>
                  <span className="text-xs text-gray-400">{msg.time}</span>
                </div>
                <div className="text-xs text-icy-main font-medium mb-1">{msg.platform}</div>
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-1">{msg.subject}</p>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-2 text-sm font-medium text-gray-500 hover:text-icy-main transition-colors hover:bg-white/50 dark:hover:bg-white/5 rounded-xl">
            View All Messages
          </button>
        </div>
      </div>

      {/* Order Management Table */}
      <div className="p-6 rounded-3xl bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-lg dark:shadow-black/20">
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Orders</h3>
            <p className="text-sm text-gray-500">Manage fulfillment and returns</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <input 
              type="text" 
              placeholder="Search Order ID..." 
              className="px-4 py-2 rounded-xl bg-white/50 dark:bg-white/5 border border-white/20 dark:border-white/10 text-sm focus:outline-none focus:border-icy-main w-full sm:w-auto backdrop-blur-sm"
            />
            <button className="px-4 py-2 bg-icy-main text-white rounded-xl text-sm font-bold shadow-lg shadow-icy-main/20 hover:brightness-110 transition-all">Filter</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 dark:bg-white/5">
              <tr>
                <th className="px-4 py-3 rounded-l-lg">Order ID</th>
                <th className="px-4 py-3">Product / Platform</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 rounded-r-lg text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {marketplaceOrders.map((order, i) => (
                <tr key={i} className="border-b border-gray-100/50 dark:border-white/5 hover:bg-white/50 dark:hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3 font-mono text-gray-500">{order.id}</td>
                  <td className="px-4 py-3">
                    <div className="font-bold text-gray-900 dark:text-white">Wireless Headphones</div>
                    <div className="text-xs text-gray-500 flex items-center gap-1">via {order.platform}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-gray-900 dark:text-white font-medium">{order.customer}</div>
                    <div className="text-xs text-gray-500">{order.date}</div>
                  </td>
                  <td className="px-4 py-3 font-bold text-gray-900 dark:text-white">{order.amount}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold flex w-fit items-center gap-1 border
                      ${order.status === 'Shipped' ? 'bg-green-100/80 text-green-700 border-green-200' : 
                        order.status === 'Processing' ? 'bg-blue-100/80 text-blue-700 border-blue-200' : 
                        order.status === 'Pending' ? 'bg-yellow-100/80 text-yellow-700 border-yellow-200' : 
                        'bg-red-100/80 text-red-700 border-red-200' 
                      }
                    `}>
                      {order.status === 'Shipped' && <Truck size={10} />}
                      {order.status === 'Processing' && <Package size={10} />}
                      {order.status === 'Return Req' && <AlertCircle size={10} />}
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="text-gray-400 hover:text-icy-main transition-colors font-medium text-xs">
                        Details
                    </button>
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

export default MarketplaceDashboard;
