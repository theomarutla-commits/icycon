
import React from 'react';
import { motion } from 'framer-motion';
import { Store, ShoppingBag, Briefcase, User, Smartphone, Globe } from 'lucide-react';

const markets = [
  {
    icon: <Store className="w-6 h-6" />,
    title: "Local Services",
    subtitle: "Health, Home, Legal",
    features: ["Heavy GBP/Local Search Engine Optimzation", "Review Management", "Directory Dominance", "Multilingual Support"]
  },
  {
    icon: <ShoppingBag className="w-6 h-6" />,
    title: "D2C / eCommerce",
    subtitle: "Retail Brands",
    features: ["Blog + UGC Content", "LLM 'Best of' Ranking", "Seasonal Trend Sprints"]
  },
  {
    icon: <Briefcase className="w-6 h-6" />,
    title: "SaaS & B2B",
    subtitle: "Enterprise Software",
    features: ["Generative Engine optimsation/Answer Engine Optimsation Leadership", "High Intent Content", "Compliant Outreach", "LinkedIn Assets"]
  },
  {
    icon: <User className="w-6 h-6" />,
    title: "Creators & Education",
    subtitle: "Memberships & Courses",
    features: ["YouTube Optimization", "Whop Listing Ranking", "Discord Management", "Email Upsell Loops"]
  },
  {
    icon: <Smartphone className="w-6 h-6" />,
    title: "Mobile Publishers",
    subtitle: "Apps & Games",
    features: ["App Store Optimzation & Store Assets", "Review Operations", "In-App Prompting", "Apple + Google Play Tactics"]
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: "Marketplaces",
    subtitle: "Aggregators",
    features: ["Supply/Demand Search Engine optimsation", "Trust Content Signals", "Digital PR Campaigns", "Answer Engine Footprint"]
  }
];

const TargetMarkets: React.FC = () => {
  return (
    <section id="markets" className="py-24 px-4 bg-icy-secondary/5">
      <div className="w-[90%] lg:w-[90%] mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            {...({
                initial: { opacity: 0, x: -50 },
                whileInView: { opacity: 1, x: 0 },
                viewport: { once: true }
            } as any)}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Tailored Strategies for <br/>
              <span className="text-icy-main">Every Growth Stage</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              A powerful suite to help you master the digital landscape. Get everything you need to attract your audience, optimize every interaction, and expand your reach globally.
            </p>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
              <img 
                src="https://picsum.photos/800/600?grayscale" 
                alt="Growth Strategy" 
                className="w-full h-auto grayscale mix-blend-multiply opacity-80 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-icy-dark to-transparent opacity-90"></div>
              <div className="absolute bottom-8 left-8 right-8">
                <h3 className="text-2xl font-bold text-white mb-2">Data-Driven Creative</h3>
                <p className="text-gray-200">Our content isn't just pretty; it's engineered to convert based on user behavior metrics.</p>
              </div>
            </div>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-6">
            {markets.map((market, index) => (
              <motion.div
                key={index}
                {...({
                    initial: { opacity: 0, y: 20 },
                    whileInView: { opacity: 1, y: 0 },
                    viewport: { once: true },
                    transition: { delay: index * 0.1 }
                } as any)}
                className="bg-white dark:bg-icy-dark/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 dark:border-white/10 hover:border-icy-main/50 transition-colors"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-icy-main/10 text-icy-main rounded-lg">
                    {market.icon}
                  </div>
                  <div>
                    <h4 className="font-bold">{market.title}</h4>
                    <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">{market.subtitle}</span>
                  </div>
                </div>
                <ul className="space-y-2">
                  {market.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <div className="mt-1 w-1.5 h-1.5 rounded-full bg-icy-secondary shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TargetMarkets;
