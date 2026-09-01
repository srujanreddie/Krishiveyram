/**
 * Image processing and error correction utilities for KrishiVeyra Plant Doctor.
 * - Handles phone camera high-res downscaling to optimal AI vision size (max 1280px)
 * - Converts raw blobs to clean JPEG data URLs
 * - Provides image rotation correction (for sideways phone captures)
 * - Provides graceful fallback image handling
 */

export const FALLBACK_CROP_IMAGE =
  'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=800&q=80';

export const FALLBACK_EXPERT_AVATAR =
  'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=256&q=80';

// High-quality verified image pools for different agricultural medicine classes
export const CHEMICAL_MEDICINE_IMAGE_POOL: string[] = [
  'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=600&q=80', // Wettable powder / lab beaker formulation (Early Blight / Leaf Spots)
  'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=600&q=80', // Golden liquid triazole fungicide bottle (Rust / Sheath Blight)
  'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=600&q=80', // Blue copper hydroxide crystal solution (Downy Mildew / Canker)
  'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80', // Solid agrochemical blister/tablet formulation (Rice Blast / Tricyclazole)
  'https://images.unsplash.com/photo-1585842378054-ee2e52f94ba2?auto=format&fit=crop&w=600&q=80', // Heavy duty chemical canister jug (Late Blight / Phytophthora)
  'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&w=600&q=80', // Blue safety-cap agro formulation container (Armyworm / Bollworm)
  'https://images.unsplash.com/photo-1628744448840-55bdb2497bd4?auto=format&fit=crop&w=600&q=80', // High-pressure spray canister (Whitefly / Aphids / Sucking Pests)
  'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80', // Precision dispenser SC bottle (Thrips / Mites / Fipronil)
  'https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=600&q=80', // Amber bottle with warning dosage scale (Vector Control / Imidacloprid)
  'https://images.unsplash.com/photo-1584744982491-665216d95f8b?auto=format&fit=crop&w=600&q=80', // Yellow agrochemical canister with measuring cap (Powdery Mildew / Sulfur)
  'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80', // Clean white agricultural liquid bottle (Anthracnose / Fruit Rot)
  'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=600&q=80', // Pharmaceutical grade bactericide dispenser (Bacterial Blight / Canker)
  'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=600&q=80', // Industrial knapsack field spray solution (Scale / Mealybug)
];

export const ORGANIC_MEDICINE_IMAGE_POOL: string[] = [
  'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80', // Pure cold-pressed neem oil dropper bottle (Sucking pests / Neem oil)
  'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=600&q=80', // Herbal NSKE / Dashparni decoction bottle with fresh herbs (Botanical bio-spray)
  'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=600&q=80', // Emerald green bio-control liquid flask (Trichoderma / Pseudomonas)
  'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?auto=format&fit=crop&w=600&q=80', // Laboratory microbial spore tubes (Bt / Beauveria / Armyworm Bio)
  'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=600&q=80', // Fermented probiotic bio-liquid jar (Bacillus / Sour buttermilk / Mildew)
  'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80', // Botanical oil emulsion spray dispenser (Mites / Thrips organic)
  'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=600&q=80', // Dark concentrated botanical tincture dropper (Antiseptic Ark)
  'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=600&q=80', // Golden fermented Jeev Amrit elixir jar (Plant Immunity)
  'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80', // Green botanical foliar mist container (Foliar Bio-shield)
  'https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?auto=format&fit=crop&w=600&q=80', // Fermentation-derived spinosad dropper bottle (Bio-larvicide)
  'https://images.unsplash.com/photo-1563178406-4cdc2923acbc?auto=format&fit=crop&w=600&q=80', // Bio-stimulant plant health tonic with leaves
];

export const DEFAULT_CHEMICAL_MEDICINE_IMAGE = CHEMICAL_MEDICINE_IMAGE_POOL[0];
export const DEFAULT_ORGANIC_MEDICINE_IMAGE = ORGANIC_MEDICINE_IMAGE_POOL[0];
export const DEFAULT_BIO_MEDICINE_IMAGE = ORGANIC_MEDICINE_IMAGE_POOL[2];

/**
 * Disease-matched medicine visual database.
 * Directly links the diagnosed plant disease category to its authentic agricultural remedy photo.
 */
