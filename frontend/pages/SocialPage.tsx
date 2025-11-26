import React from 'react';
import { motion } from 'framer-motion';
import { Share2, Heart, MessageCircle, Mic } from 'lucide-react';
import CTA from '../components/CTA';

const features = [
  {
    icon: <Share2 className="w-6 h-6" />,
    title: "Cross-Platform Strategy",
    desc: "Unified content calendars for LinkedIn, X (Twitter), Instagram, and TikTok to ensure consistent brand messaging."
  },
  {
    icon: <BotIcon className="w-6 h-6" />,
    title: "Riona AI Agent",
    desc: "Our policy-compliant AI agent that engages with your community 24/7, answering questions and driving engagement."
  },
  {
    icon: <Mic className="w-6 h-6" />,
    title: "Viral Short-Form",
    desc: "Production and editing for Reels, Shorts, and TikToks designed to hook attention in the first 3 seconds."
  },
  {
    icon: <Heart className="w-6 h-6" />,
    title: "Community Management",
    desc: "We don't just post; we build tribes. Active moderation and engagement to turn followers into advocates."
  }
];

// Helper icon
function BotIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        >
        <path d="M12 8V4H8" />
        <rect width="16" height="12" x="4" y="8" rx="2" />
        <path d="M2 14h2" />
        <path d="M20 14h2" />
        <path d="M15 13v2" />
        <path d="M9 13v2" />
        </svg>
    )
}

const SocialPage: React.FC = () => {
  return (
    <div className="pt-24 pb-12 px-4 bg-slate-50 dark:bg-icy-dark min-h-screen">
      <div className="w-[90%] lg:w-[90%] mx-auto">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bold mb-6 text-gray-900 dark:text-white"
          >
            Amplify Your <span className="text-icy-main">Voice</span>
          </motion.h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            From viral content to deep community building. We leverage human creativity and AI agents to manage your presence across the entire social web.
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

export default SocialPage;