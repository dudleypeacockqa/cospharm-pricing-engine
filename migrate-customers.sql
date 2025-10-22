-- Add missing customer columns for production database
ALTER TABLE customers 
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS primary_contact_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS primary_contact_phone VARCHAR(50),
ADD COLUMN IF NOT EXISTS primary_contact_email VARCHAR(255),
ADD COLUMN IF NOT EXISTS accounts_contact_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS accounts_contact_phone VARCHAR(50),
ADD COLUMN IF NOT EXISTS accounts_contact_email VARCHAR(255),
ADD COLUMN IF NOT EXISTS account_manager VARCHAR(255),
ADD COLUMN IF NOT EXISTS credit_limit DECIMAL(10,2) DEFAULT 50000.00,
ADD COLUMN IF NOT EXISTS current_balance DECIMAL(10,2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS payment_due_date TIMESTAMP;

-- Update existing customers with sample data
UPDATE customers 
SET 
  address = '123 Pharmaceutical Ave, Windhoek, Namibia',
  primary_contact_name = 'John Doe',
  primary_contact_phone = '+264 61 234 5678',
  primary_contact_email = 'orders@customer.com.na',
  accounts_contact_name = 'Jane Smith',
  accounts_contact_phone = '+264 61 234 5679',
  accounts_contact_email = 'accounts@customer.com.na',
  account_manager = 'Sarah Williams',
  payment_due_date = DATE_ADD(CURDATE(), INTERVAL 30 DAY)
WHERE address IS NULL OR address = '';

