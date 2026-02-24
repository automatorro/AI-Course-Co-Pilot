
export enum AudienceLevel {
  LEVEL_1_OPERATIONAL = 'LEVEL_1_OPERATIONAL',
  LEVEL_2_CLERICAL = 'LEVEL_2_CLERICAL',
  LEVEL_3_STRATEGIC = 'LEVEL_3_STRATEGIC',
  LEVEL_4_COMMERCIAL = 'LEVEL_4_COMMERCIAL',
  LEVEL_5_TECHNICAL = 'LEVEL_5_TECHNICAL'
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
`,

  [AudienceLevel.LEVEL_4_COMMERCIAL]: `
### 🧬 AUDIENCE DNA: LEVEL 4 (SALES / CUSTOMER SUCCESS)
**PRIMARY GOAL:** Persuasion, Relationship Building & Revenue.
**BLOOM LEVEL:** Apply, Analyze & Create (Social Dynamics).

**STRICT STYLE RULES:**
1.  **TONE:** High-Energy, Empathetic, Persuasive, Confident.
2.  **SENTENCE STRUCTURE:** Conversational, engaging, question-heavy.
3.  **VOCABULARY:** Emotional intelligence & Sales.
    - ✅ USE: "Rapport", "Discovery", "Pain point", "Value proposition", "Closing".
    - ❌ FORBIDDEN: Dry technical specs, passive voice, bureaucratic language.
4.  **EXAMPLES:** Roleplay scripts, Objection handling, "What to say when...".
5.  **FORMATTING:** Scripts, Dialogue blocks, "Do's and Don'ts".
`,

  [AudienceLevel.LEVEL_5_TECHNICAL]: `
### 🧬 AUDIENCE DNA: LEVEL 5 (TECHNICAL EXPERT / R&D)
**PRIMARY GOAL:** Deep Understanding, Innovation & Problem Solving.
**BLOOM LEVEL:** Analyze, Evaluate & Create (Systemic).

**STRICT STYLE RULES:**
1.  **TONE:** Precise, Geeky (in a good way), Detail-Oriented.
2.  **SENTENCE STRUCTURE:** Can handle complexity. Precision is key.
3.  **VOCABULARY:** Domain-specific technical terminology.
    - ✅ USE: Correct technical acronyms, specific metrics, system logic.
    - ❌ FORBIDDEN: Simplifying things "for the layman". Dumbed-down analogies.
4.  **EXAMPLES:** Code snippets, Schematics, Edge cases, Debugging logs.
5.  **FORMATTING:** Code blocks, Technical diagrams, Data tables.
`
};

function normalizeAudienceText(text: string): string {
  const lower = (text || '').toLowerCase();
  return lower
    .replace(/ă/g, 'a')
    .replace(/â/g, 'a')
    .replace(/î/g, 'i')
    .replace(/ș/g, 's')
    .replace(/ş/g, 's')
    .replace(/ț/g, 't')
    .replace(/ţ/g, 't');
}

export function getStyleBlock(audienceDescription: string): string {
  const normalized = normalizeAudienceText(audienceDescription);

  const opKeywords = [
    'blue collar', 'line worker', 'frontline', 'front line',
    'operator', 'factory', 'warehouse', 'depozit', 'magazie',
    'muncitor', 'muncitori', 'productie', 'linie de productie',
    'sofer', 'driver', 'assembly', 'maintenance', 'field technician'
  ];

  const clericalKeywords = [
    'office', 'back office', 'clerical', 'administrative',
    'junior', 'assistant', 'coordinator', 'front desk',
    'operator call center', 'data entry'
  ];

  const strategicKeywords = [
    'executive', 'executives', 'director', 'vp', 'c-level', 'c level',
    'ceo', 'cfo', 'coo', 'board', 'board member',
    'senior leadership', 'top management', 'strategic',
    'founder', 'owner'
  ];

  const commercialKeywords = [
    'sales', 'sales team', 'account manager', 'account management',
    'customer success', 'customer support', 'customer service',
    'client service', 'call center', 'contact center',
    'agent vanzari', 'vanzari', 'relatii cu clientii'
  ];

  const technicalKeywords = [
    'developer', 'software engineer', 'programmer',
    'programator', 'inginer', 'engineer', 'architect',
    'it', 'it pro', 'devops', 'sysadmin', 'data scientist',
    'technical staff', 'r&d', 'research and development'
  ];

  let scoreOperational = 0;
  let scoreClerical = 0;
  let scoreStrategic = 0;
  let scoreCommercial = 0;
  let scoreTechnical = 0;

  const addScore = (keywords: string[], increment: () => void) => {
    for (const kw of keywords) {
      if (!kw) continue;
      if (normalized.includes(kw)) {
        increment();
      }
    }
  };

  addScore(opKeywords, () => { scoreOperational += 2; });
  addScore(clericalKeywords, () => { scoreClerical += 2; });
  addScore(strategicKeywords, () => { scoreStrategic += 2; });
  addScore(commercialKeywords, () => { scoreCommercial += 2; });
  addScore(technicalKeywords, () => { scoreTechnical += 2; });

  if (scoreOperational === 0 && scoreClerical === 0 && scoreStrategic === 0 && scoreCommercial === 0 && scoreTechnical === 0) {
    return STYLE_BLOCKS[AudienceLevel.LEVEL_2_CLERICAL];
  }

  let bestLevel = AudienceLevel.LEVEL_2_CLERICAL;
  let bestScore = scoreClerical;

  const consider = (level: AudienceLevel, score: number, priorityBoost = 0) => {
    const effectiveScore = score + priorityBoost;
    if (effectiveScore > bestScore) {
      bestScore = effectiveScore;
      bestLevel = level;
    }
  };

  consider(AudienceLevel.LEVEL_1_OPERATIONAL, scoreOperational, 0.5);
  consider(AudienceLevel.LEVEL_3_STRATEGIC, scoreStrategic, 0.5);
  consider(AudienceLevel.LEVEL_4_COMMERCIAL, scoreCommercial, 0.25);
  consider(AudienceLevel.LEVEL_5_TECHNICAL, scoreTechnical, 0.5);

  return STYLE_BLOCKS[bestLevel];
}