export const DISEASE_SPECIFIC_MEDICINE_MAP: Array<{
  keywords: string[];
  chemicalImage: string;
  organicImage: string;
  category: string;
  defaultAction: string;
  formulation: string;
}> = [
  {
    // Late Blight / Phytophthora
    keywords: ['late blight', 'phytophthora', 'water-soaked', 'potato blight', 'tomato late blight'],
    chemicalImage: 'https://images.unsplash.com/photo-1585842378054-ee2e52f94ba2?auto=format&fit=crop&w=600&q=80',
    organicImage: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=600&q=80',
    category: 'Oomycete Blight',
    defaultAction: 'Systemic Translaminar Oomycete Inhibitor',
    formulation: 'WP (Wettable Powder) / DF',
  },
  {
    // Early Blight / Alternaria / Target Spot / Leaf Spot
    keywords: ['early blight', 'alternaria', 'target spot', 'leaf spot', 'cercospora', 'tikka', 'septoria', 'brown spot', 'macrosporium'],
    chemicalImage: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=600&q=80',
    organicImage: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=600&q=80',
    category: 'Fungal Foliar Spot',
    defaultAction: 'Protective & Curative Spore Barrier',
    formulation: '75% WP / SC',
  },
  {
    // Rice Blast / Sheath Blight / Pyricularia / Rhizoctonia
    keywords: ['blast', 'rice blast', 'pyricularia', 'sheath blight', 'neck blast', 'node blast', 'paddy blast', 'magnaporthe'],
    chemicalImage: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
    organicImage: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=600&q=80',
    category: 'Vascular & Foliar Blast',
    defaultAction: 'Systemic Melanin-Biosynthesis Inhibitor',
    formulation: '75% WP Specialist Powder',
  },
  {
    // Whitefly / Aphids / Jassids / Plant Hoppers / Sucking Pests / Bemisia
    keywords: ['whitefly', 'white fly', 'aphid', 'jassid', 'hopper', 'sucking pest', 'bemisia', 'leafhopper', 'bph', 'planthopper'],
    chemicalImage: 'https://images.unsplash.com/photo-1628744448840-55bdb2497bd4?auto=format&fit=crop&w=600&q=80',
    organicImage: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=600&q=80',
    category: 'Sucking Pest Attack',
    defaultAction: 'Translaminar Nymph & Adult Vapor Action',
    formulation: '50% WP / High-Pressure SC',
  },
  {
    // Thrips / Mites / Red Spider Mite / Yellow Mite / Scirtothrips
    keywords: ['thrips', 'mite', 'spider mite', 'yellow mite', 'red mite', 'scirtothrips', 'chilli leaf curl', 'curling'],
    chemicalImage: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80',
    organicImage: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80',
    category: 'Acaricide & Thripicide',
    defaultAction: 'Lipid-Synthesis & Nerve Axon Blockade',
    formulation: '5% SC / 22.9% SC Suspension',
  },
  {
    // Fall Armyworm / Caterpillar / Bollworm / Stem Borer / Pod Borer / Spodoptera / Helicoverpa
    keywords: ['armyworm', 'fall armyworm', 'caterpillar', 'bollworm', 'stem borer', 'pod borer', 'borer', 'spodoptera', 'helicoverpa', 'faw', 'larva', 'larvae', 'fruit borer'],
    chemicalImage: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&w=600&q=80',
    organicImage: 'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?auto=format&fit=crop&w=600&q=80',
    category: 'Caterpillar & Borer Larvicide',
    defaultAction: 'Ingestion Stomach Action & Ryanodine Muscle Lock',
    formulation: '5% SG / 18.5% SC Micro-Pellet',
  },
  {
    // Rust / Yellow Stripe Rust / Brown Rust / Stem Rust / Puccinia
    keywords: ['rust', 'stripe rust', 'yellow rust', 'brown rust', 'puccinia', 'leaf rust', 'wheat rust'],
    chemicalImage: 'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=600&q=80',
    organicImage: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=600&q=80',
    category: 'Systemic Triazole Eradicator',
    defaultAction: 'Ergosterol Demethylation Spore Killer',
    formulation: '25% EC Emulsifiable Liquid',
  },
  {
    // Powdery Mildew / Oidium / Erysiphe / Leveillula
    keywords: ['powdery mildew', 'mildew', 'oidium', 'erysiphe', 'white powder', 'leveillula'],
    chemicalImage: 'https://images.unsplash.com/photo-1584744982491-665216d95f8b?auto=format&fit=crop&w=600&q=80',
    organicImage: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=600&q=80',
    category: 'Anti-Mildew Sulfur Compound',
    defaultAction: 'Multisite Fungal Respiration Disrupter',
    formulation: '80% WDG Water Dispersible Granules',
  },
  {
    // Downy Mildew / Pseudoperonospora / Plasmopara / Blue Copper
    keywords: ['downy mildew', 'pseudoperonospora', 'plasmopara', 'peronospora'],
    chemicalImage: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=600&q=80',
    organicImage: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=600&q=80',
    category: 'Copper Contact Bactericide/Fungicide',
    defaultAction: 'Contact Ion Disruption of Zoospores',
    formulation: '50% WP (Copper Hydroxide)',
  },
  {
    // Bacterial Blight / Bacterial Wilt / Canker / Black Rot / Xanthomonas / Ralstonia
    keywords: ['bacterial', 'xanthomonas', 'ralstonia', 'canker', 'black rot', 'bacterial blight', 'bacterial wilt', 'erwinia'],
    chemicalImage: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=600&q=80',
    organicImage: 'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=600&q=80',
    category: 'Agricultural Bactericide Antibiotic',
    defaultAction: 'Bacterial Protein Synthesis Inhibition (Streptomycin)',
    formulation: '90:10 SP Soluble Powder Pack',
  },
  {
    // Anthracnose / Dieback / Fruit Rot / Colletotrichum
    keywords: ['anthracnose', 'dieback', 'die back', 'fruit rot', 'colletotrichum', 'ripe rot'],
    chemicalImage: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80',
    organicImage: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80',
    category: 'Broad Spectrum Curative',
    defaultAction: 'Dual-Action Strobilurin + Triazole Systemic',
    formulation: 'SC Suspension Liquid',
  },
  {
    // Root Rot / Damping Off / Collar Rot / Wilt / Fusarium / Pythium / Rhizoctonia
    keywords: ['root rot', 'damping off', 'collar rot', 'fusarium', 'pythium', 'rhizoctonia', 'wilt', 'vascular wilt', 'seedling blight'],
    chemicalImage: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=600&q=80',
    organicImage: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=600&q=80',
    category: 'Root Drench & Bio-Shield',
    defaultAction: 'Rhizosphere Antagonistic Colonization',
    formulation: '1% WP Bio-Fungicide Powder',
  },
  {
    // Leaf Curl Virus / Mosaic Virus / Viral Yellows (Vector Transmission)
    keywords: ['leaf curl', 'mosaic', 'virus', 'geminivirus', 'yellow vein', 'spotted wilt', 'tospovirus', 'curly top'],
    chemicalImage: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=600&q=80',
    organicImage: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80',
    category: 'Systemic Vector Suppressor',
    defaultAction: 'Central Nervous Nicotinic Receptor Vector Block',
    formulation: '17.8% SL Soluble Liquid',
  },
  {
    // Mealybug / Scale Insects / Pseudococcus
    keywords: ['mealybug', 'mealy bug', 'scale insect', 'scale', 'pseudococcus'],
    chemicalImage: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=600&q=80',
    organicImage: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=600&q=80',
    category: 'Wax-Penetrating Insecticide',
    defaultAction: 'Dissolves Protective Waxy Exoskeleton Coat',
    formulation: 'EC Emulsion Concentrate',
  },
];

