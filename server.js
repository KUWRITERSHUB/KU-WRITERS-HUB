const express = require("express");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("UK Writers Hub Backend Running ✅");
});

app.post("/pay", (req, res) => {
  const phone = req.body.phone;

  console.log("Payment request from:", phone);

  res.json({
    message: "STK Push will be triggered here",
    phone: phone
  });
});

app.listen(3000, () => console.log("Server running"));
