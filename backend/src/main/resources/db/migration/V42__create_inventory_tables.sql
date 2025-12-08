-- Inventory Management Module Tables

-- 1. Main Inventory Items Table
CREATE TABLE inventory_items (
    id BIGSERIAL PRIMARY KEY,
    program_id BIGINT NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
    
    -- Item Details
    item_name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    
    -- Quantity Management
    current_quantity INTEGER NOT NULL DEFAULT 0,
    minimum_quantity INTEGER NOT NULL DEFAULT 0,
    unit_of_measurement VARCHAR(50) DEFAULT 'Units',
    
    -- Storage
    location VARCHAR(255),
    storage_zone VARCHAR(100),
    
    -- Status & Alerts
    status VARCHAR(50) DEFAULT 'GOOD',
    last_restocked_date TIMESTAMP,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT REFERENCES users(id),
    
    CONSTRAINT check_quantity CHECK (current_quantity >= 0),
    CONSTRAINT check_min_quantity CHECK (minimum_quantity >= 0)
);

CREATE INDEX idx_inventory_items_program ON inventory_items(program_id);
CREATE INDEX idx_inventory_items_category ON inventory_items(category);
CREATE INDEX idx_inventory_items_status ON inventory_items(status);
CREATE INDEX idx_inventory_items_program_category ON inventory_items(program_id, category);
CREATE INDEX idx_inventory_items_program_status ON inventory_items(program_id, status);

-- 2. Inventory Transactions (Log)
CREATE TABLE inventory_transactions (
    id BIGSERIAL PRIMARY KEY,
    program_id BIGINT NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
    inventory_item_id BIGINT NOT NULL REFERENCES inventory_items(id) ON DELETE CASCADE,
    
    -- Transaction Details
    transaction_type VARCHAR(50) NOT NULL,
    quantity INTEGER NOT NULL,
    quantity_before INTEGER NOT NULL,
    quantity_after INTEGER NOT NULL,
    
    -- Staff & Purpose
    staff_id BIGINT NOT NULL REFERENCES users(id),
    staff_name VARCHAR(255),
    purpose VARCHAR(100),
    recipient_department VARCHAR(255),
    notes TEXT,
    
    -- Metadata
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Optional: Link to requisition
    requisition_id BIGINT,
    
    CONSTRAINT check_quantity_change CHECK (quantity != 0)
);

CREATE INDEX idx_transactions_program ON inventory_transactions(program_id);
CREATE INDEX idx_transactions_item ON inventory_transactions(inventory_item_id);
CREATE INDEX idx_transactions_staff ON inventory_transactions(staff_id);
CREATE INDEX idx_transactions_date ON inventory_transactions(transaction_date DESC);
CREATE INDEX idx_transactions_type ON inventory_transactions(transaction_type);
CREATE INDEX idx_transactions_item_date ON inventory_transactions(inventory_item_id, transaction_date DESC);

-- 3. Inventory Requisitions
CREATE TABLE inventory_requisitions (
    id BIGSERIAL PRIMARY KEY,
    program_id BIGINT NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
    requisition_number VARCHAR(50) UNIQUE NOT NULL,
    
    -- Item Request Details
    item_name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    quantity_requested INTEGER NOT NULL,
    unit_of_measurement VARCHAR(50) DEFAULT 'Units',
    
    -- Priority & Justification
    priority VARCHAR(50) NOT NULL DEFAULT 'STANDARD',
    justification TEXT NOT NULL,
    additional_notes TEXT,
    
    -- Cost & Vendor
    estimated_cost DECIMAL(10, 2),
    preferred_vendor VARCHAR(255),
    
    -- Requester
    requested_by BIGINT NOT NULL REFERENCES users(id),
    requested_by_name VARCHAR(255),
    request_date DATE NOT NULL,
    
    -- Approval Workflow
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    reviewed_by BIGINT REFERENCES users(id),
    reviewed_by_name VARCHAR(255),
    review_date TIMESTAMP,
    review_notes TEXT,
    rejection_reason TEXT,
    
    -- Fulfillment
    fulfilled_date TIMESTAMP,
    actual_cost DECIMAL(10, 2),
    actual_vendor VARCHAR(255),
    inventory_item_id BIGINT REFERENCES inventory_items(id),
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT check_quantity_positive CHECK (quantity_requested > 0)
);

CREATE INDEX idx_requisitions_program ON inventory_requisitions(program_id);
CREATE INDEX idx_requisitions_status ON inventory_requisitions(status);
CREATE INDEX idx_requisitions_requester ON inventory_requisitions(requested_by);
CREATE INDEX idx_requisitions_date ON inventory_requisitions(request_date DESC);
CREATE INDEX idx_requisitions_priority ON inventory_requisitions(priority);
CREATE INDEX idx_requisitions_program_status ON inventory_requisitions(program_id, status);

-- 4. Inventory Audits
CREATE TABLE inventory_audits (
    id BIGSERIAL PRIMARY KEY,
    program_id BIGINT NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
    
    -- Audit Details
    audit_type VARCHAR(50) NOT NULL,
    audit_date DATE NOT NULL,
    audit_status VARCHAR(50) DEFAULT 'IN_PROGRESS',
    
    -- Auditor
    conducted_by BIGINT NOT NULL REFERENCES users(id),
    auditor_name VARCHAR(255),
    
    -- Summary
    total_items_audited INTEGER DEFAULT 0,
    discrepancies_found INTEGER DEFAULT 0,
    notes TEXT,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

CREATE INDEX idx_audits_program ON inventory_audits(program_id);
CREATE INDEX idx_audits_date ON inventory_audits(audit_date DESC);
CREATE INDEX idx_audits_status ON inventory_audits(audit_status);

-- 5. Inventory Audit Items
CREATE TABLE inventory_audit_items (
    id BIGSERIAL PRIMARY KEY,
    audit_id BIGINT NOT NULL REFERENCES inventory_audits(id) ON DELETE CASCADE,
    inventory_item_id BIGINT NOT NULL REFERENCES inventory_items(id) ON DELETE CASCADE,
    
    -- Audit Findings
    expected_quantity INTEGER NOT NULL,
    actual_quantity INTEGER NOT NULL,
    discrepancy INTEGER NOT NULL,
    
    -- Resolution
    discrepancy_reason VARCHAR(255),
    action_taken TEXT,
    resolved BOOLEAN DEFAULT FALSE,
    
    -- Metadata
    audited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_items_audit ON inventory_audit_items(audit_id);
CREATE INDEX idx_audit_items_inventory ON inventory_audit_items(inventory_item_id);

-- 6. Inventory Alerts
CREATE TABLE inventory_alerts (
    id BIGSERIAL PRIMARY KEY,
    program_id BIGINT NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
    inventory_item_id BIGINT NOT NULL REFERENCES inventory_items(id) ON DELETE CASCADE,
    
    -- Alert Details
    alert_type VARCHAR(50) NOT NULL,
    alert_level VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    
    -- Status
    status VARCHAR(50) DEFAULT 'ACTIVE',
    acknowledged_by BIGINT REFERENCES users(id),
    acknowledged_at TIMESTAMP,
    resolved_at TIMESTAMP,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_alerts_program ON inventory_alerts(program_id);
CREATE INDEX idx_alerts_item ON inventory_alerts(inventory_item_id);
CREATE INDEX idx_alerts_status ON inventory_alerts(status);
CREATE INDEX idx_alerts_level ON inventory_alerts(alert_level);
CREATE INDEX idx_alerts_program_status ON inventory_alerts(program_id, status);
