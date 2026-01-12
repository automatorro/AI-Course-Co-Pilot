# ANALIZĂ TEHNICĂ COMPLETĂ: index.ts - Sistem de Generare Cursuri

**Data analizei:** 12 ianuarie 2026  
**Fișier analizat:** supabase/functions/generate-course-content/index.ts  
**Scop:** Identificarea tuturor problemelor, inconsistențelor și bug-urilor

---

## 1. PROBLEMA CRITICĂ: GENERARE INSUFICIENTĂ DE SLIDE-URI

### 1.1 Evidența Problemei

**Rezultat observat:** 7 slide-uri generate pentru un curs de 8 ore (480 minute), desi in primul document generat, Structura completa, este vorba despre 16 slideuri

**Calcul teoretic necesar:**
- Specificație din cod: `1 slide per 6-8 minutes of presentation time`
- Pentru 8 ore (480 min): **TEORETIC 60-80 slide-uri necesare, DAR SE POATE MAXIMIZA IMPACTUL CU MAXIM 20-30 DE SLIDEURI, DEPINDE DE CAZ**
- Realitate: **7 slide-uri** generate
- **DEFICIT: 25-40 slide-uri lipsă (88-91% din conținut lipsește!)**

### 1.2 Cauza din Cod

**Locație:** Funcția `getStepPrompt()` - case `'slides'`:

```typescript
case 'slides':
  return `
    **TASK**: Generate Slide Content.
    **GOAL**: Create the visual support structure for the presentation.
    ${TONE_INSTRUCTIONS}
    **LANGUAGE**: The content MUST be in **${course.language}**.
    **STRUCTURE**: Generate **5-8 slides** for EVERY module in the MASTER STRUCTURE.
    **VALIDATION**: If the structure has 8 modules, you should generate content for 8 modules.
    ...
  `;
```

**PROBLEMA IDENTIFICATĂ:**

❌ **Linia "Generate 5-8 slides for EVERY module"** este AMBIGUĂ:
- AI-ul poate interpreta: "5-8 slide-uri în TOTAL pentru toate modulele" (interpretare greșită)
- SAU: "5-8 slide-uri PER module" (interpretare corectă)

❌ **NU există verificare numerică în validation:**
- Funcția `validateGeneratedContent()` NU verifică numărul de slide-uri
- NU compară cu durata cursului
- NU forțează respectarea regulii "1 slide per 6-8 min"

### 1.3 Dovezi Suplimentare

**Din DEPTH_SPECS.slides:**
```typescript
slides: `
  **DEPTH SPECIFICATIONS (Slides):**
  - **QUANTITY**: Generate 1 slide per 6-8 minutes of presentation time.
  ...
`
```

✅ Specificația este corectă în DEPTH_SPECS  
❌ Dar promptul final NU o aplică corect  
❌ Și validarea NU o verifică

### 1.4 Soluția Propusă

```typescript
case 'slides':
  // Calculate required slides based on course duration
  const courseDurationMinutes = extractDurationInMinutes(blueprintDuration);
  const minSlides = Math.floor(courseDurationMinutes / 8);
  const maxSlides = Math.ceil(courseDurationMinutes / 6);
  
  return `
    **TASK**: Generate Slide Content for ENTIRE Course.
    **GOAL**: Create complete visual support for ${blueprintDuration} course.
    
    **CRITICAL QUANTITY REQUIREMENT:**
    - Course duration: ${blueprintDuration} (${courseDurationMinutes} minutes)
    - Rule: 1 slide per 6-8 minutes
    - YOU MUST generate MINIMUM ${minSlides} slides, MAXIMUM ${maxSlides} slides
    - Distribute slides proportionally across all modules
    
    **EXAMPLE DISTRIBUTION:**
    If structure has 8 modules over ${courseDurationMinutes} min:
    - Module 1 (90 min) → 11-15 slides
    - Module 2 (60 min) → 8-10 slides
    - ... (continue for all modules)
    
    **VALIDATION**: Count your slides before submitting. If count < ${minSlides}, REGENERATE.
    ...
  `;
```

