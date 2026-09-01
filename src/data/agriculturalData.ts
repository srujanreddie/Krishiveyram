import { PlantDiagnosisResult, AgronomyExpert, DailyWeatherForecast, WeatherDangerAlert, UserProfile } from '../types';

export const DEFAULT_USER_PROFILE: UserProfile = {
  id: 'farmer_101',
  fullName: 'Baldev Singh',
  villageLocation: 'Rampur Kalan, District Bathinda',
  stateRegion: 'Punjab, India',
  phoneNumber: '+91 98765 43210',
  primaryLanguage: 'en',
  landSizeAcres: 4.5,
  soilType: 'alluvial',
  mainCrops: ['Wheat', 'Rice (Paddy)', 'Cotton', 'Tomato'],
  preferredUnit: 'liters',
  experienceYears: 18,
};

export const SAMPLE_DIAGNOSES: PlantDiagnosisResult[] = [
  {
    id: 'sample_tomato_early_blight',
    scanTimestamp: new Date().toISOString(),
    cropName: 'Tomato (टमाटर / தக்காளி)',
    diseaseOrPestName: 'Early Blight (Alternaria solani)',
    scientificName: 'Alternaria solani',
    affectedPart: 'leaf',
    severity: 'moderate',
    confidenceScore: 94,
    visualSymptoms: [
      'Concentric dark brown rings on lower leaves (target board pattern)',
      'Yellow halo around necrotic leaf spots',
      'Premature leaf drop starting from the bottom of the plant'
    ],
    causeExplanation: 'Fungal infection caused by Alternaria solani. It thrives during warm temperatures (24-29°C) combined with prolonged leaf wetness or high humidity after irrigation.',
    primaryRemedy: {
      remedyType: 'standard_chemical',
      name: 'Mancozeb 75% WP (M-45) or Azoxystrobin',
      activeIngredient: 'Mancozeb 75% WP',
      brandExamples: ['Dithane M-45', 'Indofil M-45', 'UPL Saaf'],
      imageUrl: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=600&q=80',
      safetyBadge: 'Low Toxicity',
      mixingRatio: {
        perLiterSpoons: 2,
        perLiterGramsOrMl: '2.5 grams per 1 Liter water',
        per15LTankGramsOrMl: '35-40 grams (approx. 7-8 level spoons) in 15L backpack tank',
        perAcreRecommendation: '500-600 grams in 200 Liters of water per acre',
        instructions: 'Mix powder in a small bowl with 1 liter water first to make a smooth paste, then pour into the full 15L water tank while stirring continuously.'
      },
      sprayTiming: {
        bestTimeOfDay: 'early_morning',
        recommendedHours: '6:30 AM to 9:30 AM (before sun gets strong)',
        rainSafetyHours: 4,
        temperatureLimitCelsius: 32,
        weatherAdvice: 'Spray when leaf surfaces are dry and no rain is forecasted for at least 4 hours.'
      },
      safetyEquipment: ['😷 Face Mask', '🧤 Rubber Gloves', '🥽 Protective Goggles', '👟 Closed Boots'],
      waitingPeriodDays: 3,
      culturalPractices: [
        'Prune and safely burn or bury affected bottom leaves',
        'Avoid overhead sprinkler watering; use drip or furrow irrigation at the root zone',
        'Maintain 60cm plant spacing for adequate air circulation'
      ]
    },
    alternativeOrganicRemedy: {
      remedyType: 'organic',
      name: 'Neem Oil 10,000 PPM + Trichoderma Viride',
      activeIngredient: 'Azadirachtin + Bio-fungicide',
      brandExamples: ['EcoNeem', 'Niprot Trichoderma', 'Bio-Cure-F'],
      imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80',
      safetyBadge: 'Safe for Bees',
      mixingRatio: {
        perLiterSpoons: 1,
        perLiterGramsOrMl: '5 ml Neem Oil + 2 ml mild liquid soap per 1 Liter water',
        per15LTankGramsOrMl: '75 ml Neem oil + 30 ml soap in 15L tank',
        perAcreRecommendation: '1 Liter Neem Oil in 200L water per acre',
        instructions: 'Emulsify neem oil with liquid soap in warm water before adding to main sprayer tank.'
      },
      sprayTiming: {
        bestTimeOfDay: 'late_afternoon',
        recommendedHours: '4:30 PM to 6:30 PM (after bee activity stops)',
        rainSafetyHours: 6,
        temperatureLimitCelsius: 30,
        weatherAdvice: 'Spray on calm evenings to maximize bio-fungicide adherence.'
      },
      safetyEquipment: ['😷 Cotton Mask', '🧤 Gloves'],
      waitingPeriodDays: 0,
      culturalPractices: [
        'Mulch soil surface with clean straw to prevent soil-splash onto lower leaves'
      ]
    },
    imageUrl: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=800&q=80',
    farmerNote: 'Spotted on 15 plants in Section A near the water channel.'
  },
  {
    id: 'sample_paddy_blast',
    scanTimestamp: new Date().toISOString(),
    cropName: 'Rice / Paddy (धान / நெல்)',
    diseaseOrPestName: 'Paddy Leaf Blast (Magnaporthe oryzae)',
    scientificName: 'Magnaporthe oryzae',
    affectedPart: 'leaf',
    severity: 'severe',
    confidenceScore: 96,
    visualSymptoms: [
      'Spindle-shaped or eye-shaped lesions with gray-white centers',
      'Brown or reddish-brown border around lesions',
      'Lesions coalescing causing leaves to dry and turn papery'
    ],
    causeExplanation: 'Severe fungal epidemic triggered by excessive nitrogen fertilizer, high relative humidity (>90%), and cool nights (18-22°C) with morning dew.',
    primaryRemedy: {
      remedyType: 'standard_chemical',
      name: 'Tricyclazole 75% WP',
      activeIngredient: 'Tricyclazole 75% WP',
      brandExamples: ['Beam (Corteva)', 'Baan', 'Filia', 'Bim'],
      imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
      safetyBadge: 'Handle with Care',
      mixingRatio: {
        perLiterSpoons: 1,
        perLiterGramsOrMl: '0.6 to 1.0 gram per 1 Liter water',
        per15LTankGramsOrMl: '12-15 grams (approx. 2-3 teaspoons) per 15L knapsack tank',
        perAcreRecommendation: '120-150 grams in 150-200 Liters of water per acre',
        instructions: 'Mix carefully. Use flat fan or hollow cone nozzle to coat entire rice foliage including lower canopy.'
      },
      sprayTiming: {
        bestTimeOfDay: 'early_morning',
        recommendedHours: '7:00 AM to 10:00 AM once morning dew begins evaporating',
        rainSafetyHours: 2,
        temperatureLimitCelsius: 32,
        weatherAdvice: 'Tricyclazole is systemic and rainfast within 1-2 hours of application.'
      },
      safetyEquipment: ['😷 Mask', '🧤 Chemical Resistant Gloves', '🥽 Glasses', '🥾 Rubber Boots'],
      waitingPeriodDays: 30,
      culturalPractices: [
        'Immediately halt further top-dressing of Urea / Nitrogen fertilizer',
        'Drain standing field water for 2 days if feasible, then maintain shallow 2cm water layer',
        'Avoid excessive seeding density in next season'
      ]
    },
    alternativeOrganicRemedy: {
      remedyType: 'bio_pesticide',
      name: 'Pseudomonas fluorescens 1% WP (Bio-control)',
      activeIngredient: 'Pseudomonas fluorescens',
      brandExamples: ['Bio-Daconil', 'Eco-Paddy Bio', 'Tricho-Rice'],
      imageUrl: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=600&q=80',
      safetyBadge: 'Eco-Friendly',
      mixingRatio: {
        perLiterSpoons: 2,
        perLiterGramsOrMl: '10 grams per 1 Liter water',
        per15LTankGramsOrMl: '150 grams per 15L knapsack sprayer',
        perAcreRecommendation: '1.0 kg in 200 Liters of water per acre',
        instructions: 'Dissolve in clean, non-chlorinated water and apply immediately.'
      },
      sprayTiming: {
        bestTimeOfDay: 'late_afternoon',
        recommendedHours: '4:00 PM to 6:30 PM',
        rainSafetyHours: 8,
        temperatureLimitCelsius: 28,
        weatherAdvice: 'Apply during low UV hours so beneficial bacteria survive on leaves.'
      },
      safetyEquipment: ['😷 Dust Mask', '🧤 Gloves'],
      waitingPeriodDays: 0,
      culturalPractices: ['Apply silica-rich organic manure to harden rice leaf cell walls']
    },
    imageUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80',
    farmerNote: 'Spotted after 3 days of continuous cloudy humid weather in field block 2.'
  },
  {
    id: 'sample_cotton_whitefly',
    scanTimestamp: new Date().toISOString(),
    cropName: 'Cotton (कपास / பருத்தி)',
    diseaseOrPestName: 'Whitefly Infestation & Sooty Mold',
    scientificName: 'Bemisia tabaci',
    affectedPart: 'leaf',
    severity: 'moderate',
    confidenceScore: 91,
    visualSymptoms: [
      'Tiny white winged insects fluttering when underside of leaf is touched',
      'Sticky shiny honeydew on top surface of lower leaves',
      'Black sooty mold fungus growing over sticky leaves'
    ],
    causeExplanation: 'Sucking pest Bemisia tabaci. Nymphs and adults suck cell sap and transmit Cotton Leaf Curl Virus (CLCuV). Multiplies explosively in hot, dry weather (>35°C).',
    primaryRemedy: {
      remedyType: 'standard_chemical',
      name: 'Diafenthiuron 50% WP or Pyriproxyfen 10% EC',
      activeIngredient: 'Diafenthiuron 50% WP',
      brandExamples: ['Pegasus (Syngenta)', 'Lano', 'Polo'],
      imageUrl: 'https://images.unsplash.com/photo-1628744448840-55bdb2497bd4?auto=format&fit=crop&w=600&q=80',
      safetyBadge: 'Low Toxicity',
      mixingRatio: {
        perLiterSpoons: 1,
        perLiterGramsOrMl: '1.2 to 1.5 grams per 1 Liter water',
        per15LTankGramsOrMl: '20-25 grams (4 teaspoons) per 15L tank',
        perAcreRecommendation: '250 grams in 200 Liters of water per acre',
        instructions: 'Ensure spray reaches the underside of cotton leaves where whiteflies colonize.'
      },
      sprayTiming: {
        bestTimeOfDay: 'early_morning',
        recommendedHours: '6:00 AM to 8:30 AM (when whiteflies are sluggish)',
        rainSafetyHours: 4,
        temperatureLimitCelsius: 35,
        weatherAdvice: 'Early morning spray hits sluggish adults before wind causes chemical drift.'
      },
      safetyEquipment: ['😷 Mask', '🧤 Gloves', '🥽 Goggles'],
      waitingPeriodDays: 21,
      culturalPractices: [
        'Install Yellow Sticky Traps (8-10 traps per acre) at canopy height',
        'Avoid synthetic pyrethroids which destroy natural predators like Ladybird beetles',
        'Remove alternative weed hosts like Abutilon indicum from field borders'
      ]
    },
    alternativeOrganicRemedy: {
      remedyType: 'organic',
      name: '5% Neem Seed Kernel Extract (NSKE) + Dashparni Ark',
      activeIngredient: 'Botanical saponins and Azadirachtin',
      brandExamples: ['Self-made NSKE', 'Bio-Shield Neem'],
      imageUrl: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=600&q=80',
      safetyBadge: 'Safe for Bees',
      mixingRatio: {
        perLiterSpoons: 5,
        perLiterGramsOrMl: '50 ml NSKE extract per 1 Liter water',
        per15LTankGramsOrMl: '750 ml extract per 15L tank',
        perAcreRecommendation: '10 Liters NSKE in 200L water per acre',
        instructions: 'Filter extract through fine khadi cloth so sprayer nozzle never chokes.'
      },
      sprayTiming: {
        bestTimeOfDay: 'evening',
        recommendedHours: '5:00 PM to 7:00 PM',
        rainSafetyHours: 6,
        temperatureLimitCelsius: 32,
        weatherAdvice: 'Evening sprays avoid rapid sunlight breakdown of natural azadirachtin.'
      },
      safetyEquipment: ['😷 Mask', '🧤 Gloves'],
      waitingPeriodDays: 0,
      culturalPractices: ['Conserve Chrysoperla (Green lacewing) natural predators']
    },
    imageUrl: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?auto=format&fit=crop&w=800&q=80',
    farmerNote: 'Upper leaves showing crinkling and sticky drops.'
  },
  {
    id: 'sample_chilli_curl',
    scanTimestamp: new Date().toISOString(),
    cropName: 'Chilli / Pepper (मिर्च / மிளகாய்)',
    diseaseOrPestName: 'Chilli Leaf Curl (Thrips & Mites attack)',
    scientificName: 'Scirtothrips dorsalis / Polyphagotarsonemus latus',
    affectedPart: 'leaf',
    severity: 'moderate',
    confidenceScore: 89,
    visualSymptoms: [
      'Upward boat-shaped curling of young leaves (Thrips)',
      'Downward inverted cup-like curling with brittle thickened texture (Mites)',
      'Stunted bushy growth and drop of flowers/buds'
    ],
    causeExplanation: 'Joint infestation of Thrips and Yellow Mites that rasp and suck tender growing shoots, often aggravated by dry spells and high temperature.',
    primaryRemedy: {
      remedyType: 'standard_chemical',
      name: 'Fipronil 5% SC or Spiromesifen 22.9% SC',
      activeIngredient: 'Fipronil 5% SC / Spiromesifen',
      brandExamples: ['Regent (BASF)', 'Oberon (Bayer)', 'Prince'],
      imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80',
      safetyBadge: 'Handle with Care',
      mixingRatio: {
        perLiterSpoons: 1,
        perLiterGramsOrMl: '1.5 to 2.0 ml per 1 Liter water',
        per15LTankGramsOrMl: '25-30 ml per 15L backpack tank',
        perAcreRecommendation: '350-400 ml in 200 Liters of water per acre',
        instructions: 'Use fine hollow cone mist nozzle. Spray top and bottom surfaces of terminal buds.'
      },
      sprayTiming: {
        bestTimeOfDay: 'late_afternoon',
        recommendedHours: '4:00 PM to 6:30 PM',
        rainSafetyHours: 4,
        temperatureLimitCelsius: 34,
        weatherAdvice: 'Avoid hot midday sun to prevent leaf scorching.'
      },
      safetyEquipment: ['😷 Mask', '🧤 Gloves', '🥽 Eye Shield'],
      waitingPeriodDays: 7,
      culturalPractices: [
        'Set up Blue Sticky Traps (for Thrips) and Yellow Traps (for Whiteflies)',
        'Spray water jets on plant canopy in morning to knock down mites during dry spells',
        'Intercrop with 2 rows of Maize or Sorghum as a live barrier'
      ]
    },
    alternativeOrganicRemedy: {
      remedyType: 'organic',
      name: 'Neem Oil 10,000 PPM + Sour Buttermilk Spray',
      activeIngredient: 'Azadirachtin + Botanical deterrent',
      brandExamples: ['EcoNeem Super', 'AgriNeem Bio'],
      imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80',
      safetyBadge: 'Safe for Bees',
      mixingRatio: {
        perLiterSpoons: 2,
        perLiterGramsOrMl: '5 ml Neem Oil + 10 ml sour buttermilk per 1L water',
        per15LTankGramsOrMl: '75 ml Neem Oil + 150 ml buttermilk per 15L tank',
        perAcreRecommendation: '1 Liter Neem Oil in 200L water per acre',
        instructions: 'Mix well and spray onto apical growing tips to suppress mites and thrips.'
      },
      sprayTiming: {
        bestTimeOfDay: 'late_afternoon',
        recommendedHours: '4:30 PM to 6:30 PM',
        rainSafetyHours: 6,
        temperatureLimitCelsius: 32,
        weatherAdvice: 'Spray in late afternoon to protect beneficial predatory mites.'
      },
      safetyEquipment: ['😷 Mask', '🧤 Gloves'],
      waitingPeriodDays: 0,
      culturalPractices: ['Apply yellow sticky traps and avoid water stress in field']
    },
    imageUrl: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=800&q=80',
    farmerNote: 'Chilli nursery transplants are showing upward leaf cupping.'
  },
  {
    id: 'sample_maize_armyworm',
    scanTimestamp: new Date().toISOString(),
    cropName: 'Maize / Corn (मक्का / மக்காச்சோளம்)',
    diseaseOrPestName: 'Fall Armyworm (FAW) Infestation',
    scientificName: 'Spodoptera frugiperda',
    affectedPart: 'leaf',
    severity: 'severe',
    confidenceScore: 97,
    visualSymptoms: [
      'Pinholes and ragged "shot-hole" windowpane feeding on whorl leaves',
      'Heavy sawdust-like yellowish caterpillar excreta (frass) inside plant whorl',
      'Caterpillar with 4 square dots on tail segment and inverted "Y" on head'
    ],
    causeExplanation: 'Invasive pest Spodoptera frugiperda whose larvae hide deeply inside the central whorl of young maize plants, destroying growing buds overnight.',
    primaryRemedy: {
      remedyType: 'standard_chemical',
      name: 'Emamectin Benzoate 5% SG or Chlorantraniliprole 18.5% SC',
      activeIngredient: 'Emamectin Benzoate 5% SG',
      brandExamples: ['Proclaim (Syngenta)', 'Coragen (FMC)', 'Missile'],
      imageUrl: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&w=600&q=80',
      safetyBadge: 'Low Toxicity',
      mixingRatio: {
        perLiterSpoons: 1,
        perLiterGramsOrMl: '0.4 grams Emamectin Benzoate per 1 Liter water',
        per15LTankGramsOrMl: '6 to 8 grams (1.5 level teaspoons) per 15L knapsack tank',
        perAcreRecommendation: '80-100 grams in 200 Liters of water per acre',
        instructions: 'CRUCIAL: Direct the sprayer nozzle directly into the central funnel/whorl of each corn plant, not just broadcast over top leaves.'
      },
      sprayTiming: {
        bestTimeOfDay: 'evening',
        recommendedHours: '5:00 PM to 7:00 PM (when larvae come out to feed)',
        rainSafetyHours: 3,
        temperatureLimitCelsius: 32,
        weatherAdvice: 'Fall armyworm larvae feed actively at twilight and night.'
      },
      safetyEquipment: ['😷 Mask', '🧤 Gloves', '🥽 Glasses'],
      waitingPeriodDays: 14,
      culturalPractices: [
        'Apply handful of dry river sand mixed with lime/ash into central whorl for small plots',
        'Install FAW pheromone traps (5 per acre) for early moth detection',
        'Handpick and destroy egg masses covered in felt-like scales'
      ]
    },
    alternativeOrganicRemedy: {
      remedyType: 'bio_pesticide',
      name: 'Bacillus thuringiensis (Bt) kurstaki + Neem 10,000 PPM',
      activeIngredient: 'Bacillus thuringiensis var. kurstaki',
      brandExamples: ['Dipel Bt', 'Bio-Lep', 'Halt Bt'],
      imageUrl: 'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?auto=format&fit=crop&w=600&q=80',
      safetyBadge: 'Eco-Friendly',
      mixingRatio: {
        perLiterSpoons: 1,
        perLiterGramsOrMl: '2.0 grams Bt powder per 1 Liter water',
        per15LTankGramsOrMl: '30 grams per 15L knapsack tank',
        perAcreRecommendation: '400-500 grams in 200L water per acre',
        instructions: 'Pour into whorl at dusk so larvae consume crystal protein endotoxins overnight.'
      },
      sprayTiming: {
        bestTimeOfDay: 'evening',
        recommendedHours: '5:30 PM to 7:00 PM',
        rainSafetyHours: 6,
        temperatureLimitCelsius: 30,
        weatherAdvice: 'Bt crystals degrade in strong UV sunlight, evening application is required.'
      },
      safetyEquipment: ['😷 Mask', '🧤 Gloves'],
      waitingPeriodDays: 0,
      culturalPractices: ['Apply neem cake in soil at 100 kg/acre during sowing']
    },
    imageUrl: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=800&q=80',
    farmerNote: 'Central funnel of 20-day old maize has heavy chew marks and brown powder.'
  },
  {
    id: 'sample_potato_late_blight',
    scanTimestamp: new Date().toISOString(),
    cropName: 'Potato (आलू / உருளைக்கிழங்கு)',
    diseaseOrPestName: 'Late Blight of Potato (Phytophthora infestans)',
    scientificName: 'Phytophthora infestans',
    affectedPart: 'leaf',
    severity: 'severe',
    confidenceScore: 98,
    visualSymptoms: [
      'Water-soaked dark purplish-brown irregular lesions on leaf margins and tips',
      'White cottony downy mildew growth on the underside of leaves during humid morning',
      'Rapid rotting and blackening of foliage giving off a distinct foul decay odor'
    ],
    causeExplanation: 'Devastating oomycete pathogen triggered by cool temperatures (15-22°C) combined with high humidity (>90%) or prolonged morning fog/leaf wetness.',
    primaryRemedy: {
      remedyType: 'standard_chemical',
      name: 'Cymoxanil 8% + Mancozeb 64% WP or Metalaxyl-M + Mancozeb',
      activeIngredient: 'Cymoxanil + Mancozeb (Curzate M8 / Sectin)',
      brandExamples: ['Curzate M8 (Corteva)', 'Sectin (Bayer)', 'Ridomil Gold MZ', 'Equation Pro'],
      imageUrl: 'https://images.unsplash.com/photo-1585842378054-ee2e52f94ba2?auto=format&fit=crop&w=600&q=80',
      safetyBadge: 'Low Toxicity',
      mixingRatio: {
        perLiterSpoons: 2,
        perLiterGramsOrMl: '3.0 grams per 1 Liter water',
        per15LTankGramsOrMl: '45 grams (approx. 9 level spoons) per 15L backpack tank',
        perAcreRecommendation: '600 grams in 200 Liters of water per acre',
        instructions: 'Mix thoroughly in a bucket with 2L water first, then pour into knapsack sprayer while filling to 15L.'
      },
      sprayTiming: {
        bestTimeOfDay: 'early_morning',
        recommendedHours: '7:00 AM to 10:00 AM',
        rainSafetyHours: 3,
        temperatureLimitCelsius: 28,
        weatherAdvice: 'Systemic curative action. Spray immediately at first sign of water-soaked spots.'
      },
      safetyEquipment: ['😷 Protective Mask', '🧤 Chemical Gloves', '🥽 Goggles', '🥾 Rubber Boots'],
      waitingPeriodDays: 7,
      culturalPractices: [
        'High earthing-up of potato ridges to prevent spore wash-down into developing tubers',
        'Destroy infected vine haulms before harvesting tubers',
        'Avoid excessive furrow flooding or sprinkler irrigation'
      ]
    },
    alternativeOrganicRemedy: {
      remedyType: 'bio_pesticide',
      name: 'Copper Hydroxide 53.8% DF + Trichoderma Viride',
      activeIngredient: 'Copper Hydroxide + Bio-control',
      brandExamples: ['Kocide 3000', 'Cuprina Bio', 'Tricho-Shield'],
      imageUrl: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=600&q=80',
      safetyBadge: 'Eco-Friendly',
      mixingRatio: {
        perLiterSpoons: 2,
        perLiterGramsOrMl: '2.0 grams per 1 Liter water',
        per15LTankGramsOrMl: '30 grams in 15L knapsack tank',
        perAcreRecommendation: '500 grams in 200 Liters water per acre',
        instructions: 'Apply thoroughly to coat lower surfaces of all leaves.'
      },
      sprayTiming: {
        bestTimeOfDay: 'late_afternoon',
        recommendedHours: '4:00 PM to 6:30 PM',
        rainSafetyHours: 6,
        temperatureLimitCelsius: 28,
        weatherAdvice: 'Apply preventively before rainy/foggy weather periods.'
      },
      safetyEquipment: ['😷 Mask', '🧤 Gloves'],
      waitingPeriodDays: 3,
      culturalPractices: ['Ensure wide row spacing (60cm x 20cm) to allow air ventilation through crop canopy']
    },
    imageUrl: 'https://images.unsplash.com/photo-1590165482129-1b8b27698780?auto=format&fit=crop&w=800&q=80',
    farmerNote: 'Foliage showing water-soaked black spots after 2 days of heavy morning fog.'
  },
  {
    id: 'sample_wheat_rust',
    scanTimestamp: new Date().toISOString(),
    cropName: 'Wheat (गेहूं / கோதுமை)',
    diseaseOrPestName: 'Yellow Stripe Rust (Puccinia striiformis)',
    scientificName: 'Puccinia striiformis f. sp. tritici',
    affectedPart: 'leaf',
    severity: 'severe',
    confidenceScore: 96,
    visualSymptoms: [
      'Bright yellow to vivid orange powdery pustules arranged in parallel linear stripes along leaf veins',
      'Yellow urediniospores readily rub off onto fingers or clothes when walking through field',
      'Premature chlorosis and drying of flag leaf which starves developing grain heads'
    ],
    causeExplanation: 'Airborne fungal rust pathogen spreading via wind currents during cool, humid winter mornings (10-18°C) with heavy morning dew.',
    primaryRemedy: {
      remedyType: 'standard_chemical',
      name: 'Propiconazole 25% EC (Tilt / Bumper / Radar)',
      activeIngredient: 'Propiconazole 25% EC',
      brandExamples: ['Tilt 25 EC (Syngenta)', 'Bumper (ADAMA)', 'Result', 'Radar'],
      imageUrl: 'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=600&q=80',
      safetyBadge: 'Low Toxicity',
      mixingRatio: {
        perLiterSpoons: 1,
        perLiterGramsOrMl: '1.0 ml per 1 Liter water',
        per15LTankGramsOrMl: '15 ml per 15L knapsack tank',
        perAcreRecommendation: '200 ml in 200 Liters of water per acre',
        instructions: 'Mix 200 ml in 200L clean water for 1 acre using flat-fan nozzle for uniform canopy coverage.'
      },
      sprayTiming: {
        bestTimeOfDay: 'early_morning',
        recommendedHours: '7:30 AM to 10:30 AM (after morning dew begins to evaporate)',
        rainSafetyHours: 4,
        temperatureLimitCelsius: 26,
        weatherAdvice: 'Do not spray when leaves are dripping with dew; wait until leaf surface dries.'
      },
      safetyEquipment: ['😷 Face Mask', '🧤 Chemical Gloves', '🥽 Glasses'],
      waitingPeriodDays: 30,
      culturalPractices: [
        'Plant certified rust-resistant wheat varieties (e.g. PBW 725, HD 3086, DBW 187, DBW 222)',
        'Monitor field borders and microclimates near irrigation channels where rust starts first',
        'Avoid excessive early nitrogen top-dressing'
      ]
    },
    alternativeOrganicRemedy: {
      remedyType: 'bio_pesticide',
      name: 'Bacillus subtilis Bio-Fungicide + Sour Butter-Milk (Chhachh) Spray',
      activeIngredient: 'Bacillus subtilis + Lactic Acid Bio-barrier',
      brandExamples: ['Serenade Bio', 'Bio-Subtilis', 'Kisan Chhachh Solution'],
      imageUrl: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=600&q=80',
      safetyBadge: 'Safe for Bees',
      mixingRatio: {
        perLiterSpoons: 3,
        perLiterGramsOrMl: '30 ml fermented sour buttermilk + 5g Bacillus per 1 Liter water',
        per15LTankGramsOrMl: '500 ml fermented solution per 15L tank',
        perAcreRecommendation: '5-7 Liters fermented solution in 200L water per acre',
        instructions: 'Ferment buttermilk in a clay pot for 5 days before straining through cloth.'
      },
      sprayTiming: {
        bestTimeOfDay: 'late_afternoon',
        recommendedHours: '3:30 PM to 5:30 PM',
        rainSafetyHours: 6,
        temperatureLimitCelsius: 25,
        weatherAdvice: 'Apply in calm conditions to establish beneficial probiotic biofilm on wheat foliage.'
      },
      safetyEquipment: ['😷 Mask', '🧤 Gloves'],
      waitingPeriodDays: 0,
      culturalPractices: ['Maintain clean field boundaries free from wild grasses that harbor overwintering rust spores']
    },
    imageUrl: 'https://images.unsplash.com/photo-1543257580-7269da773bf5?auto=format&fit=crop&w=800&q=80',
    farmerNote: 'Bright yellow powdery stripes spotted on flag leaves across 2 acres.'
  }
];

