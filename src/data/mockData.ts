import { CowProfile, VetDoctor, TestingLab, MarketListing, ReminderItem } from '../types';

export const INITIAL_COWS: CowProfile[] = [
  {
    id: 'cow-1',
    tagNumber: 'IN-MH-1042',
    name: 'Gauri (गौरी)',
    breed: 'Gir (Desi Indigenous)',
    ageYears: 4,
    ageMonths: 6,
    weightKg: 420,
    lactationStage: 'Peak Lactation',
    dailyYieldLiters: 15.5,
    fatPercentage: 4.8,
    bcs: 3.5,
    lastVaccinationDate: '2026-08-15',
    lastDewormingDate: '2026-07-10',
    nextVaccinationDate: '2027-02-15',
    healthNotes: 'Calved 45 days ago. High appetite, active chewing cud, glossy coat. Teat hygiene good.',
    createdAt: '2026-09-01',
  },
  {
    id: 'cow-2',
    tagNumber: 'IN-PB-8891',
    name: 'Lakshmi (HF Cross)',
    breed: 'Holstein Friesian Cross',
    ageYears: 3,
    ageMonths: 2,
    weightKg: 510,
    lactationStage: 'Early Lactation',
    dailyYieldLiters: 26.0,
    fatPercentage: 3.8,
    bcs: 3.0,
    lastVaccinationDate: '2026-06-20',
    lastDewormingDate: '2026-08-01',
    nextVaccinationDate: '2026-12-20',
    healthNotes: 'High yield lactation. Monitored for negative energy balance. Supplemented with bypass fat.',
    createdAt: '2026-09-10',
  },
  {
    id: 'cow-3',
    tagNumber: 'IN-HR-5520',
    name: 'Kaali (काली - Murrah)',
    breed: 'Murrah Buffalo',
    ageYears: 5,
    ageMonths: 0,
    weightKg: 580,
    lactationStage: 'Mid Lactation',
    dailyYieldLiters: 13.5,
    fatPercentage: 7.4,
    bcs: 3.7,
    lastVaccinationDate: '2026-05-12',
    lastDewormingDate: '2026-07-28',
    nextVaccinationDate: '2026-11-12',
    healthNotes: 'Excellent buffalo fat yield (7.4%). Loves wallowing in pond; feet and teats sound.',
    createdAt: '2026-09-15',
  },
  {
    id: 'cow-4',
    tagNumber: 'IN-GJ-3104',
    name: 'Nandini (Heifer)',
    breed: 'Sahiwal',
    ageYears: 1,
    ageMonths: 8,
    weightKg: 280,
    lactationStage: 'Heifer',
    dailyYieldLiters: 0,
    bcs: 3.2,
    lastVaccinationDate: '2026-08-05',
    lastDewormingDate: '2026-08-05',
    healthNotes: 'Ready for artificial insemination (AI) next cycle. Target breeding weight reached.',
    createdAt: '2026-09-20',
  }
];

export const INITIAL_VETS: VetDoctor[] = [
  {
    id: 'vet-1',
    name: 'Dr. Ramesh Sharma, B.V.Sc & A.H.',
    degree: 'B.V.Sc & A.H., M.V.Sc (Veterinary Medicine)',
    specialty: 'Bovine Medicine & Mastitis Care',
    clinicName: 'Kisan Livestock Care Center',
    address: 'Near Central Dairy Cooperative, GT Road, Karnal',
    city: 'Karnal, Haryana',
    phone: '+91 98765 43210',
    emergencyAvailable: true,
    experienceYears: 14,
    consultationFee: '₹300 - ₹500 (Home visit available)',
    rating: 4.9,
  },
  {
    id: 'vet-2',
    name: 'Dr. Priya Patil, M.V.Sc (Gynaecology)',
    degree: 'M.V.Sc (Animal Reproduction & Obstetrics)',
    specialty: 'Artificial Insemination & Calving Care',
    clinicName: 'Anand Rural Veterinary Dispensary',
    address: 'Plot 12, Dairy Science Campus, Anand',
    city: 'Anand, Gujarat',
    phone: '+91 98123 45678',
    emergencyAvailable: true,
    experienceYears: 11,
    consultationFee: '₹350',
    rating: 4.8,
  },
  {
    id: 'vet-3',
    name: 'Dr. Gurpreet Singh Sandhu',
    degree: 'B.V.Sc & A.H.',
    specialty: 'Surgical & Lameness/Hoof Trimming',
    clinicName: 'Sandhu Mobile Cattle Clinic',
    address: 'Ludhiana-Ferozepur Highway, Ludhiana',
    city: 'Ludhiana, Punjab',
    phone: '+91 99887 76655',
    emergencyAvailable: true,
    experienceYears: 18,
    consultationFee: '₹400 (Mobile emergency van)',
    rating: 4.9,
  },
  {
    id: 'vet-4',
    name: 'Dr. Suresh Kumar Deshmukh',
    degree: 'B.V.Sc, PG Diploma in Dairy Herd Health',
    specialty: 'Herd Nutrition & Preventive Health',
    clinicName: 'Maharashtra Krishi Animal Hospital',
    address: 'Old Pune-Bangalore Road, Kolhapur',
    city: 'Kolhapur, Maharashtra',
    phone: '+91 97654 32190',
    emergencyAvailable: false,
    experienceYears: 9,
    consultationFee: '₹250',
    rating: 4.7,
  }
];

