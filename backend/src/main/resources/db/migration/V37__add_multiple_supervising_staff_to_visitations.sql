-- Add support for multiple supervising staff per visitation
-- Changes the one-to-one relationship to many-to-many

-- Create join table for visitation supervising staff
CREATE TABLE visitation_supervising_staff (
    visitation_id BIGINT NOT NULL REFERENCES visitations(id) ON DELETE CASCADE,
    staff_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY (visitation_id, staff_id)
);

-- Create indexes for the join table
CREATE INDEX idx_visitation_supervising_staff_visitation ON visitation_supervising_staff(visitation_id);
CREATE INDEX idx_visitation_supervising_staff_staff ON visitation_supervising_staff(staff_id);

-- Migrate existing data from supervising_staff_id to the join table
INSERT INTO visitation_supervising_staff (visitation_id, staff_id)
SELECT id, supervising_staff_id
FROM visitations
WHERE supervising_staff_id IS NOT NULL;

-- Drop the old supervising_staff_id column (no longer needed)
ALTER TABLE visitations DROP COLUMN supervising_staff_id;

-- Add comment
COMMENT ON TABLE visitation_supervising_staff IS 'Many-to-many relationship between visitations and supervising staff members';
