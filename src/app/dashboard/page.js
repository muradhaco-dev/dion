'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import DashboardSidebar from '../../components/DashboardSidebar';
import CreateView from '../../components/dashboard/CreateView';
import AppointmentsView from '../../components/dashboard/AppointmentsView';
import PaymentsView from '../../components/dashboard/PaymentsView';
import SettingsView from '../../components/dashboard/SettingsView';
import { Menu, Zap } from 'lucide-react';

export default function DashboardPage({ defaultTab = 'create' }) {
  const { user, loading } = useAuth();
  const { t, dir } = useLanguage();
  const router = useRouter();

  const [currentTab, setCurrentTab] = useState(defaultTab); // 'create' | 'appointments' | 'payments'
  const [mobileOpen, setMobileOpen] = useState(false);

  // Real data state
  const [invoices, setInvoices] = useState([]);
  const [appointments, setAppointments] = useState([]);

  // Load saved records from localStorage
  useEffect(() => {
    try {
      const savedInvoices = localStorage.getItem('dion_invoices_data');
      if (savedInvoices) {
        setInvoices(JSON.parse(savedInvoices));
      }
      const savedAppointments = localStorage.getItem('dion_appointments_data');
      if (savedAppointments) {
        setAppointments(JSON.parse(savedAppointments));
      }
    } catch (e) {
      console.warn('Error reading from localStorage', e);
    }
  }, []);

  // Save changes
  const handleInvoiceCreated = (newInv) => {
    const updated = [newInv, ...invoices];
    setInvoices(updated);
    try {
      localStorage.setItem('dion_invoices_data', JSON.stringify(updated));
    } catch (e) {}
  };

  const handleAppointmentCreated = (newApt) => {
    const updated = [newApt, ...appointments];
    setAppointments(updated);
    try {
      localStorage.setItem('dion_appointments_data', JSON.stringify(updated));
    } catch (e) {}
  };

  const handleMarkPaid = (invId) => {
    const updated = invoices.map((inv) =>
      inv.id === invId ? { ...inv, status: 'paid' } : inv
    );
    setInvoices(updated);
    try {
      localStorage.setItem('dion_invoices_data', JSON.stringify(updated));
    } catch (e) {}
  };

  const handleToggleAppointmentStatus = (aptId) => {
    const updated = appointments.map((apt) =>
      apt.id === aptId
        ? { ...apt, status: apt.status === 'completed' ? 'upcoming' : 'completed' }
        : apt
    );
    setAppointments(updated);
    try {
      localStorage.setItem('dion_appointments_data', JSON.stringify(updated));
    } catch (e) {}
  };

  // Auth protection guard
  useEffect(() => {
    if (!loading && !user) {
      // Allow viewing or redirect
      // router.push('/login');
    }
  }, [user, loading, router]);

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
        {/* Mobile Header */}
        <div className="lg:hidden h-16 bg-white border-b border-slate-200/90 px-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <Zap className="w-3.5 h-3.5 fill-white" />
              </div>
              <span className="font-bold text-slate-900 text-sm">Dion SaaS</span>
            </div>
          </div>
        </div>

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
