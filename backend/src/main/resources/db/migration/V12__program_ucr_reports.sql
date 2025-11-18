-- UCR reports table per program
CREATE TABLE IF NOT EXISTS program_ucr_reports (
  id BIGSERIAL PRIMARY KEY,
  program_id BIGINT NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  report_date DATE NOT NULL,
  shift VARCHAR(50),
  reporter_name VARCHAR(200),
  status VARCHAR(50),
  issues_summary TEXT,
  payload_json JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_program_ucr_reports_program ON program_ucr_reports(program_id);
CREATE INDEX IF NOT EXISTS idx_program_ucr_reports_date ON program_ucr_reports(report_date);
