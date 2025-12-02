-- Sleep Log & Watch Module: Watch Assignments and Log Entries
-- A resident can only have ONE active watch at a time
-- Watch types: ELEVATED (most serious), ALERT, GENERAL

-- Watch assignments table
CREATE TABLE watch_assignments (
    id BIGSERIAL PRIMARY KEY,
    resident_id BIGINT NOT NULL REFERENCES program_residents(id) ON DELETE CASCADE,
    program_id BIGINT NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
    watch_type VARCHAR(50) NOT NULL CHECK (watch_type IN ('ELEVATED', 'ALERT', 'GENERAL')),
    start_date_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date_time TIMESTAMP WITH TIME ZONE,
    clinical_reason TEXT NOT NULL,
    
    -- Risk assessment flags
    self_harm_risk BOOLEAN NOT NULL DEFAULT FALSE,
    suicidal_ideation BOOLEAN NOT NULL DEFAULT FALSE,
    aggressive_behavior BOOLEAN NOT NULL DEFAULT FALSE,
    sleep_disturbance BOOLEAN NOT NULL DEFAULT FALSE,
    medical_concern BOOLEAN NOT NULL DEFAULT FALSE,
    
    -- Authorization and completion
    authorized_by_clinician_id BIGINT NOT NULL REFERENCES users(id),
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'COMPLETED', 'ESCALATED', 'TRANSFERRED', 'DISCONTINUED')),
    outcome TEXT,
    end_notes TEXT,
    ended_by_staff_id BIGINT REFERENCES users(id),
    
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Watch log entries table (hourly observations)
CREATE TABLE watch_log_entries (
    id BIGSERIAL PRIMARY KEY,
    watch_assignment_id BIGINT NOT NULL REFERENCES watch_assignments(id) ON DELETE CASCADE,
    observation_time TIMESTAMP WITH TIME ZONE NOT NULL,
    observation_status VARCHAR(50) NOT NULL CHECK (observation_status IN ('NORMAL', 'HIGH', 'CRITICAL')),
    activity VARCHAR(50) NOT NULL CHECK (activity IN ('SLEEPING', 'LAYING_ON_BED', 'WALKING', 'PLAYING', 'ENGAGING', 'BATHROOM', 'OTHER')),
    notes TEXT NOT NULL,
    logged_by_staff_id BIGINT NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_watch_assignments_resident ON watch_assignments(resident_id);
CREATE INDEX idx_watch_assignments_program ON watch_assignments(program_id);
CREATE INDEX idx_watch_assignments_program_status ON watch_assignments(program_id, status);
CREATE INDEX idx_watch_assignments_status ON watch_assignments(status);
CREATE INDEX idx_watch_assignments_start_time ON watch_assignments(start_date_time DESC);

-- Unique constraint: Only one ACTIVE watch per resident at a time
CREATE UNIQUE INDEX idx_one_active_watch_per_resident 
ON watch_assignments(resident_id) 
WHERE status = 'ACTIVE';

-- Indexes for log entries
CREATE INDEX idx_watch_log_entries_assignment ON watch_log_entries(watch_assignment_id);
CREATE INDEX idx_watch_log_entries_time ON watch_log_entries(watch_assignment_id, observation_time DESC);
CREATE INDEX idx_watch_log_entries_observation_time ON watch_log_entries(observation_time DESC);

-- Comments for documentation
COMMENT ON TABLE watch_assignments IS 'Sleep and behavioral watch assignments for residents. Only one active watch per resident allowed.';
COMMENT ON TABLE watch_log_entries IS 'Hourly observation logs for residents on watch status.';
COMMENT ON COLUMN watch_assignments.watch_type IS 'ELEVATED (most serious/red), ALERT (medium/yellow), GENERAL (standard/green)';
COMMENT ON COLUMN watch_assignments.status IS 'ACTIVE watches are ongoing, others are archived';
COMMENT ON CONSTRAINT idx_one_active_watch_per_resident ON watch_assignments IS 'Ensures only one active watch per resident at any time';
