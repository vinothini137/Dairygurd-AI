/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HomeDashboard } from './components/HomeDashboard';
import { CowManagement } from './components/CowManagement';
import { FeedRecommendation } from './components/FeedRecommendation';
import { AiHealthCheck } from './components/AiHealthCheck';
import { FeedQualityCheck } from './components/FeedQualityCheck';
import { SilageMonitoring } from './components/SilageMonitoring';
import { FarmerAdvisory } from './components/FarmerAdvisory';
import { VeterinaryDirectory } from './components/VeterinaryDirectory';
import { LaboratoryDirectory } from './components/LaboratoryDirectory';
import { Marketplace } from './components/Marketplace';
import { OfflineSupport } from './components/OfflineSupport';
import { AppLogo } from './components/AppLogo';
import { LanguageProvider, useLanguage } from './context/LanguageContext';

import {
  CowProfile,
  FeedGuidanceResult,
  HealthCheckResult,
  FeedQualityResult,
  VetDoctor,
  TestingLab,
  MarketListing,
  ReminderItem,
} from './types';

import {
  getSavedCows,
  saveCow,
  deleteCow,
  saveFeedHistory,
  saveHealthRecord,
  saveFeedQualityRecord,
  getVets,
  addCustomVet,
  getLabs,
  addCustomLab,
  getMarketplaceListings,
  addMarketplaceListing,
  getReminders,
  saveReminder,
  toggleReminderComplete,
  deleteReminder,
  getOfflineSimState,
  setOfflineSimState,
} from './utils/storage';

