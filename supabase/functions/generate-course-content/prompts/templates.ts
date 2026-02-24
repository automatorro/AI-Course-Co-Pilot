
export const getDepthSpecs = (language: string, type: 'live' | 'online' = 'live', practicePercent: number = 80) => {
  // PS-1: Universal Depth Specs with Dynamic Language Injection
  // PS-11: Environment Adaptation (Live vs Online)
  
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
    - **QUANTITY**: 1 slide per 6-8 minutes.
    - **STORYTELLING FLOW**:
      *   Slide 1: The Hook (Problem/Story).
      *   Slide 2: The Solution (Concept).
      *   Slide 3: The Framework (Visual Model).
      *   Slide 4: Practical Application.
    - **VISUALS**: Describe specific imagery (e.g., "Photo of a frustrated manager looking at a clock").
    - **LANGUAGE**: All content must be in **${language}**.
    ${envSpecs}
  `,
    exercises: `
    **DEPTH SPECIFICATIONS (Exercises):**
    - **QUANTITY**: Ensure approximately **${practicePercent}%** of the course time is practical (based on User's Blueprint).
    - **REALITY CHECK**:
      *   **Scenario-Based**: Never ask "What is X?". Ask "Client Y is yelling. What do you say?".
      *   **Red Flags**: Always include "What could go wrong?" sections.
    - **DETAIL**:
      *   **Timing**: Specify exact duration.
      *   **Facilitator Instructions**: Step-by-step guide.
      *   **Debriefing**: 3-5 specific questions (Factual, Analytical, Applicative).
    - **TABULAR CONTENT**:
      *   When describing timing breakdowns, comparison grids (Before/After, Do/Don't), or observer checklists with more than one column, always format them as standard GitHub-Flavored Markdown tables (header row + separator row + data rows). Example pattern: \`| Time | Activity | Method |\\n| --- | --- | --- |\\n| 10 min | Warm-up | Pair discussion |\`.
      *   Do NOT use HTML \`<table>\` tags anywhere. Only Markdown tables.
    - **LANGUAGE**: All content must be in **${language}**.
    ${envSpecs}
  `,
    manual: `
    **DEPTH SPECIFICATIONS (Trainer Manual):**
    - **FLOW TABLE**: Minute-by-minute agenda written as a standard GitHub-Flavored Markdown table (header row, separator row, then one row per segment). Do NOT use HTML tables.
    - **SCRIPTS**: Full conversational scripts. NO "Say hello to participants". WRITE exactly what to say.
    - **STORYTELLING**: The trainer is a storyteller. Scripts must include personal anecdotes placeholders.
    - **METHODOLOGY**:
      *   **Feedback**: SBI Model only.
      *   **Problem Solving**: Ishikawa / 5 Whys.
    - **STRUCTURĂ**: ONE coherent manual.
    - **LANGUAGE**: All content must be in **${language}**.
    ${envSpecs}
  `
  };
};
      *   Slide 3: The Example (Real world application).
      *   Slide 4: The Action (Exercise/Steps).
    - **FORMAT**: Use the exact XML template below.
    - **DELIMITERS**: <SLIDE_BEGIN id="1">...<SLIDE_END id="1">
    
    **TEMPLATE (Use this exact format):**
    <SLIDE_BEGIN id="1">
    <TITLE>[Short, Catchy Title in ${language}]</TITLE>
    <!-- slide-layout: EXPLAINER -->
    <VISUAL>[Exact visual description for a designer, English, max 20 words]</VISUAL>
    <CONTENT>
    - [Bullet point 1 in ${language}]
    - [Bullet point 2 in ${language}]
    - [Bullet point 3 (Max 5 bullets total in ${language}]
    </CONTENT>
     <NOTES>[MANDATORY: 100-150 words. The EXACT script the speaker says. Conversational, warm tone. NO "In this slide we see...". Language: ${language}]</NOTES>
     <SLIDE_END id="1">
  `,
    exercises: `
    **DEPTH SPECIFICATIONS (Exercises):**
    - **QUANTITY**: Ensure 80% of the course time is practical.
    - **REALITY CHECK**:
      *   **Scenario-Based**: Never ask "What is X?". Ask "Client Y is yelling. What do you say?".
      *   **Red Flags**: Always include "What could go wrong?" sections.
    - **DETAIL**:
      *   **Timing**: Specify exact duration.
      *   **Facilitator Instructions**: Step-by-step guide.
      *   **Debriefing**: 3-5 specific questions (Factual, Analytical, Applicative).
    - **LANGUAGE**: All content must be in **${language}**.
  `,
    manual: `
    **DEPTH SPECIFICATIONS (Trainer Manual):**
    - **FLOW TABLE**: Minute-by-minute agenda.
    - **SCRIPTS**: Full conversational scripts. NO "Say hello to participants". WRITE exactly what to say.
    - **STORYTELLING**: The trainer is a storyteller. Scripts must include personal anecdotes placeholders.
    - **METHODOLOGY**:
      *   **Feedback**: SBI Model only.
      *   **Problem Solving**: Ishikawa / 5 Whys.
    - **STRUCTURĂ**: ONE coherent manual.
    - **LANGUAGE**: All content must be in **${language}**.
  `
  };
};

export const getPromptTemplates = (language: string) => {
  // PS-1: Dynamic Template Generation - Universal template with translation instructions
  // The LLM is instructed to translate the structural headers into the target language.

  return {
    workbook_section: `
    ## Module [N]: [Title] ([Duration])

    ### [Translate to ${language}: "Why this matters"] (200-300 words)
    [Intro paragraph explaining importance. Hook the reader with a relatable problem.]

    ### [Section Title]
    #### Core Concept (300-500 words)
    [Full explanation. Define terms, provide context. NO academic tone - use "buddy-to-buddy" tone.]

    **[Translate to ${language}: "Real World Example"]:** (200-300 words)
    [Story. Context -> Challenge -> Action -> Result]

    ---
    🎯 **[Translate to ${language}: "Practical Exercise"] [N]**
    **[Translate to ${language}: "Objective"]:** [What specific skill will be practiced]
    **[Translate to ${language}: "Duration"]:** [Time] min

    **[Translate to ${language}: "Instructions"]:**
    1. [Clear Step 1]
    2. [Clear Step 2]

    **[Translate to ${language}: "Workspace"]:**
    [Insert ample space for writing/answering]

    **[Translate to ${language}: "Success Checklist"]:**
    - [ ] [Item 1]
    - [ ] [Item 2]
    ---

    ### [Translate to ${language}: "Recap"] [N]
    > **[Translate to ${language}: "Remember"]:** [Key takeaway 1]
    > **[Translate to ${language}: "Remember"]:** [Key takeaway 2]
  `,
    slide: `
    <SLIDE_BEGIN id="[N]">
    <TITLE>[Title]</TITLE>
    <!-- slide-layout: EXPLAINER -->
    <VISUAL>[Visual description]</VISUAL>
    <CONTENT>
    - [Bullet 1]
    - [Bullet 2]
    </CONTENT>
    <NOTES>[Script]</NOTES>
    <SLIDE_END id="[N]">
    `
  };
};
