# Running Database Migrations on Render

## Problem

The application is deployed and running at https://cospharm.financeflo.ai, but the database tables don't exist yet. This causes errors when trying to access Products, Customers, or Reports pages.

**Error Example:**
```
Failed query: select "id", "name", "barcode", "basePrice", "productDiscount", "bonusPattern", "category", "active", "createdAt", "updatedAt" from "products"
```

## Root Cause

The database migrations couldn't run from the development sandbox due to SSL/TLS connection issues between the sandbox and Render's PostgreSQL database in Frankfurt. The migrations need to run from within Render's infrastructure where the connection works properly.

## Solution: Run Migrations on Render

Follow these steps to initialize the database and populate it with sample data:

### Step 1: Access Render Dashboard

1. Go to https://dashboard.render.com
2. Log in to your account
3. Find your CosPharm Pricing Engine service (the one connected to https://cospharm.financeflo.ai)

### Step 2: Open Shell Access

1. Click on your service name
2. In the left sidebar, click on **"Shell"** tab
3. This opens a terminal connected to your running service

### Step 3: Run Database Migrations

In the Render shell, run the following commands:

```bash
# Push the database schema (creates all tables)
pnpm db:push
```

**Expected Output:**
```
Reading config file 'drizzle.config.ts'
6 tables
customers 11 columns 0 indexes 0 fks
orderItems 11 columns 0 indexes 0 fks
orders 11 columns 0 indexes 0 fks
pricingAudit 9 columns 0 indexes 0 fks
products 10 columns 0 indexes 0 fks
users 7 columns 0 indexes 0 fks
✅ Migrations applied successfully
```

### Step 4: Seed Sample Data

After migrations complete successfully, populate the database with sample data:

```bash
# Populate database with sample products and customers
pnpm seed:populate
```

**Expected Output:**
```
🌱 Seeding database...
✅ Created 10 sample products
✅ Created 5 sample customers
✅ Database seeded successfully!
```

### Step 5: Verify the Application

1. Go to https://cospharm.financeflo.ai/products
2. You should now see the list of products
3. Navigate to /customers to see customers
4. Try the Calculator with the sample data

## Troubleshooting

### If `pnpm db:push` Fails

**Error: "Cannot find module 'drizzle-kit'"**

Solution:
```bash
pnpm install
pnpm db:push
```

**Error: "DATABASE_URL is not defined"**

Solution:
1. Go to your service's "Environment" tab in Render dashboard
2. Verify `DATABASE_URL` is set correctly
3. It should be: `postgresql://capliquify_test_db_user:CSgcCKzGdnh5PKok489sgcqaMH3eNsEH@dpg-d3r4aa7diees73apt8ng-a.frankfurt-postgres.render.com/capliquify_test_db`
4. After adding/updating, redeploy the service

**Error: "Connection timeout"**

Solution:
1. Check that your PostgreSQL database is running
2. Verify the database credentials are correct
3. Ensure the database is in the same region as your service (Frankfurt)

### If `pnpm seed:populate` Fails

**Error: "Command not found"**

The seed script might not exist yet. You can manually create sample data using SQL:

```sql
-- Run this in Render's PostgreSQL database shell
INSERT INTO products (id, name, barcode, "basePrice", "productDiscount", "bonusPattern", category, active)
VALUES 
  ('prod_001', 'Aspirin 100mg', '12345', 10.00, 5.0, '10+1', 'Analgesics', 'yes'),
  ('prod_002', 'Paracetamol 500mg', '12346', 8.50, 3.0, '20+2', 'Analgesics', 'yes'),
  ('prod_003', 'Ibuprofen 200mg', '12347', 12.00, 7.5, '15+1', 'Anti-inflammatory', 'yes');

INSERT INTO customers (id, name, email, phone, "logFeeDiscount", "customerType", "creditLimit", "currentBalance", active)
VALUES
  ('cust_001', 'Pharmacy One', 'contact@pharmacy1.com', '+44 20 1234 5678', 2.5, 'Retail', 50000.00, 0.00, 'yes'),
  ('cust_002', 'Health Plus', 'info@healthplus.com', '+44 20 8765 4321', 3.0, 'Wholesale', 100000.00, 0.00, 'yes');
```

## Alternative: Run Migrations Locally (Advanced)

If you have direct access to the database from your local machine:

1. **Install PostgreSQL client tools**
   ```bash
   # On macOS
   brew install postgresql
   
   # On Ubuntu/Debian
   sudo apt-get install postgresql-client
   ```

2. **Set DATABASE_URL locally**
   ```bash
   export DATABASE_URL="postgresql://capliquify_test_db_user:CSgcCKzGdnh5PKok489sgcqaMH3eNsEH@dpg-d3r4aa7diees73apt8ng-a.frankfurt-postgres.render.com/capliquify_test_db?sslmode=require"
   ```

3. **Run migrations**
   ```bash
   cd /path/to/cospharm-pricing-engine
   pnpm db:push
   pnpm seed:populate
   ```

## Verification Checklist

After running migrations, verify:

- [ ] https://cospharm.financeflo.ai/products shows products list
- [ ] https://cospharm.financeflo.ai/customers shows customers list
- [ ] https://cospharm.financeflo.ai/calculator allows selecting products and customers
- [ ] https://cospharm.financeflo.ai/reports shows pricing audit trail
- [ ] No database connection errors in browser console

## Database Schema Overview

The migrations will create these tables:

| Table | Purpose | Key Columns |
|-------|---------|-------------|
| `products` | Pharmaceutical products catalog | name, barcode, basePrice, productDiscount |
| `customers` | Customer accounts | name, email, logFeeDiscount, customerType |
| `pricingAudit` | Calculation history | productId, customerId, finalPrice |
| `orders` | Order records | customerId, totalAmount, status |
| `orderItems` | Order line items | orderId, productId, quantity, price |
| `users` | System users | id, name, email |

## Need Help?

If you encounter issues:

1. Check Render service logs for detailed error messages
2. Verify all environment variables are set correctly
3. Ensure PostgreSQL database is running and accessible
4. Contact Render support if database connection issues persist

## Production Best Practices

Once migrations are successful:

1. **Backup the database regularly**
   - Use Render's automated backup feature
   - Export data periodically

2. **Monitor database performance**
   - Check connection pool usage
   - Monitor query performance

3. **Keep migrations in version control**
   - All schema changes should be tracked
   - Test migrations in staging first

4. **Document any manual changes**
   - If you run SQL manually, document it
   - Update migration files accordingly

