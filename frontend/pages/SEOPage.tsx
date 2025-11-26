import React from 'react';
import { motion } from 'framer-motion';
import { Search, Globe, Zap, BarChart, Bot } from 'lucide-react';
import CTA from '../components/CTA';

const features = [
  {
    icon: <Search className="w-6 h-6" />,
    title: "Technical SEO",
    desc: "Deep audits and architecture optimization to ensure search engines can crawl and index your site perfectly."
  },
  {
    icon: <Bot className="w-6 h-6" />,
    title: "AEO (Answer Engine Optimization)",
    desc: "Optimization for AI models like ChatGPT and Perplexity to ensure your brand is the cited answer."
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: "Local & Global Reach",
    desc: "From Google Business Profile dominance to multilingual hreflang implementation for international scale."
  },
  {
    icon: <BarChart className="w-6 h-6" />,
    title: "Data-Driven Content",
    desc: "Content strategies built on search intent data, ensuring every piece drives traffic and conversions."
  }
];

const SEOPage: React.FC = () => {
  return (
    <div className="pt-24 pb-12 px-4 bg-slate-50 dark:bg-icy-dark min-h-screen">
      <div className="w-[90%] lg:w-[90%] mx-auto">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bold mb-6 text-gray-900 dark:text-white"
          >
            Dominate <span className="text-icy-main">Search & AI</span>
          </motion.h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Future-proof your visibility. We combine traditional technical SEO with cutting-edge Answer Engine Optimization to ensure you rank on Google and be the answer on AI.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-24">
          {features.map((f, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white dark:bg-[#002466]/40 p-8 rounded-3xl border border-gray-200 dark:border-white/10 hover:border-icy-main transition-colors"
            >
              <div className="w-12 h-12 bg-icy-main/10 text-icy-main rounded-xl flex items-center justify-center mb-6">
                {f.icon}
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">{f.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{f.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="bg-white dark:bg-[#002466]/40 border border-gray-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-2xl">
            <CTA />
        </div>
      </div>
    </div>
  );
};

export default SEOPage;