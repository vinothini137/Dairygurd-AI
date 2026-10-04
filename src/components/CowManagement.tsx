import React, { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  Trash2,
  Edit3,
  Calendar,
  Sparkles,
  CheckCircle2,
  Wheat,
  Activity,
  Award,
  X,
  FileSpreadsheet,
  Users,
  Copy,
} from 'lucide-react';
import { CowProfile, LactationStage } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSelector } from './LanguageSelector';
import { AppLogo } from './AppLogo';

interface CowManagementProps {
  cows: CowProfile[];
  onSaveCow: (cow: CowProfile) => void;
  onDeleteCow: (id: string) => void;
  onSelectForFeed: (cow: CowProfile) => void;
  onSelectForHealth: (cow: CowProfile) => void;
}

const COMMON_BREEDS = [
  'Gir (Indigenous Desi)',
  'Sahiwal',
  'Red Sindhi',
  'Tharparkar',
  'Kankrej',
  'Holstein Friesian (HF)',
  'HF Crossbred',
  'Jersey',
  'Jersey Crossbred',
  'Murrah Buffalo',
  'Mehsana Buffalo',
  'Jaffarabadi Buffalo',
  'Nili-Ravi Buffalo',
  'Local Non-Descript / Zebu',
];

const LACTATION_STAGES: LactationStage[] = [
  'Early Lactation',
  'Peak Lactation',
  'Mid Lactation',
  'Late Lactation',
  'Dry / Pregnant',
  'Heifer',
  'Calf',
];

