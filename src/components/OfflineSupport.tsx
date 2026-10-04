import React, { useState } from 'react';
import {
  Wifi,
  WifiOff,
  Database,
  Download,
  Upload,
  Bell,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Trash2,
  BookOpen,
  Calendar,
  Sparkles,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { CowProfile, ReminderItem } from '../types';
import { OFFLINE_FIRST_AID_GUIDES } from '../data/mockData';
import { exportFarmDataJson, importFarmDataJson } from '../utils/storage';

interface OfflineSupportProps {
  cows: CowProfile[];
  reminders: ReminderItem[];
  isOfflineSimulated: boolean;
  setIsOfflineSimulated: (state: boolean) => void;
  isReallyOnline: boolean;
  onSaveReminder: (item: ReminderItem) => void;
  onToggleReminder: (id: string) => void;
  onDeleteReminder: (id: string) => void;
  onNavigateToFeed: () => void;
}

export const OfflineSupport: React.FC<OfflineSupportProps> = ({
  cows,
  reminders,
  isOfflineSimulated,
  setIsOfflineSimulated,
  isReallyOnline,
  onSaveReminder,
  onToggleReminder,
  onDeleteReminder,
  onNavigateToFeed,
}) => {
  const isOperatingOffline = !isReallyOnline || isOfflineSimulated;
  const [selectedGuideIndex, setSelectedGuideIndex] = useState<number>(0);

  // Reminder form state
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [reminderTitle, setReminderTitle] = useState('');
  const [reminderType, setReminderType] = useState<ReminderItem['type']>('vaccination');
  const [reminderCowId, setReminderCowId] = useState('');
  const [reminderDate, setReminderDate] = useState(new Date().toISOString().split('T')[0]);
  const [reminderNotes, setReminderNotes] = useState('');

  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleCreateReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reminderTitle.trim()) return;

    const cowObj = cows.find((c) => c.id === reminderCowId);

    const newReminder: ReminderItem = {
      id: `rem-${Date.now()}`,
      cowId: cowObj?.id,
      cowName: cowObj?.name,
      title: reminderTitle.trim(),
      type: reminderType,
      dueDate: reminderDate,
      completed: false,
      notes: reminderNotes.trim(),
    };

    onSaveReminder(newReminder);
    setIsReminderModalOpen(false);
    setReminderTitle('');
    setReminderNotes('');
  };

  const handleDownloadBackup = () => {
    const jsonStr = exportFarmDataJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dairyguard-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) {
          const ok = importFarmDataJson(text);
          if (ok) {
            setImportStatus('Successfully restored farm records! Refreshing in 1s...');
            setTimeout(() => window.location.reload(), 1200);
          } else {
            setImportStatus('Failed to parse backup JSON file.');
          }
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">📱</span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Rural Offline Toolkit & Local Storage
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Engineered for remote pastures without network coverage. All cow profiles, feeding models, and emergency first-aid remain fully functional.
          </p>
        </div>

        {/* Offline Mode Toggle Button */}
        <button
          onClick={() => setIsOfflineSimulated(!isOfflineSimulated)}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 self-start sm:self-auto cursor-pointer border shadow-xs ${
            isOperatingOffline
              ? 'bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200'
              : 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
          }`}
        >
          {isOperatingOffline ? (
            <>
              <WifiOff className="w-4 h-4 text-amber-700" />
              <span>Simulating Offline Mode (Click to connect)</span>
            </>
          ) : (
            <>
              <Wifi className="w-4 h-4 text-emerald-700" />
              <span>Simulate Rural Offline Mode</span>
            </>
          )}
        </button>
      </div>

      {/* Offline Status & Local Cache Audit */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
            <span>OFFLINE COWS</span>
            <Database className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            {cows.length} <span className="text-xs font-normal text-slate-500">records</span>
          </div>
          <p className="text-[11px] text-emerald-700 font-semibold mt-1">
            100% stored in local storage
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
            <span>FEED ALGORITHMS</span>
            <Sparkles className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            ICAR / NRC
          </div>
          <p className="text-[11px] text-amber-700 font-semibold mt-1">
            Calculates offline with zero latency
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
            <span>SAVED VETS & LABS</span>
            <span className="text-base">🏥</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            Available
          </div>
          <p className="text-[11px] text-slate-600 font-medium mt-1">
            Offline address book & 1-tap call
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
            <span>OFFLINE FIRST AID</span>
            <BookOpen className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            {OFFLINE_FIRST_AID_GUIDES.length} <span className="text-xs font-normal text-slate-500">guides</span>
          </div>
          <p className="text-[11px] text-rose-700 font-semibold mt-1">
            Emergency bloat & mastitis care
          </p>
        </div>
      </div>

      {/* Guided Offline Flow Banner (User Request #11) */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <h3 className="font-extrabold text-sm sm:text-base text-emerald-950 flex items-center gap-1.5">
              <span>🌾</span>
              <span>Rural Offline Flow for Dairy Farmers</span>
            </h3>
            <p className="text-xs text-emerald-800 mt-0.5">
              Select Cow Type & Age → Enter Cow Details → Get Feed Recommendation → View Available Results → Receive Care / Feed Advisory → Save Information
            </p>
          </div>

          <button
            onClick={onNavigateToFeed}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-xs self-start shrink-0 cursor-pointer flex items-center gap-1"
          >
            <span>Start Offline Ration Calculation</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Vaccination & Deworming Reminders Section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <Bell className="w-5 h-5 text-amber-600" />
              <span>Offline Reminders & Vaccination Alerts</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Keep critical herd reminders active on your device even without an internet signal.
            </p>
          </div>

          <button
            onClick={() => setIsReminderModalOpen(true)}
            className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Reminder</span>
          </button>
        </div>

        <div className="space-y-2.5">
          {reminders.map((rem) => (
            <div
              key={rem.id}
              className={`p-3.5 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                rem.completed
                  ? 'bg-slate-50 border-slate-200 opacity-60'
                  : 'bg-white border-slate-200 hover:border-amber-300'
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => onToggleReminder(rem.id)}
                  className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-colors cursor-pointer ${
                    rem.completed
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : 'border-slate-300 bg-white hover:border-emerald-500'
                  }`}
                >
                  {rem.completed && <CheckCircle2 className="w-4 h-4" />}
                </button>

                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold ${
                        rem.completed ? 'line-through text-slate-400' : 'text-slate-900'
                      }`}
                    >
                      {rem.title}
                    </span>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">
                      {rem.type}
                    </span>
                  </div>

                  <div className="text-xs text-slate-500 mt-1 flex items-center gap-3">
                    {rem.cowName && <span>Cow: <strong>{rem.cowName}</strong></span>}
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      Due: {rem.dueDate}
                    </span>
                    {rem.notes && <span className="italic">"{rem.notes}"</span>}
                  </div>
                </div>
              </div>

              <button
                onClick={() => onDeleteReminder(rem.id)}
                className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Offline Livestock First Aid & Emergency Manual */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
        <div>
          <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-rose-600" />
            <span>Emergency Livestock Care Manual (100% Offline Accessible)</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Step-by-step procedures for handling acute emergencies before the veterinarian arrives.
          </p>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {OFFLINE_FIRST_AID_GUIDES.map((guide, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedGuideIndex(idx)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                selectedGuideIndex === idx
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {guide.title}
            </button>
          ))}
        </div>

        {/* Selected Guide Details */}
        <div className="p-4 sm:p-5 rounded-2xl bg-rose-50/60 border border-rose-200 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-sm sm:text-base text-rose-950">
              {OFFLINE_FIRST_AID_GUIDES[selectedGuideIndex].title}
            </h4>
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-rose-200 text-rose-900">
              {OFFLINE_FIRST_AID_GUIDES[selectedGuideIndex].urgency}
            </span>
          </div>

          <div className="space-y-2">
            {OFFLINE_FIRST_AID_GUIDES[selectedGuideIndex].steps.map((step, sIdx) => (
              <div key={sIdx} className="flex items-start gap-2.5 text-xs text-rose-950 leading-relaxed">
                <span className="w-5 h-5 rounded-full bg-rose-200 text-rose-900 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  {sIdx + 1}
                </span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Backup & Restore Data (Rural Resilience) */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-extrabold text-sm sm:text-base text-emerald-300 flex items-center gap-2">
            <Database className="w-4 h-4" />
            <span>Farm Data Backup & Transfer</span>
          </h3>
          <p className="text-xs text-slate-300 mt-0.5">
            Download an offline backup file of all registered cows, feed plans, and contacts to safeguard your farm data.
          </p>
          {importStatus && (
            <p className="text-xs text-amber-300 font-semibold mt-1">{importStatus}</p>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleDownloadBackup}
            className="bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-xs px-3.5 py-2 rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Backup JSON</span>
          </button>

          <label className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer border border-white/20">
            <Upload className="w-3.5 h-3.5" />
            <span>Restore Backup</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportBackup}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Add Reminder Modal */}
      {isReminderModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-slate-900">Add Herd Reminder</h3>
              <button
                onClick={() => setIsReminderModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateReminder} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Reminder Title *</label>
                <input
                  type="text"
                  required
                  value={reminderTitle}
                  onChange={(e) => setReminderTitle(e.target.value)}
                  placeholder="e.g. FMD Booster Dose / Deworming"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Type</label>
                  <select
                    value={reminderType}
                    onChange={(e) => setReminderType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="vaccination">Vaccination</option>
                    <option value="deworming">Deworming</option>
                    <option value="feed_order">Feed Order</option>
                    <option value="vet_checkup">Vet Checkup</option>
                    <option value="calving">Calving Due</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Due Date *</label>
                  <input
                    type="date"
                    required
                    value={reminderDate}
                    onChange={(e) => setReminderDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Cow (Optional)</label>
                <select
                  value={reminderCowId}
                  onChange={(e) => setReminderCowId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="">-- General Herd Reminder --</option>
                  {cows.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.tagNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Notes</label>
                <input
                  type="text"
                  value={reminderNotes}
                  onChange={(e) => setReminderNotes(e.target.value)}
                  placeholder="e.g. Empty stomach in morning"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsReminderModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl shadow-xs"
                >
                  Save Reminder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
