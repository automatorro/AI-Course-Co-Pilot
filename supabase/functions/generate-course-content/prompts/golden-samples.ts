
export const GOLDEN_SAMPLES = {
  objectives: `
# [Course Title]
**Total Duration:** [Hours]
**Target Audience:** [Specific Audience]
**Format:** [Live Workshop OR Online Course]

---

## 🎯 LEARNING OBJECTIVES (BLOOM'S TAXONOMY)

At the end of this course, participants will be able to:

### 1. **ANALYZE** (Bloom: Analyze)
To identify [Key Problem/Pattern] using [Specific Framework/Tool] and justify the diagnosis with concrete evidence from [Context].

**Success Criteria:**
- Correctly classifies [X]% of [Scenarios]
- Provides minimum [Y] evidence points for each classification

---

### 2. **APPLY** (Bloom: Apply)
To adapt [Method/Technique] depending on [Variable A] and [Variable B], using the [Step-by-Step Process] learned in Module [N].

**Success Criteria:**
- Solves correctly [X]/[Y] practical scenarios
- Develops an action plan for a real-world situation

---

### 3. **CREATE** (Bloom: Create)
To develop a personalized [Strategy/Plan/Project] for [Target], with specific milestones and [KPIs].

**Success Criteria:**
- The plan contains specific actions (not vague wishes)
- Includes [Specific Component A] and [Specific Component B]

---
`,

  workbook_online: `
## Module [N]: [Module Title]

### 1. Why this matters (The Hook)
[Compelling Intro]: Start with a relatable pain point or myth.
"Most people believe that [Common Myth about Topic]. But in reality, [Truth]."
"Have you ever felt [Pain Point]? You are not alone."

### 2. Core Concept: [Concept Name]
**Definition:** [Clear, jargon-free definition]

**The Framework ([Acronym/Model]):**
1. **[Step 1]:** [Explanation]
2. **[Step 2]:** [Explanation]
3. **[Step 3]:** [Explanation]

> **Pro Tip:** [Actionable insight or "Cheat Code"]

### 3. Real World Example (Narrative Arc)
**The Story of [Protagonist Name]:**
[Protagonist] faced [Challenge related to Module].
At first, they tried [Wrong Approach]. Result: [Negative Outcome].
Then, they applied [Core Concept].
**Result:** [Positive Outcome].

### 4. Practical Exercise [N].1
**Objective:** Apply [Concept] to a personal scenario.
**Instructions:**
1. Identify [X].
2. Apply [Y].
3. Write down [Z].

**Workspace:**
[____________________]
[____________________]
`,

  workbook_live: `
## Module [N]: [Module Title] (Live Workshop Edition)

### 1. Group Discussion Starter
**Question:** "[Provocative Question about Topic]?"
**Activity:** Turn to your neighbor (2 min) and discuss.

### 2. Core Framework: [Concept Name]
[Visual Diagram Placeholder]
- **[Component A]:** [Description]
- **[Component B]:** [Description]

### 3. The "Aha!" Moment
> **Key Takeaway:** [The most important insight of the module]

### 4. Group Activity [N].1: [Activity Name]
**Format:** Groups of [X]
**Time:** [Y] minutes
**Instructions:**
1. Select a [Role/Scenario].
2. Practice [Technique].
3. Debrief with the group.

**Debrief Questions:**
- What was difficult?
- What surprised you?
`,

  structure_online: `
# Detailed Structure: [Course Title] (Online)
**Total:** [X] hours video + [Y] hours study
**Format:** Self-paced Video Course

---

## 📚 MODULE 1: [Module Title]
**Video Duration:** [X] min
**Objective:** [Main Goal]

### Lesson 1.1: [Lesson Title] (Video [X] min)
**Learning Objectives:**
- To **[Bloom Verb]** [Concept]
- To **[Bloom Verb]** [Skill]

**Content:**
#### A. Hook (Video)
**Narrative:** "[Story/Analogy opening]"

#### B. Theory (Video + Animation)
- **SLIDE 1:** [Visual Concept Model]
- **SLIDE 2:** [Process Steps]
- **SLIDE 3:** [Common Mistakes / Red Flags]

#### C. Reflection (Pause Video)
**On-Screen Instruction:** "Pause now. Open workbook page [X]. Complete exercise [Y]."

---
`,

  slides_live: `
<SLIDE_BEGIN id="[N]">
<TITLE>[Engaging Question or Strong Statement?]</TITLE>
<!-- slide-layout: EXPLAINER -->
<VISUAL>[Description of visual: Diagram/Chart/Metaphor]</VISUAL>
<CONTENT>
- **[Key Point 1]:** [Brief explanation]
- **[Key Point 2]:** [Brief explanation]
- **[Key Point 3]:** [Brief explanation]
</CONTENT>
<NOTES>
**Hook:** Ask the audience: "[Question]?"
**Explanation:** Explain that [Concept] is not about [Misconception], but about [Truth].
**Story:** Share the story of [Protagonist] who [Scenario].
**Interaction:** Ask for a show of hands for [Condition].
</NOTES>
<SLIDE_END id="[N]">

<SLIDE_BEGIN id="[N+1]">
<TITLE>The [Framework Name] Framework</TITLE>
<!-- slide-layout: EXPLAINER -->
<VISUAL>[Step-by-step Process Diagram]</VISUAL>
<CONTENT>
- **Step 1:** [Action]
- **Step 2:** [Action]
- **Step 3:** [Action]
</CONTENT>
<NOTES>
Walk through each step.
Give a concrete example for Step 1.
Warn about the common pitfall in Step 2.
</NOTES>
<SLIDE_END id="[N+1]">
`,

  slides_online: `
<SLIDE_BEGIN id="[N]">
<TITLE>[Concept Name]</TITLE>
<!-- slide-layout: EXPLAINER -->
<VISUAL>[Clean, high-contrast visual for video overlay]</VISUAL>
<CONTENT>
- [Short bullet 1]
- [Short bullet 2]
</CONTENT>
<NOTES>
(Script is separate, these are visual cues)
Focus on [Key Term].
</NOTES>
<SLIDE_END id="[N]">
`,

  quiz: `
# FINAL ASSESSMENT: [Course Title]

## PART 1: KNOWLEDGE CHECK (Multiple Choice)

### ❓ QUESTION 1: [Concept A]
**Which of the following best describes [Concept A]?**

A) [Wrong Definition]
B) [Wrong Definition]
C) [Correct Definition] ✅
D) [Wrong Definition]

**Feedback if WRONG:**
"Remember, [Concept A] is about [Key Distinction]. Option [X] refers to [Concept B]."

---

## PART 2: SCENARIO APPLICATION

### ❓ QUESTION [N]: [Scenario Name]
**Scenario:** [Protagonist] is facing [Situation]. They decided to [Action].
**Question:** Was this the correct decision based on [Framework]?

A) Yes, because...
B) No, because [Reason 1] ✅
C) No, because [Reason 2]

**Justification:**
[Protagonist]'s situation required [Approach X], but they used [Approach Y].

---
`,

  video_script_online: `
# VIDEO SCRIPT: Module [N] - [Topic]
**Format:** Talking Head + B-Roll
**Duration:** 3-5 minutes
**Tone:** [Tone Adjectives: e.g., Professional, Encouraging, Direct]

---

**[SCENE 1: Talking Head - Hook]**
**(Visual: Instructor looking at camera)**

"Have you ever [Relatable Problem]?
You try to [Action], but [Obstacle] happens.
It's frustrating, right?

Today, I'm going to show you how to fix that using [Concept Name]."

---

**[SCENE 2: Concept Explanation]**
**(Visual: Animation of [Model/Framework])**

"The secret is [The Core Mechanism].
Most people think it's about [Misconception].
But actually, it's about [Truth].

Here are the 3 steps:
1. **[Step 1]**
2. **[Step 2]**
3. **[Step 3]**"

---

**[SCENE 3: Real World Example]**
**(Visual: B-Roll or Split Screen)**

"Let's look at an example.
Imagine [Scenario].
If you use [Old Way], [Bad Result] happens.
But if you use [Step 1] and [Step 2], look at the difference: [Good Result]."

---

**[SCENE 4: Call to Action]**
**(Visual: Instructor)**

"Now it's your turn.
Pause this video.
Go to your workbook and complete [Exercise Name].
Don't skip this. It's where the learning happens."
`,

  exercises_live: `
### Exercise: [Activity Name] ([Time] min)

**Format:** [Pairs/Groups/Individual]
**Objective:** Practice [Skill/Concept]

**Instructions:**
1. **Setup (5 min):** Divide into groups. Assign roles: [Role A], [Role B].
2. **Action (10 min):** [Role A] performs [Task]. [Role B] provides [Input].
3. **Debrief (5 min):** Discuss:
   - What worked?
   - What didn't?

**Observer Checklist:**
- [ ] Did they use [Technique 1]?
- [ ] Did they avoid [Pitfall]?
`,

  exercises_online: `
### Individual Exercise: [Name] ([Time] min)

**Format:** Individual Reflection
**Objective:** Analyze [Personal Situation] using [Framework].

**Instructions:**
1. **Identify** a recent situation where [Context].
2. **Apply** the [Method] to that situation.
3. **Complete** the table below.

**Template:**
| Situation | My Initial Reaction | Better Approach (using Method) |
|-----------|---------------------|--------------------------------|
| [Describe]| [Describe]          | [Describe]                     |
`,

  case_study: `
### Case Study: [Title]

**Background:**
[Company/Person Name] was facing [Critical Challenge].
They had tried [Previous Attempt], but it failed because [Reason].

**The Intervention:**
They decided to implement [Course Concept].
Specifically, they:
1. Changed [X] to [Y].
2. Adopted [Tool/Process].

**The Results:**
Within [Timeframe], they saw:
- [Metric 1] improved by [X]%.
- [Qualitative Result].

**Key Lesson:**
Success comes from [Core Principle], not just [Surface Level Action].
`
};
