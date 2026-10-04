import { CowProfile, FeedGuidanceResult, LactationStage } from '../types';

export function calculateFeedGuidance(
  cow: Partial<CowProfile> & {
    weightKg: number;
    dailyYieldLiters: number;
    lactationStage: LactationStage;
    breed?: string;
  }
): FeedGuidanceResult {
  const weight = Math.max(150, Math.min(900, cow.weightKg || 420));
  const yieldLiters = Math.max(0, Math.min(50, cow.dailyYieldLiters || 0));
  const stage = cow.lactationStage || 'Mid Lactation';
  const breed = cow.breed || 'Gir Cow';
  const isBuffalo = breed.toLowerCase().includes('buffalo') || breed.toLowerCase().includes('murrah');

  // Base Dry Matter (DM) calculation (2.5% to 3.2% of body weight)
  let dmBasePercentage = 2.5;
  if (isBuffalo) {
    dmBasePercentage = 2.7;
  } else if (breed.toLowerCase().includes('holstein') || breed.toLowerCase().includes('hf')) {
    dmBasePercentage = 3.0;
  } else if (breed.toLowerCase().includes('jersey')) {
    dmBasePercentage = 2.8;
  }

  // Maintenance DM in kg
  const maintenanceDm = (weight * dmBasePercentage) / 100;

  // Production DM in kg (approx 0.33 kg DM per liter milk)
  const productionDm = yieldLiters * (isBuffalo ? 0.38 : 0.33);

  // Total daily Dry Matter required
  const totalDmKg = Number((maintenanceDm + productionDm).toFixed(1));

  // Concentrate requirement (kg)
  // Maintenance: 1.5 - 2.0 kg
  let maintenanceConc = weight > 450 ? 2.0 : 1.5;
  if (stage === 'Dry / Pregnant') {
    // Steaming up for pregnant cow in third trimester
    maintenanceConc = 2.5;
  } else if (stage === 'Calf') {
    maintenanceConc = 0.8;
  } else if (stage === 'Heifer') {
    maintenanceConc = 1.2;
  }

  // Production concentrate: 1 kg for every 2.5L cow milk or 2.0L buffalo milk
  const productionConc = yieldLiters > 0 ? (isBuffalo ? yieldLiters * 0.45 : yieldLiters * 0.38) : 0;
  const totalConcKg = Number(Math.max(0.5, maintenanceConc + productionConc).toFixed(1));

  // Roughage Dry Matter = Total DM - Concentrate DM (assume concentrate is ~90% DM)
  const roughageDm = Math.max(2.0, totalDmKg - totalConcKg * 0.9);

  // Green Fodder contributes ~65% of roughage DM (green fodder is ~20-25% DM, so fresh weight = DM / 0.22)
  const greenDm = roughageDm * 0.65;
  const greenFodderFreshKg = Number(Math.max(8, Math.min(50, Math.round(greenDm / 0.22))).toFixed(0));

  // Dry Fodder (straw/bhusa) contributes ~35% of roughage DM (dry straw is ~90% DM, so fresh weight = DM / 0.9)
  const dryDm = roughageDm * 0.35;
  const dryFodderFreshKg = Number(Math.max(2, Math.min(12, dryDm / 0.9)).toFixed(1));

  // Mineral Mixture and Salt
  let mineralMix = 60;
  if (yieldLiters > 15) mineralMix = 100;
  else if (yieldLiters > 8) mineralMix = 80;
  else if (stage === 'Calf') mineralMix = 30;

  const saltGrams = stage === 'Calf' ? 20 : 40;

  // Water requirement (40-50L maintenance + 4-5L per liter milk produced)
  const baseWater = isBuffalo ? 55 : 45;
  const waterLitersMin = Math.round(baseWater + yieldLiters * 3.5);
  const waterLitersMax = Math.round(baseWater + yieldLiters * 4.8 + 15);

  // Energy & Crude Protein
  const energyTdnKg = Number((totalDmKg * 0.62).toFixed(1));
  const crudeProteinGrams = Math.round(350 + yieldLiters * 75 + weight * 0.6);

  // Daily feeding schedule
  const morningConc = (totalConcKg * 0.45).toFixed(1);
  const eveningConc = (totalConcKg * 0.45).toFixed(1);
  const noonConc = (totalConcKg * 0.1).toFixed(1);

  const morningGreen = Math.round(greenFodderFreshKg * 0.5);
  const eveningGreen = Math.round(greenFodderFreshKg * 0.5);

  const morningDry = (dryFodderFreshKg * 0.4).toFixed(1);
  const eveningDry = (dryFodderFreshKg * 0.6).toFixed(1);

  const feedingSchedule = [
    {
      time: '05:30 AM - 06:30 AM (Morning Milking)',
      action: 'Feed Milking Concentrate + Clean Water',
      portion: `${morningConc} kg Balanced Concentrate Feed + 30g Mineral Mixture + ad-libitum fresh water`,
    },
    {
      time: '08:00 AM - 09:30 AM (Post-Milking Roughage)',
      action: 'Chaffed Green & Dry Fodder Mix',
      portion: `${morningGreen} kg Green Fodder (chaffed) mixed with ${morningDry} kg Dry Straw to prevent bloat`,
    },
    {
      time: '01:00 PM - 02:00 PM (Afternoon Refreshment)',
      action: 'Hydration & Salt Lick / Light Ration',
      portion: `Abundant cool drinking water + 20g Common Salt + ${noonConc !== '0.0' ? noonConc + ' kg concentrate soak' : 'resting shade'}`,
    },
    {
      time: '05:00 PM - 06:00 PM (Evening Milking)',
      action: 'Evening Concentrate & Minerals',
      portion: `${eveningConc} kg Balanced Concentrate Feed + remaining mineral mix + fresh water`,
    },
    {
      time: '07:30 PM - 08:30 PM (Night Roughage)',
      action: 'Night Long-fiber Roughage',
      portion: `${eveningGreen} kg Green Fodder + ${eveningDry} kg Dry Fodder (supports steady overnight rumination and milk fat)`,
    },
  ];

  // Tailored precautions
  const precautions: string[] = [
    'Always chaff green fodder into 1-2 inch pieces and mix with dry straw to prevent selective eating and frothy bloat.',
    'Never introduce new concentrate feed or silage abruptly; transition gradually over 7 to 10 days to protect beneficial rumen microbes.',
    'Ensure 24/7 access to clean, non-saline drinking water. A 10% drop in water intake immediately causes a 15-20% drop in milk yield.',
  ];

  if (stage === 'Early Lactation' || stage === 'Peak Lactation') {
    precautions.push(
      'Peak lactation warning: Watch for negative energy balance (ketosis). Supplement 150-200g bypass fat or roasted grain if cow is losing body condition rapidly.'
    );
  }

  if (stage === 'Dry / Pregnant') {
    precautions.push(
      'Transition care: Limit excessive calcium intake 3 weeks before calving to activate the cow’s parathyroid hormone and avoid Milk Fever (hypocalcemia) after delivery.'
    );
  }

  if (isBuffalo) {
    precautions.push(
      'Buffalo specific: Murrah and buffaloes require higher water wallowing or frequent body splashing during hot hours to prevent heat stress and maintain high fat percentage.'
    );
  }

  const seasonalTip =
    'Seasonal Advisory: In high heat or humidity, feed 60% of daily ration during the cooler hours of early morning and evening to maintain dry matter intake.';

  return {
    cowId: cow.id,
    cowName: cow.name,
    breed,
    weightKg: weight,
    dailyYieldLiters: yieldLiters,
    lactationStage: stage,
    dryMatterKg: totalDmKg,
    greenFodderKg: greenFodderFreshKg,
    dryFodderKg: dryFodderFreshKg,
    concentrateKg: totalConcKg,
    mineralMixGrams: mineralMix,
    saltGrams,
    waterLitersMin,
    waterLitersMax,
    energyTdnKg,
    crudeProteinGrams,
    feedingSchedule,
    precautions,
    seasonalTip,
    dateCalculated: new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
  };
}
