import React, { useState } from 'react';
import {
  Volume2,
  Sparkles,
  HelpCircle,
  Lightbulb,
  CheckCircle2,
  Sun,
  CloudRain,
  Snowflake,
  ShieldAlert,
} from 'lucide-react';

interface AdvisoryTopic {
  id: string;
  category: string;
  title: string;
  situation: string;
  simpleAdvice: string;
  actionPoints: string[];
  icon: string;
  badgeColor: string;
}

const ADVISORIES: AdvisoryTopic[] = [
  {
    id: 'adv-1',
    category: 'Seasonal: Monsoon / Rains',
    title: 'Preventing Wet Hoof Rot & Udder Mastitis During Rains',
    situation: 'Damp sheds, muddy corrals, and high humidity',
    simpleAdvice:
      'Keep the resting stall dry using lime powder and dry straw. Wash teats with clean water and dip in teat dip after every milking.',
    actionPoints: [
      'Sprinkle dry slaked lime (choona) on muddy shed floors twice a week to kill bacteria.',
      'Never let cows sit down on damp manure within 30 minutes after milking (the teat canal takes 30 mins to close).',
      'Walk cows through a 5% copper sulfate or potassium permanganate footbath to toughen hoof claws.'
    ],
    icon: '🌧️',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
  },
  {
    id: 'adv-2',
    category: 'Seasonal: Summer Heat',
    title: 'Managing Heat Stress to Prevent Milk Drop in Crossbreds & Buffaloes',
    situation: 'Temperatures exceeding 35°C (95°F) with rapid panting',
    simpleAdvice:
      'Feed 65% of daily feed during the cool night and early morning hours. Splash buffaloes with cool water 3 times a day.',
    actionPoints: [
      'Provide continuous shade and unobstructed airflow using fans or porous green mesh.',
      'Add 50 grams of sodium bicarbonate (baking soda) per cow daily to prevent rumen acidosis caused by panting.',
      'Keep water troughs clean and placed in deep shade. Buffaloes must wallow or be washed at 11 AM and 2 PM.'
    ],
    icon: '☀️',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
  },
  {
    id: 'adv-3',
    category: 'Nutrition & Milk Fat',
    title: 'How to Naturally Increase Milk Fat Percentage',
    situation: 'Milk fat drops below 3.5% in cows or below 6.5% in buffaloes',
    simpleAdvice:
      'Always chaff green fodder and mix it with dry wheat or paddy straw. Do not overfeed finely ground flour or raw starch.',
    actionPoints: [
      'Maintain at least 4-5 kg of dry straw (bhusa) daily. Chewing dry fiber generates acetic acid, which directly produces milk fat.',
      'Avoid sudden increase in grains. Grains lower rumen pH and suppress butterfat synthesis.',
      'Supplement 150-200g of cottonseed cake or bypass fat per day for high yielders.'
    ],
    icon: '🥛',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  },
  {
    id: 'adv-4',
    category: 'Transition & Calving',
    title: 'Preparing Dry Cows 3 Weeks Before Delivery (Steaming Up)',
    situation: 'Cow in 8th month of pregnancy getting ready to deliver',
    simpleAdvice:
      'Gradually introduce the lactation concentrate feed 15 days before calving to adapt rumen microbes, but avoid excessive calcium.',
    actionPoints: [
      'Feed 1.5 to 2.0 kg of concentrate feed daily before calving to build energy reserves.',
      'Do NOT feed high-calcium supplements (calcium gel/syrup) before calving—this prevents Milk Fever after birth.',
      'Provide clean, quiet maternity stall with soft dry straw bedding.'
    ],
    icon: '🍼',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
  },
  {
    id: 'adv-5',
    category: 'Feed Safety',
    title: 'Silage Feeding: Identifying Moderate vs Poor Quality',
    situation: 'Silage has a sour smell or slight warming',
    simpleAdvice:
      '“Check the storage condition and consider further testing before regular use. Air out feed for 2 hours before offering.”',
    actionPoints: [
      'Never feed dark slimy or white-mold encrusted top layer to milking cows.',
      'Feed freshly removed silage within 12 hours. Do not allow it to heat in feeding troughs.',
      'If cows hesitate to eat, mix with appetizing dry straw or green fodder.'
    ],
    icon: '🌾',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
  }
];

