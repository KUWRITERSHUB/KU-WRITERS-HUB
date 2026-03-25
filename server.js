const express = require("express");
const app = express();

app.use(express.json());

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("UK Writers Hub Backend Running ✅");
});

// PAYMENT ROUTE
app.post("/pay", (req, res) => {
  const phone = req.body.phone;

  console.log("Payment request from:", phone);

  res.json({
    message: "Payment request received",
    phone: phone
  });
});

// START SERVER
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
