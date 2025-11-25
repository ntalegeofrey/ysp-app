-- Add floor plan configuration fields to fire_plans table

ALTER TABLE fire_plans 
ADD COLUMN floor_plan_image_url TEXT,
ADD COLUMN floor_plan_scale VARCHAR(50),
ADD COLUMN floor_plan_total_exits INTEGER,
ADD COLUMN floor_plan_assembly_points INTEGER,
ADD COLUMN floor_plan_primary_route_color VARCHAR(20),
ADD COLUMN floor_plan_secondary_route_color VARCHAR(20),
ADD COLUMN floor_plan_assembly_point_color VARCHAR(20);

-- Add comments
COMMENT ON COLUMN fire_plans.floor_plan_image_url IS 'Path to uploaded floor plan image';
COMMENT ON COLUMN fire_plans.floor_plan_scale IS 'Floor plan scale (e.g., 1:100)';
COMMENT ON COLUMN fire_plans.floor_plan_total_exits IS 'Total number of exits in the facility';
COMMENT ON COLUMN fire_plans.floor_plan_assembly_points IS 'Number of designated assembly points';
COMMENT ON COLUMN fire_plans.floor_plan_primary_route_color IS 'Color for primary exit routes (hex)';
COMMENT ON COLUMN fire_plans.floor_plan_secondary_route_color IS 'Color for secondary exit routes (hex)';
COMMENT ON COLUMN fire_plans.floor_plan_assembly_point_color IS 'Color for assembly point markers (hex)';
