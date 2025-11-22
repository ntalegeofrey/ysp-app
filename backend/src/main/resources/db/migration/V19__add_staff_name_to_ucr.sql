-- Add staff_name column to program_ucr_reports table
ALTER TABLE program_ucr_reports ADD COLUMN IF NOT EXISTS staff_name VARCHAR(255);
