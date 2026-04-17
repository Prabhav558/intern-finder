'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';
import Navbar from '@/components/Navbar';

const TYPES = ['INTERNSHIP', 'HACKATHON', 'JOB', 'RESEARCH', 'SCHOLARSHIP', 'WORKSHOP', 'COMPETITION'];
const MODES = ['REMOTE', 'ONSITE', 'HYBRID'];

function TagField({ label, value, onChange, placeholder }: any) {
  const [input, setInput] = useState('');
  const add = () => {
    const t = input.trim();
    if (t && !value.includes(t)) onChange([...value, t]);
    setInput('');
  };
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="flex flex-wrap gap-1 mb-2">
        {value.map((v: string) => (
          <span key={v} className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
            {v}
            <button type="button" onClick={() => onChange(value.filter((x: string) => x !== v))} className="hover:text-red-500">×</button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), add())}
          placeholder={placeholder || `Add ${label.toLowerCase()}...`}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <button type="button" onClick={add} className="px-3 py-2 bg-blue-100 text-blue-700 text-sm rounded-lg hover:bg-blue-200">Add</button>
      </div>
    </div>
  );
}

export default function NewOpportunityPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '', companyName: '', type: 'INTERNSHIP', description: '',
    deadline: '', location: '', mode: 'REMOTE', stipendPrize: '',
    applicationLink: '', minCgpa: '',
  });
  const [domains, setDomains] = useState<string[]>([]);
  const [requiredSkills, setRequiredSkills] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [allowedBranches, setAllowedBranches] = useState<string[]>([]);
  const [allowedYears, setAllowedYears] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!authLoading && user && user.role !== 'ADMIN') router.push('/dashboard');
    if (!authLoading && !user) router.push('/login');
  }, [authLoading, user, router]);

  const validate = () => {
    const e: Record<string, boolean> = {};
    if (!form.title.trim()) e.title = true;
    if (!form.companyName.trim()) e.companyName = true;
    if (!form.description.trim()) e.description = true;
    if (!form.deadline) e.deadline = true;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    setError('');
    try {
      await api.createOpportunity({
        ...form,
        deadline: new Date(form.deadline).toISOString(),
        minCgpa: form.minCgpa ? parseFloat(form.minCgpa) : undefined,
        domains,
        requiredSkills,
        tags,
        allowedBranches,
        allowedYears: allowedYears.map(Number).filter(Boolean),
      });
      router.push('/admin/opportunities');
    } catch (err: any) {
      setError(err.message || 'Failed to create opportunity');
    }
    setSaving(false);
  };

  const f = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }));

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Opportunity</h1>

        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>}

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input value={form.title} onChange={e => f('title', e.target.value)} placeholder="e.g., SWE Intern Summer 2025"
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.title ? 'border-red-400' : 'border-gray-300'}`} />
            </div>
            {/* Company */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
              <input value={form.companyName} onChange={e => f('companyName', e.target.value)} placeholder="Google"
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.companyName ? 'border-red-400' : 'border-gray-300'}`} />
            </div>
            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
              <select value={form.type} onChange={e => f('type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            {/* Deadline */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Deadline *</label>
              <input type="date" value={form.deadline} onChange={e => f('deadline', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.deadline ? 'border-red-400' : 'border-gray-300'}`} />
            </div>
            {/* Mode */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mode</label>
              <select value={form.mode} onChange={e => f('mode', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                {MODES.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input value={form.location} onChange={e => f('location', e.target.value)} placeholder="Bangalore / Remote"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            {/* Stipend */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stipend / Prize</label>
              <input value={form.stipendPrize} onChange={e => f('stipendPrize', e.target.value)} placeholder="₹15,000/month"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            {/* Min CGPA */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min CGPA</label>
              <input type="number" step="0.1" min="0" max="10" value={form.minCgpa} onChange={e => f('minCgpa', e.target.value)} placeholder="7.5"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            {/* Application Link */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Application Link</label>
              <input type="url" value={form.applicationLink} onChange={e => f('applicationLink', e.target.value)} placeholder="https://careers.company.com/..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea rows={5} value={form.description} onChange={e => f('description', e.target.value)} placeholder="Describe the opportunity..."
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${errors.description ? 'border-red-400' : 'border-gray-300'}`} />
          </div>

          {/* Tag fields */}
          <TagField label="Domains" value={domains} onChange={setDomains} placeholder="e.g., Web Development" />
          <TagField label="Required Skills" value={requiredSkills} onChange={setRequiredSkills} placeholder="e.g., React" />
          <TagField label="Tags" value={tags} onChange={setTags} placeholder="e.g., open-source" />
          <TagField label="Allowed Branches" value={allowedBranches} onChange={setAllowedBranches} placeholder="e.g., Computer Science" />
          <TagField label="Allowed Graduation Years" value={allowedYears} onChange={setAllowedYears} placeholder="e.g., 2025" />

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-2.5 rounded-lg text-sm font-semibold transition">
              {saving ? 'Creating...' : 'Create Opportunity'}
            </button>
            <button type="button" onClick={() => router.push('/admin/opportunities')}
              className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
