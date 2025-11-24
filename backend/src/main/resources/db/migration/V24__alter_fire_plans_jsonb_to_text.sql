-- V24__alter_fire_plans_jsonb_to_text.sql
-- Alter fire_plans table to change JSONB columns to TEXT for Hibernate compatibility

-- Convert JSONB columns to TEXT
ALTER TABLE fire_plans 
    ALTER COLUMN staff_assignments_json TYPE TEXT USING staff_assignments_json::text,
    ALTER COLUMN resident_status_json TYPE TEXT USING resident_status_json::text,
    ALTER COLUMN route_config_json TYPE TEXT USING route_config_json::text;
