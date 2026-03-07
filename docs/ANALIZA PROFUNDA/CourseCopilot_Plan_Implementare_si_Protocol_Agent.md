



COURSECOPILOT.APP
PLAN DE IMPLEMENTARE
Reconectarea Mecanismelor de Calitate v2.x in Arhitectura v3.0

Include: Plan Tehnic Detaliat + Protocol de Comunicare cu Agentul AI


Estimare totala: 26-39 ore | 6 faze | 23 task-uri

PARTEA 1: DIAGNOSTIC TEHNIC
Aceasta sectiune sumarizeaza problemele identificate prin audit direct al codului sursa (index.ts v3.0 vs index.ts.bak v2.x).
1.1 Ce functioneaza corect in v3.0
Golden Path Architecture: Un singur call LLM per modul genereaza GoldenModuleData JSON monolitic
Rendering determinist: renderToMarkdown() si renderToXml() extrag 6 deliverables fara AI
AI Orchestrator cu fallback: Gemini 2.0-flash -> Gemini 2.0-flash-lite -> Moonshot
Retry logic cu exponential backoff, timeout 25s, rate limit handling (429)
Audience detection pe 5 niveluri cu keyword scoring si normalizare diacritice
Protagonist enforcer cu banned names list si regex replacement
Banned phrases detector in 6 limbi + AI validator universal
Silent Operator Protocol (XML encapsulation) pentru parsarea JSON
Knowledge base injection din ultimele 4 fisiere uploadate
1.2 Ce a fost pierdut in trecerea de la v2.x la v3.0
CRITIC: Urmatoarele mecanisme existau in v2.x, functionau, si au fost eliminate din v3.0 fara inlocuire.

Mecanism Pierdut	Impact	Detalii
DNA complet (voiceProfile, masterTimeline)	CRITIC	v3.0 genereaza DNA dar foloseste doar protagonistName. Terminology, tone, forbiddenPhrases, signaturePhrases, masterTimeline - toate IGNORATE.
getToneInstructions() cu Archetipuri	RIDICAT	The Mentor / The Coach / The Buddy + anti-schizophrenia rules + baseline quality standards. Eliminat complet.
Depth Specs (getDepthSpecs)	RIDICAT	Specificatii de profunzime per deliverable (workbook 40+ pages, exercises scenario-based). Exista in templates.ts dar NU se injecteaza in Golden Master.
Few-Shot Golden Samples	RIDICAT	Exemple detaliate per tip output (structure, workbook, slides, exercises, quiz, facilitator guide). Exista in golden-samples.ts dar NU se folosesc.
Generare iterativa cu validare	MEDIU	v2.x genera workbook/slides/exercises per modul cu batch processing, validare per modul (language, protagonist, module coverage), retry targetat per error code.
Cache layer (ai_cache)	SCAZUT	SHA-256 hash pe prompt, evita regenerari identice. Eliminat.
Usage tracking + Generation logs	SCAZUT	Token counting per model, generation logs cu error codes pentru debugging. Eliminat.
Legacy step prompts dedicate	MEDIU	exercises, examples_and_stories, facilitator_notes, slides, video_scripts - toate aveau prompts cu few-shot samples. Acum cad in catch-all generic.

1.3 Starea DNA-ului - Analiza detaliata
Ce genereaza DNA-ul (handleLegacyStep -> course_dna):
{ terminology: { participant, exercise, trainer, mandatoryTerms },
  narrativeUniverse: { protagonists: [{ name, role, initial_state }], setting, tone },
  learningPhilosophy: { manifesto: [...], rules_of_engagement: [...] } }
Ce se consuma din DNA in Golden Path (handleGoldenStep):
let protagonistName = course.dna?.narrativeUniverse?.protagonists?.[0]?.name; // SINGURA VALOARE FOLOSITA
const bannedNamesFromDNA = dna?.narrativeUniverse?.bannedNames; // MEREU undefined (campul nu exista in schema)
CONCLUZIE: DNA-ul este un CADAVRU FUNCTIONAL. Se genereaza, se salveaza in courses.dna, dar 90% din continut este ignorat de Golden Path.

