-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_provision_status ON provision_requests(status);
CREATE INDEX IF NOT EXISTS idx_provision_created_at ON provision_requests(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_status ON audits(status);
CREATE INDEX IF NOT EXISTS idx_audit_auditor ON audits(auditor_id);

-- Create default Super Admin user (password: admin123)
INSERT INTO users (id, username, email, password, first_name, last_name, role, status, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'admin',
  'admin@getshub.com',
  '$2b$12$LQv3c1yqBw2lm8QCMgM8iuU6hCYpEhO7YKBHZZKhQQCKK6nN5QzRy',
  'System',
  'Administrator',
  'SUPER_ADMIN',
  'ACTIVE',
  NOW(),
  NOW()
) ON CONFLICT (username) DO NOTHING;

-- Create sample Manager user (password: admin123)
INSERT INTO users (id, username, email, password, first_name, last_name, role, status, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'manager1',
  'manager1@getshub.com',
  '$2b$12$LQv3c1yqBw2lm8QCMgM8iuU6hCYpEhO7YKBHZZKhQQCKK6nN5QzRy',
  'Jane',
  'Manager',
  'MANAGER',
  'ACTIVE',
  NOW(),
  NOW()
) ON CONFLICT (username) DO NOTHING;

-- Create sample QA Auditor user (password: admin123)
INSERT INTO users (id, username, email, password, first_name, last_name, role, status, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'auditor1',
  'auditor1@getshub.com',
  '$2b$12$LQv3c1yqBw2lm8QCMgM8iuU6hCYpEhO7YKBHZZKhQQCKK6nN5QzRy',
  'John',
  'Auditor',
  'QA_AUDITOR',
  'ACTIVE',
  NOW(),
  NOW()
) ON CONFLICT (username) DO NOTHING;