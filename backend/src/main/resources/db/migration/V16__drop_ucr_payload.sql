-- Drop the problematic payload_json column
-- We'll store data in proper columns later
ALTER TABLE program_ucr_reports DROP COLUMN IF EXISTS payload_json;
