import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import CTA from '../components/CTA';
import { featureList } from '../lib/features';

const ServicesPage: React.FC = () => {
  return (
    <div className="pt-24 pb-12 px-4 bg-slate-50 dark:bg-icy-dark min-h-screen">
      <div className="w-[90%] lg:w-[80%] mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bold mb-6 text-icy-dark dark:text-white"
          >
            The <span className="text-icy-main">11 Pillars</span> of Growth
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
          >
            Icycon isn't just a tool; it's a multi-tenant engine designed to drive converting traffic through a
            holistic digital ecosystem.
          </motion.p>
        </div>

        {/* Grid Title */}
        <div className="mb-12 border-b border-gray-200 dark:border-white/10 pb-4">
          <h2 className="text-2xl font-bold">Deep Dive into Services</h2>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {featureList.map((feature, index) => (
            <motion.div
              key={feature.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="bg-white dark:bg-[#002466]/40 border border-gray-200 dark:border-white/10 p-8 rounded-3xl hover:border-icy-main transition-all hover:shadow-xl group"
            >
              <Link to={`/features/${feature.slug}`} className="block space-y-3">
                <div className="w-12 h-12 bg-icy-main/10 text-icy-main rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{feature.cardDescription}</p>
                <span className="inline-flex items-center text-icy-main font-semibold gap-2">
                  View feature <span aria-hidden>+</span>
                </span>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* CTA in a Full Width Card */}
        <div className="bg-white dark:bg-[#002466]/40 border border-gray-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-2xl mb-12">
          <CTA />
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
