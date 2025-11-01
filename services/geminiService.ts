// ABOUTME: This service handles communication with the Supabase Edge Function
// ABOUTME: for generating course content using the Gemini API.
import { supabase } from './supabaseClient';
import { Course, CourseStep } from '../types';

/**
 * Invokes a Supabase Edge Function to generate content for a specific course step.
 * The Edge Function is responsible for prompt engineering and calling the Google Gemini API.
 * @param course The full course object, providing context.
 * @param step The specific step for which to generate content.
 * @returns A promise that resolves to the AI-generated content string.
 */
export const generateCourseContent = async (course: Course, step: CourseStep): Promise<string> => {
  console.log(`Invoking Edge Function 'generate-course-content' for step: ${step.title_key}`);

  try {
    // We pass the entire course and the current step to the Edge Function.
    // The function will handle constructing the appropriate prompt and system instructions.
    const { data, error } = await supabase.functions.invoke('generate-course-content', {
      body: { course, step },
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
