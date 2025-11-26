-- Add daily_redemptions_json column to points_diary_cards table
ALTER TABLE points_diary_cards
ADD COLUMN daily_redemptions_json TEXT;

-- Add comment
COMMENT ON COLUMN points_diary_cards.daily_redemptions_json IS 'JSON storing daily redemptions per day (0-6) for the week';