**Validation update needed:**
```typescript
if (step_type === 'slides') {
  const slideCount = (text.match(/<SLIDE_BEGIN/gi) || []).length;
  const courseDurationMinutes = extractDurationInMinutes(course.blueprint?.estimated_duration || '8 hours');
  const minRequired = Math.floor(courseDurationMinutes / 8);
  
  if (slideCount < minRequired) {
    return {
      isValid: false,
      reason: `Only ${slideCount} slides generated. Minimum required: ${minRequired} (1 per 8 min). Generate more slides.`
    };
  }
}
```

---

## 2. PROBLEMA: CONFUZIA ÎNTRE 'structure' ȘI 'lesson plans'

### 2.1 Evidența Problemei

**Fișierul "Structură_completă.docx" conține:**
- ❌ Icebreaker-uri: "Lanțul de Cuvinte - Fortem"
- ❌ Instrucțiuni pas-cu-pas: "5 min discuție, 5 min share"
- ❌ Referințe la slide-uri: "SLIDE 1-2"
- ❌ Întrebări pentru facilitator: "De ce comunicarea este esențială?"

**Ar trebui să conțină doar:**
- ✅ Titluri de module și lecții
- ✅ Durate alocate
- ✅ Obiective de învățare (1 linie per module)

### 2.2 Cauza din Cod

**Locație:** `getStepPrompt()` - case `'structure'`:

```typescript
case 'structure':
  return `
    ...
    - **GRANULARITY**: Break down broad topics into specific sub-topics/lessons 
      to ensure deep content coverage.
    ...
  `;
```

**PROBLEMA:**
- ❌ "deep content coverage" sugerează detalii de implementare
- ❌ NU specifică explicit: "This is just a TOC, NOT the actual content"
- ❌ NU exclude explicit: icebreaker-uri, exerciții, slide-uri

### 2.3 Soluția Propusă

```typescript
case 'structure':
  return `
    **TASK**: Design the Course Structure (High-Level Architecture).
    **GOAL**: Create a Table of Contents (TOC), NOT the detailed content.
    
    **WHAT TO INCLUDE:**
    - Module titles and total durations
    - Lesson/Section titles and durations
    - Learning objectives (1 sentence per module)
    - Logical flow markers (e.g., "Simple → Complex")
    
    **WHAT TO EXCLUDE (CRITICAL - DO NOT INCLUDE):**
    ❌ Icebreaker activities or specific exercise names
    ❌ Step-by-step facilitator instructions
    ❌ Slide references (e.g., "SLIDE 1-2", "vizual: grafic")
    ❌ Detailed timing breakdowns within lessons (e.g., "5 min discussion, 5 min share")
    ❌ Facilitator questions or scripts
    ❌ Activity descriptions or handout details
    
    **LEVEL OF ABSTRACTION:**
    Think of this as a BOOK'S TABLE OF CONTENTS, not the book chapters.
    You are designing the SKELETON, not the FLESH.
    
    **FORMAT EXAMPLE:**
    MODUL 1: Introducere în Comunicarea Interdepartamentală (1.5 ore)
    Obiectiv: Înțelegerea importanței comunicării și identificarea barierelor
    ├── Lecția 1.1: Importanța Comunicării (30 min)
    ├── Lecția 1.2: Barierele Comune (30 min)
    └── Lecția 1.3: Studiu de Caz (30 min)
    
    **DURATION CONSTRAINT**: Total must equal ${blueprintDuration} EXACTLY.
  `;
```

---

## 3. PROBLEMA: REDUNDANȚA "Exemple și studii de caz"

### 3.1 Evidența Problemei

Fișierul "Exemple_și_studii_de_caz.docx" conține **CONȚINUT IDENTIC** cu "Structură_completă.docx".

**Cauză:** AI-ul nu înțelege că trebuie să genereze conținut NOU.

### 3.2 Cauza din Cod

**Locație:** `getStepPrompt()` - case `'examples_and_stories'`:

```typescript
case 'examples_and_stories':
  return `
    **TASK**: Generate Examples, Stories, and Case Studies.
    **GOAL**: Make the theory concrete and relatable using storytelling.
    **INSTRUCTIONS**:
    - **QUANTITY**: Provide at least **2 concrete examples** and **1 Case Study/Story** per module.
    - **SCOPE**: Cover EVERY module in the MASTER STRUCTURE.
    - **LANGUAGE**: The content MUST be in **${course.language}**.
    ${TONE_INSTRUCTIONS}
  `;
```

**PROBLEMA:**
- ❌ NU specifică că trebuie să fie DIFERIT de conținutul din Structure
- ❌ NU specifică formatul sau lungimea unui studiu de caz
- ❌ NU dă exemple de "case study bun" vs "story snippet din structure"

