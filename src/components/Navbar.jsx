'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import LanguageDropdown from './LanguageDropdown';
import { LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const { t } = useLanguage();
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Login & Sign Up buttons */}
        <div className="flex items-center gap-2 sm:gap-3 order-1">
          {user ? (
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-xs transition shadow-indigo-500/20"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>{t.nav.dashboard}</span>
            </Link>
          ) : (
            <>
              {/* Login Button */}
              <Link
                href="/login"
                className="px-3 sm:px-4 py-1.5 rounded-lg border border-slate-200/90 text-slate-700 hover:text-slate-900 hover:bg-slate-50 text-xs sm:text-sm font-medium transition shadow-xs"
              >
                {t.nav.login}
              </Link>

              {/* Sign Up Button */}
              <Link
                href="/signup"
                className="px-3 sm:px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs sm:text-sm font-semibold shadow-xs transition shadow-indigo-500/20"
              >
                {t.nav.signup}
              </Link>
            </>
          )}
        </div>

        {/* Center: ChaserFlow Brand Logo */}
        <Link 
          href="/" 
          className="flex items-center group order-2 transition-transform hover:opacity-95"
        >
          <Image
            src="/logo.jpg"
            alt="ChaserFlow Logo"
            width={240}
            height={80}
            priority
            className="h-8 sm:h-10 w-auto object-contain rounded-lg shadow-xs"
          />
        </Link>

        {/* Right: Language Switcher Dropdown */}
        <div className="flex items-center gap-2 order-3">
          <LanguageDropdown />
        </div>
      </div>
    </header>
  );
}
