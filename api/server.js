const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const https = require("https");
const crypto = require("crypto");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// 🔐 PhonePe production/sandbox config
const isProd = false;

const config = {
  merchantId: isProd ? "M23UOER70VIZM" : "TEST-M23UOER70VIZM_25072",
  merchantKey: isProd
    ? "667bc467-b57a-48d9-8082-c8ebc0d1b0ad"
    : "YzdhODM5NTMtZGMwYS00YTgyLTlhNTctMTQ4NGJlN2RjNThj",
  host: isProd ? "api.phonepe.com" : "api-preprod.phonepe.com",
  path: isProd ? "/pg/v1/pay" : "/pg/v1/pay",
};

const keyIndex = 1;

app.post("/create-payment", (req, res) => {
  const { amount, mobileNumber, redirectUrl, callbackUrl } = req.body;

  const transactionId = "TXN_" + Date.now();
  const payload = {
    merchantId: config.merchantId,
    merchantTransactionId: transactionId,
    merchantUserId: "user_001",
    amount: amount || 10000,
    redirectUrl: redirectUrl || "http://localhost:3000/payment-success",
    redirectMode: "POST",
    callbackUrl: callbackUrl || "http://localhost:3000/payment-callback",
    mobileNumber: mobileNumber || "9999999999",
    paymentInstrument: {
      type: "PAY_PAGE",
    },
  };

  const base64Payload = Buffer.from(JSON.stringify(payload)).toString("base64");
  const finalString = base64Payload + config.path + config.merchantKey;
  const checksum = crypto
    .createHash("sha256")
    .update(finalString)
    .digest("hex") + "###" + keyIndex;

  const options = {
    hostname: config.host,
    path: config.path,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-VERIFY": checksum,
      Accept: "application/json",
    },
  };

  const requestBody = JSON.stringify({ request: base64Payload });

  const paymentReq = https.request(options, (paymentRes) => {
    let responseData = "";
    paymentRes.on("data", (chunk) => (responseData += chunk));
    paymentRes.on("end", () => {
      try {
        const json = JSON.parse(responseData);
        console.log("responseData",responseData);
        if (
          json.success &&
          json.data?.instrumentResponse?.redirectInfo?.url
        ) {
          res.json({
            success: true,
            paymentUrl: json.data.instrumentResponse.redirectInfo.url,
            response: json,
          });
        } else {
          res.status(400).json({ success: false, response: json });
        }
      } catch (e) {
        res.status(500).json({ success: false, message: "Invalid JSON" });
      }
    });
  });

  paymentReq.on("error", (e) => {
    res.status(500).json({ success: false, message: "PhonePe Error", error: e });
  });

  paymentReq.write(requestBody);
  paymentReq.end();
});

const PORT = 8000;
app.listen(PORT, () => console.log(`🚀 Running on http://localhost:${PORT}`));
