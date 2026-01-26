import { GoogleGenerativeAI } from "npm:@google/generative-ai";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

// --- BUNDLED MODULES ---

const GOLDEN_SAMPLES = {
  objectives: `
# Curs: Leadership Situațional pentru Manageri de Linie
**Durată totală:** 8 ore (1 zi intensivă)
**Target:** Manageri cu experiență 1-3 ani, echipe 5-15 persoane
**Format:** Live Workshop

---

## 🎯 OBIECTIVE GENERALE DE ÎNVĂȚARE

La finalul acestui curs, participanții vor fi capabili să:

### 1. **ANALIZEZE** (Bloom: Analyze)
Să identifice nivelul de maturitate al fiecărui membru din echipă folosind matricea Competență-Angajament și să justifice clasificarea cu exemple concrete din ultimele 30 de zile.

**Criterii de succes:** 
- Clasifică corect 80% din membrii echipei (verificat prin quiz final)
- Oferă minim 2 dovezi comportamentale pentru fiecare clasificare

---

### 2. **APLICE** (Bloom: Apply)
Să adapteze stilul de conducere (Directing, Coaching, Supporting, Delegating) în funcție de situația specifă, folosind decizia în 3 pași învățată în modul 2.

**Criterii de succes:**
- Rezolvă corect 4/5 scenarii practice din Exercițiul 2.3
- Dezvoltă un plan de acțiune pentru o situație reală din propria echipă

---

### 3. **CREEZE** (Bloom: Create)
Să dezvolte un plan de dezvoltare personalizat pentru minimum 2 membri din echipă, cu obiective SMART și checkpointuri de evaluare la 30/60/90 zile.

**Criterii de succes:**
- Planul conține acțiuni concrete (nu "îmbunătățire comunicare" ci "întâlnire 1-on-1 de 20 min în fiecare luni, 10:00")
- Planul e aprobat de facilitator în timpul exercițiului final

---

### 4. **EVALUEZE** (Bloom: Evaluate)
Să judece eficacitatea propriilor decizii de management din ultimele 3 luni și să identifice minimum 2 situații unde au aplicat stilul greșit, explicând impactul și alternativa corectă.

**Criterii de succes:**
- Oferă auto-critică sinceră (nu "totul e ok")
- Propune soluții alternative concrete, nu vagi

---

### 5. **COMUNICE** (Bloom: Apply + Create)
Să ofere feedback corectiv și recunoaștere folosind modelul SBI (Situation-Behavior-Impact) în maxim 90 de secunde, adaptat la stilul de învățare al angajatului.

**Criterii de succes:**
- Practică în roleplay cu minimum 3 colegi
- Primește rating minim 7/10 de la peer pentru claritate și empatie
`,
  structure_live: `
# Structura Detaliată: Leadership Situațional
**Total:** 8 ore (09:00 - 17:00, cu pauze)

---

## 📚 MODUL 1: Fundamentele Leadership-ului Situațional
**Durată totală:** 2 ore (09:00 - 11:00)
**Obiectiv:** Să înțeleagă că nu există stil "universal" de conducere

---

### Lecția 1.1: Mitul "Stilului Natural" (45 min)

**Obiective de învățare:**
- Să **analizeze** (Bloom) propriul stil dominant de management și să identifice situațiile în care acesta eșuează
- Să **definească** (Bloom) cele 4 stiluri de leadership (Directing, Coaching, Supporting, Delegating) cu exemple concrete
- Să **evalueze** (Bloom) impactul unui stil rigid asupra performanței echipei

**Conținut:**

#### A. Deschidere (10 min)
**Poveste intro:**
"Anul trecut, un manager din Brașov m-a sunat disperat. Îmi spune: 'Am echipa perfectă: toți motivați, toți cu experiență. Dar am pierdut 3 oameni buni în 6 luni. Ce fac greșit?'

Am stat cu el o zi întreagă. Și am descoperit: Era un manager fantastic... pentru beginneri. Explica tot în detaliu, oferea guidance constant, era mereu disponibil. 

Problema? Echipa lui nu mai era beginneri. Erau seniori care voiau autonomie. Ei interpretau micro-managementul lui ca lipsă de încredere. Așa că au plecat.

Asta e tema zilei de azi: Stilul tău nu e greșit. E doar aplicat la persoana greșită, în momentul greșit."

**Întrebare retorică:** "Câți dintre voi conduceți diferit un stagiar față de un senior?" (Lasă-i să ridice mâna, fă o glumă dacă nimeni nu ridică)

---

#### B. Teoria (15 min) - SLIDE 1-3

**SLIDE 1:** Matricea Stiluri de Leadership (vizual: 2x2 grid)
- Axa X: Comportament Directiv (Low → High)
- Axa Y: Comportament Supportiv (Low → High)
- Cele 4 cadrane: S1 (Directing), S2 (Coaching), S3 (Supporting), S4 (Delegating)

**SLIDE 2:** Când folosești fiecare stil?
- S1 (Directing): "Noul angajat - ziua 1" → Task-uri claire, deadlines, check-in-uri frecvente
- S2 (Coaching): "Junior ambițios dar nesigur" → Întrebări deschise, validare, challenge controlat
- S3 (Supporting): "Mid-level care a dat greș recent" → Empatie, re-încredere, mai puțin control
- S4 (Delegating): "Senior care știe mai bine ca tine" → Obiective clare, autonomie totală, trust

**SLIDE 3:** Red Flags - Când aplici greșit
- S1 la un Senior = "Nu am nevoie de babysitter, demisionez"
- S4 la un Junior = "M-ai aruncat în apă să înot singur, mă înec"

---

#### C. Exercițiu Reflexiv Individual (15 min)

**Instrucțiuni:**
"Deschideți workbook-ul la pagina 3. O să vedeți un tabel cu 5 scenarii. Pentru fiecare, identificați:
1. Ce stil ați folosit ultima dată când v-ați confruntat cu asta?
2. A funcționat? (Da/Nu/Parțial)
3. Ce stil ar fi fost mai potrivit acum când știți teoria?"

**Scenariile:**
1. Un angajat nou (2 săptămâni) face aceeași greșeală a 3-a oară
2. Un membru senior al echipei refuză să împărtășească cunoștințe cu juniorii
3. Un mid-level cere mai multe responsabilități dar nu livrează la timp taskurile actuale
4. Toată echipa e demotivată după ce un proiect major a fost anulat
5. Un angajat excelent cere să lucreze remote 100% dar politica companiei e hibrid

**Timp:** 10 min individual, 5 min share în perechi

---

#### D. Debrief Colectiv (5 min)

**Întrebări facilitator:**
- "Cine a descoperit că aplică același stil la toată lumea?" (Validare: "E normal, asta facem automat")
- "Cine și-a dat seama că evită un anumit stil?" (Insight: "De obicei evităm S1 sau S3 - ori ne temem să fim 'șefi răi' ori să parem 'slabi'")

---

### Lecția 1.2: Diagnoza Maturității Echipei (30 min)

**Obiective:**
- Să **clasifice** (Bloom) membrii echipei în D1-D4 (Development Levels)
- Să **distingă** (Bloom) între Competență și Angajament
- Să **aplice** (Bloom) instrumentul de diagnoză pe 2 membri reali din echipa lor

---

### 🎯 CHECKPOINT MODUL 1 (Self-Assessment)

Participanții bifează în workbook:
- [ ] Pot numi cele 4 stiluri de leadership și pot da câte un exemplu pentru fiecare
- [ ] Pot identifica stilul meu dominant
- [ ] Am plasat corect minim 3 membri ai echipei pe matricea D1-D4

---

## 📊 TABELUL OBLIGATORIU: AGENDĂ COMPLETĂ

| Timp | Modul | Subiect | Slide | Metodă | Activitate | Durată (min) |
|------|-------|---------|-------|---------|-----------|-------------|
| 09:00 | Intro | Welcome & Icebreaker | - | Energizer | "2 Truths 1 Lie" (profesional) | 15 |
| 09:15 | 1 | Mitul Stilului Natural | 1-3 | Lecție + Poveste | Prezentare Matricea Stiluri | 25 |
| 09:40 | 1 | Exercițiu Reflexiv | - | Individual + Perechi | Analiza scenarii (Workbook p.3) | 15 |
| 09:55 | 1 | Diagnoza Maturității | 4-5 | Lecție interactivă | Întrebări retorice | 10 |
| 10:05 | 1 | Exercițiu Grid D1-D4 | - | Practic individual | Plasarea echipei pe matrice | 15 |
| 10:20 | 1 | Debrief Modul 1 | - | Discuție facilitată | Sharing insights (voluntar) | 10 |
| 10:30 | - | **PAUZĂ CAFEA** | - | - | - | 15 |
| 10:45 | 2 | Stilul Directing în acțiune | 6-7 | Demo + Roleplay | Facilitator arată greșit vs corect | 20 |
| 11:05 | 2 | Stilul Coaching | 8-9 | Lecție + Video clip | Exemplu real 3 min (TED style) | 15 |
| 11:20 | 2 | Exercițiu Roleplay Triadic | - | Grupuri de 3 | Manager-Angajat-Observator | 30 |
| 11:50 | 2 | Debrief Roleplay | - | Plenară | Ce a funcționat? Ce nu? | 15 |
| 12:05 | 2 | Stilul Supporting + Delegating | 10-12 | Lecție rapidă | Comparație tabel (când/cum) | 15 |
| 12:20 | 2 | Mini-quiz Kahoot | - | Gamification | 10 întrebări rapide (competiție) | 10 |
| 12:30 | - | **PAUZĂ PRÂNZ** | - | - | - | 60 |
| 13:30 | 3 | Feedback Model SBI | 13-14 | Lecție + Demo | Situation-Behavior-Impact | 20 |
| 13:50 | 3 | Exercițiu Feedback | - | Perechi | Scriere + Roleplay feedback real | 25 |
| 14:15 | 3 | Cazuri Dificile | 15-16 | Studiu de caz | 3 scenarii "Coșmar" (rezolvare grup) | 30 |
| 14:45 | 3 | Debrief Cazuri | - | Facilitator-led | Extragere pattern-uri comune | 15 |
| 15:00 | - | **PAUZĂ CAFEA** | - | - | - | 15 |
| 15:15 | 4 | Plan 30/60/90 Zile | 17-18 | Lecție + Template | Ce înseamnă plan bun vs rău | 15 |
| 15:30 | 4 | Exercițiu Plan Personal | - | Individual + Peer Review | Fiecare scrie pentru 2 membri echipă | 40 |
| 16:10 | 4 | Prezentări Voluntare | - | Sharing | 3-4 participanți prezintă (3 min each) | 15 |
| 16:25 | 5 | Commitment to Action | - | Ritual de încheiere | "Ce voi face LUNI?" (toți spun 1 lucru) | 20 |
| 16:45 | 5 | Q&A Final + Evaluare | - | Open discussion | Întrebări nesolicitate + Formular | 15 |
| 17:00 | - | **ÎNCHEIERE** | - | - | - | - |

**TOTAL TEORIE:** 115 min (24%)
**TOTAL PRACTICĂ:** 230 min (48%)
**TOTAL PAUZE:** 90 min (19%)
**TOTAL ADMIN/Q&A:** 45 min (9%)
  `,
  structure_online: `
# Structura Detaliată: Leadership Situațional (Online Course)
**Total:** 2-3 ore video + 2 ore studiu individual
**Format:** Online Video Course (Self-paced)

---

## 📚 MODUL 1: Fundamentele Leadership-ului Situațional
**Durată video:** 25 min
**Obiectiv:** Să înțeleagă că nu există stil "universal" de conducere

---

### Lecția 1.1: Mitul "Stilului Natural" (Video 8 min)

**Obiective de învățare:**
- Să **analizeze** (Bloom) propriul stil dominant de management
- Să **definească** (Bloom) cele 4 stiluri de leadership (Directing, Coaching, Supporting, Delegating)

**Conținut:**

#### A. Hook (Video)
**Narativ:** "Anul trecut, un manager m-a sunat disperat..." (Povestea introductivă adaptată pentru cameră, focus pe durerea privitorului)

#### B. Teoria (Video + Animații)
- **SLIDE 1:** Matricea Stiluri de Leadership (vizual: 2x2 grid animat)
- **SLIDE 2:** Când folosești fiecare stil? (Exemple vizuale clare)
- **SLIDE 3:** Red Flags (Avertismente vizuale pe ecran)

#### C. Exercițiu Reflexiv (Pauză Video)
**Instrucțiuni pe ecran:**
"Pune pauză la video acum. Deschide workbook-ul digital la pagina 3. Identifică scenariile..."
(Timp estimat de lucru individual: 10 min)

---

### Lecția 1.2: Diagnoza Maturității Echipei (Video 12 min)

**Obiective:**
- Să **clasifice** (Bloom) membrii echipei în D1-D4
- Să **aplice** (Bloom) instrumentul de diagnoză pe 2 membri reali

**Conținut:**
- Explicație detaliată D1-D4 cu exemple video (roleplay pre-înregistrat)
- Quiz interactiv (pop-up în player-ul video dacă e posibil, sau link)

---

## 📊 TABELUL OBLIGATORIU: AGENDĂ CURS ONLINE
| Modul | Subiect | Format | Durată Video | Activitate Individuală |
|-------|---------|--------|--------------|------------------------|
| Intro | Welcome & Context | Video | 5 min | Setare obiective personale |
| 1.1 | Mitul Stilului Natural | Video | 8 min | Exercițiu Workbook (10 min) |
| 1.2 | Diagnoza Maturității | Video | 12 min | Analiză Echipă (15 min) |
| 1.3 | Quiz Modul 1 | Interactiv | - | Test Grilă 10 întrebări |
| 2.1 | Stilul Directing | Video | 10 min | Studiu de Caz (10 min) |
| ... | ... | ... | ... | ... |

**TOTAL VIDEO:** ~120 min
**TOTAL PRACTICĂ INDIVIDUALĂ:** ~120 min
  `,
  slides_live: `
<SLIDE_E id="7">
<TITLE>De ce eșuează delegarea? 
(Matematica ascunsă a "Fac eu mai repede")</TITLE>
<!-- slide-layout: EXPLAINER -->
<VISUAL>
Flat illustration, 2-panel comparison:
LEFT PANEL: A stressed manager with 10 tasks floating around their head (represented as small colored boxes with icons: email, report, meeting). Manager's face shows exhaustion (red face, sweat drops). Clock shows "18:00" with sun setting.
RIGHT PANEL: Same manager, but now holding only 3 tasks, smiling. Team of 3 people in background, each holding 2-3 tasks, working collaboratively. Clock shows "17:00" with sun still up.
Color palette: Blues (#2E5C8A primary), oranges (#F4A261 accent), grays (#E5E5E5 background). Simple line art, no gradients. Max 7 visual elements total.
Designer note: This should be drawable in PowerPoint with basic shapes - no custom illustrations needed.
</VISUAL>
<CONTENT>
- **Capcană 1:** "Dacă explic, pierd 30 min. Dacă fac eu, termin în 5 min."
- **Realitatea:** Funcționează o singură dată. Task-ul se repetă → Pierzi 5 min × 20 repetări = 100 min pierdute în 3 luni.
- **Capcană 2:** Echipa învață că "șeful face totul" → Devin pasivi.
- **Soluția:** Investește 30 min AZI pentru delegare → Economisești 90 min în următoarele 60 zile.
</CONTENT>
<SPEAKER_NOTES>
Hai să vorbim despre cea mai toxică frază din managementul modern: "Lasă că fac eu, că până îi explic lui Andrei, mai bine termin singur."

Știu, am fost și eu acolo. Ești expert. Poți face taskul cu ochii închiși. Andrei e junior, o să facă greșeli, o să te întrebe de 10 ori, o să trebuiască să revizuiești. Matematica e simplă: 30 de minute vs 5 minute. Tu alegi 5.

Problema? Matematica asta funcționează o singură dată. Dar task-ul ăsta nu dispare. Revine săptămâna viitoare. Și peste 2 săptămâni. Și iar, și iar.

Hai să facem calculul real: Dacă task-ul ăsta se repetă de 2 ori pe săptămână, în 3 luni faci 24 de repetări × 5 minute = 120 de minute aruncate pe fereastră. Aproape 2 ore din viața ta în care puteai să faci work strategic, nu operațional.

Dar e mai rău decât atât. Ce mesaj îi trimiți lui Andrei? Că nu ai încredere în el. Că e mai simplu pentru tine să faci singur. Așa că data viitoare când are o problemă, nu mai încearcă să o rezolve. Vine direct la tine. Pentru că a învățat: "Șeful rezolvă."

Și acum ai creat un bottleneck. Tu. Toată echipa depinde de tine. Dacă ești în concediu, echipa e paralizată. Dacă ești bolnav, totul se oprește.

Iată ce vreau să reții azi: Delegarea nu e despre "a scăpa de muncă". E despre multiplicare. Investești 30 de minute azi să-l înveți pe Andrei. Peste o lună, Andrei poate să-l învețe pe George. Și brusc, ai 2 oameni care pot face treaba aia. Tu te poți concentra pe următorul nivel.

E ca și cum ai planta un pom. Primele luni ceri apă, îngrijire, răbdare. Dar după 2 ani, pomul dă fructe singur. Delegarea funcționează la fel.

Următorul slide o să vă arăt exact cum să delegați fără să deveniți micro-manageri. Stay with me.
</SPEAKER_NOTES>
<SLIDE_END id="7">
  `,
  slides_online: `
<SLIDE_E id="7">
<TITLE>De ce eșuează delegarea? (Matematica "Fac eu")</TITLE>
<!-- slide-layout: VISUAL_EXPLAINER -->
<VISUAL>
Animated Split Screen:
LEFT: Manager drowning in tasks (Red zone). Tasks piling up.
RIGHT: Manager calm, team working (Green zone). Tasks distributed.
Overlays: "30 min investment" vs "100 min lost"
</VISUAL>
<CONTENT>
- **Capcană:** "Dacă explic, pierd 30 min."
- **Realitate:** Task-ul se repetă x20.
- **Soluție:** Investiția inițială aduce ROI în 2 săptămâni.
</CONTENT>
<VOICE_OVER_SCRIPT>
[Tone: Urgent but analytical]
Hai să vorbim despre matematică. Uită-te în stânga ecranului. Ăsta ești tu când spui "Fac eu mai repede".
Pare eficient pe moment. 5 minute vs 30 minute.
Dar uită-te la graficul din dreapta. Alea 5 minute se adună. În 3 luni, ai pierdut 2 ore.
Delegarea nu e despre timp pierdut. E despre timp investit.
Vreau să te gândești la un task pe care l-ai făcut ieri și pe care puteai să-l delegi.
</VOICE_OVER_SCRIPT>
<SLIDE_END id="7">
  `,
  workbook_live: `
## Modulul 3: Gestionarea Conflictelor în Echipă (2 ore)

### De ce contează acest modul? (The Hook)

Conflictele sunt ca o durere de dinți. Dacă le ignori, nu dispar de la sine — se transformă în abcese. Într-o echipă, un conflict nerezolvat distruge încrederea construită în ani. Dar, gestionat corect, conflictul devine motorul inovației.

Hai să fiu sincer: majoritatea managerilor EVITĂ conflictele. Zic "o să treacă de la sine" sau "nu vreau să par autoritar". Rezultatul? Tensiunea crește sub suprafață, până când explodează într-o demisie sau un scandal public.

**Statistică care doare:** Studiile arată că un manager petrece în medie **18% din timp** gestionând conflicte. Dacă lucrezi 40 ore pe săptămână, asta înseamnă 7 ore pe săptămână. O zi întreagă.

Întrebarea nu e "Cum evit conflictele?" ci "Cum le transform în oportunități?"

---

### Anatomia unui conflict

#### Conceptul de bază: Sursa Reală vs Sursa Aparentă

Majoritatea oamenilor cred că conflictele apar din cauza "personalităților dificile". Greșit. 

**Realitatea:**
- **80% din conflicte** = Probleme STRUCTURALE (roluri neclare, resurse limitate, procese proaste)
- **20% din conflicte** = Probleme INTERPERSONALE (valori diferite, stiluri de comunicare)

De ce contează? Pentru că atacăm problema greșită. Ne certăm cu omul, în loc să reparăm procesul.

---

**Exemplu concret: Conflictul "Vânzări vs Producție"**

**Contextul:**
La o fabrică din Cluj (componente auto, 150 angajați), departamentul de Vânzări promitea clienților livrare în **2 zile**. Departamentul de Producție avea nevoie de **5 zile** pentru fabricație.

**Ce s-a întâmplat:**
- Vânzătorii: "Producția e leneșă, nu vor să muncească weekend."
- Producția: "Vânzătorii mint clienții, ne pun în situații imposibile."
- Tensiune crescândă: Oameni care nu mai vorbeau între ei. Email-uri pasiv-agresive. 2 demisii în 3 luni.

**Ce au încercat (și a eșuat):**
1. **Teambuilding la munte** (2 zile) → Toată lumea s-a relaxat, dar la birou, conflictul reapărea în 48h
2. **Manager nou** (să medieze) → A fost prins la mijloc, burnout în 4 luni, el însuși a demisionat
3. **Avertismente scrise** → Oamenii s-au speriat, dar nu s-a schimbat nimic structural

**De ce au eșuat acestea?**
- Teambuilding-ul = Paracetamol pentru infecție (simptom tratat, nu boala)
- Manager nou = Al 3-lea jucător într-un joc defect
- Avertismente = Intimidare fără soluție

**Ce a funcționat:**
Un consultant extern a venit și a pus o întrebare simplă: "Care e capacitatea reală a liniei de producție?"

Răspuns: **3 zile** (nu 5) dacă materialele sunt în stoc. Dar uneori materialele întârziu 2 zile pentru că Vânzările nu anunță Producția din timp.

**Soluția implementată:**
- Sistem comun de stocuri vizibil LIVE (Google Sheet simplu, updatat de ambele departamente)
- Vânzările văd stocul ÎNAINTE să promită deadline
- Dacă e în stoc → Livrare în 3 zile (garantat)
- Dacă NU e în stoc → Livrare în 7 zile (honest cu clientul)
- **Cost:** 40 ore consultanță + 2 ore training = €3.000

**Rezultat (3 luni mai târziu):**
- Conflictul a dispărut în 2 săptămâni
- Satisfacția clienților a crescut cu 15% (pentru că acum primeau promisiuni realiste, nu dezamăgiri)
- 0 demisii în următoarele 12 luni
- Vânzările au crescut cu 8% (clienții au apreciat onestitatea)

**Lecția:**
Conflictul nu era despre "oameni răi". Era despre un proces prost. Odată ce procesul s-a reparat, oamenii au devenit colaborativi instant.

**De ce funcționează această abordare?**

**Brain science simplu:**
Când atacăm o persoană ("Tu ești problema"), creierul intră în modul defensiv. Cortexul prefrontal (partea rațională) se închide. Amigdala (fight-or-flight) preia controlul.

Când atacăm un proces ("Procesul ăsta nu funcționează"), creierul rămâne în modul rezolvare-problemă. Colaborăm, nu ne certăm.

---

### 🎯 EXERCIȚIU PRACTIC 3.1: "Cele 5 De Ce-uri"

**Obiectiv:** Să ajungi la cauza rădăcină a unui conflict recurent din echipa ta.

**Durată:** 20 min (15 min individual + 5 min share cu un coleg)

**Context:**
Tehnica "5 De Ce-uri" vine de la Toyota Production System. Ideea: Nu te opri la primul răspuns. Sapă mai adânc. De obicei, cauza reală apare la al 3-lea sau 4-lea "De ce?"

---

**Instrucțiuni pas-cu-pas:**

1. **Identifică conflictul** (2 min)
   Gândește-te la o problemă recentă din echipa ta care REVINE des (nu e one-off).
   
   Exemplu: "Echipa livrează proiectele întârziat"

2. **Întreabă "De ce?" de 5 ori** (10 min)
   După fiecare răspuns, întreabă din nou "Dar DE CE se întâmplă asta?"

> "Ok, homework pentru tine: Du-te în Workbook-ul de la pagina 12. O să găsești un exercițiu: 'Team Maturity Matrix'. Clasifică fiecare membru al echipei tale ca D1, D2, D3 sau D4. Apoi identifică ce stil folosești acum la fiecare.
>
> Dacă vezi mismatch-uri (de exemplu, aplici Directing la un D4), scrie UNUL lucru pe care îl vei schimba LUNI când ajungi la birou.
>
> În următorul video, o să vorbim despre cum să treci de la un stil la altul FĂRĂ să pară că ai personalitate multiplă. Ne vedem acolo. Hai că poți!"

**[VISUAL FINAL]**
- Fade to end screen:
  - Titlul video-ului următor: "Cum schimbi stilul fără să confunzi echipa"
  - Buton: "NEXT VIDEO →"
  - Social links (LinkedIn/Website)

**[NOTE PRODUCȚIE]**
- 👋 Gesture: Salut prietenos (wave hand) la final
- 🎵 Outro music: Upbeat, 5 secunde fade out

---
`,
  facilitator_guide: `
# MODULUL 2: COMUNICAREA EFICIENTĂ (90 min)

## 🕒 FLOW TABLE (Desfășurător Minut-cu-Minut)

| Timp | Activitate | Format | Obiectiv |
|------|------------|--------|----------|
| 00:00-00:10 | Intro & Check-in | Plenar | Conectare și setare context |
| 00:10-00:25 | Teoria SBAR | Prezentare | Înțelegerea structurii |
| 00:25-00:50 | Exercițiu: Telefonul Defect | Grupuri mici | Experimentarea pierderii informației |
| 00:50-01:05 | Debrief & Analiză | Discuție facilitată | Extragerea lecțiilor (Ishikawa) |
| 01:05-01:20 | Feedback Model SBI | Roleplay | Practică deliberată |
| 01:20-01:30 | Concluzii & Action Plan | Individual | Transfer în practică |

---

## 🛠️ EXERCIȚIU CENTRAL: Jocul Telefonului Defect (Corporatist)

**Obiectiv:** Să experimentezi cum se pierde informația când nu folosești structuri clare
**Durată totală:** 25 min (Setup 3' + Joc 10' + Debrief 12')
**Materiale:** 4 plicuri, foi A4, Timer.

### INSTRUCȚIUNI PENTRU FACILITATOR:

**Pregătire:**
1. Scrie "mesajele inițiale" pe bilețele (complexe, cu cifre și nume).
2. Pregătește întrebările de debrief pe flipchart.

**PASUL 1: Start (3 min)**
> "Împărțiți-vă în 4 grupuri. Fiecare grup în linie. Primul e Clientul, ultimul e Șoferul. Mesajul trebuie să ajungă de la Client la Șofer prin șoptire. Șoferul scrie rezultatul."

**PASUL 2: Jocul (10 min)**
- Nu interveni. Lasă haosul să se întâmple.
- Observă cine ia notițe (ilegal în joc, dar interesant de discutat).

**PASUL 3: Debrief (12 min)**
Citește mesajul final vs original. Râsete garantate.

**Întrebări de facilitare (CRITICE):**
1. "Ce s-a pierdut primul?" (De obicei: cifrele/detaliile exacte)
2. "Ce s-a schimbat?" (De obicei: interpretări subiective)
3. "Dacă asta era o comandă reală, care era costul?"

### 🗣️ SCRIPT PENTRU FACILITATOR (Key Learning Points)

**Dacă participanții râd de greșeli:**
> "E amuzant acum, în sala de curs. Dar hai să ne imaginăm că asta era o comandă de 50.000 EUR. Cine râde la final? Clientul? Noi? Nimeni. De asta avem nevoie de structură."

**Dacă dau vina pe 'Șofer' (ultima persoană):**
> "E ușor să dăm vina pe om. Dar amintiți-vă **Ishikawa (Fishbone)**. Problema nu e omul, ci procesul. Ce anume din PROCES a permis eroarea? Faptul că nu s-a scris? Faptul că nu s-a verificat?"

---

## 🔧 TROUBLESHOOTING (Ce faci dacă...)

| Situație | Intervenție Recomandată |
|----------|-------------------------|
| **Grupul e pasiv/timid** | Fă tu primul exemplu, exagerat de greșit. Râsul deblochează atmosfera. |
| **Cineva domină discuția** | Folosește tehnica "Mulțumesc, Andrei. Hai să auzim și o opinie din partea cealaltă a mesei. Maria?" |
| **Sceptici ("La noi nu merge")** | Validează, nu contrazice. "Ai dreptate, e greu. Dar care e costul dacă NU facem nimic? Hai să testăm modelul SBI o săptămână." |

---

## 📝 MODEL DE FEEDBACK (SBI - Situation, Behavior, Impact)

**IMPORTANT:** Nu folosim "Sandwich" (Laudă-Critică-Laudă). Diluează mesajul și scade încrederea. Folosim **SBI**.

**Exemplu Script SBI:**
> "Maria (**Situation**), ieri în ședința de producție, când ai întrerupt prezentarea lui Ion (**Behavior**), el s-a oprit și nu a mai împărtășit restul ideilor (**Impact**). Am pierdut input valoros. Te rog ca data viitoare să notezi întrebările și să le pui la final."
`,
  quiz: `
STRUCTURA COMPLETĂ QUIZ FINAL
markdown# EVALUARE FINALĂ: Leadership Situațional
**Durată:** 25 minute
**Format:** Online (Google Forms / Typeform) sau Printabil (PDF)
**Scoring:** 100 puncte total
**Passing Grade:** 75/100 (75%)

---

## 📊 STRUCTURA PUNCTAJULUI

| Secțiune | Tipul Întrebărilor | Număr | Puncte/Întrebare | Total | % |
|----------|-------------------|-------|------------------|-------|---|
| **Partea 1** | Knowledge Check (MCQ) | 10 | 4 | 40 | 40% |
| **Partea 2** | Scenario Application | 5 | 8 | 40 | 40% |
| **Partea 3** | Self-Assessment | 4 | 5 | 20 | 20% |
| **TOTAL** | - | **19** | - | **100** | **100%** |

---

## PARTEA 1: KNOWLEDGE CHECK (40 puncte)

### ❓ ÎNTREBAREA 1: Stiluri de Leadership

**Ce caracterizează stilul S2 (Coaching)?**

A) High Directive, Low Supportive  
B) Low Directive, High Supportive  
C) High Directive, High Supportive ✅ (CORECT)  
D) Low Directive, Low Supportive  

**Răspuns corect:** C

**Feedback dacă GREȘIT:**
> "S2 (Coaching) combină HIGH Directive (dai instrucțiuni clare) cu HIGH Supportive (asculți, validezi, încurajezi). E stilul perfect pentru D2 - Discipoli Deziluzionați. Revizuiește Modulul 1."

**Feedback dacă CORECT:**
> "Exact! S2 = Coaching combină direcția clară cu suportul emoțional. E stilul cel mai complex."

---

### ❓ ÎNTREBAREA 2: Diagnoza Maturității

**Un angajat are Competență HIGH dar Angajament VARIABLE. În ce nivel se încadrează?**

A) D1 - Beginner Entuziast  
B) D2 - Discipol Deziluzionat  
C) D3 - Performer Capabil dar Prudent ✅ (CORECT)  
D) D4 - Expert Autonom  

**Răspuns corect:** C

**Feedback dacă GREȘIT:**
> "D3 = Competență HIGH + Angajament VARIABLE. Știe să facă jobul, dar e nesigur dacă VREA mai multă responsabilitate. Revizuiește Matricea D1-D4."

---

[... continuă cu 8 întrebări similare ...]

---

## PARTEA 2: SCENARIO APPLICATION (40 puncte)

### 🎭 SCENARIUL 1: Angajatul Nou Entuziast (8 puncte)

**CONTEXT:**
Andrei (3 zile în echipă) e super entuziast: "Șefu', dă-mi orice task!"
Următoarea sarcină e complexă (asamblare 15 pași, marjă eroare 0.1mm).

**CE FACI?**

A) "Perfect! Iată diagrama. Încearcă singur." (S4)

B) "Hai să lucrăm împreună. Eu fac primul, tu observi. Apoi tu faci sub supravegherea mea. După 10 corecte, poți continua cu check-in hourly." (S1) ✅

C) "Tu ce crezi, cum ai aborda?" (S3)

D) "Citește pașii, încearcă, apoi discutăm." (S2)

**Răspuns corect:** B

**Justificare:**
Andrei = D1 (Competență LOW + Angajament HIGH) → Necesită S1 (Directing)

**Feedback dacă GREȘIT:**
> "Andrei e ziua 3 - clasic D1. Entuziasmul te poate păcăli. Are nevoie de S1: tu arăți, el urmărește, apoi el face sub supraveghere. Nu sări peste etape!"

---

[... continuă cu 4 scenarii similare ...]

---

## PARTEA 3: SELF-ASSESSMENT (20 puncte)

### 🔍 ÎNTREBAREA 11: Stilul Dominant (5 puncte)

**Care e stilul tău DOMINANT din ultimele 30 zile? Explică cu exemplu concret.**

**Opțiuni:**
- [ ] S1 - Directing
- [ ] S2 - Coaching  
- [ ] S3 - Supporting
- [ ] S4 - Delegating

**Explică (minim 50 cuvinte):**
_____________________________________________________________________________

**Criterii punctaj:**
- Ales un stil (1p)
- Minim 50 cuvinte (1p)
- Exemplu concret din ultimele 30 zile (2p)
- Recunoaște DE CE gravitează spre el (1p)

---

### 🔍 ÎNTREBAREA 12: Identificarea Mismatch-ului (5 puncte)

**Identifică UN membru la care aplici STILUL GREȘIT:**

**Inițiale:** _______
**Nivel real (D1-D4):** _______
**Stil actual (S1-S4):** _______
**Manifestare problemă:** _____________________________________________________________________________
**Stil corect:** _______
**Acțiune concretă în 7 zile:** _____________________________________________________________________________

**Criterii punctaj:**
- Identificat membru (0.5p)
- Diagnosticat corect nivelul D (1p)
- Explicat manifestarea (1p)
- Identificat stil corect (0.5p)
- Acțiune SMART cu deadline (1.5p)

---

### 🔍 ÎNTREBAREA 13: Biggest Learning (5 puncte)

**Care a fost cel mai ȘOCANT lucru învățat? (minim 100 cuvinte)**

_____________________________________________________________________________
_____________________________________________________________________________

**Criterii punctaj:**
- Minim 100 cuvinte (1p)
- Learning specific (nu vag) (1p)
- Explicat DE CE șocant (1p)
- Conectat la experiență personală (1p)
- Implicații pentru viitor (1p)

---

### 🔍 ÎNTREBAREA 14: Commitment to Action (5 puncte)

**LUNI DIMINEAȚĂ, ce vei face DIFERIT?**

**Ce:** _____________________________________________________________________________
**Cu cine:** _______________________
**La ce oră:** _______________________
**Cum măsori succesul (1 săptămână):** _____________________________________________________________________________
**Obstacole + Plan B:** _____________________________________________________________________________

**Criterii punctaj:**
- Acțiune SPECIFICĂ (1p)
- Include Cine + Când (1p)
- Metric clar (1p)
- Anticipat obstacole + plan B (1p)
- Relevant pentru problemă identificată (1p)

---

## 📊 SCORING & GRADING

| Punctaj | Grade | Interpretare |
|---------|-------|--------------|
| 90-100 | A - Excellent | Stăpânește + aplică corect. Ready! |
| 75-89 | B - Good | Înțelege teoria, mici gaps aplicare |
| 60-74 | C - Passing | Bază OK, lipsă aplicare. Review! |
| <60 | D - Needs Improvement | Gaps semnificative. Repeat! |

---

## 🎯 POST-QUIZ ACTION PLAN

**Grade A-B (75+):**
1. Săptămâna 1: Implementează Commitment
2. Săptămâna 2-4: Aplică la tot team-ul
3. Luna 2: Devii peer coach

**Grade C (60-74):**
1. Re-watch module-le greșite
2. Practice 1 stil nou pe 1 persoană
3. Re-ia Partea 2 (Scenarios)

**Grade D (<60):**
1. Schedule 30 min cu facilitator
2. Re-ia cursul integral
3. Re-ia quiz-ul

---

## 💡 TIPS FACILITATOR

**Timing:** A doua zi după curs (fresh mind)

**Format:** Digital (auto-scoring) > Printabil

**Comunicare:** "Nu e pass/fail. E oglinda ta."

**Follow-up:** 
- Rezultate în 48h
- Grade D = 15 min call 1-on-1
- Grade A = Advanced track
  `,
  video_script_live: `
# VIDEO SCRIPT: Mesaj de Bun Venit (Pre-Workshop)
**Target:** Participanții la Workshop-ul LIVE
**Canal:** Email / WhatsApp (trimis cu 3 zile înainte)
**Durata:** 60 secunde

---

**[VISUAL]**
- Tu (Facilitatorul) filmat simplu cu telefonul (selfie mode)
- Fundal: Sala de curs sau un birou luminos
- Zâmbet, energie relaxată

**[AUDIO]**
"Salutare tuturor! Sunt [Numele Tău] și abia aștept să ne vedem marți la workshop-ul de Leadership Situațional.

Știu că sunteți ocupați, așa că promisiunea mea e simplă:
Nu o să fie o zi de teorie plictisitoare.
Nu o să stăm să citim slide-uri.

O să lucrăm pe cazurile VOASTRE reale. O să rezolvăm problemele cu care vă confruntați ACUM în echipă.

Așa că, o singură rugăminte am la voi:
Gândiți-vă la un om din echipa voastră care vă dă bătăi de cap.
Aduceți acel 'caz' în minte la curs. Îl vom rezolva împreună.

Ne vedem marți la 9:00. Cafeaua e pe mine!
Ciao!"

---
`,
  video_script_online: `
# VIDEO SCRIPT: Modulul 2.1 - Stilul Directing (Exemplu)
**Format:** Talking Head + B-Roll + Screen Capture
**Durată:** 3-5 minute
**Ton:** Clar, Empatic, dar Direct

---

**[SCENE 1: Talking Head - Hook]**
**(Visual: Tu în prim plan, fundal blurat, lumină caldă)**

"Ți s-a întâmplat vreodată să delegi un task unui om nou, să-l lași în pace ca să nu fii 'micromanager', și când te întorci peste 2 zile să găsești un dezastru?

(Pauză scurtă)

Și probabil ți-ai zis: 'Nu se mai găsesc oameni buni azi.'

Dar dacă ți-aș spune că greșeala nu a fost a lor? A fost a ta. Pentru că ai folosit stilul greșit."

---

**[SCENE 2: Concept Explain - Animation/Slide]**
**(Visual: Graficul Matricei, zoom pe cadranul S1 - Directing)**

"Astăzi vorbim despre Stilul 1: Directing.
Mulți manageri fug de el. Li se pare că e 'Bossy'. Că e 'Comunist'.

Dar hai să ne uităm la realitate. Când un om e nou (D1 - Enthusiastic Beginner), el NU are nevoie de 'spațiu'. Are nevoie de CLARITATE.

Stilul Directing înseamnă 3 lucruri:
1. Definești CE trebuie făcut (Standardul)
2. Definești CUM trebuie făcut (Procesul)
3. Definești PÂNĂ CÂND (Deadline-ul)

Nu e răutate. E bunătate. Îi dai omului harta exactă ca să poată câștiga."

---

**[SCENE 3: Roleplay - Split Screen]**
**(Visual: Stânga - Manager, Dreapta - Angajat Nou)**

**Manager:** "Salut Andrei. Pentru raportul de mâine, vreau să folosești template-ul din drive. Uită-te la coloana B și C. Vreau să fie completate exact ca în exemplul de luna trecută. Hai să facem primele 3 rânduri împreună acum."

**Angajat:** "Super, mersi! Chiar nu știam de unde să încep."

**(Visual: Text Overlay - "Direction is NOT Micromanagement")**

---

**[SCENE 4: Call to Action - Talking Head]**
**(Visual: Tu din nou)**

"Provocarea ta pentru azi:
Identifică un om din echipa ta care e la început pe un task nou.
Nu-l întreba 'Cum te simți?'.
Du-te la el și clarifică CE, CUM și CÂND.
Apoi dă-mi un reply și spune-mi cum a reacționat.

Ne vedem în lecția următoare."
  `,
  exercises_live: `
### Exercițiu: Roleplay Triadic (30 min)

**Format:** Grupuri de 3 (Manager, Angajat, Observator)
**Obiectiv:** Practicarea stilului Coaching (S2)

**Instrucțiuni:**
1. **Runda 1 (10 min):**
   - A este Manager, B este Angajat, C este Observator.
   - Scenariu: Angajatul e demotivat după un refuz. Managerul trebuie să asculte și să ghideze.
2. **Debrief (5 min):** Observatorul oferă feedback folosind SBI.
3. **Rotire:** Schimbați rolurile.

**Fișă Observator:**
- [ ] A ascultat fără să întrerupă?
- [ ] A pus întrebări deschise?
- [ ] A validat emoția?
`,
  exercises_online: `
### Exercițiu Individual: "Cele 5 De Ce-uri" (15 min)

**Format:** Individual (Workbook Digital / PDF)
**Obiectiv:** Identificarea cauzei rădăcină a unei probleme.

**Instrucțiuni:**
1. **Identifică o problemă recurentă** din echipa ta.
2. **Întreabă "De ce?" de 5 ori** succesiv pentru a săpa la rădăcină.
3. **Completează tabelul** de mai jos.

**Template:**
| Nivel | Întrebare | Răspunsul tău |
|-------|-----------|---------------|
| 1 | De ce a apărut problema? | [Scrie aici] |
| 2 | De ce [Răspuns 1]? | [Scrie aici] |
| ... | ... | ... |
`
};


