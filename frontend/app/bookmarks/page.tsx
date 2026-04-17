'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';
import Navbar from '@/components/Navbar';
import OpportunityCard from '@/components/OpportunityCard';

export default function BookmarksPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push('/login');
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res: any = await api.getMyBookmarks();
        const items = res.data || res.bookmarks || [];
        setBookmarks(items);
        setBookmarkedIds(new Set(items.map((b: any) => b.opportunityId || b.opportunity?.id)));
      } catch {}
      setLoading(false);
    };
    if (isAuthenticated) fetch();
  }, [isAuthenticated]);

  const handleRemoveBookmark = async (opportunityId: string) => {
    try {
      await api.removeBookmark(opportunityId);
      setBookmarks(prev => prev.filter(b => (b.opportunityId || b.opportunity?.id) !== opportunityId));
      setBookmarkedIds(prev => { const s = new Set(prev); s.delete(opportunityId); return s; });
    } catch {}
  };

  const opportunities = bookmarks.map(b => b.opportunity || { id: b.opportunityId }).filter(o => o.title);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Saved Opportunities</h1>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array(6).fill(0).map((_, i) => <div key={i} className="bg-white rounded-xl shadow h-52 animate-pulse" />)}
          </div>
        ) : opportunities.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg font-medium">No bookmarks yet</p>
            <p className="text-sm mt-1">Save opportunities to review them later</p>
            <Link href="/opportunities" className="mt-4 inline-block bg-blue-600 text-white text-sm px-5 py-2 rounded-lg hover:bg-blue-700 transition">
              Browse Opportunities
            </Link>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-4">{opportunities.length} saved</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {opportunities.map(opp => (
                <OpportunityCard
                  key={opp.id}
                  opportunity={opp}
                  isBookmarked={true}
                  onBookmarkToggle={handleRemoveBookmark}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
