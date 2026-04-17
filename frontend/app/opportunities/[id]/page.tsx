'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
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

export default function OpportunityDetailPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [opp, setOpp] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [applyOpen, setApplyOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [applying, setApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState('');
  const [applyError, setApplyError] = useState('');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push('/login');
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res: any = await api.getOpportunity(id);
        setOpp(res.data || res);
        const bm: any = await api.checkBookmark(id);
        setIsBookmarked(bm.isBookmarked || false);
      } catch {}
      setLoading(false);
    };
    if (id && isAuthenticated) fetch();
  }, [id, isAuthenticated]);

  const toggleBookmark = async () => {
    try {
      if (isBookmarked) { await api.removeBookmark(id); setIsBookmarked(false); }
      else { await api.saveBookmark(id); setIsBookmarked(true); }
    } catch {}
  };

  const handleApply = async () => {
    setApplying(true);
    setApplyError('');
    try {
      await api.applyForOpportunity(id, { coverLetter, resumeUrl });
      setApplySuccess('Application submitted successfully!');
      setTimeout(() => { setApplyOpen(false); setApplySuccess(''); }, 2000);
    } catch (e: any) {
      setApplyError(e.message || 'Failed to apply');
    }
    setApplying(false);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-white rounded-xl shadow animate-pulse h-96" />
        </div>
      </div>
    );
  }

  if (!opp) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="text-center py-20 text-gray-400">Opportunity not found.</div>
    </div>
  );

  const deadline = new Date(opp.deadline);
  const isExpired = deadline < new Date();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/opportunities" className="text-sm text-blue-600 hover:underline mb-4 inline-flex items-center gap-1">
          ← Back to Opportunities
        </Link>

        <div className="bg-white rounded-xl shadow p-6 mt-3">
          {/* Header */}
          <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
            <div>
              <div className="flex flex-wrap gap-2 mb-2">
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${typeColors[opp.type] || 'bg-gray-100 text-gray-600'}`}>
                  {opp.type}
                </span>
                {opp.mode && <span className="text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded-full">{opp.mode}</span>}
                {isExpired && <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-semibold">Expired</span>}
              </div>
              <h1 className="text-2xl font-bold text-gray-900">{opp.title}</h1>
              <p className="text-gray-500 mt-1">{opp.companyName}{opp.organizer && ` • ${opp.organizer}`}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={toggleBookmark}
                className={`px-4 py-2 text-sm rounded-lg border font-medium transition ${isBookmarked ? 'bg-yellow-50 border-yellow-300 text-yellow-700' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}>
                {isBookmarked ? 'Bookmarked' : 'Bookmark'}
              </button>
              {!isExpired && (
                <button onClick={() => setApplyOpen(true)}
                  className="px-5 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition">
                  Apply Now
                </button>
              )}
            </div>
          </div>

          {/* Meta info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 rounded-xl p-4 mb-6 text-sm">
            <div><p className="text-gray-400 text-xs mb-0.5">Deadline</p><p className="font-semibold text-gray-800">{deadline.toLocaleDateString()}</p></div>
            {opp.location && <div><p className="text-gray-400 text-xs mb-0.5">Location</p><p className="font-semibold text-gray-800">{opp.location}</p></div>}
            {opp.stipendPrize && <div><p className="text-gray-400 text-xs mb-0.5">Stipend/Prize</p><p className="font-semibold text-green-600">{opp.stipendPrize}</p></div>}
            {opp.domains?.length > 0 && <div><p className="text-gray-400 text-xs mb-0.5">Domains</p><p className="font-semibold text-gray-800">{opp.domains.join(', ')}</p></div>}
          </div>

          {/* Description */}
          <div className="mb-6">
            <h2 className="text-base font-bold text-gray-800 mb-2">Description</h2>
            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">{opp.description}</p>
          </div>

          {/* Eligibility */}
          {(opp.minCgpa || opp.allowedBranches?.length || opp.allowedYears?.length || opp.requiredSkills?.length) && (
            <div className="mb-6 border border-blue-100 bg-blue-50 rounded-xl p-4">
              <h2 className="text-base font-bold text-gray-800 mb-3">Eligibility Criteria</h2>
              <div className="space-y-2 text-sm">
                {opp.minCgpa && <p><span className="font-medium text-gray-700">Min CGPA:</span> {opp.minCgpa}</p>}
                {opp.allowedBranches?.length > 0 && <p><span className="font-medium text-gray-700">Branches:</span> {opp.allowedBranches.join(', ')}</p>}
                {opp.allowedYears?.length > 0 && <p><span className="font-medium text-gray-700">Grad Years:</span> {opp.allowedYears.join(', ')}</p>}
                {opp.requiredSkills?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    <span className="font-medium text-gray-700 mr-1">Skills:</span>
                    {opp.requiredSkills.map((s: string) => <span key={s} className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">{s}</span>)}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tags */}
          {opp.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {opp.tags.map((tag: string) => (
                <span key={tag} className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">{tag}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Apply Modal */}
      {applyOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Apply for {opp.title}</h2>
            {applySuccess ? (
              <div className="text-center py-6 text-green-600 font-semibold">{applySuccess}</div>
            ) : (
              <>
                {applyError && <p className="text-red-600 text-sm mb-3">{applyError}</p>}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Resume URL (optional)</label>
                    <input type="url" value={resumeUrl} onChange={e => setResumeUrl(e.target.value)}
                      placeholder="https://drive.google.com/..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cover Letter (optional)</label>
                    <textarea rows={5} value={coverLetter} onChange={e => setCoverLetter(e.target.value)}
                      placeholder="Why are you a good fit for this opportunity?"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                  </div>
                </div>
                <div className="flex gap-3 mt-5">
                  <button onClick={() => setApplyOpen(false)} className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition">
                    Cancel
                  </button>
                  <button onClick={handleApply} disabled={applying}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-2 rounded-lg text-sm font-semibold transition">
                    {applying ? 'Submitting...' : 'Submit Application'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
