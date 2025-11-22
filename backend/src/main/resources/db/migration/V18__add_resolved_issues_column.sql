-- Add column to track individually resolved issues within a UCR report
ALTER TABLE program_ucr_reports 
ADD COLUMN IF NOT EXISTS resolved_issues TEXT;

-- Add comment to explain the column
COMMENT ON COLUMN program_ucr_reports.resolved_issues IS 'Comma-separated list of field names that have been individually resolved (e.g., securityRadios,infraFireAlarm)';
