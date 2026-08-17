/// <reference types="vite/client" />
import { describe, it, expect } from 'vitest';
import {
  findLanguageLeaks,
  formatLeaks,
  RO_HEADER_MARKERS,
  EN_HEADER_MARKERS,
  AMBIGUOUS_MARKERS,
} from '../lib/languagePurity';
import {
  etalonInputRO,
  etalonInputEN,
  roHeaderMarkers,
  enHeaderMarkers,
  type EtalonInput,
} from './fixtures/etalonCourse';

/**
 * F2-T5 — testul de puritate lingvistică.
 *
 * Acoperă trei straturi, în ordinea încrederii:
 *  1. detectorul în sine (fără el, restul aserțiunilor nu înseamnă nimic);
 *  2. cursul-etalon din fixture (F0-T4) — EN fără română, RO fără engleză;
 *  3. REGRESIA reală: cele 6 șabloane de prompt sterilizate în F2-T2/F2-T4.
 *     Ele sunt calea vie de generare (D-011), deci un header românesc
 *     reintrodus acolo contaminează materialele tuturor utilizatorilor.
 *
 * Ce NU acoperă: o generare reală prin LLM. Aceea are nevoie de chei API și de
 * Supabase, deci intră la F4-T7/F6 — `findLanguageLeaks` e exportat tocmai ca
 * validarea determinist post-generare din F4-T4 să-l refolosească pe output real.
 */

/** Sursa edge function-ului, citită ca TEXT. */
// Import direct nu merge: fișierul e Deno (`Deno.serve`, importuri prin URL), iar
// vitest ar încerca să-l execute — exact eșecul din D-003. `?raw` îl aduce ca string.
import edgeFunctionSource from '../../supabase/functions/generate-course-content/index.ts?raw';

const STERILIZED_PROMPTS = [
  'MODULE_CONTEXT_PROMPT',
  'WORKBOOK_PROMPT',
  'MANUAL_PROMPT',
  'SLIDES_PROMPT',
  'EXERCISES_PROMPT',
  'VIDEO_SCRIPT_PROMPT',
] as const;

/**
 * Extrage corpul unei constante template-literal din sursa edge function-ului.
 * Aruncă dacă nu o găsește — o constantă redenumită trebuie să pice testul,
 * nu să-l facă să treacă în gol.
 */
