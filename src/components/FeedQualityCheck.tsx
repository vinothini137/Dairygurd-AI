import React, { useState } from 'react';
import {
  Wheat,
  Upload,
  AlertTriangle,
  CheckCircle2,
  AlertOctagon,
  ShieldCheck,
  FlaskConical,
  RefreshCw,
  Info,
  Camera,
  X,
  Sparkles,
} from 'lucide-react';
import { FeedQualityResult } from '../types';
import { FEED_SAMPLE_CASES } from '../data/mockData';

interface FeedQualityCheckProps {
  onSaveQualityResult: (result: FeedQualityResult) => void;
  onOpenLabs: () => void;
  isOperatingOffline: boolean;
}

const FEED_TYPES = [
  'Corn Silage (मक्का साइलेज)',
  'Sorghum / Jowar Silage',
  'Green Fodder (Napier / Berseem / Maize)',
  'Dry Straw / Bhusa (Wheat / Paddy)',
  'Cattle Feed Concentrate Pellets',
  'Commercial Mash / Oil Cake (Mustard / Cottonseed)',
  'Total Mixed Ration (TMR)',
];

const SMELL_OPTIONS = [
  'Sweet & Pleasant / Bread Aroma (Ideal)',
  'Vinegary / Sharp Acidic (Acetic Acid)',
  'Musty / Moldy (Fungal Spores)',
  'Butyric / Rotten / Rancid (Clostridial)',
  'Ammonia / Pungent (Protein Breakdown)',
  'Normal Neutral Straw',
];

const COLOR_OPTIONS = [
  'Olive Green to Yellow-Golden (Optimal)',
  'Light Greenish-Brown',
  'Dark Brown / Charred (Overheated)',
  'Black / Slimy (Rotten / Air Leaks)',
  'White / Grey Mold Patches',
  'Normal Golden Straw',
];

const MOISTURE_OPTIONS = [
  'Optimal (~65-68% for Silage, ~10% for Dry Feed)',
  'Dry / Low Moisture (< 55% for silage)',
  'Damp / Moderately High',
  'Very Wet / Soggy (> 75% for silage)',
];

const TEMP_OPTIONS = [
  'Ambient / Cool (< 25°C / 77°F)',
  'Warm (30°C - 40°C)',
  'Hot (> 45°C / 113°F - Aerobic Heating)',
];

