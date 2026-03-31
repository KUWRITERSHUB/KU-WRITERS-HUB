const express = require("express");
const axios = require("axios");
const app = express();

app.use(express.json());

// 🔑 YOUR SAFARICOM KEYS
const consumerKey = "gOUZezG5Exdmm4ruD2A8Imq0rj1SpYQAahUDhq9BYygTmXNi";
const consumerSecret = "Zu3jB2r3HBeXmqUxn4GdPMskwq1DaINOtnE1XLRYBCt3HAcgR8JmcG4n1AgMpOFK";
const shortCode = "174379"; // or your till if enabled
const passkey = "N/A";

async function getAccessToken() {
  const auth = Buffer.from(consumerKey + ":" + consumerSecret).toString("base64");

  const res = await axios.get(
    "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
    {
      headers: { Authorization: "Basic " + auth }
    }
  );

  return res.data.access_token;
}

app.post("/stk", async (req, res) => {
  try {
    const token = await getAccessToken();

    const timestamp = new Date().toISOString().replace(/[-T:\.Z]/g, "").slice(0,14);
    const password = Buffer.from(shortCode + passkey + timestamp).toString("base64");

    const response = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        BusinessShortCode: shortCode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: req.body.amount,
        PartyA: req.body.phone,
        PartyB: shortCode,
        PhoneNumber: req.body.phone,
        CallBackURL: "https://your-production-url.up.railway.app/callback",
        AccountReference: "UK Writers Hub",
        TransactionDesc: "Payment"
      },
      {
        headers: { Authorization: "Bearer " + token }
      }
    );

    res.json(response.data);

  } catch (err) {
    console.log(err.response?.data || err.message);
    res.send("Error");
  }
});

app.post("/callback", (req, res) => {
  console.log("M-PESA CALLBACK:", JSON.stringify(req.body));
  res.sendStatus(200);
});

app.listen(3000, () => console.log("Server running..."));
