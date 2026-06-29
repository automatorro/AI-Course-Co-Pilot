-- Migration for Master Blueprint Architecture (Lessons, Statuses, and Versioning)

-- 1. Create course_lessons table
CREATE TABLE IF NOT EXISTS course_lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID REFERENCES course_modules(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  learning_objective TEXT,
  has_exercise BOOLEAN DEFAULT FALSE,
  estimated_minutes INTEGER DEFAULT 15,
  key_takeaways JSONB DEFAULT '[]'::jsonb,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_course_lessons_module_id ON course_lessons(module_id);
CREATE INDEX IF NOT EXISTS idx_course_lessons_course_id ON course_lessons(course_id);

-- RLS Policies for course_lessons
ALTER TABLE course_lessons ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage lessons for their own courses" ON course_lessons;
CREATE POLICY "Users can manage lessons for their own courses"
  ON course_lessons FOR ALL
  USING (
    course_id IN (
      SELECT id FROM courses WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    course_id IN (
      SELECT id FROM courses WHERE user_id = auth.uid()
    )
  );

-- 2. Add versioning columns to courses table
ALTER TABLE courses ADD COLUMN IF NOT EXISTS blueprint_version INTEGER DEFAULT 1;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS blueprint_history JSONB DEFAULT '[]'::jsonb;

-- Comment on columns
COMMENT ON COLUMN courses.blueprint_version IS 'The current version of the course blueprint (increments on user-approved modifications)';
COMMENT ON COLUMN courses.blueprint_history IS 'Historical log of previous blueprints for rollback and audit purposes';

-- 3. Add lesson_id, status, and slides_data columns to course_steps table
ALTER TABLE course_steps ADD COLUMN IF NOT EXISTS lesson_id UUID REFERENCES course_lessons(id) ON DELETE CASCADE;
ALTER TABLE course_steps ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'generat', 'editat', 'aprobat'));
ALTER TABLE course_steps ADD COLUMN IF NOT EXISTS slides_data JSONB DEFAULT NULL;

-- Index for faster lookups on lesson steps
CREATE INDEX IF NOT EXISTS idx_course_steps_lesson_id ON course_steps(lesson_id);

-- Comment on columns
COMMENT ON COLUMN course_steps.lesson_id IS 'Reference to the specific lesson this generated step belongs to (null for global steps like CourseDNA)';
COMMENT ON COLUMN course_steps.status IS 'The lifecycle state of this generated step: draft, generat, editat, or aprobat';
COMMENT ON COLUMN course_steps.slides_data IS 'Structured JSON array of SlideState objects for deterministic rendering and export';
