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
            title="Inbound Lead"
            description="POST /api/leads/"
            endpoint="/api/leads/"
            fields={[
              { name: 'name', label: 'Name', placeholder: 'Jane Doe' },
              { name: 'email', label: 'Email', placeholder: 'jane@example.com' },
              { name: 'phone', label: 'Phone', placeholder: '+1 415 555 5555' },
              { name: 'company', label: 'Company', placeholder: 'Acme Co' },
              { name: 'service_interest', label: 'Service Interest', placeholder: 'SEO, Email, Social' },
              { name: 'budget', label: 'Budget', placeholder: '$2k/month' },
              { name: 'message', label: 'Notes', placeholder: 'Goals, pain points', type: 'textarea' },
              { name: 'source', label: 'Source', placeholder: 'utm / channel' },
            ]}
          />

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
            title="Press Pitch"
            description="POST /api/seo/pr-pitches/"
            endpoint="/api/seo/pr-pitches/"
            fields={[
              { name: 'outlet', label: 'Outlet', placeholder: 'TechCrunch' },
              { name: 'pitch_subject', label: 'Subject', placeholder: 'Launch story idea' },
              { name: 'pitch_body', label: 'Pitch Body', placeholder: 'Your pitch', type: 'textarea' },
              { name: 'contact_name', label: 'Contact Name', placeholder: 'Editor' },
              { name: 'contact_email', label: 'Contact Email', placeholder: 'editor@example.com' },
              { name: 'status', label: 'Status', placeholder: 'sent', defaultValue: 'sent' },
              { name: 'article_url', label: 'Article URL', placeholder: 'https://example.com/coverage' },
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

          <QuickCreateCard
            title="Send Email"
            description="POST /api/email/sends/"
            endpoint="/api/email/sends/"
            fields={[
              { name: 'recipient_id', label: 'Recipient ID', placeholder: 'Contact ID' },
              { name: 'template_id', label: 'Template ID (or leave blank)', placeholder: 'Template ID' },
              { name: 'subject', label: 'Subject (if no template)', placeholder: 'Welcome to Icycon' },
              { name: 'body_text', label: 'Body Text', placeholder: 'Plaintext body', type: 'textarea' },
            ]}
          />

          <QuickCreateCard
            title="Send SMS"
            description="POST /api/email/sms/"
            endpoint="/api/email/sms/"
            fields={[
              { name: 'to_number', label: 'To Number (optional; falls back to your phone)', placeholder: '+15551234567' },
              { name: 'body', label: 'Message', placeholder: 'Your SMS message', type: 'textarea' },
            ]}
          />

          <QuickCreateCard
            title="Email Campaign"
            description="POST /api/email/campaigns/"
            endpoint="/api/email/campaigns/"
            fields={[
              { name: 'email_list_id', label: 'Email List ID', placeholder: 'List ID' },
              { name: 'template_id', label: 'Template ID (optional)', placeholder: 'Template ID' },
              { name: 'subject', label: 'Subject (if no template)', placeholder: 'Welcome' },
              { name: 'body_text', label: 'Body Text', placeholder: 'Plaintext body', type: 'textarea' },
              { name: 'body_html', label: 'Body HTML', placeholder: '<p>Hello</p>', type: 'textarea' },
              { name: 'send_now', label: 'Send Now (true/false)', placeholder: 'true', defaultValue: 'true' },
              { name: 'scheduled_for', label: 'Scheduled For (ISO datetime)', placeholder: '2025-12-02T10:00:00Z' },
            ]}
          />

          <QuickCreateCard
            title="Schedule Social Post"
            description="POST /api/social/schedule/"
            endpoint="/api/social/schedule/"
            fields={[
              { name: 'title', label: 'Title', placeholder: 'Post title' },
              { name: 'content', label: 'Content', placeholder: 'Write your post', type: 'textarea' },
              { name: 'platforms', label: 'Platforms (JSON array)', placeholder: '["linkedin","x"]' },
              { name: 'publish_at', label: 'Publish At (ISO datetime)', placeholder: '2025-12-02T10:00:00Z' },
            ]}
          />

          <QuickCreateCard
            title="Translate Text"
            description="POST /api/translate/"
            endpoint="/api/translate/"
            fields={[
              { name: 'text', label: 'Text', placeholder: 'Content to translate', type: 'textarea' },
              { name: 'target_lang', label: 'Target Language', placeholder: 'fr' },
              { name: 'url', label: 'Source URL (optional)', placeholder: 'https://example.com/page' },
            ]}
          />

          <QuickCreateCard
            title="Free Zone Ideas"
            description="POST /api/free-zone/"
            endpoint="/api/free-zone/"
            fields={[
              { name: 'goal', label: 'Goal', placeholder: 'organic growth' },
              { name: 'audience', label: 'Audience', placeholder: 'SMBs' },
              { name: 'vertical', label: 'Vertical', placeholder: 'SaaS' },
              { name: 'regenerate', label: 'Regenerate (true/false)', placeholder: 'true', defaultValue: 'true' },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default FeatureInputPage;
