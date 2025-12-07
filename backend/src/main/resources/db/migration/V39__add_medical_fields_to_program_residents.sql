-- Add medical fields to program_residents table for medication management
ALTER TABLE program_residents
    ADD COLUMN IF NOT EXISTS medical_allergies TEXT,
    ADD COLUMN IF NOT EXISTS primary_physician VARCHAR(255),
    ADD COLUMN IF NOT EXISTS last_medical_review DATE;
