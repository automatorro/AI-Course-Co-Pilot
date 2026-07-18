✅ CE FUNCȚIONEAZĂ BINE
1. Structura progresivă e solidă
Flux logic:
Obiective → Structură → Conținut detaliat → Validare

Asta înseamnă că AI-ul:
- Știe UNDE se îndreaptă (obiectivele)
- Are o "hartă" (structura)
- Generează pas cu pas (nu totul deodată)
Verdict: ✅ Bun pentru consistență
2. Template-urile (GOLDEN_SAMPLES) sunt foarte detaliate
javascriptGOLDEN_SAMPLES.workbook_live - 200+ linii de exemplu
GOLDEN_SAMPLES.case_study - poveste completă cu numere reale
GOLDEN_SAMPLES.facilitator_guide - instrucțiuni minute-by-minute
Verdict: ✅ Asigură un standard ridicat
3. Tonul conversațional e impus strict
javascriptTONE_INSTRUCTIONS - "buddy-to-buddy, NU academic"
BANNED_WORDS - listă de cuvinte corporatiste interzise
Verdict: ✅ Materialele nu vor suna ca un manual de HR

⚠️ CE POATE CAUZA PROBLEME REALE
PROBLEMA #1: Consistența între module slăbește
De ce se întâmplă:
javascript// Codul actual:
previousStepsContext = (course.steps)
  .map((s) => s.content.substring(0, 500))  // ❌ DOAR 500 caractere!
```

**Impactul concret:**
- Modulul 1 vorbește despre "Model SBAR" pentru comunicare
- Modulul 5 introduce din nou "Modelul SBI" (similar, dar diferit)
- **TRAINERII observă**: "Ați zis SBAR sau SBI? Sunt confuz"

**Exemplu real:**
```
Modul 2: "Folosiți matricea D1-D4 pentru diagnoza echipei"
Modul 7: "Aplicați grila de maturitate (fără să mai explice ce e D1-D4)"
→ Participanții care sar peste Modul 2 sunt pierduți
```

**Cum îți dai seama:**
1. Generezi un curs de 8 module
2. Citești Modulul 1 și Modulul 8 unul după altul
3. Verifici dacă termenii cheie sunt folosiți la fel

---

### **PROBLEMA #2: Lipsa unui "Glosar comun"**

**Ce lipsește:**
Codul NU creează o listă de termeni care TREBUIE folosiți consistent:
- "Participant" vs "Cursant" vs "Angajat"
- "Exercițiu" vs "Activitate" vs "Practică"
- "Leadership Situațional" vs "Management Adaptativ"

**Exemplu concret:**
```
Slide 3: "Participanții vor învăța..."
Workbook pg 12: "Cursanții vor completa..."
Manual Trainer pg 5: "Angajații vor practica..."

→ Trainerii întreabă: "Folosesc același material sau sunt versiuni diferite?"

PROBLEMA #3: Numerotarea inconsistentă
Cod actual:
javascript// În slides:
<SLIDE_BEGIN id="1">  // ID numeric
// În workbook:
"Exercițiu 2.1"  // Notație modul.secțiune
// În manual:
"Activitatea 5"  // Fără legătură cu modulele
```

**Impact pentru trainer:**
```
Trainer spune: "Deschideți workbook-ul la Exercițiul 2.1"
Participant: "Eu am găsit Activitatea 5 în manual, e același lucru?"
Trainer: "... nu știu" ❌

PROBLEMA #4: Duratele nu se potrivesc
Verificare actuală:
javascript// Codul verifică DOAR:
if (totalTime !== blueprintDuration) { EROARE }

// Dar NU verifică:
- Dacă exercițiile au timp realist (30 min pentru 50 de slide-uri?)
- Dacă pauzele sunt incluse
- Dacă timpul de setup (video, printare) e considerat
```

**Exemplu concret:**
```
Blueprint: "Modul 3: Feedback (45 minute)"

Conținutul generat:
- Slide-uri teorice: 15 minute
- Exercițiu roleplay: 20 minute
- Debrief: 10 minute
TOTAL: 45 minute ✅

