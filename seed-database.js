import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './drizzle/schema.js';

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://capliquify_test_db_user:CSgcCKzGdnh5PKok489sgcqaMH3eNsEH@dpg-d3r4aa7diees73apt8ng-a/capliquify_test_db';

async function seed() {
  console.log('Connecting to database...');
  const db = drizzle(DATABASE_URL);
  
  console.log('Seeding products...');
  const products = [
    { id: '1', name: 'BIODERMA SENSIBIO H2O 500ML', basePrice: 250.00, productDiscount: 10, bonusDiscount: '1@10%', category: 'Skincare' },
    { id: '2', name: 'LA ROCHE-POSAY EFFACLAR DUO', basePrice: 320.00, productDiscount: 15, bonusDiscount: '1@15%', category: 'Skincare' },
    { id: '3', name: 'VICHY MINERAL 89', basePrice: 380.00, productDiscount: 20, bonusDiscount: '1@20%', category: 'Skincare' },
    { id: '4', name: 'CETAPHIL GENTLE CLEANSER', basePrice: 180.00, productDiscount: 10, bonusDiscount: '1@10%', category: 'Skincare' },
    { id: '5', name: 'EUCERIN AQUAPHOR', basePrice: 220.00, productDiscount: 12, bonusDiscount: '1@12%', category: 'Skincare' }
  ];
  
  for (const product of products) {
    await db.insert(schema.products).values(product).onDuplicateKeyUpdate({ set: product });
  }
  
  console.log('Seeding customers...');
  const customers = [
    { id: '1', name: 'Windhoek Pharmacy', logFeeDiscount: 5, accountType: 'Wholesaler' },
    { id: '2', name: 'Swakopmund Medical', logFeeDiscount: 7, accountType: 'Wholesaler' },
    { id: '3', name: 'Walvis Bay Chemist', logFeeDiscount: 3, accountType: 'Retail' },
    { id: '4', name: 'Oshakati Health Center', logFeeDiscount: 10, accountType: 'Wholesaler' }
  ];
  
  for (const customer of customers) {
    await db.insert(schema.customers).values(customer).onDuplicateKeyUpdate({ set: customer });
  }
  
  console.log('Database seeded successfully!');
  process.exit(0);
}

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