export const FeedQualityCheck: React.FC<FeedQualityCheckProps> = ({
  onSaveQualityResult,
  onOpenLabs,
  isOperatingOffline,
}) => {
  const [feedType, setFeedType] = useState(FEED_TYPES[0]);
  const [moisture, setMoisture] = useState(MOISTURE_OPTIONS[0]);
  const [smell, setSmell] = useState(SMELL_OPTIONS[0]);
  const [color, setColor] = useState(COLOR_OPTIONS[0]);
  const [ph, setPh] = useState<string>('3.9');
  const [temperature, setTemperature] = useState(TEMP_OPTIONS[0]);
  const [hasMold, setHasMold] = useState<boolean>(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [additionalNotes, setAdditionalNotes] = useState('');

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<FeedQualityResult | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Load preset sample
  const handleSelectSample = (sample: (typeof FEED_SAMPLE_CASES)[0]) => {
    setFeedType(sample.feedType);
    setMoisture(sample.moisture);
    setSmell(sample.smell);
    setColor(sample.color);
    setPh(sample.ph ? sample.ph.toString() : '');
    setTemperature(sample.temperature);
    setHasMold(sample.hasMold);
    setAdditionalNotes(sample.notes);
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

  const runQualityCheck = async () => {
    setIsAnalyzing(true);

    try {
      const payload = {
        feedType,
        moisture,
        smell,
        color,
        ph: ph ? Number(ph) : undefined,
        temperature,
        hasMold,
        imageBase64: imagePreview || undefined,
        additionalNotes,
      };

      const res = await fetch('/api/feed-quality-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();

      const qualityRecord: FeedQualityResult = {
        id: `feed-qual-${Date.now()}`,
        date: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        feedType,
        qualityResult: data.qualityResult || 'Moderate',
        score: data.score || 70,
        contaminationWarning: Boolean(data.contaminationWarning),
        adulterationRisk: data.adulterationRisk || null,
        advisorySummary: data.advisorySummary || 'Feed quality evaluated.',
        storageRecommendations: data.storageRecommendations || [],
        recommendations: data.recommendations || [],
        laboratoryRecommended: Boolean(data.laboratoryRecommended),
        disclaimer:
          data.disclaimer ||
          'Feed screening evaluation based on agronomic standards. For commercial guarantee, submit to an accredited lab.',
        moistureInput: moisture,
        smellInput: smell,
        colorInput: color,
        phInput: ph ? Number(ph) : undefined,
        temperatureInput: temperature,
      };

      setResult(qualityRecord);
    } catch (err) {
      console.warn('Network call failed, utilizing offline heuristic quality engine:', err);
      // Offline fallback evaluation
      const isBadSmell = smell.includes('Butyric') || smell.includes('Ammonia') || smell.includes('Moldy');
      const isBadColor = color.includes('Mold') || color.includes('Black') || color.includes('Dark Brown');

      let qualResult: 'Good' | 'Moderate' | 'Poor' | 'Needs Further Testing' = 'Good';
      let score = 88;
      let warn = false;
      let risk: string | null = null;
      let advisory = 'Your feed sample appears in suitable condition for regular cattle feeding.';

      if (hasMold || smell.includes('Moldy') || color.includes('Mold')) {
        qualResult = 'Poor';
        score = 25;
        warn = true;
        risk = 'High risk of fungal Aflatoxins (Aspergillus flavus). Feeding moldy silage causes severe milk drop, immune suppression, and abortion in pregnant cows.';
        advisory = 'Possible Quality Risk Detected. Visible mold indicates mycotoxin contamination. Avoid feeding this batch until tested.';
      } else if (smell.includes('Butyric') || (ph && Number(ph) > 4.8)) {
        qualResult = 'Poor';
        score = 35;
        warn = true;
        risk = 'Severe Clostridial fermentation detected (high butyric acid & ammonia). Indicates poor packing or high moisture at harvest.';
        advisory = 'Possible Quality Risk Detected. Clostridial silage causes ketosis, off-flavor in milk, and feed refusal.';
      } else if (temperature.includes('Hot') || smell.includes('Vinegary')) {
        qualResult = 'Moderate';
        score = 65;
        advisory = 'Moderate quality. Aerobic heating detected. Feed quickly after removal from pit face to prevent secondary spoilage.';
      }

      const qualityRecord: FeedQualityResult = {
        id: `feed-qual-${Date.now()}`,
        date: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        feedType,
        qualityResult: qualResult,
        score,
        contaminationWarning: warn,
        adulterationRisk: risk,
        advisorySummary: advisory,
        storageRecommendations: [
          'Maintain clean bunker face by shearing at least 15-20 cm daily.',
          'Inspect airtight poly-wrap for puncture holes and seal immediately with UV tape.',
          'Keep silage pit surface covered tightly with tires or gravel bags.',
        ],
        recommendations: [
          'Discard visibly moldy or spoiled outer crust layer completely.',
          'Mix good silage with dry straw to prevent acidosis.',
        ],
        laboratoryRecommended: warn,
        disclaimer:
          'Feed screening evaluation based on agronomic standards. For certified legal or commercial confirmation, submit samples to an accredited testing laboratory.',
      };

      setResult(qualityRecord);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSave = () => {
    if (result) {
      onSaveQualityResult(result);
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
            <span className="text-2xl">🔬</span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Feed & Silage Quality Check
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Detect poor fermentation, spoilage heating, and adulteration/mycotoxin contamination risks.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={onOpenLabs}
            className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <FlaskConical className="w-3.5 h-3.5" />
            <span>Nearby Testing Labs</span>
          </button>
        </div>
      </div>

      {/* Preset Test Scenarios */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            Quick Test Cases (Click to load sample inputs):
          </span>
          <span className="text-[10px] text-slate-500">Preset Scenarios</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-thin">
          {FEED_SAMPLE_CASES.map((sample) => (
            <button
              key={sample.id}
              onClick={() => handleSelectSample(sample)}
              className="text-left shrink-0 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-xl p-2.5 transition-all text-xs cursor-pointer shadow-2xs"
            >
              <div className="font-extrabold text-slate-900">{sample.name}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                {sample.feedType} • {sample.smell.split('/')[0]}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input parameters & checklist (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Feed Type */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              1. Type of Cattle Feed or Silage *
            </label>
            <select
              value={feedType}
              onChange={(e) => setFeedType(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            >
              {FEED_TYPES.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>

          {/* Physical Attributes Checklist */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <span>🔎</span>
              <span>2. Sensory & Physical Observations</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Smell / Odor */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Smell / Odor *
                </label>
                <select
                  value={smell}
                  onChange={(e) => setSmell(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                >
                  {SMELL_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* Color */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Color Appearance *
                </label>
                <select
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                >
                  {COLOR_OPTIONS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Moisture */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Moisture Level (Squeeze Feel) *
                </label>
                <select
                  value={moisture}
                  onChange={(e) => setMoisture(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                >
                  {MOISTURE_OPTIONS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              {/* Temperature */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Temperature in Pit / Bag
                </label>
                <select
                  value={temperature}
                  onChange={(e) => setTemperature(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                >
                  {TEMP_OPTIONS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Silage pH & Mold Toggle */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Silage pH (Optional pH strip result)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="3.0"
                  max="8.0"
                  value={ph}
                  onChange={(e) => setPh(e.target.value)}
                  placeholder="e.g. 3.8 to 4.2"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
                <span className="text-[10px] text-slate-400">Optimal corn silage pH is 3.8 - 4.2</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Visible Fungal Mold
                </label>
                <button
                  type="button"
                  onClick={() => setHasMold(!hasMold)}
                  className={`w-full py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                    hasMold
                      ? 'bg-rose-100 border-rose-400 text-rose-800'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {hasMold ? (
                    <>
                      <AlertOctagon className="w-4 h-4 text-rose-600" />
                      <span>Yes, Mold Detected!</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>No Visible Mold</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Photo Upload (Optional) */}
            <div className="pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Upload Feed Photo (Optional)
              </label>
              {imagePreview ? (
                <div className="relative rounded-xl overflow-hidden border border-slate-200 max-h-48 flex items-center justify-center bg-slate-900">
                  <img
                    src={imagePreview}
                    alt="Feed sample"
                    className="max-h-48 w-full object-contain"
                  />
                  <button
                    onClick={() => setImagePreview(null)}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/80 text-white hover:bg-slate-900 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="border border-dashed border-slate-300 hover:border-emerald-500 bg-slate-50 hover:bg-emerald-50/20 rounded-xl p-3 flex items-center justify-center gap-2 cursor-pointer text-xs font-semibold text-slate-600">
                  <Camera className="w-4 h-4 text-emerald-700" />
                  <span>Attach photo of feed / bunker face</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Additional notes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Additional Notes
              </label>
              <input
                type="text"
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                placeholder="e.g. Silo opened 10 days ago, pit uncovered during rain..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              />
            </div>
          </div>

          <button
            onClick={runQualityCheck}
            disabled={isAnalyzing}
            className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-98 disabled:opacity-50 text-white font-extrabold text-sm py-3.5 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Evaluating Feed Fermentation & Contamination...</span>
              </>
            ) : (
              <>
                <span>🔬 Analyze Feed & Silage Quality</span>
              </>
            )}
          </button>
        </div>

        {/* Right: Diagnostic Quality Output (5 cols) */}
        <div className="lg:col-span-5">
          {result ? (
            <div className="bg-white border-2 border-slate-300 rounded-3xl p-5 sm:p-6 shadow-lg space-y-5 sticky top-20 animate-fade-in">
              {/* Quality Result Badge */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                  Quality Evaluation
                </span>

                <span
                  className={`text-xs font-black px-3 py-1 rounded-full border ${
                    result.qualityResult === 'Good'
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      : result.qualityResult === 'Moderate'
                      ? 'bg-amber-100 text-amber-800 border-amber-300'
                      : result.qualityResult === 'Poor'
                      ? 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse'
                      : 'bg-cyan-100 text-cyan-800 border-cyan-300'
                  }`}
                >
                  Grade: {result.qualityResult}
                </span>
              </div>

              {/* Score Gauge */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-bold text-slate-700">Agronomic Quality Score:</span>
                  <span className="text-2xl font-black text-slate-900">
                    {result.score} <span className="text-xs font-normal text-slate-400">/ 100</span>
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      result.score >= 75
                        ? 'bg-emerald-500'
                        : result.score >= 50
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${result.score}%` }}
                  />
                </div>
              </div>

              {/* ADULTERATION / CONTAMINATION WARNING BANNER (User Request #6) */}
              {result.contaminationWarning ? (
                <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center gap-2 text-rose-900 font-black text-sm">
                    <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                    <span>⚠️ Possible Quality Risk Detected!</span>
                  </div>

                  {result.adulterationRisk && (
                    <p className="text-xs text-rose-800 font-semibold leading-relaxed">
                      {result.adulterationRisk}
                    </p>
                  )}

                  <div className="pt-2 border-t border-rose-200/80 text-xs text-rose-950 font-bold space-y-1">
                    <p>• Avoid using the feed until it is properly checked.</p>
                    <p>• Check storage conditions and airtight sealing.</p>
                    <p>• Contact a laboratory for confirmation.</p>
                  </div>
                </div>
              ) : (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 flex items-center gap-2.5 text-xs text-emerald-950 font-semibold">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>No acute mycotoxin or clostridial risk detected. Safe for normal feeding.</span>
                </div>
              )}

              {/* Plain-Language Farmer Advisory (User Request #8) */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 mb-1">
                  <span>📢</span>
                  <span>Farmer Advisory</span>
                </div>
                <p className="text-xs font-semibold text-amber-950 leading-relaxed">
                  "{result.advisorySummary}"
                </p>
              </div>

              {/* Bunker & Storage Recommendations */}
              {result.storageRecommendations.length > 0 && (
                <div>
                  <span className="text-xs font-bold text-slate-800 block mb-1.5">
                    Storage & Bunker Care Recommendations:
                  </span>
                  <ul className="space-y-1 text-xs text-slate-600">
                    {result.storageRecommendations.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-emerald-600 font-bold">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Feeding Recommendations */}
              {result.recommendations.length > 0 && (
                <div>
                  <span className="text-xs font-bold text-slate-800 block mb-1.5">
                    Feeding Suggestions:
                  </span>
                  <ul className="space-y-1 text-xs text-slate-600">
                    {result.recommendations.map((rec, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-blue-600 font-bold">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Disclaimer */}
              <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 text-[11px] text-slate-500 leading-tight">
                <strong>Quality Screening Notice:</strong> {result.disclaimer}
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center gap-2">
                {result.laboratoryRecommended && (
                  <button
                    onClick={onOpenLabs}
                    className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs py-2.5 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <FlaskConical className="w-3.5 h-3.5" />
                    <span>Find Testing Lab</span>
                  </button>
                )}

                <button
                  onClick={handleSave}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{savedSuccess ? 'Saved to Records!' : 'Save Result'}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-8 text-center text-slate-400 space-y-3 sticky top-20">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-3xl mx-auto text-slate-400">
                🌾
              </div>
              <h4 className="font-extrabold text-slate-700 text-base">
                Ready for Feed Quality Check
              </h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                Provide feed type, smell, moisture, and color observations, then tap <strong>Analyze Feed & Silage Quality</strong>.
              </p>
              <div className="p-3 rounded-xl bg-amber-50 text-amber-800 text-[11px] font-medium border border-amber-100 text-left">
                <strong>Why Screen Feed?</strong> Moldy feed containing Aflatoxin B1 passes into cow milk as carcinogenic Aflatoxin M1, causing bulk tank milk rejection and cow liver damage.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