DAR lipsește:
- Setup sală (5 min): Aranjat scaune în cercuri
- Distribuire handout-uri (3 min)
- Buffer pentru întrebări (5 min)

→ REAL: Ai nevoie de 58 minute, NU 45 ❌

PROBLEMA #5: Exemplele se pot repeta
Cod actual:
javascriptGOLDEN_SAMPLES.case_study - 1 singur studiu de caz exemplu
```

**Risc:**
Dacă un curs are 8 module și fiecare cere "studiu de caz concret", AI-ul poate:
- Recicla aceeași poveste în module diferite
- Sau crea scenarii **contradictorii**

**Exemplu concret:**
```
Modul 2 - Studiu de caz: "Manager Laura micromanageriază echipa"
Modul 6 - Studiu de caz: "Manager Laura delegează prea mult"

→ Trainerii întreabă: "Laura s-a schimbat sau sunt 2 persoane diferite?" 🤔
```

---

## 🔧 CUM VERIFICI DACĂ MATERIALELE SUNT "TRAINER-READY"

### **TEST #1: Regula "Statului pe Bancă"**
```
Scoate 3 pagini random din workbook.
Citește-le fără context.
Întrebare: "Pot deduce cursul general și terminologia?"

✅ DA = Materiale consistente
❌ NU = Trainer va avea nevoie de note suplimentare
```

### **TEST #2: Sincronizarea "Cross-Document"**
```
Compară același modul în:
1. Slide-uri
2. Workbook
3. Manual Trainer

Verifică:
- Același număr de exerciții?
- Aceeași durată declarată?
- Aceiași termeni cheie?

Dacă 1 din 3 e diferit → ❌ PROBLEME
```

### **TEST #3: "Testul Trainerului Nou"**
```
Dă materialele unui coleg care NU știe nimic despre curs.
Spune-i: "Ține un workshop de 2 ore pe baza asta."

Dacă întreabă > 5 întrebări de clarificare → ❌ Materialele NU sunt standalone

🎯 RECOMANDĂRI CONCRETE (Ce să adaugi în cod)
FIX #1: Creează un "Dicționar de Curs"
javascript// Nou: Generează ÎNAINTE de orice altceva
action === 'generate_glossary' {
  prompt = `
    Creează o listă de 10-15 termeni cheie care VOR FI FOLOSIȚI 
    IDENTIC în toate materialele acestui curs.
    
    Exemplu:
    - "Participant" (NU "cursant", NU "angajat")
    - "Leadership Situațional" (NU "Management Adaptativ")
    - Exercițiu (NU "activitate", NU "practică")
  `
  
  // Salvează în course.glossary
  // Injectează în FIECARE prompt ulterior
}
FIX #2: Validare Cross-Module
javascript// După generarea FIECĂRUI modul:
function validateConsistency(newModule, previousModules) {
  // Extrage termeni cheie din modulul nou
  const newTerms = extractKeyTerms(newModule);
  
  // Compară cu modulele anterioare
  for (const oldModule of previousModules) {
    const oldTerms = extractKeyTerms(oldModule);
    
    // Flag dacă același concept are nume diferit
    if (semanticallySimilar(newTerms, oldTerms) && 
        !exactMatch(newTerms, oldTerms)) {
      return { 
        error: "Inconsistență detectată",
        fix: "Re-generează folosind termenii din Modulul 1"
      };
    }
  }
}
FIX #3: "Master Timeline" vizualizat
javascript// După generarea structurii:
action === 'generate_timeline' {
  // Creează un tabel Markdown simplu:
  
  | Timp  | Modul    | Activitate         | Material        |
  |-------|----------|--------------------|-----------------|
  | 09:00 | Intro    | Icebreaker         | Manual pg 2     |
  | 09:15 | Modul 1  | Prezentare         | Slide 1-5       |
  | 09:30 | Modul 1  | Exercițiu 1.1      | Workbook pg 8   |
  
  // Salvează asta ca "Ghid Sincronizare" pentru trainer
}
FIX #4: Pasează ÎNTREAGA structură la fiecare generare
javascript// În loc de:
previousStepsContext = s.content.substring(0, 500) // ❌