export const INITIAL_LABS: TestingLab[] = [
  {
    id: 'lab-1',
    name: 'National Dairy Research & Forage Analytical Lab',
    accreditedBy: 'NABL & FSSAI Accredited (ISO/IEC 17025)',
    address: 'Sector 14, Forage Technology Complex, Karnal, Haryana',
    city: 'Karnal, Haryana',
    phone: '+91 184 2259000',
    email: 'testing@ndri-testing.gov.in',
    turnaroundDays: '2 to 3 Business Days',
    testsOffered: [
      'Aflatoxin B1 / M1 Mycotoxin HPLC Screen',
      'Silage Fermentation Panel (pH, Ammonia-N, Butyric/Lactic Acid)',
      'Proximate Analysis (Crude Protein, Crude Fiber, TDN, Ash)',
      'Urea Adulteration & Non-Protein Nitrogen Test',
      'Heavy Metals & Pesticide Residue Screening'
    ],
    sampleInstructions: 'Pack 500g of representative silage or feed in double-sealed airtight Ziploc bag with moisture intact. If sending silage, ship chilled with ice pack.',
    pricingEstimate: '₹800 - ₹1,800 depending on panel',
  },
  {
    id: 'lab-2',
    name: 'Calf & Feed Quality Assurance Laboratory',
    accreditedBy: 'NDDB Calf Accredited',
    address: 'Near Amul Dairy Road, Anand, Gujarat',
    city: 'Anand, Gujarat',
    phone: '+91 2692 258000',
    email: 'info@calflabs.org',
    turnaroundDays: '1 to 2 Business Days (Express available)',
    testsOffered: [
      'Comprehensive Cattle Feed Pellet Analysis',
      'Milk Composition (Fat%, SNF%, Protein, Lactose)',
      'Milk Adulterants (Urea, Starch, Detergent, Maltodextrin, Neutralizers)',
      'Somatic Cell Count (SCC) for Mastitis screening'
    ],
    sampleInstructions: 'Collect samples from at least 5 different points in the feed bag or silo face and mix evenly. For milk, submit 100ml preserved with bronopol tablet or chilled at 4°C.',
    pricingEstimate: '₹500 - ₹1,200',
  },
  {
    id: 'lab-3',
    name: 'Apex Agronomic & Animal Feed Diagnostic Lab',
    accreditedBy: 'ISO 9001:2015 & State Agriculture Dept. Certified',
    address: 'Agriculture University Campus, Pune, Maharashtra',
    city: 'Pune, Maharashtra',
    phone: '+91 20 2567 8901',
    email: 'feedcheck@apexlabs.in',
    turnaroundDays: '3 Business Days',
    testsOffered: [
      'Total Mixed Ration (TMR) Moisture & DM%',
      'Mineral Profiling (Calcium, Phosphorus, Magnesium, Zinc, Copper)',
      'Microbial Count & Fungal Spore Count',
      'Prussic Acid (HCN) Screening in Young Sorghum'
    ],
    sampleInstructions: 'Minimum 1 kg dry forage or 500g grain mix in clean paper/poly bag. Include sample collection date and storage conditions.',
    pricingEstimate: '₹750 - ₹1,500',
  }
];

