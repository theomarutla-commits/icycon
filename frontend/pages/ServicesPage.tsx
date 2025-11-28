
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Bot, MessageSquare, Mail, Globe, Link as LinkIcon, 
  MapPin, Zap, Smartphone, ShoppingBag, PenTool, LayoutGrid 
} from 'lucide-react';
import CTA from '../components/CTA';

const pillars = [
  {
    icon: <LayoutGrid className="w-6 h-6" />,
    title: "SEO Platform",
    description: "Comprehensive technical SEO, content strategy, local/GBP optimization, and Search Console orchestration to build your digital foundation."
  },
  {
    icon: <Bot className="w-6 h-6" />,
    title: "Answer Engine Optimization (AEO)",
    description: "The next evolution of SEO. We optimize your brand for Large Language Models (LLMs) like ChatGPT, Claude, and Perplexity."
  },
  {
    icon: <MessageSquare className="w-6 h-6" />,
    title: "Social & Community Marketing",
    description: "Powered by 'Riona', our policy-compliant agent, we drive engagement across social platforms and manage your community effectively."
  },
  {
    icon: <Mail className="w-6 h-6" />,
    title: "Email & SMS Revenue Engine",
    description: "High-converting opt-in flows paired with lawful B2B cold outreach. Turn leads into lifelong customers."
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: "Multilingual SEO",
    description: "Expand globally with automated translation, proper hreflang implementation, and dedicated language URLs."
  },
  {
    icon: <LinkIcon className="w-6 h-6" />,
    title: "Backlink Acquisition",
    description: "Ethical digital PR and high-quality resource links to boost your domain authority and search rankings."
  },
  {
    icon: <MapPin className="w-6 h-6" />,
    title: "Directory & Citation Submissions",
    description: "Curated, quality-first submissions to authoritative directories to solidify your local and global presence."
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Free Zone: Converge Market Reach",
    description: "Always-on creative ideas and micro-tools designed to capture top-of-funnel traffic and engage users."
  },
  {
    icon: <Smartphone className="w-6 h-6" />,
    title: "App Store Optimization (ASO)",
    description: "Dominate the iOS App Store and Google Play Store with keyword optimization, visual assets, and review management."
  },
  {
    icon: <ShoppingBag className="w-6 h-6" />,
    title: "Marketplace & Directory Listings",
    description: "Strategic placement on platforms like G2, Capterra, Shopify App Store, and Chrome Web Store tailored to your niche."
  },
  {
    icon: <PenTool className="w-6 h-6" />,
    title: "Trending Blog Engine",
    description: "End-to-end content production: Topic research → Briefs → Drafts → Scheduling. Ride the wave of trending topics."
  }
];

const ServicesPage: React.FC = () => {
  return (
    <div className="pt-24 pb-12 px-4 bg-slate-50 dark:bg-icy-dark min-h-screen">
      <div className="w-[90%] lg:w-[90%] mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h1 
            {...({
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 }
            } as any)}
            className="text-5xl md:text-6xl font-bold mb-6 text-icy-dark dark:text-white"
          >
            The <span className="text-icy-main">11 Pillars</span> of Growth
          </motion.h1>
          <motion.p 
             {...({
                initial: { opacity: 0 },
                animate: { opacity: 1 },
                transition: { delay: 0.2 }
             } as any)}
             className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
          >
            Icycon isn't just a tool; it's a multi-tenant engine designed to drive converting traffic through a holistic digital ecosystem.
          </motion.p>
        </div>

        {/* Grid Title */}
        <div className="mb-12 border-b border-gray-200 dark:border-white/10 pb-4">
           <h2 className="text-2xl font-bold">Deep Dive into Services</h2>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {pillars.map((pillar, index) => (
            <motion.div
              key={index}
              {...({
                  initial: { opacity: 0, y: 20 },
                  whileInView: { opacity: 1, y: 0 },
                  viewport: { once: true },
                  transition: { delay: index * 0.05 }
              } as any)}
              className="bg-white dark:bg-[#002466]/40 border border-gray-200 dark:border-white/10 p-8 rounded-3xl hover:border-icy-main transition-all hover:shadow-xl group"
            >
              <div className="w-12 h-12 bg-icy-main/10 text-icy-main rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {pillar.icon}
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">{pillar.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {pillar.description}
              </p>
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
