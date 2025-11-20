-- Add detailed UCR fields instead of relying on JSONB
-- This makes the data queryable, type-safe, and easier to work with

-- Security Equipment fields
ALTER TABLE program_ucr_reports ADD COLUMN IF NOT EXISTS sec_equip_cameras TEXT;
ALTER TABLE program_ucr_reports ADD COLUMN IF NOT EXISTS sec_equip_doors TEXT;
ALTER TABLE program_ucr_reports ADD COLUMN IF NOT EXISTS sec_equip_alarms TEXT;
ALTER TABLE program_ucr_reports ADD COLUMN IF NOT EXISTS sec_equip_comms TEXT;
ALTER TABLE program_ucr_reports ADD COLUMN IF NOT EXISTS sec_equip_lighting TEXT;
ALTER TABLE program_ucr_reports ADD COLUMN IF NOT EXISTS sec_equip_other TEXT;

-- Notifications
ALTER TABLE program_ucr_reports ADD COLUMN IF NOT EXISTS notif_supervisor BOOLEAN;
ALTER TABLE program_ucr_reports ADD COLUMN IF NOT EXISTS notif_maintenance BOOLEAN;
ALTER TABLE program_ucr_reports ADD COLUMN IF NOT EXISTS notif_security BOOLEAN;

-- Hardware and searches
ALTER TABLE program_ucr_reports ADD COLUMN IF NOT EXISTS hardware_secure BOOLEAN;
ALTER TABLE program_ucr_reports ADD COLUMN IF NOT EXISTS hardware_comments TEXT;
ALTER TABLE program_ucr_reports ADD COLUMN IF NOT EXISTS searches_completed BOOLEAN;
ALTER TABLE program_ucr_reports ADD COLUMN IF NOT EXISTS searches_start_time VARCHAR(10);
ALTER TABLE program_ucr_reports ADD COLUMN IF NOT EXISTS searches_end_time VARCHAR(10);
ALTER TABLE program_ucr_reports ADD COLUMN IF NOT EXISTS fire_drills_completed BOOLEAN;
ALTER TABLE program_ucr_reports ADD COLUMN IF NOT EXISTS fire_drills_comments TEXT;

-- Admin offices
ALTER TABLE program_ucr_reports ADD COLUMN IF NOT EXISTS admin_office_secure BOOLEAN;
ALTER TABLE program_ucr_reports ADD COLUMN IF NOT EXISTS admin_office_comments TEXT;
ALTER TABLE program_ucr_reports ADD COLUMN IF NOT EXISTS admin_supplies_stocked BOOLEAN;
ALTER TABLE program_ucr_reports ADD COLUMN IF NOT EXISTS admin_supplies_comments TEXT;

-- Facility infrastructure
ALTER TABLE program_ucr_reports ADD COLUMN IF NOT EXISTS facility_hvac BOOLEAN;
ALTER TABLE program_ucr_reports ADD COLUMN IF NOT EXISTS facility_hvac_comments TEXT;
ALTER TABLE program_ucr_reports ADD COLUMN IF NOT EXISTS facility_plumbing BOOLEAN;
ALTER TABLE program_ucr_reports ADD COLUMN IF NOT EXISTS facility_plumbing_comments TEXT;
ALTER TABLE program_ucr_reports ADD COLUMN IF NOT EXISTS facility_electrical BOOLEAN;
ALTER TABLE program_ucr_reports ADD COLUMN IF NOT EXISTS facility_electrical_comments TEXT;

-- Room searches (keep as JSONB array since it's dynamic)
-- payload_json can still store the full form data as backup/legacy

-- Additional comments
ALTER TABLE program_ucr_reports ADD COLUMN IF NOT EXISTS additional_comments TEXT;
