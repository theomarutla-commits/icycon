import React, { useEffect, useState } from 'react';
import { fetchProfile, updateProfile, updateProfileForm } from '../lib/api';
import { Loader2, Save, User as UserIcon } from 'lucide-react';

interface ProfileForm {
  first_name: string;
  last_name: string;
  email: string;
  organization_name: string;
  region: string;
  plan: string;
  brand_tone: string;
}

const inputStyles =
  'w-full px-4 py-3 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:outline-none focus:border-icy-main transition-colors text-sm placeholder:text-gray-400';

const InfoPill = ({ label, value }: { label: string; value: string }) => (
  <div className="p-4 rounded-2xl bg-white/70 dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm">
    <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
    <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">{value || '—'}</p>
  </div>
);

const ProfilePage: React.FC = () => {
  const [form, setForm] = useState<ProfileForm>({
    first_name: '',
    last_name: '',
    email: '',
    organization_name: '',
    region: '',
    plan: '',
    brand_tone: '',
  });
  const [initials, setInitials] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    fetchProfile()
      .then((data: any) => {
        if (!mounted) return;
        setForm({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          email: data.email || '',
          organization_name: data.organization_name || '',
          region: data.region || '',
          plan: data.plan || '',
          brand_tone: data.brand_tone || '',
        });
        setAvatarUrl(data.avatar || null);
        const f = data.first_name || data.username || data.email || '';
        const l = data.last_name || '';
        const initialsVal = `${(f || '?')[0] || ''}${(l || '')[0] || ''}`.toUpperCase() || 'U';
        setInitials(initialsVal);
      })
      .catch((err: any) => {
        if (mounted) setError(err?.message || 'Unable to load profile');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const handleChange = (field: keyof ProfileForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      if (avatarFile) {
        const fd = new FormData();
        Object.entries(form).forEach(([k, v]) => fd.append(k, v));
        fd.append('avatar', avatarFile);
        const res: any = await updateProfileForm(fd);
        setAvatarUrl(res?.avatar || avatarUrl);
      } else {
        await updateProfile(form);
      }
      setSuccess('Profile updated');
    } catch (err: any) {
      setError(err?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-24 pb-12 px-4 flex items-center justify-center min-h-screen bg-slate-50 dark:bg-icy-dark">
        <Loader2 className="w-6 h-6 animate-spin text-icy-main" />
      </div>
    );
  }

  return (
    <div className="pt-24 pb-12 px-4 bg-slate-50 dark:bg-icy-dark min-h-screen">
      <div className="w-[90%] lg:w-[80%] mx-auto">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-14 h-14 rounded-2xl bg-icy-main/10 border border-icy-main/20 flex items-center justify-center text-icy-main font-bold text-lg overflow-hidden">
            {avatarUrl ? (
              <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              initials
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              Profile
              <UserIcon className="w-5 h-5 text-icy-main" />
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Update your account details and organization info.</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <InfoPill label="Email" value={form.email || '—'} />
          <InfoPill label="Plan" value={form.plan || '—'} />
          <InfoPill label="Region" value={form.region || '—'} />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl bg-white/70 dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Personal</h3>
            <div className="space-y-3">
              <input className={inputStyles} placeholder="First name" value={form.first_name} onChange={(e) => handleChange('first_name', e.target.value)} />
              <input className={inputStyles} placeholder="Last name" value={form.last_name} onChange={(e) => handleChange('last_name', e.target.value)} />
              <input className={inputStyles} placeholder="Email" value={form.email} onChange={(e) => handleChange('email', e.target.value)} />
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400 block mb-2">Avatar</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setAvatarFile(file);
                      setAvatarUrl(URL.createObjectURL(file));
                    }
                  }}
                  className="block w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-3 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-icy-main/10 file:text-icy-main hover:file:bg-icy-main/20 cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white/70 dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Organization</h3>
            <div className="space-y-3">
              <input className={inputStyles} placeholder="Organization name" value={form.organization_name} onChange={(e) => handleChange('organization_name', e.target.value)} />
              <input className={inputStyles} placeholder="Region" value={form.region} onChange={(e) => handleChange('region', e.target.value)} />
              <input className={inputStyles} placeholder="Plan" value={form.plan} onChange={(e) => handleChange('plan', e.target.value)} />
              <textarea className={`${inputStyles} min-h-[100px]`} placeholder="Brand tone" value={form.brand_tone} onChange={(e) => handleChange('brand_tone', e.target.value)} />
            </div>
          </div>
        </div>

        {error && <div className="mt-4 text-sm text-red-500 bg-red-50 border border-red-200 rounded-2xl px-4 py-3">{error}</div>}
        {success && <div className="mt-4 text-sm text-green-600 bg-green-50 border border-green-200 rounded-2xl px-4 py-3">{success}</div>}

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-3 bg-icy-main text-white rounded-2xl font-semibold flex items-center gap-2 hover:bg-blue-600 transition-colors disabled:opacity-60"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
