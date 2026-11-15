'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import DashboardSidebar from '../../components/DashboardSidebar';
import CreateView from '../../components/dashboard/CreateView';
import AppointmentsView from '../../components/dashboard/AppointmentsView';
import PaymentsView from '../../components/dashboard/PaymentsView';
import SettingsView from '../../components/dashboard/SettingsView';
import toast from 'react-hot-toast';
import { Menu, Zap, User, Loader2 } from 'lucide-react';

export default function DashboardPage({ defaultTab = 'create' }) {
  const { user, session, loading, avatarUrl, displayName } = useAuth();
  const { t, dir } = useLanguage();
  const router = useRouter();

  const [currentTab, setCurrentTab] = useState(defaultTab);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Invoices & Appointments state
  const [invoices, setInvoices] = useState([]);
  const [appointments, setAppointments] = useState([]);

  // 2. Route Protection: Immediately redirect to /login if no active session exists
  useEffect(() => {
    if (!loading && !user && !session) {
      router.replace('/login');
    }
  }, [user, session, loading, router]);

  // Load invoices from Supabase for current authenticated user
  useEffect(() => {
    let isMounted = true;

    async function fetchUserInvoices() {
      if (!user?.id) return;

      if (isSupabaseConfigured) {
        try {
          let { data, error } = await supabase
            .from('invoices')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          // If user_id column doesn't exist yet, gracefully fallback
          if (error && error.message?.includes('user_id')) {
            const fallback = await supabase
              .from('invoices')
              .select('*')
              .order('created_at', { ascending: false });
            data = fallback.data;
            error = fallback.error;
          }

          if (data && isMounted) {
            const formatted = data.map((inv) => ({
              id: inv.id || inv.invoice_number,
              client: inv.client_name || inv.client || 'Client',
              email: inv.client_email || inv.email || '—',
              amount: inv.amount,
              status: inv.status || 'pending',
              dueDate: inv.due_date || inv.dueDate,
              notes: inv.description || inv.notes,
              created_at: inv.created_at,
            }));
            setInvoices(formatted);
            return;
          }
        } catch (err) {
          console.error('Invoice fetch error:', err);
        }
      }

      // Fallback local storage
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem(`dion_invoices_${user.id}`);
        if (saved && isMounted) {
          setInvoices(JSON.parse(saved));
        }
      }
    }

    if (user?.id) {
      fetchUserInvoices();
    }

    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  // Handle invoice created in UI
  const handleInvoiceCreated = (newInv) => {
    const updated = [newInv, ...invoices];
    setInvoices(updated);
    if (typeof window !== 'undefined' && user?.id) {
      localStorage.setItem(`dion_invoices_${user.id}`, JSON.stringify(updated));
    }
  };

  const handleAppointmentCreated = (newApt) => {
    const updated = [newApt, ...appointments];
    setAppointments(updated);
    if (typeof window !== 'undefined' && user?.id) {
      localStorage.setItem(`dion_appointments_${user.id}`, JSON.stringify(updated));
    }
  };

  const handleMarkPaid = async (invId) => {
    try {
      if (isSupabaseConfigured && user?.id) {
        const { error } = await supabase
          .from('invoices')
          .update({ status: 'paid' })
          .eq('id', invId)
          .eq('user_id', user.id);

        if (error) {
          toast.error(error.message);
          return;
        }
      }

      const updated = invoices.map((inv) =>
        inv.id === invId ? { ...inv, status: 'paid' } : inv
      );
      setInvoices(updated);
      toast.success('Invoice marked as Paid!');
      if (typeof window !== 'undefined' && user?.id) {
        localStorage.setItem(`dion_invoices_${user.id}`, JSON.stringify(updated));
      }
    } catch (err) {
      toast.error('Failed to update invoice status');
    }
  };

  const handleToggleAppointmentStatus = (aptId) => {
    const updated = appointments.map((apt) =>
      apt.id === aptId
        ? { ...apt, status: apt.status === 'completed' ? 'upcoming' : 'completed' }
        : apt
    );
    setAppointments(updated);
    if (typeof window !== 'undefined' && user?.id) {
      localStorage.setItem(`dion_appointments_${user.id}`, JSON.stringify(updated));
    }
  };

  // 1. Loading screen while checking authentication session
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans" dir={dir}>
        <div className="text-center space-y-4 max-w-sm px-4">
          <Link href="/" className="inline-block transition-transform hover:opacity-95">
            <Image
              src="/logo.jpg"
              alt="ChaserFlow Logo"
              width={200}
              height={60}
              priority
              className="h-10 w-auto object-contain rounded-xl mx-auto shadow-md"
            />
          </Link>
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-700">
            <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
            <span>Connecting your account...</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Please wait a moment while we verify your session.
          </p>
        </div>
      </div>
    );
  }

  // 2. Route Protection: If unauthenticated, redirect to login
  if (!user && !session) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans" dir={dir}>
        <div className="text-center space-y-3 max-w-sm px-4">
          <p className="text-xs text-slate-500">No active session found. Redirecting to login...</p>
          <a
            href="/login"
            className="inline-block px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold shadow-xs"
          >
            Sign In Now
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans" dir={dir}>
      {/* 1. Persistent Left Sidebar Navigation */}
      <DashboardSidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* 2. Main Content Canvas */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* 1. Top Navbar / Header displaying ChaserFlow Logo & Google Profile Picture */}
        <header className="h-16 bg-white/85 backdrop-blur-md border-b border-slate-200/90 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <Link href="/" className="flex items-center transition-transform hover:opacity-95">
              <Image
                src="/logo.jpg"
                alt="ChaserFlow Logo"
                width={180}
                height={50}
                priority
                className="h-7 sm:h-8 w-auto object-contain rounded-md"
              />
            </Link>
            <span className="text-slate-300 hidden sm:inline">/</span>
            <span className="text-xs sm:text-sm font-semibold text-slate-700 capitalize hidden sm:inline">
              {t.dashboard.sidebar.links[currentTab] || currentTab}
            </span>
          </div>

          {/* User profile with Google avatar and name in Navbar/Header */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={displayName}
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-full object-cover border border-slate-200 shadow-xs"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center border border-indigo-200">
                  {displayName ? displayName.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                </div>
              )}
              <div className="hidden sm:block text-left">
                <span className="block text-xs font-semibold text-slate-900 leading-tight">
                  {displayName}
                </span>
                <span className="block text-[10px] text-slate-400 font-mono leading-tight">
                  {user?.email}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Canvas View */}
        <main className="p-4 sm:p-8 flex-1 max-w-7xl w-full">
          {currentTab === 'create' && (
            <CreateView
              onInvoiceCreated={handleInvoiceCreated}
              onAppointmentCreated={handleAppointmentCreated}
            />
          )}

          {currentTab === 'appointments' && (
            <AppointmentsView
              appointments={appointments}
              onNavigateToCreate={() => setCurrentTab('create')}
              onToggleStatus={handleToggleAppointmentStatus}
            />
          )}

          {currentTab === 'payments' && (
            <PaymentsView
              invoices={invoices}
              onMarkPaid={handleMarkPaid}
              onNavigateToCreate={() => setCurrentTab('create')}
            />
          )}

          {currentTab === 'settings' && (
            <SettingsView />
          )}
        </main>
      </div>
    </div>
  );
}
