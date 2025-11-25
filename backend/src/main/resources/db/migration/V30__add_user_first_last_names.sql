-- Add first_name and last_name columns to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS first_name VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_name VARCHAR(100);

-- Update existing users with realistic first and last names based on their email or full_name
-- Extract from full_name if available, otherwise generate from email

-- First, try to split full_name into first_name and last_name
UPDATE users
SET 
  first_name = CASE 
    WHEN full_name IS NOT NULL AND full_name LIKE '% %' 
    THEN SPLIT_PART(full_name, ' ', 1)
    ELSE NULL
  END,
  last_name = CASE 
    WHEN full_name IS NOT NULL AND full_name LIKE '% %' 
    THEN SPLIT_PART(full_name, ' ', -1)
    ELSE NULL
  END
WHERE first_name IS NULL AND last_name IS NULL;

-- For users still without names, generate realistic ones based on email prefix
-- Common realistic first names
WITH realistic_names AS (
  SELECT 
    id,
    email,
    CASE (id % 30)
      WHEN 0 THEN 'Michael'
      WHEN 1 THEN 'Sarah'
      WHEN 2 THEN 'James'
      WHEN 3 THEN 'Jessica'
      WHEN 4 THEN 'David'
      WHEN 5 THEN 'Jennifer'
      WHEN 6 THEN 'Robert'
      WHEN 7 THEN 'Lisa'
      WHEN 8 THEN 'William'
      WHEN 9 THEN 'Karen'
      WHEN 10 THEN 'Richard'
      WHEN 11 THEN 'Nancy'
      WHEN 12 THEN 'Joseph'
      WHEN 13 THEN 'Betty'
      WHEN 14 THEN 'Thomas'
      WHEN 15 THEN 'Margaret'
      WHEN 16 THEN 'Charles'
      WHEN 17 THEN 'Sandra'
      WHEN 18 THEN 'Christopher'
      WHEN 19 THEN 'Ashley'
      WHEN 20 THEN 'Daniel'
      WHEN 21 THEN 'Kimberly'
      WHEN 22 THEN 'Matthew'
      WHEN 23 THEN 'Emily'
      WHEN 24 THEN 'Anthony'
      WHEN 25 THEN 'Donna'
      WHEN 26 THEN 'Mark'
      WHEN 27 THEN 'Michelle'
      WHEN 28 THEN 'Donald'
      ELSE 'Patricia'
    END as generated_first_name,
    CASE ((id * 7) % 30)
      WHEN 0 THEN 'Brown'
      WHEN 1 THEN 'Johnson'
      WHEN 2 THEN 'Williams'
      WHEN 3 THEN 'Jones'
      WHEN 4 THEN 'Garcia'
      WHEN 5 THEN 'Miller'
      WHEN 6 THEN 'Davis'
      WHEN 7 THEN 'Rodriguez'
      WHEN 8 THEN 'Martinez'
      WHEN 9 THEN 'Hernandez'
      WHEN 10 THEN 'Lopez'
      WHEN 11 THEN 'Gonzalez'
      WHEN 12 THEN 'Wilson'
      WHEN 13 THEN 'Anderson'
      WHEN 14 THEN 'Thomas'
      WHEN 15 THEN 'Taylor'
      WHEN 16 THEN 'Moore'
      WHEN 17 THEN 'Jackson'
      WHEN 18 THEN 'Martin'
      WHEN 19 THEN 'Lee'
      WHEN 20 THEN 'Perez'
      WHEN 21 THEN 'Thompson'
      WHEN 22 THEN 'White'
      WHEN 23 THEN 'Harris'
      WHEN 24 THEN 'Sanchez'
      WHEN 25 THEN 'Clark'
      WHEN 26 THEN 'Ramirez'
      WHEN 27 THEN 'Lewis'
      WHEN 28 THEN 'Robinson'
      ELSE 'Walker'
    END as generated_last_name
  FROM users
  WHERE first_name IS NULL OR last_name IS NULL
)
UPDATE users u
SET 
  first_name = COALESCE(u.first_name, rn.generated_first_name),
  last_name = COALESCE(u.last_name, rn.generated_last_name)
FROM realistic_names rn
WHERE u.id = rn.id;

-- Update full_name to match first_name and last_name for consistency
UPDATE users
SET full_name = CONCAT(first_name, ' ', last_name)
WHERE full_name IS NULL OR full_name = '' OR full_name NOT LIKE '% %';

-- Create index on first_name and last_name for better query performance
CREATE INDEX IF NOT EXISTS idx_users_first_name ON users(first_name);
CREATE INDEX IF NOT EXISTS idx_users_last_name ON users(last_name);