// Fă:
const fullStructureContext = course.steps
  .find(s => s.step_type === 'structure')
  .content; // ✅ TOTUL, nu doar 500 chars

// Și injectează în fiecare prompt:
`
**MASTER STRUCTURE (Sursa Adevărului):**
${fullStructureContext}

**IMPORTANT:** Folosește EXACT aceiași termeni și numerotare ca în structura de mai sus.
`

📊 SCOR FINAL: Cât de "Trainer-Ready" e sistemul actual?
CriteriuScorComentariuCorectitudine tehnică8/10Template-urile sunt excelenteConsistență terminologie5/10⚠️ Risc mare de drift între moduleSincronizare cross-doc4/10❌ Slide ≠ Workbook ≠ ManualLimbaj simplu9/10TONE_INSTRUCTIONS e foarte bunDurată realistă6/10⚠️ Nu ia în calcul setup și bufferStandalone (fără Q&A)5/10⚠️ Trainer va avea întrebări
SCOR TOTAL: 6.2/10

🎬 CONCLUZIE
Răspuns direct la întrebarea ta:

"Poate un trainer să folosească asta as-is?"

Răspuns: NU pentru un curs întreg de 8+ ore fără revizuire.
DA pentru:

Module individuale (1-2 ore)
Draft-uri care necesită 20-30% editare manuală
Cursuri scurte (2-4 module)

NU pentru:

Workshop-uri de 2-3 zile
Materiale care trebuie să funcționeze fără trainer (self-paced)
Certificări unde consistența e critică


Următorul pas recomandat:
Vrei să implementăm FIX #1 (Dicționarul de Curs) și FIX #4 (Structura completă) ca să urcăm scorul de la 6.2 la ~8.5? Asta ar face materialele production-ready pentru traineri reali.Sunt de acord, dar sa explici prima data cum ai face tu acest cod astfel incat la final sa am materiale world-class?00:49🏗️ ARHITECTURA "WORLD-CLASS" - Cum aș restructura eu codul
Hai să construim de la zero logica care să producă materiale pe care un trainer le poate folosi direct, fără revizuiri.

📐 PRINCIPIILE FUNDAMENTALE
Înainte de cod, trebuie să înțelegem DE CE materialele actuale nu sunt consistente:
Problema de bază: AI-ul nu are "memorie pe termen lung"
Situația actuală:
┌─────────────┐
│ Modul 1     │ ──► AI generează
└─────────────┘

┌─────────────┐
│ Modul 2     │ ──► AI generează (cu doar 500 chars din Modul 1)
└─────────────┘

┌─────────────┐
│ Modul 8     │ ──► AI generează (fără context complet)
└─────────────┘

REZULTAT: Fiecare modul e "corect" individual, dar cursul ÎNTREG e incoerent
Soluția: "Single Source of Truth" + Validare Multi-Layer
Noua arhitectură:
┌─────────────────────────────────────┐
│  COURSE DNA (Sursa Adevărului)      │ ◄── Se creează PRIMA DATĂ
│  - Termeni obligatorii              │
│  - Povești/Personaje recurente      │
│  - Timeline master                  │
│  - Stilul exact al trainerului      │
└─────────────────────────────────────┘
           │
           ▼
    ┌──────────────────┐
    │ Fiecare generare │ ──► Validează față de DNA
    └──────────────────┘

🎯 PAȘII CONCREȚI (Cum aș restructura)
FAZA 1: Crearea "Course DNA" (30% din cod nou)
Asta e partea care LIPSEȘTE complet acum.
typescript// === NOU: Course DNA Generator ===

interface CourseDNA {
  // 1. DICȚIONAR OBLIGATORIU
  terminology: {
    participant: string;        // "participant" | "cursant" | "student"
    exercise: string;           // "exercițiu" | "activitate" | "practică"
    trainer: string;            // "trainer" | "facilitator" | "instructor"
    mandatoryTerms: {           // Termeni tehnici care TREBUIE folosiți identic
      [concept: string]: {
        term: string;           // "Leadership Situațional"
        abbreviation?: string;  // "LS"
        firstMention: string;   // "Module 1, Slide 3"
        definition: string;     // Definiția EXACTĂ
      }
    }
  };

