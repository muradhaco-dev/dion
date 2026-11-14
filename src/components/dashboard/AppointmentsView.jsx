'use client';

import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Calendar, Clock, User, CheckCircle2, Plus, PhoneCall, Video, FileCheck } from 'lucide-react';

export default function AppointmentsView({ appointments = [], onNavigateToCreate, onToggleStatus }) {
  const { t } = useLanguage();

  const getTypeIcon = (type) => {
    switch (type) {
      case 'phone':
        return <PhoneCall className="w-4 h-4 text-indigo-600" />;
      case 'meeting':
        return <Video className="w-4 h-4 text-emerald-600" />;
      default:
        return <FileCheck className="w-4 h-4 text-amber-600" />;
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            {t.dashboard.appointmentsView.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {t.dashboard.appointmentsView.subtitle}
          </p>
        </div>

        <button
          onClick={onNavigateToCreate}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-xs transition shadow-indigo-500/20 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{t.dashboard.appointmentsView.scheduleNew}</span>
        </button>
      </div>

      {/* Content Canvas */}
      {appointments.length === 0 ? (
        /* Clean Empty State (NO fake text) */
        <div className="bg-white rounded-2xl border border-slate-200/90 p-12 text-center shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mx-auto mb-4">
            <Calendar className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-800">
            {t.dashboard.appointmentsView.emptyStateTitle}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-1 mb-6">
            {t.dashboard.appointmentsView.emptyStateDesc}
          </p>
          <button
            onClick={onNavigateToCreate}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition"
          >
            <Plus className="w-4 h-4" />
            <span>{t.dashboard.appointmentsView.scheduleNew}</span>
          </button>
        </div>
      ) : (
        /* Real Appointments List */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {appointments.map((apt) => {
            const isCompleted = apt.status === 'completed';

            return (
              <div
                key={apt.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:border-slate-300 transition flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono text-slate-400">#{apt.id}</span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                        isCompleted
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60'
                          : 'bg-indigo-50 text-indigo-700 border-indigo-200/60'
                      }`}
                    >
                      {isCompleted ? t.dashboard.appointmentsView.statusCompleted : t.dashboard.appointmentsView.statusUpcoming}
                    </span>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 shrink-0">
                      {getTypeIcon(apt.type)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 leading-snug">
                        {apt.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>{apt.client}</span>
                      </p>
                    </div>
                  </div>

                  {apt.notes && (
                    <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 mt-3">
                      {apt.notes}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1.5 font-medium">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{new Date(apt.date).toLocaleString()}</span>
                  </div>

                  <button
                    onClick={() => onToggleStatus(apt.id)}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition"
                  >
                    {isCompleted ? 'Mark Pending' : 'Mark Done ✓'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
