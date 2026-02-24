// ==========================================
// GENERATED BUNDLE: generate-course-content
// VERSION: v3.0-MODULAR
// ARCHITECTURE: Class-based, Multi-Provider, Resilient
// ==========================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
// --------------------------------------------------------------------------------
// INLINED MODULE: Style Blocks
// --------------------------------------------------------------------------------
export enum AudienceLevel {
  LEVEL_1_OPERATIONAL = 'LEVEL_1_OPERATIONAL',
  LEVEL_2_CLERICAL = 'LEVEL_2_CLERICAL',
  LEVEL_3_STRATEGIC = 'LEVEL_3_STRATEGIC',
  LEVEL_4_COMMERCIAL = 'LEVEL_4_COMMERCIAL',
  LEVEL_5_TECHNICAL = 'LEVEL_5_TECHNICAL'
}

export const STYLE_BLOCKS = {
  [AudienceLevel.LEVEL_1_OPERATIONAL]: `
### 🧬 AUDIENCE DNA: LEVEL 1 (OPERATIONAL / FRONT LINE)
**PRIMARY GOAL:** Practical Execution, Safety & Consistency.
**BLOOM LEVEL:** Understand & Apply (Troubleshoot).

**STRICT STYLE RULES:**
1.  **TONE:** Respectful, Direct, Peer-to-Peer. Avoid "school teacher" tone.
2.  **SENTENCE STRUCTURE:** Concise. Action-First. (e.g., "Press X to start", not "To start, X should be pressed").
3.  **VOCABULARY:**
    - ✅ USE: Industry-standard terms, "Verify", "Calibrate", "Result", "Check", "Stop", "Report".
    - ❌ FORBIDDEN: Corporate jargon ("Synergy"), Academic fluff, "Paradigm".
4.  **EXAMPLES:** Real-world scenarios ("When the warning light blinks...", "When the machine stops...").
5.  **FORMATTING:** Checklists, Troubleshooting Tables, bold warnings.
`,

  [AudienceLevel.LEVEL_2_CLERICAL]: `
### 🧬 AUDIENCE DNA: LEVEL 2 (CLERICAL / JUNIOR MANAGEMENT)
**PRIMARY GOAL:** Process Efficiency, Accuracy & Coordination.
**BLOOM LEVEL:** Apply & Analyze.

**STRICT STYLE RULES:**
1.  **TONE:** Professional, Collaborative, Structured.
2.  **SENTENCE STRUCTURE:** Clear cause-and-effect ("If X happens, then do Y").
3.  **VOCABULARY:** Standard business terminology.
    - ✅ USE: "Workflow", "Compliance", "Stakeholder", "Optimization".
    - ❌ FORBIDDEN: Overly casual slang or overly dense academic theory.
4.  **EXAMPLES:** Case studies, Email templates, Process maps.
5.  **FORMATTING:** Step-by-step guides, Decision trees.
`,

  [AudienceLevel.LEVEL_3_STRATEGIC]: `
### 🧬 AUDIENCE DNA: LEVEL 3 (STRATEGIC / SENIOR LEADERSHIP)
**PRIMARY GOAL:** Vision, ROI, Culture & Change Management.
**BLOOM LEVEL:** Evaluate & Create.

**STRICT STYLE RULES:**
1.  **TONE:** Executive, Insightful, "Boardroom Ready".
2.  **SENTENCE STRUCTURE:** Sophisticated but high-impact. Focus on "Why" over "How".
3.  **VOCABULARY:** Strategic drivers.
    - ✅ USE: "Scalability", "Market positioning", "Risk mitigation", "Capital allocation".
    - ❌ FORBIDDEN: Getting bogged down in low-level tactical details.
4.  **EXAMPLES:** Industry trends, Competitive analysis, high-stakes dilemmas.
5.  **FORMATTING:** Executive summaries, key strategic pillars, data visualization concepts.
`,

  [AudienceLevel.LEVEL_4_COMMERCIAL]: `
### 🧬 AUDIENCE DNA: LEVEL 4 (SALES / CUSTOMER SUCCESS)
**PRIMARY GOAL:** Persuasion, Relationship Building & Revenue.
**BLOOM LEVEL:** Apply, Analyze & Create (Social Dynamics).

**STRICT STYLE RULES:**
1.  **TONE:** High-Energy, Empathetic, Persuasive, Confident.
2.  **SENTENCE STRUCTURE:** Conversational, engaging, question-heavy.
3.  **VOCABULARY:** Emotional intelligence & Sales.
    - ✅ USE: "Rapport", "Discovery", "Pain point", "Value proposition", "Closing".
    - ❌ FORBIDDEN: Dry technical specs, passive voice, bureaucratic language.
4.  **EXAMPLES:** Roleplay scripts, Objection handling, "What to say when...".
5.  **FORMATTING:** Scripts, Dialogue blocks, "Do's and Don'ts".
`,

  [AudienceLevel.LEVEL_5_TECHNICAL]: `
### 🧬 AUDIENCE DNA: LEVEL 5 (TECHNICAL EXPERT / R&D)
**PRIMARY GOAL:** Deep Understanding, Innovation & Problem Solving.
**BLOOM LEVEL:** Analyze, Evaluate & Create (Systemic).

**STRICT STYLE RULES:**
1.  **TONE:** Precise, Geeky (in a good way), Detail-Oriented.
2.  **SENTENCE STRUCTURE:** Can handle complexity. Precision is key.
3.  **VOCABULARY:** Domain-specific technical terminology.
    - ✅ USE: Correct technical acronyms, specific metrics, system logic.
    - ❌ FORBIDDEN: Simplifying things "for the layman". Dumbed-down analogies.
4.  **EXAMPLES:** Code snippets, Schematics, Edge cases, Debugging logs.
5.  **FORMATTING:** Code blocks, Technical diagrams, Data tables.
`
};

function normalizeAudienceText(text: string): string {
  const lower = (text || '').toLowerCase();
  return lower
    .replace(/ă/g, 'a')
    .replace(/â/g, 'a')
    .replace(/î/g, 'i')
    .replace(/ș/g, 's')
    .replace(/ş/g, 's')
    .replace(/ț/g, 't')
    .replace(/ţ/g, 't');
}

export function getStyleBlock(audienceDescription: string): string {
  const normalized = normalizeAudienceText(audienceDescription);

  const opKeywords = [
    'blue collar', 'line worker', 'frontline', 'front line',
    'operator', 'factory', 'warehouse', 'depozit', 'magazie',
    'muncitor', 'muncitori', 'productie', 'linie de productie',
    'sofer', 'driver', 'assembly', 'maintenance', 'field technician'
  ];

  const clericalKeywords = [
    'office', 'back office', 'clerical', 'administrative',
    'junior', 'assistant', 'coordinator', 'front desk',
    'operator call center', 'data entry'
  ];

  const strategicKeywords = [
    'executive', 'executives', 'director', 'vp', 'c-level', 'c level',
    'ceo', 'cfo', 'coo', 'board', 'board member',
    'senior leadership', 'top management', 'strategic',
    'founder', 'owner'
  ];

  const commercialKeywords = [
    'sales', 'sales team', 'account manager', 'account management',
    'customer success', 'customer support', 'customer service',
    'client service', 'call center', 'contact center',
    'agent vanzari', 'vanzari', 'relatii cu clientii'
  ];

  const technicalKeywords = [
    'developer', 'software engineer', 'programmer',
    'programator', 'inginer', 'engineer', 'architect',
    'it', 'it pro', 'devops', 'sysadmin', 'data scientist',
    'technical staff', 'r&d', 'research and development'
  ];

  let scoreOperational = 0;
  let scoreClerical = 0;
  let scoreStrategic = 0;
  let scoreCommercial = 0;
  let scoreTechnical = 0;

  const addScore = (keywords: string[], increment: () => void) => {
    for (const kw of keywords) {
      if (!kw) continue;
      if (normalized.includes(kw)) {
        increment();
      }
    }
  };

  addScore(opKeywords, () => { scoreOperational += 2; });
  addScore(clericalKeywords, () => { scoreClerical += 2; });
  addScore(strategicKeywords, () => { scoreStrategic += 2; });
  addScore(commercialKeywords, () => { scoreCommercial += 2; });
  addScore(technicalKeywords, () => { scoreTechnical += 2; });

  if (scoreOperational === 0 && scoreClerical === 0 && scoreStrategic === 0 && scoreCommercial === 0 && scoreTechnical === 0) {
    return STYLE_BLOCKS[AudienceLevel.LEVEL_2_CLERICAL];
  }

  let bestLevel = AudienceLevel.LEVEL_2_CLERICAL;
  let bestScore = scoreClerical;

  const consider = (level: AudienceLevel, score: number, priorityBoost = 0) => {
    const effectiveScore = score + priorityBoost;
    if (effectiveScore > bestScore) {
      bestScore = effectiveScore;
      bestLevel = level;
    }
  };

  consider(AudienceLevel.LEVEL_1_OPERATIONAL, scoreOperational, 0.5);
  consider(AudienceLevel.LEVEL_3_STRATEGIC, scoreStrategic, 0.5);
  consider(AudienceLevel.LEVEL_4_COMMERCIAL, scoreCommercial, 0.25);
  consider(AudienceLevel.LEVEL_5_TECHNICAL, scoreTechnical, 0.5);

  return STYLE_BLOCKS[bestLevel];
}

// --------------------------------------------------------------------------------
// INLINED MODULE: Golden Master Prompt
// --------------------------------------------------------------------------------
export const GOLDEN_MASTER_PROMPT = `
You are an expert **Instructional Designer**. Generate a single "Golden JSON" object for this training module.

### 1. CORE CONTEXT
- **Module**: {{moduleTitle}} ({{durationMinutes}} min)
- **Environment**: {{environment}}
- **Environment Specs**: {{envConstraints}}
- **Language**: {{language}}
- **Protagonist**: {{protagonistName}} (Stage: {{protagonistState}})
- **Audience**: {{targetAudience}}
{{styleBlock}}

### 2. GOLDEN RULES (STRICT)
1. **XML ONLY**: Output <meta>...</meta> then <content_block>PURE JSON</content_block>.
2. **NARRATIVE**: "{{protagonistName}}" appears ONLY in \`narrativeContext\` and \`theoryContent.hook\`.
3. **CONSISTENCY**: All content in {{language}}. JSON keys in English.
4. **NO HALLUCINATIONS**: Respect the duration. Do not invent modules.

### 3. JSON TEMPLATE
\`\`\`typescript
interface GoldenModuleData {
  moduleId: "{{moduleId}}";
  moduleTitle: "{{moduleTitle}}";
  moduleDurationMinutes: number;
  environment: "{{environment}}";
  narrativeContext: {
    protagonistName: string;
    storyArcStage: string;
    contextDescription: string;
    examplesLibrary: Array<{ id: string; title: string; storyContent: string; applicationContext: string }>;
  };
  sections: Array<{
    id: string;
    title: string;
    durationMinutes: number;
    type: 'THEORY' | 'ACTIVITY' | 'DISCUSSION' | 'VIDEO_LESSON';
    participantContent: { theoryMarkdown: string; keyTakeaways: string[]; reflectionQuestions?: string[]; actionableSteps?: string[] };
    trainerInstructions: { deliveryMethod: string; script: string; logistics: string[]; flipchartSketch?: any; breakoutRoomConfig?: any };
    visuals: { slidesSequence: Array<{ slideId: string; layout: string; title: string; visualDescription: string; contentBullets: string[]; speakerNotes: string }> };
    exercisesDetailed?: { title: string; objective: string; durationMinutes: number; instructionsParticipant: string; instructionsFacilitator: string; materialsNeeded: string[]; debriefingQuestions: string[]; successIndicators: string[]; adaptationNotes: string };
    videoScript?: { sceneDescription: string; scriptContent: string; visualOverlays: Array<{ timestamp: string; description: string }> };
  }>;
}
\`\`\`

### 4. THINKING PROCESS
<meta>
1. Analyze audience & tone.
2. Define protagonist's struggle.
3. Align exercises with environment ({{environment}}).
</meta>
<content_block>
{
  "moduleId": "{{moduleId}}",
  "moduleTitle": "{{moduleTitle}}",
  "moduleDurationMinutes": {{durationMinutes}},
  "environment": "{{environment}}",
  "narrativeContext": { ... },
  "sections": [ ... ]
}
</content_block>
`;

