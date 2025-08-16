import { getPool } from "../src/config/db.js";
import fs from "fs";
import path from "path";

async function resetDatabase() {
  const pool = getPool();
  const client = await pool.connect();

  try {
    console.log("🗑️  Dropping existing tables...");

    // Drop tables in correct order (respecting foreign keys)
    await client.query("DROP TABLE IF EXISTS subscriptions CASCADE");
    await client.query("DROP TABLE IF EXISTS categories CASCADE");
    await client.query("DROP TABLE IF EXISTS users CASCADE");

    console.log("✅ Tables dropped successfully");

    // Read and execute SQL files
    const sqlDir = path.join(process.cwd(), "sql");

    // Execute migrations in order
    const migrationFiles = ["001_init.sql", "002_categories.sql"];

    for (const file of migrationFiles) {
      const filePath = path.join(sqlDir, file);
      if (fs.existsSync(filePath)) {
        console.log(`📝 Executing ${file}...`);
        const sql = fs.readFileSync(filePath, "utf8");
        await client.query(sql);
        console.log(`✅ ${file} executed successfully`);
      } else {
        console.log(`⚠️  ${file} not found, skipping...`);
      }
    }

    console.log("🎉 Database reset completed successfully!");
    console.log("📊 New schema:");
    console.log("   - users: SERIAL ID");
    console.log("   - categories: SERIAL ID");
    console.log("   - subscriptions: SERIAL ID");
  } catch (error) {
    console.error("❌ Database reset failed:", error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run the reset
resetDatabase().catch(console.error);
