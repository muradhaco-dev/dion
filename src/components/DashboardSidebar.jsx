'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import LanguageDropdown from './LanguageDropdown';
import { 
  PlusCircle, 
  Calendar, 
  CreditCard, 
  Users, 
  LogOut, 
  Zap, 
  User, 
  Menu, 
  X,
  ExternalLink,
  Settings
} from 'lucide-react';

export default function DashboardSidebar({ 
  currentTab, 
  setCurrentTab, 
  mobileOpen, 
  setMobileOpen 
}) {
  const { t } = useLanguage();
  const { user, logout, switchAccount } = useAuth();

  const links = [
    {
      id: 'create',
      label: t.dashboard.sidebar.links.create,
      icon: PlusCircle,
    },
    {
      id: 'appointments',
      label: t.dashboard.sidebar.links.appointments,
      icon: Calendar,
    },
    {
      id: 'payments',
      label: t.dashboard.sidebar.links.payments,
      icon: CreditCard,
    },
    {
      id: 'settings',
      label: t.dashboard.sidebar.links.settings,
      icon: Settings,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Persistent Left Sidebar Navigation */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-slate-200/90 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top: Brand Header & Navigation Links */}
        <div>
          {/* Brand */}
          <div className="h-16 px-6 border-b border-slate-100 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs">
                <Zap className="w-4 h-4 fill-white" />
              </div>
              <div>
                <span className="font-bold text-slate-900 text-sm tracking-tight block">
                  {t.dashboard.sidebar.brand}
                </span>
                <span className="text-[10px] text-slate-400 block -mt-0.5">
                  {t.dashboard.sidebar.subtitle}
                </span>
              </div>
            </Link>

            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links: Create, My Appointments, Payments */}
          <nav className="p-3 space-y-1">
            <div className="px-3 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Menu
            </div>
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = currentTab === link.id;

              return (
                <button
                  key={link.id}
                  onClick={() => {
                    setCurrentTab(link.id);
                    setMobileOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Area: User Info + Switch Account + Logout Buttons */}
        <div className="p-3 border-t border-slate-100 space-y-2">
          {/* User profile strip */}
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0">
              {user?.email ? user.email.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-800 truncate">
                {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
              </p>
              <p className="text-[10px] text-slate-400 truncate">
                {user?.email || 'Authenticated User'}
              </p>
            </div>
          </div>

          {/* Switch Account Button (تبديل الحساب) */}
          <button
            onClick={switchAccount}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
          >
            <Users className="w-4 h-4 text-slate-400" />
            <span>{t.dashboard.sidebar.bottom.switchAccount}</span>
          </button>

          {/* Logout Button (تسجيل الخروج) */}
          <button
            onClick={logout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition"
          >
            <LogOut className="w-4 h-4 text-rose-500" />
            <span>{t.dashboard.sidebar.bottom.logout}</span>
          </button>

          {/* Language Switcher Dropdown */}
          <div className="pt-2 border-t border-slate-100 flex justify-center">
            <LanguageDropdown />
          </div>
        </div>
      </aside>
    </>
  );
}
