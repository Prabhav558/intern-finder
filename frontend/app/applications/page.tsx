'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';
import Navbar from '@/components/Navbar';

const STATUS_TABS = ['ALL', 'PENDING', 'UNDER_REVIEW', 'SHORTLISTED', 'SELECTED', 'REJECTED', 'WITHDRAWN'];

const statusStyles: Record<string, string> = {
  PENDING: 'bg-gray-100 text-gray-600',
  UNDER_REVIEW: 'bg-blue-100 text-blue-700',
  SHORTLISTED: 'bg-yellow-100 text-yellow-700',
  SELECTED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-600',
  WITHDRAWN: 'bg-gray-100 text-gray-500',
};

export default function ApplicationsPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL');
  const [withdrawing, setWithdrawing] = useState<string | null>(null);
  const [confirmWithdraw, setConfirmWithdraw] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push('/login');
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res: any = await api.getMyApplications();
        setApplications(res.data || res.applications || []);
      } catch {}
      setLoading(false);
    };
    if (isAuthenticated) fetch();
  }, [isAuthenticated]);

  const handleWithdraw = async (id: string) => {
    setWithdrawing(id);
    try {
      await api.withdrawApplication(id);
      setApplications(prev => prev.map(a => a.id === id ? { ...a, status: 'WITHDRAWN' } : a));
    } catch {}
    setWithdrawing(null);
    setConfirmWithdraw(null);
  };

  const filtered = activeTab === 'ALL' ? applications : applications.filter(a => a.status === activeTab);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Applications</h1>

        {/* Tabs */}
        <div className="flex gap-1 flex-wrap mb-6 bg-white rounded-xl p-1.5 shadow-sm">
          {STATUS_TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${activeTab === tab ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-100'}`}>
              {tab.replace('_', ' ')}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-3">{Array(4).fill(0).map((_, i) => <div key={i} className="bg-white rounded-xl h-20 animate-pulse shadow" />)}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg font-medium">No applications found</p>
            <Link href="/opportunities" className="mt-3 inline-block text-blue-600 hover:underline text-sm">Browse Opportunities</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(app => {
              const opp = app.opportunity || {};
              return (
                <div key={app.id} className="bg-white rounded-xl shadow-sm p-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <Link href={`/opportunities/${opp.id}`} className="font-semibold text-gray-900 hover:text-blue-600 transition text-sm">
                      {opp.title || 'Unknown Opportunity'}
                    </Link>
                    <p className="text-xs text-gray-500 mt-0.5">{opp.companyName || ''}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyles[app.status] || 'bg-gray-100 text-gray-600'}`}>
                      {app.status.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-gray-400">{new Date(app.appliedAt).toLocaleDateString()}</span>
                    {app.status === 'PENDING' && (
                      confirmWithdraw === app.id ? (
                        <div className="flex gap-2">
                          <button onClick={() => handleWithdraw(app.id)} disabled={withdrawing === app.id}
                            className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition">
                            {withdrawing === app.id ? 'Withdrawing...' : 'Confirm'}
                          </button>
                          <button onClick={() => setConfirmWithdraw(null)} className="text-xs border border-gray-300 px-2 py-1 rounded hover:bg-gray-50 transition">
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => setConfirmWithdraw(app.id)}
                          className="text-xs text-red-500 border border-red-200 px-2 py-1 rounded hover:bg-red-50 transition">
                          Withdraw
                        </button>
                      )
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