const getDepthSpecs = (language: string) => {
  // PS-1: Universal Depth Specs with Dynamic Language Injection
  // We removed hardcoded Romanian strings to prevent language leakage.
  // The prompt engine will inject the correct language instructions.

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
    - **LANGUAGE**: All content must be in **${language}**.
  `,
    slides: `
    **DEPTH SPECIFICATIONS (Slides):**
    - **QUANTITY**: 1 slide per 6-8 minutes.
    - **STORYTELLING FLOW**:
      *   Slide 1: The Hook (Problem/Story).
      *   Slide 2: The Solution (Concept).
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

const getPromptTemplates = (language: string) => {
  // PS-1: Dynamic Template Generation - Universal template with translation instructions
  // The LLM is instructed to translate the structural headers into the target language.

  return {
    workbook_section: `
    ## Module [N]: [Title] ([Duration])

    ### [Translate to ${language}: "Why this matters"] (200-300 words)
    [Intro paragraph explaining importance. Hook the reader with a relatable problem.]

    ### [Section Title]
    #### [Translate to ${language}: "Core Concept"] (300-500 words)
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

// --- END BUNDLED MODULES ---


// --- VALIDATION LOGIC ---

export interface ValidationResult {
  passed: boolean;
  errors: string[];
  warnings: string[];
}

export function validateModule(moduleContent: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check 1: Length (Modules should be substantial)
  if (moduleContent.length < 1000) {
    errors.push(`Module content too short: ${moduleContent.length} chars (target 1000+)`);
  }

  // Check 2: Structure (Should have subsections)
  // Look for ### headers
  const subsections = (moduleContent.match(/### /g) || []).length;
  if (subsections < 2) {
    warnings.push(`Module might lack structure. Found ${subsections} subsections (expected 2+).`);
  }

  // Check 3: Practical Exercise (Crucial for our pedagogy)
  // Look for the target emoji or "Exercise" keyword if emoji fails (but emoji is standard now)
  if (!moduleContent.includes('🎯')) {
    warnings.push('Module missing Practical Exercise (🎯).');
  }

  return {
    passed: errors.length === 0,
    errors,
    warnings
  };
}

export function validateWorkbook(workbook: string, blueprint: any): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Check 1: Word count (should be 12,000-15,000 for a full workbook, but let's be lenient for now: 5000+)
  // The plan said 10000+, but let's start with 5000 to avoid false positives during testing/short generations.
  const wordCount = workbook.split(/\s+/).length;
  if (wordCount < 5000) {
    errors.push(`Workbook too short: ${wordCount} words (need 5,000+)`);
  }
  
  // Check 2: All modules present
  // Blueprint modules structure: blueprint.modules = [{ title: "..." }, ...]
  if (blueprint && blueprint.modules) {
    // Regex explanation:
    // ## : Level 2 header
    // \s+ : whitespace
    // \D+ : One or more non-digits (e.g. "Module", "Modulul", "Lektion")
    // \d+ : The module number
    const moduleHeaders = workbook.match(/^##\s+\D+\d+/gm) || [];
    
    if (moduleHeaders.length < blueprint.modules.length) {
      warnings.push(`Potential missing modules: found ${moduleHeaders.length} headers, expected ${blueprint.modules.length} modules.`);
    }
  }
  
  // Check 3: Exercises present
  // The template uses "🎯 **[Translate: "Practical Exercise"]" or similar.
  // We should look for the emoji 🎯 which is consistent.
  const exerciseCount = (workbook.match(/🎯/g) || []).length;
  if (exerciseCount < 2) {
    warnings.push(`Low exercise count: found ${exerciseCount}. Expected at least 1 per module.`);
  }

  return {
    passed: errors.length === 0,
    errors,
    warnings
  };
}

// --- LANGUAGE MAPPING FOR AI ---
const LANGUAGE_MAP: Record<string, string> = {
  'en': 'English',
  'ro': 'Romanian',
  'es': 'Spanish',
  'fr': 'French',
  'de': 'German',
  'it': 'Italian',
  'pt': 'Portuguese',
  'zh': 'Chinese (Simplified)',
  'zh-TW': 'Chinese (Traditional)',
  'ja': 'Japanese',
  'ko': 'Korean',
  'ru': 'Russian',
  'ar': 'Arabic',
  'hi': 'Hindi',
  'tr': 'Turkish',
  'nl': 'Dutch',
  'pl': 'Polish',
  'sv': 'Swedish',
  'no': 'Norwegian',
  'da': 'Danish',
  'fi': 'Finnish',
  'hu': 'Hungarian',
  'cs': 'Czech',
  'el': 'Greek',
  'he': 'Hebrew',
  'th': 'Thai',
  'id': 'Indonesian',
  'ms': 'Malay',
  'vi': 'Vietnamese',
  'uk': 'Ukrainian',
  'bg': 'Bulgarian',
  'hr': 'Croatian',
  'sr': 'Serbian',
  'sk': 'Slovak',
  'sl': 'Slovenian',
  'et': 'Estonian',
  'lv': 'Latvian',
  'lt': 'Lithuanian',
  'fa': 'Persian',
  'ur': 'Urdu',
  'sw': 'Swahili'
};

function getLanguageName(code: string): string {
   return LANGUAGE_MAP[code] || code;
}


const getToneInstructions = (course: Course) => {
  const dna = course.dna;
  
  // 1. BASELINE QUALITY STANDARDS (Non-Negotiable)
  const BASELINE_RULES = `
CRITICAL PEDAGOGICAL RULES (ALWAYS APPLY):
1. ⛔ NO ACADEMIC INTROS (ZERO TOLERANCE):
   - NEVER start with: "In this module we will explore...", "This section covers...".
   - ALWAYS start with a HOOK: A question, a shocking stat, or a story.

2. ⛔ BANNED WORDS (WOOD LANGUAGE):
   - Avoid: "reprezintă", "facilitează", "componentă esențială", "în contextul".
   - Use: "ajută", "face", "este", "la noi".

3. 📢 ACTIONABLE vs THEORETICAL:
   - BAD: "Communication is important."
   - GOOD: "Look them in the eye and say Hello."
   - RULE: Convert concepts into physical actions.

4. 🧠 ADMIT REALITY:
   - Acknowledge when things are boring or difficult ("Știu, sună greu...").
  `;

  // 2. DYNAMIC VOICE (DNA-Driven)
  let VOICE_INSTRUCTIONS = "";
  
  if (dna && dna.voiceProfile) {
    // DNA EXISTS: Use specific persona
    VOICE_INSTRUCTIONS = `
=== VOICE & PERSONALITY (FROM DNA) ===
**FORMALITY**: ${dna.voiceProfile.formality || 'Conversational'}
**HUMOR LEVEL**: ${dna.voiceProfile.humorLevel || 'Light'}
**SIGNATURE PHRASES**: Use these often: "${dna.voiceProfile.signaturePhrases?.join('", "') || ''}"
**FORBIDDEN PHRASES**: NEVER use these: "${dna.voiceProfile.forbiddenPhrases?.join('", "') || ''}"
    `;
  } else {
    // DNA MISSING: Fallback to "World Class" default
    VOICE_INSTRUCTIONS = `
=== VOICE & PERSONALITY (DEFAULT) ===
**TONE**: Conversational, Buddy-to-Buddy.
**GOLDEN RULE**: Write as if you are talking to a colleague over coffee. Relaxed, direct, helpful.
**STYLE**: Use contractions ("n-am", "o să"), direct address ("tu"), and short sentences.
    `;
  }

  return `
=== TONE & STYLE INSTRUCTIONS ===
${VOICE_INSTRUCTIONS}

${BASELINE_RULES}
  `;
};







// --- TYPES ---

export enum GenerationEnvironment {
  LiveWorkshop = 'LiveWorkshop',
  OnlineCourse = 'OnlineCourse',
  Corporate = 'Corporate',
  Academic = 'Academic',
}

export interface Course {
  id: string;
  user_id: string;
  created_at: string;
  title: string;
  subject: string;
  target_audience: string;
  environment: GenerationEnvironment;
  language: string;
  progress: number;
  learning_objectives?: string;
  steps?: CourseStep[];
  blueprint?: CourseBlueprint;
  ai_refinement_history?: any[];
}

export interface CourseStep {
  id: string;
  course_id: string;
  user_id: string;
  created_at: string;
  title_key: string;
  content: string;
  is_completed: boolean;
  step_order: number;
}

export interface CourseBlueprint {
  version: '1.0';
  title?: string;
  target_audience?: string;
  modules: CourseModule[];
  estimated_duration?: string;
  generated_at: string;
}

export interface CourseModule {
  id: string;
  title: string;
  learning_objective: string;
  sections: CourseSection[];
}

export interface CourseSection {
  id: string;
  title: string;
  content_type: 'slides' | 'video_script' | 'exercise' | 'reading' | 'quiz';
  order: number;
  content_outline?: string;
}

// --- PROMPTS ---

const getAnalyzeUploadPrompt = (fileName: string, fileContent: string, environment: string) => `
  **ROLE:** You are an expert Instructional Designer.
  **TASK:** Analyze the provided course content and structure it into a formal Course Blueprint.
  
  **INPUT CONTENT:**
  ---
  Filename: ${fileName}
  Content: ${fileContent ? fileContent.substring(0, 50000) : ''}... (truncated if too long)
  ---
  
  **TARGET ENVIRONMENT:** ${environment}
  
  **INSTRUCTIONS:**
  1. Extract the main topic and target audience.
  2. Break down the content into logical Modules and Sections.
  3. Assign appropriate 'content_type' to each section based on the content (e.g., 'slides' for theory, 'exercise' for practice).
  4. Generate a learning objective for each module.
  
  **OUTPUT FORMAT (JSON):**
  {
    "version": "1.0",
    "title": "Course Title",
    "target_audience": "Audience description",
    "estimated_duration": "e.g. 2 hours",
    "generated_at": "${new Date().toISOString()}",
    "modules": [
      {
        "id": "module-1",
        "title": "Module 1 Title",
        "learning_objective": "Objective",
        "sections": [
          {
            "id": "section-1-1",
            "title": "Section Title",
            "content_type": "slides",
            "order": 1,
            "content_outline": "Summary of content"
          }
        ]
      }
    ]
  }
`;

const getFillGapsPrompt = (blueprint: any, existingContent: string) => `
  **ROLE:** You are an expert Instructional Designer.
  **TASK:** Identify missing pedagogical elements in the course content and generate them.
  
  **COURSE BLUEPRINT:**
  ${JSON.stringify(blueprint)}
  
  **EXISTING CONTENT:**
  ${existingContent ? existingContent.substring(0, 20000) : ''}...
  
  **INSTRUCTIONS:**
  1. Based on the blueprint and content, identify what is missing (e.g., quizzes, practical exercises, summaries).
  2. Generate the missing content.
  
  **OUTPUT FORMAT (JSON):**
  {
    "gaps": [
      {
        "type": "quiz",
        "module_id": "module-1",
        "content": "Question 1: ..."
      }
    ]
  }
`;

const getLearningObjectivesPrompt = (course: Course, fileContext: string) => `
**ROLE:** You are a pedagogical expert specializing in learning objective design using Bloom's Taxonomy.

**TASK:** Generate 3-5 clear, measurable, actionable learning objectives for this course.

**COURSE CONTEXT:**
- Title: ${course.title}
- Subject: ${course.subject}
- Target Audience: ${course.target_audience}
- Environment: ${course.environment}
- Language: ${course.language}

${fileContext ? `**REFERENCE MATERIALS:**\nUse these materials to inform the objectives:\n${fileContext}\n` : ''}

**INSTRUCTIONS:**
1. Use Bloom's Taxonomy verbs (e.g., Analyze, Create, Evaluate, Apply, Understand, Remember)
2. Make objectives SMART (Specific, Measurable, Achievable, Relevant, Time-bound)
3. Focus on what participants will BE ABLE TO DO (not just "know")
4. Match the complexity to the target audience
5. Consider the environment:
   - LiveWorkshop: Include practical application objectives
   - OnlineCourse: Include self-paced learning objectives
6. **LANGUAGE**: The content MUST be in **${course.language}**.

**OUTPUT FORMAT (JSON):**
You must output ONLY a valid JSON object with NO markdown code blocks.

{
  "objectives": [
    "By the end of this course, participants will be able to [verb] [specific skill/knowledge]",
    "Participants will be able to [verb] [specific skill/knowledge]",
    ...
  ]
}

**EXAMPLE:**
For a React course:
{
  "objectives": [
    "Build a functional React application using components and hooks",
    "Implement state management using Context API and reducers",
    "Debug React applications using React Developer Tools"
  ]
}
`;

const getChatOnboardingPrompt = (course: Course, history: string, fileContext: string) => `
  **SYSTEM**: You are an expert Instructional Designer and Curriculum Architect.
  **GOAL**: Conduct an intake interview with the user to design a high-quality course blueprint.
  
  **CONTEXT**:
  - Provisional Title: ${course.title}
  - Subject: ${course.subject}
  - Environment: ${course.environment} (Live Workshop vs Online Course)
  - Language: ${course.language}
  - Initial Objectives: ${course.learning_objectives || 'None provided'}

  ${fileContext ? `**REFERENCE MATERIALS:**\nThe user has provided these materials:\n${fileContext}\n` : ''}

  **CHAT HISTORY**:
  ${history}

  **INSTRUCTIONS**:
  1. **Analyze** the conversation.
  2. **Check Status of Required Info**:
     - **[ ] Objectives**: Defined? (User input OR AI suggestions accepted)
     - **[ ] Level**: Defined? (Beginner/Inter/Advanced)
     - **[ ] Duration**: Defined? (Hours/Days)
     - **[ ] Practice Ratio**: Defined? (e.g., 70/30)

  3. **Logic**:
     - If **Objectives** are missing: Suggest 3-5 objectives based on the title/subject and ask if they look good or if the user wants to add others.
     - If **Level** is missing: Ask "Care este nivelul participanților?"
     - If **Duration** is missing: Ask "Care este durata dorită a cursului?"
     - If **Ratio** is missing: Ask "Ce raport Teorie vs Practică preferi?"
     
     **RULE**: You can combine 2 questions if natural, but DO NOT skip any.
     **RULE**: DO NOT generate the blueprint until ALL 4 items are defined (or user explicitly says "skip").

  4. **Generate Blueprint (ONLY when [x] is checked for all 4)**:
     - **Duration**: Use the user's duration to constrain the module count.
     - **Practice**: If High Practice, use more 'exercise' sections.
     - **Confirmation**: "Am pregătit planul. Iată propunerea:"

  **OUTPUT FORMAT**:
  You must output a VALID JSON object.
  {
    "message": "Question or confirmation",
    "blueprint": null | {
       "version": "1.0",
       "title": "Refined Course Title",
       "target_audience": "Detailed audience description",
       "estimated_duration": "e.g., '8 hours'",
       "generated_at": "[ISO timestamp]",
       "modules": [
         {
           "id": "module-1",
           "title": "Module 1: Name",
           "learning_objective": "Outcome",
           "sections": [
              { "id": "section-1-1", "title": "Section 1.1: Name", "content_type": "slides", "order": 1, "content_outline": "Brief" }
           ]
         }
       ]
    }
  }

  **BLUEPRINT RULES**:
  - "content_type" ∈ {'slides','video_script','exercise','reading','quiz'}.
  - Logical flow that builds complexity.
  - **LiveWorkshop**: emphasize slides and exercises.
  - **OnlineCourse**: emphasize video_script and reading.
  - **Practice Ratio**: STRICTLY respect the requested ratio. If 80% practice, then 4 out of 5 sections should be 'exercise' or 'project'.
  - Include at least one quiz or exercise per module.
  - Each module must have a learning_objective.
  - Use unique IDs like "module-1", "section-1-1".
`;

const getImprovePrompt = (course: Course, stepTitle: string, originalContent: string, fileContext: string) => `
  **ROLE:** You are a senior instructional design editor.
  **CONTEXT:** Improving a section of a ${course.environment} course titled "${course.title}".
  **CURRENT STEP:** ${stepTitle}
  **LANGUAGE:** ${course.language}

  ${fileContext ? `**REFERENCE MATERIALS:**\nUse these materials to ensure accuracy and relevance:\n${fileContext}\n` : ''}

  **ORIGINAL TEXT:**
  ---
  ${originalContent}
  ---

  **TASK:** Rewrite the text to be more engaging, clear, and pedagogically sound.
  **RULES:** Keep the same format (Markdown). Output ONLY the improved text.
`;

const getRefinePrompt = (course: Course, selectedText: string, actionType: string, fileContext: string) => `
  **ROLE:** You are a senior instructional design editor.
  **CONTEXT:** Refining a specific section of a ${course.environment} course titled "${course.title}".
  **LANGUAGE:** ${course.language}

  ${fileContext ? `**REFERENCE MATERIALS:**\nUse these materials if relevant to the refinement:\n${fileContext}\n` : ''}

  **SELECTED TEXT:**
  "${selectedText}"

  **INSTRUCTION:** ${actionType}

  **TASK:** Rewrite the SELECTED TEXT to follow the INSTRUCTION.
  **RULES:** 
  1. Output ONLY the rewritten text. 
  2. Do NOT include the instruction or any conversational filler.
  3. Maintain the same Markdown formatting (bold, italics, etc.) unless the instruction implies changing it.
  4. Ensure the tone fits the course environment (${course.environment}).
`;

const getLegacyPrompt = (
    course: Course, 
    stepTitle: string, 
    stepKey: string, 
    fileContext: string, 
    previousStepsContext: string
) => {
    // Define Environment Suffix
    const envSuffix = course.environment === 'OnlineCourse' ? 'online' : 'live';

    // Define Pedagogical Guidance based on Environment
    let pedagogicalGuidance = "";
    if (course.environment === 'LiveWorkshop') {
      pedagogicalGuidance = `
        **PEDAGOGY (Live Workshop):**
        - Focus on **interaction**: Ask questions to the audience, suggest group activities.
        - Content is for **slides and speaking notes**. Keep it punchy.
        - Use **Merrill's First Principles of Instruction**: Activation, Demonstration, Application, Integration.
      `;
    } else if (course.environment === 'OnlineCourse') {
      pedagogicalGuidance = `
        **PEDAGOGY (Online Video Course):**
        - Focus on **visual storytelling** and clear, scripted narration.
        - Content is for **video scripts** and **downloadable assets**.
        - Use **Mayer's Principles of Multimedia Learning**: Weed out extraneous words (Coherence Principle).
      `;
    } else {
      // Fallback for Corporate/Academic
      pedagogicalGuidance = `**PEDAGOGY:** Focus on clear learning objectives and structured content.`;
    }

    // Define Specific Instructions based on Step Type
    let specificInstructions = "";
    switch (stepKey) {
      case 'course.steps.structure':
        specificInstructions = `
          - Create a **Detailed Course Outline** structured by Modules and Lessons.
          - **CRITICAL**: For EVERY Lesson, you MUST define 2-3 specific **Learning Objectives** using Bloom's Taxonomy verbs (e.g., Define, Analyze, Create).
          - **THE GOLDEN STANDARD (ONE-SHOT EXAMPLE)**:
            You must emulate the depth and structure of this EXACT example below:
            ${GOLDEN_SAMPLES[`structure_${envSuffix}`] || GOLDEN_SAMPLES.structure_live}
          - Ensure the flow is logical and builds complexity gradually.
        `;
        break;
      case 'course.steps.video_scripts':
        specificInstructions = `
          - Write a **Video Script** for the key lessons defined in the structure.
          - Format: **[VISUAL]** (what is on screen) vs **[AUDIO]** (what the speaker says).
          - Include a "Hook" at the start and a "Call to Action" at the end of each script.
          - Keep sentences short and conversational.
          ${getToneInstructions(course)}
          - **THE GOLDEN STANDARD (ONE-SHOT EXAMPLE)**:
            You must emulate the tone and format of this EXACT example below:
            ${GOLDEN_SAMPLES[`video_script_${envSuffix}`] || GOLDEN_SAMPLES.video_script_live}
        `;
        break;
      case 'course.steps.slides':
        specificInstructions = `
          ${getDepthSpecs(course.language).slides}
          ${getToneInstructions(course)}
          Use this template for each slide:
          ${getPromptTemplates(course.language).slide}
          - **THE GOLDEN STANDARD (ONE-SHOT EXAMPLE)**:
            You must emulate the visual description style and notes of this EXACT example below:
            ${GOLDEN_SAMPLES[`slides_${envSuffix}`] || GOLDEN_SAMPLES.slides_live}
        `;
        break;
      case 'course.steps.cheat_sheets':
        specificInstructions = `
          - Create a **Cheat Sheet / One-Pager** summary.
          - Use tables, checklists, and bold key terms.
          - Focus on "Quick Wins" and actionable tips.
          ${getToneInstructions(course)}
        `;
        break;
      case 'course.steps.exercises':
      case 'course.steps.projects':
        specificInstructions = `
          ${getDepthSpecs(course.language).exercises}
          ${getToneInstructions(course)}
          - **THE GOLDEN STANDARD (ONE-SHOT EXAMPLE)**:
            You must emulate the structure, timing, and debriefing of this EXACT example below:
            ${GOLDEN_SAMPLES[`exercises_${envSuffix}`] || GOLDEN_SAMPLES.exercises_live}
        `;
        break;
      case 'course.steps.manual':
        if (course.environment === 'LiveWorkshop') {
          specificInstructions = `
          ${getDepthSpecs(course.language).manual}
          ${getToneInstructions(course)}
          - **THE GOLDEN STANDARD (ONE-SHOT EXAMPLE)**:
            You must emulate the structure (Flow Table, Scripts, Troubleshooting) of this EXACT example below:
            ${GOLDEN_SAMPLES.facilitator_guide}
          `;
        } else {
          specificInstructions = `
          ${getDepthSpecs(course.language).workbook}
          ${getToneInstructions(course)}
          
          **CRITICAL: DURATION CONSISTENCY**
          - You must match the durations defined in the Course Structure EXACTLY.
          - Use the format "(X min)" or "(X ore)" at the start of each module/section.
          
          Use this structure for sections:
          ${getPromptTemplates(course.language).workbook_section}
          - **THE GOLDEN STANDARD (ONE-SHOT EXAMPLE)**:
            You must emulate the structure and depth of this EXACT example below:
            ${GOLDEN_SAMPLES.workbook_online}
          `;
        }
        break;
      case 'course.steps.tests':
        specificInstructions = `
          - Create a **Final Assessment**.
          - Include 5-10 Multiple Choice Questions with correct answers and explanations.
          - **THE GOLDEN STANDARD (ONE-SHOT EXAMPLE)**:
            You must emulate the structure (Knowledge Check, Scenarios, Self-Assessment) and scoring logic of this EXACT example below:
            ${GOLDEN_SAMPLES.quiz}
        `;
        break;
      case 'quiz':
      return `
        **TASK**: Create a Final Assessment / Quiz.
        **GOAL**: Verify learning retention and application.
        **INSTRUCTIONS**:
        - Create a mixed-method assessment (Knowledge Check + Scenario + Self-Assessment).
        - **Scoring**: Define clear scoring rules.
        - **Language**: ${course.language}.
        
        **THE GOLDEN STANDARD (ONE-SHOT EXAMPLE)**:
        You must emulate the structure (Knowledge Check, Scenarios, Self-Assessment) and scoring logic of this EXACT example below:

        ${GOLDEN_SAMPLES.quiz}
      `;
    default:
        specificInstructions = `- Generate comprehensive content for this section. ${getToneInstructions(course)}`;
    }

    return `
        **ROLE:** You are an expert instructional designer specializing in ${course.environment}.

        **COURSE CONTEXT:**
        *   Title: ${course.title}
        *   Subject: ${course.subject}
        *   Target Audience: ${course.target_audience}
        *   Language: ${course.language}

        ${pedagogicalGuidance}

        ${fileContext ? `**REFERENCE MATERIALS:**\nUse these materials as the primary source of information where applicable:\n${fileContext}\n` : ''}

        **PREVIOUS CONTEXT:**
        ${previousStepsContext || "Start of course."}

        **YOUR TASK:**
        Generate content for the step: **"${stepTitle}"**.

        **SPECIFIC INSTRUCTIONS:**
        ${specificInstructions}

        **OUTPUT RULES:**
        1.  **Language:** STRICTLY output in **${course.language}**.
        2.  **Format:** Use clean Markdown. Use bolding for emphasis.
        3.  **Tone:** Professional, encouraging, and adapted to the environment.
        4.  **No Fluff:** Go straight to the content. No "Here is the content" intros.
      `;
};

// Helper to get duration enforcement text
const getDurationEnforcement = (blueprintDuration: string) => `
**CRITICAL CONSTRAINT - TOTAL COURSE DURATION**: ${blueprintDuration}
- The ENTIRE course must fit within ${blueprintDuration}. DO NOT EXCEED THIS LIMIT.
- Allocate time proportionally across all modules.
- If generating detailed content, ensure it's appropriate for this duration.
`;

// Helper to get step-specific prompts
const getStepPrompt = (step_type: string, course: Course, blueprintDuration: string, explicitModuleList: string = "") => {
  const envSuffix = course.environment === 'OnlineCourse' ? 'online' : 'live';
  
  switch (step_type) {
    case 'performance_objectives':
      return `
        **TASK**: Generate Performance Objectives.
        **GOAL**: Define exactly what participants will be able to DO by the end.
        **INSTRUCTIONS**:
        - Use Bloom's Taxonomy (Action Verbs).
        - Focus on observable behaviors.
        - 6–8 items maximum, in the specified **LANGUAGE**.
        - Headings and labels must be in the specified **LANGUAGE** (no English words like "High-Level", "Welcome").
        - Format as a bulleted list.
      `;
    case 'course_objectives':
      return `
        **TASK**: Generate Course Objectives (strategic).
        **GOAL**: Define the broader goals and business impact.
        **INSTRUCTIONS**:
        - Connect learning to business/personal outcomes.
        - Keep it inspiring but realistic.
        - Write all headings and content strictly in the specified **LANGUAGE**.
        - Do not use English phrases or mixed-language headings.
      `;
    case 'structure':
      return `
        **TASK**: Design the Course Structure (High-Level Architecture).
        **GOAL**: Create a Table of Contents (TOC), NOT the detailed content.
        
        ${explicitModuleList ? `
        **💎 OFFICIAL BLUEPRINT (SUPREME SOURCE OF TRUTH)**:
        The user has approved the following structure. You MUST follow this EXACT list of modules. 
        DO NOT ADD, REMOVE, OR REORDER MODULES.
        DO NOT CHANGE THE TITLES.
        
        **REQUIRED MODULES**:
        ${explicitModuleList}
        ` : ''}

        **WHAT TO INCLUDE:**
        - Module titles and total durations
        - Lesson/Section titles and durations
        - Learning objectives (1 sentence per module)
        - Logical flow markers (e.g., "Simple → Complex")
        
        **CRITICAL: REALISTIC TIMING RULES:**
        - When assigning durations (e.g. "30 min"), assume ONLY 60-70% is content delivery.
        - The rest is "Reality Buffer" (Questions, Transitions, Setup).
        - DO NOT overstuff modules. Less is more.
        
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
    case 'learning_methods':
      return `
        **TASK**: Select Learning Methods.
        **GOAL**: Choose the best pedagogical approach for each module.
        **INSTRUCTIONS**:
        - Suggest methods like: Lecture, Case Study, Role Play, Simulation, Discussion.
        - Justify WHY this method fits the content.
        - Map methods to specific modules from the structure.
      `;
    case 'timing_and_flow':
      return `
        **TASK**: Design Timing and Flow (Detailed Agenda).
        **GOAL**: Create a minute-by-minute agenda that covers EVERY module from the structure.
        **INSTRUCTIONS**:
        - **completeness**: You MUST include every single module and lesson from the provided Structure.
        - **REALITY BUFFERS (CRITICAL)**:
          For every activity, you must calculate and display:
          1. **Declared Time**: What fits the official agenda.
          2. **Real Time**: The actual time needed including friction.
          
          Use these buffers:
          - Theory/Lecture: +20% (Q&A)
          - Individual Exercise: +10% (Writing speed)
          - Group Exercise: +40% (Sync delays)
          - Debrief: +50% (Discussion)
          - Transitions: +3 min between activities
          
          *Note: Ensure the TOTAL DECLARED time matches the blueprint duration.*
        - **granularity**: Break down each module into specific activities (Presentation, Discussion, Break).
        - **timing**: Assign specific minutes to each activity.
        - **total_time**: Ensure the total time matches ${blueprintDuration} EXACTLY.
        - **format**: STRICTLY use a Markdown table with columns: Module | Topic | Activity | Declared Time | Real Time (Internal).
        **LANGUAGE**: ${course.language}.

        **THE GOLDEN STANDARD (ONE-SHOT EXAMPLE)**:
        You must emulate the "TABELUL OBLIGATORIU: AGENDĂ COMPLETĂ" section from this EXACT example below:

        ${GOLDEN_SAMPLES[`structure_${envSuffix}`] || GOLDEN_SAMPLES.structure_live}
      `;
    case 'exercises':
      return `
        **TASK**: Design Practical Exercises (Deep Content).
        **GOAL**: Create detailed, actionable instructions for hands-on activities that reinforce learning.
        ${getDepthSpecs(course.language).exercises}
        ${getToneInstructions(course)}
        **LANGUAGE**: The content MUST be in **${course.language}**. Do NOT use English headers.
        **CRITICAL INSTRUCTION**: Refer to the MASTER STRUCTURE above. You MUST generate exercises for EVERY module listed there.

        **EXERCISE DEPTH ENGINE (MANDATORY STRUCTURE PER EXERCISE)**:
        For each exercise, you must provide:
        1. **Title & Objective**: Clear, action-oriented.
        2. **Intro Script (Verbatim)**: EXACTLY what the trainer says (Hook -> Instructions -> Timing -> Go Signal).
        3. **Timing Breakdown (Table)**: 
           - Columns: Min | Facilitator Action | Participant Action | Red Flags.
           - Apply Reality Buffers (e.g., +40% for Group Work).
        4. **Debrief Script**: 3 specific questions (Factual, Analytical, Applicative) + Expected Answers.
        5. **Linkage**: Backward link (what concept it builds on) and Forward link (where the result is used).
        6. **Troubleshooting**: 3 specific scenarios (e.g., "Group is silent", "Time running out").
        7. **Validation Criteria**: How the trainer knows it worked.

        **THE GOLDEN STANDARD (ONE-SHOT EXAMPLE)**:
        You must emulate the structure, timing, and debriefing of this EXACT example below:

        ${GOLDEN_SAMPLES[`exercises_${envSuffix}`] || GOLDEN_SAMPLES.exercises_live}
      `;
    case 'examples_and_stories':
      return `
        **TASK**: Generate Examples, Stories, and Case Studies.
        **GOAL**: Make the theory concrete and relatable using storytelling.
        **INSTRUCTIONS**:
        - **QUANTITY**: Provide at least **2 concrete examples** and **1 Case Study/Story** per module.
        - **SCOPE**: Cover EVERY module in the MASTER STRUCTURE.
        - **LANGUAGE**: The content MUST be in **${course.language}**.
        
        **NARRATIVE ARC (CRITICAL)**:
        - You MUST use the **Course DNA Protagonist** defined in the input context.
        - Ensure their story evolves across modules (Beginning -> Struggle -> Learning -> Mastery).
        - Do NOT create random isolated characters for the main case studies. Use the same protagonist to build emotional investment.
        
        ${getToneInstructions(course)}

        **THE GOLDEN STANDARD (ONE-SHOT EXAMPLE)**:
        You must emulate the narrative style and detail of this EXACT Case Study example below:

        ${GOLDEN_SAMPLES.case_study}
      `;
    case 'facilitator_notes':
      return `
        **TASK**: Write Facilitator Notes (Deep Content).
        **GOAL**: Guide the trainer on HOW to deliver the content effectively.
        ${getDepthSpecs(course.language).manual}
        ${getToneInstructions(course)}
        **SCOPE**: Write notes for EVERY module in the MASTER STRUCTURE.
        **LANGUAGE**: The content MUST be in **${course.language}**.
        
        **TRANSITION SCRIPTS (MANDATORY)**:
        For every transition between modules or major activities, write a script containing:
        1. **Closing Statement**: Acknowledge what just happened.
        2. **Bridge**: "And that's perfect because..." (Connect to next topic).
        3. **Preview Hook**: Tease what's coming.
        4. **Physical Transition**: Instructions on where to move/what to setup.

        **THE GOLDEN STANDARD (ONE-SHOT EXAMPLE)**:
        You must emulate the structure, facilitator instructions, and debriefing questions of this EXACT example below:

        ${GOLDEN_SAMPLES.facilitator_guide}
      `;
    case 'slides':
      return `
        **TASK**: Generate Slide Content.
        **GOAL**: Create the visual support structure for the presentation.
        ${getToneInstructions(course)}
        **LANGUAGE**: The content MUST be in **${course.language}**.
        
        **QUANTITY & SCOPE ENFORCEMENT**:
        - **INPUT**: Look at the MASTER STRUCTURE provided. Count the number of Modules.
        - **OUTPUT**: You MUST generate a set of slides for **EVERY SINGLE MODULE**.
        - **RATIO**: Generate approx. 3-5 slides per Module.
        - **MAPPING**: If the structure has Module 1, 2, 3, and 4, and you only generate slides for Module 1, you have FAILED.
        
        **CRITICAL OUTPUT RULE**: Regardless of the conversational tone required for the content, the OUTPUT FORMAT must be STRICTLY the XML structure below. 
        - Do NOT add any introductory text, markdown headers, or conclusion outside the XML tags.
        - Do NOT wrap the output in markdown code blocks (like \`\`\`xml). Output ONLY the raw XML string.
        - **NEVER** output "Here are the slides..." or "Here is the XML...". START IMMEDIATELY WITH <SLIDE_BEGIN id="1">.
        
        ${getDepthSpecs(course.language).slides}

        **THE GOLDEN STANDARD (ONE-SHOT EXAMPLE)**:
        You must emulate the structure and XML format of this EXACT example below:

        ${GOLDEN_SAMPLES[`slides_${envSuffix}`] || GOLDEN_SAMPLES.slides_live}
      `;
    case 'facilitator_manual':
      return `
        **TASK**: Compile Facilitator Manual.
        **GOAL**: A comprehensive, step-by-step guide for the trainer.
        ${getDepthSpecs(course.language).manual}
        ${getToneInstructions(course)}
        **SCOPE**: Cover EVERY module in the MASTER STRUCTURE.
        **CRITICAL STRUCTURAL RULE**: Generate a SINGLE, cohesive version of the manual. Do NOT generate "Version 1" and then "Version 2". Do NOT repeat modules.

        **THE GOLDEN STANDARD (ONE-SHOT EXAMPLE)**:
        You must emulate the structure, facilitator instructions, and debriefing questions of this EXACT example below:

        ${GOLDEN_SAMPLES.facilitator_guide}
      `;
    case 'participant_workbook':
      return `
        **TASK**: Create Participant Workbook.
        **GOAL**: A comprehensive resource for learners to use during the course.
        ${getDepthSpecs(course.language).workbook}
        ${getToneInstructions(course)}
        **CRITICAL INSTRUCTION**:
        - You MUST generate content for EVERY module defined in the **MASTER STRUCTURE** above.
        - Do NOT skip any section.
        - **IMPORTANT**: In the Module Header, you MUST include the duration exactly as it appears in the structure (e.g., "(2 ore)").
        - Follow the "Workbook" depth specs strictly (40+ pages target means ~1000 words per module).
        
        Use this structure for sections:
        ${getPromptTemplates(course.language).workbook_section}

        **THE GOLDEN STANDARD (ONE-SHOT EXAMPLE)**:
        You must emulate the depth, tone, and practical exercises of this EXACT example below:

        ${GOLDEN_SAMPLES[`workbook_${envSuffix}`] || GOLDEN_SAMPLES.workbook_online}
        
        And also this Case Study example:
        ${GOLDEN_SAMPLES.case_study}
      `;
    case 'video_scripts':
      return `
        **TASK**: Write Video Scripts.
        **CONTEXT**: The course environment is **${course.environment}**.
        
        **ADAPTATION INSTRUCTIONS**:
        ${course.environment === 'LiveWorkshop' 
          ? `**LIVE WORKSHOP MODE**: The main content is delivered LIVE by a trainer. 
             - These scripts should be **"Teaser/Promo Videos"** sent BEFORE the workshop to build hype, OR **"Recap Videos"** sent AFTER.
             - Do NOT script the actual workshop content as if it's a video lesson.` 
          : `**ONLINE COURSE MODE**: These scripts are the **PRIMARY** method of delivery. Cover the content in depth.`}

        **GOAL**: Engaging, high-retention scripts.
        **INSTRUCTIONS**:
        - **SOURCE**: Look at the **MASTER STRUCTURE** provided above.
        - **QUANTITY**: Write a script for **EVERY LESSON** defined in that structure.
        - **VALIDATION**: If the structure has 40 lessons, you MUST write 40 scripts. Count them.
        - **LENGTH**: Target approx. 300-500 words per script (3-5 minutes speaking time).
        - Format: **[VISUAL]** vs **[AUDIO]**.
        - Keep sentences short and spoken-word style.
        - Include "Hook", "Content", "Examples", and "Call to Action".

        **THE GOLDEN STANDARD (ONE-SHOT EXAMPLE)**:
        You must emulate the tone, structure (Visual/Audio), and engagement of this EXACT example below:

        ${GOLDEN_SAMPLES[`video_script_${envSuffix}`] || GOLDEN_SAMPLES.video_script_online}
      `;
    case 'course.steps.tests':
    case 'quiz':
      return `
        **TASK**: Create a Final Assessment / Quiz.
        **GOAL**: Verify learning retention and application.
        **INSTRUCTIONS**:
        - Create a mixed-method assessment (Knowledge Check + Scenario + Self-Assessment).
        - **Scoring**: Define clear scoring rules.
        - **Language**: ${course.language}.
        
        **THE GOLDEN STANDARD (ONE-SHOT EXAMPLE)**:
        You must emulate the structure (Knowledge Check, Scenarios, Self-Assessment) and scoring logic of this EXACT example below:

        ${GOLDEN_SAMPLES.quiz}
      `;
    default:
      return `**TASK**: Generate content for ${step_type}.`;
  }
};

// --- NEW: Course DNA Generation ---

const getCourseDNAPrompt = (course: Course, blueprint: any) => {
  return `
    **ROLE**: Lead Instructional Designer & Creative Director.
    **TASK**: Define the "Course DNA" - the single source of truth for consistency across all course materials.
    
    **INPUT CONTEXT**:
    - Title: "${course.title}"
    - Target Audience: "${course.target_audience}"
    - Blueprint Duration: "${blueprint?.estimated_duration || 'Standard'}"
    - Modules: ${blueprint?.modules?.map((m: any) => m.title).join(', ') || 'N/A'}
    - Language: "${course.language}"

    **REQUIREMENTS**:
    Generate a JSON object defining the consistent elements of this course.
    **CRITICAL**: All content (definitions, narrative text, roles) MUST be in **${course.language}**.
    
    1. **Terminology**: decide on 3-5 specific terms to use consistently (e.g., "Participant" vs "Student").
    2. **Narrative Universe**: Create 1 main protagonist (Persona) who will face challenges throughout the course.
       - **Protagonist**: Name, Role, Personality, Initial State.
       - **Narrative Arc**: Define 3 key milestones where this character evolves (Beginning, Middle, End) linked to specific modules.
    3. **Voice Profile**: Define the tone (e.g., Professional but warm).
    4. **Master Timeline**: Break down the total duration into modules with realistic timing (including breaks).

    **OUTPUT FORMAT**:
    Return ONLY valid JSON matching this structure:
    {
      "terminology": {
        "participant": "string",
        "trainer": "string",
        "exercise": "string",
        "mandatoryTerms": {
          "term_key": { "term": "string", "definition": "string" }
        }
      },
      "narrativeUniverse": {
        "protagonists": [
          {
            "name": "string",
            "role": "string",
            "personality": "string",
            "initial_state": "string",
            "final_state": "string",
            "arc": [
              { "module_index": number, "challenge": "string", "learns": "string", "transformation": "string" }
            ]
          }
        ]
      },
      "voiceProfile": {
        "formality": "buddy" | "professional" | "academic",
        "humorLevel": "none" | "light" | "heavy",
        "forbiddenPhrases": ["string"],
        "signaturePhrases": ["string"]
      },
      "masterTimeline": {
        "totalDuration": number,
        "bufferPerModule": number,
        "modules": [
          { 
            "id": "string", 
            "title": "string", 
            "duration": number,
            "activities": [
               { "type": "theory|exercise|break", "duration": number, "description": "string" }
            ]
          }
        ]
      }
    }
  `;
};

// Helper to format DNA as Markdown for the User
const formatDNAToMarkdown = (dna: any, language: string) => {
  if (!dna) return "Error: No DNA generated.";
  
  const isRo = language && (language.toLowerCase().includes('ro') || language.toLowerCase().includes('romanian'));
  const p = dna.narrativeUniverse?.protagonists?.[0];
  
  if (isRo) {
    return `
# 🧬 Course DNA (Blueprint & Standards)

> **Rolul acestui document:** Acesta este "Contractul de Consistență" pentru întregul curs. AI-ul va respecta strict aceste definiții în toate modulele, slide-urile și manualele.

---

## 1. 🗣️ Dicționar & Terminologie
Vom folosi acești termeni **peste tot**, fără excepție:

| Concept | Termen Oficial | Definiție Scurtă |
|:---|:---|:---|
| **Audiența** | **${dna.terminology?.participant || 'Participant'}** | Cel care învață. |
| **Tu (Trainerul)** | **${dna.terminology?.trainer || 'Facilitator'}** | Cel care livrează cursul. |
| **Practica** | **${dna.terminology?.exercise || 'Activitate'}** | Momentele practice. |

**Termeni Cheie Obligatorii:**
${Object.values(dna.terminology?.mandatoryTerms || {}).map((t: any) => `- **${t.term}**: ${t.definition}`).join('\n')}

---

## 2. 🎭 Universul Narativ (Povestea Cursului)
Pentru a lega modulele între ele, vom urmări povestea acestui personaj:

### 👤 Protagonist: **${p?.name || 'N/A'}**
*   **Rol:** ${p?.role || 'N/A'}
*   **Personalitate:** ${p?.personality || 'N/A'}
*   **Misiunea (Arc):** ${Array.isArray(p?.arc) ? p.arc.map((a: any) => `Modul ${a.module_index}: ${a.challenge} → ${a.transformation}`).join('; ') : (p?.arc || 'N/A')}

*Acest personaj va apărea în studiile de caz și exerciții în fiecare modul.*

---

## 3. 🎙️ Vocea și Tonul
*   **Stil:** ${dna.voiceProfile?.formality || 'Professional'}
*   **Nivel Umor:** ${dna.voiceProfile?.humorLevel || 'Light'}
*   **Expresii Semnătură:** "${dna.voiceProfile?.signaturePhrases?.join('", "') || ''}"
*   **⛔ INTERZIS:** "${dna.voiceProfile?.forbiddenPhrases?.join('", "') || ''}"

---

## 4. ⏱️ Master Timeline (Structura Temporală)
**Durata Totală:** ${dna.masterTimeline?.totalDuration} minute

${dna.masterTimeline?.modules?.map((m: any) => `
### 🔹 ${m.title} (${m.duration} min)
${m.activities?.map((a: any) => `- **${a.duration} min** [${a.type.toUpperCase()}] ${a.description}`).join('\n')}
`).join('\n')}
  `.trim();
  }

  // English Version (Default)
  return `
# 🧬 Course DNA (Blueprint & Standards)

> **Role of this document:** This is the "Consistency Contract" for the entire course. The AI will strictly adhere to these definitions across all modules, slides, and manuals.

---

## 1. 🗣️ Dictionary & Terminology
We will use these terms **everywhere**, without exception:

| Concept | Official Term | Short Definition |
|:---|:---|:---|
| **The Audience** | **${dna.terminology?.participant || 'Participant'}** | The learner. |
| **You (The Trainer)** | **${dna.terminology?.trainer || 'Facilitator'}** | The one delivering the course. |
| **Practice** | **${dna.terminology?.exercise || 'Activity'}** | The practical moments. |

**Mandatory Key Terms:**
${Object.values(dna.terminology?.mandatoryTerms || {}).map((t: any) => `- **${t.term}**: ${t.definition}`).join('\n')}

---

## 2. 🎭 Narrative Universe (The Course Story)
To link modules together, we will follow the story of this character:

### 👤 Protagonist: **${p?.name || 'N/A'}**
*   **Role:** ${p?.role || 'N/A'}
*   **Personality:** ${p?.personality || 'N/A'}
*   **Mission (Arc):** ${Array.isArray(p?.arc) ? p.arc.map((a: any) => `Module ${a.module_index}: ${a.challenge} → ${a.transformation}`).join('; ') : (p?.arc || 'N/A')}

*This character will appear in case studies and exercises in every module.*

---

## 3. 🎙️ Voice and Tone
*   **Style:** ${dna.voiceProfile?.formality || 'Professional'}
*   **Humor Level:** ${dna.voiceProfile?.humorLevel || 'Light'}
*   **Signature Phrases:** "${dna.voiceProfile?.signaturePhrases?.join('", "') || ''}"
*   **⛔ FORBIDDEN:** "${dna.voiceProfile?.forbiddenPhrases?.join('", "') || ''}"

---

## 4. ⏱️ Master Timeline (Time Structure)
**Total Duration:** ${dna.masterTimeline?.totalDuration} minutes

${dna.masterTimeline?.modules?.map((m: any) => `
### 🔹 ${m.title} (${m.duration} min)
${m.activities?.map((a: any) => `- **${a.duration} min** [${a.type.toUpperCase()}] ${a.description}`).join('\n')}
`).join('\n')}
  `.trim();
};

const getMainPrompt = (
  course: Course,
  step_type: string,
  blueprintDuration: string,
  fileContext: string,
  structuredContext: string,
  previousContext: string,
  fullStructureContext: string = "",
  explicitModuleList: string = ""
) => {
  const specificPrompt = getStepPrompt(step_type, course, blueprintDuration, explicitModuleList);
  const durationEnforcement = getDurationEnforcement(blueprintDuration);

  // --- NEW: Inject Course DNA if available ---
  let dnaContext = "";
  if (course.dna) {
    const dna = course.dna;
    dnaContext = `
    **🧬 COURSE DNA (STRICT CONSISTENCY RULES)**:
    - **TERMINOLOGY**: Use "${dna.terminology.participant}" (learner), "${dna.terminology.trainer}" (you), "${dna.terminology.exercise}" (practice).
    - **MANDATORY TERMS**: ${Object.values(dna.terminology.mandatoryTerms || {}).map((t: any) => `${t.term} (${t.definition})`).join(', ')}.
    - **TONE**: ${dna.voiceProfile.formality}, Humor: ${dna.voiceProfile.humorLevel}.
    - **FORBIDDEN**: Do NOT use these phrases: ${dna.voiceProfile.forbiddenPhrases.join(', ')}.
    - **PROTAGONIST**: ${dna.narrativeUniverse.protagonists?.[0]?.name} (${dna.narrativeUniverse.protagonists?.[0]?.role}). Arc: ${dna.narrativeUniverse.protagonists?.[0]?.arc}.
    `;
  }

  return `
    **ROLE**: You are a World-Class Instructional Designer and Curriculum Architect.
    **CONTEXT**: Creating a **${course.environment}** course titled "**${course.title}**".
    **TARGET AUDIENCE**: ${course.target_audience}
    **LANGUAGE**: ${course.language}

    ${dnaContext}

    ${durationEnforcement}

    **ENVIRONMENT ADAPTATION (${course.environment}):**
    ${course.environment === 'LiveWorkshop' ? 
      `- Focus on GROUP ACTIVITIES, physical handouts, and face-to-face interaction prompts.
       - Include 'Breaks' and 'Icebreakers'.
       - Use phrases like 'Turn to your neighbor', 'In your groups', 'Raise your hand'.` 
      : ''}
    ${course.environment === 'OnlineCourse' ? 
      `- Focus on SELF-PACED learning, digital quizzes, and screen-friendly formatting.
       - Include 'Reflection moments' instead of group work.
       - Use phrases like 'Pause the video', 'Download the worksheet', 'Think about this'.` 
      : ''}

    ${fileContext ? `**REFERENCE MATERIALS**:\n${fileContext}\n` : ''}

    ${explicitModuleList ? `\n**💎 OFFICIAL BLUEPRINT (SUPREME SOURCE OF TRUTH)**:\nThe user has approved the following structure. You MUST follow this EXACT list of modules. If the "Historical Context" below differs, IGNORE IT and follow this list:\n${explicitModuleList}\n` : ''}

    ${fullStructureContext ? `\n**HISTORICAL CONTEXT (Previous Structure)**:\n${fullStructureContext}\n\n**WARNING**: This context might be outdated (user may have edited the blueprint). Use it for content inspiration/depth, but NOT for module structure/ordering.\n` : ''}

    ${structuredContext}

    ${previousContext}

    ${specificPrompt}

    **OUTPUT RULES**:
    1. Output ONLY the requested content in Markdown.
    2. Write ALL headings, labels, and content strictly in the specified **LANGUAGE**; no mixed-language, no English fillers (e.g., "Welcome!").
    3. Maintain consistency with previously defined modules and titles; do not add new modules unless explicitly requested.
    4. Be thorough and professional.
  `;
};

// --- HELPER: Full DNA Context Extraction ---
function getFullDNAContext(dna: any): string {
  if (!dna) return "";
  
  const terms = dna.terminology?.mandatoryTerms 
    ? Object.values(dna.terminology.mandatoryTerms).map((t: any) => `${t.term} (${t.definition})`).join(', ')
    : "None";

  const forbidden = dna.voiceProfile?.forbiddenPhrases?.join(', ') || "None";
  const protagonist = dna.narrativeUniverse?.protagonists?.[0];

  return `
    **🧬 COURSE DNA (SUPREME SOURCE OF TRUTH)**:
    The following DNA settings OVERRIDE any generic tone instructions below:
    
    1. **VOICE & TONE**: 
       - Formality: **${dna.voiceProfile?.formality || 'Conversational'}**
       - Humor Level: **${dna.voiceProfile?.humorLevel || 'Light'}**
       - Signature Phrases: "${dna.voiceProfile?.signaturePhrases?.join('", "') || ''}"
    
    2. **TERMINOLOGY (Strict)**: 
       - Participant -> "${dna.terminology?.participant || 'Participant'}"
       - Trainer -> "${dna.terminology?.trainer || 'Facilitator'}"
       - Exercise -> "${dna.terminology?.exercise || 'Activity'}"
       - **MANDATORY TERMS**: ${terms}
       
    3. **FORBIDDEN PHRASES**: 
       - ⛔ DO NOT USE: ${forbidden}
    
    4. **NARRATIVE UNIVERSE (Protagonist)**:
       - **Name**: ${protagonist?.name || 'N/A'}
       - **Role**: ${protagonist?.role || 'N/A'}
       - **Context**: ${protagonist?.personality || ''}
       - **Arc**: ${protagonist?.arc || ''}
       *Use this character for ALL examples and case studies.*
    `;
}

// --- ITERATIVE GENERATION HELPERS ---

function getWorkbookModulePrompt(
  course: Course,
  module: any,
  moduleIndex: number,
  fileContext: string
): string {
  
  const dnaContext = getFullDNAContext(course.dna);

  return `
    **ROLE**: You are an expert Instructional Designer.
    **TASK**: Generate workbook content for **ONE MODULE ONLY**.
    **LANGUAGE**: ${course.language}
    
    ${dnaContext}

    ${getToneInstructions(course)}

    ${getDepthSpecs(course.language).workbook}

    **MODULE DETAILS**:
    - Module Number: ${moduleIndex + 1}
    - Title: ${module.title}
    - Learning Objective: ${module.learning_objective || 'N/A'}
    
    **EXACT STRUCTURE TO FOLLOW (Markdown)**:
    (Replace [Translate: "Text"] with the actual translation in ${course.language}. Do NOT output the brackets or "Translate:" tag.)

    ## ${module.title}

    ### [Translate: "Why this matters"] (200-300 words)
    [Intro paragraph explaining importance. Hook the reader with a relatable problem. FOLLOW TONE INSTRUCTIONS: NO academic intros!]

    ### [Concept Title 1]
    #### [Translate: "Core Concept"] (300-500 words)
    [Full explanation. Define terms, provide context. FOLLOW TONE INSTRUCTIONS: Buddy-to-buddy tone.]

    **[Translate: "Real World Example"] (NARRATIVE ARC):** (200-300 words)
    [Continue the story of **${course.dna?.narrativeUniverse?.protagonists?.[0]?.name || 'the protagonist'}**. Show how they face a challenge related to this module's concept and how they apply the solution.]

    ---
    🎯 **[Translate: "Practical Exercise"] ${moduleIndex + 1}.1**
    **[Translate: "Objective"]:** [What specific skill will be practiced]
    **[Translate: "Duration"]:** [Time] min
    
    **[Translate: "Instructions"]:**
    1. [Clear Step 1]
    2. [Clear Step 2]
    
    **[Translate: "Workspace"]:**
    [Insert ample space for writing/answering]
    
    **[Translate: "Success Checklist"]:**
    - [ ] [Translate: "I identified..."]
    - [ ] [Translate: "I applied..."]
    ---

    ### [Translate: "Recap"] ${module.title}
    > **[Translate: "Remember"]:** [Key takeaway 1]
    > **[Translate: "Remember"]:** [Key takeaway 2]

    ${getToneInstructions(course)}

    ${fileContext ? `**REFERENCE MATERIALS:**\n${fileContext}\n` : ''}

    **CRITICAL REQUIREMENTS:**
    1. Generate COMPLETE content for this ONE module only.
    2. Target length: ~1,500 words.
    3. Do NOT start the next module.
    4. Do NOT truncate sentences.
  `;
}

async function generateWorkbookIteratively(
  course: Course,
  blueprint: any,
  fileContext: string,
  genAI: any,
  supabase?: any,
  userId?: string
): Promise<string> {
  const sections: string[] = [];
  
  // 1. Introduction
  const introPrompt = `
    **TASK**: Generate the Introduction section for the Participant Workbook.
    **COURSE**: ${course.title}
    **TARGET AUDIENCE**: ${course.target_audience}
    **LANGUAGE**: ${course.language}
    
    **CONTENT**:
    - Welcome message
    - How to use this workbook
    - Course Objectives Overview
    
    ${getToneInstructions(course)}
  `;
  
  console.log("[Iterative] Generating Workbook Intro...");
  const intro = await generateContent(introPrompt, false, genAI, supabase, userId, 'workbook_intro');
  sections.push(intro);

  // 2. Modules (Parallel Batches)
  if (blueprint && Array.isArray(blueprint.modules)) {
      const modules = blueprint.modules;
      const BATCH_SIZE = 3; // Process 3 modules at a time
      
      for (let i = 0; i < modules.length; i += BATCH_SIZE) {
          const batch = modules.slice(i, i + BATCH_SIZE);
          console.log(`[Iterative] Generating Workbook Batch ${Math.floor(i/BATCH_SIZE)+1} (${batch.length} modules)...`);
          
          const batchResults = await Promise.all(batch.map(async (module, index) => {
              const globalIndex = i + index;
              const modulePrompt = getWorkbookModulePrompt(course, module, globalIndex, fileContext);
              try {
                  let content = await generateContent(modulePrompt, false, genAI, supabase, userId, `workbook_module_${globalIndex+1}`);
                  
                  // Enhanced validation via PS-1 logic
                  const validation = validateModule(content);
                  if (!validation.passed || validation.warnings.some(w => w.includes('Practical Exercise'))) {
                      console.warn(`[Iterative] Module ${globalIndex+1} validation issues:`, validation);
                      
                      // Retry logic for length or missing key elements
                      const feedback = validation.errors.concat(validation.warnings).join('; ');
                      console.warn(`[Iterative] Retrying Module ${globalIndex+1} due to: ${feedback}`);
                      
                      const retryPrompt = `${modulePrompt}\n\n**SYSTEM NOTICE**: Your previous output was rejected. Reason: ${feedback}. \n\nPLEASE CORRRECT THIS. Ensure the content is comprehensive (1500+ words) and includes a Practical Exercise (Target emoji 🎯).`;
                      content = await generateContent(retryPrompt, false, genAI, supabase, userId, `workbook_module_${globalIndex+1}_retry`);
                  }
                  return content;
              } catch (err) {
                  console.error(`Error generating module ${module.title}:`, err);
                  return `## Module ${globalIndex+1}: ${module.title}\n\n(Content generation failed. Please consult the slides for this section.)`;
              }
          }));
          
          sections.push(...batchResults);
          
          // Small delay between batches to be safe
          if (i + BATCH_SIZE < modules.length) {
             await new Promise(r => setTimeout(r, 1000));
          }
      }
  }

  // 3. Conclusion
  const conclusionPrompt = `
    **TASK**: Generate the Conclusion section for the Participant Workbook.
    **COURSE**: ${course.title}
    **LANGUAGE**: ${course.language}
    
    **CONTENT**:
    - Final encouraging words
    - "What's Next" action plan
    - Additional Resources placeholders
    
    ${getToneInstructions(course)}
  `;
  console.log("[Iterative] Generating Workbook Conclusion...");
  const conclusion = await generateContent(conclusionPrompt, false, genAI, supabase, userId, 'workbook_conclusion');
  sections.push(conclusion);

  const finalWorkbook = sections.join('\n\n---\n\n');

  // PS-1: Final Workbook Validation
  const wbValidation = validateWorkbook(finalWorkbook, course.blueprint);
  if (!wbValidation.passed || wbValidation.warnings.length > 0) {
      console.warn("Workbook validation report:", { errors: wbValidation.errors, warnings: wbValidation.warnings });
  }

  return finalWorkbook;
}

