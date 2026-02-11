
export enum AudienceLevel {
  LEVEL_1_OPERATIONAL = 'LEVEL_1_OPERATIONAL',
  LEVEL_2_CLERICAL = 'LEVEL_2_CLERICAL',
  LEVEL_3_STRATEGIC = 'LEVEL_3_STRATEGIC'
}

export const STYLE_BLOCKS = {
  [AudienceLevel.LEVEL_1_OPERATIONAL]: `
### 🧬 AUDIENCE DNA: LEVEL 1 (OPERATIONAL / BLUE COLLAR)
**PRIMARY GOAL:** Practical Execution & Safety.
**BLOOM LEVEL:** Remember & Understand.

**STRICT STYLE RULES:**
1.  **TONE:** Imperative, Direct, "Man-to-Man". No fluff.
2.  **SENTENCE STRUCTURE:** Short sentences (max 15 words). Active voice.
3.  **VOCABULARY:**
    - ✅ USE: "Check", "Stop", "Verify", "Report", "Distance", "Safety".
    - ❌ FORBIDDEN: "Paradigm", "Holistic", "Proxemics", "Kinesics", "Cognitive", "Synergy".
4.  **EXAMPLES:** Must be PHYSICAL and VISUAL (e.g., "If the machine makes a noise...", "When the customer yells...").
5.  **FORMATTING:** Use bullet points and bold text heavily.
`,

  [AudienceLevel.LEVEL_2_CLERICAL]: `
### 🧬 AUDIENCE DNA: LEVEL 2 (CLERICAL / JUNIOR MANAGEMENT)
**PRIMARY GOAL:** Process Efficiency & Procedure Adherence.
**BLOOM LEVEL:** Apply & Analyze.

**STRICT STYLE RULES:**
1.  **TONE:** Professional, Procedural, Encouraging.
2.  **SENTENCE STRUCTURE:** Balanced. Use "If-Then" logic.
3.  **VOCABULARY:** Standard business terminology.
    - ✅ USE: "Workflow", "Process", "Standard", "Feedback", "Efficiency".
    - ❌ FORBIDDEN: Extremely abstract academic theory without application.
4.  **EXAMPLES:** Office scenarios, Email drafts, Flowcharts, Customer Service scripts.
5.  **FORMATTING:** Numbered lists for procedures. Boxes for templates.
`,

  [AudienceLevel.LEVEL_3_STRATEGIC]: `
### 🧬 AUDIENCE DNA: LEVEL 3 (STRATEGIC / SENIOR LEADERSHIP)
**PRIMARY GOAL:** Strategy, Innovation & Culture Building.
**BLOOM LEVEL:** Evaluate & Create.

**STRICT STYLE RULES:**
1.  **TONE:** Analytical, Nuanaced, Peer-to-Peer.
2.  **SENTENCE STRUCTURE:** Complex but clear. Rhetorical questions allowed.
3.  **VOCABULARY:** Strategic business concepts.
    - ✅ USE: "Strategy", "Culture", "ROI", "Stakeholder", "Innovation", "Mitigation".
    - ❌ FORBIDDEN: Patronizing simplifications. Basic definitions of common terms.
4.  **EXAMPLES:** Case studies of major companies, Dilemmas with no right answer, Macro-economic trends.
5.  **FORMATTING:** Executive Summaries, Key Strategic Pillars.
`
};

export function getStyleBlock(audienceDescription: string): string {
  // Simple keyword matching to determine level if not explicitly provided
  // In a real scenario, this logic might be more complex or passed directly
  const lowerDesc = audienceDescription.toLowerCase();

  if (lowerDesc.includes('blue collar') || lowerDesc.includes('operator') || lowerDesc.includes('factory') || lowerDesc.includes('basic') || lowerDesc.includes('entry level')) {
    return STYLE_BLOCKS[AudienceLevel.LEVEL_1_OPERATIONAL];
  }

  if (lowerDesc.includes('manager') || lowerDesc.includes('executive') || lowerDesc.includes('leader') || lowerDesc.includes('director') || lowerDesc.includes('strategy')) {
    return STYLE_BLOCKS[AudienceLevel.LEVEL_3_STRATEGIC];
  }

  // Default to Level 2 (Clerical/General)
  return STYLE_BLOCKS[AudienceLevel.LEVEL_2_CLERICAL];
}