function extractTemplateConstant(source: string, name: string): string {
  const lines = source.split('\n');
  const start = lines.findIndex((line) => line.startsWith(`const ${name} = \``));
  if (start === -1) {
    throw new Error(
      `Constanta ${name} nu mai există în index.ts (redenumită sau ștearsă?). ` +
        'Actualizează STERILIZED_PROMPTS din acest test.',
    );
  }
  const end = lines.findIndex((line, index) => index > start && /^\s*`;\s*$/.test(line));
  if (end === -1) {
    throw new Error(`Constanta ${name} pare nedelimitată — nu am găsit închiderea template-literal-ului.`);
  }
  return lines.slice(start, end + 1).join('\n');
}

/** Toate câmpurile text ale unui input de etalon, ca un singur bloc. */
function etalonText(input: EtalonInput): string {
  const { terminology } = input;
  return [
    input.title,
    input.description,
    input.subject,
    input.target_audience,
    input.learning_objectives,
    input.toneFreeText,
    terminology.participant,
    terminology.trainer,
    terminology.exercise,
    ...terminology.mandatoryTerms,
    ...terminology.forbiddenPhrases,
  ].join('\n');
}

describe('detectorul de puritate lingvistică', () => {
  it('semnalează headere românești într-un material englezesc', () => {
    const contaminated = ['# Module 1: Stakeholders', '', 'Instructiuni: read the brief.'].join('\n');
    const leaks = findLanguageLeaks(contaminated.replace('Instructiuni', 'Instrucțiuni'), 'en');

    expect(leaks.some((leak) => leak.marker === 'Instrucțiuni')).toBe(true);
    expect(leaks.some((leak) => leak.kind === 'foreign-header')).toBe(true);
  });

  it('semnalează diacritice românești în EN chiar fără vreun marker din listă', () => {
    const leaks = findLanguageLeaks('The trainer opens with a scurtă prezentare.', 'en');

    expect(leaks).toHaveLength(1);
    expect(leaks[0].kind).toBe('romanian-diacritic');
    expect(leaks[0].line).toBe(1);
  });

  it('semnalează headere englezești într-un material românesc', () => {
    const contaminated = ['# Modulul 1: Stakeholderi', '', 'Objective: harta de influență.'].join('\n');
    const leaks = findLanguageLeaks(contaminated, 'ro');

    expect(leaks.map((leak) => leak.marker)).toContain('Objective');
    expect(leaks[0].line).toBe(3);
  });

  it('nu semnalează diacriticele într-un material românesc', () => {
    const clean = 'Durată: 25 de minute. Participanții lucrează în perechi.';

    expect(findLanguageLeaks(clean, 'ro')).toEqual([]);
  });

  it('acceptă un material englezesc curat', () => {
    const clean = ['# Module 2: Mapping', '', 'Duration: 25 minutes.', 'Objective: map the grid.'].join('\n');

    expect(findLanguageLeaks(clean, 'en')).toEqual([]);
  });

  it('nu confundă un marker cu un cuvânt care doar îl conține', () => {
    // "Applications" ≠ "Application", "Stagecoach" ≠ "Stage".
    const clean = 'Aplicațiile practice: Applications and Stagecoach metaphors.';

    expect(findLanguageLeaks(clean, 'ro')).toEqual([]);
  });

  it('raportează linia și un extras utilizabil', () => {
    const text = ['line one', 'line two', 'Durată: 10 min'].join('\n');
    const [leak] = findLanguageLeaks(text, 'en');

    expect(leak.line).toBe(3);
    expect(leak.excerpt).toContain('Durată');
    expect(formatLeaks([leak])).toContain('L3');
  });
});

describe('cursul-etalon (fixture F0-T4)', () => {
  it('etalonul EN nu conține headere românești și nici diacritice', () => {
    const leaks = findLanguageLeaks(etalonText(etalonInputEN), 'en');

    expect(leaks, `scurgeri în etalonul EN:\n${formatLeaks(leaks)}`).toEqual([]);
  });

  it('etalonul RO nu conține headere englezești', () => {
    const leaks = findLanguageLeaks(etalonText(etalonInputRO), 'ro');

    expect(leaks, `scurgeri în etalonul RO:\n${formatLeaks(leaks)}`).toEqual([]);
  });
});

describe('prompturile sterilizate în F2-T2/F2-T4 (regresie)', () => {
  it.each(STERILIZED_PROMPTS)(
    '%s rămâne fără headere sau diacritice românești',
    (promptName) => {
      const prompt = extractTemplateConstant(edgeFunctionSource, promptName);
      const leaks = findLanguageLeaks(prompt, 'en');

      expect(leaks, `${promptName} a recăpătat text românesc:\n${formatLeaks(leaks)}`).toEqual([]);
    },
  );

  it('MANUAL_PROMPT nu reintroduce headerul "# Modul:" hardcodat (F2-T4)', () => {
    const prompt = extractTemplateConstant(edgeFunctionSource, 'MANUAL_PROMPT');

    expect(prompt).not.toContain('# Modul:');
  });

  it('MANUAL_PROMPT nu numește româna în meta-instrucțiuni (regula A.1, F2-T4)', () => {
    const prompt = extractTemplateConstant(edgeFunctionSource, 'MANUAL_PROMPT');

    expect(prompt).not.toMatch(/English\/Romanian/);
  });
});

describe('sincronizarea cu fixture-ul', () => {
  it('markerii detectorului = markerii din fixture, minus cei ambigui', () => {
    const excluded = Object.keys(AMBIGUOUS_MARKERS);

    expect([...RO_HEADER_MARKERS].sort()).toEqual(
      roHeaderMarkers.filter((marker) => !excluded.includes(marker)).slice().sort(),
    );
    expect([...EN_HEADER_MARKERS].sort()).toEqual(
      enHeaderMarkers.filter((marker) => !excluded.includes(marker)).slice().sort(),
    );
  });

  it('fiecare marker exclus are un motiv scris (D-015)', () => {
    for (const [marker, reason] of Object.entries(AMBIGUOUS_MARKERS)) {
      expect([...roHeaderMarkers, ...enHeaderMarkers]).toContain(marker);
      expect(reason.length).toBeGreaterThan(40);
    }
  });
});
