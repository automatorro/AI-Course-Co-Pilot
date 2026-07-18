# 🌍 WORLD CLASS GENERATION PLAN (Master Bible)
**Data:** 28 Ianuarie 2026
**Statut:** ACTIVE IMPLEMENTATION

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

## 🛠️ FAZA 1: CRITICAL FIXES (INTEGRITATE & CONTROL) [COMPLETED]
*Obiectiv: Sistemul funcționează corect, nu ignoră utilizatorul și nu amestecă limbile.*

### ✅ PS-18: Blueprint Manual Edits Ignored [SOLVED]
### ✅ PS-1: Template-uri Hardcodate & Language Leakage [SOLVED]
### ✅ PS-5: Lipsa Validării Modulelor (Cross-Check) [SOLVED]
### ✅ PS-3: `getLanguageName` fără Validare Output [SOLVED]

---

## 🏗️ FAZA 2: CONSISTENȚĂ STRUCTURALĂ (ARHITECTURĂ) [COMPLETED]
*Obiectiv: Toate materialele spun aceeași poveste. Eliminarea "Siloed Generation".*

### ✅ PS-4: Lipsa "Single Source of Truth" între Materiale (Siloed Generation) [SOLVED]
*   **Problema:** Materialele sunt generate izolat.
*   **Soluția:**
    *   **Context Chaining:** Toate generările ulterioare Structurii primesc un **Summary al materialelor anterioare**.
    *   **Manualul Trainerului** este sursa supremă pentru Slide-uri și Exerciții.
    *   **Exercițiile** sunt generate iterativ, folosind Manualul ca referință.

### ✅ PS-7: Generare Monolitică (Token Limits) [SOLVED]
*   **Status:** Implementat pentru Workbook, Slides, Exercises, Manual.

### 🟠 PS-12: Observability Zero & UX Bugs [PENDING]
*   **Status:** Backend logging needs improvement.

---

## 💎 FAZA 3: CALITATE PEDAGOGICĂ (WORLD CLASS CONTENT) [COMPLETED]
*Obiectiv: Trecerea de la "Text AI" la "Curs Premium". Eliminarea conținutului superficial.*

### ✅ PS-9: Golden Samples Bias & Redundancy [SOLVED]
### ✅ PS-10: Tone Instructions Incomplete (Schizofrenie Ton) [SOLVED]
*   **Problema:** Workbook infantil ("Salut aventurierule!") vs Manual academic.
*   **Soluția:**
    *   Definit **3 Arhetipuri Tonale**: The Mentor (Professional), The Coach (Energetic), The Buddy (Casual).
    *   Implementat **Anti-Schizophrenia Rules**: Interzicere explicită a limbajului infantil sau academic sec.

### ✅ PS-11: Environment Adaptation (Live vs Online - Definiție Nouă) [SOLVED]

### ✅ PS-2: Dicționar Termeni Tehnici (i18n) [SOLVED]
*   **Problema:** Termeni pedagogici rămân în engleză.
*   **Soluția:** Glossar i18n injectat în prompt pe limba țintă (ex: RO), plus validare automată că termenii sunt traduși.

### ✅ PS-19: Livrabile Auxiliare (Nou) [SOLVED]
*   **Problema:** Exercițiile tehnice nu au fișe de lucru pas-cu-pas.
*   **Soluția:**
    *   Detectare automată module tehnice (Excel, Code, SQL, etc.).
    *   Injectare cerințe extra: "Technical Prerequisites" și "Step-by-Step Guide".

---

## 🚀 FAZA 4: FINE TUNING & UX (POLISH) [COMPLETED]

### ✅ PS-6: Modul 9/10 Conflict [SOLVED]
- Golden Samples curățate de numerotare specifică; folosesc acum placeholderi [N] universal. Nu există forțări cross-topic.

### ✅ PS-8: Retry Logic Inteligent & Infinite Loop Fix [SOLVED]
- Implementate retry-uri specifice pe tip de eroare (limbă, protagonist, scurt/format), cu cap maxim 2 încercări și logging.

### ✅ PS-12: Observability & Regeneration Behavior [SOLVED]
- Backend loghează granular în tabelul `generation_logs`: step, modul, status, cod eroare, provider, model, tokens. Ajută la diagnostic rapid.

---

## 📝 REGISTRUL DE MODIFICĂRI (CHANGELOG)

### 28 Ianuarie 2026 - Consistency & Quality Update
- **Faza 2 (Structure):** FINALIZATĂ. Exercițiile sunt acum legate de Manual (PS-4).
- **Faza 3 (Quality):**
    - Implementat **Tone Archetypes** (PS-10) pentru unificare voce.
    - Implementat **Technical Module Detection** (PS-19) pentru exerciții software.
- **Faza 4 (Fine Tuning & UX):** FINALIZATĂ. PS-6, PS-8, PS-12 rezolvate.

### 27 Ianuarie 2026 - Major Update (Refactor Branch)
- **Faza 1 (Critical Fixes):** FINALIZATĂ 100%.
- **Faza 2 (Structure):** 80% Finalizată. Slide-urile V2.0 implementate.