function MainAppContent() {
  const { t, currentLanguageInfo } = useLanguage();
  const [activeTab, setActiveTab] = useState<string>('home');

  // Core Data loaded from offline-first localStorage
  const [cows, setCows] = useState<CowProfile[]>(() => getSavedCows());
  const [selectedCowForFeed, setSelectedCowForFeed] = useState<CowProfile | null>(null);
  const [selectedCowForHealth, setSelectedCowForHealth] = useState<CowProfile | null>(null);

  const [vets, setVets] = useState<VetDoctor[]>(() => getVets());
  const [labs, setLabs] = useState<TestingLab[]>(() => getLabs());
  const [marketplaceListings, setMarketplaceListings] = useState<MarketListing[]>(() =>
    getMarketplaceListings()
  );
  const [reminders, setReminders] = useState<ReminderItem[]>(() => getReminders());

  // Offline network detection & rural simulation
  const [isReallyOnline, setIsReallyOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [isOfflineSimulated, setIsOfflineSimulated] = useState<boolean>(() =>
    getOfflineSimState()
  );

  useEffect(() => {
    const handleOnline = () => setIsReallyOnline(true);
    const handleOffline = () => setIsReallyOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleToggleOfflineSimulation = (state: boolean) => {
    setIsOfflineSimulated(state);
    setOfflineSimState(state);
  };

  const isOperatingOffline = !isReallyOnline || isOfflineSimulated;

  // Handlers
  const handleSaveCow = (cow: CowProfile) => {
    const updated = saveCow(cow);
    setCows(updated);
  };

  const handleDeleteCow = (id: string) => {
    const updated = deleteCow(id);
    setCows(updated);
  };

  const handleSelectCowForFeed = (cow: CowProfile) => {
    setSelectedCowForFeed(cow);
    setActiveTab('feed');
  };

  const handleSelectCowForHealth = (cow: CowProfile) => {
    setSelectedCowForHealth(cow);
    setActiveTab('health');
  };

  const handleSaveFeedResult = (result: FeedGuidanceResult) => {
    saveFeedHistory(result);
  };

  const handleSaveHealthRecord = (record: HealthCheckResult) => {
    saveHealthRecord(record);
  };

  const handleSaveQualityResult = (result: FeedQualityResult) => {
    saveFeedQualityRecord(result);
  };

  const handleAddVet = (vet: VetDoctor) => {
    const updated = addCustomVet(vet);
    setVets(updated);
  };

  const handleAddLab = (lab: TestingLab) => {
    const updated = addCustomLab(lab);
    setLabs(updated);
  };

  const handleAddMarketListing = (item: MarketListing) => {
    const updated = addMarketplaceListing(item);
    setMarketplaceListings(updated);
  };

  const handleSaveReminder = (item: ReminderItem) => {
    const updated = saveReminder(item);
    setReminders(updated);
  };

  const handleToggleReminder = (id: string) => {
    const updated = toggleReminderComplete(id);
    setReminders(updated);
  };

  const handleDeleteReminder = (id: string) => {
    const updated = deleteReminder(id);
    setReminders(updated);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Navbar with Official Logo, Offline Indicator & Emergency Vet Call */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOfflineSimulated={isOfflineSimulated}
        setIsOfflineSimulated={handleToggleOfflineSimulation}
        isReallyOnline={isReallyOnline}
        reminders={reminders}
        onOpenEmergencyVet={() => setActiveTab('vets')}
      />

      {/* Main App Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'home' && (
          <HomeDashboard
            cows={cows}
            reminders={reminders}
            setActiveTab={setActiveTab}
            onSelectCowForFeed={handleSelectCowForFeed}
            isOperatingOffline={isOperatingOffline}
          />
        )}

        {activeTab === 'cows' && (
          <CowManagement
            cows={cows}
            onSaveCow={handleSaveCow}
            onDeleteCow={handleDeleteCow}
            onSelectForFeed={handleSelectCowForFeed}
            onSelectForHealth={handleSelectCowForHealth}
          />
        )}

        {activeTab === 'feed' && (
          <FeedRecommendation
            cows={cows}
            selectedCow={selectedCowForFeed}
            onSaveFeedResult={handleSaveFeedResult}
          />
        )}

        {activeTab === 'health' && (
          <AiHealthCheck
            cows={cows}
            selectedCow={selectedCowForHealth}
            onSaveHealthRecord={handleSaveHealthRecord}
            onOpenVeterinary={() => setActiveTab('vets')}
            isOperatingOffline={isOperatingOffline}
          />
        )}

        {activeTab === 'quality' && (
          <FeedQualityCheck
            onSaveQualityResult={handleSaveQualityResult}
            onOpenLabs={() => setActiveTab('labs')}
            isOperatingOffline={isOperatingOffline}
          />
        )}

        {activeTab === 'storage' && <SilageMonitoring />}

        {activeTab === 'advisory' && <FarmerAdvisory />}

        {activeTab === 'vets' && (
          <VeterinaryDirectory vets={vets} onAddVet={handleAddVet} />
        )}

        {activeTab === 'labs' && (
          <LaboratoryDirectory labs={labs} onAddLab={handleAddLab} />
        )}

        {activeTab === 'marketplace' && (
          <Marketplace
            listings={marketplaceListings}
            onAddListing={handleAddMarketListing}
          />
        )}

        {activeTab === 'offline' && (
          <OfflineSupport
            cows={cows}
            reminders={reminders}
            isOfflineSimulated={isOfflineSimulated}
            setIsOfflineSimulated={handleToggleOfflineSimulation}
            isReallyOnline={isReallyOnline}
            onSaveReminder={handleSaveReminder}
            onToggleReminder={handleToggleReminder}
            onDeleteReminder={handleDeleteReminder}
            onNavigateToFeed={() => setActiveTab('feed')}
          />
        )}
      </main>

      {/* Footer with Official Logo */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AppLogo size="sm" />
            <div>
              <span className="font-extrabold text-slate-900">{t('appName', 'DairyGuard AI')}</span>
              <span className="mx-1.5">•</span>
              <span>{t('appSubtitle', 'Smart Livestock, Feed & Rural Care')}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-semibold text-slate-600">
            <button
              onClick={() => setActiveTab('cows')}
              className="hover:text-emerald-700 font-bold cursor-pointer"
            >
              {t('switchLanguage')}: {currentLanguageInfo.nativeName}
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveTab('vets')}
              className="hover:text-rose-600 cursor-pointer"
            >
              {t('emergencyVet')} (1962)
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveTab('offline')}
              className="hover:text-emerald-700 cursor-pointer"
            >
              {t('networkStatus')}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <MainAppContent />
    </LanguageProvider>
  );
}
