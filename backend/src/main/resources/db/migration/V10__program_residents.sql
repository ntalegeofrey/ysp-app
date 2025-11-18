-- Create table for residents attached to programs
CREATE TABLE IF NOT EXISTS program_residents (
    id BIGSERIAL PRIMARY KEY,
    program_id BIGINT NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
    resident_id VARCHAR(100),
    first_name VARCHAR(200),
    last_name VARCHAR(200),
    room VARCHAR(100),
    status VARCHAR(100),
    advocate VARCHAR(200),
    admission_date DATE
);

-- Avoid duplicate same resident_id within a program (resident_id may be null; Postgres allows multiple NULLs)
CREATE UNIQUE INDEX IF NOT EXISTS uq_program_resident_per_program ON program_residents(program_id, resident_id);
