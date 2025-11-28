
import React from 'react';
import { motion } from 'framer-motion';
import { Share2, Globe, Zap, Mic } from 'lucide-react';
import CTA from '../components/CTA';

const features = [
  {
    icon: <Share2 className="w-6 h-6" />,
    title: "Social Media Management",
    desc: "Unified content calendars for LinkedIn, X (Twitter), Instagram, and TikTok to ensure consistent brand messaging."
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: "Multilingual Expansion",
    desc: "Automated translation and cultural adaptation to unlock new international markets and diverse neighborhoods."
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Free Zone Tools",
    desc: "Development of free micro-tools and calculators to act as lead magnets and drive top-of-funnel growth."
  },
  {
    icon: <Mic className="w-6 h-6" />,
    title: "Viral Short-Form",
    desc: "Production and editing for Reels, Shorts, and TikToks designed to hook attention in the first 3 seconds."
  }
];

const GrowthPage: React.FC = () => {
  return (
    <div className="pt-24 pb-12 px-4 bg-slate-50 dark:bg-icy-dark min-h-screen relative overflow-hidden transition-colors duration-300">
      {/* Ambient Background Blobs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(168,85,247,0.1),transparent_50%)]" />
        <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[120px] opacity-40 dark:opacity-20" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-pink-500/20 rounded-full blur-[100px] opacity-40 dark:opacity-20" />
      </div>

      <div className="w-[90%] lg:w-[90%] mx-auto relative z-10">
        <div className="text-center mb-16">
          <motion.h1 
            {...({
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 }
            } as any)}
            className="text-5xl md:text-6xl font-bold mb-6 text-gray-900 dark:text-white"
          >
            Accelerate <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Growth</span>
          </motion.h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Scale faster with viral loops and global infrastructure. We combine social amplification with multilingual strategies to break barriers.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-24">
          {features.map((f, i) => (
            <motion.div 
              key={i}
              {...({
                  initial: { opacity: 0, y: 20 },
                  whileInView: { opacity: 1, y: 0 },
                  transition: { delay: i * 0.1 }
              } as any)}
              className="bg-white/60 dark:bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/40 dark:border-white/10 hover:border-purple-500/50 hover:shadow-xl dark:hover:shadow-black/30 transition-all duration-300 group"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-white to-gray-100 dark:from-white/10 dark:to-white/5 text-purple-500 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-white/20 dark:border-white/5 group-hover:scale-110 transition-transform">
                {f.icon}
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-purple-500 transition-colors">{f.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-3xl overflow-hidden shadow-2xl">
            <CTA />
        </div>
      </div>
    </div>
  );
};

export default GrowthPage;
