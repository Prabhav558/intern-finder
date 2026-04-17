'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';
import Navbar from '@/components/Navbar';

const statusColors: Record<string, string> = {
  PENDING: 'bg-gray-100 text-gray-600',
  UNDER_REVIEW: 'bg-blue-100 text-blue-700',
  SHORTLISTED: 'bg-yellow-100 text-yellow-700',
  SELECTED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-600',
};

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [recentApps, setRecentApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && user && user.role !== 'ADMIN') router.push('/dashboard');
    if (!authLoading && !user) router.push('/login');
  }, [authLoading, user, router]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [s, apps]: any = await Promise.all([
          api.getApplicationStatistics(),
          api.getApplicationsByStatus('PENDING'),
        ]);
        setStats(s.data || s);
        setRecentApps((apps.data || apps.applications || []).slice(0, 8));
      } catch {}
      setLoading(false);
    };
    if (user?.role === 'ADMIN') fetch();
  }, [user]);

  if (authLoading || loading) return (
    <div className="min-h-screen bg-slate-50"><Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-4">
        {Array(3).fill(0).map((_, i) => <div key={i} className="bg-white rounded-xl h-24 animate-pulse shadow" />)}
      </div>
    </div>
  );

  const byStatus = stats?.byStatus || {};

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <Link href="/admin/opportunities/new"
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition">
            + Add Opportunity
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Applications', value: stats?.total || 0, color: 'text-blue-600' },
            { label: 'Pending', value: byStatus.PENDING || 0, color: 'text-gray-600' },
            { label: 'Shortlisted', value: byStatus.SHORTLISTED || 0, color: 'text-yellow-600' },
            { label: 'Selected', value: byStatus.SELECTED || 0, color: 'text-green-600' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl shadow-sm p-5">
              <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Link href="/admin/opportunities" className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition">
            <p className="text-lg font-bold text-gray-900">Manage Opportunities</p>
            <p className="text-sm text-gray-500 mt-1">Create, edit and delete opportunities</p>
          </Link>
          <Link href="/admin/applications" className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition">
            <p className="text-lg font-bold text-gray-900">Review Applications</p>
            <p className="text-sm text-gray-500 mt-1">Update application statuses</p>
          </Link>
        </div>

        {/* Recent pending applications */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h2 className="text-base font-bold text-gray-800 mb-4">Pending Applications</h2>
          {recentApps.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">No pending applications</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-gray-400 border-b">
                    <th className="text-left pb-2 font-medium">Student</th>
                    <th className="text-left pb-2 font-medium">Opportunity</th>
                    <th className="text-left pb-2 font-medium">Applied</th>
                    <th className="text-left pb-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentApps.map(app => (
                    <tr key={app.id}>
                      <td className="py-2.5 font-medium text-gray-900">{app.student?.name || 'Student'}</td>
                      <td className="py-2.5 text-gray-600">{app.opportunity?.title || '—'}</td>
                      <td className="py-2.5 text-gray-400">{new Date(app.appliedAt).toLocaleDateString()}</td>
                      <td className="py-2.5">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[app.status] || 'bg-gray-100 text-gray-600'}`}>
                          {app.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Link href="/admin/applications" className="mt-3 inline-block text-xs text-blue-600 hover:underline">
                View all applications →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
