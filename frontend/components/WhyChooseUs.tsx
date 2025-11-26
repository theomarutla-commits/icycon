import React from 'react';
import { ResponsiveContainer, BarChart, Bar, Tooltip, XAxis } from 'recharts';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

const data = [
  { name: 'Jan', value: 30 },
  { name: 'Feb', value: 45 },
  { name: 'Mar', value: 35 },
  { name: 'Apr', value: 60 },
  { name: 'May', value: 50 },
  { name: 'Jun', value: 75 },
  { name: 'Jul', value: 85 },
];

const reasons = [
  {
    title: "AI-First Approach",
    desc: "We leverage cutting-edge LLMs to predict trends before they happen."
  },
  {
    title: "Cross-Platform Synergy",
    desc: "We connect your social signals to your SEO results for a holistic growth strategy."
  },
  {
    title: "Data-Driven Creative",
    desc: "Our content is engineered to convert based on real user behavior metrics."
  },
  {
    title: "Transparent Reporting",
    desc: "Live dashboards showing real ROI, not just vanity metrics."
  }
];

const WhyChooseUs: React.FC = () => {
  return (
    <section id="why-us" className="py-24 px-4 bg-icy-dark text-white overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-icy-deep/30 to-transparent pointer-events-none" />

      <div className="w-[90%] lg:w-[90%] mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
        
        {/* Text Content */}
        <div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Why top brands trust <br />
            <span className="text-icy-main">Icycon</span>
          </h2>
          <p className="text-gray-300 text-lg mb-10 leading-relaxed">
            We don't just follow trends; we engineer the algorithms that define them. 
            Our proprietary technology stack ensures your brand stays ahead of the curve.
          </p>

          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-10">
            {reasons.map((r, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col gap-3"
              >
                <div className="flex items-center gap-2 text-icy-main font-bold text-lg">
                  <CheckCircle2 size={24} />
                  <h3>{r.title}</h3>
                </div>
                <p className="text-sm text-gray-400 leading-relaxed">{r.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Chart Card */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          className="relative"
        >
          {/* Glowing effect behind card */}
          <div className="absolute -inset-4 bg-icy-main/30 blur-2xl rounded-[3rem]" />
          
          <div className="relative bg-[#002466] border border-[#4092ef]/30 rounded-3xl p-8 shadow-2xl">
            <div className="flex justify-between items-end mb-8 border-b border-white/10 pb-6">
              <div>
                <p className="text-xs uppercase tracking-widest text-icy-main mb-1">Lifetime Value</p>
                <h4 className="text-3xl font-bold text-white">+124%</h4>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase tracking-widest text-green-400 mb-1">Conversion Rate</p>
                <h4 className="text-3xl font-bold text-green-400">8.4%</h4>
              </div>
            </div>

            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: '#64748b', fontSize: 12 }} 
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip 
                    cursor={{fill: 'rgba(255,255,255,0.05)'}}
                    contentStyle={{ backgroundColor: '#001358', border: 'none', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Bar 
                    dataKey="value" 
                    fill="#4092ef" 
                    radius={[4, 4, 0, 0]}
                    activeBar={{ fill: '#0079d2' }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="text-center mt-6">
              <span className="text-[10px] uppercase tracking-widest text-gray-500">Live Performance Tracker</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseUs;