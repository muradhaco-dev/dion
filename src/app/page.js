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
  Clock, 
  CreditCard, 
  BarChart3,
  BellRing,
  ArrowUpRight,
  Lock
} from 'lucide-react';

export default function HomePage() {
  const { t, dir } = useLanguage();
  const isRtl = dir === 'rtl';

  return (
    <div className="min-h-screen bg-[#FAFBFD] text-slate-900 flex flex-col font-sans antialiased" dir={dir}>
      {/* 1. Refined Minimalist Navbar */}
      <Navbar />

      {/* 2. Above-The-Fold Hero Section (Compact & Pristine) */}
      <section className="relative pt-8 sm:pt-12 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Soft, warm atmospheric background glow (no harsh neon) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-80 bg-gradient-to-b from-slate-100/80 via-indigo-50/20 to-transparent pointer-events-none -z-10" />

        <div className="max-w-4xl mx-auto text-center">
          {/* Subtle Editorial Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100/90 border border-slate-200/80 text-slate-700 text-xs font-medium mb-5 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
            <span>نظام أتمتة التحصيل والمستحقات المالية للشركات</span>
          </div>

          {/* Headline: Confident, Authoritative & Human-Crafted */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-950 leading-[1.2] sm:leading-[1.15] mb-4">
            تحصيل الفواتير والديون
            <span className="block mt-1 sm:mt-2 text-indigo-700">
              دون عناء أو إحراج
            </span>
          </h1>

          {/* Subtitle / Value Proposition */}
          <p className="text-sm sm:text-base lg:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal mb-7">
            {t.hero.subtitle}
          </p>

          {/* Primary & Secondary Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
            <Link
              href="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-semibold text-sm shadow-sm hover:shadow transition-all group"
            >
              <span>{t.hero.ctaPrimary}</span>
              <ArrowRight className={`w-4 h-4 transition-transform ${isRtl ? 'group-hover:-translate-x-1 rotate-180' : 'group-hover:translate-x-1'}`} />
            </Link>

            <Link
              href="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-medium text-sm border border-slate-200/90 shadow-xs transition"
            >
              <span>{t.hero.ctaSecondary}</span>
            </Link>
          </div>

          {/* Hero Illustration: Carefully proportioned, elegant, fully above-the-fold */}
          <div className="max-w-3xl mx-auto w-full">
            <div className="relative group rounded-2xl sm:rounded-3xl p-1.5 sm:p-2 bg-gradient-to-b from-slate-200/70 via-slate-100/50 to-slate-200/40 border border-slate-200/80 shadow-[0_20px_50px_-15px_rgba(15,23,42,0.08)]">
              <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-white border border-slate-200/50">
                <Image
                  src="/hero-invoice-chaser.jpg"
                  alt="ChaserFlow Platform Overview"
                  width={1400}
                  height={800}
                  priority
                  className="w-full h-auto max-h-[260px] sm:max-h-[320px] lg:max-h-[360px] object-cover object-center transition-transform duration-700 group-hover:scale-[1.01]"
                />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Enterprise Trust & Reliability Bar */}
      <section className="py-6 border-y border-slate-200/80 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center text-xs sm:text-sm font-medium text-slate-600">
            <div className="flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-slate-900" />
              <span>تشفير مالي آمن بمعايير بنكية</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <BellRing className="w-4 h-4 text-slate-900" />
              <span>تذكيرات ذكية قبل وبعد الاستحقاق</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <CreditCard className="w-4 h-4 text-slate-900" />
              <span>سداد فوري ومباشر إلى حسابك</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Clock className="w-4 h-4 text-slate-900" />
              <span>أتمتة كاملة توفر ساعات العمل</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Core Value Proposition Cards (Refined Architectural Cards) */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-[#FAFBFD]">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-16">
            <span className="text-xs font-semibold text-indigo-700 tracking-wider uppercase mb-2 block">
              {t.valueSection.tagline}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-950 mb-3">
              {t.valueSection.title}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {t.valueSection.subtitle}
            </p>
          </div>

          {/* 3 Refined Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {t.valueSection.points.map((point, index) => (
              <div 
                key={index}
                className="bg-white p-7 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200/60 flex items-center justify-center text-slate-800 font-bold text-sm font-mono mb-5">
                    {point.num}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2.5 tracking-tight">
                    {point.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {point.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-xs font-semibold text-slate-900">
                  <span>أتمتة سلسة وموثوقة</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mr-2 ml-2" />
                </div>
              </div>
            ))}
          </div>

          {/* Minimalist Bottom CTA Banner */}
          <div className="mt-16 p-8 sm:p-12 rounded-2xl sm:rounded-3xl bg-slate-900 text-white text-center space-y-4 shadow-md">
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight">
              ابدأ في استرداد أموالك ومستحقاتك اليوم
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
              انضم للشركات والمستقلين الذين يعتمدون على ChaserFlow لضمان تدفق نقدي صحي ومستمر دون إحراج العملاء.
            </p>
            <div className="pt-2">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-6 sm:px-7 py-3 rounded-xl bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-900 font-semibold text-sm transition"
              >
                <span>إنشاء حساب مجاني</span>
                <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Minimalist Respectful Footer */}
      <footer className="mt-auto py-8 bg-white border-t border-slate-200/80 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 ChaserFlow. جميع الحقوق محفوظة.</p>
          <div className="flex items-center gap-6 text-slate-600 font-medium">
            <Link href="/login" className="hover:text-slate-900 transition">{t.nav.login}</Link>
            <Link href="/signup" className="hover:text-slate-900 transition">{t.nav.signup}</Link>
            <Link href="/dashboard" className="hover:text-slate-900 transition">{t.nav.dashboard}</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
