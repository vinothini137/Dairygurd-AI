import React, { useState } from 'react';
import {
  Package,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Thermometer,
  Droplets,
  Layers,
  HelpCircle,
  Sparkles,
} from 'lucide-react';

export const SilageMonitoring: React.FC = () => {
  // Spoilage Risk Calculator inputs
  const [siloType, setSiloType] = useState('Bunker Silo (Concrete walls)');
  const [removalRateCm, setRemovalRateCm] = useState<number>(18);
  const [sealCondition, setSealCondition] = useState('Airtight with weights (No tears)');
  const [weatherTemp, setWeatherTemp] = useState('Warm (28°C - 35°C)');
  const [daysOpened, setDaysOpened] = useState<number>(14);

  // Squeeze Test interactive simulation
  const [squeezeResult, setSqueezeResult] = useState<'wet' | 'optimal' | 'dry'>('optimal');

  // Compute Spoilage Risk
  let riskScore = 0;
  if (removalRateCm < 12) riskScore += 35; // slow feed-out allows aerobic yeasts to grow
  else if (removalRateCm < 16) riskScore += 15;

  if (sealCondition === 'Tears / holes present') riskScore += 40;
  else if (sealCondition === 'Edges loose / partial air access') riskScore += 25;

  if (weatherTemp.includes('Hot')) riskScore += 25;
  else if (weatherTemp.includes('Warm')) riskScore += 15;

  const spoilageRiskLevel: 'Low' | 'Moderate' | 'High' =
    riskScore >= 50 ? 'High' : riskScore >= 25 ? 'Moderate' : 'Low';

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">📦</span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Feed Storage & Silage Monitoring
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Monitor bunker condition, evaluate aerobic spoilage risk, and master squeeze moisture testing.
          </p>
        </div>

        <span className="text-xs font-bold bg-purple-100 text-purple-800 px-3 py-1 rounded-full border border-purple-200 self-start sm:self-auto">
          Forage Preservation
        </span>
      </div>

      {/* Spoilage Risk Calculator & Storage Health Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input parameters */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <h2 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-purple-700" />
            <span>Silage Pit & Bunker Spoilage Risk Estimator</span>
          </h2>
          <p className="text-xs text-slate-500">
            Oxygen is the primary enemy of fermented silage. Calculate your current risk of heating, dry matter loss, and mold growth.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {/* Silo Type */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Storage Method / Pit Type
              </label>
              <select
                value={siloType}
                onChange={(e) => setSiloType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
              >
                <option value="Bunker Silo (Concrete walls)">Bunker Silo (Concrete walls)</option>
                <option value="Earthen Trench Pit">Earthen Trench Pit</option>
                <option value="Silage Bag (Tube Silo)">Silage Bag (Tube Silo)</option>
                <option value="Vacuum-Wrapped Bales">Vacuum-Wrapped Bales</option>
                <option value="Tower / Masonry Silo">Tower / Masonry Silo</option>
              </select>
            </div>

            {/* Daily Feed-out Rate (cm/day) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Daily Face Removal Rate: <strong>{removalRateCm} cm/day</strong>
              </label>
              <input
                type="range"
                min="5"
                max="35"
                value={removalRateCm}
                onChange={(e) => setRemovalRateCm(Number(e.target.value))}
                className="w-full accent-purple-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                <span>5 cm (Slow)</span>
                <span>15-20 cm (Recommended)</span>
                <span>35 cm (Rapid)</span>
              </div>
            </div>

            {/* Plastic Seal Integrity */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Plastic Sheet Seal Integrity
              </label>
              <select
                value={sealCondition}
                onChange={(e) => setSealCondition(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
              >
                <option value="Airtight with weights (No tears)">Airtight with weights (No tears)</option>
                <option value="Edges loose / partial air access">Edges loose / partial air access</option>
                <option value="Tears / holes present">Tears / puncture holes present</option>
              </select>
            </div>

            {/* Weather Temperature */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Ambient Air Temperature
              </label>
              <select
                value={weatherTemp}
                onChange={(e) => setWeatherTemp(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
              >
                <option value="Cool (< 20°C / 68°F)">Cool (&lt; 20°C / 68°F)</option>
                <option value="Warm (28°C - 35°C)">Warm (28°C - 35°C)</option>
                <option value="Hot (> 38°C / 100°F)">Hot (&gt; 38°C / 100°F - High Yeast Growth)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right: Risk Result Card */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Aerobic Spoilage Risk
              </span>
              <span
                className={`text-xs font-black px-3 py-1 rounded-full border ${
                  spoilageRiskLevel === 'High'
                    ? 'bg-rose-100 text-rose-800 border-rose-300'
                    : spoilageRiskLevel === 'Moderate'
                    ? 'bg-amber-100 text-amber-800 border-amber-300'
                    : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                }`}
              >
                {spoilageRiskLevel} Spoilage Risk
              </span>
            </div>

            <div className="mt-4">
              <h3 className="font-extrabold text-slate-900 text-lg">
                {spoilageRiskLevel === 'High'
                  ? '⚠️ High Spoilage & Mycotoxin Threat'
                  : spoilageRiskLevel === 'Moderate'
                  ? '⚡ Moderate Heating Risk Detected'
                  : '✅ Optimal Fermentation Protection'}
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {spoilageRiskLevel === 'High'
                  ? 'Air penetration into the face combined with slow feed-out activates wild yeast and molds, destroying precious corn starch and elevating aflatoxin risk.'
                  : spoilageRiskLevel === 'Moderate'
                  ? 'Feed-out rate is border-line or temperature is elevating. Watch out for warm spots on the face.'
                  : 'Your silage face management and airtight sealing are effectively suffocating aerobic yeasts. Starch and nutrient recovery will remain high.'}
              </p>
            </div>
          </div>

          <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-xs text-purple-950 font-semibold space-y-1">
            <strong>Key Corrective Action:</strong>
            <p className="font-normal">
              {removalRateCm < 15
                ? 'Increase face feed-out to at least 15-20 cm per day. Scrape across the full width uniformly without creating overhangs.'
                : sealCondition !== 'Airtight with weights (No tears)'
                ? 'Immediately patch plastic tears with UV-resistant silage tape and secure edges with gravel bags.'
                : 'Maintain current practices and test pH monthly.'}
            </p>
          </div>
        </div>
      </div>

      {/* Squeeze Moisture Test Interactive Visual Tool */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <Droplets className="w-5 h-5 text-blue-600" />
              <span>Interactive Squeeze Moisture Test (Before Packing Silage)</span>
            </h3>
            <p className="text-xs text-slate-500">
              The hand-squeeze test is the gold standard field method to verify moisture before packing chopped fodder into a pit.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Test 1: Too Wet */}
          <div
            onClick={() => setSqueezeResult('wet')}
            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
              squeezeResult === 'wet'
                ? 'border-rose-400 bg-rose-50/50 shadow-xs'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-2xl">💦</span>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-rose-100 text-rose-800">
                &gt; 72% Moisture
              </span>
            </div>
            <h4 className="font-bold text-slate-900 text-sm mt-3">
              Too Wet (Juice Runs Freely)
            </h4>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              When you squeeze a handful of chopped forage, water drips freely through fingers. Ball holds tight shape.
            </p>
            <div className="mt-3 pt-2 border-t border-rose-200/60 text-[11px] text-rose-900 font-bold">
              Danger: Seepage loss, sour clostridial fermentation, and high butyric acid odor.
            </div>
          </div>

          {/* Test 2: Optimal */}
          <div
            onClick={() => setSqueezeResult('optimal')}
            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
              squeezeResult === 'optimal'
                ? 'border-emerald-500 bg-emerald-50/50 shadow-xs'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-2xl">🌽</span>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                65% - 68% Moisture
              </span>
            </div>
            <h4 className="font-bold text-slate-900 text-sm mt-3">
              Optimal (Holds Shape, No Dripping)
            </h4>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Forage forms a ball that holds together. No liquid drips, but skin of palm is visibly damp.
            </p>
            <div className="mt-3 pt-2 border-t border-emerald-200/60 text-[11px] text-emerald-900 font-bold">
              Ideal: Rapid lactic acid drop (pH &lt; 4.0), high packing compaction, minimal nutrient loss.
            </div>
          </div>

          {/* Test 3: Too Dry */}
          <div
            onClick={() => setSqueezeResult('dry')}
            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
              squeezeResult === 'dry'
                ? 'border-amber-400 bg-amber-50/50 shadow-xs'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-2xl">🍂</span>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">
                &lt; 58% Moisture
              </span>
            </div>
            <h4 className="font-bold text-slate-900 text-sm mt-3">
              Too Dry (Ball Springs Apart)
            </h4>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Ball immediately breaks and springs apart as soon as you open your hand. Palm feels dry.
            </p>
            <div className="mt-3 pt-2 border-t border-amber-200/60 text-[11px] text-amber-900 font-bold">
              Danger: Difficult to compact out oxygen. Air pockets cause severe heating and white mold.
            </div>
          </div>
        </div>
      </div>

      {/* 4 Golden Rules of Silage Storage */}
      <div className="bg-gradient-to-br from-slate-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-7 shadow-lg space-y-4">
        <h3 className="font-extrabold text-lg sm:text-xl text-emerald-200">
          The 4 Golden Rules of Silage Storage & Preservation
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div className="bg-white/10 p-4 rounded-2xl border border-white/10 space-y-1.5">
            <span className="text-xl">🚜</span>
            <h4 className="font-bold text-sm text-emerald-300">1. Maximum Compaction</h4>
            <p className="text-xs text-emerald-100/80 leading-relaxed">
              Pack in thin 6-inch layers using heavy tractors. Target packing density of at least 240 kg DM/m³ to expel oxygen immediately.
            </p>
          </div>

          <div className="bg-white/10 p-4 rounded-2xl border border-white/10 space-y-1.5">
            <span className="text-xl">🛡️</span>
            <h4 className="font-bold text-sm text-emerald-300">2. Oxygen Barrier Seal</h4>
            <p className="text-xs text-emerald-100/80 leading-relaxed">
              Use virgin polyethylene black-and-white UV plastic (at least 150-200 microns). Place tires or gravel bags touching each other.
            </p>
          </div>

          <div className="bg-white/10 p-4 rounded-2xl border border-white/10 space-y-1.5">
            <span className="text-xl">✂️</span>
            <h4 className="font-bold text-sm text-emerald-300">3. Straight Vertical Face</h4>
            <p className="text-xs text-emerald-100/80 leading-relaxed">
              Never pull or dig into the bottom of the silo creating caves. Keep face vertical and tightly sheared to minimize oxygen surface area.
            </p>
          </div>

          <div className="bg-white/10 p-4 rounded-2xl border border-white/10 space-y-1.5">
            <span className="text-xl">⏰</span>
            <h4 className="font-bold text-sm text-emerald-300">4. Feed Out Fast</h4>
            <p className="text-xs text-emerald-100/80 leading-relaxed">
              Feed silage within 12 hours of face removal. Silage left sitting in feed alleys under hot sunlight begins fermenting into butyric acid.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
