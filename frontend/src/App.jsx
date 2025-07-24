import React, { useState } from "react";
import API from "./api.js";

function App() {
  const [status, setStatus] = useState("Click to Pay");

  const handlePhonePePayment = async () => {
    setStatus("Generating token...");

    try {
      // Step 1: Get Access Token
      const tokenRes = await API.get("/get-token");
      const accessToken = tokenRes.data.access_token;

      setStatus("Initiating payment...");

      // Step 2: Call /pay with access token
      const payRes = await API.post("/pay", { accessToken });

      if (payRes.data && payRes.data.redirectUrl) {
        setStatus("Redirecting to payment...");

        // ✅ Redirect user to PhonePe payment page
        window.location.href = payRes.data.redirectUrl;
      } else {
        setStatus("Payment initiation failed.");
        console.error(payRes.data);
      }
    } catch (err) {
      console.error(err);
      setStatus("Error occurred.");
    }
  };

  return (
    <div style={{ padding: 50 }}>
      <h2>PhonePe Payment Integration</h2>
      <button onClick={handlePhonePePayment}>{status}</button>
    </div>
  );
}

export default App;
