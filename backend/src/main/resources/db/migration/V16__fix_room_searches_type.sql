-- Change room_searches from JSONB to TEXT to match entity definition
ALTER TABLE program_ucr_reports ALTER COLUMN room_searches TYPE TEXT USING room_searches::TEXT;
