-- Drop and rebuild program_ucr_reports table with proper columns
DROP TABLE IF EXISTS program_ucr_reports CASCADE;

CREATE TABLE program_ucr_reports (
  id BIGSERIAL PRIMARY KEY,
  program_id BIGINT NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  staff_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
  
  -- Basic report info
  report_date DATE NOT NULL,
  shift_time VARCHAR(50),
  is_locked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  
  -- Security Equipment (6 items: radios, flashlights, metal detector, keys, first aid, desk computer)
  security_radios_status VARCHAR(50),
  security_radios_condition VARCHAR(50),
  security_radios_comments TEXT,
  
  security_flashlights_status VARCHAR(50),
  security_flashlights_condition VARCHAR(50),
  security_flashlights_comments TEXT,
  
  security_metal_detector_status VARCHAR(50),
  security_metal_detector_condition VARCHAR(50),
  security_metal_detector_comments TEXT,
  
  security_big_set_keys_status VARCHAR(50),
  security_big_set_keys_condition VARCHAR(50),
  security_big_set_keys_comments TEXT,
  
  security_first_aid_kits_status VARCHAR(50),
  security_first_aid_kits_condition VARCHAR(50),
  security_first_aid_kits_comments TEXT,
  
  security_desk_computer_status VARCHAR(50),
  security_desk_computer_condition VARCHAR(50),
  security_desk_computer_comments TEXT,
  
  -- Hardware and Searches
  hardware_secure_yes_no VARCHAR(20),
  hardware_secure_comments TEXT,
  
  searches_completed_yes_no VARCHAR(20),
  
  fire_drills_completed_yes_no VARCHAR(20),
  fire_drills_completed_comments TEXT,
  
  emergency_lighting_yes_no VARCHAR(20),
  emergency_lighting_comments TEXT,
  
  -- Notifications
  notifications_opposite_gender_yes_no VARCHAR(20),
  notifications_opposite_gender_condition VARCHAR(50),
  notifications_opposite_gender_comments TEXT,
  
  -- Admin Offices (2 items: meeting rooms, doors secure)
  admin_meeting_rooms_locked_status VARCHAR(50),
  admin_meeting_rooms_locked_condition VARCHAR(50),
  admin_meeting_rooms_locked_comments TEXT,
  
  admin_doors_secure_status VARCHAR(50),
  admin_doors_secure_condition VARCHAR(50),
  admin_doors_secure_comments TEXT,
  
  -- Facility Infrastructure (7 items)
  infra_back_door_status VARCHAR(50),
  infra_back_door_condition VARCHAR(50),
  infra_back_door_comments TEXT,
  
  infra_entrance_exit_doors_status VARCHAR(50),
  infra_entrance_exit_doors_condition VARCHAR(50),
  infra_entrance_exit_doors_comments TEXT,
  
  infra_smoke_detectors_status VARCHAR(50),
  infra_smoke_detectors_condition VARCHAR(50),
  infra_smoke_detectors_comments TEXT,
  
  infra_windows_secure_status VARCHAR(50),
  infra_windows_secure_condition VARCHAR(50),
  infra_windows_secure_comments TEXT,
  
  infra_laundry_area_status VARCHAR(50),
  infra_laundry_area_condition VARCHAR(50),
  infra_laundry_area_comments TEXT,
  
  infra_fire_extinguishers_status VARCHAR(50),
  infra_fire_extinguishers_condition VARCHAR(50),
  infra_fire_extinguishers_comments TEXT,
  
  infra_fire_alarm_status VARCHAR(50),
  infra_fire_alarm_condition VARCHAR(50),
  infra_fire_alarm_comments TEXT,
  
  -- Chore Workspace Clean (4 items)
  chore_workspace_clean_status VARCHAR(50),
  chore_workspace_clean_comments TEXT,
  
  chore_staff_bathroom_status VARCHAR(50),
  chore_staff_bathroom_comments TEXT,
  
  chore_dayroom_clean_status VARCHAR(50),
  chore_dayroom_clean_comments TEXT,
  
  chore_laundry_room_clean_status VARCHAR(50),
  chore_laundry_room_clean_comments TEXT,
  
  -- Room searches as JSONB array
  room_searches JSONB,
  
  -- Additional comments
  additional_comments TEXT
);

CREATE INDEX idx_program_ucr_reports_program ON program_ucr_reports(program_id);
CREATE INDEX idx_program_ucr_reports_date ON program_ucr_reports(report_date);
CREATE INDEX idx_program_ucr_reports_staff ON program_ucr_reports(staff_id);

-- Unique constraint: one report per program per date per shift
CREATE UNIQUE INDEX uq_program_ucr_date_shift ON program_ucr_reports(program_id, report_date, shift_time);

-- Updated-at trigger
CREATE OR REPLACE FUNCTION set_ucr_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END; $$ LANGUAGE plpgsql;

CREATE TRIGGER ucr_set_updated_at
BEFORE UPDATE ON program_ucr_reports
FOR EACH ROW EXECUTE FUNCTION set_ucr_updated_at();
