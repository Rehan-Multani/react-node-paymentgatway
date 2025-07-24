const https = require('https');
const crypto = require('crypto');

// 🔄 Toggle mode here
const isProduction = false; // ✅ false for sandbox, true for production

// 🔐 Credentials
const config = {
  sandbox: {
    merchantId: 'TEST-M23UOER70VIZM_25072',
    merchantKey: 'YzdhODM5NTMtZGMwYS00YTgyLTlhNTctMTQ4NGJlN2RjNThj',
    host: 'api-preprod.phonepe.com',
    path: '/apis/pg-sandbox/pg/v1/pay'
  },
  production: {
    merchantId: 'SU2507201201433697692616',
    merchantKey: '667bc467-b57a-48d9-8082-c8ebc0d1b0ad',
    host: 'api.phonepe.com',
    path: '/apis/hermes/pg/v1/pay'
  }
};

// 📦 Use current mode
const mode = isProduction ? config.production : config.sandbox;

const keyIndex = 1; // Usually 1 unless told otherwise

// ✅ Payment payload
const paymentPayload = {
  merchantId: mode.merchantId,
  merchantTransactionId: 'txn_' + Date.now(),
  merchantUserId: 'user_001',
  amount: 10000, // ₹100.00
  redirectUrl: 'https://yourdomain.com/payment-status',
  redirectMode: 'POST',
  mobileNumber: '9876543210',
  paymentInstrument: {
    type: 'PAY_PAGE'
  }
};

// 🔐 Step 1: base64 encode payload
const base64Payload = Buffer.from(JSON.stringify(paymentPayload)).toString('base64');

// 🔐 Step 2: Generate checksum
const raw = base64Payload + '/pg/v1/pay' + mode.merchantKey;
const checksum = crypto.createHash('sha256').update(raw).digest('hex') + '###' + keyIndex;

// 🌐 Step 3: HTTPS request options
const options = {
  hostname: mode.host,
  path: mode.path,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-VERIFY': checksum,
    Accept: 'application/json'
  }
};

// 🚀 Step 4: Send the request
const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => (data += chunk));
  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      console.log('✅ Response:', response);
    } catch (err) {
      console.error('❌ Invalid JSON:', data);
    }
  });
});

req.on('error', (err) => {
  console.error('❌ Request Failed:', err.message);
});

const requestBody = JSON.stringify({ request: base64Payload });
req.write(requestBody);
req.end();

// Shubman Gill: I was actually confused. Good toss to lose. The way we've played in the last three Tests has been outstanding. Some crunch moments we've lost, but we've won more sessions than them. You need a bit of a break. All three Tests were intense. Looks like a good surface. Nice and hard. There's some forecast around for the four-five days. Three changes: Sai Sudharsan comes in place of Karun. Kamboj and Shardul are in as well for Akash Deep and Reddy who are injured.
// Ben Stokes: We're going to have a bowl. Decent overhead conditions for bowling. We've had a good break in between. Good chance for everyone to head back home and get the batteries recharged. Everyone left everything out on the field at Lord's. We've had three games go down to the final session, which says a lot about the quality of the teams. Typical Manchester wicket. Quite firm. Some grass. Dawson back in the team - long time since the last Test but he's gone well over the years.