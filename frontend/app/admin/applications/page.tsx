'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';
import Navbar from '@/components/Navbar';

const TABS = ['ALL', 'PENDING', 'UNDER_REVIEW', 'SHORTLISTED', 'SELECTED', 'REJECTED', 'WITHDRAWN'];
const STATUSES = ['PENDING', 'UNDER_REVIEW', 'SHORTLISTED', 'SELECTED', 'REJECTED'];

const statusColors: Record<string, string> = {
  PENDING: 'bg-gray-100 text-gray-600',
  UNDER_REVIEW: 'bg-blue-100 text-blue-700',
  SHORTLISTED: 'bg-yellow-100 text-yellow-700',
  SELECTED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-600',
  WITHDRAWN: 'bg-gray-100 text-gray-400',
};

export default function AdminApplicationsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('PENDING');
  const [updating, setUpdating] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkStatus, setBulkStatus] = useState('UNDER_REVIEW');
  const [bulkUpdating, setBulkUpdating] = useState(false);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    if (!authLoading && user && user.role !== 'ADMIN') router.push('/dashboard');
    if (!authLoading && !user) router.push('/login');
  }, [authLoading, user, router]);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const [s, apps]: any = await Promise.all([
          api.getApplicationStatistics(),
          activeTab === 'ALL' ? api.getApplicationsByStatus('PENDING') : api.getApplicationsByStatus(activeTab),
        ]);
        setStats(s.data || s);
        if (activeTab === 'ALL') {
          // fetch all by fetching each status
          const results = await Promise.all(
            STATUSES.map(s => api.getApplicationsByStatus(s).then((r: any) => r.data || r.applications || []))
          );
          setApplications(results.flat());
        } else {
          setApplications(apps.data || apps.applications || []);
        }
      } catch {}
      setSelected(new Set());
      setLoading(false);
    };
    if (user?.role === 'ADMIN') fetch();
  }, [user, activeTab]);

  const handleStatusChange = async (id: string, status: string) => {
    setUpdating(id);
    try {
      await api.updateApplicationStatus(id, status);
      setApplications(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    } catch {}
    setUpdating(null);
  };

  const handleBulkUpdate = async () => {
    if (selected.size === 0) return;
    setBulkUpdating(true);
    try {
      await api.bulkUpdateApplications(Array.from(selected), bulkStatus);
      setApplications(prev => prev.map(a => selected.has(a.id) ? { ...a, status: bulkStatus } : a));
      setSelected(new Set());
    } catch {}
    setBulkUpdating(false);
  };

  const toggleSelect = (id: string) => {
    setSelected(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  };

  const byStatus = stats?.byStatus || {};

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Manage Applications</h1>

        {/* Stats row */}
        {stats && (
          <div className="flex gap-3 flex-wrap mb-6">
            {Object.entries(byStatus).map(([status, count]) => (
              <div key={status} className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${statusColors[status] || 'bg-gray-100 text-gray-600'}`}>
                {status.replace('_', ' ')}: {count as number}
              </div>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 flex-wrap mb-4 bg-white rounded-xl p-1.5 shadow-sm">
          {TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${activeTab === tab ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-100'}`}>
              {tab.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Bulk actions */}
        {selected.size > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-4 flex items-center gap-3 flex-wrap">
            <span className="text-sm font-medium text-blue-700">{selected.size} selected</span>
            <select value={bulkStatus} onChange={e => setBulkStatus(e.target.value)}
              className="text-sm border border-blue-300 rounded-lg px-2 py-1 bg-white">
              {STATUSES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
            </select>
            <button onClick={handleBulkUpdate} disabled={bulkUpdating}
              className="text-sm bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition">
              {bulkUpdating ? 'Updating...' : 'Update All'}
            </button>
            <button onClick={() => setSelected(new Set())} className="text-sm text-gray-500 hover:underline">Clear</button>
          </div>
        )}

        {loading ? (
          <div className="space-y-2">{Array(6).fill(0).map((_, i) => <div key={i} className="bg-white rounded-xl h-14 animate-pulse shadow" />)}</div>
        ) : applications.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm">No applications in this category</div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left w-8">
                    <input type="checkbox" onChange={e => setSelected(e.target.checked ? new Set(applications.map(a => a.id)) : new Set())}
                      checked={selected.size === applications.length && applications.length > 0} className="rounded" />
                  </th>
                  {['Student', 'Opportunity', 'Applied', 'Status', 'Update'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {applications.map(app => (
                  <tr key={app.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3">
                      <input type="checkbox" checked={selected.has(app.id)} onChange={() => toggleSelect(app.id)} className="rounded" />
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">{app.student?.name || '—'}</td>
                    <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{app.opportunity?.title || '—'}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{new Date(app.appliedAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[app.status] || 'bg-gray-100 text-gray-600'}`}>
                        {app.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {updating === app.id ? (
                        <span className="text-xs text-gray-400">Saving...</span>
                      ) : (
                        <select value={app.status} onChange={e => handleStatusChange(app.id, e.target.value)}
                          className="text-xs border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500">
                          {STATUSES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                        </select>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