### 3.3 Soluția Propusă

```typescript
case 'examples_and_stories':
  return `
    **TASK**: Generate Extended Case Studies and Examples.
    **GOAL**: Create NEW, detailed stories that EXPAND on the concepts from the structure.
    
    **CRITICAL RULE:**
    ❌ DO NOT copy or repeat content from the Structure step.
    ✅ Create ORIGINAL stories (300-500 words each) with full narrative.
    
    **WHAT YOU WILL RECEIVE:**
    - A structure that mentions topics/concepts
    - Example: "Lecția 1.3: Studiu de caz - Bariera de Jargon"
    
    **WHAT YOU MUST CREATE:**
    - A FULL, DETAILED case study for that topic
    - Include: Context (who, what, where) → Challenge → Actions → Result → Lessons Learned
    - Add dialogue, emotions, specific details
    
    **FORMAT PER MODULE:**
    ## Module X: [Title]
    
    ### Case Study X.1: [Original Title]
    **Context:** (100 words - set the scene)
    **Challenge:** (100 words - what went wrong)
    **Actions Taken:** (150 words - step by step)
    **Result:** (100 words - outcome)
    **Key Lessons:** (50 words - 3-5 bullet points)
    
    ### Example X.1: [Topic]
    [Concrete scenario, 200 words]
    
    ### Example X.2: [Topic]
    [Concrete scenario, 200 words]
    
    **QUANTITY**: Minimum 1 case study + 2 examples per module.
    **VALIDATION**: Each case study must be 400+ words. Each example 150+ words.
  `;
```

**Add validation:**
```typescript
if (step_type === 'examples_and_stories') {
  // Check for minimum length per module
  const caseStudyMatches = text.match(/###\s*Case Study/gi);
  const expectedCount = blueprint?.modules?.length || 0;
  
  if (!caseStudyMatches || caseStudyMatches.length < expectedCount) {
    return {
      isValid: false,
      reason: `Expected at least ${expectedCount} case studies (one per module), found ${caseStudyMatches?.length || 0}.`
    };
  }
  
  // Check for minimum length (should be substantial)
  if (text.length < expectedCount * 1000) {
    return {
      isValid: false,
      reason: `Case studies seem too short. Expected ~${expectedCount * 1000} chars for ${expectedCount} modules, got ${text.length}.`
    };
  }
}
```

---

## 4. PROBLEMA: "Manualul trainerului" NU atinge profunzimea promisă

### 4.1 Evidența Problemei

**DEPTH_SPECS.manual promite:**
```typescript
- **FLOW TABLE**: Create a minute-by-minute agenda table.
- **SCRIPTS**: Write full scripts for Opening, Transitions, and Closing.
- **TROUBLESHOOTING**: Include "What if..." and/or "Have you ever had to...?" and/or "Has it ever happened to you...?"scenarios
```

**Realitate în output:**
- ❌ Nu există flow table minute-by-minute (doar timing per activitate)
- ❌ Nu există scripturi complete pentru Opening/Closing
- ❌ Nu există scenarii "What if..."

### 4.2 Cauza din Cod

**Locație:** `getStepPrompt()` - case `'facilitator_manual'`:

```typescript
case 'facilitator_manual':
  return `
    **TASK**: Compile Facilitator Manual.
    **GOAL**: A comprehensive, step-by-step guide for the trainer.
    ${DEPTH_SPECS.manual}
    ${TONE_INSTRUCTIONS}
    **SCOPE**: Cover EVERY module in the MASTER STRUCTURE.
  `;
```

**PROBLEMA:**
- ❌ Doar trimite la DEPTH_SPECS.manual, dar NU insistă pe fiecare element
- ❌ NU dă exemple concrete de "flow table" sau "troubleshooting scenario"
- ❌ NU validează prezența acestor elemente

### 4.3 Soluția Propusă

