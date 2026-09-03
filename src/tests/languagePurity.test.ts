import { describe, expect, it } from 'vitest';
import {
  enHeaderMarkers,
  etalonInputEN,
  etalonInputRO,
  roDiacritics,
  roHeaderMarkers,
} from './fixtures/etalonCourse';

const roGeneratedOutput = `
# Obiectiv
La final, participantul mapează stakeholderii și alege canalul potrivit.

## Instrucțiuni
Lucrează în perechi și justifică alegerea.

### Spațiu de lucru
Notează ipotezele și întrebările deschise.

### Etapă: Aplicarea
Construiește matricea influență/interes.

## Durată
20 de minute.

### Povestea
Un sponsor de proiect schimbă prioritățile.

### Debrief
Ce ai observat și ce ai schimba?
`;

const enGeneratedOutput = `
# Objective
By the end, participants map stakeholders and choose the right channel.

## Instructions
Work in pairs and justify the choice.

### Workspace
Record assumptions and open questions.

### Stage: Application
Build the influence/interest matrix.

## Duration
20 minutes.

### Story
A project sponsor changes priorities.

### Facilitator
Ask what evidence supports the decision.
`;

function headingPattern(markers: readonly string[]): RegExp {
  return new RegExp(
    `^\\s{0,3}(?:#{1,6}\\s*)?(?:${markers.join('|')})\\s*:?(?:\\s*)$`,
    'gim',
  );
}

function findContaminatedHeadings(output: string, markers: readonly string[]): string[] {
  return output.match(headingPattern(markers)) ?? [];
}

describe('F2-T5 language purity', () => {
  it('keeps Romanian headers and diacritics out of English output', () => {
    expect(etalonInputEN.language).toBe('en');
    expect(findContaminatedHeadings(enGeneratedOutput, roHeaderMarkers)).toEqual([]);
    expect(enGeneratedOutput).not.toMatch(roDiacritics);
  });

  it('keeps English headers out of Romanian output', () => {
    expect(etalonInputRO.language).toBe('ro');
    expect(findContaminatedHeadings(roGeneratedOutput, enHeaderMarkers)).toEqual([]);
  });
});
