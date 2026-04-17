'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';
import Navbar from '@/components/Navbar';

export default function DashboardPage() {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [trending, setTrending] = useState<any[]>([]);

  useEffect(() => {
    if (!loading && !isAuthenticated) router.push('/login');
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [s, t]: any = await Promise.all([
          api.getStatistics(),
          api.getTrendingOpportunities(),
        ]);
        setStats(s.data || s);
        setTrending((t.data || t.opportunities || []).slice(0, 3));
      } catch {}
    };
    if (isAuthenticated) fetch();
  }, [isAuthenticated]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <p className="text-gray-500">Loading...</p>
    </div>
  );

  const quickLinks = [
    { href: '/opportunities', icon: '🎯', label: 'Opportunities', desc: 'Browse internships, jobs, hackathons' },
    { href: '/applications', icon: '📋', label: 'Applications', desc: 'Track your application status' },
    { href: '/bookmarks', icon: '🔖', label: 'Bookmarks', desc: 'Your saved opportunities' },
    { href: '/profile', icon: '👤', label: 'Profile', desc: 'Update your skills and resume' },
    { href: '/notifications', icon: '🔔', label: 'Notifications', desc: 'Deadline reminders & updates' },
    ...(user?.role === 'ADMIN' ? [{ href: '/admin', icon: '⚙️', label: 'Admin Panel', desc: 'Manage opportunities & applications' }] : []),
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Welcome */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white mb-8">
          <h1 className="text-2xl font-bold mb-1">Welcome back, {user?.name?.split(' ')[0]}!</h1>
          <p className="text-blue-100 text-sm">Find and apply to the best opportunities for your career growth.</p>
          <Link href="/opportunities" className="mt-4 inline-block bg-white text-blue-700 text-sm font-semibold px-5 py-2 rounded-lg hover:bg-blue-50 transition">
            Browse Opportunities →
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Applications', value: stats?.totalApplications ?? '—', color: 'text-blue-600' },
            { label: 'Bookmarks', value: stats?.bookmarks ?? '—', color: 'text-yellow-600' },
            { label: 'Profile Score', value: stats?.profileScore != null ? `${stats.profileScore}%` : '—', color: 'text-purple-600' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl shadow-sm p-5 text-center">
              <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick nav */}
          <div className="lg:col-span-2">
            <h2 className="text-base font-bold text-gray-800 mb-3">Quick Access</h2>
            <div className="grid grid-cols-2 gap-3">
              {quickLinks.map(link => (
                <Link key={link.href} href={link.href}
                  className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition group">
                  <span className="text-2xl">{link.icon}</span>
                  <p className="font-semibold text-gray-900 text-sm mt-2 group-hover:text-blue-600 transition">{link.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-snug">{link.desc}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* Trending */}
          <div>
            <h2 className="text-base font-bold text-gray-800 mb-3">Trending Now</h2>
            <div className="space-y-3">
              {trending.length > 0 ? trending.map(opp => (
                <Link key={opp.id} href={`/opportunities/${opp.id}`}
                  className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition block">
                  <p className="font-semibold text-sm text-gray-900 leading-snug line-clamp-1">{opp.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{opp.companyName}</p>
                  <div className="flex gap-2 mt-2">
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{opp.type}</span>
                    {opp.location && <span className="text-xs text-gray-400">{opp.location}</span>}
                  </div>
                </Link>
              )) : (
                <div className="bg-white rounded-xl shadow-sm p-4 text-sm text-gray-400">
                  Trending opportunities will appear here.
                </div>
              )}
              <Link href="/opportunities" className="block text-center text-xs text-blue-600 hover:underline mt-2">
                View all opportunities →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
