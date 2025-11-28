
import React from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, ShoppingBag, MapPin, PenTool } from 'lucide-react';
import CTA from '../components/CTA';

const features = [
  {
    icon: <Mail className="w-6 h-6" />,
    title: "Email & SMS Engine",
    desc: "Automated high-converting flows (Welcome, Abandoned Cart) and broadcast campaigns that print revenue."
  },
  {
    icon: <ShoppingBag className="w-6 h-6" />,
    title: "Marketplace Listings",
    desc: "Strategic placement on platforms like G2, Capterra, and Amazon to capture high-intent buyers."
  },
  {
    icon: <MapPin className="w-6 h-6" />,
    title: "Directory Submissions",
    desc: "Curated, quality-first submissions to authoritative directories to solidify your local presence."
  },
  {
    icon: <PenTool className="w-6 h-6" />,
    title: "Blog Engine & Backlinks",
    desc: "End-to-end content production and ethical digital PR to drive organic traffic and domain authority."
  }
];

const ReachPage: React.FC = () => {
  return (
    <div className="pt-24 pb-12 px-4 bg-slate-50 dark:bg-icy-dark min-h-screen relative overflow-hidden transition-colors duration-300">
      {/* Ambient Background Blobs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(249,115,22,0.1),transparent_50%)]" />
        <div className="absolute top-[30%] right-[-10%] w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[120px] opacity-40 dark:opacity-20" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-icy-deep/20 rounded-full blur-[100px] opacity-40 dark:opacity-20" />
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
            Maximize Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">Reach</span>
          </motion.h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Expand your footprint beyond your website. We connect you with customers wherever they are—inboxes, directories, or marketplaces.
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
              className="bg-white/60 dark:bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/40 dark:border-white/10 hover:border-orange-500/50 hover:shadow-xl dark:hover:shadow-black/30 transition-all duration-300 group"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-white to-gray-100 dark:from-white/10 dark:to-white/5 text-orange-500 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-white/20 dark:border-white/5 group-hover:scale-110 transition-transform">
                {f.icon}
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-orange-500 transition-colors">{f.title}</h3>
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

export default ReachPage;