function getSlideModulePrompt(
  course: Course,
  module: any,
  moduleIndex: number,
  fileContext: string
): string {
  const envSuffix = course.environment === 'OnlineCourse' ? 'online' : 'live';
  const dnaContext = getFullDNAContext(course.dna);
  
  return `
    **TASK**: Generate Slide Content for **ONE MODULE ONLY**.
    **MODULE**: ${moduleIndex + 1}. ${module.title}
    **GOAL**: Create the visual support structure for this specific module.
    
    **LANGUAGE**: The content MUST be in **${course.language}**.
    
    ${dnaContext}

    ${getToneInstructions(course)}

    **STRUCTURE ALIGNMENT (CRITICAL)**:
    Your slides MUST mirror the flow of the Participant Workbook for this module:
    1. **Hook/Why this matters** (1 slide)
    2. **Core Concept** (1-2 slides) - Explaining the main theory.
    3. **Real World Example** (1 slide) - The story/case study.
    4. **Practical Exercise** (1 slide) - Instructions for the activity.
    5. **Recap/Takeaways** (1 slide)
    
    **QUANTITY**: Exactly 5-6 slides per module.
    
    **CRITICAL OUTPUT RULE**:
    - Output ONLY valid XML tags.
    - Start with <SLIDE_BEGIN id="...">
    - Do not wrap in markdown code blocks.
    - Use the exact XML template provided below.
    
    ${getDepthSpecs(course.language).slides}
    
    **THE GOLDEN STANDARD**:
    ${GOLDEN_SAMPLES[`slides_${envSuffix}`] || GOLDEN_SAMPLES.slides_live}
  `;
}

