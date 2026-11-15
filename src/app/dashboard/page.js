'use client';

import React, { useState, useEffect } from 'react';
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
          const { data, error } = await supabase
            .from('invoices')
            .select('*')
            .eq('user_id', user.id) // Filter by authenticated user's ID
            .order('created_at', { ascending: false });

          if (error) {
            console.warn('Fetch invoices error:', error.message);
            toast.error(error.message);
          } else if (data && isMounted) {
            const formatted = data.map((inv) => ({
              id: inv.id,
              client: inv.client_name,
              email: inv.client_email,
              amount: inv.amount,
              status: inv.status,
              dueDate: inv.due_date,
              notes: inv.description,
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
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-indigo-500/25 animate-pulse">
            <Zap className="w-6 h-6 fill-white" />
          </div>
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-600">
            <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
            <span>Checking authentication session...</span>
          </div>
        </div>
      </div>
    );
  }

  // 2. Route Protection: If unauthenticated, do not render dashboard while redirecting
  if (!user && !session) {
    return null;
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
        {/* 1. Top Navbar / Header displaying Google Profile Picture and Name */}
        <header className="h-16 bg-white/85 backdrop-blur-md border-b border-slate-200/90 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900 capitalize">
                {t.dashboard.sidebar.links[currentTab] || currentTab}
              </span>
            </div>
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