PARTEA 2: PLAN DE IMPLEMENTARE
Planul este structurat in 6 faze, ordonate de la impact maxim cu risc minim la schimbari structurale mai complexe. Fiecare faza este independenta si poate fi validata separat.
PRINCIPIU FUNDAMENTAL: Arhitectura Golden Path (JSON monolitic -> rendering determinist) este CORECTA si nu trebuie rescriса. Intervenim doar pe mecanismele de alimentare si consum.

FAZA 1: Reconectarea DNA la Golden Master Prompt
Efort: 2-3 ore | Risc: SCAZUT | Impact: MARE
Obiectiv: Valorificarea informatiilor deja generate de DNA, care in prezent sunt ignorate.
T1. Injectare terminology in Golden Master Prompt
Fisier: index.ts -> handleGoldenStep(), inainte de fillPromptTemplate()
Actiune: Construieste un bloc de text din course.dna.terminology si injecteaza-l in prompt dupa {{styleBlock}}
const terminologyBlock = dna.terminology ? `### TERMINOLOGY (STRICT)\n
- Participant: "${dna.terminology.participant}"\n
- Exercise: "${dna.terminology.exercise}"\n
- Trainer: "${dna.terminology.trainer}"` : '';
Verificare: Genereaza un modul. Verifica ca in output apar termenii din DNA, nu defaults.
T2. Injectare voiceProfile (tone + forbidden phrases)
Fisier: index.ts -> handleGoldenStep()
Actiune: Citeste course.dna.voiceProfile (daca exista) si adauga instructiuni de ton in prompt.
NOTA: Schema DNA din v3.0 NU genereaza voiceProfile. Task T5 (Faza 2) adauga acest camp. Pana atunci, T2 va fi no-op graceful (verifica existenta, skip daca lipseste).
T3. Injectare learningPhilosophy
Fisier: index.ts -> handleGoldenStep()
Actiune: Adauga manifesto si rules_of_engagement ca sectiune in prompt: ### LEARNING PHILOSOPHY
Verificare: Compara output cu/fara philosophy. Tonul si abordarea trebuie sa difere vizibil.

FAZA 2: Extinderea Schema DNA
Efort: 4-6 ore | Risc: SCAZUT | Impact: CRITIC
Obiectiv: DNA-ul devine sursa completa de context. Adaugam campurile pierdute din v2.x plus campuri noi pentru domain knowledge.
T4. Adauga voiceProfile in schema DNA (readucere din v2.x)
Fisier: index.ts -> handleLegacyStep() -> course_dna prompt
Actiune: Extinde prompt-ul de generare DNA cu sectiunea voiceProfile:
"voiceProfile": {
  "formality": "buddy" | "professional" | "academic",
  "humorLevel": "none" | "light" | "heavy",
  "forbiddenPhrases": ["string"],
  "signaturePhrases": ["string"]
}
Verificare: Genereaza DNA pentru un curs de sales. Verifica ca voiceProfile contine forbiddenPhrases si signaturePhrases relevante.
T5. Adauga domainContext in schema DNA (NOU)
Fisier: index.ts -> handleLegacyStep() -> course_dna prompt
Actiune: Adauga sectiunea domainContext in prompt-ul DNA. IMPORTANT: Aceasta sectiune se populeaza din fisierele uploadate (knowledge base).
"domainContext": {
  "industryTerms": { "term": "definition" },
  "clientProfiles": [{ "type": "...", "decisionLogic": "...", "approach": "..." }],
  "productCatalog": [{ "category": "...", "items": ["..."] }],
  "competitorIntelligence": [{ "name": "...", "weaknesses": [...], "counterStrategy": "..." }],
  "negotiationFrameworks": [{ "name": "...", "steps": [...] }]
}
CRITIC: Prompt-ul DNA trebuie sa primeasca knowledge base context (fisierele uploadate) pentru a popula domainContext. Adauga apelul buildKnowledgeBaseContext() in handleLegacyStep -> course_dna.
T6. Adauga masterTimeline in schema DNA (readucere din v2.x)
Actiune: Readuce campul masterTimeline cu breakdown per modul si activitati (theory/exercise/break cu durate).
Verificare: DNA-ul generat contine masterTimeline cu module care insumeaza durata totala a cursului.

