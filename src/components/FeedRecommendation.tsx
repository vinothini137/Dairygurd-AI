import React, { useState, useEffect } from 'react';
import {
  Wheat,
  Scale,
  Droplets,
  Clock,
  AlertCircle,
  Sparkles,
  CheckCircle2,
  Printer,
  ChevronRight,
  ShieldCheck,
  Info,
} from 'lucide-react';
import { CowProfile, FeedGuidanceResult, LactationStage } from '../types';
import { calculateFeedGuidance } from '../utils/nutritionCalculator';
import { useLanguage } from '../context/LanguageContext';

interface FeedRecommendationProps {
  cows: CowProfile[];
  selectedCow?: CowProfile | null;
  onSaveFeedResult?: (result: FeedGuidanceResult) => void;
}

export const FeedRecommendation: React.FC<FeedRecommendationProps> = ({
  cows,
  selectedCow,
  onSaveFeedResult,
}) => {
  const { t } = useLanguage();
  // Select cow or custom mode
  const [selectedCowId, setSelectedCowId] = useState<string>(
    selectedCow?.id || (cows.length > 0 ? cows[0].id : 'custom')
  );

  // Custom parameters
  const [breed, setBreed] = useState<string>('Gir (Indigenous Desi)');
  const [weightKg, setWeightKg] = useState<number>(420);
  const [dailyYieldLiters, setDailyYieldLiters] = useState<number>(14);
  const [lactationStage, setLactationStage] = useState<LactationStage>('Peak Lactation');

  const [guidance, setGuidance] = useState<FeedGuidanceResult | null>(null);
  const [savedNotification, setSavedNotification] = useState(false);

  // If a cow is passed via props or selected from dropdown, sync state
  useEffect(() => {
    if (selectedCowId !== 'custom') {
      const cow = cows.find((c) => c.id === selectedCowId);
      if (cow) {
        setBreed(cow.breed);
        setWeightKg(cow.weightKg);
        setDailyYieldLiters(cow.dailyYieldLiters);
        setLactationStage(cow.lactationStage);
        const result = calculateFeedGuidance(cow);
        setGuidance(result);
        return;
      }
    }

    // Default or custom
    const result = calculateFeedGuidance({
      breed,
      weightKg,
      dailyYieldLiters,
      lactationStage,
    });
    setGuidance(result);
  }, [selectedCowId, cows, breed, weightKg, dailyYieldLiters, lactationStage]);

  const handleRecalculate = () => {
    const result = calculateFeedGuidance({
      id: selectedCowId !== 'custom' ? selectedCowId : undefined,
      breed,
      weightKg,
      dailyYieldLiters,
      lactationStage,
    });
    setGuidance(result);
  };

  const handleSaveToFarm = () => {
    if (guidance && onSaveFeedResult) {
      onSaveFeedResult(guidance);
      setSavedNotification(true);
      setTimeout(() => setSavedNotification(false), 3000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌾</span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {t('feed', 'Smart Feed Recommendation')}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Scientific ICAR & NRC dairy cattle feeding ration calculated by body weight, breed, and milk production.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {savedNotification && (
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-300 flex items-center gap-1 animate-fade-in">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Saved to Farm History!
            </span>
          )}

          <button
            onClick={handleSaveToFarm}
            className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold px-3.5 py-2 rounded-xl text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>{t('saveProfile', 'Save Feed Plan')}</span>
          </button>

          <button
            onClick={handlePrint}
            title="Print or export feed chart"
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-2 rounded-xl text-xs transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Print</span>
          </button>
        </div>
      </div>

      {/* Cow Selector / Parameter Inputs */}
      <div className="bg-gradient-to-br from-amber-50/60 to-emerald-50/40 border border-amber-200/80 rounded-2xl p-5 shadow-xs">
        <h3 className="font-extrabold text-sm text-slate-900 mb-3 flex items-center gap-1.5">
          <span>🐮</span>
          <span>{t('selectCow', 'Select Cow Profile or Enter Details')}:</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Cow Profile Picker */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              {t('selectSavedCow')}
            </label>
            <select
              value={selectedCowId}
              onChange={(e) => setSelectedCowId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            >
              {cows.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.breed} - {c.dailyYieldLiters}L)
                </option>
              ))}
              <option value="custom">-- {t('unregisteredCow')} --</option>
            </select>
          </div>

          {/* Breed */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              {t('breed')}
            </label>
            <input
              type="text"
              value={breed}
              onChange={(e) => {
                setBreed(e.target.value);
                setSelectedCowId('custom');
              }}
              placeholder="e.g. Gir / HF / Murrah"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            />
          </div>

          {/* Weight */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              {t('weight')} (kg)
            </label>
            <input
              type="number"
              min="150"
              max="900"
              value={weightKg}
              onChange={(e) => {
                setWeightKg(Number(e.target.value));
                setSelectedCowId('custom');
              }}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            />
          </div>

          {/* Stage */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              {t('lactationStage')}
            </label>
            <select
              value={lactationStage}
              onChange={(e) => {
                setLactationStage(e.target.value as LactationStage);
                setSelectedCowId('custom');
              }}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            >
              <option value="Early Lactation">{t('earlyLactation')}</option>
              <option value="Peak Lactation">{t('peakLactation')}</option>
              <option value="Mid Lactation">{t('midLactation')}</option>
              <option value="Late Lactation">{t('lateLactation')}</option>
              <option value="Dry / Pregnant">{t('dryPregnant')}</option>
              <option value="Heifer">{t('heifer')}</option>
              <option value="Calf">{t('calf')}</option>
            </select>
          </div>

          {/* Daily Milk Yield */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              {t('yieldPerDay')}
            </label>
            <input
              type="number"
              step="0.5"
              min="0"
              max="50"
              value={dailyYieldLiters}
              onChange={(e) => {
                setDailyYieldLiters(Number(e.target.value));
                setSelectedCowId('custom');
              }}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            />
          </div>
        </div>
      </div>

      {guidance && (
        <div className="space-y-6">
          {/* Main Recommended Feed Quantity Cards */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-extrabold text-slate-900 text-lg">
                Daily Recommended Feed Ration
              </h2>
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                Total Dry Matter: <strong>{guidance.dryMatterKg} kg / day</strong>
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
              {/* Green Fodder */}
              <div className="bg-white border-2 border-emerald-300 rounded-2xl p-4 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xl">🌿</span>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                      Fresh Weight
                    </span>
                  </div>
                  <h3 className="font-extrabold text-sm text-slate-800 mt-2">
                    Green Fodder
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Maize, Sorghum, Hybrid Napier, Berseem
                  </p>
                </div>
                <div className="mt-4 pt-2 border-t border-slate-100">
                  <div className="text-2xl sm:text-3xl font-black text-emerald-700">
                    {guidance.greenFodderKg} <span className="text-xs font-bold text-slate-600">kg/day</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">Chaffed to 1-2 inch</p>
                </div>
              </div>

              {/* Dry Fodder / Straw */}
              <div className="bg-white border-2 border-amber-300 rounded-2xl p-4 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xl">🌾</span>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                      Dry Fiber
                    </span>
                  </div>
                  <h3 className="font-extrabold text-sm text-slate-800 mt-2">
                    Dry Fodder (Straw)
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Wheat straw (bhusa), Paddy straw, Hay
                  </p>
                </div>
                <div className="mt-4 pt-2 border-t border-slate-100">
                  <div className="text-2xl sm:text-3xl font-black text-amber-700">
                    {guidance.dryFodderKg} <span className="text-xs font-bold text-slate-600">kg/day</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">Essential for cud rumination</p>
                </div>
              </div>

              {/* Balanced Concentrate */}
              <div className="bg-white border-2 border-orange-300 rounded-2xl p-4 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xl">🥣</span>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-orange-800 bg-orange-100 px-2 py-0.5 rounded-md">
                      High Energy
                    </span>
                  </div>
                  <h3 className="font-extrabold text-sm text-slate-800 mt-2">
                    Concentrate Feed
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Grain mash, cottonseed cake, bran
                  </p>
                </div>
                <div className="mt-4 pt-2 border-t border-slate-100">
                  <div className="text-2xl sm:text-3xl font-black text-orange-600">
                    {guidance.concentrateKg} <span className="text-xs font-bold text-slate-600">kg/day</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">Split across milkings</p>
                </div>
              </div>

              {/* Mineral Mix & Salt */}
              <div className="bg-white border-2 border-purple-300 rounded-2xl p-4 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xl">🧪</span>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-800 bg-purple-100 px-2 py-0.5 rounded-md">
                      Micronutrients
                    </span>
                  </div>
                  <h3 className="font-extrabold text-sm text-slate-800 mt-2">
                    Minerals & Salt
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Chelated minerals + common salt
                  </p>
                </div>
                <div className="mt-4 pt-2 border-t border-slate-100">
                  <div className="text-2xl sm:text-3xl font-black text-purple-700">
                    {guidance.mineralMixGrams} <span className="text-xs font-bold text-slate-600">g mix</span>
                  </div>
                  <p className="text-[10px] text-slate-600 font-semibold mt-0.5">
                    + {guidance.saltGrams}g common salt
                  </p>
                </div>
              </div>

              {/* Clean Water */}
              <div className="bg-white border-2 border-blue-300 rounded-2xl p-4 shadow-xs flex flex-col justify-between col-span-2 sm:col-span-1">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xl">💧</span>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-800 bg-blue-100 px-2 py-0.5 rounded-md">
                      24/7 Access
                    </span>
                  </div>
                  <h3 className="font-extrabold text-sm text-slate-800 mt-2">
                    Clean Fresh Water
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    4-5L per liter milk + maintenance
                  </p>
                </div>
                <div className="mt-4 pt-2 border-t border-slate-100">
                  <div className="text-xl sm:text-2xl font-black text-blue-700">
                    {guidance.waterLitersMin}-{guidance.waterLitersMax} <span className="text-xs font-bold text-slate-600">L/day</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">Never restrict water access</p>
                </div>
              </div>
            </div>
          </div>

          {/* Daily 5-Step Feeding Schedule Timetable */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2 mb-3">
              <Clock className="w-5 h-5 text-emerald-700" />
              <span>Recommended Daily Feeding Timetable</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Dividing the ration into specific time slots stabilizes rumen fermentation, prevents frothy bloat, and optimizes milk fat yield.
            </p>

            <div className="space-y-3">
              {guidance.feedingSchedule.map((slot, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-emerald-200 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <div>
                      <span className="font-extrabold text-xs text-emerald-900 block">
                        {slot.time}
                      </span>
                      <strong className="text-sm text-slate-800 block">{slot.action}</strong>
                    </div>
                  </div>

                  <div className="sm:text-right pl-9 sm:pl-0 text-xs font-medium text-slate-600">
                    <span className="inline-block bg-white px-3 py-1 rounded-lg border border-slate-200 shadow-2xs font-semibold text-slate-700">
                      {slot.portion}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Basic Nutrition Guidance & Feed Precautions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Basic Nutrition Guidance */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-600" />
                <span>Basic Dairy Nutrition Principles</span>
              </h3>

              <div className="space-y-2.5 text-xs text-slate-600 leading-relaxed">
                <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100">
                  <strong className="text-blue-950 block mb-0.5">
                    1. Dry Matter (DM) is the Real Fuel:
                  </strong>
                  A cow needs approximately 2.5% to 3.2% of her body weight in dry matter daily. Green grass contains 75-80% water; feeding only green grass will fill the rumen with water before nutritional requirements are met.
                </div>

                <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
                  <strong className="text-emerald-950 block mb-0.5">
                    2. Long Fiber is Crucial for Milk Fat %:
                  </strong>
                  Dry fodder (straw/bhusa) stimulates chewing the cud (rumination) and generates saliva. Saliva buffers the rumen pH to 6.2 - 6.8, which is necessary for acetic acid production (the building block of butterfat).
                </div>

                <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-100">
                  <strong className="text-purple-950 block mb-0.5">
                    3. Minerals for Conception & Teat Health:
                  </strong>
                  Mineral mixture provides Zinc, Copper, Selenium, Calcium, and Phosphorus, which are mandatory for post-calving uterus recovery, strong hooves, and teat keratin resistance against mastitis.
                </div>
              </div>
            </div>

            {/* Feed-Related Precautions */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>Feed-Related Precautions</span>
              </h3>

              <div className="space-y-2">
                {guidance.precautions.map((prec, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950"
                  >
                    <span className="text-amber-600 shrink-0 font-bold">•</span>
                    <span>{prec}</span>
                  </div>
                ))}

                {/* Seasonal Tip */}
                <div className="p-3 rounded-xl bg-emerald-800 text-emerald-50 text-xs mt-3 flex items-start gap-2.5">
                  <span className="text-base shrink-0">💡</span>
                  <span>{guidance.seasonalTip}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
