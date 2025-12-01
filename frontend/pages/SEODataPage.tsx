import React from 'react';
import QuickCreateCard from '../components/QuickCreateCard';

const SEODataPage: React.FC = () => {
  return (
    <div className="pt-24 pb-12 px-4 bg-slate-50 dark:bg-icy-dark min-h-screen">
      <div className="w-[90%] lg:w-[85%] mx-auto space-y-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">SEO Data Entry</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">Create analytics sites, keyword clusters, content items, FAQs, backlinks, and directories.</p>
          <div className="mt-3 text-xs text-gray-600 dark:text-gray-300 bg-white/70 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3">
            These forms automatically send your API key in the <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-white/10">X-API-Key</code> header when <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-white/10">VITE_API_KEY</code> is set in your frontend <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-white/10">.env</code> (e.g., <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-white/10">VITE_API_KEY=your_key_here</code>).
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
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

          <QuickCreateCard
            title="Schedule Repurpose"
            description="POST /api/seo/repurpose/"
            endpoint="/api/seo/repurpose/"
            fields={[
              { name: 'source_url', label: 'Source URL', placeholder: 'https://example.com/blog/post' },
              { name: 'target_formats', label: 'Formats (comma separated)', placeholder: 'twitter,linkedin,email' },
              { name: 'scheduled_for', label: 'Scheduled For (optional ISO datetime)', placeholder: '2025-12-02T10:00:00Z' },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default SEODataPage;
