-- Seed test data for incident_reports and shakedown_reports
-- Assuming program ID 1 exists (adjust if needed)

-- Insert sample incident reports
INSERT INTO incident_reports (
    program_id, incident_date, incident_time, shift, area_of_incident, nature_of_incident,
    residents_involved, staff_involved, detailed_description,
    report_completed_by, report_completed_by_email, signature_datetime,
    certification_complete, status, priority, staff_population, youth_population
) VALUES 
(
    1, 
    CURRENT_DATE - INTERVAL '2 days', 
    '14:30:00', 
    'Day (7:00 AM - 3:00 PM)', 
    'Recreation Room', 
    'Youth on Youth Assault',
    'John Doe, Jane Smith',
    'Officer Williams, Supervisor Johnson',
    'Incident occurred during recreational period. Two residents engaged in physical altercation. Staff immediately intervened and separated the individuals. No serious injuries reported. Both residents were escorted to their rooms for de-escalation.',
    'Officer J. Williams',
    'j.williams@facility.local',
    CURRENT_TIMESTAMP - INTERVAL '2 days',
    true,
    'Submitted',
    'Critical',
    12,
    45
),
(
    1, 
    CURRENT_DATE - INTERVAL '5 days', 
    '11:15:00', 
    'Day (7:00 AM - 3:00 PM)', 
    'Unit A', 
    'Contraband found',
    'Michael Anderson',
    'Staff Member Davis',
    'During routine room inspection, unauthorized cell phone was discovered hidden in mattress. Item was confiscated and logged. Resident counseled about facility rules. Parents notified.',
    'Staff Davis',
    's.davis@facility.local',
    CURRENT_TIMESTAMP - INTERVAL '5 days',
    true,
    'Submitted',
    'High',
    10,
    42
),
(
    1, 
    CURRENT_DATE - INTERVAL '7 days', 
    '09:30:00', 
    'Day (7:00 AM - 3:00 PM)', 
    'Classroom 1', 
    'Damage to Property',
    'Robert Martinez',
    'Teacher Brown, Officer Clark',
    'Resident became agitated during class and threw desk, causing damage to desk and classroom wall. Staff implemented de-escalation techniques. Resident calmed down after 15 minutes. Maintenance notified for repairs.',
    'Teacher M. Brown',
    'm.brown@facility.local',
    CURRENT_TIMESTAMP - INTERVAL '7 days',
    true,
    'Submitted',
    'High',
    8,
    38
);

-- Insert sample shakedown reports
INSERT INTO shakedown_reports (
    program_id, shakedown_date, shift,
    common_area_searches, school_area_searches, resident_room_searches,
    equipment_condition, additional_comments,
    report_completed_by, report_completed_by_email, signature_datetime,
    certification_complete, status, contraband_found
) VALUES 
(
    1,
    CURRENT_DATE - INTERVAL '1 day',
    'Day (7:00 AM - 3:00 PM)',
    '[{"area":"Dining Hall","staff":"Officer Martinez","contrabandFound":"No","comments":"All clear"},{"area":"Recreation Room","staff":"Officer Lee","contrabandFound":"No","comments":"No issues found"}]',
    '[{"area":"Classroom 1","staff":"Teacher Davis","contrabandFound":"No","comments":"All clear"},{"area":"Gymnasium","staff":"Coach Williams","contrabandFound":"No","comments":"No contraband"}]',
    '[{"unit":"Unit A","room":"A12","staff":"Officer Johnson","result":"No contraband","comments":"Room in good condition"},{"unit":"Unit B","room":"B05","staff":"Officer Brown","result":"No contraband","comments":"All clear"}]',
    '{"cuffs":"Good","waistbands":"Good","radios":"Fair","shackles":"Good","keys":"Good","flashlights":"Good"}',
    'Routine shakedown completed without incident. All areas inspected and found to be in compliance.',
    'Supervisor K. Johnson',
    'k.johnson@facility.local',
    CURRENT_TIMESTAMP - INTERVAL '1 day',
    true,
    'Submitted',
    false
),
(
    1,
    CURRENT_DATE - INTERVAL '4 days',
    'Evening (3:00 PM - 11:00 PM)',
    '[{"area":"Dining Hall","staff":"Officer White","contrabandFound":"No","comments":"Clean"},{"area":"Common Area","staff":"Officer Green","contrabandFound":"No","comments":"No issues"}]',
    '[{"area":"Library","staff":"Librarian Adams","contrabandFound":"No","comments":"All books accounted for"}]',
    '[{"unit":"Unit A","room":"A08","staff":"Officer Taylor","result":"Contraband found","comments":"Unauthorized snacks found in locker"},{"unit":"Unit C","room":"C14","staff":"Officer Wilson","result":"No contraband","comments":"Clean"}]',
    '{"cuffs":"Good","waistbands":"Good","radios":"Good","shackles":"Fair","keys":"Good","flashlights":"Poor"}',
    'Minor contraband (snacks) found in one room. Item confiscated and logged. Flashlights need replacement.',
    'Supervisor R. Taylor',
    'r.taylor@facility.local',
    CURRENT_TIMESTAMP - INTERVAL '4 days',
    true,
    'Submitted',
    true
);

COMMENT ON TABLE incident_reports IS 'Updated with seed data for testing';
COMMENT ON TABLE shakedown_reports IS 'Updated with seed data for testing';
