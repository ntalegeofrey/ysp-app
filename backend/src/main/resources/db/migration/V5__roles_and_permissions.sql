-- Roles and permissions
CREATE TABLE roles (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  description VARCHAR(255),
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE role_permissions (
  id BIGSERIAL PRIMARY KEY,
  role_id BIGINT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  module VARCHAR(100) NOT NULL,
  access VARCHAR(20) NOT NULL,
  UNIQUE(role_id, module)
);

-- Seed initial roles
INSERT INTO roles(name, description) VALUES
 ('admin','Administrator'),
 ('supervisor','Supervisor'),
 ('jjyds_iii','JJYDS III'),
 ('jjyds_ii','JJYDS II'),
 ('jjyds_i','JJYDS I'),
 ('clinical','Clinical'),
 ('caseworker','Caseworker'),
 ('support','Support')
ON CONFLICT (name) DO NOTHING;