```typescript
case 'facilitator_manual':
  return `
    **TASK**: Compile Comprehensive Facilitator Manual.
    **GOAL**: A complete, ready-to-use guide for trainers.
    
    **MANDATORY SECTIONS (ALL REQUIRED):**
    
    1. **OPENING SCRIPT** (500+ words):
       - Welcome message (2 min)
       - Ice-breaker with exact instructions (5 min)
       - Course objectives and housekeeping (3 min)
       - Write word-for-word what the trainer should say
    
    2. **MINUTE-BY-MINUTE FLOW TABLE** (Markdown table):
       | Time | Duration | Activity | Trainer Actions | Materials Needed |
       |------|----------|----------|-----------------|------------------|
       | 09:00 | 5 min | Welcome | Say: "Bun venit..." | None |
       | 09:05 | 10 min | Icebreaker | Explain rules, form groups | Flipchart |
       ... (continue for ENTIRE course)
    
    3. **MODULE-BY-MODULE LESSON PLANS**:
       For EACH module in the Master Structure:
       ### Module X: [Title] ([Duration])
       
       **Learning Objectives:**
       - [Objective 1]
       
       **Materials Needed:**
       - [Item 1]
       
       **Step-by-Step Delivery:**
       **[00:00-00:10]** Opening
       - Say: "..." (exact script)
       - Do: [action]
       - Watch for: [common issues]
       
       **[00:10-00:25]** Activity
       - Instructions: "..." (word-for-word)
       - Form groups of: [N]
       - Timer: [X] minutes
       
       **Transition to Next Module:**
       - Say: "..." (script)
    
    4. **TROUBLESHOOTING GUIDE** (Minimum 7 scenarios):
       **Scenario:** Participants are silent during discussions
       **Solution:** [3-5 concrete tactics]
       
       **Scenario:** One participant dominates
       **Solution:** [3-5 concrete tactics]
       
       **Scenario:** Activity takes longer than planned
       **Solution:** [3-5 concrete tactics]
       
       [Continue for: tech issues, controversial topics, low energy, mixed skill levels, 
        unexpected questions, time running short, missing materials]
    
    5. **CLOSING SCRIPT** (300+ words):
       - Recap key learnings (3 min)
       - Call to action (2 min)
       - Feedback collection (3 min)
       - Thank you and next steps (2 min)
    
    **LENGTH TARGET:** 15-20 pages for an 8-hour course.
    
    **VALIDATION CHECKLIST:**
    Before submitting, verify:
    [ ] Opening script is 500+ words
    [ ] Flow table covers EVERY minute of the course
    [ ] Each module has step-by-step lesson plan
    [ ] Troubleshooting guide has 7+ scenarios
    [ ] Closing script is 300+ words
  `;
```

**Add validation:**
```typescript
if (step_type === 'facilitator_manual') {
  const hasFlowTable = /\|\s*Time\s*\|/.test(text); // Check for table with "Time" column
  const hasOpeningScript = /opening\s*script/i.test(text) && text.length > 3000;
  const troubleshootingCount = (text.match(/\*\*Scenario:\*\*/gi) || []).length;
  
  if (!hasFlowTable) {
    return {
      isValid: false,
      reason: "Facilitator Manual missing minute-by-minute flow table. MUST include Markdown table with Time column."
    };
  }
  
  if (!hasOpeningScript) {
    return {
      isValid: false,
      reason: "Facilitator Manual missing detailed Opening Script (500+ words)."
    };
  }
  
  if (troubleshootingCount < 5) {
    return {
      isValid: false,
      reason: `Facilitator Manual has only ${troubleshootingCount} troubleshooting scenarios. Need minimum 7.`
    };
  }
}
```

---

## 5. PROBLEMA: PRACTICE RATIO NU E ENFORCED

### 5.1 Evidența Problemei

**Blueprint declară:** "80% practice"  
**Realitate:** Lecția 1.1 are doar 50% practică (10 min teorie, 10 min practică)

### 5.2 Cauza din Cod

**Locație:** Validation în `validateGeneratedContent()`:

```typescript
// --- MODULE COUNT VALIDATION (GLOBAL) ---
// Checks if all modules are present
// BUT: NO CHECK for practice ratio!
```

**LIPSEȘTE:** Orice verificare a practice ratio

### 5.3 Soluția Propusă

