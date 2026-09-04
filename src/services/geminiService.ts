// ABOUTME: Client-side wrappers over the generate-course-content edge function.
// ABOUTME: Only the routes the app still uses live here — pingEdgeFunction and refineBlueprint.
import { supabase } from './supabaseClient';
import { Course, CourseBlueprint } from '../types';
import { LocalizedLabels, LocalizedLabelsSchema, getLocalizedLabels } from '../constants/localizedLabels';

export const pingEdgeFunction = async (): Promise<string> => {
  try {
    const { data, error } = await supabase.functions.invoke('generate-course-content', { body: { action: 'ping' } });
    if (error) {
      const status = (error as any)?.status;
      const context = (error as any)?.context;
      console.error('Ping error:', { message: error.message, status, context });
      return `Ping failed (${status || 'unknown'}): ${context?.message || error.message}`;
    }
    return typeof data?.message === 'string' ? data.message : 'pong';
  } catch (e: any) {
    console.error('Ping client-side error:', e);
    return `Ping failed: ${e.message}`;
  }
};

/**
 * Refines the Course Blueprint using Edge Function.
 * Returns the refined blueprint or the original on failure.
 */
export const refineBlueprint = async (course: Course, blueprint: CourseBlueprint): Promise<CourseBlueprint> => {
  try {
    const body = {
      action: 'refine_blueprint',
      course: { ...course, steps: [] },
      blueprint,
      language: course.language
    };
    const { data, error } = await supabase.functions.invoke('generate-course-content', { body });
    if (error) {
      console.warn('[refineBlueprint] Edge Function error:', error);
      return blueprint;
    }
    if (typeof data?.content === 'string') {
      try {
        const refined = JSON.parse(data.content);
        if (refined && Array.isArray(refined.modules)) return refined as CourseBlueprint;
      } catch (e) {
        console.warn('[refineBlueprint] Failed to parse content as JSON:', e);
      }
    } else if (data?.blueprint && Array.isArray(data.blueprint.modules)) {
      return data.blueprint as CourseBlueprint;
    }
    return blueprint;
  } catch (e) {
    console.warn('[refineBlueprint] Client-side error:', e);
    return blueprint;
  }
};

export const generateLocalizedLabels = async (course: Pick<Course, 'language' | 'title' | 'subject'>): Promise<LocalizedLabels> => {
  try {
    const { data, error } = await supabase.functions.invoke('generate-course-content', {
      body: {
        action: 'generate_localized_labels',
        language: course.language,
        course: { title: course.title, subject: course.subject },
      },
    });
    if (!error) {
      const parsed = LocalizedLabelsSchema.safeParse(data?.labels ?? data?.content);
      if (parsed.success) return parsed.data;
      if (typeof data?.content === 'string') {
        const json = JSON.parse(data.content);
        const validated = LocalizedLabelsSchema.safeParse(json);
        if (validated.success) return validated.data;
      }
    }
  } catch (error) {
    console.warn('[generateLocalizedLabels] Falling back to English labels:', error);
  }
  return getLocalizedLabels();
};
