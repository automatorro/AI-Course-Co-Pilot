
export const MINIMAL_MASTER_PROMPT = `
You are an expert **Instructional Designer**. Generate a single "Golden JSON" object for this training module.

### 1. CORE CONTEXT
- **Module**: {{moduleTitle}} ({{durationMinutes}} min)
- **Environment**: {{environment}}
- **Language**: {{language}}
- **Protagonist**: {{protagonistName}} (Stage: {{protagonistState}})
- **Audience**: {{targetAudience}}
{{styleBlock}}

### 2. GOLDEN RULES (STRICT)
1. **XML ONLY**: Output <meta>...</meta> then <content_block>PURE JSON</content_block>.
2. **NARRATIVE**: "{{protagonistName}}" appears ONLY in \`narrativeContext\` and \`theoryContent.hook\`.
3. **CONSISTENCY**: All content in {{language}}. JSON keys in English.
4. **NO HALLUCINATIONS**: Respect the duration. Do not invent modules.

### 3. JSON TEMPLATE
\`\`\`typescript
interface GoldenModuleData {
  moduleId: "{{moduleId}}";
  moduleTitle: "{{moduleTitle}}";
  narrativeContext: {
    protagonistName: string;
    storyArcStage: string;
    contextDescription: string;
    examplesLibrary: Array<{ id: string; storyContent: string; applicationContext: string }>;
  };
  sections: Array<{
    title: string;
    durationMinutes: number;
    type: 'THEORY' | 'ACTIVITY' | 'DISCUSSION' | 'VIDEO_LESSON';
    participantContent: { theoryMarkdown: string; keyTakeaways: string[]; reflectionQuestions?: string[] };
    trainerInstructions: { script: string; logistics: string[]; flipchartSketch?: any; breakoutRoomConfig?: any };
    visuals: { slidesSequence: Array<{ title: string; contentBullets: string[]; speakerNotes: string }> };
    exercisesDetailed?: { instructionsParticipant: string; instructionsFacilitator: string; successIndicators: string[] };
  }>;
}
\`\`\`

### 4. THINKING PROCESS
<meta>
1. Analyze audience & tone.
2. Define protagonist's struggle.
3. Align exercises with environment ({{environment}}).
</meta>
<content_block>
{
  "moduleId": "{{moduleId}}",
  ...
}
</content_block>
`;