```typescript
// Add to validateGeneratedContent()

if (step_type === 'structure' || step_type === 'timing_and_flow') {
  // Extract practice ratio from blueprint if specified
  const targetPracticeRatio = blueprint?.practice_ratio || 0.7; // Default 70%
  
  // Parse timing from text
  const timingRegex = /(\d+)\s*min.*?(teor|lectur|prezent|discurs)/gi;
  const exerciseRegex = /(\d+)\s*min.*?(exerci|practic|activ|lucru|grup|role\s*play)/gi;
  
  let theoryMinutes = 0;
  let practiceMinutes = 0;
  
  let match;
  while ((match = timingRegex.exec(text)) !== null) {
    theoryMinutes += parseInt(match[1]);
  }
  
  while ((match = exerciseRegex.exec(text)) !== null) {
    practiceMinutes += parseInt(match[1]);
  }
  
  const totalMinutes = theoryMinutes + practiceMinutes;
  const actualRatio = totalMinutes > 0 ? practiceMinutes / totalMinutes : 0;
  
  if (actualRatio < targetPracticeRatio - 0.1) { // Allow 10% tolerance
    return {
      isValid: false,
      reason: `Practice ratio is ${Math.round(actualRatio * 100)}%, below target of ${Math.round(targetPracticeRatio * 100)}%. Add more practical activities.`
    };
  }
}
```

**Also update the structure prompt:**
```typescript
case 'structure':
  const practiceRatio = course.blueprint?.practice_ratio || 0.8;
  return `
    ...
    **PRACTICE RATIO REQUIREMENT:**
    - Target: ${Math.round(practiceRatio * 100)}% of time should be practical activities
    - Example for 60 min module: ${Math.round(60 * (1 - practiceRatio))} min theory, ${Math.round(60 * practiceRatio)} min practice
    - Practical = exercises, discussions, role-plays, case studies, simulations
    - Theory = lectures, presentations, slide reviews
    
    **VALIDATION**: Sum your timing. If practice < ${Math.round(practiceRatio * 100)}%, add more activities.
  `;
```

---

## 6. PROBLEMA: ITERATIVE WORKBOOK GENERATION poate TIMEOUT

### 6.1 Evidența Problemei

**Cod actual:**
```typescript
const BATCH_SIZE = 3; // Process 3 modules at a time

for (let i = 0; i < modules.length; i += BATCH_SIZE) {
  const batch = modules.slice(i, i + BATCH_SIZE);
  const batchResults = await Promise.all(batch.map(async (module, index) => {
    ...
  }));
}
```

**PROBLEMA:**
- ✅ Pentru 8 module: 3 batches (3+3+2) → OK
- ❌ Pentru 12 module: 4 batches (3+3+3+3) → Risc de timeout (4 × aprox. 30 sec = 2 min)
- ❌ Pentru 20 module: 7 batches → GARANTAT timeout

### 6.2 Soluția Propusă

**Opțiunea 1: Dynamic batch sizing**
```typescript
async function generateWorkbookIteratively(
  course: Course,
  blueprint: any,
  fileContext: string,
  genAI: any
): Promise<string> {
  const sections: string[] = [];
  
  // 1. Intro (fast)
  const intro = await generateContent(introPrompt, false, genAI);
  sections.push(intro);

  // 2. Modules with DYNAMIC batching
  const modules = blueprint.modules;
  const TIMEOUT_LIMIT_SEC = 120; // Edge function timeout (example)
  const AVG_TIME_PER_MODULE_SEC = 20; // Estimate
  const MAX_BATCH_SIZE = Math.floor(TIMEOUT_LIMIT_SEC / AVG_TIME_PER_MODULE_SEC) - 2; // Buffer
  const BATCH_SIZE = Math.min(MAX_BATCH_SIZE, 3); // Cap at 3 for safety
  
  console.log(`[Iterative] Using batch size: ${BATCH_SIZE} for ${modules.length} modules`);
  
  for (let i = 0; i < modules.length; i += BATCH_SIZE) {
    const batch = modules.slice(i, i + BATCH_SIZE);
    // ... rest of code
  }
}
```

**Opțiunea 2: Return partial results with continuation token**
```typescript
// In main serve() function
if (action === 'generate_workbook_part' && part_type === 'module_batch') {
  const { start_index, batch_size } = await req.json();
  const modules = course.blueprint.modules.slice(start_index, start_index + batch_size);
  
  const batchResults = await Promise.all(modules.map(async (module, index) => {
    const globalIndex = start_index + index;
    const modulePrompt = getWorkbookModulePrompt(course, module, globalIndex, fileContext);
    return await generateContent(modulePrompt, false, genAI);
  }));
  
  return new Response(JSON.stringify({
    content: batchResults.join('\n\n---\n\n'),
    next_start_index: start_index + batch_size,
    completed: start_index + batch_size >= course.blueprint.modules.length
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status: 200
  });
}
```

