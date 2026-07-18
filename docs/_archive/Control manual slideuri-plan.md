Document de Arhitectură: Control Manual al Layout-ului Slide-urilor (Deterministic Export)
1. Vedere de Ansamblu
Trecem de la un sistem probabilistic (unde exportul "ghicește" layout-ul pe baza conținutului) la un sistem determinist (unde exportul execută instrucțiunea explicită a utilizatorului).

Înainte: Markdown Content → Parser (Heuristics) → Random/Logic Guess → PPTX
Problemă: Parserul decide la fiecare export, uneori diferit, ignorând intenția utilizatorului.
După: Markdown Content + Layout Directive → Parser (Strict) → Mapped Template → PPTX
Soluție: Intenția utilizatorului este salvată persistent lângă conținut.
Componente care NU se schimbă:

Structura bazei de date (nu facem migrații complexe).
Editorul de text principal (TinyMCE rămâne la fel).
Logica de generare AI a conținutului.
Librăria de generare PPTX (pptxgenjs și templates.ts rămân, doar apelarea lor se schimbă).
2. Modificări Minime Necesare (Technical Specs)
Pentru a evita rescrierea bazei de date, vom folosi "Metadata-in-Content".

A. Stocarea Deciziei (Data Layer) Vom insera decizia utilizatorului direct în conținutul Markdown/HTML al slide-ului sub formă de comentariu HTML invizibil pentru utilizator, dar vizibil pentru parser.

Format: <!-- slide-layout: quote --> sau <!-- slide-layout: split-left -->
Acest marker va fi plasat la începutul secțiunii care definește slide-ul (ex: după hr sau la începutul blocului).
B. Unificarea Parserului În prezent, există o discrepanță între SlidesPreviewModal (care folosește getSlideModelsForPreview) și exportService.ts (care folosește parseContentSections).

Acțiune: Vom refolosi logica de parsare. Exportul va folosi exact aceleași modele ca și Preview-ul.
Logica nouă:
Parsează conținutul.
Caută markerul <!-- slide-layout: X -->.
Dacă există -> Forțează slide_type = X.
Dacă NU există -> Păstrează logica actuală de fallback (default).
3. UX Impact Controlat
Intervenția utilizatorului va fi strict în zona de Preview & Organizare, nu în timpul scrierii textului, pentru a nu întrerupe fluxul creativ.

Interfața Utilizator (SlidesPreviewModal):

Locație: În SlidesPreviewModal, pe fiecare card de slide.
Element Nou: Un dropdown discret sau o serie de iconițe (sus-dreapta pe card) cu eticheta "Layout".
Opțiuni: Listă finită de tipuri suportate (ex: Standard, Split Image Left, Split Image Right, Quote, Big Number, Timeline).
Feedback Vizual: Când utilizatorul schimbă tipul, UI-ul se actualizează instantaneu (fără re-generare AI, doar re-aranjare).
Default-ul Sigur:

Dacă utilizatorul nu alege nimic, sistemul folosește Bullet List (cel mai sigur format care acceptă orice cantitate de text).
4. Export Logic (Fără AI)
Exportul devine o mașină de mapare strictă: User Choice → PPTX Template.

Regula de Mapare (Mapping Table):

User Choice (Marker)	Funcție PPTX (templates.ts)	Comportament la eroare (ex: lipsă imagine)
bullet_list	renderDefault	N/A (sigur)
split_left	renderSplitLeft	Dacă nu e img: Placeholder gri (NU schimbăm layout-ul)
split_right	renderSplitRight	Dacă nu e img: Placeholder gri
quote	renderQuotation	Textul devine citat. Titlul devine autor (sau invers).
big_number	renderBigStat	Primul număr găsit devine "Big Stat".
image_full	renderFullImage	Imagine pe fundal + overlay text.
Tratarea Cazurilor Invalide:

Principiu: "Garbage In, Ugly Out" (dar valid tehnic). Nu încercăm să "reparăm" inteligent, pentru că asta a cauzat problemele anterioare.
Exemplu: Utilizatorul alege "Quote" pentru o listă de 10 puncte.
Sistem: Va randa slide-ul de tip Quote. Textul va fi probabil trunchiat sau micșorat de pptxgenjs.
Utilizatorul: Va vedea în Preview că arată rău și va schimba înapoi. Exportul nu ia decizii în locul lui.
5. Risk Management
Risc	Probabilitate	Impact	Strategie de Mitigare
Utilizatorul alege un layout nepotrivit (ex: Big Number fără numere)	Medie	Mediu (Slide urât)	Preview-ul arată imediat rezultatul ("WYSIWYG"). Adăugăm un warning vizual în UI: "Acest layout necesită o imagine".
Markerul HTML este șters accidental	Mică	Mic (Revenire la default)	Markerul este ascuns în editorul vizual (TinyMCE îl protejează ca non-editable element dacă e configurat corect, sau pur și simplu e invizibil).
Complexitate Prea Mare (Paralizia alegerii)	Medie	UX	Limităm lista la 6-8 template-uri esențiale. Nu expunem toate cele 30 de variante posibile.
6. Strategie de Tranziție
Faza 1 (Backend/Parser Logic): Implementăm suportul pentru citirea markerului <!-- slide-layout: ... --> în parser. Slide-urile existente nu au marker, deci funcționează ca înainte (backward compatible).
Faza 2 (UI): Adăugăm selectorul în SlidesPreviewModal. Când utilizatorul alege, injectăm markerul în conținutul slide-ului (în CourseStep).
Faza 3 (Export): Actualizăm exportService.ts să respecte markerul.
Rollout: Poate fi activat imediat pentru toți utilizatorii. Nu necesită "feature flag" complex, deoarece funcționalitatea este "opt-in". Dacă nu atingi selectorul, nimic nu se schimbă.

7. Metrici de Succes
Stabilitate: 100% consistență între Preview și Export (ceea ce vezi în Preview cu un layout selectat trebuie să apară identic în PPTX).
Adopție: Procentul de slide-uri care au un layout manual setat (indică utilitatea funcției).
Următorii Pași Imediați (Plan de Acțiune)
[Backend] Actualizare src/services/presentationAiService.ts sau exportService.ts pentru a detecta <!-- slide-layout: ... -->.
[UI] Modificare src/components/SlidesPreviewModal.tsx pentru a permite selecția și a salva modificarea în CourseStep.
[Export] Refactorizare src/services/exportService.ts -> addContentSlides pentru a apela template-ul corect.
Dorești să încep implementarea cu modificarea UI-ului (SlidesPreviewModal) pentru a permite selecția, sau preferi să începem cu logica de parsare? (Recomand UI-ul pentru a putea testa vizual rapid).