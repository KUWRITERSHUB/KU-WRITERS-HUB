const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// 🔐 YOUR REAL KEYS
const consumerKey = "gOUZezG5Exdmm4ruD2A8Imq0rj1SpYQAahUDhq9BYygTmXNi";
const consumerSecret = "Zu3jB2r3HBeXmqUxn4GdPMskwq1DaINOtnE1XLRYBCt3HAcgR8JmcG4n1AgMpOFK";
const shortCode = "174379";
const passKey = "foiHJaXT1enHnPiQiIrxFOHNwoxw7x3ek/Nz3tDdxsRkIe2UWpLAdN42G6siYzYZo4YjSY6JCw8Q2qcZIQfai91dwrMWFJ/7vz/WBuuKarfAHZtucoEzvqOFqzXVRGYzenDUid9yN5eRw7XHk088R4H+GRx3Wy8ZZFVKlqBULylBNOFal8ElxZl3ZQ1Kk6kNfHlXASd1IV1M3mfnkZ6i5iVlV+MzMzZ1bboGPqqSoIcuxEGvhLco76wuXBBCPWmAZcCDl4EdcOVO9UzQXfPEbMKnm+0iodV+FypJt1RFucaD3q8A0YZ37Z6AicOTpwFaluL6Iw828LaOLZBSnixqlw=="; // VERY IMPORTANT

// 🔑 GET TOKEN
async function getAccessToken() {
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");

  const res = await axios.get(
    "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
    {
      headers: { Authorization: `Basic ${auth}` }
    }
  );

  return res.data.access_token;
}

// 💰 STK PUSH
app.post("/stk", async (req, res) => {
  try {
    const token = await getAccessToken();

    const { phone, amount } = req.body;

    const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0,14);
    const password = Buffer.from(shortCode + passKey + timestamp).toString("base64");

    const response = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        BusinessShortCode: shortCode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: amount,
        PartyA: phone,
        PartyB: shortCode,
        PhoneNumber: phone,
        CallBackURL: "https://websocket-server-production-f3d4.up.railway.app/callback",
        AccountReference: "UK HUB",
        TransactionDesc: "Payment"
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    res.json(response.data);

  } catch (err) {
    console.log(err.response?.data || err.message);
    res.json({ error: err.response?.data || "STK Failed" });
  }
});

// 📩 CALLBACK (VERY IMPORTANT)
app.post("/callback", (req, res) => {
  console.log("MPESA CALLBACK:", JSON.stringify(req.body, null, 2));
  res.json({ message: "Received" });
});

// 🚀 START SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on " + PORT));
