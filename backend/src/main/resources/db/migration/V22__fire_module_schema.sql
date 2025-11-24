-- V22__fire_module_schema.sql
-- Fire module schema: fire_plans, fire_drill_reports, floor_plans
-- Designed to be SAFE on existing databases: uses IF NOT EXISTS and does not drop or rename tables.

-- 1) Fire Plans: snapshot of current fire plan per program/date/shift
CREATE TABLE IF NOT EXISTS fire_plans (
    id                  BIGSERIAL PRIMARY KEY,
    program_id          BIGINT NOT NULL,
    generated_date      DATE NOT NULL,
    shift               VARCHAR(32),
    total_staff         INTEGER,
    total_residents     INTEGER,
    special_assignments INTEGER,
    primary_route       VARCHAR(255),
    secondary_route     VARCHAR(255),
    status              VARCHAR(32),
    staff_assignments_json JSONB,
    resident_status_json   JSONB,
    route_config_json      JSONB,
    created_at          TIMESTAMP,
    updated_at          TIMESTAMP
);

-- Ensure FK from fire_plans.program_id to programs.id
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE table_name = 'fire_plans'
          AND constraint_type = 'FOREIGN KEY'
          AND constraint_name = 'fk_fire_plans_program'
    ) THEN
        ALTER TABLE fire_plans
            ADD CONSTRAINT fk_fire_plans_program
            FOREIGN KEY (program_id) REFERENCES programs(id);
    END IF;
END $$;

-- 2) Fire Drill Reports: individual drill report records
CREATE TABLE IF NOT EXISTS fire_drill_reports (
    id                      BIGSERIAL PRIMARY KEY,
    program_id              BIGINT NOT NULL,
    drill_date              DATE NOT NULL,
    drill_time              TIME,
    drill_type              VARCHAR(64),
    shift                   VARCHAR(64),
    shift_supervisor        VARCHAR(255),
    report_completed_by     VARCHAR(255),
    total_evacuation_time   VARCHAR(64),
    weather_conditions      VARCHAR(64),
    total_staff_present     INTEGER,
    total_residents_present INTEGER,
    overall_performance     TEXT,
    issues_identified       TEXT,
    recommendations         TEXT,
    route_performance_json  JSONB,
    certification_complete  BOOLEAN,
    digital_signature       VARCHAR(255),
    signature_datetime      TIMESTAMP,
    status                  VARCHAR(64),
    created_at              TIMESTAMP,
    updated_at              TIMESTAMP
);

-- Ensure FK from fire_drill_reports.program_id to programs.id
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE table_name = 'fire_drill_reports'
          AND constraint_type = 'FOREIGN KEY'
          AND constraint_name = 'fk_fire_drill_reports_program'
    ) THEN
        ALTER TABLE fire_drill_reports
            ADD CONSTRAINT fk_fire_drill_reports_program
            FOREIGN KEY (program_id) REFERENCES programs(id);
    END IF;
END $$;

-- 3) Floor Plans: metadata only, file_url used until object storage bucket is ready
CREATE TABLE IF NOT EXISTS floor_plans (
    id                  BIGSERIAL PRIMARY KEY,
    program_id          BIGINT NOT NULL,
    name                VARCHAR(255) NOT NULL,
    description         TEXT,
    file_url            VARCHAR(512),
    version             INTEGER DEFAULT 1,
    active              BOOLEAN DEFAULT TRUE,
    uploaded_by_user_id BIGINT,
    uploaded_at         TIMESTAMP,
    updated_at          TIMESTAMP
);

-- Ensure FK from floor_plans.program_id to programs.id
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE table_name = 'floor_plans'
          AND constraint_type = 'FOREIGN KEY'
          AND constraint_name = 'fk_floor_plans_program'
    ) THEN
        ALTER TABLE floor_plans
            ADD CONSTRAINT fk_floor_plans_program
            FOREIGN KEY (program_id) REFERENCES programs(id);
    END IF;
END $$;

-- Optional: when users table is stable, you can add a FK for uploaded_by_user_id
-- DO $$
-- BEGIN
--     IF NOT EXISTS (
--         SELECT 1 FROM information_schema.table_constraints
--         WHERE table_name = 'floor_plans'
--           AND constraint_type = 'FOREIGN KEY'
--           AND constraint_name = 'fk_floor_plans_uploaded_by_user'
--     ) THEN
--         ALTER TABLE floor_plans
--             ADD CONSTRAINT fk_floor_plans_uploaded_by_user
--             FOREIGN KEY (uploaded_by_user_id) REFERENCES users(id);
--     END IF;
-- END $$;
