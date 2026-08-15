-- F2-T1: Add localized_labels column to courses table.
-- Stores course-level UI label translations as a JSON object.
-- Keys match STATIC_LABELS in generate-course-content/index.ts.
-- NULL = use static defaults from edge function (no custom overrides).
ALTER TABLE courses
  ADD COLUMN IF NOT EXISTS localized_labels jsonb DEFAULT NULL;

COMMENT ON COLUMN courses.localized_labels IS
  'Optional course-level UI label overrides. Keys: duration, format, section, theory, keyTakeaways, actionPlan, reflection, trainerInstructions, method, logistics, script, activity, objective, instructionsParticipant, instructionsFacilitator, debrief, example, videoScript. NULL = use static defaults from edge function.';
