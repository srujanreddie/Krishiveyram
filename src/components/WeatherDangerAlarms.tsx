import React, { useState, useEffect } from 'react';
import {
  CloudRain,
  Sun,
  Wind,
  Droplets,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  Volume2,
  ThermometerSun,
  Flame,
  Clock,
  Sparkles,
  MapPin,
  Navigation,
  Compass,
  Search,
  RefreshCw,
  Eye,
  Calendar,
  ShieldCheck,
  Info,
  Radio,
  ChevronRight,
  SunMedium,
  Zap,
} from 'lucide-react';
import {
  DailyWeatherForecast,
  HourlyWeatherForecast,
  WeatherDangerAlert,
  UserProfile,
  AgroWeatherReport,
  CurrentAgroWeather,
} from '../types';
import { SupportedLanguage, UI_TEXTS } from '../utils/translations';
import { speakText } from '../utils/audioSpeech';

interface WeatherDangerAlarmsProps {
  weatherReport: AgroWeatherReport | null;
  forecast: DailyWeatherForecast[];
  alarms: WeatherDangerAlert[];
  currentLang: SupportedLanguage;
  userProfile: UserProfile;
  onLocationDetected?: (loc: {
    villageLocation: string;
    stateRegion: string;
    latitude: number;
    longitude: number;
  }) => void;
  onRefreshWeather?: () => void;
  isDetectingLocation?: boolean;
  onTriggerAutoDetect?: () => void;
}

