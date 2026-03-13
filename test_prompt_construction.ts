
// Mock Dependencies
const Logger = { info: console.log, warn: console.warn, error: console.error };

const GOLDEN_SAMPLES = {
  workbook_online: "SAMPLE_WORKBOOK_ONLINE",
  workbook_live: "SAMPLE_WORKBOOK_LIVE",
  exercises_online: "SAMPLE_EXERCISES_ONLINE",
  exercises_live: "SAMPLE_EXERCISES_LIVE",
  video_script_online: "SAMPLE_VIDEO_SCRIPT",
  case_study: "SAMPLE_CASE_STUDY",
  manual: "SAMPLE_MANUAL"
};

const GOLDEN_MASTER_PROMPT = `
### 1. INPUT CONTEXT
- **Module Title**: {{moduleTitle}}
- **Duration**: {{durationMinutes}} minutes (STRICT)
- **Environment**: {{environment}} (LIVE = In-Person Workshop | ONLINE = Virtual/Zoom)
- **Language**: {{language}} (Target language for ALL content)
- **Protagonist**: {{protagonistName}} (Current State: {{protagonistState}})
- **Target Audience**: {{targetAudience}}
- **Macro Context**: {{macroContext}}
{{styleBlock}}
`;

// Mock Helper Functions
function fillPromptTemplate(template: string, data: Record<string, any>) {
  let prompt = template;
  for (const key in data) {
    const value = data[key] !== undefined && data[key] !== null ? String(data[key]) : "";
    prompt = prompt.replace(new RegExp(`{{${key}}}`, 'g'), value);
  }
  return prompt;
}

function getStyleBlock(audience: string) {
  return `\n### AUDIENCE DNA (${audience})\n- Tone: Professional\n`;
}

function getDepthSpecs(language: string, type: string) {
  return "DEPTH SPECS CONTENT...";
}

