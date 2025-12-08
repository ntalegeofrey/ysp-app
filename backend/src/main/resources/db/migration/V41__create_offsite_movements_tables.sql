-- Off-Site Movements Module
-- Tracks all off-site movements for residents (medical, court, appointments, etc.)

-- Main offsite movements table
CREATE TABLE offsite_movements (
    id BIGSERIAL PRIMARY KEY,
    program_id BIGINT NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
    resident_id BIGINT NOT NULL REFERENCES program_residents(id) ON DELETE CASCADE,
    
    -- Movement details
    movement_type VARCHAR(100) NOT NULL,
    movement_date DATE NOT NULL,
    movement_time TIME NOT NULL,
    destination VARCHAR(255) NOT NULL,
    destination_address TEXT,
    destination_contact VARCHAR(255),
    
    -- Scheduling
    estimated_duration VARCHAR(50),
    priority_level VARCHAR(20) NOT NULL DEFAULT 'ROUTINE',
    status VARCHAR(20) NOT NULL DEFAULT 'SCHEDULED',
    
    -- Actual tracking
    actual_start_time TIMESTAMP,
    actual_end_time TIMESTAMP,
    actual_duration VARCHAR(50),
    
    -- Security & special requirements
    requires_restraints BOOLEAN DEFAULT FALSE,
    wheelchair_accessible BOOLEAN DEFAULT FALSE,
    medical_equipment_needed BOOLEAN DEFAULT FALSE,
    behavioral_precautions BOOLEAN DEFAULT FALSE,
    
    -- Notes
    movement_notes TEXT,
    outcome_notes TEXT,
    cancellation_reason TEXT,
    
    -- Audit fields
    scheduled_by_staff_id BIGINT NOT NULL REFERENCES users(id),
    completed_by_staff_id BIGINT REFERENCES users(id),
    cancelled_by_staff_id BIGINT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT chk_priority_level CHECK (priority_level IN ('ROUTINE', 'URGENT', 'EMERGENCY')),
    CONSTRAINT chk_status CHECK (status IN ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'))
);

-- Staff assignments for movements (minimum 2 required)
CREATE TABLE movement_staff_assignments (
    id BIGSERIAL PRIMARY KEY,
    movement_id BIGINT NOT NULL REFERENCES offsite_movements(id) ON DELETE CASCADE,
    staff_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    assignment_role VARCHAR(20) NOT NULL DEFAULT 'PRIMARY',
    assigned_at TIMESTAMP DEFAULT NOW(),
    assigned_by_staff_id BIGINT NOT NULL REFERENCES users(id),
    
    -- Constraints
    CONSTRAINT chk_assignment_role CHECK (assignment_role IN ('PRIMARY', 'SECONDARY')),
    CONSTRAINT uq_movement_staff UNIQUE(movement_id, staff_id)
);

-- Indexes for performance
CREATE INDEX idx_movements_program ON offsite_movements(program_id);
CREATE INDEX idx_movements_resident ON offsite_movements(resident_id);
CREATE INDEX idx_movements_date ON offsite_movements(movement_date);
CREATE INDEX idx_movements_status ON offsite_movements(status);
CREATE INDEX idx_movements_priority ON offsite_movements(priority_level);
CREATE INDEX idx_movements_scheduled_by ON offsite_movements(scheduled_by_staff_id);
CREATE INDEX idx_staff_assignments_movement ON movement_staff_assignments(movement_id);
CREATE INDEX idx_staff_assignments_staff ON movement_staff_assignments(staff_id);

-- Comments
COMMENT ON TABLE offsite_movements IS 'Tracks all off-site movements for residents including medical appointments, court appearances, etc.';
COMMENT ON TABLE movement_staff_assignments IS 'Staff members assigned to escort residents on off-site movements';
COMMENT ON COLUMN offsite_movements.priority_level IS 'ROUTINE, URGENT, or EMERGENCY';
COMMENT ON COLUMN offsite_movements.status IS 'SCHEDULED, IN_PROGRESS, COMPLETED, or CANCELLED';
