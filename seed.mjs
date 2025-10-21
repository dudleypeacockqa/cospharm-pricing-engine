import postgres from 'postgres';

const sql = postgres('postgresql://capliquify_test_db_user:CSgcCKzGdnh5PKok489sgcqaMH3eNsEH@dpg-d3r4aa7diees73apt8ng-a.frankfurt-postgres.render.com/capliquify_test_db', { ssl: 'require' });

const products = [
  { id: 'prod-1', name: 'Acne-Aid Liquid Cleanser 100ml', barcode: 'ACNE001', basePrice: '89.00', productDiscount: '40.00', bonusPattern: '1@40%', category: 'Skincare', active: 'yes' },
  { id: 'prod-2', name: 'Acne-Aid Bar 100g', barcode: 'ACNE002', basePrice: '75.00', productDiscount: '40.00', bonusPattern: '1@40%', category: 'Skincare', active: 'yes' },
  { id: 'prod-3', name: 'Bioderma Sensibio H2O 500ml', barcode: 'BIO001', basePrice: '245.00', productDiscount: '30.00', bonusPattern: '1@30%', category: 'Skincare', active: 'yes' },
];

const customers = [
  { id: 'cust-1', code: 'CUST001', name: 'Windhoek Pharmacy', type: 'Retail', logFeeDiscount: '5.00', creditLimit: '150000.00', currentBalance: '87500.00', active: 'yes' },
  { id: 'cust-2', code: 'CUST002', name: 'Swakopmund Wholesale', type: 'Wholesale', logFeeDiscount: '7.50', creditLimit: '250000.00', currentBalance: '125000.00', active: 'yes' },
];

async function seed() {
  console.log('Seeding database...');
  
  for (const product of products) {
    await sql`INSERT INTO products ${sql(product)} ON CONFLICT (id) DO NOTHING`;
  }
  console.log(`Inserted ${products.length} products`);
  
  for (const customer of customers) {
    await sql`INSERT INTO customers ${sql(customer)} ON CONFLICT (id) DO NOTHING`;
  }
  console.log(`Inserted ${customers.length} customers`);
  
  await sql.end();
  console.log('Done!');
}

seed().catch(console.error);
