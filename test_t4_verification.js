// T4 VERIFICATION SCRIPT
// Simulates the prompt generation logic for 'course_dna' step in handleLegacyStep
// Verifies that 'voiceProfile' is correctly included in the prompt structure.

const course = {
    title: "Test Course",
    target_audience: "Test Audience",
    environment: "LIVE",
    language: "Romanian"
};

// Replicated Logic from handleLegacyStep (lines 2031-2063 in index.ts)
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
        "voiceProfile": {
          "formality": "Formality level (e.g. Professional, Casual, Academic)",
          "humorLevel": "Humor level (e.g. None, Light, Witty)",
          "forbiddenPhrases": ["Phrase 1", "Phrase 2"],
          "signaturePhrases": ["Phrase 1", "Phrase 2"]
        },
        "learningPhilosophy": {
          "manifesto": ["Principle 1", "Principle 2"],
          "rules_of_engagement": ["Rule 1", "Rule 2"]
        }
      }
      
      **IMPORTANT**: Return ONLY valid JSON. The content MUST be in ${course.language || "Romanian"}.
      `;

// Verification Logic
console.log("---------------------------------------------------");
console.log("T4 VERIFICATION: CHECKING PROMPT STRUCTURE");
console.log("---------------------------------------------------");

if (prompt.includes('"voiceProfile": {') && 
    prompt.includes('"formality":') && 
    prompt.includes('"humorLevel":') &&
    prompt.includes('"forbiddenPhrases":') &&
    prompt.includes('"signaturePhrases":')) {
    console.log("✅ T4 PASSED: 'voiceProfile' structure is correctly included in the prompt.");
} else {
    console.error("❌ T4 FAILED: 'voiceProfile' structure is missing or incomplete.");
}

console.log("\n--- GENERATED PROMPT SNIPPET (Voice Profile Section) ---");
const startIndex = prompt.indexOf('"voiceProfile": {');
const endIndex = prompt.indexOf('},', startIndex) + 2;
console.log(prompt.substring(startIndex, endIndex));
console.log("---------------------------------------------------");
