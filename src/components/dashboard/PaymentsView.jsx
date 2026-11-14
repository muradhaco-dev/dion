'use client';

import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  DollarSign, 
  CreditCard, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Plus,
  ArrowUpRight,
  TrendingUp,
  FileText
} from 'lucide-react';

export default function PaymentsView({ 
  invoices = [], 
  onMarkPaid, 
  onNavigateToCreate 
}) {
  const { t } = useLanguage();

  // Compute live totals
  let totalCollected = 0;
  let pendingAmount = 0;
  const debtorSet = new Set();

  invoices.forEach((inv) => {
    const amt = Number(inv.amount) || 0;
    if (inv.status === 'paid') {
      totalCollected += amt;
    } else {
      pendingAmount += amt;
      if (inv.client) debtorSet.add(inv.client.toLowerCase());
    }
  });

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(val || 0);
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            {t.dashboard.paymentsView.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {t.dashboard.paymentsView.subtitle}
          </p>
        </div>

        <button
          onClick={onNavigateToCreate}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-xs transition shadow-indigo-500/20 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{t.dashboard.paymentsView.recordPayment}</span>
        </button>
      </div>

      {/* Top 3 Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">
              {t.dashboard.paymentsView.summary.totalCollected}
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900 font-mono">
            {formatCurrency(totalCollected)}
          </div>
          <div className="mt-2 text-[11px] text-emerald-600 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Direct to connected account</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">
              {t.dashboard.paymentsView.summary.pendingCollection}
            </span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900 font-mono">
            {formatCurrency(pendingAmount)}
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            Enrolled in automated follow-ups
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">
              {t.dashboard.paymentsView.summary.activeDebtors}
            </span>
            <div className="p-2 rounded-xl bg-slate-100 text-slate-600">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900 font-mono">
            {debtorSet.size}
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            Unique clients with open balances
          </div>
        </div>
      </div>

      {/* Clean Table / Canvas Area */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        {invoices.length === 0 ? (
          /* Clean Empty State (NO fake text) */
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-4">
              <CreditCard className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-slate-800">
              {t.dashboard.paymentsView.emptyStateTitle}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-1 mb-6">
              {t.dashboard.paymentsView.emptyStateDesc}
            </p>
            <button
              onClick={onNavigateToCreate}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition"
            >
              <Plus className="w-4 h-4" />
              <span>{t.dashboard.paymentsView.recordPayment}</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-6">{t.dashboard.paymentsView.columns.id}</th>
                  <th className="py-3 px-4">{t.dashboard.paymentsView.columns.client}</th>
                  <th className="py-3 px-4">{t.dashboard.paymentsView.columns.amount}</th>
                  <th className="py-3 px-4">{t.dashboard.paymentsView.columns.status}</th>
                  <th className="py-3 px-4">{t.dashboard.paymentsView.columns.date}</th>
                  <th className="py-3 px-6 text-right">{t.dashboard.paymentsView.columns.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoices.map((inv) => {
                  const isPaid = inv.status === 'paid';

                  return (
                    <tr key={inv.id} className="hover:bg-slate-50/60 transition">
                      <td className="py-3.5 px-6 font-mono text-xs font-medium text-slate-600">
                        {inv.id}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        {inv.client}
                        <span className="block text-[11px] font-normal text-slate-400 font-mono">
                          {inv.email}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        {formatCurrency(inv.amount)}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                            isPaid
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60'
                              : 'bg-amber-50 text-amber-700 border-amber-200/60'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isPaid ? 'bg-emerald-500' : 'bg-amber-500'
                            }`}
                          />
                          {isPaid ? 'Paid' : 'Pending'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 text-xs">
                        {inv.dueDate || inv.created_at?.split('T')[0]}
                      </td>
                      <td className="py-3.5 px-6 text-right">
                        {isPaid ? (
                          <span className="text-xs text-emerald-600 font-semibold inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Settled</span>
                          </span>
                        ) : (
                          <button
                            onClick={() => onMarkPaid(inv.id)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition"
                          >
                            Mark Paid
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
