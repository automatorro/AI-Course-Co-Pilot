
export enum Plan {
  Trial = 'Trial',
  Basic = 'Basic',
  Pro = 'Pro',
}

export interface User {
  id: string;
  email: string;
  plan: Plan;
  coursesCreated: number;
}

export enum GenerationEnvironment {
  Corporate = 'Corporate',
  Academic = 'Academic',
}

export interface Course {
  id: string;
  title: string;
  subject: string;
  targetAudience: string;
  environment: GenerationEnvironment;
  language: string;
  progress: number; // Percentage from 0 to 100
  steps: CourseStep[];
}

export interface CourseStep {
  id: string;
  titleKey: string; // key for i18n
  content: string;
  isCompleted: boolean;
}
