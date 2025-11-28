import React, { useState } from 'react';
import { Send, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import { API_BASE, postFeatureData } from '../../lib/api';

const inputStyles =
  'w-full px-3 py-2 rounded-xl bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 focus:outline-none focus:border-icy-main transition-colors text-sm placeholder:text-gray-400';

type ActionKey = 'aso' | 'product' | 'social' | 'directory' | 'emailList';

type FormState = {
  aso: { name: string; platform: string; bundle_id: string };
  product: { title: string; price: string; status: string };
  social: { content: string; platform: string };
  directory: { name: string; url: string };
  emailList: { name: string; lawful_basis: string };
};

const initialState: FormState = {
  aso: { name: '', platform: 'ios', bundle_id: '' },
  product: { title: '', price: '', status: 'draft' },
  social: { content: '', platform: 'general' },
  directory: { name: '', url: '' },
  emailList: { name: '', lawful_basis: 'consent' },
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

      // Reset only the submitted form for a smoother UX
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
        {/* ASO App */}
        <PanelCard
          title={labels.aso.title}
          description={labels.aso.description}
          onSubmit={() => submit('aso')}
          status={status.aso}
          loading={loading === 'aso'}
        >
          <div className="grid grid-cols-2 gap-3">
            <input
              className={inputStyles}
              placeholder="App name"
              value={forms.aso.name}
              onChange={(e) => handleChange('aso', 'name', e.target.value)}
            />
            <select
              className={inputStyles}
              value={forms.aso.platform}
              onChange={(e) => handleChange('aso', 'platform', e.target.value)}
            >
              <option value="ios">iOS</option>
              <option value="android">Android</option>
            </select>
            <input
              className={`${inputStyles} col-span-2`}
              placeholder="Bundle ID (optional)"
              value={forms.aso.bundle_id}
              onChange={(e) => handleChange('aso', 'bundle_id', e.target.value)}
            />
          </div>
        </PanelCard>

        {/* Marketplace */}
        <PanelCard
          title={labels.product.title}
          description={labels.product.description}
          onSubmit={() => submit('product')}
          status={status.product}
          loading={loading === 'product'}
        >
          <div className="grid grid-cols-2 gap-3">
            <input
              className={`${inputStyles} col-span-2`}
              placeholder="Product title"
              value={forms.product.title}
              onChange={(e) => handleChange('product', 'title', e.target.value)}
            />
            <input
              className={inputStyles}
              placeholder="Price"
              value={forms.product.price}
              onChange={(e) => handleChange('product', 'price', e.target.value)}
            />
            <input
              className={inputStyles}
              placeholder="Status (draft/active)"
              value={forms.product.status ?? ''}
              onChange={(e) => handleChange('product', 'status', e.target.value)}
            />
          </div>
        </PanelCard>

        {/* Social */}
        <PanelCard
          title={labels.social.title}
          description={labels.social.description}
          onSubmit={() => submit('social')}
          status={status.social}
          loading={loading === 'social'}
        >
          <div className="grid grid-cols-1 gap-3">
            <textarea
              className={`${inputStyles} min-h-[96px]`}
              placeholder="Write a quick post…"
              value={forms.social.content}
              onChange={(e) => handleChange('social', 'content', e.target.value)}
            />
            <input
              className={inputStyles}
              placeholder="Platform (optional)"
              value={forms.social.platform}
              onChange={(e) => handleChange('social', 'platform', e.target.value)}
            />
          </div>
        </PanelCard>

        {/* Directories */}
        <PanelCard
          title={labels.directory.title}
          description={labels.directory.description}
          onSubmit={() => submit('directory')}
          status={status.directory}
          loading={loading === 'directory'}
        >
          <div className="grid grid-cols-1 gap-3">
            <input
              className={inputStyles}
              placeholder="Directory name"
              value={forms.directory.name}
              onChange={(e) => handleChange('directory', 'name', e.target.value)}
            />
            <input
              className={inputStyles}
              placeholder="https://example.com/listing"
              value={forms.directory.url}
              onChange={(e) => handleChange('directory', 'url', e.target.value)}
            />
          </div>
        </PanelCard>

        {/* Email list */}
        <PanelCard
          title={labels.emailList.title}
          description={labels.emailList.description}
          onSubmit={() => submit('emailList')}
          status={status.emailList}
          loading={loading === 'emailList'}
        >
          <div className="grid grid-cols-2 gap-3">
            <input
              className={`${inputStyles} col-span-2`}
              placeholder="List name"
              value={forms.emailList.name}
              onChange={(e) => handleChange('emailList', 'name', e.target.value)}
            />
            <select
              className={inputStyles}
              value={forms.emailList.lawful_basis}
              onChange={(e) => handleChange('emailList', 'lawful_basis', e.target.value)}
            >
              <option value="consent">Consent</option>
              <option value="contract">Contract</option>
              <option value="legitimate_interest">Legitimate Interest</option>
            </select>
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
