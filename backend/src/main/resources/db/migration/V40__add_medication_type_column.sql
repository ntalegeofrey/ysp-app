-- Add medication_type column to resident_medications table
-- Types: COUNTABLE (pills, tablets), NON_COUNTABLE (ointments, sprays), RECORD_ONLY (inhalers, ventolins)

ALTER TABLE resident_medications
ADD COLUMN medication_type VARCHAR(50) NOT NULL DEFAULT 'COUNTABLE';

-- Add check constraint for valid types
ALTER TABLE resident_medications
ADD CONSTRAINT check_medication_type
CHECK (medication_type IN ('COUNTABLE', 'NON_COUNTABLE', 'RECORD_ONLY'));

-- Create index for better query performance
CREATE INDEX idx_resident_medications_type ON resident_medications(medication_type);

COMMENT ON COLUMN resident_medications.medication_type IS 'Type of medication: COUNTABLE (pills, decrements count), NON_COUNTABLE (ointments/sprays, stays at 1), RECORD_ONLY (inhalers, no count tracking)';
