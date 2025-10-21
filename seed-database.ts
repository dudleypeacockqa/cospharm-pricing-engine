import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { products, customers } from './drizzle/schema';

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://capliquify_test_db_user:CSgcCKzGdnh5PKok489sgcqaMH3eNsEH@dpg-d3r4aa7diees73apt8ng-a/capliquify_test_db';

async function seed() {
  const client = postgres(DATABASE_URL, { ssl: 'require' });
  const db = drizzle(client);

  console.log('Seeding database...');

  // Seed products from Excel file
  const productsData = [
    { sku: 'ACNE001', name: 'Acne-Aid Liquid Cleanser 100ml', basePrice: '89.00', productDiscount: '40', bonusDiscount: '1@40%' },
    { sku: 'ACNE002', name: 'Acne-Aid Bar 100g', basePrice: '75.00', productDiscount: '40', bonusDiscount: '1@40%' },
    { sku: 'ACNE003', name: 'Acne-Aid Gentle Cleanser 100ml', basePrice: '95.00', productDiscount: '40', bonusDiscount: '1@40%' },
    // Add more products...
  ];

  for (const product of productsData) {
    await db.insert(products).values(product).onConflictDoNothing();
  }

  // Seed customers
  const customersData = [
    { code: 'CUST001', name: 'Windhoek Pharmacy', type: 'Retail', logFeeDiscount: '5.00', creditLimit: '150000.00', currentBalance: '87500.00' },
    { code: 'CUST002', name: 'Swakopmund Wholesale', type: 'Wholesale', logFeeDiscount: '7.50', creditLimit: '250000.00', currentBalance: '125000.00' },
  ];

  for (const customer of customersData) {
    await db.insert(customers).values(customer).onConflictDoNothing();
  }

  console.log('Database seeded successfully!');
  await client.end();
}

seed().catch(console.error);
