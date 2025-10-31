
import { GoogleGenAI } from "@google/genai";
import { Course, CourseStep } from '../types';

// This is a MOCK service. In a real application, this logic would be in a Supabase Edge Function.
// The frontend would call the edge function, not the Gemini API directly.
// The API key would be stored as an environment variable in Supabase.

// const ai = new GoogleGenAI({ apiKey: process.env.API_KEY }); // This would be in the backend.

const generateSystemInstruction = (course: Course): string => {
  const baseInstruction = `You are an expert instructional designer creating content for a course titled "${course.title}". The target audience is ${course.targetAudience}. The content language must be ${course.language}.`;

  if (course.environment === 'Corporate') {
    return `${baseInstruction} Structure the content based on modern corporate learning principles:
1.  **Merrill's Principles of Instruction**: Ensure content is problem-centered, activates existing knowledge, demonstrates new skills, allows for application, and facilitates integration into work.
2.  **Bloom's Taxonomy**: Progress learning objectives from remembering and understanding to applying, analyzing, evaluating, and creating.
3.  **Andragogy (Adult Learning)**: Make the content relevant, practical, experience-based, and clearly explain "the why" behind the concepts.`;
  } else { // Academic
    return `${baseInstruction} Structure the content based on academic pedagogical principles:
1.  **Constructivism**: Encourage students to build their own understanding through open-ended questions and exploration.
2.  **Bloom's Taxonomy**: Focus on developing critical thinking and theoretical foundations, progressing from lower to higher-order thinking skills.
3.  **Scaffolding**: Introduce concepts logically, building upon previous knowledge and providing gradual support for complex topics.`;
  }
};


export const generateCourseContent = async (course: Course, step: CourseStep): Promise<string> => {
  console.log('Generating content for step:', step.titleKey);
  console.log('Using environment:', course.environment);

  // In a real backend function:
  /*
  const systemInstruction = generateSystemInstruction(course);
  const prompt = `Generate the content for the course section: "${step.titleKey}". Previous sections have covered: ${course.steps.filter(s => s.isCompleted).map(s => s.titleKey).join(', ')}. Focus on creating comprehensive, engaging material for this specific section.`;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            systemInstruction: systemInstruction,
        }
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Error generating content. Please try again.";
  }
  */

  // Mock implementation for frontend development
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockContent = `## ${step.titleKey.toUpperCase()} - Mock Content

This is AI-generated mock content for the "${course.title}" course.

**Environment:** ${course.environment}
**Target Audience:** ${course.targetAudience}
**Language:** ${course.language}

### Key Concepts
- Concept A: Detailed explanation based on ${course.environment} principles.
- Concept B: Another detailed point.
- Concept C: Practical application or theoretical foundation.

### Example/Exercise
${course.environment === 'Corporate' ? 'A real-world business problem to solve.' : 'A thought-provoking question for exploration.'}

This content is for demonstration purposes. The real implementation would use Google Gemini with sophisticated, pedagogically-sound prompts.
`;
      resolve(mockContent);
    }, 2500);
  });
};
