import React from 'react';
import QuickCreateCard from '../components/QuickCreateCard';

const AeoDataPage: React.FC = () => {
  return (
    <div className="pt-24 pb-12 px-4 bg-slate-50 dark:bg-icy-dark min-h-screen">
      <div className="w-[90%] lg:w-[85%] mx-auto space-y-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">AEO Data Entry</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">Seed AEO-related content and FAQs for answer optimization.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <QuickCreateCard
            title="AEO FAQ"
            description="POST /api/seo/faqs/"
            endpoint="/api/seo/faqs/"
            fields={[
              { name: 'question', label: 'Question', placeholder: 'What is our product?' },
              { name: 'answer', label: 'Answer', placeholder: 'Short, factual answer.', type: 'textarea' },
            ]}
          />
          <QuickCreateCard
            title="AEO Content"
            description="POST /api/seo/content/"
            endpoint="/api/seo/content/"
            fields={[
              { name: 'url', label: 'URL', placeholder: 'https://example.com/aeo' },
              { name: 'type', label: 'Type', placeholder: 'page', defaultValue: 'page' },
              { name: 'status', label: 'Status', placeholder: 'draft', defaultValue: 'draft' },
              { name: 'locale', label: 'Locale', placeholder: 'en', defaultValue: 'en' },
            ]}
          />
          <QuickCreateCard
            title="AEO Backlink"
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
            title="AEO Directory"
            description="POST /api/seo/directories/"
            endpoint="/api/seo/directories/"
            fields={[
              { name: 'name', label: 'Directory Name', placeholder: 'Yelp' },
              { name: 'url', label: 'Listing URL', placeholder: 'https://yelp.com/yourbiz' },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default AeoDataPage;