export const INITIAL_MARKETPLACE: MarketListing[] = [
  {
    id: 'market-1',
    title: 'Fresh Pure A2 Gir Cow Raw Milk (Daily Supply)',
    category: 'milk',
    type: 'sell',
    price: 65,
    priceUnit: 'per Liter',
    quantity: '40 Liters Daily',
    location: 'Rajkot, Gujarat',
    sellerName: 'Bhavna Organic Goshala',
    sellerPhone: '+91 98250 11223',
    description: 'Chilled unadulterated farm fresh A2 Gir cow milk. 4.6% Fat, 8.8% SNF. Free delivery within 10km radius.',
    imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80',
    datePosted: 'Today',
    badge: 'Farm Direct',
  },
  {
    id: 'market-2',
    title: 'High-Yield Murrah Buffalo in 2nd Lactation',
    category: 'cattle',
    type: 'sell',
    price: 88000,
    priceUnit: 'Total Price',
    quantity: '1 Buffalo with Female Calf',
    location: 'Rohtak, Haryana',
    sellerName: 'Chaudhary Surender Singh',
    sellerPhone: '+91 94160 55667',
    description: 'Fresh calved 22 days ago with female calf. Current tested yield 16 Liters/day with 7.2% fat. Quiet temperament, easy milking.',
    imageUrl: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=600&q=80',
    datePosted: 'Yesterday',
    badge: 'Verified Health',
  },
  {
    id: 'market-3',
    title: 'Vacuum-Packed Sweet Corn Silage Bales (100kg / 250kg)',
    category: 'feed',
    type: 'sell',
    price: 4.8,
    priceUnit: 'per kg',
    quantity: '25 Tons Available',
    location: 'Karnal, Haryana',
    sellerName: 'GreenPastures Agritech',
    sellerPhone: '+91 98960 99881',
    description: 'Harvested at 50% milk line stage. High grain ratio, sweet fermented aroma, pH 3.9, crude protein 8.5%. 18-month shelf life airtight bales.',
    imageUrl: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=600&q=80',
    datePosted: '2 days ago',
    badge: 'Lab Tested',
  },
  {
    id: 'market-4',
    title: 'Traditional Desi Cow Bilona Vedic Ghee (Glass Jar)',
    category: 'dairy_products',
    type: 'sell',
    price: 1450,
    priceUnit: 'per kg Jar',
    quantity: '30 Jars Ready',
    location: 'Udaipur, Rajasthan',
    sellerName: 'Kamdhenu Dairy Farms',
    sellerPhone: '+91 94141 33445',
    description: 'Handcrafted by curd-churning bilona method over slow cow-dung firewood. Golden granular texture, divine natural aroma. Lab verified pure.',
    imageUrl: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=600&q=80',
    datePosted: '3 days ago',
    badge: 'Handcrafted',
  },
  {
    id: 'market-5',
    title: 'Looking to Buy 20 Quintals Premium Wheat Straw (Tukda Bhusa)',
    category: 'feed',
    type: 'buy',
    price: 950,
    priceUnit: 'per Quintal (100kg)',
    quantity: '20 Quintals',
    location: 'Meerut, Uttar Pradesh',
    sellerName: 'Rameshwar Dairy Farm',
    sellerPhone: '+91 98370 77112',
    description: 'Urgent requirement for combine-threshed fine dry wheat bhusa. Must be moisture-free and without dust or mud. Cash payment on unloading.',
    datePosted: 'Yesterday',
    badge: 'Urgent Buy Request',
  },
  {
    id: 'market-6',
    title: 'HF Cross First Calver Heifer (Due in 30 Days)',
    category: 'cattle',
    type: 'sell',
    price: 62000,
    priceUnit: 'Total Price',
    quantity: '1 Heifer',
    location: 'Nashik, Maharashtra',
    sellerName: 'Kailash Patil Dairy',
    sellerPhone: '+91 98500 44332',
    description: 'Pregnancy confirmed by veterinary doctor (8 months). Dam produced 28L/day peak. Dehorned, vaccinated for FMD & Brucellosis.',
    imageUrl: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=600&q=80',
    datePosted: '4 days ago',
    badge: 'Pregnant Heifer',
  }
];

