-- Add 'is_dirty' flag to 'course_modules' to support selective Golden JSON invalidation
ALTER TABLE course_modules
ADD COLUMN IF NOT EXISTS is_dirty BOOLEAN DEFAULT FALSE;

COMMENT ON COLUMN course_modules.is_dirty IS 'Marks modules whose Golden JSON must be regenerated before next use';