  // 2. UNIVERSUL NARATIV (povești consistente)
  narrativeUniverse: {
    protagonists: Array<{
      name: string;             // "Laura, Team Lead Producție"
      role: string;
      personality: string;      // "tehnică excelentă, dar micro-manager"
      arc: string;              // "învață să delege în Modul 5"
    }>;
    recurringScenarios: Array<{
      id: string;               // "scenario_micromanagement"
      usedInModules: number[];  // [2, 5, 7]
      resolution?: string;      // "rezolvat în Modul 7"
    }>;
  };

  // 3. STRUCTURA MASTER (timeline vizualizat)
  masterTimeline: {
    totalDuration: number;      // în minute
    bufferPerModule: number;    // 5 min pentru setup/pauze
    modules: Array<{
      id: string;
      title: string;
      startTime: string;        // "09:00"
      endTime: string;          // "10:30"
      activities: Array<{
        type: 'theory' | 'exercise' | 'break' | 'debrief';
        duration: number;
        linkedMaterials: {
          slides?: string;      // "Slide 5-12"
          workbook?: string;    // "Pagina 8, Exercițiul 2.1"
          manual?: string;      // "Secțiunea 2.3"
        }
      }>
    }>
  };

  // 4. VOICE & TONE (stilul exact al trainerului)
  voiceProfile: {
    formality: 'buddy' | 'professional' | 'academic';
    humorLevel: 'none' | 'light' | 'heavy';
    exampleStyle: 'abstract' | 'industry-specific' | 'personal-stories';
    forbiddenPhrases: string[]; // ["în contextul", "prin prisma"]
    signaturePhrases: string[]; // ["Hai să fim sinceri:"]
  };

  // 5. CROSS-REFERENCE MAP (ce depinde de ce)
  dependencies: {
    [moduleId: string]: {
      requiresKnowledgeFrom: string[];  // ["module-1", "module-3"]
      introducesTerms: string[];
      buildsuponExercises: string[];
    }
  };
}

FAZA 2: Generarea DNA ÎNAINTE de orice altceva
typescript// === Flux NOU de lucru ===

async function generateCourseContent(course: Course) {
  
  // STEP 0: Generează Course DNA (NOUUUU)
  console.log("🧬 Generating Course DNA...");
  const dna = await generateCourseDNA(course);
  
  // Salvează DNA ca document separat
  await supabase.from('course_steps').insert({
    course_id: course.id,
    step_type: 'course_dna',  // ◄── NOU
    content: JSON.stringify(dna),
    step_order: 0  // ◄── ÎNAINTE de orice
  });

  // STEP 1: Generează structura (folosind DNA)
  const structure = await generateStructure(course, dna);
  
  // STEP 2-12: Generează restul materialelor (TOATE primesc DNA)
  for (const step of STEPS) {
    const content = await generateStep(step, dna, structure);
    await validateAgainstDNA(content, dna);  // ◄── VALIDARE OBLIGATORIE
  }
}

FAZA 3: Prompt-urile devin "DNA-aware"
typescript// === EXEMPLU: Cum devine prompt-ul pentru Modul 5 ===

