CREATE TABLE IF NOT EXISTS program_ucr_notifications (
    id BIGSERIAL PRIMARY KEY,
    program_id BIGINT NOT NULL,
    ucr_report_id BIGINT NOT NULL,

    alert_status VARCHAR(32) NOT NULL,
    issue_title VARCHAR(255) NOT NULL,
    issue_summary TEXT,

    issue_last_reported_at TIMESTAMP NULL,
    issue_last_reported_by VARCHAR(255),
    issue_occurrence_count INTEGER,

    issue_category VARCHAR(128) NOT NULL,
    priority_level VARCHAR(32) NOT NULL,

    subject_line VARCHAR(512) NOT NULL,
    additional_comments TEXT,
    notified_to_emails TEXT,

    notification_channel VARCHAR(32) NOT NULL,
    sent_at TIMESTAMP NULL,

    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,

    CONSTRAINT fk_pun_program FOREIGN KEY (program_id) REFERENCES programs(id),
    CONSTRAINT fk_pun_ucr FOREIGN KEY (ucr_report_id) REFERENCES program_ucr_reports(id)
);
