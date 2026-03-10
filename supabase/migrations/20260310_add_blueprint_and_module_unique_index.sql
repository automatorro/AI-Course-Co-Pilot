-- Add 'blueprint' JSONB column to courses table
-- This column is already used in production (via Supabase dashboard) but was never in a migration.
-- Adding it here for reproducibility and schema documentation.
ALTER TABLE courses
ADD COLUMN IF NOT EXISTS blueprint JSONB;

COMMENT ON COLUMN courses.blueprint IS 'Course blueprint: module list, structure, and metadata. Source of truth for module generation.';

-- Add UNIQUE index on (course_id, module_index) for course_modules.
-- Required so that upsert (ON CONFLICT) works correctly during blueprint sync and module creation.
-- Using CREATE UNIQUE INDEX IF NOT EXISTS so the migration is idempotent.
CREATE UNIQUE INDEX IF NOT EXISTS course_modules_course_id_module_index_key
  ON course_modules (course_id, module_index);