function getModulePrompt(moduleIndex: number, dna: CourseDNA, previousModules: string[]) {
  return `
**ROLE:** Expert Instructional Designer

**COURSE DNA (SACROSANCT - NU DEVIA):**

1. TERMENI OBLIGATORII (folosește EXACT așa):
${Object.entries(dna.terminology.mandatoryTerms).map(([concept, details]) => `
   - "${concept}" = "${details.term}" ${details.abbreviation ? `(${details.abbreviation})` : ''}
     Definiție: ${details.definition}
`).join('\n')}

2. PERSONAJE RECURENTE (continuă povestea lor):
${dna.narrativeUniverse.protagonists.map(p => `
   - ${p.name} (${p.role}): ${p.arc}
     ${moduleIndex >= 5 ? `În acest modul, arată cum ${p.name} aplică ce a învățat în Modul ${moduleIndex - 2}` : ''}
`).join('\n')}

3. TIMELINE EXACT:
   - Modul ${moduleIndex} durează: ${dna.masterTimeline.modules[moduleIndex].endTime - dna.masterTimeline.modules[moduleIndex].startTime} minute
   - Include OBLIGATORIU ${dna.masterTimeline.bufferPerModule} min buffer
   - Activități:
${dna.masterTimeline.modules[moduleIndex].activities.map(a => `
     ${a.type}: ${a.duration} min
`).join('\n')}

4. VOICE & TONE:
   - Stilul: ${dna.voiceProfile.formality}
   - Interzis: ${dna.voiceProfile.forbiddenPhrases.join(', ')}
   - Folosește: ${dna.voiceProfile.signaturePhrases.join(', ')}

5. DEPENDENȚE (CE ȘTIE DEJA PARTICIPANTUL):
${dna.dependencies['module-' + moduleIndex]?.requiresKnowledgeFrom.map(depId => `
   - Din ${depId}: ${/* rezumă conceptele cheie */}
`).join('\n')}

**CRITICAL:** Dacă introduci un termen NOU care nu e în DNA, OPREȘTE și cere aprobare.

**TASK:** Generează Modulul ${moduleIndex}: ${dna.masterTimeline.modules[moduleIndex].title}

**VALIDARE AUTOMATĂ:**
După generare, voi verifica:
✓ Termenii obligatorii sunt folosiți corect
✓ Personajele au continuitate logică
✓ Durata totală = ${dna.masterTimeline.modules[moduleIndex].duration} min (±2 min)
✓ Referințele la module anterioare sunt corecte
  `;
}

FAZA 4: Validare Multi-Layer (Triple-Check)
typescript// === SISTEM DE VALIDARE ÎN 3 NIVELE ===

