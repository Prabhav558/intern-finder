'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';
import Navbar from '@/components/Navbar';

const typeColors: Record<string, string> = {
  INTERNSHIP: 'bg-blue-100 text-blue-700',
  HACKATHON: 'bg-purple-100 text-purple-700',
  JOB: 'bg-green-100 text-green-700',
  RESEARCH: 'bg-yellow-100 text-yellow-700',
  SCHOLARSHIP: 'bg-orange-100 text-orange-700',
  WORKSHOP: 'bg-pink-100 text-pink-700',
  COMPETITION: 'bg-indigo-100 text-indigo-700',
};

export default function AdminOpportunitiesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && user && user.role !== 'ADMIN') router.push('/dashboard');
    if (!authLoading && !user) router.push('/login');
  }, [authLoading, user, router]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res: any = await api.getOpportunities({ limit: '100' });
        setOpportunities(res.data || res.opportunities || []);
      } catch {}
      setLoading(false);
    };
    if (user?.role === 'ADMIN') fetch();
  }, [user]);

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try {
      await api.deleteOpportunity(id);
      setOpportunities(prev => prev.filter(o => o.id !== id));
    } catch {}
    setDeleting(null);
    setConfirmDelete(null);
  };

  const filtered = opportunities.filter(o =>
    o.title?.toLowerCase().includes(search.toLowerCase()) ||
    o.companyName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Manage Opportunities</h1>
          <Link href="/admin/opportunities/new"
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition">
            + Add New
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 mb-5">
          <input type="text" placeholder="Search by title or company..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        {loading ? (
          <div className="space-y-3">{Array(5).fill(0).map((_, i) => <div key={i} className="bg-white rounded-xl h-16 animate-pulse shadow" />)}</div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  {['Title', 'Company', 'Type', 'Deadline', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(opp => {
                  const expired = new Date(opp.deadline) < new Date();
                  return (
                    <tr key={opp.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900 max-w-xs truncate">{opp.title}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{opp.companyName}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeColors[opp.type] || 'bg-gray-100 text-gray-600'}`}>
                          {opp.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500">{new Date(opp.deadline).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${expired ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                          {expired ? 'Expired' : 'Active'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {confirmDelete === opp.id ? (
                          <div className="flex gap-2">
                            <button onClick={() => handleDelete(opp.id)} disabled={deleting === opp.id}
                              className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition">
                              {deleting === opp.id ? '...' : 'Confirm'}
                            </button>
                            <button onClick={() => setConfirmDelete(null)} className="text-xs border border-gray-300 px-2 py-1 rounded hover:bg-gray-50 transition">
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <Link href={`/opportunities/${opp.id}`} className="text-xs text-blue-600 border border-blue-200 px-2 py-1 rounded hover:bg-blue-50 transition">
                              View
                            </Link>
                            <button onClick={() => setConfirmDelete(opp.id)} className="text-xs text-red-500 border border-red-200 px-2 py-1 rounded hover:bg-red-50 transition">
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-12 text-gray-400 text-sm">No opportunities found</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
