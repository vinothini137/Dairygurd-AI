import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// High limit for base64 cow and feed images
app.use(express.json({ limit: '25mb' }));

// Server-side Gemini initialization
let aiClient: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY;

if (apiKey) {
  aiClient = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Fallback heuristic for Cow Health Screening when offline or if API has issues
function getFallbackHealthAssessment(symptoms: string[], notes?: string) {
  const lowerSymptoms = (symptoms || []).map((s) => s.toLowerCase());
  const combined = (lowerSymptoms.join(' ') + ' ' + (notes || '')).toLowerCase();

  let possibleHealthConcern = 'Appears Healthy / No Acute Distress Detected';
  let urgencyLevel: 'Normal' | 'Low Concern' | 'Moderate Concern' | 'Urgent Veterinary Attention' = 'Normal';
  let observableSigns = ['Alert eye contact and normal ear posture', 'No obvious respiratory distress or swelling reported'];
  let immediateCareGuidance = [
    'Continue routine clean water and balanced fodder ration.',
    'Monitor morning and evening milk yield for any sudden dip.',
    'Ensure clean, dry bedding to maintain teat and hoof hygiene.'
  ];
  let feedAdjustment = 'Maintain standard balanced lactation ration with adequate dry matter and clean water.';
  let isolationRecommended = false;
  let advisorySummary = 'Your cow appears in stable condition. Continue regular feeding and daily observation.';

  if (combined.includes('mastitis') || combined.includes('udder') || combined.includes('swollen udder') || combined.includes('milk drop') || combined.includes('clots in milk')) {
    possibleHealthConcern = 'Potential Mastitis / Udder Inflammation Risk';
    urgencyLevel = 'Urgent Veterinary Attention';
    observableSigns = ['Udder swelling, heat, or tenderness', 'Abnormal milk consistency or drop in daily milk yield'];
    immediateCareGuidance = [
      'Perform California Mastitis Test (CMT) or strip cup test immediately.',
      'Strip out affected quarters frequently (every 2-3 hours) into a disinfectant container.',
      'Apply cold water compresses if udder is hot and engorged, followed by post-milking teat dipping.',
      'Call veterinary doctor promptly for intramammary antibiotic infusion if bacterial mastitis is suspected.'
    ];
    feedAdjustment = 'Provide easily digestible green fodder, withhold high concentrates temporarily if fever is present, and offer fresh electrolyte water.';
    isolationRecommended = true;
    advisorySummary = 'Possible udder health risk detected. Keep the animal in a clean dry stall and contact a veterinary doctor immediately to prevent permanent quarter damage.';
  } else if (combined.includes('lumpy') || combined.includes('skin') || combined.includes('nodule') || combined.includes('lesion') || combined.includes('fever')) {
    possibleHealthConcern = 'Potential Lumpy Skin Disease (LSD) / Pox-like Viral Risk';
    urgencyLevel = 'Urgent Veterinary Attention';
    observableSigns = ['Nodular skin lesions around neck, brisket, and body', 'Fever, enlarged lymph nodes, reduced feed intake'];
    immediateCareGuidance = [
      'Isolate the animal immediately in a separate shed away from healthy herd.',
      'Control flies, mosquitoes, and ticks using neem oil spray or approved insect repellents.',
      'Apply antiseptic solution (povidone-iodine) to broken nodules to prevent secondary fly maggot strikes.',
      'Offer soft, palatable green fodder and oral electrolytes to prevent dehydration.'
    ];
    feedAdjustment = 'Provide high-energy soft mashes, green lucerne/berseem, and mineral mixture with Vitamin A, E, and Zinc for skin immunity.';
    isolationRecommended = true;
    advisorySummary = 'Possible contagious skin condition suspected. Isolate the cow immediately from the herd and request veterinary emergency visit for supportive therapy.';
  } else if (combined.includes('hoof') || combined.includes('lame') || combined.includes('foot rot') || combined.includes('walking')) {
    possibleHealthConcern = 'Foot Rot / Hoof Lesion or Lameness Indicator';
    urgencyLevel = 'Moderate Concern';
    observableSigns = ['Reluctance to bear weight, limping or unusual gait', 'Swelling or foul odor between claws of the hoof'];
    immediateCareGuidance = [
      'Clean the hoof thoroughly with clean water and inspect for lodged stones, wire, or thorns.',
      'Disinfect using a 5% copper sulfate or potassium permanganate foot bath.',
      'Keep the animal on soft dry straw bedding; avoid wet muddy conditions.',
      'Consult vet if swelling spreads above the coronary band.'
    ];
    feedAdjustment = 'Ensure dietary zinc and biotin supplementation for hoof wall healing.';
    isolationRecommended = false;
    advisorySummary = 'Hoof discomfort detected. Keep the animal on dry, soft ground and disinfect the hoof claws. Inspect for foreign debris.';
  } else if (combined.includes('bloat') || combined.includes('rumen') || combined.includes('left side swollen') || combined.includes('gas')) {
    possibleHealthConcern = 'Rumen Tympany / Acute Bloat Risk';
    urgencyLevel = 'Urgent Veterinary Attention';
    observableSigns = ['Distension of the left flank (paralumbar fossa)', 'Restlessness, kicking at belly, labored breathing'];
    immediateCareGuidance = [
      'Keep cow standing with head elevated; gently massage the left flank.',
      'Administer 200-300 ml of vegetable/mustard oil or antifoaming drench if trained.',
      'Place a wooden bit in mouth to induce chewing and salivation.',
      'Seek emergency veterinary care immediately if breathing becomes distressed.'
    ];
    feedAdjustment = 'Stop concentrate feeding and fresh young legume fodder immediately. Provide coarse dry wheat or paddy straw once recovered.';
    isolationRecommended = false;
    advisorySummary = 'Possible rumen bloat detected. This requires urgent attention. Do not feed concentrates or wet legumes. Contact vet if swelling increases.';
  } else if (combined.includes('eye') || combined.includes('discharge') || combined.includes('conjunctivitis')) {
    possibleHealthConcern = 'Bovine Keratoconjunctivitis (Pink Eye) or Ocular Irritation';
    urgencyLevel = 'Low Concern';
    observableSigns = ['Watery or cloudy eye discharge', 'Squinting and sensitivity to bright sunlight'];
    immediateCareGuidance = [
      'Clean around the eye using sterile saline solution and soft gauze.',
      'House the animal in a shaded shed away from direct sun and dust.',
      'Control face flies which spread pink eye bacteria.',
      'Consult vet for ophthalmic antibiotic ointment.'
    ];
    feedAdjustment = 'Provide balanced feed with Vitamin A supplementation.';
    isolationRecommended = false;
    advisorySummary = 'Eye irritation observed. House the cow in shaded quarters and wash eyes with sterile saline. Protect from flies.';
  }

  return {
    possibleHealthConcern,
    urgencyLevel,
    observableSigns,
    immediateCareGuidance,
    feedAdjustment,
    isolationRecommended,
    advisorySummary,
    disclaimer: 'Screening indicator only. Not a confirmed veterinary diagnosis. Consult a licensed veterinary doctor immediately for clinical diagnosis and prescription.'
  };
}

// Fallback heuristic for Feed & Silage Quality
function getFallbackFeedAssessment(params: {
  feedType: string;
  moisture: string;
  smell: string;
  color: string;
  ph?: number;
  temperature?: string;
  hasMold?: boolean;
}) {
  const { feedType, smell, color, ph, temperature, hasMold } = params;

  let qualityResult: 'Good' | 'Moderate' | 'Poor' | 'Needs Further Testing' = 'Good';
  let score = 88;
  let contaminationWarning = false;
  let adulterationRisk: string | null = null;
  const storageRecommendations = [
    'Keep feed protected from moisture, rain leaks, and rodents.',
    'Maintain proper bunker face management to minimize aerobic deterioration.',
    'Feed out at least 15-20 cm of silage face daily.'
  ];
  const recommendations = [
    'Safe for regular rationing according to milk production needs.',
    'Mix thoroughly with dry roughage and mineral mixture.'
  ];
  let advisorySummary = 'Feed quality appears suitable for standard cattle consumption. Maintain clean trough hygiene.';
  let laboratoryRecommended = false;

  const isRancid = smell === 'Butyric / Rotten / Rancid' || smell === 'Ammonia / Pungent';
  const isMusty = smell === 'Musty / Moldy';
  const isDark = color === 'Dark Brown / Charred' || color === 'Black / Slimy' || color === 'White / Grey Mold Patches';
  const isHot = temperature === 'Hot (> 45°C / 113°F)';

  if (hasMold || isMusty || color === 'White / Grey Mold Patches') {
    qualityResult = 'Poor';
    score = 28;
    contaminationWarning = true;
    adulterationRisk = 'High risk of fungal mycotoxins (Aflatoxin B1 / Ochratoxin / Zearalenone). Feeding moldy silage causes severe milk drop, liver stress, and abortion in pregnant cows.';
    advisorySummary = 'Possible Quality Risk Detected. Visible mold or musty odor indicates mycotoxin contamination. Avoid feeding this batch to cattle until tested.';
    recommendations.unshift('DO NOT feed moldy portions to lactating or pregnant animals.');
    recommendations.unshift('Discard contaminated surface crust completely.');
    storageRecommendations.unshift('Check bunker seal for plastic punctures allowing oxygen ingress.');
    laboratoryRecommended = true;
  } else if (isRancid || (ph && ph > 4.8 && feedType.toLowerCase().includes('silage')) || isDark) {
    qualityResult = 'Poor';
    score = 38;
    contaminationWarning = true;
    adulterationRisk = 'Clostridial fermentation detected (high butyric acid and ammonia). Indicates poor packing, high moisture, or soil clod contamination at harvest.';
    advisorySummary = 'Poor fermentation quality detected. High butyric acid and ammonia can cause ketosis, off-flavor in milk, and severe feed refusal.';
    recommendations.unshift('Air out feed for 2-3 hours before feeding or discard spoiled portions.');
    recommendations.unshift('Never feed clostridial silage to transition or fresh calving cows.');
    laboratoryRecommended = true;
  } else if (isHot || (ph && ph >= 4.3 && ph <= 4.8) || smell === 'Vinegary / Sharp Acidic') {
    qualityResult = 'Moderate';
    score = 64;
    advisorySummary = 'Moderate quality. Aerobic heating or elevated acetic acid detected. Feed soon after face removal to prevent spoilage.';
    recommendations.unshift('Use opened feed within 12 hours. Do not allow it to heat in feeding troughs.');
    recommendations.unshift('Consider adding a proven silage inoculant or mold inhibitor for future batches.');
  } else if (feedType.toLowerCase().includes('concentrate') && params.moisture === 'High / Damp') {
    qualityResult = 'Needs Further Testing';
    score = 52;
    contaminationWarning = true;
    adulterationRisk = 'Elevated moisture in cattle feed/cake risks rapid mold growth and possible urea spike.';
    advisorySummary = 'Elevated moisture detected in dry feed. Recommend laboratory testing for crude protein, urea percentage, and aflatoxin screening.';
    laboratoryRecommended = true;
  }

  return {
    qualityResult,
    score,
    contaminationWarning,
    adulterationRisk,
    storageRecommendations,
    recommendations,
    advisorySummary,
    laboratoryRecommended,
    disclaimer: 'Feed screening evaluation based on agronomic standards. For commercial feed guarantees or legal disputes, submit samples to an accredited testing laboratory.'
  };
}

// 1. AI Health Check Endpoint (Multimodal Gemini 3.8 Flash)
app.post('/api/health-check', async (req, res) => {
  try {
    const { imageBase64, mimeType, cowBreed, cowAge, cowStatus, symptoms, notes } = req.body;

    // Check if Gemini is configured
    if (!aiClient) {
      const fallback = getFallbackHealthAssessment(symptoms || [], notes);
      return res.json(fallback);
    }

    const parts: any[] = [];

    // Multimodal image part
    if (imageBase64) {
      parts.push({
        inlineData: {
          mimeType: mimeType || 'image/jpeg',
          data: imageBase64.replace(/^data:image\/[a-z]+;base64,/, ''),
        },
      });
    }

    const promptText = `
You are DairyGuard AI, an expert veterinary screening assistant for dairy farmers.
Analyze the provided cow photo and farmer's clinical observation.

Cow Profile:
- Breed: ${cowBreed || 'Dairy Cattle'}
- Age: ${cowAge || 'Not specified'}
- Status: ${cowStatus || 'Milking / Dairy'}
- Observed Symptoms / Concerns: ${(symptoms || []).join(', ') || 'General routine inspection'}
- Additional Notes: ${notes || 'None'}

Your task:
1. Identify any observable health concerns (e.g., eye discharge, skin lumps/lesions, hoof/gait issues, udder inflammation/mastitis indicators, bloat, body condition score, dullness, or healthy).
2. Determine urgency level: 'Normal', 'Low Concern', 'Moderate Concern', or 'Urgent Veterinary Attention'.
3. Observable signs seen in photo or described.
4. Immediate safe first-aid & basic care guidance (e.g., warm compress, dry bedding, hydration electrolytes).
5. Recommended feed adjustment during this condition.
6. Whether herd isolation is recommended (e.g., for contagious diseases like LSD, pink eye, ringworm).
7. Plain-language Advisory Summary: A simple, reassuring, and clear 1-2 sentence recommendation for the farmer.

CRITICAL VETERINARY PRINCIPLE:
State clearly that this is an AI visual screening indicator and NOT a confirmed veterinary diagnosis.
Always advise professional veterinary consultation for prescription drugs or invasive treatment.
`;

    parts.push({ text: promptText });

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: { parts },
      config: {
        systemInstruction: 'You are an agricultural and livestock veterinary screening tool. Provide practical, accurate, farmer-friendly guidance in structured JSON.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            possibleHealthConcern: {
              type: Type.STRING,
              description: 'Clear name of the suspected health concern or Healthy condition',
            },
            urgencyLevel: {
              type: Type.STRING,
              description: "Must be one of: 'Normal', 'Low Concern', 'Moderate Concern', 'Urgent Veterinary Attention'",
            },
            observableSigns: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'List of observable physical signs detected or flagged',
            },
            immediateCareGuidance: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Step-by-step immediate safe first aid and supportive care',
            },
            feedAdjustment: {
              type: Type.STRING,
              description: 'Nutritional or feeding modifications appropriate for this condition',
            },
            isolationRecommended: {
              type: Type.BOOLEAN,
              description: 'Whether the cow should be separated from the herd to prevent contagion',
            },
            advisorySummary: {
              type: Type.STRING,
              description: 'Plain-language farmer summary advice',
            },
            disclaimer: {
              type: Type.STRING,
              description: 'Mandatory veterinary disclaimer',
            },
          },
          required: [
            'possibleHealthConcern',
            'urgencyLevel',
            'observableSigns',
            'immediateCareGuidance',
            'feedAdjustment',
            'isolationRecommended',
            'advisorySummary',
            'disclaimer',
          ],
        },
      },
    });

    const text = response.text?.trim();
    if (!text) {
      throw new Error('Empty response from AI model');
    }

    const data = JSON.parse(text);
    return res.json(data);
  } catch (err: any) {
    console.error('Error in /api/health-check, falling back to heuristic:', err?.message);
    const fallback = getFallbackHealthAssessment(req.body.symptoms || [], req.body.notes);
    return res.json(fallback);
  }
});