FAZA 3: Reinjectare Depth Specs + Few-Shot Samples
Efort: 2-4 ore | Risc: SCAZUT | Impact: MARE
Obiectiv: Golden Master Prompt primeste specificatii de profunzime si exemple concrete (few-shot) care existau in v2.x.
T7. Injecteaza Depth Specs in Golden Master Prompt
Fisier: index.ts -> handleGoldenStep() -> prompt construction
Sursa: prompts/templates.ts -> getDepthSpecs() EXISTA DEJA
Actiune: Apeleaza getDepthSpecs(language, envType) si adauga rezultatul ca sectiune ### DEPTH SPECIFICATIONS in prompt, DUPA schema JSON si INAINTE de ### THINKING PROCESS.
NU rescrie getDepthSpecs(). Functia exista si este corecta. Doar adauga apelul in handleGoldenStep.
T8. Injecteaza Few-Shot Samples relevante in Golden Master Prompt
Fisier: index.ts -> handleGoldenStep() -> prompt construction
Sursa: prompts/golden-samples.ts -> GOLDEN_SAMPLES EXISTA DEJA
Actiune: Selecteaza GOLDEN_SAMPLES[envSuffix] relevante si adauga ca ### GOLDEN STANDARD EXAMPLE in prompt.
LIMITA: Adauga MAXIMUM 1 sample per deliverable type. Nu trimite toate samples odata (context window overflow).
T9. Tone Instructions from DNA
Actiune: Reconstruieste functia getToneInstructions() din v2.x adaptata la v3.0. Citeste voiceProfile din DNA, mapeaza la archetipuri, injecteaza in prompt.
ATENTIE: NU copia getToneInstructions() din index.ts.bak 1:1. Adapteaza la structura v3.0 (nu mai exista course.dna.voiceProfile.formality in aceeasi forma).

FAZA 4: Extinderea Schemei GoldenModuleData
Efort: 8-12 ore | Risc: MEDIU | Impact: MEDIU-MARE
Obiectiv: Schema JSON permite structuri mai complexe (tipuri noi de sectiuni, secvente de activitati, domain context per modul).
REGULA DE AUR: Orice modificare de schema trebuie sa fie BACKWARD COMPATIBLE. Campuri noi sunt OPTIONALE. Rendering-ul existent nu se sparge.
T10. Extinde section.type cu valori noi
Fisier: types.ts -> GoldenSection.type
type: 'THEORY' | 'ACTIVITY' | 'DISCUSSION' | 'VIDEO_LESSON'
     | 'ICE_BREAKER' | 'BREAK' | 'TRANSITION' | 'WARM_UP' | 'DEBRIEF'  // NOI
IMPORTANT: Actualizeaza si Golden Master Prompt (schema JSON din prompt) si renderToMarkdown() sa trateze tipurile noi.
T11. Adauga exerciseSequence (optional, complementar exercisesDetailed)
Fisier: types.ts -> GoldenSection
Actiune: Adauga camp optional exerciseSequence: Array<Exercise> care permite multiple activitati per sectiune.
exerciseSequence?: Array<{
  title: string; type: 'ROLE_PLAY' | 'GROUP_WORKSHOP' | 'INDIVIDUAL' | 'SCENARIO' | 'ZONE_MAPPING';
  durationMinutes: number; instructionsParticipant: string; instructionsFacilitator: string;
  materialsNeeded: string[]; debriefingQuestions: string[]; successIndicators: string[];
}>;
BACKWARD COMPAT: exercisesDetailed ramane functional. exerciseSequence este alternativa pentru cazurile complexe.
T12. Adauga domainContext optional in GoldenModuleData
Fisier: types.ts -> GoldenModuleData
Actiune: Adauga camp optional domainContext?: { ... } care se populeaza din courses.dna.domainContext.
Verificare: Genereaza un modul cu DNA care contine domainContext. Verifica ca exercitiile si exemplele folosesc date din domain.
T13. Actualizeaza renderToMarkdown() pentru schema extinsa
Fisier: index.ts -> renderToMarkdown() SI utils/golden-parser.ts
Actiune: Adauga rendering pentru: tipuri noi de sectiuni, exerciseSequence, domainContext.
ATENTIE: index.ts contine o copie INLINE a rendering functions care OVERRIDE fisierele din utils/. Modifica AMBELE locatii sau elimina duplicarea.

