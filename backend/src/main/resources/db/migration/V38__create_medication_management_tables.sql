-- Medication Management Module
-- Tables for tracking resident medications, administration logs, audits, and alerts

-- =====================================================
-- 1. RESIDENT MEDICATIONS
-- =====================================================
CREATE TABLE resident_medications (
    id BIGSERIAL PRIMARY KEY,
    
    -- Foreign keys
    resident_id BIGINT NOT NULL REFERENCES residents(id) ON DELETE CASCADE,
    program_id BIGINT NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
    
    -- Medication details
    medication_name VARCHAR(255) NOT NULL,
    dosage VARCHAR(100) NOT NULL,
    frequency VARCHAR(100) NOT NULL,  -- "Once Daily", "Twice Daily", "PRN", etc.
    
    -- Inventory tracking
    initial_count INTEGER NOT NULL,
    current_count INTEGER NOT NULL,
    
    -- Prescription information
    prescribing_physician VARCHAR(255),
    special_instructions TEXT,
    prescription_date DATE,
    
    -- Status tracking
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',  -- ACTIVE, DISCONTINUED, EXPIRED, ON_HOLD
    
    -- Audit fields
    added_by_staff_id BIGINT NOT NULL REFERENCES users(id),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_resident_medications_resident ON resident_medications(resident_id, status);
CREATE INDEX idx_resident_medications_program ON resident_medications(program_id);
CREATE INDEX idx_resident_medications_status ON resident_medications(status);

-- =====================================================
-- 2. MEDICATION ADMINISTRATIONS
-- =====================================================
CREATE TABLE medication_administrations (
    id BIGSERIAL PRIMARY KEY,
    
    -- Foreign keys
    resident_id BIGINT NOT NULL REFERENCES residents(id) ON DELETE CASCADE,
    resident_medication_id BIGINT NOT NULL REFERENCES resident_medications(id) ON DELETE CASCADE,
    program_id BIGINT NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
    administered_by_staff_id BIGINT NOT NULL REFERENCES users(id),
    
    -- When administered
    administration_date DATE NOT NULL,
    administration_time TIME NOT NULL,
    shift VARCHAR(20) NOT NULL,  -- MORNING, EVENING, NIGHT
    
    -- What happened
    action VARCHAR(50) NOT NULL,  -- ADMINISTERED, REFUSED, LATE, MISSED, HELD
    
    -- Additional details
    notes TEXT,
    was_late BOOLEAN DEFAULT FALSE,
    minutes_late INTEGER,
    
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_med_admin_date ON medication_administrations(administration_date DESC, shift);
CREATE INDEX idx_med_admin_resident ON medication_administrations(resident_id, administration_date DESC);
CREATE INDEX idx_med_admin_program ON medication_administrations(program_id, administration_date DESC);
CREATE INDEX idx_med_admin_medication ON medication_administrations(resident_medication_id, administration_date DESC);

-- =====================================================
-- 3. MEDICATION AUDITS
-- =====================================================
CREATE TABLE medication_audits (
    id BIGSERIAL PRIMARY KEY,
    
    -- Context
    program_id BIGINT NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
    audit_date DATE NOT NULL,
    audit_time TIME NOT NULL,
    shift VARCHAR(20) NOT NULL,  -- MORNING, EVENING, NIGHT
    
    -- Submission details
    submitted_by_staff_id BIGINT NOT NULL REFERENCES users(id),
    audit_notes TEXT,
    
    -- Status tracking
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',  -- PENDING, APPROVED, DENIED
    has_discrepancies BOOLEAN DEFAULT FALSE,
    
    -- Approval details
    approved_by_staff_id BIGINT REFERENCES users(id),
    approval_date TIMESTAMP,
    approval_notes TEXT,
    
    -- Timestamps
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_status ON medication_audits(status, audit_date DESC);
CREATE INDEX idx_audit_program ON medication_audits(program_id, status, audit_date DESC);
CREATE INDEX idx_audit_shift ON medication_audits(shift, audit_date DESC);

-- =====================================================
-- 4. MEDICATION AUDIT COUNTS
-- =====================================================
CREATE TABLE medication_audit_counts (
    id BIGSERIAL PRIMARY KEY,
    
    -- Foreign keys
    audit_id BIGINT NOT NULL REFERENCES medication_audits(id) ON DELETE CASCADE,
    resident_id BIGINT NOT NULL REFERENCES residents(id) ON DELETE CASCADE,
    resident_medication_id BIGINT NOT NULL REFERENCES resident_medications(id) ON DELETE CASCADE,
    
    -- Count details
    previous_count INTEGER NOT NULL,
    current_count INTEGER NOT NULL,
    variance INTEGER NOT NULL,  -- current_count - previous_count
    
    -- Previous counter information
    previous_staff_name VARCHAR(255),
    
    -- Optional notes
    notes TEXT,
    
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_counts_audit ON medication_audit_counts(audit_id);
CREATE INDEX idx_audit_counts_resident ON medication_audit_counts(resident_id);
CREATE INDEX idx_audit_counts_medication ON medication_audit_counts(resident_medication_id);

-- =====================================================
-- 5. MEDICATION ALERTS
-- =====================================================
CREATE TABLE medication_alerts (
    id BIGSERIAL PRIMARY KEY,
    
    -- Context
    program_id BIGINT NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
    resident_id BIGINT REFERENCES residents(id) ON DELETE SET NULL,
    resident_medication_id BIGINT REFERENCES resident_medications(id) ON DELETE SET NULL,
    
    -- Alert information
    alert_type VARCHAR(50) NOT NULL,  -- CRITICAL, WARNING, INFO
    title VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    alert_time TIME NOT NULL,
    
    -- Status tracking
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',  -- ACTIVE, RESOLVED
    resolved_by_staff_id BIGINT REFERENCES users(id),
    resolved_at TIMESTAMP,
    
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_alert_status ON medication_alerts(status, created_at DESC);
CREATE INDEX idx_alert_program ON medication_alerts(program_id, status);
CREATE INDEX idx_alert_type ON medication_alerts(alert_type, status);
CREATE INDEX idx_alert_resident ON medication_alerts(resident_id, status);
