import React, { useEffect, useState } from 'react';
import { fetchFeatureIndex, postFeatureData, API_BASE, apiActions } from '../lib/api';

type FeatureOption = {
  key: string;
  name: string;
  description: string;
  endpoint: string;
};

const DataLab: React.FC = () => {
  const [features, setFeatures] = useState<FeatureOption[]>([]);
  const [selected, setSelected] = useState<string>('');
  const [payload, setPayload] = useState<string>('{}');
  const [status, setStatus] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFeatureIndex()
      .then((res) => {
        setFeatures(res);
        if (res.length) setSelected(res[0].endpoint);
      })
      .catch((err) => setStatus(err?.message || 'Failed to load features'));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('');
    setLoading(true);
    let data: Record<string, any> = {};
    try {
      data = payload.trim() ? JSON.parse(payload) : {};
    } catch (err: any) {
      setStatus(`Invalid JSON: ${err?.message || err}`);
      setLoading(false);
      return;
    }
    try {
      await postFeatureData(selected.replace(API_BASE, ''), data);
      setStatus('Sent successfully');
    } catch (err: any) {
      setStatus(err?.message || 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-12 px-4 min-h-screen bg-slate-50 dark:bg-icy-dark">
      <div className="w-[95%] lg:w-[80%] mx-auto bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Data Lab</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Send JSON payloads from the frontend straight to the backend endpoints. API base: {API_BASE}
            </p>
          </div>
          <div className="text-xs px-3 py-1 rounded-full bg-icy-main/10 text-icy-main font-semibold">
            {features.length} endpoints
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Endpoint</label>
            <select
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-white/10 border border-gray-200 dark:border-white/10"
            >
              {features.map((f) => (
                <option key={f.key} value={f.endpoint}>
                  {f.name} — {f.endpoint}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              JSON Payload
            </label>
            <textarea
              value={payload}
              onChange={(e) => setPayload(e.target.value)}
              className="w-full min-h-[180px] px-3 py-2 rounded-xl bg-gray-50 dark:bg-white/10 border border-gray-200 dark:border-white/10 font-mono text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={!selected || loading}
            className="px-4 py-2 rounded-xl bg-icy-main text-white font-semibold disabled:opacity-60"
          >
            {loading ? 'Sending…' : 'Send'}
          </button>

          {status && (
            <div className="text-sm mt-2 text-gray-800 dark:text-gray-200">
              {status}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default DataLab;