FAZA 5: Orchestrare la Nivel de Curs
Efort: 6-8 ore | Risc: MEDIU | Impact: MARE
Obiectiv: Cursurile de durata lunga (4-8 ore) au o macro-structura coerenta cu intro, blocuri, pauze strategice si wrap-up.
T14. Creaza step nou: course_macro_structure
Fisier: index.ts -> handleLegacyStep()
Actiune: Adauga un nou step type in GLOBAL_STEPS care genereaza planul macro al cursului:
{ macroBlocks: [
    { type: 'INTRO', duration: 20, title: '...' },
    { type: 'CONTENT_BLOCK', duration: 55, moduleRef: 'module-1' },
    { type: 'BREAK', duration: 15, purpose: 'networking' },
    { type: 'CONTENT_BLOCK', duration: 50, moduleRef: 'module-2' },
    ...
    { type: 'WRAP_UP', duration: 25, title: '...' }
] }
Salvare: Salveaza in courses.macro_plan (camp nou in tabelul courses).
T15. Consuma macro_plan in Golden Path
Fisier: index.ts -> handleGoldenStep()
Actiune: Daca courses.macro_plan exista, injecteaza contextul modulului curent in prompt (pozitia in curs, ce vine inainte/dupa, constrangeri de timp).

FAZA 6: Resurectia Legacy Step Prompts
Efort: 4-6 ore | Risc: SCAZUT | Impact: MEDIU
Obiectiv: Step-urile globale care acum cad in catch-all generic primesc prompts dedicate cu few-shot samples.
T16-T23. Prompt-uri dedicate pentru fiecare legacy step
Urmatoarele step-uri trebuie sa aiba prompts proprii in handleLegacyStep():
Step Type	Sample din golden-samples.ts	Comportament Asteptat
exercises	exercises_live / exercises_online	Exercitii detaliate cu timing breakdown, debrief, troubleshooting
examples_and_stories	case_study	Exemple narative cu protagonist, context, interventie, rezultat
facilitator_notes	(din v2.x getLegacyPrompt)	Flow table minut-cu-minut, scripts verbatim, troubleshooting
facilitator_manual	(din v2.x getLegacyPrompt)	Manual complet cu scripts, transition scripts, SBI model
participant_workbook	workbook_live / workbook_online	Workbook complet 40+ pagini cu exercitii, case studies, checklists
video_scripts	video_script_live / video_script_online	Scripts cu [VISUAL]/[AUDIO], hook, CTA, scene descriptions
tests	quiz	Assessment mixt: knowledge check + scenario + self-assessment + scoring
slides	slides_live / slides_online	XML slides cu VISUAL, CONTENT, NOTES per modul
REFERINTA: Prompt-urile din v2.x (index.ts.bak -> getStepPrompt() si getLegacyPrompt()) sunt EXCELENTE ca structura. Foloseste-le ca baza, dar adapteaza la flow-ul v3.0.

PARTEA 3: PROTOCOL DE COMUNICARE CU AGENTUL AI
ATENTIE: Aceasta sectiune contine instructiunile EXACTE pe care le vei trimite agentului AI in chat. Sunt formulate ca mesaje directe, la persoana a doua. Copiaza-le si trimite-le CA ATARE.
3.1 Mesajul de initializare (trimite PRIMUL)

SISTEM DE REGULI PENTRU ACEASTA SESIUNE DE LUCRU:

Lucram pe codebase-ul CourseCopilot (supabase/functions/generate-course-content/). Inainte de orice modificare, citeste si intelege urmatoarele reguli. Le vei respecta pe toata durata sesiunii.