/**
 * Curated map of authentic, verified images for agricultural medicines,
 * fungicides, insecticides, and organic bio-control formulations.
 */
export const MEDICINE_IMAGE_CATALOG: Record<string, string> = {
  // Mancozeb / Azoxystrobin / Wettable Powder Fungicides
  mancozeb: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=600&q=80',
  azoxystrobin: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=600&q=80',
  saaf: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=600&q=80',
  dithane: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=600&q=80',
  captan: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=600&q=80',
  carbendazim: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=600&q=80',

  // Neem Oil / Pure Botanical Extracts
  neem: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80',
  azadirachtin: 'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=600&q=80',
  nske: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=600&q=80',
  dashparni: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=600&q=80',
  agniastra: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=600&q=80',
  bramhastra: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=600&q=80',

  // Rice Blast / Tricyclazole
  tricyclazole: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
  beam: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
  isoprothiolane: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
  kasugamycin: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=600&q=80',

  // Bio-fungicides / Pseudomonas / Trichoderma / Bacillus
  pseudomonas: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=600&q=80',
  trichoderma: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=600&q=80',
  bacillus: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=600&q=80',
  subtilis: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=600&q=80',
  serenade: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=600&q=80',
  thuringiensis: 'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?auto=format&fit=crop&w=600&q=80',
  bt: 'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?auto=format&fit=crop&w=600&q=80',
  dipel: 'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?auto=format&fit=crop&w=600&q=80',
  beauveria: 'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?auto=format&fit=crop&w=600&q=80',
  verticillium: 'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?auto=format&fit=crop&w=600&q=80',

  // Sucking Pest / Whitefly / Diafenthiuron / Pyriproxyfen / Pegasus
  diafenthiuron: 'https://images.unsplash.com/photo-1628744448840-55bdb2497bd4?auto=format&fit=crop&w=600&q=80',
  pegasus: 'https://images.unsplash.com/photo-1628744448840-55bdb2497bd4?auto=format&fit=crop&w=600&q=80',
  pyriproxyfen: 'https://images.unsplash.com/photo-1628744448840-55bdb2497bd4?auto=format&fit=crop&w=600&q=80',
  polo: 'https://images.unsplash.com/photo-1628744448840-55bdb2497bd4?auto=format&fit=crop&w=600&q=80',

  // Thrips / Mites / Fipronil / Spiromesifen / Oberon
  fipronil: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80',
  spiromesifen: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80',
  regent: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80',
  oberon: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80',
  abamectin: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80',

  // Fall Armyworm / Caterpillar / Emamectin Benzoate / Chlorantraniliprole / Coragen
  emamectin: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&w=600&q=80',
  chlorantraniliprole: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&w=600&q=80',
  coragen: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&w=600&q=80',
  proclaim: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&w=600&q=80',
  flubendiamide: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&w=600&q=80',
  fame: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&w=600&q=80',

  // Late Blight / Cymoxanil / Metalaxyl / Curzate
  cymoxanil: 'https://images.unsplash.com/photo-1585842378054-ee2e52f94ba2?auto=format&fit=crop&w=600&q=80',
  metalaxyl: 'https://images.unsplash.com/photo-1585842378054-ee2e52f94ba2?auto=format&fit=crop&w=600&q=80',
  curzate: 'https://images.unsplash.com/photo-1585842378054-ee2e52f94ba2?auto=format&fit=crop&w=600&q=80',
  ridomil: 'https://images.unsplash.com/photo-1585842378054-ee2e52f94ba2?auto=format&fit=crop&w=600&q=80',
  dimethomorph: 'https://images.unsplash.com/photo-1585842378054-ee2e52f94ba2?auto=format&fit=crop&w=600&q=80',
  sectin: 'https://images.unsplash.com/photo-1585842378054-ee2e52f94ba2?auto=format&fit=crop&w=600&q=80',

  // Copper Hydroxide / Copper Oxychloride (Blue Copper Fungicide)
  copper: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=600&q=80',
  kocide: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=600&q=80',
  blitox: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=600&q=80',
  bordeaux: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=600&q=80',

  // Wheat Rust / Propiconazole / Tilt / Triazole Fungicides
  propiconazole: 'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=600&q=80',
  tilt: 'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=600&q=80',
  hexaconazole: 'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=600&q=80',
  tebuconazole: 'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=600&q=80',
  difenoconazole: 'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=600&q=80',
  score: 'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=600&q=80',

  // Sulfur / Mites
  sulfur: 'https://images.unsplash.com/photo-1584744982491-665216d95f8b?auto=format&fit=crop&w=600&q=80',
  sulphur: 'https://images.unsplash.com/photo-1584744982491-665216d95f8b?auto=format&fit=crop&w=600&q=80',
  sulfex: 'https://images.unsplash.com/photo-1584744982491-665216d95f8b?auto=format&fit=crop&w=600&q=80',

  // Broad Systemic Insecticides / Imidacloprid / Thiamethoxam
  imidacloprid: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=600&q=80',
  confidor: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=600&q=80',
  thiamethoxam: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=600&q=80',
  actara: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=600&q=80',
  acetamiprid: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=600&q=80',

  // Organic Emulsions & Buttermilk
  buttermilk: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80',
  chhachh: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80',
  lactic: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80',
  pongamia: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80',
  karanj: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80',

  // Spinosad / Bio-ferments
  spinosad: 'https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?auto=format&fit=crop&w=600&q=80',
  tracer: 'https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?auto=format&fit=crop&w=600&q=80',
  entrust: 'https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?auto=format&fit=crop&w=600&q=80',

  // Bactericides
  streptocycline: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=600&q=80',
  plantomycin: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=600&q=80',
  streptomycin: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=600&q=80',

  // Organic Soil & Foliar Tonics
  jeev: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=600&q=80',
  panchagavya: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=600&q=80',
  seaweed: 'https://images.unsplash.com/photo-1563178406-4cdc2923acbc?auto=format&fit=crop&w=600&q=80',
  tonic: 'https://images.unsplash.com/photo-1563178406-4cdc2923acbc?auto=format&fit=crop&w=600&q=80',
  amino: 'https://images.unsplash.com/photo-1563178406-4cdc2923acbc?auto=format&fit=crop&w=600&q=80',
};

