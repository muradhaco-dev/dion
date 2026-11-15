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
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand: ChaserFlow in an intentional luxury dark badge */}
        <Link 
          href="/" 
          className="flex items-center group focus:outline-none transition-transform hover:scale-[1.02]"
        >
          <div className="flex items-center bg-[#0B1120] px-3.5 py-1.5 rounded-xl border border-slate-800/90 shadow-sm">
            <Image
              src="/logo.jpg"
              alt="ChaserFlow Logo"
              width={180}
              height={50}
              priority
              className="h-7 sm:h-8 w-auto object-contain"
            />
          </div>
        </Link>

        {/* Actions: Language & Auth */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <LanguageDropdown theme="light" />

          {user ? (
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold shadow-xs transition"
            >
              <LayoutDashboard className="w-4 h-4 text-slate-300" />
              <span>{t.nav.dashboard}</span>
            </Link>
          ) : (
            <>
              {/* Login */}
              <Link
                href="/login"
                className="px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 transition"
              >
                {t.nav.login}
              </Link>

              {/* Sign Up */}
              <Link
                href="/signup"
                className="px-4 sm:px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white text-xs sm:text-sm font-semibold shadow-xs hover:shadow transition-all"
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
