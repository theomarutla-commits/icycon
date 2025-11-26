import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import {
  createSeoSite,
  createContentItem,
  createKeywordCluster,
  createBacklink,
  createDirectory,
  translateTextApi,
  createFaq,
  createSocialPost,
  createEmailList,
  createEmailTemplate,
  createEmailFlow,
  createEmailContact,
  createAsoApp,
  createMarketplaceProduct,
} from '../lib/api';
import { useAuth } from '../lib/AuthContext';

type FormHandler = () => JSX.Element;

const FormCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-white dark:bg-[#001c4d] border border-gray-200 dark:border-white/10 rounded-3xl p-6 shadow-xl space-y-4">
    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
    {children}
  </div>
);

const FeatureDataPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { authHeader } = useAuth();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!authHeader) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 bg-slate-50 dark:bg-icy-dark flex items-center justify-center">
        <div className="bg-white dark:bg-[#001c4d] border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-xl text-center space-y-3">
          <p className="text-gray-700 dark:text-gray-200">Please log in to manage data for this feature.</p>
          <Link to="/auth" className="text-icy-main font-semibold hover:underline">Go to login</Link>
        </div>
      </div>
    );
  }

  const handle = async (fn: () => Promise<any>, success: string) => {
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      await fn();
      setMessage(success);
    } catch (err: any) {
      setError(err?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const forms: Record<string, FormHandler[]> = {
    seo: [
      () => {
        const [domain, setDomain] = useState('');
        const [locale, setLocale] = useState('en');
        return (
          <FormCard title="Create SEO Site">
            <form
              className="space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                handle(() => createSeoSite(authHeader, { domain, default_locale: locale }), 'SEO site created');
              }}
            >
              <input value={domain} onChange={(e) => setDomain(e.target.value)} placeholder="example.com" className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10" required />
              <input value={locale} onChange={(e) => setLocale(e.target.value)} placeholder="en" className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10" />
              <button disabled={loading} className="bg-icy-main text-white px-4 py-3 rounded-xl font-semibold w-full disabled:opacity-60">{loading ? 'Working...' : 'Create'}</button>
            </form>
          </FormCard>
        );
      },
      () => {
        const [intent, setIntent] = useState('');
        const [terms, setTerms] = useState('');
        return (
          <FormCard title="Create Keyword Cluster">
            <form
              className="space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                handle(() => createKeywordCluster(authHeader, { intent, terms }), 'Cluster created');
              }}
            >
              <input value={intent} onChange={(e) => setIntent(e.target.value)} placeholder="b2b seo platform" className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10" required />
              <input value={terms} onChange={(e) => setTerms(e.target.value)} placeholder="comma separated terms" className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10" />
              <button disabled={loading} className="bg-icy-main text-white px-4 py-3 rounded-xl font-semibold w-full disabled:opacity-60">{loading ? 'Working...' : 'Create'}</button>
            </form>
          </FormCard>
        );
      },
      () => {
        const [url, setUrl] = useState('');
        const [type, setType] = useState('page');
        const [locale, setLocale] = useState('en');
        return (
          <FormCard title="Add Content Item">
            <form
              className="space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                handle(() => createContentItem(authHeader, { url, type, locale }), 'Content item created');
              }}
            >
              <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com" className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10" required />
              <input value={type} onChange={(e) => setType(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10" />
              <input value={locale} onChange={(e) => setLocale(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10" />
              <button disabled={loading} className="bg-icy-main text-white px-4 py-3 rounded-xl font-semibold w-full disabled:opacity-60">{loading ? 'Working...' : 'Create'}</button>
            </form>
          </FormCard>
        );
      },
    ],
    aeo: [
      () => {
        const [question, setQuestion] = useState('');
        const [answer, setAnswer] = useState('');
        return (
          <FormCard title="Create FAQ">
            <form
              className="space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                handle(() => createFaq(authHeader, { question, answer }), 'FAQ created');
              }}
            >
              <input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Question" className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10" required />
              <textarea value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Answer" className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10" rows={3} required />
              <button disabled={loading} className="bg-icy-main text-white px-4 py-3 rounded-xl font-semibold w-full disabled:opacity-60">{loading ? 'Working...' : 'Create'}</button>
            </form>
          </FormCard>
        );
      },
      () => {
        const [text, setText] = useState('');
        const [lang, setLang] = useState('en');
        return (
          <FormCard title="Translate Text">
            <form
              className="space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                handle(() => translateTextApi(authHeader, { text, target_lang: lang }), 'Translated');
              }}
            >
              <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Your text" className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10" rows={3} required />
              <input value={lang} onChange={(e) => setLang(e.target.value)} placeholder="es" className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10" />
              <button disabled={loading} className="bg-icy-main text-white px-4 py-3 rounded-xl font-semibold w-full disabled:opacity-60">{loading ? 'Working...' : 'Translate'}</button>
            </form>
          </FormCard>
        );
      },
    ],
    social: [
      () => {
        const [content, setContent] = useState('');
        const [platform, setPlatform] = useState('general');
        return (
          <FormCard title="Create Social Post">
            <form
              className="space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                handle(() => createSocialPost(authHeader, { content, platform }), 'Post created');
              }}
            >
              <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Post content" className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10" rows={3} required />
              <input value={platform} onChange={(e) => setPlatform(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10" />
              <button disabled={loading} className="bg-icy-main text-white px-4 py-3 rounded-xl font-semibold w-full disabled:opacity-60">{loading ? 'Working...' : 'Create'}</button>
            </form>
          </FormCard>
        );
      },
    ],
    email: [
      () => {
        const [name, setName] = useState('');
        return (
          <FormCard title="Create Email List">
            <form
              className="space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                handle(() => createEmailList(authHeader, { name }), 'List created');
              }}
            >
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="List name" className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10" required />
              <button disabled={loading} className="bg-icy-main text-white px-4 py-3 rounded-xl font-semibold w-full disabled:opacity-60">{loading ? 'Working...' : 'Create'}</button>
            </form>
          </FormCard>
        );
      },
      () => {
        const [name, setName] = useState('');
        const [subject, setSubject] = useState('');
        return (
          <FormCard title="Create Email Template">
            <form
              className="space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                handle(() => createEmailTemplate(authHeader, { name, subject }), 'Template created');
              }}
            >
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Template name" className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10" required />
              <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10" required />
              <button disabled={loading} className="bg-icy-main text-white px-4 py-3 rounded-xl font-semibold w-full disabled:opacity-60">{loading ? 'Working...' : 'Create'}</button>
            </form>
          </FormCard>
        );
      },
      () => {
        const [name, setName] = useState('');
        return (
          <FormCard title="Create Email Flow">
            <form
              className="space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                handle(() => createEmailFlow(authHeader, { name }), 'Flow created');
              }}
            >
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Flow name" className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10" required />
              <button disabled={loading} className="bg-icy-main text-white px-4 py-3 rounded-xl font-semibold w-full disabled:opacity-60">{loading ? 'Working...' : 'Create'}</button>
            </form>
          </FormCard>
        );
      },
      () => {
        const [email, setEmail] = useState('');
        const [name, setName] = useState('');
        return (
          <FormCard title="Add Contact">
            <form
              className="space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                handle(() => createEmailContact(authHeader, { email, name }), 'Contact created');
              }}
            >
              <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="user@example.com" className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10" required />
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10" />
              <button disabled={loading} className="bg-icy-main text-white px-4 py-3 rounded-xl font-semibold w-full disabled:opacity-60">{loading ? 'Working...' : 'Create'}</button>
            </form>
          </FormCard>
        );
      },
    ],
    multilingual: [
      () => {
        const [text, setText] = useState('');
        const [lang, setLang] = useState('en');
        return (
          <FormCard title="Translate Text">
            <form
              className="space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                handle(() => translateTextApi(authHeader, { text, target_lang: lang }), 'Translated');
              }}
            >
              <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Your text" className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10" rows={3} required />
              <input value={lang} onChange={(e) => setLang(e.target.value)} placeholder="fr" className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10" />
              <button disabled={loading} className="bg-icy-main text-white px-4 py-3 rounded-xl font-semibold w-full disabled:opacity-60">{loading ? 'Working...' : 'Translate'}</button>
            </form>
          </FormCard>
        );
      },
    ],
    backlinks: [
      () => {
        const [domain, setDomain] = useState('');
        const [source, setSource] = useState('');
        const [target, setTarget] = useState('');
        return (
          <FormCard title="Create Backlink">
            <form
              className="space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                handle(() => createBacklink(authHeader, { domain, source_url: source, target_url: target }), 'Backlink created');
              }}
            >
              <input value={domain} onChange={(e) => setDomain(e.target.value)} placeholder="example.com" className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10" />
              <input value={source} onChange={(e) => setSource(e.target.value)} placeholder="Source URL" className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10" />
              <input value={target} onChange={(e) => setTarget(e.target.value)} placeholder="Target URL" className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10" />
              <button disabled={loading} className="bg-icy-main text-white px-4 py-3 rounded-xl font-semibold w-full disabled:opacity-60">{loading ? 'Working...' : 'Create'}</button>
            </form>
          </FormCard>
        );
      },
    ],
    directories: [
      () => {
        const [name, setName] = useState('');
        const [url, setUrl] = useState('');
        return (
          <FormCard title="Submit Directory">
            <form
              className="space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                handle(() => createDirectory(authHeader, { name, url }), 'Directory submitted');
              }}
            >
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Directory name" className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10" required />
              <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com/listing" className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10" required />
              <button disabled={loading} className="bg-icy-main text-white px-4 py-3 rounded-xl font-semibold w-full disabled:opacity-60">{loading ? 'Working...' : 'Submit'}</button>
            </form>
          </FormCard>
        );
      },
    ],
    'free-zone': [
      () => {
        const [text, setText] = useState('');
        return (
          <FormCard title="Free Zone Idea">
            <form
              className="space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                handle(() => translateTextApi(authHeader, { text, target_lang: 'en' }), 'Idea captured');
              }}
            >
              <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Describe your microtool or idea" className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10" rows={3} required />
              <button disabled={loading} className="bg-icy-main text-white px-4 py-3 rounded-xl font-semibold w-full disabled:opacity-60">{loading ? 'Working...' : 'Submit idea'}</button>
            </form>
          </FormCard>
        );
      },
    ],
    aso: [
      () => {
        const [name, setName] = useState('');
        const [platform, setPlatform] = useState('ios');
        return (
          <FormCard title="Create ASO App">
            <form
              className="space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                handle(() => createAsoApp(authHeader, { name, platform }), 'ASO app created');
              }}
            >
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="App name" className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10" required />
              <input value={platform} onChange={(e) => setPlatform(e.target.value)} placeholder="ios / android" className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10" />
              <button disabled={loading} className="bg-icy-main text-white px-4 py-3 rounded-xl font-semibold w-full disabled:opacity-60">{loading ? 'Working...' : 'Create'}</button>
            </form>
          </FormCard>
        );
      },
    ],
    marketplace: [
      () => {
        const [title, setTitle] = useState('');
        const [price, setPrice] = useState<number | string>(0);
        const [category, setCategory] = useState('general');
        return (
          <FormCard title="Create Product">
            <form
              className="space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                handle(() => createMarketplaceProduct(authHeader, { title, price: Number(price), category }), 'Product created');
              }}
            >
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Product title" className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10" required />
              <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price" className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10" />
              <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category" className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10" />
              <button disabled={loading} className="bg-icy-main text-white px-4 py-3 rounded-xl font-semibold w-full disabled:opacity-60">{loading ? 'Working...' : 'Create'}</button>
            </form>
          </FormCard>
        );
      },
    ],
    content: [
      () => {
        const [url, setUrl] = useState('');
        const [type, setType] = useState('page');
        const [locale, setLocale] = useState('en');
        return (
          <FormCard title="Add Content Item">
            <form
              className="space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                handle(() => createContentItem(authHeader, { url, type, locale }), 'Content item created');
              }}
            >
              <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com" className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10" required />
              <input value={type} onChange={(e) => setType(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10" />
              <input value={locale} onChange={(e) => setLocale(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10" />
              <button disabled={loading} className="bg-icy-main text-white px-4 py-3 rounded-xl font-semibold w-full disabled:opacity-60">{loading ? 'Working...' : 'Create'}</button>
            </form>
          </FormCard>
        );
      },
      () => {
        const [intent, setIntent] = useState('');
        const [terms, setTerms] = useState('');
        return (
          <FormCard title="Create Keyword Cluster">
            <form
              className="space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                handle(() => createKeywordCluster(authHeader, { intent, terms }), 'Cluster created');
              }}
            >
              <input value={intent} onChange={(e) => setIntent(e.target.value)} placeholder="intent" className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10" required />
              <input value={terms} onChange={(e) => setTerms(e.target.value)} placeholder="term1, term2" className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10" />
              <button disabled={loading} className="bg-icy-main text-white px-4 py-3 rounded-xl font-semibold w-full disabled:opacity-60">{loading ? 'Working...' : 'Create'}</button>
            </form>
          </FormCard>
        );
      },
    ],
  };

  const currentForms = forms[slug || ''] || [];

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-slate-50 dark:bg-icy-dark">
      <div className="w-[92%] lg:w-[70%] mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold text-icy-dark dark:text-white capitalize">{slug} data</h1>
          <p className="text-gray-600 dark:text-gray-300">Create or submit data for this feature.</p>
          <div className="text-sm mt-2 space-x-2">
            <Link to="/services" className="text-icy-main hover:underline">Back to services</Link>
            <Link to={`/features/${slug}`} className="text-icy-main hover:underline">View feature page</Link>
          </div>
        </motion.div>

        {error && <div className="text-sm text-red-500">{error}</div>}
        {message && <div className="text-sm text-emerald-500">{message}</div>}

        <div className="grid lg:grid-cols-2 gap-5">
          {currentForms.length === 0 && (
            <div className="text-gray-600 dark:text-gray-300">No forms defined for this feature yet.</div>
          )}
          {currentForms.map((Form, idx) => (
            <Form key={idx} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeatureDataPage;