---

## 7. PROBLEME MINORE DAR IMPORTANTE

### 7.1 TONE_INSTRUCTIONS - Cuvinte Banned Incomplete

**Cod actual:**
```typescript
const TONE_INSTRUCTIONS = `
...
1. BANNED WORDS & PHRASES:
   Never use: "reprezintă", "facilitează", "optimizează", "componentă esențială", 
   "în contextul", "prin prisma", "având în vedere", "prezenta lucrare", "în cele ce urmează".
...
```

**PROBLEMA:** Lista este incompletă. Lipsesc alte clișee corporate comune în română:

**Soluție:**
```typescript
1. BANNED WORDS & PHRASES:
   Never use:
   - Corporate jargon: "reprezintă", "facilitează", "optimizează", "componentă esențială"
   - Academic phrases: "în contextul", "prin prisma", "având în vedere", "prezenta lucrare", 
     "în cele ce urmează", "astfel încât", "respectiv", "cu alte cuvinte"
   - Passive constructions: "se va proceda la", "va fi efectuată", "este necesar să"
   - Redundant phrases: "în vederea", "în scopul de a", "în cadrul procesului de"
```

### 7.2 Validation NU verifică LIMBAJ

**Cod actual:**
```typescript
function validateGeneratedContent(text: string, step_type: string, blueprint: any) {
  if (!text || text.length < 100) return { isValid: false, reason: "Content too short" };
  // ... alte verificări
}
```

**LIPSEȘTE:** Verificare că textul este în limba corectă

**Soluție:**
```typescript
function validateGeneratedContent(text: string, step_type: string, blueprint: any, course: Course) {
  // ... existing checks
  
  // Language validation
  if (course.language) {
    const languageCode = getLanguageCode(course.language); // Reverse mapping
    if (!isTextInLanguage(text, languageCode)) {
      return {
        isValid: false,
        reason: `Content appears to be in wrong language. Expected: ${course.language}`
      };
    }
  }
}

