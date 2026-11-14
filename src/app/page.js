'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '../components/Navbar';
import HeroIllustration from '../components/HeroIllustration';
import { useLanguage } from '../context/LanguageContext';
import { ArrowRight, CheckCircle2, ShieldCheck, Zap, Sparkles } from 'lucide-react';

export default function HomePage() {
  const { t, dir } = useLanguage();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans" dir={dir}>
      {/* 1. Navbar */}
      <Navbar />

      {/* 2. Hero Section (Centered Layout) */}
      <section className="relative pt-12 sm:pt-20 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-indigo-100/60 to-transparent pointer-events-none -z-10" />

        <div className="max-w-4xl mx-auto text-center space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-semibold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>{t.hero.badge}</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight sm:leading-tight">
            {t.hero.title}
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {t.hero.subtitle}
          </p>

          {/* Call to actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/signup"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-sm shadow-md shadow-indigo-500/25 hover:shadow-indigo-500/35 transition-all text-center"
            >
              {t.hero.ctaPrimary}
            </Link>

            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm border border-slate-200/90 shadow-xs transition text-center"
            >
              {t.hero.ctaSecondary}
            </Link>
          </div>
        </div>

        {/* 1. Placement & 2. Container Styling: Directly below hero typography, above dashboard preview/metrics */}
        <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 mt-12 mb-16">
          <div className="relative group animate-fade-in-up">
            {/* Ambient soft glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 via-sky-500/15 to-violet-500/20 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition duration-700 pointer-events-none" />

            {/* 3. Image Styling, 4. Animation & 5. Optimization (Next.js Image, 16:9 aspect ratio, priority) */}
            <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-gray-200/50 shadow-2xl shadow-indigo-500/10 bg-white transition-transform duration-500 hover:scale-[1.02]">
              <Image
                src="/hero-invoice-chaser.jpg"
                alt="Automated Invoice Chaser Platform Overview"
                width={1920}
                height={1080}
                priority
                className="w-full h-auto aspect-video object-cover rounded-2xl sm:rounded-3xl"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 95vw, 1200px"
              />
            </div>
          </div>
        </div>

        {/* Dashboard Preview / Metrics Pipeline Section */}
        <div className="mt-4">
          <HeroIllustration />
        </div>
      </section>

      {/* 3. Below Hero: Clean, Simple Typography Section (Why it's simple, not complicated) */}
      <section className="py-16 sm:py-24 bg-white border-y border-slate-200/70">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200/60">
              {t.valueSection.tagline}
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900">
              {t.valueSection.title}
            </h2>
            <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
              {t.valueSection.subtitle}
            </p>
          </div>

          {/* 3 Key Value Points Typography Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
            {t.valueSection.points.map((point, index) => (
              <div 
                key={index}
                className="relative p-6 sm:p-7 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:border-indigo-300 transition-colors shadow-xs group"
              >
                <div className="text-3xl font-extrabold text-indigo-600/30 group-hover:text-indigo-600 transition-colors font-mono mb-4">
                  {point.num}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 tracking-tight">
                  {point.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {point.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Bottom assurance pill */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 text-xs font-medium text-slate-500 bg-slate-100 px-4 py-2 rounded-full border border-slate-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{t.auth.authNotice}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 bg-slate-50 border-t border-slate-200 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Dion SaaS. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/login" className="hover:text-slate-600 transition">{t.nav.login}</Link>
            <Link href="/signup" className="hover:text-slate-600 transition">{t.nav.signup}</Link>
            <Link href="/dashboard" className="hover:text-slate-600 transition">{t.nav.dashboard}</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
