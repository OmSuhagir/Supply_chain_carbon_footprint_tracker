// /**
//  * Gemini Optimization Service
//  * Uses Google Gemini 2.5 Flash API to generate AI-powered supply chain optimization recommendations
//  * Tailored for Maharashtra supply chain context with cost analysis in Indian Rupees
//  */

// const axios = require('axios');
// const OptimizationInsight = require('./models/schemas').OptimizationInsight;

// /**
//  * Main orchestration function - generates Gemini recommendations and saves to DB
//  */
// async function generateGeminiOptimizations(productId, emissionData) {
//   try {
//     console.log('[Gemini Service] Starting optimization generation for product:', productId);

//     // Fetch supply chain nodes for context
//     const Product = require('./models/schemas').Product;
//     const product = await Product.findById(productId).populate('supplyChainNodes');

//     if (!product) {
//       throw new Error(`Product not found: ${productId}`);
//     }

//     const nodes = product.supplyChainNodes || [];
//     console.log('[Gemini Service] Found', nodes.length, 'supply chain nodes');

//     // Build the prompt with Maharashtra context
//     const prompt = buildOptimizationPrompt(
//       nodes,
//       emissionData,
//       product.name
//     );

//     // Call Gemini API
//     console.log('[Gemini Service] Calling Gemini 2.5 Flash API...');
//     const geminiResponse = await callGeminiAPI(prompt);

//     // Parse and save recommendations
//     const savedOptimizations = await parseAndSaveOptimizations(
//       productId,
//       geminiResponse,
//       nodes
//     );

//     console.log('[Gemini Service] Successfully saved', savedOptimizations.length, 'recommendations');
//     return savedOptimizations;
//   } catch (error) {
//     console.error('[Gemini Service Error]', error.message);
//     // Return empty array instead of throwing - don't crash the analysis
//     return [];
//   }
// }

// /**
//  * Builds Maharashtra-context-aware optimization prompt
//  */
// function buildOptimizationPrompt(nodes, emissionData, productName) {
//   // Format supply chain data
//   const supplychainJson = JSON.stringify(nodes.map(node => ({
//     name: node.stageName || 'Unknown',
//     transportMode: node.transportMode || 'Unknown',
//     distance: node.distance || 0,
//     weight: node.weight || 0,
//     location: node.location || 'Unknown',
//     emissionsPerUnit: node.emissionsPerUnit || 0
//   })), null, 2);

//   // Format emission analysis
//   const emissionJson = JSON.stringify({
//     totalEmissions: emissionData?.totalEmissions || 0,
//     perUnitCost: emissionData?.perUnitCost || 0,
//     carbonEfficiencyScore: emissionData?.carbonEfficiencyScore || 0,
//     costEfficiencyScore: emissionData?.costEfficiencyScore || 0,
//     timeEfficiencyScore: emissionData?.timeEfficiencyScore || 0,
//   }, null, 2);

//   return `You are a supply chain optimization expert for Indian companies. Analyze this product's supply chain and provide 2-3 specific, actionable optimization recommendations.

// Product Name: ${productName}

// Supply Chain Details:
// ${supplychainJson}

// Emission Analysis:
// ${emissionJson}

// MAHARASHTRA-SPECIFIC CONTEXT:
// You are optimizing for a company operating in Maharashtra, India. Consider these local advantages:

// Geographic Locations:
// - PUNE: Renewable energy hubs, solar manufacturing, tech parks, IT companies
// - AURANGABAD: Manufacturing clusters (textiles, pharma, machinery), established logistics networks
// - NASHIK: Agricultural supplier base, food processing, proximity to raw materials
// - KOLHAPUR: Agro-industries, leather goods, local supply networks
// - MUMBAI: JNPT (Jawaharlal Nehru Port Trust) - major container port, financial hub, largest distribution node

