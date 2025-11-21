-- Add region and director name fields to programs table
ALTER TABLE programs
  ADD COLUMN IF NOT EXISTS region VARCHAR(255),
  
  ADD COLUMN IF NOT EXISTS regional_admin_first_name VARCHAR(200),
  ADD COLUMN IF NOT EXISTS regional_admin_last_name VARCHAR(200),
  ADD COLUMN IF NOT EXISTS regional_admin_email VARCHAR(320),
  
  ADD COLUMN IF NOT EXISTS program_director_first_name VARCHAR(200),
  ADD COLUMN IF NOT EXISTS program_director_last_name VARCHAR(200),
  ADD COLUMN IF NOT EXISTS program_director_email VARCHAR(320),
  
  ADD COLUMN IF NOT EXISTS assistant_director_first_name VARCHAR(200),
  ADD COLUMN IF NOT EXISTS assistant_director_last_name VARCHAR(200),
  ADD COLUMN IF NOT EXISTS assistant_director_email VARCHAR(320);
