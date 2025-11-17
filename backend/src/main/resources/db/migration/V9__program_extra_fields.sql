-- Add extra fields for program type other, gender, and custom schedule
ALTER TABLE programs
  ADD COLUMN IF NOT EXISTS program_type_other VARCHAR(255),
  ADD COLUMN IF NOT EXISTS gender VARCHAR(16),
  ADD COLUMN IF NOT EXISTS custom_schedule TEXT;
