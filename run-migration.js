// Run this script to migrate the production database
// Usage: node run-migration.js

import { db } from './server/db.js';
import { sql } from 'drizzle-orm';
import fs from 'fs';

async function runMigration() {
  try {
    console.log('Running customer table migration...');
    
    const migrationSQL = fs.readFileSync('./migrate-customers.sql', 'utf8');
    const statements = migrationSQL.split(';').filter(s => s.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        console.log(`Executing: ${statement.substring(0, 50)}...`);
        await db.execute(sql.raw(statement));
      }
    }
    
    console.log('Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigration();

