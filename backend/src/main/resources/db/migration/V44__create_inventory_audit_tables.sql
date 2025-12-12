-- Create inventory_audits table (if not exists)
CREATE TABLE IF NOT EXISTS inventory_audits (
    id BIGSERIAL PRIMARY KEY,
    program_id BIGINT NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
    audit_date DATE NOT NULL,
    conducted_by BIGINT NOT NULL REFERENCES users(id),
    auditor_name VARCHAR(255),
    total_items_audited INTEGER DEFAULT 0,
    discrepancies_found INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(program_id, audit_date)
);

-- Create inventory_audit_items table (if not exists)
CREATE TABLE IF NOT EXISTS inventory_audit_items (
    id BIGSERIAL PRIMARY KEY,
    audit_id BIGINT NOT NULL REFERENCES inventory_audits(id) ON DELETE CASCADE,
    inventory_item_id BIGINT NOT NULL REFERENCES inventory_items(id) ON DELETE CASCADE,
    expected_quantity INTEGER NOT NULL,
    actual_quantity INTEGER NOT NULL,
    discrepancy INTEGER NOT NULL,
    discrepancy_reason TEXT
);

-- Create indexes for better query performance (if not exists)
CREATE INDEX IF NOT EXISTS idx_inventory_audits_program_date ON inventory_audits(program_id, audit_date DESC);
CREATE INDEX IF NOT EXISTS idx_inventory_audit_items_audit ON inventory_audit_items(audit_id);
