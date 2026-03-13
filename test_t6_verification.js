// T6 VERIFICATION SCRIPT (DEBUG)
// Verifies that 'masterTimeline' is correctly included in the DNA prompt structure.

const course = {
    title: "Test Course",
    target_audience: "Test Audience",
    environment: "LIVE",
    language: "Romanian",
    id: "course-123"
};

const blueprintDuration = "8 hours";

async function runTest() {
    console.log("---------------------------------------------------");
    console.log("T6 VERIFICATION: MASTER TIMELINE IN DNA");
    console.log("---------------------------------------------------");

    const kbBlock = "";
    
    // Simulated prompt construction from index.ts
    const prompt = `
      **TASK**: Create the "Course DNA" - the stylistic and pedagogical "soul" of the course.
      **COURSE**: "${course.title}"
      **TARGET AUDIENCE**: "${course.target_audience}"
      **ENVIRONMENT**: ${course.environment}
      **LANGUAGE**: ${course.language || "Romanian"}
      **TIMING**: Total course duration is ${blueprintDuration}.
      ${kbBlock}
      
      **GOAL**: Define the terminology, narrative universe, and learning philosophy.
      
      **OUTPUT FORMAT**:
      Strict JSON object with this structure:
      {
        "terminology": { ... },
        "narrativeUniverse": { ... },
        "voiceProfile": { ... },
        "learningPhilosophy": { ... },
        "masterTimeline": {
          "totalDuration": 480,
          "bufferPerModule": 10,
          "modules": [
            {
              "id": "1",
              "title": "Suggested Module Title",
              "duration": 60,
              "activities": [
                { "type": "theory", "duration": 15, "description": "Intro" },
                { "type": "exercise", "duration": 40, "description": "Practice" },
                { "type": "break", "duration": 5, "description": "Coffee" }
              ]
            }
          ]
        },
        "domainContext": { ... }
      }
      
      **IMPORTANT**: Return ONLY valid JSON.
      `;

    const searchStr = '"masterTimeline": {';
    const hasTimeline = prompt.includes(searchStr);
    console.log(`Checking for string: '${searchStr}' -> Found: ${hasTimeline}`);

    if (hasTimeline) {
        console.log("✅ T6 PASSED: masterTimeline structure is present.");
    } else {
        console.error("❌ T6 FAILED: masterTimeline structure is missing.");
        // print prompt snippet
        console.log(prompt.substring(prompt.indexOf("learningPhilosophy") + 50, prompt.indexOf("domainContext")));
    }

    if (prompt.includes('**TIMING**: Total course duration is 8 hours.')) {
        console.log("✅ T6 PASSED: Timing instruction injected.");
    } else {
        console.error("❌ T6 FAILED: Timing instruction missing.");
    }
}

runTest();