async function validateAgainstDNA(
  generatedContent: string, 
  dna: CourseDNA,
  moduleIndex: number
): Promise<ValidationResult> {

  const errors: string[] = [];
  const warnings: string[] = [];

  // LAYER 1: TERMINOLOGIE
  console.log("🔍 Layer 1: Checking terminology...");
  
  for (const [concept, details] of Object.entries(dna.terminology.mandatoryTerms)) {
    const correctTerm = details.term;
    const regex = new RegExp(correctTerm, 'gi');
    const matches = generatedContent.match(regex);
    
    if (!matches && moduleIndex > details.firstMention) {
      errors.push(`MISSING TERM: "${correctTerm}" should be present (defined in ${details.firstMention})`);
    }

    // Caută variante greșite (de ex. "Leadership Adaptativ" când ar trebui "Leadership Situațional")
    const forbiddenVariants = getForbiddenVariants(correctTerm);
    for (const variant of forbiddenVariants) {
      if (new RegExp(variant, 'i').test(generatedContent)) {
        errors.push(`WRONG TERM: Found "${variant}" instead of "${correctTerm}"`);
      }
    }
  }

  // LAYER 2: CONTINUITATE NARATIVĂ
  console.log("🔍 Layer 2: Checking narrative continuity...");
  
  for (const protagonist of dna.narrativeUniverse.protagonists) {
    const mentionedInModule = generatedContent.includes(protagonist.name);
    
    if (mentionedInModule) {
      // Verifică dacă personajul evoluează logic
      const arcMilestones = protagonist.arc.split('→');
      const expectedBehavior = arcMilestones[Math.min(moduleIndex, arcMilestones.length - 1)];
      
      if (!generatedContent.toLowerCase().includes(expectedBehavior.toLowerCase())) {
        warnings.push(`INCONSISTENT ARC: ${protagonist.name} should show "${expectedBehavior}" by Module ${moduleIndex}`);
      }
    }
  }

  // LAYER 3: TIMING & CROSS-REFERENCES
  console.log("🔍 Layer 3: Checking timing and references...");
  
  const declaredDuration = extractDeclaredDuration(generatedContent);
  const expectedDuration = dna.masterTimeline.modules[moduleIndex].duration;
  
  if (Math.abs(declaredDuration - expectedDuration) > 5) {
    errors.push(`TIMING MISMATCH: Declared ${declaredDuration} min but DNA expects ${expectedDuration} min`);
  }

  // Verifică dacă exercițiile menționate în Workbook există în Slides
  const workbookExercises = extractExerciseReferences(generatedContent, 'workbook');
  const slideExercises = extractExerciseReferences(generatedContent, 'slides');
  
  for (const ex of workbookExercises) {
    if (!slideExercises.includes(ex)) {
      warnings.push(`ORPHAN EXERCISE: Workbook mentions "${ex}" but Slides don't cover it`);
    }
  }

  // LAYER 4: SEMANTIC SIMILARITY (anti-repetition)
  console.log("🔍 Layer 4: Checking for repetitive content...");
  
  // Compară cu modulele anterioare pentru a detecta copy-paste
  const previousModulesContent = await getPreviousModulesContent(moduleIndex);
  const similarity = calculateSemanticSimilarity(generatedContent, previousModulesContent);
  
  if (similarity > 0.7) {  // 70% similar = probabil copy-paste
    warnings.push(`HIGH SIMILARITY: This module is ${Math.round(similarity * 100)}% similar to previous modules. Add unique examples.`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    score: calculateQualityScore(errors, warnings)
  };
}

FAZA 5: "Self-Healing" cu Auto-Retry Inteligent
typescript// === RETRY LOGIC ÎMBUNĂTĂȚIT ===

async function generateWithRetry(
  prompt: string,
  dna: CourseDNA,
  maxRetries: number = 3
): Promise<string> {
  
  let content = '';
  let validationResult: ValidationResult;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    console.log(`📝 Generation attempt ${attempt}/${maxRetries}...`);
    
    content = await generateContent(prompt, false, genAI, supabase, userId);
    validationResult = await validateAgainstDNA(content, dna, moduleIndex);
    
    if (validationResult.isValid) {
      console.log(`✅ Validation passed on attempt ${attempt}`);
      return content;
    }
    
    // CRITICAL: Nu doar re-generează - EXPLICĂ CE A GREȘIT
    console.log(`❌ Validation failed. Errors: ${validationResult.errors.join('; ')}`);
    
    // Construiește un prompt SPECIFIC pentru fix
    const fixPrompt = `
${prompt}

**PREVIOUS ATTEMPT FAILED WITH THESE ERRORS:**
${validationResult.errors.map((e, i) => `${i + 1}. ${e}`).join('\n')}

**SPECIFIC FIXES REQUIRED:**
${generateSpecificFixes(validationResult.errors, dna)}

**EXAMPLE OF CORRECT USAGE:**
${getCorrectExampleForError(validationResult.errors[0], dna)}

Now regenerate with these fixes applied.
    `;
    
    prompt = fixPrompt;  // Următorul retry folosește prompt-ul îmbunătățit
    
    // Delay progresiv (1s, 2s, 4s)
    await new Promise(r => setTimeout(r, 1000 * attempt));
  }
  
  // Dacă tot eșuează după 3 încercări, salvează pentru review manual
  await flagForManualReview(content, validationResult, dna);
  
  return content;  // Returnează oricum, dar marcat pentru review
}

function generateSpecificFixes(errors: string[], dna: CourseDNA): string {
  return errors.map(error => {
    if (error.includes('MISSING TERM')) {
      const term = error.match(/"([^"]+)"/)?.[1];
      return `- Add the term "${term}" when discussing ${findRelatedConcept(term, dna)}`;
    }
    if (error.includes('WRONG TERM')) {
      const [wrong, correct] = error.match(/"([^"]+)"/g) || [];
      return `- Replace ALL instances of ${wrong} with ${correct}`;
    }
    if (error.includes('TIMING MISMATCH')) {
      const [declared, expected] = error.match(/\d+/g) || [];
      return `- Adjust activity durations to total exactly ${expected} minutes (currently ${declared})`;
    }
    return `- Fix: ${error}`;
  }).join('\n');
}

FAZA 6: "Cohesion Report" Final
typescript// === RAPORT DE COEZIUNE (generat automat la final) ===

