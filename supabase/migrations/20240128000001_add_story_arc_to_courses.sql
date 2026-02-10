
ALTER TABLE courses 
ADD COLUMN IF NOT EXISTS story_arc JSONB;
COMMENT ON COLUMN courses.story_arc IS 'Global narrative arc mapping per module';
