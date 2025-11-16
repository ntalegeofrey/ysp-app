-- Add employee number to users
ALTER TABLE users
  ADD COLUMN employee_number VARCHAR(100);
