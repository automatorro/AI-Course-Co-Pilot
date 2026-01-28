import { describe, it, expect, vi } from 'vitest';

// Mock Deno global
(globalThis as any).Deno = {
  env: {
    get: (key: string) => 'test-key'
  }
};

// Mock Deno-specific and npm: imports to allow Vite to load the module
vi.mock('npm:@google/generative-ai', () => ({ GoogleGenerativeAI: class {} }));
vi.mock('https://deno.land/std@0.168.0/http/server.ts', () => ({ serve: () => {} }));
vi.mock('https://esm.sh/@supabase/supabase-js@2.7.1', () => ({ createClient: () => ({}) }));

function makeSupabaseMock() {
  const logs: any[] = [];
  return {
    from: (table: string) => ({
      insert: (row: any) => {
        if (table === 'generation_logs') logs.push({ table, ...row });
        return { error: null };
      },
      select: () => ({ single: () => ({ data: null, error: null }) })
    }),
    auth: { getUser: async () => ({ data: { user: { id: 'test-user' } } }) },
    _logs: logs
  };
}

const course = {
  id: 'course-1',
  title: 'Leadership în Producție',
  language: 'Romanian',
  environment: 'LiveWorkshop',
  target_audience: 'Șefi de echipă',
  dna: {
    voiceProfile: { formality: 'Professional', humorLevel: 'Light', signaturePhrases: [], forbiddenPhrases: [] },
    terminology: { participant: 'Participant', trainer: 'Trainer', exercise: 'Exercițiu', mandatoryTerms: {} },
    narrativeUniverse: { protagonists: [{ name: 'Ana Maria', role: 'Șef de echipă', arc: 'Creștere' }] }
  },
  blueprint: {
    estimated_duration: '4 hours',
    modules: [
      { title: 'Modul 1: Introducere în delegare', learning_objective: 'De ce delegarea?' },
      { title: 'Modul 2: Modelul XYZ', learning_objective: 'Pași practici' }
    ]
  }
} as any;

const fileContext = '';
const userId = 'test-user';

describe('E2E generation (slides + exercises) with validation & logging', () => {
  it('runs iterative generation, triggers validation and logs events', async () => {
    const supabase = makeSupabaseMock();

    // Override generation via test hook
    const seq = [
      // 1. Fail PS-2 (Romanian content but with untranslated terms)
      'Acesta este un slide despre delegare. Totuși, avem Red Flags, Checklist și Troubleshooting care nu sunt traduse. Bloom’s Taxonomy este de asemenea prezentă.',
      // 2. Success (Correct Romanian + Protagonist)
      'Modulul 1: Introducere în delegare. Slide content cu Ana Maria. Semnale de alarmă și Diagnosticare. Taxonomia lui Bloom.',
      // 3. Fail Protagonist (Romanian content but missing Ana Maria)
      'Acesta este un exercițiu foarte bun despre delegare. Semnale de alarmă și Diagnosticare sunt incluse. Modulul 2: Modelul XYZ.',
      // 4. Success (Correct Romanian + Protagonist)
      'Exercițiu pentru Ana Maria. Semnale de alarmă și Diagnosticare. Modulul 2: Modelul XYZ.'
    ];
    let idx = 0;
    (globalThis as any).__TEST_GENERATE_CONTENT__ = async () => {
      const out = seq[Math.min(idx, seq.length - 1)];
      idx++;
      return out;
    };

    // Slides
    const modPath = '../../supabase/functions/generate-course-content/' + 'index_bundled';
    const bundled: any = await import(modPath as any);
    const slides = await bundled.generateSlidesIteratively(
      course, course.blueprint, fileContext, null, supabase, userId, ''
    );
    expect(slides).toContain('Ana Maria');

    // Exercises
    const exercises = await bundled.generateExercisesIteratively(
      course, course.blueprint, fileContext, null, supabase, userId, ''
    );
    expect(exercises).toContain('Ana Maria');

    // Logs: we expect start, validate_fail, success at minimum
    const logs = (supabase as any)._logs;
    const slideStart = logs.find((l: any) => l.step_type === 'slides' && l.status === 'start');
    const slideFail = logs.find((l: any) => l.step_type === 'slides' && l.status === 'validate_fail');
    const slideSuccess = logs.find((l: any) => l.step_type === 'slides' && l.status === 'success');
    
    expect(slideStart).toBeTruthy();
    expect(slideFail).toBeTruthy();
    // Verify PS-2 validation failure reason
    if (slideFail) {
      const msg = (slideFail.message || '').toLowerCase();
      const isLanguageOrTermError = msg.includes('ps-2') || msg.includes('untranslated') || msg.includes('protagonist');
      expect(isLanguageOrTermError).toBe(true);
    }
    expect(slideSuccess).toBeTruthy();

    const exStart = logs.find((l: any) => l.step_type === 'course_steps_exercises' && l.status === 'start');
    const exFail = logs.find((l: any) => l.step_type === 'course_steps_exercises' && l.status === 'validate_fail');
    const exSuccess = logs.find((l: any) => l.step_type === 'course_steps_exercises' && l.status === 'success');
    const exError = logs.find((l: any) => l.step_type === 'course_steps_exercises' && l.status === 'error');

    expect(exStart).toBeTruthy();
    expect(exFail).toBeTruthy();
    expect(exSuccess || exError).toBeTruthy();
  });
}
);
