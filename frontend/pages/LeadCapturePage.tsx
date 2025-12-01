import React, { useState } from 'react';
import { CheckCircle2, Rocket, Sparkles, Loader2 } from 'lucide-react';
import { submitLead } from '../lib/api';

type LeadFormState = {
  name: string;
  email: string;
  phone: string;
  company: string;
  website: string;
  service_interest: string;
  budget: string;
  message: string;
  source: string;
};

const defaultState: LeadFormState = {
  name: '',
  email: '',
  phone: '',
  company: '',
  website: '',
  service_interest: '',
  budget: '',
  message: '',
  source: 'website',
};

const highlights = [
  'Capture leads across SEO, email, and social in one hub.',
  'Score intent with service interest, budget, and notes.',
  'Route instantly to your tenant for follow-ups.',
];

const LeadCapturePage: React.FC = () => {
  const [form, setForm] = useState<LeadFormState>(defaultState);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleChange = (key: keyof LeadFormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      await submitLead(form);
      setStatus({ type: 'success', message: 'Lead captured. We will follow up shortly.' });
      setForm(defaultState);
    } catch (err: any) {
      setStatus({ type: 'error', message: err?.message || 'Failed to submit lead' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-icy-dark text-white pt-24 pb-16">
      <div className="w-[92%] lg:w-[85%] mx-auto space-y-10">
        <header className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <p className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold tracking-wide uppercase text-icy-main">
              <Sparkles className="w-4 h-4" /> Lead Engine
            </p>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Turn every visit into a conversation and every conversation into a client.
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl">
              Drop qualified leads straight into Icycon with service focus, budget, and intent signals. The forms route through the new `/api/leads/` endpoint and attach your API key automatically.
            </p>
            <div className="grid sm:grid-cols-3 gap-4">
              {highlights.map((item) => (
                <div key={item} className="p-4 rounded-2xl bg-white/5 border border-white/10 text-sm flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-icy-main mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 blur-3xl bg-icy-main/20 -z-10" />
            <form onSubmit={handleSubmit} className="space-y-4 p-6 rounded-3xl bg-[#0c1d3f] border border-white/10 shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-icy-main/20 border border-icy-main/30">
                  <Rocket className="w-6 h-6 text-icy-main" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Capture a lead</h2>
                  <p className="text-xs text-gray-400">Posts to /api/leads/</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-icy-main"
                  placeholder="Name"
                  value={form.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                />
                <input
                  className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-icy-main"
                  placeholder="Email *"
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                />
                <input
                  className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-icy-main"
                  placeholder="Phone"
                  value={form.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                />
                <input
                  className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-icy-main"
                  placeholder="Company"
                  value={form.company}
                  onChange={(e) => handleChange('company', e.target.value)}
                />
                <input
                  className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-icy-main"
                  placeholder="Website"
                  value={form.website}
                  onChange={(e) => handleChange('website', e.target.value)}
                />
                <input
                  className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-icy-main"
                  placeholder="Service of interest"
                  value={form.service_interest}
                  onChange={(e) => handleChange('service_interest', e.target.value)}
                />
                <input
                  className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-icy-main"
                  placeholder="Budget (optional)"
                  value={form.budget}
                  onChange={(e) => handleChange('budget', e.target.value)}
                />
                <input
                  className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-icy-main"
                  placeholder="Source (utm, channel)"
                  value={form.source}
                  onChange={(e) => handleChange('source', e.target.value)}
                />
              </div>

              <textarea
                className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-icy-main min-h-[120px]"
                placeholder="Notes, goals, or pain points"
                value={form.message}
                onChange={(e) => handleChange('message', e.target.value)}
              />

              {status && (
                <div
                  className={`text-sm rounded-xl px-3 py-2 border ${
                    status.type === 'success'
                      ? 'bg-green-500/10 border-green-500/30 text-green-100'
                      : 'bg-red-500/10 border-red-500/30 text-red-100'
                  }`}
                >
                  {status.message}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-icy-main text-white font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Rocket className="w-4 h-4" />}
                {loading ? 'Sending...' : 'Send lead'}
              </button>
            </form>
          </div>
        </header>
      </div>
    </div>
  );
};

export default LeadCapturePage;
