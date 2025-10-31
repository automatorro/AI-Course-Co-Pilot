
import { Plan } from './types';

export const PRICING_PLANS = {
  [Plan.Trial]: {
    name: Plan.Trial,
    price: 0,
    courseLimit: 1,
    duration: '3 days',
    featuresKey: 'trialFeatures',
  },
  [Plan.Basic]: {
    name: Plan.Basic,
    price: 9,
    courseLimit: 3,
    duration: '/month',
    featuresKey: 'basicFeatures',
  },
  [Plan.Pro]: {
    name: Plan.Pro,
    price: 29,
    courseLimit: 20,
    duration: '/month',
    featuresKey: 'proFeatures',
  },
};

export const COURSE_STEPS_KEYS = [
  'course.steps.structure',
  'course.steps.slides',
  'course.steps.exercises',
  'course.steps.manual',
  'course.steps.tests',
];

export const CONTENT_LANGUAGES = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'it', name: 'Italiano' },
];
