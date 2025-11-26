import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../lib/AuthContext';
import {
  createKeywordCluster,
  createDirectory,
  translateTextApi,
  createSeoSite,
  createContentItem,
  createFaq,
  createBacklink,
  createSocialPost,
  createEmailList,
  createEmailTemplate,
  createEmailFlow,
  createEmailContact,
  createAsoApp,
  createMarketplaceProduct,
} from '../lib/api';
import { Link } from 'react-router-dom';

const Card: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-white dark:bg-[#001c4d] border border-gray-200 dark:border-white/10 rounded-3xl p-6 shadow-xl space-y-4">
    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
    {children}
  </div>
);

const DataConsole: React.FC = () => {
  const { authHeader } = useAuth();
  const [keywordForm, setKeywordForm] = useState({ intent: '', terms: '', locale: 'en' });
  const [directoryForm, setDirectoryForm] = useState({ name: '', url: '', status: 'submitted' });
  const [translationForm, setTranslationForm] = useState({ text: '', target_lang: 'en' });
  const [seoSiteForm, setSeoSiteForm] = useState({ domain: '', default_locale: 'en' });
  const [contentForm, setContentForm] = useState({ url: '', type: 'page', locale: 'en' });
  const [faqForm, setFaqForm] = useState({ question: '', answer: '' });
  const [backlinkForm, setBacklinkForm] = useState({ domain: '', source_url: '', target_url: '' });
  const [socialForm, setSocialForm] = useState({ content: '', platform: 'general' });
  const [emailListForm, setEmailListForm] = useState({ name: '', lawful_basis: 'consent' });
  const [emailTemplateForm, setEmailTemplateForm] = useState({ name: '', subject: '' });
  const [emailFlowForm, setEmailFlowForm] = useState({ name: '', description: '' });
  const [emailContactForm, setEmailContactForm] = useState({ email: '', name: '' });
  const [asoForm, setAsoForm] = useState({ name: '', platform: 'ios' });
  const [marketForm, setMarketForm] = useState({ title: '', price: 0, category: 'general' });

  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const requireAuth = !authHeader;

  const handleKeywordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authHeader) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await createKeywordCluster(authHeader, {
        intent: keywordForm.intent,
        terms: keywordForm.terms,
        locale: keywordForm.locale,
      });
      setResult(`Keyword cluster created (id: ${res.id})`);
    } catch (err: any) {
      setError(err?.message || 'Failed to create keyword cluster');
    } finally {
      setLoading(false);
    }
  };

  const handleSeoSiteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authHeader) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await createSeoSite(authHeader, seoSiteForm);
      setResult(`Site created (${res.domain})`);
    } catch (err: any) {
      setError(err?.message || 'Failed to create site');
    } finally {
      setLoading(false);
    }
  };

  const handleContentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authHeader) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await createContentItem(authHeader, contentForm);
      setResult(`Content created (id: ${res.id})`);
    } catch (err: any) {
      setError(err?.message || 'Failed to create content item');
    } finally {
      setLoading(false);
    }
  };

  const handleFaqSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authHeader) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await createFaq(authHeader, faqForm);
      setResult(`FAQ created (id: ${res.id})`);
    } catch (err: any) {
      setError(err?.message || 'Failed to create FAQ');
    } finally {
      setLoading(false);
    }
  };

  const handleBacklinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authHeader) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await createBacklink(authHeader, backlinkForm);
      setResult(`Backlink created (id: ${res.id || 'stub'})`);
    } catch (err: any) {
      setError(err?.message || 'Failed to create backlink');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authHeader) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await createSocialPost(authHeader, socialForm);
      setResult(`Social post created (id: ${res.id})`);
    } catch (err: any) {
      setError(err?.message || 'Failed to create social post');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailListSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authHeader) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await createEmailList(authHeader, emailListForm);
      setResult(`Email list created (id: ${res.id})`);
    } catch (err: any) {
      setError(err?.message || 'Failed to create email list');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailTemplateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authHeader) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await createEmailTemplate(authHeader, emailTemplateForm);
      setResult(`Email template created (id: ${res.id})`);
    } catch (err: any) {
      setError(err?.message || 'Failed to create email template');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailFlowSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authHeader) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await createEmailFlow(authHeader, emailFlowForm);
      setResult(`Email flow created (id: ${res.id})`);
    } catch (err: any) {
      setError(err?.message || 'Failed to create email flow');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authHeader) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await createEmailContact(authHeader, emailContactForm);
      setResult(`Contact created (id: ${res.id})`);
    } catch (err: any) {
      setError(err?.message || 'Failed to create contact');
    } finally {
      setLoading(false);
    }
  };

  const handleAsoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authHeader) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await createAsoApp(authHeader, asoForm);
      setResult(`ASO app created (id: ${res.id})`);
    } catch (err: any) {
      setError(err?.message || 'Failed to create ASO app');
    } finally {
      setLoading(false);
    }
  };

  const handleMarketSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authHeader) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await createMarketplaceProduct(authHeader, marketForm);
      setResult(`Product created (id: ${res.id})`);
    } catch (err: any) {
      setError(err?.message || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  const handleDirectorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authHeader) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await createDirectory(authHeader, directoryForm);
      setResult(`Directory submitted (id: ${res.id})`);
    } catch (err: any) {
      setError(err?.message || 'Failed to create directory');
    } finally {
      setLoading(false);
    }
  };

  const handleTranslateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authHeader) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await translateTextApi(authHeader, translationForm);
      setResult(res?.translated || 'Translated.');
    } catch (err: any) {
      setError(err?.message || 'Translation failed');
    } finally {
      setLoading(false);
    }
  };

  if (requireAuth) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 bg-slate-50 dark:bg-icy-dark flex items-center justify-center">
        <div className="bg-white dark:bg-[#001c4d] border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-xl text-center space-y-3">
          <p className="text-gray-700 dark:text-gray-200">Please log in to access the data console.</p>
          <Link to="/auth" className="text-icy-main font-semibold hover:underline">Go to login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-slate-50 dark:bg-icy-dark">
      <div className="w-[92%] lg:w-[70%] mx-auto space-y-10">
        <div className="space-y-2">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-icy-dark dark:text-white"
          >
            Data Console
          </motion.h1>
          <p className="text-gray-600 dark:text-gray-300">
            Create SEO keyword clusters, directory submissions, and run translations against the backend.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card title="Create SEO Site">
            <form className="space-y-3" onSubmit={handleSeoSiteSubmit}>
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Domain</label>
                <input
                  value={seoSiteForm.domain}
                  onChange={(e) => setSeoSiteForm({ ...seoSiteForm, domain: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:outline-none focus:border-icy-main"
                  placeholder="example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Default Locale</label>
                <input
                  value={seoSiteForm.default_locale}
                  onChange={(e) => setSeoSiteForm({ ...seoSiteForm, default_locale: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:outline-none focus:border-icy-main"
                  placeholder="en"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-icy-main text-white py-3 rounded-xl font-semibold hover:bg-blue-600 transition-colors disabled:opacity-60"
              >
                {loading ? 'Working...' : 'Create site'}
              </button>
            </form>
          </Card>

          <Card title="Create Content Item">
            <form className="space-y-3" onSubmit={handleContentSubmit}>
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">URL</label>
                <input
                  value={contentForm.url}
                  onChange={(e) => setContentForm({ ...contentForm, url: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:outline-none focus:border-icy-main"
                  placeholder="https://example.com/page"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Type</label>
                  <input
                    value={contentForm.type}
                    onChange={(e) => setContentForm({ ...contentForm, type: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:outline-none focus:border-icy-main"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Locale</label>
                  <input
                    value={contentForm.locale}
                    onChange={(e) => setContentForm({ ...contentForm, locale: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:outline-none focus:border-icy-main"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-icy-main text-white py-3 rounded-xl font-semibold hover:bg-blue-600 transition-colors disabled:opacity-60"
              >
                {loading ? 'Working...' : 'Create content'}
              </button>
            </form>
          </Card>

          <Card title="Create Keyword Cluster">
            <form className="space-y-3" onSubmit={handleKeywordSubmit}>
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Intent / Keyword</label>
                <input
                  value={keywordForm.intent}
                  onChange={(e) => setKeywordForm({ ...keywordForm, intent: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:outline-none focus:border-icy-main"
                  placeholder="e.g., b2b seo platform"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Terms (comma separated)</label>
                <input
                  value={keywordForm.terms}
                  onChange={(e) => setKeywordForm({ ...keywordForm, terms: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:outline-none focus:border-icy-main"
                  placeholder="seo software, keyword tracking"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Locale</label>
                <input
                  value={keywordForm.locale}
                  onChange={(e) => setKeywordForm({ ...keywordForm, locale: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:outline-none focus:border-icy-main"
                  placeholder="en"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-icy-main text-white py-3 rounded-xl font-semibold hover:bg-blue-600 transition-colors disabled:opacity-60"
              >
                {loading ? 'Working...' : 'Create cluster'}
              </button>
            </form>
          </Card>

          <Card title="Submit Directory">
            <form className="space-y-3" onSubmit={handleDirectorySubmit}>
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Name</label>
                <input
                  value={directoryForm.name}
                  onChange={(e) => setDirectoryForm({ ...directoryForm, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:outline-none focus:border-icy-main"
                  placeholder="Yelp, G2, etc."
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">URL</label>
                <input
                  value={directoryForm.url}
                  onChange={(e) => setDirectoryForm({ ...directoryForm, url: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:outline-none focus:border-icy-main"
                  placeholder="https://example.com/listing"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Status</label>
                <select
                  value={directoryForm.status}
                  onChange={(e) => setDirectoryForm({ ...directoryForm, status: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:outline-none focus:border-icy-main"
                >
                  <option value="submitted">Submitted</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-icy-main text-white py-3 rounded-xl font-semibold hover:bg-blue-600 transition-colors disabled:opacity-60"
              >
                {loading ? 'Working...' : 'Submit directory'}
              </button>
            </form>
          </Card>
        </div>

          <Card title="FAQ & Backlinks">
            <div className="space-y-5">
              <form className="space-y-3" onSubmit={handleFaqSubmit}>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Question</label>
                  <input
                    value={faqForm.question}
                    onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:outline-none focus:border-icy-main"
                    placeholder="What is Icycon?"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Answer</label>
                  <textarea
                    value={faqForm.answer}
                    onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:outline-none focus:border-icy-main"
                    rows={3}
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-icy-main text-white py-3 rounded-xl font-semibold hover:bg-blue-600 transition-colors disabled:opacity-60"
                >
                  {loading ? 'Working...' : 'Create FAQ'}
                </button>
              </form>

              <form className="space-y-3" onSubmit={handleBacklinkSubmit}>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Domain</label>
                  <input
                    value={backlinkForm.domain}
                    onChange={(e) => setBacklinkForm({ ...backlinkForm, domain: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:outline-none focus:border-icy-main"
                    placeholder="example.com"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-3">
                  <input
                    value={backlinkForm.source_url}
                    onChange={(e) => setBacklinkForm({ ...backlinkForm, source_url: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:outline-none focus:border-icy-main"
                    placeholder="Source URL"
                  />
                  <input
                    value={backlinkForm.target_url}
                    onChange={(e) => setBacklinkForm({ ...backlinkForm, target_url: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:outline-none focus:border-icy-main"
                    placeholder="Target URL"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-icy-main text-white py-3 rounded-xl font-semibold hover:bg-blue-600 transition-colors disabled:opacity-60"
                >
                  {loading ? 'Working...' : 'Create Backlink'}
                </button>
              </form>
            </div>
          </Card>

          <Card title="Social Post">
            <form className="space-y-3" onSubmit={handleSocialSubmit}>
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Content</label>
                <textarea
                  value={socialForm.content}
                  onChange={(e) => setSocialForm({ ...socialForm, content: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:outline-none focus:border-icy-main"
                  rows={3}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Platform</label>
                <input
                  value={socialForm.platform}
                  onChange={(e) => setSocialForm({ ...socialForm, platform: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:outline-none focus:border-icy-main"
                  placeholder="general"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-icy-main text-white py-3 rounded-xl font-semibold hover:bg-blue-600 transition-colors disabled:opacity-60"
              >
                {loading ? 'Working...' : 'Create post'}
              </button>
            </form>
          </Card>

          <Card title="Email Assets">
            <div className="space-y-4">
              <form className="space-y-2" onSubmit={handleEmailListSubmit}>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">List Name</label>
                <div className="flex gap-2">
                  <input
                    value={emailListForm.name}
                    onChange={(e) => setEmailListForm({ ...emailListForm, name: e.target.value })}
                    className="flex-1 px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:outline-none focus:border-icy-main"
                    required
                  />
                  <button type="submit" disabled={loading} className="px-4 py-3 rounded-xl bg-icy-main text-white font-semibold disabled:opacity-60">
                    {loading ? '...' : 'Add'}
                  </button>
                </div>
              </form>

              <form className="space-y-2" onSubmit={handleEmailTemplateSubmit}>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Template Name & Subject</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    value={emailTemplateForm.name}
                    onChange={(e) => setEmailTemplateForm({ ...emailTemplateForm, name: e.target.value })}
                    className="px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:outline-none focus:border-icy-main"
                    placeholder="Welcome"
                    required
                  />
                  <input
                    value={emailTemplateForm.subject}
                    onChange={(e) => setEmailTemplateForm({ ...emailTemplateForm, subject: e.target.value })}
                    className="px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:outline-none focus:border-icy-main"
                    placeholder="Subject"
                    required
                  />
                </div>
                <button type="submit" disabled={loading} className="w-full px-4 py-3 rounded-xl bg-icy-main text-white font-semibold disabled:opacity-60">
                  {loading ? '...' : 'Add Template'}
                </button>
              </form>

              <form className="space-y-2" onSubmit={handleEmailFlowSubmit}>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Flow</label>
                <input
                  value={emailFlowForm.name}
                  onChange={(e) => setEmailFlowForm({ ...emailFlowForm, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:outline-none focus:border-icy-main"
                  placeholder="Onboarding"
                  required
                />
                <button type="submit" disabled={loading} className="w-full px-4 py-3 rounded-xl bg-icy-main text-white font-semibold disabled:opacity-60">
                  {loading ? '...' : 'Add Flow'}
                </button>
              </form>

              <form className="space-y-2" onSubmit={handleEmailContactSubmit}>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Contact</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    value={emailContactForm.email}
                    onChange={(e) => setEmailContactForm({ ...emailContactForm, email: e.target.value })}
                    className="px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:outline-none focus:border-icy-main"
                    placeholder="user@example.com"
                    required
                  />
                  <input
                    value={emailContactForm.name}
                    onChange={(e) => setEmailContactForm({ ...emailContactForm, name: e.target.value })}
                    className="px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:outline-none focus:border-icy-main"
                    placeholder="Name"
                  />
                </div>
                <button type="submit" disabled={loading} className="w-full px-4 py-3 rounded-xl bg-icy-main text-white font-semibold disabled:opacity-60">
                  {loading ? '...' : 'Add Contact'}
                </button>
              </form>
            </div>
          </Card>

          <Card title="ASO & Marketplace">
            <form className="space-y-3" onSubmit={handleAsoSubmit}>
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">App Name</label>
                <input
                  value={asoForm.name}
                  onChange={(e) => setAsoForm({ ...asoForm, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:outline-none focus:border-icy-main"
                  placeholder="My App"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Platform</label>
                <input
                  value={asoForm.platform}
                  onChange={(e) => setAsoForm({ ...asoForm, platform: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:outline-none focus:border-icy-main"
                  placeholder="ios / android"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-icy-main text-white py-3 rounded-xl font-semibold hover:bg-blue-600 transition-colors disabled:opacity-60"
              >
                {loading ? 'Working...' : 'Create ASO app'}
              </button>
            </form>

            <div className="h-px w-full bg-gray-200 dark:bg-white/10 my-4" />

            <form className="space-y-3" onSubmit={handleMarketSubmit}>
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Product Title</label>
                <input
                  value={marketForm.title}
                  onChange={(e) => setMarketForm({ ...marketForm, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:outline-none focus:border-icy-main"
                  placeholder="New product"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  value={marketForm.price}
                  onChange={(e) => setMarketForm({ ...marketForm, price: Number(e.target.value) })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:outline-none focus:border-icy-main"
                  placeholder="Price"
                />
                <input
                  value={marketForm.category}
                  onChange={(e) => setMarketForm({ ...marketForm, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:outline-none focus:border-icy-main"
                  placeholder="Category"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-icy-main text-white py-3 rounded-xl font-semibold hover:bg-blue-600 transition-colors disabled:opacity-60"
              >
                {loading ? 'Working...' : 'Create product'}
              </button>
            </form>
          </Card>

          <Card title="Translate Text (AEO/Multilingual)">
            <form className="space-y-3" onSubmit={handleTranslateSubmit}>
              <div className="grid md:grid-cols-4 gap-3">
              <div className="md:col-span-3">
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Text</label>
                <textarea
                  value={translationForm.text}
                  onChange={(e) => setTranslationForm({ ...translationForm, text: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:outline-none focus:border-icy-main"
                  rows={3}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Target Lang</label>
                <input
                  value={translationForm.target_lang}
                  onChange={(e) => setTranslationForm({ ...translationForm, target_lang: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:outline-none focus:border-icy-main"
                  placeholder="es"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={loading}
                className="bg-icy-main text-white px-5 py-3 rounded-xl font-semibold hover:bg-blue-600 transition-colors disabled:opacity-60"
              >
                {loading ? 'Working...' : 'Translate'}
              </button>
              {error && <span className="text-sm text-red-500">{error}</span>}
              {result && <span className="text-sm text-emerald-500 truncate">{result}</span>}
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default DataConsole;
