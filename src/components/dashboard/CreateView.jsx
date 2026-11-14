'use client';

import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  FileText, 
  Calendar, 
  DollarSign, 
  Mail, 
  User, 
  Clock, 
  Sparkles, 
  CheckCircle2,
  Tag
} from 'lucide-react';

export default function CreateView({ onInvoiceCreated, onAppointmentCreated }) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('invoice'); // 'invoice' | 'appointment'

  // Invoice form state
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [invoiceSuccess, setInvoiceSuccess] = useState(false);

  // Appointment form state
  const [appointmentTitle, setAppointmentTitle] = useState('');
  const [appointmentClient, setAppointmentClient] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentType, setAppointmentType] = useState('phone');
  const [appointmentNotes, setAppointmentNotes] = useState('');
  const [appointmentSuccess, setAppointmentSuccess] = useState(false);

  const handleInvoiceSubmit = (e) => {
    e.preventDefault();
    if (!clientName || !clientEmail || !amount || !dueDate) return;

    const newInvoice = {
      id: `INV-${Date.now().toString().slice(-4)}`,
      client: clientName.trim(),
      email: clientEmail.trim(),
      amount: parseFloat(amount),
      status: 'pending',
      dueDate,
      notes: notes.trim(),
      created_at: new Date().toISOString(),
    };

    onInvoiceCreated(newInvoice);
    setInvoiceSuccess(true);
    setClientName('');
    setClientEmail('');
    setAmount('');
    setDueDate('');
    setNotes('');

    setTimeout(() => setInvoiceSuccess(false), 3000);
  };

  const handleAppointmentSubmit = (e) => {
    e.preventDefault();
    if (!appointmentTitle || !appointmentClient || !appointmentDate) return;

    const newAppointment = {
      id: `APT-${Date.now().toString().slice(-4)}`,
      title: appointmentTitle.trim(),
      client: appointmentClient.trim(),
      date: appointmentDate,
      type: appointmentType,
      notes: appointmentNotes.trim(),
      status: 'upcoming',
      created_at: new Date().toISOString(),
    };

    onAppointmentCreated(newAppointment);
    setAppointmentSuccess(true);
    setAppointmentTitle('');
    setAppointmentClient('');
    setAppointmentDate('');
    setAppointmentNotes('');

    setTimeout(() => setAppointmentSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* View Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          {t.dashboard.createView.title}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          {t.dashboard.createView.subtitle}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('invoice')}
          className={`flex items-center gap-2 pb-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition ${
            activeTab === 'invoice'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>{t.dashboard.createView.tabs.invoice}</span>
        </button>

        <button
          onClick={() => setActiveTab('appointment')}
          className={`flex items-center gap-2 pb-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition ${
            activeTab === 'appointment'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>{t.dashboard.createView.tabs.appointment}</span>
        </button>
      </div>

      {/* Tab 1: Create Invoice Form */}
      {activeTab === 'invoice' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-7 shadow-xs">
          {invoiceSuccess && (
            <div className="mb-5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Record saved successfully and enrolled in automated chaser!</span>
            </div>
          )}

          <form onSubmit={handleInvoiceSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {t.dashboard.createView.form.clientName}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Acme Corporation"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {t.dashboard.createView.form.clientEmail}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="finance@acme.com"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {t.dashboard.createView.form.amount}
                </label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="2500.00"
                    className="w-full pl-9 pr-3 py-2 text-sm font-mono bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {t.dashboard.createView.form.dueDate}
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {t.dashboard.createView.form.notes}
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Contract services and deliverable breakdown..."
                className="w-full p-3 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-xs transition shadow-indigo-500/20"
              >
                {t.dashboard.createView.form.submitBtn}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 2: Create Appointment Form */}
      {activeTab === 'appointment' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-7 shadow-xs">
          {appointmentSuccess && (
            <div className="mb-5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Appointment successfully scheduled!</span>
            </div>
          )}

          <form onSubmit={handleAppointmentSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {t.dashboard.createView.form.appointmentTitle}
                </label>
                <input
                  type="text"
                  value={appointmentTitle}
                  onChange={(e) => setAppointmentTitle(e.target.value)}
                  placeholder="Q4 Payment Reconciliation Call"
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {t.dashboard.createView.form.clientName}
                </label>
                <input
                  type="text"
                  value={appointmentClient}
                  onChange={(e) => setAppointmentClient(e.target.value)}
                  placeholder="Apex Capital"
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {t.dashboard.createView.form.appointmentDate}
                </label>
                <input
                  type="datetime-local"
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {t.dashboard.createView.form.appointmentType}
                </label>
                <select
                  value={appointmentType}
                  onChange={(e) => setAppointmentType(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                >
                  <option value="phone">Phone Call (مكالمة هاتفية)</option>
                  <option value="meeting">Video / In-Person Meeting (اجتماع)</option>
                  <option value="review">Financial Audit Review (مراجعة حسابية)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {t.dashboard.createView.form.notes}
              </label>
              <textarea
                rows={2}
                value={appointmentNotes}
                onChange={(e) => setAppointmentNotes(e.target.value)}
                placeholder="Meeting agenda and discussion topics..."
                className="w-full p-3 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-xs transition shadow-indigo-500/20"
              >
                {t.dashboard.createView.form.submitAppointmentBtn}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
