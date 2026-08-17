/**
 * Puritate lingvistică pentru materialele generate (F2-T5).
 *
 * Regula fazei F2: un material generat în engleză nu conține headere/etichete
 * românești și nici diacritice românești; un material generat în română nu
 * conține headere/etichete englezești. Verificarea e deterministă — fără AI —
 * ca să poată rula în teste și, mai târziu, în validarea post-generare din F4-T4.
 *
 * Lista de markeri e derivată din `src/tests/fixtures/etalonCourse.ts` (F0-T4),
 * mai puțin markerii ambigui documentați în `AMBIGUOUS_MARKERS` mai jos.
 * `src/tests/languagePurity.test.ts` verifică explicit că cele două rămân
 * sincronizate, ca să nu apară drift între fixture și detector.
 */

export type CourseLanguage = 'ro' | 'en';

/**
 * Headere/etichete românești. Apariția lor într-un material EN = română scursă.
 * Sunt ETICHETE structurale, nu împrumuturi tehnice, deci prezența lor e
 * neambiguă.
 */
export const RO_HEADER_MARKERS = [
  'Obiectiv',
  'Instrucțiuni',
  'Spațiu',
  'Etapă',
  'Durată',
  'Aplicarea',
  'Povestea',
] as const;

/** Headere/etichete englezești. Apariția lor într-un material RO = engleză scursă. */
export const EN_HEADER_MARKERS = [
  'Objective',
  'Instructions',
  'Workspace',
  'Stage',
  'Duration',
  'Application',
] as const;

/**
 * Markeri prezenți în fixture dar EXCLUȘI din detector, cu motivul.
 *
 * Toți trei produc fals-pozitive verificabile pe `docs/golden-references/`
 * (materialul-etalon RO scris de owner) — vezi D-015 în IMPLEMENTATION_STATUS.md.
 * Owner-ul decide dacă se elimină și din fixture; până atunci detectorul îi
 * ignoră, iar testul documentează diferența.
 */
export const AMBIGUOUS_MARKERS: Record<string, string> = {
  Debrief:
    'Cuvânt englezesc uzual în facilitare, folosit ca atare și în română ' +
    '("PASUL 2: Debrief"). Ca marker RO ar semnala fals orice material EN corect.',
  Story:
    'Folosit ca etichetă de structură inclusiv în materialul-etalon RO ' +
    '("(Story) Imaginează-ți că ești un bucătar-șef..."). Ca marker EN ar semnala fals RO-ul.',
  Facilitator:
    'Cuvânt românesc identic cu cel englezesc ("Instrucțiuni pentru Facilitator"). ' +
    'Ca marker EN ar semnala fals orice material RO corect.',
};

/**
 * Diacritice românești. Include și variantele cu sedilă (ş U+015F, ţ U+0163),
 * produse de fonturi/encodări vechi — sunt tot diacritice, deci tot scurgere
 * într-un material EN.
 */
export const RO_DIACRITICS = /[ăâîșțşţĂÂÎȘȚŞŢ]/u;

export interface LanguageLeak {
  /** `foreign-header` = etichetă în limba greșită; `romanian-diacritic` = diacritice într-un material EN. */
  kind: 'foreign-header' | 'romanian-diacritic';
  /** Markerul găsit, sau caracterele cu diacritice. */
  marker: string;
  /** Linia din text, 1-indexată. */
  line: number;
  /** Linia (trunchiată), pentru mesaje de eroare care se pot citi. */
  excerpt: string;
}

const MAX_EXCERPT = 120;

/**
 * Granițe de cuvânt conștiente de Unicode. `\b` din JS e ASCII-only, deci se
 * rupe pe markerii care se termină în diacritice ("Etapă", "Durată") — după 'ă'
 * nu vede graniță și nu ar găsi niciodată markerul.
 */
function markerPattern(marker: string): RegExp {
  const escaped = marker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(?<![\\p{L}\\p{N}])${escaped}(?![\\p{L}\\p{N}])`, 'iu');
}

function excerptOf(line: string): string {
  const trimmed = line.trim();
  return trimmed.length > MAX_EXCERPT ? `${trimmed.slice(0, MAX_EXCERPT)}…` : trimmed;
}

/**
 * Găsește scurgerile de limbă dintr-un material generat.
 *
 * @param text conținutul materialului (markdown sau text simplu)
 * @param language limba în care ar fi trebuit generat
 * @returns lista scurgerilor, în ordinea liniilor; goală = material pur
 */
export function findLanguageLeaks(text: string, language: CourseLanguage): LanguageLeak[] {
  const foreignMarkers: readonly string[] =
    language === 'en' ? RO_HEADER_MARKERS : EN_HEADER_MARKERS;
  const patterns = foreignMarkers.map((marker) => [marker, markerPattern(marker)] as const);

  const leaks: LanguageLeak[] = [];

  text.split('\n').forEach((line, index) => {
    const lineNumber = index + 1;

    for (const [marker, pattern] of patterns) {
      if (pattern.test(line)) {
        leaks.push({
          kind: 'foreign-header',
          marker,
          line: lineNumber,
          excerpt: excerptOf(line),
        });
      }
    }

    // Diacriticele contează doar în sens unic: română scursă într-un material EN.
    if (language === 'en') {
      const found = Array.from(new Set(line.match(new RegExp(RO_DIACRITICS, 'gu')) ?? []));
      if (found.length > 0) {
        leaks.push({
          kind: 'romanian-diacritic',
          marker: found.join(''),
          line: lineNumber,
          excerpt: excerptOf(line),
        });
      }
    }
  });

  return leaks;
}

/** Mesaj citibil pentru eșecurile de test (aserțiunea goală nu spune unde e problema). */
export function formatLeaks(leaks: LanguageLeak[]): string {
  if (leaks.length === 0) return 'fără scurgeri';
  return leaks
    .map((leak) => `  L${leak.line} [${leak.kind}] «${leak.marker}» → ${leak.excerpt}`)
    .join('\n');
}
