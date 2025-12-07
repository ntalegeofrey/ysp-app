-- Add clinician column to program_residents table
ALTER TABLE program_residents ADD COLUMN IF NOT EXISTS clinician VARCHAR(255);
