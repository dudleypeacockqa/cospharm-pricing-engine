import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { products, customers } from "../drizzle/schema";

async function seed() {
  console.log("🌱 Seeding database...");

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  const db = drizzle(pool);

  try {
    // Seed products
    console.log("📦 Creating sample products...");
    await db.insert(products).values([
      {
        id: "prod_001",
        name: "Aspirin 100mg",
        barcode: "ASP100-001",
        basePrice: "10.00",
        productDiscount: "5.0",
        bonusPattern: "10+1",
        category: "Analgesics",
        active: "yes",
      },
      {
        id: "prod_002",
        name: "Paracetamol 500mg",
        barcode: "PAR500-002",
        basePrice: "8.50",
        productDiscount: "3.0",
        bonusPattern: "20+2",
        category: "Analgesics",
        active: "yes",
      },
      {
        id: "prod_003",
        name: "Ibuprofen 200mg",
        barcode: "IBU200-003",
        basePrice: "12.00",
        productDiscount: "7.5",
        bonusPattern: "15+1",
        category: "Anti-inflammatory",
        active: "yes",
      },
      {
        id: "prod_004",
        name: "Amoxicillin 250mg",
        barcode: "AMO250-004",
        basePrice: "15.50",
        productDiscount: "10.0",
        bonusPattern: "12+1",
        category: "Antibiotics",
        active: "yes",
      },
      {
        id: "prod_005",
        name: "Omeprazole 20mg",
        barcode: "OME020-005",
        basePrice: "18.00",
        productDiscount: "8.0",
        bonusPattern: "10+1",
        category: "Gastrointestinal",
        active: "yes",
      },
      {
        id: "prod_006",
        name: "Metformin 500mg",
        barcode: "MET500-006",
        basePrice: "14.00",
        productDiscount: "6.0",
        bonusPattern: "20+2",
        category: "Diabetes",
        active: "yes",
      },
      {
        id: "prod_007",
        name: "Atorvastatin 10mg",
        barcode: "ATO010-007",
        basePrice: "22.00",
        productDiscount: "12.0",
        bonusPattern: "10+1",
        category: "Cardiovascular",
        active: "yes",
      },
      {
        id: "prod_008",
        name: "Cetirizine 10mg",
        barcode: "CET010-008",
        basePrice: "9.50",
        productDiscount: "4.0",
        bonusPattern: "15+1",
        category: "Antihistamines",
        active: "yes",
      },
      {
        id: "prod_009",
        name: "Salbutamol Inhaler",
        barcode: "SAL-INH-009",
        basePrice: "25.00",
        productDiscount: "15.0",
        bonusPattern: "6+1",
        category: "Respiratory",
        active: "yes",
      },
      {
        id: "prod_010",
        name: "Vitamin D3 1000IU",
        barcode: "VIT-D3-010",
        basePrice: "11.00",
        productDiscount: "5.0",
        bonusPattern: "20+2",
        category: "Supplements",
        active: "yes",
      },
    ]);
    console.log("✅ Created 10 sample products");

    // Seed customers
    console.log("👥 Creating sample customers...");
    await db.insert(customers).values([
      {
        id: "cust_001",
        name: "Pharmacy One",
        email: "contact@pharmacy1.com",
        phone: "+44 20 1234 5678",
        logFeeDiscount: "2.5",
        customerType: "Retail",
        creditLimit: "50000.00",
        currentBalance: "0.00",
        active: "yes",
      },
      {
        id: "cust_002",
        name: "Health Plus Pharmacy",
        email: "info@healthplus.com",
        phone: "+44 20 8765 4321",
        logFeeDiscount: "3.0",
        customerType: "Wholesale",
        creditLimit: "100000.00",
        currentBalance: "0.00",
        active: "yes",
      },
      {
        id: "cust_003",
        name: "MediCare Distributors",
        email: "orders@medicare.com",
        phone: "+44 161 555 0123",
        logFeeDiscount: "4.0",
        customerType: "Wholesale",
        creditLimit: "150000.00",
        currentBalance: "0.00",
        active: "yes",
      },
      {
        id: "cust_004",
        name: "City Pharmacy",
        email: "admin@citypharm.co.uk",
        phone: "+44 121 555 9876",
        logFeeDiscount: "2.0",
        customerType: "Retail",
        creditLimit: "30000.00",
        currentBalance: "0.00",
        active: "yes",
      },
      {
        id: "cust_005",
        name: "National Health Supplies",
        email: "procurement@nhs-supplies.com",
        phone: "+44 131 555 4567",
        logFeeDiscount: "5.0",
        customerType: "Wholesale",
        creditLimit: "200000.00",
        currentBalance: "0.00",
        active: "yes",
      },
    ]);
    console.log("✅ Created 5 sample customers");

    console.log("🎉 Database seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  } finally {
    await pool.end();
  }
}

seed()
  .then(() => {
    console.log("✅ Seed script completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Seed script failed:", error);
    process.exit(1);
  });

