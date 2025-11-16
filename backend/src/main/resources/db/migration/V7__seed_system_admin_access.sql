-- Seed System Admin module access and ensure primary admin user has admin role

-- Ensure 'admin' role exists
INSERT INTO roles(name, description)
VALUES ('admin','Administrator')
ON CONFLICT (name) DO NOTHING;

-- Grant FULL access on 'System Admin' module to 'admin' role
INSERT INTO role_permissions(role_id, module, access)
SELECT r.id, 'System Admin', 'FULL'
FROM roles r
WHERE r.name = 'admin'
ON CONFLICT (role_id, module) DO UPDATE SET access = EXCLUDED.access;

-- Ensure the specified user is an admin
UPDATE users SET role = 'admin'
WHERE LOWER(email) = LOWER('ntalegeofrey@gmail.com');
