
// Mock Dependencies
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
### 🧬 AUDIENCE DNA: LEVEL 4 (SALES / CUSTOMER SUCCESS)
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
    // Simplified for test - assume "sales" triggers LEVEL_4
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

// TEST LOGIC
function testT2Injection() {
    // ----------------------------------------------------------------
    // CASE 1: voiceProfile is UNDEFINED
    // ----------------------------------------------------------------
    const courseUndefined = {
        target_audience: "Sales Team",
        environment: "LIVE",
        language: "Romanian",
        dna: {
            terminology: { participant: "X" } // No voiceProfile
        }
    };

    const moduleData = {
        title: "Tehnici de Negociere",
        duration_minutes: 60
    };

    // LOGIC COPIED FROM index.ts
    // T1: Inject Terminology from DNA (simplified for T2 test)
    let terminologyBlock1 = ""; 
    if (courseUndefined.dna?.terminology) { terminologyBlock1 = "TERM_BLOCK_MOCK"; }

    // T2: Inject Voice Profile from DNA
    let voiceProfileBlock1 = "";
    if (courseUndefined.dna?.voiceProfile) {
       const v = courseUndefined.dna.voiceProfile;
       voiceProfileBlock1 = `\n\n### VOICE & TONE (FROM DNA)\n` +
         `- Formality: ${v.formality || "Professional"}\n` +
         `- Humor: ${v.humorLevel || v.humor || "Light"}\n`; // Handle both keys for safety
         
       if (v.forbiddenPhrases && Array.isArray(v.forbiddenPhrases) && v.forbiddenPhrases.length > 0) {
          voiceProfileBlock1 += `- Forbidden Phrases: ${v.forbiddenPhrases.join(', ')}\n`;
       }
       if (v.signaturePhrases && Array.isArray(v.signaturePhrases) && v.signaturePhrases.length > 0) {
          voiceProfileBlock1 += `- Signature Phrases: ${v.signaturePhrases.join(', ')}\n`;
       }
       voiceProfileBlock1 += `\n`;
    }

    const prompt1 = fillPromptTemplate(GOLDEN_MASTER_PROMPT, {
      moduleTitle: moduleData.title,
      durationMinutes: moduleData.duration_minutes || 60, 
      environment: courseUndefined.environment,
      envConstraints: "Mock Constraints",
      language: courseUndefined.language || "Romanian",
      protagonistName: "Andreea",
      protagonistState: "Beginner",
      targetAudience: courseUndefined.target_audience || "General Audience",
      styleBlock: getStyleBlock(courseUndefined.target_audience || "General Audience") + terminologyBlock1 + voiceProfileBlock1,
      moduleId: "mod-123"
    });

    if (!prompt1.includes("### VOICE & TONE (FROM DNA)")) {
        console.log("✅ T2 CASE 1 (UNDEFINED) PASSED: Block correctly omitted.");
    } else {
        console.error("❌ T2 CASE 1 (UNDEFINED) FAILED: Block present unexpectedly.");
    }

    // ----------------------------------------------------------------
    // CASE 2: voiceProfile is DEFINED
    // ----------------------------------------------------------------
    const courseDefined = {
        target_audience: "Sales Team",
        environment: "LIVE",
        language: "Romanian",
        dna: {
            terminology: { participant: "X" },
            voiceProfile: {
                formality: "Buddy",
                humorLevel: "High",
                forbiddenPhrases: ["Nu se poate", "Problema e la client"],
                signaturePhrases: ["Let's close it!", "Win-Win"]
            }
        }
    };

    // T1 (simplified)
    let terminologyBlock2 = ""; 
    if (courseDefined.dna?.terminology) { terminologyBlock2 = "TERM_BLOCK_MOCK"; }

    // T2
    let voiceProfileBlock2 = "";
    if (courseDefined.dna?.voiceProfile) {
       const v = courseDefined.dna.voiceProfile;
       voiceProfileBlock2 = `\n\n### VOICE & TONE (FROM DNA)\n` +
         `- Formality: ${v.formality || "Professional"}\n` +
         `- Humor: ${v.humorLevel || v.humor || "Light"}\n`; // Handle both keys for safety
         
       if (v.forbiddenPhrases && Array.isArray(v.forbiddenPhrases) && v.forbiddenPhrases.length > 0) {
          voiceProfileBlock2 += `- Forbidden Phrases: ${v.forbiddenPhrases.join(', ')}\n`;
       }
       if (v.signaturePhrases && Array.isArray(v.signaturePhrases) && v.signaturePhrases.length > 0) {
          voiceProfileBlock2 += `- Signature Phrases: ${v.signaturePhrases.join(', ')}\n`;
       }
       voiceProfileBlock2 += `\n`;
    }

    const prompt2 = fillPromptTemplate(GOLDEN_MASTER_PROMPT, {
      moduleTitle: moduleData.title,
      durationMinutes: moduleData.duration_minutes || 60, 
      environment: courseDefined.environment,
      envConstraints: "Mock Constraints",
      language: courseDefined.language || "Romanian",
      protagonistName: "Andreea",
      protagonistState: "Beginner",
      targetAudience: courseDefined.target_audience || "General Audience",
      styleBlock: getStyleBlock(courseDefined.target_audience || "General Audience") + terminologyBlock2 + voiceProfileBlock2,
      moduleId: "mod-123"
    });

    console.log("--- T2 CASE 2 PROMPT SNIPPET ---");
    const voiceSection = prompt2.substring(prompt2.indexOf("### VOICE & TONE"), prompt2.indexOf("### 2. GOLDEN RULES"));
    console.log(voiceSection);
    console.log("--------------------------------");

    // Corrected assertions
    const checks = [
        { desc: "Block Title", result: prompt2.includes("### VOICE & TONE (FROM DNA)") },
        { desc: "Formality", result: prompt2.includes("Formality: Buddy") },
        { desc: "Humor", result: prompt2.includes("Humor: High") },
        { desc: "Forbidden Phrases: Nu se poate", result: prompt2.includes("Forbidden Phrases: Nu se poate") },
        { desc: "Signature Phrases: Win-Win", result: prompt2.includes("Win-Win") && prompt2.includes("Signature Phrases:") }
    ];

    const failed = checks.filter(c => !c.result);

    if (failed.length === 0) {
        console.log("✅ T2 CASE 2 (DEFINED) PASSED: All fields present.");
    } else {
        console.error("❌ T2 CASE 2 (DEFINED) FAILED:", failed.map(f => f.desc));
        
        // Show debug info
        console.log("\nDEBUG:");
        console.log("Looking for 'Signature Phrases: Win-Win' directly?");
        console.log("Actual Signature Phrases line:", voiceSection.match(/- Signature Phrases: .*/)?.[0]);
    }
}

testT2Injection();
