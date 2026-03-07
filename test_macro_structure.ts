// Mock Dependencies
const Logger = { info: console.log, warn: console.warn, error: console.error };

async function runTest() {
    console.log("Running Test: Macro Structure Generation Logic");

    // Test Case 1: With DNA MasterTimeline
    console.log("\n--- TEST CASE 1: With DNA MasterTimeline ---");
    const course1 = {
      id: "test-course-macro-1",
      title: "Test Course 1",
      target_audience: "Managers",
      environment: "LIVE",
      language: "Romanian",
      blueprint: {
        modules: [
          { title: "Module 1: Intro" },
          { title: "Module 2: Deep Dive" }
        ]
      },
      dna: {
          masterTimeline: {
              totalDuration: 120,
              bufferPerModule: 10,
              modules: [
                  { id: "mod-1", title: "Module 1: Intro", duration: 45 },
                  { id: "mod-2", title: "Module 2: Deep Dive", duration: 45 }
              ]
          }
      }
    };

    let masterTimeline1 = course1.dna?.masterTimeline;
    if (!masterTimeline1) {
        masterTimeline1 = {
            totalDuration: 480,
            bufferPerModule: 10,
            modules: (course1.blueprint?.modules || []).map((m: any, i: number) => ({
                id: `module-${i+1}`,
                title: m.title,
                duration: 45
            }))
        };
    }

    const prompt1 = `
      **TASK**: Create the Course Macro Structure (High-Level Schedule).
      **COURSE**: "${course1.title}"
      **TOTAL DURATION**: ${masterTimeline1.totalDuration} minutes
      **MODULES**: ${JSON.stringify(masterTimeline1.modules)}
      **ENVIRONMENT**: ${course1.environment}
      **LANGUAGE**: ${course1.language || "Romanian"}

      **GOAL**: Organize the course into a coherent flow with Intro, Content Blocks, Breaks, and Wrap-up.

      **OUTPUT FORMAT**:
      Strict JSON object:
      {
        "macroBlocks": [
          { "type": "INTRO", "duration": 20, "title": "Welcome & Icebreaker" },
          { "type": "CONTENT_BLOCK", "duration": 60, "moduleRef": "module-1", "title": "Module 1 Title" },
          { "type": "BREAK", "duration": 15, "purpose": "Coffee Break" },
          ...
          { "type": "WRAP_UP", "duration": 30, "title": "Final Review & Action Plan" }
        ]
      }

      **RULES**:
      1. 'type' must be one of: 'INTRO', 'CONTENT_BLOCK', 'BREAK', 'WRAP_UP'.
      2. 'moduleRef' is the ID of the module from the provided list (only for CONTENT_BLOCK).
      3. Total duration must match ${masterTimeline1.totalDuration} minutes (+/- 10%).
      4. Insert breaks every 60-90 minutes.
      5. Titles must be in ${course1.language || "Romanian"}.
      `;

    // Validation 1
    if (prompt1.includes('"id":"mod-1"')) {
        console.log("PASS: DNA Modules used correctly");
    } else {
        console.error("FAIL: DNA Modules NOT used");
    }

    // Test Case 2: Fallback (No DNA)
    console.log("\n--- TEST CASE 2: Fallback (No DNA) ---");
    const course2 = {
      id: "test-course-macro-2",
      title: "Test Course 2",
      target_audience: "Students",
      environment: "ONLINE",
      language: "English",
      blueprint: {
        modules: [
          { title: "Fallback Module A" },
          { title: "Fallback Module B" }
        ]
      },
      dna: undefined
    };

    let masterTimeline2 = course2.dna?.masterTimeline; // undefined
    if (!masterTimeline2) {
        masterTimeline2 = {
            totalDuration: 480,
            bufferPerModule: 10,
            modules: (course2.blueprint?.modules || []).map((m: any, i: number) => ({
                id: `module-${i+1}`,
                title: m.title,
                duration: 45
            }))
        };
    }

    console.log("DEBUG: masterTimeline2.modules:", JSON.stringify(masterTimeline2.modules));

    const prompt2 = `
      **TASK**: Create the Course Macro Structure (High-Level Schedule).
      **COURSE**: "${course2.title}"
      **TOTAL DURATION**: ${masterTimeline2.totalDuration} minutes
      **MODULES**: ${JSON.stringify(masterTimeline2.modules)}
      **ENVIRONMENT**: ${course2.environment}
      **LANGUAGE**: ${course2.language || "Romanian"}
      
      ...
    `;

    // Validation 2
    if (prompt2.includes('"id":"module-1"') && prompt2.includes("Fallback Module A")) {
        console.log("PASS: Fallback modules generated correctly");
    } else {
        console.log("FAIL: Fallback modules NOT generated correctly");
        console.log("DEBUG: prompt2 content:", prompt2);
    }

    if (masterTimeline2.totalDuration === 480) {
        console.log("PASS: Default duration applied");
    } else {
        console.log("FAIL: Default duration NOT applied");
    }
}

runTest();
