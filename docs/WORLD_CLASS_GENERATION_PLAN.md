# 🌍 WORLD CLASS GENERATION PLAN (Master Bible)
**Data:** 24 Ianuarie 2026
**Statut:** LIVING DOCUMENT
**Obiectiv Suprem:** Generarea de materiale de curs "World Class" în ORICE limbă, respectând strict structura definită de utilizator și standarde pedagogice de elită.

---

## 🚨 PRINCIPII FUNDAMENTALE (NON-NEGOCIABILE)

1.  **USER AGENCY SUPREME:** Blueprint-ul editat de utilizator este UNICA Sursă de Adevăr. Orice generare anterioară sau cache este secundar.
2.  **LANGUAGE AGNOSTIC:** Sistemul nu "știe" limbi, ci le "vorbește" pe toate. Nu există hardcodări în Română/Engleză în output-ul final.
3.  **CONSISTENȚĂ TOTALĂ:** Dacă Structura are 10 module, Workbook-ul, Slide-urile și Exercițiile au exact 10 module.
4.  **CALITATE PEDAGOGICĂ:** Nu generăm "text", ci "experiențe de învățare" (Storytelling, Bloom's Taxonomy, Environment-Adapted).
5.  **DEFINIȚIE TIPURI CURS (Decizie Business):**
    *   **LIVE** = Sincron În Sală (In-person, cu materiale fizice).
    *   **ONLINE** = Sincron Virtual (Live pe Zoom/Teams, breakout rooms, Miro). *Nu facem cursuri asincrone tip Udemy.* "Scripturile Video" sunt pentru modelul Flipped Classroom (teorie pre-înregistrată, practică live).

---

## 🛠️ FAZA 1: CRITICAL FIXES (INTEGRITATE & CONTROL)
*Obiectiv: Sistemul funcționează corect, nu ignoră utilizatorul și nu amestecă limbile.*

### 🔴 PS-18: Blueprint Manual Edits Ignored
*   **Problema:** AI-ul folosește conținutul vechi ("Structure" step generat anterior) în loc de Blueprint-ul editat de user.
*   **Soluția:**
    *   În `getMainPrompt`, injectăm `course.blueprint` ca **Primary Context**.
    *   Marcăm `previous_steps` doar ca referință istorică.
    *   Instrucțiune prompt: *"You MUST follow the `CURRENT_BLUEPRINT` structure. Ignore any modules in `PREVIOUS_CONTEXT` that are not in the blueprint."*

### 🔴 PS-1: Template-uri Hardcodate & Language Leakage
*   **Problema:** `DEPTH_SPECS` conține string-uri hardcodate (ex: `<VISUAL>`, `### De ce contează...`).
*   **Soluția (Universală):**
    *   Eliminăm textul hardcodat din template-uri.
    *   Folosim **Instructional Placeholders**: În loc de `### De ce contează`, scriem în prompt: *"Create a section header equivalent to 'Why this matters' translated into ${course.language}"*.
    *   Pentru XML (Slides), instruim AI-ul: *"Keep XML tags in English (<VISUAL>), but the CONTENT inside must be in ${course.language}"*.

### 🔴 PS-5: Lipsa Validării Modulelor (Cross-Check)
*   **Problema:** Validarea numără doar cuvinte cheie ("Modul"), acceptând conținut incoerent. "Neconcordanță titluri module" apare ca eroare fals-pozitivă.
*   **Soluția:**
    *   **Strict Title Matching:** Funcția de validare va primi lista exactă de titluri din Blueprint.
    *   Verifică prezența fiecărui titlu (fuzzy match) în output.
    *   Dacă lipsesc module, respinge generarea cu eroare specifică: *"Missing content for Module: [Title]"*.

### 🔴 PS-3: `getLanguageName` fără Validare Output
*   **Problema:** Convertim 'ro' -> 'Romanian', dar nu verificăm dacă AI-ul a scris în Română. Eșec de localizare ("Red Flags", "Troubleshooting" rămân în engleză).
*   **Soluția:**
    *   Implementăm `validateLanguageDetection(text, expectedLangCode)`.
    *   Folosim un mic set de "stop words" universale (dacă e posibil) sau pur și simplu verificăm dacă AI-ul nu a început cu "Hello/Welcome" când trebuia altă limbă.

---

## 🏗️ FAZA 2: CONSISTENȚĂ STRUCTURALĂ (ARHITECTURĂ)
*Obiectiv: Toate materialele spun aceeași poveste. Eliminarea "Siloed Generation".*

### 🟠 PS-4: Lipsa "Single Source of Truth" între Materiale (Siloed Generation)
*   **Problema:** Materialele sunt generate izolat.
    *   **Fractură Scenariu:** Slide-urile cer "Schiță pagini", Exercițiile cer "Brainstorming".
    *   **Desincronizare Timpi:** Lecția 1 are 20 min în structură, dar video de 5 min și zero exerciții.
    *   **Lipsă Lipici:** Personajele (Ana Maria, Andrei) nu interacționează.
*   **Soluția:**
    *   **Context Chaining:** Toate generările ulterioare Structurii trebuie să primească (pe lângă Blueprint) și un **Summary al materialelor anterioare**.
    *   Dacă s-a generat un "Studiu de Caz" în Pasul 2, Pasul 3 (Workbook) trebuie să îl referențieze.
    *   **Global Cast & Narrative:** Definim personajele la nivel de Curs (în DNA) și le injectăm în fiecare prompt.

### 🟠 PS-7: Generare Monolitică (Token Limits)
*   **Problema:** Cursurile mari crapă la generarea Workbook/Manual (timeout).
*   **Soluția:**
    *   Extindem **Iterative Generation** (care există acum doar la Workbook/Slides) pentru TOATE tipurile de conținut lung (Exercises, Manual, Examples).
    *   Implementăm "Batch Processing" universal: Generăm Modul cu Modul, apoi concatenăm.

### 🟠 PS-12: Observability Zero & UX Bugs
*   **Problema:** Nu știm de ce a eșuat o generare. Regenerarea doar a ultimului pas (Scripturi Video) chiar dacă eroarea e la Slide-uri.
*   **Soluția:**
    *   Adăugăm logare detaliată în Supabase (`generation_logs` table).
    *   **Fix Regeneration Logic:** Backend-ul trebuie să primească lista de pași afectați, nu doar pasul curent.

---

## 💎 FAZA 3: CALITATE PEDAGOGICĂ (WORLD CLASS CONTENT)
*Obiectiv: Trecerea de la "Text AI" la "Curs Premium". Eliminarea conținutului superficial.*

### 🟡 PS-9: Golden Samples Bias & Redundancy
*   **Problema:**
    *   Toate exemplele "One-Shot" sunt despre Leadership.
    *   **Redundanță:** Același paragraf repetat în 4 documente.
    *   **Halucinații Temporale:** Video de 3-5 min cu text de 75 secunde.
*   **Soluția:**
    *   **Abstractizare Golden Samples:** În loc de conținut real, folosim [PLACEHOLDERS] în exemple.
    *   **Word Count Enforcement:** Instrucțiuni explicite pentru lungime (ex: "Min 150 words per minute of video").
    *   **Diferențiere Scop:** Prompt-uri specifice: "Video = Teorie", "Manual = Aprofundare", "Workbook = Practică".

### 🟡 PS-10: Tone Instructions Incomplete (Schizofrenie Ton)
*   **Problema:** Workbook infantil ("Salut aventurierule!") vs Manual academic.
*   **Soluția:**
    *   Definim **Tone Archetypes** unificate la nivel de curs.
    *   Forțăm consistența tonului prin DNA-ul cursului.

### 🟡 PS-11: Environment Adaptation (Live vs Online - Definiție Nouă)
*   **Problema:** Adaptarea e doar text superficial.
*   **Soluția:**
    *   **Template-uri Distincte (Actualizat):**
        *   **LIVE (In-Person):** "Break times", "Physical handouts", "Room setup".
        *   **ONLINE (Sync Virtual + Flipped):** "Breakout rooms", "Miro board links", "Screen share prompts", "Pre-watch video debrief".

### 🟡 PS-2: Dicționar Termeni Tehnici (i18n)
*   **Problema:** "Bloom's Taxonomy", "Red Flags" rămân netraduse.
*   **Soluția:**
    *   Instrucțiune explicită în Prompt: *"Translate ALL technical pedagogical terms and headers into the target language naturally."*

### 🟡 PS-19: Livrabile Auxiliare (Nou)
*   **Problema:** Exercițiile tehnice nu au fișe de lucru pas-cu-pas sau lista de tool-uri.
*   **Soluția:**
    *   Dacă un modul este "tehnic/software", prompt-ul trebuie să ceară explicit "Prerequisites List" și "Step-by-Step Guide".

---

## 🚀 FAZA 4: FINE TUNING & UX (POLISH)

### 🔵 PS-6: Modul 9/10 Conflict
*   **Problema:** Module specifice din Golden Sample (M9 Case Studies) apar forțat.
*   **Soluția:** Curățarea Golden Samples de numerotare specifică.

### 🔵 PS-8: Retry Logic Inteligent & Infinite Loop Fix
*   **Problema:** Retry-ul repetă aceeași greșeală. Loop infinit de regenerare în UI.
*   **Soluția:**
    *   Dacă eroarea e "Missing Module", retry-ul cere *doar* acel modul.
    *   Dacă eroarea e "Language", retry-ul accentuează instrucțiunile de limbă.
    *   UI/Backend check pentru limitarea regenerărilor.

### 🔵 PS-13 -> PS-17 (Bug-uri minore UX/UI)
*   Rezolvarea erorilor de afișare, formatare Markdown, etc.

---

## 📝 REGISTRUL DE MODIFICĂRI (CHANGELOG)

### [Data Curentă] - Inițializare Master Plan
- Definit Faza 1-4.
- Prioritizat PS-18 (Blueprint) și PS-1 (Language Dynamic).