function getExerciseModulePrompt(
  course: Course,
  module: any,
  moduleIndex: number,
  fileContext: string
): string {
  const dnaContext = getFullDNAContext(course.dna);

  return `
    **TASK**: Design One Practical Exercise (Deep Content) for Module ${moduleIndex + 1}.
    **MODULE**: ${module.title}
    **GOAL**: Create detailed, actionable instructions for hands-on activities that reinforce learning.
    **LANGUAGE**: The content MUST be in **${course.language}**.
    
    ${dnaContext}

    ${getDepthSpecs(course.language).exercises}
    ${getToneInstructions(course)}

    **EXERCISE DEPTH ENGINE (MANDATORY STRUCTURE)**:
    (Replace [Translate: "Text"] with the actual translation in ${course.language}. Do NOT output the brackets or "Translate:" tag.)
    You must provide:
    1. **[Translate: "Exercise Title & Objective"]**: Clear, action-oriented.
    2. **[Translate: "Intro Script"] (Verbatim)**: EXACTLY what the trainer says (Hook -> Instructions -> Timing -> Go Signal).
    3. **[Translate: "Timing Breakdown"] (Table)**: 
       - Columns: Min | Facilitator Action | Participant Action | Red Flags.
       - Apply Reality Buffers (e.g., +40% for Group Work).
    4. **[Translate: "Debrief Script"]**: 3 specific questions (Factual, Analytical, Applicative) + Expected Answers.
    5. **[Translate: "Linkage"]**: Backward link (what concept it builds on) and Forward link (where the result is used).
    6. **[Translate: "Troubleshooting"]**: 3 specific scenarios (e.g., "Group is silent", "Time running out").
    7. **[Translate: "Validation Criteria"]**: How the trainer knows it worked.
    
    **OUTPUT FORMAT**:
    Use Markdown. Start with "### Exercise Module ${moduleIndex + 1}: [Title]"
  `;
}

