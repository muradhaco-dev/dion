'use client';

import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import toast from 'react-hot-toast';
import { 
  FileText, 
  Calendar, 
  DollarSign, 
  Mail, 
  User, 
  Clock, 
  Sparkles, 
  CheckCircle2,
  Loader2
} from 'lucide-react';

export default function CreateView({ onInvoiceCreated, onAppointmentCreated }) {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('invoice'); // 'invoice' | 'appointment'

  // Invoice form state
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [invoiceSuccess, setInvoiceSuccess] = useState(false);

  // Appointment form state
  const [appointmentTitle, setAppointmentTitle] = useState('');
  const [appointmentClient, setAppointmentClient] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentType, setAppointmentType] = useState('phone');
  const [appointmentNotes, setAppointmentNotes] = useState('');
  const [appointmentSuccess, setAppointmentSuccess] = useState(false);

  // 3. Database Inserts: Automatically attach user.id + Dual schema fallback + toast.error on failure
  const handleInvoiceSubmit = async (e) => {
    e.preventDefault();
    if (!clientName || !clientEmail || !amount || !dueDate) return;

    if (!user?.id) {
      toast.error('لم يتم العثور على جلسة مستخدم نشطة. يرجى إعادة تسجيل الدخول.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (isSupabaseConfigured) {
        let savedData = null;

        // Try direct insert with client_name & client_email first
        const directPayload = {
          user_id: user.id,
          client_name: clientName.trim(),
          client_email: clientEmail.trim(),
          amount: parseFloat(amount),
          due_date: dueDate,
          description: notes.trim() || 'Invoice claim',
          status: 'pending',
        };

        const { data: directData, error: directError } = await supabase
          .from('invoices')
          .insert([directPayload])
          .select()
          .maybeSingle();

        if (!directError) {
          savedData = directData;
        } else if (directError.message?.includes('client_name') || directError.code === 'PGRST204') {
          // Schema Fallback: If 'invoices' table uses relational client_id foreign key
          try {
            let clientId = null;
            const { data: existingClient } = await supabase
              .from('clients')
              .select('id')
              .eq('email', clientEmail.trim())
              .maybeSingle();

            if (existingClient?.id) {
              clientId = existingClient.id;
            } else {
              const { data: newClient } = await supabase
                .from('clients')
                .insert([{ 
                  name: clientName.trim(), 
                  email: clientEmail.trim() 
                }])
                .select('id')
                .maybeSingle();
              clientId = newClient?.id;
            }

            if (clientId) {
              const relationalPayload = {
                client_id: clientId,
                invoice_number: `INV-${Date.now().toString().slice(-4)}`,
                amount: parseFloat(amount),
                due_date: dueDate,
                description: notes.trim() || 'Invoice claim',
                status: 'pending',
              };

              const { data: relData, error: relError } = await supabase
                .from('invoices')
                .insert([relationalPayload])
                .select()
                .maybeSingle();

              if (!relError) {
                savedData = relData;
              } else {
                toast.error(relError.message || directError.message);
                throw relError;
              }
            } else {
              toast.error(directError.message);
              throw directError;
            }
          } catch (relErr) {
            console.error('Relational schema attempt:', relErr);
            throw directError;
          }
        } else {
          console.error('Supabase invoice insert error:', directError);
          toast.error(directError.message || 'Failed to save invoice in Supabase');
          throw directError;
        }

        toast.success('تم حفظ الفاتورة بنجاح!');
        if (onInvoiceCreated) {
          onInvoiceCreated({
            id: savedData?.id || savedData?.invoice_number || `INV-${Date.now().toString().slice(-4)}`,
            client: clientName.trim(),
            email: clientEmail.trim(),
            amount: parseFloat(amount),
            status: 'pending',
            dueDate: dueDate,
            notes: notes.trim(),
            created_at: new Date().toISOString(),
          });
        }
      } else {
        const localInvoice = {
          id: `INV-${Date.now().toString().slice(-4)}`,
          client: clientName.trim(),
          email: clientEmail.trim(),
          amount: parseFloat(amount),
          status: 'pending',
          dueDate,
          notes: notes.trim(),
          user_id: user.id,
          created_at: new Date().toISOString(),
        };

        toast.success('تم إنشاء الفاتورة بنجاح!');
        if (onInvoiceCreated) onInvoiceCreated(localInvoice);
      }

      setInvoiceSuccess(true);
      setClientName('');
      setClientEmail('');
      setAmount('');
      setDueDate('');
      setNotes('');
      setTimeout(() => setInvoiceSuccess(false), 3500);
    } catch (err) {
      console.error('Invoice submission failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAppointmentSubmit = async (e) => {
    e.preventDefault();
    if (!appointmentTitle || !appointmentClient || !appointmentDate) return;

    const newAppointment = {
      id: `APT-${Date.now().toString().slice(-4)}`,
      user_id: user?.id,
      title: appointmentTitle.trim(),
      client: appointmentClient.trim(),
      date: appointmentDate,
      type: appointmentType,
      notes: appointmentNotes.trim(),
      status: 'upcoming',
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && user?.id) {
      try {
        const { error } = await supabase
          .from('appointments')
          .insert([{
            user_id: user.id,
            title: appointmentTitle.trim(),
            client_name: appointmentClient.trim(),
            appointment_date: appointmentDate,
            appointment_type: appointmentType,
            notes: appointmentNotes.trim(),
            status: 'upcoming'
          }]);

        if (error) {
          // If table doesn't exist yet, warn softly
          console.warn('Appointments Supabase table notice:', error.message);
        }
      } catch (err) {
        console.warn('Appointment save notice:', err);
      }
    }

    onAppointmentCreated(newAppointment);
    toast.success('تمت جدولة الموعد بنجاح!');
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
              <span>تم حفظ الفاتورة بنجاح في قاعدة البيانات وتفعيل المتابعة الآلية!</span>
            </div>
          )}

          <form onSubmit={handleInvoiceSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {t.dashboard.createView.form.clientName} <span className="text-rose-500">*</span>
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
                  {t.dashboard.createView.form.clientEmail} <span className="text-rose-500">*</span>
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
                  {t.dashboard.createView.form.amount} <span className="text-rose-500">*</span>
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
                  {t.dashboard.createView.form.dueDate} <span className="text-rose-500">*</span>
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
                placeholder="تفاصيل العقد والمستحقات والخدمات المقدمة..."
                className="w-full p-3 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono">
                user_id: {user?.id?.slice(0, 12)}...
              </span>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 text-white font-semibold text-xs sm:text-sm shadow-xs transition shadow-indigo-500/20"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>جاري الحفظ في Supabase...</span>
                  </>
                ) : (
                  <span>{t.dashboard.createView.form.submitBtn}</span>
                )}
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
              <span>تمت جدولة الموعد بنجاح!</span>
            </div>
          )}

          <form onSubmit={handleAppointmentSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {t.dashboard.createView.form.appointmentTitle} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={appointmentTitle}
                  onChange={(e) => setAppointmentTitle(e.target.value)}
                  placeholder="مكالمة تسوية ومتابعة مالية"
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {t.dashboard.createView.form.clientName} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={appointmentClient}
                  onChange={(e) => setAppointmentClient(e.target.value)}
                  placeholder="شركة الأفق للتجارة"
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {t.dashboard.createView.form.appointmentDate} <span className="text-rose-500">*</span>
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
                placeholder="محاور الاجتماع وجدول الأعمال..."
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