export const AGRONOMY_EXPERTS: AgronomyExpert[] = [
  {
    id: 'expert_1',
    name: 'Dr. Ramesh Kumar Sharma',
    title: 'Senior Plant Pathologist & Agronomist',
    institution: 'Krishi Vigyan Kendra (KVK) Bathinda / ICAR',
    specialization: 'Cereal Crops, Cotton Pests & Fungicide Formulations',
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=256&q=80',
    languages: ['Hindi', 'Punjabi', 'English'],
    rating: 4.9,
    phone: '1800-180-1551',
    isAvailable: true,
  },
  {
    id: 'expert_2',
    name: 'Dr. Ananya Murugan',
    title: 'Principal Entomologist & Bio-Control Specialist',
    institution: 'Tamil Nadu Agricultural University (TNAU)',
    specialization: 'Horticulture, Vegetables, Organic Bio-Pesticides',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
    languages: ['Tamil', 'Telugu', 'English'],
    rating: 4.95,
    phone: '1800-425-1661',
    isAvailable: true,
  },
  {
    id: 'expert_3',
    name: 'Er. Suresh Patil',
    title: 'Soil & Irrigation Water Advisor',
    institution: 'Mahatma Phule Krishi Vidyapeeth (MPKV)',
    specialization: 'Soil Health, Drip Fertigation & Spray Timing',
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=256&q=80',
    languages: ['Marathi', 'Hindi', 'English'],
    rating: 4.85,
    phone: '1800-233-4000',
    isAvailable: true,
  }
];