// ==========================================
// 1. INFRASTRUCTURE & CONFIGURATION
// ==========================================

class Config {
  static get SUPABASE_URL(): string {
    return Deno.env.get('SUPABASE_URL') || '';
  }

  static get SUPABASE_SERVICE_ROLE_KEY(): string {
    return Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
  }

  static get GEMINI_API_KEY(): string | undefined {
    return this.sanitize(Deno.env.get('GEMINI_API_KEY'));
  }

  static get MOONSHOT_API_KEY(): string | undefined {
    return this.sanitize(Deno.env.get('MOONSHOT_API_KEY'));
  }

  static get MOONSHOT_API_URL(): string {
    const url = Deno.env.get("MOONSHOT_API_URL");
    const baseUrl = url ? url.replace(/\/$/, '') : "https://api.moonshot.cn/v1";
    return baseUrl.includes('chat/completions') ? baseUrl : `${baseUrl}/chat/completions`;
  }

  private static sanitize(key: string | undefined): string | undefined {
    if (!key) return undefined;
    return key.trim().replace(/^["']|["']$/g, '').replace(/^Bearer\s+/i, '');
  }
}

class Logger {
  private static VERSION = "v3.0-MODULAR";

  static info(message: string, context?: any) {
    console.log(`[${this.VERSION}] INFO: ${message}`, context ? JSON.stringify(context) : '');
  }

  static error(message: string, error?: any) {
    console.error(`[${this.VERSION}] ERROR: ${message}`, error);
  }

  static warn(message: string, context?: any) {
    console.warn(`[${this.VERSION}] WARN: ${message}`, context ? JSON.stringify(context) : '');
  }
}

// ==========================================
// 2. AI SERVICE LAYER (RESILIENT)
// ==========================================

interface RetryConfig {
  maxRetries: number;
  baseDelay: number; // ms
  maxDelay: number; // ms
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 10000
};

/**
 * Resilient Fetch Wrapper
 * Handles:
 * 1. Exponential Backoff
 * 2. Rate Limiting (429 Retry-After)
 * 3. Server Errors (5xx)
 * 4. Network Glitches
 */
async function fetchWithRetry(
  url: string, 
  options: RequestInit, 
  config: RetryConfig = DEFAULT_RETRY_CONFIG
): Promise<Response> {
  let lastError: any;
  
  for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);
      
      // Success
      if (response.ok) {
        return response;
      }
      
      // Handle Rate Limiting (429)
      if (response.status === 429) {
        const retryAfter = response.headers.get("Retry-After");
        let delay = config.baseDelay * Math.pow(2, attempt); // Default exponential
        
        if (retryAfter) {
          const seconds = parseInt(retryAfter, 10);
          if (!isNaN(seconds)) {
            delay = seconds * 1000;
          }
        }
        
        // Cap delay
        delay = Math.min(delay, config.maxDelay);
        
        Logger.warn(`Rate limit hit (429). Retrying in ${delay}ms... (Attempt ${attempt + 1}/${config.maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }

      // Handle Server Errors (5xx) - Retryable
      if (response.status >= 500 && response.status < 600) {
        const delay = Math.min(config.baseDelay * Math.pow(2, attempt), config.maxDelay);
        Logger.warn(`Server error ${response.status}. Retrying in ${delay}ms... (Attempt ${attempt + 1}/${config.maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }

      // Client Errors (4xx) - Usually NOT Retryable (except 429)
      // Throw immediately for 400, 401, 403, 404
      throw new Error(`Request failed with status ${response.status}: ${await response.text()}`);

    } catch (error: any) {
      lastError = error;
      
      // Don't retry if we just threw a non-retryable status error above
      if (error.message.includes("Request failed with status")) {
        throw error;
      }

      const delay = Math.min(config.baseDelay * Math.pow(2, attempt), config.maxDelay);
      Logger.warn(`Network error: ${error.message}. Retrying in ${delay}ms... (Attempt ${attempt + 1}/${config.maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
}

interface IAIProvider {
  name: string;
  isConfigured(): boolean;
  generateContent(prompt: string): Promise<string>;
}

class GeminiProvider implements IAIProvider {
  name = "Gemini";

  isConfigured(): boolean {
    return !!Config.GEMINI_API_KEY;
  }

  async generateContent(prompt: string): Promise<string> {
    const apiKey = Config.GEMINI_API_KEY;
    if (!apiKey) throw new Error("Gemini API Key missing");

    // Primary Model: gemini-2.0-flash (Active until March 2026)
    // Fallback: gemini-2.0-flash-lite or gemini-1.5-flash (if still accessible via legacy)
    // Updated 2026-01-30: gemini-1.5 series is deprecated. Switching to 2.0.
    try {
      Logger.info("Attempting Gemini 2.0-flash...");
      return await this.callApi("gemini-2.0-flash", apiKey, prompt);
    } catch (error: any) {
      if (this.isFallbackTrigger(error)) {
        Logger.warn(`Gemini 2.0-flash failed (${error.message}). Falling back to gemini-2.0-flash-lite...`);
        return await this.callApi("gemini-2.0-flash-lite", apiKey, prompt);
      }
      throw error;
    }
  }

  private async callApi(model: string, key: string, prompt: string): Promise<string> {
    // Try v1beta API - safest bet for now, v1 might need specific enablement
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
    const maskedKey = key.substring(0, 4) + "..." + key.substring(key.length - 4);
    
    // Log URL without key for debugging
    Logger.info(`Calling Gemini API: ${url.replace(key, '***')} | Key: ${maskedKey}`);

    try {
      const response = await fetchWithRetry(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });

      const data = await response.json();
      
      if (data.error) {
         throw new Error(`Gemini API Error (${model}): ${data.error.message} [Key: ${maskedKey}]`);
      }

      if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
          throw new Error(`Invalid response from Gemini (${model}): ${JSON.stringify(data)}`);
      }
      return data.candidates[0].content.parts[0].text;
    } catch (e: any) {
      throw new Error(`Gemini Call Failed (${model}): ${e.message} [Key: ${maskedKey}]`);
    }
  }


  private isFallbackTrigger(error: any): boolean {
    // We fallback on 404 (Model not found) or 503 (Overloaded) if retries failed
    // Note: fetchWithRetry handles transient 5xx, so if we are here, it's persistent.
    const msg = error.message || "";
    return msg.includes("404") || msg.includes("503") || msg.includes("Overloaded");
  }
}

class MoonshotProvider implements IAIProvider {
  name = "Moonshot";

  isConfigured(): boolean {
    return !!Config.MOONSHOT_API_KEY;
  }

  async generateContent(prompt: string): Promise<string> {
    const apiKey = Config.MOONSHOT_API_KEY;
    if (!apiKey) throw new Error("Moonshot API Key missing");
    
    const maskedKey = apiKey.substring(0, 4) + "..." + apiKey.substring(apiKey.length - 4);
    Logger.info(`Attempting Moonshot (Kimi)... Key: ${maskedKey}`);

    try {
      const response = await fetchWithRetry(Config.MOONSHOT_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "moonshot-v1-8k",
          messages: [
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: prompt }
          ],
          temperature: 0.3
        })
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(`Moonshot API Error: ${data.error.message} [Key: ${maskedKey}]`);
      }
      
      return data.choices[0].message.content;
    } catch (e: any) {
      throw new Error(`Moonshot Call Failed: ${e.message} [Key: ${maskedKey}]`);
    }
  }
}

class AIOrchestrator {
  private providers: IAIProvider[];

  constructor() {
    this.providers = [
      new GeminiProvider(),
      new MoonshotProvider()
    ];
  }

  async execute(prompt: string): Promise<string> {
    const errors: string[] = [];

    for (const provider of this.providers) {
      if (!provider.isConfigured()) {
        errors.push(`${provider.name}: Not configured`);
        continue;
      }

      try {
        return await provider.generateContent(prompt);
      } catch (error: any) {
        const errorMsg = `${provider.name} Error: ${error.message}`;
        Logger.error(errorMsg);
        errors.push(errorMsg);
      }
    }

    throw new Error(`[v3.0-MODULAR] AI_ERROR: All providers failed. Details: ${JSON.stringify(errors)}`);
  }
}

// Global Orchestrator Instance
const orchestrator = new AIOrchestrator();

// ==========================================
// POST-PROCESSOR & VALIDATION
// ==========================================

const BANNED_PHRASES: Record<string, string[]> = {
  'ro': [
    'din păcate', 'din pacate', 'nu am suficient context', 'nu am suficiente informații',
    'sper că această propunere', 'sper ca aceasta propunere', 'vă rog să îmi oferiți',
    'va rog sa imi oferiti', 'acesta este un schelet general', 'dacă doriți să aprofundez',
    'daca doriti sa aprofundez', 'ca model de limbaj', 'ca un model de limbaj',
    'nu pot genera', 'nu pot crea'
  ],
  'en': [
    'i apologize', 'i do not have enough context', 'please provide more details',
    'this is a general outline', 'let me know if you need', 'as an ai language model',
    'unfortunately', 'i cannot generate', 'i cannot create', 'cannot fulfill'
  ],
  'fr': [
        'je m\'excuse', 'je n\'ai pas assez de contexte', 'veuillez fournir plus de détails',
        'ceci est un plan général', 'faites-moi savoir si vous avez besoin', 'en tant que modèle de langage',
        'malheureusement', 'je ne peux pas générer'
    ],
    'de': [
        'ich entschuldige mich', 'ich habe nicht genügend kontext', 'bitte geben sie weitere details an',
        'dies ist ein allgemeiner überblick', 'lassen sie mich wissen', 'als ki-sprachmodell',
        'leider', 'ich kann nicht generieren'
    ],
    'es': [
        'lo siento', 'no tengo suficiente contexto', 'por favor proporcione más detalles',
        'este es un esquema general', 'hágamelo saber si necesita', 'como modelo de lenguaje',
        'desafortunadamente', 'no puedo generar'
    ],
    'it': [
        'mi scuso', 'non ho abbastanza contesto', 'si prega di fornire maggiori dettagli',
        'questa è una bozza generale', 'fammi sapere se hai bisogno', 'come modello linguistico',
        'purtroppo', 'non posso generare'
    ]
};

// Universal Validator for ALL languages (using LLM as Judge)
// This is slower but covers the "long tail" of languages.
async function isContentValidByAI(content: string): Promise<{ valid: boolean, reason?: string }> {
  // Optimization: Only check short/suspicious content or if we want max safety.
  // We check the first 500 chars as refusals are usually at the start.
  const sample = content.substring(0, 500);
  
  const validationPrompt = `
  **TASK**: Analyze the text below and determine if it contains an AI refusal, apology, or meta-commentary.
  
  **TEXT SAMPLE**:
  "${sample}..."

  **CRITERIA FOR "INVALID"**:
  1. Contains apologies (e.g. "I apologize", "I'm sorry", or translations).
  2. Refuses to generate content (e.g. "I cannot generate", "I don't have enough context").
  3. Contains AI meta-commentary (e.g. "As an AI language model", "I am a text-based AI").
  4. Asks the user for more info instead of generating (e.g. "Please provide more details").
  5. Offers a "skeleton" or "outline" instead of full content (e.g. "Here is a general structure").

  **OUTPUT JSON ONLY**:
  {
    "valid": boolean, // true if content looks like actual course material, false if it's a refusal/apology
    "reason": "short explanation if false"
  }
  `;

  try {
    const raw = await orchestrator.execute(validationPrompt);
    const result = repairAndParseJson<{ valid: boolean, reason?: string }>(raw);
    return result;
  } catch (e) {
    Logger.warn("AI Validation failed, assuming valid to avoid blocking.", e);
    return { valid: true };
  }
}

function containsBannedPhrases(content: string, language: string = 'ro'): boolean {
  const lower = content.toLowerCase();
  
  // 1. Check specific language (Fast Path)
  const langPhrases = BANNED_PHRASES[language] || [];
  if (langPhrases.some(phrase => lower.includes(phrase))) return true;

  // 2. ALWAYS check English (system fallback)
  if (language !== 'en') {
      const enPhrases = BANNED_PHRASES['en'];
      if (enPhrases.some(phrase => lower.includes(phrase))) return true;
  }

  return false;
}

// Helper wrapper for existing business logic with RETRY & CLEANUP
async function callLLM(prompt: string, language: string = 'ro', isRetry: boolean = false): Promise<string> {
  let response = await orchestrator.execute(prompt);

  // Phase 1: Fast Static Check
  if (containsBannedPhrases(response, language)) {
    if (isRetry) {
      Logger.warn("Content still contains banned phrases after retry. Returning best effort.");
      return response;
    }
    Logger.warn(`Banned phrases detected (Static Check - Lang: ${language}). Retrying...`);
    return retryWithStrictInstructions(prompt, language);
  }

  // Phase 2: AI Validator (Universal Check) - Only if static check passed
  // We skip this check for retries to avoid infinite loops and extra cost, unless critical.
  if (!isRetry) {
      const aiValidation = await isContentValidByAI(response);
      if (!aiValidation.valid) {
          Logger.warn(`AI Validator rejected content: ${aiValidation.reason}. Retrying...`);
          return retryWithStrictInstructions(prompt, language);
      }
  }

  return response;
}

async function retryWithStrictInstructions(prompt: string, language: string): Promise<string> {
    const strictInstruction = `
    \n\n
    *** CRITICAL INSTRUCTION - STRICT MODE ***
    The previous output contained apologetic or meta-conversational phrases (e.g., "I apologize", "I need more context", "This is a draft").
    
    YOU MUST FOLLOW THESE RULES:
    1. DO NOT apologize.
    2. DO NOT ask for more context or details.
    3. DO NOT say "I hope this helps" or "Let me know".
    4. DO NOT provide a "skeleton" or "outline" - generate the FULL CONTENT.
    5. IF context is missing, IMPROVISE realistic and high-quality details that fit the scenario.
    6. ACT as the expert. Be confident.
    7. OUTPUT ONLY THE CONTENT in the requested language (${language}).
    
    GENERATE THE CONTENT NOW.
    `;
    
    return callLLM(prompt + strictInstruction, language, true);
}

// ==========================================
// 3. TYPES (BUSINESS LOGIC)
// ==========================================

export type CourseEnvironment = 'LIVE' | 'ONLINE';

export interface GoldenModuleData {
  moduleId: string;
  moduleTitle: string;
  moduleDurationMinutes: number;
  environment: CourseEnvironment;
  localizedLabels: {
    duration: string;
    format: string;
    section: string;
    theory: string;
    keyTakeaways: string;
    actionPlan: string;
    reflection: string;
    trainerInstructions: string;
    method: string;
    logistics: string;
    script: string;
    activity: string;
    objective: string;
    instructionsParticipant: string;
    instructionsFacilitator: string;
    debrief: string;
    example: string;
    videoScript: string;
  };
  narrativeContext: {
    protagonistName: string;
    storyArcStage: string;
    contextDescription: string;
    examplesLibrary: Array<{
      id: string;
      title: string;
      storyContent: string;
      applicationContext: string;
    }>;
  };
  sections: Array<GoldenSection>;
}

export interface GoldenSection {
  id: string;
  title: string;
  durationMinutes: number;
  type: 'THEORY' | 'ACTIVITY' | 'DISCUSSION' | 'VIDEO_LESSON';
  participantContent: {
    theoryMarkdown: string;
    keyTakeaways: string[];
    reflectionQuestions?: string[];
    actionableSteps?: string[];
  };
  trainerInstructions: {
    deliveryMethod: string;
    script: string;
    logistics: string[];
    flipchartSketch?: {
      title: string;
      visualDescription: string;
      bulletPoints: string[];
    };
    breakoutRoomConfig?: {
      groupSize: number;
      duration: number;
      taskDescription: string;
    };
  };
  visuals: {
    slidesSequence: Array<{
      slideId: string;
      layout: 'TITLE' | 'BULLETS' | 'VISUAL_FOCUS' | 'QUOTE' | 'SPLIT_SCREEN';
      title: string;
      visualDescription: string;
      contentBullets: string[];
      speakerNotes: string;
    }>;
  };
  exercisesDetailed?: {
    title: string;
    objective: string;
    durationMinutes: number;
    instructionsParticipant: string;
    instructionsFacilitator: string;
    materialsNeeded: string[];
    debriefingQuestions: string[];
    successIndicators: string[];
    adaptationNotes: string;
  };
  videoScript?: {
    sceneDescription: string;
    scriptContent: string;
    visualOverlays: Array<{ timestamp: string; description: string }>;
  };
}

// ==========================================
// 4. PROMPTS & TEMPLATES
// ==========================================

export const GOLDEN_SAMPLES = {
  objectives: `
# [Course Title]
**Total Duration:** [Hours]
**Target Audience:** [Specific Audience]
**Format:** [Live Workshop OR Online Course]

---

## 🎯 LEARNING OBJECTIVES (BLOOM'S TAXONOMY)

At the end of this course, participants will be able to:

### 1. **ANALYZE** (Bloom: Analyze)
To identify [Key Problem/Pattern] using [Specific Framework/Tool] and justify the diagnosis with concrete evidence from [Context].

**Success Criteria:**
- Correctly classifies [X]% of [Scenarios]
- Provides minimum [Y] evidence points for each classification

---

### 2. **APPLY** (Bloom: Apply)
To adapt [Method/Technique] depending on [Variable A] and [Variable B], using the [Step-by-Step Process] learned in Module [N].

**Success Criteria:**
- Solves correctly [X]/[Y] practical scenarios
- Develops an action plan for a real-world situation

---

### 3. **CREATE** (Bloom: Create)
To develop a personalized [Strategy/Plan/Project] for [Target], with specific milestones and [KPIs].

**Success Criteria:**
- The plan contains specific actions (not vague wishes)
- Includes [Specific Component A] and [Specific Component B]

---
`,

  workbook_online: `
## Module [N]: [Module Title]

### 1. Why this matters (The Hook)
[Compelling Intro]: Start with a relatable pain point or myth.
"Most people believe that [Common Myth about Topic]. But in reality, [Truth]."
"Have you ever felt [Pain Point]? You are not alone."

### 2. Core Concept: [Concept Name]
**Definition:** [Clear, jargon-free definition]

**The Framework ([Acronym/Model]):**
1. **[Step 1]:** [Explanation]
2. **[Step 2]:** [Explanation]
3. **[Step 3]:** [Explanation]

> **Pro Tip:** [Actionable insight or "Cheat Code"]

### 3. Real World Example (Narrative Arc)
**The Story of [Protagonist Name]:**
[Protagonist] faced [Challenge related to Module].
At first, they tried [Wrong Approach]. Result: [Negative Outcome].
Then, they applied [Core Concept].
**Result:** [Positive Outcome].

### 4. Practical Exercise [N].1
**Objective:** Apply [Concept] to a personal scenario.
**Instructions:**
1. Identify [X].
2. Apply [Y].
3. Write down [Z].

**Workspace:**
[____________________]
[____________________]
`,

  workbook_live: `
## Module [N]: [Module Title] (Live Workshop Edition)

### 1. Group Discussion Starter
**Question:** "[Provocative Question about Topic]?"
**Activity:** Turn to your neighbor (2 min) and discuss.

### 2. Core Framework: [Concept Name]
[Visual Diagram Placeholder]
- **[Component A]:** [Description]
- **[Component B]:** [Description]

### 3. The "Aha!" Moment
> **Key Takeaway:** [The most important insight of the module]

### 4. Group Activity [N].1: [Activity Name]
**Format:** Groups of [X]
**Time:** [Y] minutes
**Instructions:**
1. Select a [Role/Scenario].
2. Practice [Technique].
`,
  
  structure_live: `
[
  {
    "title": "Module 1: Foundations",
    "duration": "60 min",
    "description": "Introduction to core concepts...",
    "topics": ["Topic A", "Topic B"]
  },
  {
    "title": "Module 2: Advanced Application",
    "duration": "90 min",
    "description": "Deep dive into complex scenarios...",
    "topics": ["Case Study X", "Roleplay Y"]
  }
]
`
};

// GOLDEN_MASTER_PROMPT imported from ./prompts/golden-master.ts

export const getDepthSpecs = (language: string, type: 'live' | 'online' = 'live', practicePercent: number = 80) => {
  const envSpecs = type === 'online' 
    ? `
    **ENVIRONMENT: ONLINE (VIRTUAL CLASSROOM - ZOOM/TEAMS)**
    - **INTERACTION**: Must use "Breakout Rooms", "Chat Polls", "Miro Board links", "Screen Share".
    - **CONSTRAINTS**: Max 10 min monologues (Zoom Fatigue). Frequent "Type in chat" prompts.
    - **MATERIALS**: PDFs, Digital Workbooks, Online Quizzes.
    ` 
    : `
    **ENVIRONMENT: LIVE (IN-PERSON WORKSHOP)**
    - **INTERACTION**: EXCLUSIVE face-to-face activities: "Turn to your neighbor", "Physical Flipcharts", "Room Movement", "Gallery Walk", "Role Play in room", "Group Discussions", "Physical Exercises".
    - **CONSTRAINTS**: 
      *   Standard attention spans. Physical handouts allowed.
      *   **FORBIDDEN**: DO NOT mention videos, webinars, online dashboards, virtual forums, zoom links, or screen sharing.
    - **MATERIALS**: Printed Workbooks, Sticky Notes, Markers, Flipchart paper.
    `;

  return {
    workbook: `
    **DEPTH SPECIFICATIONS (Workbook):**
    - **LENGTH**: Comprehensive workbook (target 40+ pages).
    - **PEDAGOGY (ACTION-FIRST)**:
      *   **No Fluff**: Do not explain "definitions" unless critical. Go straight to "How to apply".
      *   **Step-by-Step**: Use numbered lists for actions. "Step 1: Do X. Step 2: Do Y."
      *   **Checklists**: Include "Am I doing it right?" checklists for every concept.
    - **CONTENT PER MODULE**:
      *   **Explanatory Text**: 800-1200 words. Conversational.
      *   **Stories**: Include at least 1-2 distinct stories/analogies per section (Hero -> Problem -> Solution).
      *   **Case Studies**: Full case studies (1 page each) with the Course Protagonist.
      *   **Exercises**: Every exercise must have: Objective, Instructions, Formatted answer space (tables/boxes).
    - **FORMATTING**: Markdown headers, Blockquotes for takeaways, Bold for emphasis.
    - **LANGUAGE**: All content must be in **${language}**.
    ${envSpecs}
  `,
    slides: `
    **DEPTH SPECIFICATIONS (Slides):**
    - **QUANTITY**: 1 slide per 6-8 minutes.
    - **STORYTELLING FLOW**:
      *   Slide 1: The Hook (Problem/Story).
      *   Slide 2: The Solution (Concept).
      *   Slide 3: The Framework (Visual Model).
      *   Slide 4: Practical Application.
    - **VISUALS**: Describe specific imagery (e.g., "Photo of a frustrated manager looking at a clock").
    - **LANGUAGE**: All content must be in **${language}**.
    ${envSpecs}
  `,
    exercises: `
    **DEPTH SPECIFICATIONS (Exercises):**
    - **QUANTITY**: Ensure approximately **${practicePercent}%** of the course time is practical (based on User's Blueprint).
    - **REALITY CHECK**:
      *   **Scenario-Based**: Never ask "What is X?". Ask "Client Y is yelling. What do you say?".
      *   **Red Flags**: Always include "What could go wrong?" sections.
    - **DETAIL**:
      *   **Timing**: Specify exact duration.
      *   **Facilitator Instructions**: Step-by-step guide.
      *   **Debriefing**: 3-5 specific questions (Factual, Analytical, Applicative).
    - **LANGUAGE**: All content must be in **${language}**.
    ${envSpecs}
  `,
    manual: `
    **DEPTH SPECIFICATIONS (Trainer Manual):**
    - **FLOW TABLE**: Minute-by-minute agenda.
    - **SCRIPTS**: Full conversational scripts. NO "Say hello to participants". WRITE exactly what to say.
    - **STORYTELLING**: The trainer is a storyteller. Scripts must include personal anecdotes placeholders.
    - **METHODOLOGY**:
      *   **Feedback**: SBI Model only.
      *   **Problem Solving**: Ishikawa / 5 Whys.
    - **STRUCTURĂ**: ONE coherent manual.
    - **LANGUAGE**: All content must be in **${language}**.
    ${envSpecs}
  `
  };
};

export const getPromptTemplates = (language: string) => {
  return {
    workbook_section: `
    ## Module [N]: [Title] ([Duration])

    ### [Translate to ${language}: "Why this matters"] (200-300 words)
    [Intro paragraph explaining importance. Hook the reader with a relatable problem.]

    ### [Section Title]
    #### Core Concept (300-500 words)
    [Full explanation. Define terms, provide context. NO academic tone - use "buddy-to-buddy" tone.]

    **[Translate to ${language}: "Real World Example"]:** (200-300 words)
    [Story. Context -> Challenge -> Action -> Result]

    ---
    🎯 **[Translate to ${language}: "Practical Exercise"] [N]**
    **[Translate to ${language}: "Objective"]:** [What specific skill will be practiced]
    **[Translate to ${language}: "Duration"]:** [Time] min

    **[Translate to ${language}: "Instructions"]:**
    1. [Clear Step 1]
    2. [Clear Step 2]

    **[Translate to ${language}: "Workspace"]:**
    [Insert ample space for writing/answering]

    **[Translate to ${language}: "Success Checklist"]:**
    - [ ] [Item 1]
    - [ ] [Item 2]
    ---

    ### [Translate to ${language}: "Recap"] [N]
    > **[Translate to ${language}: "Remember"]:** [Key takeaway 1]
    > **[Translate to ${language}: "Remember"]:** [Key takeaway 2]
  `,
    slide: `
    <SLIDE_BEGIN id="[N]">
    <TITLE>[Title]</TITLE>
    <!-- slide-layout: EXPLAINER -->
    <VISUAL>[Visual description]</VISUAL>
    <CONTENT>
    - [Bullet 1]
    - [Bullet 2]
    </CONTENT>
    <NOTES>[Script]</NOTES>
    <SLIDE_END id="[N]">
    `
  };
};

// ==========================================
// 5. UTILS (PARSER & REPAIR)
// ==========================================

export function repairAndParseJson<T>(text: string): T {
  let cleaned = text.trim();

  // 0. XML Extraction (Silent Operator Protocol)
  // We prioritize the content inside <content_block> tags.
  const xmlMatch = cleaned.match(/<content_block>([\s\S]*?)<\/content_block>/);
  if (xmlMatch) {
    cleaned = xmlMatch[1].trim();
  }

  // 1. Remove Markdown Fences
  const fenceMatch = cleaned.match(/```json([\s\S]*?)```/);
  if (fenceMatch) {
    cleaned = fenceMatch[1].trim();
  } else {
      const genericFence = cleaned.match(/```([\s\S]*?)```/);
      if (genericFence) {
          cleaned = genericFence[1].trim();
      }
  }

  // 2. Find outer braces or brackets (Object or Array)
  const firstBrace = cleaned.indexOf('{');
  const firstBracket = cleaned.indexOf('[');
  
  // Determine if we are looking for an Array or an Object
  // If '[' appears before '{', it's likely an array.
  const isArray = firstBracket !== -1 && (firstBrace === -1 || firstBracket < firstBrace);
  
  if (isArray) {
      const lastBracket = cleaned.lastIndexOf(']');
      if (firstBracket !== -1 && lastBracket !== -1) {
          cleaned = cleaned.substring(firstBracket, lastBracket + 1);
      }
  } else {
      const lastBrace = cleaned.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1) {
          cleaned = cleaned.substring(firstBrace, lastBrace + 1);
      }
  }

  try {
    return JSON.parse(cleaned) as T;
  } catch (e) {
    Logger.warn("JSON Parse Error 1st attempt:", e);
    // 3. Last resort: specific fixes
    try {
        const fixed = cleaned
            .replace(/(?<!\\)\n/g, '\\n');
        return JSON.parse(fixed) as T;
    } catch (e2) {
        throw new Error(`Failed to parse JSON: ${e instanceof Error ? e.message : String(e)}`);
    }
  }
}

type RenderTarget = 'WORKBOOK' | 'MANUAL' | 'EXERCISES' | 'EXAMPLES' | 'VIDEO_SCRIPT';

export const renderToMarkdown = (data: GoldenModuleData, target: RenderTarget, contextInfo?: string): string => {
  let output = '';

  // 1. Header Global
  output += `# ${data.moduleTitle}\n`;
  output += `**Duration:** ${data.moduleDurationMinutes} min | **Format:** ${data.environment}\n\n`;

  if (target === 'MANUAL' && contextInfo) {
      output += `> **COURSE CONTEXT (VERIFICATION)**\n`;
      output += `> This content was generated based on the following constraints:\n`;
      output += `> ${contextInfo.replace(/\n/g, '\n> ')}\n\n`;
      output += `---\n\n`;
  }

  if (target === 'EXAMPLES') {
      return renderExamplesLibrary(data);
  }

  // 2. Iterate through sections
  data.sections.forEach((section, index) => {
    output += `---\n\n`; // Section separator
    output += `## Section ${index + 1}: ${section.title} (${section.durationMinutes} min)\n\n`;

    switch (target) {
      case 'WORKBOOK':
        output += renderWorkbookSection(section);
        break;
      case 'MANUAL':
        output += renderManualSection(section, data.narrativeContext.protagonistName);
        break;
      case 'EXERCISES':
        if (section.exercisesDetailed) {
           output += renderExerciseSheet(section.exercisesDetailed);
        } else {
            output += `*(No detailed exercises in this section)*\n\n`;
        }
        break;
       case 'VIDEO_SCRIPT':
         if (section.videoScript) {
             output += renderVideoScript(section.videoScript);
         }
         break;
    }
    output += `\n\n`;
  });

  return cleanMarkdown(output);
};

const renderWorkbookSection = (section: GoldenSection): string => {
  const content = section.participantContent;
  const exercise = section.exercisesDetailed;

  if (!content && !exercise) {
      return `> Missing content for section "${section.title}". Please regenerate this module.`;
  }

  let md = `### ${section.title}\n\n`;

  if (content && content.keyTakeaways && content.keyTakeaways.length > 0) {
    md += `#### 🔑 Key Takeaways\n`;
    content.keyTakeaways.forEach(pt => {
      md += `- ${pt}\n`;
    });
    md += `\n`;
  }

  if (content && content.actionableSteps && content.actionableSteps.length > 0) {
    md += `#### 🚀 Action Plan\n`;
    content.actionableSteps.forEach((step, i) => {
      md += `${i + 1}. ${step}\n`;
    });
    md += `\n\n`;
    md += `\n\n`;
  }

  if (exercise) {
    if (exercise.title) {
      md += `#### 🎯 Practical Exercise: ${exercise.title}\n\n`;
    } else {
      md += `#### 🎯 Practical Exercise\n\n`;
    }

    if (exercise.objective) {
      md += `**Objective:** ${exercise.objective}\n\n`;
    }

    if (typeof exercise.durationMinutes === 'number' && exercise.durationMinutes > 0) {
      md += `**Duration:** ${exercise.durationMinutes} min\n\n`;
    }

    if (exercise.instructionsParticipant) {
      md += `**Instructions for you:**\n`;
      md += `${exercise.instructionsParticipant}\n\n`;
    }

    md += `**Workspace:**\n\n`;
    md += `\n\n\n\n\n`;

    if (exercise.successIndicators && exercise.successIndicators.length > 0) {
      md += `**Success Checklist:**\n`;
      exercise.successIndicators.forEach(item => {
        md += `- [ ] ${item}\n`;
      });
      md += `\n`;
    }
  }

  if (content && content.reflectionQuestions && content.reflectionQuestions.length > 0) {
    md += `#### 🤔 Reflection\n`;
    content.reflectionQuestions.forEach(q => {
      md += `**${q}**\n\n`;
      md += `\n\n\n\n`;
    });
  }

  if (content && (!content.keyTakeaways || content.keyTakeaways.length === 0) && (!content.actionableSteps || content.actionableSteps.length === 0) && content.theoryMarkdown) {
    md += `${content.theoryMarkdown}\n\n`;
  }

  return md;
};

const renderManualSection = (section: GoldenSection, protagonistName: string): string => {
  const instr = section.trainerInstructions;
  let md = `### 👨‍🏫 Trainer Instructions\n`;
  md += `**Method:** ${instr.deliveryMethod}\n\n`;

  if (instr.logistics && instr.logistics.length > 0) {
      md += `**🛠️ Logistics:** ${instr.logistics.join(', ')}\n\n`;
  }

  if (instr.flipchartSketch) {
      md += `**🎨 FLIPCHART SKETCH:**\n`;
      md += `*Title:* ${instr.flipchartSketch.title}\n`;
      md += `*Draw:* ${instr.flipchartSketch.visualDescription}\n`;
      md += `*Write:* \n${instr.flipchartSketch.bulletPoints.map(b => `  - ${b}`).join('\n')}\n\n`;
  }

  if (instr.breakoutRoomConfig) {
      md += `**💻 BREAKOUT ROOMS:**\n`;
      md += `*Groups:* ${instr.breakoutRoomConfig.groupSize} pax | *Time:* ${instr.breakoutRoomConfig.duration} min\n`;
      md += `*Task:* ${instr.breakoutRoomConfig.taskDescription}\n\n`;
  }

  md += `#### 🗣️ Script (Verbatim)\n`;
  md += `> ${instr.script.replace(/\n/g, '\n> ')}\n\n`;

  if (section.visuals && section.visuals.slidesSequence.length > 0) {
      md += `#### 🖼️ Visuals Cue\n`;
      section.visuals.slidesSequence.forEach(slide => {
          md += `- **[Slide ${slide.slideId}]:** ${slide.title} (Note: ${slide.speakerNotes.substring(0, 50)}...)\n`;
      });
  }

  return md;
};

const renderExerciseSheet = (exercise: NonNullable<GoldenSection['exercisesDetailed']>): string => {
    let md = `### 🏋️ Activity: ${exercise.title}\n`;
    md += `**Objective:** ${exercise.objective}\n`;
    md += `**Time:** ${exercise.durationMinutes} min\n\n`;

    md += `#### Instructions (Participant)\n${exercise.instructionsParticipant}\n\n`;
    md += `#### Instructions (Facilitator)\n${exercise.instructionsFacilitator}\n\n`;
    
    md += `#### Debriefing Questions\n`;
    exercise.debriefingQuestions.forEach(q => md += `- ${q}\n`);
    
    if (exercise.adaptationNotes) {
        md += `\n**⚠️ Adaptation Note:** ${exercise.adaptationNotes}\n`;
    }

    return md;
};

const renderExamplesLibrary = (data: GoldenModuleData): string => {
    let md = `# Examples Library for ${data.moduleTitle}\n`;
    md += `*Context: ${data.narrativeContext.protagonistName} is in stage: "${data.narrativeContext.storyArcStage}"*\n\n`;
    
    data.narrativeContext.examplesLibrary.forEach(ex => {
        md += `## Example: ${ex.title}\n`;
        md += `**When to use:** ${ex.applicationContext}\n\n`;
        md += `"${ex.storyContent}"\n\n`;
        md += `---\n\n`;
    });
    
    return md;
};

const renderVideoScript = (video: NonNullable<GoldenSection['videoScript']>): string => {
    let md = `### 🎥 Video Script\n`;
    md += `**Scene:** ${video.sceneDescription}\n\n`;
    md += `**Script:**\n${video.scriptContent}\n\n`;
    
    if(video.visualOverlays && video.visualOverlays.length > 0) {
        md += `**Overlays:**\n`;
        video.visualOverlays.forEach(o => md += `- [${o.timestamp}] ${o.description}\n`);
    }
    return md;
}

export const renderToXml = (data: GoldenModuleData): string => {
  let xmlOutput = '';

  data.sections.forEach(section => {
    section.visuals.slidesSequence.forEach(slide => {
      xmlOutput += `<SLIDE_BEGIN id="${slide.slideId}">\n`;
      xmlOutput += `<TITLE>${escapeXml(slide.title)}</TITLE>\n`;
      xmlOutput += `<!-- slide-layout: ${slide.layout} -->\n`;
      xmlOutput += `<VISUAL>${escapeXml(slide.visualDescription)}</VISUAL>\n`;
      xmlOutput += `<CONTENT>\n`;
      slide.contentBullets.forEach(bullet => {
        xmlOutput += `- ${escapeXml(bullet)}\n`;
      });
      xmlOutput += `</CONTENT>\n`;
      xmlOutput += `<NOTES>${escapeXml(slide.speakerNotes)}</NOTES>\n`;
      xmlOutput += `<SLIDE_END id="${slide.slideId}">\n\n`;
    });
  });

  return xmlOutput;
};

export const renderExercises = (data: GoldenModuleData): string => {
    return renderToMarkdown(data, 'EXERCISES');
};

const cleanMarkdown = (text: string): string => {
  return text
    .replace(/\\n/g, '\n')
    .replace(/\n\s*\n/g, '\n\n')
    .trim();
};

const escapeXml = (unsafe: string): string => {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
};

// ==========================================
// 6. MAIN HANDLER (CONTROLLER)
// ==========================================

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Course {
  id: string;
  title: string;
  target_audience: string;
  environment: 'LIVE' | 'ONLINE';
  language: string;
  blueprint?: any;
  learning_objectives?: string;
  dna?: any;
  story_arc?: Record<string, string>;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(Config.SUPABASE_URL, Config.SUPABASE_SERVICE_ROLE_KEY);

    const body = await req.json();
    const { action } = body;

    Logger.info(`Request received. Action: ${action}`);

    // ==========================================
    // HEALTH CHECKS & DIAGNOSTICS
    // ==========================================

    if (action === 'ping') {
      return new Response(JSON.stringify({ message: 'pong', version: '3.0-MODULAR' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'provider_status') {
      return new Response(JSON.stringify({
        googleConfigured: !!Config.GEMINI_API_KEY,
        moonshotConfigured: !!Config.MOONSHOT_API_KEY,
        activeProvider: Config.GEMINI_API_KEY ? 'google' : (Config.MOONSHOT_API_KEY ? 'moonshot' : 'none')
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'test_connection') {
       Logger.info("Starting connection test...");
       const results: any = {};
       
       // Test Gemini
       try {
         const gemini = new GeminiProvider();
         if (gemini.isConfigured()) {
            const resp = await gemini.generateContent("Hi");
            results.gemini = { status: 200, ok: true, body: resp };
         } else {
            results.gemini = { status: "missing_key" };
         }
       } catch (e: any) {
         results.gemini = { error: e.message };
       }

       // Test Moonshot
       try {
         const moonshot = new MoonshotProvider();
         if (moonshot.isConfigured()) {
            const resp = await moonshot.generateContent("Hi");
            results.moonshot = { status: 200, ok: true, body: resp };
         } else {
            results.moonshot = { status: "missing_key" };
         }
       } catch (e: any) {
         results.moonshot = { error: e.message };
       }

       return new Response(JSON.stringify(results), {
           headers: { ...corsHeaders, 'Content-Type': 'application/json' },
       });
    }

    // ==========================================
    // SPECIAL ACTIONS (No Course ID required)
    // ==========================================
    if (action === 'analyze_upload') {
        const { fileContent, fileName, environment } = body;
        const result = await handleAnalyzeUpload(fileContent, fileName, environment);
        return new Response(JSON.stringify({ content: result }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }

    if (action === 'complete_sections_for_import') {
        const { blueprint, environment, language } = body;
        const result = await handleCompleteSectionsForImport(blueprint, environment, language);
        return new Response(JSON.stringify({ content: result }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }

    if (action === 'fill_gaps') {
        const { blueprint, existingContent, environment } = body;
        const result = await handleFillGaps(blueprint, existingContent, environment);
        return new Response(JSON.stringify({ content: result }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }

    if (action === 'chat_onboarding') {
        const { chat_history, course } = body;
        const result = await handleChatOnboarding(chat_history, course);
        return new Response(JSON.stringify({ content: result }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }

    const { step_type, module_id, context, blueprint_duration, explicit_module_list } = body;
    const course_id = body.course_id || body.course?.id;

    Logger.info(`[Main] Received request: step_type=${step_type}, course_id=${course_id}, module_id=${module_id}`);

    if (!course_id) throw new Error("Missing course_id");
    
    const { data: courseData, error: courseError } = await supabase
      .from('courses')
      .select('*')
      .eq('id', course_id)
      .single();
    
    if (courseError || !courseData) throw new Error("Course not found");

    const environment = (courseData.environment || '').toLowerCase().includes('online') ? 'ONLINE' : 'LIVE';
    
    const course: Course = {
      ...courseData,
      environment
    };

    let result = "";

    // A. Structure / Legacy Steps (Global)
    if (step_type === 'course.steps.structure' || step_type === 'course_dna' || !module_id) {
       result = await handleLegacyStep(supabase, course, step_type, context, blueprint_duration, explicit_module_list);
    } 
    // B. Golden Path (Module Level Content)
    else {
      result = await handleGoldenStep(supabase, course, module_id, step_type);
    }

    return new Response(JSON.stringify({ content: result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    Logger.error("Main Handler Error", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// ==========================================
// 7. BUSINESS LOGIC HANDLERS
// ==========================================

function hasMinimalCourseDNA(course: Course): boolean {
  const dna = course.dna;
  if (!dna) return false;

  const firstProtagonistName = dna.narrativeUniverse?.protagonists?.[0]?.name;
  const lang = String(course.language || '').trim();

  if (!firstProtagonistName || String(firstProtagonistName).trim().length === 0) {
    return false;
  }

  if (!lang) {
    return false;
  }

  return true;
}

function inferProtagonistFromAudience(audienceDescription: string, language: string): { name: string; role: string } | null {
  const desc = (audienceDescription || '').toLowerCase();
  const lang = (language || '').toLowerCase();
  const isRo = lang.startsWith('ro') || lang.includes('roman');

  if (!desc) return null;

  // Operational / blue collar
  if (
    desc.includes('muncitor') ||
    desc.includes('linie de produc') ||
    desc.includes('depozit') ||
    desc.includes('factory') ||
    desc.includes('blue collar') ||
    desc.includes('operator')
  ) {
    return isRo
      ? { name: 'Marcela', role: 'operator în producție' }
      : { name: 'Marco', role: 'factory operator' };
  }

  // Sales / call center
  if (
    desc.includes('vânz') ||
    desc.includes('vanz') ||
    desc.includes('sales') ||
    desc.includes('account manager') ||
    desc.includes('call center') ||
    desc.includes('customer support') ||
    desc.includes('customer service')
  ) {
    return isRo
      ? { name: 'Andreea', role: 'manager de vânzări' }
      : { name: 'Andrea', role: 'sales manager' };
  }

  // Middle management
  if (
    desc.includes('manager') ||
    desc.includes('team leader') ||
    desc.includes('supervisor') ||
    desc.includes('middle management')
  ) {
    return isRo
      ? { name: 'Raluca', role: 'manager de echipă' }
      : { name: 'Alex', role: 'team lead' };
  }

  // Technical roles
  if (
    desc.includes('developer') ||
    desc.includes('inginer') ||
    desc.includes('engineer') ||
    desc.includes('it') ||
    desc.includes('programator')
  ) {
    return isRo
      ? { name: 'Cătălin', role: 'inginer software' }
      : { name: 'Chris', role: 'software engineer' };
  }

  return null;
}

function buildMandatoryContext(course: Course): string {
  const title = course.title || "Untitled Course";
  const audience = course.target_audience || "General Audience";
  const environment = course.environment || "LIVE";
  const objectives = course.learning_objectives || "Not specified.";
  const lang = course.language || "Romanian";
  
  // Calculate module count safely
  let moduleCount = 0;
  if (course.blueprint && Array.isArray(course.blueprint.modules)) {
      moduleCount = course.blueprint.modules.length;
  }
  
  let moduleListStr = "";
  if (course.blueprint && Array.isArray(course.blueprint.modules)) {
      moduleListStr = course.blueprint.modules.map((m: any, i: number) => `${i + 1}. ${m.title}`).join('\n');
  }

  // Use ENGLISH for meta-labels (LLM instructions), but the content variables are passed as is.
  // The LLM is instructed to generate output in the Target Language.
  return `
=== MANDATORY COURSE CONTEXT ===
1. Course Title: ${title}
2. Target Language: ${lang}
3. Target Audience: ${audience}
4. Delivery Environment: ${environment}
5. Module Count: ${moduleCount}
6. Module List:
${moduleListStr}
7. Learning Objectives:
${objectives}
================================
`.trim();
}

function extractModulesFromMarkdown(markdown: string): string[] {
  const modules: string[] = [];
  const lines = markdown.split('\n');
  let insideTable = false;
  
  for (const line of lines) {
    // Detect table start based on standard pipe characters, not specific headers
    if (line.trim().startsWith('|') && line.split('|').length > 3) {
      // Check if it's a header row or separator
      if (line.includes('---')) {
        insideTable = true;
        continue;
      }
      
      // If we are inside table (after separator)
      if (insideTable) {
         const parts = line.split('|').map(s => s.trim());
         // We assume "Topic" / "Subject" is usually the 3rd column (index 2) in our standard agenda structure
         // | Time | Topic | Method ...
         if (parts.length > 2) {
           const topic = parts[2];
           // Heuristic: ignore common header terms in various languages if they accidentally get parsed
           const lower = topic.toLowerCase();
           const ignoreTerms = ['topic', 'subiect', 'tema', 'subject', 'sujet', 'themen', 'asunto'];
           
           if (topic && !ignoreTerms.some(t => lower.includes(t)) && topic.length > 2) {
                const cleanTopic = topic.replace(/\*\*/g, '').replace(/\*/g, '').trim();
                modules.push(cleanTopic);
           }
         }
      }
    } else {
      if (insideTable && line.trim() === '') {
        insideTable = false;
      }
    }
  }
  return modules;
}

function isValidGoldenData(data: any): boolean {
  if (!data || typeof data !== 'object') return false;
  
  // 1. Check Root Fields
  const required = ['moduleId', 'moduleTitle', 'moduleDurationMinutes', 'environment', 'narrativeContext', 'sections', 'localizedLabels'];
  for (const field of required) {
    if (!(field in data)) return false;
  }
  
  // 2. Check Narrative Context
  if (!data.narrativeContext || typeof data.narrativeContext !== 'object') return false;
  // We don't strictly enforce protagonistName here if it's optional in some contexts, 
  // but for Golden Master it should be there.
  
  // 3. Check Sections
  if (!Array.isArray(data.sections) || data.sections.length === 0) return false;
  
  return true;
}

async function handleGoldenStep(
  supabase: any, 
  course: Course, 
  module_id: string, 
  step_type: string
): Promise<string> {
  
  const { data: moduleData, error: moduleError } = await supabase
    .from('course_modules')
    .select('*')
    .eq('id', module_id)
    .single();

  if (moduleError || !moduleData) throw new Error(`Module not found: ${module_id}`);

  if (!hasMinimalCourseDNA(course)) {
    Logger.warn('Course DNA is incomplete. Materials may be generic until DNA is refined.', {
      courseId: course.id,
      hasDna: !!course.dna
    });
  }

  const storyArc = await getOrCreateStoryArc(supabase, course, moduleData.module_index);
  const currentStoryStage = storyArc[module_id] || storyArc[moduleData.module_index] || "Protagonist applies the concepts.";

  const isDirty = (moduleData as any).is_dirty === true;

  let goldenData: GoldenModuleData | null = moduleData.content_data;

  // STRICT VALIDATION: Check if existing Golden Data is valid
  // If it's missing OR invalid, we MUST regenerate it before proceeding to any specific deliverable.
  const isInvalid = !isValidGoldenData(goldenData);
  const shouldRegenerate = isInvalid || isDirty;

  if (shouldRegenerate) {
    if (isInvalid && !isDirty) {
      Logger.info(`Golden Data is invalid or missing for Module: ${moduleData.title}. Triggering auto-generation.`);
    } else {
      Logger.info(`Generating Golden Data for Module: ${moduleData.title} (Dirty flag: true)`);
    }
    
    // ENSURE FRESH START: Explicitly nullify previous data to prevent any risk of concatenation
    goldenData = null; 

    let protagonistName = course.dna?.narrativeUniverse?.protagonists?.[0]?.name as string | undefined;

    if (!protagonistName || String(protagonistName).trim().length === 0) {
      const inferred = inferProtagonistFromAudience(course.target_audience || '', course.language || 'ro');
      if (inferred) {
        protagonistName = inferred.name;

        const currentDna: any = course.dna || {};
        const protagonists = currentDna.narrativeUniverse?.protagonists || [];
        const updatedDna = {
          terminology: currentDna.terminology || {
            participant: "Participant",
            trainer: "Trainer",
            exercise: "Exercise",
            mandatoryTerms: {}
          },
          narrativeUniverse: {
            ...(currentDna.narrativeUniverse || {}),
            protagonists: protagonists.length > 0
              ? [
                  {
                    ...protagonists[0],
                    name: inferred.name,
                    role: inferred.role || protagonists[0].role || ''
                  },
                  ...protagonists.slice(1)
                ]
              : [
                  {
                    name: inferred.name,
                    role: inferred.role,
                    personality: '',
                    arc: ''
                  }
                ]
          },
          voiceProfile: currentDna.voiceProfile || {
            formality: "professional",
            humorLevel: "none",
            forbiddenPhrases: [],
            signaturePhrases: []
          },
          masterTimeline: currentDna.masterTimeline || {
            totalDuration: 0,
            bufferPerModule: 0,
            modules: []
          }
        };

        try {
          await supabase
            .from('courses')
            .update({ dna: updatedDna })
            .eq('id', course.id);
          course.dna = updatedDna;
          Logger.info("Inferred protagonist stored into Course DNA.", { courseId: course.id });
        } catch (e: any) {
          Logger.warn("Failed to persist inferred Course DNA protagonist.", e);
        }
      }
    }

    if (!protagonistName || String(protagonistName).trim().length === 0) {
      protagonistName = "Alex";
    }

    const dna = course.dna || {};
    const bannedNamesFromDNA = Array.isArray(dna?.narrativeUniverse?.bannedNames)
      ? dna.narrativeUniverse.bannedNames
      : undefined;

    const knowledgeBase = await buildKnowledgeBaseContext(supabase, course.id, course.language || "Romanian");

    const mandatoryContext = buildMandatoryContext(course);

    const envConstraints = (course.environment || 'LIVE').toUpperCase() === 'ONLINE'
      ? `**ENVIRONMENT: ONLINE (VIRTUAL CLASSROOM - ZOOM/TEAMS)**
         - **INTERACTION**: Must use "Breakout Rooms", "Chat Polls", "Miro Board links", "Screen Share".
         - **CONSTRAINTS**: Max 10 min monologues (Zoom Fatigue). Frequent "Type in chat" prompts.
         - **MATERIALS**: PDFs, Digital Workbooks, Online Quizzes.
         - **ADAPTATION**: Ensure all activities are suitable for a virtual setting.
         - **LANGUAGE**: All instructions and content must be in the target language.`
      : `**ENVIRONMENT: LIVE (IN-PERSON WORKSHOP)**
         - **INTERACTION**: EXCLUSIVE face-to-face activities: "Turn to your neighbor", "Physical Flipcharts", "Room Movement", "Gallery Walk", "Role Play in room", "Group Discussions", "Physical Exercises".
         - **CONSTRAINTS**: 
           *   Standard attention spans. Physical handouts allowed.
           *   **FORBIDDEN**: DO NOT mention videos, webinars, online dashboards, virtual forums, zoom links, or screen sharing.
         - **MATERIALS**: Printed Workbooks, Sticky Notes, Markers, Flipchart paper.
         - **LANGUAGE**: All instructions and content must be in the target language.`;

    let prompt = fillPromptTemplate(GOLDEN_MASTER_PROMPT, {
      moduleTitle: moduleData.title,
      durationMinutes: moduleData.duration_minutes || 60, 
      environment: course.environment,
      envConstraints: envConstraints,
      language: course.language || "Romanian",
      protagonistName: protagonistName,
      protagonistState: currentStoryStage,
      targetAudience: course.target_audience || "General Audience",
      styleBlock: getStyleBlock(course.target_audience || "General Audience"),
      moduleId: module_id
    });

    // Inject mandatory context at the very beginning
    prompt = `${mandatoryContext}\n\n${prompt}`;
    
    // Add explicit instruction for language enforcement at the end of the prompt
    prompt += `\n\n**CRITICAL INSTRUCTION**: The output JSON content (titles, narratives, scripts, questions) MUST be in ${course.language || "Romanian"}. Do not output English unless the course language is English.`;

    // VERIFICATION LOG: Print the start of the prompt to confirm context injection
    Logger.info("--- FINAL PROMPT PREVIEW (First 500 chars) ---");
    Logger.info(prompt.substring(0, 500));
    Logger.info("------------------------------------------------");

    const approvedObjectives = String((course as any).learning_objectives || '').trim();
    if (approvedObjectives) {
      prompt = `${prompt}\n\n**User-approved objectives**:\n${approvedObjectives}\nAlign sections, exercises and examples with these objectives.`;
    }
    
    if (knowledgeBase.trim().length > 0) {
      const kbHeader = '### Knowledge Base Context (Uploaded Files)';
      prompt = `${prompt}\n\n${kbHeader}\n${knowledgeBase}`;
    }

    const rawJson = await callLLM(prompt, course.language || 'ro');
    const enforcedJson = ProtagonistEnforcer.enforce(rawJson, protagonistName, bannedNamesFromDNA);
    
    goldenData = repairAndParseJson<GoldenModuleData>(enforcedJson);

    // FINAL VALIDATION: Ensure the generated data is valid before saving
    if (!isValidGoldenData(goldenData)) {
      throw new Error("Generated Golden Master JSON failed validation check. Please try again.");
    }
    
    await supabase
      .from('course_modules')
      .update({ content_data: goldenData, is_dirty: false })
      .eq('id', module_id);
  }

  switch (step_type) {
    case 'course.steps.workbook':
      return renderToMarkdown(goldenData, 'WORKBOOK');
    case 'course.steps.manual':
      return renderToMarkdown(goldenData, 'MANUAL', mandatoryContext);
    case 'course.steps.exercises':
      return renderToMarkdown(goldenData, 'EXERCISES');
    case 'course.steps.slides':
      return renderToXml(goldenData);
    case 'course.steps.video_scripts':
      return renderToMarkdown(goldenData, 'VIDEO_SCRIPT');
    case 'course.steps.examples':
      return renderToMarkdown(goldenData, 'EXAMPLES');
    default:
      return renderToMarkdown(goldenData, 'WORKBOOK');
  }
}

async function getOrCreateStoryArc(supabase: any, course: Course, moduleIndex?: number): Promise<Record<string, string>> {
  if (course.story_arc && Object.keys(course.story_arc).length > 0) {
    return course.story_arc;
  }

  Logger.info(`Generating Story Arc for Course: ${course.title}`);

  const protagonist = course.dna?.narrativeUniverse?.protagonists?.[0];
  const name = protagonist?.name || "The Participant";
  const role = protagonist?.role || "Learner";
  const challenge = protagonist?.initial_state || "Beginner";

  const prompt = `
    **TASK**: Create a Narrative Arc for a course protagonist.
    **COURSE**: "${course.title}" (${course.target_audience})
    **PROTAGONIST**: ${name} (${role}), starting as "${challenge}".
    **GOAL**: Define the emotional/professional state of the protagonist for each module (1 to 10).
    **OUTPUT**: JSON { "1": "Initial confusion...", "2": "First small win...", ... }
    **LANGUAGE**: ${course.language}.
    Return ONLY JSON.
  `;

  try {
    const rawJson = await callLLM(prompt, course.language || 'ro');
    const storyArc = repairAndParseJson<Record<string, string>>(rawJson);

    await supabase
      .from('courses')
      .update({ story_arc: storyArc })
      .eq('id', course.id);

    return storyArc;
  } catch (e) {
    Logger.error("Failed to generate Story Arc, using default.", e);
    const lang = (course.language || '').toLowerCase();
    try {
      const fallbackPrompt = `
        **TASK**: Create a default Narrative Arc for a generic course participant.
        **COURSE TITLE**: "${course.title}"
        **LANGUAGE**: ${course.language || "English"}
        **GOAL**: Define the emotional/professional state of the participant for 8 modules.
        **OUTPUT**: JSON { "1": "...", "2": "...", "3": "...", "4": "...", "5": "...", "6": "...", "7": "...", "8": "..." }
        Return ONLY JSON in the specified language.
      `;
      const rawFallback = await callLLM(fallbackPrompt, course.language || 'ro');
      const arc = repairAndParseJson<Record<string, string>>(rawFallback);
      return arc;
    } catch (e2) {
      Logger.error("Fallback Story Arc generation also failed. Using static map.", e2);
    }
    
    // Final fallback if all LLM calls fail. Return English (system default).
    // The consuming prompts will handle translation/adaptation if necessary.
    return {
      "1": "Enthusiastic but overwhelmed by the new concepts.",
      "2": "Encountering the first major obstacle.",
      "3": "Beginning to understand the core logic.",
      "4": "Attempting to apply the knowledge, making mistakes.",
      "5": "Achieving the first small win.",
      "6": "Gaining confidence and flow.",
      "7": "Mastering the nuances.",
      "8": "Fully competent and ready to teach others."
    };
  }
}

async function buildKnowledgeBaseContext(
  supabase: any,
  courseId: string,
  language: string,
  maxFiles: number = 4,
  maxCharsPerFile: number = 2000
): Promise<string> {
  try {
    const { data, error } = await supabase
      .from('course_files')
      .select('filename, extracted_text, uploaded_at')
      .eq('course_id', courseId)
      .order('uploaded_at', { ascending: false })
      .limit(maxFiles);
    
    if (error || !data || data.length === 0) {
      return '';
    }

    const pieces: string[] = [];
    for (const f of data) {
      const title = f.filename || 'File';
      const text = String(f.extracted_text || '').trim();
      if (!text) continue;
      const truncated = text.length > maxCharsPerFile ? text.slice(0, maxCharsPerFile) + '...' : text;
      pieces.push(`- ${title}: ${truncated}`);
    }

    if (pieces.length === 0) return '';

    // Instruction is in English (System Language), but directs behavior for the Target Language.
    const guidance = `Use the context below to align examples, terminology and scenarios. Avoid contradictions. Target Language: ${language}`;

    return `${guidance}\n${pieces.join('\n')}`;
  } catch (e) {
    Logger.warn('Failed to build Knowledge Base Context', e);
    return '';
  }
}
async function handleLegacyStep(
  supabase: any, 
  course: Course, 
  step_type: string, 
  context: any,
  blueprintDuration: string = "8 hours",
  explicitModuleList: string = ""
): Promise<string> {
  
  const envSuffix = course.environment === 'ONLINE' ? 'online' : 'live';

  if (step_type === 'course_dna') {
      const prompt = `
      **TASK**: Create the "Course DNA" - the stylistic and pedagogical "soul" of the course.
      **COURSE**: "${course.title}"
      **TARGET AUDIENCE**: "${course.target_audience}"
      **ENVIRONMENT**: ${course.environment}
      **LANGUAGE**: ${course.language || "Romanian"}
      
      **GOAL**: Define the terminology, narrative universe, and learning philosophy.
      
      **OUTPUT FORMAT**:
      Strict JSON object with this structure:
      {
        "terminology": {
          "participant": "Term for learner (e.g. Participant, Student, Explorer)",
          "exercise": "Term for activity (e.g. Exercise, Challenge, Mission)",
          "trainer": "Term for instructor (e.g. Trainer, Facilitator, Guide)",
          "mandatoryTerms": {}
        },
        "narrativeUniverse": {
          "protagonists": [
             { "name": "Name", "role": "Role", "initial_state": "Starting mindset" }
          ],
          "setting": "Where does this take place? (e.g. Corporate Office, Start-up, Factory)",
          "tone": "Voice/Tone (e.g. Professional, Playful, Strict)"
        },
        "learningPhilosophy": {
          "manifesto": ["Principle 1", "Principle 2"],
          "rules_of_engagement": ["Rule 1", "Rule 2"]
        }
      }
      
      **IMPORTANT**: Return ONLY valid JSON. The content MUST be in ${course.language || "Romanian"}.
      `;
      
      try {
        Logger.info(`[LegacyStep] Invoking LLM for CourseDNA...`);
        const response = await callLLM(prompt, course.language || 'ro');
        Logger.info(`[LegacyStep] CourseDNA LLM Response received (length: ${response.length})`);
        return response;
      } catch (e: any) {
        Logger.error(`[LegacyStep] CourseDNA LLM Failed:`, e);
        throw e;
      }
  }

  if (step_type === 'course.steps.structure' || step_type === 'structure') {
     let modulesList = "";
     if (!explicitModuleList || String(explicitModuleList).trim().length === 0) {
       const mods = (course.blueprint && Array.isArray(course.blueprint.modules)) ? course.blueprint.modules : [];
       if (mods.length > 0) {
         const lines = mods.map((m: any, i: number) => `${i + 1}. ${m.title}`).join('\n');
         modulesList = `\n${lines}\n`;
       }
     }
     const approvedObjectives = String((course as any).learning_objectives || '').trim();
     const lang = course.language || "Romanian";
     
     const blueprintBlock = (explicitModuleList && String(explicitModuleList).trim().length > 0)
       ? `\n**APPROVED BLUEPRINT (supreme source of truth)**:\n${explicitModuleList}\n`
       : (modulesList ? `\n**APPROVED BLUEPRINT (supreme source of truth)**:\n${modulesList}\n` : '');
     const objectivesBlock = approvedObjectives
       ? `\n**User-approved objectives**:\n${approvedObjectives}\n`
       : '';
     
     const envConstraint = (course.environment || 'LIVE').toUpperCase() === 'ONLINE'
        ? "ONLINE (VIRTUAL)"
        : "LIVE (IN-PERSON)";

     const prompt = `
        **TASK**: Design the Course Structure & Agenda.
        **TARGET LANGUAGE**: ${lang} (ALL OUTPUT MUST BE IN THIS LANGUAGE)
        **ENVIRONMENT**: ${envConstraint}
        ${blueprintBlock}${objectivesBlock}
        
        **INSTRUCTIONS**:
        1. Generate exactly 4-6 concise objectives in the form "By the end, participants will be able to..." (translated to ${lang}).
        2. **GOLDEN RULE**: If specific data is missing, INVENT realistic and plausible values for the context (e.g., "15% increase" not "X% increase"). Be concrete. NO PLACEHOLDERS like "X%", "Y dollars".
        3. Build the minute-by-minute agenda table.
        4. Respect the environment constraints (e.g. Breakout Rooms for Online, Physical activities for Live).
        
        **CONSTRAINTS**:
        - Do not exceed 1000 words.
        - No introductions or conclusions.
        - Telegraphic style, 1-2 sentences per cell.
        - Each agenda row must support at least one objective.
        - Use 10-30 minute blocks.
        - **STRICTLY FORBIDDEN**: Never use placeholders like "X%", "Y dollars", "Z clients".

        **OUTPUT FORMAT**:
        Return ONLY Markdown.
        
        # [Course Title in ${lang}]
        
        ### [Objectives Header in ${lang}]
        - ...
        - ...
        
        ### [Agenda Header in ${lang}]
        | Time | Topic | Method | Material | Trainer Action | Activity Objective | Participant Action | On-the-job Benefit |
        | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
        | 09:00 - 09:15 | [Topic in ${lang}] | [Method in ${lang}] | [Material in ${lang}] | ... | ... | ... | ... |
     `;
     
     const rawResponse = await callLLM(prompt, course.language || 'ro');

     // EXTRACT AND SAVE MODULES
     try {
        const extractedModules = extractModulesFromMarkdown(rawResponse);

        if (extractedModules.length > 0) {
          Logger.info(`Extracted ${extractedModules.length} modules from generated Agenda. Updating Blueprint...`);
          
          const currentBlueprint = course.blueprint || {};
          // Map to minimal module structure
          const newModules = extractedModules.map(title => ({ 
            title, 
            sections: [], // Initialize empty sections
            duration: "45 min" // Default
          }));
          
          const updatedBlueprint = {
            ...currentBlueprint,
            modules: newModules
          };

          // Update DB
          await supabase
            .from('courses')
            .update({ blueprint: updatedBlueprint })
            .eq('id', course.id);
            
          // Update local course object reference just in case
          course.blueprint = updatedBlueprint;
        } else {
          Logger.warn("Could not extract modules from Agenda markdown.");
        }
     } catch (e) {
       Logger.error("Failed to extract/save modules from Agenda", e);
     }

     return rawResponse; // Return Markdown directly
  }

  if (step_type === 'course.steps.performance_objectives' || step_type === 'performance_objectives') {
    const prompt = `
    **TASK**: Define 5-7 High-Level Performance Objectives.
    **COURSE**: "${course.title}"
    **LANGUAGE**: ${course.language}
    
    **CONSTRAINT**: 
    - Output EXACTLY 5-7 bullet points.
    - Be concise and action-oriented.
    - NO introductory text. NO closing text.
    - DO NOT categorize (e.g. Verbal, Non-verbal). Just a single list of the most critical skills.
    `;
    return await callLLM(prompt, course.language || 'ro');
  }

  if (step_type === 'course.steps.course_objectives' || step_type === 'course_objectives') {
    const prompt = `
    **TASK**: Write a concise Course Goal Statement.
    **COURSE**: "${course.title}"
    **LANGUAGE**: ${course.language}
    
    **CONSTRAINT**: 
    - Output a single paragraph (max 3-4 sentences) summarizing the main goal.
    - NO bullet points.
    - NO repetition of performance objectives.
    `;
    return await callLLM(prompt, course.language || 'ro');
  }

  if (step_type === 'course.steps.timing_and_flow' || step_type === 'timing_and_flow') {
      const prompt = `
      **TASK**: Provide brief Pacing & Flow Tips.
      **COURSE**: "${course.title}"
      **LANGUAGE**: ${course.language}
      
      **CONSTRAINT**: 
      - Max 3-5 tips on how to manage the energy and flow of this course.
      - Do NOT repeat the agenda/schedule.
      `;
      return await callLLM(prompt, course.language || 'ro');
  }

  if (step_type === 'course.steps.slides' || step_type === 'slides') {
      let moduleListStr = "";
      if (course.blueprint && Array.isArray(course.blueprint.modules)) {
          moduleListStr = course.blueprint.modules.map((m: any, i: number) => `${i + 1}. ${m.title}`).join('\n');
      }

      const prompt = `
      **TASK**: Create a Course Kick-off Presentation (Slide Deck).
      **COURSE**: "${course.title}"
      **TARGET LANGUAGE**: ${course.language} (ALL OUTPUT MUST BE IN THIS LANGUAGE)
      **CONTEXT**: ${course.description}
      
      **COURSE OUTLINE (MODULES)**:
      ${moduleListStr}

      **GOAL**: A sequence of 8-12 slides to introduce the course, objectives, and structure to the participants.
      
      **OUTPUT FORMAT**: 
      Markdown with clear slide delimiters.
      
      **TEMPLATE PER SLIDE**:
      ## Slide [N]: [Title in ${course.language}]
      **Visual Description:** [Instruction for designer/AI in English or ${course.language}]
      **Key Points:**
      - [Bullet 1 in ${course.language}]
      - [Bullet 2 in ${course.language}]
      - [Bullet 3 in ${course.language}]
      **Speaker Notes:** [What the trainer says - conversational and engaging in ${course.language}]
      
      **REQUIRED SLIDES**:
      1. Title Slide
      2. Welcome & Icebreaker
      3. Why this course? (WIIFM - What's in it for me?)
      4. Key Learning Objectives (Summarized)
      5. High-level Agenda/Roadmap (Use the COURSE OUTLINE provided above)
      6. Rules of Engagement / Logistics
      7-11. Brief intro to key modules (1 slide per major topic from the OUTLINE)
      12. Closing & Q&A
      `;
      return await callLLM(prompt);
  }


  const mandatoryContext = buildMandatoryContext(course);
  
  const prompt = `
    Generate content for ${step_type} for course "${course.title}".
    Language: ${course.language}.
    
    ${mandatoryContext}
    
    Context: ${context || "None"}.
  `;
  return await callLLM(prompt);
}

async function handleAnalyzeUpload(content: string, fileName: string, environment: string): Promise<string> {
  if (content.length < 100000) {
    const safeContent = content.substring(0, 100000);
    const prompt = `
    **TASK**: Analyze the uploaded course material and create a comprehensive Course Blueprint.
    **INPUT**: 
    File Name: ${fileName}
    Content Snippet: ${safeContent}
    Target Environment: ${environment}

    **GOAL**: Extract the structure and learning objectives to create a valid JSON Blueprint with modules and sections that can be used directly to generate course content.
    **IMPORTANT**: The output language MUST be the same as the INPUT content language. If the input is in Romanian, the JSON values (titles, descriptions, objectives) MUST be in Romanian.

    **OUTPUT FORMAT**:
    Strict JSON object with this structure:
    {
      "title": "Course Title",
      "target_audience": "Who is this for?",
      "description": "Course description",
      "modules": [
        {
          "title": "Module 1 Title",
          "duration": "45 min",
          "learning_objective": "By the end of this module, participants will...",
          "sections": [
            {
              "title": "Section 1 Title",
              "content_type": "theory | exercise | quiz | reflection | video_script | summary",
              "estimated_duration": "10-20 min",
              "goal": "What this section achieves"
            }
          ]
        }
      ]
    }
    
    Each module MUST have at least 3 sections with non-empty titles and content_type.
    Return ONLY valid JSON. Do not include markdown formatting.
    `;
    return await callLLM(prompt);
  }

  Logger.info(`Large document detected (${content.length} chars). Engaging Chunking Strategy.`);
  
  const CHUNK_SIZE = 50000; // ~12k tokens
  const chunks = [];
  for (let i = 0; i < content.length; i += CHUNK_SIZE) {
    chunks.push(content.substring(i, i + CHUNK_SIZE));
  }

  // Limit chunks to avoid timeouts (max 20 chunks = 1M chars covered)
  // If > 20 chunks, we take first 5, middle 5, last 5
  let selectedChunks = chunks;
  if (chunks.length > 20) {
    const first = chunks.slice(0, 5);
    const last = chunks.slice(-5);
    const middleStart = Math.floor(chunks.length / 2) - 2;
    const middle = chunks.slice(middleStart, middleStart + 5);
    selectedChunks = [...first, ...middle, ...last];
    Logger.warn(`Document extremely large. Sampling ${selectedChunks.length} chunks out of ${chunks.length}.`);
  }

  // Step 1: Summarize Chunks (Parallel)
  const summarizePromises = selectedChunks.map(async (chunk, index) => {
    const chunkPrompt = `
      **TASK**: Analyze this segment (Part ${index + 1}) of a large course document.
      **GOAL**: Extract key pedagogical topics, potential module titles, and specific learning points.
      **CONTENT**: ${chunk.substring(0, 50000)}...

      **OUTPUT**: A concise bulleted summary. Focus on STRUCTURE and KEY CONCEPTS.
    `;
    try {
      return await callLLM(chunkPrompt);
    } catch (e) {
      Logger.error(`Failed to summarize chunk ${index}`, e);
      return ""; // Skip failed chunks
    }
  });

  const summaries = await Promise.all(summarizePromises);
  const masterSummary = summaries.join("\n\n=== NEXT SEGMENT ===\n\n");

  // Step 2: Final Blueprint Generation from Summaries
  const masterPrompt = `
    **TASK**: Create a Master Course Blueprint based on these document summaries.
    **INPUT**: 
    File Name: ${fileName}
    Target Environment: ${environment}
    
    **DOCUMENT SUMMARIES**:
    ${masterSummary}

    **GOAL**: Synthesize the summaries into a cohesive course structure.
    **IMPORTANT**: The output language MUST be the same as the INPUT content language.
    
    **OUTPUT FORMAT**:
    Strict JSON object with this structure:
    {
      "title": "Course Title",
      "target_audience": "Who is this for?",
      "description": "Course description",
      "modules": [
        {
          "title": "Module 1 Title",
          "duration": "45 min",
          "learning_objective": "By the end of this module, participants will...",
          "sections": [
            {
              "title": "Section 1 Title",
              "content_type": "theory | exercise | quiz | reflection | video_script | summary",
              "estimated_duration": "10-20 min",
              "goal": "What this section achieves"
            }
          ]
        }
      ]
    }
    
    Each module MUST have at least 3 sections with non-empty titles and content_type.
    Return ONLY valid JSON.
  `;

  return await callLLM(masterPrompt);
}

async function handleFillGaps(blueprint: any, existingContent: string, environment: string): Promise<string> {
    const prompt = `
    **TASK**: Identify content gaps in the imported course material based on the Blueprint and Target Environment.
    **ENVIRONMENT**: ${environment}
    **BLUEPRINT**: ${JSON.stringify(blueprint).substring(0, 5000)}
    **EXISTING CONTENT**: ${existingContent.substring(0, 5000)}... (truncated)

    **GOAL**: Recommend additional modules or content types that are missing but essential for a complete course in this environment.
    **IMPORTANT**: The output language MUST be the same as the INPUT content language.
    
    **OUTPUT**:
    Strict JSON object:
    {
      "gaps": [
        {
          "type": "quiz | exercise | summary | video_script",
          "description": "Description of what is missing and why it is needed."
        }
      ]
    }
    
    Return ONLY valid JSON.
    `;

    return await callLLM(prompt);
}

async function handleCompleteSectionsForImport(blueprint: any, environment: string, languageHint?: string): Promise<string> {
  const lang = languageHint || 'Romanian';
  const prompt = `
  **TASK**: Ensure that every module in the Course Blueprint has a well-defined list of sections.
  **ENVIRONMENT**: ${environment}
  **BLUEPRINT**: ${JSON.stringify(blueprint).substring(0, 5000)}

  **LANGUAGE INSTRUCTION**: 
  The provided Blueprint modules are likely in "${lang}". 
  HOWEVER, if they appear to be in another language, YOU MUST DETECT IT and generate the new content in that SAME language.
  Do not mix languages.

  **GOAL**:
  - For each module, if "sections" is missing, null or empty, generate 3-7 sections.
  - If sections exist but are incomplete, fix them (fill missing fields).

  Each section must have:
  - "title": concise, clear, in the detected language of the module
  - "content_type": one of "theory", "exercise", "quiz", "reflection", "video_script", "summary"
  - "estimated_duration": short text like "10-15 min"
  - "goal": what the participant will achieve in this section

  **OUTPUT FORMAT**:
  Return the full Blueprint JSON with the same top-level structure, but with modules[].sections[] completed as described above.

  Return ONLY valid JSON. Do not include markdown or explanations.
  `;

  return await callLLM(prompt);
}

async function handleChatOnboarding(chat_history: any[], course: any): Promise<string> {
    const conversation = chat_history.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n');
    const lang = course.language || 'Romanian';
    
    // ----------------------------------------------------------------------------
    // PHASE 1: CONVERSATION ANALYST (Is the user done?)
    // ----------------------------------------------------------------------------
    // Solution to "Prompt Overload" (Problem #2)
    // Split the logic: First determine IF we are ready, THEN generate.
    
    const analystPrompt = `
    **ROLE**: Course Requirements Analyst.
    **TASK**: Analyze the conversation to see if we have enough info to build a course blueprint.
    **CONTEXT**: 
    Course Title: ${course.title}
    Language: ${lang}
    
    **CONVERSATION HISTORY**:
    ${conversation}
    
    **REQUIREMENTS FOR BLUEPRINT**:
    1. Target Audience (Who is this for?)
    2. Learning Objectives (What will they learn?)
    3. Scope/Duration (Rough estimate or depth)

    **DECISION LOGIC**:
    - IF information is missing: Generate a polite, short question in ${lang} to ask for it.
    - IF information is sufficient: Set status to "READY" and summarize the gathered requirements.
    - **CRITICAL**: If the user says "Am toate informațiile necesare" or similar confirmation, set status to "READY" IMMEDIATELY.
    - **CRITICAL**: If the conversation history shows the user has already provided Audience, Objectives, and Duration, DO NOT ASK AGAIN. Set status to "READY".

    **OUTPUT FORMAT (JSON ONLY)**:
    {
      "status": "READY" | "NEEDS_INFO",
      "message": "Your question to the user (if NEEDS_INFO) or a confirmation message (if READY)",
      "gathered_requirements": {
         "audience": "...",
         "objectives": "...",
         "duration": "..."
      }
    }
    
    Return ONLY valid JSON.
    `;

    Logger.info("Step 1: Running Conversation Analyst...");
    const rawAnalyst = await callLLM(analystPrompt, lang);
    Logger.info("Step 1: Raw Analyst Response", rawAnalyst);
    let analystData;
    
    try {
        analystData = repairAndParseJson<{status: string, message: string, gathered_requirements: any}>(rawAnalyst);
        Logger.info("Step 1: Parsed Analyst Data", analystData);
    } catch (e) {
        Logger.error("Failed to parse Analyst response", e);
        // Fallback: Assume we need more info if AI failed to format correctly
        return JSON.stringify({
            message: "Îmi poți da te rog mai multe detalii despre audiența țintă și obiective?",
            blueprint: null
        });
    }

    if (analystData?.status !== 'READY') {
        Logger.info("Analyst Status: NEEDS_INFO");
        return JSON.stringify({
            message: analystData?.message || "Could you provide more details about the target audience?",
            blueprint: null
        });
    }

    // ----------------------------------------------------------------------------
    // PHASE 2: BLUEPRINT ARCHITECT (Generate the structure)
    // ----------------------------------------------------------------------------
    Logger.info("Analyst Status: READY. Running Blueprint Architect...");
    
    const architectPrompt = `
    **ROLE**: Expert Instructional Designer.
    **TASK**: Generate a detailed Course Blueprint JSON based on gathered requirements.
    **LANGUAGE**: ${lang}
    
    **REQUIREMENTS**:
    ${JSON.stringify(analystData.gathered_requirements, null, 2)}
    
    **PEDAGOGICAL STRUCTURE RULES**:
    - Create a logical flow of modules.
    - Each module must have 3-5 sections (Hook, Theory, Practice, Review).
    - Mix content types (slides, video_script, exercise, quiz).
    - **Language**: All titles and content must be in **${lang}**.
    
    **OUTPUT FORMAT (JSON ONLY)**:
    {
      "title": "Refined Title",
      "target_audience": "...",
      "estimated_duration": "...",
      "modules": [
          {
            "title": "Module Title",
            "duration": "...",
            "learning_objective": "...",
            "sections": [
              { "title": "Section Title", "content_type": "slides" }
            ]
          }
      ]
    }
    
    Return ONLY valid JSON.
    `;

    const rawBlueprint = await callLLM(architectPrompt, lang);
    let blueprintData;
    try {
        blueprintData = repairAndParseJson(rawBlueprint);
    } catch (e) {
        Logger.error("Failed to parse Blueprint", e);
        return JSON.stringify({
            message: "Am întâmpinat o eroare tehnică la generarea structurii. Te rog să mai încerci o dată.",
            blueprint: null
        });
    }

    // Combine for the final return
    return JSON.stringify({
        message: analystData.message, 
        blueprint: blueprintData
    });
}

function fillPromptTemplate(template: string, variables: Record<string, any>): string {
  let output = template;
  for (const [key, value] of Object.entries(variables)) {
    output = output.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
  }
  return output;
}

// ==========================================
// 8. PROTAGONIST ENFORCER (CRITICAL FIX)
// ==========================================

export class ProtagonistEnforcer {
  private static DEFAULT_BANNED_NAMES = [
    'ion', 'maria', 'ana', 'bogdan', 'vasile', 'elena', 
    'andrei', 'mihai', 'alexandru', 'ioana', 'george'
  ];

  private static getEffectiveBannedNames(override?: string[]): string[] {
    const normalizedOverride = (override || [])
      .map(name => String(name || '').trim().toLowerCase())
      .filter(name => name.length > 0);

    if (normalizedOverride.length > 0) {
      return normalizedOverride;
    }

    return this.DEFAULT_BANNED_NAMES;
  }

  static enforce(content: string, protagonistName: string, bannedNamesOverride?: string[]): string {
    const lowerProtagonist = protagonistName.toLowerCase();
    const bannedNames = this.getEffectiveBannedNames(bannedNamesOverride);
    
    // Find and replace banned names
    let fixedContent = content;
    let modified = false;

    bannedNames.forEach(bannedName => {
      // Don't ban the protagonist if their name happens to be in the banned list
      if (bannedName === lowerProtagonist) return;

      // Regex to find whole words, case insensitive
      const regex = new RegExp(`\\b${bannedName}\\b`, 'gi');
      
      if (regex.test(fixedContent)) {
        Logger.warn(`[ProtagonistEnforcer] Found banned name: ${bannedName}. Replacing with ${protagonistName}.`);
        fixedContent = fixedContent.replace(regex, protagonistName);
        modified = true;
      }
    });

    if (modified) {
        Logger.info(`[ProtagonistEnforcer] Content auto-corrected.`);
    }

    return fixedContent;
  }
}
