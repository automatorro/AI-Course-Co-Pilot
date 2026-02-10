// ==========================================
// GENERATED BUNDLE: generate-course-content
// VERSION: v3.0-MODULAR
// ARCHITECTURE: Class-based, Multi-Provider, Resilient
// ==========================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

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

// Helper wrapper for existing business logic
async function callLLM(prompt: string): Promise<string> {
  return await orchestrator.execute(prompt);
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

export const GOLDEN_MASTER_PROMPT = `
You are an expert **Instructional Designer** and **JSON Data Architect**.
Your task is to generate a single, comprehensive "Golden JSON" object for a specific training module.
This JSON will be the Single Source of Truth for generating 7 distinct deliverables (Workbook, Manual, Slides, etc.).

**CRITICAL META-INSTRUCTION**:
- You are a **CONTENT GENERATOR**, NOT a chatbot.
- **NEVER** ask the user for more information.
- If any input context (like Target Audience or Duration) is missing or vague, **IMPROVISE** and make reasonable assumptions based on the Course Title "{{moduleTitle}}".
- **DO NOT** output conversational text like "Here is the JSON" or "I need more info". Output **ONLY** the JSON.

### 1. INPUT CONTEXT
- **Module Title**: {{moduleTitle}}
- **Duration**: {{durationMinutes}} minutes (STRICT)
- **Environment**: {{environment}} (LIVE = In-Person Workshop | ONLINE = Virtual/Zoom)
- **Language**: {{language}} (Target language for ALL content)
- **Protagonist**: {{protagonistName}} (Current State: {{protagonistState}})
- **Target Audience**: {{targetAudience}}

### 2. CRITICAL RULES (NON-NEGOTIABLE)
1.  **JSON ONLY**: Your output must be a VALID JSON object. Do not include markdown formatting fences (like \`\`\`json). Do not include conversational text before or after the JSON.
2.  **BLUEPRINT INTEGRITY**: You MUST respect the Module Title and Duration provided in the input. Do not invent new modules.
3.  **NARRATIVE ISOLATION**:
    - The character "{{protagonistName}}" exists ONLY in the \`narrativeContext\` and \`theoryContent.hook\` fields.
    - Do NOT mention "{{protagonistName}}" in the \`trainerInstructions\`, \`exercisesDetailed\` (unless as a case study subject), or \`logistics\`.
    - The Trainer Manual should sound professional and instructional, NOT like a storybook.
4.  **ENVIRONMENT ADAPTATION**:
    - IF environment == 'LIVE':
      - Generate \`flipchartSketch\` instructions (What to draw on paper).
      - Generate physical activities (standing up, moving rooms).
      - \`videoScript\` MUST be null.
      - \`breakoutRoomConfig\` MUST be null.
    - IF environment == 'ONLINE':
      - Generate \`breakoutRoomConfig\` (Zoom/Teams setup).
      - Generate \`videoScript\` (for self-paced segments).
      - \`flipchartSketch\` MUST be null.
535→5.  **LANGUAGE CONSISTENCY**:
536→    - All generated content (Theory, Scripts, Slides, Exercises, Manuals) must be strictly in **{{language}}**.
537→    - Field names (keys) remain in English (e.g., \`participantContent\`), but ALL string values, content, titles, and instructions must be in {{language}}.
538→    - Do NOT mix languages. If {{language}} is 'Romanian', use ONLY Romanian.
539→
540→### 3. CONTENT GUIDELINES
- **Theory (Workbook)**: Use Markdown inside string fields. Use bolding (**text**) for emphasis. Be concise. Action-oriented.
- **Trainer Script**: Write VERBATIM what the trainer should say. Casual, professional, engaging. NO "Hello everyone". Start directly with the hook.
- **Slides**:
    - \`visualDescription\`: Instructions for a designer (e.g., "Photo of a frustrated manager...").
    - \`speakerNotes\`: Match the Trainer Script.
- **Exercises**:
    - Step-by-step instructions.
    - Clear "Success Indicators" (How do we know they got it right?).

### 4. JSON STRUCTURE (SCHEMA)
You must strictly follow this TypeScript interface structure:

\`\`\`typescript
interface GoldenModuleData {
  moduleId: string; // Use "{{moduleId}}"
  moduleTitle: string; // Use "{{moduleTitle}}"
  moduleDurationMinutes: number; // Use {{durationMinutes}}
  environment: "{{environment}}";

  narrativeContext: {
    protagonistName: string;
    storyArcStage: string; // "{{protagonistState}}"
    contextDescription: string; // Context for this specific module
    examplesLibrary: Array<{
      id: string;
      title: string;
      storyContent: string; // The example story
      applicationContext: string; // When to use it
    }>;
  };

  sections: Array<{
    id: string; // e.g., "section-1"
    title: string;
    durationMinutes: number;
    type: 'THEORY' | 'ACTIVITY' | 'DISCUSSION' | 'VIDEO_LESSON';

    participantContent: {
      theoryMarkdown: string; // Rich text in {{language}}
      keyTakeaways: string[];
      reflectionQuestions?: string[];
      actionableSteps?: string[];
    };

    trainerInstructions: {
      deliveryMethod: string;
      script: string; // Verbatim script in {{language}}
      logistics: string[];
      // LIVE ONLY
      flipchartSketch?: {
        title: string;
        visualDescription: string;
        bulletPoints: string[];
      };
      // ONLINE ONLY
      breakoutRoomConfig?: {
        groupSize: number;
        duration: number;
        taskDescription: string;
      };
    };

    visuals: {
      slidesSequence: Array<{
        slideId: string;
        layout: 'TITLE' | 'BULLETS' | 'VISUAL_FOCUS' | 'QUOTE';
        title: string;
        visualDescription: string; // English description for AI image gen
        contentBullets: string[];
        speakerNotes: string;
      }>;
    };

    // ONLY IF type == 'ACTIVITY' or 'DISCUSSION'
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

    // ONLY IF environment == 'ONLINE' AND type == 'VIDEO_LESSON'
    videoScript?: {
      sceneDescription: string;
      scriptContent: string;
      visualOverlays: Array<{ timestamp: string; description: string }>;
    };
  }>;
}
\`\`\`

### 5. THINKING PROCESS (Internal Monologue)
Before generating the JSON, plan the logical flow:
1.  **Analyze**: What is the core skill in {{moduleTitle}}?
2.  **Story Arc**: How does {{protagonistName}} encounter this problem in state "{{protagonistState}}"?
3.  **Consistency Check**: Ensure the Trainer Script matches the Workbook Theory.
4.  **Timing**: Ensure section durations sum up to exactly {{durationMinutes}} minutes.

GENERATE THE JSON NOW.
`;

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
    - **INTERACTION**: "Turn to your neighbor", "Physical Flipcharts", "Room Movement", "Gallery Walk".
    - **CONSTRAINTS**: Standard attention spans. Physical handouts allowed.
    - **MATERIALS**: Printed Workbooks, Sticky Notes, Markers.
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

export const renderToMarkdown = (data: GoldenModuleData, target: RenderTarget): string => {
  let output = '';

  // 1. Header Global
  output += `# ${data.moduleTitle}\n`;
  output += `**Duration:** ${data.moduleDurationMinutes} min | **Format:** ${data.environment}\n\n`;

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
  let md = `### Theory & Concepts\n\n`;
  
  md += `${content.theoryMarkdown}\n\n`;

  if (content.keyTakeaways && content.keyTakeaways.length > 0) {
    md += `### 🔑 Key Takeaways\n`;
    content.keyTakeaways.forEach(pt => md += `- ${pt}\n`);
    md += `\n`;
  }

  if (content.actionableSteps && content.actionableSteps.length > 0) {
    md += `### 🚀 Action Plan\n`;
    content.actionableSteps.forEach((step, i) => md += `${i + 1}. ${step}\n`);
    md += `\n`;
  }

  if (content.reflectionQuestions && content.reflectionQuestions.length > 0) {
    md += `### 🤔 Reflection\n`;
    content.reflectionQuestions.forEach(q => md += `> **Question:** ${q}\n\n*(Write your answer here)*\n\n\n`);
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

  const storyArc = await getOrCreateStoryArc(supabase, course, moduleData.module_index);
  const currentStoryStage = storyArc[module_id] || storyArc[moduleData.module_index] || "Protagonist applies the concepts.";

  let goldenData: GoldenModuleData | null = moduleData.content_data;

  if (!goldenData) {
    Logger.info(`Generating Golden Data for Module: ${moduleData.title}`);
    
    const prompt = fillPromptTemplate(GOLDEN_MASTER_PROMPT, {
      moduleTitle: moduleData.title,
      durationMinutes: moduleData.duration_minutes || 60, 
      environment: course.environment,
      language: course.language || "Romanian",
      protagonistName: course.dna?.narrativeUniverse?.protagonists?.[0]?.name || "Alex",
      protagonistState: currentStoryStage,
      targetAudience: course.target_audience || "General Audience",
      moduleId: module_id
    });

    const rawJson = await callLLM(prompt);
    
    goldenData = repairAndParseJson<GoldenModuleData>(rawJson);
    
    await supabase
      .from('course_modules')
      .update({ content_data: goldenData })
      .eq('id', module_id);
  }

  switch (step_type) {
    case 'course.steps.workbook':
      return renderToMarkdown(goldenData, 'WORKBOOK');
    case 'course.steps.manual':
      return renderToMarkdown(goldenData, 'MANUAL');
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
    const rawJson = await callLLM(prompt);
    const storyArc = repairAndParseJson<Record<string, string>>(rawJson);

    await supabase
      .from('courses')
      .update({ story_arc: storyArc })
      .eq('id', course.id);

    return storyArc;
  } catch (e) {
    Logger.error("Failed to generate Story Arc, using default.", e);
    return {};
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
        const response = await callLLM(prompt);
        Logger.info(`[LegacyStep] CourseDNA LLM Response received (length: ${response.length})`);
        return response;
      } catch (e: any) {
        Logger.error(`[LegacyStep] CourseDNA LLM Failed:`, e);
        throw e;
      }
  }

  if (step_type === 'course.steps.structure') {
     const prompt = `
        **TASK**: Design the Course Structure (High-Level Architecture).
        **GOAL**: Create a Table of Contents (TOC) as a JSON Array.
        **LANGUAGE**: ${course.language}.
        **ENVIRONMENT**: ${course.environment}.

        ${explicitModuleList ? `
        **💎 OFFICIAL BLUEPRINT (SUPREME SOURCE OF TRUTH)**:
        The user has approved the following structure. You MUST follow this EXACT list of modules. 
        DO NOT ADD, REMOVE, OR REORDER MODULES.
        DO NOT CHANGE THE TITLES.
        
        **REQUIRED MODULES**:
        ${explicitModuleList}
        ` : ''}

        **WHAT TO INCLUDE FOR EACH MODULE**:
        - Title (Clear and engaging)
        - Duration (e.g., "45 min")
        - Description (Brief overview of what will be covered)
        - Key Topics (Bullet points of sub-topics/lessons)

        **CRITICAL: REALISTIC TIMING RULES**:
        - When assigning durations (e.g. "30 min"), assume ONLY 60-70% is content delivery.
        - The rest is "Reality Buffer" (Questions, Transitions, Setup).

        **OUTPUT FORMAT**: 
        Strict JSON Array of Objects. No Markdown formatting around the JSON.
        Example:
        [
          {
            "title": "Module 1: Introduction",
            "duration": "45 min",
            "description": "Overview of the core concepts...",
            "topics": ["Topic A", "Topic B"]
          }
        ]
     `;
     
     const rawResponse = await callLLM(prompt);
     
     try {
       // 1. Parse JSON
       const structureData = repairAndParseJson<Array<{
         title: string; 
         duration: string; 
         description: string;
         topics?: string[];
       }>>(rawResponse);

       // 2. Save to DB (Populate course_modules)
       Logger.info(`Saving ${structureData.length} modules to DB for course ${course.id}`);
       
       // Clean up existing modules to avoid duplicates (Regeneration Scenario)
       await supabase.from('course_modules').delete().eq('course_id', course.id);

       const modulesToInsert = structureData.map((mod, index) => {
         // Parse duration string to integer
         const durationMatch = (mod.duration || "").match(/(\d+)/);
         const durationInt = durationMatch ? parseInt(durationMatch[1], 10) : 60;

         return {
           course_id: course.id,
           module_index: index + 1,
           title: mod.title,
           duration_minutes: durationInt,
           description: mod.description
           // Note: 'content_data' remains null until the Golden Step is triggered
         };
       });

       const { error: insertError } = await supabase
         .from('course_modules')
         .insert(modulesToInsert);

       if (insertError) {
         Logger.error("Failed to insert modules:", insertError);
       }

       // 3. Render to Markdown for UI
       const markdownOutput = structureData.map((mod, i) => {
         const topicsList = (mod.topics || []).map(t => `- ${t}`).join('\n');
         return `## Module ${i + 1}: ${mod.title} (${mod.duration})\n\n${mod.description}\n\n**Key Topics:**\n${topicsList}`;
       }).join('\n\n---\n\n');

       return markdownOutput;

     } catch (e) {
       Logger.error("Structure parsing failed:", e);
       return rawResponse;
     }
  }
  
  const prompt = `
    Generate content for ${step_type} for course "${course.title}".
    Language: ${course.language}.
    Context: ${context || "None"}.
  `;
  return await callLLM(prompt);
}

async function handleAnalyzeUpload(content: string, fileName: string, environment: string): Promise<string> {
    // Truncate content to safe limit for 8k models (approx 20k chars is ~5k tokens)
    const safeContent = content.substring(0, 20000);
    
    const prompt = `
    **TASK**: Analyze the uploaded course material and create a comprehensive Course Blueprint.
    **INPUT**: 
    File Name: ${fileName}
    Content Snippet: ${safeContent}... (truncated to fit context)
    Target Environment: ${environment}

    **GOAL**: Extract the structure and learning objectives to create a valid JSON Blueprint.
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
          "learning_objective": "By the end of this module, participants will..."
        }
      ]
    }
    
    Return ONLY valid JSON. Do not include markdown formatting.
    `;

    return await callLLM(prompt);
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

async function handleChatOnboarding(chat_history: any[], course: any): Promise<string> {
    const conversation = chat_history.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n');
    const lang = course.language || 'Romanian';
    
    const prompt = `
    **ROLE**: Expert Course Architect.
    **TASK**: Interact with the user to design a course.
    **CONTEXT**: 
    Course Title: ${course.title}
    Target Language: ${lang}
    
    **CONVERSATION HISTORY**:
    ${conversation}
    
    **GOAL**: Gather 3 key details to build a blueprint:
    1. Target Audience
    2. Specific Learning Objectives
    3. Estimated Duration (or infer it if implied)
    
    **INSTRUCTIONS**:
    1. Analyze the history. If the user just answered a question, acknowledge it briefly.
    2. If you have enough info (Audience + Objectives + Duration/Scope), generate a "blueprint".
    3. If info is missing, ask **ONE** relevant clarifying question in ${lang}.
    4. **CRITICAL**: Your output must be ONLY a valid JSON object. No Markdown. No introductory text.
    5. **CRITICAL**: The content of "message" MUST be in ${lang}.
    
    **OUTPUT FORMAT (JSON)**:
    {
      "message": "Your response to the user in ${lang}...",
      "blueprint": { 
        "title": "Refined Title",
        "target_audience": "...",
        "estimated_duration": "...",
        "modules": [
           { 
             "title": "Module 1", 
             "duration": "...", 
             "learning_objective": "...",
             "sections": [
                { "title": "Hook/Intro", "content_type": "slides" },
                { "title": "Core Concept", "content_type": "video_script" },
                { "title": "Guided Practice", "content_type": "exercise" },
                { "title": "Application", "content_type": "reading" },
                { "title": "Review/Quiz", "content_type": "quiz" }
             ]
           }
        ]
      } // Set to null if not yet ready
    }

    **PEDAGOGICAL STRUCTURE RULES**:
    - Each module MUST have a logical flow (3-5 sections):
      1. **Hook/Discovery**: Start with an engaging intro (slides/video).
      2. **Core Concept**: Present the main theory (video_script/slides/reading).
      3. **Active Practice**: Apply the concept immediately (exercise).
      4. **Application/Review**: Consolidate learning (quiz/reading).
    - **Mix Content Types**: Do NOT use the same 'content_type' for all sections.
    - **Language**: All titles and content must be in **${lang}**.

    **EXAMPLE**:
    {
      "message": "Mulțumesc! Pentru a structura cursul, îmi poți spune cam cât timp ar trebui să dureze?",
      "blueprint": null
    }
    `;
    
    const rawResponse = await callLLM(prompt);
    let cleaned = rawResponse.trim();
    // Aggressive cleanup for markdown code blocks
    if (cleaned.includes('```')) {
        cleaned = cleaned.replace(/```json/g, '').replace(/```/g, '').trim();
    }
    return cleaned;
}

function fillPromptTemplate(template: string, variables: Record<string, any>): string {
  let output = template;
  for (const [key, value] of Object.entries(variables)) {
    output = output.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
  }
  return output;
}
