-- Add comprehensive tagging and verification columns to content_case_studies
ALTER TABLE content_case_studies
ADD COLUMN IF NOT EXISTS tags jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS ai_analysis jsonb,
ADD COLUMN IF NOT EXISTS verification_status text DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected', 'needs_review')),
ADD COLUMN IF NOT EXISTS authenticity_score numeric(3,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS pairing_confidence numeric(3,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS reviewed_by uuid REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS reviewed_at timestamptz,
ADD COLUMN IF NOT EXISTS review_notes text;

-- Create index for verification queries
CREATE INDEX IF NOT EXISTS idx_case_studies_verification 
ON content_case_studies(verification_status);

-- Create index for authenticity filtering
CREATE INDEX IF NOT EXISTS idx_case_studies_authenticity 
ON content_case_studies(authenticity_score) 
WHERE authenticity_score > 0.7;

-- Add comments for documentation
COMMENT ON COLUMN content_case_studies.tags IS 'AI-generated tags: roof_type, condition, materials, work_performed, etc.';
COMMENT ON COLUMN content_case_studies.ai_analysis IS 'Complete AI analysis including before/after analysis, pairing logic, authenticity checks';
COMMENT ON COLUMN content_case_studies.verification_status IS 'Human review status: pending, verified, rejected, needs_review';
COMMENT ON COLUMN content_case_studies.authenticity_score IS 'AI confidence that images are genuine CKR work (0-1)';
COMMENT ON COLUMN content_case_studies.pairing_confidence IS 'AI confidence in before/after pairing accuracy (0-1)';
COMMENT ON COLUMN content_case_studies.review_notes IS 'Admin notes from verification review';