// Helper function (basic heuristic)
function isTextInLanguage(text: string, langCode: string): boolean {
  const sampleSize = Math.min(text.length, 500);
  const sample = text.substring(0, sampleSize).toLowerCase();
  
  // Language-specific common words (simple heuristic)
  const patterns: Record<string, string[]> = {
    'ro': ['și', 'de', 'la', 'în', 'cu', 'să', 'pentru', 'este', 'sunt'],
    'en': ['the', 'and', 'to', 'of', 'in', 'is', 'for', 'that', 'with'],
    // Add more as needed
  };
  
  const expectedWords = patterns[langCode] || [];
  const foundCount = expectedWords.filter(word => sample.includes(word)).length;
  
  return foundCount >= expectedWords.length * 0.5; // At least 50% match
}
```

### 7.3 Error Handling - Status 200 pentru toate erorile

**Cod actual:**
```typescript
} catch (e) {
  const msg = e instanceof Error ? e.message : String(e);
  return new Response(JSON.stringify({ error: msg }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status: 200 // ← PROBLEM: Changed from 500/429 to 200
  });
}
```

**PROBLEMA:** 
- Client-ul nu poate distinge între succes și eroare
- Toate erorile par success (200 OK)

**Soluție:**
```typescript
} catch (e) {
  const msg = e instanceof Error ? e.message : String(e);
  const isRateLimit = msg.includes("429") || msg.toLowerCase().includes("quota");
  const isTimeout = msg.toLowerCase().includes("timeout");
  
  // Use proper HTTP status codes
  const statusCode = isRateLimit ? 429 : (isTimeout ? 408 : 500);
  
  return new Response(JSON.stringify({ 
    error: msg,
    type: isRateLimit ? 'rate_limit' : (isTimeout ? 'timeout' : 'server_error')
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status: statusCode
  });
}
```

### 7.4 Cache Key - Nu include parametrii importanți

**Cod actual:**
```typescript
const cacheKey = await sha256(prompt + (isJsonMode ? '_json' : ''));
```

**PROBLEMA:**
- Dacă același prompt este folosit pentru limbi diferite, cache-ul va returna limba greșită
- Dacă același prompt este folosit pentru environment diferit, cache-ul va returna conținutul greșit

**Soluție:**
```typescript
const cacheKey = await sha256(
  prompt + 
  (isJsonMode ? '_json' : '') + 
  `_${course.language}` + 
  `_${course.environment}` +
  `_${step_type}`
);
```

---

## 8. SUMAR PROBLEME IDENTIFICATE

### 8.1 Probleme CRITICE (Afectează calitatea substanțial)

| Nr | Problemă | Severitate | Impact |
|----|----------|------------|--------|
| 1 | Slide-uri insuficiente (7 vs 20-30 necesare, dar 16 in acest caz identificate in structura) | 🔴 CRITICĂ | 90% din slide-uri lipsă |
| 2 | "Structură" conține lesson plans în loc de TOC | 🔴 CRITICĂ | Confuzie între fișiere, redundanță |
| 3 | "Exemple și studii de caz" e redundant | 🟠 MAJORĂ | Fișier inutil, duplicate content |
| 4 | "Manual trainer" incomplet (lipsă flow table, scripts) | 🟠 MAJORĂ | Trainer nu poate folosi manualul |

### 8.2 Probleme MAJORE (Afectează funcționalitatea)

| Nr | Problemă | Severitate | Impact |
|----|----------|------------|--------|
| 5 | Practice ratio nu e enforced | 🟠 MAJORĂ | Cursuri prea teoretice |
| 6 | Iterative workbook poate da timeout pentru cursuri mari | 🟡 MEDIE | Fail pentru 15+ module |
| 7 | Validation NU verifică număr de slide-uri | 🟠 MAJORĂ | Bad output ajunge la user |

### 8.3 Probleme MINORE (Afectează polish-ul)

| Nr | Problemă | Severitate | Impact |
|----|----------|------------|--------|
| 8 | Banned words list incompletă | 🟢 MINORĂ | Stil suboptimal |
| 9 | Lipsă validare limbaj | 🟡 MEDIE | Posibil output în limba greșită |
| 10 | Error status 200 pentru toate erorile | 🟡 MEDIE | UX confuz |
| 11 | Cache key fără parametri | 🟢 MINORĂ | Cache hit incorect în edge cases |

---

## 9. PRIORITIZARE FIX-URI

### 9.1 Urgent (Fix acum)

1. **Fix generare slide-uri** - Adaugă calcul și validare număr slide-uri
2. **Fix prompt 'structure'** - Exclude explicit lesson plan details
3. **Fix validation pentru facilitator_manual** - Enforce flow table și scripts

### 9.2 Important (Fix în următoarea iterație)

4. **Fix prompt 'examples_and_stories'** - Specifică conținut nou, nu duplicate
5. **Adaugă validation practice ratio** - Enforce 70-80% practice
6. **Fix error handling** - Status codes corecte

### 9.3 Nice-to-have (Fix când ai timp)

7. **Extinde banned words list**
8. **Adaugă language validation**
9. **Îmbunătățește cache key**
10. **Optimizează iterative generation pentru cursuri mari**

---

## 10. PLAN DE ACȚIUNE RECOMANDAT

### Faza 1: Hot Fixes (1-2 ore)
1. Modifică prompt pentru 'slides' cu calcul explicit
2. Modifică prompt pentru 'structure' cu exclusions clare
3. Adaugă validation pentru număr slide-uri

### Faza 2: Core Fixes (3-4 ore)
4. Rescrie prompt pentru 'facilitator_manual' cu checklist mandatory
5. Rescrie prompt pentru 'examples_and_stories' anti-redundancy
6. Adaugă validation pentru practice ratio

### Faza 3: Polish (1-2 ore)
7. Fix error handling
8. Extinde banned words
9. Îmbunătățește cache keys

### Faza 4: Testing
10. Regenerează cursul "Comunicarea Interdepartamentală"
11. Verifică că toate problemele sunt rezolvate
12. Rulează pilot cu un grup mic

---

## CONCLUZIE

**Starea actuală a codului:** 🟡 FUNCȚIONAL dar cu DEFECTE MAJORE

**Probleme identificate:** 11 probleme (4 critice/majore, 7 medii/minore)


**Impact după fix:** 
- Calitate materiale: de la 6/10 la 9/10
- Utilizabilitate: de la "Needs rework" la "Ready for pilot"

**Recomandare:** Implementează fix-urile din Faza 1 și 2 înainte de a genera noi cursuri.