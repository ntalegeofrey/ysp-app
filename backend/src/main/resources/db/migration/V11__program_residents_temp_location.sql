-- Add temporary_location column to program_residents for discharge/temporary placement info
ALTER TABLE program_residents
ADD COLUMN IF NOT EXISTS temporary_location varchar(255);
