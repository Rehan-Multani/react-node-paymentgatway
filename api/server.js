const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
const PORT = 8000;

// Replace with your credentials
const CLIENT_ID = "SU2507201201433697692616";
const CLIENT_SECRET = "667bc467-b57a-48d9-8082-c8ebc0d1b0ad";
const CLIENT_VERSION = "1";

// 🟠 1. Get Access Token from PhonePe
app.get("/get-token", async (req, res) => {
  try {
    const response = await axios.post(
      "https://api.phonepe.com/apis/identity-manager/v1/oauth/token",
      new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        client_version: CLIENT_VERSION,
        grant_type: "client_credentials",
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    res.json({ access_token: response.data.access_token });
  } catch (error) {
    console.error("Token Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to get access token" });
  }
});

// 🟢 2. Initiate Payment with Access Token
app.post("/pay", async (req, res) => {
  const { accessToken } = req.body;

  const payload = {
    merchantOrderId: `txn_${Date.now()}`,
    amount: 1000,
    expireAfter: 1200,
    metaInfo: {
      udf1: "additional-information-1",
      udf2: "additional-information-2",
      udf3: "additional-information-3",
      udf4: "additional-information-4",
      udf5: "additional-information-5",
    },
    paymentFlow: {
      type: "PG_CHECKOUT",
      message: "Payment message used for collect requests",
      merchantUrls: {
        redirectUrl: "https://localhost:5173",
      },
    },
  };

  try {
    const response = await axios.post(
      "https://api.phonepe.com/apis/pg/checkout/v2/pay",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `O-Bearer ${accessToken}`,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Payment Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Payment failed" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
