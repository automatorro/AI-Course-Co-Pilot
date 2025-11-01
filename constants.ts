
import { Plan } from './types';

// IMPORTANT: Replace with your actual Stripe publishable key
export const STRIPE_PUBLISHABLE_KEY = 'pk_test_51PcaBDRs5hwfG01Q5kT9IeP4yO0nL0f1d1g0O0v0n0e0r0T0E0S0T0K0E0Y0placeholder';

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
    // IMPORTANT: Replace with your actual Stripe Price ID for the Basic plan
    priceId: 'price_1PcaGHRs5hwfG01QZabCDefg',
  },
  [Plan.Pro]: {
    name: Plan.Pro,
    price: 29,
    courseLimit: 20,
    duration: '/month',
    featuresKey: 'proFeatures',
    // IMPORTANT: Replace with your actual Stripe Price ID for the Pro plan
    priceId: 'price_1PcaGzRs5hwfG01QAbcDEfgh',
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