const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// 🔐 YOUR KEYS
const consumerKey = "gOUZezG5Exdmm4ruD2A8Imq0rj1SpYQAahUDhq9BYygTmXNi";
const consumerSecret = "Zu3jB2r3HBeXmqUxn4GdPMskwq1DaINOtnE1XLRYBCt3HAcgR8JmcG4n1AgMpOFK";
const shortCode = "174379"; // e.g 174379
const passKey = "bfb279f9aa9bdbcf158e97dd0b1d2c47c0f5d2a8c8c2f7e4a6e7d7e6c7c6c5d4";

// 🔑 GET ACCESS TOKEN
async function getAccessToken() {
  const url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";

  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");

  const res = await axios.get(url, {
    headers: {
      Authorization: `Basic ${auth}`
    }
  });

  return res.data.access_token;
}

// 💰 STK PUSH
app.post("/stk", async (req, res) => {
  try {
    const token = await getAccessToken();

    const { phone, amount } = req.body;

    const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14);
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
        CallBackURL: "https://yourdomain.com/callback",
        AccountReference: "UK HUB",
        TransactionDesc: "Payment"
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    res.json(response.data);

  } catch (err) {
    console.log(err.response?.data || err.message);
    res.json({ error: "STK Failed" });
  }
});

// 🚀 START SERVER
app.listen(3000, () => console.log("Server running..."));
