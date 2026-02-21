// const axios = require('axios');
// const { SupplyChainNode, OptimizationInsight } = require('../models/schemas');

// // Gemini API Configuration
// const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
// const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

// /**
//  * Service to generate AI-powered optimization recommendations using Gemini API
//  * Region-specific: Maharashtra, India
//  */
// const generateGeminiOptimizations = async (productId, emissionData = {}) => {
//   try {
//     if (!GEMINI_API_KEY) {
//       throw new Error('GEMINI_API_KEY not configured in environment variables');
//     }

//     // Fetch all supply chain nodes
//     const nodes = await SupplyChainNode.find({ productId });

//     if (nodes.length === 0) {
//       return { success: true, data: [] };
//     }

//     // Prepare supply chain context for Gemini
//     const supplyChainContext = nodes.map((node, index) => ({
//       id: index + 1,
//       stage: node.stageName,
//       supplier: node.supplierName,
//       transport: node.transportMode,
//       distance: node.distanceKm,
//       cost: node.transportCost,
//       time: node.transportTimeDays,
//       energy: node.energySource,
//     }));

//     // Create Maharashtra-specific, comprehensive optimization prompt
//     const prompt = buildOptimizationPrompt(supplyChainContext, emissionData);

//     // Call Gemini API
//     const geminiResponse = await callGeminiAPI(prompt);

//     // Parse and save optimizations from Gemini response
//     const optimizations = await parseAndSaveOptimizations(
//       productId,
//       geminiResponse,
//       nodes
//     );

//     return {
//       success: true,
//       data: optimizations,
//       count: optimizations.length,
//       source: 'gemini-ai',
//     };
//   } catch (error) {
//     console.error('[Gemini Optimization] Error:', error.message);
//     throw new Error(`Gemini optimization failed: ${error.message}`);
//   }
// };

// /**
//  * Build comprehensive optimization prompt for Gemini
//  * Includes Maharashtra-specific context and diverse suggestions
//  */
// function buildOptimizationPrompt(supplyChainContext, emissionData) {
//   const supplyChainJSON = JSON.stringify(supplyChainContext, null, 2);
//   const emissionJSON = JSON.stringify(emissionData, null, 2);

//   return `You are an expert supply chain optimization consultant specializing in carbon footprint reduction for Indian manufacturing companies in Maharashtra region.

// SUPPLY CHAIN DATA:
// ${supplyChainJSON}

// EMISSION ANALYSIS:
// ${emissionJSON}

// TASK: Analyze this supply chain and provide 2-3 SPECIFIC, ACTIONABLE optimization recommendations.

// CONSTRAINTS:
// 1. Region: Maharashtra, India (consider local logistics, routes, renewable energy availability like Pune renewable hubs)
// 2. Focus on STRATEGIC improvements, not just transport mode changes
// 3. Consider diverse optimization types:
//    - Transport optimization (mode change, route optimization, consolidation)
//    - Energy source switching (renewable energy availability in Maharashtra)
//    - Logistics network optimization (local supplier opportunities)
//    - Packaging optimization
//    - Demand planning improvements
//    - Supplier relationship optimization

// INSTRUCTIONS:
// - Select TOP 2-3 recommendations based on feasibility and impact
// - For each recommendation include:
//   a) STAGE: Which supply chain stage to optimize
//   b) RECOMMENDATION_TYPE: Category of optimization (transport/energy/network/packaging/other)
//   c) CURRENT_STATE: Brief description of current approach
//   d) SUGGESTED_IMPROVEMENT: Specific actionable improvement
//   e) CARBON_REDUCTION_PERCENT: Estimated % reduction (1-95%)
//   f) COST_IMPACT: Annual cost change in rupees (use negative for savings)
//   g) TIME_IMPACT: Time impact in days/weeks
//   h) IMPLEMENTATION_DIFFICULTY: low/medium/high (considering Maharashtra context)
//   i) MAHARASHTRA_SPECIFIC_NOTES: How this applies to Maharashtra logistics/energy/suppliers
//   j) WHY_THIS_APPROACH: Brief explanation why this is recommended

// RESPONSE FORMAT:
// Provide response as JSON array with exactly this structure. Be concise and practical.

