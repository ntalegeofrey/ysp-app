-- Add user profile fields
ALTER TABLE users
  ADD COLUMN full_name VARCHAR(255),
  ADD COLUMN job_title VARCHAR(255);
