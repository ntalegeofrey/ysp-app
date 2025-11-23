-- V21__regions_and_staff_registry.sql
-- Create regions table, seed fixed regions, extend programs with region_id and program_phone,
-- rename program_assignments to staff_registry and add staff fields,
-- and extend program_residents with date_of_birth.

-- 1) Create regions table
CREATE TABLE IF NOT EXISTS regions (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(64) NOT NULL UNIQUE,

    address_line   VARCHAR(255) NOT NULL,
    county         VARCHAR(128) NOT NULL,
    state          VARCHAR(32)  NOT NULL,
    phone          VARCHAR(64)  NOT NULL,
    email          VARCHAR(255) NOT NULL,

    regional_director_first_name VARCHAR(128),
    regional_director_last_name  VARCHAR(128),
    regional_director_email      VARCHAR(255),

    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
);

-- Seed canonical regions (id values will be auto-generated)
INSERT INTO regions (name, address_line, county, state, phone, email)
VALUES
  ('Central',
   '288 Lyman Street, Westborough, MA 01581',
   'Worcester County',
   'MA',
   '508-792-7611',
   'central@test.com'),
  ('Metro',
   '425 Harvard Street, Dorchester, MA 02124',
   'Suffolk County',
   'MA',
   '617-740-0100',
   'metro@test.com'),
  ('Northeast',
   '33 Gregory Street, Middleton, MA 01949',
   'Essex County',
   'MA',
   '978-716-1100',
   'northeast@test.com'),
  ('Southeast',
   '60 Hodges Avenue, Taunton, MA 02780',
   'Bristol County',
   'MA',
   '508-828-3800',
   'southeast@test.com'),
  ('Western',
   '280 Tinkham Road, Springfield, MA 01129',
   'Hampden County',
   'MA',
   '413-783-0781',
   'western@test.com')
ON CONFLICT (name) DO NOTHING;

-- 2) Extend programs table with region_id and program_phone
ALTER TABLE programs
    ADD COLUMN IF NOT EXISTS region_id BIGINT NULL,
    ADD COLUMN IF NOT EXISTS program_phone VARCHAR(64);

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_type = 'FOREIGN KEY'
          AND table_name = 'programs'
          AND constraint_name = 'fk_program_region'
    ) THEN
        ALTER TABLE programs
            ADD CONSTRAINT fk_program_region
            FOREIGN KEY (region_id) REFERENCES regions(id);
    END IF;
END $$;

-- 3) Rename program_assignments to staff_registry and add staff fields
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_name = 'program_assignments'
    ) AND NOT EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_name = 'staff_registry'
    ) THEN
        ALTER TABLE program_assignments RENAME TO staff_registry;
    END IF;
END $$;

-- Add columns to staff_registry (id column becomes staff_id conceptually)
ALTER TABLE staff_registry
    ADD COLUMN IF NOT EXISTS employee_id VARCHAR(16),
    ADD COLUMN IF NOT EXISTS first_name  VARCHAR(128),
    ADD COLUMN IF NOT EXISTS last_name   VARCHAR(128),
    ADD COLUMN IF NOT EXISTS start_date  DATE,
    ADD COLUMN IF NOT EXISTS title       VARCHAR(128),
    ADD COLUMN IF NOT EXISTS gender      VARCHAR(32),
    ADD COLUMN IF NOT EXISTS status      VARCHAR(32),
    ADD COLUMN IF NOT EXISTS category    VARCHAR(64),
    ADD COLUMN IF NOT EXISTS notes       TEXT;

-- 4) Extend program_residents with date_of_birth
ALTER TABLE program_residents
    ADD COLUMN IF NOT EXISTS date_of_birth DATE;