// [
//   {
//     "stage": "stage name",
//     "recommendationType": "transport/energy/network/packaging/other",
//     "currentState": "description",
//     "suggestedImprovement": "specific action",
//     "carbonReductionPercent": number,
//     "costImpactINR": number,
//     "timeImpactDays": number,
//     "implementationDifficulty": "low/medium/high",
//     "maharashtraSpecificNotes": "regional context",
//     "whyThisApproach": "rationale"
//   }
// ]

// IMPORTANT: Return ONLY valid JSON, no markdown or extra text.`;
// }

// /**
//  * Call Gemini API with the optimization prompt
//  */
// async function callGeminiAPI(prompt) {
//   try {
//     const response = await axios.post(
//       `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
//       {
//         contents: [
//           {
//             parts: [
//               {
//                 text: prompt,
//               },
//             ],
//           },
//         ],
//         generationConfig: {
//           temperature: 0.7,
//           maxOutputTokens: 2000,
//         },
//       }
//     );

//     // Extract text content from Gemini response
//     const textContent =
//       response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

//     if (!textContent) {
//       throw new Error('No content in Gemini response');
//     }

//     // Parse JSON from response (handle markdown code blocks if present)
//     let jsonStr = textContent.trim();
//     if (jsonStr.startsWith('```json')) {
//       jsonStr = jsonStr.replace(/```json\n?/, '').replace(/\n?```$/, '');
//     } else if (jsonStr.startsWith('```')) {
//       jsonStr = jsonStr.replace(/```\n?/, '').replace(/\n?```$/, '');
//     }

//     const optimizations = JSON.parse(jsonStr);

//     if (!Array.isArray(optimizations)) {
//       throw new Error('Gemini response is not an array');
//     }

//     return optimizations;
//   } catch (error) {
//     console.error('[Gemini API] Error:', {
//       message: error.message,
//       response: error.response?.data,
//     });
//     throw new Error(`Gemini API call failed: ${error.message}`);
//   }
// }

// /**
//  * Parse Gemini response and save optimizations to MongoDB
//  */
// async function parseAndSaveOptimizations(productId, geminiOptimizations, nodes) {
//   const savedOptimizations = [];

//   for (const optim of geminiOptimizations) {
//     try {
//       // Create OptimizationInsight document with Gemini suggestions
//       const insight = new OptimizationInsight({
//         productId,
//         stageName: optim.stage,
//         recommendationType: optim.recommendationType || 'other',
//         currentState: optim.currentState,
//         suggestedImprovement: optim.suggestedImprovement,
//         carbonReductionPercent: optim.carbonReductionPercent || 0,
//         costImpactINR: optim.costImpactINR || 0,
//         timeImpactDays: optim.timeImpactDays || 0,
//         implementationDifficulty: optim.implementationDifficulty || 'medium',
//         maharashtraSpecificNotes: optim.maharashtraSpecificNotes || '',
//         whyThisApproach: optim.whyThisApproach || '',
//         generatedBy: 'gemini-ai',
//         recommendationText: generateRecommendationText(optim),
//       });

//       await insight.save();

//       savedOptimizations.push({
//         stageName: optim.stage,
//         recommendationType: optim.recommendationType,
//         currentState: optim.currentState,
//         suggestedImprovement: optim.suggestedImprovement,
//         carbonReductionPercent: optim.carbonReductionPercent,
//         costImpactINR: optim.costImpactINR,
//         timeImpactDays: optim.timeImpactDays,
//         implementationDifficulty: optim.implementationDifficulty,
//         maharashtraSpecificNotes: optim.maharashtraSpecificNotes,
//         whyThisApproach: optim.whyThisApproach,
//       });
//     } catch (err) {
//       console.error(
//         `[Gemini Optimization] Error saving optimization for stage ${optim.stage}:`,
//         err.message
//       );
//       // Continue with next optimization if one fails
//     }
//   }

//   return savedOptimizations;
// }

// /**
//  * Generate human-readable recommendation text from Gemini suggestion
//  */
// function generateRecommendationText(optim) {
//   const difficultyEmoji = {
//     low: '✓',
//     medium: '⚡',
//     high: '⚠',
//   };

//   const emoji = difficultyEmoji[optim.implementationDifficulty] || '•';

