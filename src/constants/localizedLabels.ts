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
