import { describe, it, expect } from 'vitest';
import {
  roHeaderMarkers,
  enHeaderMarkers,
  roDiacritics,
} from './fixtures/etalonCourse';

// Realistic EN sample — represents a generated workbook/manual section
const SAMPLE_EN = `
# Stakeholder Management for Junior Project Managers

## Module 1: Mapping Your Stakeholders

### Learning Objective
By the end of this module, you will be able to map a project's stakeholders on
the influence/interest matrix with clear justification for each placement.

### Instructions
Complete the worksheet below before watching the next video segment.

#### Workspace
Use this space to draw your stakeholder map. Place each stakeholder in one of
the four quadrants based on their influence (vertical axis) and interest
(horizontal axis).

### Stage 1 — Identify
List every person or group affected by or with power over your project.
Aim for at least 8 entries before moving on.

**Duration**: 15 minutes

### Stage 2 — Prioritize
Move stakeholders to their quadrant. High influence + high interest = manage
closely. High influence + low interest = keep satisfied.

### Application
Apply this framework to your current project. Bring the completed map to the
next live session for group review.

### Facilitator Notes
Walk participants through one completed example before they start working
independently. Use the project sponsor as the reference stakeholder.
`;

// Realistic RO sample — represents a generated workbook/manual section
const SAMPLE_RO = `
# Managementul Stakeholderilor pentru Manageri de Proiect Juniori

## Modulul 1: Cartografierea Stakeholderilor

### Obiectiv
La finalul acestui modul, vei putea să mapezi stakeholderii unui proiect pe
matricea influență/interes cu justificări clare pentru fiecare poziție.

### Instrucțiuni
Completează fișa de lucru de mai jos înainte de a urmări segmentul video următor.

#### Spațiu de lucru
Folosește acest spațiu pentru a desena harta stakeholderilor tăi. Plasează
fiecare stakeholder în unul dintre cele patru cadrane pe baza influenței
(axa verticală) și a interesului (axa orizontală).

### Etapă 1 — Identificare
Listează fiecare persoană sau grup afectat sau cu putere asupra proiectului tău.
Urmărește cel puțin 8 intrări înainte de a continua.

**Durată**: 15 minute

### Etapă 2 — Prioritizare
Mută stakeholderii în cadranul corespunzător. Influență mare + interes mare =
gestionează îndeaproape. Influență mare + interes mic = menține satisfăcut.

### Aplicarea în practică
Aplică acest cadru la proiectul tău curent. Adu harta completată la următoarea
sesiune live pentru revizuire în grup.

### Povestea trainer-ului
Prezintă un exemplu completat înainte ca participanții să înceapă să lucreze
independent. Folosește sponsor de proiect ca stakeholder de referință.

### Debrief
Ce ți-a fost dificil? Ce surprize ai avut față de poziționarea stakeholderilor?
`;

describe('Language purity — EN generation', () => {
  it('contains no Romanian diacritics', () => {
    const matches = SAMPLE_EN.match(new RegExp(roDiacritics.source, 'g'));
    expect(matches).toBeNull();
  });

  it('contains no Romanian header markers', () => {
    const found = roHeaderMarkers.filter(marker =>
      SAMPLE_EN.includes(marker)
    );
    expect(found).toEqual([]);
  });

  it('contains expected EN header markers', () => {
    const found = enHeaderMarkers.filter(marker =>
      SAMPLE_EN.includes(marker)
    );
    expect(found.length).toBeGreaterThan(0);
  });
});

describe('Language purity — RO generation', () => {
  it('contains no English-only header markers', () => {
    // Markers like "Workspace", "Stage", "Duration", "Application",
    // "Facilitator" are unambiguously English — no false positives in RO.
    // "Objective"/"Instructions"/"Story" are excluded here because they
    // are loanwords used in Romanian too.
    const unambiguousEN = ['Workspace', 'Duration', 'Application', 'Facilitator'] as const;
    const found = unambiguousEN.filter(marker => SAMPLE_RO.includes(marker));
    expect(found).toEqual([]);
  });

  it('contains Romanian diacritics', () => {
    expect(roDiacritics.test(SAMPLE_RO)).toBe(true);
  });

  it('contains expected RO header markers', () => {
    const found = roHeaderMarkers.filter(marker =>
      SAMPLE_RO.includes(marker)
    );
    expect(found.length).toBeGreaterThan(0);
  });
});

describe('Language purity — cross-contamination detection', () => {
  it('RO markers are absent from EN sample', () => {
    // This is the core invariant: no Romanian headers leak into EN output.
    const leaked = roHeaderMarkers.filter(marker => SAMPLE_EN.includes(marker));
    expect(leaked, `Romanian markers found in EN: ${leaked.join(', ')}`).toEqual([]);
  });

  it('EN diacritics rule: zero Romanian diacritics in EN sample', () => {
    // Romanian diacritics (ă â î ș ț) should never appear in an EN generation.
    expect(roDiacritics.test(SAMPLE_EN)).toBe(false);
  });
});
