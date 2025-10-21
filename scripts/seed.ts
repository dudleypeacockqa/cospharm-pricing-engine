import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { products, customers, orders, orderItems } from "../drizzle/schema";

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

    // Seed orders
    console.log("📋 Creating sample orders...");
    await db.insert(orders).values([
      {
        id: "ord_001",
        customerId: "cust_001",
        orderNumber: "ORD-2025-001",
        status: "delivered",
        totalAmount: "1250.50",
        orderDate: new Date("2025-01-15"),
        deliveryDate: new Date("2025-01-18"),
      },
      {
        id: "ord_002",
        customerId: "cust_001",
        orderNumber: "ORD-2025-045",
        status: "processing",
        totalAmount: "890.00",
        orderDate: new Date("2025-10-18"),
      },
      {
        id: "ord_003",
        customerId: "cust_002",
        orderNumber: "ORD-2025-023",
        status: "delivered",
        totalAmount: "3450.75",
        orderDate: new Date("2025-09-10"),
        deliveryDate: new Date("2025-09-15"),
      },
      {
        id: "ord_004",
        customerId: "cust_002",
        orderNumber: "ORD-2025-048",
        status: "pending",
        totalAmount: "2100.00",
        orderDate: new Date("2025-10-20"),
      },
      {
        id: "ord_005",
        customerId: "cust_003",
        orderNumber: "ORD-2025-032",
        status: "delivered",
        totalAmount: "5670.25",
        orderDate: new Date("2025-08-22"),
        deliveryDate: new Date("2025-08-25"),
      },
      {
        id: "ord_006",
        customerId: "cust_003",
        orderNumber: "ORD-2025-047",
        status: "processing",
        totalAmount: "4200.00",
        orderDate: new Date("2025-10-19"),
      },
      {
        id: "ord_007",
        customerId: "cust_004",
        orderNumber: "ORD-2025-038",
        status: "delivered",
        totalAmount: "780.50",
        orderDate: new Date("2025-09-28"),
        deliveryDate: new Date("2025-10-02"),
      },
      {
        id: "ord_008",
        customerId: "cust_005",
        orderNumber: "ORD-2025-041",
        status: "delivered",
        totalAmount: "8950.00",
        orderDate: new Date("2025-09-05"),
        deliveryDate: new Date("2025-09-10"),
      },
      {
        id: "ord_009",
        customerId: "cust_005",
        orderNumber: "ORD-2025-049",
        status: "pending",
        totalAmount: "6700.00",
        orderDate: new Date("2025-10-21"),
      },
    ]);
    console.log("✅ Created 9 sample orders");

    // Seed order items
    console.log("📦 Creating sample order items...");
    await db.insert(orderItems).values([
      // Order 1 items (cust_001)
      {
        id: "item_001",
        orderId: "ord_001",
        productId: "prod_001",
        quantity: 50,
        unitPrice: "9.50",
        discount: "7.38",
        totalPrice: "462.50",
      },
      {
        id: "item_002",
        orderId: "ord_001",
        productId: "prod_002",
        quantity: 100,
        unitPrice: "8.08",
        discount: "5.18",
        totalPrice: "808.00",
      },
      // Order 2 items (cust_001)
      {
        id: "item_003",
        orderId: "ord_002",
        productId: "prod_003",
        quantity: 75,
        unitPrice: "10.54",
        discount: "9.34",
        totalPrice: "790.50",
      },
      // Order 3 items (cust_002)
      {
        id: "item_004",
        orderId: "ord_003",
        productId: "prod_004",
        quantity: 150,
        unitPrice: "13.52",
        discount: "11.61",
        totalPrice: "2028.00",
      },
      {
        id: "item_005",
        orderId: "ord_003",
        productId: "prod_007",
        quantity: 80,
        unitPrice: "18.88",
        discount: "14.26",
        totalPrice: "1510.40",
      },
      // Order 4 items (cust_002)
      {
        id: "item_006",
        orderId: "ord_004",
        productId: "prod_006",
        quantity: 150,
        unitPrice: "12.80",
        discount: "8.06",
        totalPrice: "1920.00",
      },
      // Order 5 items (cust_003)
      {
        id: "item_007",
        orderId: "ord_005",
        productId: "prod_009",
        quantity: 200,
        unitPrice: "20.40",
        discount: "18.37",
        totalPrice: "4080.00",
      },
      {
        id: "item_008",
        orderId: "ord_005",
        productId: "prod_005",
        quantity: 100,
        unitPrice: "15.26",
        discount: "10.58",
        totalPrice: "1526.00",
      },
      // Order 6 items (cust_003)
      {
        id: "item_009",
        orderId: "ord_006",
        productId: "prod_007",
        quantity: 200,
        unitPrice: "18.48",
        discount: "14.66",
        totalPrice: "3696.00",
      },
      // Order 7 items (cust_004)
      {
        id: "item_010",
        orderId: "ord_007",
        productId: "prod_001",
        quantity: 80,
        unitPrice: "9.31",
        discount: "7.57",
        totalPrice: "744.80",
      },
      // Order 8 items (cust_005)
      {
        id: "item_011",
        orderId: "ord_008",
        productId: "prod_004",
        quantity: 300,
        unitPrice: "13.28",
        discount: "11.85",
        totalPrice: "3984.00",
      },
      {
        id: "item_012",
        orderId: "ord_008",
        productId: "prod_009",
        quantity: 200,
        unitPrice: "20.13",
        discount: "18.10",
        totalPrice: "4026.00",
      },
      // Order 9 items (cust_005)
      {
        id: "item_013",
        orderId: "ord_009",
        productId: "prod_007",
        quantity: 350,
        unitPrice: "18.30",
        discount: "14.83",
        totalPrice: "6405.00",
      },
    ]);
    console.log("✅ Created 13 sample order items");

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

