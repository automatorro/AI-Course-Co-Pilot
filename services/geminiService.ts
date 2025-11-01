// ABOUTME: This service handles communication with the Supabase Edge Function
// ABOUTME: for generating course content using the Gemini API.
import { supabase } from './supabaseClient';
import { Course, CourseStep } from '../types';

/**
 * Invokes a Supabase Edge Function to generate content for a specific course step.
 * The Edge Function is responsible for prompt engineering and securely calling the Google Gemini API.
 * @param course The full course object, providing context.
 * @param step The specific step for which to generate content.
 * @returns A promise that resolves to the AI-generated content string.
 */
export const generateCourseContent = async (course: Course, step: CourseStep): Promise<string> => {
  console.log(`Invoking Edge Function 'generate-course-content' for step: ${step.title_key}`);

  try {
    // To prevent hitting payload size limits, we create a pruned version of the course object.
    // The AI only needs the content from *previous* steps for context, not the content of
    // the current step (which is being generated) or any future steps.
    const courseForPayload: Course = {
      ...course,
      steps: course.steps?.map(s => {
        if (s.step_order >= step.step_order) {
          // Strip content from current and future steps
          return { ...s, content: '' };
        }
        // Keep previous steps as they are, with their content for context
        return s;
      })
    };

    // We are now calling the Edge Function.
    const { data, error } = await supabase.functions.invoke('generate-course-content', {
        body: { 
            course: courseForPayload, 
            step: step 
        }
    });

    if (error) {
      console.error('Error invoking Supabase Edge Function:', error);
      return `Error from server: ${error.message}. Make sure the 'generate-course-content' function is deployed correctly in Supabase.`;
    }
    
    if (!data || typeof data.content !== 'string') {
        console.error('Unexpected response format from Edge Function. Expected { content: string }, received:', data);
        return 'Error: Received an invalid or empty response from the generation service.';
    }

    return data.content;
  } catch (err: any) {
    console.error('Client-side error calling generateCourseContent:', err);
    return `An unexpected error occurred: ${err.message}. Please check your network connection and try again.`;
  }
};
