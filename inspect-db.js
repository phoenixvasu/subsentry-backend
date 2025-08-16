import { getPool } from "./src/config/db.js";

async function inspectDatabase() {
  try {
    console.log("🔍 Inspecting SubSentry Database Schema...\n");

    const pool = getPool();
    const client = await pool.connect();

    try {
      // Check table structure
      console.log("📋 Table Structure:");
      const tableInfo = await client.query(`
        SELECT table_name, column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        ORDER BY table_name, ordinal_position
      `);

      tableInfo.rows.forEach((row) => {
        console.log(
          `   ${row.table_name}.${row.column_name}: ${row.data_type} ${
            row.is_nullable === "NO" ? "NOT NULL" : "NULL"
          }`
        );
      });

      console.log("\n🔒 Constraints:");
      const constraints = await client.query(`
        SELECT 
          tc.table_name, 
          tc.constraint_name, 
          tc.constraint_type,
          cc.check_clause
        FROM information_schema.table_constraints tc
        LEFT JOIN information_schema.check_constraints cc ON tc.constraint_name = cc.constraint_name
        WHERE tc.table_schema = 'public'
        ORDER BY tc.table_name, tc.constraint_name
      `);

      constraints.rows.forEach((row) => {
        if (row.constraint_type === "CHECK") {
          console.log(
            `   ${row.table_name}.${row.constraint_name}: ${row.check_clause}`
          );
        } else {
          console.log(
            `   ${row.table_name}.${row.constraint_name}: ${row.constraint_type}`
          );
        }
      });

      // Check specific billing_cycle constraint
      console.log("\n🎯 Billing Cycle Constraint Details:");
      const billingConstraint = await client.query(`
        SELECT 
          cc.constraint_name,
          cc.check_clause
        FROM information_schema.check_constraints cc
        WHERE cc.constraint_name = 'subscriptions_billing_cycle_check'
      `);

      if (billingConstraint.rows.length > 0) {
        console.log(
          `   Constraint: ${billingConstraint.rows[0].constraint_name}`
        );
        console.log(`   Check: ${billingConstraint.rows[0].check_clause}`);
      } else {
        console.log("   No billing_cycle constraint found");
      }

      // Check existing data
      console.log("\n📊 Existing Data:");
      const userCount = await client.query(
        "SELECT COUNT(*) as count FROM users"
      );
      const categoryCount = await client.query(
        "SELECT COUNT(*) as count FROM categories"
      );
      const subscriptionCount = await client.query(
        "SELECT COUNT(*) as count FROM subscriptions"
      );

      console.log(`   Users: ${userCount.rows[0].count}`);
      console.log(`   Categories: ${categoryCount.rows[0].count}`);
      console.log(`   Subscriptions: ${subscriptionCount.rows[0].count}`);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("❌ Database inspection failed:", error.message);
  }
}

inspectDatabase();