export const INITIAL_WEATHER_FORECAST: DailyWeatherForecast[] = [
  {
    date: '2026-08-31',
    dayName: 'Today',
    tempMax: 33,
    tempMin: 24,
    condition: 'Sunny',
    rainProbability: 15,
    rainfallMm: 0,
    humidityPercent: 62,
    windSpeedKmh: 9,
    spraySuitability: 'good',
    spraySuitabilityReason: 'Optimal spray window between 6:30 AM and 9:30 AM. Low wind (9 km/h) and no rain.'
  },
  {
    date: '2026-09-01',
    dayName: 'Tomorrow (Tue)',
    tempMax: 30,
    tempMin: 23,
    condition: 'Thunderstorm',
    rainProbability: 85,
    rainfallMm: 28,
    humidityPercent: 88,
    windSpeedKmh: 24,
    spraySuitability: 'bad',
    spraySuitabilityReason: 'DANGER: Heavy thunderstorm (28mm rain) and high winds. DO NOT SPRAY — chemical will wash off.'
  },
  {
    date: '2026-09-02',
    dayName: 'Wednesday',
    tempMax: 31,
    tempMin: 22,
    condition: 'Rainy',
    rainProbability: 65,
    rainfallMm: 12,
    humidityPercent: 82,
    windSpeedKmh: 18,
    spraySuitability: 'risky',
    spraySuitabilityReason: 'Scattered drizzle forecasted in afternoon. Only spray systemic chemicals if urgent.'
  },
  {
    date: '2026-09-03',
    dayName: 'Thursday',
    tempMax: 34,
    tempMin: 23,
    condition: 'Partly Cloudy',
    rainProbability: 20,
    rainfallMm: 0,
    humidityPercent: 68,
    windSpeedKmh: 11,
    spraySuitability: 'good',
    spraySuitabilityReason: 'Good window for foliar fertilizer and bio-pesticides.'
  },
  {
    date: '2026-09-04',
    dayName: 'Friday',
    tempMax: 37,
    tempMin: 25,
    condition: 'Hot Wave',
    rainProbability: 5,
    rainfallMm: 0,
    humidityPercent: 44,
    windSpeedKmh: 14,
    spraySuitability: 'risky',
    spraySuitabilityReason: 'Heat spike (37°C). Spray ONLY during early dawn (5:30 - 7:30 AM) to avoid chemical leaf burn.'
  },
  {
    date: '2026-09-05',
    dayName: 'Saturday',
    tempMax: 36,
    tempMin: 24,
    condition: 'Sunny',
    rainProbability: 10,
    rainfallMm: 0,
    humidityPercent: 50,
    windSpeedKmh: 8,
    spraySuitability: 'good',
    spraySuitabilityReason: 'Excellent calm conditions. Perfect for insecticide & neem sprays.'
  },
  {
    date: '2026-09-06',
    dayName: 'Sunday',
    tempMax: 35,
    tempMin: 24,
    condition: 'Sunny',
    rainProbability: 10,
    rainfallMm: 0,
    humidityPercent: 55,
    windSpeedKmh: 10,
    spraySuitability: 'good',
    spraySuitabilityReason: 'Safe spray window throughout early morning.'
  }
];