async function generateExercisesIteratively(
  course: Course,
  blueprint: any,
  fileContext: string,
  genAI: any,
  supabase?: any,
  userId?: string
): Promise<string> {
  const sections: string[] = [];
  
  if (blueprint && Array.isArray(blueprint.modules)) {
      const modules = blueprint.modules;
      const BATCH_SIZE = 3; 
      
      for (let i = 0; i < modules.length; i += BATCH_SIZE) {
          const batch = modules.slice(i, i + BATCH_SIZE);
          console.log(`[Iterative] Generating Exercises Batch ${Math.floor(i/BATCH_SIZE)+1} (${batch.length} modules)...`);
          
          const batchResults = await Promise.all(batch.map(async (module, index) => {
              const globalIndex = i + index;
              const modulePrompt = getExerciseModulePrompt(course, module, globalIndex, fileContext);
              try {
                  let content = await generateContent(modulePrompt, false, genAI, supabase, userId, `exercises_module_${globalIndex+1}`);
                  return content;
              } catch (err) {
                  console.error(`Error generating exercise for module ${module.title}:`, err);
                  return `### Module ${globalIndex+1}: ${module.title}\n\n(Exercise generation failed.)`;
              }
          }));
          
          sections.push(...batchResults);
          
          if (i + BATCH_SIZE < modules.length) {
             await new Promise(r => setTimeout(r, 1000));
          }
      }
  }

  return sections.join('\\n\\n---\\n\\n');
}

