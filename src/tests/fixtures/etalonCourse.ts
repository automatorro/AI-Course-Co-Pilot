import { GenerationEnvironment } from '../../types';

/**
 * Cursul-etalon din docs/CURATENIE-SI-MODERNIZARE-CourseCopilot.md §3.
 *
 * Reproduce exact contextul materialului defect din audit (Alex×3, limbi
 * amestecate). Clona EN verifică puritatea lingvistică inversă. Toate fazele
 * F0–F10 folosesc acest fixture pentru validări și pentru punctarea pe rubrică.
 *
 * NU modifica valorile fără actualizare paralelă în plan §3 și în docs/baseline/README.md.
 */

export interface EtalonInput {
  title: string;
  description: string;
  subject: string;
  target_audience: string;
  environment: GenerationEnvironment;
  language: 'ro' | 'en';
  durationMinutes: number;
  learning_objectives: string;
  toneFreeText: string;
  terminology: {
    participant: string;
    trainer: string;
    exercise: string;
    mandatoryTerms: string[];
    forbiddenPhrases: string[];
  };
}

const SHARED = {
  environment: GenerationEnvironment.OnlineCourse,
  durationMinutes: 240,
};

export const etalonInputRO: EtalonInput = {
  ...SHARED,
  language: 'ro',
  title: 'Managementul Stakeholderilor pentru Manageri de Proiect Juniori',
  description:
    'Un curs online de 4 ore care îi ajută pe managerii de proiect aflați la început să identifice, prioritizeze și comunice cu stakeholderii tehnici și de business din companiile de servicii IT.',
  subject: 'Managementul stakeholderilor în proiecte IT',
  target_audience:
    'Manageri de proiect la început de drum (0-2 ani experiență), care lucrează în companii de servicii IT (outsourcing, consultanță, produs custom).',
  learning_objectives:
    'La final, participantul (a) mapează stakeholderii unui proiect pe axa influență/interes cu justificare, (b) alege canalul și frecvența de comunicare potrivite pentru fiecare cadran, (c) recunoaște și dezamorsează trei conflicte tipice între stakeholderi tehnici și de business.',
  toneFreeText:
    'direct, cald, fără corporatisme; folosim «tu»; umor discret; interzis: «sinergie», «paradigmă»',
  terminology: {
    participant: 'participant',
    trainer: 'trainer',
    exercise: 'exercițiu',
    mandatoryTerms: ['stakeholder', 'sponsor de proiect', 'matrice influență/interes'],
    forbiddenPhrases: ['sinergie', 'paradigmă'],
  },
};

export const etalonInputEN: EtalonInput = {
  ...SHARED,
  language: 'en',
  title: 'Stakeholder Management for Junior Project Managers',
  description:
    'A 4-hour online course that helps early-career project managers identify, prioritize, and communicate with technical and business stakeholders in IT services companies.',
  subject: 'Stakeholder management in IT projects',
  target_audience:
    'Early-career project managers (0-2 years of experience) working in IT services companies (outsourcing, consulting, custom product delivery).',
  learning_objectives:
    'By the end, the participant will (a) map a project\'s stakeholders on the influence/interest axis with justification, (b) choose the right communication channel and cadence for each quadrant, (c) recognize and defuse three typical conflicts between technical and business stakeholders.',
  toneFreeText:
    'direct, warm, no corporate-speak; use "you"; light humor; forbidden: "synergy", "paradigm"',
  terminology: {
    participant: 'participant',
    trainer: 'trainer',
    exercise: 'exercise',
    mandatoryTerms: ['stakeholder', 'project sponsor', 'influence/interest matrix'],
    forbiddenPhrases: ['synergy', 'paradigm'],
  },
};

/**
 * Marker phrases used by the language-purity test (F2-T5).
 *
 * If any of these appears in an EN generation, RO leaked in (and vice-versa).
 * The lists are intentionally minimal and orthogonal — they are HEADERS, not
 * technical loanwords, so their presence signals contamination unambiguously.
 */
export const roHeaderMarkers = [
  'Obiectiv',
  'Instrucțiuni',
  'Spațiu',
  'Etapă',
  'Durată',
  'Aplicarea',
  'Povestea',
  'Debrief',
] as const;

export const enHeaderMarkers = [
  'Objective',
  'Instructions',
  'Workspace',
  'Stage',
  'Duration',
  'Application',
  'Story',
  'Facilitator',
] as const;

/** Diacritice românești — 0 apariții pe generarea EN. */
export const roDiacritics = /[ăâîșțĂÂÎȘȚ]/;
