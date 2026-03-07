// T3 VERIFICATION SCRIPT - REWRITTEN CLEAN
// ----------------------------------------------------------------

// 1. MOCK DEPENDENCIES
const AudienceLevel = {
  LEVEL_1_OPERATIONAL: 'LEVEL_1_OPERATIONAL',
  LEVEL_2_CLERICAL: 'LEVEL_2_CLERICAL',
  LEVEL_3_STRATEGIC: 'LEVEL_3_STRATEGIC',
  LEVEL_4_COMMERCIAL: 'LEVEL_4_COMMERCIAL',
  LEVEL_5_TECHNICAL: 'LEVEL_5_TECHNICAL'
};

const STYLE_BLOCKS = {
  [AudienceLevel.LEVEL_1_OPERATIONAL]: "STYLE_LEVEL_1...",
  [AudienceLevel.LEVEL_2_CLERICAL]: "STYLE_LEVEL_2...",
  [AudienceLevel.LEVEL_3_STRATEGIC]: "STYLE_LEVEL_3...",
  [AudienceLevel.LEVEL_4_COMMERCIAL]: `
### AUDIENCE DNA: LEVEL 4 (SALES / CUSTOMER SUCCESS)
**PRIMARY GOAL:** Persuasion, Relationship Building & Revenue.
**BLOOM LEVEL:** Apply, Analyze & Create (Social Dynamics).
**STRICT STYLE RULES:**
1.  **TONE:** High-Energy, Empathetic, Persuasive, Confident.
`,
  [AudienceLevel.LEVEL_5_TECHNICAL]: "STYLE_LEVEL_5..."
};

function normalizeAudienceText(text) {
  return text.toLowerCase();
}

function getStyleBlock(audienceDescription) {
    if (audienceDescription.toLowerCase().includes('sales')) {
        return STYLE_BLOCKS[AudienceLevel.LEVEL_4_COMMERCIAL];
    }
    return STYLE_BLOCKS[AudienceLevel.LEVEL_2_CLERICAL];
}

const GOLDEN_MASTER_PROMPT = `
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
`;

function fillPromptTemplate(template, variables) {
  let output = template;
  for (const [key, value] of Object.entries(variables)) {
    output = output.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
  }
  return output;
}