//   return `${emoji} ${optim.stage} (${optim.recommendationType}): ${optim.suggestedImprovement}. Potential carbon reduction: ~${optim.carbonReductionPercent}%. Cost impact: ₹${optim.costImpactINR.toLocaleString('en-IN')}. ${optim.maharashtraSpecificNotes}`;
// }

// /**
//  * Get Gemini-generated optimizations for a product
//  */
// const getGeminiOptimizations = async (productId) => {
//   try {
//     const optimizations = await OptimizationInsight.find({
//       productId,
//       generatedBy: 'gemini-ai',
//     });

//     return {
//       success: true,
//       data: optimizations,
//       count: optimizations.length,
//       source: 'gemini-ai',
//     };
//   } catch (error) {
//     throw new Error(`Failed to fetch Gemini optimizations: ${error.message}`);
//   }
// };

// /**
//  * Clear old optimizations and generate fresh Gemini suggestions
//  */
// const regenerateGeminiOptimizations = async (productId) => {
//   try {
//     // Delete old Gemini optimizations
//     await OptimizationInsight.deleteMany({
//       productId,
//       generatedBy: 'gemini-ai',
//     });

//     // Generate fresh optimizations
//     return await generateGeminiOptimizations(productId);
//   } catch (error) {
//     throw new Error(
//       `Failed to regenerate optimizations: ${error.message}`
//     );
//   }
// };

// /**
//  * Analyze route intelligence for Maharashtra cities
//  * Detects seaway and airport availability on routes
//  */
// const analyzeRouteIntelligence = async (fromLocation, toLocation) => {
//   try {
//     if (!GEMINI_API_KEY) {
//       throw new Error('GEMINI_API_KEY not configured');
//     }

//     // Maharashtra cities with major logistics infrastructure
//     const maharashtiraCities = {
//       'Mumbai': { hasSeaway: true, hasAirport: true, ports: ['JNPT', 'Mumbai Port'], airports: ['BOM'] },
//       'Pune': { hasSeaway: false, hasAirport: true, airports: ['PNQ'] },
//       'Aurangabad': { hasSeaway: false, hasAirport: true, airports: ['IXU'] },
//       'Chhatrapati Sambhajinagar': { hasSeaway: false, hasAirport: true, airports: ['IXU'] },
//       'Nashik': { hasSeaway: false, hasAirport: false, airports: [] },
//       'Thane': { hasSeaway: true, hasAirport: false, ports: ['Jawaharlal Nehru Port'] },
//       'Kolhapur': { hasSeaway: false, hasAirport: false, airports: [] },
//       'Solapur': { hasSeaway: false, hasAirport: false, airports: [] },
//       'Buldhana': { hasSeaway: false, hasAirport: false, airports: [] },
//       'Parbhani': { hasSeaway: false, hasAirport: false, airports: [] },
//       'Sangli': { hasSeaway: false, hasAirport: false, airports: [] },
//       'Satara': { hasSeaway: false, hasAirport: false, airports: [] },
//       'Sindhdurg': { hasSeaway: true, hasAirport: false, ports: ['Malvan'] },
//       'Raigad': { hasSeaway: true, hasAirport: false, ports: ['Raigad Port'] },
//       'Jalgaon': { hasSeaway: false, hasAirport: false, airports: [] },
//       'Nagpur': { hasSeaway: false, hasAirport: true, airports: ['NAG'] },
//       'Akola': { hasSeaway: false, hasAirport: false, airports: [] },
//       'Amravati': { hasSeaway: false, hasAirport: false, airports: [] },
//     };

//     const fromData = maharashtiraCities[fromLocation] || { hasSeaway: false, hasAirport: false };
//     const toData = maharashtiraCities[toLocation] || { hasSeaway: false, hasAirport: false };

//     // Create route analysis prompt
//     const routePrompt = `Analyze this supply chain route in Maharashtra, India:
// From: ${fromLocation}
// To: ${toLocation}

// From location infrastructure:
// - Has seaway access: ${fromData.hasSeaway}
// - Has airport: ${fromData.hasAirport}
// - Ports: ${fromData.ports?.join(', ') || 'None'}
// - Airports: ${fromData.airports?.join(', ') || 'None'}

// To location infrastructure:
// - Has seaway access: ${toData.hasSeaway}
// - Has airport: ${toData.hasAirport}
// - Ports: ${toData.ports?.join(', ') || 'None'}
// - Airports: ${toData.airports?.join(', ') || 'None'}