// 2. Feed & Silage Quality Check Endpoint (Multimodal or Sensory Analysis)
app.post('/api/feed-quality-check', async (req, res) => {
  try {
    const { feedType, moisture, smell, color, ph, temperature, hasMold, imageBase64, mimeType, additionalNotes } = req.body;

    if (!aiClient) {
      const fallback = getFallbackFeedAssessment({
        feedType: feedType || 'Silage',
        moisture: moisture || 'Optimal (~65%)',
        smell: smell || 'Sweet & Pleasant',
        color: color || 'Olive Green',
        ph: ph ? Number(ph) : undefined,
        temperature: temperature || 'Normal Ambient',
        hasMold: Boolean(hasMold),
      });
      return res.json(fallback);
    }

    const parts: any[] = [];

    if (imageBase64) {
      parts.push({
        inlineData: {
          mimeType: mimeType || 'image/jpeg',
          data: imageBase64.replace(/^data:image\/[a-z]+;base64,/, ''),
        },
      });
    }

    const promptText = `
You are DairyGuard AI, an expert animal nutritionist and forage quality specialist.
Analyze this cattle feed/silage sample based on physical attributes and image.

Parameters:
- Feed Type: ${feedType || 'Corn Silage'}
- Moisture Level: ${moisture || 'Optimal (~65%)'}
- Smell / Odor: ${smell || 'Normal'}
- Color: ${color || 'Normal'}
- Silage pH: ${ph ? ph : 'Not tested'}
- Temperature: ${temperature || 'Ambient'}
- Visible Mold / Spoilage: ${hasMold ? 'Yes, mold spotted' : 'No obvious mold'}
- Additional Notes: ${additionalNotes || 'None'}

Evaluate:
1. Quality Result: Exactly one of ['Good', 'Moderate', 'Poor', 'Needs Further Testing'].
2. Quality Score: Integer from 0 to 100.
3. Contamination Warning: Boolean. True if there is a risk of aflatoxins, mycotoxins, clostridia/butyric acid, urea toxicity, or soil/microbial contamination.
4. Adulteration/Contamination Risk Details: Description of potential risk (e.g. Aflatoxin mold, urea over-dosing, sand/silica, sour butyric acid, yeast heating). Null if safe.
5. Plain Farmer Advisory: Direct, easy to understand guidance. E.g.: "Possible Quality Risk Detected. Avoid using this feed until tested. Check storage conditions. Contact laboratory."
6. Storage Recommendations: 3 practical tips for proper pit/bunker/bag management.
7. Feeding Recommendations: Actionable steps for the farmer.
8. Laboratory Recommended: Boolean. True if laboratory testing is advised.
`;

    parts.push({ text: promptText });

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: { parts },
      config: {
        systemInstruction: 'You are a dairy nutrition and silage fermentation specialist. Provide honest agronomic assessments with actionable safety warnings in JSON.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            qualityResult: {
              type: Type.STRING,
              description: "Must be 'Good', 'Moderate', 'Poor', or 'Needs Further Testing'",
            },
            score: {
              type: Type.INTEGER,
              description: 'Score from 0 to 100',
            },
            contaminationWarning: {
              type: Type.BOOLEAN,
              description: 'Whether there is a contamination or adulteration warning',
            },
            adulterationRisk: {
              type: Type.STRING,
              description: 'Description of contamination or adulteration risk, or null if clean',
              nullable: true,
            },
            advisorySummary: {
              type: Type.STRING,
              description: 'Plain-language farmer advisory',
            },
            storageRecommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Bunker/pit/storage management guidance',
            },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Actionable feeding steps',
            },
            laboratoryRecommended: {
              type: Type.BOOLEAN,
              description: 'Whether sending to a lab for testing is recommended',
            },
            disclaimer: {
              type: Type.STRING,
              description: 'Quality screening disclaimer',
            },
          },
          required: [
            'qualityResult',
            'score',
            'contaminationWarning',
            'advisorySummary',
            'storageRecommendations',
            'recommendations',
            'laboratoryRecommended',
            'disclaimer',
          ],
        },
      },
    });

    const text = response.text?.trim();
    if (!text) {
      throw new Error('Empty response from model');
    }

    const data = JSON.parse(text);
    return res.json(data);
  } catch (err: any) {
    console.error('Error in /api/feed-quality-check, using fallback:', err?.message);
    const fallback = getFallbackFeedAssessment({
      feedType: req.body.feedType || 'Silage',
      moisture: req.body.moisture || 'Optimal (~65%)',
      smell: req.body.smell || 'Sweet & Pleasant',
      color: req.body.color || 'Olive Green',
      ph: req.body.ph ? Number(req.body.ph) : undefined,
      temperature: req.body.temperature || 'Normal Ambient',
      hasMold: Boolean(req.body.hasMold),
    });
    return res.json(fallback);
  }
});

// Health check endpoint
app.get('/api/ping', (_req, res) => {
  res.json({
    status: 'ok',
    app: 'DairyGuard AI',
    timestamp: new Date().toISOString(),
    geminiConfigured: Boolean(aiClient),
  });
});

// Vite middleware in dev or static serving in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, () => {
    console.log(`DairyGuard AI Server running on http://localhost:${PORT}`);
  });
}

startServer();
