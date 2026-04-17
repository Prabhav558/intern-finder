'use client';

import Link from 'next/link';

const typeColors: Record<string, string> = {
  INTERNSHIP: 'bg-blue-100 text-blue-700',
  HACKATHON: 'bg-purple-100 text-purple-700',
  JOB: 'bg-green-100 text-green-700',
  RESEARCH: 'bg-yellow-100 text-yellow-700',
  SCHOLARSHIP: 'bg-orange-100 text-orange-700',
  WORKSHOP: 'bg-pink-100 text-pink-700',
  COMPETITION: 'bg-indigo-100 text-indigo-700',
};

const modeColors: Record<string, string> = {
  REMOTE: 'bg-teal-100 text-teal-700',
  ONSITE: 'bg-gray-100 text-gray-700',
  HYBRID: 'bg-cyan-100 text-cyan-700',
};

function daysLeft(deadline: string) {
  const diff = Math.ceil((new Date(deadline).getTime() - Date.now()) / 86400000);
  if (diff < 0) return { label: 'Expired', color: 'text-red-500' };
  if (diff === 0) return { label: 'Due today', color: 'text-red-500' };
  if (diff <= 3) return { label: `${diff}d left`, color: 'text-orange-500' };
  return { label: `${diff}d left`, color: 'text-gray-500' };
}

interface Props {
  opportunity: any;
  isBookmarked?: boolean;
  onBookmarkToggle?: (id: string) => void;
  compact?: boolean;
}

export default function OpportunityCard({ opportunity, isBookmarked, onBookmarkToggle, compact }: Props) {
  const dl = daysLeft(opportunity.deadline);
  const tags: string[] = opportunity.tags || [];
  const displayTags = tags.slice(0, 3);
  const extraTags = tags.length - 3;

  return (
    <div className="bg-white rounded-xl shadow hover:shadow-md transition border border-gray-100 flex flex-col">
      <div className="p-5 flex-1">
        <div className="flex justify-between items-start gap-2 mb-2">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${typeColors[opportunity.type] || 'bg-gray-100 text-gray-600'}`}>
            {opportunity.type}
          </span>
          {onBookmarkToggle && (
            <button
              onClick={() => onBookmarkToggle(opportunity.id)}
              className="text-gray-400 hover:text-yellow-500 transition"
              title={isBookmarked ? 'Remove bookmark' : 'Save'}
            >
              {isBookmarked ? (
                <svg className="w-5 h-5 fill-yellow-400 text-yellow-400" viewBox="0 0 24 24"><path d="M5 3h14a1 1 0 011 1v17l-7-3-7 3V4a1 1 0 011-1z"/></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3h14a1 1 0 011 1v17l-7-3-7 3V4a1 1 0 011-1z"/></svg>
              )}
            </button>
          )}
        </div>

        <h3 className="font-bold text-gray-900 text-base leading-snug mb-1 line-clamp-2">
          {opportunity.title}
        </h3>
        <p className="text-sm text-gray-500 mb-3">{opportunity.companyName}</p>

        {!compact && (
          <div className="flex flex-wrap gap-1 mb-3">
            {displayTags.map((tag) => (
              <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{tag}</span>
            ))}
            {extraTags > 0 && (
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">+{extraTags}</span>
            )}
          </div>
        )}

        <div className="flex items-center gap-3 text-xs text-gray-500">
          {opportunity.location && <span>{opportunity.location}</span>}
          {opportunity.mode && (
            <span className={`px-2 py-0.5 rounded-full font-medium ${modeColors[opportunity.mode] || 'bg-gray-100 text-gray-600'}`}>
              {opportunity.mode}
            </span>
          )}
          {opportunity.stipendPrize && <span className="text-green-600 font-medium">{opportunity.stipendPrize}</span>}
        </div>
      </div>

      <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between">
        <span className={`text-xs font-medium ${dl.color}`}>{dl.label}</span>
        <Link
          href={`/opportunities/${opportunity.id}`}
          className="text-xs bg-blue-600 hover:bg-blue-700 text-white font-semibold px-3 py-1.5 rounded-lg transition"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
