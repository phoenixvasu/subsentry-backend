import fetch from "node-fetch";

async function simpleTest() {
  try {
    console.log("🧪 Simple Connectivity Test\n");

    // Test backend
    console.log("1. Testing Backend...");
    try {
      const backendResponse = await fetch("http://localhost:4000/api/");
      const backendData = await backendResponse.text();
      console.log(`   ✅ Backend: ${backendData}`);
    } catch (error) {
      console.log(`   ❌ Backend: ${error.message}`);
    }

    // Test frontend
    console.log("\n2. Testing Frontend...");
    try {
      const frontendResponse = await fetch("http://localhost:5174/");
      const frontendData = await frontendResponse.text();
      console.log(`   ✅ Frontend: ${frontendData.substring(0, 100)}...`);
    } catch (error) {
      console.log(`   ❌ Frontend: ${error.message}`);
    }

    console.log("\n✅ Test completed!");
  } catch (error) {
    console.error("❌ Test failed:", error.message);
  }
}

simpleTest();