// Transportation Networks:
// - Rail: Pune-Mumbai-Aurangabad main corridor (prefer for bulk)
// - Highway: NH48 (Pune-Bangalore), NH44 (North-South via Mumbai)
// - Maritime: JNPT for port consolidation and international shipping

// Energy Opportunities:
// - Pune solar hubs with grid connection
// - Wind farms in coastal regions
// - Industrial estates with renewable incentives
// - Local utility companies supporting green energy

// Supply Chain:
// - Local MSME (Micro, Small & Medium Enterprise) suppliers
// - Manufacturing clusters in Aurangabad and Nashik
// - Agricultural suppliers from western Maharashtra
// - Regional logistics providers (rail preferred over truck)

// RECOMMENDATION REQUIREMENTS:
// 1. Provide exactly 2-3 recommendations (not more)
// 2. Include diversity - NOT all transport type, mix with energy, network, packaging, other
// 3. Rank by practical implementation feasibility
// 4. Consider Maharashtra supply chain specifics in each recommendation
// 5. Calculate cost impact in INDIAN RUPEES (₹), annual basis
// 6. Estimate implementation time in DAYS
// 7. Rate difficulty as: low, medium, or high

// RESPONSE FORMAT - Return ONLY valid JSON array (no markdown, no code blocks):
// [
//   {
//     "type": "transport|energy|network|packaging|other",
//     "currentState": "Brief description of current approach",
//     "suggestedImprovement": "Specific recommended action",
//     "carbonReductionPercent": XX,
//     "costImpactINR": XXXXX,
//     "implementationTime": XX,
//     "implementationDifficulty": "low|medium|high",
//     "maharashtraSpecificNotes": "Why this is relevant to Maharashtra supply chain",
//     "whyThisApproach": "Explanation of why this recommendation makes sense"
//   }
// ]

// Examples of diverse recommendations (DO THIS):
// - Transport: "Switch to rail via JNPT for Mumbai deliveries"
// - Energy: "Install solar panels at Aurangabad manufacturing facility"
// - Network: "Consolidate Nashik suppliers into single vendor partnership"
// - Packaging: "Use recycled cardboard from local suppliers"
// - Other: "Implement demand planning to reduce expedite shipments"

// Remember: Be specific, actionable, and Maharashtra-aware. Return ONLY JSON, no other text.`;
// }

// /**
//  * Calls Gemini 2.5 Flash API
//  */
// async function callGeminiAPI(prompt) {
//   const apiKey = process.env.GEMINI_API_KEY;

//   if (!apiKey) {
//     throw new Error('GEMINI_API_KEY not configured in environment');
//   }

//   try {
//     const response = await axios.post(
//       `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
//       {
//         contents: [
//           {
//             parts: [
//               {
//                 text: prompt
//               }
//             ]
//           }
//         ],
//         generationConfig: {
//           temperature: 0.7,
//           topK: 40,
//           topP: 0.95,
//           maxOutputTokens: 2048,
//         }
//       },
//       {
//         timeout: 30000,
//         headers: {
//           'Content-Type': 'application/json',
//         }
//       }
//     );

//     // Extract text from response
//     const responseText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

//     if (!responseText) {
//       throw new Error('No response from Gemini API');
//     }

//     console.log('[Gemini API] Raw response:', responseText.substring(0, 200) + '...');

//     // Parse JSON from response (might be wrapped in markdown)
//     let jsonStr = responseText.trim();
    
//     // Remove markdown code blocks if present
//     if (jsonStr.startsWith('```json')) {
//       jsonStr = jsonStr.replace(/^```json\s*/, '').replace(/\s*```$/, '');
//     } else if (jsonStr.startsWith('```')) {
//       jsonStr = jsonStr.replace(/^```\s*/, '').replace(/\s*```$/, '');
//     }

//     const recommendations = JSON.parse(jsonStr);

//     if (!Array.isArray(recommendations)) {
//       throw new Error('Gemini response is not an array');
//     }