// 2. TEST LOGIC
function testT3Injection() {
    console.log("Starting T3 Verification...");
    
    const moduleData = {
        title: "Tehnici de Negociere",
        duration_minutes: 60
    };
    const envConstraints = "Mock Constraints";

    // ----------------------------------------------------------------
    // CASE 1: learningPhilosophy UNDEFINED (Absent)
    // ----------------------------------------------------------------
    const courseCase1 = {
        target_audience: "Sales Team",
        environment: "LIVE",
        language: "Romanian",
        dna: {
            terminology: { participant: "X" } 
        }
    };

    // T3 Injection Logic (Copied from index.ts)
    let philosophyBlock1 = "";
    if (courseCase1.dna?.learningPhilosophy) {
       const p = courseCase1.dna.learningPhilosophy;
       philosophyBlock1 = `\n\n### LEARNING PHILOSOPHY & MANIFESTO\n`;
       
       if (p.manifesto && Array.isArray(p.manifesto) && p.manifesto.length > 0) {
          philosophyBlock1 += `- Manifesto: ${p.manifesto.join('. ')}\n`;
       }
       if (p.rules_of_engagement && Array.isArray(p.rules_of_engagement) && p.rules_of_engagement.length > 0) {
          philosophyBlock1 += `- Rules of Engagement: ${p.rules_of_engagement.join('. ')}\n`;
       }
       philosophyBlock1 += `\n`;
    }

    const prompt1 = fillPromptTemplate(GOLDEN_MASTER_PROMPT, {
      moduleTitle: moduleData.title,
      durationMinutes: moduleData.duration_minutes || 60,
      environment: courseCase1.environment,
      envConstraints: envConstraints,
      language: courseCase1.language || "Romanian",
      protagonistName: "Andreea",
      protagonistState: "Beginner",
      targetAudience: courseCase1.target_audience || "General Audience",
      styleBlock: getStyleBlock(courseCase1.target_audience || "General Audience") + philosophyBlock1,
      moduleId: "mod-123"
    });

    if (!prompt1.includes("### LEARNING PHILOSOPHY & MANIFESTO")) {
        console.log("✅ T3 CASE 1 (UNDEFINED) PASSED: Block correctly omitted.");
    } else {
        console.error("❌ T3 CASE 1 (UNDEFINED) FAILED: Block present unexpectedly.");
    }

    // ----------------------------------------------------------------
    // CASE 2: learningPhilosophy FULLY DEFINED (Manifesto + Rules)
    // ----------------------------------------------------------------
    const courseCase2 = {
        target_audience: "Sales Team",
        environment: "LIVE",
        language: "Romanian",
        dna: {
            learningPhilosophy: {
                manifesto: ["Learn by Doing", "Fail Fast"],
                rules_of_engagement: ["No phones", "Respect everyone"]
            }
        }
    };

    // T3 Injection Logic
    let philosophyBlock2 = "";
    if (courseCase2.dna?.learningPhilosophy) {
       const p = courseCase2.dna.learningPhilosophy;
       philosophyBlock2 = `\n\n### LEARNING PHILOSOPHY & MANIFESTO\n`;
       
       if (p.manifesto && Array.isArray(p.manifesto) && p.manifesto.length > 0) {
          philosophyBlock2 += `- Manifesto: ${p.manifesto.join('. ')}\n`;
       }
       if (p.rules_of_engagement && Array.isArray(p.rules_of_engagement) && p.rules_of_engagement.length > 0) {
          philosophyBlock2 += `- Rules of Engagement: ${p.rules_of_engagement.join('. ')}\n`;
       }
       philosophyBlock2 += `\n`;
    }

    const prompt2 = fillPromptTemplate(GOLDEN_MASTER_PROMPT, {
      moduleTitle: moduleData.title,
      durationMinutes: moduleData.duration_minutes || 60,
      environment: courseCase2.environment,
      envConstraints: envConstraints,
      language: courseCase2.language || "Romanian",
      protagonistName: "Andreea",
      protagonistState: "Beginner",
      targetAudience: courseCase2.target_audience || "General Audience",
      styleBlock: getStyleBlock(courseCase2.target_audience || "General Audience") + philosophyBlock2,
      moduleId: "mod-123"
    });

    if (prompt2.includes("### LEARNING PHILOSOPHY & MANIFESTO") &&
        prompt2.includes("Manifesto: Learn by Doing. Fail Fast") &&
        prompt2.includes("Rules of Engagement: No phones. Respect everyone")) {
        console.log("✅ T3 CASE 2 (FULL) PASSED: All fields injected correctly.");
    } else {
        console.error("❌ T3 CASE 2 (FULL) FAILED: Content missing or incorrect.");
    }

    // ----------------------------------------------------------------
    // CASE 3: learningPhilosophy PARTIAL (Manifesto ONLY)
    // ----------------------------------------------------------------
    const courseCase3 = {
        target_audience: "Sales Team",
        environment: "LIVE",
        language: "Romanian",
        dna: {
            learningPhilosophy: {
                manifesto: ["Just do it"]
                // rules_of_engagement missing
            }
        }
    };

    // T3 Injection Logic
    let philosophyBlock3 = "";
    if (courseCase3.dna?.learningPhilosophy) {
       const p = courseCase3.dna.learningPhilosophy;
       philosophyBlock3 = `\n\n### LEARNING PHILOSOPHY & MANIFESTO\n`;
       
       if (p.manifesto && Array.isArray(p.manifesto) && p.manifesto.length > 0) {
          philosophyBlock3 += `- Manifesto: ${p.manifesto.join('. ')}\n`;
       }
       if (p.rules_of_engagement && Array.isArray(p.rules_of_engagement) && p.rules_of_engagement.length > 0) {
          philosophyBlock3 += `- Rules of Engagement: ${p.rules_of_engagement.join('. ')}\n`;
       }
       philosophyBlock3 += `\n`;
    }

    const prompt3 = fillPromptTemplate(GOLDEN_MASTER_PROMPT, {
      moduleTitle: moduleData.title,
      durationMinutes: moduleData.duration_minutes || 60,
      environment: courseCase3.environment,
      envConstraints: envConstraints,
      language: courseCase3.language || "Romanian",
      protagonistName: "Andreea",
      protagonistState: "Beginner",
      targetAudience: courseCase3.target_audience || "General Audience",
      styleBlock: getStyleBlock(courseCase3.target_audience || "General Audience") + philosophyBlock3,
      moduleId: "mod-123"
    });

    if (prompt3.includes("### LEARNING PHILOSOPHY & MANIFESTO") &&
        prompt3.includes("Manifesto: Just do it") &&
        !prompt3.includes("Rules of Engagement")) {
        console.log("✅ T3 CASE 3 (PARTIAL) PASSED: Only available fields injected.");
    } else {
        console.error("❌ T3 CASE 3 (PARTIAL) FAILED: Incorrect injection behavior.");
    }
}

testT3Injection();
