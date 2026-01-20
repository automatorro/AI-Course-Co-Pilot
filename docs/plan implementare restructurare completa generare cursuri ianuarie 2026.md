ată o analiză critică a planului din docs/RESTRUCTURARE TOTALA GENERARE CURSURI.md , urmată de propunerea mea tehnică pentru a duce generarea la nivelul "World Class".

# PARTEA 1: CRITICĂ CONSTRUCTIVĂ A PLANULUI EXISTENT
Am analizat documentul RESTRUCTURARE TOTALA GENERARE CURSURI.md și am comparat cu starea actuală a codului ( GenerationProgressModal.tsx , LearningObjectivesGenerator.tsx ).

### ✅ Ce este bun (Puncte forte)
1. Structura Progresivă (The Waterfall Approach): Planul propune o secvențiere logică (Obiective -> Structură -> Conținut). Este corect să nu generezi totul deodată.
2. Utilizarea "Golden Samples": Ideea de a injecta exemple de calitate (workbook, studii de caz) în prompturi este excelentă pentru a seta un standard de stil.
3. Tonul Conversațional: Instrucțiunile explicite pentru ton ( buddy-to-buddy ) sunt vitale pentru a evita limbajul "de lemn" (corporatist) pe care AI-ul tinde să-l folosească.
### ⚠️ Riscuri Majore (Ce lipsește pentru "World Class")
1. Problema "Memoriei Scurte" (Context Fragmentation)

- Critică: Planul actual tratează modulele oarecum izolat. Când AI generează Modulul 5, primește doar un rezumat scurt (500 caractere) din modulele anterioare.
- Impact: Inconsistență narativă. Un personaj introdus în Modulul 1 ("Managerul Andrei") dispare sau își schimbă numele în Modulul 4. Termenii se schimbă ("participant" vs "cursant").
2. Lipsa unei "Surse a Adevărului" (No Course DNA)

- Critică: Nu există un pas inițial care să definească "Legile Cursului" (terminologie fixă, durate exacte, stil vizual).
- Impact: Slide-urile pot spune "Exercițiul durează 15 min", dar Workbook-ul spune "30 min". Trainerul va fi confuz.
3. Validare Superficială

- Critică: Codul actual ( GenerationProgressModal.tsx ) are un simplu while (retries < 3) . Nu verifică de ce a eșuat.
- Impact: Dacă AI-ul greșește formatul JSON de 3 ori, utilizatorul primește eroare sau conținut trunchiat. Nu există "self-healing".
4. Sincronizare Slide-Workbook-Manual

- Critică: Acestea sunt generate ca pași separați.
- Impact: Risc major ca exercițiul de la pagina 10 din Workbook să nu aibă corespondent în Slide-uri.
# PARTEA 2: PLANUL MEU DE IMPLEMENTARE ("World Class Architecture")
Pentru a garanta un curs coerent, propun o arhitectură bazată pe "Course DNA" și Validare Semantică .

### 🏗️ Arhitectura Nouă
Nu vom mai genera "la rând", ci vom construi mai întâi "creierul" cursului.
 FAZA 1: "Course DNA" (Sursa Adevărului)
Înainte de a genera primul slide, vom crea un obiect JSON complex care dictează regulile întregului curs.

- Dicționar: Termeni interziși și obligatorii (ex: "Folosim doar 'Facilitator', niciodată 'Profesor'").
- Univers Narativ: Lista personajelor recurente care vor apărea în studiile de caz din toate modulele.
- Timeline Master: Durata exactă a fiecărui minut, sincronizată între Slide-uri și Manual. FAZA 2: Generare "DNA-Aware"
Toate prompt-urile ulterioare vor primi acest Course DNA ca parametru obligatoriu.

- Prompt-ul pentru Modulul 5 nu va mai fi: "Generează conținut despre Feedback" .
- Va fi: "Generează conținut despre Feedback, folosind personajul 'Andrei' definit în DNA, respectând durata de 45 min din Timeline și folosind definiția pentru 'SBI Model' din Dicționar." FAZA 3: Validare Semantică & Self-Healing
Nu doar verificăm dacă e JSON valid. Verificăm sensul .

1. Check 1 (Terminologie): AI-ul a folosit cuvântul "Profesor"? -> Respinge și cere regenerare cu "Facilitator".
2. Check 2 (Timeline): Suma minutelor din activități este 58 min, dar Blueprint-ul zice 45? -> Respinge și cere ajustare.
3. Self-Healing: Dacă validarea eșuează, trimitem eroarea înapoi la AI: "Ai greșit durata. Recalculează activitățile să încapă în 45 min." FAZA 4: Raport de Coeziune
La final, generăm un raport pentru utilizator: "Cursul are o coerență terminologică de 98%. Atenție la Modulul 3, unde durata pare puțin subestimată."

### 🚀 Roadmap de Implementare (Fără a scrie cod încă)
Acesta este planul pe care îl voi executa pas cu pas, folosind tool-ul TodoWrite pentru a urmări progresul.

1. Definire Interfețe (Types):
   
   - Crearea interfeței CourseDNA (terminologie, personaje, timeline).
   - Actualizarea structurii CourseStep pentru a stoca validările.
2. Creare Generator DNA:
   
   - Un nou pas în backend ( generate-course-content ) care rulează imediat după Blueprint.
   - Prompt specializat pentru a extrage "regulile jocului" din subiectul cursului.
3. Refactorizare Prompt-uri (Context Injection):
   
   - Modificarea funcțiilor de generare (Slides, Workbook, Manual) pentru a injecta Course DNA .
   - Implementarea logicii de verificare a consistenței narative.
4. Sistemul de Validare (The Guardian):
   
   - Implementarea funcției validateContent(content, dna) .
   - Implementarea buclei de retry cu feedback specific (nu generic).
5. UI Updates:
   
   - Afișarea statusului de validare în GenerationProgressModal .
   - Posibilitatea utilizatorului de a edita "DNA-ul" (ex: să schimbe numele personajului principal) înainte de a genera restul cursului.