export const INITIAL_REMINDERS: ReminderItem[] = [
  {
    id: 'rem-1',
    cowId: 'cow-1',
    cowName: 'Gauri (Gir)',
    title: 'Quarterly Deworming (Albendazole / Ivermectin)',
    type: 'deworming',
    dueDate: '2026-10-15',
    completed: false,
    notes: 'Administer before morning feed.'
  },
  {
    id: 'rem-2',
    cowId: 'cow-3',
    cowName: 'Kaali (Murrah)',
    title: 'FMD (Foot and Mouth Disease) Booster Dose',
    type: 'vaccination',
    dueDate: '2026-11-12',
    completed: false,
    notes: 'Coordinate with government veterinary dispensary officer.'
  },
  {
    id: 'rem-3',
    title: 'Check Silage Bunker Face Seal & Reorder Mineral Mix',
    type: 'feed_order',
    dueDate: '2026-10-10',
    completed: false,
    notes: 'Order 50kg bag of chelated mineral mixture + salt block.'
  }
];

// Sample test cases for AI Health Check
export const HEALTH_SAMPLE_CASES = [
  {
    id: 'sample-mastitis',
    name: 'Suspected Udder Inflammation (Mastitis)',
    breed: 'HF Cross Cow',
    age: '4 Years',
    status: 'Peak Lactation (22L/day)',
    symptoms: ['Swollen right hind quarter', 'Teat warm to touch', 'Mild yellow flakes in milk stream', 'Discomfort during milking'],
    notes: 'Cow stepped uncomfortably when milker touched rear quarter. Milk yield dropped 4 liters this morning.',
    description: 'Typical early clinical mastitis symptoms with localized inflammation and milk texture changes.',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300'
  },
  {
    id: 'sample-lsd',
    name: 'Skin Nodules & Fever (LSD Alert)',
    breed: 'Indigenous Zebu Cow',
    age: '3 Years',
    status: 'Early Lactation',
    symptoms: ['Round raised skin nodules on neck & brisket', 'High body temperature (104.5°F)', 'Watery nasal discharge', 'Enlarged prescapular lymph nodes'],
    notes: 'Observed several firm 2-3cm nodules spreading over shoulders. Multiple flies in shed.',
    description: 'High clinical suspicion of Lumpy Skin Disease (Capripoxvirus) requiring prompt quarantine.',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-300'
  },
  {
    id: 'sample-footrot',
    name: 'Hoof Lameness & Swelling (Foot Rot)',
    breed: 'Murrah Buffalo',
    age: '5 Years',
    status: 'Milking',
    symptoms: ['Reluctance to bear weight on left foreleg', 'Foul odor between hoof claws', 'Swelling above coronary band', 'Lying down frequently'],
    notes: 'Ground has been muddy due to recent rains. Animal walked with obvious limp.',
    description: 'Interdigital necrobacillosis (Foot Rot) needing claw cleansing and antiseptic soak.',
    badgeColor: 'bg-orange-100 text-orange-800 border-orange-300'
  },
  {
    id: 'sample-bloat',
    name: 'Acute Rumen Tympany (Bloat)',
    breed: 'Gir Cow',
    age: '4 Years',
    status: 'Mid Lactation',
    symptoms: ['Sudden left flank distension (tight like a drum)', 'Restlessness and kicking at abdomen', 'Rapid shallow breathing', 'Frequent urination attempts'],
    notes: 'Animal grazed on lush wet berseem clover early this morning before dry fodder was fed.',
    description: 'Frothy pasture bloat emergency requiring immediate decompression and anti-foaming drench.',
    badgeColor: 'bg-red-100 text-red-800 border-red-300'
  },
  {
    id: 'sample-healthy',
    name: 'Healthy Vital Check (Normal Condition)',
    breed: 'Sahiwal Cow',
    age: '4 Years',
    status: 'Mid Lactation (14L/day)',
    symptoms: ['Alert and curious expression', 'Active rhythmic cud chewing (rumination)', 'Moist cool muzzle with clean droplets', 'Glossy smooth skin coat'],
    notes: 'Routine herd monitoring. Milk yield steady, feces normal consistency.',
    description: 'Model healthy cow profile for benchmark comparisons.',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300'
  }
];

