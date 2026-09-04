import { z } from 'zod';

export interface LocalizedLabels {
  duration: string;
  format: string;
  section: string;
  theory: string;
  keyTakeaways: string;
  actionPlan: string;
  reflection: string;
  trainerInstructions: string;
  method: string;
  logistics: string;
  script: string;
  activity: string;
  objective: string;
  instructionsParticipant: string;
  instructionsFacilitator: string;
  debrief: string;
  example: string;
  videoScript: string;
}

export const LocalizedLabelsSchema = z.object({
  duration: z.string().min(1),
  format: z.string().min(1),
  section: z.string().min(1),
  theory: z.string().min(1),
  keyTakeaways: z.string().min(1),
  actionPlan: z.string().min(1),
  reflection: z.string().min(1),
  trainerInstructions: z.string().min(1),
  method: z.string().min(1),
  logistics: z.string().min(1),
  script: z.string().min(1),
  activity: z.string().min(1),
  objective: z.string().min(1),
  instructionsParticipant: z.string().min(1),
  instructionsFacilitator: z.string().min(1),
  debrief: z.string().min(1),
  example: z.string().min(1),
  videoScript: z.string().min(1),
});

export const DEFAULT_ENGLISH_LABELS: LocalizedLabels = {
  duration: 'Duration',
  format: 'Format',
  section: 'Section',
  theory: 'Theory & Concepts',
  keyTakeaways: 'Key Takeaways',
  actionPlan: 'Action Plan',
  reflection: 'Reflection',
  trainerInstructions: 'Trainer Instructions',
  method: 'Method',
  logistics: 'Logistics',
  script: 'Script',
  activity: 'Activity',
  objective: 'Objective',
  instructionsParticipant: 'Participant Instructions',
  instructionsFacilitator: 'Facilitator Instructions',
  debrief: 'Debrief',
  example: 'Example',
  videoScript: 'Video Script',
};

export function getLocalizedLabels(labels?: Partial<LocalizedLabels> | null): LocalizedLabels {
  return { ...DEFAULT_ENGLISH_LABELS, ...labels };
}
