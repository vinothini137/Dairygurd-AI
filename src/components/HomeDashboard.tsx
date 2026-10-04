import React from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  HeartPulse,
  Scale,
  Wheat,
  Activity,
  PhoneCall,
  CheckCircle2,
  Calendar,
  Layers,
  ShoppingBag,
  WifiOff,
  Users,
} from 'lucide-react';
import { CowProfile, ReminderItem } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { AppLogo } from './AppLogo';

interface HomeDashboardProps {
  cows: CowProfile[];
  reminders: ReminderItem[];
  setActiveTab: (tab: string) => void;
  onSelectCowForFeed?: (cow: CowProfile) => void;
  isOperatingOffline: boolean;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  cows,
  reminders,
  setActiveTab,
  onSelectCowForFeed,
  isOperatingOffline,
}) => {
  const { t } = useLanguage();

  const milkingCows = cows.filter(
    (c) =>
      c.lactationStage === 'Early Lactation' ||
      c.lactationStage === 'Peak Lactation' ||
      c.lactationStage === 'Mid Lactation' ||
      c.lactationStage === 'Late Lactation'
  );

  const totalDailyYield = cows.reduce((acc, c) => acc + (c.dailyYieldLiters || 0), 0);
  const avgFat =
    milkingCows.length > 0
      ? (
          milkingCows.reduce((acc, c) => acc + (c.fatPercentage || 4.2), 0) / milkingCows.length
        ).toFixed(1)
      : '4.5';

  const pendingReminders = reminders.filter((r) => !r.completed);

  const mainFeatures = [
    {
      id: 'cows',
      title: t('cows', 'Cow Profiles'),
      subtitle: `${cows.length} Registered Digital Profiles`,
      description: 'Create & maintain individual digital profiles for each cow with breed, age, lactation status, and health records.',
      icon: '🐄',
      badge: 'Multi-Cow Hub',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      actionText: t('manageHerd', 'Manage Herd'),
      gradient: 'from-emerald-50 to-teal-50/40 hover:border-emerald-300',
    },
    {
      id: 'feed',
      title: t('feed', 'Feed Guidance'),
      subtitle: 'ICAR Balanced Ration Guidance',
      description: 'Calculate tailored green fodder, dry straw, concentrate, and mineral mixture by breed & milk yield.',
      icon: '🌾',
      badge: 'Smart Nutrition',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
      actionText: t('calculateFeed', 'Calculate Feed'),
      gradient: 'from-amber-50 to-orange-50/40 hover:border-amber-300',
    },
    {
      id: 'health',
      title: t('health', 'AI Health'),
      subtitle: 'Multimodal Photo Screening',
      description: 'Upload or snap a photo for visual screening of mastitis, skin nodules, hoof rot, and bloat.',
      icon: '🤖',
      badge: 'Visual AI',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
      actionText: t('scanHealth', 'Scan Cow Health'),
      gradient: 'from-blue-50 to-indigo-50/40 hover:border-blue-300',
    },
    {
      id: 'quality',
      title: t('quality', 'Feed Quality'),
      subtitle: 'Quality & Contamination Warning',
      description: 'Evaluate moisture, smell, color, and pH to screen for dangerous mold, aflatoxins, and clostridia.',
      icon: '🔬',
      badge: 'Safety Alert',
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
      actionText: t('checkQuality', 'Check Quality'),
      gradient: 'from-rose-50 to-orange-50/40 hover:border-rose-300',
    },
    {
      id: 'storage',
      title: t('storage', 'Silage Monitor'),
      subtitle: 'Pit & Bunker Management',
      description: 'Monitor storage condition, squeeze moisture test, and calculate aerobic spoilage risks.',
      icon: '📦',
      badge: 'Bunker Care',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
      actionText: t('monitorStorage', 'Monitor Storage'),
      gradient: 'from-purple-50 to-pink-50/40 hover:border-purple-300',
    },
    {
      id: 'vets',
      title: t('vets', 'Veterinary'),
      subtitle: 'Verified Doctors Directory',
      description: 'Connect with local livestock veterinarians, emergency mobile vans, and bovine surgeons.',
      icon: '🏥',
      badge: '24/7 Support',
      badgeColor: 'bg-red-100 text-red-800 border-red-300',
      actionText: t('findDoctors', 'Find Doctors'),
      gradient: 'from-red-50 to-rose-50/40 hover:border-red-300',
    },
    {
      id: 'labs',
      title: t('labs', 'Laboratories'),
      subtitle: 'Testing & Diagnostics',
      description: 'Send samples to accredited labs for aflatoxins, milk adulteration, and proximate feed analysis.',
      icon: '🧪',
      badge: 'Certified Labs',
      badgeColor: 'bg-cyan-100 text-cyan-800 border-cyan-300',
      actionText: t('viewLabs', 'View Labs'),
      gradient: 'from-cyan-50 to-sky-50/40 hover:border-cyan-300',
    },
    {
      id: 'marketplace',
      title: t('marketplace', 'Marketplace'),
      subtitle: 'Milk, Cattle, Feed & Products',
      description: 'Direct farmer-to-farmer digital marketplace to buy & sell fresh milk, cattle, silage, and ghee.',
      icon: '🛒',
      badge: 'Buy & Sell',
      badgeColor: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      actionText: t('openMarket', 'Open Market'),
      gradient: 'from-yellow-50 to-amber-50/40 hover:border-yellow-300',
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Welcome Banner with Official App Logo */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white shadow-xl">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="relative z-10 px-6 py-8 sm:px-10 sm:py-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-4">
            <div className="flex items-center gap-4">
              {/* Official Uploaded Logo displayed prominently */}
              <AppLogo size="xl" className="shrink-0 drop-shadow-md" />
              <div>
                <div className="inline-flex items-center gap-2 bg-emerald-700/60 border border-emerald-500/40 px-3 py-1 rounded-full text-xs font-semibold text-emerald-200">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                  <span>{t('appName')} • {t('officialCompanion')}</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight mt-1.5 text-white">
                  {t('heroTitle')}
                </h1>
              </div>
            </div>
            
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              {t('heroDesc')}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setActiveTab('health')}
                className="bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-black px-4 py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>🤖 {t('scanHealth')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveTab('feed')}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>🌾 {t('calculateFeed')}</span>
              </button>

              <button
                onClick={() => setActiveTab('cows')}
                className="bg-teal-500/20 hover:bg-teal-500/30 text-teal-200 border border-teal-400/30 font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer"
              >
                <Users className="w-4 h-4" />
                <span>{cows.length} {t('cows')}</span>
              </button>
            </div>
          </div>

          {/* Quick Status / Offline Pill */}
          <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-5 w-full md:w-72 shrink-0 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                {t('networkStatus')}
              </span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-bold flex items-center gap-1 ${
                  isOperatingOffline
                    ? 'bg-amber-500/30 text-amber-200 border border-amber-400/40'
                    : 'bg-emerald-500/30 text-emerald-200 border border-emerald-400/40'
                }`}
              >
                {isOperatingOffline ? (
                  <>
                    <WifiOff className="w-3 h-3" /> {t('offlineCached')}
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3 h-3" /> {t('onlineConnected')}
                  </>
                )}
              </span>
            </div>

            <div className="border-t border-white/10 pt-3 space-y-1.5 text-xs text-emerald-100">
              <div className="flex justify-between">
                <span>{t('totalCattle')}:</span>
                <strong className="text-white">{cows.length} {t('cows')}</strong>
              </div>
              <div className="flex justify-between">
                <span>{t('dailyMilkYield')}:</span>
                <strong className="text-white">{totalDailyYield.toFixed(1)} {t('litersPerDay')}</strong>
              </div>
              <div className="flex justify-between">
                <span>{t('activeAlerts')}:</span>
                <strong className="text-amber-300">{pendingReminders.length} {t('pendingTasks')}</strong>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('offline')}
              className="w-full text-center text-xs font-bold text-emerald-200 hover:text-white bg-emerald-900/60 hover:bg-emerald-900/90 py-2 rounded-xl transition-colors block cursor-pointer"
            >
              {t('openOfflineHub')} →
            </button>
          </div>
        </div>
      </div>

      {/* Farm Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>{t('totalCattle')}</span>
            <span className="text-base">🐄</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">{cows.length}</span>
            <span className="text-xs text-slate-500">
              ({milkingCows.length} {t('inMilk')})
            </span>
          </div>
          <p className="mt-1 text-[11px] text-emerald-700 font-semibold">
            {cows.length - milkingCows.length} {t('dryOrCalves')}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>{t('dailyMilkYield')}</span>
            <span className="text-base">🥛</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {totalDailyYield.toFixed(1)}
            </span>
            <span className="text-xs text-slate-500">{t('litersPerDay')}</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-600 font-medium">
            {t('avgFat')}: <span className="font-bold text-amber-700">{avgFat}%</span>
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>{t('estimatedFeed')}</span>
            <span className="text-base">🌾</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {(cows.length * 12.5).toFixed(0)}
            </span>
            <span className="text-xs text-slate-500">{t('dryMatterPerDay')}</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-600 font-medium">
            ~{(cows.length * 25).toFixed(0)} {t('greenFodderNeed')}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>{t('activeAlerts')}</span>
            <span className="text-base">🚨</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-600">
              {pendingReminders.length}
            </span>
            <span className="text-xs text-slate-500">{t('pendingTasks')}</span>
          </div>
          <button
            onClick={() => setActiveTab('offline')}
            className="mt-1 text-[11px] text-rose-600 hover:underline font-bold text-left block cursor-pointer"
          >
            {t('reviewReminders')} →
          </button>
        </div>
      </div>

      {/* Main Feature Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              {t('mainSections')}
            </h2>
            <p className="text-xs text-slate-500">
              {t('mainSectionsDesc')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {mainFeatures.map((feat) => (
            <div
              key={feat.id}
              onClick={() => setActiveTab(feat.id)}
              className={`border border-slate-200 rounded-2xl p-5 shadow-xs bg-gradient-to-br ${feat.gradient} transition-all duration-200 hover:shadow-md cursor-pointer flex flex-col justify-between group`}
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-white shadow-xs border border-slate-100 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    {feat.icon}
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${feat.badgeColor}`}
                  >
                    {feat.badge}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-base group-hover:text-emerald-800 transition-colors">
                  {feat.title}
                </h3>
                <p className="text-xs font-semibold text-slate-600 mt-0.5">{feat.subtitle}</p>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  {feat.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs font-bold text-emerald-800">
                <span>{feat.actionText}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Your Cows Quick List with Multi-Cow labels */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base">{t('yourRegisteredCows')} ({cows.length})</h3>
            <p className="text-xs text-slate-500">
              {t('manageHerdDesc')}
            </p>
          </div>
          <button
            onClick={() => setActiveTab('cows')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
          >
            <span>{t('manageHerd')} ({cows.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {cows.slice(0, 3).map((cow, i) => (
            <div
              key={cow.id}
              className="border border-slate-200 hover:border-emerald-300 rounded-xl p-3.5 bg-slate-50/50 hover:bg-emerald-50/30 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded">
                      #{i + 1}
                    </span>
                    <span className="font-extrabold text-sm text-slate-900">{cow.name}</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                    {cow.lactationStage}
                  </span>
                </div>
                <div className="text-xs text-slate-600 mt-1">
                  {t('tagNumber')}: <span className="font-mono font-semibold">{cow.tagNumber}</span> • {cow.breed}
                </div>
                <div className="mt-2 text-xs flex items-center gap-3 text-slate-500">
                  <span>{t('weight')}: <strong>{cow.weightKg} kg</strong></span>
                  <span>{t('yieldPerDay')}: <strong>{cow.dailyYieldLiters} L</strong></span>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-200 flex items-center gap-2">
                <button
                  onClick={() => {
                    if (onSelectCowForFeed) onSelectCowForFeed(cow);
                    setActiveTab('feed');
                  }}
                  className="flex-1 bg-white hover:bg-emerald-600 hover:text-white border border-slate-200 text-slate-700 text-[11px] font-bold py-1.5 rounded-lg transition-colors cursor-pointer text-center"
                >
                  🌾 {t('feedRation')}
                </button>
                <button
                  onClick={() => setActiveTab('health')}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold py-1.5 rounded-lg transition-colors cursor-pointer text-center"
                >
                  🤖 {t('healthCheck')}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
