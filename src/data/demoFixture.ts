// Curs demonstrativ pregenerat pentru ruta anonimă /demo/:sessionId.
// Static — fără apel AI la momentul demo-ului, fără cost API per vizitator.
// Textele de interfață stau în public/locales/*.json sub 'demo.*';
// fixture-ul poartă doar date structurale + extrase reprezentative.

export interface DemoLesson {
  id: string;
  title: string;
  duration_minutes: number;
  learning_objective: string;
  key_takeaways: string[];
  excerpt: string;
}

export interface DemoModule {
  id: string;
  index: string;      // "01", "02", ...
  title: string;
  learning_objective: string;
  duration: string;
  lessons: DemoLesson[];
}

export interface DemoDeliverable {
  slug: 'trainer_guide' | 'participant_manual' | 'slide_deck' | 'exercises' | 'trainer_flow';
  title: string;
  description: string;
  excerpt: string;
}

export interface DemoCourse {
  title: string;
  subject: string;
  audience: string;
  level: string;
  duration: string;
  tone: string;
  environment: string;
  learning_outcome: string;
  modules: DemoModule[];
  deliverables: DemoDeliverable[];
}

export const DEMO_COURSE: DemoCourse = {
  title: 'Conversații dificile pentru manageri de mijloc',
  subject: 'Leadership interpersonal',
  audience: 'Manageri la prima funcție, 6–24 luni în rol',
  level: 'Intermediar',
  duration: 'Jumătate de zi (4h)',
  tone: 'Direct, cald, fără jargon',
  environment: 'Atelier față-în-față, până la 16 participanți',
  learning_outcome:
    'La finalul sesiunii, participanții pot planifica și deschide o conversație dificilă cu un subordonat direct folosind un cadru în patru pași, și pot recupera din trei deraiaje frecvente.',
  modules: [
    {
      id: 'm1',
      index: '01',
      title: 'De ce evităm conversația pe care o datorăm',
      learning_objective:
        'Enumeră cele trei costuri ale evitării și descrie o conversație pe care participantul o amână în prezent.',
      duration: '45m',
      lessons: [
        {
          id: 'm1l1',
          title: 'Cele trei costuri ale amânării',
          duration_minutes: 15,
          learning_objective: 'Enumeră costurile personale, de echipă și organizaționale ale unei conversații amânate.',
          key_takeaways: [
            'Costul amânării se acumulează — nu rămâne același.',
            'Oamenii citesc tăcerea ca aprobare.',
            'Persoana pe care o eviți știe, de obicei.',
          ],
          excerpt:
            'Majoritatea conversațiilor pe care le eviți nu sunt neclare — sunt clare și incomode. Nu e vorba de abilitate de comunicare, ci de voința de a investi trei minute de adrenalină ca să salvezi trei luni de derivă.',
        },
        {
          id: 'm1l2',
          title: 'Exercițiu mic: o singură conversație',
          duration_minutes: 15,
          learning_objective: 'Identifică o conversație specifică pe care participantul o amână, cu persoana și subiectul notate pe hârtie.',
          key_takeaways: [
            'Scrie numele persoanei. Nu rolul.',
            'Scrie subiectul într-o propoziție, cu verbul la început.',
            'Scrie ce ți-e teamă că se va întâmpla dacă o deschizi.',
          ],
          excerpt:
            'Ia cartonașul. Nu-l arăta nimănui din cameră. Pliază-l, pune-l în buzunar. La sfârșitul zilei îl vom desface.',
        },
        {
          id: 'm1l3',
          title: 'Reflecție colectivă',
          duration_minutes: 15,
          learning_objective: 'Recadrează teama identificată în exercițiu ca informație despre conversația de purtat.',
          key_takeaways: [
            'Teama e un indicator, nu un semn de stop.',
            'Povestea pe care ți-o spui nu e povestea.',
            'Precizia reduce adrenalina mai mult decât repetițiile.',
          ],
          excerpt:
            'Observă că aproape fiecare teamă de pe cartonașul tău e o poveste despre cum va reacționa CELĂLALT. Ăsta e primul tău instrument — pentru că povestea poate fi ghicită, și dacă poate fi ghicită, poate fi testată.',
        },
      ],
    },
    {
      id: 'm2',
      index: '02',
      title: 'Cadrul în patru pași',
      learning_objective:
        'Formulează deschiderea unei conversații dificile folosind cadrul Fapt → Impact → Întrebare → Tăcere.',
      duration: '75m',
      lessons: [
        {
          id: 'm2l1',
          title: 'Faptul — propoziția pe care nu o pot contrazice',
          duration_minutes: 20,
          learning_objective: 'Formulează o propoziție de deschidere care numește un comportament observabil, nu un caracter.',
          key_takeaways: [
            '„Ieri la 15:00 ai dat reply-all la mail" — fapt.',
            '„Ești neglijent" — caracter.',
            'Faptul îl poți arăta. Caracterul trebuie să-l aperi.',
          ],
          excerpt:
            'Orice conversație care deraiază, deraiază în prima propoziție. Prima propoziție nu e opinia ta — e un fapt pe care l-ați văzut amândoi. Dacă îl poate contesta, ai propoziția greșită.',
        },
        {
          id: 'm2l2',
          title: 'Impactul — jumătatea lipsă',
          duration_minutes: 20,
          learning_objective: 'Atașează un impact specific faptului, folosind tiparul „ce înseamnă asta pentru noi".',
          key_takeaways: [
            'Impactul e ce costă faptul — bani, încredere, timp, moral.',
            'Impactul ancorează conversația într-o consecință comună.',
            'Fără impact, faptul sună a moftologie.',
          ],
          excerpt:
            'Faptul și impactul împreună transformă „ai dat reply-all" în „ai dat reply-all, și clientul m-a întrebat dacă avem un proces pentru asta".',
        },
        {
          id: 'm2l3',
          title: 'Întrebarea — dai-le stiloul',
          duration_minutes: 20,
          learning_objective: 'Încheie deschiderea cu o întrebare care returnează inițiativa celeilalte persoane.',
          key_takeaways: [
            'Întreabă, nu spune.',
            'Întrebarea e o invitație, nu o capcană.',
            'Cea mai bună întrebare: „Ce vezi tu?".',
          ],
          excerpt:
            'Ai numit un fapt și impactul lui. Nu ai spus încă ce ar trebui să se întâmple. Ești pe cale. Nu. Întreabă. Urmează tăcerea.',
        },
        {
          id: 'm2l4',
          title: 'Tăcerea — pasul cel mai greu',
          duration_minutes: 15,
          learning_objective: 'Menține tăcerea cel puțin șapte secunde după ce pui întrebarea.',
          key_takeaways: [
            'Șapte secunde par patruzeci.',
            'Cine rupe tăcerea primul cedează cadrul.',
            'Tăcerea e locul în care trăiește răspunsul real.',
          ],
          excerpt:
            'Acesta e pasul la care vei da greș. Vei umple tăcerea cu o sugestie, un atenuator, o glumă. Nu. Numără. Dacă simți nevoia, bea o gură de apă.',
        },
      ],
    },
    {
      id: 'm3',
      index: '03',
      title: 'Recuperarea din cele trei deraiaje frecvente',
      learning_objective:
        'Identifică lacrimile, furia și evaziunea ca deraiaje previzibile și răspunde fiecăruia cu o replică exersată.',
      duration: '60m',
      lessons: [
        {
          id: 'm3l1',
          title: 'Când plâng',
          duration_minutes: 20,
          learning_objective: 'Răspunde la lacrimi fără să prăbușești conversația sau să ignori emoția.',
          key_takeaways: [
            'Lacrimile nu sunt semnal de stop.',
            'Oferă apă, menține tăcerea, nu cere scuze pentru fapt.',
            'Reia doar când dau semnal că sunt gata.',
          ],
          excerpt:
            'Replică de exersat: „Ia-ți timpul de care ai nevoie. Conversația e importantă; putem face o pauză, dar nu o putem ocoli".',
        },
        {
          id: 'm3l2',
          title: 'Când se enervează',
          duration_minutes: 20,
          learning_objective: 'Absoarbe furia fără s-o egalizezi sau să te retragi din fața faptului.',
          key_takeaways: [
            'Egalezi volumul și pierzi cadrul.',
            'Numește emoția, menține faptul.',
            'O respirație înainte de fiecare replică.',
          ],
          excerpt:
            'Replică de exersat: „Văd că asta lovește tare. Nu îți pun la îndoială intenția — îți spun ce s-a întâmplat și ce a costat".',
        },
        {
          id: 'm3l3',
          title: 'Când evitează',
          duration_minutes: 20,
          learning_objective: 'Recunoaște cele patru tipare frecvente de evaziune și readuce conversația la subiect.',
          key_takeaways: [
            'Evaziunea e evitare politicoasă.',
            'Readuce, nu confrunta evaziunea.',
            'Replică: „Vom reveni la asta. Dar mai întâi —".',
          ],
          excerpt:
            'Evaziunile sună ca: „da, dar și...", „problema reală e...", „ca să fim corecți, toți...", sau clasicul „te aud". Tu: „Vom reveni la asta. Dar mai întâi — ce vezi tu?".',
        },
      ],
    },
  ],
  deliverables: [
    {
      slug: 'trainer_guide',
      title: 'Ghidul trainerului',
      description: 'Scripturi cuvânt cu cuvânt pentru fiecare modul, marcaje de timp, tranziții între secțiuni.',
      excerpt:
        '→ 10:00 (5m) — Deschide modulul 2. Pe tablă, doar titlurile celor patru pași. Nu le completa încă.\n→ 10:05 (15m) — Lecția 1: propoziția pe care nu o pot contrazice. Citește cele două exemple de deschidere de la p.7. Cere ridicarea mâinii:\n   „Care numește persoana și care numește comportamentul?"',
    },
    {
      slug: 'participant_manual',
      title: 'Manualul participantului',
      description: 'Teorie, exemple lucrate, întrebări de reflecție, spațiu de lucru pentru toată ziua.',
      excerpt:
        'MODULUL 2 — Formulează propoziția de deschidere.\n\nGândește-te la conversația notată pe cartonaș în modulul 1.\n\nFapt:      ________________________________________\nImpact:    ________________________________________\nÎntrebare: ________________________________________\n\nApoi ține cele șapte secunde de tăcere.',
    },
    {
      slug: 'slide_deck',
      title: 'Prezentarea',
      description: 'Un singur fișier editabil. Pe layere. Note pentru vorbitor pe fiecare slide.',
      excerpt:
        'SLIDE 12 · SPLIT-LEFT · Titlu „Fapt vs caracter"\n\nStânga          Dreapta\n------------    -----------\nIeri la 15:00   Ești\nai dat          neglijent.\nreply-all.\n\nNote: dă sălii douăzeci de secunde. Întreabă ce propoziție ar prefera să primească.',
    },
    {
      slug: 'exercises',
      title: 'Fișe de exerciții',
      description: 'Bazate pe scenarii. Auto-conținute. Întrebări de reflecție pe verso.',
      excerpt:
        'EXERCIȚIU 3 · Cincisprezece minute · Perechi.\n\nScenariu: Un coleg a rescris notițele ședinței de trei ori pentru a-și elimina propriile sarcini. Formulează deschiderea în patru pași pe care ai folosi-o într-o discuție privată unu-la-unu.\n\nReflecție pe verso.',
    },
    {
      slug: 'trainer_flow',
      title: 'Fluxul trainerului',
      description: 'Coregrafia zilei — unde stai, când te așezi, când iei pauză.',
      excerpt:
        '13:15 · Întoarcere din pauza de prânz. Stai în spatele flipchart-ului, nu la ușă.\n13:20 · Reia cadrul în patru pași din memorie. NU deschide prezentarea.\n13:25 · Cold call: un participant demonstrează deschiderea. Tu iei locul subordonatului direct.\n13:35 · Pauză — muzică de fundal, nu urmări conversațiile.',
    },
  ],
};
