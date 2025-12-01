
import React from 'react';
import { motion } from 'framer-motion';
import { Search, Globe, Zap, BarChart, Bot } from 'lucide-react';
import CTA from '../components/CTA';
import QuickCreateCard from '../components/QuickCreateCard';
import { Link } from 'react-router-dom';

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
            {...({
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 }
            } as any)}
            className="text-5xl md:text-6xl font-bold mb-6 text-gray-900 dark:text-white"
          >
            Dominate <span className="text-icy-main">Search & AI</span>
          </motion.h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Future-proof your visibility. We combine traditional technical SEO with cutting-edge Answer Engine Optimization to ensure you rank on Google and be the answer on AI.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              to="/seo/data"
              className="inline-flex px-5 py-3 bg-icy-main text-white rounded-full font-semibold text-sm hover:bg-blue-600 transition-colors"
            >
              SEO Data Entry
            </Link>
            <Link
              to="/data-entry"
              className="inline-flex px-5 py-3 bg-white/80 text-icy-main rounded-full font-semibold text-sm hover:bg-white transition-colors border border-icy-main/20"
            >
              All Features
            </Link>
          </div>
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

        <div className="grid md:grid-cols-2 gap-6 mb-16">
          <QuickCreateCard
            title="Add Analytics Site"
            description="POST /api/analytics/sites/"
            endpoint="/api/analytics/sites/"
            fields={[
              { name: 'domain', label: 'Domain', placeholder: 'https://example.com' },
              { name: 'default_locale', label: 'Locale', placeholder: 'en', defaultValue: 'en' },
              { name: 'sitemaps_url', label: 'Sitemaps URL', placeholder: 'https://example.com/sitemap.xml' },
            ]}
          />
          <QuickCreateCard
            title="Seed Keyword Cluster"
            description="POST /api/seo/keywords/"
            endpoint="/api/seo/keywords/"
            fields={[
              { name: 'intent', label: 'Intent/Topic', placeholder: 'buy running shoes' },
              { name: 'terms', label: 'Terms (comma separated)', placeholder: 'best shoes,running shoes' },
              { name: 'locale', label: 'Locale', placeholder: 'en', defaultValue: 'en' },
            ]}
          />
          <QuickCreateCard
            title="Create Content Item"
            description="POST /api/seo/content/"
            endpoint="/api/seo/content/"
            fields={[
              { name: 'url', label: 'URL', placeholder: 'https://example.com/blog/post' },
              { name: 'type', label: 'Type', placeholder: 'blog', defaultValue: 'blog' },
              { name: 'status', label: 'Status', placeholder: 'draft', defaultValue: 'draft' },
              { name: 'locale', label: 'Locale', placeholder: 'en', defaultValue: 'en' },
            ]}
          />
          <QuickCreateCard
            title="Add FAQ"
            description="POST /api/seo/faqs/"
            endpoint="/api/seo/faqs/"
            fields={[
              { name: 'question', label: 'Question', placeholder: 'How do I optimize for AI answers?' },
              { name: 'answer', label: 'Answer', placeholder: 'Provide concise, factual responses.', type: 'textarea' },
            ]}
          />
          <QuickCreateCard
            title="Record Backlink"
            description="POST /api/seo/backlinks/"
            endpoint="/api/seo/backlinks/"
            fields={[
              { name: 'source_url', label: 'Source URL', placeholder: 'https://source.com/article' },
              { name: 'target_url', label: 'Target URL', placeholder: 'https://your-site.com' },
              { name: 'anchor_text', label: 'Anchor Text', placeholder: 'Brand name' },
              { name: 'status', label: 'Status', placeholder: 'active', defaultValue: 'active' },
            ]}
          />
          <QuickCreateCard
            title="Add Directory/Citation"
            description="POST /api/seo/directories/"
            endpoint="/api/seo/directories/"
            fields={[
              { name: 'name', label: 'Directory Name', placeholder: 'Yelp' },
              { name: 'url', label: 'Listing URL', placeholder: 'https://yelp.com/biz/your-business' },
            ]}
          />
        </div>

        <div className="bg-white dark:bg-[#002466]/40 border border-gray-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-2xl">
            <CTA />
        </div>
      </div>
    </div>
  );
};

export default SEOPage;
