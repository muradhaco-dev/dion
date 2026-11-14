'use client';

import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Building2, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Save, 
  ShieldCheck,
  Database
} from 'lucide-react';

export default function SettingsView() {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [companyName, setCompanyName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // 1. Fetch existing company_name from 'profiles' table on load
  useEffect(() => {
    let isMounted = true;

    async function loadUserProfile() {
      setIsLoading(true);
      try {
        let userId = user?.id;

        // Ensure we retrieve user ID from Supabase Auth client directly
        if (!userId && isSupabaseConfigured) {
          const { data: authData } = await supabase.auth.getUser();
          userId = authData?.user?.id;
        }

        // Check fallback local session if in demo mode
        if (!userId && typeof window !== 'undefined') {
          const savedLocalUser = localStorage.getItem('dion_mock_user');
          if (savedLocalUser) {
            userId = JSON.parse(savedLocalUser)?.id;
          }
        }

        if (userId) {
          // Attempt fetch from Supabase 'profiles' table where id = user.id
          if (isSupabaseConfigured) {
            const { data, error } = await supabase
              .from('profiles')
              .select('company_name')
              .eq('id', userId)
              .maybeSingle();

            if (!error && data?.company_name && isMounted) {
              setCompanyName(data.company_name);
              return;
            }
          }

          // Fallback to local storage profile if offline or mock
          if (typeof window !== 'undefined') {
            const cachedName = localStorage.getItem(`dion_profile_${userId}`);
            if (cachedName && isMounted) {
              setCompanyName(cachedName);
            }
          }
        }
      } catch (err) {
        console.warn('Profile fetch notice:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadUserProfile();

    return () => {
      isMounted = false;
    };
  }, [user]);

  // 2. Submit handler to update or upsert company_name in 'profiles'
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage(false);
    setIsSaving(true);

    try {
      let userId = user?.id;

      if (!userId && isSupabaseConfigured) {
        const { data: authData } = await supabase.auth.getUser();
        userId = authData?.user?.id;
      }

      if (!userId && typeof window !== 'undefined') {
        const savedLocalUser = localStorage.getItem('dion_mock_user');
        if (savedLocalUser) {
          userId = JSON.parse(savedLocalUser)?.id;
        }
      }

      if (!userId) {
        throw new Error('Authentication required to save profile.');
      }

      const trimmedName = companyName.trim();

      // Upsert to Supabase 'profiles' table
      if (isSupabaseConfigured) {
        const { error: upsertError } = await supabase
          .from('profiles')
          .upsert(
            {
              id: userId,
              company_name: trimmedName,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'id' }
          );

        if (upsertError) {
          throw upsertError;
        }
      }

      // Always save to local storage cache as well
      if (typeof window !== 'undefined') {
        localStorage.setItem(`dion_profile_${userId}`, trimmedName);
      }

      setSuccessMessage(true);
      setTimeout(() => setSuccessMessage(false), 4500);
    } catch (err) {
      console.error('Save company_name error:', err);
      setErrorMessage(err.message || 'Failed to update company name. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* View Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          {t.dashboard.settingsView.title}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          {t.dashboard.settingsView.subtitle}
        </p>
      </div>

      {/* Success Notification Banner / Toast */}
      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center gap-3 shadow-xs animate-in fade-in duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div className="flex-1 font-medium">
            {t.dashboard.settingsView.successMsg}
          </div>
        </div>
      )}

      {/* Error Message Banner */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-center gap-3 shadow-xs">
          <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
          <div className="flex-1 font-medium">
            {errorMessage}
          </div>
        </div>
      )}

      {/* Professional Form Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        {/* Card Header */}
        <div className="p-6 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
          <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100/80">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              {t.dashboard.settingsView.companyNameLabel}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {t.dashboard.settingsView.companyNameHint}
            </p>
          </div>
        </div>

        {/* Card Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              {t.dashboard.settingsView.companyNameLabel} <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                disabled={isLoading || isSaving}
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder={isLoading ? 'Loading...' : t.dashboard.settingsView.companyNamePlaceholder}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition disabled:bg-slate-50 disabled:text-slate-400"
                required
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              This name will appear on automated invoice chase emails, payment portals, and customer receipts.
            </p>
          </div>

          {/* Form Actions Footer */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Database className="w-3.5 h-3.5 text-emerald-500" />
              <span>Table: <code className="font-mono text-slate-600">public.profiles</code></span>
            </div>

            <button
              type="submit"
              disabled={isLoading || isSaving}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 text-white text-xs sm:text-sm font-semibold shadow-xs transition shadow-indigo-500/20"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{t.dashboard.settingsView.savingBtn}</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{t.dashboard.settingsView.saveBtn}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
