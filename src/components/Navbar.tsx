import React, { useState } from 'react';
import {
  ShieldAlert,
  Wifi,
  WifiOff,
  Bell,
  PhoneCall,
  Menu,
  X,
  Globe,
  ChevronDown,
} from 'lucide-react';
import { ReminderItem } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { AppLogo } from './AppLogo';
import { SupportedLanguage } from '../utils/translations';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOfflineSimulated: boolean;
  setIsOfflineSimulated: (state: boolean) => void;
  isReallyOnline: boolean;
  reminders: ReminderItem[];
  onOpenEmergencyVet: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isOfflineSimulated,
  setIsOfflineSimulated,
  isReallyOnline,
  reminders,
  onOpenEmergencyVet,
}) => {
  const { t, language, setLanguage, languages, currentLanguageInfo } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const pendingRemindersCount = reminders.filter((r) => !r.completed).length;
  const isOperatingOffline = !isReallyOnline || isOfflineSimulated;

  const navItems = [
    { id: 'home', label: t('home', 'Home'), icon: '🏠' },
    { id: 'cows', label: t('cows', 'Cows'), icon: '🐄' },
    { id: 'feed', label: t('feed', 'Feed'), icon: '🌾' },
    { id: 'health', label: t('health', 'Health'), icon: '🤖' },
    { id: 'quality', label: t('quality', 'Quality'), icon: '🔬' },
    { id: 'storage', label: t('storage', 'Storage'), icon: '📦' },
    { id: 'advisory', label: t('advisory', 'Advisory'), icon: '📢' },
    { id: 'vets', label: t('vets', 'Vets'), icon: '🏥' },
    { id: 'labs', label: t('labs', 'Labs'), icon: '🧪' },
    { id: 'marketplace', label: t('marketplace', 'Market'), icon: '🛒' },
    { id: 'offline', label: t('offline', 'Offline'), icon: '📱' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Banner for Offline Mode */}
      {isOperatingOffline && (
        <div className="bg-amber-600 text-amber-50 px-4 py-1.5 text-xs sm:text-sm font-medium flex items-center justify-between transition-all">
          <div className="flex items-center gap-2 mx-auto sm:mx-0">
            <WifiOff className="w-4 h-4 animate-pulse shrink-0" />
            <span>
              {t(
                'offlineModeActive',
                'Rural Offline Mode Active: All cow profiles & feed formulas cached locally.'
              )}
            </span>
          </div>
          <button
            onClick={() => setIsOfflineSimulated(!isOfflineSimulated)}
            className="hidden sm:inline-flex items-center text-xs bg-amber-800 hover:bg-amber-900 text-white px-2.5 py-0.5 rounded-full transition-colors cursor-pointer"
          >
            {isOfflineSimulated ? t('exitSimOffline') : t('simOffline')}
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Official DairyGuard AI Logo (User Request #3) */}
          <div
            onClick={() => {
              setActiveTab('home');
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <AppLogo size="md" className="group-hover:scale-105 transition-transform" />
            <div className="hidden sm:block">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-xl tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
                  {t('appName', 'DairyGuard AI')}
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-md border border-emerald-300">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-bold leading-none">
                {t('appSubtitle', 'Smart Livestock, Feed & Rural Care')}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => {
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-2.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    active
                      ? 'bg-emerald-100/70 text-emerald-950 font-black shadow-xs border border-emerald-300'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-sm">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Language Dropdown */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 flex items-center gap-1.5 cursor-pointer transition-colors"
                title="Change Language"
              >
                <span>{currentLanguageInfo.flag}</span>
                <span className="hidden md:inline font-bold">
                  {currentLanguageInfo.nativeName}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 space-y-1">
                  <div className="px-3 py-1 text-[10px] font-extrabold uppercase text-slate-400 border-b border-slate-100">
                    Select Language / மொழி
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {languages.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => {
                          setLanguage(l.code);
                          setLangDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3.5 py-2 text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                          language === l.code
                            ? 'bg-emerald-50 text-emerald-800'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span>{l.flag}</span>
                          <span>{l.nativeName}</span>
                        </span>
                        {l.compulsory && (
                          <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1 py-0.5 rounded font-black">
                            Primary
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Offline Simulator Switch */}
            <button
              onClick={() => setIsOfflineSimulated(!isOfflineSimulated)}
              title={isOperatingOffline ? t('offlineCached') : t('onlineConnected')}
              className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all border cursor-pointer ${
                isOperatingOffline
                  ? 'bg-amber-50 text-amber-800 border-amber-300'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-300'
              }`}
            >
              {isOperatingOffline ? (
                <>
                  <WifiOff className="w-4 h-4 text-amber-600" />
                  <span className="hidden lg:inline text-[11px] font-bold">{t('offline')}</span>
                </>
              ) : (
                <>
                  <Wifi className="w-4 h-4 text-emerald-600" />
                  <span className="hidden lg:inline text-[11px] font-bold">{t('onlineConnected')}</span>
                </>
              )}
            </button>

            {/* Reminder Bell */}
            <button
              onClick={() => setActiveTab('offline')}
              title={`${pendingRemindersCount} pending reminders`}
              className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              <Bell className="w-5 h-5" />
              {pendingRemindersCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-500 text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
                  {pendingRemindersCount}
                </span>
              )}
            </button>

            {/* Emergency Vet Quick Call */}
            <button
              onClick={onOpenEmergencyVet}
              className="bg-rose-600 hover:bg-rose-700 active:scale-95 text-white px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs sm:text-sm font-black flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <PhoneCall className="w-4 h-4" />
              <span className="hidden sm:inline">{t('emergencyVet', 'Emergency Vet')}</span>
              <span className="sm:hidden">Vet</span>
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 text-slate-700 hover:text-slate-900 rounded-xl hover:bg-slate-100 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1 shadow-lg">
          <div className="grid grid-cols-2 gap-1.5 py-2">
            {navItems.map((item) => {
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`p-2.5 rounded-xl text-left text-xs font-bold flex items-center gap-2 transition-all ${
                    active
                      ? 'bg-emerald-100 text-emerald-950 font-black border border-emerald-300'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>DairyGuard AI • Rural Edition</span>
            <button
              onClick={() => {
                setActiveTab('cows');
                setMobileMenuOpen(false);
              }}
              className="text-emerald-700 font-bold underline cursor-pointer"
            >
              Language: {currentLanguageInfo.nativeName}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