REGULA 1: NU INVENTEZI
Nu presupui ca un camp exista fara sa verifici in cod.
Nu presupui ca o functie este apelata fara sa gasesti apelul explicit.
Daca nu esti sigur, intreaba sau verifica. Nu improviza.
Cand spun 'adauga', inseamna adauga EXACT ce descriu. Nu adauga alte lucruri 'pentru ca ar fi util'.
REGULA 2: NU ATINGI CE NU TI SE CERE
Modifici DOAR fisierele si functiile pe care ti le specific.
Nu refactorizezi cod existent 'ca sa fie mai curat'.
Nu redenumesti variabile, functii sau fisiere.
Nu adaugi comentarii sau console.log-uri in afara zonei de lucru.
Daca observi un bug in alta parte a codului, spune-mi. NU il repara singur.
REGULA 3: VERIFICI INAINTE SA DECLARI CA AI TERMINAT
Dupa fiecare task, arata-mi EXACT ce ai modificat (diff).
Daca task-ul cere 'injecteaza X in prompt', arata-mi prompt-ul final generat cu X inclus.
Daca task-ul cere 'verifica ca Y apare in output', ruleaza un test sau simuleaza un apel si arata-mi output-ul.
NU spune 'Am terminat, ar trebui sa functioneze'. Arata-mi CA functioneaza.
REGULA 4: BACKWARD COMPATIBILITY
Orice camp nou in types.ts este OPTIONAL (cu ?:).
Orice ramura noua in rendering are fallback la comportamentul existent.
Daca modific schema DNA, DNA-urile existente in baza de date NU trebuie sa se sparga.
Testeaza: un curs existent cu DNA vechi trebuie sa functioneze identic dupa modificare.
REGULA 5: O FAZA LA UN MOMENT DAT
Lucram pe o singura faza din plan. Nu sari la faza urmatoare fara confirmarea mea.
In cadrul unei faze, lucram pe un singur task. Confirma completarea fiecarui task individual.
Nu combina task-uri 'pentru eficienta'. Fiecare task se face si se verifica separat.

3.2 Mesaje per Task (copiaza si trimite cand e nevoie)

TASK T1: Injectare terminology din DNA in Golden Master Prompt
Mesajul de trimis:

Deschide index.ts. Du-te la functia handleGoldenStep(). Gaseste locul unde se construieste promptul cu fillPromptTemplate(GOLDEN_MASTER_PROMPT, {...}). INAINTE de acest apel, adauga un bloc care: (1) Citeste course.dna.terminology (daca exista), (2) Construieste un string terminologyBlock cu format: '### TERMINOLOGY RULES (STRICT)\n- Participant: X\n- Exercise: Y\n- Trainer: Z\n- Mandatory Terms: ...' (3) Adauga terminologyBlock la prompt DUPA styleBlock. NU modifica GOLDEN_MASTER_PROMPT din prompts/golden-master.ts. Adaugi terminologyBlock la prompt-ul construit in handleGoldenStep(). Dupa ce termini, arata-mi codul modificat SI un exemplu de prompt generat cu terminology inclus.

TASK T2: Injectare voiceProfile din DNA
Mesajul de trimis:

In aceeasi zona din handleGoldenStep() unde ai adaugat terminologyBlock (T1), adauga un al doilea bloc: voiceProfileBlock. (1) Citeste course.dna.voiceProfile (DACA exista - campul inca nu este generat). (2) Daca exista, construieste: '### VOICE & TONE (FROM DNA)\n- Formality: X\n- Humor: Y\n- Forbidden Phrases: Z\n- Signature Phrases: W'. (3) Daca NU exista, voiceProfileBlock = '' (string gol). NU arunca eroare, NU pune default. (4) Adauga voiceProfileBlock la prompt. Arata-mi codul si confirma ca daca course.dna.voiceProfile este undefined, promptul se genereaza normal fara aceasta sectiune.

TASK T4: Extinde prompt-ul DNA cu voiceProfile
Mesajul de trimis:

Du-te la handleLegacyStep() in index.ts. Gaseste blocul if (step_type === 'course_dna'). In prompt-ul de acolo, adauga campul voiceProfile in OUTPUT FORMAT JSON. Structura: { formality: 'buddy'|'professional'|'academic', humorLevel: 'none'|'light'|'heavy', forbiddenPhrases: ['string'], signaturePhrases: ['string'] }. NU sterge nimic din prompt-ul existent. Doar adauga voiceProfile ca o sectiune noua in JSON-ul cerut. Adauga si in fallback-ul JSON (blocul catch) un voiceProfile default: { formality: 'professional', humorLevel: 'light', forbiddenPhrases: [], signaturePhrases: [] }. Arata-mi prompt-ul modificat complet si fallback-ul.

TASK T5: Adauga domainContext in DNA
Mesajul de trimis:

Doi pasi: PAS 1: In handleLegacyStep() -> course_dna, INAINTE de a construi prompt-ul, apeleaza buildKnowledgeBaseContext(supabase, course.id, course.language) pentru a obtine textul din fisierele uploadate. Injecteaza acest text in prompt ca: '### UPLOADED REFERENCE MATERIALS\n{knowledgeBase}\nUse these to populate domainContext fields.' PAS 2: In acelasi prompt, adauga sectiunea domainContext in OUTPUT FORMAT JSON: { industryTerms: {}, clientProfiles: [], productCatalog: [], competitorIntelligence: [], negotiationFrameworks: [] }. Instructiunea in prompt trebuie sa spuna EXPLICIT: 'Populate domainContext ONLY from the reference materials above. If no materials are provided, leave arrays empty.' Arata-mi prompt-ul final complet.

TASK T7: Injecteaza Depth Specs in Golden Master Prompt
Mesajul de trimis:

In handleGoldenStep(), dupa ce construiesti envConstraints dar INAINTE de fillPromptTemplate(), adauga: const depthSpecs = getDepthSpecs(course.language, envType).workbook; (importa getDepthSpecs din prompts/templates.ts). Apoi adauga depthSpecs la prompt DUPA schema JSON si INAINTE de ### THINKING PROCESS. ATENTIE: getDepthSpecs() exista deja in prompts/templates.ts. NU o rescrie, NU o modifica. Doar importa si apeleaza. Verifica ca functia exista si ca exportul functioneaza. Daca nu functioneaza importul (fiindca index.ts e bundled), copiaza DOAR apelul inline. Arata-mi codul.

3.3 Mesaj de corectie (cand agentul greseste)

Cand inventeaza cod care nu exista:
STOP. Ai facut referinta la [functia/campul X] dar aceasta NU exista in codul actual. Verifica in fisierul [Y] si arata-mi linia exacta unde apare. Daca nu o gasesti, inseamna ca nu exista si NU o folosesti.
Cand modifica mai mult decat i se cere:
STOP. Ti-am cerut sa modifici DOAR [X]. Vad ca ai modificat si [Y] si [Z]. Revino la versiunea anterioara si modifica STRICT ce ti-am cerut. Nimic mai mult.
Cand declara ca a terminat fara sa arate dovada:
Nu accept 'ar trebui sa functioneze'. Arata-mi: (1) Diff-ul exact al modificarilor. (2) Un exemplu de input -> output care demonstreaza ca modificarea functioneaza. (3) Confirma ca nu ai spart nimic existent prin backward compatibility.
Cand face presupuneri:
STOP. Ai presupus ca [X]. Pe ce te bazezi? Arata-mi linia de cod unde este definit/apelat. Daca nu poti, inseamna ca presupui, nu stii. Intreaba-ma in loc sa presupui.

PARTEA 4: SUMAR EXECUTIV

Faza	Descriere	Ore	Risc	Impact	Task-uri
1	Reconectare DNA -> Prompt	2-3	Scazut	MARE	T1, T2, T3
2	Extindere Schema DNA	4-6	Scazut	CRITIC	T4, T5, T6
3	Depth Specs + Few-Shot	2-4	Scazut	MARE	T7, T8, T9
4	Extindere GoldenModuleData	8-12	Mediu	MEDIU+	T10-T13
5	Orchestrare curs	6-8	Mediu	MARE	T14, T15
6	Legacy Step Prompts	4-6	Scazut	MEDIU	T16-T23
TOTAL	6 faze, 23 task-uri	26-39			T1 - T23

Ordinea de executie recomandata
Faza 1 (T1-T3) - Impact imediat, zero risc. Incepe aici.
Faza 2 (T4-T6) - Fundamentul pentru toate fazele ulterioare.
Faza 3 (T7-T9) - Amplifica calitatea output-ului.
Faza 6 (T16-T23) - Se poate face in paralel cu Faza 4.
Faza 4 (T10-T13) - Schema changes, necesita testare atenta.
Faza 5 (T14-T15) - Ultima, depinde de toate celelalte.

REAMINTIRE: Arhitectura Golden Path este CORECTA. Nu o rescriem. Reconectam mecanismele amputate si extindem schema unde e nevoie.