async function runTest() {
    console.log("Running Test: Prompt Construction with Terminology & Macro Context");

    // Mock Data
    const course = {
      id: "test-course-123",
      title: "Test Course",
      language: "Romanian",
      environment: "ONLINE",
      target_audience: "Sales Team",
      dna: {
        terminology: {
          participant: "Cursant",
          exercise: "Misiune",
          trainer: "Ghid",
          mandatoryTerms: {
            "KPI": { term: "Indicator Cheie", definition: "Key Performance Indicator" },
            "ROI": "Return on Investment" // Legacy string format test
          }
        },
        voiceProfile: {
          formality: "Casual",
          humorLevel: "High",
          forbiddenPhrases: ["Nu se poate", "Greșit"],
          signaturePhrases: ["Hai să vedem!", "Boom!"]
        },
        learningPhilosophy: {
            manifesto: ["Learn by doing", "Fail fast"],
            rules_of_engagement: ["Be present", "Ask questions"]
        },
        domainContext: {
            industryTerms: { "SaaS": "Software as a Service", "ARR": "Annual Recurring Revenue" },
            clientProfiles: [{ type: "Enterprise", decisionLogic: "Committee", approach: "Consultative" }],
            productCatalog: [{ category: "Cloud", items: ["Basic", "Pro"] }],
            competitorIntelligence: [{ name: "CompA", weaknesses: ["Expensive"], counterStrategy: "Value selling" }],
            negotiationFrameworks: [{ name: "BATNA", steps: ["Prepare", "Argue"] }]
        }
      },
      macro_plan: {
          macroBlocks: [
              { type: 'INTRO', duration: 20, title: 'Welcome' },
              { type: 'CONTENT_BLOCK', duration: 60, moduleRef: 'mod-1', title: 'Module 1' },
              { type: 'BREAK', duration: 15, purpose: 'Coffee' },
              { type: 'CONTENT_BLOCK', duration: 60, moduleRef: 'mod-2', title: 'Module 2' }
          ]
      }
    };

    const moduleData = {
        title: "Module 1",
        duration_minutes: 60
    };
    const module_id = "mod-1";
    const protagonistName = "Alex";
    const currentStoryStage = "Beginning";
    const envConstraints = "Constraints...";

    // --- LOGIC UNDER TEST ---

    // T1: Inject Terminology from DNA (Fixed Logic)
    let terminologyBlock = "";
    if (course.dna?.terminology) {
       const t = course.dna.terminology;
       terminologyBlock = `\n\n### TERMINOLOGY RULES (STRICT)\n` +
         `- Participant: ${t.participant || "Participant"}\n` +
         `- Exercise: ${t.exercise || "Exercise"}\n` +
         `- Trainer: ${t.trainer || "Trainer"}`;
         
       if (t.mandatoryTerms && Object.keys(t.mandatoryTerms).length > 0) {
          const termsList = Object.entries(t.mandatoryTerms).map(([k, v]: [string, any]) => {
              if (typeof v === 'object' && v !== null && v.term) {
                  return `${v.term} (${v.definition || ''})`;
              }
              return `${k} -> ${v}`;
          }).join(', ');
          terminologyBlock += `\n- Mandatory Terms: ${termsList}`;
       }
       terminologyBlock += `\n`;
    }

    // T2: Inject Voice Profile
    let voiceProfileBlock = "";
    if (course.dna?.voiceProfile) {
       const v = course.dna.voiceProfile;
       voiceProfileBlock = `\n\n### VOICE & TONE (FROM DNA)\n` +
         `- Formality: ${v.formality || "Professional"}\n` +
         `- Humor: ${v.humorLevel || "Light"}\n`;
         
       if (v.forbiddenPhrases && Array.isArray(v.forbiddenPhrases)) {
          voiceProfileBlock += `- Forbidden Phrases: ${v.forbiddenPhrases.join(', ')}\n`;
       }
       if (v.signaturePhrases && Array.isArray(v.signaturePhrases)) {
          voiceProfileBlock += `- Signature Phrases: ${v.signaturePhrases.join(', ')}\n`;
       }
       voiceProfileBlock += `\n`;
    }

    // T3: Inject Philosophy
    let philosophyBlock = "";
    if (course.dna?.learningPhilosophy) {
       const p = course.dna.learningPhilosophy;
       philosophyBlock = `\n\n### LEARNING PHILOSOPHY & MANIFESTO\n`;
       if (p.manifesto && Array.isArray(p.manifesto)) {
          philosophyBlock += `- Manifesto: ${p.manifesto.join('. ')}\n`;
       }
       if (p.rules_of_engagement && Array.isArray(p.rules_of_engagement)) {
          philosophyBlock += `- Rules of Engagement: ${p.rules_of_engagement.join('. ')}\n`;
       }
       philosophyBlock += `\n`;
    }

    // T4: Inject Domain Context
    let domainContextBlock = "";
    if (course.dna?.domainContext) {
        const d = course.dna.domainContext;
        domainContextBlock = `\n\n### DOMAIN & INDUSTRY CONTEXT (CRITICAL)\n`;
        
        if (d.industryTerms && Object.keys(d.industryTerms).length > 0) {
            domainContextBlock += `**Industry Terms**:\n`;
            Object.entries(d.industryTerms).forEach(([term, def]) => {
                domainContextBlock += `- ${term}: ${def}\n`;
            });
        }

        if (d.clientProfiles && Array.isArray(d.clientProfiles) && d.clientProfiles.length > 0) {
            domainContextBlock += `\n**Client Profiles**:\n`;
            d.clientProfiles.forEach(cp => {
                domainContextBlock += `- ${cp.type}: ${cp.decisionLogic} (Approach: ${cp.approach})\n`;
            });
        }
        
        domainContextBlock += `\n`;
    }

    // T7: Depth Specs
    const depthSpecs = getDepthSpecs(course.language, course.environment);

    // T8: Golden Samples
    const isOnline = (course.environment || 'LIVE').toUpperCase() === 'ONLINE';
    const goldenSamples = isOnline 
        ? `${GOLDEN_SAMPLES.workbook_online}\n\n${GOLDEN_SAMPLES.video_script_online}\n\n${GOLDEN_SAMPLES.exercises_online}`
        : `${GOLDEN_SAMPLES.workbook_live}\n\n${GOLDEN_SAMPLES.exercises_live}\n\n${GOLDEN_SAMPLES.case_study}`;

    // T15: Macro Context
    let macroContext = "";
    if (course.macro_plan && Array.isArray(course.macro_plan.macroBlocks)) {
        const blocks = course.macro_plan.macroBlocks;
        const currentBlockIndex = blocks.findIndex((b) => b.moduleRef === module_id);
        
        if (currentBlockIndex !== -1) {
             const currentBlock = blocks[currentBlockIndex];
             const prevBlock = currentBlockIndex > 0 ? blocks[currentBlockIndex - 1] : null;
             const nextBlock = currentBlockIndex < blocks.length - 1 ? blocks[currentBlockIndex + 1] : null;
             
             macroContext = `\n**MACRO SCHEDULE CONTEXT (Timing & Flow)**:\n`;
             macroContext += `- Current Position: Block #${currentBlockIndex + 1} of ${blocks.length}.\n`;
             macroContext += `- Allocated Duration: ${currentBlock.duration} min (Strictly adhere to this).\n`;
             
             if (prevBlock) {
                 macroContext += `- Previous Activity: ${prevBlock.type} ("${prevBlock.title || 'Untitled'}") - ${prevBlock.duration} min.\n`;
                 if (prevBlock.type === 'BREAK') macroContext += `  (NOTE: Participants are fresh from a break. Start with high energy.)\n`;
             }
             
             if (nextBlock) {
                 macroContext += `- Next Activity: ${nextBlock.type} ("${nextBlock.title || 'Untitled'}") - ${nextBlock.duration} min.\n`;
                 if (nextBlock.type === 'BREAK') macroContext += `  (NOTE: End strictly on time! Participants will be tired and needing a break.)\n`;
             }
        }
    }

    let prompt = fillPromptTemplate(GOLDEN_MASTER_PROMPT, {
      moduleTitle: moduleData.title,
      durationMinutes: moduleData.duration_minutes || 60, 
      environment: course.environment,
      envConstraints: envConstraints,
      language: course.language || "Romanian",
      protagonistName: protagonistName,
      protagonistState: currentStoryStage,
      targetAudience: course.target_audience || "General Audience",
      styleBlock: getStyleBlock(course.target_audience || "General Audience") + terminologyBlock + voiceProfileBlock + philosophyBlock + domainContextBlock + `\n\n${depthSpecs}`,
      goldenSamples: goldenSamples,
      moduleId: module_id,
      macroContext: macroContext
    });

    console.log("--- GENERATED PROMPT PREVIEW ---");
    console.log(prompt);
    console.log("--- END PREVIEW ---");
}

runTest();
