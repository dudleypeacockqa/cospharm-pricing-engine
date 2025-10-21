const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function seed() {
  try {
    await client.connect();
    console.log('Connected to database');

    const products = [
      ['prod-1', 'Acne-Aid Liquid Cleanser 100ml', 'ACNE001', '89.00', '40.00', '1@40%', 'Skincare', 'yes'],
      ['prod-2', 'Acne-Aid Bar 100g', 'ACNE002', '75.00', '40.00', '1@40%', 'Skincare', 'yes'],
      ['prod-3', 'Bioderma Sensibio H2O 500ml', 'BIO001', '245.00', '30.00', '1@30%', 'Skincare', 'yes'],
      ['prod-4', 'Cetaphil Gentle Cleanser 500ml', 'CET001', '195.00', '30.00', '1@30%', 'Skincare', 'yes'],
      ['prod-5', 'La Roche-Posay Effaclar Gel 400ml', 'LRP001', '285.00', '20.00', '1@20%', 'Skincare', 'yes']
    ];

    for (const p of products) {
      await client.query(
        'INSERT INTO products (id, name, barcode, "basePrice", "productDiscount", "bonusPattern", category, active, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW()) ON CONFLICT (id) DO NOTHING',
        p
      );
    }
    console.log('Inserted ' + products.length + ' products');

    const customers = [
      ['cust-1', 'CUST001', 'Windhoek Central Pharmacy', 'Retail', '5.00', '150000.00', '87500.00', 'yes'],
      ['cust-2', 'CUST002', 'Swakopmund Wholesale', 'Wholesale', '7.50', '250000.00', '125000.00', 'yes'],
      ['cust-3', 'CUST003', 'Walvis Bay Medical', 'Wholesale', '6.00', '200000.00', '95000.00', 'yes'],
      ['cust-4', 'CUST004', 'Oshakati Pharmacy', 'Retail', '4.50', '100000.00', '45000.00', 'yes']
    ];

    for (const c of customers) {
      await client.query(
        'INSERT INTO customers (id, code, name, type, "logFeeDiscount", "creditLimit", "currentBalance", active, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW()) ON CONFLICT (id) DO NOTHING',
        c
      );
    }
    console.log('Inserted ' + customers.length + ' customers');

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.end();
  }
}

seed();
