import React from 'react';
import QuickCreateCard from '../components/QuickCreateCard';

const FeatureInputPage: React.FC = () => {
  return (
    <div className="pt-24 pb-12 px-4 bg-slate-50 dark:bg-icy-dark min-h-screen">
      <div className="w-[90%] lg:w-[85%] mx-auto space-y-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Feature Data Entry</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">Create records across ASO, Marketplace, Analytics, SEO, Social, and Email. All forms post directly to the backend APIs.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <QuickCreateCard
            title="ASO App"
            description="POST /api/aso/apps/"
            endpoint="/api/aso/apps/"
            fields={[
              { name: 'name', label: 'App name', placeholder: 'My App' },
              { name: 'platform', label: 'Platform', placeholder: 'ios' },
              { name: 'bundle_id', label: 'Bundle ID', placeholder: 'com.example.app' },
            ]}
          />

          <QuickCreateCard
            title="Marketplace Product"
            description="POST /api/marketplace/products/"
            endpoint="/api/marketplace/products/"
            fields={[
              { name: 'title', label: 'Title', placeholder: 'Product name' },
              { name: 'price', label: 'Price', placeholder: '99.00' },
              { name: 'status', label: 'Status', placeholder: 'active' },
            ]}
          />

          <QuickCreateCard
            title="Analytics Site"
            description="POST /api/analytics/sites/"
            endpoint="/api/analytics/sites/"
            fields={[
              { name: 'domain', label: 'Domain', placeholder: 'https://example.com' },
              { name: 'default_locale', label: 'Locale', placeholder: 'en' },
              { name: 'sitemaps_url', label: 'Sitemaps URL', placeholder: 'https://example.com/sitemap.xml' },
            ]}
          />

          <QuickCreateCard
            title="SEO Keyword Cluster"
            description="POST /api/seo/keywords/"
            endpoint="/api/seo/keywords/"
            fields={[
              { name: 'intent', label: 'Intent/Topic', placeholder: 'buy running shoes' },
              { name: 'terms', label: 'Terms (comma separated)', placeholder: 'best shoes,running shoes' },
              { name: 'locale', label: 'Locale', placeholder: 'en' },
            ]}
          />

          <QuickCreateCard
            title="SEO Content Item"
            description="POST /api/seo/content/"
            endpoint="/api/seo/content/"
            fields={[
              { name: 'url', label: 'URL', placeholder: 'https://example.com/blog/post' },
              { name: 'type', label: 'Type', placeholder: 'blog' },
              { name: 'status', label: 'Status', placeholder: 'draft' },
              { name: 'locale', label: 'Locale', placeholder: 'en' },
            ]}
          />

          <QuickCreateCard
            title="SEO FAQ"
            description="POST /api/seo/faqs/"
            endpoint="/api/seo/faqs/"
            fields={[
              { name: 'question', label: 'Question', placeholder: 'How do we rank?' },
              { name: 'answer', label: 'Answer', placeholder: 'By publishing great content', type: 'textarea' },
            ]}
          />

          <QuickCreateCard
            title="SEO Backlink"
            description="POST /api/seo/backlinks/"
            endpoint="/api/seo/backlinks/"
            fields={[
              { name: 'source_url', label: 'Source URL', placeholder: 'https://source.com/article' },
              { name: 'target_url', label: 'Target URL', placeholder: 'https://your-site.com' },
              { name: 'anchor_text', label: 'Anchor Text', placeholder: 'Brand name' },
              { name: 'status', label: 'Status', placeholder: 'active' },
            ]}
          />

          <QuickCreateCard
            title="SEO Directory"
            description="POST /api/seo/directories/"
            endpoint="/api/seo/directories/"
            fields={[
              { name: 'name', label: 'Directory Name', placeholder: 'Yelp' },
              { name: 'url', label: 'Listing URL', placeholder: 'https://yelp.com/yourbiz' },
            ]}
          />

          <QuickCreateCard
            title="Social Post"
            description="POST /api/social/posts/"
            endpoint="/api/social/posts/"
            fields={[
              { name: 'content', label: 'Content', placeholder: 'Share your update', type: 'textarea' },
              { name: 'platform', label: 'Platform', placeholder: 'general' },
            ]}
          />

          <QuickCreateCard
            title="Email List"
            description="POST /api/email/lists/"
            endpoint="/api/email/lists/"
            fields={[
              { name: 'name', label: 'List name', placeholder: 'Newsletter' },
              { name: 'lawful_basis', label: 'Lawful basis', placeholder: 'consent' },
            ]}
          />

          <QuickCreateCard
            title="Email Template"
            description="POST /api/email/templates/"
            endpoint="/api/email/templates/"
            fields={[
              { name: 'name', label: 'Template name', placeholder: 'Welcome' },
              { name: 'subject', label: 'Subject', placeholder: 'Welcome aboard' },
              { name: 'body_html', label: 'HTML body', placeholder: '<p>Hello!</p>', type: 'textarea' },
            ]}
          />

          <QuickCreateCard
            title="Email Contact"
            description="POST /api/email/contacts/"
            endpoint="/api/email/contacts/"
            fields={[
              { name: 'email', label: 'Email', placeholder: 'user@example.com' },
              { name: 'name', label: 'Name', placeholder: 'Jane Doe' },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default FeatureInputPage;
