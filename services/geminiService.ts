// ABOUTME: This service handles communication with the Supabase Edge Function
// ABOUTME: for generating and improving course content using the Gemini API.
import { supabase } from './supabaseClient';
import { Course, CourseStep } from '../types';

const invokeContentFunction = async (action: 'generate' | 'improve', course: Course, step: CourseStep, originalContent?: string): Promise<string> => {
  console.log(`Invoking Edge Function with action '${action}' for step: ${step.title_key}`);

  try {
    const courseForPayload: Course = {
      ...course,
      steps: course.steps?.map(s => {
        if (s.step_order >= step.step_order) {
          return { ...s, content: '' };
        }
        return s;
      })
    };

    const body: { course: Course, step: CourseStep, action: string, originalContent?: string } = {
      course: courseForPayload,
      step: step,
      action: action
    };

    if (action === 'improve') {
      body.originalContent = originalContent;
    }

    const { data, error } = await supabase.functions.invoke('generate-course-content', { body });

    if (error) {
      console.error('Error invoking Supabase Edge Function:', error);
      return `Error from server: ${error.message}.`;
    }
    
    if (!data || typeof data.content !== 'string') {
        console.error('Unexpected response format from Edge Function. Expected { content: string }, received:', data);
        return 'Error: Received an invalid or empty response from the generation service.';
    }

    return data.content;
  } catch (err: any) {
    console.error(`Client-side error during '${action}':`, err);
    return `An unexpected error occurred: ${err.message}.`;
  }
};


/**
 * Invokes the Edge Function to generate initial content for a course step.
 */
export const generateCourseContent = async (course: Course, step: CourseStep): Promise<string> => {
  return invokeContentFunction('generate', course, step);
};

/**
 * Invokes the Edge Function to improve existing content for a course step.
 */
export const improveCourseContent = async (course: Course, step: CourseStep, originalContent: string): Promise<string> => {
  return invokeContentFunction('improve', course, step, originalContent);
};
