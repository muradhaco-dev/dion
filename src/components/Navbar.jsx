'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import LanguageDropdown from './LanguageDropdown';
import { LayoutDashboard } from 'lucide-react';

export default function Navbar({ theme = 'dark' }) {
  const { t } = useLanguage();
  const { user } = useAuth();
  const isDark = theme === 'dark';

  return (
    <header className={`sticky top-0 z-40 w-full backdrop-blur-md transition-colors ${
      isDark
        ? 'bg-[#070b14]/85 border-b border-slate-800/80'
        : 'bg-white/85 border-b border-slate-200/80'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Start: ChaserFlow Brand Logo */}
        <Link 
          href="/" 
          className="flex items-center group transition-transform hover:scale-[1.02] focus:outline-none"
        >
          <Image
            src="/logo.jpg"
            alt="ChaserFlow Logo"
            width={220}
            height={60}
            priority
            className="h-8 sm:h-10 w-auto object-contain rounded-lg"
          />
        </Link>

        {/* End: Language Switcher & Action Buttons */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Language Switcher */}
          <LanguageDropdown theme={isDark ? 'dark' : 'light'} />

          {user ? (
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs sm:text-sm font-semibold shadow-md shadow-indigo-500/25 transition-all"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>{t.nav.dashboard}</span>
            </Link>
          ) : (
            <>
              {/* Login Button */}
              <Link
                href="/login"
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium transition shadow-xs ${
                  isDark
                    ? 'border border-slate-700/80 text-slate-300 hover:text-white bg-slate-800/50 hover:bg-slate-800'
                    : 'border border-slate-200/90 text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {t.nav.login}
              </Link>

              {/* Sign Up Button */}
              <Link
                href="/signup"
                className="px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-blue-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-cyan-500/20 hover:shadow-cyan-500/30 transition-all"
              >
                {t.nav.signup}
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
