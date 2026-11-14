'use client';

import React from 'react';
import { 
  FileText, 
  Send, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  ArrowRight, 
  DollarSign, 
  Sparkles,
  TrendingUp,
  CreditCard
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function HeroIllustration() {
  const { language } = useLanguage();

  return (
    <div className="relative mx-auto max-w-4xl w-full">
      {/* Background ambient lighting */}
      <div className="absolute -inset-1.5 bg-gradient-to-r from-indigo-500 to-violet-600 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition duration-1000 -z-10" />

      {/* Main Container Card representing Automated Invoicing & Debt Collection */}
      <div className="relative bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/90 shadow-2xl p-4 sm:p-7 overflow-hidden text-left">
        {/* Top window header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-400"></span>
            <span className="w-3 h-3 rounded-full bg-amber-400"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
            <span className="text-xs text-slate-400 font-mono ml-2">dion.engine / automated-recovery</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Auto-Chaser Active
            </span>
          </div>
        </div>

        {/* Content Grid */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
          {/* Left panel: Sample Chased Invoice */}
          <div className="md:col-span-7 bg-slate-50/80 rounded-xl p-4 border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                  INV
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Acme Global Dynamics</h4>
                  <p className="text-[11px] text-slate-400">Due: Nov 15, 2026 • #INV-8892</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-base font-bold text-slate-900 font-mono">$4,850.00</span>
                <span className="block text-[10px] text-emerald-600 font-medium">Recovered 100%</span>
              </div>
            </div>

            {/* Chasing Steps Bar */}
            <div className="pt-2">
              <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1.5 font-medium">
                <span>Automated Follow-up Sequence</span>
                <span className="text-indigo-600">Stage 3 of 3 (Settled)</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden flex">
                <div className="bg-indigo-500 h-full w-1/3 border-r border-white"></div>
                <div className="bg-indigo-600 h-full w-1/3 border-r border-white"></div>
                <div className="bg-emerald-500 h-full w-1/3"></div>
              </div>
            </div>

            {/* Timeline Events */}
            <div className="space-y-2 pt-1 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200/60 shadow-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-slate-700 font-medium">Stage 1: Friendly Due Reminder</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Email Sent</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200/60 shadow-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-slate-700 font-medium">Stage 2: Overdue SMS Notice & Link</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Opened</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50/70 border border-emerald-200/70 shadow-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-950 font-bold">Stage 3: One-Click Payment Received</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 font-mono">$4,850.00 PAID</span>
              </div>
            </div>
          </div>

          {/* Right panel: Metrics & Direct Payout */}
          <div className="md:col-span-5 space-y-3">
            <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white shadow-card">
              <div className="flex items-center justify-between text-xs text-indigo-200 mb-2">
                <span>Total Recovered</span>
                <Sparkles className="w-4 h-4 text-amber-300" />
              </div>
              <div className="text-2xl font-bold font-mono tracking-tight">$38,420.00</div>
              <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-400">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>94.8% collection success rate</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/60 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                <CreditCard className="w-4 h-4 text-indigo-600" />
                <span>Instant Bank & Card Deposit</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Recovered funds bypass middlemen and deposit straight into your connected Stripe or bank account.
              </p>
            </div>
          </div>
        </div>

        {/* Caption */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>Illustration: Automated debt recovery pipeline</span>
          <span className="font-mono">Supabase Auth • Real-time DB • Zero Friction</span>
        </div>
      </div>
    </div>
  );
}
