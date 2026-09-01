import React, { useState, useEffect, useCallback } from 'react';
import {
  UserProfile,
  FarmDiaryEntry,
  PlantDiagnosisResult,
  WeatherDangerAlert,
  DailyWeatherForecast,
  StepByStepRemedy,
  AgroWeatherReport,
} from './types';
import { SupportedLanguage } from './utils/translations';
import {
  DEFAULT_USER_PROFILE,
  INITIAL_DIARY_ENTRIES,
  INITIAL_WEATHER_ALARMS,
  INITIAL_WEATHER_FORECAST,
  SAMPLE_DIAGNOSES,
} from './data/agriculturalData';
import { Header } from './components/Header';
import { BottomNav, TabType } from './components/BottomNav';
import { Dashboard } from './components/Dashboard';
import { PlantDoctorScanner } from './components/PlantDoctorScanner';
import { StepByStepMedicineGuide } from './components/StepByStepMedicineGuide';
import { WeatherDangerAlarms } from './components/WeatherDangerAlarms';
import { FarmDiary } from './components/FarmDiary';
import { ExpertHelpline } from './components/ExpertHelpline';
import { UserProfileModal } from './components/UserProfileModal';
import { stopSpeaking } from './utils/audioSpeech';
import { detectFarmLocation, fetchLiveAgroWeather } from './services/weatherService';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>('en');
  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_USER_PROFILE);
  const [diaryEntries, setDiaryEntries] = useState<FarmDiaryEntry[]>(INITIAL_DIARY_ENTRIES);
  const [activeAlarms] = useState<WeatherDangerAlert[]>(INITIAL_WEATHER_ALARMS);
  const [forecast] = useState<DailyWeatherForecast[]>(INITIAL_WEATHER_FORECAST);
  const [weatherReport, setWeatherReport] = useState<AgroWeatherReport | null>(null);
  const [isDetectingLocation, setIsDetectingLocation] = useState<boolean>(false);
  const [currentDiagnosis, setCurrentDiagnosis] = useState<PlantDiagnosisResult | null>(SAMPLE_DIAGNOSES[0]);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Function to load live weather for given or current coordinates
  const refreshWeatherReport = useCallback(
    async (
      lat?: number,
      lon?: number,
      village?: string,
      state?: string,
      lang?: string,
      crops?: string[]
    ) => {
      const targetLat = lat ?? 30.211;
      const targetLon = lon ?? 74.9455;
      const targetVillage = village || userProfile.villageLocation || 'Bathinda, Punjab';
      const targetState = state || userProfile.stateRegion || 'Punjab, India';
      const targetLang = lang || currentLang;
      const targetCrops = crops || userProfile.mainCrops;

      try {
        const report = await fetchLiveAgroWeather(
          targetLat,
          targetLon,
          targetVillage,
          targetState,
          targetLang,
          targetCrops
        );
        if (report) {
          setWeatherReport(report);
        }
      } catch (err) {
        console.warn('Could not load live weather report:', err);
      }
    },
    [userProfile, currentLang]
  );

  // Trigger GPS Auto-Detection of Farm Location
  const handleAutoDetectLocation = useCallback(async () => {
    setIsDetectingLocation(true);
    try {
      const loc = await detectFarmLocation();
      const updatedProfile: UserProfile = {
        ...userProfile,
        villageLocation: loc.villageLocation,
        stateRegion: loc.stateRegion,
      };
      setUserProfile(updatedProfile);

      // Save to server
      fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProfile),
      }).catch(() => {});

      // Fetch weather immediately for newly detected location
      await refreshWeatherReport(
        loc.latitude,
        loc.longitude,
        loc.villageLocation,
        loc.stateRegion,
        currentLang,
        userProfile.mainCrops
      );
    } catch (err) {
      console.warn('GPS location detection error:', err);
    } finally {
      setIsDetectingLocation(false);
    }
  }, [userProfile, currentLang, refreshWeatherReport]);

  // Initial Sync: Diary, Profile, Auto Location & Live Weather on mount
  useEffect(() => {
    fetch('/api/diary')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setDiaryEntries(data);
        }
      })
      .catch((e) => console.log('Using local diary data', e));

    fetch('/api/profile')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.fullName) {
          setUserProfile(data);
        }
      })
      .catch((e) => console.log('Using local profile data', e));

    // Auto-detect location & fetch live weather
    handleAutoDetectLocation();
  }, []);

  // Handlers
  const handleLocationDetectedManually = (loc: {
    villageLocation: string;
    stateRegion: string;
    latitude: number;
    longitude: number;
  }) => {
    const updatedProfile: UserProfile = {
      ...userProfile,
      villageLocation: loc.villageLocation,
      stateRegion: loc.stateRegion,
    };
    setUserProfile(updatedProfile);

    // Save profile to backend
    fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedProfile),
    }).catch(() => {});

    // Fetch live weather for the selected location
    refreshWeatherReport(
      loc.latitude,
      loc.longitude,
      loc.villageLocation,
      loc.stateRegion,
      currentLang,
      userProfile.mainCrops
    );
  };

  const handleDiagnosisComplete = (diagnosis: PlantDiagnosisResult) => {
    setCurrentDiagnosis(diagnosis);
    setActiveTab('medicine'); // Navigate automatically to Step-by-Step Medicine Guide!
  };

  const handleSelectSample = (sampleId: string) => {
    const sample = SAMPLE_DIAGNOSES.find((s) => s.id === sampleId) || SAMPLE_DIAGNOSES[0];
    setCurrentDiagnosis(sample);
    setActiveTab('medicine');
  };

  const handleAddRemedyToDiary = (diag: PlantDiagnosisResult, remedy: StepByStepRemedy) => {
    const newEntryPayload: Omit<FarmDiaryEntry, 'id' | 'createdAt'> = {
      cropName: diag.cropName,
      fieldSection: 'Affected Area Plot',
      activityType: 'pesticide',
      date: new Date().toISOString().split('T')[0],
      title: `Sprayed ${remedy.name} for ${diag.diseaseOrPestName}`,
      details: {
        productName: remedy.name,
        quantity: remedy.mixingRatio.per15LTankGramsOrMl,
        mixingRatio: `${remedy.mixingRatio.perLiterSpoons} spoons/L`,
      },
      cropStage: 'vegetative',
      notes: `Prescription from KrishiVeyra Plant Doctor. Waiting period: ${remedy.waitingPeriodDays} days before harvest.`,
      photos: [diag.imageUrl],
      diagnosisLinkedId: diag.id,
    };

    // Save to local & server
    fetch('/api/diary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEntryPayload),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.entry) {
          setDiaryEntries((prev) => [data.entry, ...prev]);
        }
      })
      .catch(() => {
        const localEntry: FarmDiaryEntry = {
          id: `entry_${Date.now()}`,
          createdAt: new Date().toISOString(),
          ...newEntryPayload,
        };
        setDiaryEntries((prev) => [localEntry, ...prev]);
      });
  };

  const handleCreateDiaryEntry = (entry: Omit<FarmDiaryEntry, 'id' | 'createdAt'>) => {
    fetch('/api/diary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.entry) {
          setDiaryEntries((prev) => [data.entry, ...prev]);
        }
      })
      .catch(() => {
        const localEntry: FarmDiaryEntry = {
          id: `entry_${Date.now()}`,
          createdAt: new Date().toISOString(),
          ...entry,
        };
        setDiaryEntries((prev) => [localEntry, ...prev]);
      });
  };

  const handleDeleteDiaryEntry = (id: string) => {
    fetch(`/api/diary/${id}`, { method: 'DELETE' }).catch(() => {});
    setDiaryEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const handleSaveProfile = (updatedProfile: UserProfile) => {
    setUserProfile(updatedProfile);
    setCurrentLang(updatedProfile.primaryLanguage);
    fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedProfile),
    }).catch(() => {});

    // Refresh weather if language or crops changed
    refreshWeatherReport(
      undefined,
      undefined,
      updatedProfile.villageLocation,
      updatedProfile.stateRegion,
      updatedProfile.primaryLanguage,
      updatedProfile.mainCrops
    );
  };

  const handleAskExpertFromDiagnosis = (diag: PlantDiagnosisResult) => {
    setCurrentDiagnosis(diag);
    setActiveTab('helpline');
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans selection:bg-emerald-200">
      {/* Top Accessible Sticky Header */}
      <Header
        currentLang={currentLang}
        onLanguageChange={(lang) => {
          setCurrentLang(lang);
          refreshWeatherReport(undefined, undefined, undefined, undefined, lang);
        }}
        userProfile={userProfile}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        isSpeaking={isSpeaking}
        onToggleMute={() => {
          stopSpeaking();
          setIsSpeaking(false);
        }}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-3 sm:p-4 md:p-6">
        {activeTab === 'home' && (
          <Dashboard
            userProfile={userProfile}
            currentLang={currentLang}
            activeAlarms={activeAlarms}
            todayWeather={forecast[0]}
            weatherReport={weatherReport}
            recentDiary={diaryEntries}
            lastDiagnosis={currentDiagnosis}
            onNavigate={(tab) => setActiveTab(tab)}
            onSelectSampleDiagnosis={handleSelectSample}
            onTriggerAutoDetect={handleAutoDetectLocation}
            isDetectingLocation={isDetectingLocation}
          />
        )}

        {activeTab === 'scanner' && (
          <PlantDoctorScanner
            currentLang={currentLang}
            userProfile={userProfile}
            onDiagnosisComplete={handleDiagnosisComplete}
            onSelectSampleDiagnosis={handleSelectSample}
          />
        )}

        {activeTab === 'medicine' && (
          currentDiagnosis ? (
            <StepByStepMedicineGuide
              diagnosis={currentDiagnosis}
              currentLang={currentLang}
              onAddToDiary={handleAddRemedyToDiary}
              onAskExpert={handleAskExpertFromDiagnosis}
              onRescan={() => setActiveTab('scanner')}
            />
          ) : (
            <div className="bg-white rounded-3xl p-8 text-center border border-slate-200 space-y-3">
              <p className="text-sm font-bold text-slate-700">No plant scan available yet.</p>
              <button
                onClick={() => setActiveTab('scanner')}
                className="px-5 py-2.5 bg-emerald-600 text-white font-bold rounded-xl text-xs"
              >
                Scan a Sick Leaf Now
              </button>
            </div>
          )
        )}

        {activeTab === 'weather' && (
          <WeatherDangerAlarms
            weatherReport={weatherReport}
            forecast={forecast}
            alarms={activeAlarms}
            currentLang={currentLang}
            userProfile={userProfile}
            onLocationDetected={handleLocationDetectedManually}
            onRefreshWeather={() =>
              refreshWeatherReport(
                undefined,
                undefined,
                userProfile.villageLocation,
                userProfile.stateRegion,
                currentLang,
                userProfile.mainCrops
              )
            }
            isDetectingLocation={isDetectingLocation}
            onTriggerAutoDetect={handleAutoDetectLocation}
          />
        )}

        {activeTab === 'diary' && (
          <FarmDiary
            diaryEntries={diaryEntries}
            userProfile={userProfile}
            currentLang={currentLang}
            onAddEntry={handleCreateDiaryEntry}
            onDeleteEntry={handleDeleteDiaryEntry}
          />
        )}

        {activeTab === 'helpline' && (
          <ExpertHelpline
            currentLang={currentLang}
            userProfile={userProfile}
            attachedDiagnosis={currentDiagnosis}
            onClearDiagnosisAttachment={() => setCurrentDiagnosis(null)}
          />
        )}
      </main>

      {/* Bottom Accessible Navigation */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        currentLang={currentLang}
        hasActiveAlarm={activeAlarms.some((a) => a.level === 'danger')}
      />

      {/* User Profile Edit Modal */}
      <UserProfileModal
        userProfile={userProfile}
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onSave={handleSaveProfile}
      />
    </div>
  );
}

