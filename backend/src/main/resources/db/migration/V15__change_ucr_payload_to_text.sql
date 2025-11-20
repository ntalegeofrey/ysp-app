-- Change payload_json from JSONB to TEXT to avoid Hibernate bytea issues
ALTER TABLE program_ucr_reports ALTER COLUMN payload_json TYPE TEXT USING payload_json::TEXT;