export const INITIAL_WEATHER_ALARMS: WeatherDangerAlert[] = [
  {
    id: 'alarm_rain_tomorrow',
    type: 'rain_after_spray',
    level: 'danger',
    title: '🌧️ Heavy Rain Alert: Washout Risk in 24 Hours',
    message: 'Monsoon thunder showers (28mm) expected tomorrow with 85% probability. Any pesticide or foliar fertilizer sprayed today will be washed away before absorption.',
    impactOnFarming: 'Wasted chemical investment (Rs. 600-1200/acre) + ground water leaching.',
    suggestedAction: 'POSTPONE all chemical spraying until Thursday morning when clear weather returns.',
    activeUntil: '2026-09-02T18:00:00Z'
  },
  {
    id: 'alarm_heat_spike',
    type: 'heat_spike_pest',
    level: 'warning',
    title: '🌡️ 37°C Heat Spike Alert: Whitefly & Mite Explosion',
    message: 'High temperature surge combined with dry air forecasted for Friday. Thrips and sucking pests reproduce 2.5x faster in these conditions.',
    impactOnFarming: 'Rapid leaf curl expansion on Chilli, Cotton, and Tomato crops.',
    suggestedAction: 'Inspect leaf undersides on Thursday evening and ensure adequate soil moisture to prevent heat stress.',
    activeUntil: '2026-09-04T22:00:00Z'
  }
];

