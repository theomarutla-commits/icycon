import React, { useState } from 'react';
import { Send, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';
import { postFeatureData } from '../lib/api';

type FieldType = 'text' | 'textarea' | 'select';

type Field = {
  name: string;
  label: string;
  placeholder?: string;
  type?: FieldType;
  options?: { label: string; value: string }[];
  defaultValue?: string;
};

type Props = {
  title: string;
  description: string;
  endpoint: string;
  fields: Field[];
};

const inputStyles =
  'w-full px-3 py-2 rounded-xl bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 focus:outline-none focus:border-icy-main transition-colors text-sm placeholder:text-gray-400';

export default function QuickCreateCard({ title, description, endpoint, fields }: Props) {
  const [values, setValues] = useState<Record<string, string>>(
    () =>
      fields.reduce((acc, field) => {
        acc[field.name] = field.defaultValue || '';
        return acc;
      }, {} as Record<string, string>)
  );
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleChange = (name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setStatus(null);
    try {
      await postFeatureData(endpoint, values);
      setStatus({ type: 'success', message: `Sent to ${endpoint}` });
      setValues(() =>
        fields.reduce((acc, field) => {
          acc[field.name] = field.defaultValue || '';
          return acc;
        }, {} as Record<string, string>)
      );
    } catch (err: any) {
      setStatus({ type: 'error', message: err?.message || 'Request failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border border-gray-200 dark:border-white/10 rounded-2xl bg-gray-50/60 dark:bg-white/5">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white">{title}</h4>
          <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
        </div>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-3 py-2 bg-icy-main text-white rounded-xl text-xs font-semibold flex items-center gap-2 hover:bg-blue-600 transition-colors disabled:opacity-70"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          Send
        </button>
      </div>
      <div className="space-y-3">
        {fields.map((field) => {
          const commonProps = {
            className: `${inputStyles} ${field.type === 'textarea' ? 'min-h-[80px]' : ''}`,
            placeholder: field.placeholder,
            value: values[field.name] ?? '',
            onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
              handleChange(field.name, e.target.value),
          };
          if (field.type === 'textarea') {
            return <textarea key={field.name} {...commonProps} />;
          }
          if (field.type === 'select' && field.options) {
            return (
              <select key={field.name} {...commonProps as any}>
                {field.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            );
          }
          return <input key={field.name} type="text" {...commonProps} />;
        })}
      </div>
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
