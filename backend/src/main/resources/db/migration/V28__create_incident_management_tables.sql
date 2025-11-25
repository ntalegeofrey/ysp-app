-- Create incident_reports table
CREATE TABLE incident_reports (
    id BIGSERIAL PRIMARY KEY,
    program_id BIGINT NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
    
    -- Basic Information
    incident_date DATE NOT NULL,
    incident_time TIME NOT NULL,
    shift VARCHAR(50),
    
    -- Location & Nature
    area_of_incident VARCHAR(100),
    nature_of_incident VARCHAR(100) NOT NULL,
    
    -- People Involved
    residents_involved TEXT,
    staff_involved TEXT,
    resident_witnesses TEXT,
    primary_staff_restraint VARCHAR(255),
    
    -- Timing Information
    mechanicals_start_time TIME,
    mechanicals_finish_time TIME,
    room_confinement_start_time TIME,
    room_confinement_finish_time TIME,
    
    -- Population Counts
    staff_population INTEGER,
    youth_population INTEGER,
    
    -- Description
    detailed_description TEXT NOT NULL,
    
    -- Certification & Signature
    report_completed_by VARCHAR(255) NOT NULL,
    report_completed_by_email VARCHAR(255),
    signature_datetime TIMESTAMP NOT NULL,
    certification_complete BOOLEAN DEFAULT FALSE,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    
    -- Status tracking
    status VARCHAR(50) DEFAULT 'Submitted',
    priority VARCHAR(20),
    reviewed_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMP,
    
    CONSTRAINT chk_incident_times CHECK (
        mechanicals_finish_time IS NULL OR mechanicals_start_time IS NULL OR 
        mechanicals_finish_time >= mechanicals_start_time
    ),
    CONSTRAINT chk_confinement_times CHECK (
        room_confinement_finish_time IS NULL OR room_confinement_start_time IS NULL OR 
        room_confinement_finish_time >= room_confinement_start_time
    )
);

-- Create shakedown_reports table
CREATE TABLE shakedown_reports (
    id BIGSERIAL PRIMARY KEY,
    program_id BIGINT NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
    
    -- Basic Information
    shakedown_date DATE NOT NULL,
    shift VARCHAR(50),
    
    -- Search Results (JSON arrays stored as TEXT)
    common_area_searches TEXT,
    school_area_searches TEXT,
    resident_room_searches TEXT,
    
    -- Tools & Equipment Condition (JSON object stored as TEXT)
    equipment_condition TEXT,
    
    -- Opposite Gender Announcements
    announcement_time TIME,
    announcement_staff VARCHAR(255),
    announcement_areas TEXT,
    
    -- Additional Information
    additional_comments TEXT,
    
    -- Certification & Signature
    report_completed_by VARCHAR(255) NOT NULL,
    report_completed_by_email VARCHAR(255),
    signature_datetime TIMESTAMP NOT NULL,
    certification_complete BOOLEAN DEFAULT FALSE,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    
    -- Status tracking
    status VARCHAR(50) DEFAULT 'Submitted',
    contraband_found BOOLEAN DEFAULT FALSE,
    reviewed_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMP
);

-- Create indexes for incident_reports
CREATE INDEX idx_incident_reports_program ON incident_reports(program_id);
CREATE INDEX idx_incident_reports_date ON incident_reports(incident_date);
CREATE INDEX idx_incident_reports_status ON incident_reports(status);
CREATE INDEX idx_incident_reports_priority ON incident_reports(priority);
CREATE INDEX idx_incident_reports_nature ON incident_reports(nature_of_incident);
CREATE INDEX idx_incident_reports_created_at ON incident_reports(created_at DESC);

-- Create indexes for shakedown_reports
CREATE INDEX idx_shakedown_reports_program ON shakedown_reports(program_id);
CREATE INDEX idx_shakedown_reports_date ON shakedown_reports(shakedown_date);
CREATE INDEX idx_shakedown_reports_status ON shakedown_reports(status);
CREATE INDEX idx_shakedown_reports_contraband ON shakedown_reports(contraband_found);
CREATE INDEX idx_shakedown_reports_created_at ON shakedown_reports(created_at DESC);

-- Add comments
COMMENT ON TABLE incident_reports IS 'Incident reports for youth facilities tracking assaults, contraband, escapes, etc.';
COMMENT ON COLUMN incident_reports.nature_of_incident IS 'Type: Restraint, Assault, Escape, Contraband, etc.';
COMMENT ON COLUMN incident_reports.priority IS 'Auto-calculated: Critical, High, Medium, Low';

COMMENT ON TABLE shakedown_reports IS 'Shakedown/search reports for facility security checks';
COMMENT ON COLUMN shakedown_reports.common_area_searches IS 'JSON array of common area search results';
COMMENT ON COLUMN shakedown_reports.school_area_searches IS 'JSON array of school area search results';
COMMENT ON COLUMN shakedown_reports.resident_room_searches IS 'JSON array of resident room search results';
COMMENT ON COLUMN shakedown_reports.equipment_condition IS 'JSON object with equipment status (Good/Fair/Poor/Missing)';
