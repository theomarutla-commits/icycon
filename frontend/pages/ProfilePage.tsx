import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../lib/AuthContext';
import { fetchProfile, updateProfile } from '../lib/api';

const ProfilePage: React.FC = () => {
  const { authHeader, user, setAuthHeader } = useAuth();
  const [profile, setProfile] = useState<any>(user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!authHeader) return;
    fetchProfile(authHeader)
      .then((data) => {
        setProfile(data);
        setAuthHeader(authHeader, data);
      })
      .catch(() => setError('Unable to load profile'));
  }, [authHeader, setAuthHeader]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!authHeader) return;
    const file = e.target.files?.[0];
    if (!file) return;
    const form = new FormData();
    form.append('avatar', file);
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const data = await updateProfile(authHeader, form);
      setProfile(data);
      setAuthHeader(authHeader, data);
      setSuccess('Profile picture updated');
    } catch (err: any) {
      setError(err?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const handleFieldSave = async () => {
    if (!authHeader) return;
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const data = await updateProfile(authHeader, {
        first_name: profile?.first_name,
        last_name: profile?.last_name,
        brand_tone: profile?.brand_tone,
      });
      setProfile(data);
      setAuthHeader(authHeader, data);
      setSuccess('Profile updated');
    } catch (err: any) {
      setError(err?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  if (!authHeader) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 bg-slate-50 dark:bg-icy-dark flex items-center justify-center">
        <p className="text-gray-700 dark:text-gray-200">Log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-slate-50 dark:bg-icy-dark">
      <div className="w-[90%] lg:w-[70%] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-[#001c4d] border border-gray-200 dark:border-white/10 rounded-3xl p-8 shadow-2xl"
        >
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            <div className="flex flex-col items-center gap-3">
              {profile?.avatar ? (
                <img
                  src={profile.avatar}
                  alt="Avatar"
                  className="w-28 h-28 rounded-full object-cover border border-white/20"
                />
              ) : (
                <div className="w-28 h-28 rounded-full bg-icy-main/15 text-icy-dark dark:text-white dark:bg-white/10 flex items-center justify-center text-2xl font-bold">
                  {(profile?.username || profile?.email || 'U').slice(0, 2).toUpperCase()}
                </div>
              )}
              <label className="text-sm font-semibold text-icy-main cursor-pointer">
                Change photo
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              </label>
            </div>

            <div className="flex-1 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Profile</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Update your personal details and profile picture.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">First Name</label>
                  <input
                    value={profile?.first_name || ''}
                    onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:outline-none focus:border-icy-main transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Last Name</label>
                  <input
                    value={profile?.last_name || ''}
                    onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:outline-none focus:border-icy-main transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                  <input
                    value={profile?.email || ''}
                    disabled
                    className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
                  <input
                    value={profile?.username || ''}
                    disabled
                    className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Brand Tone</label>
                  <textarea
                    value={profile?.brand_tone || ''}
                    onChange={(e) => setProfile({ ...profile, brand_tone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:outline-none focus:border-icy-main transition-colors"
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={handleFieldSave}
                  disabled={loading}
                  className="bg-icy-main text-white px-5 py-3 rounded-xl font-semibold shadow-lg shadow-icy-main/25 hover:bg-blue-600 transition-colors disabled:opacity-60"
                >
                  {loading ? 'Saving...' : 'Save changes'}
                </button>
                {error && <span className="text-sm text-red-500">{error}</span>}
                {success && <span className="text-sm text-emerald-500">{success}</span>}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5">
                  <p className="text-xs uppercase tracking-[0.25em] text-gray-500 mb-1">Plan</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{profile?.plan || 'free'}</p>
                </div>
                <div className="p-4 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5">
                  <p className="text-xs uppercase tracking-[0.25em] text-gray-500 mb-1">Region</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{profile?.region || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;
