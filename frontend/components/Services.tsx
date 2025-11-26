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
    <section id="services" className="py-24 px-4 bg-white dark:bg-black/20">
      <div className="max-w-7xl mx-auto">
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
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative p-8 rounded-3xl border border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-[#001c4d] hover:bg-white dark:hover:bg-[#002466] transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 overflow-hidden"
            >
              {/* Gradient Blob on Hover */}
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-icy-main/20 rounded-full blur-3xl group-hover:bg-icy-main/40 transition-all duration-500" />
              
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-icy-main text-white flex items-center justify-center mb-6 shadow-lg shadow-icy-main/30 group-hover:scale-110 transition-transform duration-300">
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