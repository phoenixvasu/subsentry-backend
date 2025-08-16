import fetch from "node-fetch";

const BASE_URL = "http://localhost:4000/api";

async function testAPI() {
  try {
    console.log("Testing SubSentry API...\n");

    // Test root endpoint
    console.log("1. Testing root endpoint...");
    const rootResponse = await fetch(`${BASE_URL}/`);
    const rootData = await rootResponse.text();
    console.log(`   Status: ${rootResponse.status}`);
    console.log(`   Response: ${rootData}\n`);

    // Test auth endpoints
    console.log("2. Testing auth endpoints...");

    // Test registration with unique username
    const uniqueUsername = `testuser_${Date.now()}`;
    console.log(`   Testing registration with username: ${uniqueUsername}...`);
    const registerResponse = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: uniqueUsername,
        password: "testpass123",
      }),
    });
    const registerData = await registerResponse.json();
    console.log(`   Register Status: ${registerResponse.status}`);
    console.log(`   Register Response:`, registerData);

    if (registerResponse.ok) {
      // Test login
      console.log("\n   Testing login...");
      const loginResponse = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: uniqueUsername,
          password: "testpass123",
        }),
      });
      const loginData = await loginResponse.json();
      console.log(`   Login Status: ${loginResponse.status}`);
      console.log(`   Login Response:`, loginData);

      if (loginData.token) {
        console.log("\n3. Testing protected endpoints...");

        // Test categories endpoint
        console.log("   Testing categories endpoint...");
        const categoriesResponse = await fetch(`${BASE_URL}/categories`, {
          headers: {
            Authorization: `Bearer ${loginData.token}`,
            "Content-Type": "application/json",
          },
        });
        const categoriesData = await categoriesResponse.json();
        console.log(`   Categories Status: ${categoriesResponse.status}`);
        console.log(`   Categories Response:`, categoriesData);

        // Test metrics endpoint
        console.log("\n   Testing metrics endpoint...");
        const metricsResponse = await fetch(`${BASE_URL}/metrics`, {
          headers: {
            Authorization: `Bearer ${loginData.token}`,
            "Content-Type": "application/json",
          },
        });
        const metricsData = await metricsResponse.json();
        console.log(`   Metrics Status: ${metricsResponse.status}`);
        console.log(`   Metrics Response:`, metricsData);

        // Test subscriptions endpoint
        console.log("\n   Testing subscriptions endpoint...");
        const subscriptionsResponse = await fetch(`${BASE_URL}/subscriptions`, {
          headers: {
            Authorization: `Bearer ${loginData.token}`,
            "Content-Type": "application/json",
          },
        });
        const subscriptionsData = await subscriptionsResponse.json();
        console.log(`   Subscriptions Status: ${subscriptionsResponse.status}`);
        console.log(`   Subscriptions Response:`, subscriptionsData);
      }
    }

    console.log("\n✅ API testing completed successfully!");
  } catch (error) {
    console.error("❌ API testing failed:", error.message);
  }
}

testAPI();