/**
 * Deterministically computes a hash index for a medicine name so that
 * uncatalogued medicine names distribute across our photo pools rather than
 * all falling back to the exact same photo.
 */
function hashStringToIndex(str: string, poolLength: number): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % poolLength;
}

/**
 * Returns an authentic image URL for a given agricultural medicine / remedy
 * resolved ACCORDING TO THE DIAGNOSED DISEASE AND CROP.
 *
 * Checks:
 * 1. Disease category keyword match (e.g. Late Blight, Rice Blast, Whitefly, Armyworm, Rust, Powdery Mildew, etc.)
 * 2. Medicine name catalog match (e.g. Mancozeb, Coragen, Tricyclazole, Neem, etc.)
 * 3. Remedy type (Organic / Bio-Pesticide vs Chemical)
 * 4. Deterministic hash distribution for uncatalogued custom names.
 */
export function getMedicineImage(
  name?: string,
  remedyType?: string,
  diseaseName?: string,
  cropName?: string
): string {
  const isOrganic = remedyType === 'organic' || remedyType === 'bio_pesticide';

  // 1. Check disease category first to ensure image is generated/selected according to the disease!
  if (diseaseName) {
    const lowerDisease = `${diseaseName} ${cropName || ''}`.toLowerCase();
    for (const entry of DISEASE_SPECIFIC_MEDICINE_MAP) {
      if (entry.keywords.some((kw) => lowerDisease.includes(kw))) {
        return isOrganic ? entry.organicImage : entry.chemicalImage;
      }
    }
  }

  // 2. Direct or partial catalog match on medicine name
  if (name) {
    const lowerName = name.toLowerCase().trim();
    for (const [key, url] of Object.entries(MEDICINE_IMAGE_CATALOG)) {
      if (lowerName.includes(key)) {
        return url;
      }
    }

    // Check if medicine name itself contains disease keywords
    for (const entry of DISEASE_SPECIFIC_MEDICINE_MAP) {
      if (entry.keywords.some((kw) => lowerName.includes(kw))) {
        return isOrganic ? entry.organicImage : entry.chemicalImage;
      }
    }

    // 3. Category pool hash distribution
    if (isOrganic || lowerName.includes('organic') || lowerName.includes('herbal') || lowerName.includes('oil') || lowerName.includes('ark')) {
      const idx = hashStringToIndex(lowerName, ORGANIC_MEDICINE_IMAGE_POOL.length);
      return ORGANIC_MEDICINE_IMAGE_POOL[idx];
    }

    const chemIdx = hashStringToIndex(lowerName, CHEMICAL_MEDICINE_IMAGE_POOL.length);
    return CHEMICAL_MEDICINE_IMAGE_POOL[chemIdx];
  }

  if (isOrganic) return DEFAULT_ORGANIC_MEDICINE_IMAGE;
  return DEFAULT_CHEMICAL_MEDICINE_IMAGE;
}

