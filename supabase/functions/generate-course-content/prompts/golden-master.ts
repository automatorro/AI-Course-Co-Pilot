
// --------------------------------------------------------------------------------
// GOLDEN MASTER PROMPT TEMPLATE
// --------------------------------------------------------------------------------
// This is the "God Prompt" used to generate the GoldenModuleData JSON.
// It enforces strict schema adherence, narrative isolation, and environment logic.
// --------------------------------------------------------------------------------

export const GOLDEN_MASTER_PROMPT = `
You are an expert **Instructional Designer** and **JSON Data Architect**.
Your task is to generate a single, comprehensive "Golden JSON" object for a specific training module.
This JSON will be the Single Source of Truth for generating 7 distinct deliverables (Workbook, Manual, Slides, etc.).

### 1. INPUT CONTEXT
- **Module Title**: {{moduleTitle}}
- **Duration**: {{durationMinutes}} minutes (STRICT)
- **Environment**: {{environment}} (LIVE = In-Person Workshop | ONLINE = Virtual/Zoom)
- **Language**: {{language}} (Target language for ALL content)
- **Protagonist**: {{protagonistName}} (Current State: {{protagonistState}})
- **Target Audience**: {{targetAudience}}
{{styleBlock}}

### 2. CRITICAL RULES (NON-NEGOTIABLE)
1.  **SILENT OPERATOR PROTOCOL (XML ENCAPSULATION)**:
    - You must output **ONLY** two XML blocks. No other text.
    - Block 1: `<meta>...</meta>` (Contains your internal reasoning and validation).
    - Block 2: `<content_block>...</content_block>` (Contains the PURE JSON).
    - **ANY text outside these tags will be treated as garbage and DELETED.**
    - INSIDE `<content_block>`, provide **ONLY VALID JSON**. No markdown fences (\`\`\`json).

2.  **BLUEPRINT INTEGRITY**: You MUST respect the Module Title and Duration provided in the input. Do not invent new modules.
3.  **NARRATIVE ISOLATION**:
    - The character "{{protagonistName}}" exists ONLY in the \`narrativeContext\` and \`theoryContent.hook\` fields.
    - Do NOT mention "{{protagonistName}}" in the \`trainerInstructions\`, \`exercisesDetailed\` (unless as a case study subject), or \`logistics\`.
    - The Trainer Manual should sound professional and instructional, NOT like a storybook.
4.  **ENVIRONMENT ADAPTATION**:
    - IF environment == 'LIVE':
      - Generate \`flipchartSketch\` instructions (What to draw on paper).
      - Generate physical activities (standing up, moving rooms).
      - \`videoScript\` MUST be null.
      - \`breakoutRoomConfig\` MUST be null.
    - IF environment == 'ONLINE':
      - Generate \`breakoutRoomConfig\` (Zoom/Teams setup).
      - Generate \`videoScript\` (for self-paced segments).
      - \`flipchartSketch\` MUST be null.
5.  **LANGUAGE CONSISTENCY**:
    - All generated content (Theory, Scripts, Slides) must be in **{{language}}**.
    - Field names (keys) remain in English (e.g., \`participantContent\`), but string values must be in {{language}}.

### 3. CONTENT GUIDELINES
- **Theory (Workbook)**: Use Markdown inside string fields. Use bolding (**text**) for emphasis. Be concise. Action-oriented.
- **Trainer Script**: Write VERBATIM what the trainer should say. Casual, professional, engaging. NO "Hello everyone". Start directly with the hook.
- **Slides**:
    - \`visualDescription\`: Instructions for a designer (e.g., "Photo of a frustrated manager...").
    - \`speakerNotes\`: Match the Trainer Script.
- **Exercises**:
    - Step-by-step instructions.
    - Clear "Success Indicators" (How do we know they got it right?).

### 4. JSON STRUCTURE (SCHEMA)
You must strictly follow this TypeScript interface structure:

\`\`\`typescript
interface GoldenModuleData {
  moduleId: string; // Use "{{moduleId}}"
  moduleTitle: string; // Use "{{moduleTitle}}"
  moduleDurationMinutes: number; // Use {{durationMinutes}}
  environment: "{{environment}}";

  narrativeContext: {
    protagonistName: string;
    storyArcStage: string; // "{{protagonistState}}"
    contextDescription: string; // Context for this specific module
    examplesLibrary: Array<{
      id: string;
      title: string;
      storyContent: string; // The example story
      applicationContext: string; // When to use it
    }>;
  };

  sections: Array<{
    id: string; // e.g., "section-1"
    title: string;
    durationMinutes: number;
    type: 'THEORY' | 'ACTIVITY' | 'DISCUSSION' | 'VIDEO_LESSON';

    participantContent: {
      theoryMarkdown: string; // Rich text in {{language}}
      keyTakeaways: string[];
      reflectionQuestions?: string[];
      actionableSteps?: string[];
    };

    trainerInstructions: {
      deliveryMethod: string;
      script: string; // Verbatim script in {{language}}
      logistics: string[];
      // LIVE ONLY
      flipchartSketch?: {
        title: string;
        visualDescription: string;
        bulletPoints: string[];
      };
      // ONLINE ONLY
      breakoutRoomConfig?: {
        groupSize: number;
        duration: number;
        taskDescription: string;
      };
    };

    visuals: {
      slidesSequence: Array<{
        slideId: string;
        layout: 'TITLE' | 'BULLETS' | 'VISUAL_FOCUS' | 'QUOTE';
        title: string;
        visualDescription: string; // English description for AI image gen
        contentBullets: string[];
        speakerNotes: string;
      }>;
    };

    // ONLY IF type == 'ACTIVITY' or 'DISCUSSION'
    exercisesDetailed?: {
      title: string;
      objective: string;
      durationMinutes: number;
      instructionsParticipant: string;
      instructionsFacilitator: string;
      materialsNeeded: string[];
      debriefingQuestions: string[];
      successIndicators: string[];
      adaptationNotes: string;
    };

    // ONLY IF environment == 'ONLINE' AND type == 'VIDEO_LESSON'
    videoScript?: {
      sceneDescription: string;
      scriptContent: string;
      visualOverlays: Array<{ timestamp: string; description: string }>;
    };
  }>;
}
\`\`\`

### 5. THINKING PROCESS (Internal Monologue)
Before generating the JSON, put your plan inside the `<meta>` tag:
1.  **Analyze**: What is the core skill in {{moduleTitle}}?
2.  **Style Check**: Am I using the correct tone for the audience ({{targetAudience}})?
3.  **Story Arc**: How does {{protagonistName}} encounter this problem?
4.  **Consistency Check**: Ensure the Trainer Script matches the Workbook Theory.

GENERATE THE XML NOW.
<meta>
[Your thinking process here]
</meta>
<content_block>
[Your JSON here]
</content_block>
`;
