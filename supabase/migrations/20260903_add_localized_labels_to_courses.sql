-- F2-T1: Persist labels used by generated course materials.
-- Deploy manually in Supabase Studio, then confirm in IMPLEMENTATION_STATUS.md.
ALTER TABLE public.courses
  ADD COLUMN IF NOT EXISTS localized_labels jsonb;

COMMENT ON COLUMN public.courses.localized_labels IS
  'Course-language labels for generated material headers; falls back to static English labels when absent.';
