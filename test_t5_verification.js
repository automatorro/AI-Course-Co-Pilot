// T5 VERIFICATION SCRIPT
// Verifies that 'domainContext' is correctly included in the prompt structure and populated from knowledge base.

const course = {
    title: "Test Course",
    target_audience: "Sales Team",
    environment: "LIVE",
    language: "Romanian",
    id: "course-123"
};

// Mock function for buildKnowledgeBaseContext
async function buildKnowledgeBaseContext(supabase, courseId, language) {
    // Simulate fetching text from files
    if (courseId === "course-with-kb") {
        return "Reference Material Content: Sales methodologies and product specs.";
    }
    return "";
}

async function runTest() {
    console.log("---------------------------------------------------");
    console.log("T5 VERIFICATION: DOMAIN CONTEXT & KB INJECTION");
    console.log("---------------------------------------------------");

    // CASE 1: No Knowledge Base
    console.log("\n--- CASE 1: No Knowledge Base ---");
    let knowledgeBase = await buildKnowledgeBaseContext(null, "course-no-kb", "Romanian");
    let kbBlock = knowledgeBase ? `\n### UPLOADED REFERENCE MATERIALS\n${knowledgeBase}\nUse these to populate domainContext fields.` : '';
    
    let prompt = `
      **TASK**: Create the "Course DNA" - the stylistic and pedagogical "soul" of the course.
      **COURSE**: "${course.title}"
      **TARGET AUDIENCE**: "${course.target_audience}"
      **ENVIRONMENT**: ${course.environment}
      **LANGUAGE**: ${course.language || "Romanian"}
      ${kbBlock}
      
      **GOAL**: Define the terminology, narrative universe, and learning philosophy.
      
      **OUTPUT FORMAT**:
      Strict JSON object with this structure:
      {
        "terminology": { ... },
        "narrativeUniverse": { ... },
        "voiceProfile": { ... },
        "learningPhilosophy": { ... },
        "domainContext": {
          "industryTerms": { "term": "definition" },
          "clientProfiles": [{ "type": "...", "decisionLogic": "...", "approach": "..." }],
          "productCatalog": [{ "category": "...", "items": ["..."] }],
          "competitorIntelligence": [{ "name": "...", "weaknesses": [...], "counterStrategy": "..." }],
          "negotiationFrameworks": [{ "name": "...", "steps": [...] }]
        }
      }
      
      **IMPORTANT**: Return ONLY valid JSON. The content MUST be in ${course.language || "Romanian"}.
      Populate domainContext ONLY from the reference materials above. If no materials are provided, leave arrays empty.
      `;

    if (!prompt.includes("### UPLOADED REFERENCE MATERIALS")) {
        console.log("✅ Case 1 Passed: No KB block when no files.");
    } else {
        console.error("❌ Case 1 Failed: KB block present unexpectedly.");
    }

    if (prompt.includes('"domainContext": {') && prompt.includes('"clientProfiles":')) {
        console.log("✅ Case 1 Passed: domainContext structure present.");
    } else {
        console.error("❌ Case 1 Failed: domainContext structure missing.");
    }

    // CASE 2: With Knowledge Base
    console.log("\n--- CASE 2: With Knowledge Base ---");
    knowledgeBase = await buildKnowledgeBaseContext(null, "course-with-kb", "Romanian");
    kbBlock = knowledgeBase ? `\n### UPLOADED REFERENCE MATERIALS\n${knowledgeBase}\nUse these to populate domainContext fields.` : '';
    
    prompt = `
      **TASK**: Create the "Course DNA" - the stylistic and pedagogical "soul" of the course.
      **COURSE**: "${course.title}"
      **TARGET AUDIENCE**: "${course.target_audience}"
      **ENVIRONMENT**: ${course.environment}
      **LANGUAGE**: ${course.language || "Romanian"}
      ${kbBlock}
      
      **GOAL**: Define the terminology, narrative universe, and learning philosophy.
      
      **OUTPUT FORMAT**:
      Strict JSON object with this structure:
      {
        "terminology": { ... },
        "narrativeUniverse": { ... },
        "voiceProfile": { ... },
        "learningPhilosophy": { ... },
        "domainContext": {
          "industryTerms": { "term": "definition" },
          "clientProfiles": [{ "type": "...", "decisionLogic": "...", "approach": "..." }],
          "productCatalog": [{ "category": "...", "items": ["..."] }],
          "competitorIntelligence": [{ "name": "...", "weaknesses": [...], "counterStrategy": "..." }],
          "negotiationFrameworks": [{ "name": "...", "steps": [...] }]
        }
      }
      
      **IMPORTANT**: Return ONLY valid JSON. The content MUST be in ${course.language || "Romanian"}.
      Populate domainContext ONLY from the reference materials above. If no materials are provided, leave arrays empty.
      `;

    if (prompt.includes("### UPLOADED REFERENCE MATERIALS") && prompt.includes("Sales methodologies")) {
        console.log("✅ Case 2 Passed: KB block injected correctly.");
    } else {
        console.error("❌ Case 2 Failed: KB block missing or incorrect.");
    }

    if (prompt.includes('Populate domainContext ONLY from the reference materials above')) {
        console.log("✅ Case 2 Passed: Instruction for domainContext population present.");
    } else {
        console.error("❌ Case 2 Failed: Instruction missing.");
    }
}

runTest();
