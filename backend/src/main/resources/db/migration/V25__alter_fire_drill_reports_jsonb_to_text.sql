-- V25__alter_fire_drill_reports_jsonb_to_text.sql
-- Convert route_performance_json from JSONB to TEXT for Hibernate compatibility

ALTER TABLE fire_drill_reports 
    ALTER COLUMN route_performance_json TYPE TEXT USING route_performance_json::TEXT;
