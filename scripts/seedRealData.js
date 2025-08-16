import { getPool } from "../src/config/db.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const pool = getPool();

async function seedRealData() {
  const client = await pool.connect();

  try {
    console.log(
      "🌱 Starting to seed real-world Indian data for existing user vasu2108..."
    );

    // 1. Find or create user vasu2108
    console.log("👤 Finding or creating user vasu2108...");
    let userResult = await client.query(
      "SELECT id FROM users WHERE username = $1",
      ["vasu2108"]
    );

    let userId;
    if (userResult.rows.length === 0) {
      console.log("👤 User not found, creating new user...");
      const hashedPassword = await bcrypt.hash("vasu1234", 10);
      const newUserResult = await client.query(
        "INSERT INTO users (username, password_hash, created_at) VALUES ($1, $2, NOW()) RETURNING id",
        ["vasu2108", hashedPassword]
      );
      userId = newUserResult.rows[0].id;
      console.log(`✅ Created new user with ID: ${userId}`);
    } else {
      userId = userResult.rows[0].id;
      console.log(`✅ Found existing user with ID: ${userId}`);
    }

    // Check if user already has categories/subscriptions
    const existingCategories = await client.query(
      "SELECT COUNT(*) FROM categories WHERE user_id = $1",
      [userId]
    );

    const existingSubscriptions = await client.query(
      "SELECT COUNT(*) FROM subscriptions WHERE user_id = $1",
      [userId]
    );

    if (
      existingCategories.rows[0].count > 0 ||
      existingSubscriptions.rows[0].count > 0
    ) {
      console.log("⚠️  User already has data. Clearing existing data first...");

      // Clear existing data
      await client.query("DELETE FROM subscriptions WHERE user_id = $1", [
        userId,
      ]);
      await client.query("DELETE FROM categories WHERE user_id = $1", [userId]);

      console.log("✅ Existing data cleared");
    }

    // 2. Create realistic Indian categories
    console.log("🏷️ Creating realistic Indian categories...");
    const categories = [
      {
        name: "Streaming & Entertainment",
        description: "Video and music streaming platforms popular in India",
      },
      {
        name: "Software & Development",
        description: "Productivity and development software tools",
      },
      {
        name: "Cloud & Storage",
        description: "Cloud storage and hosting services",
      },
      {
        name: "Gaming",
        description: "Gaming subscriptions and services",
      },
      {
        name: "Food & Groceries",
        description: "Food delivery and grocery services",
      },
      {
        name: "Learning & Education",
        description: "Educational courses and skill development platforms",
      },
      {
        name: "Fitness & Wellness",
        description: "Health, fitness, and wellness apps",
      },
      {
        name: "Shopping & E-commerce",
        description: "Online shopping and membership services",
      },
      {
        name: "Transportation",
        description: "Ride-sharing and transportation services",
      },
      {
        name: "Finance & Investment",
        description: "Financial services and investment platforms",
      },
    ];

    const categoryIds = {};
    for (const category of categories) {
      const result = await client.query(
        "INSERT INTO categories (user_id, name, created_at) VALUES ($1, $2, NOW()) RETURNING id, name",
        [userId, category.name]
      );
      categoryIds[category.name] = result.rows[0].id;
      console.log(`✅ Category created: ${category.name}`);
    }

    // 3. Create realistic Indian subscriptions with varied billing cycles and costs
    console.log("📱 Creating realistic Indian subscriptions...");

    const subscriptions = [
      // Streaming & Entertainment
      {
        service_name: "Netflix Premium",
        category: "Streaming & Entertainment",
        cost: 649.0,
        billing_cycle: "Monthly",
        auto_renews: true,
        start_date: "2023-01-15",
        description: "4K streaming with 4 screens",
      },
      {
        service_name: "Amazon Prime",
        category: "Streaming & Entertainment",
        cost: 1499.0,
        billing_cycle: "Yearly",
        auto_renews: true,
        start_date: "2023-01-01",
        description: "Prime Video, Music, Free Delivery",
      },
      {
        service_name: "Disney+ Hotstar Premium",
        category: "Streaming & Entertainment",
        cost: 1499.0,
        billing_cycle: "Yearly",
        auto_renews: true,
        start_date: "2023-03-10",
        description: "Disney, Marvel, Star Wars + Sports",
      },
      {
        service_name: "Spotify Premium",
        category: "Streaming & Entertainment",
        cost: 119.0,
        billing_cycle: "Monthly",
        auto_renews: true,
        start_date: "2022-08-01",
        description: "Ad-free music streaming",
      },
      {
        service_name: "YouTube Premium",
        category: "Streaming & Entertainment",
        cost: 129.0,
        billing_cycle: "Monthly",
        auto_renews: true,
        start_date: "2022-11-20",
        description: "Ad-free YouTube with background play",
      },
      {
        service_name: "SonyLIV Premium",
        category: "Streaming & Entertainment",
        cost: 999.0,
        billing_cycle: "Yearly",
        auto_renews: true,
        start_date: "2023-01-01",
        description: "Sony TV shows and movies",
      },

      // Software & Development
      {
        service_name: "Microsoft 365 Personal",
        category: "Software & Development",
        cost: 4899.0,
        billing_cycle: "Yearly",
        auto_renews: true,
        start_date: "2023-01-01",
        description: "Office apps + 1TB OneDrive",
      },
      {
        service_name: "Adobe Creative Suite",
        category: "Software & Development",
        cost: 1999.0,
        billing_cycle: "Monthly",
        auto_renews: true,
        start_date: "2022-06-01",
        description: "Photoshop, Illustrator, Premiere Pro",
      },
      {
        service_name: "JetBrains IntelliJ IDEA",
        category: "Software & Development",
        cost: 14900.0,
        billing_cycle: "Yearly",
        auto_renews: true,
        start_date: "2022-09-15",
        description: "Professional Java IDE",
      },
      {
        service_name: "Notion Personal Pro",
        category: "Software & Development",
        cost: 199.0,
        billing_cycle: "Monthly",
        auto_renews: true,
        start_date: "2022-10-01",
        description: "Note-taking and project management",
      },

      // Cloud & Storage
      {
        service_name: "Google One 2TB",
        category: "Cloud & Storage",
        cost: 1999.0,
        billing_cycle: "Yearly",
        auto_renews: true,
        start_date: "2022-07-01",
        description: "2TB cloud storage + Google Photos",
      },
      {
        service_name: "AWS EC2 t3.micro",
        category: "Cloud & Storage",
        cost: 700.0,
        billing_cycle: "Monthly",
        auto_renews: true,
        start_date: "2023-02-01",
        description: "Cloud server for personal projects",
      },
      {
        service_name: "Dropbox Plus",
        category: "Cloud & Storage",
        cost: 1199.0,
        billing_cycle: "Monthly",
        auto_renews: true,
        start_date: "2022-05-10",
        description: "2TB cloud storage with sync",
      },

      // Gaming
      {
        service_name: "Xbox Game Pass Ultimate",
        category: "Gaming",
        cost: 699.0,
        billing_cycle: "Monthly",
        auto_renews: true,
        start_date: "2022-12-01",
        description: "Hundreds of games + Xbox Live Gold",
      },
      {
        service_name: "PlayStation Plus",
        category: "Gaming",
        cost: 2999.0,
        billing_cycle: "Yearly",
        auto_renews: true,
        start_date: "2023-01-01",
        description: "Online gaming + monthly games",
      },
      {
        service_name: "Steam",
        category: "Gaming",
        cost: 0.0,
        billing_cycle: "Monthly",
        auto_renews: false,
        start_date: "2020-01-01",
        description: "Free gaming platform (no subscription)",
      },

      // Food & Groceries
      {
        service_name: "Zomato Pro",
        category: "Food & Groceries",
        cost: 299.0,
        billing_cycle: "Monthly",
        auto_renews: true,
        start_date: "2023-01-01",
        description: "Free delivery and discounts",
      },
      {
        service_name: "Swiggy One",
        category: "Food & Groceries",
        cost: 299.0,
        billing_cycle: "Monthly",
        auto_renews: true,
        start_date: "2023-01-01",
        description: "Free delivery and exclusive offers",
      },
      {
        service_name: "BigBasket Express",
        category: "Food & Groceries",
        cost: 199.0,
        billing_cycle: "Monthly",
        auto_renews: true,
        start_date: "2022-11-01",
        description: "Free delivery on groceries",
      },
      {
        service_name: "Dunzo",
        category: "Food & Groceries",
        cost: 99.0,
        billing_cycle: "Monthly",
        auto_renews: true,
        start_date: "2023-02-01",
        description: "Quick delivery service",
      },

      // Learning & Education
      {
        service_name: "Coursera Plus",
        category: "Learning & Education",
        cost: 3999.0,
        billing_cycle: "Yearly",
        auto_renews: true,
        start_date: "2023-01-01",
        description: "Access to 7000+ courses",
      },
      {
        service_name: "Udemy",
        category: "Learning & Education",
        cost: 0.0,
        billing_cycle: "Monthly",
        auto_renews: false,
        start_date: "2021-06-01",
        description: "Pay-per-course platform",
      },
      {
        service_name: "Byju's Learning App",
        category: "Learning & Education",
        cost: 999.0,
        billing_cycle: "Monthly",
        auto_renews: true,
        start_date: "2023-01-01",
        description: "Interactive learning for kids",
      },
      {
        service_name: "Unacademy Plus",
        category: "Learning & Education",
        cost: 1999.0,
        billing_cycle: "Yearly",
        auto_renews: true,
        start_date: "2022-08-01",
        description: "Competitive exam preparation",
      },

      // Fitness & Wellness
      {
        service_name: "Cult.fit",
        category: "Fitness & Wellness",
        cost: 999.0,
        billing_cycle: "Monthly",
        auto_renews: true,
        start_date: "2022-09-01",
        description: "Fitness classes and workouts",
      },
      {
        service_name: "HealthifyMe Premium",
        category: "Fitness & Wellness",
        cost: 299.0,
        billing_cycle: "Monthly",
        auto_renews: true,
        start_date: "2023-02-01",
        description: "Nutrition and fitness tracking",
      },
      {
        service_name: "Headspace",
        category: "Fitness & Wellness",
        cost: 999.0,
        billing_cycle: "Yearly",
        auto_renews: true,
        start_date: "2023-02-01",
        description: "Meditation and mindfulness app",
      },

      // Shopping & E-commerce
      {
        service_name: "Flipkart Plus",
        category: "Shopping & E-commerce",
        cost: 499.0,
        billing_cycle: "Yearly",
        auto_renews: true,
        start_date: "2023-01-01",
        description: "Free delivery and exclusive offers",
      },
      {
        service_name: "Myntra Insider",
        category: "Shopping & E-commerce",
        cost: 999.0,
        billing_cycle: "Yearly",
        auto_renews: true,
        start_date: "2022-11-01",
        description: "Fashion and lifestyle membership",
      },
      {
        service_name: "Nykaa Pro",
        category: "Shopping & E-commerce",
        cost: 799.0,
        billing_cycle: "Yearly",
        auto_renews: true,
        start_date: "2023-01-01",
        description: "Beauty and wellness membership",
      },

      // Transportation
      {
        service_name: "Uber Pass",
        category: "Transportation",
        cost: 199.0,
        billing_cycle: "Monthly",
        auto_renews: true,
        start_date: "2023-01-01",
        description: "Free rides and discounts",
      },
      {
        service_name: "Ola Pass",
        category: "Transportation",
        cost: 199.0,
        billing_cycle: "Monthly",
        auto_renews: true,
        start_date: "2023-01-01",
        description: "Free rides and cashback",
      },
      {
        service_name: "Rapido",
        category: "Transportation",
        cost: 99.0,
        billing_cycle: "Monthly",
        auto_renews: true,
        start_date: "2023-02-01",
        description: "Bike taxi service",
      },

      // Finance & Investment
      {
        service_name: "Zerodha Kite",
        category: "Finance & Investment",
        cost: 0.0,
        billing_cycle: "Monthly",
        auto_renews: false,
        start_date: "2021-01-01",
        description: "Free trading platform (charges per trade)",
      },
      {
        service_name: "Groww Pro",
        category: "Finance & Investment",
        cost: 299.0,
        billing_cycle: "Yearly",
        auto_renews: true,
        start_date: "2023-01-01",
        description: "Advanced investment tools",
      },
      {
        service_name: "Paytm Money",
        category: "Finance & Investment",
        cost: 0.0,
        billing_cycle: "Monthly",
        auto_renews: false,
        start_date: "2022-01-01",
        description: "Free investment platform",
      },
    ];

    // Insert subscriptions with calculated annualized costs
    for (const sub of subscriptions) {
      let annualizedCost = 0;
      switch (sub.billing_cycle) {
        case "Monthly":
          annualizedCost = sub.cost * 12;
          break;
        case "Quarterly":
          annualizedCost = sub.cost * 4;
          break;
        case "Yearly":
          annualizedCost = sub.cost;
          break;
        default:
          annualizedCost = sub.cost;
      }

      await client.query(
        `INSERT INTO subscriptions (
          user_id, service_name, category, cost, billing_cycle, 
          auto_renews, start_date, annualized_cost, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())`,
        [
          userId,
          sub.service_name,
          categoryIds[sub.category],
          sub.cost,
          sub.billing_cycle,
          sub.auto_renews,
          sub.start_date,
          annualizedCost,
        ]
      );

      console.log(
        `✅ Subscription created: ${sub.service_name} (${sub.category}) - ₹${sub.cost}/${sub.billing_cycle}`
      );
    }

    console.log("\n🎉 Real-world Indian data seeding completed successfully!");
    console.log("\n📊 Summary:");
    console.log(`   👤 User: vasu2108 (ID: ${userId})`);
    console.log(`   🏷️ Categories: ${categories.length}`);
    console.log(`   📱 Subscriptions: ${subscriptions.length}`);
    console.log("\n🔑 Login Credentials:");
    console.log("   Username: vasu2108");
    console.log("   Password: vasu1234 (existing user)");
    console.log("\n💡 Now you can:");
    console.log("   1. Login with vasu2108/vasu1234");
    console.log("   2. See realistic Indian subscription data");
    console.log("   3. Test all features with real Indian pricing");
    console.log("   4. Experience the app as a real Indian user would");
    console.log("\n🇮🇳 Indian Services Included:");
    console.log("   • Disney+ Hotstar, SonyLIV, Zee5");
    console.log("   • Zomato Pro, Swiggy One, BigBasket");
    console.log("   • Cult.fit, HealthifyMe, Byju's");
    console.log("   • Flipkart Plus, Myntra Insider, Nykaa Pro");
    console.log("   • Uber Pass, Ola Pass, Rapido");
    console.log("   • Zerodha, Groww, Paytm Money");
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run the seeding
seedRealData().catch(console.error);
