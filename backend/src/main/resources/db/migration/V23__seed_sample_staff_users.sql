-- V23__seed_sample_staff_users.sql
-- Seed 10 sample users for quick Fire Plan / Program assignment testing.
-- These mirror what you would create via Admin Operations (no real passwords yet).

INSERT INTO users (email, password_hash, role, full_name, job_title, employee_number, enabled, must_change_password, created_at)
VALUES
  ('sarah.jones@test.com',       '!unset!', 'ADMIN',          'Sarah Jones',       'Regional Director',        '10234', true, true, NOW()),
  ('michael.brown@test.com',     '!unset!', 'ADMINISTRATOR',  'Michael Brown',     'Program Director',         '54821', true, true, NOW()),
  ('linda.wilson@test.com',      '!unset!', 'USER',           'Linda Wilson',      'Assistant Program Director','91572', true, true, NOW()),
  ('james.taylor@test.com',      '!unset!', 'USER',           'James Taylor',      'Shift Supervisor',         '36490', true, true, NOW()),
  ('patricia.martin@test.com',   '!unset!', 'USER',           'Patricia Martin',   'JJYDS I',                  '78320', true, true, NOW()),
  ('robert.thomas@test.com',     '!unset!', 'USER',           'Robert Thomas',     'JJYDS II',                 '20765', true, true, NOW()),
  ('jennifer.moore@test.com',    '!unset!', 'USER',           'Jennifer Moore',    'JJYDS III',                '63941', true, true, NOW()),
  ('david.jackson@test.com',     '!unset!', 'USER',           'David Jackson',     'Caseworker',               '85109', true, true, NOW()),
  ('elizabeth.white@test.com',   '!unset!', 'USER',           'Elizabeth White',   'Support Staff',            '49013', true, true, NOW()),
  ('christopher.harris@test.com','!unset!', 'USER',           'Christopher Harris','Relief Staff',             '72658', true, true, NOW())
ON CONFLICT (email) DO NOTHING;
