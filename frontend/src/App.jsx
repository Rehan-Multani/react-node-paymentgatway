import React, { useState } from 'react';
import axios from 'axios';

const PaymentForm = () => {
  const [amount, setAmount] = useState('10');
  const [mobileNumber, setMobileNumber] = useState('6268204871');
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!amount || !mobileNumber) {
      alert("Amount aur mobile number bharna zaroori hai");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/create-payment', {
        amount: parseInt(amount) * 100,
        mobileNumber: mobileNumber,
        redirectUrl: 'http://localhost:3000/payment-success',
        callbackUrl: 'http://localhost:3000/payment-callback'
      });
      console.log("responseresponse", response);
      const { paymentUrl } = response.data;
      console.log("paymentUrl", paymentUrl);
      if (paymentUrl) {
        window.open(paymentUrl, "_self");
      } else {
        alert("Payment URL nahi mila. Error ho gaya.");
      }

    } catch (err) {
      console.error("❌ Payment Error:", err);
      alert("Payment request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', padding: 20 }}>
      <h2>💳 PhonePe Payment</h2>

      <input
        type="number"
        placeholder="Amount in ₹"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={{ width: '100%', padding: 10, marginBottom: 10 }}
      />

      <input
        type="text"
        placeholder="Mobile Number"
        value={mobileNumber}
        onChange={(e) => setMobileNumber(e.target.value)}
        style={{ width: '100%', padding: 10, marginBottom: 10 }}
      />

      <button
        onClick={handlePayment}
        disabled={loading}
        style={{ width: '100%', padding: 10, backgroundColor: 'green', color: '#fff' }}
      >
        {loading ? 'Processing...' : 'Pay Now'}
      </button>
    </div>
  );
};

export default PaymentForm;
