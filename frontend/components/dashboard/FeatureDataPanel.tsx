import React, { useState } from 'react';
import { Send, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import { API_BASE, postFeatureData } from '../../lib/api';

const inputStyles =
  'w-full px-3 py-2 rounded-xl bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 focus:outline-none focus:border-icy-main transition-colors text-sm placeholder:text-gray-400';

type ActionKey =
  | 'aso'
  | 'product'
  | 'social'
  | 'directory'
  | 'emailList'
  | 'analyticsSite'
  | 'keywordCluster'
  | 'contentItem'
  | 'faq'
  | 'backlink'
  | 'emailTemplate'
  | 'emailFlow'
  | 'emailContact'
  | 'translateText'
  | 'geoLookup';

type FormState = {
  aso: { name: string; platform: string; bundle_id: string };
  product: { title: string; price: string; status: string };
  social: { content: string; platform: string };
  directory: { name: string; url: string };
  emailList: { name: string; lawful_basis: string };
  analyticsSite: { domain: string; default_locale: string; sitemaps_url: string };
  keywordCluster: { intent: string; terms: string; locale: string };
  contentItem: { url: string; type: string; status: string; locale: string };
  faq: { question: string; answer: string };
  backlink: { source_url: string; target_url: string; anchor_text: string; status: string };
  emailTemplate: { name: string; subject: string; body_html: string };
  emailFlow: { name: string; description: string };
  emailContact: { email: string; name: string };
  translateText: { text: string; target_lang: string };
  geoLookup: { address: string; city: string; state: string; country: string };
};

const initialState: FormState = {
  aso: { name: '', platform: 'ios', bundle_id: '' },
  product: { title: '', price: '', status: 'draft' },
  social: { content: '', platform: 'general' },
  directory: { name: '', url: '' },
  emailList: { name: '', lawful_basis: 'consent' },
  analyticsSite: { domain: '', default_locale: 'en', sitemaps_url: '' },
  keywordCluster: { intent: '', terms: '', locale: 'en' },
  contentItem: { url: '', type: 'blog', status: 'draft', locale: 'en' },
  faq: { question: '', answer: '' },
  backlink: { source_url: '', target_url: '', anchor_text: '', status: 'active' },
  emailTemplate: { name: '', subject: '', body_html: '<p>Welcome!</p>' },
  emailFlow: { name: '', description: 'Email automation flow' },
  emailContact: { email: '', name: '' },
  translateText: { text: '', target_lang: 'es' },
  geoLookup: { address: '', city: '', state: '', country: '' },
};

const buildPayload = (key: ActionKey, forms: FormState) => {
  switch (key) {
    case 'aso':
      return {
        endpoint: '/api/aso/apps/',
        payload: {
          name: forms.aso.name || 'New App',
          platform: forms.aso.platform,
          bundle_id: forms.aso.bundle_id,
        },
      };
    case 'product':
      return {
        endpoint: '/api/marketplace/products/',
        payload: {
          title: forms.product.title || 'Untitled Product',
          price: forms.product.price || '0',
          status: forms.product.status || 'draft',
        },
      };
    case 'social':
      return {
        endpoint: '/api/social/posts/',
        payload: {
          content: forms.social.content || 'Draft post from dashboard',
          platform: forms.social.platform || 'general',
        },
      };
    case 'directory':
      return {
        endpoint: '/api/seo/directories/',
        payload: {
          name: forms.directory.name || 'New Directory',
          url: forms.directory.url || 'https://example.com',
          status: 'submitted',
        },
      };
    case 'emailList':
      return {
        endpoint: '/api/email/lists/',
        payload: {
          name: forms.emailList.name || 'New List',
          lawful_basis: forms.emailList.lawful_basis,
        },
      };
    case 'analyticsSite':
      return {
        endpoint: '/api/analytics/sites/',
        payload: {
          domain: forms.analyticsSite.domain || 'https://example.com',
          default_locale: forms.analyticsSite.default_locale || 'en',
          sitemaps_url: forms.analyticsSite.sitemaps_url,
        },
      };
    case 'keywordCluster':
      return {
        endpoint: '/api/seo/keywords/',
        payload: {
          intent: forms.keywordCluster.intent || forms.keywordCluster.terms || 'New intent',
          terms: forms.keywordCluster.terms,
          locale: forms.keywordCluster.locale || 'en',
        },
      };
    case 'contentItem':
      return {
        endpoint: '/api/seo/content/',
        payload: {
          url: forms.contentItem.url || 'https://example.com',
          type: forms.contentItem.type,
          status: forms.contentItem.status,
          locale: forms.contentItem.locale,
        },
      };
    case 'faq':
      return {
        endpoint: '/api/seo/faqs/',
        payload: {
          question: forms.faq.question || 'New FAQ?',
          answer: forms.faq.answer || 'Answer pending.',
        },
      };
    case 'backlink':
      return {
        endpoint: '/api/seo/backlinks/',
        payload: {
          source_url: forms.backlink.source_url || 'https://source.example.com',
          target_url: forms.backlink.target_url || 'https://example.com',
          anchor_text: forms.backlink.anchor_text,
          status: forms.backlink.status,
        },
      };
    case 'emailTemplate':
      return {
        endpoint: '/api/email/templates/',
        payload: {
          name: forms.emailTemplate.name || 'New Template',
          subject: forms.emailTemplate.subject || 'Subject',
          body_html: forms.emailTemplate.body_html || '<p>Welcome!</p>',
        },
      };
    case 'emailFlow':
      return {
        endpoint: '/api/email/flows/',
        payload: {
          name: forms.emailFlow.name || 'New Flow',
          description: forms.emailFlow.description,
        },
      };
    case 'emailContact':
      return {
        endpoint: '/api/email/contacts/',
        payload: {
          email: forms.emailContact.email,
          name: forms.emailContact.name,
        },
      };
    case 'translateText':
      return {
        endpoint: '/api/translate/',
        payload: {
          text: forms.translateText.text,
          target_lang: forms.translateText.target_lang || 'es',
        },
      };
    case 'geoLookup':
      return {
        endpoint: '/api/geo/lookup/',
        payload: {
          address: forms.geoLookup.address,
          city: forms.geoLookup.city,
          state: forms.geoLookup.state,
          country: forms.geoLookup.country,
        },
      };
    default:
      return { endpoint: '/', payload: {} };
  }
};

type StatusMap = Record<ActionKey, { type: 'success' | 'error'; message: string } | undefined>;

const labels: Record<ActionKey, { title: string; description: string }> = {
  aso: { title: 'ASO App', description: 'Create a new app shell via /api/aso/apps/' },
  product: { title: 'Marketplace Product', description: 'Post to /api/marketplace/products/' },
  social: { title: 'Social Post', description: 'Draft a post via /api/social/posts/' },
  directory: { title: 'SEO Directory', description: 'Add a citation via /api/seo/directories/' },
  emailList: { title: 'Email List', description: 'Capture a list via /api/email/lists/' },
  analyticsSite: { title: 'Analytics Site', description: 'Add a tracked site via /api/analytics/sites/' },
  keywordCluster: { title: 'Keyword Cluster', description: 'Seed a cluster via /api/seo/keywords/' },
  contentItem: { title: 'Content Item', description: 'Create content via /api/seo/content/' },
  faq: { title: 'FAQ Entry', description: 'Add FAQs via /api/seo/faqs/' },
  backlink: { title: 'Backlink', description: 'Record backlink via /api/seo/backlinks/' },
  emailTemplate: { title: 'Email Template', description: 'Create template via /api/email/templates/' },
  emailFlow: { title: 'Email Flow', description: 'Create flow via /api/email/flows/' },
  emailContact: { title: 'Email Contact', description: 'Add subscriber via /api/email/contacts/' },
  translateText: { title: 'Translate', description: 'Call /api/translate/ with text + target_lang' },
  geoLookup: { title: 'Geo Lookup', description: 'Geocode address via /api/geo/lookup/' },
};

export default function FeatureDataPanel() {
  const [forms, setForms] = useState<FormState>(initialState);
  const [status, setStatus] = useState<StatusMap>({} as StatusMap);
  const [loading, setLoading] = useState<ActionKey | null>(null);

  const handleChange = (key: ActionKey, field: string, value: string) => {
    setForms((prev) => {
      const nextSection = { ...(prev[key] as Record<string, string>), [field]: value };
      return { ...prev, [key]: nextSection as any };
    });
  };

  const submit = async (key: ActionKey) => {
    setLoading(key);
    setStatus((prev) => ({ ...prev, [key]: undefined }));
    try {
      const { endpoint, payload } = buildPayload(key, forms);
      const res = await postFeatureData(endpoint, payload);
      setStatus((prev) => ({
        ...prev,
        [key]: { type: 'success', message: `Sent to ${endpoint}` },
      }));
      setForms((prev) => ({ ...prev, [key]: initialState[key] }));
      return res;
    } catch (err: any) {
      setStatus((prev) => ({
        ...prev,
        [key]: { type: 'error', message: err?.message || 'Request failed' },
      }));
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-3xl p-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Wire data into the backend</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Uses Basic auth against <span className="text-icy-main font-semibold">{API_BASE || 'http://localhost:8000'}</span>.
          </p>
        </div>
        <div className="text-xs px-3 py-1 rounded-full bg-icy-main/10 text-icy-main font-semibold">
          POST enabled endpoints
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <PanelCard title={labels.aso.title} description={labels.aso.description} onSubmit={() => submit('aso')} status={status.aso} loading={loading === 'aso'}>
          <div className="grid grid-cols-2 gap-3">
            <input className={inputStyles} placeholder="App name" value={forms.aso.name} onChange={(e) => handleChange('aso', 'name', e.target.value)} />
            <select className={inputStyles} value={forms.aso.platform} onChange={(e) => handleChange('aso', 'platform', e.target.value)}>
              <option value="ios">iOS</option>
              <option value="android">Android</option>
            </select>
            <input className={`${inputStyles} col-span-2`} placeholder="Bundle ID (optional)" value={forms.aso.bundle_id} onChange={(e) => handleChange('aso', 'bundle_id', e.target.value)} />
          </div>
        </PanelCard>

        <PanelCard title={labels.product.title} description={labels.product.description} onSubmit={() => submit('product')} status={status.product} loading={loading === 'product'}>
          <div className="grid grid-cols-2 gap-3">
            <input className={`${inputStyles} col-span-2`} placeholder="Product title" value={forms.product.title} onChange={(e) => handleChange('product', 'title', e.target.value)} />
            <input className={inputStyles} placeholder="Price" value={forms.product.price} onChange={(e) => handleChange('product', 'price', e.target.value)} />
            <input className={inputStyles} placeholder="Status (draft/active)" value={forms.product.status ?? ''} onChange={(e) => handleChange('product', 'status', e.target.value)} />
          </div>
        </PanelCard>

        <PanelCard title={labels.social.title} description={labels.social.description} onSubmit={() => submit('social')} status={status.social} loading={loading === 'social'}>
          <div className="grid grid-cols-1 gap-3">
            <textarea className={`${inputStyles} min-h-[96px]`} placeholder="Write a quick post" value={forms.social.content} onChange={(e) => handleChange('social', 'content', e.target.value)} />
            <input className={inputStyles} placeholder="Platform (optional)" value={forms.social.platform} onChange={(e) => handleChange('social', 'platform', e.target.value)} />
          </div>
        </PanelCard>

        <PanelCard title={labels.directory.title} description={labels.directory.description} onSubmit={() => submit('directory')} status={status.directory} loading={loading === 'directory'}>
          <div className="grid grid-cols-1 gap-3">
            <input className={inputStyles} placeholder="Directory name" value={forms.directory.name} onChange={(e) => handleChange('directory', 'name', e.target.value)} />
            <input className={inputStyles} placeholder="https://example.com/listing" value={forms.directory.url} onChange={(e) => handleChange('directory', 'url', e.target.value)} />
          </div>
        </PanelCard>

        <PanelCard title={labels.emailList.title} description={labels.emailList.description} onSubmit={() => submit('emailList')} status={status.emailList} loading={loading === 'emailList'}>
          <div className="grid grid-cols-2 gap-3">
            <input className={`${inputStyles} col-span-2`} placeholder="List name" value={forms.emailList.name} onChange={(e) => handleChange('emailList', 'name', e.target.value)} />
            <select className={inputStyles} value={forms.emailList.lawful_basis} onChange={(e) => handleChange('emailList', 'lawful_basis', e.target.value)}>
              <option value="consent">Consent</option>
              <option value="contract">Contract</option>
              <option value="legitimate_interest">Legitimate Interest</option>
            </select>
          </div>
        </PanelCard>

        <PanelCard title={labels.analyticsSite.title} description={labels.analyticsSite.description} onSubmit={() => submit('analyticsSite')} status={status.analyticsSite} loading={loading === 'analyticsSite'}>
          <div className="grid grid-cols-1 gap-3">
            <input className={inputStyles} placeholder="https://yourdomain.com" value={forms.analyticsSite.domain} onChange={(e) => handleChange('analyticsSite', 'domain', e.target.value)} />
            <input className={inputStyles} placeholder="Default locale (en)" value={forms.analyticsSite.default_locale} onChange={(e) => handleChange('analyticsSite', 'default_locale', e.target.value)} />
            <input className={inputStyles} placeholder="Sitemaps URL (optional)" value={forms.analyticsSite.sitemaps_url} onChange={(e) => handleChange('analyticsSite', 'sitemaps_url', e.target.value)} />
          </div>
        </PanelCard>

        <PanelCard title={labels.keywordCluster.title} description={labels.keywordCluster.description} onSubmit={() => submit('keywordCluster')} status={status.keywordCluster} loading={loading === 'keywordCluster'}>
          <div className="grid grid-cols-1 gap-3">
            <input className={inputStyles} placeholder="Intent / topic" value={forms.keywordCluster.intent} onChange={(e) => handleChange('keywordCluster', 'intent', e.target.value)} />
            <input className={inputStyles} placeholder="Terms (comma separated)" value={forms.keywordCluster.terms} onChange={(e) => handleChange('keywordCluster', 'terms', e.target.value)} />
            <input className={inputStyles} placeholder="Locale" value={forms.keywordCluster.locale} onChange={(e) => handleChange('keywordCluster', 'locale', e.target.value)} />
          </div>
        </PanelCard>

        <PanelCard title={labels.contentItem.title} description={labels.contentItem.description} onSubmit={() => submit('contentItem')} status={status.contentItem} loading={loading === 'contentItem'}>
          <div className="grid grid-cols-2 gap-3">
            <input className={`${inputStyles} col-span-2`} placeholder="Content URL" value={forms.contentItem.url} onChange={(e) => handleChange('contentItem', 'url', e.target.value)} />
            <input className={inputStyles} placeholder="Type (blog/page)" value={forms.contentItem.type} onChange={(e) => handleChange('contentItem', 'type', e.target.value)} />
            <input className={inputStyles} placeholder="Status (draft/published)" value={forms.contentItem.status} onChange={(e) => handleChange('contentItem', 'status', e.target.value)} />
            <input className={inputStyles} placeholder="Locale" value={forms.contentItem.locale} onChange={(e) => handleChange('contentItem', 'locale', e.target.value)} />
          </div>
        </PanelCard>

        <PanelCard title={labels.faq.title} description={labels.faq.description} onSubmit={() => submit('faq')} status={status.faq} loading={loading === 'faq'}>
          <div className="grid grid-cols-1 gap-3">
            <input className={inputStyles} placeholder="Question" value={forms.faq.question} onChange={(e) => handleChange('faq', 'question', e.target.value)} />
            <textarea className={`${inputStyles} min-h-[80px]`} placeholder="Answer" value={forms.faq.answer} onChange={(e) => handleChange('faq', 'answer', e.target.value)} />
          </div>
        </PanelCard>

        <PanelCard title={labels.backlink.title} description={labels.backlink.description} onSubmit={() => submit('backlink')} status={status.backlink} loading={loading === 'backlink'}>
          <div className="grid grid-cols-1 gap-3">
            <input className={inputStyles} placeholder="Source URL" value={forms.backlink.source_url} onChange={(e) => handleChange('backlink', 'source_url', e.target.value)} />
            <input className={inputStyles} placeholder="Target URL" value={forms.backlink.target_url} onChange={(e) => handleChange('backlink', 'target_url', e.target.value)} />
            <input className={inputStyles} placeholder="Anchor text" value={forms.backlink.anchor_text} onChange={(e) => handleChange('backlink', 'anchor_text', e.target.value)} />
            <input className={inputStyles} placeholder="Status (active/pending)" value={forms.backlink.status} onChange={(e) => handleChange('backlink', 'status', e.target.value)} />
          </div>
        </PanelCard>

        <PanelCard title={labels.emailTemplate.title} description={labels.emailTemplate.description} onSubmit={() => submit('emailTemplate')} status={status.emailTemplate} loading={loading === 'emailTemplate'}>
          <div className="grid grid-cols-1 gap-3">
            <input className={inputStyles} placeholder="Template name" value={forms.emailTemplate.name} onChange={(e) => handleChange('emailTemplate', 'name', e.target.value)} />
            <input className={inputStyles} placeholder="Subject" value={forms.emailTemplate.subject} onChange={(e) => handleChange('emailTemplate', 'subject', e.target.value)} />
            <textarea className={`${inputStyles} min-h-[80px]`} placeholder="HTML body" value={forms.emailTemplate.body_html} onChange={(e) => handleChange('emailTemplate', 'body_html', e.target.value)} />
          </div>
        </PanelCard>

        <PanelCard title={labels.emailFlow.title} description={labels.emailFlow.description} onSubmit={() => submit('emailFlow')} status={status.emailFlow} loading={loading === 'emailFlow'}>
          <div className="grid grid-cols-1 gap-3">
            <input className={inputStyles} placeholder="Flow name" value={forms.emailFlow.name} onChange={(e) => handleChange('emailFlow', 'name', e.target.value)} />
            <textarea className={`${inputStyles} min-h-[60px]`} placeholder="Description" value={forms.emailFlow.description} onChange={(e) => handleChange('emailFlow', 'description', e.target.value)} />
          </div>
        </PanelCard>

        <PanelCard title={labels.emailContact.title} description={labels.emailContact.description} onSubmit={() => submit('emailContact')} status={status.emailContact} loading={loading === 'emailContact'}>
          <div className="grid grid-cols-1 gap-3">
            <input className={inputStyles} placeholder="Subscriber email" value={forms.emailContact.email} onChange={(e) => handleChange('emailContact', 'email', e.target.value)} />
            <input className={inputStyles} placeholder="Name" value={forms.emailContact.name} onChange={(e) => handleChange('emailContact', 'name', e.target.value)} />
          </div>
        </PanelCard>

        <PanelCard title={labels.translateText.title} description={labels.translateText.description} onSubmit={() => submit('translateText')} status={status.translateText} loading={loading === 'translateText'}>
          <div className="grid grid-cols-1 gap-3">
            <textarea className={`${inputStyles} min-h-[80px]`} placeholder="Text to translate" value={forms.translateText.text} onChange={(e) => handleChange('translateText', 'text', e.target.value)} />
            <input className={inputStyles} placeholder="Target language (es)" value={forms.translateText.target_lang} onChange={(e) => handleChange('translateText', 'target_lang', e.target.value)} />
          </div>
        </PanelCard>

        <PanelCard title={labels.geoLookup.title} description={labels.geoLookup.description} onSubmit={() => submit('geoLookup')} status={status.geoLookup} loading={loading === 'geoLookup'}>
          <div className="grid grid-cols-2 gap-3">
            <input className={`${inputStyles} col-span-2`} placeholder="Street address" value={forms.geoLookup.address} onChange={(e) => handleChange('geoLookup', 'address', e.target.value)} />
            <input className={inputStyles} placeholder="City" value={forms.geoLookup.city} onChange={(e) => handleChange('geoLookup', 'city', e.target.value)} />
            <input className={inputStyles} placeholder="State/Region" value={forms.geoLookup.state} onChange={(e) => handleChange('geoLookup', 'state', e.target.value)} />
            <input className={`${inputStyles} col-span-2`} placeholder="Country" value={forms.geoLookup.country} onChange={(e) => handleChange('geoLookup', 'country', e.target.value)} />
          </div>
        </PanelCard>
      </div>
    </div>
  );
}

function PanelCard({
  title,
  description,
  onSubmit,
  children,
  status,
  loading,
}: {
  title: string;
  description: string;
  onSubmit: () => void;
  children: React.ReactNode;
  status?: { type: 'success' | 'error'; message: string };
  loading?: boolean;
}) {
  return (
    <div className="p-4 border border-gray-200 dark:border-white/10 rounded-2xl bg-gray-50/60 dark:bg-white/5">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white">{title}</h4>
          <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
        </div>
        <button
          onClick={onSubmit}
          disabled={loading}
          className="px-3 py-2 bg-icy-main text-white rounded-xl text-xs font-semibold flex items-center gap-2 hover:bg-blue-600 transition-colors disabled:opacity-70"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          Send
        </button>
      </div>
      <div className="space-y-3">{children}</div>
      {status && (
        <div
          className={`mt-3 flex items-center gap-2 text-xs rounded-lg px-3 py-2 ${
            status.type === 'success'
              ? 'bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-200'
              : 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-200'
          }`}
        >
          {status.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <AlertTriangle className="w-4 h-4" />
          )}
          <span>{status.message}</span>
        </div>
      )}
    </div>
  );
}
