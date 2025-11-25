-- Create shift_logs table for Logbook & Events module
CREATE TABLE shift_logs (
    id BIGSERIAL PRIMARY KEY,
    program_id BIGINT NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
    shift_date DATE NOT NULL,
    shift_type VARCHAR(100) NOT NULL,
    unit_supervisor VARCHAR(255),
    
    -- Residents Information
    resident_initials TEXT,
    resident_count INTEGER,
    resident_comments TEXT,
    
    -- Events & Documentation
    incidents_events TEXT,
    
    -- Shift Summary
    overall_status VARCHAR(50),
    follow_up_required VARCHAR(100),
    shift_summary TEXT,
    
    -- JSON fields for flexible data storage
    staff_assignments_json TEXT,
    equipment_counts_json TEXT,
    
    -- Certification
    certification_complete BOOLEAN NOT NULL DEFAULT FALSE,
    cert_equipment_verified BOOLEAN NOT NULL DEFAULT FALSE,
    cert_shift_events_accurate BOOLEAN NOT NULL DEFAULT FALSE,
    certification_datetime TIMESTAMP,
    report_completed_by VARCHAR(255),
    report_completed_by_email VARCHAR(255),
    
    -- Audit fields
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    status VARCHAR(50) DEFAULT 'Submitted',
    
    -- Unique constraint: one log per program/date/shift combination
    CONSTRAINT unique_program_shift UNIQUE (program_id, shift_date, shift_type)
);

-- Create shift_log_attachments table for scanned logbook pages
CREATE TABLE shift_log_attachments (
    id BIGSERIAL PRIMARY KEY,
    shift_log_id BIGINT NOT NULL REFERENCES shift_logs(id) ON DELETE CASCADE,
    file_name VARCHAR(500) NOT NULL,
    file_type VARCHAR(100),
    file_size BIGINT,
    file_url TEXT,
    uploaded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    uploaded_by VARCHAR(255)
);

-- Create indexes for better query performance
CREATE INDEX idx_shift_logs_program_date ON shift_logs(program_id, shift_date DESC);
CREATE INDEX idx_shift_logs_shift_type ON shift_logs(shift_type);
CREATE INDEX idx_shift_logs_status ON shift_logs(overall_status);
CREATE INDEX idx_shift_logs_created ON shift_logs(created_at DESC);
CREATE INDEX idx_attachments_shift_log ON shift_log_attachments(shift_log_id);

-- Add comment for documentation
COMMENT ON TABLE shift_logs IS 'Stores shift log reports for the Logbook & Events module';
COMMENT ON TABLE shift_log_attachments IS 'Stores scanned logbook pages and attachments for shift logs';
