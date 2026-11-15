'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '../components/Navbar';
import { useLanguage } from '../context/LanguageContext';
import { 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  Sparkles, 
  LayoutDashboard,
  TrendingUp,
  Clock,
  Lock,
  ChevronLeft
} from 'lucide-react';

export default function HomePage() {
  const { t, dir } = useLanguage();
  const isRtl = dir === 'rtl';

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-white" dir={dir}>
      {/* 1. Navbar with Dark Luxury Styling */}
      <Navbar theme="dark" />

      {/* 2. Hero Section: Split 2-Column Desktop Grid (100% Above-The-Fold Without Scrolling) */}
      <section className="relative pt-6 sm:pt-10 lg:pt-14 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Ambient atmospheric glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[550px] bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(6,182,212,0.22),rgba(99,102,241,0.18),transparent)] pointer-events-none -z-10" />
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b18_1px,transparent_1px),linear-gradient(to_bottom,#1e293b18_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_70%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left/Start Column: Typography, Value Proposition & Actions */}
            <div className="lg:col-span-7 space-y-5 sm:space-y-6 text-center lg:text-start">
              {/* Prestige SaaS Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 text-xs font-semibold shadow-[0_0_20px_rgba(6,182,212,0.18)]">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span>{t.hero.badge}</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-black tracking-tight text-white leading-[1.25] sm:leading-[1.2]">
                تحصيل الفواتير والديون آلياً
                <span className="block mt-1 sm:mt-2 bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
                  دون عناء أو إحراج
                </span>
              </h1>

              {/* Subtitle / Description */}
              <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                {t.hero.subtitle}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-1">
                <Link
                  href="/signup"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3 sm:py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-blue-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-200 group"
                >
                  <span>{t.hero.ctaPrimary}</span>
                  <ArrowRight className={`w-4 h-4 transition-transform ${isRtl ? 'group-hover:-translate-x-1 rotate-180' : 'group-hover:translate-x-1'}`} />
                </Link>

                <Link
                  href="/dashboard"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 sm:py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 hover:text-white font-semibold text-sm border border-slate-700 shadow-sm transition"
                >
                  <LayoutDashboard className="w-4 h-4 text-cyan-400" />
                  <span>{t.hero.ctaSecondary}</span>
                </Link>
              </div>

              {/* Quick Trust Highlights */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-x-5 gap-y-2 text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>أتمتة فورية 100%</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>تذكير تلقائي ذكي</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                  <span>تشفير مالي آمن</span>
                </span>
              </div>
            </div>

            {/* Right/End Column: Compact, Sized Hero Illustration (Software Card Window) */}
            <div className="lg:col-span-5 relative mt-4 lg:mt-0">
              <div className="relative group max-w-md mx-auto lg:max-w-none">
                {/* Luminous border glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-tr from-cyan-500/30 via-indigo-500/25 to-blue-600/30 rounded-2xl sm:rounded-3xl blur-xl opacity-80 group-hover:opacity-100 transition duration-500 pointer-events-none" />

                {/* macOS / SaaS Window Container with sleek border */}
                <div className="relative rounded-2xl overflow-hidden border border-slate-700/80 bg-slate-900/90 shadow-2xl shadow-indigo-950/60 transition-transform duration-300 hover:scale-[1.01]">
                  {/* Window Bar Header */}
                  <div className="h-8 bg-slate-900/95 border-b border-slate-800 px-3.5 flex items-center justify-between select-none">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 font-medium">
                      ChaserFlow • Live Collections Engine
                    </span>
                    <div className="w-8" />
                  </div>

                  {/* Sized Hero Image (Compact height to preserve screen space) */}
                  <div className="relative bg-slate-950 overflow-hidden">
                    <Image
                      src="/hero-invoice-chaser.jpg"
                      alt="ChaserFlow Automated Invoice Collections Platform"
                      width={800}
                      height={480}
                      priority
                      className="w-full h-auto max-h-[260px] sm:max-h-[300px] lg:max-h-[320px] object-cover object-center"
                    />
                  </div>

                  {/* Floating Live Automation Status Pill */}
                  <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 bg-slate-900/95 backdrop-blur-md border border-emerald-500/40 px-3 py-1.5 rounded-xl shadow-xl flex items-center gap-2 text-[11px] text-emerald-300 font-semibold animate-fade-in-up">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                    <span>تم تحصيل الفاتورة #1042 آلياً ✓</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Authority & Financial Stats Bar (يعطي ثقل وقوة للمنصة) */}
      <section className="relative py-8 px-4 sm:px-6 lg:px-8 border-y border-slate-800/80 bg-slate-950/70">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center divide-y lg:divide-y-0 lg:divide-x lg:divide-x-reverse divide-slate-800/80">
            
            <div className="pt-4 lg:pt-0">
              <div className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-cyan-400 to-sky-300 bg-clip-text text-transparent font-mono">
                +94%
              </div>
              <div className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
                متوسط نسبة تحصيل الفواتير
              </div>
            </div>

            <div className="pt-4 lg:pt-0">
              <div className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-indigo-400 to-cyan-300 bg-clip-text text-transparent font-mono">
                3x
              </div>
              <div className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
                تسريع دورة التدفق المالي
              </div>
            </div>

            <div className="pt-4 lg:pt-0">
              <div className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-emerald-400 to-cyan-300 bg-clip-text text-transparent font-mono">
                0
              </div>
              <div className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
                اتصالات محرجة أو جهد يدوي
              </div>
            </div>

            <div className="pt-4 lg:pt-0">
              <div className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-violet-400 to-indigo-300 bg-clip-text text-transparent font-mono">
                24/7
              </div>
              <div className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
                متابعة وجدولة آلية مستمرة
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Value Proposition Cards (تصميم بطاقات فخمة ومتينة) */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-[#070b14]">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12 sm:mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/80 px-3.5 py-1.5 rounded-full border border-cyan-500/40 shadow-xs">
              {t.valueSection.tagline}
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              {t.valueSection.title}
            </h2>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              {t.valueSection.subtitle}
            </p>
          </div>

          {/* 3 High-Status Value Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {t.valueSection.points.map((point, index) => (
              <div 
                key={index}
                className="relative p-7 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-all duration-300 shadow-xl hover:shadow-cyan-500/5 group"
              >
                {/* Glow pill behind number */}
                <div className="text-3xl font-extrabold text-cyan-500/30 group-hover:text-cyan-400 transition-colors font-mono mb-4">
                  {point.num}
                </div>
                <h3 className="text-lg font-bold text-white mb-2.5 tracking-tight group-hover:text-cyan-300 transition-colors">
                  {point.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {point.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Call-to-Action Card */}
          <div className="mt-14 p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/50 to-slate-900 border border-slate-800 text-center space-y-4 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(6,182,212,0.12),transparent)] pointer-events-none" />
            <h3 className="text-xl sm:text-2xl font-bold text-white relative">
              جاهز لأتمتة تحصيل مستحقاتك وزيادة تدفقك المالي؟
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto relative">
              ابدأ الآن مجاناً في دقيقتين فقط وودّع تأخر العملاء عن السداد إلى الأبد.
            </p>
            <div className="pt-2 relative">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-blue-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-cyan-500/25 transition-all"
              >
                <span>ابدأ مجاناً الآن</span>
                <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Footer */}
      <footer className="mt-auto py-8 bg-slate-950 border-t border-slate-800/80 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300 font-mono text-[11px]">جميع الأنظمة تعمل بكفاءة عالية</span>
          </div>
          <p>© 2026 ChaserFlow SaaS. All rights reserved.</p>
          <div className="flex items-center gap-6 text-slate-400">
            <Link href="/login" className="hover:text-cyan-400 transition">{t.nav.login}</Link>
            <Link href="/signup" className="hover:text-cyan-400 transition">{t.nav.signup}</Link>
            <Link href="/dashboard" className="hover:text-cyan-400 transition">{t.nav.dashboard}</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