// Provide a JSON response with:
// {
//   "routeDescription": "Brief description of the optimal route",
//   "transportOptions": ["list", "of", "viable", "modes"],
//   "recommendedMode": "truck/rail/ship/air",
//   "routeDistance": "estimated km",
//   "timeEstimate": "estimated days",
//   "greenTransportOpportunities": ["renewable", "fuel", "alternatives"],
//   "logisticsHubs": ["nearby distribution centers"],
//   "selectedOptimalMode": "truck/rail/ship/air based on emissions"
// }

// Return ONLY valid JSON.`;

//     const response = await axios.post(
//       `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
//       {
//         contents: [
//           {
//             parts: [
//               {
//                 text: routePrompt,
//               },
//             ],
//           },
//         ],
//         generationConfig: {
//           temperature: 0.7,
//           maxOutputTokens: 1000,
//         },
//       }
//     );

//     const textContent = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
//     if (!textContent) {
//       throw new Error('No route analysis from Gemini');
//     }

//     let jsonStr = textContent.trim();
//     if (jsonStr.startsWith('```json')) {
//       jsonStr = jsonStr.replace(/```json\n?/, '').replace(/\n?```$/, '');
//     } else if (jsonStr.startsWith('```')) {
//       jsonStr = jsonStr.replace(/```\n?/, '').replace(/\n?```$/, '');
//     }

//     const routeAnalysis = JSON.parse(jsonStr);

//     return {
//       success: true,
//       fromLocation,
//       toLocation,
//       fromHasSeaway: fromData.hasSeaway,
//       fromHasAirport: fromData.hasAirport,
//       toHasSeaway: toData.hasSeaway,
//       toHasAirport: toData.hasAirport,
//       routeDetails: routeAnalysis.routeDescription,
//       transportOptions: routeAnalysis.transportOptions,
//       recommendedMode: routeAnalysis.recommendedMode,
//       optimalMode: routeAnalysis.selectedOptimalMode,
//       greenOpportunities: routeAnalysis.greenTransportOpportunities,
//     };
//   } catch (error) {
//     console.error('[Route Analysis] Error:', error.message);
//     throw new Error(`Route analysis failed: ${error.message}`);
//   }
// };

// module.exports = {
//   generateGeminiOptimizations,
//   getGeminiOptimizations,
//   regenerateGeminiOptimizations,
//   analyzeRouteIntelligence,
// };

/**
 * Gemini AI Optimization Service
 * FINAL WORKING VERSION
 * - No raw JSON passed to Gemini
 * - Text summarization only
 * - Strong JSON sanitization
 * - Frontend-compatible schema
 */

const axios = require('axios');
const { SupplyChainNode, OptimizationInsight } = require('../models/schemas');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

if (!GEMINI_API_KEY) {
  console.warn('[Gemini] GEMINI_API_KEY not set');
}

/* ---------------------------------------------------
   STEP 1: SUMMARIZE SUPPLY CHAIN (TEXT ONLY)
--------------------------------------------------- */
function summarizeSupplyChain(nodes, emissionData) {
  const stagesSummary = nodes
    .map(
      (n) =>
        `Stage: ${n.stageName}, Transport: ${n.transportMode}, Distance: ${n.distanceKm}km, Energy: ${n.energySource}`
    )
    .join('\n');

  const emissionSummary =
    emissionData?.stages?.length > 0
      ? emissionData.stages
          .map(
            (s) =>
              `Stage ${s.stage_name}: ${s.total_emission} tCO2e (${s.percentage_of_total}%)`
          )
          .join('\n')
      : 'No detailed emission breakdown available';

  return `
SUPPLY CHAIN OVERVIEW:
${stagesSummary}

EMISSION SUMMARY:
${emissionSummary}
`;
}

/* ---------------------------------------------------
   STEP 2: BUILD SAFE PROMPT
--------------------------------------------------- */
function buildPrompt(nodes, emissionData) {
  const summary = summarizeSupplyChain(nodes, emissionData);

  return `
You are a sustainability optimization expert.

Based on the following summarized supply-chain data, generate optimization recommendations.

${summary}

STRICT RULES:
- Output ONLY valid JSON
- No markdown
- No explanations
- Output MUST be a JSON ARRAY

Each object MUST follow this schema exactly:

{
  "stage": "string",
  "recommendationType": "transport | energy | network | packaging | other",
  "currentState": "string",
  "suggestedImprovement": "string",
  "carbonReductionPercent": number,
  "costImpactINR": number,
  "timeImpactDays": number,
  "implementationDifficulty": "low | medium | high",
  "maharashtraSpecificNotes": "string",
  "whyThisApproach": "string"
}

Generate 2–3 recommendations.
Region: Maharashtra, India.

IMPORTANT:
Return ONLY valid JSON. NOTHING ELSE.
`;
}

