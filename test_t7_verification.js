// T7 VERIFICATION SCRIPT
// Verifies that 'Depth Specs' are correctly included in the Golden Master Prompt.

const course = {
    title: "Test Course",
    target_audience: "General Audience",
    environment: "LIVE",
    language: "Romanian",
    id: "course-123",
    dna: {}
};

const moduleData = {
    title: "Module 1",
    duration_minutes: 60
};

// Mock Helpers
function getStyleBlock(audience) {
    return "### STYLE BLOCK ###\n";
}

function fillPromptTemplate(template, data) {
    return template.replace('{{styleBlock}}', data.styleBlock);
}

const GOLDEN_MASTER_PROMPT = `
...
{{styleBlock}}
...
`;

// REPLICATED getDepthSpecs (from index.ts)
const getDepthSpecs = (language, type = 'live', practicePercent = 80) => {
  const envSpecs = type === 'online' 
    ? `**ENVIRONMENT: ONLINE**` 
    : `**ENVIRONMENT: LIVE**`;

  return {
    workbook: `
    **DEPTH SPECIFICATIONS (Workbook):**
    - **LENGTH**: Comprehensive workbook (target 40+ pages).
    - **LANGUAGE**: All content must be in **${language}**.
    ${envSpecs}
  `,
    slides: "SLIDES SPEC",
    exercises: "EXERCISES SPEC",
    manual: "MANUAL SPEC"
  };
};

async function runTest() {
    console.log("---------------------------------------------------");
    console.log("T7 VERIFICATION: DEPTH SPECS INJECTION");
    console.log("---------------------------------------------------");

    // T7 Logic from index.ts
    const terminologyBlock = "";
    const voiceProfileBlock = "";
    const philosophyBlock = "";

    // T7: Inject Depth Specs
    const depthSpecs = getDepthSpecs(course.language || 'ro', (course.environment || 'LIVE').toLowerCase() === 'online' ? 'online' : 'live').workbook;

    let prompt = fillPromptTemplate(GOLDEN_MASTER_PROMPT, {
      styleBlock: getStyleBlock(course.target_audience) + terminologyBlock + voiceProfileBlock + philosophyBlock + `\n\n${depthSpecs}`,
    });

    // Verification
    if (prompt.includes("**DEPTH SPECIFICATIONS (Workbook):**")) {
        console.log("✅ T7 PASSED: Depth Specs (Workbook) injected into prompt.");
    } else {
        console.error("❌ T7 FAILED: Depth Specs missing.");
    }

    if (prompt.includes("**ENVIRONMENT: LIVE**")) {
        console.log("✅ T7 PASSED: Environment specific specs included (LIVE).");
    } else {
        console.error("❌ T7 FAILED: Environment specs missing or wrong.");
    }

    // Test Online Case
    console.log("\n--- TESTING ONLINE CASE ---");
    course.environment = "ONLINE";
    const depthSpecsOnline = getDepthSpecs(course.language || 'ro', (course.environment || 'LIVE').toLowerCase() === 'online' ? 'online' : 'live').workbook;
    
    let promptOnline = fillPromptTemplate(GOLDEN_MASTER_PROMPT, {
      styleBlock: getStyleBlock(course.target_audience) + terminologyBlock + voiceProfileBlock + philosophyBlock + `\n\n${depthSpecsOnline}`,
    });

    if (promptOnline.includes("**ENVIRONMENT: ONLINE**")) {
        console.log("✅ T7 PASSED: Environment specific specs included (ONLINE).");
    } else {
        console.error("❌ T7 FAILED: Online environment specs missing.");
    }
}

runTest();
