'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';
import Navbar from '@/components/Navbar';
import OpportunityCard from '@/components/OpportunityCard';

const TYPES = ['', 'INTERNSHIP', 'HACKATHON', 'JOB', 'RESEARCH', 'WORKSHOP', 'COMPETITION', 'SCHOLARSHIP'];
const MODES = ['', 'REMOTE', 'ONSITE', 'HYBRID'];
const SORTS = [
  { value: 'latest', label: 'Latest' },
  { value: 'deadline', label: 'Deadline' },
  { value: 'popular', label: 'Popular' },
];

export default function OpportunitiesPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [type, setType] = useState('');
  const [mode, setMode] = useState('');
  const [sort, setSort] = useState('latest');
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());

  const LIMIT = 9;

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push('/login');
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 500);
    return () => clearTimeout(t);
  }, [searchInput]);

  const fetchOpportunities = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = { page: String(page), limit: String(LIMIT), sort };
      if (type) params.type = type;
      if (mode) params.mode = mode;
      if (search) params.search = search;
      const res: any = await api.getOpportunities(params);
      setOpportunities(res.data || res.opportunities || []);
      setTotal(res.total || 0);
    } catch {}
    setLoading(false);
  }, [page, type, mode, sort, search]);

  useEffect(() => { if (isAuthenticated) fetchOpportunities(); }, [fetchOpportunities, isAuthenticated]);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const res: any = await api.getMyBookmarks();
        const ids = (res.data || res.bookmarks || []).map((b: any) => b.opportunityId || b.opportunity?.id);
        setBookmarks(new Set(ids));
      } catch {}
    };
    if (isAuthenticated) fetchBookmarks();
  }, [isAuthenticated]);

  const handleBookmarkToggle = async (id: string) => {
    try {
      if (bookmarks.has(id)) {
        await api.removeBookmark(id);
        setBookmarks(prev => { const s = new Set(prev); s.delete(id); return s; });
      } else {
        await api.saveBookmark(id);
        setBookmarks(prev => new Set([...prev, id]));
      }
    } catch {}
  };

  const totalPages = Math.ceil(total / LIMIT);

  if (authLoading) return <div className="min-h-screen flex items-center justify-center"><p className="text-gray-500">Loading...</p></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Browse Opportunities</h1>

        {/* Search + Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Search opportunities..."
            value={searchInput}
            onChange={e => { setSearchInput(e.target.value); setPage(1); }}
            className="flex-1 min-w-48 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select value={type} onChange={e => { setType(e.target.value); setPage(1); }}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">All Types</option>
            {TYPES.filter(Boolean).map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <select value={mode} onChange={e => { setMode(e.target.value); setPage(1); }}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">All Modes</option>
            {MODES.filter(Boolean).map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <select value={sort} onChange={e => { setSort(e.target.value); setPage(1); }}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow h-52 animate-pulse" />
            ))}
          </div>
        ) : opportunities.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg font-medium">No opportunities found</p>
            <p className="text-sm mt-1">Try changing your filters or search term</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-4">{total} opportunities found</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {opportunities.map(opp => (
                <OpportunityCard
                  key={opp.id}
                  opportunity={opp}
                  isBookmarked={bookmarks.has(opp.id)}
                  onBookmarkToggle={handleBookmarkToggle}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-3 mt-8">
                <button onClick={() => setPage(p => p - 1)} disabled={page === 1}
                  className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition">
                  Previous
                </button>
                <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
                <button onClick={() => setPage(p => p + 1)} disabled={page === totalPages}
                  className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition">
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