/* ---------------------------------------------------
   STEP 3: CALL GEMINI
--------------------------------------------------- */
async function callGemini(prompt) {
  const response = await axios.post(
    `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
    {
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 1500,
      },
    }
  );

  const text =
    response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error('Empty Gemini response');
  }

  return text;
}

/* ---------------------------------------------------
   STEP 4: EXTRACT JSON SAFELY
--------------------------------------------------- */
function extractJson(text) {
  const cleaned = text.replace(/```json|```/g, '').trim();

  const start = cleaned.indexOf('[');
  const end = cleaned.lastIndexOf(']');

  if (start === -1 || end === -1) {
    throw new Error('No JSON array found in Gemini output');
  }

  return JSON.parse(cleaned.substring(start, end + 1));
}

/* ---------------------------------------------------
   STEP 5: MAP TO DB / FRONTEND SCHEMA
--------------------------------------------------- */
function mapGeminiItem(item, productId) {
  return {
    productId,
    stageName: item.stage,
    recommendationType: item.recommendationType || 'other',
    currentState: item.currentState,
    suggestedImprovement: item.suggestedImprovement,
    carbonReductionPercent: Number(item.carbonReductionPercent || 0),
    costImpactINR: Number(item.costImpactINR || 0),
    timeImpactDays: Number(item.timeImpactDays || 0),
    implementationDifficulty: item.implementationDifficulty || 'medium',
    maharashtraSpecificNotes: item.maharashtraSpecificNotes || '',
    whyThisApproach: item.whyThisApproach || '',
    generatedBy: 'gemini-ai',
  };
}

/* ---------------------------------------------------
   STEP 6: GENERATE GEMINI OPTIMIZATIONS
--------------------------------------------------- */
const generateGeminiOptimizations = async (productId, emissionData = {}) => {
  try {
    const nodes = await SupplyChainNode.find({ productId });

    if (!nodes.length) {
      return { success: true, data: [], count: 0 };
    }

    const prompt = buildPrompt(nodes, emissionData);
    const rawText = await callGemini(prompt);

    let geminiData;
    try {
      geminiData = extractJson(rawText);
    } catch (err) {
      console.error('[Gemini RAW RESPONSE]', rawText);
      throw err;
    }

    if (!Array.isArray(geminiData)) {
      throw new Error('Gemini response is not an array');
    }

    const mapped = geminiData.map((item) =>
      mapGeminiItem(item, productId)
    );

    await OptimizationInsight.deleteMany({
      productId,
      generatedBy: 'gemini-ai',
    });

    const saved = await OptimizationInsight.insertMany(mapped);

    return {
      success: true,
      data: saved,
      count: saved.length,
      source: 'gemini-ai',
    };
  } catch (error) {
    console.error('[Gemini Optimization] Error:', error.message);
    throw new Error(`Gemini optimization failed: ${error.message}`);
  }
};

/* ---------------------------------------------------
   STEP 7: FETCH SAVED GEMINI OPTIMIZATIONS
--------------------------------------------------- */
const getGeminiOptimizations = async (productId) => {
  const data = await OptimizationInsight.find({
    productId,
    generatedBy: 'gemini-ai',
  });

  return {
    success: true,
    data,
    count: data.length,
    source: 'gemini-ai',
  };
};

/* ---------------------------------------------------
   STEP 8: REGENERATE OPTIMIZATIONS
--------------------------------------------------- */
const regenerateGeminiOptimizations = async (productId, emissionData = {}) => {
  await OptimizationInsight.deleteMany({
    productId,
    generatedBy: 'gemini-ai',
  });

  return generateGeminiOptimizations(productId, emissionData);
};

module.exports = {
  generateGeminiOptimizations,
  getGeminiOptimizations,
  regenerateGeminiOptimizations,
};