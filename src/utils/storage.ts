import {
  CowProfile,
  FeedGuidanceResult,
  HealthCheckResult,
  FeedQualityResult,
  VetDoctor,
  TestingLab,
  MarketListing,
  ReminderItem,
} from '../types';
import {
  INITIAL_COWS,
  INITIAL_VETS,
  INITIAL_LABS,
  INITIAL_MARKETPLACE,
  INITIAL_REMINDERS,
} from '../data/mockData';

const KEYS = {
  COWS: 'dairyguard_cows_v1',
  FEED_HISTORY: 'dairyguard_feed_history_v1',
  HEALTH_RECORDS: 'dairyguard_health_records_v1',
  FEED_QUALITY_RECORDS: 'dairyguard_feed_quality_records_v1',
  VETS: 'dairyguard_vets_v1',
  LABS: 'dairyguard_labs_v1',
  MARKETPLACE: 'dairyguard_marketplace_v1',
  REMINDERS: 'dairyguard_reminders_v1',
  OFFLINE_SIMULATION: 'dairyguard_offline_sim_v1',
  USER_LANGUAGE: 'dairyguard_lang_v1',
};

// Generic storage helpers
function getFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;
    return JSON.parse(item) as T;
  } catch (e) {
    console.warn(`Error reading key ${key} from localStorage:`, e);
    return defaultValue;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Error writing key ${key} to localStorage:`, e);
  }
}

// Cows
export function getSavedCows(): CowProfile[] {
  return getFromStorage<CowProfile[]>(KEYS.COWS, INITIAL_COWS);
}

export function saveCow(cow: CowProfile): CowProfile[] {
  const current = getSavedCows();
  const index = current.findIndex((c) => c.id === cow.id);
  let updated: CowProfile[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = cow;
  } else {
    updated = [cow, ...current];
  }
  saveToStorage(KEYS.COWS, updated);
  return updated;
}

export function deleteCow(id: string): CowProfile[] {
  const current = getSavedCows();
  const updated = current.filter((c) => c.id !== id);
  saveToStorage(KEYS.COWS, updated);
  return updated;
}

// Feed Guidance History
export function getFeedHistory(): FeedGuidanceResult[] {
  return getFromStorage<FeedGuidanceResult[]>(KEYS.FEED_HISTORY, []);
}

export function saveFeedHistory(record: FeedGuidanceResult): FeedGuidanceResult[] {
  const current = getFeedHistory();
  const updated = [record, ...current].slice(0, 50); // keep up to 50
  saveToStorage(KEYS.FEED_HISTORY, updated);
  return updated;
}

// Health Check Records
export function getHealthRecords(): HealthCheckResult[] {
  return getFromStorage<HealthCheckResult[]>(KEYS.HEALTH_RECORDS, []);
}

export function saveHealthRecord(record: HealthCheckResult): HealthCheckResult[] {
  const current = getHealthRecords();
  const updated = [record, ...current].slice(0, 50);
  saveToStorage(KEYS.HEALTH_RECORDS, updated);
  return updated;
}

// Feed Quality Records
export function getFeedQualityRecords(): FeedQualityResult[] {
  return getFromStorage<FeedQualityResult[]>(KEYS.FEED_QUALITY_RECORDS, []);
}

export function saveFeedQualityRecord(record: FeedQualityResult): FeedQualityResult[] {
  const current = getFeedQualityRecords();
  const updated = [record, ...current].slice(0, 50);
  saveToStorage(KEYS.FEED_QUALITY_RECORDS, updated);
  return updated;
}

// Vets
export function getVets(): VetDoctor[] {
  return getFromStorage<VetDoctor[]>(KEYS.VETS, INITIAL_VETS);
}

export function addCustomVet(vet: VetDoctor): VetDoctor[] {
  const current = getVets();
  const updated = [vet, ...current];
  saveToStorage(KEYS.VETS, updated);
  return updated;
}

// Labs
export function getLabs(): TestingLab[] {
  return getFromStorage<TestingLab[]>(KEYS.LABS, INITIAL_LABS);
}

export function addCustomLab(lab: TestingLab): TestingLab[] {
  const current = getLabs();
  const updated = [lab, ...current];
  saveToStorage(KEYS.LABS, updated);
  return updated;
}

// Marketplace
export function getMarketplaceListings(): MarketListing[] {
  return getFromStorage<MarketListing[]>(KEYS.MARKETPLACE, INITIAL_MARKETPLACE);
}

export function addMarketplaceListing(item: MarketListing): MarketListing[] {
  const current = getMarketplaceListings();
  const updated = [item, ...current];
  saveToStorage(KEYS.MARKETPLACE, updated);
  return updated;
}

// Reminders
export function getReminders(): ReminderItem[] {
  return getFromStorage<ReminderItem[]>(KEYS.REMINDERS, INITIAL_REMINDERS);
}

export function saveReminder(rem: ReminderItem): ReminderItem[] {
  const current = getReminders();
  const index = current.findIndex((r) => r.id === rem.id);
  let updated: ReminderItem[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = rem;
  } else {
    updated = [rem, ...current];
  }
  saveToStorage(KEYS.REMINDERS, updated);
  return updated;
}

export function toggleReminderComplete(id: string): ReminderItem[] {
  const current = getReminders();
  const updated = current.map((r) => (r.id === id ? { ...r, completed: !r.completed } : r));
  saveToStorage(KEYS.REMINDERS, updated);
  return updated;
}

export function deleteReminder(id: string): ReminderItem[] {
  const current = getReminders();
  const updated = current.filter((r) => r.id !== id);
  saveToStorage(KEYS.REMINDERS, updated);
  return updated;
}

// Offline Simulation Flag
export function getOfflineSimState(): boolean {
  return getFromStorage<boolean>(KEYS.OFFLINE_SIMULATION, false);
}

export function setOfflineSimState(state: boolean): void {
  saveToStorage(KEYS.OFFLINE_SIMULATION, state);
}

// Backup & Restore
export function exportFarmDataJson(): string {
  const backup = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    cows: getSavedCows(),
    feedHistory: getFeedHistory(),
    healthRecords: getHealthRecords(),
    feedQualityRecords: getFeedQualityRecords(),
    vets: getVets(),
    labs: getLabs(),
    marketplace: getMarketplaceListings(),
    reminders: getReminders(),
  };
  return JSON.stringify(backup, null, 2);
}

export function importFarmDataJson(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString);
    if (data.cows) saveToStorage(KEYS.COWS, data.cows);
    if (data.feedHistory) saveToStorage(KEYS.FEED_HISTORY, data.feedHistory);
    if (data.healthRecords) saveToStorage(KEYS.HEALTH_RECORDS, data.healthRecords);
    if (data.feedQualityRecords) saveToStorage(KEYS.FEED_QUALITY_RECORDS, data.feedQualityRecords);
    if (data.vets) saveToStorage(KEYS.VETS, data.vets);
    if (data.labs) saveToStorage(KEYS.LABS, data.labs);
    if (data.marketplace) saveToStorage(KEYS.MARKETPLACE, data.marketplace);
    if (data.reminders) saveToStorage(KEYS.REMINDERS, data.reminders);
    return true;
  } catch (err) {
    console.error('Import failed:', err);
    return false;
  }
}