/**
 * Returns structured metadata about the disease-targeted remedy
 * for rich display of packaging label, mode of action, and formulation type.
 */
export function getDiseaseTargetInfo(
  diseaseName?: string,
  cropName?: string,
  remedyType?: string,
  remedyName?: string
): {
  diseaseCategory: string;
  targetLabel: string;
  actionMechanism: string;
  formulationBadge: string;
  batchCode: string;
  safetyClassColor: string;
} {
  const isOrganic = remedyType === 'organic' || remedyType === 'bio_pesticide';
  const cleanDisease = (diseaseName || 'Crop Protection').split('(')[0].trim();
  const cleanCrop = (cropName || 'Farm Crop').split('(')[0].trim();

  let matchedEntry = DISEASE_SPECIFIC_MEDICINE_MAP[0];
  if (diseaseName) {
    const lowerDisease = `${diseaseName} ${cropName || ''}`.toLowerCase();
    for (const entry of DISEASE_SPECIFIC_MEDICINE_MAP) {
      if (entry.keywords.some((kw) => lowerDisease.includes(kw))) {
        matchedEntry = entry;
        break;
      }
    }
  }

  const hashNum = Math.abs(
    `${cleanCrop}-${cleanDisease}-${remedyName || ''}`.split('').reduce((acc, char) => (acc << 5) - acc + char.charCodeAt(0), 0)
  );
  const batchCode = `AGR-${(hashNum % 9000 + 1000)}-${new Date().getFullYear().toString().slice(-2)}`;

  return {
    diseaseCategory: matchedEntry.category,
    targetLabel: `Target: ${cleanCrop} ${cleanDisease}`,
    actionMechanism: isOrganic
      ? `Botanical Bio-Defense & Natural Immunity (${matchedEntry.category})`
      : matchedEntry.defaultAction,
    formulationBadge: isOrganic
      ? '🌿 100% Bio-Active Formulation'
      : `🧪 ${matchedEntry.formulation}`,
    batchCode,
    safetyClassColor: isOrganic
      ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
      : 'bg-blue-100 text-blue-900 border-blue-300',
  };
}

