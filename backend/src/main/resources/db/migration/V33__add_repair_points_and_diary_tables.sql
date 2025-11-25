-- Add additional fields to repair_interventions for complete repair tracking
ALTER TABLE repair_interventions
    ADD COLUMN repair_duration_days INTEGER,
    ADD COLUMN repair_start_date DATE,
    ADD COLUMN repair_end_date DATE,
    ADD COLUMN points_suspended BOOLEAN DEFAULT true,
    ADD COLUMN pd_review_status VARCHAR(50) DEFAULT 'pending',
    ADD COLUMN pd_review_comments TEXT,
    ADD COLUMN clinical_review_status VARCHAR(50) DEFAULT 'pending',
    ADD COLUMN clinical_review_comments TEXT;

-- Create points_diary_cards table for weekly points tracking
CREATE TABLE points_diary_cards (
    id BIGSERIAL PRIMARY KEY,
    program_id BIGINT NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
    resident_id BIGINT NOT NULL REFERENCES program_residents(id) ON DELETE CASCADE,
    
    -- Week tracking
    week_start_date DATE NOT NULL,
    week_end_date DATE NOT NULL,
    starting_points INTEGER DEFAULT 0,
    
    -- Daily points by shift (stored as JSON for flexibility)
    -- Structure: { "2025-11-25": { "shift1": 18, "shift2": 6, "shift3": 8, "total": 32, "repair": "R3" }, ... }
    daily_points_json TEXT,
    
    -- Week summary
    total_points_earned INTEGER DEFAULT 0,
    current_balance INTEGER DEFAULT 0,
    
    -- Status and Audit
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Ensure one card per resident per week
    UNIQUE(resident_id, week_start_date)
);

-- Create points_redemptions table for tracking point redemptions
CREATE TABLE points_redemptions (
    id BIGSERIAL PRIMARY KEY,
    program_id BIGINT NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
    resident_id BIGINT NOT NULL REFERENCES program_residents(id) ON DELETE CASCADE,
    diary_card_id BIGINT REFERENCES points_diary_cards(id) ON DELETE SET NULL,
    
    -- Redemption details
    redemption_date DATE NOT NULL,
    points_redeemed INTEGER NOT NULL,
    reward_item VARCHAR(255) NOT NULL,
    custom_item BOOLEAN DEFAULT false,
    
    -- Approval tracking
    approved_by_staff_id BIGINT,
    approved_by_staff_name VARCHAR(255),
    approved_at TIMESTAMP,
    approval_status VARCHAR(50) DEFAULT 'pending',
    approval_comments TEXT,
    
    -- Audit
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_diary_cards_program ON points_diary_cards(program_id);
CREATE INDEX idx_diary_cards_resident ON points_diary_cards(resident_id);
CREATE INDEX idx_diary_cards_week ON points_diary_cards(week_start_date, week_end_date);
CREATE INDEX idx_redemptions_program ON points_redemptions(program_id);
CREATE INDEX idx_redemptions_resident ON points_redemptions(resident_id);
CREATE INDEX idx_redemptions_date ON points_redemptions(redemption_date DESC);
CREATE INDEX idx_redemptions_status ON points_redemptions(approval_status);

-- Add comments for documentation
COMMENT ON TABLE points_diary_cards IS 'Stores weekly points diary cards for residents';
COMMENT ON TABLE points_redemptions IS 'Tracks points redemptions by residents';
COMMENT ON COLUMN repair_interventions.repair_duration_days IS 'Number of days the repair lasts';
COMMENT ON COLUMN repair_interventions.points_suspended IS 'Whether point accrual is suspended during this repair';
