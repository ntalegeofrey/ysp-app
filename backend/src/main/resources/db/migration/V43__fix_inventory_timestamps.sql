-- Fix timestamp columns to use TIMESTAMPTZ for proper timezone handling with JPA Instant

-- Fix inventory_items timestamps
ALTER TABLE inventory_items 
    ALTER COLUMN last_restocked_date TYPE TIMESTAMPTZ,
    ALTER COLUMN created_at TYPE TIMESTAMPTZ,
    ALTER COLUMN updated_at TYPE TIMESTAMPTZ;

-- Fix inventory_transactions timestamps
ALTER TABLE inventory_transactions 
    ALTER COLUMN transaction_date TYPE TIMESTAMPTZ;

-- Fix inventory_requisitions timestamps
ALTER TABLE inventory_requisitions 
    ALTER COLUMN review_date TYPE TIMESTAMPTZ,
    ALTER COLUMN fulfilled_date TYPE TIMESTAMPTZ,
    ALTER COLUMN created_at TYPE TIMESTAMPTZ,
    ALTER COLUMN updated_at TYPE TIMESTAMPTZ;
