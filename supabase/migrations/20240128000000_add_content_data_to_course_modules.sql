-- Create course_modules table if it doesn't exist
CREATE TABLE IF NOT EXISTS course_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  module_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  content_data JSONB -- The Golden JSON Source of Truth
);

-- Enable RLS
ALTER TABLE course_modules ENABLE ROW LEVEL SECURITY;

-- Create policy for access
DROP POLICY IF EXISTS "Users can manage modules for their own courses" ON course_modules;

CREATE POLICY "Users can manage modules for their own courses"
ON course_modules
FOR ALL
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

-- Comment
COMMENT ON COLUMN course_modules.content_data IS 'The Golden JSON Source of Truth for this module';
