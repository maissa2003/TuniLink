const axios = require('axios');

async function test() {
  try {
    const res = await axios.get('http://localhost:8081/api/leave-requests/all');
    console.log("All Leave Requests:", JSON.stringify(res.data, null, 2));
  } catch (e) {
    console.log("Error:", e.message);
    if (e.response) {
      console.log("Response data:", e.response.data);
    }
  }
}

test();
