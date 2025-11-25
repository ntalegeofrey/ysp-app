-- Add new fields for automatic drill status determination
-- Based on evacuation time threshold and resident accountability

ALTER TABLE fire_drill_reports 
ADD COLUMN evacuation_time_threshold DOUBLE PRECISION,
ADD COLUMN all_residents_accounted_for BOOLEAN DEFAULT TRUE,
ADD COLUMN unaccounted_residents_comment TEXT,
ADD COLUMN status_reason TEXT;

-- Add comment to explain the columns
COMMENT ON COLUMN fire_drill_reports.evacuation_time_threshold IS 'Maximum acceptable evacuation time in minutes';
COMMENT ON COLUMN fire_drill_reports.all_residents_accounted_for IS 'Whether all residents were accounted for during drill';
COMMENT ON COLUMN fire_drill_reports.unaccounted_residents_comment IS 'Required comment if not all residents accounted for';
COMMENT ON COLUMN fire_drill_reports.status_reason IS 'Detailed reason why drill was marked as unsuccessful';