export const INITIAL_DIARY_ENTRIES = [
  {
    id: 'entry_1',
    cropName: 'Tomato (F1 Hybrid)',
    fieldSection: 'East Plot (2.0 Acres)',
    activityType: 'sowing' as const,
    date: '2026-08-10',
    title: 'Transplanted 4,500 Tomato Seedlings',
    details: {
      productName: 'Abhinav F1 Tomato',
      quantity: '4500 seedlings',
      areaTreatedAcres: 2.0,
      costInRupees: 4500
    },
    cropStage: 'sowing' as const,
    weatherConditions: 'Overcast, 28°C',
    notes: 'Dipped roots in Trichoderma solution before planting. Spacing 60cm x 45cm with raised beds.',
    photos: ['https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=400&q=80'],
    createdAt: '2026-08-10T08:00:00Z'
  },
  {
    id: 'entry_2',
    cropName: 'Tomato (F1 Hybrid)',
    fieldSection: 'East Plot (2.0 Acres)',
    activityType: 'irrigation' as const,
    date: '2026-08-18',
    title: 'Drip Irrigation & Humic Acid Root Drench',
    details: {
      productName: 'Humic Acid 98% Flakes',
      quantity: '500g via venturi',
      waterHours: 3.5,
      areaTreatedAcres: 2.0,
      costInRupees: 350
    },
    cropStage: 'vegetative' as const,
    weatherConditions: 'Sunny, 32°C',
    notes: '3.5 hours drip cycle at 2.4 LPH drippers. Good uniform moisture observed.',
    createdAt: '2026-08-18T10:30:00Z'
  },
  {
    id: 'entry_3',
    cropName: 'Tomato (F1 Hybrid)',
    fieldSection: 'East Plot (2.0 Acres)',
    activityType: 'fertilizer' as const,
    date: '2026-08-25',
    title: '19:19:19 NPK Fertigation Applied',
    details: {
      productName: 'Water Soluble NPK 19:19:19',
      quantity: '5 kg / acre',
      areaTreatedAcres: 2.0,
      costInRupees: 900
    },
    cropStage: 'vegetative' as const,
    weatherConditions: 'Partly Cloudy, 31°C',
    notes: 'Boosted vegetative growth and branch initiation before flowering.',
    createdAt: '2026-08-25T16:00:00Z'
  }
];
