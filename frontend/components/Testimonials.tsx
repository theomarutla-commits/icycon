
import React from 'react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    text: "Icycon completely transformed our local SEO presence. We're now ranking #1 for all our core keywords in 3 major cities.",
    author: "Sarah Jenkins",
    role: "CMO, BrightHealth Clinics"
  },
  {
    text: "The ASO strategy they implemented increased our organic install rate by 300% in just two months. Unreal results.",
    author: "David Chen",
    role: "Founder, GameBox Studios"
  },
  {
    text: "Finally, an agency that understands how to use LLMs for SEO. Our Answer Engine footprint has exploded.",
    author: "Elena Rodriguez",
    role: "VP Marketing, CloudScale SaaS"
  }
];

const Testimonials: React.FC = () => {
  return (
    <section className="py-24 px-4 bg-icy-main/5">
      <div className="w-[90%] lg:w-[90%] mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">What Our Partners Say</h2>
          <p className="text-gray-600 dark:text-gray-400">Join the ranks of high-growth companies.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              {...({
                  initial: { opacity: 0, y: 30 },
                  whileInView: { opacity: 1, y: 0 },
                  transition: { delay: i * 0.2 }
              } as any)}
              className="bg-white dark:bg-icy-dark p-8 rounded-3xl shadow-xl relative"
            >
              <div className="absolute top-8 right-8 text-6xl text-icy-main/20 font-serif leading-none">"</div>
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 relative z-10 italic">
                {t.text}
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-icy-main to-icy-deep" />
                <div>
                  <h4 className="font-bold text-sm">{t.author}</h4>
                  <p className="text-xs text-gray-500">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Trusted By Logos Strip (Abstract placeholders) */}
        <div className="mt-20 pt-10 border-t border-gray-200 dark:border-white/10">
          <p className="text-center text-sm font-semibold text-gray-400 uppercase tracking-widest mb-8">Trusted by world's most ambitious companies</p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
             {['EY', 'KPMG', 'Mobia', 'Kyndryl', 'Optiv'].map((logo) => (
               <span key={logo} className="text-2xl font-bold font-sans text-gray-800 dark:text-white">{logo}</span>
             ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
