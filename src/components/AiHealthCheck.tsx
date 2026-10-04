import React, { useState } from 'react';
import {
  Camera,
  Upload,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  PhoneCall,
  Activity,
  ShieldAlert,
  Save,
  Printer,
  X,
  RefreshCw,
  Info,
} from 'lucide-react';
import { CowProfile, HealthCheckResult } from '../types';
import { HEALTH_SAMPLE_CASES } from '../data/mockData';
import { useLanguage } from '../context/LanguageContext';

interface AiHealthCheckProps {
  cows: CowProfile[];
  selectedCow?: CowProfile | null;
  onSaveHealthRecord: (record: HealthCheckResult) => void;
  onOpenVeterinary: () => void;
  isOperatingOffline: boolean;
}

const COMMON_SYMPTOMS = [
  'Sudden drop in daily milk yield',
  'Swollen, hot, or painful udder / teat',
  'Skin nodules, lumps, or crusts',
  'Limping or reluctance to bear weight on hoof',
  'Distended left flank / swollen belly (bloat)',
  'Fever / warm ears / shivering',
  'Watery or cloudy eye discharge',
  'Reduced feed intake / dull posture',
  'Diarrhea or dark foul-smelling dung',
  'Rapid, labored, or noisy breathing',
];

export const AiHealthCheck: React.FC<AiHealthCheckProps> = ({
  cows,
  selectedCow,
  onSaveHealthRecord,
  onOpenVeterinary,
  isOperatingOffline,
}) => {
  const { t } = useLanguage();
  const [selectedCowId, setSelectedCowId] = useState<string>(
    selectedCow?.id || (cows.length > 0 ? cows[0].id : '')
  );

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [additionalNotes, setAdditionalNotes] = useState('');

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState<string>('');
  const [result, setResult] = useState<HealthCheckResult | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const activeCow = cows.find((c) => c.id === selectedCowId);

  // Handle sample selection for fast testing
  const handleSelectSample = (sample: (typeof HEALTH_SAMPLE_CASES)[0]) => {
    setSelectedSymptoms(sample.symptoms);
    setAdditionalNotes(sample.notes);
    // Render a high-contrast contextual visual banner for the sample
    setImagePreview(`data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="300" viewBox="0 0 600 300"><rect width="100%" height="100%" fill="%231e293b"/><text x="50%" y="45%" fill="%2338bdf8" font-size="22" font-family="sans-serif" font-weight="bold" text-anchor="middle">${encodeURIComponent(sample.name)}</text><text x="50%" y="65%" fill="%2394a3b8" font-size="14" font-family="sans-serif" text-anchor="middle">${encodeURIComponent(sample.description)}</text></svg>`);
    setResult(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleSymptom = (sym: string) => {
    if (selectedSymptoms.includes(sym)) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== sym));
    } else {
      setSelectedSymptoms([...selectedSymptoms, sym]);
    }
    setResult(null);
  };

  const runHealthAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisStep('Preprocessing cow image and symptoms...');

    try {
      // Step simulation for realistic farm screening experience
      setTimeout(() => setAnalysisStep('Screening coat, posture, udder, and hoof signs...'), 600);
      setTimeout(() => setAnalysisStep('Evaluating veterinary first-aid and care protocols...'), 1200);

      const payload = {
        imageBase64: imagePreview || undefined,
        cowBreed: activeCow?.breed || 'Dairy Cattle',
        cowAge: activeCow ? `${activeCow.ageYears} Years` : '4 Years',
        cowStatus: activeCow?.lactationStage || 'Milking',
        symptoms: selectedSymptoms,
        notes: additionalNotes,
      };

      const res = await fetch('/api/health-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Server responded with ${res.status}`);
      }

      const data = await res.json();

      const newRecord: HealthCheckResult = {
        id: `health-${Date.now()}`,
        cowId: activeCow?.id,
        cowName: activeCow?.name || 'Inspected Cattle',
        date: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        imageBase64: imagePreview || undefined,
        possibleHealthConcern: data.possibleHealthConcern || 'Appears Healthy',
        urgencyLevel: data.urgencyLevel || 'Normal',
        observableSigns: data.observableSigns || [],
        immediateCareGuidance: data.immediateCareGuidance || [],
        feedAdjustment: data.feedAdjustment || 'Standard balanced ration',
        isolationRecommended: Boolean(data.isolationRecommended),
        advisorySummary: data.advisorySummary || 'Continue routine herd observation.',
        disclaimer:
          data.disclaimer ||
          'Screening indicator only. Not a confirmed veterinary diagnosis. Consult a licensed veterinarian immediately.',
      };

      setResult(newRecord);
    } catch (err) {
      console.warn('Network call failed, utilizing offline veterinarian heuristic fallback:', err);
      // Fallback result in offline mode
      const fallbackRecord: HealthCheckResult = {
        id: `health-${Date.now()}`,
        cowId: activeCow?.id,
        cowName: activeCow?.name || 'Inspected Cattle',
        date: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        imageBase64: imagePreview || undefined,
        possibleHealthConcern: selectedSymptoms.some((s) => s.includes('udder') || s.includes('milk'))
          ? 'Possible Early Mastitis / Udder Inflammation Risk'
          : selectedSymptoms.some((s) => s.includes('nodules') || s.includes('Fever'))
          ? 'Potential Lumpy Skin or Pox Lesion Alert'
          : selectedSymptoms.some((s) => s.includes('hoof') || s.includes('Limping'))
          ? 'Interdigital Hoof Lesion or Foot Rot Concern'
          : selectedSymptoms.some((s) => s.includes('bloat'))
          ? 'Acute Rumen Tympany / Bloat Emergency'
          : 'Normal Vital Signs / Healthy Condition',
        urgencyLevel: selectedSymptoms.some((s) => s.includes('udder') || s.includes('bloat') || s.includes('nodules'))
          ? 'Urgent Veterinary Attention'
          : selectedSymptoms.length > 0
          ? 'Moderate Concern'
          : 'Normal',
        observableSigns:
          selectedSymptoms.length > 0
            ? selectedSymptoms
            : ['Alert, bright eyes and responsive ears', 'Normal ruminating posture'],
        immediateCareGuidance: [
          'Keep animal in clean, dry stall with fresh soft bedding.',
          'Provide ad-libitum clean, cool drinking water with oral electrolytes if warm.',
          'Do not administer prescription antibiotics without a qualified veterinarian’s physical check.',
        ],
        feedAdjustment: 'Provide easily digestible chaffed green grass; withhold heavy grain concentrates if rumen bloat or high fever.',
        isolationRecommended: selectedSymptoms.some((s) => s.includes('nodules') || s.includes('eye')),
        advisorySummary:
          selectedSymptoms.length > 0
            ? 'Possible health concern detected. Follow immediate care steps and consult your local veterinarian.'
            : 'Your cow appears healthy. Continue standard daily care and clean drinking water.',
        disclaimer:
          'Screening indicator only. Not a confirmed veterinary diagnosis. Consult a licensed veterinarian immediately.',
      };
      setResult(fallbackRecord);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveReport = () => {
    if (result) {
      onSaveHealthRecord(result);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🤖</span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {t('health', 'AI Cow Health Check')}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Visual screening indicator for early detection of mastitis, skin nodules, lameness, and bloat.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-[11px] font-bold bg-blue-100 text-blue-800 px-3 py-1 rounded-full border border-blue-200">
            Multimodal Vision AI
          </span>
          <button
            onClick={onOpenVeterinary}
            className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>{t('findDoctors', 'Find Vet')}</span>
          </button>
        </div>
      </div>

      {/* Quick Test Samples Picker */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            Quick Test Cases (Click to test AI without an upload):
          </span>
          <span className="text-[10px] text-slate-500">Preset Scenarios</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-thin">
          {HEALTH_SAMPLE_CASES.map((sample) => (
            <button
              key={sample.id}
              onClick={() => handleSelectSample(sample)}
              className="text-left shrink-0 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-xl p-2.5 transition-all text-xs cursor-pointer shadow-2xs"
            >
              <div className="font-extrabold text-slate-900">{sample.name}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                {sample.breed} • {sample.status}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Image Upload & Symptoms (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Cow Selector */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Select Cow Being Inspected (Optional)
            </label>
            <select
              value={selectedCowId}
              onChange={(e) => setSelectedCowId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 bg-white"
            >
              <option value="">-- General Unregistered Cow --</option>
              {cows.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.breed} - Tag: {c.tagNumber})
                </option>
              ))}
            </select>
          </div>

          {/* Photo Upload / Capture Box */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-emerald-700" />
                <span>Upload or Capture Cow Photo</span>
              </label>
              {imagePreview && (
                <button
                  onClick={() => {
                    setImagePreview(null);
                    setResult(null);
                  }}
                  className="text-[11px] font-bold text-rose-600 hover:underline flex items-center gap-1"
                >
                  <X className="w-3 h-3" /> Remove Photo
                </button>
              )}
            </div>

            {imagePreview ? (
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 flex items-center justify-center max-h-72">
                <img
                  src={imagePreview}
                  alt="Cow inspected"
                  className="w-full max-h-72 object-contain"
                />
              </div>
            ) : (
              <label className="border-2 border-dashed border-slate-300 hover:border-emerald-500 bg-slate-50/70 hover:bg-emerald-50/20 rounded-2xl p-7 flex flex-col items-center justify-center cursor-pointer transition-colors text-center group">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Upload className="w-6 h-6" />
                </div>
                <span className="font-bold text-xs text-slate-800 mt-3 block">
                  Click to take or upload cow photo
                </span>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Focus on affected area: Udder, Skin coat, Hooves, Eyes, or Whole animal posture
                </span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Clinical Symptoms Checkboxes */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-emerald-700" />
                <span>Observed Physical Signs & Symptoms</span>
              </label>
              <span className="text-[11px] text-slate-400">
                {selectedSymptoms.length} selected
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {COMMON_SYMPTOMS.map((sym) => {
                const isSelected = selectedSymptoms.includes(sym);
                return (
                  <button
                    key={sym}
                    type="button"
                    onClick={() => toggleSymptom(sym)}
                    className={`text-left p-2.5 rounded-xl border text-xs font-semibold transition-all flex items-start gap-2 cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-900 shadow-2xs'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-md flex items-center justify-center shrink-0 mt-0.5 border ${
                        isSelected
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </span>
                    <span className="leading-tight">{sym}</span>
                  </button>
                );
              })}
            </div>

            {/* Additional notes */}
            <div className="pt-2">
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Additional Observations (e.g. onset, temperature, lactation days)
              </label>
              <input
                type="text"
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                placeholder="e.g. Left flank swollen after eating wet clover this morning..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              />
            </div>
          </div>

          {/* Action Trigger */}
          <button
            onClick={runHealthAnalysis}
            disabled={isAnalyzing}
            className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-98 disabled:opacity-50 text-white font-extrabold text-sm py-3.5 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>{analysisStep || t('runAnalysis')}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>{t('runAnalysis')}</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: AI Screening Report (5 cols) */}
        <div className="lg:col-span-5">
          {result ? (
            <div className="bg-white border-2 border-slate-300 rounded-3xl p-5 sm:p-6 shadow-lg space-y-5 sticky top-20 animate-fade-in">
              {/* Urgency Badge */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                  {t('qualityResult')}
                </span>

                <span
                  className={`text-xs font-black px-3 py-1 rounded-full border ${
                    result.urgencyLevel.includes('Urgent')
                      ? 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse'
                      : result.urgencyLevel.includes('Moderate')
                      ? 'bg-amber-100 text-amber-800 border-amber-300'
                      : result.urgencyLevel.includes('Low')
                      ? 'bg-blue-100 text-blue-800 border-blue-300'
                      : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  }`}
                >
                  {result.urgencyLevel}
                </span>
              </div>

              {/* Identified Condition */}
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  {t('possibleConcern')}
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-0.5 leading-snug">
                  {result.possibleHealthConcern}
                </h3>

                {result.isolationRecommended && (
                  <div className="mt-2 flex items-center gap-2 bg-rose-50 text-rose-800 border border-rose-200 p-2 rounded-xl text-xs font-bold">
                    <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>{t('isolationAlert')}</span>
                  </div>
                )}
              </div>

              {/* Farmer Advisory Summary */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 mb-1">
                  <span>📢</span>
                  <span>{t('advisory')}</span>
                </div>
                <p className="text-xs font-semibold text-amber-950 leading-relaxed">
                  {result.advisorySummary}
                </p>
              </div>

              {/* Observable Signs */}
              {result.observableSigns.length > 0 && (
                <div>
                  <span className="text-xs font-bold text-slate-800 block mb-1.5">
                    {t('symptoms')}:
                  </span>
                  <ul className="space-y-1 text-xs text-slate-600">
                    {result.observableSigns.map((sign, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-emerald-600 font-bold">•</span>
                        <span>{sign}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Immediate First Aid & Care Guidance */}
              <div>
                <span className="text-xs font-bold text-slate-800 block mb-1.5">
                  {t('immediateCare')}:
                </span>
                <div className="space-y-1.5">
                  {result.immediateCareGuidance.map((care, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 leading-snug"
                    >
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{care}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Feed Adjustment */}
              <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-950">
                <strong className="block mb-0.5 font-bold">🌾 {t('feed')}:</strong>
                <span>{result.feedAdjustment}</span>
              </div>

              {/* Prominent Veterinary Disclaimer */}
              <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 text-[11px] text-slate-500 leading-tight">
                <strong>{t('vets')}:</strong> {result.disclaimer}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={onOpenVeterinary}
                  className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs py-2.5 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>{t('callNow')}</span>
                </button>

                <button
                  onClick={handleSaveReport}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{savedSuccess ? t('savedNotification') : t('saveChanges')}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-8 text-center text-slate-400 space-y-3 sticky top-20">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-3xl mx-auto text-slate-400">
                🩺
              </div>
              <h4 className="font-extrabold text-slate-700 text-base">
                Ready for Health Check
              </h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                Upload a cow photo or select a quick test case, check observed symptoms, and tap <strong>Run AI Health Screening</strong>.
              </p>
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-[11px] font-medium border border-emerald-100 text-left">
                <strong>Why Visual AI?</strong> Early detection of subclinical mastitis, skin nodules, or bloat allows immediate first-aid before milk production permanently drops.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
