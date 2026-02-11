# 🧠 PROMPT ENGINEERING & POST-PROCESSING OVERHAUL PLAN (v2.0)
**Obiectiv:** Transformarea CourseCopilot într-un sistem adaptiv de clasă mondială ("World Class"), capabil să genereze conținut perfect calibrat atât pentru "Blue Collar" (nivel educațional redus), cât și pentru "White Collar/Academic" (nivel înalt), eliminând complet "halucinațiile conversaționale".

**Data:** 11 Februarie 2026
**Statut:** PROPOSED FOR APPROVAL

---

## 1. DIAGNOSTIC & STRATEGIE (CONCLUZII ANALIZĂ)

### Probleme Identificate:
1.  **Conversational Leakage:** AI-ul se comportă ca un chatbot, nu ca un generator de conținut (include "Okay", "Here is", "Good luck").
2.  **Audience Mismatch (Eșec Adaptare):** Utilizează terminologie academică ("Kinezică", "Proxemică") pentru audiențe care necesită limbaj operațional simplu.
3.  **Fragmentare:** Modulele nu au un fir narativ coerent ("Golden Thread").

### Soluția Strategică: "The Adaptive Engine"
Nu modificăm arhitectura codului (Next.js/Node), ci **Logica de Prompting** și **Conducta de Date (Pipeline)**.
**CRUCIAL:** Întreaga restructurare se va construi PE DEASUPRA fundației existente (Blueprint, DNA, Conversația AI anterioară).
*   **Blueprint-ul** rămâne sursa unică de adevăr pentru structură.
*   **DNA-ul** (Tone, Style, Audience) va alimenta direct noile "Complexity Sliders".
*   **Tipurile de Materiale** (Slide-uri, Manuale, Quiz-uri) vor avea reguli de generare specifice, păstrate intacte dar rafinate stilistic.

---

## 2. PLAN DE IMPLEMENTARE: PROMPT ENGINEERING

### A. Protocolul "Silent Operator" (Eliminarea Conversației)
Vom rescrie System Prompts pentru a impune formatarea strictă.
*   **Acțiune:** Trecerea de la instrucțiuni de tip "Write a course about..." la "You are a JSON/XML Generator. Output ONLY the content inside strict tags."
*   **Tehnică:** *XML Enapsulation*. AI-ul va fi instruit să pună conținutul util între tag-uri `<content_block>` și metadatele între `<meta>`. Orice text în afara acestor tag-uri va fi considerat "deșeu" și eliminat automat.

### B. Matricea de Adaptare Pedagogică (Bloom's Taxonomy Dynamic) - "DNA ACTIVATION"
Vom conecta direct DNA-ul existent la logica de selecție a prompt-ului.

| Nivel Audiență (din DNA) | Nivel Bloom Dominant | Stil Limbaj | Tip Exemple | Vocabular Interzis |
| :--- | :--- | :--- | :--- | :--- |
| **Nivel 1 (Redus/Operational)** | *Remember & Understand* | Imperativ, Direct, Simplu. Fraze scurte. | Scenarii fizice, vizuale, "Așa DA / Așa NU". | Neologisme, Concepte Abstracte (ex: "Paradigmă", "Intrinsec"). |
| **Nivel 2 (Mediu/Clerical)** | *Apply & Analyze* | Explicativ, Procedural. | Studii de caz, Flowchart-uri textuale. | Jargon academic excesiv. |
| **Nivel 3 (Înalt/Strategic)** | *Evaluate & Create* | Analitic, Nuanțat, Dezbatere. | Concepte abstracte, Strategii macro, Dileme etice. | Simplificări excesive, ton patronizator. |

*   **Implementare:** Înainte de a trimite request-ul la AI, codul va citi `Target Audience` din **Blueprint/DNA** și va injecta **blocul de instrucțiuni stilistice (Style Block)** corespunzător.

### C. "The Golden Thread" (Continuitate & Blueprint Integrity)
Pentru a evita fragmentarea și a respecta structura Blueprint-ului:
1.  **Blueprint Enforcement:** Prompt-ul va primi structura exactă a modulului curent din Blueprint și va fi interzisă devierea de la ea.
2.  **Audience Persona Summary:** Extracție directă din DNA (ex: "Ion, 45 ani, șef de tură").
3.  **Previous Module Context:** Rezumatul ultimelor 2 module generate pentru coerență.

3.  **Tone Guardrails:** "Nu folosi introduceri. Nu folosi concluzii generice. Intră direct în subiect."

---

## 3. PLAN DE IMPLEMENTARE: POST-PROCESARE (SANITIZATION)

Deoarece AI-ul poate "scăpa" uneori text nedorit, vom întări stratul de curățare (fără a modifica arhitectura de bază, doar funcțiile utilitare).

### A. The "Garbage Collector" (Regex Cleaning)
*   **Regulă:** Orice linie care începe cu: `Sure`, `Here is`, `Okay`, `I have generated`, `Please note`, `Good luck` -> **DELETE**.
*   **Regulă:** Orice text înainte de primul Header (#) sau primul tag XML -> **DELETE**.

### B. Validare Terminologică (Audience Check)
*   Dacă Audiența = Nivel 1, scanăm output-ul pentru o "Listă Neagră" de cuvinte (ex: "sinergetic", "holistic", "epistemologic").
*   **Acțiune:** Dacă sunt găsite, se declanșează un *Soft Retry* (regenerare internă) cu instrucțiunea: "Rewrite simpler. Forbidden words detected."

---

## 4. LIVRABILE & ETAPE

1.  **Pasul 1: Crearea "Style Blocks" (Fișiere de Configurare Prompt).**
    *   Definirea clară a celor 3 niveluri de complexitate.
2.  **Pasul 2: Refactorizarea Prompt-ului Principal.**
    *   Integrarea instrucțiunilor "Silent Operator" și a variabilelor dinamice.
3.  **Pasul 3: Implementarea "Sanitizer-ului".**
    *   Funcție de curățare a textului la primirea răspunsului de la AI.
4.  **Pasul 4: Testare A/B (Comparativ).**
    *   Generare Curs "Comunicare" pentru "Operatori" (Nivel 1).
    *   Generare Curs "Comunicare" pentru "Manageri HR" (Nivel 3).
    *   Compararea automată a vocabularului și structurii.

---

**NOTĂ:** Acest plan respectă regula "User Agency Supreme" din World Class Plan. Utilizatorul controlează audiența, iar sistemul se adaptează "chirurgical" la ea, fără a compromite calitatea pentru audiențele avansate.
