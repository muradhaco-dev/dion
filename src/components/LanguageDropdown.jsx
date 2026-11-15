'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Globe, ChevronDown, Check } from 'lucide-react';

export default function LanguageDropdown({ theme = 'light' }) {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const isDark = theme === 'dark';

  const languages = [
    { code: 'ar', label: 'العربية', flag: '🇸🇦', dir: 'rtl' },
    { code: 'tr', label: 'Türkçe', flag: '🇹🇷', dir: 'ltr' },
    { code: 'en', label: 'English', flag: '🇺🇸', dir: 'ltr' },
  ];

  const currentLang = languages.find((l) => l.code === language) || languages[0];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium shadow-xs transition focus:outline-none ${
          isDark 
            ? 'border border-slate-700/80 bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 hover:text-white' 
            : 'border border-slate-200/90 bg-white/90 hover:bg-slate-50 text-slate-700 hover:border-slate-300'
        }`}
        aria-expanded={isOpen}
      >
        <span className="text-base leading-none">{currentLang.flag}</span>
        <span className="font-medium">{currentLang.label}</span>
        <ChevronDown className={`w-3.5 h-3.5 ${isDark ? 'text-slate-400' : 'text-slate-400'} transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className={`absolute right-0 mt-2 w-44 rounded-xl shadow-2xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100 ${
          isDark
            ? 'bg-slate-900 border border-slate-700/90 text-slate-200'
            : 'bg-white border border-slate-200/90 text-slate-700'
        }`}>
          <div className={`px-3 py-1 text-[10px] font-semibold tracking-wider uppercase ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>
            Language / اللغة
          </div>
          {languages.map((item) => {
            const isSelected = item.code === language;
            return (
              <button
                key={item.code}
                onClick={() => {
                  setLanguage(item.code);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2 text-xs sm:text-sm text-left transition ${
                  isSelected
                    ? isDark 
                      ? 'bg-cyan-500/15 text-cyan-400 font-semibold' 
                      : 'bg-indigo-50/80 text-indigo-700 font-semibold'
                    : isDark 
                      ? 'text-slate-300 hover:bg-slate-800/80' 
                      : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base leading-none">{item.flag}</span>
                  <span>{item.label}</span>
                </div>
                {isSelected && <Check className={`w-4 h-4 ${isDark ? 'text-cyan-400' : 'text-indigo-600'}`} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