//     console.log('[Gemini API] Parsed', recommendations.length, 'recommendations');
//     return recommendations;
//   } catch (error) {
//     console.error('[Gemini API Error]', error.message);
//     throw new Error(`Gemini API call failed: ${error.message}`);
//   }
// }

// /**
//  * Parses Gemini response and saves to MongoDB
//  */
// async function parseAndSaveOptimizations(productId, geminiOptimizations, nodes) {
//   try {
//     // Delete old recommendations for this product
//     await OptimizationInsight.deleteMany({ 
//       productId,
//       generatedBy: 'gemini-ai'
//     });

//     const savedDocs = [];

//     for (const optim of geminiOptimizations) {
//       const doc = new OptimizationInsight({
//         productId,
//         recommendationType: optim.type || 'other',
//         currentState: optim.currentState || '',
//         suggestedImprovement: optim.suggestedImprovement || '',
//         carbonReductionPercent: Math.min(Math.max(parseInt(optim.carbonReductionPercent) || 0, 1), 95),
//         costImpactINR: parseInt(optim.costImpactINR) || 0,
//         implementationTime: parseInt(optim.implementationTime) || 30,
//         implementationDifficulty: optim.implementationDifficulty || 'medium',
//         maharashtraSpecificNotes: optim.maharashtraSpecificNotes || '',
//         whyThisApproach: optim.whyThisApproach || '',
//         generatedBy: 'gemini-ai',
//         createdAt: new Date(),
//         updatedAt: new Date()
//       });

//       const saved = await doc.save();
//       savedDocs.push(saved);
//     }

//     return savedDocs;
//   } catch (error) {
//     console.error('[Parse Error]', error.message);
//     throw error;
//   }
// }

// /**
//  * Fetch saved Gemini recommendations
//  */
// async function getGeminiOptimizations(productId) {
//   try {
//     const optimizations = await OptimizationInsight.find({
//       productId,
//       generatedBy: 'gemini-ai'
//     }).sort({ createdAt: -1 });

//     return optimizations;
//   } catch (error) {
//     console.error('[Fetch Error]', error.message);
//     return [];
//   }
// }

// /**
//  * Regenerate recommendations (delete old, create new)
//  */
// async function regenerateGeminiOptimizations(productId, emissionData) {
//   try {
//     // Delete old recommendations
//     await OptimizationInsight.deleteMany({
//       productId,
//       generatedBy: 'gemini-ai'
//     });

//     // Generate fresh ones
//     const fresh = await generateGeminiOptimizations(productId, emissionData);
//     return fresh;
//   } catch (error) {
//     console.error('[Regenerate Error]', error.message);
//     throw error;
//   }
// }

// module.exports = {
//   generateGeminiOptimizations,
//   getGeminiOptimizations,
//   regenerateGeminiOptimizations,
//   buildOptimizationPrompt,
//   callGeminiAPI,
//   parseAndSaveOptimizations
// };
/**
 * Gemini AI Optimization Service
 * FINAL STABLE VERSION – copy paste only this file
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');
const { OptimizationInsight } = require('../models/schemas');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/* -----------------------------------------------------
   STEP 1: SUMMARIZE ANALYSIS (CRITICAL)
----------------------------------------------------- */
function summarizeAnalysis(analysis) {
  if (!analysis || !Array.isArray(analysis.stages)) {
    throw new Error('Invalid analysis object passed to Gemini service');
  }

  return analysis.stages
    .map(stage => {
      return `Stage: ${stage.stage_name}, ` +
        `Transport: ${stage.transport_mode}, ` +
        `Distance: ${stage.distance_km}km, ` +
        `Energy: ${stage.energy_source}, ` +
        `Total Emission: ${stage.total_emission} tCO2e`;
    })
    .join('\n');
}

