'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';
import Navbar from '@/components/Navbar';

function TagInput({ label, value, onChange }: { label: string; value: string[]; onChange: (v: string[]) => void }) {
  const [input, setInput] = useState('');
  const add = () => {
    const trimmed = input.trim();
    if (trimmed && !value.includes(trimmed)) onChange([...value, trimmed]);
    setInput('');
  };
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="flex flex-wrap gap-1 mb-2">
        {value.map(tag => (
          <span key={tag} className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
            {tag}
            <button onClick={() => onChange(value.filter(t => t !== tag))} className="hover:text-red-500 ml-1">×</button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), add())}
          placeholder={`Add ${label.toLowerCase()}...`}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <button type="button" onClick={add} className="px-3 py-2 bg-blue-100 text-blue-700 text-sm rounded-lg hover:bg-blue-200 transition">Add</button>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { isAuthenticated, loading: authLoading, user } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [form, setForm] = useState<any>({});

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push('/login');
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [p, s]: any = await Promise.all([api.getProfile(), api.getStatistics()]);
        const profileData = p.data || p;
        setProfile(profileData);
        setStats(s.data || s);
        setForm({
          branch: profileData.branch || '',
          cgpa: profileData.cgpa || '',
          graduationYear: profileData.graduationYear || '',
          bio: profileData.bio || '',
          location: profileData.location || '',
          skills: profileData.skills || [],
          interests: profileData.interests || [],
          linkedinUrl: profileData.linkedinUrl || '',
          githubUrl: profileData.githubUrl || '',
          portfolioUrl: profileData.portfolioUrl || '',
        });
      } catch {}
      setLoading(false);
    };
    if (isAuthenticated) fetch();
  }, [isAuthenticated]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res: any = await api.updateProfile(form);
      setProfile(res.data || res);
      setSaveMsg('Profile updated!');
      setEditing(false);
      setTimeout(() => setSaveMsg(''), 3000);
    } catch (e: any) {
      setSaveMsg(e.message || 'Failed to save');
    }
    setSaving(false);
  };

  const score = profile?.profileScore || 0;

  if (authLoading || loading) return (
    <div className="min-h-screen bg-gray-50"><Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8"><div className="bg-white rounded-xl shadow animate-pulse h-80" /></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        {saveMsg && (
          <div className={`mb-4 p-3 rounded-lg text-sm font-medium ${saveMsg.includes('Failed') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
            {saveMsg}
          </div>
        )}

        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow p-6 mb-5">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900">{user?.name}</h1>
              <p className="text-sm text-gray-500">{user?.email}</p>
              {profile?.branch && <p className="text-sm text-gray-600 mt-0.5">{profile.branch}{profile.graduationYear ? ` • Class of ${profile.graduationYear}` : ''}</p>}
            </div>
            <button onClick={() => setEditing(!editing)}
              className="text-sm border border-blue-500 text-blue-600 px-4 py-1.5 rounded-lg hover:bg-blue-50 transition font-medium">
              {editing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {/* Profile score */}
          <div>
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Profile Completeness</span><span>{score}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: `${score}%` }} />
            </div>
          </div>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-3 gap-4 mb-5">
            {[
              { label: 'Applications', value: stats.totalApplications || 0, color: 'text-blue-600' },
              { label: 'Bookmarks', value: stats.bookmarks || 0, color: 'text-yellow-600' },
              { label: 'Badges', value: stats.badges || 0, color: 'text-purple-600' },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-xl shadow-sm p-4 text-center">
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Profile Details / Edit Form */}
        <div className="bg-white rounded-xl shadow p-6">
          {editing ? (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-gray-800 mb-4">Edit Profile</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: 'branch', label: 'Branch', type: 'text', placeholder: 'Computer Science' },
                  { key: 'cgpa', label: 'CGPA', type: 'number', placeholder: '8.5' },
                  { key: 'graduationYear', label: 'Graduation Year', type: 'number', placeholder: '2025' },
                  { key: 'location', label: 'Location', type: 'text', placeholder: 'Mumbai, India' },
                  { key: 'linkedinUrl', label: 'LinkedIn URL', type: 'url', placeholder: 'https://linkedin.com/in/...' },
                  { key: 'githubUrl', label: 'GitHub URL', type: 'url', placeholder: 'https://github.com/...' },
                  { key: 'portfolioUrl', label: 'Portfolio URL', type: 'url', placeholder: 'https://yoursite.com' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
                    <input type={f.type} value={form[f.key] || ''} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                      placeholder={f.placeholder}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea rows={3} value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })}
                  placeholder="Tell us about yourself..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
              </div>
              <TagInput label="Skills" value={form.skills} onChange={v => setForm({ ...form, skills: v })} />
              <TagInput label="Interests" value={form.interests} onChange={v => setForm({ ...form, interests: v })} />
              <div className="flex gap-3 mt-2">
                <button onClick={handleSave} disabled={saving}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-2 rounded-lg text-sm font-semibold transition">
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button onClick={() => setEditing(false)} className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <h2 className="text-base font-bold text-gray-800">Profile Details</h2>
              {profile?.bio && <p className="text-sm text-gray-600">{profile.bio}</p>}
              <div className="grid grid-cols-2 gap-4 text-sm">
                {profile?.cgpa && <div><p className="text-gray-400 text-xs">CGPA</p><p className="font-semibold">{profile.cgpa}</p></div>}
                {profile?.location && <div><p className="text-gray-400 text-xs">Location</p><p className="font-semibold">{profile.location}</p></div>}
                {profile?.linkedinUrl && <div><p className="text-gray-400 text-xs">LinkedIn</p><a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-xs">View Profile</a></div>}
                {profile?.githubUrl && <div><p className="text-gray-400 text-xs">GitHub</p><a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-xs">View Profile</a></div>}
              </div>
              {profile?.skills?.length > 0 && (
                <div>
                  <p className="text-xs text-gray-400 mb-2">Skills</p>
                  <div className="flex flex-wrap gap-1">
                    {profile.skills.map((s: string) => <span key={s} className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">{s}</span>)}
                  </div>
                </div>
              )}
              {profile?.interests?.length > 0 && (
                <div>
                  <p className="text-xs text-gray-400 mb-2">Interests</p>
                  <div className="flex flex-wrap gap-1">
                    {profile.interests.map((i: string) => <span key={i} className="bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded-full">{i}</span>)}
                  </div>
                </div>
              )}
              {!profile?.branch && !profile?.skills?.length && (
                <p className="text-sm text-gray-400">Complete your profile to improve your chances of getting noticed.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
