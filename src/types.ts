export interface UserProfile {
  id: string;
  fullName: string;
  villageLocation: string;
  stateRegion: string;
  phoneNumber: string;
  primaryLanguage: 'en' | 'hi' | 'ta' | 'te' | 'pa' | 'bn' | 'mr';
  landSizeAcres: number;
  soilType: 'black_cotton' | 'red_loamy' | 'alluvial' | 'clay' | 'sandy';
  mainCrops: string[];
  preferredUnit: 'liters' | 'drums' | 'acres';
  experienceYears: number;
}

export type ActivityType = 
  | 'sowing' 
  | 'irrigation' 
  | 'fertilizer' 
  | 'pesticide' 
  | 'weeding' 
  | 'scout_disease' 
  | 'harvest' 
  | 'note';

export interface FarmDiaryEntry {
  id: string;
  cropName: string;
  fieldSection: string;
  activityType: ActivityType;
  date: string;
  title: string;
  details: {
    productName?: string;
    quantity?: string;
    mixingRatio?: string;
    waterHours?: number;
    areaTreatedAcres?: number;
    costInRupees?: number;
  };
  cropStage: 'sowing' | 'vegetative' | 'flowering' | 'fruiting' | 'maturity' | 'harvest';
  weatherConditions?: string;
  notes: string;
  photos?: string[];
  diagnosisLinkedId?: string;
  createdAt: string;
}

export interface StepByStepRemedy {
  remedyType: 'organic' | 'bio_pesticide' | 'standard_chemical';
  name: string;
  activeIngredient: string;
  brandExamples: string[];
  imageUrl?: string;
  safetyBadge: 'Safe for Bees' | 'Low Toxicity' | 'Handle with Care' | 'Eco-Friendly' | string;
  mixingRatio: {
    perLiterSpoons: number;
    perLiterGramsOrMl: string;
    per15LTankGramsOrMl: string;
    perAcreRecommendation: string;
    instructions: string;
  };
  sprayTiming: {
    bestTimeOfDay: 'early_morning' | 'late_afternoon' | 'evening';
    recommendedHours: string;
    rainSafetyHours: number;
    temperatureLimitCelsius: number;
    weatherAdvice: string;
  };
  safetyEquipment: string[];
  waitingPeriodDays: number; // Pre-harvest interval (PHI)
  culturalPractices: string[];
}

export interface PlantDiagnosisResult {
  id: string;
  scanTimestamp: string;
  cropName: string;
  diseaseOrPestName: string;
  scientificName?: string;
  affectedPart: 'leaf' | 'stem' | 'fruit' | 'root' | 'whole_plant';
  severity: 'low' | 'moderate' | 'severe';
  confidenceScore: number;
  visualSymptoms: string[];
  causeExplanation: string;
  primaryRemedy: StepByStepRemedy;
  alternativeOrganicRemedy?: StepByStepRemedy;
  imageUrl: string;
  farmerNote?: string;
}

export interface WeatherDangerAlert {
  id: string;
  type: 'rain_after_spray' | 'heat_spike_pest' | 'high_wind_drift' | 'safe_spray_window' | 'high_humidity_fungus';
  level: 'danger' | 'warning' | 'optimal';
  title: string;
  message: string;
  impactOnFarming: string;
  suggestedAction: string;
  activeUntil: string;
}

export interface DailyWeatherForecast {
  date: string;
  dayName: string;
  tempMax: number;
  tempMin: number;
  condition: 'Sunny' | 'Partly Cloudy' | 'Rainy' | 'Thunderstorm' | 'Windy' | 'Hot Wave' | string;
  rainProbability: number;
  rainfallMm: number;
  humidityPercent: number;
  windSpeedKmh: number;
  spraySuitability: 'good' | 'risky' | 'bad';
  spraySuitabilityReason: string;
}

export interface HourlyWeatherForecast {
  time: string; // e.g. "06:00", "07:00", "08:00"
  hourLabel: string; // e.g. "6 AM"
  temperature: number;
  rainProbability: number;
  humidityPercent: number;
  windSpeedKmh: number;
  condition: string;
  spraySuitability: 'good' | 'risky' | 'bad';
}

export interface CurrentAgroWeather {
  temperature: number;
  feelsLike: number;
  condition: string;
  conditionIcon: string;
  humidityPercent: number;
  windSpeedKmh: number;
  windDirectionText: string;
  precipitationMm: number;
  rainProbability: number;
  uvIndex: number;
  dewPoint: number;
  sprayIndex: 'safe' | 'risky' | 'danger';
  sprayRecommendation: string;
  locationName: string;
  district: string;
  stateRegion: string;
  country: string;
  latitude: number;
  longitude: number;
  lastUpdated: string;
  isAutoDetected: boolean;
}

export interface AgroWeatherReport {
  current: CurrentAgroWeather;
  forecast: DailyWeatherForecast[];
  hourly: HourlyWeatherForecast[];
  alarms: WeatherDangerAlert[];
  aiAdvisory: string;
  bestSprayWindowToday: string;
  audioSummary: string;
}

export interface ChatMessage {
  id: string;
  sender: 'farmer' | 'expert' | 'system';
  senderName: string;
  text: string;
  timestamp: string;
  audioUrl?: string;
  imageUrl?: string;
  diagnosisAttachment?: Partial<PlantDiagnosisResult>;
}

export interface AgronomyExpert {
  id: string;
  name: string;
  title: string;
  institution: string;
  specialization: string;
  avatarUrl: string;
  languages: string[];
  rating: number;
  phone: string;
  isAvailable: boolean;
}
