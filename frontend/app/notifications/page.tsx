'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Navbar from '@/components/Navbar';

const SAMPLE = [
  { id: 1, type: 'APPLICATION_STATUS', title: 'Application Shortlisted', message: 'Your application to Google SWE Internship has been shortlisted.', time: '2 hours ago', read: false },
  { id: 2, type: 'DEADLINE_REMINDER', title: 'Deadline Approaching', message: 'Microsoft Hackathon deadline is in 2 days.', time: '1 day ago', read: false },
  { id: 3, type: 'NEW_OPPORTUNITY', title: 'New Opportunity', message: 'A new research opportunity matching your profile has been posted.', time: '3 days ago', read: true },
];

const typeIcon: Record<string, string> = {
  APPLICATION_STATUS: '📋',
  DEADLINE_REMINDER: '⏰',
  NEW_OPPORTUNITY: '✨',
  BADGE_EARNED: '🏅',
  SYSTEM_ALERT: '🔔',
};

export default function NotificationsPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push('/login');
  }, [authLoading, isAuthenticated, router]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <button className="text-sm text-blue-600 hover:underline">Mark all as read</button>
        </div>

        <div className="space-y-3">
          {SAMPLE.map(n => (
            <div key={n.id} className={`bg-white rounded-xl shadow-sm p-4 flex gap-3 border-l-4 ${n.read ? 'border-transparent' : 'border-blue-500'}`}>
              <span className="text-2xl flex-shrink-0">{typeIcon[n.type] || '🔔'}</span>
              <div className="flex-1">
                <p className={`text-sm font-semibold ${n.read ? 'text-gray-700' : 'text-gray-900'}`}>{n.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>
                <p className="text-xs text-gray-400 mt-1">{n.time}</p>
              </div>
              {!n.read && <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />}
            </div>
          ))}
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-5 text-center">
          <p className="text-sm text-blue-700 font-medium">Real-time notifications coming soon</p>
          <p className="text-xs text-blue-600 mt-1">You'll get notified when your application status changes, deadlines approach, or new opportunities match your profile.</p>
        </div>
      </div>
    </div>
  );
}
