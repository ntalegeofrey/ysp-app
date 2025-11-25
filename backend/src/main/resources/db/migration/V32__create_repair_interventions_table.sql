-- Create repair_interventions table for repair assignment module
CREATE TABLE repair_interventions (
    id BIGSERIAL PRIMARY KEY,
    program_id BIGINT REFERENCES programs(id) ON DELETE CASCADE,
    resident_id BIGINT REFERENCES program_residents(id) ON DELETE CASCADE,
    
    -- Infraction Details
    infraction_date DATE,
    infraction_shift VARCHAR(50),
    infraction_behavior TEXT,
    
    -- Assignment Details
    assigning_staff_id BIGINT,
    assigning_staff_name VARCHAR(255),
    repair_level VARCHAR(50),
    interventions_json TEXT,
    comments TEXT,
    
    -- Review Details
    review_date DATE,
    reviewed_by_pd_id BIGINT,
    reviewed_by_pd_name VARCHAR(255),
    reviewed_by_pd_at TIMESTAMP,
    reviewed_by_clinical_id BIGINT,
    reviewed_by_clinical_name VARCHAR(255),
    reviewed_by_clinical_at TIMESTAMP,
    
    -- Status and Audit
    status VARCHAR(50) DEFAULT 'draft',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_repair_interventions_program ON repair_interventions(program_id);
CREATE INDEX idx_repair_interventions_resident ON repair_interventions(resident_id);
CREATE INDEX idx_repair_interventions_status ON repair_interventions(status);
CREATE INDEX idx_repair_interventions_date ON repair_interventions(infraction_date DESC);

-- Add comment for documentation
COMMENT ON TABLE repair_interventions IS 'Stores repair intervention assignments for residents';