export const FarmerAdvisory: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [customQuestion, setCustomQuestion] = useState('');
  const [customAnswer, setCustomAnswer] = useState<string | null>(null);

  const categories = ['all', 'Seasonal: Monsoon / Rains', 'Seasonal: Summer Heat', 'Nutrition & Milk Fat', 'Transition & Calving', 'Feed Safety'];

  const filteredAdvisories = ADVISORIES.filter((adv) => {
    const matchesCat = selectedCategory === 'all' || adv.category === selectedCategory;
    const matchesSearch =
      adv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      adv.simpleAdvice.toLowerCase().includes(searchQuery.toLowerCase()) ||
      adv.situation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleAskQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuestion.trim()) return;

    const lower = customQuestion.toLowerCase();
    let advice = '';

    if (lower.includes('fat') || lower.includes('fat%') || lower.includes('cream')) {
      advice =
        'To boost milk fat: Increase dry wheat straw (bhusa) to 4-5 kg/day. Ensure green fodder is chopped to 1.5 inches. Add 100g roasted cottonseed cake or mineral mixture. Avoid finely ground flour which causes rumen acidosis.';
    } else if (lower.includes('eat') || lower.includes('not eating') || lower.includes('appetite') || lower.includes('feed refusal')) {
      advice =
        'If a cow stops eating: Check rectal temperature first (normal is 101.5°F). Inspect mouth for sores, lodged wires, or foot lesions. Offer fresh wilted green grass instead of concentrate. If fever or dullness persists over 12 hours, call your local veterinarian.';
    } else if (lower.includes('bloat') || lower.includes('swollen') || lower.includes('gas')) {
      advice =
        'For urgent bloat: Keep cow standing with front legs elevated. Drench 250ml vegetable or mustard oil to break gas foam. Tie a smooth wooden bit in mouth to stimulate belching. Stop all concentrate and lush clover legumes immediately.';
    } else if (lower.includes('mastitis') || lower.includes('udder') || lower.includes('clots')) {
      advice =
        'For udder swelling or milk clots: Strip out the infected quarter completely every 2 hours into a disinfectant bucket. Apply cold compresses if hot. Dip teats in antiseptic iodine. Do not mix this milk with herd supply and consult veterinarian for teat infusion.';
    } else if (lower.includes('deworm') || lower.includes('worm')) {
      advice =
        'Deworming guidance: Deworm cows every 3-4 months, ideally before the monsoon and after monsoon. Rotate anthelmintics (Albendazole, Fenbendazole, Ivermectin). Always administer on an empty stomach in the early morning.';
    } else {
      advice =
        'General Livestock Advisory: Maintain consistent feeding times daily, provide 24/7 clean non-saline water, ensure dry bedding for teat hygiene, and feed a 70:30 ratio of green to dry fodder mixed with 50-80g mineral mixture.';
    }

    setCustomAnswer(advice);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">📢</span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Farmer Advisory Hub
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Easy-to-understand recommendations in plain farmer language — actionable, direct, and practical.
          </p>
        </div>

        <span className="text-xs font-bold bg-amber-100 text-amber-800 px-3 py-1 rounded-full border border-amber-200 self-start sm:self-auto">
          Plain Language Advice
        </span>
      </div>

      {/* Instant Question Lookup */}
      <div className="bg-gradient-to-br from-emerald-800 to-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-lg space-y-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
            Instant Farmer Query
          </span>
          <h3 className="text-lg sm:text-xl font-black text-white mt-1">
            Ask any Dairy, Feeding, or Livestock Health Question
          </h3>
          <p className="text-xs text-emerald-100/90 mt-0.5">
            Get instant, clear guidance without technical jargon. Works 100% offline.
          </p>
        </div>

        <form onSubmit={handleAskQuestion} className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={customQuestion}
            onChange={(e) => setCustomQuestion(e.target.value)}
            placeholder="e.g. How to increase milk fat? / Cow not eating green fodder / Udder feels hard..."
            className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-emerald-200/60 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
          <button
            type="submit"
            className="bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-bold px-6 py-3 rounded-xl text-sm transition-all shadow-md shrink-0 cursor-pointer"
          >
            Get Advisory
          </button>
        </form>

        {customAnswer && (
          <div className="p-4 rounded-2xl bg-white/15 border border-white/20 text-emerald-50 text-xs sm:text-sm leading-relaxed animate-fade-in space-y-2">
            <div className="flex items-center gap-2 text-emerald-300 font-bold">
              <Lightbulb className="w-4 h-4" />
              <span>Recommended Farm Advisory:</span>
            </div>
            <p className="text-white font-medium">{customAnswer}</p>
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              selectedCategory === cat
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {cat === 'all' ? 'All Advisories' : cat}
          </button>
        ))}
      </div>

      {/* Advisory Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredAdvisories.map((adv) => (
          <div
            key={adv.id}
            className="bg-white border border-slate-200 hover:border-emerald-300 rounded-2xl p-5 sm:p-6 shadow-xs transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-2xl">{adv.icon}</span>
                <span
                  className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border ${adv.badgeColor}`}
                >
                  {adv.category}
                </span>
              </div>

              <div>
                <h3 className="font-extrabold text-slate-900 text-base leading-snug">
                  {adv.title}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  <strong>Trigger:</strong> {adv.situation}
                </p>
              </div>

              {/* Simple Farmer Advice Box */}
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 text-xs font-semibold leading-relaxed">
                "{adv.simpleAdvice}"
              </div>

              {/* Action Steps */}
              <div className="space-y-1.5 pt-1">
                <span className="text-xs font-bold text-slate-700 block">
                  Action Steps for the Farmer:
                </span>
                {adv.actionPoints.map((pt, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-600 leading-snug">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
