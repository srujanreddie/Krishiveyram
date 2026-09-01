import React, { useState } from 'react';
import {
  FlaskConical,
  Clock,
  CloudRain,
  ShieldCheck,
  AlertTriangle,
  Volume2,
  BookPlus,
  PhoneCall,
  CheckCircle2,
  Info,
  Calendar,
  Sparkles,
  Droplet,
  Sun,
  Sunrise,
  Sunset,
  Share2,
} from 'lucide-react';
import { PlantDiagnosisResult, StepByStepRemedy } from '../types';
import { SupportedLanguage, UI_TEXTS } from '../utils/translations';
import { speakText } from '../utils/audioSpeech';
import { getDiseaseTargetInfo } from '../utils/imageUtils';

interface StepByStepMedicineGuideProps {
  diagnosis: PlantDiagnosisResult;
  currentLang: SupportedLanguage;
  onAddToDiary: (diagnosis: PlantDiagnosisResult, remedy: StepByStepRemedy) => void;
  onAskExpert: (diagnosis: PlantDiagnosisResult) => void;
  onRescan: () => void;
}

export const StepByStepMedicineGuide: React.FC<StepByStepMedicineGuideProps> = ({
  diagnosis,
  currentLang,
  onAddToDiary,
  onAskExpert,
  onRescan,
}) => {
  const texts = UI_TEXTS[currentLang] || UI_TEXTS.en;

  const [activeRemedyTab, setActiveRemedyTab] = useState<'chemical' | 'organic'>('chemical');
  const [tankSize, setTankSize] = useState<'1L' | '15L' | '200L' | '1Acre'>('15L');
  const [isDiaryAdded, setIsDiaryAdded] = useState(false);

  const rawRemedy = activeRemedyTab === 'chemical' ? diagnosis?.primaryRemedy : diagnosis?.alternativeOrganicRemedy || diagnosis?.primaryRemedy;
  const remedy: StepByStepRemedy = {
    remedyType: rawRemedy?.remedyType || (activeRemedyTab === 'organic' ? 'organic' : 'standard_chemical'),
    name: rawRemedy?.name || 'Broad Spectrum Crop Protector',
    imageUrl: rawRemedy?.imageUrl,
    activeIngredient: rawRemedy?.activeIngredient || 'Systemic / Contact Active',
    brandExamples: Array.isArray(rawRemedy?.brandExamples) ? rawRemedy.brandExamples : [],
    safetyBadge: rawRemedy?.safetyBadge || 'Approved for Agricultural Use',
    mixingRatio: {
      perLiterSpoons: rawRemedy?.mixingRatio?.perLiterSpoons || 2,
      perLiterGramsOrMl: rawRemedy?.mixingRatio?.perLiterGramsOrMl || '2 ml / g per 1L water',
      per15LTankGramsOrMl: rawRemedy?.mixingRatio?.per15LTankGramsOrMl || '30 ml / g in 15L Knapsack Tank',
      perAcreRecommendation: rawRemedy?.mixingRatio?.perAcreRecommendation || '500g in 200L water per acre',
      instructions:
        rawRemedy?.mixingRatio?.instructions ||
        'Mix thoroughly in a small container before adding to the full spray tank with clean water.',
    },
    sprayTiming: {
      bestTimeOfDay: rawRemedy?.sprayTiming?.bestTimeOfDay || 'early_morning',
      recommendedHours: rawRemedy?.sprayTiming?.recommendedHours || '6:30 AM to 9:30 AM',
      rainSafetyHours: rawRemedy?.sprayTiming?.rainSafetyHours || 4,
      temperatureLimitCelsius: rawRemedy?.sprayTiming?.temperatureLimitCelsius || 32,
      weatherAdvice: rawRemedy?.sprayTiming?.weatherAdvice || 'Spray when wind speed is below 12 km/h and leaves are dry.',
    },
    safetyEquipment: Array.isArray(rawRemedy?.safetyEquipment) && rawRemedy.safetyEquipment.length > 0
      ? rawRemedy.safetyEquipment
      : ['😷 Face Mask', '🧤 Protective Gloves', '🥽 Goggles'],
    waitingPeriodDays: typeof rawRemedy?.waitingPeriodDays === 'number' ? rawRemedy.waitingPeriodDays : 3,
    culturalPractices: Array.isArray(rawRemedy?.culturalPractices) && rawRemedy.culturalPractices.length > 0
      ? rawRemedy.culturalPractices
      : [
          'Carefully remove heavily infected bottom leaves from the field',
          'Avoid over-watering or wetting foliage in high humidity',
          'Ensure good airflow and weed clearance around crop base',
        ],
  };

  const targetInfo = getDiseaseTargetInfo(
    diagnosis?.diseaseOrPestName || 'Crop Pathogen',
    diagnosis?.cropName || 'Crop',
    remedy.remedyType,
    remedy.name
  );

  // Calculate dynamic visual numbers based on tank size
  const getCalculatedDosage = () => {
    const spoonsPerLiter = remedy.mixingRatio?.perLiterSpoons || 2;
    if (tankSize === '1L') {
      return {
        label: '1 Liter Hand Bottle',
        spoons: spoonsPerLiter,
        gramsOrMl: remedy.mixingRatio?.perLiterGramsOrMl || '2g',
        waterBottles: 1,
      };
    } else if (tankSize === '15L') {
      return {
        label: '15 Liter Knapsack Tank (पीठ वाली टंकी)',
        spoons: spoonsPerLiter * 15,
        gramsOrMl: remedy.mixingRatio?.per15LTankGramsOrMl || '30g',
        waterBottles: 15,
      };
    } else if (tankSize === '200L') {
      return {
        label: '200 Liter Field Drum (बड़ा ड्रम)',
        spoons: spoonsPerLiter * 200,
        gramsOrMl: remedy.mixingRatio?.perAcreRecommendation || '500g in 200L',
        waterBottles: 200,
      };
    } else {
      return {
        label: '1 Acre Total Area (1 एकड़)',
        spoons: spoonsPerLiter * 200,
        gramsOrMl: remedy.mixingRatio?.perAcreRecommendation || '500g in 200L water',
        waterBottles: 200,
      };
    }
  };

  const dosageData = getCalculatedDosage();

  // Read Aloud via TTS
  const handleReadAloud = () => {
    const speech = `Medicine guide for ${diagnosis?.cropName || 'Crop'}. Identified problem: ${diagnosis?.diseaseOrPestName || 'Infection'}. Recommended medicine is ${remedy.name}. Mixing ratio: ${dosageData.spoons} spoons in your ${dosageData.label}. Best time to spray is ${remedy.sprayTiming.bestTimeOfDay === 'early_morning' ? 'Early morning before sun gets hot' : 'Late afternoon'}. Pre-harvest waiting period is ${remedy.waitingPeriodDays} days.`;
    speakText(speech, currentLang);
  };

  const handleSaveDiary = () => {
    onAddToDiary(diagnosis, remedy);
    setIsDiaryAdded(true);
    setTimeout(() => setIsDiaryAdded(false), 3000);
  };

  const visualSymptomsList = Array.isArray(diagnosis?.visualSymptoms) && diagnosis.visualSymptoms.length > 0
    ? diagnosis.visualSymptoms
    : [
        'Characteristic discolored lesions or patches on leaf surface',
        'Chlorotic yellowing spreading along veins or leaf margins',
        'Reduced photosynthetic vigor on affected crop canopy',
      ];

  return (
    <div className="space-y-4 pb-24 max-w-4xl mx-auto animate-in fade-in duration-200">
      {/* Top Diagnosis Card */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border-2 border-slate-200 shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <img
            src={diagnosis.imageUrl}
            alt={diagnosis.diseaseOrPestName}
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=800&q=80';
            }}
            className="w-full sm:w-28 h-40 sm:h-28 rounded-2xl object-cover border-2 border-emerald-500 shadow-md shrink-0"
          />

          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                {diagnosis.cropName}
              </span>
              <span
                className={`text-[11px] font-black px-2 py-0.5 rounded-full ${
                  diagnosis.severity === 'severe'
                    ? 'bg-rose-100 text-rose-800'
                    : diagnosis.severity === 'moderate'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-green-100 text-green-800'
                }`}
              >
                {diagnosis.severity.toUpperCase()} SEVERITY
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-['Outfit']">
              {diagnosis.diseaseOrPestName}
            </h1>
            {diagnosis.scientificName && (
              <p className="text-xs italic text-slate-500 font-medium">
                Scientific Name: {diagnosis.scientificName}
              </p>
            )}

            <div className="text-xs text-slate-600 font-medium pt-1">
              Confidence: <strong className="text-emerald-700">{diagnosis.confidenceScore}% AI Match</strong>
            </div>
          </div>

          <div className="flex sm:flex-col gap-2 w-full sm:w-auto shrink-0">
            <button
              onClick={handleReadAloud}
              className="flex-1 sm:flex-none px-3 py-2.5 bg-amber-400 hover:bg-amber-500 active:scale-95 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition"
              title="Listen to prescription in voice"
            >
              <Volume2 className="w-4 h-4 text-slate-950" />
              <span>{texts.readAloud}</span>
            </button>

            <button
              onClick={onRescan}
              className="flex-1 sm:flex-none px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center justify-center gap-1 transition"
            >
              Scan Another Leaf
            </button>
          </div>
        </div>

        {/* Symptoms Checklist */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">
            Key Visual Symptoms Identified:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {visualSymptomsList.map((symptom, idx) => (
              <div
                key={idx}
                className="p-2 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-medium text-slate-800 flex items-start gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{symptom}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Remedy Selector: Chemical vs Organic */}
      <div className="flex bg-slate-200/80 p-1.5 rounded-2xl gap-1">
        <button
          onClick={() => setActiveRemedyTab('chemical')}
          className={`flex-1 py-2.5 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition ${
            activeRemedyTab === 'chemical'
              ? 'bg-white text-emerald-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FlaskConical className="w-4 h-4 text-emerald-700" />
          <span>🧪 Fast Chemical Remedy</span>
        </button>

        <button
          onClick={() => setActiveRemedyTab('organic')}
          className={`flex-1 py-2.5 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition ${
            activeRemedyTab === 'organic'
              ? 'bg-white text-emerald-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>🌿 Organic / Bio Alternative</span>
        </button>
      </div>

      {/* 1. EXACT MEDICINE TO BUY */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800 font-bold text-sm">
              1
            </div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 font-['Outfit']">
              Recommended Medicine to Buy
            </h2>
          </div>

          <span className="text-xs font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-full">
            {remedy.safetyBadge}
          </span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/60 border-2 border-emerald-200">
          {/* Medicine Details */}
          <div className="space-y-2.5 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                {targetInfo.formulationBadge}
              </span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-900 text-white">
                🎯 Target: {diagnosis.diseaseOrPestName.split('(')[0].trim()}
              </span>
              <span className="text-[11px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                Batch: {targetInfo.batchCode}
              </span>
            </div>

            <div className="text-xl sm:text-2xl font-black text-emerald-950 font-['Outfit'] leading-tight">
              {remedy.name}
            </div>

            <div className="text-xs sm:text-sm font-semibold text-emerald-900">
              Active Chemical / Bio Formulation:{' '}
              <span className="font-bold underline">{remedy.activeIngredient}</span>
            </div>

            <div className="text-xs sm:text-sm text-slate-700 bg-white/90 rounded-xl p-3 border border-emerald-200/80">
              <span className="font-bold text-emerald-900">🛡️ Targeted Mode of Action:</span>{' '}
              {targetInfo.actionMechanism}
            </div>

            {remedy.brandExamples && remedy.brandExamples.length > 0 && (
              <div className="pt-2.5 border-t border-emerald-200/60">
                <span className="text-xs font-bold text-slate-600 mr-2">Market Registered Brands:</span>
                <div className="inline-flex flex-wrap gap-1.5 mt-1">
                  {remedy.brandExamples.map((brand, i) => (
                    <span
                      key={i}
                      className="bg-white px-2.5 py-1 rounded-lg text-xs font-bold text-slate-800 border border-emerald-300 shadow-xs"
                    >
                      🏷️ {brand}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. EXACT MIXING RATIO & TANK CALCULATOR */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800 font-bold text-sm">
              2
            </div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 font-['Outfit']">
              {texts.mixingRatio} & Tank Measure
            </h2>
          </div>
          <span className="text-xs font-bold text-slate-500">Pick your sprayer:</span>
        </div>

        {/* Tank Size Chooser */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { id: '15L' as const, label: '15L Backpack Tank (पीठ टंकी)', icon: '🎒' },
            { id: '1L' as const, label: '1L Hand Sprayer (बोतल)', icon: '🧴' },
            { id: '200L' as const, label: '200L Drum (ड्रम)', icon: '🛢️' },
            { id: '1Acre' as const, label: '1 Acre Total Area (एकड़)', icon: '🌾' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTankSize(t.id)}
              className={`p-3 rounded-2xl border-2 text-left transition transform active:scale-95 ${
                tankSize === t.id
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-black shadow-sm'
                  : 'border-slate-200 bg-slate-50 text-slate-700 font-semibold hover:border-slate-300'
              }`}
            >
              <div className="text-2xl">{t.icon}</div>
              <div className="text-xs font-bold mt-1.5 leading-snug">{t.label}</div>
            </button>
          ))}
        </div>

        {/* Big Visual Mixing Result */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-amber-50 via-orange-50/40 to-amber-100/50 border-2 border-amber-300 space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-amber-900">
                Exact Proportion for {dosageData.label}:
              </span>
              <div className="text-xl sm:text-2xl font-black text-amber-950 font-['Outfit'] mt-0.5">
                🥄 {dosageData.spoons} Level Spoons ({dosageData.gramsOrMl})
              </div>
            </div>
            <div className="text-3xl">🥣</div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-amber-200">
            <div className="bg-white/80 p-3 rounded-xl border border-amber-200 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-black text-base shrink-0">
                💧
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Clean Water Volume:</div>
                <div className="text-sm font-extrabold text-blue-900">
                  {dosageData.waterBottles} Liters of Clean Water
                </div>
              </div>
            </div>

            <div className="bg-white/80 p-3 rounded-xl border border-amber-200 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-black text-base shrink-0">
                🥄
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Per 1 Liter Water:</div>
                <div className="text-sm font-extrabold text-amber-950">
                  {remedy.mixingRatio.perLiterSpoons} spoons ({remedy.mixingRatio.perLiterGramsOrMl})
                </div>
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-700 bg-white/70 p-3 rounded-xl border border-amber-200/80 leading-relaxed font-medium">
            💡 <strong>Mixing Secret:</strong> {remedy.mixingRatio.instructions}
          </div>
        </div>
      </div>

      {/* 3. BEST TIME OF DAY TO SPRAY */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800 font-bold text-sm">
            3
          </div>
          <h2 className="text-base sm:text-lg font-black text-slate-900 font-['Outfit']">
            {texts.timeToSpray} & Rain Safety
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Time of Day Card */}
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              {remedy.sprayTiming.bestTimeOfDay === 'early_morning' ? (
                <Sunrise className="w-5 h-5" />
              ) : (
                <Sunset className="w-5 h-5" />
              )}
            </div>
            <div>
              <div className="text-xs font-extrabold uppercase text-emerald-800">Ideal Hours</div>
              <div className="text-sm font-black text-slate-900 mt-0.5">
                {remedy.sprayTiming.recommendedHours}
              </div>
              <p className="text-[11px] text-slate-600 mt-1 font-medium">
                {remedy.sprayTiming.weatherAdvice}
              </p>
            </div>
          </div>

          {/* Rain Safety Buffer */}
          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <CloudRain className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-extrabold uppercase text-blue-800">Rain Drying Time</div>
              <div className="text-sm font-black text-slate-900 mt-0.5">
                {remedy.sprayTiming.rainSafetyHours} Hours Dry Window
              </div>
              <p className="text-[11px] text-slate-600 mt-1 font-medium">
                Do not spray if rain is expected within {remedy.sprayTiming.rainSafetyHours} hours.
              </p>
            </div>
          </div>

          {/* Waiting Period (PHI) */}
          <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-extrabold uppercase text-purple-800">Harvest Waiting Days</div>
              <div className="text-sm font-black text-slate-900 mt-0.5">
                {remedy.waitingPeriodDays} Days Before Harvest
              </div>
              <p className="text-[11px] text-slate-600 mt-1 font-medium">
                Safe waiting time before consuming or plucking crops.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. SAFETY GEAR & CULTURAL PRACTICES */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800 font-bold text-sm">
            4
          </div>
          <h2 className="text-base sm:text-lg font-black text-slate-900 font-['Outfit']">
            Farmer Protection & Field Care
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Safety equipment badges */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-600">
              Required Protective Gear:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {remedy.safetyEquipment.map((gear, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 bg-white rounded-xl text-xs font-bold text-slate-800 border border-slate-200 shadow-xs"
                >
                  {gear}
                </span>
              ))}
            </div>
          </div>

          {/* Cultural practices */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-600">
              Field Care Tips to Prevent Spread:
            </span>
            <ul className="text-xs text-slate-700 space-y-1 font-medium">
              {remedy.culturalPractices.map((tip, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* BOTTOM FLOATING ACTIONS: Add to Diary & Ask Expert */}
      <div className="sticky bottom-18 left-0 right-0 z-30 flex gap-2.5 p-2 bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200 shadow-xl">
        <button
          onClick={handleSaveDiary}
          disabled={isDiaryAdded}
          className={`flex-1 py-3.5 px-4 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition active:scale-95 ${
            isDiaryAdded
              ? 'bg-emerald-800 text-white'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-700/30'
          }`}
        >
          <BookPlus className="w-4 h-4" />
          <span>{isDiaryAdded ? '✓ Prescribed in Farm Diary!' : texts.addToDiary}</span>
        </button>

        <button
          onClick={() => onAskExpert(diagnosis)}
          className="flex-1 py-3.5 px-4 rounded-xl font-black text-xs sm:text-sm bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2 shadow-md shadow-blue-700/20 transition active:scale-95"
        >
          <PhoneCall className="w-4 h-4" />
          <span>{texts.askExpertNow}</span>
        </button>
      </div>
    </div>
  );
};
