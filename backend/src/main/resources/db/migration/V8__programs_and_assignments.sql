-- Create programs table
CREATE TABLE IF NOT EXISTS programs (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  program_type VARCHAR(255),
  capacity INTEGER,
  status VARCHAR(64),
  description TEXT,
  street VARCHAR(255),
  city VARCHAR(255),
  state VARCHAR(64),
  zip VARCHAR(32),
  county VARCHAR(255),
  operating_hours VARCHAR(255),
  security_level VARCHAR(255),
  target_population VARCHAR(255),
  expected_opening_date DATE,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create program_assignments table
CREATE TABLE IF NOT EXISTS program_assignments (
  id BIGSERIAL PRIMARY KEY,
  program_id BIGINT NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  user_id BIGINT,
  user_email VARCHAR(320),
  role_type VARCHAR(64)
);

-- Updated-at trigger (idempotent)
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END; $$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'programs_set_updated_at'
  ) THEN
    CREATE TRIGGER programs_set_updated_at
    BEFORE UPDATE ON programs
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
  END IF;
END $$;
