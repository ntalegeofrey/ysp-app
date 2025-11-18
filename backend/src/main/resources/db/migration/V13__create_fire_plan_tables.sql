-- Fire Plans table
CREATE TABLE IF NOT EXISTS fire_plans (
    id BIGSERIAL PRIMARY KEY,
    program_id BIGINT NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
    generated_date DATE NOT NULL,
    shift VARCHAR(50),
    total_staff INTEGER,
    total_residents INTEGER,
    special_assignments INTEGER,
    primary_route VARCHAR(255),
    secondary_route VARCHAR(255),
    status VARCHAR(50),
    staff_assignments_json JSONB,
    resident_status_json JSONB,
    route_config_json JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_fire_plans_program ON fire_plans(program_id);
CREATE INDEX idx_fire_plans_status ON fire_plans(status);

-- Fire Drill Reports table
CREATE TABLE IF NOT EXISTS fire_drill_reports (
    id BIGSERIAL PRIMARY KEY,
    program_id BIGINT NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
    drill_date DATE NOT NULL,
    drill_time TIME,
    drill_type VARCHAR(100),
    shift VARCHAR(100),
    shift_supervisor VARCHAR(255),
    report_completed_by VARCHAR(255),
    total_evacuation_time VARCHAR(50),
    weather_conditions VARCHAR(50),
    total_staff_present INTEGER,
    total_residents_present INTEGER,
    overall_performance TEXT,
    issues_identified TEXT,
    recommendations TEXT,
    route_performance_json JSONB,
    certification_complete BOOLEAN DEFAULT FALSE,
    digital_signature VARCHAR(255),
    signature_datetime TIMESTAMP,
    status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_fire_drill_reports_program ON fire_drill_reports(program_id);
CREATE INDEX idx_fire_drill_reports_date ON fire_drill_reports(drill_date);
CREATE INDEX idx_fire_drill_reports_type ON fire_drill_reports(drill_type);
CREATE INDEX idx_fire_drill_reports_status ON fire_drill_reports(status);
