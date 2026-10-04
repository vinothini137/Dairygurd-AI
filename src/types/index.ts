export type LactationStage =
  | 'Early Lactation'
  | 'Peak Lactation'
  | 'Mid Lactation'
  | 'Late Lactation'
  | 'Dry / Pregnant'
  | 'Heifer'
  | 'Calf';

export interface CowProfile {
  id: string;
  tagNumber: string;
  name: string;
  breed: string;
  ageYears: number;
  ageMonths: number;
  weightKg: number;
  lactationStage: LactationStage;
  dailyYieldLiters: number;
  fatPercentage?: number;
  bcs?: number; // Body condition score 1-5
  lastVaccinationDate?: string;
  lastDewormingDate?: string;
  nextVaccinationDate?: string;
  healthNotes?: string;
  photoUrl?: string;
  createdAt: string;
}

export interface FeedGuidanceResult {
  cowId?: string;
  cowName?: string;
  breed?: string;
  weightKg: number;
  dailyYieldLiters: number;
  lactationStage: LactationStage;
  dryMatterKg: number;
  greenFodderKg: number;
  dryFodderKg: number;
  concentrateKg: number;
  mineralMixGrams: number;
  saltGrams: number;
  waterLitersMin: number;
  waterLitersMax: number;
  energyTdnKg: number;
  crudeProteinGrams: number;
  feedingSchedule: {
    time: string;
    action: string;
    portion: string;
  }[];
  precautions: string[];
  seasonalTip: string;
  dateCalculated: string;
}

export interface HealthCheckResult {
  id: string;
  cowId?: string;
  cowName?: string;
  date: string;
  imageBase64?: string;
  sampleName?: string;
  possibleHealthConcern: string;
  urgencyLevel: 'Normal' | 'Low Concern' | 'Moderate Concern' | 'Urgent Veterinary Attention';
  observableSigns: string[];
  immediateCareGuidance: string[];
  feedAdjustment: string;
  isolationRecommended: boolean;
  advisorySummary: string;
  disclaimer: string;
}

export interface FeedQualityResult {
  id: string;
  date: string;
  feedType: string;
  qualityResult: 'Good' | 'Moderate' | 'Poor' | 'Needs Further Testing';
  score: number;
  contaminationWarning: boolean;
  adulterationRisk: string | null;
  advisorySummary: string;
  storageRecommendations: string[];
  recommendations: string[];
  laboratoryRecommended: boolean;
  disclaimer: string;
  moistureInput?: string;
  smellInput?: string;
  colorInput?: string;
  phInput?: number;
  temperatureInput?: string;
}

export interface VetDoctor {
  id: string;
  name: string;
  degree: string;
  specialty: string;
  clinicName: string;
  address: string;
  city: string;
  phone: string;
  emergencyAvailable: boolean;
  experienceYears: number;
  consultationFee?: string;
  rating: number;
  isCustom?: boolean;
}

export interface TestingLab {
  id: string;
  name: string;
  accreditedBy: string;
  address: string;
  city: string;
  phone: string;
  email?: string;
  turnaroundDays: string;
  testsOffered: string[];
  sampleInstructions: string;
  pricingEstimate?: string;
  isCustom?: boolean;
}

export type MarketCategory = 'milk' | 'cattle' | 'feed' | 'dairy_products';
export type MarketListingType = 'sell' | 'buy';

export interface MarketListing {
  id: string;
  title: string;
  category: MarketCategory;
  type: MarketListingType;
  price: number;
  priceUnit: string; // e.g. "per Liter", "per Head", "per Quintal / 100kg", "per kg"
  quantity: string;
  location: string;
  sellerName: string;
  sellerPhone: string;
  description: string;
  imageUrl?: string;
  datePosted: string;
  badge?: string;
}

export interface ReminderItem {
  id: string;
  cowId?: string;
  cowName?: string;
  title: string;
  type: 'vaccination' | 'deworming' | 'feed_order' | 'vet_checkup' | 'calving';
  dueDate: string;
  completed: boolean;
  notes?: string;
}