/* -----------------------------------------------------
   STEP 2: BUILD PROMPT (SAFE, TEXT-ONLY)
----------------------------------------------------- */
function buildPrompt(productId, analysis) {
  const summary = summarizeAnalysis(analysis);

  return `
You are a sustainability optimization expert.

Based on the following summarized supply-chain analysis, generate optimization recommendations.

Supply Chain Summary:
${summary}

STRICT RULES:
- Output ONLY valid JSON
- No markdown
- No explanations
- Output MUST be a JSON array

Each object MUST strictly follow this schema:

{
  "stageName": "string",
  "recommendationType": "transport | energy | network | packaging | other",
  "implementationDifficulty": "low | medium | high",
  "currentState": "string",
  "suggestedImprovement": "string",
  "carbonReductionPercent": number,
  "costImpactINR": number,
  "timeImpactDays": number,
  "whyThisApproach": "string",
  "maharashtraSpecificNotes": "string"
}

Generate 3–5 recommendations.
Region: Maharashtra, India.
Product ID: ${productId}
`;
}

/* -----------------------------------------------------
   STEP 3: SANITIZE GEMINI RESPONSE
----------------------------------------------------- */
function extractJson(text) {
  text = text.replace(/```json|```/g, '').trim();

  const start = text.indexOf('[');
  const end = text.lastIndexOf(']');

  if (start === -1 || end === -1) {
    throw new Error('No JSON array found in Gemini response');
  }

  return JSON.parse(text.substring(start, end + 1));
}

/* -----------------------------------------------------
   STEP 4: MAP GEMINI → FRONTEND SCHEMA
----------------------------------------------------- */
function mapGeminiToSchema(item, productId) {
  return {
    productId,
    stageName: item.stageName,
    recommendationType: item.recommendationType || 'other',
    implementationDifficulty: item.implementationDifficulty || 'medium',
    currentState: item.currentState,
    suggestedImprovement: item.suggestedImprovement,
    carbonReductionPercent: Number(item.carbonReductionPercent || 0),
    costImpactINR: Number(item.costImpactINR || 0),
    timeImpactDays: Number(item.timeImpactDays || 0),
    whyThisApproach: item.whyThisApproach,
    maharashtraSpecificNotes: item.maharashtraSpecificNotes || '',
    source: 'gemini-ai',
  };
}

/* -----------------------------------------------------
   STEP 5: CALL GEMINI SAFELY
----------------------------------------------------- */
async function callGemini(productId, analysis) {
  const model = genAI.getGenerativeModel({
    model: 'gemini-pro',
    generationConfig: {
      temperature: 0.3,
      responseMimeType: 'application/json',
    },
  });

  const prompt = buildPrompt(productId, analysis);
  const result = await model.generateContent(prompt);
  const rawText = result.response.text();

  try {
    return extractJson(rawText);
  } catch (err) {
    console.error('[Gemini RAW RESPONSE]', rawText);
    throw new Error('Gemini returned invalid JSON');
  }
}

/* -----------------------------------------------------
   STEP 6: GET OPTIMIZATIONS
----------------------------------------------------- */
async function getGeminiOptimizations(productId, analysis) {
  const existing = await OptimizationInsight.find({
    productId,
    source: 'gemini-ai',
  });

  if (existing.length > 0) {
    return { data: existing, count: existing.length };
  }

  const geminiData = await callGemini(productId, analysis);

  const mapped = geminiData.map(item =>
    mapGeminiToSchema(item, productId)
  );

  const saved = await OptimizationInsight.insertMany(mapped);

  return { data: saved, count: saved.length };
}

/* -----------------------------------------------------
   STEP 7: REGENERATE OPTIMIZATIONS
----------------------------------------------------- */
async function regenerateGeminiOptimizations(productId, analysis) {
  await OptimizationInsight.deleteMany({
    productId,
    source: 'gemini-ai',
  });

  const geminiData = await callGemini(productId, analysis);

  const mapped = geminiData.map(item =>
    mapGeminiToSchema(item, productId)
  );

  const saved = await OptimizationInsight.insertMany(mapped);

  return { data: saved, count: saved.length };
}

module.exports = {
  getGeminiOptimizations,
  regenerateGeminiOptimizations,
};