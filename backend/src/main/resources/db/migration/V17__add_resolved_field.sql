-- Add resolved field to track if issues have been resolved
ALTER TABLE program_ucr_reports ADD COLUMN resolved BOOLEAN DEFAULT FALSE;
ALTER TABLE program_ucr_reports ADD COLUMN resolved_at TIMESTAMP;
ALTER TABLE program_ucr_reports ADD COLUMN resolved_by BIGINT;

CREATE INDEX idx_ucr_resolved ON program_ucr_reports(program_id, resolved, report_date DESC);