async function generateSlidesIteratively(
  course: Course,
  blueprint: any,
  fileContext: string,
  genAI: any,
  supabase?: any,
  userId?: string
): Promise<string> {
  const sections: string[] = [];
  
  if (blueprint && Array.isArray(blueprint.modules)) {
      const modules = blueprint.modules;
      // Process modules sequentially or in small batches to ensure we don't hit rate limits too hard
      const BATCH_SIZE = 3; 
      
      for (let i = 0; i < modules.length; i += BATCH_SIZE) {
          const batch = modules.slice(i, i + BATCH_SIZE);
          console.log(`[Iterative] Generating Slides Batch ${Math.floor(i/BATCH_SIZE)+1} (${batch.length} modules)...`);
          
          const batchResults = await Promise.all(batch.map(async (module, index) => {
              const globalIndex = i + index;
              const modulePrompt = getSlideModulePrompt(course, module, globalIndex, fileContext);
              try {
                  let content = await generateContent(modulePrompt, false, genAI, supabase, userId, `slides_module_${globalIndex+1}`);
                  
                  // Cleanup markdown if present
                   content = content.replace(/```xml/gi, '')
                            .replace(/```markdown/gi, '')
                            .replace(/```/g, '')
                            .trim();

                  return content;
              } catch (err) {
                  console.error(`Error generating slides for module ${module.title}:`, err);
                  return `<!-- Error generating slides for Module ${globalIndex+1} -->`;
              }
          }));
          
          sections.push(...batchResults);
          
          if (i + BATCH_SIZE < modules.length) {
             await new Promise(r => setTimeout(r, 1000));
          }
      }
  }

  return sections.join('\n\n');
}

// --- AI CLIENT ---

// --- USAGE TRACKING ---
async function saveTokenUsage(
  supabase: any,
  userId: string,
  model: string,
  inputTokens: number,
  outputTokens: number,
  action: string
) {
  if (!supabase || !userId) {
    console.warn(`[Usage] Skipping save: supabase=${!!supabase}, userId=${userId}`);
    return;
  }
  
  try {
    const { error } = await supabase.from('user_usage').insert({
      user_id: userId,
      model: model,
      input_tokens: inputTokens,
      output_tokens: outputTokens,
      total_tokens: inputTokens + outputTokens,
      action: action
    });
    
    if (error) {
       console.error(`[Usage] Supabase Insert Error:`, error);
    } else {
       console.log(`[Usage] Saved ${inputTokens + outputTokens} tokens for ${model} (${action})`);
    }
  } catch (err) {
    console.warn(`[Usage] Failed to save usage:`, err);
  }
}

async function generateWithKimi(
  prompt: string, 
  isJsonMode: boolean,
  supabase?: any,
  userId?: string,
  actionContext?: string
): Promise<string> {
  const base = Deno.env.get('MOONSHOT_API_URL') ?? Deno.env.get('KIMI_API_URL') ?? 'https://api.moonshot.ai/v1';
  const url = base.endsWith('/v1') ? `${base}/chat/completions` : (base.endsWith('/chat/completions') ? base : `${base}/chat/completions`);
  const key = Deno.env.get('MOONSHOT_API_KEY') ?? Deno.env.get('KIMI_API_KEY');
  if (!key) throw new Error('MOONSHOT_API_KEY (or KIMI_API_KEY) is not set.');
  
  const isMoonshotKey = !!Deno.env.get('MOONSHOT_API_KEY');
  const model = Deno.env.get('MOONSHOT_MODEL') ?? Deno.env.get('KIMI_MODEL') ?? (isMoonshotKey ? 'moonshot-v1-8k' : 'kimi-k2-turbo-preview');
  
  const body: {
    model: string;
    messages: { role: string; content: string }[];
    response_format?: { type: string };
    temperature?: number;
  } = {
    model,
    messages: [{ role: 'user', content: prompt }]
  };
  
  if (isJsonMode) {
    body.response_format = { type: 'json_object' };
  }
  
  body.temperature = 0.6;
  
  const resp = await fetch(url, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  
  if (!resp.ok) {
    const t = await resp.text();
    throw new Error(t || `Kimi error ${resp.status}`);
  }
  
  const data = await resp.json();

  // Usage tracking
  if (data?.usage && supabase && userId) {
      await saveTokenUsage(
          supabase,
          userId,
          data.model || model,
          data.usage.prompt_tokens || 0,
          data.usage.completion_tokens || 0,
          actionContext || 'moonshot_generation'
      );
  }

  let text = '';
  try {
    text = (data?.choices?.[0]?.message?.content ?? '') as string;
  } catch (_) { void 0; }
  
  if (!text || typeof text !== 'string') {
    text = JSON.stringify(data);
  }
  
  return text;
}

async function generateContent(
  prompt: string, 
  isJsonMode: boolean, 
  genAI: GoogleGenerativeAI | null,
  supabase?: any,
  userId?: string,
  actionContext?: string
): Promise<string> {
  // 1. Try Google Gemini (Flash Lite -> Flash -> Pro/Standard)
  if (genAI) {
    const modelsToTry = [
      'gemini-2.0-flash-lite-preview-02-05',
      'gemini-2.0-flash',
      'gemini-1.5-flash',
      'gemini-1.5-pro'
    ];
    
    for (const modelName of modelsToTry) {
      try {
        console.log(`Trying Gemini model: ${modelName}`);
        const model = genAI.getGenerativeModel({ 
            model: modelName,
            generationConfig: {
                responseMimeType: isJsonMode ? "application/json" : "text/plain"
            }
        });
        const result = await model.generateContent(prompt);
        
        // Usage tracking for Gemini
        if (result.response.usageMetadata && supabase && userId) {
            const usage = result.response.usageMetadata;
            await saveTokenUsage(
                supabase,
                userId,
                modelName,
                usage.promptTokenCount || 0,
                usage.candidatesTokenCount || 0,
                actionContext || 'gemini_generation'
            );
        } else {
            console.log(`[Usage] Missing metadata or context for Gemini: metadata=${!!result.response.usageMetadata}, supabase=${!!supabase}, userId=${userId}`);
        }

        const text = result.response.text();
        if (text) return text;
      } catch (err) {
        console.warn(`Gemini ${modelName} failed:`, err);
        // Continue to next model
      }
    }
  }

  // 2. Fallback to Kimi/Moonshot
  console.log("Falling back to Kimi/Moonshot...");
  return await generateWithKimi(prompt, isJsonMode, supabase, userId, actionContext);
}

// --- VALIDATION HELPER ---
function validateGeneratedContent(text: string, step_type: string, blueprint: any): { isValid: boolean; reason?: string } {
  if (!text || text.length < 100) return { isValid: false, reason: "Content too short" };

  // Validation for specific steps
  if (step_type === 'structure' || step_type === 'timing_and_flow') {
     // Check if it looks like a structure (has modules)
     if (!text.toLowerCase().includes('modul') && !text.toLowerCase().includes('module')) {
        return { isValid: false, reason: "Missing 'Module' keywords in structure" };
     }
  }

  if (step_type === 'participant_workbook') {
     // Check for significant length/depth
     if (text.length < 2000) {
        return { isValid: false, reason: "Workbook content dangerously short (<2000 chars)" };
     }
     
     // Check if it follows the template structure roughly
     if (!text.includes('###') && !text.includes('**')) {
        return { isValid: false, reason: "Missing Markdown formatting" };
     }
  }

  // --- MODULE COUNT VALIDATION (GLOBAL) ---
  // If we have a blueprint with modules, ensure the output mentions roughly the same number of modules
  if (step_type !== 'structure' && step_type !== 'course_objectives' && step_type !== 'performance_objectives' && blueprint?.modules && Array.isArray(blueprint.modules)) {
      const expectedCount = blueprint.modules.length;
      if (expectedCount > 0) {
          // 1. Strict Count Check (Expanded Regex for multi-language)
          const matches = (text.match(/(modul|module|le|section|week|capitol|unit|part|tema|subiect)\s*\d+/gi) || []).length;
          
          if (step_type === 'video_scripts') {
               const visualMatches = (text.match(/\[VISUAL\]/gi) || []).length;
               if (visualMatches < expectedCount) {
                   return { isValid: false, reason: `Expected at least ${expectedCount} video scripts (one per module), found only ${visualMatches} [VISUAL] tags. Did you skip modules?` };
               }
          } else {
               // STRICTER CHECK: For Workbook/Exercises, we want EXACT match or +1 (never less)
               const tolerance = (step_type === 'participant_workbook' || step_type === 'course_steps_exercises') ? 0 : 1;
               
               if (matches < expectedCount - tolerance) {
                   return { isValid: false, reason: `Content incomplete. Expected ${expectedCount} modules (based on Blueprint), found mention of ${matches}. Please ensure you cover ALL modules.` };
               }
          }

          // 2. Specific Module Presence Check (Core Title Check)
          let missingModules: string[] = [];
          for (const m of blueprint.modules) {
              const title = m.title || "";
              // Extract core part (e.g., "Modulul 1") or just use the first few words if it doesn't have "Modulul"
              const parts = title.split(':');
              const core = parts[0].trim(); 
              
              if (core.length > 2) {
                  // Escape special characters for regex
                  const pattern = new RegExp(core.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
                  if (!pattern.test(text)) {
                      missingModules.push(core);
                  }
              }
          }
          
          // STRICTER: Fail if ANY module header is missing in Workbook/Exercises
          const missingTolerance = (step_type === 'participant_workbook' || step_type === 'course_steps_exercises') ? 0 : 1;
          
          if (missingModules.length > missingTolerance) {
               return { 
                   isValid: false, 
                   reason: `Missing content for modules: ${missingModules.join(', ')}. Please generate content for ALL modules.` 
               };
          }
      }
  }

  return { isValid: true };
}

// --- HASH HELPER ---
async function sha256(message: string) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// --- STEP TYPE NORMALIZER ---
function normalizeStepType(s?: string): string {
  if (!s) return '';
  let t = String(s).trim();
  // strip common prefixes
  t = t.replace(/^generation\.steps\./i, '')
       .replace(/^course\.steps\./i, '')
       .replace(/^steps\./i, '');
  // camelCase to snake_case
  t = t.replace(/([a-z0-9])([A-Z])/g, '$1_$2');
  // dots/hyphens to underscores
  t = t.replace(/[.\-]/g, '_');
  return t.toLowerCase();
}

// --- MAIN SERVER ---

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

const STEP_TITLES: { [key: string]: string } = {
  'course.steps.structure': "Structure & Agenda",
  'course.steps.slides': "Slides Content",
  'course.steps.exercises': "Practical Exercises",
  'course.steps.manual': "Trainer/Student Manual",
  'course.steps.tests': "Final Test/Assessment",
  'course.steps.video_scripts': "Video Scripts",
  'course.steps.projects': "Practical Projects",
  'course.steps.cheat_sheets': "Cheat Sheets / Summary Cards"
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const {
      course,
      step,
      action,
      originalContent,
      messages,
      chat_history,
      refinePayload,
      context_files,
      fileContent,
      fileName,
      environment,
      blueprint,
      existingContent,
      step_type,
      previous_steps,
      context_summary,
      part_type,
      module_data,
      module_index
    } = await req.json();

    // ENHANCEMENT: Normalize language code to full English name for better AI adherence
    if (course && course.language) {
       course.language = getLanguageName(course.language);
    }

    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
    const authHeader = req.headers.get('Authorization');
    const globalHeaders: Record<string, string> = {};
    if (authHeader && typeof authHeader === 'string' && authHeader.trim().length > 0) {
      globalHeaders['Authorization'] = authHeader;
    }
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: globalHeaders },
    });

    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id;

    // --- NEW: Refresh Course DNA from DB to ensure Single Source of Truth consistency ---
    if (course && course.id) {
       const { data: dbCourse } = await supabase.from('courses').select('dna').eq('id', course.id).single();
       if (dbCourse && dbCourse.dna) {
           console.log(`[Edge] Refreshed Course DNA from DB for ${course.id}`);
           course.dna = dbCourse.dna;
       }
    }

    // --- FIX PS-18: Sync Blueprint from payload to course object ---
    // The 'blueprint' top-level parameter often contains the latest manual edits from the UI,
    // whereas 'course.blueprint' might be stale. We MUST use the explicit blueprint if provided.
    if (blueprint && blueprint.modules && Array.isArray(blueprint.modules)) {
        console.log(`[Edge] PS-18: Overriding course.blueprint with explicit 'blueprint' payload (Modules: ${blueprint.modules.length})`);
        // Ensure we don't lose other course properties, just update the blueprint
        if (course) {
            course.blueprint = blueprint;
        }
    }

    const genAI = geminiApiKey ? new GoogleGenerativeAI(geminiApiKey) : null;

    const stepTitle = step ? (STEP_TITLES[step.title_key] || "Unknown Step") : "General";
    
    console.log(`[Edge] Request: action=${action}, step_type=${step_type}, step_key=${step?.title_key}, userId=${userId || 'MISSING'}`);

    if (!userId) {
      console.warn("[Edge] WARNING: User ID is missing. Token usage will NOT be tracked.");
      if (authHeader) console.log("[Edge] Auth header is present but getUser failed or returned null.");
      else console.log("[Edge] Auth header is MISSING.");
    }

    let prompt;
    let isJsonMode = false;

    let fileContext = "";
    if (context_files && context_files.length > 0) {
      const { data: files, error } = await supabase
        .from('course_files')
        .select('filename, extracted_text')
        .in('id', context_files);

      if (!error && Array.isArray(files)) {
        const parts = files.map((f: { filename: string; extracted_text: string | null }) => {
          const name = (f.filename || '').trim();
          const text = (f.extracted_text || '').trim().replace(/\s+/g, ' ');
          const snippet = text.length > 800 ? text.substring(0, 800) + '…' : text;
          return `• ${name}: ${snippet}`;
        });
        fileContext = parts.join('\n');
      }
    }


    if (action === 'ping') {
      return new Response(JSON.stringify({ message: 'pong' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      });
    }

    if (action === 'provider_status') {
      const googleConfigured = !!Deno.env.get('GEMINI_API_KEY');
      const moonshotConfigured = !!(Deno.env.get('MOONSHOT_API_KEY') || Deno.env.get('KIMI_API_KEY'));
      const activeProvider = googleConfigured ? 'google' : (moonshotConfigured ? 'moonshot' : 'none');
      return new Response(JSON.stringify({ googleConfigured, moonshotConfigured, activeProvider }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      });
    }

    if (action === 'analyze_upload') {
      isJsonMode = true;
      prompt = getAnalyzeUploadPrompt(fileName, fileContent, environment);
    } else if (action === 'fill_gaps') {
      isJsonMode = true;
      prompt = getFillGapsPrompt(blueprint, existingContent);
    } else if (action === 'generate_learning_objectives') {
      isJsonMode = true;
      prompt = getLearningObjectivesPrompt(course, fileContext);
    } else if (action === 'chat_onboarding') {
      isJsonMode = true;
      const conversationHistory = messages || chat_history || [];
      const history = (conversationHistory as Array<{ role: string; content: string }>)
        .map((m) => `${(m.role || 'user').toUpperCase()}: ${m.content || ''}`)
        .join('\n');
      
      prompt = getChatOnboardingPrompt(course, history, fileContext);
    } else if (action === 'improve') {
      prompt = getImprovePrompt(course, stepTitle, originalContent, fileContext);
    } else if (action === 'refine') {
      const { selectedText, actionType } = refinePayload || {};

      if (!selectedText || String(selectedText).trim().length === 0) {
        return new Response(JSON.stringify({ error: 'Empty selection' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }

      prompt = getRefinePrompt(course, selectedText, actionType, fileContext);

    } else if (action === 'generate_workbook_part') {
      // --- NEW: Granular Workbook Generation to avoid Timeouts ---
      
      let text = '';
      if (part_type === 'intro') {
        const introPrompt = `
          **TASK**: Generate the Introduction section for the Participant Workbook.
          **COURSE**: ${course.title}
          **TARGET AUDIENCE**: ${course.target_audience}
          **LANGUAGE**: ${course.language}
          
          **CONTENT**:
          - Welcome message
          - How to use this workbook
          - Course Objectives Overview
          
          ${getToneInstructions(course)}
        `;
        text = await generateContent(introPrompt, false, genAI, supabase, userId, 'workbook_part_intro');

      } else if (part_type === 'outro') {
        const conclusionPrompt = `
          **TASK**: Generate the Conclusion section for the Participant Workbook.
          **COURSE**: ${course.title}
          **LANGUAGE**: ${course.language}
          
          **CONTENT**:
          - Final encouraging words
          - "What's Next" action plan
          - Additional Resources placeholders
          
          ${getToneInstructions(course)}
        `;
        text = await generateContent(conclusionPrompt, false, genAI, supabase, userId, 'workbook_part_outro');

      } else if (part_type === 'module') {
        if (!module_data) throw new Error("Missing module_data for part_type='module'");
        const prompt = getWorkbookModulePrompt(course, module_data, module_index || 0, fileContext);
        text = await generateContent(prompt, false, genAI, supabase, userId, 'workbook_part_module');
        
        // Simple length check retry
        if (text.length < 1000) {
            console.warn(`[WorkbookPart] Module content too short. Retrying...`);
            const retryPrompt = `${prompt}\n\n**SYSTEM NOTICE**: Your previous output was too short. Please expand the content to be at least 1500 words. Add more examples and details.`;
            text = await generateContent(retryPrompt, false, genAI, supabase, userId, 'workbook_part_module_retry');
        }
      }

      return new Response(JSON.stringify({ content: text }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
      });

    } else if (action === 'generate_step_content') {
      // --- NEW: 12-STEP TRAINER FLOW GENERATION ---
      
      let fullStructureContext = "";
      
      const previousContext = previous_steps
        ? (previous_steps as Array<{ step_type: string; content: string }>)
            .map((s) => {
                // Special handling for 'structure': we want to preserve it fully if possible, or at least a very large chunk
                // because it is the "Source of Truth" for all subsequent steps.
                if (s.step_type === 'structure' || s.step_type === 'course_steps_structure') {
                    const content = s.content || '';
                    // Keep up to 20k chars for the structure to ensure we don't lose modules 7-8 etc.
                    fullStructureContext = content.substring(0, 25000); 
                    return `\n--- PREVIOUS STEP: ${s.step_type} ---\n${content.substring(0, 2000)}... (refer to MASTER STRUCTURE above for full content)`;
                }
                return `\n--- PREVIOUS STEP: ${s.step_type} ---\n${(s.content || '').substring(0, 2000)}`;
            })
            .join('\n')
        : "";

      const structuredContext = context_summary
        ? `\n**STRUCTURED CONTEXT**\nModules: ${(context_summary?.modules || []).join('; ')}\nDurations: ${(context_summary?.durations || []).join(', ')}\nExercisesCount: ${context_summary?.exercisesCount ?? 0}\n`
        : "";

      const blueprintDuration = course.blueprint?.estimated_duration || "4 hours";
      
      // Use the modular helper to generate the prompt
      const normalizedStepType = normalizeStepType(step_type);
      
      // Build Explicit Module List for better AI compliance
      let explicitModuleList = "";
      if (course.blueprint?.modules && Array.isArray(course.blueprint.modules)) {
          explicitModuleList = course.blueprint.modules
              .map((m: any, i: number) => {
                  let info = `${i+1}. ${m.title}`;
                  if (m.learning_objective) info += `\n   - Objective: ${m.learning_objective}`;
                  return info;
              })
              .join('\n');
      }

      // --- SPECIAL CASE: Course DNA ---
      if (normalizedStepType === 'course_dna') {
         prompt = getCourseDNAPrompt(course, course.blueprint);
      } else {
         // Standard Prompt Generation
         prompt = getMainPrompt(
            course,
            normalizedStepType,
            blueprintDuration,
            fileContext,
            structuredContext,
            previousContext,
            fullStructureContext,
            explicitModuleList
         );
      }

    } else {
      throw new Error(`Invalid action or missing parameters. Received action: ${action}, step_type: ${step_type}`);
    }

    // --- AI EXECUTION VIA HELPER ---
    try {
        let text = '';
        const normalizedStepType = step_type ? normalizeStepType(step_type) : '';
        const isDNA = normalizedStepType === 'course_dna';
        const isIterative = !isJsonMode && 
                            action === 'generate_step_content' && 
                            (normalizedStepType === 'participant_workbook' || normalizedStepType === 'slides' || normalizedStepType === 'course_steps_exercises') && 
                            course.blueprint?.modules?.length > 0;

        // --- CACHE LAYER ---
        const cacheKey = await sha256(prompt + (isJsonMode ? '_json' : ''));
        
        // Skip cache for Iterative mode as it's composite content
        if (!isIterative) {
            try {
                const { data: cached } = await supabase
                    .from('ai_cache')
                    .select('response')
                    .eq('prompt_hash', cacheKey)
                    .single();
                
                if (cached && cached.response) {
                    console.log(`[Cache] Hit for ${cacheKey.substring(0, 8)}`);
                    text = cached.response;
                }
            } catch (err) {
                console.warn("[Cache] Read failed (ignoring):", err);
            }
        }

        if (!text) {
             if (isIterative) {
                 console.log(`[Main] Executing Iterative Generation for ${normalizedStepType}`);
                 if (normalizedStepType === 'participant_workbook') {
                     text = await generateWorkbookIteratively(course, course.blueprint, fileContext, genAI, supabase, userId);
                 } else if (normalizedStepType === 'slides') {
                     text = await generateSlidesIteratively(course, course.blueprint, fileContext, genAI, supabase, userId);
                 } else if (normalizedStepType === 'course_steps_exercises') {
                     text = await generateExercisesIteratively(course, course.blueprint, fileContext, genAI, supabase, userId);
                 }
             } else if (isDNA) {
                 // Generate JSON DNA
                 console.log(`[Main] Generating Course DNA (JSON Mode)...`);
                 const jsonText = await generateContent(prompt, true, genAI, supabase, userId, 'course_dna');
                 
                 try {
                    // Parse JSON to validate and then format as Markdown for the user
                    const dnaObj = JSON.parse(jsonText);
                    
                    // Save DNA to course object (Single Source of Truth)
                    if (supabase && course.id) {
                        await supabase.from('courses').update({ dna: dnaObj }).eq('id', course.id);
                    }
                    
                    // Return human-readable Markdown for the frontend step content
                    text = formatDNAToMarkdown(dnaObj, course.language);
                 } catch (e) {
                    console.error("Failed to parse generated DNA JSON:", e);
                    text = "Error generating Course DNA. Please try again.";
                 }
             } else {
                 text = await generateContent(prompt, isJsonMode, genAI, supabase, userId, step_type || action || 'unknown_step');
             }

             // --- CLEANUP: Strip Markdown from Slides ---
             if (normalizedStepType === 'slides' && text) {
                 console.log(`[Cleanup] Stripping Markdown from slides (length before: ${text.length})...`);
                 // Remove markdown code blocks (```xml ... ```) and potential markdown wrappers
                 text = text.replace(/```xml/gi, '')
                            .replace(/```markdown/gi, '')
                            .replace(/```/g, '')
                            .trim();
             }
             
             // Save to cache (standard only)
             if (text && text.length > 20 && !isIterative) {
                 try {
                     await supabase.from('ai_cache').insert({
                         prompt_hash: cacheKey,
                         prompt: prompt.substring(0, 10000), 
                         response: text,
                         model: 'unknown'
                     });
                 } catch (err) {
                     console.warn("[Cache] Write failed:", err);
                 }
             }
        }
        
        // --- VALIDATION LAYER ---
        // Only validate if we have a step_type (meaning it's the new flow) and it's not a JSON mode call
        // Skip validation for Iterative mode because it validates internally per module
        if (step_type && !isJsonMode && action === 'generate_step_content' && !isIterative) {
            const normalized = normalizeStepType(step_type);
            console.log(`Validating content for ${normalized}...`);
            
            let validation = validateGeneratedContent(text, normalized, blueprint);
            let attempts = 0;
            const maxRetries = 2;

            while (!validation.isValid && attempts < maxRetries) {
                attempts++;
                console.warn(`Validation failed for ${normalized} (Retry ${attempts}/${maxRetries}): ${validation.reason}`);
                
                const retryPrompt = `${prompt}\n\n**SYSTEM NOTICE**: Your previous output was rejected because: ${validation.reason}. \n\n**CRITICAL**: You MUST fix this. Check the Master Structure and ensure you cover ALL required modules/sections as listed in the MANDATORY CONTENT CHECKLIST.`;
                
                try {
                    text = await generateContent(retryPrompt, isJsonMode, genAI, supabase, userId, normalized + '_retry');
                    // Re-validate the new content
                    validation = validateGeneratedContent(text, normalized, blueprint);
                } catch (err) {
                    console.error(`Retry ${attempts} failed with error:`, err);
                    break; // Stop retrying if generation errors out
                }
            }

            if (!validation.isValid) {
                console.warn(`Validation gave up for ${normalized} after ${attempts} retries. Reason: ${validation.reason}`);
            } else if (attempts > 0) {
                console.log(`Validation succeeded for ${normalized} after ${attempts} retries.`);
            }
        }
        
        // Post-processing for chat_onboarding (validation logic)
        if (action === 'chat_onboarding') {
            try {
              const obj = JSON.parse(text || '{}');
              const bp = obj?.blueprint;
              const msg = (obj?.message || '').trim();
              
              // Validate Blueprint
              const bpOk = bp && 
                           Array.isArray(bp.modules) && 
                           bp.modules.length >= 1 && // Relaxed from 2 to 1
                           typeof bp.target_audience === 'string';

              // If we have a valid blueprint, return it regardless of the message content.
              if (bpOk) {
                 return new Response(JSON.stringify({ content: JSON.stringify(obj) }), { 
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
                    status: 200 
                 });
              }

              // If NO valid blueprint, ensure the message is treated as a follow-up question.
              const question = /\?/.test(msg); // Check if there is ANY question mark
              
              if (!bpOk) {
                // If the AI didn't provide a blueprint, it MUST be asking a question.
                // If for some reason it didn't ask a question but didn't give a blueprint, force a default follow-up.
                const followMsg = (msg && msg.length > 5) ? msg : 'Pentru a crea un curs de calitate, am nevoie de detalii suplimentare despre obiectivele de învățare și audiență.';
                
                const follow = { 
                    message: followMsg, 
                    blueprint: null 
                };
                return new Response(JSON.stringify({ content: JSON.stringify(follow) }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 });
              }
            } catch { /* ignore parse errors; return original */ }
        }

        return new Response(JSON.stringify({ content: text }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200
        });

    } catch (e) {
        // Error handling
        const msg = e instanceof Error ? e.message : String(e);
        // Force 200 OK for "Soft Error" handling so client receives the JSON body
        // const isRateLimit = msg.includes("429") || msg.toLowerCase().includes("quota");
        return new Response(JSON.stringify({ error: msg }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200 // Changed from 500/429 to 200 to ensure client parsing
        });
    }

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    const stack = error instanceof Error ? error.stack : '';
    console.error("CRITICAL ERROR in Edge Function:", message, stack, error);
    
    // Force 200 OK for "Soft Error" handling so client receives the JSON body
    return new Response(JSON.stringify({ 
      error: message,
      stack: stack, 
      details: String(error)
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200 // Changed from 500/429 to 200 to ensure client parsing
    });
  }
});