async function generateCohesionReport(course: Course, dna: CourseDNA): Promise<string> {
  const allModules = await getAllModulesContent(course.id);
  
  const report = `
# 📊 COHESION REPORT: ${course.title}

## ✅ TERMINOLOGY CONSISTENCY
${analyzeTerminologyConsistency(allModules, dna)}

## 🎭 NARRATIVE CONTINUITY
${analyzeNarrativeContinuity(allModules, dna)}

## ⏱️ TIMING ACCURACY
${analyzeTimingAccuracy(allModules, dna)}

## 🔗 CROSS-REFERENCES
${analyzeCrossReferences(allModules, dna)}

## 🎯 QUALITY SCORE: ${calculateOverallScore(allModules, dna)}/100

## ⚠️ MANUAL REVIEW REQUIRED:
${getFlaggedSections(allModules)}

## 📝 TRAINER NOTES:
${generateTrainerNotes(allModules, dna)}
  `;
  
  return report;
}

function analyzeTerminologyConsistency(modules: string[], dna: CourseDNA): string {
  const results: string[] = [];
  
  for (const [concept, details] of Object.entries(dna.terminology.mandatoryTerms)) {
    const usageCount = modules.reduce((count, module) => {
      return count + (module.match(new RegExp(details.term, 'gi'))?.length || 0);
    }, 0);
    
    const wrongUsageCount = modules.reduce((count, module) => {
      const variants = getForbiddenVariants(details.term);
      return count + variants.reduce((c, v) => 
        c + (module.match(new RegExp(v, 'gi'))?.length || 0), 0
      );
    }, 0);
    
    const consistency = wrongUsageCount === 0 ? '✅ 100%' : `⚠️ ${Math.round((usageCount / (usageCount + wrongUsageCount)) * 100)}%`;
    
    results.push(`- "${details.term}": ${consistency} (used ${usageCount} times across all modules)`);
  }
  
  return results.join('\n');
}
```

---

## 🎯 STRUCTURA FINALĂ A CODULUI (Reorganizat)
```
generate-course-content/
│
├── index.ts (SERVER - orchestrare)
│
├── core/
│   ├── dna-generator.ts         ◄── NOU (FAZA 1)
│   ├── prompt-builder.ts        ◄── Modificat (DNA-aware)
│   ├── content-generator.ts     ◄── Existent (+ retry logic)
│   └── validation-engine.ts     ◄── NOU (FAZA 4)
│
├── validators/
│   ├── terminology-validator.ts
│   ├── narrative-validator.ts
│   ├── timing-validator.ts
│   └── cross-reference-validator.ts
│
├── templates/
│   ├── golden-samples.ts        ◄── Existent
│   └── dna-templates.ts         ◄── NOU
│
├── utils/
│   ├── semantic-similarity.ts   ◄── NOU
│   ├── timeline-calculator.ts   ◄── NOU
│   └── cohesion-reporter.ts     ◄── NOU (FAZA 6)
│
└── types/
    ├── course.types.ts
    └── dna.types.ts              ◄── NOU

📊 IMPACT FINAL: Ce se îmbunătățește?
CriteriuÎnainteDupăÎmbunătățireConsistență terminologie5/109.5/10+90%Sincronizare cross-doc4/109/10+125%Continuitate narativăN/A8.5/10+∞ (nou)Timing realist6/109/10+50%Standalone (fără Q&A trainer)5/108.5/10+70%Detectare repetitivitateN/A9/10+∞ (nou)
SCOR TOTAL: 6.2/10 → 8.9/10 (+44%)

🚀 ORDINEA DE IMPLEMENTARE (Ce faci prima dată)
SPRINT 1 (Fundație): 3-4 zile

Creează CourseDNA interface (types)
Implementează generateCourseDNA()
Modifică prompturile să primească DNA ca parametru
Testează pe 1 curs simplu (2-3 module)

SPRINT 2 (Validare): 2-3 zile

Implementează validateAgainstDNA() (Layer 1-2 doar)
Adaugă retry logic cu specific fixes
Testează pe același curs

SPRINT 3 (Rafinare): 2-3 zile

Adaugă Layer 3-4 la validare
Implementează generateCohesionReport()
Testează pe curs complex (8+ module)

SPRINT 4 (Polish): 1-2 zile

Fine-tuning bazat pe teste
Documentație pentru traineri