export const WeatherDangerAlarms: React.FC<WeatherDangerAlarmsProps> = ({
  weatherReport,
  forecast,
  alarms,
  currentLang,
  userProfile,
  onLocationDetected,
  onRefreshWeather,
  isDetectingLocation = false,
  onTriggerAutoDetect,
}) => {
  const texts = UI_TEXTS[currentLang] || UI_TEXTS.en;

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [selectedHourlyTab, setSelectedHourlyTab] = useState<'all' | 'morning' | 'afternoon'>('all');

  // Quick preset farm regions across Indian and agricultural belts
  const presetRegions = [
    { name: 'Bathinda, Punjab', lat: 30.211, lon: 74.9455, state: 'Punjab' },
    { name: 'Nashik, Maharashtra', lat: 19.9975, lon: 73.7898, state: 'Maharashtra' },
    { name: 'Warangal, Telangana', lat: 17.9689, lon: 79.5941, state: 'Telangana' },
    { name: 'Guntur, Andhra Pradesh', lat: 16.3067, lon: 80.4365, state: 'Andhra Pradesh' },
    { name: 'Karnal, Haryana', lat: 29.6857, lon: 76.9905, state: 'Haryana' },
    { name: 'Varanasi, Uttar Pradesh', lat: 25.3176, lon: 82.9739, state: 'Uttar Pradesh' },
  ];

  // Current weather state derived from report or fallback
  const current: CurrentAgroWeather = weatherReport?.current || {
    temperature: 31,
    feelsLike: 33,
    condition: forecast[0]?.condition || 'Partly Cloudy',
    conditionIcon: '⛅',
    humidityPercent: 62,
    windSpeedKmh: 8.5,
    windDirectionText: 'SSE',
    precipitationMm: 0.0,
    rainProbability: forecast[0]?.rainProbability || 10,
    uvIndex: 6,
    dewPoint: 22,
    sprayIndex: 'safe',
    sprayRecommendation:
      'Optimal conditions: Wind is calm (<12 km/h), leaves are dry, and no immediate rain forecasted.',
    locationName: userProfile.villageLocation || 'Bathinda, Punjab',
    district: 'Bathinda',
    stateRegion: userProfile.stateRegion || 'Punjab, India',
    country: 'India',
    latitude: 30.211,
    longitude: 74.9455,
    lastUpdated: 'Just now',
    isAutoDetected: false,
  };

  const activeAlarmsList = weatherReport?.alarms || alarms;
  const activeForecastList = weatherReport?.forecast || forecast;
  const hourlyList = weatherReport?.hourly || [];

  // Filtered hourly forecast based on quick time filters
  const filteredHourly = hourlyList.filter((item) => {
    const hourNum = parseInt(item.time.split(':')[0], 10);
    if (selectedHourlyTab === 'morning') return hourNum >= 5 && hourNum <= 11;
    if (selectedHourlyTab === 'afternoon') return hourNum >= 12 && hourNum <= 19;
    return true;
  });

  // Handle Search Location input
  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setSearchQuery(q);
    if (q.trim().length >= 2) {
      setIsSearching(true);
      setShowSearchDropdown(true);
      try {
        const res = await fetch(`/api/search-location?query=${encodeURIComponent(q.trim())}`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data.results || []);
        }
      } catch {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    } else {
      setSearchResults([]);
      setShowSearchDropdown(false);
    }
  };

  const handleSelectLocation = (loc: {
    name: string;
    admin1?: string;
    state?: string;
    lat?: number;
    latitude?: number;
    lon?: number;
    longitude?: number;
  }) => {
    const latitude = loc.latitude ?? loc.lat ?? 30.211;
    const longitude = loc.longitude ?? loc.lon ?? 74.9455;
    const stateRegion = loc.admin1 || loc.state || 'India';
    const villageLocation = `${loc.name}, ${stateRegion}`;

    setSearchQuery('');
    setShowSearchDropdown(false);

    if (onLocationDetected) {
      onLocationDetected({
        villageLocation,
        stateRegion,
        latitude,
        longitude,
      });
    }
  };

  // Audio Voice Briefing Handler (Kisan Weather Radio)
  const handleReadWeather = () => {
    if (weatherReport?.audioSummary) {
      speakText(weatherReport.audioSummary, currentLang);
      return;
    }

    const dangerSummary = (activeAlarmsList || []).map((a) => `${a.title}. ${a.suggestedAction}`).join(' ');
    const speech = `Kisan Weather Report for ${current.locationName}. Current temperature is ${current.temperature} degrees Celsius with ${current.condition}. Humidity is ${current.humidityPercent} percent and wind speed is ${current.windSpeedKmh} kilometers per hour. ${current.sprayRecommendation} ${dangerSummary}`;
    speakText(speech, currentLang);
  };

  return (
    <div className="space-y-4 pb-24 max-w-4xl mx-auto animate-in fade-in duration-200">
      {/* 🛰️ AI AUTO-LOCATION BAR & GPS RADAR HEADER */}
      <div className="bg-gradient-to-br from-blue-950 via-indigo-950 to-slate-900 text-white rounded-3xl p-4 sm:p-6 shadow-xl relative overflow-hidden border border-blue-800/40">
        <div className="absolute -right-8 -bottom-8 w-44 h-44 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          {/* Top Bar: Title & Action Buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/25 text-blue-200 text-xs font-bold border border-blue-400/30">
                <Radio className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                <span>AI Agro-Meteorology & Spray Radar</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight mt-1.5 font-['Outfit'] flex items-center gap-2">
                <span>Weather & Danger Alarms</span>
              </h1>
            </div>

            {/* Listen in Voice & Refresh */}
            <div className="flex items-center gap-2">
              <button
                id="btn-kisan-radio"
                onClick={handleReadWeather}
                className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 active:scale-95 text-slate-950 font-black rounded-2xl text-xs flex items-center gap-2 transition shadow-md"
                title="Listen to full agro-weather report in voice"
              >
                <Volume2 className="w-4 h-4 text-slate-950 shrink-0" />
                <span>Kisan Radio (आवाज़ में सुनें)</span>
              </button>

              {onRefreshWeather && (
                <button
                  onClick={onRefreshWeather}
                  className="p-2 bg-white/10 hover:bg-white/20 active:scale-95 text-white rounded-2xl transition border border-white/20"
                  title="Refresh weather data"
                >
                  <RefreshCw className="w-4 h-4 text-blue-200" />
                </button>
              )}
            </div>
          </div>

          {/* Current Location Pill & 1-Tap Auto-Detect GPS Button */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-white/15 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-start gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/30 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-emerald-300 uppercase tracking-wider">
                      Farm Location:
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/15 text-white">
                      Updated {current.lastUpdated}
                    </span>
                  </div>
                  <h2 className="text-sm sm:text-base font-extrabold text-white font-['Outfit'] mt-0.5">
                    {current.locationName || userProfile.villageLocation}
                  </h2>
                  <p className="text-xs text-blue-200 font-medium">
                    {current.stateRegion} • ({current.latitude.toFixed(3)}°N, {current.longitude.toFixed(3)}°E)
                  </p>
                </div>
              </div>

              {/* 🛰️ Auto-Detect GPS Button */}
              {onTriggerAutoDetect && (
                <button
                  id="btn-auto-detect-gps"
                  onClick={onTriggerAutoDetect}
                  disabled={isDetectingLocation}
                  className={`px-4 py-2.5 rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition shadow-md active:scale-95 shrink-0 ${
                    isDetectingLocation
                      ? 'bg-blue-600/80 text-white cursor-wait'
                      : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black'
                  }`}
                >
                  <Navigation className={`w-4 h-4 ${isDetectingLocation ? 'animate-spin' : ''}`} />
                  <span>
                    {isDetectingLocation
                      ? 'Detecting GPS Location...'
                      : '🛰️ Auto-Detect My Farm (GPS)'}
                  </span>
                </button>
              )}
            </div>

            {/* Search Village / District Input & Suggestions */}
            <div className="relative">
              <div className="flex items-center gap-2 bg-slate-900/80 rounded-xl px-3 py-2 border border-blue-400/30 focus-within:border-emerald-400 transition">
                <Search className="w-4 h-4 text-blue-300 shrink-0" />
                <input
                  type="text"
                  placeholder="Or search any village, mandi, district (e.g. Bathinda, Nashik, Guntur)..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => searchQuery.length >= 2 && setShowSearchDropdown(true)}
                  className="w-full bg-transparent text-xs sm:text-sm text-white placeholder:text-blue-300/70 focus:outline-none"
                />
                {isSearching && <RefreshCw className="w-3.5 h-3.5 text-blue-300 animate-spin" />}
              </div>

              {/* Search Dropdown Results */}
              {showSearchDropdown && searchResults.length > 0 && (
                <>
                  <div
                    className="fixed inset-0 z-20"
                    onClick={() => setShowSearchDropdown(false)}
                  />
                  <div className="absolute left-0 right-0 top-full mt-1.5 bg-slate-900 border border-blue-500/40 rounded-2xl shadow-2xl p-2 z-30 max-h-60 overflow-y-auto space-y-1">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-blue-300 px-2 py-1">
                      Select Farm Location:
                    </div>
                    {searchResults.map((res) => (
                      <button
                        key={res.id}
                        onClick={() => handleSelectLocation(res)}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-blue-800/60 transition flex items-center justify-between text-white"
                      >
                        <div className="font-semibold">{res.displayName}</div>
                        <span className="text-[10px] text-blue-300 font-mono">
                          {res.latitude?.toFixed(2)}°, {res.longitude?.toFixed(2)}°
                        </span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Quick Agricultural Belt Region Chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[10px] font-bold text-blue-300 uppercase tracking-wider mr-1">
                Popular Farm Belts:
              </span>
              {presetRegions.map((region, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectLocation(region)}
                  className="text-[11px] font-bold bg-white/10 hover:bg-white/20 active:scale-95 text-blue-100 px-2.5 py-1 rounded-lg border border-white/10 transition"
                >
                  📍 {region.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 🌾 AI SPRAY SAFETY GAUGE BANNER (Most Critical Farmer Metric) */}
      <div
        className={`rounded-3xl p-4 sm:p-5 border-2 shadow-md transition ${
          current.sprayIndex === 'safe'
            ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
            : current.sprayIndex === 'risky'
            ? 'bg-amber-50 border-amber-300 text-amber-950'
            : 'bg-rose-50 border-rose-300 text-rose-950 ring-2 ring-rose-400/30'
        }`}
      >
        <div className="flex items-start gap-3.5">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-md ${
              current.sprayIndex === 'safe'
                ? 'bg-emerald-600'
                : current.sprayIndex === 'risky'
                ? 'bg-amber-500'
                : 'bg-rose-600 animate-pulse'
            }`}
          >
            {current.sprayIndex === 'safe' ? (
              <ShieldCheck className="w-7 h-7" />
            ) : current.sprayIndex === 'risky' ? (
              <AlertTriangle className="w-7 h-7" />
            ) : (
              <ShieldAlert className="w-7 h-7" />
            )}
          </div>

          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <span
                className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                  current.sprayIndex === 'safe'
                    ? 'bg-emerald-600 text-white'
                    : current.sprayIndex === 'risky'
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-rose-600 text-white'
                }`}
              >
                {current.sprayIndex === 'safe'
                  ? '🟢 OPTIMAL SPRAY WINDOW'
                  : current.sprayIndex === 'risky'
                  ? '🟡 SPRAY WITH CAUTION'
                  : '🔴 DO NOT SPRAY TODAY'}
              </span>
              <span className="text-xs font-bold text-slate-500">
                Window: {weatherReport?.bestSprayWindowToday || '6:30 AM - 9:30 AM'}
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-black text-slate-900 font-['Outfit']">
              {current.sprayRecommendation}
            </h3>

            {weatherReport?.aiAdvisory && (
              <p className="text-xs text-slate-700 font-medium leading-relaxed pt-1 border-t border-slate-200/70">
                <strong className="text-slate-900">🌾 Agronomist Advisory:</strong> {weatherReport.aiAdvisory}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 🌡️ LIVE METEOROLOGICAL SNAPSHOT CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Temp & Condition */}
        <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Temperature
            </span>
            <span className="text-2xl">{current.conditionIcon}</span>
          </div>
          <div className="mt-2">
            <div className="text-2xl sm:text-3xl font-black text-slate-900 font-['Outfit']">
              {current.temperature}°C
            </div>
            <div className="text-xs font-semibold text-slate-500 mt-0.5">
              Feels like {current.feelsLike}°C • {current.condition}
            </div>
          </div>
        </div>

        {/* Rain Probability & mm */}
        <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Rain Chance
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <CloudRain className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl sm:text-3xl font-black text-blue-700 font-['Outfit']">
              {current.rainProbability}%
            </div>
            <div className="text-xs font-semibold text-slate-500 mt-0.5">
              {current.precipitationMm} mm precipitation
            </div>
          </div>
        </div>

        {/* Wind Speed & Direction */}
        <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Wind Velocity
            </span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Wind className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl sm:text-3xl font-black text-slate-900 font-['Outfit']">
              {current.windSpeedKmh} <span className="text-sm font-bold text-slate-500">km/h</span>
            </div>
            <div className="text-xs font-semibold text-slate-500 mt-0.5">
              Direction: {current.windDirectionText} ({current.windSpeedKmh < 12 ? 'Calm Spray' : 'Drift Risk'})
            </div>
          </div>
        </div>

        {/* Humidity & Dew Point */}
        <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Humidity / Dew
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Droplets className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl sm:text-3xl font-black text-indigo-900 font-['Outfit']">
              {current.humidityPercent}%
            </div>
            <div className="text-xs font-semibold text-slate-500 mt-0.5">
              Dew Point: {current.dewPoint}°C • UV: {current.uvIndex}
            </div>
          </div>
        </div>
      </div>

      {/* ⏰ TODAY'S 24-HOUR HOURLY SPRAY RADAR */}
      {hourlyList.length > 0 && (
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 font-['Outfit'] flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span>Today's Hour-by-Hour Spray Feasibility</span>
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Scroll horizontally to check safe spraying conditions for each hour:
              </p>
            </div>

            {/* Quick Filters */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start">
              <button
                onClick={() => setSelectedHourlyTab('all')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${
                  selectedHourlyTab === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
                }`}
              >
                24 Hours
              </button>
              <button
                onClick={() => setSelectedHourlyTab('morning')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${
                  selectedHourlyTab === 'morning' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
                }`}
              >
                Morning (5-11 AM)
              </button>
              <button
                onClick={() => setSelectedHourlyTab('afternoon')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${
                  selectedHourlyTab === 'afternoon' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
                }`}
              >
                Evening (12-7 PM)
              </button>
            </div>
          </div>

          {/* Horizontal Scrollable Hourly Cards */}
          <div className="flex items-center gap-2.5 overflow-x-auto pb-2 pt-1 no-scrollbar">
            {filteredHourly.map((hour, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-2xl border-2 min-w-[110px] sm:min-w-[125px] shrink-0 text-center space-y-1.5 transition ${
                  hour.spraySuitability === 'good'
                    ? 'bg-emerald-50/50 border-emerald-200'
                    : hour.spraySuitability === 'risky'
                    ? 'bg-amber-50/50 border-amber-200'
                    : 'bg-rose-50/50 border-rose-200'
                }`}
              >
                <div className="text-xs font-black text-slate-700">{hour.hourLabel}</div>
                <div className="text-lg font-black text-slate-900 font-['Outfit']">
                  {hour.temperature}°C
                </div>
                <div className="text-[11px] font-semibold text-blue-700 flex items-center justify-center gap-0.5">
                  <CloudRain className="w-3 h-3" />
                  {hour.rainProbability}%
                </div>
                <div className="text-[10px] font-medium text-slate-500">
                  💨 {hour.windSpeedKmh} km/h
                </div>

                <span
                  className={`inline-block text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                    hour.spraySuitability === 'good'
                      ? 'bg-emerald-600 text-white'
                      : hour.spraySuitability === 'risky'
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-rose-600 text-white'
                  }`}
                >
                  {hour.spraySuitability === 'good' ? '🟢 SAFE' : hour.spraySuitability === 'risky' ? '🟡 CAUTION' : '🔴 NO SPRAY'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ⚠️ PROMINENT ACTIVE DANGER ALARMS */}
      <div className="space-y-3">
        <div className="text-xs font-extrabold uppercase tracking-wider text-slate-500 px-1 flex items-center justify-between">
          <span>Active Farming Risk Alarms ({(activeAlarmsList || []).length})</span>
          <span className="text-[11px] font-bold text-emerald-700">Auto-calculated from live radar</span>
        </div>

        {(activeAlarmsList || []).map((alarm) => (
          <div
            key={alarm.id}
            className={`rounded-3xl p-4 sm:p-5 border-2 shadow-md transition ${
              alarm.level === 'danger'
                ? 'bg-rose-50 border-rose-300 text-rose-950 ring-2 ring-rose-400/30'
                : alarm.level === 'warning'
                ? 'bg-amber-50 border-amber-300 text-amber-950'
                : 'bg-emerald-50 border-emerald-300 text-emerald-950'
            }`}
          >
            <div className="flex items-start gap-3.5">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-md ${
                  alarm.level === 'danger'
                    ? 'bg-rose-600 animate-pulse'
                    : alarm.level === 'warning'
                    ? 'bg-amber-500'
                    : 'bg-emerald-600'
                }`}
              >
                {alarm.type === 'rain_after_spray' ? (
                  <CloudRain className="w-7 h-7" />
                ) : alarm.type === 'heat_spike_pest' ? (
                  <Flame className="w-7 h-7" />
                ) : alarm.type === 'high_humidity_fungus' ? (
                  <Droplets className="w-7 h-7" />
                ) : (
                  <ShieldCheck className="w-7 h-7" />
                )}
              </div>

              <div className="flex-1 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      alarm.level === 'danger'
                        ? 'bg-rose-600 text-white'
                        : alarm.level === 'warning'
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-emerald-600 text-white'
                    }`}
                  >
                    {alarm.level.toUpperCase()} ALERT
                  </span>
                  <span className="text-[11px] font-bold text-slate-500">
                    Active till {new Date(alarm.activeUntil).toLocaleDateString()}
                  </span>
                </div>

                <h2 className="text-base sm:text-lg font-black text-slate-900 leading-snug font-['Outfit']">
                  {alarm.title}
                </h2>

                <p className="text-xs text-slate-700 font-medium leading-relaxed">
                  {alarm.message}
                </p>

                {/* Impact & Suggested Action */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 mt-2 border-t border-slate-200/80">
                  <div className="p-2.5 rounded-xl bg-white/80 border border-slate-200/60 text-xs">
                    <span className="font-bold text-rose-700 block">⚠️ Crop Impact:</span>
                    <span className="text-slate-800 font-medium">{alarm.impactOnFarming}</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                    <span className="font-bold text-emerald-800 block">✅ Recommended Action:</span>
                    <span className="text-slate-800 font-medium">{alarm.suggestedAction}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 📅 7-DAY ACCESSIBLE WEATHER FORECAST */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 font-['Outfit'] flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              <span>7-Day Spray Window Forecast</span>
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Daily rain probability, temperature range, and agrochemical suitability:
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {(activeForecastList || []).map((day, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-2xl border-2 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                day.spraySuitability === 'good'
                  ? 'bg-emerald-50/40 border-emerald-200'
                  : day.spraySuitability === 'risky'
                  ? 'bg-amber-50/40 border-amber-200'
                  : 'bg-rose-50/40 border-rose-200'
              }`}
            >
              {/* Day & Condition */}
              <div className="flex items-center gap-3">
                <div className="text-3xl shrink-0">
                  {day.condition.toLowerCase().includes('sun') || day.condition.toLowerCase().includes('clear')
                    ? '☀️'
                    : day.condition.toLowerCase().includes('rain')
                    ? '🌧️'
                    : day.condition.toLowerCase().includes('thunder')
                    ? '⛈️'
                    : day.condition.toLowerCase().includes('hot')
                    ? '🌡️'
                    : '⛅'}
                </div>

                <div>
                  <div className="font-black text-sm text-slate-900 font-['Outfit']">
                    {day.dayName}
                  </div>
                  <div className="text-xs text-slate-600 font-medium">
                    {day.condition} • <strong className="text-slate-900">{day.tempMax}°C</strong> / {day.tempMin}°C
                  </div>
                </div>
              </div>

              {/* Rain mm, humidity & wind */}
              <div className="flex items-center gap-3 text-xs font-semibold text-slate-600 bg-white/70 px-3 py-1.5 rounded-xl border border-slate-200/60 shrink-0">
                <span className="flex items-center gap-1 text-blue-700">
                  <CloudRain className="w-3.5 h-3.5" />
                  {day.rainProbability}% ({day.rainfallMm}mm)
                </span>
                <span className="flex items-center gap-1 text-slate-500">
                  <Wind className="w-3.5 h-3.5" />
                  {day.windSpeedKmh} km/h
                </span>
                <span className="flex items-center gap-1 text-teal-600">
                  <Droplets className="w-3.5 h-3.5" />
                  {day.humidityPercent}%
                </span>
              </div>

              {/* Spray Suitability Badge */}
              <div className="flex items-center gap-2 sm:w-64 shrink-0">
                <span
                  className={`px-2.5 py-1 rounded-xl text-xs font-extrabold shrink-0 ${
                    day.spraySuitability === 'good'
                      ? 'bg-emerald-600 text-white'
                      : day.spraySuitability === 'risky'
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-rose-600 text-white'
                  }`}
                >
                  {day.spraySuitability === 'good' ? '🟢 SAFE' : day.spraySuitability === 'risky' ? '🟡 RISKY' : '🔴 DO NOT SPRAY'}
                </span>
                <span className="text-[11px] text-slate-600 font-medium line-clamp-2 leading-tight">
                  {day.spraySuitabilityReason}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
