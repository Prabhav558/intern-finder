'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

const navLinks = [
  { href: '/opportunities', label: 'Opportunities' },
  { href: '/applications', label: 'Applications' },
  { href: '/bookmarks', label: 'Bookmarks' },
  { href: '/profile', label: 'Profile' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/dashboard" className="text-xl font-bold text-blue-700">
          OpportuNest
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition ${
                pathname.startsWith(link.href)
                  ? 'text-blue-600 border-b-2 border-blue-600 pb-0.5'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              {link.label}
            </Link>
          ))}
          {user?.role === 'ADMIN' && (
            <Link
              href="/admin"
              className={`text-sm font-medium transition ${
                pathname.startsWith('/admin') ? 'text-purple-600 border-b-2 border-purple-600 pb-0.5' : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              Admin
            </Link>
          )}
        </div>

        {/* User + logout */}
        <div className="hidden md:flex items-center gap-3">
          {user && (
            <span className="text-sm text-gray-600">
              Hi, <span className="font-semibold">{user.name?.split(' ')[0]}</span>
            </span>
          )}
          <button
            onClick={logout}
            className="text-sm bg-red-500 hover:bg-red-600 text-white font-medium px-3 py-1.5 rounded-lg transition"
          >
            Logout
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-gray-600"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t px-4 py-3 flex flex-col gap-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`text-sm font-medium ${pathname.startsWith(link.href) ? 'text-blue-600' : 'text-gray-600'}`}
            >
              {link.label}
            </Link>
          ))}
          {user?.role === 'ADMIN' && (
            <Link href="/admin" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-gray-600">
              Admin
            </Link>
          )}
          <button onClick={logout} className="text-left text-sm text-red-500 font-medium">
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
