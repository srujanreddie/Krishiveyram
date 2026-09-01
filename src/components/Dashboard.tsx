import React from 'react';
import {
  ScanLine,
  AlertTriangle,
  CloudRain,
  SunMedium,
  Wind,
  Droplets,
  BookOpen,
  PhoneCall,
  ChevronRight,
  Sparkles,
  Volume2,
  Calendar,
  CheckCircle2,
  Clock,
  HelpCircle,
  TrendingUp,
  MapPin,
  Navigation,
  ShieldCheck,
  ShieldAlert,
} from 'lucide-react';
import {
  UserProfile,
  WeatherDangerAlert,
  DailyWeatherForecast,
  FarmDiaryEntry,
  PlantDiagnosisResult,
  AgroWeatherReport,
} from '../types';
import { SupportedLanguage, UI_TEXTS } from '../utils/translations';
import { TabType } from './BottomNav';
import { speakText } from '../utils/audioSpeech';

interface DashboardProps {
  userProfile: UserProfile;
  currentLang: SupportedLanguage;
  activeAlarms: WeatherDangerAlert[];
  todayWeather: DailyWeatherForecast;
  weatherReport?: AgroWeatherReport | null;
  recentDiary: FarmDiaryEntry[];
  lastDiagnosis: PlantDiagnosisResult | null;
  onNavigate: (tab: TabType) => void;
  onSelectSampleDiagnosis: (id: string) => void;
  onTriggerAutoDetect?: () => void;
  isDetectingLocation?: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({
  userProfile,
  currentLang,
  activeAlarms,
  todayWeather,
  weatherReport,
  recentDiary,
  lastDiagnosis,
  onNavigate,
  onSelectSampleDiagnosis,
  onTriggerAutoDetect,
  isDetectingLocation = false,
}) => {
  const texts = UI_TEXTS[currentLang] || UI_TEXTS.en;

  const alarmsList = weatherReport?.alarms || activeAlarms;
  const topDanger = alarmsList.find((a) => a.level === 'danger') || alarmsList[0];
  const current = weatherReport?.current;

  const handleReadDashboard = () => {
    const speech = `Welcome ${userProfile.fullName}. Today in ${
      current?.locationName || userProfile.villageLocation
    }, the weather is ${current?.condition || todayWeather.condition} with temperature of ${
      current?.temperature || todayWeather.tempMax
    } degrees Celsius. Humidity is ${current?.humidityPercent || 60} percent. ${
      topDanger
        ? `Warning: ${topDanger.title}. ${topDanger.suggestedAction}`
        : 'Weather conditions are favorable for crop management.'
    }`;
    speakText(speech, currentLang);
  };

  return (
    <div className="space-y-4 pb-20 max-w-4xl mx-auto">
      {/* Farmer Welcome Banner */}
      <div className="bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-800 rounded-3xl p-4 sm:p-5 text-white shadow-lg relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 w-36 h-36 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex items-start justify-between relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-600/60 border border-emerald-400/30 text-emerald-100 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-300" />
                {texts.tagline}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight mt-1.5 font-['Outfit']">
              Namaste, {userProfile.fullName}
            </h1>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-emerald-100/90 font-medium mt-0.5">
              <span>{userProfile.landSizeAcres} Acres</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <strong className="text-white">{current?.locationName || userProfile.villageLocation}</strong>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {onTriggerAutoDetect && (
              <button
                onClick={onTriggerAutoDetect}
                disabled={isDetectingLocation}
                className="px-2.5 py-1.5 bg-white/15 hover:bg-white/25 active:scale-95 rounded-2xl flex items-center gap-1 text-[11px] font-bold transition shadow-sm border border-white/20"
                title="Auto-detect location from GPS"
              >
                <Navigation className={`w-3.5 h-3.5 text-emerald-300 ${isDetectingLocation ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">GPS Auto</span>
              </button>
            )}

            <button
              onClick={handleReadDashboard}
              className="px-3 py-2 bg-white/20 hover:bg-white/30 active:scale-95 rounded-2xl flex items-center gap-1.5 text-xs font-bold transition shadow-sm border border-white/20"
              title="Read summary in audio"
            >
              <Volume2 className="w-4 h-4 text-amber-300" />
              <span className="hidden sm:inline">{texts.readAloud}</span>
            </button>
          </div>
        </div>

        {/* Farmer's Crop Badges */}
        <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-emerald-600/50">
          <span className="text-[11px] font-bold text-emerald-200 uppercase tracking-wider self-center mr-1">
            My Crops:
          </span>
          {(userProfile?.mainCrops || ['Wheat', 'Rice', 'Tomato']).map((crop, idx) => (
            <span
              key={idx}
              className="text-[11px] font-bold bg-white/15 px-2.5 py-0.5 rounded-lg text-white border border-white/15"
            >
              🌾 {crop}
            </span>
          ))}
        </div>
      </div>

      {/* Prominent Weather Danger Alert Banner (if any) */}
      {topDanger && (
        <div
          id="danger-weather-alarm"
          onClick={() => onNavigate('weather')}
          className={`rounded-2xl p-4 border cursor-pointer transition transform active:scale-[0.99] shadow-md flex items-start gap-3.5 ${
            topDanger.level === 'danger'
              ? 'bg-rose-50 border-rose-300 text-rose-950 ring-2 ring-rose-400/30'
              : 'bg-amber-50 border-amber-300 text-amber-950'
          }`}
        >
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
              topDanger.level === 'danger' ? 'bg-rose-600 text-white animate-pulse' : 'bg-amber-500 text-white'
            }`}
          >
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-rose-700">
                ⚠️ URGENT FIELD WARNING
              </span>
              <span className="text-[11px] font-bold text-slate-500 flex items-center gap-0.5">
                Radar Details <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
            <h2 className="text-sm sm:text-base font-black text-slate-900 mt-0.5 leading-snug">
              {topDanger.title}
            </h2>
            <p className="text-xs text-slate-700 mt-1 font-medium line-clamp-2">
              {topDanger.suggestedAction}
            </p>
          </div>
        </div>
      )}

      {/* PRIMARY 1-TAP ACTION GRID (Giant Tap Targets for Farmers) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* Main Scanner Card */}
        <button
          id="action-scan-leaf"
          onClick={() => onNavigate('scanner')}
          className="group relative overflow-hidden bg-gradient-to-br from-emerald-600 to-green-700 hover:from-emerald-500 hover:to-green-600 text-white p-4 sm:p-5 rounded-3xl shadow-lg shadow-emerald-700/20 text-left transition transform active:scale-[0.98] border border-emerald-500/40"
        >
          <div className="flex items-start justify-between">
            <div className="w-13 h-13 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm border border-white/30 shadow-inner group-hover:scale-110 transition">
              <ScanLine className="w-7 h-7 text-white" />
            </div>
            <span className="bg-amber-400 text-slate-950 text-[10px] font-black uppercase px-2 py-0.5 rounded-full shadow-sm">
              Instant AI
            </span>
          </div>

          <div className="mt-4">
            <h3 className="text-lg sm:text-xl font-black tracking-tight font-['Outfit']">
              {texts.scanPlantTitle}
            </h3>
            <p className="text-xs text-emerald-100 font-medium mt-1 leading-relaxed">
              {texts.scanPlantSub}
            </p>
          </div>

          <div className="mt-3.5 inline-flex items-center gap-1.5 text-xs font-black bg-white text-emerald-800 px-3 py-1.5 rounded-xl shadow-sm">
            <span>📷 {texts.takePhoto}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </button>

        {/* Medicine & Dosage Guide Card */}
        <button
          id="action-medicine-guide"
          onClick={() => onNavigate('medicine')}
          className="bg-white hover:bg-slate-50 border-2 border-slate-200/80 p-4 sm:p-5 rounded-3xl shadow-sm text-left transition transform active:scale-[0.98] flex flex-col justify-between group hover:border-emerald-300"
        >
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 group-hover:scale-110 transition">
              <Droplets className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-slate-400">Step-by-Step</span>
          </div>

          <div className="mt-4">
            <h3 className="text-base sm:text-lg font-black text-slate-900 font-['Outfit']">
              {texts.navMedicine} & Tank Dosage
            </h3>
            <p className="text-xs text-slate-600 font-medium mt-0.5">
              Exact spoons per Liter, 15L backpack tank measure & best spray times.
            </p>
          </div>

          <div className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-teal-700">
            <span>{lastDiagnosis ? `Recent: ${lastDiagnosis.diseaseOrPestName}` : 'View Mixing Calculator'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </button>
      </div>

      {/* Spray Safety Window & Live Agro-Weather Widget */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-lg">
              {current?.conditionIcon || '⛅'}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900 font-['Outfit']">
                  Live Spray Radar & Agro-Weather
                </h3>
                <span className="text-[10px] font-bold px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded">
                  {current?.locationName ? current.locationName.split(',')[0] : 'Auto-GPS'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                {current?.condition || todayWeather.condition} •{' '}
                <strong className="text-slate-900">{current?.temperature || todayWeather.tempMax}°C</strong> (Feels like{' '}
                {current?.feelsLike || todayWeather.tempMax}°C)
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('weather')}
            className="text-xs font-bold text-blue-700 hover:text-blue-800 flex items-center gap-0.5 bg-blue-50 px-2.5 py-1 rounded-xl transition"
          >
            Radar Forecast <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Spray Window Status & Live Metrics */}
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <div
            className={`col-span-2 rounded-2xl p-3 border flex items-start gap-2.5 ${
              (current?.sprayIndex || todayWeather.spraySuitability) === 'safe' ||
              todayWeather.spraySuitability === 'good'
                ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                : (current?.sprayIndex || todayWeather.spraySuitability) === 'risky'
                ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                : 'bg-rose-50/70 border-rose-200 text-rose-950'
            }`}
          >
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-white font-black text-xs ${
                (current?.sprayIndex || todayWeather.spraySuitability) === 'safe' ||
                todayWeather.spraySuitability === 'good'
                  ? 'bg-emerald-600'
                  : (current?.sprayIndex || todayWeather.spraySuitability) === 'risky'
                  ? 'bg-amber-500'
                  : 'bg-rose-600'
              }`}
            >
              {(current?.sprayIndex || todayWeather.spraySuitability) === 'safe' ||
              todayWeather.spraySuitability === 'good'
                ? 'SAFE'
                : (current?.sprayIndex || todayWeather.spraySuitability) === 'risky'
                ? 'CAUTION'
                : 'NO'}
            </div>
            <div>
              <div className="text-xs font-black">
                {(current?.sprayIndex || todayWeather.spraySuitability) === 'safe' ||
                todayWeather.spraySuitability === 'good'
                  ? '🟢 Optimal Spray Window (6:30 - 9:30 AM)'
                  : (current?.sprayIndex || todayWeather.spraySuitability) === 'risky'
                  ? '🟡 Spray with Caution (High Heat/Wind)'
                  : '🔴 Avoid Spraying (Rain / High Wind Risk)'}
              </div>
              <p className="text-[11px] text-slate-600 font-medium mt-0.5 leading-snug">
                {current?.sprayRecommendation || todayWeather.spraySuitabilityReason}
              </p>
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200/60 flex items-center justify-between sm:flex-col sm:justify-center sm:text-center">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Live Metrics</div>
            <div className="text-base font-black text-blue-700 flex items-center gap-1">
              <CloudRain className="w-4 h-4 text-blue-500" />
              {current?.rainProbability ?? todayWeather.rainProbability}% Rain
            </div>
            <div className="text-[11px] text-slate-600 font-medium">
              💨 {current?.windSpeedKmh ?? todayWeather.windSpeedKmh} km/h • 💧 {current?.humidityPercent ?? 60}%
            </div>
          </div>
        </div>
      </div>

      {/* Quick Test Samples for Plant Doctor */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900 font-['Outfit']">
              Quick Test: Common Sick Leaves
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Tap any sample to see instant AI diagnosis & medicine guide:
            </p>
          </div>
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
            1-Tap Demo
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {[
            { id: 'sample_tomato_early_blight', crop: 'Tomato Blight', color: 'border-red-200 hover:border-red-400 bg-red-50/50', icon: '🍅' },
            { id: 'sample_paddy_blast', crop: 'Paddy Blast', color: 'border-amber-200 hover:border-amber-400 bg-amber-50/50', icon: '🌾' },
            { id: 'sample_cotton_whitefly', crop: 'Cotton Whitefly', color: 'border-blue-200 hover:border-blue-400 bg-blue-50/50', icon: '☁️' },
            { id: 'sample_maize_armyworm', crop: 'Maize Armyworm', color: 'border-emerald-200 hover:border-emerald-400 bg-emerald-50/50', icon: '🌽' },
          ].map((sample) => (
            <button
              key={sample.id}
              onClick={() => onSelectSampleDiagnosis(sample.id)}
              className={`p-2.5 rounded-2xl border text-left transition transform active:scale-95 flex flex-col justify-between ${sample.color}`}
            >
              <div className="text-2xl">{sample.icon}</div>
              <div className="mt-2">
                <div className="text-xs font-bold text-slate-900 truncate">{sample.crop}</div>
                <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">Test Diagnosis →</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Farm Diary Recent Snapshot & Direct Call Help */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* Farm Diary Log Card */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-700" />
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900 font-['Outfit']">
                  {texts.diaryTitle}
                </h3>
              </div>
              <button
                onClick={() => onNavigate('diary')}
                className="text-xs font-bold text-emerald-700 hover:underline"
              >
                Open Diary →
              </button>
            </div>

            <div className="mt-3 space-y-2">
              {(recentDiary || []).slice(0, 2).map((item) => (
                <div
                  key={item.id}
                  className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 flex items-start gap-2 text-xs"
                >
                  <span className="text-base shrink-0">
                    {item.activityType === 'sowing' ? '🌱' : item.activityType === 'irrigation' ? '💧' : '🧪'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-slate-900 truncate">{item.title}</div>
                    <div className="text-[11px] text-slate-500 font-medium">
                      {item.cropName} • {item.date}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigate('diary')}
            className="mt-3.5 w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-xl text-xs flex items-center justify-center gap-1 transition"
          >
            {texts.addDiaryEntry}
          </button>
        </div>

        {/* Expert Helpline Direct Access */}
        <div className="bg-gradient-to-br from-blue-900 to-indigo-950 text-white rounded-3xl p-4 sm:p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider bg-blue-500/30 text-blue-200 px-2 py-0.5 rounded-full border border-blue-400/30">
                Kisan Helpline 24x7
              </span>
              <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
            </div>

            <h3 className="text-base sm:text-lg font-black tracking-tight mt-2 font-['Outfit']">
              Talk to Krishi Vigyan Kendra Expert
            </h3>
            <p className="text-xs text-blue-200 font-medium mt-1 leading-relaxed">
              Dr. Ramesh Kumar Sharma & ICAR agronomists are available to guide you in Hindi, Punjabi & English.
            </p>
          </div>

          <div className="mt-4 flex gap-2">
            <button
              onClick={() => onNavigate('helpline')}
              className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md transition"
            >
              <PhoneCall className="w-4 h-4 text-slate-950" />
              <span>{texts.voiceCall}</span>
            </button>

            <button
              onClick={() => onNavigate('helpline')}
              className="px-3 py-2.5 bg-white/15 hover:bg-white/25 active:scale-95 text-white font-bold rounded-xl text-xs flex items-center justify-center transition border border-white/20"
            >
              Chat & Photo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