/**
 * Optimizes an uploaded or captured photo for fast transfer and high-accuracy AI diagnosis.
 * Prevents 413 Payload Too Large and browser memory crashes on 48MP/108MP phone cameras.
 */
export async function processAndOptimizeImageFile(
  file: File,
  maxDimension = 1280,
  quality = 0.85
): Promise<{ dataUrl: string; mimeType: string; width: number; height: number }> {
  // Validate file type
  if (!file.type.startsWith('image/') && !file.name.match(/\.(jpg|jpeg|png|webp|heic|heif|bmp|gif)$/i)) {
    throw new Error('Please choose a valid photo file (JPEG, PNG, WEBP, or HEIC).');
  }

  // Read file as Data URL
  const rawDataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read image file. Please try again.'));
    reader.readAsDataURL(file);
  });

  // Load into Image element to measure and resize via canvas
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        let { width, height } = img;

        // Calculate aspect-ratio preserving dimensions
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          // If canvas context unavailable, return raw dataUrl
          return resolve({
            dataUrl: rawDataUrl,
            mimeType: file.type || 'image/jpeg',
            width: img.width,
            height: img.height,
          });
        }

        // Draw image cleanly
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to high-quality JPEG for optimal AI analysis
        const mimeType = 'image/jpeg';
        const dataUrl = canvas.toDataURL(mimeType, quality);

        resolve({ dataUrl, mimeType, width, height });
      } catch (err) {
        console.warn('Canvas optimization error, fallback to raw photo:', err);
        resolve({
          dataUrl: rawDataUrl,
          mimeType: file.type || 'image/jpeg',
          width: img.width || 800,
          height: img.height || 600,
        });
      }
    };

    img.onerror = () => {
      reject(new Error('Unable to render image. The photo might be corrupted. Please take a new photo.'));
    };

    img.src = rawDataUrl;
  });
}

/**
 * Rotates an image by 90 degrees clockwise.
 * Useful when farmer captures leaf photo in horizontal or upside-down orientation.
 */
export async function rotateBase64Image(dataUrl: string, degrees = 90): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) return resolve(dataUrl);

        // If 90 or 270 degrees, swap width & height
        const isOrthogonal = Math.abs(degrees) % 180 === 90;
        canvas.width = isOrthogonal ? img.height : img.width;
        canvas.height = isOrthogonal ? img.width : img.height;

        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((degrees * Math.PI) / 180);
        ctx.drawImage(img, -img.width / 2, -img.height / 2);

        resolve(canvas.toDataURL('image/jpeg', 0.9));
      } catch (err) {
        console.warn('Image rotate error:', err);
        resolve(dataUrl);
      }
    };

    img.onerror = () => reject(new Error('Could not rotate image'));
    img.src = dataUrl;
  });
}
