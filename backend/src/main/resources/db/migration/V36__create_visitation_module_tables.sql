-- Visitation Module: Visitations and Phone Logs
-- Tracks in-person visits, video visits, professional/legal visits, and phone calls
-- Includes approval workflow, behavioral observations, and staff assignments

-- Visitations table
CREATE TABLE visitations (
    id BIGSERIAL PRIMARY KEY,
    program_id BIGINT NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
    resident_id BIGINT NOT NULL REFERENCES program_residents(id) ON DELETE CASCADE,
    
    -- Visit type and status
    visit_type VARCHAR(50) NOT NULL CHECK (visit_type IN ('IN_PERSON', 'VIDEO', 'PROFESSIONAL', 'LEGAL')),
    status VARCHAR(50) NOT NULL DEFAULT 'SCHEDULED' CHECK (status IN ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW')),
    approval_status VARCHAR(50) NOT NULL DEFAULT 'PENDING' CHECK (approval_status IN ('APPROVED', 'PENDING', 'DENIED')),
    
    -- Visitor information (JSON array for multiple visitors)
    visitor_info_json TEXT,
    
    -- Scheduling
    scheduled_date DATE NOT NULL,
    scheduled_start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    scheduled_end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    actual_start_time TIMESTAMP WITH TIME ZONE,
    actual_end_time TIMESTAMP WITH TIME ZONE,
    
    -- Location and logistics
    visitation_room VARCHAR(100),
    special_instructions TEXT,
    
    -- Staff assignment
    supervising_staff_id BIGINT REFERENCES users(id),
    
    -- Post-visit logging
    visit_notes TEXT,
    denial_reason TEXT,
    
    -- Audit trail
    scheduled_by_staff_id BIGINT REFERENCES users(id),
    completed_by_staff_id BIGINT REFERENCES users(id),
    
    -- Incident tracking
    incident_occurred BOOLEAN DEFAULT FALSE,
    incident_details TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Phone logs table
CREATE TABLE phone_logs (
    id BIGSERIAL PRIMARY KEY,
    program_id BIGINT NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
    resident_id BIGINT NOT NULL REFERENCES program_residents(id) ON DELETE CASCADE,
    
    -- Call type and contact information
    call_type VARCHAR(50) NOT NULL CHECK (call_type IN ('OUTGOING', 'INCOMING', 'LEGAL', 'EMERGENCY')),
    contact_relationship VARCHAR(50) NOT NULL CHECK (contact_relationship IN (
        'MOTHER_1', 'MOTHER_2', 'FATHER_1', 'FATHER_2', 'STEPMOTHER', 'STEPFATHER',
        'SISTER', 'BROTHER', 'STEPSISTER', 'STEPBROTHER', 
        'GRANDMOTHER', 'GRANDFATHER', 'AUNT', 'UNCLE', 'COUSIN',
        'GUARDIAN', 'FOSTER', 'CASEWORKER', 'SOCIAL_SERVICES', 'PROBATION',
        'ATTORNEY', 'THERAPIST', 'DOCTOR', 'SUPPORT_SERVICES', 'OTHER'
    )),
    contact_name VARCHAR(200),
    other_relationship_details VARCHAR(500),
    phone_number VARCHAR(20),
    
    -- Call timing
    call_date_time TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_minutes INTEGER NOT NULL CHECK (duration_minutes >= 0),
    
    -- Staff involved
    authorizing_staff_id BIGINT NOT NULL REFERENCES users(id),
    monitoring_staff_id BIGINT NOT NULL REFERENCES users(id),
    
    -- Behavioral observations
    behavior_during_call VARCHAR(50) NOT NULL CHECK (behavior_during_call IN (
        'POSITIVE', 'NEUTRAL', 'AGITATED', 'DISTRESSED', 'CONCERNING'
    )),
    post_call_behavior VARCHAR(50) NOT NULL CHECK (post_call_behavior IN (
        'IMPROVED', 'NO_CHANGE', 'SLIGHTLY_ELEVATED', 'SIGNIFICANTLY_IMPACTED', 'CRISIS_LEVEL'
    )),
    additional_comments TEXT,
    
    -- Early termination tracking
    call_terminated_early BOOLEAN DEFAULT FALSE,
    termination_reason TEXT,
    
    -- Audit trail
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    logged_by_staff_id BIGINT NOT NULL REFERENCES users(id)
);

-- Indexes for visitations
CREATE INDEX idx_visitations_program ON visitations(program_id);
CREATE INDEX idx_visitations_resident ON visitations(resident_id);
CREATE INDEX idx_visitations_program_resident ON visitations(program_id, resident_id);
CREATE INDEX idx_visitations_scheduled_date ON visitations(scheduled_date DESC);
CREATE INDEX idx_visitations_status ON visitations(status);
CREATE INDEX idx_visitations_approval_status ON visitations(approval_status);
CREATE INDEX idx_visitations_program_status ON visitations(program_id, status);
CREATE INDEX idx_visitations_program_date ON visitations(program_id, scheduled_date DESC);

-- Composite index for "Today's Schedule" queries
CREATE INDEX idx_visitations_program_date_status ON visitations(program_id, scheduled_date, status) 
WHERE status IN ('SCHEDULED', 'IN_PROGRESS');

-- Indexes for phone logs
CREATE INDEX idx_phone_logs_program ON phone_logs(program_id);
CREATE INDEX idx_phone_logs_resident ON phone_logs(resident_id);
CREATE INDEX idx_phone_logs_program_resident ON phone_logs(program_id, resident_id);
CREATE INDEX idx_phone_logs_call_date ON phone_logs(call_date_time DESC);
CREATE INDEX idx_phone_logs_call_type ON phone_logs(call_type);
CREATE INDEX idx_phone_logs_program_date ON phone_logs(program_id, call_date_time DESC);

-- Comments for documentation
COMMENT ON TABLE visitations IS 'Tracks all scheduled and completed visitations including in-person, video, professional, and legal visits';
COMMENT ON TABLE phone_logs IS 'Logs all phone calls made by or to residents with behavioral observations';

COMMENT ON COLUMN visitations.visit_type IS 'IN_PERSON: Standard family visit, VIDEO: Video conference, PROFESSIONAL: Social worker/therapist, LEGAL: Attorney visit';
COMMENT ON COLUMN visitations.status IS 'SCHEDULED: Upcoming visit, IN_PROGRESS: Currently happening, COMPLETED: Finished, CANCELLED: Cancelled by staff/family, NO_SHOW: Visitor did not arrive';
COMMENT ON COLUMN visitations.approval_status IS 'APPROVED: Visit approved by supervisor, PENDING: Awaiting approval, DENIED: Visit request denied';
COMMENT ON COLUMN visitations.visitor_info_json IS 'JSON array of visitor objects: [{name, relationship, phone, email}, ...]';

COMMENT ON COLUMN phone_logs.call_type IS 'OUTGOING: Resident calling out, INCOMING: Call received, LEGAL: Legal call (privileged), EMERGENCY: Emergency contact';
COMMENT ON COLUMN phone_logs.contact_relationship IS 'Standardized relationship categories for contact tracking and reporting';
COMMENT ON COLUMN phone_logs.behavior_during_call IS 'Resident behavioral state during the phone call';
COMMENT ON COLUMN phone_logs.post_call_behavior IS 'Resident behavioral state immediately following the call - used for monitoring emotional impact';
COMMENT ON COLUMN phone_logs.call_terminated_early IS 'TRUE if call was ended before scheduled time due to behavioral concerns or policy violation';