// Sample test cases for Feed & Silage Quality Check
export const FEED_SAMPLE_CASES = [
  {
    id: 'feed-sample-good-silage',
    name: 'Premium Corn Silage (Optimal Fermentation)',
    feedType: 'Corn Silage',
    moisture: 'Optimal (~65-68%)',
    smell: 'Pleasantly Acidic / Fruity Bread Aroma',
    color: 'Olive Green to Yellow-Golden',
    ph: 3.9,
    temperature: 'Ambient / Cool (< 25°C)',
    hasMold: false,
    notes: 'Chopped at 1/2 inch with uniform kernel processing. Firmly packed bunker face.'
  },
  {
    id: 'feed-sample-moldy-aflatoxin',
    name: 'Contaminated Cattle Feed / High Mold Warning',
    feedType: 'Cattle Concentrate Pellets',
    moisture: 'High / Damp',
    smell: 'Musty / Moldy',
    color: 'White / Grey Mold Patches',
    ph: undefined,
    temperature: 'Warm (35°C - 42°C)',
    hasMold: true,
    notes: 'Bags were stored against a damp brick wall during monsoon rain leaks. Visible powdery fungal clumps.'
  },
  {
    id: 'feed-sample-clostridial',
    name: 'Clostridial Spoiled Silage (Butyric Acid Risk)',
    feedType: 'Grass / Sorghum Silage',
    moisture: 'Very Wet / Soggy (> 75%)',
    smell: 'Butyric / Rotten / Rancid',
    color: 'Dark Brown / Charred',
    ph: 5.3,
    temperature: 'Warm (35°C)',
    hasMold: false,
    notes: 'High moisture at harvest. Silage smells like rancid butter / putrid. Cattle refused to eat.'
  },
  {
    id: 'feed-sample-commercial-damp',
    name: 'Commercial Concentrate (Moisture & Urea Screen)',
    feedType: 'Concentrate Mash / Bran',
    moisture: 'Damp / High',
    smell: 'Pungent / Chemical Hint',
    color: 'Normal Brownish',
    ph: undefined,
    temperature: 'Ambient',
    hasMold: false,
    notes: 'Bought from local dealer. Strong pungent odor noticed upon opening. Need to check for excess non-protein nitrogen (urea).'
  }
];

// Offline Emergency Livestock First Aid Guides
export const OFFLINE_FIRST_AID_GUIDES = [
  {
    title: 'Mastitis Early First Aid',
    urgency: 'High Priority',
    steps: [
      'Perform CMT (California Mastitis Test) or squirt 3-4 streams onto dark surface to check for flakes or clots.',
      'Completely strip out the infected quarter into a disinfectant container every 2 hours.',
      'Apply cold water or ice pack for 10-15 minutes if udder is hot, engorged, and painful.',
      'Dip teat in 0.5% iodine teat dip solution after milking.',
      'NEVER mix milk from an inflamed quarter with tank milk. Contact veterinarian for intramammary antibiotic infusion.'
    ]
  },
  {
    title: 'Bloat (Tympany) Emergency Actions',
    urgency: 'Critical Emergency',
    steps: [
      'Stop all concentrate and lush green legume feeding immediately.',
      'Keep the cow standing with front feet on higher ground to relieve diaphragm pressure.',
      'Gently massage the left paralumbar fossa (sunken area between last rib and hip bone).',
      'Administer 250-300 ml of vegetable cooking oil or mustard oil (prevents foam bubbling).',
      'Tie a smooth wooden stick in the cow’s mouth like a horse bit to stimulate saliva and continuous belching.',
      'If cow collapses or is gasping for air, emergency trocarization by a trained veterinarian or compounder is lifesaving.'
    ]
  },
  {
    title: 'Milk Fever (Hypocalcemia) in Fresh Cows',
    urgency: 'Urgent',
    steps: [
      'Classic signs: Cow lies down within 48 hours of calving, S-shaped neck posture, cold ears and dry muzzle.',
      'Do NOT drench oral liquids if the cow is unconscious or unable to swallow (risk of fatal aspiration pneumonia into lungs!).',
      'Prop the cow into upright sternal recumbency using straw bales so rumen gas can escape.',
      'Call veterinarian immediately for slow intravenous (IV) infusion of Calcium Borogluconate at body temperature.'
    ]
  },
  {
    title: 'Heat Stress Management for High Yielders',
    urgency: 'Medium Priority',
    steps: [
      'Provide continuous high-volume fresh drinking water under dense shade.',
      'Splash cool water over the animal’s body (especially head, neck, and back) for 3-5 minutes every 2 hours.',
      'Install ceiling air circulation fans or wet gunny bag curtains.',
      'Shift 60-70% of feeding to cool nighttime hours (8 PM - 5 AM).',
      'Add 50-70g sodium bicarbonate (baking soda) to daily ration to prevent rumen acidosis during panting.'
    ]
  }
];
