
/**
 * templates.ts — Depth Specifications for each deliverable type.
 * NOTE: This file is for documentation/reference only.
 * The Edge Function (index.ts) uses an inlined copy of getDepthSpecs due to Deno bundling constraints.
 * When updating getDepthSpecs, update BOTH this file and the inlined version in index.ts.
 */

export const getDepthSpecs = (language: string, type: 'live' | 'online' = 'live', practicePercent: number = 80) => {
  const envSpecs = type === 'online'
    ? `
    **ENVIRONMENT: ONLINE (VIRTUAL CLASSROOM - ZOOM/TEAMS)**
    - **INTERACTION**: Must use "Breakout Rooms", "Chat Polls", "Miro Board links", "Screen Share".
    - **CONSTRAINTS**: Max 10 min monologues (Zoom Fatigue). Frequent "Type in chat" prompts.
    - **MATERIALS**: PDFs, Digital Workbooks, Online Quizzes.
    `
    : `
    **ENVIRONMENT: LIVE (IN-PERSON WORKSHOP)**
    - **INTERACTION**: EXCLUSIVE face-to-face activities: "Turn to your neighbor", "Physical Flipcharts", "Room Movement", "Gallery Walk", "Role Play in room", "Group Discussions", "Physical Exercises".
    - **CONSTRAINTS**:
      *   Standard attention spans. Physical handouts allowed.
      *   **FORBIDDEN**: DO NOT mention videos, webinars, online dashboards, virtual forums, zoom links, or screen sharing.
    - **MATERIALS**: Printed Workbooks, Sticky Notes, Markers, Flipchart paper.
    `;

  return {
    workbook: `
    **DEPTH SPECIFICATIONS (Workbook):**
    - **LENGTH**: Comprehensive workbook (target 40+ pages).
    - **PEDAGOGY (ACTION-FIRST)**:
      *   **No Fluff**: Do not explain "definitions" unless critical. Go straight to "How to apply".
      *   **Step-by-Step**: Use numbered lists for actions. "Step 1: Do X. Step 2: Do Y."
      *   **Checklists**: Include "Am I doing it right?" checklists for every concept.
    - **CONTENT PER MODULE**:
      *   **Explanatory Text**: 800-1200 words. Conversational.
      *   **Stories**: Include at least 1-2 distinct stories/analogies per section (Hero -> Problem -> Solution).
      *   **Case Studies**: Full case studies (1 page each) with the Course Protagonist.
      *   **Exercises**: Every exercise must have: Objective, Instructions, Formatted answer space (tables/boxes).
    - **FORMATTING**: Markdown headers, Blockquotes for takeaways, Bold for emphasis.
      *   For any tabular content (timing breakdowns, comparisons, multi-column checklists), use standard GitHub-Flavored Markdown tables with a header row and separator row (| Col1 | Col2 | ... | / | --- | --- | ... |). Do NOT use HTML tables.
    - **LANGUAGE**: All content must be in **${language}**.
    ${envSpecs}
  `,
    slides: `
    **DEPTH SPECIFICATIONS (Slides):**
    - **QUANTITY**: 1 slide per 5-7 minutes.
    - **STORYTELLING FLOW**:
      *   Slide 1: The Hook (Problem/Story).
      *   Slide 2: The Solution (Concept).
      *   Slide 3: The Framework (Visual Model).
      *   Slide 4: Practical Application.
    - **VISUALS**: Describe specific imagery (e.g., "Photo of a frustrated manager looking at a clock").
    - **SPEAKER NOTES**: Full verbatim script, 100-150 words per slide.
    - **LANGUAGE**: All content must be in **${language}**.
    ${envSpecs}
  `,
    exercises: `
    **DEPTH SPECIFICATIONS (Exercises):**
    - **QUANTITY**: Ensure approximately **${practicePercent}%** of the course time is practical.
    - **REALITY CHECK**:
      *   **Scenario-Based**: Never ask "What is X?". Ask "Client Y is facing Z. What do you do?".
      *   **Red Flags**: Always include "What could go wrong?" sections.
    - **DETAIL**:
      *   **Timing**: Specify exact duration with breakdown table.
      *   **Facilitator Instructions**: Step-by-step guide with observer checklist.
      *   **Debriefing**: 3-5 specific questions (Factual, Analytical, Applicative).
    - **TABULAR CONTENT**: Use GitHub-Flavored Markdown tables only. Do NOT use HTML tables.
    - **LANGUAGE**: All content must be in **${language}**.
    ${envSpecs}
  `,
    manual: `
    **DEPTH SPECIFICATIONS (Trainer Manual):**
    - **FLOW TABLE**: Minute-by-minute agenda as a Markdown table (no HTML).
    - **SCRIPTS**: Full verbatim scripts. NO "Say hello to participants". WRITE exactly what to say.
    - **TRANSITIONS**: Exact transition words between every section and between modules.
    - **RESISTANCE HANDLING**: How to handle confused or resistant participants.
    - **METHODOLOGY**:
      *   **Feedback**: SBI Model only.
      *   **Problem Solving**: Ishikawa / 5 Whys.
    - **LANGUAGE**: All content must be in **${language}**.
    ${envSpecs}
  `
  };
};