export const CowManagement: React.FC<CowManagementProps> = ({
  cows,
  onSaveCow,
  onDeleteCow,
  onSelectForFeed,
  onSelectForHealth,
}) => {
  const { t } = useLanguage();
  const [search, setSearch] = useState('');
  const [filterStage, setFilterStage] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCowForDetail, setSelectedCowForDetail] = useState<CowProfile | null>(null);

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [tagNumber, setTagNumber] = useState('');
  const [breed, setBreed] = useState(COMMON_BREEDS[0]);
  const [customBreed, setCustomBreed] = useState('');
  const [ageYears, setAgeYears] = useState<number>(4);
  const [ageMonths, setAgeMonths] = useState<number>(0);
  const [weightKg, setWeightKg] = useState<number>(420);
  const [lactationStage, setLactationStage] = useState<LactationStage>('Peak Lactation');
  const [dailyYieldLiters, setDailyYieldLiters] = useState<number>(14);
  const [fatPercentage, setFatPercentage] = useState<number>(4.5);
  const [bcs, setBcs] = useState<number>(3.5);
  const [healthNotes, setHealthNotes] = useState('');
  const [lastVaccinationDate, setLastVaccinationDate] = useState('');
  const [lastDewormingDate, setLastDewormingDate] = useState('');

  const nextCowNumber = cows.length + 1;

  const openNewCowModal = () => {
    setEditingId(null);
    setName(`Cow #${nextCowNumber}`);
    setTagNumber(`IN-${Math.floor(1000 + Math.random() * 9000)}`);
    setBreed(COMMON_BREEDS[0]);
    setCustomBreed('');
    setAgeYears(3);
    setAgeMonths(6);
    setWeightKg(420);
    setLactationStage('Early Lactation');
    setDailyYieldLiters(15);
    setFatPercentage(4.5);
    setBcs(3.5);
    setHealthNotes('');
    setLastVaccinationDate(new Date().toISOString().split('T')[0]);
    setLastDewormingDate('');
    setIsModalOpen(true);
  };

  const openEditCowModal = (cow: CowProfile) => {
    setEditingId(cow.id);
    setName(cow.name);
    setTagNumber(cow.tagNumber);
    if (COMMON_BREEDS.includes(cow.breed)) {
      setBreed(cow.breed);
      setCustomBreed('');
    } else {
      setBreed('Other / Custom');
      setCustomBreed(cow.breed);
    }
    setAgeYears(cow.ageYears);
    setAgeMonths(cow.ageMonths);
    setWeightKg(cow.weightKg);
    setLactationStage(cow.lactationStage);
    setDailyYieldLiters(cow.dailyYieldLiters);
    setFatPercentage(cow.fatPercentage || 4.5);
    setBcs(cow.bcs || 3.5);
    setHealthNotes(cow.healthNotes || '');
    setLastVaccinationDate(cow.lastVaccinationDate || '');
    setLastDewormingDate(cow.lastDewormingDate || '');
    setIsModalOpen(true);
  };

  // Quick preset adder to manage multiple cows (Cow 1, Cow 2, Cow 3, etc.)
  const handleQuickAddCow = (presetType: 'gir' | 'murrah' | 'hf') => {
    const cowNum = cows.length + 1;
    let newCow: CowProfile;

    if (presetType === 'murrah') {
      newCow = {
        id: `cow-${Date.now()}`,
        tagNumber: `IN-BUF-${Math.floor(1000 + Math.random() * 9000)}`,
        name: `Cow #${cowNum} (Murrah Buffalo)`,
        breed: 'Murrah Buffalo',
        ageYears: 5,
        ageMonths: 0,
        weightKg: 560,
        lactationStage: 'Peak Lactation',
        dailyYieldLiters: 14.0,
        fatPercentage: 7.2,
        bcs: 3.5,
        healthNotes: 'Healthy buffalo in second lactation. High fat yield.',
        lastVaccinationDate: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
      };
    } else if (presetType === 'hf') {
      newCow = {
        id: `cow-${Date.now()}`,
        tagNumber: `IN-HF-${Math.floor(1000 + Math.random() * 9000)}`,
        name: `Cow #${cowNum} (HF Cross)`,
        breed: 'Holstein Friesian (HF)',
        ageYears: 3,
        ageMonths: 4,
        weightKg: 520,
        lactationStage: 'Early Lactation',
        dailyYieldLiters: 24.5,
        fatPercentage: 3.9,
        bcs: 3.0,
        healthNotes: 'High-yielding cow. Requires high energy ration.',
        lastVaccinationDate: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
      };
    } else {
      newCow = {
        id: `cow-${Date.now()}`,
        tagNumber: `IN-DESI-${Math.floor(1000 + Math.random() * 9000)}`,
        name: `Cow #${cowNum} (Gir Cow)`,
        breed: 'Gir (Indigenous Desi)',
        ageYears: 4,
        ageMonths: 2,
        weightKg: 410,
        lactationStage: 'Mid Lactation',
        dailyYieldLiters: 12.0,
        fatPercentage: 4.8,
        bcs: 3.5,
        healthNotes: 'Pure desi A2 cow. Strong disease resistance.',
        lastVaccinationDate: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
      };
    }

    onSaveCow(newCow);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalBreed = breed === 'Other / Custom' ? customBreed.trim() || 'Indigenous Cow' : breed;

    const cowToSave: CowProfile = {
      id: editingId || `cow-${Date.now()}`,
      tagNumber: tagNumber.trim() || `COW-${Math.floor(100 + Math.random() * 900)}`,
      name: name.trim() || `Cow #${nextCowNumber}`,
      breed: finalBreed,
      ageYears: Number(ageYears) || 0,
      ageMonths: Number(ageMonths) || 0,
      weightKg: Number(weightKg) || 400,
      lactationStage,
      dailyYieldLiters: Number(dailyYieldLiters) || 0,
      fatPercentage: Number(fatPercentage) || 4.0,
      bcs: Number(bcs) || 3.0,
      healthNotes: healthNotes.trim(),
      lastVaccinationDate,
      lastDewormingDate,
      createdAt: editingId
        ? cows.find((c) => c.id === editingId)?.createdAt || new Date().toISOString()
        : new Date().toISOString(),
    };

    onSaveCow(cowToSave);
    setIsModalOpen(false);
  };

  const filteredCows = cows.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.tagNumber.toLowerCase().includes(search.toLowerCase()) ||
      c.breed.toLowerCase().includes(search.toLowerCase());
    const matchesStage = filterStage === 'all' || c.lactationStage === filterStage;
    return matchesSearch && matchesStage;
  });

  const totalHerdYield = cows.reduce((sum, c) => sum + (c.dailyYieldLiters || 0), 0);
  const milkingCount = cows.filter(
    (c) =>
      c.lactationStage === 'Early Lactation' ||
      c.lactationStage === 'Peak Lactation' ||
      c.lactationStage === 'Mid Lactation' ||
      c.lactationStage === 'Late Lactation'
  ).length;

  return (
    <div className="space-y-8 pb-12">
      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
        <div>
          <div className="flex items-center gap-3">
            <AppLogo size="md" className="shrink-0" />
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {t('cows', 'Cow Profiles')} &amp; Multi-Cow Management
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Add and manage multiple individual cows (Cow 1, Cow 2, Cow 3...) with separate records.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <button
            onClick={openNewCowModal}
            className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm shadow-sm transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t('addCow', 'Add New Cow')}</span>
          </button>
        </div>
      </div>

      {/* Multi-Cow Herd Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gradient-to-r from-emerald-50 via-teal-50 to-slate-50 p-4 rounded-2xl border border-emerald-200">
        <div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            {t('registeredHerd')}
          </span>
          <strong className="text-xl sm:text-2xl font-black text-slate-900">
            {cows.length} {t('cows')}
          </strong>
        </div>
        <div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            {t('inMilk')}
          </span>
          <strong className="text-xl sm:text-2xl font-black text-emerald-700">
            {milkingCount} {t('inMilk')}
          </strong>
        </div>
        <div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            {t('dryOrCalves')}
          </span>
          <strong className="text-xl sm:text-2xl font-black text-amber-700">
            {cows.length - milkingCount} {t('dryOrCalves')}
          </strong>
        </div>
        <div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            {t('totalMilkOutput')}
          </span>
          <strong className="text-xl sm:text-2xl font-black text-blue-700">
            {totalHerdYield.toFixed(1)} {t('litersPerDay')}
          </strong>
        </div>
      </div>

      {/* Quick Add Another Cow Presets */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-700" />
            <span className="text-xs font-bold text-slate-800">
              {t('quickMultiCowAdd')}:
            </span>
          </div>
          <span className="text-[10px] text-slate-400">
            {t('separateRecordsNotice')}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleQuickAddCow('gir')}
            className="bg-slate-50 hover:bg-emerald-50 text-slate-800 border border-slate-200 hover:border-emerald-300 font-bold text-xs px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <span>+ {t('addAnotherCow')} (Gir)</span>
          </button>
          <button
            onClick={() => handleQuickAddCow('murrah')}
            className="bg-slate-50 hover:bg-emerald-50 text-slate-800 border border-slate-200 hover:border-emerald-300 font-bold text-xs px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <span>+ {t('addAnotherCow')} (Murrah)</span>
          </button>
          <button
            onClick={() => handleQuickAddCow('hf')}
            className="bg-slate-50 hover:bg-emerald-50 text-slate-800 border border-slate-200 hover:border-emerald-300 font-bold text-xs px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <span>+ {t('addAnotherCow')} (HF)</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('searchCowsPlaceholder')}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all font-medium"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={filterStage}
            onChange={(e) => setFilterStage(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-medium text-slate-700 w-full sm:w-52"
          >
            <option value="all">{t('allCows')} ({cows.length})</option>
            {LACTATION_STAGES.map((st) => (
              <option key={st} value={st}>
                {st} ({cows.filter((c) => c.lactationStage === st).length})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Cow Cards Grid */}
      {filteredCows.length === 0 ? (
        <div className="text-center py-12 bg-white border border-dashed border-slate-300 rounded-3xl p-8">
          <span className="text-4xl">🐮</span>
          <h3 className="font-bold text-slate-800 text-base mt-2">{t('noCowsFound')}</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            {t('noCowsFoundDesc')}
          </p>
          <button
            onClick={openNewCowModal}
            className="mt-4 bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-emerald-700 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t('addFirstCow')}</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCows.map((cow, index) => {
            const isBuffalo = cow.breed.toLowerCase().includes('buffalo');
            return (
              <div
                key={cow.id}
                className="bg-white border-2 border-slate-200 hover:border-emerald-400 rounded-3xl p-5 shadow-xs transition-all flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Index Ribbon for Multi-Cow clarity */}
                <div className="absolute top-0 right-0 bg-slate-100 text-slate-500 font-black text-[10px] px-3 py-1 rounded-bl-xl border-l border-b border-slate-200">
                  {t('cows')} #{index + 1}
                </div>

                <div>
                  {/* Top Row: Name, Tag, Stage */}
                  <div className="flex items-start justify-between gap-2 pr-12">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{isBuffalo ? '🐃' : '🐄'}</span>
                        <h3 className="font-black text-base text-slate-900 group-hover:text-emerald-700 transition-colors">
                          {cow.name}
                        </h3>
                      </div>
                      <span className="inline-block mt-1 font-mono text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                        {t('tagNumber')}: {cow.tagNumber}
                      </span>
                    </div>
                  </div>

                  <div className="mt-2.5">
                    <span
                      className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border inline-block ${
                        cow.lactationStage.includes('Peak') || cow.lactationStage.includes('Early')
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : cow.lactationStage.includes('Dry')
                          ? 'bg-amber-100 text-amber-800 border-amber-300'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {cow.lactationStage}
                    </span>
                  </div>

                  {/* Breed & Age Details */}
                  <div className="mt-3.5 grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">
                        {t('breed')}
                      </span>
                      <strong className="text-slate-800 truncate block">{cow.breed}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">
                        {t('age')}
                      </span>
                      <strong className="text-slate-800">
                        {cow.ageYears} {t('years')} {cow.ageMonths > 0 ? `${cow.ageMonths} ${t('months')}` : ''}
                      </strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">
                        {t('weight')}
                      </span>
                      <strong className="text-slate-800">{cow.weightKg} kg</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">
                        {t('yieldPerDay')}
                      </span>
                      <strong className="text-emerald-700 font-extrabold">
                        {cow.dailyYieldLiters > 0 ? `${cow.dailyYieldLiters} L` : t('dryPregnant')}
                      </strong>
                    </div>
                  </div>

                  {/* Health Notes preview if any */}
                  {cow.healthNotes && (
                    <p className="mt-3 text-xs text-slate-600 line-clamp-2 italic bg-emerald-50/40 p-2 rounded-xl border border-emerald-100/60">
                      "{cow.healthNotes}"
                    </p>
                  )}
                </div>

                {/* Bottom Actions */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-1">
                    <button
                      onClick={() => onSelectForFeed(cow)}
                      title={t('feedRation')}
                      className="flex-1 bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-800 font-bold text-xs py-2 rounded-xl transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Wheat className="w-3.5 h-3.5" />
                      <span>{t('feedRation')}</span>
                    </button>

                    <button
                      onClick={() => onSelectForHealth(cow)}
                      title={t('healthCheck')}
                      className="flex-1 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-800 font-bold text-xs py-2 rounded-xl transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Activity className="w-3.5 h-3.5" />
                      <span>{t('healthCheck')}</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditCowModal(cow)}
                      title={t('editProfile')}
                      className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`${t('confirmDelete')} ${cow.name}?`)) {
                          onDeleteCow(cow.id);
                        }
                      }}
                      title={t('deleteProfile')}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Cow Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-100 space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-extrabold text-lg sm:text-xl text-slate-900">
                  {editingId ? t('editProfile', 'Edit Cow Profile') : t('saveProfile', 'Create Digital Cow Profile')}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Enter cow type, age, and production details to generate nutritional guidance.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('cowName', 'Cow Name')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={`e.g. Cow #${nextCowNumber} / Gauri`}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('tagNumber', 'Ear Tag ID')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={tagNumber}
                    onChange={(e) => setTagNumber(e.target.value)}
                    placeholder="e.g. IN-MH-1042"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-mono"
                  />
                </div>
              </div>

              {/* Cow Type / Breed */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">
                  {t('breed', 'Breed / Type')} *
                </label>
                <select
                  value={breed}
                  onChange={(e) => setBreed(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                >
                  {COMMON_BREEDS.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                  <option value="Other / Custom">Other / Custom Breed...</option>
                </select>

                {breed === 'Other / Custom' && (
                  <input
                    type="text"
                    required
                    value={customBreed}
                    onChange={(e) => setCustomBreed(e.target.value)}
                    placeholder="Specify breed name..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  />
                )}
              </div>

              {/* Cow Age */}
              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('age', 'Age')} (Years) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="22"
                    required
                    value={ageYears}
                    onChange={(e) => setAgeYears(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('age', 'Age')} (Months)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="11"
                    value={ageMonths}
                    onChange={(e) => setAgeMonths(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-medium"
                  />
                </div>
              </div>

              {/* Weight & Lactation Stage */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('weight', 'Body Weight')} (kg) *
                  </label>
                  <input
                    type="number"
                    min="100"
                    max="900"
                    required
                    value={weightKg}
                    onChange={(e) => setWeightKg(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('lactationStage', 'Lactation Stage')} *
                  </label>
                  <select
                    value={lactationStage}
                    onChange={(e) => setLactationStage(e.target.value as LactationStage)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  >
                    {LACTATION_STAGES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Daily Milk Yield & Fat% */}
              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('yieldPerDay', 'Daily Milk Yield')} (L/day)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="60"
                    value={dailyYieldLiters}
                    onChange={(e) => setDailyYieldLiters(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('fatPercentage', 'Milk Fat %')}
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="2"
                    max="11"
                    value={fatPercentage}
                    onChange={(e) => setFatPercentage(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-medium"
                  />
                </div>
              </div>

              {/* Health Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t('healthNotes', 'Health Notes')}
                </label>
                <textarea
                  rows={2}
                  value={healthNotes}
                  onChange={(e) => setHealthNotes(e.target.value)}
                  placeholder="e.g. Vaccinated for FMD, regular rumination, easy milker..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{editingId ? t('saveChanges') : t('saveProfile')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MANDATORY USER REQUIREMENT 1: Language Option at the bottom of the Profile section */}
      <div className="pt-4 border-t-2 border-slate-200">
        <LanguageSelector />
      </div>
    </div>
  );
};
