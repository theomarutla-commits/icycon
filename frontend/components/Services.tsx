
import React from 'react';
import { motion } from 'framer-motion';
import { Search, Globe, Share2, Mail, Smartphone } from 'lucide-react';

const services = [
  {
    icon: <Search className="w-8 h-8" />,
    title: "SEO, GEO & AEO",
    description: "Dominate search engines and AI answer engines. We optimize for Google, Bing, and LLMs like ChatGPT and Perplexity."
  },
  {
    icon: <Share2 className="w-8 h-8" />,
    title: "Social Media Management",
    description: "Full-stack social strategy. From content creation to community management, we amplify your voice across all platforms."
  },
  {
    icon: <Mail className="w-8 h-8" />,
    title: "Email & SMS Revenue Engine",
    description: "Turn subscribers into superfans. High-converting flows and campaigns designed to maximize LTV."
  },
  {
    icon: <Smartphone className="w-8 h-8" />,
    title: "App Store Optimization",
    description: "Climb the charts. Localized assets, keyword optimization, and review ops to boost downloads."
  },
  {
    icon: <Globe className="w-8 h-8" />,
    title: "Global Localization",
    description: "Expand your reach. Multilingual SEO and cultural adaptation for diverse neighborhoods and international markets."
  }
];

const Services: React.FC = () => {
  return (
    <section id="services" className="py-24 px-4 bg-white dark:bg-black/20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[20%] left-[-10%] w-[600px] h-[600px] bg-icy-main/10 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Our Core Services</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            A holistic suite of digital performance tools designed for the modern algorithm.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={index}
              {...({
                  initial: { opacity: 0, y: 20 },
                  whileInView: { opacity: 1, y: 0 },
                  viewport: { once: true },
                  transition: { delay: index * 0.1 }
              } as any)}
              className="group relative p-8 rounded-3xl border border-white/40 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur-xl hover:shadow-2xl dark:hover:shadow-black/30 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              {/* Gradient Blob on Hover */}
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-icy-main/20 rounded-full blur-3xl group-hover:bg-icy-main/40 transition-all duration-500 opacity-0 group-hover:opacity-100" />
              
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-icy-main to-icy-deep text-white flex items-center justify-center mb-6 shadow-lg shadow-icy-main/30 group-hover:scale-110 transition-transform duration-300">
                  {service.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {service.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
