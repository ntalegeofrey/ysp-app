-- Create census table
CREATE TABLE census (
    id BIGSERIAL PRIMARY KEY,
    program_id BIGINT NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
    census_date DATE NOT NULL,
    shift VARCHAR(20) NOT NULL CHECK (shift IN ('MORNING', 'AFTERNOON', 'EVENING')),
    conducted_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    conductor_name VARCHAR(255),
    total_residents INTEGER NOT NULL DEFAULT 0,
    dys_count INTEGER NOT NULL DEFAULT 0,
    non_dys_count INTEGER NOT NULL DEFAULT 0,
    saved BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_census_per_shift UNIQUE (program_id, census_date, shift)
);

CREATE INDEX idx_census_program_date ON census(program_id, census_date DESC, created_at DESC);
CREATE INDEX idx_census_date_range ON census(program_id, census_date);

-- Create census_entry table
CREATE TABLE census_entry (
    id BIGSERIAL PRIMARY KEY,
    census_id BIGINT NOT NULL REFERENCES census(id) ON DELETE CASCADE,
    resident_id BIGINT NOT NULL REFERENCES program_residents(id) ON DELETE CASCADE,
    resident_name VARCHAR(255),
    status VARCHAR(20) NOT NULL CHECK (status IN ('DYS', 'NON_DYS')),
    comments TEXT
);

CREATE INDEX idx_census_entry_census ON census_entry(census_id);
CREATE INDEX idx_census_entry_resident ON census_entry(resident_id);
